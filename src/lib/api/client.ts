/**
 * src/lib/api/client.ts
 * ======================
 * Thin fetch wrapper shared by every API module in `src/lib/api/*`.
 *
 * Responsibilities:
 *  - Prefixes every request with the backend base URL (VITE_API_BASE_URL).
 *  - Attaches the JWT bearer token (from the auth store) when present.
 *  - Normalizes error responses into `ApiError` using the backend's
 *    `{ statut, code, message }` / `{ detail: { code, message } }` shapes.
 *  - Provides small helpers (get/post/put/patch/del) used by every module.
 */

import { env } from '#/env'
import { useAuthStore } from '#/stores/auth-store'

/**
 * Thrown when the request never reaches the server (no internet, server
 * DOWN, CORS preflight blocked, DNS failure, etc.).
 * Distinct from ApiError so callers can show a meaningful message:
 * "Serveur inaccessible" instead of "Identifiants incorrects".
 */
export class NetworkError extends Error {
  constructor(cause?: unknown) {
    super(
      'Impossible de contacter le serveur. ' +
      'Vérifiez que le backend est démarré et accessible.',
    )
    this.name = 'NetworkError'
    if (cause) this.cause = cause
  }
}

export class ApiError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

type QueryValue = string | number | boolean | undefined | null

export type QueryParams = Record<string, QueryValue | QueryValue[]>

function buildQueryString(params?: QueryParams): string {
  if (!params) return ''
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    if (Array.isArray(value)) {
      for (const v of value) {
        if (v !== undefined && v !== null) search.append(key, String(v))
      }
    } else {
      search.append(key, String(value))
    }
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

async function parseErrorBody(response: Response): Promise<{ message: string; code?: string }> {
  try {
    const body = await response.json()
    // FastAPI HTTPException(detail={code, message})
    if (body?.detail?.message) {
      return { message: body.detail.message, code: body.detail.code }
    }
    // RequestValidationError handler shape: { statut, code, erreurs }
    if (Array.isArray(body?.erreurs) && body.erreurs.length > 0) {
      const first = body.erreurs[0]
      return { message: `${first.champ} — ${first.message}`, code: body.code }
    }
    if (body?.message) {
      return { message: body.message, code: body.code }
    }
    if (typeof body?.detail === 'string') {
      return { message: body.detail }
    }
    return { message: response.statusText || 'Erreur inconnue' }
  } catch {
    return { message: response.statusText || 'Erreur inconnue' }
  }
}

export interface RequestOptions {
  params?: QueryParams
  signal?: AbortSignal
  /** Skip attaching the Authorization header (e.g. /auth/login) */
  skipAuth?: boolean
  headers?: Record<string, string>
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const url = `${env.VITE_API_BASE_URL}${path}${buildQueryString(options?.params)}`

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...options?.headers,
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (!options?.skipAuth) {
    const token = useAuthStore.getState().accessToken
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: options?.signal,
    })
  } catch (fetchError) {
    // TypeError = network-level failure (server DOWN, no internet, CORS, etc.)
    if (fetchError instanceof TypeError) {
      throw new NetworkError(fetchError)
    }
    throw fetchError
  }

  if (response.status === 204) {
    return undefined as T
  }

  if (!response.ok) {
    const { message, code } = await parseErrorBody(response)

    if (response.status === 401 && !options?.skipAuth) {
      // Token missing/expired — clear local session so the UI can redirect.
      useAuthStore.getState().clear()
    }

    throw new ApiError(message, response.status, code)
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return (await response.json()) as T
  }
  // CSV / file downloads etc.
  return (await response.text()) as unknown as T
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, body, options),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', path, body, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>('DELETE', path, undefined, options),
  /** Returns the raw absolute URL — useful for file download links (reports). */
  url: (path: string, params?: QueryParams) =>
    `${env.VITE_API_BASE_URL}${path}${buildQueryString(params)}`,
}
