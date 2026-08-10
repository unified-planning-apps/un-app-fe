import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Thermometer, Droplets, Wind, Leaf, AlertTriangle, TrendingUp, Activity, Sun, CloudRain, ChevronDown, Loader2 } from 'lucide-react'
import WeatherDetail from '#/components/WeatherDetail'
import { useCurrentWeather, useWeatherForecast } from '#/hooks/use-weather'
import { useCombinedPrediction, useShapExplanation } from '#/hooks/use-predictions'
import { useMalariaWeeklyTrend } from '#/hooks/use-malaria'
import { getRegionName } from '#/lib/regions'
import { SkeletonRows, SkeletonCards } from '#/components/ui-states'

export const Route = createFileRoute('/admin/_admin/regions/$id/insight/ai')({
  component: RouteComponent,
})

const PRIORITY_STYLE = { bg: '#fef2f2', text: '#ef4444', label: 'Prioritaire' }

function MiniBarChart({ data }: { data: Array<{ label: string; value: number }> }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((d, i) => (
        <div key={d.label} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-t-sm transition-all"
            style={{
              height: `${(d.value / max) * 56}px`,
              backgroundColor: i === data.length - 1 ? 'var(--primary2)' : 'var(--primary)',
              opacity: i === data.length - 1 ? 1 : 0.4,
            }}
          />
          <span className="text-xs" style={{ color: 'var(--texte-gray)' }}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}

function ShapPanel({ regionId, modele }: { regionId: string; modele: 'paludisme' | 'nutrition' }) {
  const [open, setOpen] = useState(false)
  const shap = useShapExplanation(open ? regionId : undefined, modele)

  return (
    <div className="border-t pt-3 mt-3" style={{ borderColor: 'var(--stroke-dark)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-xs font-semibold"
        style={{ color: 'var(--texte-extra-black)' }}
      >
        <span>SHAP detail — model {modele}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          {shap.isLoading && (
            <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--texte-gray)' }}>
              <Loader2 size={12} className="animate-spin" /> Loading explainability…
            </p>
          )}
          {shap.isError && (
            <p className="text-xs" style={{ color: '#ef4444' }}>Explainability unavailable for this region.</p>
          )}
          {shap.data && (
            <>
              <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>
                Predicted value: <strong>{shap.data.valeur_predite.toFixed(3)}</strong> (base: {shap.data.valeur_base.toFixed(3)})
              </p>
              <div className="space-y-1.5">
                {shap.data.features.map((f, i) => {
                  const pct = Math.min(100, Math.abs(f.contribution_pct ?? 0))
                  const positive = (f.shap_value ?? 0) >= 0
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs w-32 truncate flex-shrink-0" style={{ color: 'var(--texte-gray)' }}>{f.nom ?? `Factor ${i + 1}`}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: positive ? '#ef4444' : '#22c55e' }}
                        />
                      </div>
                      <span className="text-xs w-10 text-right flex-shrink-0" style={{ color: 'var(--texte-gray)' }}>
                        {f.contribution_pct?.toFixed(1) ?? '—'}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function RouteComponent() {
  const regionId = Route.useParams().id
  const displayName = getRegionName(regionId)

  const weather    = useCurrentWeather(regionId)
  const forecast   = useWeatherForecast(regionId, 7)
  const prediction = useCombinedPrediction(regionId)
  const weeklyTrend = useMalariaWeeklyTrend(regionId, 8)

  const chartData = (weeklyTrend.data?.data ?? []).slice(-7).map((d: any, i: number) => ({
    label: `W${d.semaine_epidemio ?? i + 1}`,
    value: d.cas_confirmes ?? 0,
  }))

  return (
    <div className="space-y-8 pb-10">
      {/* Climate cards */}
      <div>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--texte-extra-black)' }}>
          <Sun className="w-4 h-4" style={{ color: 'var(--primary2)' }} />
          Current climate conditions — {displayName}
        </h2>
        {weather.isLoading && <SkeletonCards count={4} height={96} />}
        {weather.data && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <WeatherDetail name="Temperature" description={weather.data.description} value={`${weather.data.temperature_c}°C`} icon={<Thermometer className="w-4 h-4" />} color="#ef4444" />
            <WeatherDetail name="Humidity"    description="Relative"               value={`${weather.data.humidite_pct}%`}      icon={<Droplets className="w-4 h-4" />}    color="#0ea5e9" />
            <WeatherDetail name="Rainfall"    description="Precipitation"          value={`${weather.data.precipitations_mm}mm`} icon={<CloudRain className="w-4 h-4" />}   color="#6366f1" />
            <WeatherDetail name="Wind"        description="Average speed"          value={`${weather.data.vent_kmh} km/h`}       icon={<Wind className="w-4 h-4" />}        color="#8b5cf6" />
          </div>
        )}
      </div>

      {/* 7-day forecast */}
      <div>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--texte-extra-black)' }}>
          <CloudRain className="w-4 h-4" style={{ color: 'var(--primary2)' }} />
          7-day forecast
        </h2>
        {forecast.isLoading && <SkeletonRows rows={1} height={92} />}
        {forecast.data && (
          <>
            {(forecast.data.alerte_cyclone || forecast.data.alerte_secheresse || forecast.data.alerte_inondation) && (
              <div className="rounded-xl p-3 flex items-center gap-2 mb-3" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                <AlertTriangle size={16} style={{ color: '#ef4444' }} />
                <p className="text-xs" style={{ color: '#b91c1c' }}>
                  {[
                    forecast.data.alerte_cyclone    && 'Cyclone alert',
                    forecast.data.alerte_secheresse && 'Drought alert',
                    forecast.data.alerte_inondation && 'Flood alert',
                  ].filter(Boolean).join(' · ')}
                </p>
              </div>
            )}
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
              {(forecast.data.previsions ?? []).map((day) => (
                <div key={day.date} className="rounded-xl border p-3 text-center" style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--texte-gray)' }}>
                    {new Date(day.date).toLocaleDateString('en-GB', { weekday: 'short' })}
                  </p>
                  <p className="text-sm font-bold" style={{ color: 'var(--texte-extra-black)' }}>{Math.round(day.temperature_max_c)}°</p>
                  <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>{Math.round(day.temperature_min_c)}°</p>
                  <p className="text-xs mt-1 flex items-center justify-center gap-0.5" style={{ color: '#0ea5e9' }}>
                    <Droplets size={10} /> {Math.round(day.precipitations_prob_pct)}%
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Combined risk */}
        <div className="lg:col-span-2 rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}>
          <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: 'var(--stroke-dark)' }}>
            <Activity className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>Health risks — Combined ML prediction</h2>
          </div>
          <div className="p-5 space-y-4">
            {prediction.isLoading && <SkeletonRows rows={3} height={22} />}
            {prediction.data && (
              <>
                {[
                  { label: 'Malaria',    risk: prediction.data.score_paludisme, color: '#ef4444', modele: 'paludisme'  as const },
                  { label: 'Nutrition',  risk: prediction.data.score_nutrition, color: '#eab308', modele: 'nutrition'  as const },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium" style={{ color: 'var(--texte-extra-black)' }}>{item.label}</span>
                      <span className="text-sm font-bold" style={{ color: item.color }}>{Math.round(item.risk * 100)}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${item.risk * 100}%`, backgroundColor: item.color }} />
                    </div>
                    <ShapPanel regionId={regionId} modele={item.modele} />
                  </div>
                ))}
                <div className="pt-2">
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--texte-extra-black)' }}>Priority recommendations</p>
                  <ul className="space-y-1.5">
                    {(prediction.data.recommandations_prioritaires ?? []).map((rec, i) => (
                      <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--texte-gray)' }}>
                        <span className="mt-0.5">•</span> {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Weekly trend */}
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}>
          <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: 'var(--stroke-dark)' }}>
            <TrendingUp className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>Malaria cases — trend</h2>
          </div>
          <div className="p-5">
            <div className="mb-4">
              <p className="text-3xl font-bold" style={{ color: 'var(--texte-extra-black)' }}>{weeklyTrend.data?.total_cas_periode ?? '—'}</p>
              <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>confirmed cases over the period</p>
            </div>
            {chartData.length > 0 && <MiniBarChart data={chartData} />}
          </div>
          {prediction.data && prediction.data.niveau_alerte_global !== 'vert' && (
            <div className="px-5 pb-5">
              <div className="rounded-xl p-3 flex items-start gap-2" style={{ backgroundColor: '#fef2f215', border: '1px solid #fef2f2' }}>
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: prediction.data.couleur_carte }} />
                <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>
                  Overall alert level: <strong>{prediction.data.niveau_alerte_global}</strong>. Intervention recommended.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Risk factors detail */}
      {prediction.data && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}>
          <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: 'var(--stroke-dark)' }}>
            <Leaf className="w-5 h-5 text-green-500" />
            <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>Main risk factors</h2>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--stroke-dark)' }}>
            {(prediction.data.top_facteurs_risque ?? []).length === 0 && (
              <p className="p-4 text-xs" style={{ color: 'var(--texte-gray)' }}>No detailed factors available.</p>
            )}
            {(prediction.data.top_facteurs_risque ?? []).map((f, i) => (
              <div key={i} className="p-5 flex items-start gap-3">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: PRIORITY_STYLE.bg, color: PRIORITY_STYLE.text }}>
                  {f.modele ?? 'factor'}
                </span>
                <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>
                  {f.nom ?? 'Factor'} — contribution {f.contribution_pct?.toFixed(1) ?? '—'}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}