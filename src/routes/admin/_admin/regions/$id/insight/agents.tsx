import { useAuthStore } from '#/stores/auth-store'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { MapPin, Phone, Mail, Activity, FileText, CheckCircle, Clock, Send } from 'lucide-react'
import { getRegionName } from '#/lib/regions'

export const Route = createFileRoute('/admin/_admin/regions/$id/insight/agents')({
  beforeLoad: () => {
    if (typeof window === 'undefined') return
    const role = useAuthStore.getState().user?.role ?? 'viewer'
    if (role === 'viewer') {
      throw redirect({ to: '/admin/regions' })
    }
  },
  component: RouteComponent,
})

// Field-agent role (terrain staff), distinct from the platform's auth Role
// (admin/national/regional/viewer in #/shared/constants). The backend has
// no "field agents" endpoint yet, so this stays mock data.
type FieldAgentRole = 'agent' | 'supervisor'

interface Agent {
  id: number
  name: string
  initials: string
  email: string
  phone: string
  role: FieldAgentRole
  regionId: string
  status: 'active' | 'inactive' | 'offline'
  reportsCount: number
  lastReport: string
  alertsCount: number
  resolvedCount: number
}

function makeAgents(regionId: string): Agent[] {
  return [
    { id: 1, name: 'Rabe Jean', initials: 'RJ', email: 'rabe.jean@healthshield.mg', phone: '+261 32 11 234 56', role: 'agent', regionId, status: 'active', reportsCount: 47, lastReport: '2025-05-12', alertsCount: 18, resolvedCount: 14 },
    { id: 2, name: 'Vola Ratsima', initials: 'VR', email: 'vola.ratsima@healthshield.mg', phone: '+261 33 44 567 89', role: 'agent', regionId, status: 'active', reportsCount: 31, lastReport: '2025-05-12', alertsCount: 12, resolvedCount: 10 },
    { id: 3, name: 'Tiana Andry', initials: 'TA', email: 'tiana.andry@healthshield.mg', phone: '+261 34 55 678 90', role: 'agent', regionId, status: 'offline', reportsCount: 22, lastReport: '2025-05-10', alertsCount: 6, resolvedCount: 6 },
    { id: 4, name: 'Koto Mamy', initials: 'KM', email: 'koto.mamy@healthshield.mg', phone: '+261 32 66 789 01', role: 'supervisor', regionId, status: 'active', reportsCount: 38, lastReport: '2025-05-11', alertsCount: 9, resolvedCount: 7 },
    { id: 5, name: 'Niry Solo', initials: 'NS', email: 'niry.solo@healthshield.mg', phone: '+261 33 77 890 12', role: 'agent', regionId, status: 'inactive', reportsCount: 15, lastReport: '2025-05-05', alertsCount: 3, resolvedCount: 3 },
  ]
}

const AVATAR_COLORS = ['#023047', '#206ebb', '#0ea5e9', '#8b5cf6', '#ef4444']

const STATUS_CONFIG = {
  active: { label: 'Actif', color: '#22c55e', bg: '#f0fdf4', dot: '#22c55e' },
  inactive: { label: 'Inactif', color: '#f97316', bg: '#fff7ed', dot: '#f97316' },
  offline: { label: 'Hors ligne', color: '#6b7280', bg: '#f9fafb', dot: '#6b7280' },
}

function AgentCard({ agent, colorIndex }: { agent: Agent; colorIndex: number }) {
  const color = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length]
  const statusCfg = STATUS_CONFIG[agent.status]

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all hover:shadow-sm"
      style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
    >
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: color }}
              >
                {agent.initials}
              </div>
              <div
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                style={{ backgroundColor: statusCfg.dot }}
              />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--texte-extra-black)' }}>{agent.name}</p>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
              >
                {statusCfg.label}
              </span>
            </div>
          </div>
          <a
            href={`mailto:${agent.email}`}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border transition-all hover:opacity-80"
            style={{
              background: 'linear-gradient(135deg, #023047 0%, #206ebb 100%)',
              color: 'white',
              border: 'none',
            }}
          >
            <Send className="w-3 h-3" />
            Contacter
          </a>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--texte-gray)' }}>
            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{agent.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--texte-gray)' }}>
            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{agent.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--texte-gray)' }}>
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{getRegionName(agent.regionId)}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-3 border-t"
        style={{ borderColor: 'var(--stroke-dark)', backgroundColor: 'var(--background-gray-color)' }}
      >
        <div className="p-3 text-center border-r" style={{ borderColor: 'var(--stroke-dark)' }}>
          <div className="flex items-center justify-center mb-1">
            <FileText className="w-3.5 h-3.5" style={{ color: 'var(--primary2)' }} />
          </div>
          <p className="text-lg font-bold" style={{ color: 'var(--texte-extra-black)' }}>{agent.reportsCount}</p>
          <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>Rapports</p>
        </div>
        <div className="p-3 text-center border-r" style={{ borderColor: 'var(--stroke-dark)' }}>
          <div className="flex items-center justify-center mb-1">
            <Activity className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
          </div>
          <p className="text-lg font-bold" style={{ color: 'var(--texte-extra-black)' }}>{agent.alertsCount}</p>
          <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>Alertes</p>
        </div>
        <div className="p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
          </div>
          <p className="text-lg font-bold" style={{ color: 'var(--texte-extra-black)' }}>{agent.resolvedCount}</p>
          <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>Résolus</p>
        </div>
      </div>

      {/* Last report */}
      <div className="px-4 py-2.5 border-t" style={{ borderColor: 'var(--stroke-dark)' }}>
        <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--texte-gray)' }}>
          <Clock className="w-3 h-3" />
          Dernier rapport : {new Date(agent.lastReport).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
        </p>
      </div>
    </div>
  )
}

function RouteComponent() {
  const regionId = Route.useParams().id
  const agents = makeAgents(regionId)
  const activeCount = agents.filter(a => a.status === 'active').length
  const totalReports = agents.reduce((acc, a) => acc + a.reportsCount, 0)
  const totalAlerts = agents.reduce((acc, a) => acc + a.alertsCount, 0)

  return (
    <div className="space-y-7 pb-10">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-5">
        {[
          { label: 'Agents actifs', value: `${activeCount}/${agents.length}`, color: '#22c55e', icon: <Activity className="w-4 h-4" /> },
          { label: 'Rapports total', value: totalReports, color: 'var(--primary2)', icon: <FileText className="w-4 h-4" /> },
          { label: 'Alertes émises', value: totalAlerts, color: '#ef4444', icon: <Activity className="w-4 h-4" /> },
        ].map(item => (
          <div
            key={item.label}
            className="rounded-2xl border p-5"
            style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ backgroundColor: `${item.color}18`, color: item.color }}
            >
              {item.icon}
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--texte-extra-black)' }}>{item.value}</p>
            <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* Agent cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {agents.map((agent, i) => (
          <AgentCard key={agent.id} agent={agent} colorIndex={i} />
        ))}
      </div>
    </div>
  )
}
