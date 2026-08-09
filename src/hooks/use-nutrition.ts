/**
 * src/hooks/use-nutrition.ts
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { nutritionApi } from '#/lib/api/nutrition'
import { demoNutritionApi } from '#/lib/api/demo'
import { IS_DEMO } from '#/env'
import type { StockHumanitaireInput } from '#/lib/schemas/nutrition'

const api = IS_DEMO ? demoNutritionApi : nutritionApi

export function useNutritionRiskMap() {
  return useQuery({
    queryKey: queryKeys.nutrition.carteRisque,
    queryFn: () => api.carteRisqueNationale(),
    staleTime: 60 * 60 * 1000,
  })
}

export function useNutritionAlerts(params?: { region_id?: string }) {
  return useQuery({
    queryKey: queryKeys.nutrition.alertes(params?.region_id),
    queryFn: () => api.alertes(params),
    staleTime: 15 * 60 * 1000,
  })
}

export function useHumanitarianStocks(regionId: string) {
  return useQuery({
    queryKey: queryKeys.nutrition.stocks(regionId),
    queryFn: () => api.stocks(regionId),
    enabled: !!regionId,
    staleTime: 60 * 60 * 1000,
  })
}

export function useUpdateHumanitarianStocks() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ regionId, data }: { regionId: string; data: StockHumanitaireInput }) =>
      api.updateStocks(regionId, data),
    onSuccess: (_data, { regionId }) =>
      qc.invalidateQueries({ queryKey: queryKeys.nutrition.stocks(regionId) }),
  })
}

export function useRecipes(params?: { region_id?: string; cible?: string; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.nutrition.recettes(params ?? {}),
    queryFn: () => api.recettes(params),
    staleTime: 24 * 60 * 60 * 1000,
  })
}
