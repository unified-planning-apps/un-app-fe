import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/regions/$id/insight/reports')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/regions/$id/insight/reports"!</div>
}
