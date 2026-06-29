/**
 * src/lib/api/weather.ts
 * =======================
 * Calls backend `/meteo/*` (src/api/routers/weather.py).
 */

import { apiClient } from './client'
import type {
  ClimateIndex,
  NationalWeatherSummary,
  WeatherAnomaly,
  WeatherCurrent,
  WeatherForecast,
  WeatherHistoryPoint,
} from '#/lib/schemas/weather'

export const weatherApi = {
  current: (regionId: string) =>
    apiClient.get<WeatherCurrent>(`/meteo/actuel/${regionId}`),

  forecast: (regionId: string, jours = 7) =>
    apiClient.get<WeatherForecast>(`/meteo/previsions/${regionId}`, { params: { jours } }),

  history: (regionId: string, dateDebut: string, dateFin: string, params?: { limit?: number; offset?: number }) =>
    apiClient.get<WeatherHistoryPoint[]>(`/meteo/historique/${regionId}`, {
      params: { date_debut: dateDebut, date_fin: dateFin, ...params },
    }),

  climateIndices: (regionId: string, dateDebut?: string, dateFin?: string) =>
    apiClient.get<ClimateIndex[]>(`/meteo/indices/${regionId}`, {
      params: { date_debut: dateDebut, date_fin: dateFin },
    }),

  activeAnomalies: (params?: { region_id?: string; type_anomalie?: string }) =>
    apiClient.get<WeatherAnomaly[]>('/meteo/anomalies', { params }),

  nationalSummary: () =>
    apiClient.get<NationalWeatherSummary>('/meteo/resume/national'),
}
