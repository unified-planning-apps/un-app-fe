/**
 * src/hooks/use-nutrition.ts
 * ===========================
 * React-query hooks wrapping `lib/api/nutrition.ts`.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { nutritionApi } from '#/lib/api/nutrition'
import type { StockHumanitaireInput } from '#/lib/schemas/nutrition'
import { queryKeys } from './query-keys'

export function useNutritionStatus(regionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.nutrition.statut(regionId ?? ''),
    queryFn: () => nutritionApi.statut(regionId as string),
    enabled: !!regionId,
  })
}

export function useNutritionRisk(regionId: string | undefined, horizonJours = 30) {
  return useQuery({
    queryKey: queryKeys.nutrition.risque(regionId ?? '', horizonJours),
    queryFn: () => nutritionApi.risque(regionId as string, horizonJours),
    enabled: !!regionId,
    staleTime: 24 * 60 * 60 * 1000,
  })
}

export function useFoodAvailability(regionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.nutrition.disponibilite(regionId ?? ''),
    queryFn: () => nutritionApi.disponibilite(regionId as string),
    enabled: !!regionId,
  })
}

export function useRecipes(filters?: {
  region_id?: string
  saison?: string
  cible?: string
  score_min?: number
  limit?: number
}) {
  return useQuery({
    queryKey: queryKeys.nutrition.recettes(filters ?? {}),
    queryFn: () => nutritionApi.recettes(filters),
  })
}

export function useRecipeDetail(recetteId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.nutrition.recetteDetail(recetteId ?? ''),
    queryFn: () => nutritionApi.recetteDetail(recetteId as string),
    enabled: !!recetteId,
  })
}

export function useGenerateContextualRecipes(regionId: string | undefined, cible = 'enfants_6_23m', nombre = 5) {
  return useQuery({
    queryKey: ['nutrition', 'recettes-gen', regionId, cible, nombre],
    queryFn: () => nutritionApi.genererRecettesContextuelles(regionId as string, cible, nombre),
    enabled: !!regionId,
  })
}

export function useHumanitarianStocks(regionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.nutrition.stocks(regionId ?? ''),
    queryFn: () => nutritionApi.stocks(regionId as string),
    enabled: !!regionId,
  })
}

export function useUpdateHumanitarianStocks() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ regionId, data }: { regionId: string; data: StockHumanitaireInput }) =>
      nutritionApi.updateStocks(regionId, data),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nutrition.stocks(variables.regionId) })
    },
  })
}

export function useNutritionAlerts(regionId?: string) {
  return useQuery({
    queryKey: queryKeys.nutrition.alertes(regionId),
    queryFn: () => nutritionApi.alertes({ region_id: regionId }),
    staleTime: 15 * 60 * 1000,
  })
}

export function useLeanSeason(regionId?: string) {
  return useQuery({
    queryKey: queryKeys.nutrition.soudure(regionId),
    queryFn: () => nutritionApi.soudure(regionId),
  })
}

export function useNutritionTrend(regionId: string | undefined, mois = 24) {
  return useQuery({
    queryKey: queryKeys.nutrition.tendance(regionId ?? '', mois),
    queryFn: () => nutritionApi.tendance(regionId as string, mois),
    enabled: !!regionId,
  })
}

export function useNutritionRiskMap() {
  return useQuery({
    queryKey: queryKeys.nutrition.carteRisque,
    queryFn: () => nutritionApi.carteRisqueNationale(),
    staleTime: 24 * 60 * 60 * 1000,
  })
}

export function useNutritionNationalStats() {
  return useQuery({
    queryKey: queryKeys.nutrition.statsNational,
    queryFn: () => nutritionApi.statistiquesNationales(),
  })
}
