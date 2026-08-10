import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense, useEffect, useState } from 'react'

const LazyMap = lazy(() => import('@/components/Map'))

export const Route = createFileRoute('/admin/_admin/regions/')({
  component: RouteComponent,
})

const LEGEND = [
  { label: 'Low', color: '#22c55e' },
  { label: 'Moderate', color: '#eab308' },
  { label: 'High', color: '#f97316' },
  { label: 'Very high', color: '#ef4444' },
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
          <h1 className="page-title">
            Regions Map
          </h1>
          <p className="page-subtitle">
            Malaria risk by region — click a region for details
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
        <div className="h-150 skeleton rounded-2xl" role="status" aria-label="Loading map" />
      ) : (
        <Suspense fallback={<div className="h-150 skeleton rounded-2xl" role="status" aria-label="Loading map" />}>
          <LazyMap />
        </Suspense>
      )}
    </div>
  )
}
