import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AlertTriangle, MessageCircle, FileText, Filter, Search, Calendar, MapPin, User } from 'lucide-react'

export const Route = createFileRoute('/admin/regions/$id/insight/reports')({
  component: RouteComponent,
})

type ReportType = 'alert' | 'message' | 'other'

interface Report {
  id: number
  agentName: string
  agentAvatar: string
  region: string
  reportType: ReportType
  report: string
  date: string
  severity?: 'high' | 'medium' | 'low'
  status: 'pending' | 'reviewed' | 'resolved'
}

const MOCK_REPORTS: Report[] = [
  { id: 1, agentName: 'Rabe Jean', agentAvatar: 'RJ', region: 'Analamanga', reportType: 'alert', report: '17 nouveaux cas de paludisme dans la commune d\'Ambohidratrimo. Stocks de médicaments insuffisants au CSB.', date: '2025-05-12', severity: 'high', status: 'pending' },
  { id: 2, agentName: 'Vola Ratsima', agentAvatar: 'VR', region: 'Analamanga', reportType: 'alert', report: 'Vague de chaleur signalée — température dépasse 38°C dans 3 communes. Risque de coup de chaleur pour les enfants.', date: '2025-05-12', severity: 'high', status: 'reviewed' },
  { id: 3, agentName: 'Tiana Andry', agentAvatar: 'TA', region: 'Analamanga', reportType: 'message', report: 'Campagne de sensibilisation sur l\'hygiène complétée dans 5 fokontany. 240 ménages visités.', date: '2025-05-11', status: 'resolved' },
  { id: 4, agentName: 'Koto Mamy', agentAvatar: 'KM', region: 'Analamanga', reportType: 'alert', report: 'Pénurie de riz signalée dans le marché de Sabotsy Namehana. Prix a augmenté de 35% en 2 semaines.', date: '2025-05-11', severity: 'medium', status: 'pending' },
  { id: 5, agentName: 'Niry Solo', agentAvatar: 'NS', region: 'Analamanga', reportType: 'other', report: 'Rapport mensuel de suivi des indicateurs nutritionnels. 12 enfants en état de malnutrition aiguë identifiés.', date: '2025-05-10', status: 'reviewed' },
  { id: 6, agentName: 'Hery Rado', agentAvatar: 'HR', region: 'Analamanga', reportType: 'message', report: 'Réunion communautaire tenue à Antehiroka. Les habitants demandent plus d\'agents de terrain.', date: '2025-05-10', status: 'resolved' },
  { id: 7, agentName: 'Fara Lova', agentAvatar: 'FL', region: 'Analamanga', reportType: 'alert', report: '3 cas suspects de choléra près du fleuve Ikopa. Prélèvements envoyés au laboratoire central.', date: '2025-05-09', severity: 'high', status: 'pending' },
]

const TYPE_CONFIG: Record<ReportType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  alert: { label: 'Alerte', icon: <AlertTriangle className="w-3.5 h-3.5" />, color: '#ef4444', bg: '#fef2f2' },
  message: { label: 'Message', icon: <MessageCircle className="w-3.5 h-3.5" />, color: '#0ea5e9', bg: '#eff6ff' },
  other: { label: 'Rapport', icon: <FileText className="w-3.5 h-3.5" />, color: '#8b5cf6', bg: '#f5f3ff' },
}

const SEVERITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  high: { label: 'Critique', color: '#ef4444', bg: '#fef2f2' },
  medium: { label: 'Moyen', color: '#f97316', bg: '#fff7ed' },
  low: { label: 'Bas', color: '#22c55e', bg: '#f0fdf4' },
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'En attente', color: '#f97316', bg: '#fff7ed' },
  reviewed: { label: 'Traité', color: '#0ea5e9', bg: '#eff6ff' },
  resolved: { label: 'Résolu', color: '#22c55e', bg: '#f0fdf4' },
}

function AvatarCircle({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  )
}

const AVATAR_COLORS = ['#023047', '#206ebb', '#0ea5e9', '#8b5cf6', '#ef4444', '#22c55e', '#f97316']

function RouteComponent() {
  const [filter, setFilter] = useState<ReportType | 'all'>('all')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filtered = MOCK_REPORTS.filter(r => {
    if (filter !== 'all' && r.reportType !== filter) return false
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (search && !r.report.toLowerCase().includes(search.toLowerCase()) && !r.agentName.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const counts = {
    all: MOCK_REPORTS.length,
    alert: MOCK_REPORTS.filter(r => r.reportType === 'alert').length,
    message: MOCK_REPORTS.filter(r => r.reportType === 'message').length,
    other: MOCK_REPORTS.filter(r => r.reportType === 'other').length,
  }

  return (
    <div className="space-y-5 pb-8">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {(['alert', 'message', 'other'] as ReportType[]).map(type => {
          const cfg = TYPE_CONFIG[type]
          return (
            <button
              key={type}
              onClick={() => setFilter(filter === type ? 'all' : type)}
              className="rounded-2xl border p-4 text-left transition-all hover:shadow-sm"
              style={{
                backgroundColor: filter === type ? cfg.bg : 'var(--background-white-color)',
                borderColor: filter === type ? cfg.color : 'var(--stroke-dark)',
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}
              >
                {cfg.icon}
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--texte-extra-black)' }}>{counts[type]}</p>
              <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>{cfg.label}s</p>
            </button>
          )
        })}
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div
          className="flex items-center gap-2 flex-1 min-w-48 px-3 py-2 rounded-xl border"
          style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
        >
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--texte-gray)' }} />
          <input
            type="text"
            placeholder="Rechercher un rapport ou agent..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none"
            style={{ color: 'var(--texte-extra-black)' }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: 'var(--texte-gray)' }} />
          {['all', 'pending', 'reviewed', 'resolved'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="text-xs font-medium px-3 py-1.5 rounded-full border transition-all"
              style={statusFilter === s
                ? { backgroundColor: 'var(--primary)', color: 'white', borderColor: 'var(--primary)' }
                : { backgroundColor: 'transparent', color: 'var(--texte-gray)', borderColor: 'var(--stroke-dark)' }
              }
            >
              {s === 'all' ? 'Tous' : STATUS_CONFIG[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--texte-gray)' }}>
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aucun rapport trouvé</p>
          </div>
        )}
        {filtered.map((report, i) => {
          const cfg = TYPE_CONFIG[report.reportType]
          const statusCfg = STATUS_CONFIG[report.status]
          const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length]
          return (
            <div
              key={report.id}
              className="rounded-2xl border p-4 transition-all hover:shadow-sm"
              style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
            >
              <div className="flex items-start gap-3">
                <AvatarCircle initials={report.agentAvatar} color={avatarColor} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold" style={{ color: 'var(--texte-extra-black)' }}>
                      {report.agentName}
                    </span>
                    <span
                      className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: cfg.bg, color: cfg.color }}
                    >
                      {cfg.icon} {cfg.label}
                    </span>
                    {report.severity && (
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: SEVERITY_CONFIG[report.severity].bg, color: SEVERITY_CONFIG[report.severity].color }}
                      >
                        {SEVERITY_CONFIG[report.severity].label}
                      </span>
                    )}
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full ml-auto"
                      style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
                    >
                      {statusCfg.label}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--texte-black)' }}>
                    {report.report}
                  </p>
                  <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--texte-gray)' }}>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {report.region}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {new Date(report.date).toLocaleDateString('fr-MG', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
