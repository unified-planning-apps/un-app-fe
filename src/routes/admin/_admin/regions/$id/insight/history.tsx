import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { History, Thermometer, CloudRain } from 'lucide-react'
import { useWeatherHistory } from '#/hooks/use-weather'
import { SkeletonCards, ErrorState } from '#/components/ui-states'

export const Route = createFileRoute('/admin/_admin/regions/$id/insight/history')({
  component: RouteComponent,
})

function isoDaysAgo(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

function Chart({ data, dataKey, color, unit }: { data: any[]; dataKey: string; color: string; unit: string }) {
  const values = data.map((d) => d[dataKey] ?? 0)
  const max = Math.max(1, ...values)
  const min = Math.min(0, ...values)
  const range = max - min || 1

  return (
    <div className="flex items-end gap-0.5 h-24">
      {data.map((d, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all"
          title={`${d.date}: ${d[dataKey]}${unit}`}
          style={{
            height: `${Math.max(2, ((d[dataKey] - min) / range) * 88)}px`,
            backgroundColor: color,
            opacity: 0.3 + (i / data.length) * 0.7,
          }}
        />
      ))}
    </div>
  )
}

function RouteComponent() {
  const regionId = Route.useParams().id
  const [rangeDays, setRangeDays] = useState(30)

  const dateDebut = isoDaysAgo(rangeDays)
  const dateFin = isoDaysAgo(0)
  const history = useWeatherHistory(regionId, dateDebut, dateFin)

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--texte-extra-black)' }}>
          <History className="w-4 h-4" style={{ color: 'var(--primary2)' }} />
          Climate history
        </h2>
        <div className="flex items-center gap-1.5">
          {[14, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setRangeDays(d)}
              className="text-xs font-medium px-3 py-1.5 rounded-full border transition-all"
              style={rangeDays === d
                ? { backgroundColor: 'var(--primary)', color: 'white', borderColor: 'var(--primary)' }
                : { color: 'var(--texte-gray)', borderColor: 'var(--stroke-dark)' }}
            >
              {d}j
            </button>
          ))}
        </div>
      </div>

      {history.isLoading && <SkeletonCards count={2} height={180} />}
      {history.isError && (
        <ErrorState
          title="History unavailable"
          description="No climate data recorded for this period, or the service did not respond."
          onRetry={() => history.refetch()}
        />
      )}

      {history.data && history.data.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div
            className="rounded-2xl border p-5"
            style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Thermometer className="w-4 h-4" style={{ color: '#ef4444' }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--texte-extra-black)' }}>Average temperature (°C)</p>
            </div>
            <Chart data={history.data} dataKey="temperature_moy_c" color="#ef4444" unit="°C" />
          </div>
          <div
            className="rounded-2xl border p-5"
            style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <CloudRain className="w-4 h-4" style={{ color: '#0ea5e9' }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--texte-extra-black)' }}>Precipitation (mm)</p>
            </div>
            <Chart data={history.data} dataKey="precipitations_mm" color="#0ea5e9" unit="mm" />
          </div>
        </div>
      )}

      {history.data && history.data.length === 0 && (
        <p className="text-sm text-center py-8" style={{ color: 'var(--texte-gray)' }}>
          No historical data available for this period.
        </p>
      )}
    </div>
  )
}
