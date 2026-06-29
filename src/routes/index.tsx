import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '#/stores/auth-store'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated
    throw redirect({ to: isAuthenticated ? '/admin/dashboard' : '/auth/signin' })
  },
  component: () => null,
})
