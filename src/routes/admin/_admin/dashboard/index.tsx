import { createFileRoute } from '@tanstack/react-router'
import { AlertTriangle, Thermometer, Droplets, Wind, TrendingUp, Users, FileText, Bell, Leaf, ArrowRight, Activity } from 'lucide-react'
import { Region } from '#/shared/constants'

export const Route = createFileRoute('/admin/_admin/dashboard/')({
  component: RouteComponent,
})

const MOCK_STATS = {
  malariaCases: 736,
  activeAlerts: 1423,
  heatIndex: '30°C',
  csbOverload: 32,
}

const MOCK_ALERTS = [
  { id: 1, region: Region.Analamanga, type: 'disease', message: 'Augmentation des cas de paludisme signalée', severity: 'high', time: 'Il y a 2h', agent: 'Agent Rabe' },
  { id: 2, region: Region.Boeny, type: 'climate', message: 'Vague de chaleur prévue (>35°C)', severity: 'medium', time: 'Il y a 4h', agent: 'Agent Koto' },
  { id: 3, region: Region.Diana, type: 'food', message: 'Risque de pénurie de riz dans 3 communes', severity: 'high', time: 'Il y a 6h', agent: 'Agent Vola' },
  { id: 4, region: Region.Atsinanana, type: 'disease', message: 'Cas de choléra détectés près des rivières', severity: 'high', time: 'Il y a 8h', agent: 'Agent Tiana' },
  { id: 5, region: Region.Menabe, type: 'food', message: 'Sécheresse prolongée impactant les cultures', severity: 'medium', time: 'Il y a 12h', agent: 'Agent Niry' },
]

const MOCK_REGION_STATUS = [
  { region: 'Analamanga', cases: 183, trend: 'up', temp: '28°C', status: 'critique' },
  { region: 'Boeny', cases: 97, trend: 'up', temp: '36°C', status: 'alerte' },
  { region: 'Diana', cases: 54, trend: 'down', temp: '31°C', status: 'stable' },
  { region: 'Atsinanana', cases: 121, trend: 'up', temp: '27°C', status: 'critique' },
  { region: 'Sofia', cases: 43, trend: 'stable', temp: '29°C', status: 'stable' },
]

const MOCK_FOOD_SUGGESTIONS = [
  { crop: 'Manioc', reason: 'Résistant à la sécheresse — adapté aux prévisions climatiques de Menabe et Androy.', icon: '🌿' },
  { crop: 'Sorgho', reason: 'Culture à cycle court. Recommandé pour le nord en période de forte chaleur.', icon: '🌾' },
  { crop: 'Patate douce', reason: 'Bonne valeur nutritive, croissance rapide, idéale pour zones inondables.', icon: '🍠' },
]

const SEVERITY_COLORS: Record<string, string> = {
  high: '#ef4444',
  medium: '#f97316',
  low: '#eab308',
}

const SEVERITY_BG: Record<string, string> = {
  high: '#fef2f2',
  medium: '#fff7ed',
  low: '#fefce8',
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  critique: { bg: '#fef2f2', text: '#ef4444' },
  alerte: { bg: '#fff7ed', text: '#f97316' },
  stable: { bg: '#f0fdf4', text: '#22c55e' },
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  disease: <Activity className="w-4 h-4" />,
  climate: <Thermometer className="w-4 h-4" />,
  food: <Leaf className="w-4 h-4" />,
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
  return (
    <div className="space-y-6 pb-8">
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
          <span className="text-white text-sm font-medium">{MOCK_STATS.activeAlerts} alertes actives</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Activity className="w-5 h-5" />}
          label="Cas de paludisme"
          value={MOCK_STATS.malariaCases}
          color="#ef4444"
        />
        <StatCard
          icon={<Bell className="w-5 h-5" />}
          label="Alertes actives"
          value={MOCK_STATS.activeAlerts}
          color="#f97316"
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Surcharge CSB"
          value={MOCK_STATS.csbOverload}
          color="#8b5cf6"
        />
        <StatCard
          icon={<Thermometer className="w-5 h-5" />}
          label="Indice de chaleur"
          value={MOCK_STATS.heatIndex}
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
            <button className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--primary2)' }}>
              Voir tout <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--stroke-dark)' }}>
            {MOCK_ALERTS.map(alert => (
              <div key={alert.id} className="p-4 flex items-start gap-3 hover:bg-gray-50/50 transition-colors">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    backgroundColor: SEVERITY_BG[alert.severity],
                    color: SEVERITY_COLORS[alert.severity]
                  }}
                >
                  {TYPE_ICONS[alert.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--texte-extra-black)' }}>
                    {alert.message}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--texte-gray)' }}>
                    {alert.region} · {alert.agent} · {alert.time}
                  </p>
                </div>
                <span
                  className="text-xs font-medium px-2 py-1 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: SEVERITY_BG[alert.severity],
                    color: SEVERITY_COLORS[alert.severity]
                  }}
                >
                  {alert.severity === 'high' ? 'Critique' : alert.severity === 'medium' ? 'Moyen' : 'Bas'}
                </span>
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
              <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>Statut par région</h2>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--stroke-dark)' }}>
              {MOCK_REGION_STATUS.map(r => (
                <div key={r.region} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--texte-extra-black)' }}>{r.region}</p>
                    <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>{r.cases} cas · {r.temp}</p>
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                    style={{ backgroundColor: STATUS_COLORS[r.status]?.bg, color: STATUS_COLORS[r.status]?.text }}
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Food suggestions */}
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
          >
            <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: 'var(--stroke-dark)' }}>
              <Leaf className="w-5 h-5 text-green-500" />
              <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>Cultures recommandées</h2>
            </div>
            <div className="p-4 space-y-3">
              {MOCK_FOOD_SUGGESTIONS.map(s => (
                <div
                  key={s.crop}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: 'var(--background-gray-color)' }}
                >
                  <span className="text-xl">{s.icon}</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--texte-extra-black)' }}>{s.crop}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--texte-gray)' }}>{s.reason}</p>
                  </div>
                </div>
              ))}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Thermometer className="w-5 h-5" />, label: 'Température moy.', value: '30°C', sub: '+2°C vs normale', color: '#ef4444' },
            { icon: <Droplets className="w-5 h-5" />, label: 'Humidité moy.', value: '68%', sub: 'Saison sèche', color: '#0ea5e9' },
            { icon: <Wind className="w-5 h-5" />, label: 'Vent moyen', value: '15 km/h', sub: 'Nord-Est', color: '#8b5cf6' },
            { icon: <FileText className="w-5 h-5" />, label: 'Rapports ce mois', value: '247', sub: '+18% vs mois dernier', color: '#22c55e' },
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
                <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
