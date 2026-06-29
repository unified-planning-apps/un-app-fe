/**
 * src/lib/schemas/reports.ts
 * ===========================
 * Mirrors backend `src/api/routers/reports.py` Pydantic models/enums.
 */

import { z } from 'zod'

export const TypeRapportSchema = z.enum([
  'paludisme_hebdomadaire',
  'nutrition_hebdomadaire',
  'combine_hebdomadaire',
  'urgence',
  'mensuel',
  'alerte_epidemique',
])
export type TypeRapport = z.infer<typeof TypeRapportSchema>

export const FormatRapportSchema = z.enum(['pdf', 'html', 'json'])
export type FormatRapport = z.infer<typeof FormatRapportSchema>

export const StatutRapportSchema = z.enum(['en_attente', 'en_cours', 'termine', 'erreur'])
export type StatutRapport = z.infer<typeof StatutRapportSchema>

export const LangueRapportSchema = z.enum(['fr', 'mg'])
export type LangueRapport = z.infer<typeof LangueRapportSchema>

export const DemandeRapportSchema = z.object({
  type_rapport: TypeRapportSchema,
  format: FormatRapportSchema.default('pdf'),
  langue: LangueRapportSchema.default('fr'),
  region_id: z.string().nullable().optional(),
  date_debut: z.string().optional(),
  date_fin: z.string().optional(),
  inclure_cartes: z.boolean().default(true),
  inclure_shap: z.boolean().default(true),
  inclure_recettes: z.boolean().default(true),
  inclure_stocks: z.boolean().default(false),
  destinataires_email: z.array(z.string().email()).nullable().optional(),
})
export type DemandeRapport = z.infer<typeof DemandeRapportSchema>

export const StatutGenerationRapportSchema = z.object({
  rapport_id: z.string(),
  type_rapport: TypeRapportSchema,
  statut: StatutRapportSchema,
  region_id: z.string().nullable().optional(),
  demande_par: z.string(),
  demande_le: z.string(),
  termine_le: z.string().nullable().optional(),
  duree_generation_sec: z.number().nullable().optional(),
  url_telechargement: z.string().nullable().optional(),
  taille_fichier_ko: z.number().nullable().optional(),
  message_erreur: z.string().nullable().optional(),
}).passthrough()
export type StatutGenerationRapport = z.infer<typeof StatutGenerationRapportSchema>

export const MetadataRapportSchema = z.object({
  rapport_id: z.string(),
  type_rapport: TypeRapportSchema,
  format: FormatRapportSchema,
  langue: LangueRapportSchema,
  region_id: z.string().nullable().optional(),
  region_name: z.string().nullable().optional(),
  date_debut: z.string(),
  date_fin: z.string(),
  genere_le: z.string(),
  genere_par: z.string(),
  taille_ko: z.number(),
  nb_pages: z.number().nullable().optional(),
  url_telechargement: z.string(),
  valide_jusqu_au: z.string(),
})
export type MetadataRapport = z.infer<typeof MetadataRapportSchema>

export const PlanificationRapportSchema = z.object({
  planification_id: z.string().optional(),
  type_rapport: TypeRapportSchema,
  format: FormatRapportSchema.default('pdf'),
  langue: LangueRapportSchema.default('fr'),
  region_id: z.string().nullable().optional(),
  frequence: z.enum(['hebdomadaire', 'mensuel', 'bimensuel']).default('hebdomadaire'),
  jour_generation: z.number().min(1).max(7).default(1),
  heure_generation: z.string().default('06:00'),
  destinataires_email: z.array(z.string().email()).min(1, 'Au moins un destinataire requis.'),
  actif: z.boolean().default(true),
  creee_par: z.string().nullable().optional(),
  creee_le: z.string().optional(),
})
export type PlanificationRapport = z.infer<typeof PlanificationRapportSchema>

export const RapportHebdoJsonSchema = z.object({
  region_id: z.string(),
  semaine: z.string(),
  date_debut: z.string(),
  date_fin: z.string(),
  genere_le: z.string(),
  paludisme: z.object({
    cas_confirmes_semaine: z.number(),
    deces_semaine: z.number(),
    taux_positivite_tdr: z.number().nullable().optional(),
    alertes_actives: z.number(),
  }),
  nutrition: z.object({
    gam_pct: z.number().nullable().optional(),
    sam_pct: z.number().nullable().optional(),
    classification_who: z.string(),
    alertes_actives: z.number(),
  }),
})
export type RapportHebdoJson = z.infer<typeof RapportHebdoJsonSchema>

export interface RapportStats {
  periode_jours: number
  total_rapports: number
  par_type: Record<string, number>
  par_format: Record<string, number>
  temps_moyen_generation_sec: number
  taux_succes_pct: number
  rapports_urgence: number
}
