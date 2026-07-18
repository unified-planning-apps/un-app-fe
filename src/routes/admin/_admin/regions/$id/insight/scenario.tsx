import { useAuthStore } from '#/stores/auth-store'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { FlaskConical, CloudRain, Sun, Coins, Play, Loader2 } from 'lucide-react'
import { useScenarioSimulation } from '#/hooks/use-predictions'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/_admin/regions/$id/insight/scenario')({
  beforeLoad: () => {
    if (typeof window === 'undefined') return
    const role = useAuthStore.getState().user?.role ?? 'viewer'
    if (role === 'viewer') {
      throw redirect({ to: '/admin/regions' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const regionId = Route.useParams().id
  const simulate = useScenarioSimulation()

  const [horizon, setHorizon] = useState(30)
  const [deltaTemp, setDeltaTemp] = useState(0)
  const [precipMultiplier, setPrecipMultiplier] = useState(1)
  const [cyclone, setCyclone] = useState(false)
  const [secheresse, setSecheresse] = useState(false)
  const [chocPrix, setChocPrix] = useState(0)

  const handleSimulate = () => {
    simulate.mutate(
      {
        region_id: regionId,
        horizon_jours: horizon,
        delta_temperature_c: deltaTemp,
        multiplicateur_precipitations: precipMultiplier,
        scenario_cyclone: cyclone,
        scenario_secheresse: secheresse,
        choc_prix_alimentaires_pct: chocPrix,
      },
      { onError: () => toast.error('La simulation a échoué.') },
    )
  }

  const result = simulate.data

  return (
    <div className="space-y-8 pb-10">
      <div
        className="rounded-2xl border p-5"
        style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>
            Simuler un scénario what-if
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <button
            onClick={() => { setCyclone(!cyclone); setSecheresse(false) }}
            className="flex items-center gap-2 p-3 rounded-xl border text-sm font-medium"
            style={cyclone
              ? { backgroundColor: '#eff6ff', borderColor: '#0ea5e9', color: '#0ea5e9' }
              : { borderColor: 'var(--stroke-dark)', color: 'var(--texte-gray)' }}
          >
            <CloudRain size={16} /> Cyclone tropical
          </button>
          <button
            onClick={() => { setSecheresse(!secheresse); setCyclone(false) }}
            className="flex items-center gap-2 p-3 rounded-xl border text-sm font-medium"
            style={secheresse
              ? { backgroundColor: '#fff7ed', borderColor: '#f97316', color: '#f97316' }
              : { borderColor: 'var(--stroke-dark)', color: 'var(--texte-gray)' }}
          >
            <Sun size={16} /> Sécheresse sévère
          </button>
        </div>

        {!cyclone && !secheresse && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <label className="text-xs" style={{ color: 'var(--texte-gray)' }}>
              Variation température ({deltaTemp > 0 ? '+' : ''}{deltaTemp}°C)
              <input
                type="range" min={-10} max={10} step={0.5} value={deltaTemp}
                onChange={(e) => setDeltaTemp(Number(e.target.value))}
                className="w-full mt-1"
              />
            </label>
            <label className="text-xs" style={{ color: 'var(--texte-gray)' }}>
              Multiplicateur précipitations (×{precipMultiplier})
              <input
                type="range" min={0} max={5} step={0.1} value={precipMultiplier}
                onChange={(e) => setPrecipMultiplier(Number(e.target.value))}
                className="w-full mt-1"
              />
            </label>
          </div>
        )}

        <label className="text-xs block mb-4" style={{ color: 'var(--texte-gray)' }}>
          <span className="flex items-center gap-1"><Coins size={13} /> Choc prix alimentaires ({chocPrix > 0 ? '+' : ''}{chocPrix}%)</span>
          <input
            type="range" min={-50} max={200} step={5} value={chocPrix}
            onChange={(e) => setChocPrix(Number(e.target.value))}
            className="w-full mt-1"
          />
        </label>

        <button
          onClick={handleSimulate}
          disabled={simulate.isPending}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl text-white"
          style={{ background: 'var(--gradient-brand)' }}
        >
          {simulate.isPending ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
          Lancer la simulation
        </button>
      </div>

      {result && (
        <div
          className="rounded-2xl border p-5"
          style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
        >
          <h3 className="font-semibold text-base mb-3" style={{ color: 'var(--texte-extra-black)' }}>Résultats</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--texte-black)' }}>{result.analyse_impact}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>Δ Risque paludisme</p>
              <p className="text-lg font-bold" style={{ color: result.delta_score_paludisme >= 0 ? '#ef4444' : '#22c55e' }}>
                {result.delta_score_paludisme >= 0 ? '+' : ''}{(result.delta_score_paludisme * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>Δ Risque nutrition</p>
              <p className="text-lg font-bold" style={{ color: result.delta_score_nutrition >= 0 ? '#ef4444' : '#22c55e' }}>
                {result.delta_score_nutrition >= 0 ? '+' : ''}{(result.delta_score_nutrition * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>Cas additionnels</p>
              <p className="text-lg font-bold" style={{ color: 'var(--texte-extra-black)' }}>{result.cas_additionnels_paludisme}</p>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>Enfants malnutris add.</p>
              <p className="text-lg font-bold" style={{ color: 'var(--texte-extra-black)' }}>{result.enfants_additionnels_malnutris}</p>
            </div>
          </div>
          {result.recommandations_scenario.length > 0 && (
            <ul className="space-y-1.5">
              {result.recommandations_scenario.map((r, i) => (
                <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--texte-gray)' }}>
                  <span className="mt-0.5">•</span> {r}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
