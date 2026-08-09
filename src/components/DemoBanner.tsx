/**
 * DemoBanner.tsx
 * ---------------
 * Persistent top banner shown when VITE_APP_MODE=demo.
 * Rendered client-only (useEffect mount guard) to avoid SSR hydration
 * mismatches — the banner is not part of the server-rendered shell.
 */
import { IS_DEMO } from '#/env'
import { FlaskConical, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function DemoBanner() {
  const [mounted, setMounted] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Only render on client — avoids SSR/hydration mismatch
  useEffect(() => { setMounted(true) }, [])

  if (!IS_DEMO || !mounted || dismissed) return null

  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium"
      style={{ backgroundColor: '#1e3a5f', color: '#93c5fd' }}
      role="status"
      aria-label="Mode démonstration actif"
    >
      <div className="flex items-center gap-2">
        <FlaskConical size={15} aria-hidden="true" />
        <span>
          <strong className="text-white">Mode démo</strong>
          {' '}— données fictives, aucune connexion backend requise.
          Pour des données réelles, définissez{' '}
          <code className="text-blue-300 text-xs">VITE_APP_MODE=development</code> dans{' '}
          <code className="text-blue-300 text-xs">.env.local</code>.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Fermer la bannière démo"
      >
        <X size={15} />
      </button>
    </div>
  )
}
