import { AlertTriangle, MessageCircle, FileText, MapPin, User, Calendar } from "lucide-react";

export type ReportType = 'alert' | 'message' | 'other'
export type ReportSeverity = 'high' | 'medium' | 'low'
export type ReportStatus = 'pending' | 'reviewed' | 'resolved'

type ReportDetailProps = {
    agentName: string;
    agentAvatar?: string;
    avatarColor?: string;
    region: string;
    reportType: ReportType;
    report: string;
    date?: string;
    severity?: ReportSeverity;
    status?: ReportStatus;
}

export const REPORT_TYPE_CONFIG: Record<ReportType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
    alert: { label: 'Alerte', icon: <AlertTriangle className="w-3.5 h-3.5" />, color: '#ef4444', bg: '#fef2f2' },
    message: { label: 'Message', icon: <MessageCircle className="w-3.5 h-3.5" />, color: '#0ea5e9', bg: '#eff6ff' },
    other: { label: 'Rapport', icon: <FileText className="w-3.5 h-3.5" />, color: '#8b5cf6', bg: '#f5f3ff' },
}

export const REPORT_SEVERITY_CONFIG: Record<ReportSeverity, { label: string; color: string; bg: string }> = {
    high: { label: 'Critique', color: '#ef4444', bg: '#fef2f2' },
    medium: { label: 'Moyen', color: '#f97316', bg: '#fff7ed' },
    low: { label: 'Bas', color: '#22c55e', bg: '#f0fdf4' },
}

export const REPORT_STATUS_CONFIG: Record<ReportStatus, { label: string; color: string; bg: string }> = {
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

export default function ReportDetail({
    agentName,
    agentAvatar,
    avatarColor = 'var(--primary2)',
    region,
    reportType,
    report,
    date,
    severity,
    status,
}: ReportDetailProps) {
    const cfg = REPORT_TYPE_CONFIG[reportType];
    const statusCfg = status ? REPORT_STATUS_CONFIG[status] : undefined;

    return (
        <div
            className="rounded-2xl border p-4 w-full transition-all hover:shadow-sm"
            style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
        >
            <div className="flex items-start gap-3">
                {agentAvatar && <AvatarCircle initials={agentAvatar} color={avatarColor} />}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-semibold" style={{ color: 'var(--texte-extra-black)' }}>
                            {agentName}
                        </span>
                        <span
                            className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: cfg.bg, color: cfg.color }}
                        >
                            {cfg.icon} {cfg.label}
                        </span>
                        {severity && (
                            <span
                                className="text-xs font-medium px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: REPORT_SEVERITY_CONFIG[severity].bg, color: REPORT_SEVERITY_CONFIG[severity].color }}
                            >
                                {REPORT_SEVERITY_CONFIG[severity].label}
                            </span>
                        )}
                        {statusCfg && (
                            <span
                                className="text-xs font-medium px-2 py-0.5 rounded-full ml-auto"
                                style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
                            >
                                {statusCfg.label}
                            </span>
                        )}
                    </div>

                    <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--texte-black)' }}>
                        {report}
                    </p>

                    <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--texte-gray)' }}>
                        {!agentAvatar && (
                            <span className="flex items-center gap-1">
                                <User className="w-3 h-3" /> {agentName}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {region}
                        </span>
                        {date && (
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(date).toLocaleDateString('fr-MG', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
