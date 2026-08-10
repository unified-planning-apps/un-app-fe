/**
 * src/components/ui-states.tsx
 * =============================
 * Shared feedback states used across the app so loading / empty / error
 * moments look consistent and actually help the user instead of showing
 * raw text. Part of the HCI pass: every wait state gives visual feedback,
 * every empty state explains what it means and what to do next, every
 * error state offers a way to recover.
 */

import type { ReactNode } from 'react'
import { RefreshCw } from 'lucide-react'

/* ── Loading ──────────────────────────────────────────────────────────── */

/** Shimmering placeholder rows — use instead of "Loading…" text. */
export function SkeletonRows({ rows = 3, height = 16 }: { rows?: number; height?: number }) {
  return (
    <div className="space-y-3 w-full" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ height, width: `${100 - (i % 3) * 12}%` }}
        />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  )
}

/** Grid of shimmering cards — for card-based layouts (recipes, stats…). */
export function SkeletonCards({ count = 3, height = 110 }: { count?: number; height?: number }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full"
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height }} />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  )
}

/* ── Empty ────────────────────────────────────────────────────────────── */

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

/** Explains why there is nothing here and, when possible, what to do. */
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      {icon && (
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: 'var(--background-gray-color)', color: 'var(--texte-gray)' }}
        >
          {icon}
        </div>
      )}
      <p className="text-sm font-semibold mb-1" style={{ color: 'var(--texte-extra-black)' }}>
        {title}
      </p>
      {description && (
        <p className="text-xs max-w-sm leading-relaxed" style={{ color: 'var(--texte-gray)' }}>
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

/* ── Error ────────────────────────────────────────────────────────────── */

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

/** Failure state with a recovery path — never a dead end. */
export function ErrorState({
  title = 'Impossible de charger les données',
  description = 'Vérifiez votre connexion, puis réessayez.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <p className="text-sm font-semibold mb-1" style={{ color: 'var(--texte-extra-black)' }}>
        {title}
      </p>
      <p className="text-xs max-w-sm leading-relaxed mb-4" style={{ color: 'var(--texte-gray)' }}>
        {description}
      </p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary">
          <RefreshCw size={13} />
          Retry
        </button>
      )}
    </div>
  )
}

/* ── Page header ──────────────────────────────────────────────────────── */

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
}

/** Consistent page-level heading: title + short purpose line + actions. */
export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  )
}
