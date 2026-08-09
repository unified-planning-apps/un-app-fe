/**
 * src/hooks/use-predictions.ts
 */
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { predictionsApi } from '#/lib/api/predictions'
import { demoPredictionsApi } from '#/lib/api/demo'
import { IS_DEMO } from '#/env'
import type { ScenarioWhatIf } from '#/lib/schemas/predictions'

const api = IS_DEMO ? demoPredictionsApi : predictionsApi

export function useCombinedPrediction(regionId: string) {
  return useQuery({
    queryKey: queryKeys.predictions.combinee(regionId, 14),
    queryFn: () => api.combinee(regionId),
    enabled: !!regionId,
    staleTime: 60 * 60 * 1000,
  })
}

export function useShapExplanation(regionId: string | undefined, modele: 'paludisme' | 'nutrition') {
  return useQuery({
    queryKey: queryKeys.predictions.explicabilite(regionId ?? '', modele),
    queryFn: () => api.shap(regionId!, modele),
    enabled: !!regionId,
    staleTime: 60 * 60 * 1000,
  })
}

export function useModelHealth() {
  return useQuery({
    queryKey: queryKeys.predictions.santeModeles,
    queryFn: () => api.sante(),
    staleTime: 15 * 60 * 1000,
  })
}

export function useModelBacktest(regionId: string, modele: string, semainesHistorique = 6) {
  return useQuery({
    queryKey: queryKeys.predictions.backtest(regionId, modele, semainesHistorique),
    queryFn: () => api.backtest(regionId, modele),
    enabled: !!regionId && !!modele,
    staleTime: 24 * 60 * 60 * 1000,
  })
}

export function useBatchPredictions() {
  return useMutation({
    mutationFn: (req: { regions: string[]; horizon_jours?: number; inclure_shap?: boolean }) =>
      api.batch(req),
  })
}

export function useScenarioSimulation() {
  return useMutation({
    mutationFn: (params: ScenarioWhatIf) => api.scenario(params),
  })
}

export function useForceRetraining() {
  return useMutation({
    mutationFn: (modele: string) => api.retrain(modele),
  })
}
