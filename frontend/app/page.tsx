'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import { PlaneTakeoff, BarChart3, CloudRain, MapPin, FlaskConical, Database, ArrowRight, Sparkles, ShieldCheck, Cpu } from 'lucide-react';

// Dynamic import for Photorealistic 3D Commercial Airplane Scene (client-side render only)
const RealisticAirplane3D = dynamic(() => import('@/app/components/RealisticAirplane3D'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e0eeff' }}>
      <div style={{ fontSize: 14, color: '#2563eb', fontFamily: 'Space Grotesk', fontWeight: 600 }}>
        Loading High-Altitude Commercial Airliner Scene...
      </div>
    </div>
  ),
});

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <span
        style={{
          fontFamily: 'Space Grotesk',
          fontSize: '1.8rem',
          fontWeight: 700,
          color: '#0f172a',
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </span>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
        {label}
      </span>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 450], [1, 0]);
  const heroY = useTransform(scrollY, [0, 450], [0, -50]);

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #e0eeff 0%, #f0f7ff 35%, #ffffff 100%)',
        minHeight: '100vh',
        color: '#0f172a',
        fontFamily: 'var(--font-body)',
        overflowX: 'hidden',
      }}
    >
      {/* ── Glassmorphism Edge-to-Edge Header ──────────────────────────── */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 68,
          zIndex: 50,
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          padding: '0 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 10px 30px -10px rgba(15, 23, 42, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 34,
              height: 34,
              background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
              borderRadius: 9,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
            }}
          >
            <span style={{ color: 'white', fontSize: 15, fontWeight: 700 }}>✈</span>
          </div>
          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 17, color: '#0f172a', letterSpacing: '-0.01em' }}>
              AEROINTEL
            </div>
            <div style={{ fontSize: 9, color: '#64748b', letterSpacing: '0.06em', fontWeight: 600 }}>
              AVIATION INTELLIGENCE
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-secondary"
            style={{ padding: '9px 20px', fontSize: 13, borderRadius: 100 }}
          >
            Aviation Data Platform
          </button>
          <button
            onClick={() => router.push('/dashboard/predictor')}
            className="btn-primary"
            style={{ padding: '9px 22px', fontSize: 13, borderRadius: 100 }}
          >
            Use Flight Predictor <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* ── Full-Screen Hero Section with Photorealistic 3D Sky Plane ───── */}
      <section
        style={{
          width: '100vw',
          height: '100vh',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Full-Screen Photorealistic Commercial Airplane Canvas */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
          }}
        >
          <RealisticAirplane3D />
        </div>

        {/* Hero Overlay Text */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY, position: 'relative', zIndex: 10, pointerEvents: 'none' }}
          className="flex flex-col items-center text-center"
        >
          {/* Status Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 20px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(37, 99, 235, 0.25)',
              borderRadius: 100,
              marginBottom: 24,
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)',
            }}
          >
            <div className="status-dot" style={{ width: 6, height: 6, background: '#2563eb' }} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#1e40af',
                textTransform: 'uppercase',
              }}
            >
              US Domestic Aviation ML Platform
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="text-hero"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            style={{ maxWidth: 980, padding: '0 24px', textShadow: '0 4px 30px rgba(255,255,255,0.9)' }}
          >
            Predict the Delay.
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #1d4ed8, #0284c7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Understand the Skies.
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            style={{
              fontSize: 18,
              color: '#334155',
              maxWidth: 620,
              lineHeight: 1.65,
              marginTop: 20,
              padding: '0 24px',
              fontWeight: 500,
              textShadow: '0 2px 12px rgba(255,255,255,0.95)',
            }}
          >
            A high-sky ML platform using historical BTS flight records and Open-Meteo weather data to predict flight delay risks and explain disruption causes.
          </motion.p>

          {/* Interactive Dual CTAs */}
          <motion.div
            style={{ marginTop: 36, pointerEvents: 'auto', display: 'flex', gap: 16 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <button
              onClick={() => router.push('/dashboard/predictor')}
              className="btn-primary"
              style={{ padding: '14px 36px', fontSize: 15, letterSpacing: '0.02em', borderRadius: 12 }}
            >
              <PlaneTakeoff size={18} />
              USE FLIGHT PREDICTOR
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-secondary"
              style={{ padding: '14px 36px', fontSize: 15, borderRadius: 12 }}
            >
              <BarChart3 size={18} />
              EXPLORE AVIATION DATA
            </button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.8 }}
            style={{
              display: 'flex',
              gap: 44,
              marginTop: 48,
              padding: '18px 40px',
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(203, 213, 225, 0.8)',
              borderRadius: 20,
              boxShadow: '0 20px 45px -15px rgba(15, 23, 42, 0.08)',
              pointerEvents: 'auto',
            }}
          >
            <StatBadge value="50+" label="US Airports" />
            <div style={{ width: 1, background: '#cbd5e1' }} />
            <StatBadge value="12" label="Carriers" />
            <div style={{ width: 1, background: '#cbd5e1' }} />
            <StatBadge value="Real" label="BTS Records" />
            <div style={{ width: 1, background: '#cbd5e1' }} />
            <StatBadge value="SHAP" label="Explainability" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Two Completely Separate Experiences ─────────────────────────── */}
      <section
        style={{
          padding: '110px 24px',
          maxWidth: 1280,
          margin: '0 auto',
        }}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-label" style={{ marginBottom: 12, color: '#2563eb' }}>
            System Architecture
          </p>
          <h2
            className="text-display"
            style={{ color: '#0f172a', marginBottom: 16 }}
          >
            Two Independent Portals
          </h2>
          <p style={{ color: '#475569', fontSize: 16, maxWidth: 560, margin: '0 auto' }}>
            AeroIntel keeps user-focused flight predictions completely separated from raw statistical database analytics.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 28,
            marginTop: 56,
          }}
        >
          {/* Card 1: Consumer Flight Predictor */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(239,246,255,0.8))',
              border: '1.5px solid rgba(37, 99, 235, 0.3)',
              padding: '36px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 20px 40px -15px rgba(37, 99, 235, 0.12)',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: '#2563eb',
                  padding: '4px 12px',
                  borderRadius: 100,
                  background: 'rgba(37, 99, 235, 0.12)',
                  display: 'inline-block',
                  marginBottom: 20,
                }}
              >
                EXPERIENCE 1 · USER PREDICTOR TOOL
              </div>
              <h3 className="text-headline" style={{ fontSize: '1.5rem', marginBottom: 12, color: '#0f172a' }}>
                Flight Delay Predictor
              </h3>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.65, marginBottom: 24 }}>
                A clean, distraction-free tool for travelers and airline operators to evaluate specific upcoming flights. Input origin, destination, carrier, and time to get instant ML delay probability and SHAP factor explanations.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                {[
                  { title: 'Delay Risk Classifier', desc: 'Predicts probability of delay ≥15 min (BTS standard)' },
                  { title: 'Expected Duration Estimate', desc: 'Regression model estimates expected delay minutes' },
                  { title: 'SHAP Waterfall Factors', desc: 'Displays exact positive & negative risk contributors' },
                  { title: 'Pre-Flight Feature Isolation', desc: 'Strictly zero target leakage from post-event fields' },
                ].map((item) => (
                  <div key={item.title} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
                      ✓
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => router.push('/dashboard/predictor')}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', borderRadius: 12 }}
            >
              LAUNCH PREDICTOR TOOL <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Card 2: Aviation Data Platform */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              padding: '36px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: '#64748b',
                  padding: '4px 12px',
                  borderRadius: 100,
                  background: '#f1f5f9',
                  display: 'inline-block',
                  marginBottom: 20,
                  border: '1px solid #cbd5e1',
                }}
              >
                EXPERIENCE 2 · AVIATION DATA PLATFORM
              </div>
              <h3 className="text-headline" style={{ fontSize: '1.5rem', marginBottom: 12, color: '#0f172a' }}>
                Aviation Intelligence & Data
              </h3>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.65, marginBottom: 24 }}>
                A dedicated research workspace for data scientists, airport planners, and aviation analysts to inspect historical delay patterns, airport congestion proxies, weather impacts, and ML metrics.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                {[
                  { title: 'Airport Density & Congestion', desc: '24-hour departure volume patterns & hourly heatmaps' },
                  { title: 'Meteorological Correlations', desc: 'Precipitation, wind speed, visibility & seasonal trends' },
                  { title: 'Exploratory Carrier Analytics', desc: 'Historical carrier delay rates & airport rankings' },
                  { title: 'ML Engineering Lab', desc: 'ROC-AUC, Precision, Recall, F1, MAE & SHAP metrics' },
                ].map((item) => (
                  <div key={item.title} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#f1f5f9', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
                      ✓
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', borderRadius: 12 }}
            >
              EXPLORE AVIATION DATA <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── ML Pipeline Flow Section ───────────────────────────────────── */}
      <section
        style={{
          padding: '90px 24px',
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-label" style={{ marginBottom: 12, color: '#2563eb' }}>
              Data Engineering Architecture
            </p>
            <h2 className="text-display" style={{ color: '#0f172a', marginBottom: 44 }}>
              Production ML Pipeline Architecture
            </h2>
          </motion.div>

          <motion.div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0,
              flexWrap: 'wrap',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {[
              { label: 'BTS\nFlight Data', color: '#2563eb' },
              { label: '→', color: '#94a3b8', isArrow: true },
              { label: 'Open-Meteo\nWeather', color: '#0284c7' },
              { label: '→', color: '#94a3b8', isArrow: true },
              { label: 'Feature\nEngineering', color: '#7c3aed' },
              { label: '→', color: '#94a3b8', isArrow: true },
              { label: 'XGBoost\nClassifier', color: '#2563eb' },
              { label: '+', color: '#94a3b8', isArrow: true },
              { label: 'GBT\nRegressor', color: '#0284c7' },
              { label: '→', color: '#94a3b8', isArrow: true },
              { label: 'SHAP\nExplainability', color: '#d97706' },
            ].map((node, i) =>
              node.isArrow ? (
                <span
                  key={i}
                  style={{ color: node.color, fontSize: 20, padding: '0 6px', fontWeight: 400 }}
                >
                  {node.label}
                </span>
              ) : (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    background: '#f8fafc',
                    border: `1.5px solid ${node.color}35`,
                    borderRadius: 12,
                    padding: '14px 18px',
                    textAlign: 'center',
                    margin: '6px 2px',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: node.color,
                      fontFamily: 'JetBrains Mono',
                      whiteSpace: 'pre-line',
                      lineHeight: 1.4,
                    }}
                  >
                    {node.label}
                  </div>
                </motion.div>
              )
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer
        style={{
          padding: '32px 48px',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, color: '#0f172a' }}>
          AEROINTEL
        </span>
        <p style={{ fontSize: 12, color: '#64748b' }}>
          Built on Bureau of Transportation Statistics data & Open-Meteo weather API.
          Historical analysis & probability models. Not for operational flight dispatch.
        </p>
      </footer>
    </div>
  );
}
