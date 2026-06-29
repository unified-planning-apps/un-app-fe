/**
 * src/lib/schemas/predictions.ts
 * ================================
 * Mirrors backend `src/api/routers/predictions.py` Pydantic models.
 */

import { z } from 'zod'
import { ShapFeatureSchema } from './common'

export const PredictionCombineeSchema = z.object({
  prediction_id: z.string(),
  region_id: z.string(),
  region_name: z.string(),
  date_prediction: z.string(),
  horizon_jours: z.number(),
  score_paludisme: z.number(),
  niveau_paludisme: z.string(),
  score_nutrition: z.number(),
  niveau_nutrition: z.string(),
  score_composite: z.number(),
  niveau_alerte_global: z.enum(['vert', 'jaune', 'orange', 'rouge']),
  couleur_carte: z.string(),
  cas_paludisme_prevus_14j: z.number(),
  gam_prevu_pct: z.number(),
  population_a_risque: z.number(),
  enfants_vulnerables: z.number(),
  temperature_prevue_c: z.number(),
  precipitations_prevues_mm: z.number(),
  top_facteurs_risque: z.array(ShapFeatureSchema),
  recommandations_prioritaires: z.array(z.string()),
  niveau_confiance: z.number(),
})
export type PredictionCombinee = z.infer<typeof PredictionCombineeSchema>

export const PredictionBatchRequestSchema = z.object({
  regions: z.array(z.string()).min(1).max(22),
  horizon_jours: z.number().min(1).max(90).default(14),
  inclure_shap: z.boolean().default(false),
})
export type PredictionBatchRequest = z.infer<typeof PredictionBatchRequestSchema>

export const PredictionBatchResultSchema = z.object({
  batch_id: z.string(),
  horodatage: z.string(),
  horizon_jours: z.number(),
  total_regions: z.number(),
  regions_ok: z.number(),
  regions_erreur: z.array(z.string()),
  predictions: z.array(PredictionCombineeSchema),
  resume_national: z.record(z.string(), z.unknown()),
})
export type PredictionBatchResult = z.infer<typeof PredictionBatchResultSchema>

export const ScenarioWhatIfSchema = z.object({
  region_id: z.string(),
  horizon_jours: z.number().default(30),
  delta_temperature_c: z.number().min(-10).max(10).default(0),
  multiplicateur_precipitations: z.number().min(0).max(5).default(1),
  scenario_cyclone: z.boolean().default(false),
  scenario_secheresse: z.boolean().default(false),
  choc_prix_alimentaires_pct: z.number().min(-50).max(200).default(0),
})
export type ScenarioWhatIf = z.infer<typeof ScenarioWhatIfSchema>

export const ResultatScenarioSchema = z.object({
  scenario: ScenarioWhatIfSchema,
  prediction_baseline: PredictionCombineeSchema,
  prediction_scenario: PredictionCombineeSchema,
  delta_score_paludisme: z.number(),
  delta_score_nutrition: z.number(),
  cas_additionnels_paludisme: z.number(),
  enfants_additionnels_malnutris: z.number(),
  analyse_impact: z.string(),
  recommandations_scenario: z.array(z.string()),
})
export type ResultatScenario = z.infer<typeof ResultatScenarioSchema>

export const SHAPExplicationSchema = z.object({
  region_id: z.string(),
  modele: z.string(),
  date_prediction: z.string(),
  valeur_predite: z.number(),
  valeur_base: z.number(),
  features: z.array(ShapFeatureSchema),
  force_plot_url: z.string().nullable().optional(),
  waterfall_url: z.string().nullable().optional(),
})
export type SHAPExplication = z.infer<typeof SHAPExplicationSchema>

export const ModeleSanteSchema = z.object({
  modele: z.string(),
  version: z.string(),
  date_entrainement: z.string().nullable().optional(),
  metriques: z.record(z.string(), z.unknown()),
  drift_score: z.number(),
  statut: z.string(),
  nb_predictions_7j: z.number(),
  derniere_prediction: z.string().nullable().optional(),
})
export type ModeleSante = z.infer<typeof ModeleSanteSchema>

export const PerformanceBacktestSchema = z.object({
  region_id: z.string(),
  periode_debut: z.string(),
  periode_fin: z.string(),
  modele: z.string(),
  mae: z.number(),
  rmse: z.number(),
  mape_pct: z.number(),
  correlation: z.number(),
  biais: z.number(),
  nb_predictions: z.number(),
  predictions_vs_reel: z.array(z.record(z.string(), z.unknown())),
})
export type PerformanceBacktest = z.infer<typeof PerformanceBacktestSchema>
