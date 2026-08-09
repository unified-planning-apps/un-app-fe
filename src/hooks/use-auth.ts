/**
 * src/hooks/use-auth.ts
 */
import { useMutation, useQuery } from '@tanstack/react-query'
import { authApi } from '#/lib/api/auth'
import { demoAuthApi } from '#/lib/api/demo'
import { IS_DEMO } from '#/env'
import { useAuthStore } from '#/stores/auth-store'
import type {
  ChangePasswordRequest, ForgotPasswordRequest,
  LoginRequest, RegisterRequest, ResetPasswordRequest,
} from '#/lib/schemas/auth'

const api = IS_DEMO ? demoAuthApi : authApi

export function useLogin() {
  const { setSession } = useAuthStore()
  return useMutation({
    mutationFn: (data: LoginRequest) => api.login(data),
    onSuccess: (res) => setSession(res.access_token, res.user, res.expires_in),
  })
}

export function useLogout() {
  const { clear } = useAuthStore()
  return clear
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => api.register(data),
  })
}

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.me(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => api.changePassword(data),
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => api.forgotPassword(data),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => api.resetPassword(data),
  })
}

export function useUsersList() {
  return useQuery({
    queryKey: ['auth', 'users'],
    queryFn: () => api.listUsers(),
    staleTime: 5 * 60 * 1000,
  })
}
