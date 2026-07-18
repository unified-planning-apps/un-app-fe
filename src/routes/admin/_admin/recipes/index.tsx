import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ChefHat, Clock, Flame, Filter } from 'lucide-react'
import { useRecipes } from '#/hooks/use-nutrition'
import { SkeletonCards, EmptyState, ErrorState } from '#/components/ui-states'
import { REGIONS } from '#/lib/regions'

export const Route = createFileRoute('/admin/_admin/recipes/')({
  component: RouteComponent,
})

const CIBLE_OPTIONS = [
  { value: '', label: 'Toutes les cibles' },
  { value: 'enfants_6_23m', label: 'Enfants 6-23 mois' },
  { value: 'enfants_2_5ans', label: 'Enfants 2-5 ans' },
  { value: 'femmes_enceintes', label: 'Femmes enceintes' },
  { value: 'famille', label: 'Famille' },
]

function RouteComponent() {
  const [regionId, setRegionId] = useState('')
  const [cible, setCible] = useState('')

  const recipes = useRecipes({
    region_id: regionId || undefined,
    cible: cible || undefined,
    limit: 24,
  })

  return (
    <div className="space-y-7 pb-10">
      <div>
        <h1 className="page-title">
          Recettes nutritionnelles
        </h1>
        <p className="page-subtitle">
          Recettes adaptées au contexte local, optimisées pour les besoins des enfants de moins de 5 ans
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2" style={{ color: 'var(--texte-gray)' }}>
          <Filter size={14} />
        </div>
        <select
          value={regionId}
          onChange={(e) => setRegionId(e.target.value)}
          className="text-sm px-3 py-2 rounded-xl border bg-transparent"
          style={{ borderColor: 'var(--stroke-dark)', color: 'var(--texte-black)' }}
        >
          <option value="">Toutes les régions</option>
          {REGIONS.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        <select
          value={cible}
          onChange={(e) => setCible(e.target.value)}
          className="text-sm px-3 py-2 rounded-xl border bg-transparent"
          style={{ borderColor: 'var(--stroke-dark)', color: 'var(--texte-black)' }}
        >
          {CIBLE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {recipes.isLoading && <SkeletonCards count={6} height={170} />}

      {recipes.isError && <ErrorState onRetry={() => recipes.refetch()} />}

      {recipes.data && recipes.data.length === 0 && (
        <EmptyState
          icon={<ChefHat size={22} />}
          title="Aucune recette pour ces filtres"
          description="Essayez d'élargir la recherche : toutes les régions ou toutes les cibles."
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {recipes.data?.map((recipe) => (
          <div
            key={recipe.recette_id}
            className="rounded-2xl border overflow-hidden flex flex-col"
            style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
          >
            <div className="p-5 flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm" style={{ color: 'var(--texte-extra-black)' }}>{recipe.nom}</h3>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--primary2)18', color: 'var(--primary2)' }}
                >
                  {Math.round(recipe.score_nutritionnel)}/100
                </span>
              </div>
              {recipe.nom_malgache && (
                <p className="text-xs italic mb-2" style={{ color: 'var(--texte-gray)' }}>{recipe.nom_malgache}</p>
              )}
              <div className="flex items-center gap-3 text-xs mb-3" style={{ color: 'var(--texte-gray)' }}>
                <span className="flex items-center gap-1"><Flame size={13} /> {Math.round(recipe.calories_kcal)} kcal</span>
                <span className="flex items-center gap-1"><Clock size={13} /> {recipe.temps_preparation_min} min</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recipe.cible.map((c) => (
                  <span
                    key={c}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--background-gray-color)', color: 'var(--texte-gray)' }}
                  >
                    {c.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
