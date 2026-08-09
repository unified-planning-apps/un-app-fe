/**
 * src/mock/auth.ts
 * -----------------
 * Demo user and session for auth in demo mode.
 * The auth store is pre-seeded so no login is required.
 */
import type { UserResponse, TokenResponse } from '#/lib/schemas/auth'

export const DEMO_USER: UserResponse = {
  user_id: 1,
  username: 'demo',
  email: 'demo@healthshield.mg',
  full_name: 'Utilisateur Démo',
  role: 'national',
  region_id: null,
  organisation: 'UNICEF Madagascar',
  is_active: true,
}

export const DEMO_TOKEN_RESPONSE: TokenResponse = {
  access_token: 'demo-token-not-real',
  token_type: 'bearer',
  expires_in: 86400,
  user: DEMO_USER,
}

export const DEMO_USERS_LIST: UserResponse[] = [
  DEMO_USER,
  { user_id: 2, username: 'admin', email: 'admin@healthshield.mg', full_name: 'Administrateur', role: 'admin', region_id: null, organisation: 'Ministère de la Santé', is_active: true },
  { user_id: 3, username: 'chef_sofia', email: 'chef.sofia@sante.mg', full_name: 'Rakoto Jean', role: 'regional', region_id: 'MDG-SOF', organisation: 'DSP Sofia', is_active: true },
  { user_id: 4, username: 'agent_boeny', email: 'agent.boeny@sante.mg', full_name: 'Rabe Marie', role: 'regional', region_id: 'MDG-BOE', organisation: 'DSP Boeny', is_active: true },
]
