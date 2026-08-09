/**
 * src/stores/auth-store.ts
 * =========================
 * Holds the JWT access token and the current user profile returned by the
 * backend (`UserResponse`). Persisted to localStorage so a refresh doesn't
 * log the user out. The API client (`lib/api/client.ts`) reads the token
 * directly from this store (via `getState()`) to attach the Authorization
 * header on every request.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserResponse } from '#/lib/schemas/auth'

interface AuthState {
  accessToken: string | null
  user: UserResponse | null
  isAuthenticated: boolean
  setSession: (accessToken: string, user: UserResponse) => void
  setUser: (user: UserResponse) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      setSession: (accessToken, user) =>
        set({ accessToken, user, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      clear: () => set({ accessToken: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'un-app-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

/** Convenience getters re-used across components/route guards. */
export function getCurrentUser(): UserResponse | null {
  return useAuthStore.getState().user
}

export function isAdmin(): boolean {
  return useAuthStore.getState().user?.role === 'admin'
}

export function isNationalOrAdmin(): boolean {
  const role = useAuthStore.getState().user?.role
  return role === 'admin' || role === 'national'
}

