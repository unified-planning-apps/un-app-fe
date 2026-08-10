import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertTriangle, Thermometer, Droplets, Wind, TrendingUp, Users, FileText, Bell, ArrowRight, Activity, Check, Loader2 } from 'lucide-react'
import { useMalariaAlerts, useAcknowledgeMalariaAlert } from '#/hooks/use-malaria'
import { useNutritionAlerts } from '#/hooks/use-nutrition'
import { useMalariaRiskMap } from '#/hooks/use-malaria'
import { useNutritionRiskMap } from '#/hooks/use-nutrition'
import { useNationalWeatherSummary } from '#/hooks/use-weather'
import { getRegionName } from '#/lib/regions'
import { EmptyState } from '#/components/ui-states'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/_admin/dashboard/')({
  component: RouteComponent,
})

const SEVERITY_COLORS: Record<string, string> = {
  crise: '#ef4444',
  urgence: '#ef4444',
  alerte: '#f97316',
  surveillance: '#eab308',
}

const SEVERITY_BG: Record<string, string> = {
  crise: '#fef2f2',
  urgence: '#fef2f2',
  alerte: '#fff7ed',
  surveillance: '#fefce8',
}

const NIVEAU_RISQUE_STYLE: Record<string, { bg: string; text: string }> = {
  faible: { bg: '#f0fdf4', text: '#22c55e' },
  moyen: { bg: '#fff7ed', text: '#f97316' },
  'élevé': { bg: '#fef2f2', text: '#ef4444' },
  'très élevé': { bg: '#fef2f2', text: '#b91c1c' },
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 border"
      style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}18`, color }}
        >
          {icon}
        </div>
      </div>
      <div>
        <p className="text-xs font-medium mb-1" style={{ color: 'var(--texte-gray)' }}>{label}</p>
        <p className="text-2xl font-bold" style={{ color: 'var(--texte-extra-black)' }}>{value}</p>
      </div>
    </div>
  )
}

function RouteComponent() {
  const malariaAlerts = useMalariaAlerts()
  const nutritionAlerts = useNutritionAlerts()
  const malariaRiskMap = useMalariaRiskMap()
  const nutritionRiskMap = useNutritionRiskMap()
  const weatherSummary = useNationalWeatherSummary()
  const acknowledge = useAcknowledgeMalariaAlert()

  const allAlerts = [
    ...(malariaAlerts.data ?? []).map((a) => ({ ...a, domaine: 'paludisme' as const })),
    ...(nutritionAlerts.data ?? []).map((a) => ({ ...a, domaine: 'nutrition' as const })),
  ]
    .sort((a, b) => new Date(b.date_detection).getTime() - new Date(a.date_detection).getTime())
    .slice(0, 6)

  const totalActiveAlerts = (malariaAlerts.data?.length ?? 0) + (nutritionAlerts.data?.length ?? 0)

  const topRiskRegions = (malariaRiskMap.data?.carte ?? [])
    .slice()
    .sort((a, b) => b.score_risque - a.score_risque)
    .slice(0, 5)

  const _regions = weatherSummary.data?.regions ?? []
  const avgTemp = _regions.length > 0
    ? _regions.reduce((sum, r) => sum + (r.temperature_c ?? 0), 0) /
      Math.max(1, _regions.filter((r) => r.temperature_c !== undefined).length)
    : undefined
  const avgHumidity = _regions.length > 0
    ? _regions.reduce((sum, r) => sum + (r.humidite_pct ?? 0), 0) /
      Math.max(1, _regions.filter((r) => r.humidite_pct !== undefined).length)
    : undefined

  const nutritionCrisisCount = (nutritionRiskMap.data?.carte ?? []).filter(
    (r) => (r.gam_actuel_pct ?? 0) >= 15,
  ).length

  return (
    <div className="space-y-8 pb-10">
      {/* Hero — brand gradient, alert status always visible */}
      <div
        className="rounded-2xl p-6 sm:p-7 flex items-center justify-between gap-4 flex-wrap relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #023047 0%, #206ebb 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 85% 30%, white 0%, transparent 55%)' }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#ffffff" }}>Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.75)" }}>
            Overview of the health and climate situation in Madagascar
          </p>
        </div>
        <div
          className="relative z-10 flex items-center gap-2.5 rounded-full px-4 py-2 flex-shrink-0 bg-white/15 backdrop-blur-sm"
          role="status"
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: totalActiveAlerts > 0 ? '#fb923c' : '#4ade80' }}
            aria-hidden="true"
          />
          <Bell className="w-4 h-4" style={{ color: "#ffffff" }} aria-hidden="true" />
          <span className="text-sm font-semibold" style={{ color: "#ffffff" }}>
            {totalActiveAlerts > 0
              ? `${totalActiveAlerts} alerte${totalActiveAlerts > 1 ? 's' : ''} active${totalActiveAlerts > 1 ? 's' : ''}`
              : 'No active alerts'}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={<Activity className="w-5 h-5" />}
          label="High-risk regions (malaria)"
          value={(malariaRiskMap.data?.carte ?? []).filter((r) => r.niveau_risque === 'élevé' || r.niveau_risque === 'très élevé').length}
          color="#ef4444"
        />
        <StatCard
          icon={<Bell className="w-5 h-5" />}
          label="Active alerts"
          value={totalActiveAlerts}
          color="#f97316"
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Regions in nutritional crisis"
          value={nutritionCrisisCount}
          color="#8b5cf6"
        />
        <StatCard
          icon={<Thermometer className="w-5 h-5" />}
          label="Average temperature"
          value={avgTemp !== undefined ? `${avgTemp.toFixed(1)}°C` : '—'}
          color="#0ea5e9"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Alerts */}
        <div
          className="lg:col-span-2 rounded-2xl border overflow-hidden"
          style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
        >
          <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--stroke-dark)' }}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>Recent alerts</h2>
            </div>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--stroke-dark)' }}>
            {allAlerts.length === 0 && (
              <EmptyState
                icon={<Bell size={20} />}
                title="No active alerts"
                description="All 23 regions are under continuous surveillance. New malaria and nutrition alerts will appear here."
              />
            )}
            {allAlerts.map((alert) => (
              <div key={alert.alerte_id} className="p-5 flex items-start gap-3 hover:bg-gray-50/50 transition-colors">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    backgroundColor: SEVERITY_BG[alert.severite] ?? SEVERITY_BG.surveillance,
                    color: SEVERITY_COLORS[alert.severite] ?? SEVERITY_COLORS.surveillance,
                  }}
                >
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--texte-extra-black)' }}>
                    {alert.description}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--texte-gray)' }}>
                    {alert.region_name} · {alert.domaine} · {new Date(alert.date_detection).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <span
                  className="text-xs font-medium px-2 py-1 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: SEVERITY_BG[alert.severite] ?? SEVERITY_BG.surveillance,
                    color: SEVERITY_COLORS[alert.severite] ?? SEVERITY_COLORS.surveillance,
                  }}
                >
                  {alert.severite}
                </span>
                {alert.domaine === 'paludisme' && alert.statut === 'active' && (
                  <button
                    onClick={() =>
                      acknowledge.mutate(
                        { alerteId: alert.alerte_id },
                        {
                          onSuccess: () => toast.success('Alert acknowledged.'),
                          onError: () => toast.error("Unable to acknowledge the alert."),
                        },
                      )
                    }
                    disabled={acknowledge.isPending}
                    title="Acknowledge cette alerte"
                    className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 border transition-colors hover:opacity-80"
                    style={{ borderColor: 'var(--stroke-dark)', color: 'var(--texte-gray)' }}
                  >
                    {acknowledge.isPending ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                    Acknowledge
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Region status */}
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
          >
            <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: 'var(--stroke-dark)' }}>
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>Highest-risk regions</h2>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--stroke-dark)' }}>
              {topRiskRegions.map((r) => {
                const style = NIVEAU_RISQUE_STYLE[r.niveau_risque] ?? NIVEAU_RISQUE_STYLE.moyen
                return (
                  <Link
                    key={r.region_id}
                    to="/admin/regions/$id/insight/ai"
                    params={{ id: r.region_id }}
                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50 transition-colors"
                  >
                    <span className="flex flex-col">
                      <span className="text-sm font-medium" style={{ color: 'var(--texte-extra-black)' }}>{r.region_name}</span>
                      <span className="text-xs" style={{ color: 'var(--texte-gray)' }}>{r.cas_prevus_14j} cases predicted (14d)</span>
                    </span>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize flex-shrink-0"
                      style={{ backgroundColor: style.bg, color: style.text }}
                    >
                      {r.niveau_risque}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Climate overview strip */}
      <div
        className="rounded-2xl border p-5"
        style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Wind className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>National climate conditions</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {[
            { icon: <Thermometer className="w-5 h-5" />, label: 'Avg. temperature', value: avgTemp !== undefined ? `${avgTemp.toFixed(1)}°C` : '—', color: '#ef4444' },
            { icon: <Droplets className="w-5 h-5" />, label: 'Avg. humidity', value: avgHumidity !== undefined ? `${avgHumidity.toFixed(0)}%` : '—', color: '#0ea5e9' },
            { icon: <FileText className="w-5 h-5" />, label: 'Monitored regions', value: _regions.length || 23, color: '#22c55e' },
          ].map(item => (
            <div
              key={item.label}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ backgroundColor: 'var(--background-gray-color)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${item.color}18`, color: item.color }}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>{item.label}</p>
                <p className="text-lg font-bold" style={{ color: 'var(--texte-extra-black)' }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
