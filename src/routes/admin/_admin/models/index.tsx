import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { Activity, AlertTriangle, RefreshCw, History, Layers, Loader2, Play } from 'lucide-react'
import { useModelHealth, useForceRetraining, useModelBacktest, useBatchPredictions } from '#/hooks/use-predictions'
import { useAuthStore } from '#/stores/auth-store'
import { REGIONS, getRegionName } from '#/lib/regions'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/_admin/models/')({
  beforeLoad: () => {
    if (typeof window === 'undefined') return
    const role = useAuthStore.getState().user?.role
    if (role !== 'admin' && role !== 'national') {
      throw redirect({ to: '/admin/dashboard' })
    }
  },
  component: RouteComponent,
})

const STATUT_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  optimal: { bg: '#f0fdf4', text: '#22c55e', label: 'Optimal' },
  surveillance: { bg: '#fff7ed', text: '#f97316', label: 'Surveillance' },
  retraining_requis: { bg: '#fef2f2', text: '#ef4444', label: 'Retraining requis' },
}

const NIVEAU_STYLE: Record<string, { bg: string; text: string }> = {
  faible: { bg: '#f0fdf4', text: '#22c55e' },
  moyen: { bg: '#fff7ed', text: '#f97316' },
  'élevé': { bg: '#fef2f2', text: '#ef4444' },
  'très élevé': { bg: '#fef2f2', text: '#b91c1c' },
}

function RouteComponent() {
  const isAdmin = useAuthStore((s) => s.user?.role === 'admin')
  const health = useModelHealth()
  const retrain = useForceRetraining()

  // Backtest
  const [backtestRegion, setBacktestRegion] = useState(REGIONS[0].id)
  const [backtestModele, setBacktestModele] = useState<'paludisme' | 'nutrition'>('paludisme')
  const backtest = useModelBacktest(backtestRegion, backtestModele, 6)

  // Batch predictions
  const [selectedRegions, setSelectedRegions] = useState<string[]>(REGIONS.slice(0, 5).map((r) => r.id))
  const batch = useBatchPredictions()

  const toggleRegion = (id: string) => {
    setSelectedRegions((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]))
  }

  const runBatch = () => {
    if (selectedRegions.length === 0) {
      toast.error('Sélectionnez au moins une région.')
      return
    }
    batch.mutate(
      { regions: selectedRegions, horizon_jours: 14, inclure_shap: false },
      { onError: () => toast.error('Le calcul par lot a échoué.') },
    )
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--texte-extra-black)', fontFamily: 'Fraunces, serif' }}>
            Santé des modèles ML
          </h1>
          <p className="text-sm" style={{ color: 'var(--texte-gray)' }}>
            Performance, dérive (PSI), backtest et calculs multi-régions
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() =>
              retrain.mutate('tous', {
                onSuccess: () => toast.success('Retraining lancé en arrière-plan.'),
                onError: () => toast.error('Impossible de lancer le retraining.'),
              })
            }
            disabled={retrain.isPending}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl text-white"
            style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary2) 100%)' }}
          >
            <RefreshCw size={14} className={retrain.isPending ? 'animate-spin' : ''} />
            Forcer le retraining
          </button>
        )}
      </div>

      {health.isLoading && (
        <p className="text-sm" style={{ color: 'var(--texte-gray)' }}>Chargement…</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {health.data?.map((m) => {
          const s = STATUT_STYLE[m.statut] ?? STATUT_STYLE.surveillance
          return (
            <div
              key={m.modele}
              className="rounded-2xl border p-5"
              style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity size={18} style={{ color: 'var(--primary)' }} />
                  <h3 className="font-semibold capitalize" style={{ color: 'var(--texte-extra-black)' }}>{m.modele}</h3>
                </div>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1"
                  style={{ backgroundColor: s.bg, color: s.text }}
                >
                  {m.statut === 'retraining_requis' && <AlertTriangle size={12} />}
                  {s.label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs" style={{ color: 'var(--texte-gray)' }}>
                <div>
                  <p className="opacity-70">Version</p>
                  <p className="font-semibold text-sm" style={{ color: 'var(--texte-extra-black)' }}>{m.version}</p>
                </div>
                <div>
                  <p className="opacity-70">Score de dérive (PSI)</p>
                  <p className="font-semibold text-sm" style={{ color: 'var(--texte-extra-black)' }}>{m.drift_score.toFixed(3)}</p>
                </div>
                <div>
                  <p className="opacity-70">Prédictions (7j)</p>
                  <p className="font-semibold text-sm" style={{ color: 'var(--texte-extra-black)' }}>{m.nb_predictions_7j}</p>
                </div>
                <div>
                  <p className="opacity-70">Entraîné le</p>
                  <p className="font-semibold text-sm" style={{ color: 'var(--texte-extra-black)' }}>
                    {m.date_entrainement ? new Date(m.date_entrainement).toLocaleDateString('fr-MG') : '—'}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Backtest */}
      <div
        className="rounded-2xl border p-5"
        style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>Backtest — performance historique</h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <select
            value={backtestRegion}
            onChange={(e) => setBacktestRegion(e.target.value)}
            className="text-sm px-3 py-2 rounded-xl border bg-transparent"
            style={{ borderColor: 'var(--stroke-dark)', color: 'var(--texte-black)' }}
          >
            {REGIONS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <select
            value={backtestModele}
            onChange={(e) => setBacktestModele(e.target.value as 'paludisme' | 'nutrition')}
            className="text-sm px-3 py-2 rounded-xl border bg-transparent"
            style={{ borderColor: 'var(--stroke-dark)', color: 'var(--texte-black)' }}
          >
            <option value="paludisme">Paludisme</option>
            <option value="nutrition">Nutrition</option>
          </select>
        </div>

        {backtest.isLoading && <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>Calcul du backtest…</p>}
        {backtest.data && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-5">
            {[
              { label: 'MAE', value: backtest.data.mae.toFixed(2) },
              { label: 'RMSE', value: backtest.data.rmse.toFixed(2) },
              { label: 'MAPE', value: `${backtest.data.mape_pct.toFixed(1)}%` },
              { label: 'Corrélation', value: backtest.data.correlation.toFixed(2) },
              { label: 'Biais', value: backtest.data.biais.toFixed(2) },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>{item.label}</p>
                <p className="text-lg font-bold" style={{ color: 'var(--texte-extra-black)' }}>{item.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Batch predictions */}
      <div
        className="rounded-2xl border p-5"
        style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>Calcul multi-régions</h2>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              onClick={() => toggleRegion(r.id)}
              className="text-xs font-medium px-2.5 py-1.5 rounded-full border transition-all"
              style={selectedRegions.includes(r.id)
                ? { backgroundColor: 'var(--primary)', color: 'white', borderColor: 'var(--primary)' }
                : { color: 'var(--texte-gray)', borderColor: 'var(--stroke-dark)' }}
            >
              {r.name}
            </button>
          ))}
        </div>
        <button
          onClick={runBatch}
          disabled={batch.isPending}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl text-white mb-4"
          style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary2) 100%)' }}
        >
          {batch.isPending ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
          Lancer ({selectedRegions.length} région{selectedRegions.length > 1 ? 's' : ''})
        </button>

        {batch.data && (
          <div className="divide-y" style={{ borderColor: 'var(--stroke-dark)' }}>
            {batch.data.predictions.map((p) => {
              const style = NIVEAU_STYLE[p.niveau_paludisme] ?? NIVEAU_STYLE.moyen
              return (
                <div key={p.region_id} className="py-3 flex items-center justify-between">
                  <p className="text-sm font-medium" style={{ color: 'var(--texte-extra-black)' }}>{getRegionName(p.region_id)}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: 'var(--texte-gray)' }}>
                      Composite : {(p.score_composite * 100).toFixed(0)}%
                    </span>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                      style={{ backgroundColor: style.bg, color: style.text }}
                    >
                      {p.niveau_paludisme}
                    </span>
                  </div>
                </div>
              )
            })}
            {batch.data.regions_erreur.length > 0 && (
              <p className="text-xs pt-2" style={{ color: '#ef4444' }}>
                Erreur pour : {batch.data.regions_erreur.join(', ')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
