/**
 * src/hooks/use-reports.ts
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { reportsApi, downloadReportFile, downloadExportFile } from '#/lib/api/reports'
import { demoReportsApi } from '#/lib/api/demo'
import { IS_DEMO } from '#/env'
import type { DemandeRapport, StatutGenerationRapport } from '#/lib/schemas/reports'

export function useGenerateReport() {
  const qc = useQueryClient()
  return useMutation<StatutGenerationRapport, Error, DemandeRapport>({
    mutationFn: (req) =>
      IS_DEMO
        ? (demoReportsApi.generer(req) as unknown as Promise<StatutGenerationRapport>)
        : reportsApi.generer(req),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reports', 'historique'] }),
  })
}

export function useReportStatus(rapportId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.reports.statut(rapportId ?? ''),
    queryFn: (): Promise<StatutGenerationRapport> =>
      (IS_DEMO ? demoReportsApi : reportsApi).statut(rapportId!) as Promise<StatutGenerationRapport>,
    enabled: !!rapportId,
    refetchInterval: (q) => {
      const statut = (q.state.data as any)?.statut
      return statut === 'en_cours' || statut === 'en_attente' ? 3000 : false
    },
    staleTime: 0,
  })
}

export function useReportHistory(params?: { region_id?: string; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.reports.historique(params ?? {}),
    queryFn: () => (IS_DEMO ? demoReportsApi : reportsApi).historique(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useReportSchedules() {
  return useQuery({
    queryKey: queryKeys.reports.planifications,
    queryFn: () => (IS_DEMO ? demoReportsApi : reportsApi).planifications(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useDeleteReportSchedule() {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (IS_DEMO) {
        await demoReportsApi.supprimer(id)
      } else {
        await reportsApi.supprimerPlanification(id)
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.reports.planifications }),
  })
}

export function useDownloadReport() {
  return useMutation({
    mutationFn: ({ rapportId, filename }: { rapportId: string; filename: string }) => {
      if (IS_DEMO) {
        const blob = new Blob(['Demo report — HealthShield\n'], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = filename; a.click()
        URL.revokeObjectURL(url)
        return Promise.resolve()
      }
      return downloadReportFile(rapportId, filename)
    },
  })
}

export function useExportData() {
  return useMutation({
    mutationFn: (params: {
      regionId: string
      format_export: 'csv' | 'json'
      inclure_meteo?: boolean
      inclure_paludisme?: boolean
      inclure_nutrition?: boolean
    }) => {
      if (IS_DEMO) {
        const content = params.format_export === 'json'
          ? JSON.stringify({ region: params.regionId, demo: true }, null, 2)
          : `region_id,indicator,value\n${params.regionId},demo,1\n`
        const blob = new Blob([content], {
          type: params.format_export === 'json' ? 'application/json' : 'text/csv',
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `export-${params.regionId}.${params.format_export}`
        a.click()
        URL.revokeObjectURL(url)
        return Promise.resolve()
      }
      return downloadExportFile(params.regionId, {
        format_export:     params.format_export,
        inclure_meteo:     params.inclure_meteo,
        inclure_paludisme: params.inclure_paludisme,
        inclure_nutrition: params.inclure_nutrition,
      })
    },
  })
}