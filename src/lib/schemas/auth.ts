/**
 * src/lib/schemas/auth.ts
 * ========================
 * Mirrors backend `schema/auth.py` (LoginRequest, RegisterRequest,
 * ChangePasswordRequest, TokenResponse, UserResponse) exactly.
 */

import { z } from 'zod'

export const RoleSchema = z.enum(['viewer', 'regional', 'national', 'admin'])
export type ApiRole = z.infer<typeof RoleSchema>

export const LoginRequestSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est requis."),
  password: z.string().min(1, 'Le mot de passe est requis.'),
})
export type LoginRequest = z.infer<typeof LoginRequestSchema>

export const RegisterRequestSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters.")
      .max(50),
    email: z.string().email('Invalid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    full_name: z.string().optional(),
    organisation: z.string().optional(),
    role: RoleSchema.default('viewer'),
    region_id: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })
  .refine((data) => data.role === 'viewer' || data.role === 'national' || !!data.region_id || data.role === 'admin', {
    message: 'La région est requise pour le rôle régional.',
    path: ['region_id'],
  })
export type RegisterFormValues = z.infer<typeof RegisterRequestSchema>

/** Payload actually sent to POST /auth/register (no confirmPassword). */
export type RegisterRequest = Omit<RegisterFormValues, 'confirmPassword'>

export const ChangePasswordRequestSchema = z.object({
  old_password: z.string().min(1, 'Current password is required.'),
  new_password: z.string().min(6, 'Password must be at least 6 characters.'),
})
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>

export const ChangePasswordFormSchema = ChangePasswordRequestSchema.extend({
  confirm_password: z.string().min(1, 'Please confirm your password.'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Passwords do not match.',
  path: ['confirm_password'],
})
export type ChangePasswordFormValues = z.infer<typeof ChangePasswordFormSchema>

export const UserResponseSchema = z.object({
  user_id: z.number(),
  username: z.string(),
  email: z.string(),
  full_name: z.string().nullable().optional(),
  role: RoleSchema,
  region_id: z.string().nullable().optional(),
  organisation: z.string().nullable().optional(),
  is_active: z.boolean(),
})
export type UserResponse = z.infer<typeof UserResponseSchema>

export const TokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string().default('bearer'),
  expires_in: z.number(),
  user: UserResponseSchema,
})
export type TokenResponse = z.infer<typeof TokenResponseSchema>

export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email('Invalid email address.'),
})
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>

/** Backend response — reset_token/dev_note only present in development mode. */
export interface ForgotPasswordResponse {
  message: string
  reset_token?: string
  dev_note?: string
}

export const ResetPasswordFormSchema = z
  .object({
    new_password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirm_password: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match.',
    path: ['confirm_password'],
  })
export type ResetPasswordFormValues = z.infer<typeof ResetPasswordFormSchema>

export interface ResetPasswordRequest {
  token: string
  new_password: string
}
