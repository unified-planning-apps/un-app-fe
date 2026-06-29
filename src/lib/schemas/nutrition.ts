/**
 * src/lib/schemas/nutrition.ts
 * =============================
 * Mirrors backend `src/api/routers/nutrition.py` Pydantic models.
 */

import { z } from 'zod'
import { ShapFeatureSchema } from './common'

export const StatutNutritionnelSchema = z.object({
  region_id: z.string(),
  region_name: z.string(),
  date_enquete: z.string(),
  source: z.string(),
  gam_pct: z.number(),
  sam_pct: z.number(),
  mam_pct: z.number(),
  stunting_pct: z.number(),
  underweight_pct: z.number(),
  enfants_5ans_affectes: z.number(),
  femmes_enceintes_malnutries: z.number(),
  classification_who: z.string(),
  tendance_vs_periode_prec: z.string(),
  fiabilite_donnees: z.string().default('confirmée'),
})
export type StatutNutritionnel = z.infer<typeof StatutNutritionnelSchema>

export const PredictionRisqueNutritionSchema = z.object({
  region_id: z.string(),
  region_name: z.string(),
  score_risque: z.number(),
  niveau_risque: z.string(),
  gam_prevu_pct: z.number(),
  sam_prevu_pct: z.number(),
  date_prediction: z.string(),
  horizon_jours: z.number(),
  intervalles_confiance: z.record(z.string(), z.unknown()),
  facteurs_contributeurs: z.array(ShapFeatureSchema),
  populations_vulnerables: z.array(z.record(z.string(), z.unknown())),
  recommandations: z.array(z.string()),
  interventions_prioritaires: z.array(z.string()),
})
export type PredictionRisqueNutrition = z.infer<typeof PredictionRisqueNutritionSchema>

export const DisponibiliteAlimentaireSchema = z.object({
  region_id: z.string(),
  date_observation: z.string(),
  score_fcs: z.number(),
  classification_fcs: z.string(),
  hdds: z.number(),
  rcsi: z.number(),
  prix_riz_kg: z.number().nullable().optional(),
  prix_manioc_kg: z.number().nullable().optional(),
  prix_mais_kg: z.number().nullable().optional(),
  prix_haricots_kg: z.number().nullable().optional(),
  prix_huile_litre: z.number().nullable().optional(),
  variation_prix_pct_1m: z.number().nullable().optional(),
  disponibilite_cereales: z.number(),
  disponibilite_legumineuses: z.number(),
  disponibilite_proteines_animales: z.number(),
  disponibilite_legumes: z.number(),
  disponibilite_fruits: z.number(),
  source: z.string().default('WFP VAM'),
})
export type DisponibiliteAlimentaire = z.infer<typeof DisponibiliteAlimentaireSchema>

export const IngredientSchema = z.object({
  nom: z.string(),
  quantite_g: z.number().optional(),
  disponible_localement: z.boolean().optional(),
}).passthrough()

export const RecetteNutritionnelleSchema = z.object({
  recette_id: z.string(),
  nom: z.string(),
  nom_malgache: z.string().nullable().optional(),
  region_adaptee: z.array(z.string()),
  saison: z.array(z.string()),
  calories_kcal: z.number(),
  proteines_g: z.number(),
  glucides_g: z.number(),
  lipides_g: z.number(),
  fer_mg: z.number(),
  vitamine_a_ug: z.number(),
  zinc_mg: z.number(),
  score_nutritionnel: z.number(),
  ingredients: z.array(IngredientSchema),
  instructions: z.string(),
  temps_preparation_min: z.number(),
  cout_estime_ariary: z.number().nullable().optional(),
  cible: z.array(z.string()),
  image_url: z.string().nullable().optional(),
})
export type RecetteNutritionnelle = z.infer<typeof RecetteNutritionnelleSchema>

export const StockHumanitaireSchema = z.object({
  region_id: z.string(),
  date_inventaire: z.string(),
  rutf_sachets: z.number(),
  rusf_sachets: z.number(),
  plumpy_nut_sachets: z.number(),
  spiruline_kg: z.number(),
  sel_iode_kg: z.number(),
  vitamine_a_capsules: z.number(),
  fer_folate_comprimes: z.number(),
  zinc_comprimes: z.number(),
  jours_couverture_sam: z.number(),
  jours_couverture_mam: z.number(),
  statut_stock: z.string(),
  derniere_livraison: z.string().nullable().optional(),
  prochaine_livraison_prevue: z.string().nullable().optional(),
})
export type StockHumanitaire = z.infer<typeof StockHumanitaireSchema>

/** Payload for POST /nutrition/stocks/{region_id} — same shape, server-set fields optional. */
export const StockHumanitaireInputSchema = StockHumanitaireSchema.partial({
  date_inventaire: true,
  derniere_livraison: true,
  prochaine_livraison_prevue: true,
})
export type StockHumanitaireInput = z.infer<typeof StockHumanitaireInputSchema>

export const AlerteNutritionSchema = z.object({
  alerte_id: z.string(),
  region_id: z.string(),
  region_name: z.string(),
  type_alerte: z.string(),
  severite: z.string(),
  indicateur_declencheur: z.string(),
  valeur_actuelle: z.number(),
  seuil_alerte: z.number(),
  population_affectee: z.number(),
  enfants_a_risque: z.number(),
  date_detection: z.string(),
  statut: z.string().default('active'),
  actions_requises: z.array(z.string()),
})
export type AlerteNutrition = z.infer<typeof AlerteNutritionSchema>

export const SaisonSoudureSchema = z.object({
  region_id: z.string(),
  region_name: z.string(),
  en_periode_soudure: z.boolean(),
  semaines_avant_soudure: z.number().nullable().optional(),
  duree_soudure_historique_semaines: z.number(),
  niveau_risque_soudure: z.string(),
  denrees_principales_affectees: z.array(z.string()),
  strategies_coping_observees: z.array(z.string()),
})
export type SaisonSoudure = z.infer<typeof SaisonSoudureSchema>

export interface CarteRisqueNutritionItem {
  region_id: string
  region_name: string
  latitude: number
  longitude: number
  score_risque: number
  niveau_risque: string
  gam_actuel_pct: number | null
  gam_prevu_pct: number
  population: number
  food_insecurity_risk: string
}

export interface CarteRisqueNutrition {
  carte: CarteRisqueNutritionItem[]
  genere_le: string
  regions_ok: number
}

export interface TendanceNutrition {
  region_id: string
  mois: number
  data: Array<Record<string, unknown>>
  gam_actuel: number | null
  gam_moyen_periode: number | null
  seuils_oms: { acceptable: number; alerte: number; urgence: number }
}
