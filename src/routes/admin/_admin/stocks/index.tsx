import { createFileRoute, redirect } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Package, Save, Loader2, AlertTriangle } from 'lucide-react'
import { useHumanitarianStocks, useUpdateHumanitarianStocks } from '#/hooks/use-nutrition'
import { useAuthStore } from '#/stores/auth-store'
import { SkeletonCards, ErrorState } from '#/components/ui-states'
import { REGIONS } from '#/lib/regions'
import type { StockHumanitaireInput } from '#/lib/schemas/nutrition'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/_admin/stocks/')({
  beforeLoad: () => {
    if (typeof window === 'undefined') return
    const role = useAuthStore.getState().user?.role
    if (role !== 'admin' && role !== 'national') {
      throw redirect({ to: '/admin/dashboard' })
    }
  },
  component: RouteComponent,
})

const STOCK_FIELDS: Array<{ key: keyof StockHumanitaireInput; label: string; unit: string }> = [
  { key: 'rutf_sachets', label: 'RUTF', unit: 'sachets' },
  { key: 'rusf_sachets', label: 'RUSF', unit: 'sachets' },
  { key: 'plumpy_nut_sachets', label: "Plumpy'Nut", unit: 'sachets' },
  { key: 'spiruline_kg', label: 'Spiruline', unit: 'kg' },
  { key: 'sel_iode_kg', label: 'Sel iodé', unit: 'kg' },
  { key: 'vitamine_a_capsules', label: 'Vitamine A', unit: 'capsules' },
  { key: 'fer_folate_comprimes', label: 'Fer-Folate', unit: 'comprimés' },
  { key: 'zinc_comprimes', label: 'Zinc', unit: 'comprimés' },
]

const STATUT_STYLE: Record<string, { bg: string; text: string }> = {
  suffisant: { bg: '#f0fdf4', text: '#22c55e' },
  faible: { bg: '#fff7ed', text: '#f97316' },
  critique: { bg: '#fef2f2', text: '#ef4444' },
  rupture: { bg: '#fef2f2', text: '#b91c1c' },
}

function RouteComponent() {
  const [regionId, setRegionId] = useState(REGIONS[0].id)
  const stocks = useHumanitarianStocks(regionId)
  const updateStocks = useUpdateHumanitarianStocks()

  const [form, setForm] = useState<Record<string, number>>({})

  useEffect(() => {
    if (stocks.data) {
      setForm(
        Object.fromEntries(STOCK_FIELDS.map((f) => [f.key, (stocks.data as never)[f.key] ?? 0])),
      )
    }
  }, [stocks.data])

  const handleSave = () => {
    updateStocks.mutate(
      { regionId, data: form as StockHumanitaireInput },
      {
        onSuccess: () => toast.success('Stocks mis à jour.'),
        onError: () => toast.error('Impossible de mettre à jour les stocks.'),
      },
    )
  }

  const statutStyle = stocks.data ? STATUT_STYLE[stocks.data.statut_stock] ?? STATUT_STYLE.suffisant : undefined

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">
            Stocks humanitaires
          </h1>
          <p className="page-subtitle">
            Inventaire RUTF / RUSF / micronutriments par région
          </p>
        </div>
        <select
          value={regionId}
          onChange={(e) => setRegionId(e.target.value)}
          className="text-sm px-3 py-2 rounded-xl border bg-transparent"
          style={{ borderColor: 'var(--stroke-dark)', color: 'var(--texte-black)' }}
        >
          {REGIONS.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {stocks.isLoading && <SkeletonCards count={3} height={92} />}
      {stocks.isError && <ErrorState onRetry={() => stocks.refetch()} />}

      {stocks.data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div
              className="rounded-2xl border p-5"
              style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
            >
              <p className="text-xs mb-1" style={{ color: 'var(--texte-gray)' }}>Statut global</p>
              <span
                className="text-sm font-semibold px-2.5 py-1 rounded-full capitalize"
                style={{ backgroundColor: statutStyle?.bg, color: statutStyle?.text }}
              >
                {stocks.data.statut_stock}
              </span>
            </div>
            <div
              className="rounded-2xl border p-5"
              style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
            >
              <p className="text-xs mb-1" style={{ color: 'var(--texte-gray)' }}>Couverture SAM</p>
              <p className="text-lg font-bold" style={{ color: 'var(--texte-extra-black)' }}>{stocks.data.jours_couverture_sam} jours</p>
            </div>
            <div
              className="rounded-2xl border p-5"
              style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
            >
              <p className="text-xs mb-1" style={{ color: 'var(--texte-gray)' }}>Couverture MAM</p>
              <p className="text-lg font-bold" style={{ color: 'var(--texte-extra-black)' }}>{stocks.data.jours_couverture_mam} jours</p>
            </div>
          </div>

          {(stocks.data.statut_stock === 'critique' || stocks.data.statut_stock === 'rupture') && (
            <div
              className="rounded-xl p-3 flex items-center gap-2"
              style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
            >
              <AlertTriangle size={16} style={{ color: '#ef4444' }} />
              <p className="text-xs" style={{ color: '#b91c1c' }}>
                Niveau de stock critique — réapprovisionnement urgent recommandé.
              </p>
            </div>
          )}

          <div
            className="rounded-2xl border p-5"
            style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>
                Mettre à jour l'inventaire
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {STOCK_FIELDS.map((f) => (
                <label key={f.key} className="text-xs" style={{ color: 'var(--texte-gray)' }}>
                  {f.label} ({f.unit})
                  <input
                    type="number"
                    min={0}
                    value={form[f.key] ?? 0}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: Number(e.target.value) }))}
                    className="w-full mt-1 px-3 py-2 rounded-xl border text-sm"
                    style={{ borderColor: 'var(--stroke-dark)', color: 'var(--texte-black)' }}
                  />
                </label>
              ))}
            </div>

            <button
              onClick={handleSave}
              disabled={updateStocks.isPending}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl text-white"
              style={{ background: 'linear-gradient(135deg, #023047 0%, #206ebb 100%)', color: '#ffffff' }}
            >
              {updateStocks.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Enregistrer l'inventaire
            </button>
          </div>
        </>
      )}
    </div>
  )
}
