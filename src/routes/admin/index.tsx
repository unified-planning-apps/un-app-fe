import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
  notFoundComponent: () => {
    return <div>Region or Page not found within Admin</div>
  },
})

function RouteComponent() {
  return <div>Hello "/admin/"!</div>
}
