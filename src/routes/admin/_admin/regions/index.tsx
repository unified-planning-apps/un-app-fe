import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense, useEffect, useState } from 'react'

const LazyMap = lazy(() => import('@/components/Map'))

export const Route = createFileRoute('/admin/_admin/regions/')({
  component: RouteComponent,
})

const LEGEND = [
  { label: 'Faible', color: '#22c55e' },
  { label: 'Moyen', color: '#eab308' },
  { label: 'Élevé', color: '#f97316' },
  { label: 'Très élevé', color: '#ef4444' },
]

function RouteComponent() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--texte-extra-black)', fontFamily: 'Fraunces, serif' }}>
            Carte des régions
          </h1>
          <p className="text-sm" style={{ color: 'var(--texte-gray)' }}>
            Risque paludisme par région — cliquez sur une région pour les détails
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--texte-gray)' }}>
          {LEGEND.map((l) => (
            <span key={l.label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      {!isClient ? (
        <div className="h-150 bg-muted animate-pulse flex items-center justify-center rounded-2xl">Chargement de la carte...</div>
      ) : (
        <Suspense fallback={<div>Chargement des composants de la carte...</div>}>
          <LazyMap />
        </Suspense>
      )}
    </div>
  )
}
