import { AlertTriangle, MessageCircle, FileText, MapPin, User } from "lucide-react";

type ReportDetailProps = {
    agentName: string;
    region: string;
    reportType: 'alert' | 'message' | 'other';
    report: string;
    date?: string;
    severity?: 'high' | 'medium' | 'low';
}

const TYPE_CONFIG = {
    alert: { label: 'Alerte', icon: <AlertTriangle className="w-3.5 h-3.5" />, color: '#ef4444', bg: '#fef2f2' },
    message: { label: 'Message', icon: <MessageCircle className="w-3.5 h-3.5" />, color: '#0ea5e9', bg: '#eff6ff' },
    other: { label: 'Rapport', icon: <FileText className="w-3.5 h-3.5" />, color: '#8b5cf6', bg: '#f5f3ff' },
}

const SEVERITY_CONFIG = {
    high: { label: 'Critique', color: '#ef4444', bg: '#fef2f2' },
    medium: { label: 'Moyen', color: '#f97316', bg: '#fff7ed' },
    low: { label: 'Bas', color: '#22c55e', bg: '#f0fdf4' },
}

export default function ReportDetail({ agentName, region, reportType, report, date, severity }: ReportDetailProps) {
    const cfg = TYPE_CONFIG[reportType];
    return (
        <div
            className="rounded-2xl border p-4 w-full max-w-sm transition-all hover:shadow-sm"
            style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
        >
            <div className="flex items-center gap-2 mb-3">
                <span
                    className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: cfg.bg, color: cfg.color }}
                >
                    {cfg.icon} {cfg.label}
                </span>
                {severity && (
                    <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: SEVERITY_CONFIG[severity].bg, color: SEVERITY_CONFIG[severity].color }}
                    >
                        {SEVERITY_CONFIG[severity].label}
                    </span>
                )}
            </div>

            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--texte-black)' }}>
                {report}
            </p>

            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--texte-gray)' }}>
                <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {agentName}
                </span>
                <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {region}
                </span>
                {date && <span>{date}</span>}
            </div>
        </div>
    )
}
