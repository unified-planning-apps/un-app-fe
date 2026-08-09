/**
 * src/hooks/use-weather.ts
 */
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { weatherApi } from '#/lib/api/weather'
import { demoWeatherApi } from '#/lib/api/demo'
import { IS_DEMO } from '#/env'

const api = IS_DEMO ? demoWeatherApi : weatherApi

export function useCurrentWeather(regionId: string) {
  return useQuery({
    queryKey: queryKeys.weather.current(regionId),
    queryFn: () => api.current(regionId),
    enabled: !!regionId,
    staleTime: 30 * 60 * 1000,
  })
}

export function useWeatherForecast(regionId: string, jours = 7) {
  return useQuery({
    queryKey: queryKeys.weather.forecast(regionId, jours),
    queryFn: () => api.forecast(regionId, jours),
    enabled: !!regionId,
    staleTime: 60 * 60 * 1000,
  })
}

export function useWeatherHistory(regionId: string, dateDebut: string, dateFin: string) {
  return useQuery({
    queryKey: queryKeys.weather.history(regionId, dateDebut, dateFin),
    queryFn: () => api.history(regionId, dateDebut, dateFin),
    enabled: !!regionId && !!dateDebut && !!dateFin,
    staleTime: 24 * 60 * 60 * 1000,
  })
}

export function useClimateIndices(regionId: string, dateDebut?: string, dateFin?: string) {
  return useQuery({
    queryKey: queryKeys.weather.indices(regionId),
    queryFn: () => api.climateIndices(regionId, dateDebut, dateFin),
    enabled: !!regionId,
    staleTime: 24 * 60 * 60 * 1000,
  })
}

export function useActiveWeatherAnomalies(params?: { region_id?: string; type_anomalie?: string }) {
  return useQuery({
    queryKey: queryKeys.weather.anomalies(params?.region_id),
    queryFn: () => api.activeAnomalies(params),
    staleTime: 30 * 60 * 1000,
  })
}

export function useNationalWeatherSummary() {
  return useQuery({
    queryKey: queryKeys.weather.national,
    queryFn: () => api.nationalSummary(),
    staleTime: 60 * 60 * 1000,
  })
}
