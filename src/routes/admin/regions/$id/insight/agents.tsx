import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/regions/$id/insight/agents')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='p-3.5'>Hello "/admin/regions/$id/insight/agents"!</div>
}
