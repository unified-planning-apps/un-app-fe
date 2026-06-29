/**
 * src/hooks/use-weather.ts
 * =========================
 * React-query hooks wrapping `lib/api/weather.ts`.
 */

import { useQuery } from '@tanstack/react-query'
import { weatherApi } from '#/lib/api/weather'
import { queryKeys } from './query-keys'

export function useCurrentWeather(regionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.weather.current(regionId ?? ''),
    queryFn: () => weatherApi.current(regionId as string),
    enabled: !!regionId,
    staleTime: 60 * 60 * 1000, // mirrors backend's 1h cache
  })
}

export function useWeatherForecast(regionId: string | undefined, jours = 7) {
  return useQuery({
    queryKey: queryKeys.weather.forecast(regionId ?? '', jours),
    queryFn: () => weatherApi.forecast(regionId as string, jours),
    enabled: !!regionId,
    staleTime: 60 * 60 * 1000,
  })
}

export function useWeatherHistory(regionId: string | undefined, dateDebut: string, dateFin: string) {
  return useQuery({
    queryKey: queryKeys.weather.history(regionId ?? '', dateDebut, dateFin),
    queryFn: () => weatherApi.history(regionId as string, dateDebut, dateFin),
    enabled: !!regionId,
  })
}

export function useClimateIndices(regionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.weather.indices(regionId ?? ''),
    queryFn: () => weatherApi.climateIndices(regionId as string),
    enabled: !!regionId,
    staleTime: 12 * 60 * 60 * 1000,
  })
}

export function useActiveWeatherAnomalies(regionId?: string) {
  return useQuery({
    queryKey: queryKeys.weather.anomalies(regionId),
    queryFn: () => weatherApi.activeAnomalies({ region_id: regionId }),
    staleTime: 30 * 60 * 1000,
  })
}

export function useNationalWeatherSummary() {
  return useQuery({
    queryKey: queryKeys.weather.national,
    queryFn: () => weatherApi.nationalSummary(),
    staleTime: 60 * 60 * 1000,
  })
}
