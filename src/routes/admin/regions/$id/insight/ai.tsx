import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/regions/$id/insight/ai')({
  component: RouteComponent,
})

function RouteComponent() {
  const regionName = Route.useParams().id;
  
  return <div>Hello "/admin/regions/{regionName}/insight/ai"!</div>
}
