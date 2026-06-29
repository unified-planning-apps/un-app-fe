/**
 * src/lib/schemas/common.ts
 * ==========================
 * Small building blocks shared by the domain schemas (malaria, nutrition,
 * predictions, weather, reports). Mirrors recurring shapes from the
 * backend's Pydantic models.
 */

import { z } from 'zod'

export const NiveauRisqueSchema = z.enum(['faible', 'moyen', 'élevé', 'très élevé'])
export type NiveauRisque = z.infer<typeof NiveauRisqueSchema>

export const SeveriteSchema = z.enum(['surveillance', 'alerte', 'urgence', 'crise'])
export type Severite = z.infer<typeof SeveriteSchema>

export const StatutAlerteSchema = z.enum(['active', 'resolue', 'sous_surveillance'])

export const NiveauAlerteGlobalSchema = z.enum(['vert', 'jaune', 'orange', 'rouge'])
export type NiveauAlerteGlobal = z.infer<typeof NiveauAlerteGlobalSchema>

export const ShapFeatureSchema = z.object({
  nom: z.string().optional(),
  valeur: z.union([z.number(), z.string()]).optional(),
  shap_value: z.number().optional(),
  contribution_pct: z.number().optional(),
  direction: z.string().optional(),
  modele: z.string().optional(),
}).passthrough()
export type ShapFeature = z.infer<typeof ShapFeatureSchema>

export const ApiErrorBodySchema = z.object({
  code: z.string().optional(),
  message: z.string(),
})

/** Generic paginated query params used by several list endpoints. */
export interface PaginationParams {
  limit?: number
  offset?: number
}
