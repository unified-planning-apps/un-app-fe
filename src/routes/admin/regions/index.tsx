import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/regions/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/regions/"!</div>
}
