import { createFileRoute } from '@tanstack/react-router'
import { CloudRain, Droplets, Thermometer, AlertTriangle, RefreshCw } from 'lucide-react'
import { useNationalWeatherSummary, useActiveWeatherAnomalies } from '#/hooks/use-weather'
import { getRegionName } from '#/lib/regions'
import { SkeletonRows, ErrorState } from '#/components/ui-states'

export const Route = createFileRoute('/admin/_admin/weather/')({
  component: RouteComponent,
})

const ANOMALY_LABELS: Record<string, string> = {
  chaleur_extreme: 'Extreme heat',
  secheresse: 'Drought',
  inondation: 'Flooding',
  cyclone: 'Cyclone',
}

const SEVERITY_STYLE: Record<string, { bg: string; text: string }> = {
  faible: { bg: '#f0fdf4', text: '#22c55e' },
  moderee: { bg: '#fff7ed', text: '#f97316' },
  severe: { bg: '#fef2f2', text: '#ef4444' },
  extreme: { bg: '#fef2f2', text: '#b91c1c' },
}

function RouteComponent() {
  const summary = useNationalWeatherSummary()
  const anomalies = useActiveWeatherAnomalies()

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">
            National Weather
          </h1>
          <p className="page-subtitle">
            Current conditions across Madagascar's 23 regions
          </p>
        </div>
        <button
          onClick={() => summary.refetch()}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border"
          style={{ borderColor: 'var(--stroke-dark)', color: 'var(--texte-gray)' }}
        >
          <RefreshCw size={14} className={summary.isFetching ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Active anomalies */}
      {anomalies.data && anomalies.data.length > 0 && (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
        >
          <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: 'var(--stroke-dark)' }}>
            <AlertTriangle className="w-5 h-5" style={{ color: '#ef4444' }} />
            <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>
              Active climate anomalies
            </h2>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--stroke-dark)' }}>
            {anomalies.data.map((a, i) => {
              const sev = SEVERITY_STYLE[a.severite] ?? SEVERITY_STYLE.moderee
              return (
                <div key={`${a.region_id}-${i}`} className="p-5 flex items-start gap-3">
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: sev.bg, color: sev.text }}
                  >
                    {ANOMALY_LABELS[a.type_anomalie] ?? a.type_anomalie}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--texte-extra-black)' }}>
                      {getRegionName(a.region_id)} · {a.severite}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--texte-gray)' }}>{a.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* National grid */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
      >
        <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: 'var(--stroke-dark)' }}>
          <Thermometer className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>
            Current conditions by region
          </h2>
          {summary.data?.source && (
            <span className="text-xs ml-auto" style={{ color: 'var(--texte-gray)' }}>
              Source: {summary.data.source}
            </span>
          )}
        </div>

        {summary.isLoading && (
          <div className="p-6">
            <SkeletonRows rows={6} height={40} />
          </div>
        )}

        {summary.isError && (
          <ErrorState
            title="National Weather indisponible"
            description="The weather service did not respond. Please check the API is running and retry."
            onRetry={() => summary.refetch()}
          />
        )}

        {summary.data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ backgroundColor: 'var(--stroke-dark)' }}>
            {summary.data.regions.map((r) => (
              <div key={r.region_id} className="p-5" style={{ backgroundColor: 'var(--background-white-color)' }}>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--texte-extra-black)' }}>
                  {r.region_name}
                </p>
                {r.erreur ? (
                  <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>Data unavailable</p>
                ) : (
                  <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--texte-gray)' }}>
                    <span className="flex items-center gap-1">
                      <Thermometer size={13} /> {r.temperature_c}°C
                    </span>
                    <span className="flex items-center gap-1">
                      <Droplets size={13} /> {r.humidite_pct}%
                    </span>
                    <span className="flex items-center gap-1">
                      <CloudRain size={13} /> {r.precipitations_mm}mm
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
