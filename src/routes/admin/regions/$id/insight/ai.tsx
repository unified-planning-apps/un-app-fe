import { createFileRoute } from '@tanstack/react-router'
import { Thermometer, Droplets, Wind, Leaf, AlertTriangle, TrendingUp, TrendingDown, Minus, Activity, Sun, CloudRain, Sprout } from 'lucide-react'

export const Route = createFileRoute('/admin/regions/$id/insight/ai')({
  component: RouteComponent,
})

const MOCK_CLIMATE = {
  temperature: { value: 30, unit: '°C', trend: 'up', delta: '+2.1°C', label: 'Température', normal: '27.9°C' },
  humidity: { value: 68, unit: '%', trend: 'down', delta: '-5%', label: 'Humidité', normal: '73%' },
  rainfall: { value: 12, unit: 'mm', trend: 'down', delta: '-40%', label: 'Pluviométrie', normal: '20mm' },
  windSpeed: { value: 15, unit: ' km/h', trend: 'stable', delta: '=', label: 'Vent', normal: '15 km/h' },
}

const MOCK_DISEASE_RISK = [
  { disease: 'Paludisme', risk: 82, trend: 'up', color: '#ef4444', reason: 'Température et humidité élevées favorisent la reproduction des moustiques.' },
  { disease: 'Choléra', risk: 45, trend: 'stable', color: '#f97316', reason: 'Risque modéré lié à la qualité des sources d\'eau en saison sèche.' },
  { disease: 'Malnutrition', risk: 61, trend: 'up', color: '#eab308', reason: 'Baisse de la pluviométrie impacte les rendements agricoles.' },
  { disease: 'Diarrhée infantile', risk: 38, trend: 'down', color: '#22c55e', reason: 'Amélioration de l\'hygiène signalée par les agents terrain.' },
]

const MOCK_FOOD_ALERTS = [
  { crop: 'Riz', status: 'risque', detail: 'Déficit pluviométrique de 40% — rendement estimé en baisse de 25%', icon: '🌾' },
  { crop: 'Maïs', status: 'stable', detail: 'Cultures en bon état, récolte prévue dans 3 semaines', icon: '🌽' },
  { crop: 'Manioc', status: 'bon', detail: 'Production normale, stocks suffisants pour 2 mois', icon: '🌿' },
]

const MOCK_RECOMMENDATIONS = [
  { title: 'Distribuer des moustiquaires', priority: 'urgent', category: 'santé', detail: 'Risque paludisme critique. Cibler les zones nord de la région.' },
  { title: 'Surveiller les points d\'eau', priority: 'moyen', category: 'santé', detail: 'Inspecter les puits et rivières pour prévenir la contamination.' },
  { title: 'Planter du sorgho', priority: 'urgent', category: 'alimentation', detail: 'Remplacer une partie des cultures de riz par du sorgho, plus résistant à la sécheresse.' },
  { title: 'Alerter les CSB sur surcharge', priority: 'moyen', category: 'infrastructure', detail: '3 centres de santé signalés surchargés dans la région.' },
]

const MOCK_WEEKLY_TREND = [
  { day: 'Lun', cases: 18 },
  { day: 'Mar', cases: 24 },
  { day: 'Mer', cases: 31 },
  { day: 'Jeu', cases: 28 },
  { day: 'Ven', cases: 35 },
  { day: 'Sam', cases: 29 },
  { day: 'Dim', cases: 41 },
]

const PRIORITY_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  urgent: { bg: '#fef2f2', text: '#ef4444', label: 'Urgent' },
  moyen: { bg: '#fff7ed', text: '#f97316', label: 'Moyen' },
  bas: { bg: '#f0fdf4', text: '#22c55e', label: 'Bas' },
}

const FOOD_STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  risque: { bg: '#fef2f2', text: '#ef4444', label: 'Risque' },
  stable: { bg: '#fff7ed', text: '#f97316', label: 'Stable' },
  bon: { bg: '#f0fdf4', text: '#22c55e', label: 'Bon' },
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5" />
  if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5" />
  return <Minus className="w-3.5 h-3.5" />
}

function ClimateCard({ data, icon, color }: {
  data: typeof MOCK_CLIMATE.temperature;
  icon: React.ReactNode;
  color: string;
}) {
  const trendColor = data.trend === 'up' ? '#ef4444' : data.trend === 'down' ? '#0ea5e9' : '#6b7280'

  return (
    <div
      className="rounded-2xl p-5 border"
      style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}18`, color }}
        >
          {icon}
        </div>
        <div
          className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
          style={{ backgroundColor: `${trendColor}15`, color: trendColor }}
        >
          <TrendIcon trend={data.trend} />
          {data.delta}
        </div>
      </div>
      <p className="text-xs mb-1" style={{ color: 'var(--texte-gray)' }}>{data.label}</p>
      <p className="text-2xl font-bold" style={{ color: 'var(--texte-extra-black)' }}>
        {data.value}{data.unit}
      </p>
      <p className="text-xs mt-1" style={{ color: 'var(--texte-gray)' }}>Normale : {data.normal}</p>
    </div>
  )
}

function MiniBarChart() {
  const max = Math.max(...MOCK_WEEKLY_TREND.map(d => d.cases))
  return (
    <div className="flex items-end gap-1.5 h-16">
      {MOCK_WEEKLY_TREND.map((d, i) => (
        <div key={d.day} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-t-sm transition-all"
            style={{
              height: `${(d.cases / max) * 56}px`,
              backgroundColor: i === MOCK_WEEKLY_TREND.length - 1 ? 'var(--primary2)' : 'var(--primary)',
              opacity: i === MOCK_WEEKLY_TREND.length - 1 ? 1 : 0.4,
            }}
          />
          <span className="text-xs" style={{ color: 'var(--texte-gray)' }}>{d.day}</span>
        </div>
      ))}
    </div>
  )
}

function RouteComponent() {
  const regionName = Route.useParams().id;
  const displayName = regionName.charAt(0).toUpperCase() + regionName.slice(1).replace(/-/g, ' ');

  return (
    <div className="space-y-6 pb-8">
      {/* Climate cards */}
      <div>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--texte-extra-black)' }}>
          <Sun className="w-4 h-4" style={{ color: 'var(--primary2)' }} />
          Conditions climatiques actuelles — {displayName}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ClimateCard data={MOCK_CLIMATE.temperature} icon={<Thermometer className="w-4 h-4" />} color="#ef4444" />
          <ClimateCard data={MOCK_CLIMATE.humidity} icon={<Droplets className="w-4 h-4" />} color="#0ea5e9" />
          <ClimateCard data={MOCK_CLIMATE.rainfall} icon={<CloudRain className="w-4 h-4" />} color="#6366f1" />
          <ClimateCard data={MOCK_CLIMATE.windSpeed} icon={<Wind className="w-4 h-4" />} color="#8b5cf6" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Disease risk */}
        <div
          className="lg:col-span-2 rounded-2xl border overflow-hidden"
          style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
        >
          <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: 'var(--stroke-dark)' }}>
            <Activity className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>
              Risques sanitaires — Analyse IA
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {MOCK_DISEASE_RISK.map(item => (
              <div key={item.disease}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--texte-extra-black)' }}>{item.disease}</span>
                    <div
                      className="flex items-center gap-0.5 text-xs"
                      style={{ color: item.trend === 'up' ? '#ef4444' : item.trend === 'down' ? '#22c55e' : '#6b7280' }}
                    >
                      <TrendIcon trend={item.trend} />
                    </div>
                  </div>
                  <span className="text-sm font-bold" style={{ color: item.color }}>{item.risk}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${item.risk}%`, backgroundColor: item.color }}
                  />
                </div>
                <p className="text-xs mt-1.5" style={{ color: 'var(--texte-gray)' }}>{item.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly trend */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
        >
          <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: 'var(--stroke-dark)' }}>
            <TrendingUp className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>Cas cette semaine</h2>
          </div>
          <div className="p-5">
            <div className="mb-4">
              <p className="text-3xl font-bold" style={{ color: 'var(--texte-extra-black)' }}>
                {MOCK_WEEKLY_TREND.reduce((a, b) => a + b.cases, 0)}
              </p>
              <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: '#ef4444' }}>
                <TrendingUp className="w-3 h-3" /> +23% vs semaine dernière
              </p>
            </div>
            <MiniBarChart />
          </div>
          <div className="px-5 pb-5">
            <div
              className="rounded-xl p-3 flex items-start gap-2"
              style={{ backgroundColor: '#fef2f215', border: '1px solid #fef2f2' }}
            >
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#ef4444' }} />
              <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>
                Tendance à la hausse. Intervention recommandée dans les 48h.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Food security */}
      <div>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--texte-extra-black)' }}>
          <Sprout className="w-4 h-4 text-green-500" />
          Sécurité alimentaire
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_FOOD_ALERTS.map(food => {
            const s = FOOD_STATUS_STYLE[food.status]
            return (
              <div
                key={food.crop}
                className="rounded-2xl border p-4"
                style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{food.icon}</span>
                    <span className="font-semibold" style={{ color: 'var(--texte-extra-black)' }}>{food.crop}</span>
                  </div>
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: s.bg, color: s.text }}
                  >
                    {s.label}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--texte-gray)' }}>{food.detail}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
      >
        <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: 'var(--stroke-dark)' }}>
          <Leaf className="w-5 h-5 text-green-500" />
          <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>
            Recommandations IA
          </h2>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--stroke-dark)' }}>
          {MOCK_RECOMMENDATIONS.map(rec => {
            const p = PRIORITY_STYLE[rec.priority]
            const catColors: Record<string, string> = { santé: '#0ea5e9', alimentation: '#22c55e', infrastructure: '#8b5cf6' }
            return (
              <div key={rec.title} className="p-4 flex items-start gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold" style={{ color: 'var(--texte-extra-black)' }}>{rec.title}</span>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: p.bg, color: p.text }}
                    >
                      {p.label}
                    </span>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${catColors[rec.category]}18`, color: catColors[rec.category] }}
                    >
                      {rec.category}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>{rec.detail}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
