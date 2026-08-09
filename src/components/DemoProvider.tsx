/**
 * DemoProvider.tsx
 * -----------------
 * Seeds the auth store for demo mode inside a useEffect (client-only).
 * This avoids the SSR/client hydration mismatch that occurred when the
 * store was seeded at module load time: the server rendered an
 * "unauthenticated" tree, the client hydrated with "authenticated" state,
 * and React produced DOM corruption errors.
 *
 * useEffect only runs on the client after hydration, so both server and
 * client render the same initial tree (unauthenticated route guard logic),
 * then the client immediately redirects to /admin/dashboard after mount.
 */
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { IS_DEMO } from '#/env'
import { useAuthStore } from '#/stores/auth-store'
import { DEMO_TOKEN_RESPONSE } from '#/mock/auth'

export default function DemoProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const setSession = useAuthStore((s) => s.setSession)

  useEffect(() => {
    if (!IS_DEMO) return
    if (!isAuthenticated) {
      setSession(DEMO_TOKEN_RESPONSE.access_token, DEMO_TOKEN_RESPONSE.user)
    }
    // Navigate to dashboard after seeding — replaceState so back button works naturally
    navigate({ to: '/admin/dashboard', replace: true })
  // Run once on mount only
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <>{children}</>
}
