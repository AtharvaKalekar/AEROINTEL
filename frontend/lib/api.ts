/**
 * AeroIntel API client
 * All backend requests go through this module.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error?.detail?.message ?? error?.message ?? `Request failed: ${res.status}`);
  }

  return res.json();
}

// ── Health ───────────────────────────────────────────────────────────────
export const api = {
  health: () => request<{ status: string; timestamp: string }>('/api/health'),

  // ── Metadata ─────────────────────────────────────────────────────────
  airports: () =>
    request<{ airports: import('./types').Airport[]; count: number }>('/api/metadata/airports'),

  airlines: () =>
    request<{ airlines: import('./types').Airline[]; count: number }>('/api/metadata/airlines'),

  // ── Prediction ───────────────────────────────────────────────────────
  predict: (body: import('./types').PredictRequest) =>
    request<import('./types').PredictResponse>('/api/predict', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // ── Analytics ────────────────────────────────────────────────────────
  overview: () => request<any>('/api/analytics/overview'),
  airportsAnalytics: () => request<any>('/api/analytics/airports'),
  airportDetail: (iata: string) => request<any>(`/api/analytics/airport/${iata}`),
  weatherAnalytics: (airport?: string) =>
    request<any>(`/api/analytics/weather${airport ? `?airport=${airport}` : ''}`),
  trends: (granularity: 'monthly' | 'weekly' = 'monthly') =>
    request<any>(`/api/analytics/trends?granularity=${granularity}`),
  airlinesAnalytics: () => request<any>('/api/analytics/airlines'),

  // ── ML Models ────────────────────────────────────────────────────────
  models: () => request<any>('/api/models'),
  modelMetrics: (id: string) => request<any>(`/api/models/${id}/metrics`),
  modelImportance: (id: string) => request<any>(`/api/models/${id}/importance`),
};
