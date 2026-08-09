/**
 * src/hooks/use-malaria.ts
 * -------------------------
 * React-Query hooks for malaria data.
 * Transparently uses demo data when IS_DEMO === true.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { malariaApi } from '#/lib/api/malaria'
import { demoMalariaApi } from '#/lib/api/demo'
import { IS_DEMO } from '#/env'

const api = IS_DEMO ? demoMalariaApi : malariaApi

export function useMalariaCases(regionId: string, params?: { date_debut?: string; date_fin?: string }) {
  return useQuery({
    queryKey: queryKeys.malaria.cas(regionId),
    queryFn: () => api.cas(regionId, params),
    enabled: !!regionId,
    staleTime: 60 * 60 * 1000,
  })
}

export function useMalariaRiskMap(horizonJours = 14) {
  return useQuery({
    queryKey: queryKeys.malaria.carteRisque(horizonJours),
    queryFn: () => api.carteRisqueNationale(horizonJours),
    staleTime: 60 * 60 * 1000,
  })
}

export function useMalariaAlerts(params?: { region_id?: string }) {
  return useQuery({
    queryKey: queryKeys.malaria.alertes(params?.region_id),
    queryFn: () => api.alertes(params),
    staleTime: 15 * 60 * 1000,
  })
}

export function useAcknowledgeMalariaAlert() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ alerteId }: { alerteId: string }) => api.acquitterAlerte(alerteId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['malaria', 'alertes'] }),
  })
}

export function useMalariaWeeklyTrend(regionId: string, semaines = 8) {
  return useQuery({
    queryKey: queryKeys.malaria.tendance(regionId, semaines),
    queryFn: () => api.tendanceHebdo(regionId, semaines),
    enabled: !!regionId,
    staleTime: 60 * 60 * 1000,
  })
}

export function useMalariaSeasonality(regionId: string) {
  return useQuery({
    queryKey: queryKeys.malaria.saisonnalite(regionId),
    queryFn: () => api.saisonnier(regionId),
    enabled: !!regionId,
    staleTime: 24 * 60 * 60 * 1000,
  })
}

export function useMalariaRiskFactors(regionId: string) {
  return useQuery({
    queryKey: queryKeys.malaria.facteursRisque(regionId),
    queryFn: () => api.facteurs(regionId),
    enabled: !!regionId,
    staleTime: 60 * 60 * 1000,
  })
}
