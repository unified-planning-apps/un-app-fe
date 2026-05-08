import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_admin/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-4 h-full">
        Dashboard
    </div>
  )
}
