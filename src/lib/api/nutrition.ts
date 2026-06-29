/**
 * src/lib/api/nutrition.ts
 * =========================
 * Calls backend `/nutrition/*` (src/api/routers/nutrition.py).
 */

import { apiClient } from './client'
import type {
  AlerteNutrition,
  CarteRisqueNutrition,
  DisponibiliteAlimentaire,
  PredictionRisqueNutrition,
  RecetteNutritionnelle,
  SaisonSoudure,
  StatutNutritionnel,
  StockHumanitaire,
  StockHumanitaireInput,
  TendanceNutrition,
} from '#/lib/schemas/nutrition'

export const nutritionApi = {
  statut: (regionId: string) =>
    apiClient.get<StatutNutritionnel>(`/nutrition/statut/${regionId}`),

  risque: (regionId: string, horizonJours = 30) =>
    apiClient.get<PredictionRisqueNutrition>(`/nutrition/risque/${regionId}`, {
      params: { horizon_jours: horizonJours },
    }),

  disponibilite: (regionId: string) =>
    apiClient.get<DisponibiliteAlimentaire>(`/nutrition/disponibilite/${regionId}`),

  recettes: (params?: {
    region_id?: string
    saison?: string
    cible?: string
    score_min?: number
    limit?: number
  }) => apiClient.get<RecetteNutritionnelle[]>('/nutrition/recettes', { params }),

  recetteDetail: (recetteId: string) =>
    apiClient.get<RecetteNutritionnelle>(`/nutrition/recettes/${recetteId}`),

  genererRecettesContextuelles: (regionId: string, cible = 'enfants_6_23m', nombre = 5) =>
    apiClient.get<RecetteNutritionnelle[]>(`/nutrition/recettes/generer/${regionId}`, {
      params: { cible, nombre },
    }),

  /** Restricted: national/admin. */
  stocks: (regionId: string) =>
    apiClient.get<StockHumanitaire>(`/nutrition/stocks/${regionId}`),

  /** Restricted: national/admin. */
  updateStocks: (regionId: string, data: StockHumanitaireInput) =>
    apiClient.post<{ statut: string; region_id: string; inventaire_id?: string; message: string }>(
      `/nutrition/stocks/${regionId}`,
      data,
    ),

  alertes: (params?: { region_id?: string; type_alerte?: string; severite?: string; statut?: string }) =>
    apiClient.get<AlerteNutrition[]>('/nutrition/alertes', { params }),

  soudure: (regionId?: string) =>
    apiClient.get<SaisonSoudure[]>('/nutrition/soudure', { params: { region_id: regionId } }),

  tendance: (regionId: string, mois = 24) =>
    apiClient.get<TendanceNutrition>(`/nutrition/tendance/${regionId}`, { params: { mois } }),

  carteRisqueNationale: () =>
    apiClient.get<CarteRisqueNutrition>('/nutrition/carte-risque'),

  /** Restricted: national/admin. */
  statistiquesNationales: () =>
    apiClient.get<Record<string, unknown>>('/nutrition/statistiques/national'),
}
