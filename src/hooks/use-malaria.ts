/**
 * src/hooks/use-malaria.ts
 * =========================
 * React-query hooks wrapping `lib/api/malaria.ts`.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { malariaApi } from '#/lib/api/malaria'
import { queryKeys } from './query-keys'

export function useMalariaCases(
  regionId: string | undefined,
  params?: { date_debut?: string; date_fin?: string; district?: string },
) {
  return useQuery({
    queryKey: [...queryKeys.malaria.cas(regionId ?? ''), params],
    queryFn: () => malariaApi.cas(regionId as string, params),
    enabled: !!regionId,
  })
}

export function useMalariaRisk(regionId: string | undefined, horizonJours = 14) {
  return useQuery({
    queryKey: queryKeys.malaria.risque(regionId ?? '', horizonJours),
    queryFn: () => malariaApi.risque(regionId as string, horizonJours),
    enabled: !!regionId,
    staleTime: 24 * 60 * 60 * 1000,
  })
}

export function useMalariaRiskMap(horizonJours = 14) {
  return useQuery({
    queryKey: queryKeys.malaria.carteRisque(horizonJours),
    queryFn: () => malariaApi.carteRisqueNationale(horizonJours),
    staleTime: 24 * 60 * 60 * 1000,
  })
}

export function useMalariaAlerts(regionId?: string) {
  return useQuery({
    queryKey: queryKeys.malaria.alertes(regionId),
    queryFn: () => malariaApi.alertes({ region_id: regionId }),
    staleTime: 15 * 60 * 1000,
  })
}

export function useAcknowledgeMalariaAlert() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ alerteId, commentaire }: { alerteId: string; commentaire?: string }) =>
      malariaApi.acquitterAlerte(alerteId, commentaire),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['malaria', 'alertes'] })
    },
  })
}

export function useMalariaRegionalComparison(dateReference?: string) {
  return useQuery({
    queryKey: [...queryKeys.malaria.comparaison, dateReference],
    queryFn: () => malariaApi.comparaisonRegionale(dateReference),
  })
}

export function useMalariaSeasonality(regionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.malaria.saisonnalite(regionId ?? ''),
    queryFn: () => malariaApi.saisonnalite(regionId as string),
    enabled: !!regionId,
  })
}

export function useMalariaRiskFactors(regionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.malaria.facteursRisque(regionId ?? ''),
    queryFn: () => malariaApi.facteursRisque(regionId as string),
    enabled: !!regionId,
  })
}

export function useMalariaWeeklyTrend(regionId: string | undefined, semaines = 26) {
  return useQuery({
    queryKey: queryKeys.malaria.tendance(regionId ?? '', semaines),
    queryFn: () => malariaApi.tendanceHebdo(regionId as string, semaines),
    enabled: !!regionId,
  })
}

export function useMalariaNationalStats() {
  return useQuery({
    queryKey: queryKeys.malaria.statsNational,
    queryFn: () => malariaApi.statistiquesNationales(),
  })
}
