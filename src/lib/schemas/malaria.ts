/**
 * src/lib/schemas/malaria.ts
 * ===========================
 * Mirrors backend `src/api/routers/malaria.py` Pydantic models.
 */

import { z } from 'zod'
import { ShapFeatureSchema } from './common'

export const CasPaludismeSchema = z.object({
  region_id: z.string(),
  region_name: z.string(),
  district: z.string().nullable().optional(),
  semaine_epidemio: z.number(),
  annee: z.number(),
  date_rapport: z.string(),
  cas_confirmes: z.number(),
  cas_confirmes_mixte: z.number(),
  deces: z.number(),
  hospitalisations: z.number(),
  taux_incidence_pour_mille: z.number(),
  taux_positivite_tdr_pct: z.number(),
  population_a_risque: z.number(),
  source: z.string().default('DHIS2'),
  fiabilite_donnees: z.string().default('confirmée'),
})
export type CasPaludisme = z.infer<typeof CasPaludismeSchema>

export const FacteursRisqueSchema = z.object({
  temperature_moy_c: z.number(),
  precipitations_7j_mm: z.number(),
  precipitations_14j_mm: z.number(),
  precipitations_30j_mm: z.number(),
  humidite_moy_pct: z.number(),
  ndvi: z.number().nullable().optional(),
  zones_humides_pct: z.number().nullable().optional(),
  altitude_m: z.number(),
  saison: z.string(),
  semaines_depuis_pics_pluies: z.number(),
  cas_historiques_4sem: z.number(),
  endemicite: z.string(),
})
export type FacteursRisque = z.infer<typeof FacteursRisqueSchema>

export const PredictionRisqueMalariaSchema = z.object({
  region_id: z.string(),
  region_name: z.string(),
  score_risque: z.number(),
  niveau_risque: z.string(),
  cas_prevus_7j: z.number(),
  cas_prevus_14j: z.number(),
  intervalle_confiance_bas: z.number(),
  intervalle_confiance_haut: z.number(),
  date_prediction: z.string(),
  horizon_jours: z.number(),
  facteurs_risque: FacteursRisqueSchema,
  top_contributeurs: z.array(ShapFeatureSchema),
  recommandations: z.array(z.string()),
  fiabilite_modele: z.number(),
})
export type PredictionRisqueMalaria = z.infer<typeof PredictionRisqueMalariaSchema>

export const AlerteEpidemiologiqueSchema = z.object({
  alerte_id: z.string(),
  region_id: z.string(),
  region_name: z.string(),
  type_alerte: z.string(),
  severite: z.string(),
  seuil_depasse: z.number().nullable().optional(),
  valeur_actuelle: z.number(),
  date_detection: z.string(),
  statut: z.string().default('active'),
  description: z.string(),
  actions_requises: z.array(z.string()),
  responsable_notification: z.string(),
})
export type AlerteEpidemiologique = z.infer<typeof AlerteEpidemiologiqueSchema>

export const ComparaisonRegionaleSchema = z.object({
  date_reference: z.string(),
  regions: z.array(z.record(z.string(), z.unknown())),
  region_plus_risquee: z.string(),
  region_moins_risquee: z.string(),
  moyenne_nationale_score: z.number(),
  tendance_nationale: z.string(),
})
export type ComparaisonRegionale = z.infer<typeof ComparaisonRegionaleSchema>

export const StatsSaisonnieresSchema = z.object({
  region_id: z.string(),
  saison_courante: z.string(),
  semaine_dans_saison: z.number(),
  pic_historique_semaine: z.number(),
  semaines_avant_pic_estime: z.number(),
  cas_cumules_saison: z.number(),
  cas_cumules_saison_precedente: z.number(),
  variation_pct: z.number(),
  tendance: z.string(),
})
export type StatsSaisonnieres = z.infer<typeof StatsSaisonnieresSchema>

export interface CarteRisqueMalariaItem {
  region_id: string
  region_name: string
  latitude: number
  longitude: number
  score_risque: number
  niveau_risque: string
  cas_prevus_14j: number
  population: number
}

export interface CarteRisqueMalaria {
  carte: CarteRisqueMalariaItem[]
  horizon_jours: number
  regions_ok: number
  regions_erreur: string[]
  genere_le: string
}

export interface TendanceHebdoMalaria {
  region_id: string
  semaines: number
  data: Array<Record<string, unknown>>
  total_cas_periode: number
  semaine_pic?: number
}
