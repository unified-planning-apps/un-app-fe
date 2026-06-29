/**
 * src/hooks/use-reports.ts
 * =========================
 * React-query hooks wrapping `lib/api/reports.ts`.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { downloadExportFile, downloadReportFile, reportsApi } from '#/lib/api/reports'
import type { DemandeRapport, PlanificationRapport } from '#/lib/schemas/reports'
import { queryKeys } from './query-keys'

export function useGenerateReport() {
  return useMutation({
    mutationFn: (data: DemandeRapport) => reportsApi.generer(data),
  })
}

/** Polls report generation status every 3s until termine/erreur. */
export function useReportStatus(rapportId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.reports.statut(rapportId ?? ''),
    queryFn: () => reportsApi.statut(rapportId as string),
    enabled: !!rapportId,
    refetchInterval: (query) => {
      const statut = query.state.data?.statut
      return statut === 'termine' || statut === 'erreur' ? false : 3000
    },
  })
}

export function useDownloadReport() {
  return useMutation({
    mutationFn: ({ rapportId, filename }: { rapportId: string; filename?: string }) =>
      downloadReportFile(rapportId, filename),
  })
}

export function useReportHistory(filters?: {
  type_rapport?: string
  region_id?: string
  date_debut?: string
  date_fin?: string
}) {
  return useQuery({
    queryKey: queryKeys.reports.historique(filters ?? {}),
    queryFn: () => reportsApi.historique(filters),
  })
}

export function useWeeklyReportPreview(regionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.reports.hebdoJson(regionId ?? ''),
    queryFn: () => reportsApi.hebdoJson(regionId as string),
    enabled: !!regionId,
  })
}

export function useEmergencyReport() {
  return useMutation({
    mutationFn: ({
      regionId,
      typeCrise,
      descriptionCrise,
    }: {
      regionId: string
      typeCrise: string
      descriptionCrise: string
    }) => reportsApi.urgence(regionId, typeCrise, descriptionCrise),
  })
}

export function useReportSchedules(actifSeulement = true) {
  return useQuery({
    queryKey: [...queryKeys.reports.planifications, actifSeulement],
    queryFn: () => reportsApi.planifications(actifSeulement),
  })
}

export function useCreateReportSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PlanificationRapport) => reportsApi.creerPlanification(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.reports.planifications }),
  })
}

export function useDeleteReportSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (planificationId: string) => reportsApi.supprimerPlanification(planificationId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.reports.planifications }),
  })
}

export function useExportData() {
  return useMutation({
    mutationFn: ({
      regionId,
      ...params
    }: {
      regionId: string
      format_export?: 'csv' | 'json'
      date_debut?: string
      date_fin?: string
      inclure_meteo?: boolean
      inclure_paludisme?: boolean
      inclure_nutrition?: boolean
    }) => downloadExportFile(regionId, params),
  })
}

export function useReportStats() {
  return useQuery({
    queryKey: queryKeys.reports.statistiques,
    queryFn: () => reportsApi.statistiques(),
  })
}
