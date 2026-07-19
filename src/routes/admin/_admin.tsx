import ParaglideLocaleSwitcher from '#/components/LocaleSwitcher'
import ThemeToggle from '#/components/ThemeToggle'
import { useAuthStore } from '#/stores/auth-store'
import { useLogout } from '#/hooks/use-auth'
import { ROLE_LABELS } from '#/shared/constants'
import { AppName } from '#/shared/constants'
import BrandLogo from '#/components/BrandLogo'
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
  Package,
  ChevronRight,
} from 'lucide-react'
import type { ReactElement } from 'react'

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

interface NavItem {
  to: string
  label: string
  icon: ReactElement
  roles?: readonly string[]
}

interface NavSection {
  label: string
  items: readonly NavItem[]
}

/**
 * Navigation grouped by mental model rather than a flat list:
 *  - "Suivi"       → everyday monitoring (what most users open daily)
 *  - "Ressources"  → operational support content
 *  - "Administration" → configuration, restricted by role
 */
const NAV_SECTIONS: readonly NavSection[] = [
  {
    label: 'Suivi',
    items: [
      { to: '/admin/dashboard', label: 'Tableau de bord', icon: <LayoutDashboard size={17} /> },
      { to: '/admin/regions', label: 'Carte des régions', icon: <MapIcon size={17} /> },
      { to: '/admin/weather', label: 'Météo nationale', icon: <CloudSun size={17} /> },
    ],
  },
  {
    label: 'Ressources',
    items: [
      { to: '/admin/recipes', label: 'Recettes nutritionnelles', icon: <Salad size={17} /> },
      { to: '/admin/stocks', label: 'Stocks humanitaires', icon: <Package size={17} />, roles: ['national', 'admin'] },
      { to: '/admin/reports', label: 'Rapports', icon: <FileBarChart size={17} /> },
    ],
  },
  {
    label: 'Administration',
    items: [
      { to: '/admin/models', label: 'Modèles ML', icon: <Activity size={17} />, roles: ['national', 'admin'] },
      { to: '/admin/users', label: 'Utilisateurs', icon: <Users size={17} />, roles: ['admin'] },
    ],
  },
]

function SidebarLink({ item }: { item: NavItem }) {
  return (
    <Link
      to={item.to}
      className="group flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
      style={{ color: 'var(--texte-gray)' }}
      activeProps={{
        className: 'font-semibold',
        style: {
          color: 'var(--primary)',
          backgroundColor: 'var(--blue-background)',
        },
      }}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      <span className="truncate">{item.label}</span>
    </Link>
  )
}

function AdminLayout() {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate({ to: '/auth/signin' })
  }

  const role = user?.role ?? 'viewer'
  const visibleSections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => !item.roles || item.roles.includes(role)),
  })).filter((section) => section.items.length > 0)

  return (
    <div className="flex h-screen w-full" style={{ backgroundColor: 'var(--background-gray-color)' }}>
      {/* Sidebar */}
      <aside
        className="w-64 flex flex-col border-r flex-shrink-0"
        style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
      >
        {/* Brand — real HealthShield logo */}
        <div className="h-16 flex items-center px-5 border-b" style={{ borderColor: 'var(--stroke-dark)' }}>
          <BrandLogo className="h-7 w-auto" />
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6" aria-label="Navigation principale">
          {visibleSections.map((section) => (
            <div key={section.label}>
              <p className="nav-section-label px-3 mb-2">{section.label}</p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <SidebarLink key={item.to} item={item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User + logout */}
        <div className="p-3 border-t" style={{ borderColor: 'var(--stroke-dark)' }}>
          <Link
            to="/admin/profile"
            className="group flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-[var(--background-gray-color)]"
            title="Voir mon profil"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
              style={{ backgroundColor: 'var(--primary2)' }}
              aria-hidden="true"
            >
              {(user?.full_name ?? user?.username ?? '?').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--texte-extra-black)' }}>
                {user?.full_name || user?.username}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--texte-gray)' }}>
                {user ? ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] ?? user.role : ''}
              </p>
            </div>
            <ChevronRight
              size={14}
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: 'var(--texte-gray)' }}
            />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2.5 py-2 mt-1 rounded-lg text-sm font-medium transition-colors hover:bg-[#fef2f2]"
            style={{ color: '#dc2626' }}
          >
            <LogOut size={15} />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex flex-col flex-1 min-w-0">
        <header
          className="h-16 flex items-center justify-between px-8 border-b flex-shrink-0"
          style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
        >
          <p className="text-sm font-semibold" style={{ color: 'var(--texte-black)' }}>
            Madagascar · Paludisme & Nutrition
          </p>
          <div className="flex items-center gap-1.5">
            <ParaglideLocaleSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
