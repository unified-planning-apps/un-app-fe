/**
 * src/hooks/use-predictions.ts
 * =============================
 * React-query hooks wrapping `lib/api/predictions.ts`.
 */

import { useMutation, useQuery } from '@tanstack/react-query'
import { predictionsApi } from '#/lib/api/predictions'
import type { PredictionBatchRequest, ScenarioWhatIf } from '#/lib/schemas/predictions'
import { queryKeys } from './query-keys'

export function useCombinedPrediction(regionId: string | undefined, horizonJours = 14) {
  return useQuery({
    queryKey: queryKeys.predictions.combinee(regionId ?? '', horizonJours),
    queryFn: () => predictionsApi.combinee(regionId as string, horizonJours),
    enabled: !!regionId,
    staleTime: 24 * 60 * 60 * 1000,
  })
}

export function useBatchPredictions() {
  return useMutation({
    mutationFn: (data: PredictionBatchRequest) => predictionsApi.batch(data),
  })
}

export function useScenarioSimulation() {
  return useMutation({
    mutationFn: (data: ScenarioWhatIf) => predictionsApi.simulerScenario(data),
  })
}

export function useShapExplanation(regionId: string | undefined, modele: 'paludisme' | 'nutrition') {
  return useQuery({
    queryKey: queryKeys.predictions.explicabilite(regionId ?? '', modele),
    queryFn: () => predictionsApi.explicabilite(regionId as string, modele),
    enabled: !!regionId,
    staleTime: 12 * 60 * 60 * 1000,
  })
}

export function useModelHealth() {
  return useQuery({
    queryKey: queryKeys.predictions.santeModeles,
    queryFn: () => predictionsApi.santeModeles(),
  })
}

export function useModelBacktest(
  regionId: string | undefined,
  modele: 'paludisme' | 'nutrition' = 'paludisme',
  periodeMois = 6,
) {
  return useQuery({
    queryKey: queryKeys.predictions.backtest(regionId ?? '', modele, periodeMois),
    queryFn: () => predictionsApi.backtest(regionId as string, modele, periodeMois),
    enabled: !!regionId,
  })
}

export function useForceRetraining() {
  return useMutation({
    mutationFn: (modele: 'paludisme' | 'nutrition' | 'tous') => predictionsApi.forcerRetraining(modele),
  })
}
