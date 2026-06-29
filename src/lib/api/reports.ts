/**
 * src/lib/api/reports.ts
 * =======================
 * Calls backend `/rapports/*` (src/api/routers/reports.py).
 */

import { apiClient } from './client'
import { useAuthStore } from '#/stores/auth-store'
import type {
  DemandeRapport,
  MetadataRapport,
  PlanificationRapport,
  RapportHebdoJson,
  RapportStats,
  StatutGenerationRapport,
} from '#/lib/schemas/reports'

export const reportsApi = {
  generer: (data: DemandeRapport) =>
    apiClient.post<StatutGenerationRapport>('/rapports/generer', data),

  statut: (rapportId: string) =>
    apiClient.get<StatutGenerationRapport>(`/rapports/statut/${rapportId}`),

  /** Build a download URL — open in a new tab / <a download>. Token must be appended manually
   * since this is a plain link, not a fetch() call. */
  telechargerUrl: (rapportId: string) => apiClient.url(`/rapports/telecharger/${rapportId}`),

  historique: (params?: { type_rapport?: string; region_id?: string; date_debut?: string; date_fin?: string }) =>
    apiClient.get<MetadataRapport[]>('/rapports/historique', { params }),

  hebdoJson: (regionId: string, semaine?: number, annee?: number) =>
    apiClient.get<RapportHebdoJson>(`/rapports/hebdomadaire/${regionId}`, {
      params: { semaine, annee },
    }),

  /** Restricted: national/admin. */
  urgence: (regionId: string, typeCrise: string, descriptionCrise: string) =>
    apiClient.post<Record<string, unknown>>('/rapports/urgence', undefined, {
      params: { region_id: regionId, type_crise: typeCrise, description_crise: descriptionCrise },
    }),

  /** Restricted: national/admin. */
  planifications: (actifSeulement = true) =>
    apiClient.get<PlanificationRapport[]>('/rapports/planifications', {
      params: { actif_seulement: actifSeulement },
    }),

  /** Restricted: national/admin. */
  creerPlanification: (data: PlanificationRapport) =>
    apiClient.post<PlanificationRapport>('/rapports/planifications', data),

  /** Restricted: national/admin. */
  supprimerPlanification: (planificationId: string) =>
    apiClient.delete<void>(`/rapports/planifications/${planificationId}`),

  exportUrl: (
    regionId: string,
    params: {
      format_export?: 'csv' | 'json'
      date_debut?: string
      date_fin?: string
      inclure_meteo?: boolean
      inclure_paludisme?: boolean
      inclure_nutrition?: boolean
    },
  ) => apiClient.url(`/rapports/export/${regionId}`, params),

  /** Restricted: national/admin. */
  statistiques: (periodeJours = 30) =>
    apiClient.get<RapportStats>('/rapports/statistiques', { params: { periode_jours: periodeJours } }),
}

/**
 * Downloads a protected file (requires Authorization header, so a plain
 * <a href> won't work) by fetching it as a blob and triggering a save.
 */
export async function downloadReportFile(rapportId: string, filename = `rapport-${rapportId}.pdf`) {
  const token = useAuthStore.getState().accessToken
  const response = await fetch(reportsApi.telechargerUrl(rapportId), {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  if (!response.ok) {
    throw new Error('Le téléchargement du rapport a échoué.')
  }
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export async function downloadExportFile(
  regionId: string,
  params: Parameters<typeof reportsApi.exportUrl>[1],
) {
  const token = useAuthStore.getState().accessToken
  const response = await fetch(reportsApi.exportUrl(regionId, params), {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  if (!response.ok) {
    throw new Error("L'export des données a échoué.")
  }
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const ext = params.format_export === 'json' ? 'json' : 'csv'
  link.href = url
  link.download = `export_${regionId}.${ext}`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
