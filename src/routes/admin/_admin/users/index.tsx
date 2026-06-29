import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { Users, Mail, Shield, MapPin, UserPlus } from 'lucide-react'
import { useUsersList } from '#/hooks/use-auth'
import { useAuthStore } from '#/stores/auth-store'
import { ROLE_LABELS } from '#/shared/constants'
import { getRegionName } from '#/lib/regions'

export const Route = createFileRoute('/admin/_admin/users/')({
  beforeLoad: () => {
    if (useAuthStore.getState().user?.role !== 'admin') {
      throw redirect({ to: '/admin/dashboard' })
    }
  },
  component: RouteComponent,
})

const ROLE_STYLE: Record<string, { bg: string; text: string }> = {
  admin: { bg: '#fef2f2', text: '#ef4444' },
  national: { bg: '#eff6ff', text: '#0ea5e9' },
  regional: { bg: '#fff7ed', text: '#f97316' },
  viewer: { bg: '#f0fdf4', text: '#22c55e' },
}

function RouteComponent() {
  const users = useUsersList()

  return (
    <div className="space-y-7 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--texte-extra-black)', fontFamily: 'Fraunces, serif' }}>
            Utilisateurs
          </h1>
          <p className="text-sm" style={{ color: 'var(--texte-gray)' }}>
            Gestion des comptes ayant accès à la plateforme
          </p>
        </div>
        <Link
          to="/admin/users/create"
          className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl text-white"
          style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary2) 100%)' }}
        >
          <UserPlus size={16} />
          Créer un compte
        </Link>
      </div>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
      >
        <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: 'var(--stroke-dark)' }}>
          <Users className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>
            {users.data?.length ?? 0} compte(s)
          </h2>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--stroke-dark)' }}>
          {users.data?.map((u) => {
            const roleStyle = ROLE_STYLE[u.role] ?? ROLE_STYLE.viewer
            return (
              <div key={u.user_id} className="p-5 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--texte-extra-black)' }}>
                    {u.full_name || u.username}
                  </p>
                  <div className="flex items-center gap-3 text-xs mt-0.5" style={{ color: 'var(--texte-gray)' }}>
                    <span className="flex items-center gap-1"><Mail size={12} /> {u.email}</span>
                    {u.region_id && (
                      <span className="flex items-center gap-1"><MapPin size={12} /> {getRegionName(u.region_id)}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!u.is_active && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#f9fafb', color: '#6b7280' }}>
                      Inactif
                    </span>
                  )}
                  <span
                    className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: roleStyle.bg, color: roleStyle.text }}
                  >
                    <Shield size={12} /> {ROLE_LABELS[u.role as keyof typeof ROLE_LABELS] ?? u.role}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
