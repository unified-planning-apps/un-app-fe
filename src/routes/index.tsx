import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '#/stores/auth-store'
import { IS_DEMO } from '#/env'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // In demo mode the DemoProvider handles navigation after seeding the store.
    // Returning here avoids a race between the beforeLoad guard and useEffect.
    if (IS_DEMO) throw redirect({ to: '/admin/dashboard' })

    const isAuthenticated = useAuthStore.getState().isAuthenticated
    throw redirect({ to: isAuthenticated ? '/admin/dashboard' : '/auth/signin' })
  },
  component: () => null,
})
