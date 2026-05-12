import ReportDetail from '#/components/ReportDetail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/regions/$id/insight/reports')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex flex-wrap gap-4 p-3.5'>
      <ReportDetail
        agentName="John Doe"
        region="North America"
        reportType='alert'
        report="This is a sample report."
      />
      <ReportDetail
        agentName="John Doe"
        region="North America"
        reportType='message'
        report="This is a sample report."
      />
      <ReportDetail
        agentName="John Doe"
        region="North America"
        reportType='other'
        report="This is a sample report."
      />
    </div>
  )
}
