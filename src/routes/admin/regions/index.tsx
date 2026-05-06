import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense, useEffect, useState } from 'react'

const LazyMap = lazy(() => import('@/components/Map'))

export const Route = createFileRoute('/admin/regions/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="h-150 bg-muted animate-pulse flex items-center justify-center">Loading Map...</div>
  }

  return (
    <div className="space-y-4 h-full">
      <Suspense fallback={<div>Loading map components...</div>}>
        <LazyMap />
      </Suspense>
    </div>
  )
}