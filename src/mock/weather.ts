/**
 * src/mock/weather.ts
 * --------------------
 * Realistic mock data for weather endpoints (demo mode).
 * Typed against the real schemas in lib/schemas/weather.ts.
 */

import type {
  NationalWeatherSummary,
  WeatherAnomaly,
  WeatherCurrent,
  WeatherForecast,
  WeatherHistoryPoint,
} from '#/lib/schemas/weather'

// Helper: generate a date string N days from today
const d = (offset: number) => {
  const dt = new Date()
  dt.setDate(dt.getDate() + offset)
  return dt.toISOString().slice(0, 10)
}
const dPast = (offset: number) => d(-offset)

// ── Current weather per region ──────────────────────────────────────────────
const REGION_WEATHER: Record<string, WeatherCurrent> = {
  'MDG-ANA': { region_id: 'MDG-ANA', region_name: 'Analamanga', horodatage: new Date().toISOString(), temperature_c: 22, temperature_min_c: 16, temperature_max_c: 26, humidite_pct: 68, precipitations_mm: 4.2, vent_kmh: 14, pression_hpa: 1015, couverture_nuageuse_pct: 45, indice_uv: 6, description: 'Partiellement nuageux', source: 'OpenWeatherMap' },
  'MDG-VAK': { region_id: 'MDG-VAK', region_name: 'Vakinankaratra', horodatage: new Date().toISOString(), temperature_c: 20, temperature_min_c: 13, temperature_max_c: 24, humidite_pct: 72, precipitations_mm: 6.1, vent_kmh: 18, pression_hpa: 1012, couverture_nuageuse_pct: 60, indice_uv: 5, description: 'Nuageux', source: 'OpenWeatherMap' },
  'MDG-SOF': { region_id: 'MDG-SOF', region_name: 'Sofia', horodatage: new Date().toISOString(), temperature_c: 30, temperature_min_c: 22, temperature_max_c: 34, humidite_pct: 80, precipitations_mm: 12.3, vent_kmh: 9, pression_hpa: 1010, couverture_nuageuse_pct: 75, indice_uv: 8, description: 'Pluies modérées', source: 'OpenWeatherMap' },
  'MDG-BOE': { region_id: 'MDG-BOE', region_name: 'Boeny', horodatage: new Date().toISOString(), temperature_c: 32, temperature_min_c: 24, temperature_max_c: 37, humidite_pct: 76, precipitations_mm: 0, vent_kmh: 22, pression_hpa: 1008, couverture_nuageuse_pct: 20, indice_uv: 10, description: 'Ensoleillé', source: 'OpenWeatherMap' },
  'MDG-DIA': { region_id: 'MDG-DIA', region_name: 'Diana', horodatage: new Date().toISOString(), temperature_c: 28, temperature_min_c: 21, temperature_max_c: 32, humidite_pct: 82, precipitations_mm: 8.7, vent_kmh: 16, pression_hpa: 1011, couverture_nuageuse_pct: 65, indice_uv: 7, description: 'Averses', source: 'OpenWeatherMap' },
  'MDG-ASO': { region_id: 'MDG-ASO', region_name: 'Atsimo-Andrefana', horodatage: new Date().toISOString(), temperature_c: 27, temperature_min_c: 19, temperature_max_c: 33, humidite_pct: 55, precipitations_mm: 0, vent_kmh: 28, pression_hpa: 1016, couverture_nuageuse_pct: 15, indice_uv: 9, description: 'Très ensoleillé', source: 'OpenWeatherMap' },
}

const DEFAULT_CURRENT: WeatherCurrent = {
  region_id: '', region_name: '', horodatage: new Date().toISOString(),
  temperature_c: 26, temperature_min_c: 19, temperature_max_c: 30,
  humidite_pct: 70, precipitations_mm: 3, vent_kmh: 12,
  pression_hpa: 1013, couverture_nuageuse_pct: 40, indice_uv: 7,
  description: 'Partiellement nuageux', source: 'OpenWeatherMap (demo)',
}

export function getMockCurrentWeather(regionId: string): WeatherCurrent {
  return { ...DEFAULT_CURRENT, ...REGION_WEATHER[regionId], region_id: regionId }
}

// ── 7-day forecast ──────────────────────────────────────────────────────────
const FORECAST_PROFILES: Record<string, { min: number; max: number; rain: number; prob: number }[]> = {
  'MDG-SOF': [
    { min: 22, max: 32, rain: 14, prob: 75 },
    { min: 23, max: 33, rain: 8,  prob: 60 },
    { min: 21, max: 30, rain: 20, prob: 85 },
    { min: 22, max: 31, rain: 5,  prob: 40 },
    { min: 24, max: 34, rain: 0,  prob: 10 },
    { min: 23, max: 33, rain: 3,  prob: 30 },
    { min: 22, max: 32, rain: 11, prob: 65 },
  ],
  'MDG-BOE': [
    { min: 24, max: 37, rain: 0, prob: 5  },
    { min: 25, max: 38, rain: 0, prob: 5  },
    { min: 23, max: 36, rain: 2, prob: 20 },
    { min: 24, max: 37, rain: 0, prob: 5  },
    { min: 26, max: 39, rain: 0, prob: 5  },
    { min: 25, max: 38, rain: 1, prob: 15 },
    { min: 24, max: 37, rain: 0, prob: 5  },
  ],
}

const DEFAULT_FORECAST = [
  { min: 17, max: 26, rain: 2,  prob: 30 },
  { min: 18, max: 27, rain: 0,  prob: 10 },
  { min: 16, max: 25, rain: 8,  prob: 60 },
  { min: 17, max: 26, rain: 4,  prob: 40 },
  { min: 19, max: 28, rain: 0,  prob: 10 },
  { min: 18, max: 27, rain: 1,  prob: 20 },
  { min: 17, max: 26, rain: 6,  prob: 50 },
]

export function getMockForecast(regionId: string, jours: number): WeatherForecast {
  const profile = FORECAST_PROFILES[regionId] ?? DEFAULT_FORECAST
  const previsions = Array.from({ length: jours }, (_, i) => {
    const p = profile[i % profile.length]
    return {
      date: d(i + 1),
      temperature_min_c: p.min,
      temperature_max_c: p.max,
      precipitations_mm: p.rain,
      precipitations_prob_pct: p.prob,
      humidite_moy_pct: 60 + Math.round(p.rain * 1.2),
      vent_max_kmh: 12 + Math.floor(Math.random() * 10),
      description: p.prob > 60 ? 'Averses probables' : p.prob > 30 ? 'Nuageux' : 'Ensoleillé',
      risque_cyclone: false,
    }
  })
  return {
    region_id: regionId,
    region_name: REGION_WEATHER[regionId]?.region_name ?? regionId,
    previsions,
    alerte_cyclone: false,
    alerte_secheresse: regionId === 'MDG-ASO',
    alerte_inondation: regionId === 'MDG-SOF',
    genere_le: new Date().toISOString(),
  }
}

// ── Historical weather (30 days) ────────────────────────────────────────────
export function getMockWeatherHistory(regionId: string, _debut: string, _fin: string): WeatherHistoryPoint[] {
  const base = regionId === 'MDG-SOF' ? { t: 29, r: 12 } : { t: 22, r: 4 }
  return Array.from({ length: 30 }, (_, i) => ({
    date: dPast(29 - i),
    temperature_moy_c: base.t + (Math.sin(i / 5) * 3),
    precipitations_mm: Math.max(0, base.r + (Math.cos(i / 4) * base.r * 0.8)),
    humidite_moy_pct: 65 + Math.round(Math.sin(i / 6) * 12),
    anomalie_temp: (Math.sin(i / 7) * 2).toFixed(1) as unknown as number,
    anomalie_pluie: (Math.cos(i / 5) * 5).toFixed(1) as unknown as number,
  }))
}

// ── Active anomalies ─────────────────────────────────────────────────────────
export const MOCK_ANOMALIES: WeatherAnomaly[] = [
  { region_id: 'MDG-SOF', type_anomalie: 'inondation', severite: 'moderee', debut: dPast(5), fin_estimee: d(3), description: 'Débordement du fleuve Sofia suite aux pluies exceptionnelles', impact_paludisme: 'Risque gites larvaires accru +40%', impact_nutrition: 'Accès aux marchés perturbé' },
  { region_id: 'MDG-ASO', type_anomalie: 'secheresse', severite: 'severe', debut: dPast(22), fin_estimee: d(15), description: 'Déficit pluviométrique de 65% sur les 3 dernières semaines', impact_paludisme: 'Faible (vecteurs limités)', impact_nutrition: 'Pâturages dégradés, bétail menacé' },
]

// ── National summary ─────────────────────────────────────────────────────────
import { REGIONS } from '#/lib/regions'

export const MOCK_NATIONAL_WEATHER: NationalWeatherSummary = {
  total: REGIONS.length,
  source: 'OpenWeatherMap (demo)',
  regions: REGIONS.map((r) => {
    const w = REGION_WEATHER[r.id]
    return w
      ? { region_id: r.id, region_name: r.name, temperature_c: w.temperature_c, precipitations_mm: w.precipitations_mm, humidite_pct: w.humidite_pct, description: w.description }
      : { region_id: r.id, region_name: r.name, temperature_c: 24 + Math.round(Math.sin(r.latitude) * 5), precipitations_mm: 3, humidite_pct: 65 }
  }),
}
