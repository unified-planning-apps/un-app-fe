import NavLinkComponent from '#/components/NavLinkComponent'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <div className="flex h-screen w-full">
      <aside className="w-64 border-r">
        <NavLinkComponent to="/admin/dashboard" className='p-2' displayName='Dashboard'/>
        <NavLinkComponent to="/admin/regions" className='p-2' displayName='Regions'/>
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
