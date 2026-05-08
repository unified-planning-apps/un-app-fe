import { Card } from "./ui/card";

type ReportDetailProps = {
    agentName: string;
    region: string;
    reportType: 'alert' | 'message' | 'other';
    report: string;
}

export default function ReportDetail({ agentName, region, reportType, report }: ReportDetailProps) {
    return (
        <Card className={`w-fit p-1.5`}>
            <h2>{agentName}</h2>
            <p>Region: {region}</p>
            <p className={`${reportType === 'alert' ? 'bg-red-100' : reportType === 'message' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                Report Type: {reportType}
            </p>
            <p>Report: {report}</p>
        </Card>
    )
}