import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { FileText, Filter, Search } from 'lucide-react'
import ReportDetail, {
  REPORT_TYPE_CONFIG,
  REPORT_STATUS_CONFIG,
  type ReportType,
  type ReportSeverity,
  type ReportStatus,
} from '#/components/ReportDetail'

export const Route = createFileRoute('/admin/_admin/regions/$id/insight/reports')({
  component: RouteComponent,
})

interface Report {
  id: number
  agentName: string
  agentAvatar: string
  region: string
  reportType: ReportType
  report: string
  date: string
  severity?: ReportSeverity
  status: ReportStatus
}

// Field-agent reports (alerts/messages submitted from the ground). This is a
// distinct concept from the system-generated PDF reports under /admin/reports
// (backend `/rapports/*`) — the backend has no endpoint for these yet, so
// this stays mock data pending a dedicated "field reports" API.
const MOCK_REPORTS: Report[] = [
  { id: 1, agentName: 'Rabe Jean', agentAvatar: 'RJ', region: 'Analamanga', reportType: 'alert', report: '17 nouveaux cas de paludisme dans la commune d\'Ambohidratrimo. Stocks de médicaments insuffisants au CSB.', date: '2025-05-12', severity: 'high', status: 'pending' },
  { id: 2, agentName: 'Vola Ratsima', agentAvatar: 'VR', region: 'Analamanga', reportType: 'alert', report: 'Vague de chaleur signalée — température dépasse 38°C dans 3 communes. Risque de coup de chaleur pour les enfants.', date: '2025-05-12', severity: 'high', status: 'reviewed' },
  { id: 3, agentName: 'Tiana Andry', agentAvatar: 'TA', region: 'Analamanga', reportType: 'message', report: 'Campagne de sensibilisation sur l\'hygiène complétée dans 5 fokontany. 240 ménages visités.', date: '2025-05-11', status: 'resolved' },
  { id: 4, agentName: 'Koto Mamy', agentAvatar: 'KM', region: 'Analamanga', reportType: 'alert', report: 'Pénurie de riz signalée dans le marché de Sabotsy Namehana. Prix a augmenté de 35% en 2 semaines.', date: '2025-05-11', severity: 'medium', status: 'pending' },
  { id: 5, agentName: 'Niry Solo', agentAvatar: 'NS', region: 'Analamanga', reportType: 'other', report: 'Report mensuel de suivi des indicateurs nutritionnels. 12 enfants en état de malnutrition aiguë identifiés.', date: '2025-05-10', status: 'reviewed' },
  { id: 6, agentName: 'Hery Rado', agentAvatar: 'HR', region: 'Analamanga', reportType: 'message', report: 'Réunion communautaire tenue à Antehiroka. Les habitants demandent plus d\'agents de terrain.', date: '2025-05-10', status: 'resolved' },
  { id: 7, agentName: 'Fara Lova', agentAvatar: 'FL', region: 'Analamanga', reportType: 'alert', report: '3 cas suspects de choléra près du fleuve Ikopa. Prélèvements envoyés au laboratoire central.', date: '2025-05-09', severity: 'high', status: 'pending' },
]

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
    <div className="space-y-7 pb-10">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-5">
        {(['alert', 'message', 'other'] as ReportType[]).map(type => {
          const cfg = REPORT_TYPE_CONFIG[type]
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
            placeholder="Search reports or agents..."
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
              {s === 'all' ? 'All' : REPORT_STATUS_CONFIG[s as ReportStatus]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--texte-gray)' }}>
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No reports found</p>
          </div>
        )}
        {filtered.map((report, i) => (
          <ReportDetail
            key={report.id}
            agentName={report.agentName}
            agentAvatar={report.agentAvatar}
            avatarColor={AVATAR_COLORS[i % AVATAR_COLORS.length]}
            region={report.region}
            reportType={report.reportType}
            report={report.report}
            date={report.date}
            severity={report.severity}
            status={report.status}
          />
        ))}
      </div>
    </div>
  )
}
