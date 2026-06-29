/**
 * src/lib/api/auth.ts
 * ====================
 * Calls backend `/auth/*` (src/api/routers/auth.py).
 */

import { apiClient } from './client'
import type {
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UserResponse,
} from '#/lib/schemas/auth'

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<TokenResponse>('/auth/login', data, { skipAuth: true }),

  register: (data: RegisterRequest) =>
    apiClient.post<UserResponse>('/auth/register', data, { skipAuth: true }),

  me: () => apiClient.get<UserResponse>('/auth/me'),

  changePassword: (data: ChangePasswordRequest) =>
    apiClient.post<{ message: string }>('/auth/change-password', data),

  /** Admin only. */
  listUsers: () => apiClient.get<UserResponse[]>('/auth/users'),
}
