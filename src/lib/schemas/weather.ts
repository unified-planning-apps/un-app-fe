/**
 * src/lib/schemas/weather.ts
 * ===========================
 * Mirrors backend `src/api/routers/weather.py` Pydantic models.
 */

import { z } from 'zod'

export const WeatherCurrentSchema = z.object({
  region_id: z.string(),
  region_name: z.string(),
  horodatage: z.string(),
  temperature_c: z.number(),
  temperature_min_c: z.number(),
  temperature_max_c: z.number(),
  humidite_pct: z.number(),
  precipitations_mm: z.number(),
  vent_kmh: z.number(),
  pression_hpa: z.number(),
  couverture_nuageuse_pct: z.number(),
  indice_uv: z.number().nullable().optional(),
  description: z.string(),
  source: z.string().default('OpenWeatherMap'),
})
export type WeatherCurrent = z.infer<typeof WeatherCurrentSchema>

export const WeatherForecastDaySchema = z.object({
  date: z.string(),
  temperature_min_c: z.number(),
  temperature_max_c: z.number(),
  precipitations_mm: z.number(),
  precipitations_prob_pct: z.number(),
  humidite_moy_pct: z.number(),
  vent_max_kmh: z.number(),
  description: z.string(),
  risque_cyclone: z.boolean().default(false),
})
export type WeatherForecastDay = z.infer<typeof WeatherForecastDaySchema>

export const WeatherForecastSchema = z.object({
  region_id: z.string(),
  region_name: z.string(),
  previsions: z.array(WeatherForecastDaySchema),
  alerte_cyclone: z.boolean().default(false),
  alerte_secheresse: z.boolean().default(false),
  alerte_inondation: z.boolean().default(false),
  genere_le: z.string(),
})
export type WeatherForecast = z.infer<typeof WeatherForecastSchema>

export const WeatherHistoryPointSchema = z.object({
  date: z.string(),
  temperature_moy_c: z.number(),
  precipitations_mm: z.number(),
  humidite_moy_pct: z.number(),
  anomalie_temp: z.number().nullable().optional(),
  anomalie_pluie: z.number().nullable().optional(),
})
export type WeatherHistoryPoint = z.infer<typeof WeatherHistoryPointSchema>

export const ClimateIndexSchema = z.object({
  region_id: z.string(),
  date: z.string(),
  ndvi: z.number().nullable().optional(),
  spi: z.number().nullable().optional(),
  humidite_sol_pct: z.number().nullable().optional(),
  zones_humides_pct: z.number().nullable().optional(),
})
export type ClimateIndex = z.infer<typeof ClimateIndexSchema>

export const WeatherAnomalySchema = z.object({
  region_id: z.string(),
  type_anomalie: z.string(),
  severite: z.string(),
  debut: z.string(),
  fin_estimee: z.string().nullable().optional(),
  description: z.string(),
  impact_paludisme: z.string(),
  impact_nutrition: z.string(),
})
export type WeatherAnomaly = z.infer<typeof WeatherAnomalySchema>

export interface NationalWeatherSummaryItem {
  region_id: string
  region_name: string
  temperature_c?: number
  precipitations_mm?: number
  humidite_pct?: number
  description?: string
  erreur?: string
}

export interface NationalWeatherSummary {
  regions: NationalWeatherSummaryItem[]
  total: number
  source: string
}
