/**
 * src/hooks/use-auth.ts
 * ======================
 * React-query hooks wrapping `lib/api/auth.ts`, wired to the zustand
 * auth store so a successful login/register updates the session
 * everywhere immediately.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '#/lib/api/auth'
import type { ChangePasswordRequest, LoginRequest, RegisterRequest } from '#/lib/schemas/auth'
import { useAuthStore } from '#/stores/auth-store'
import { queryKeys } from './query-keys'

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => authApi.me(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      setSession(data.access_token, data.user)
      queryClient.setQueryData(queryKeys.auth.me, data.user)
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
  })
}

export function useLogout() {
  const clear = useAuthStore((s) => s.clear)
  const queryClient = useQueryClient()
  return () => {
    clear()
    queryClient.clear()
  }
}

export function useUsersList() {
  const isAdmin = useAuthStore((s) => s.user?.role === 'admin')
  return useQuery({
    queryKey: queryKeys.auth.users,
    queryFn: () => authApi.listUsers(),
    enabled: isAdmin,
  })
}
