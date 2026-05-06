import LinkComponent from '#/components/LinkComponent'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <div className="flex h-screen w-full">
      <aside className="w-64 border-r">
        <LinkComponent to="/admin/dashboard" displayName='Dashboard'/>
        <LinkComponent to="/admin/regions" displayName='Regions'/>
      </aside>

      <div className="flex flex-col flex-1">
        <header className="h-14 border-b flex items-center px-6">
          <h2 className="font-semibold">Admin Panel</h2>
        </header>

        <main className="p-6 bg-muted/40">
          <Outlet /> 
        </main>
      </div>
    </div>
  )
}