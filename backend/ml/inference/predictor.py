"""
AeroIntel Predictor — inference pipeline.
Assembles pre-flight features → classifier → regressor → SHAP explanation.
"""
from __future__ import annotations
import joblib
import json
import numpy as np
import pandas as pd
from pathlib import Path
from datetime import date
from typing import Optional

from app.core.config import settings
from app.schemas.predict import PredictRequest, PredictResponse, ShapFactor, HistoricalContext

MODELS_DIR = settings.models_dir

# Feature display name mapping
FEATURE_DISPLAY_NAMES = {
    "sched_dep_hour": "Scheduled departure hour",
    "day_of_week": "Day of week",
    "month": "Month",
    "is_weekend": "Weekend flight",
    "distance": "Route distance (miles)",
    "hist_origin_delay_rate": "Origin airport historical delay rate",
    "hist_dest_delay_rate": "Destination airport historical delay rate",
    "hist_route_delay_rate": "Historical route delay rate",
    "hist_airline_delay_rate": "Airline historical delay rate",
    "hist_origin_avg_delay": "Origin airport average delay (min)",
    "hist_congestion_proxy": "Airport congestion index",
    "wx_precip": "Precipitation (mm)",
    "wx_wind_speed": "Wind speed (km/h)",
    "wx_temp": "Temperature (°C)",
    "wx_visibility": "Visibility (km)",
}

FEATURE_COLUMNS = list(FEATURE_DISPLAY_NAMES.keys())

# Airline codes mapped to historical delay rates (populated after training)
# These serve as fallback priors until historical stats are computed
AIRLINE_PRIOR_DELAY_RATES = {
    "AA": 0.21, "UA": 0.22, "DL": 0.18, "WN": 0.19,
    "B6": 0.24, "AS": 0.16, "NK": 0.27, "F9": 0.25,
    "G4": 0.23, "SY": 0.20, "HA": 0.15, "MX": 0.18,
}

AIRPORT_PRIOR_DELAY_RATES = {
    "ORD": 0.28, "EWR": 0.27, "JFK": 0.26, "LGA": 0.25, "SFO": 0.25,
    "BOS": 0.23, "DFW": 0.22, "ATL": 0.21, "LAX": 0.21, "MIA": 0.20,
    "PHX": 0.17, "DEN": 0.19, "SEA": 0.18, "CLT": 0.19, "IAH": 0.20,
}


class AeroIntelPredictor:
    def __init__(self):
        self._classifier = None
        self._regressor = None
        self._classifier_meta = None
        self._regressor_meta = None
        self._historical_stats: Optional[dict] = None
        self._shap_explainer = None

    def _load_models(self):
        clf_path = MODELS_DIR / "classifier_v1.pkl"
        reg_path = MODELS_DIR / "regressor_v1.pkl"
        clf_meta_path = MODELS_DIR / "classifier_v1_metrics.json"

        if not clf_path.exists():
            raise FileNotFoundError(f"Classifier model not found at {clf_path}")

        if self._classifier is None:
            self._classifier = joblib.load(clf_path)

        if reg_path.exists() and self._regressor is None:
            self._regressor = joblib.load(reg_path)

        if clf_meta_path.exists() and self._classifier_meta is None:
            with open(clf_meta_path) as f:
                self._classifier_meta = json.load(f)

        # Load historical stats for feature assembly
        stats_path = settings.data_processed_dir / "historical_stats.json"
        if stats_path.exists() and self._historical_stats is None:
            with open(stats_path) as f:
                self._historical_stats = json.load(f)

        # Load SHAP explainer
        shap_path = MODELS_DIR / "classifier_v1_shap_explainer.pkl"
        if shap_path.exists() and self._shap_explainer is None:
            self._shap_explainer = joblib.load(shap_path)

    def _assemble_features(self, req: PredictRequest) -> pd.DataFrame:
        """
        Assemble PRE-FLIGHT features only.
        No post-event data (actual delays, cancellation status) is used.
        """
        stats = self._historical_stats or {}
        origin = req.origin
        dest = req.destination
        airline = req.airline
        fd: date = req.flight_date

        route_key = f"{origin}_{dest}"

        features = {
            "sched_dep_hour": req.scheduled_departure_hour,
            "day_of_week": fd.weekday(),  # 0=Monday, 6=Sunday
            "month": fd.month,
            "is_weekend": int(fd.weekday() >= 5),
            "distance": stats.get("routes", {}).get(route_key, {}).get("distance", 1000),
            "hist_origin_delay_rate": stats.get("airports", {}).get(origin, {}).get("delay_rate",
                                        AIRPORT_PRIOR_DELAY_RATES.get(origin, 0.20)),
            "hist_dest_delay_rate": stats.get("airports", {}).get(dest, {}).get("delay_rate",
                                        AIRPORT_PRIOR_DELAY_RATES.get(dest, 0.20)),
            "hist_route_delay_rate": stats.get("routes", {}).get(route_key, {}).get("delay_rate", 0.20),
            "hist_airline_delay_rate": stats.get("airlines", {}).get(airline, {}).get("delay_rate",
                                            AIRLINE_PRIOR_DELAY_RATES.get(airline, 0.20)),
            "hist_origin_avg_delay": stats.get("airports", {}).get(origin, {}).get("avg_delay", 12.0),
            "hist_congestion_proxy": stats.get("airports", {}).get(origin, {}).get("congestion_proxy", 50.0),
            # Weather: use seasonal averages when live data not available
            "wx_precip": stats.get("weather", {}).get(origin, {}).get(str(fd.month), {}).get("avg_precip", 0.0),
            "wx_wind_speed": stats.get("weather", {}).get(origin, {}).get(str(fd.month), {}).get("avg_wind", 15.0),
            "wx_temp": stats.get("weather", {}).get(origin, {}).get(str(fd.month), {}).get("avg_temp", 15.0),
            "wx_visibility": stats.get("weather", {}).get(origin, {}).get(str(fd.month), {}).get("avg_visibility", 10.0),
        }

        return pd.DataFrame([features])[FEATURE_COLUMNS]

    def _build_shap_factors(self, feature_df: pd.DataFrame, shap_values: np.ndarray) -> list[ShapFactor]:
        factors = []
        for i, col in enumerate(FEATURE_COLUMNS):
            sv = float(shap_values[0][i])
            if abs(sv) < 0.005:  # skip negligible
                continue
            direction = "increases_risk" if sv > 0 else "decreases_risk"
            display = FEATURE_DISPLAY_NAMES.get(col, col)
            val = feature_df.iloc[0][col]
            desc = f"{display}: {val:.1f}" if isinstance(val, float) else f"{display}: {val}"
            factors.append(ShapFactor(
                feature=col,
                display_name=display,
                shap_value=round(sv, 4),
                direction=direction,
                description=desc,
            ))
        # Sort: largest absolute SHAP first
        factors.sort(key=lambda x: abs(x.shap_value), reverse=True)
        return factors[:8]  # top 8 factors

    def predict(self, req: PredictRequest) -> PredictResponse:
        self._load_models()

        feature_df = self._assemble_features(req)

        # ── Classification ────────────────────────────────────────────────
        prob = float(self._classifier.predict_proba(feature_df)[0][1])

        if prob < 0.35:
            risk_category = "LOW"
        elif prob < 0.65:
            risk_category = "MODERATE"
        else:
            risk_category = "HIGH"

        # ── Regression ────────────────────────────────────────────────────
        expected_delay: Optional[float] = None
        if self._regressor is not None and prob >= 0.35:
            raw = float(self._regressor.predict(feature_df)[0])
            expected_delay = round(max(0.0, raw), 1)

        # ── SHAP Explanation ──────────────────────────────────────────────
        shap_factors = []
        if self._shap_explainer is not None:
            try:
                import shap
                sv = self._shap_explainer.shap_values(feature_df)
                # For binary classifiers shap returns list [class0, class1]
                if isinstance(sv, list):
                    sv = sv[1]
                shap_factors = self._build_shap_factors(feature_df, sv)
            except Exception:
                pass  # Graceful degradation if SHAP fails

        # ── Historical Context ────────────────────────────────────────────
        stats = self._historical_stats or {}
        route_key = f"{req.origin}_{req.destination}"
        route_stats = stats.get("routes", {}).get(route_key, {})
        hist_context: Optional[HistoricalContext] = None
        if route_stats.get("flight_count", 0) >= 30:
            hist_context = HistoricalContext(
                similar_flights_count=route_stats["flight_count"],
                avg_delay_rate=round(route_stats.get("delay_rate", 0.0), 3),
                avg_delay_minutes=round(route_stats.get("avg_delay", 0.0), 1),
                note="Based on historical flights on this route.",
            )

        return PredictResponse(
            delay_probability=round(prob, 3),
            risk_category=risk_category,
            expected_delay_minutes=expected_delay,
            classifier_model=self._classifier_meta.get("model_name", "classifier_v1") if self._classifier_meta else "classifier_v1",
            regressor_model="regressor_v1" if self._regressor else None,
            shap_factors=shap_factors,
            historical_context=hist_context,
            features_used=FEATURE_COLUMNS,
        )
