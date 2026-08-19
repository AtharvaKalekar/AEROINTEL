"""
Analytics API endpoints.
All values returned here are calculated from the real processed dataset.
If the dataset has not been loaded, endpoints return a clear 'not_ready' status.
"""
from fastapi import APIRouter, HTTPException, Query
from pathlib import Path
from app.core.config import settings
import json

router = APIRouter()

PROCESSED_DIR = settings.data_processed_dir
_ANALYTICS_CACHE_FILE = PROCESSED_DIR / "analytics_cache.json"


def _load_cache() -> dict:
    if not _ANALYTICS_CACHE_FILE.exists():
        return {}
    with open(_ANALYTICS_CACHE_FILE) as f:
        return json.load(f)


def _not_ready_response():
    return {
        "status": "not_ready",
        "message": (
            "Analytics dataset not loaded. "
            "Run the ingestion pipeline to enable analytics: "
            "python scripts/run_pipeline.py"
        ),
    }


@router.get("/overview")
async def get_overview():
    """Overall KPI summary for the Overview page."""
    cache = _load_cache()
    if not cache:
        return _not_ready_response()
    return {"status": "ok", "data": cache.get("overview", {})}


@router.get("/airports")
async def get_airports_analytics():
    """Aggregated analytics for all airports (for map and ranking)."""
    cache = _load_cache()
    if not cache:
        return _not_ready_response()
    return {"status": "ok", "data": cache.get("airports", [])}


@router.get("/airport/{code}")
async def get_airport_analytics(code: str):
    """Detailed analytics for a single airport."""
    cache = _load_cache()
    if not cache:
        return _not_ready_response()
    airports = {a["iata"]: a for a in cache.get("airports", [])}
    iata = code.upper()
    if iata not in airports:
        # Try to return not_found vs not_ready
        if cache:
            raise HTTPException(status_code=404, detail=f"Airport '{iata}' not found in processed data.")
        return _not_ready_response()
    return {"status": "ok", "data": airports[iata]}


@router.get("/weather")
async def get_weather_analytics(
    airport: str = Query(None, description="IATA code to filter by airport"),
):
    """Weather impact analytics."""
    cache = _load_cache()
    if not cache:
        return _not_ready_response()
    weather_data = cache.get("weather", {})
    if airport:
        weather_data = weather_data.get(airport.upper(), weather_data)
    return {"status": "ok", "data": weather_data}


@router.get("/trends")
async def get_trends(
    granularity: str = Query("monthly", description="'monthly' | 'weekly'"),
):
    """Delay rate and volume trends over time."""
    cache = _load_cache()
    if not cache:
        return _not_ready_response()
    return {"status": "ok", "data": cache.get(f"trends_{granularity}", [])}


@router.get("/airlines")
async def get_airline_analytics():
    """Airline performance comparison."""
    cache = _load_cache()
    if not cache:
        return _not_ready_response()
    return {"status": "ok", "data": cache.get("airlines", [])}
