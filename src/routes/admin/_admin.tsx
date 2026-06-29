import NavLinkComponent from '#/components/NavLinkComponent'
import ParaglideLocaleSwitcher from '#/components/LocaleSwitcher'
import ThemeToggle from '#/components/ThemeToggle'
import { useAuthStore } from '#/stores/auth-store'
import { useLogout } from '#/hooks/use-auth'
import { ROLE_LABELS } from '#/shared/constants'
import { AppName } from '#/shared/constants'
import { createFileRoute, Link, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Map as MapIcon,
  CloudSun,
  Salad,
  FileBarChart,
  Activity,
  Users,
  LogOut,
  ShieldCheck,
  Package,
} from 'lucide-react'

export const Route = createFileRoute('/admin/_admin')({
  beforeLoad: () => {
    if (typeof window === 'undefined') return
    const { isAuthenticated } = useAuthStore.getState()
    if (!isAuthenticated) {
      throw redirect({ to: '/auth/signin' })
    }
  },
  component: AdminLayout,
})

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Tableau de bord', icon: <LayoutDashboard size={18} /> },
  { to: '/admin/regions', label: 'Régions', icon: <MapIcon size={18} /> },
  { to: '/admin/weather', label: 'Météo nationale', icon: <CloudSun size={18} /> },
  { to: '/admin/recipes', label: 'Recettes', icon: <Salad size={18} /> },
  { to: '/admin/stocks', label: 'Stocks humanitaires', icon: <Package size={18} />, roles: ['national', 'admin'] },
  { to: '/admin/reports', label: 'Rapports', icon: <FileBarChart size={18} /> },
  { to: '/admin/models', label: 'Modèles ML', icon: <Activity size={18} />, roles: ['national', 'admin'] },
  { to: '/admin/users', label: 'Utilisateurs', icon: <Users size={18} />, roles: ['admin'] },
] as const

function AdminLayout() {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate({ to: '/auth/signin' })
  }

  const visibleItems = NAV_ITEMS.filter(
    (item) => !('roles' in item) || !item.roles || item.roles.includes(user?.role ?? 'viewer'),
  )

  return (
    <div className="flex h-screen w-full" style={{ backgroundColor: 'var(--background-gray-color)' }}>
      {/* Sidebar */}
      <aside
        className="w-64 flex flex-col border-r flex-shrink-0"
        style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
      >
        <div className="h-20 flex items-center gap-2.5 px-6 border-b" style={{ borderColor: 'var(--stroke-dark)' }}>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
            style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary2) 100%)' }}
          >
            <ShieldCheck size={18} />
          </div>
          <span className="font-bold text-base" style={{ color: 'var(--texte-extra-black)', fontFamily: 'Fraunces, serif' }}>
            {AppName}
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {visibleItems.map(({ to, label, icon }) => (
            <NavLinkComponent
              key={to}
              to={to}
              displayName={label}
              icon={icon}
              className="px-3.5 py-3 rounded-xl text-sm"
              activeClassName="font-semibold"
              style={{ color: 'var(--texte-gray)' }}
            />
          ))}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: 'var(--stroke-dark)' }}>
          <Link
            to="/admin/profile"
            className="flex items-center gap-3 rounded-xl p-3.5 mb-3 transition-colors hover:opacity-80"
            style={{ backgroundColor: 'var(--background-gray-color)' }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
              style={{ backgroundColor: 'var(--primary2)' }}
            >
              {(user?.full_name ?? user?.username ?? '?').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--texte-extra-black)' }}>
                {user?.full_name || user?.username}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--texte-gray)' }}>
                {user ? ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] ?? user.role : ''}
              </p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: '#ef4444', backgroundColor: '#fef2f2' }}
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex flex-col flex-1 min-w-0">
        <header
          className="h-20 flex items-center justify-between px-8 border-b flex-shrink-0"
          style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
        >
          <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>
            Surveillance Sanitaire — Madagascar
          </h2>
          <div className="flex items-center gap-2">
            <ParaglideLocaleSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
