import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/regions/$id/insight/reports')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Reports</div>
}
