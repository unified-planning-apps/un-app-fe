import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertTriangle, Thermometer, Droplets, Wind, TrendingUp, Users, FileText, Bell, ArrowRight, Activity, Check, Loader2 } from 'lucide-react'
import { useMalariaAlerts, useAcknowledgeMalariaAlert } from '#/hooks/use-malaria'
import { useNutritionAlerts } from '#/hooks/use-nutrition'
import { useMalariaRiskMap } from '#/hooks/use-malaria'
import { useNutritionRiskMap } from '#/hooks/use-nutrition'
import { useNationalWeatherSummary } from '#/hooks/use-weather'
import { getRegionName } from '#/lib/regions'
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

  const avgTemp = weatherSummary.data
    ? weatherSummary.data.regions.reduce((sum, r) => sum + (r.temperature_c ?? 0), 0) /
      Math.max(1, weatherSummary.data.regions.filter((r) => r.temperature_c !== undefined).length)
    : undefined
  const avgHumidity = weatherSummary.data
    ? weatherSummary.data.regions.reduce((sum, r) => sum + (r.humidite_pct ?? 0), 0) /
      Math.max(1, weatherSummary.data.regions.filter((r) => r.humidite_pct !== undefined).length)
    : undefined

  const nutritionCrisisCount = (nutritionRiskMap.data?.carte ?? []).filter(
    (r) => (r.gam_actuel_pct ?? 0) >= 15,
  ).length

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome banner */}
      <div
        className="rounded-2xl p-6 flex items-center justify-between overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary2) 100%)' }}
      >
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 60%)'
        }} />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Fraunces, serif' }}>
            Tableau de bord
          </h1>
          <p className="text-sm text-white/70">Vue d'ensemble de la situation sanitaire et climatique à Madagascar</p>
        </div>
        <div className="relative z-10 flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2">
          <Bell className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-medium">{totalActiveAlerts} alertes actives</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={<Activity className="w-5 h-5" />}
          label="Régions en risque élevé (paludisme)"
          value={(malariaRiskMap.data?.carte ?? []).filter((r) => r.niveau_risque === 'élevé' || r.niveau_risque === 'très élevé').length}
          color="#ef4444"
        />
        <StatCard
          icon={<Bell className="w-5 h-5" />}
          label="Alertes actives"
          value={totalActiveAlerts}
          color="#f97316"
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Régions en crise nutritionnelle"
          value={nutritionCrisisCount}
          color="#8b5cf6"
        />
        <StatCard
          icon={<Thermometer className="w-5 h-5" />}
          label="Température moyenne"
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
              <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>Alertes récentes</h2>
            </div>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--stroke-dark)' }}>
            {allAlerts.length === 0 && (
              <p className="p-5 text-sm" style={{ color: 'var(--texte-gray)' }}>Aucune alerte active pour le moment.</p>
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
                    {alert.region_name} · {alert.domaine} · {new Date(alert.date_detection).toLocaleDateString('fr-MG')}
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
                          onSuccess: () => toast.success('Alerte acquittée.'),
                          onError: () => toast.error("Impossible d'acquitter l'alerte."),
                        },
                      )
                    }
                    disabled={acknowledge.isPending}
                    title="Acquitter cette alerte"
                    className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 border transition-colors hover:opacity-80"
                    style={{ borderColor: 'var(--stroke-dark)', color: 'var(--texte-gray)' }}
                  >
                    {acknowledge.isPending ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                    Acquitter
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
              <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>Régions à plus haut risque</h2>
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
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--texte-extra-black)' }}>{r.region_name}</p>
                      <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>{r.cas_prevus_14j} cas prévus (14j)</p>
                    </div>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
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
          <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>Conditions climatiques nationales</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {[
            { icon: <Thermometer className="w-5 h-5" />, label: 'Température moy.', value: avgTemp !== undefined ? `${avgTemp.toFixed(1)}°C` : '—', color: '#ef4444' },
            { icon: <Droplets className="w-5 h-5" />, label: 'Humidité moy.', value: avgHumidity !== undefined ? `${avgHumidity.toFixed(0)}%` : '—', color: '#0ea5e9' },
            { icon: <FileText className="w-5 h-5" />, label: 'Régions surveillées', value: weatherSummary.data?.total ?? 22, color: '#22c55e' },
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
