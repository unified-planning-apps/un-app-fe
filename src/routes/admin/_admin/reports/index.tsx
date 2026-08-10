import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { FileText, Download, Loader2, Send, Calendar, Trash2, FileDown } from 'lucide-react'
import {
  useGenerateReport,
  useReportStatus,
  useDownloadReport,
  useReportHistory,
  useReportSchedules,
  useDeleteReportSchedule,
  useExportData,
} from '#/hooks/use-reports'
import { REGIONS } from '#/lib/regions'
import { useAuthStore } from '#/stores/auth-store'
import { EmptyState } from '#/components/ui-states'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/_admin/reports/')({
  component: RouteComponent,
})

const TYPE_OPTIONS = [
  { value: 'paludisme_hebdomadaire', label: 'Malaria — weekly' },
  { value: 'nutrition_hebdomadaire', label: 'Nutrition — weekly' },
  { value: 'combine_hebdomadaire',   label: 'Combined — weekly' },
  { value: 'mensuel',                label: 'Monthly' },
]

const STATUT_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  en_attente: { bg: '#fff7ed', text: '#f97316', label: 'Pending' },
  en_cours:   { bg: '#eff6ff', text: '#0ea5e9', label: 'Processing' },
  termine:    { bg: '#f0fdf4', text: '#22c55e', label: 'Done' },
  erreur:     { bg: '#fef2f2', text: '#ef4444', label: 'Error' },
}

function RouteComponent() {
  const isNationalOrAdmin = useAuthStore(
    (s) => s.user?.role === 'admin' || s.user?.role === 'national',
  )
  const [typeRapport, setTypeRapport] = useState(TYPE_OPTIONS[0].value)
  const [regionId, setRegionId]       = useState('')
  const [rapportId, setRapportId]     = useState<string | undefined>()

  const generate       = useGenerateReport()
  const status         = useReportStatus(rapportId)
  const download       = useDownloadReport()
  const history        = useReportHistory()
  const schedules      = useReportSchedules()
  const deleteSchedule = useDeleteReportSchedule()
  const exportData     = useExportData()
  const [exportRegion, setExportRegion] = useState(REGIONS[0].id)
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv')

  const handleExport = () => {
    exportData.mutate(
      {
        regionId: exportRegion,
        format_export:     exportFormat,
        inclure_meteo:     true,
        inclure_paludisme: true,
        inclure_nutrition: true,
      },
      {
        onSuccess: () => toast.success('Export downloaded.'),
        onError:   () => toast.error('Export failed.'),
      },
    )
  }

  const handleGenerate = () => {
    generate.mutate(
      {
        type_rapport:     typeRapport as any,
        format:           'pdf',
        langue:           'fr',
        region_id:        regionId || null,
        inclure_cartes:   true,
        inclure_shap:     true,
        inclure_recettes: true,
        inclure_stocks:   false,
      },
      {
        onSuccess: (res) => {
          setRapportId(res.rapport_id)
          toast.success('Report generation started.')
        },
        onError: () => toast.error('Unable to start report generation.'),
      },
    )
  }

  const handleDownload = () => {
    if (!rapportId) return
    download.mutate(
      { rapportId, filename: `${typeRapport}-${rapportId}.pdf` },
      { onError: () => toast.error('Download failed.') },
    )
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="page-title">UNICEF Reports</h1>
        <p className="page-subtitle">
          Generation, history and scheduling of malaria/nutrition reports
        </p>
      </div>

      {/* Generate */}
      <div
        className="rounded-2xl border p-5"
        style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
      >
        <h2 className="font-semibold text-base mb-4" style={{ color: 'var(--texte-extra-black)' }}>
          Generate a new report
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <select
            value={typeRapport}
            onChange={(e) => setTypeRapport(e.target.value)}
            className="text-sm px-3 py-2.5 rounded-xl border bg-transparent"
            style={{ borderColor: 'var(--stroke-dark)', color: 'var(--texte-black)' }}
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select
            value={regionId}
            onChange={(e) => setRegionId(e.target.value)}
            className="text-sm px-3 py-2.5 rounded-xl border bg-transparent"
            style={{ borderColor: 'var(--stroke-dark)', color: 'var(--texte-black)' }}
          >
            <option value="">National (23 regions)</option>
            {REGIONS.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <button
            onClick={handleGenerate}
            disabled={generate.isPending}
            className="flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #023047 0%, #206ebb 100%)', color: '#ffffff' }}
          >
            {generate.isPending
              ? <Loader2 size={16} className="animate-spin" />
              : <FileText size={16} />}
            Generate
          </button>
        </div>

        {rapportId && status.data && (
          <div
            className="flex items-center justify-between rounded-xl p-3"
            style={{ backgroundColor: 'var(--background-gray-color)' }}
          >
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={(() => {
                  const s = STATUT_STYLE[status.data.statut] ?? STATUT_STYLE.en_attente
                  return { backgroundColor: s.bg, color: s.text }
                })()}
              >
                {STATUT_STYLE[status.data.statut]?.label ?? status.data.statut}
              </span>
              <span className="text-xs" style={{ color: 'var(--texte-gray)' }}>
                Report {rapportId}
              </span>
            </div>
            {status.data.statut === 'termine' && (
              <button
                onClick={handleDownload}
                disabled={download.isPending}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl"
                style={{ background: 'linear-gradient(135deg, #023047 0%, #206ebb 100%)', color: '#ffffff' }}
              >
                <Download size={13} /> Download
              </button>
            )}
          </div>
        )}
      </div>

      {/* History */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
      >
        <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: 'var(--stroke-dark)' }}>
          <FileText className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>
            Report history
          </h2>
        </div>
        {history.data && history.data.length === 0 && (
          <EmptyState
            icon={<FileText size={20} />}
            title="No reports generated"
            description="Generate your first report using the form above — it will appear here ready to download."
          />
        )}
        <div className="divide-y" style={{ borderColor: 'var(--stroke-dark)' }}>
          {history.data?.map((r) => (
            <div key={r.rapport_id} className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--texte-extra-black)' }}>
                  {r.type_rapport}
                </p>
                <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>
                  {r.region_name ?? 'National'} · {new Date(r.genere_le).toLocaleDateString('en-GB')}
                </p>
              </div>
              <span className="text-xs" style={{ color: 'var(--texte-gray)' }}>
                {r.taille_ko.toFixed(0)} KB
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Raw data export */}
      <div
        className="rounded-2xl border p-5"
        style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <FileDown className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>
            Raw export (CSV / JSON)
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={exportRegion}
            onChange={(e) => setExportRegion(e.target.value)}
            className="text-sm px-3 py-2.5 rounded-xl border bg-transparent"
            style={{ borderColor: 'var(--stroke-dark)', color: 'var(--texte-black)' }}
          >
            {REGIONS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as 'csv' | 'json')}
            className="text-sm px-3 py-2.5 rounded-xl border bg-transparent"
            style={{ borderColor: 'var(--stroke-dark)', color: 'var(--texte-black)' }}
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
          <button
            onClick={handleExport}
            disabled={exportData.isPending}
            className="flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #023047 0%, #206ebb 100%)', color: '#ffffff' }}
          >
            {exportData.isPending
              ? <Loader2 size={16} className="animate-spin" />
              : <FileDown size={16} />}
            Export
          </button>
        </div>
        <p className="text-xs mt-3" style={{ color: 'var(--texte-gray)' }}>
          Includes weather, malaria and nutrition data for the selected region.
        </p>
      </div>

      {/* Schedules — national/admin only */}
      {isNationalOrAdmin && (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
        >
          <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: 'var(--stroke-dark)' }}>
            <Calendar className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>
              Scheduled reports
            </h2>
          </div>
          {schedules.data && schedules.data.length === 0 && (
            <EmptyState
              icon={<Calendar size={20} />}
              title="No active schedules"
              description="Scheduled reports are sent automatically by email at the chosen frequency."
            />
          )}
          <div className="divide-y" style={{ borderColor: 'var(--stroke-dark)' }}>
            {schedules.data?.map((p) => (
              <div key={p.planification_id} className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--texte-extra-black)' }}>
                    {p.type_rapport}
                  </p>
                  <p className="text-xs flex items-center gap-1" style={{ color: 'var(--texte-gray)' }}>
                    <Send size={12} /> {p.destinataires_email.length} recipient(s) · {p.frequence}
                  </p>
                </div>
                <button
                  onClick={() => p.planification_id && deleteSchedule.mutate(p.planification_id)}
                  className="p-2 rounded-lg hover:opacity-70"
                  style={{ color: '#ef4444' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}