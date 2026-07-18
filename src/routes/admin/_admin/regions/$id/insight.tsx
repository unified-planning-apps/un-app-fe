import NavLinkComponent from '#/components/NavLinkComponent';
import { createFileRoute, Outlet, Link } from '@tanstack/react-router'
import { ChevronLeft, Rows3, Sparkles, Users, MapPin, FlaskConical, History } from 'lucide-react';
import { getRegionMeta } from '#/lib/regions';
import { useAuthStore } from '#/stores/auth-store';

export const Route = createFileRoute('/admin/_admin/regions/$id/insight')({
  component: InsightLayout,
})

function InsightLayout() {
  const role = useAuthStore((s) => s.user?.role ?? 'viewer');
  const regionId = Route.useParams().id;
  const region = getRegionMeta(regionId);
  const displayName = region?.name ?? regionId;

  return (
    <div className="space-y-0">
      {/* Breadcrumb */}
      <div className='flex flex-row items-center gap-2 pb-4'>
        <Link
          to='/admin/regions'
          className='flex items-center gap-1.5 text-sm font-medium transition-colors'
          style={{ color: 'var(--texte-gray)' }}
        >
          <ChevronLeft size={16} />
          Retour
        </Link>
        <span style={{ color: 'var(--stroke-gray)' }}>|</span>
        <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--texte-gray)' }}>
          <MapPin size={14} />
          <span className="font-medium" style={{ color: 'var(--texte-extra-black)' }}>{displayName}</span>
          <span>· Insights</span>
        </div>
      </div>

      {/* Hero banner — brand gradient, key region facts at a glance */}
      <div
        className="rounded-2xl p-6 flex items-center justify-between overflow-hidden relative mb-4"
        style={{ background: 'var(--gradient-brand)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 85% 30%, white 0%, transparent 55%)' }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
            Région {displayName}
          </h1>
          <p className="text-sm text-white/75">
            {region?.chef_lieu ? `Chef-lieu : ${region.chef_lieu}` : 'Analyse détaillée des données sanitaires et climatiques'}
          </p>
        </div>
        <div className="relative z-10 hidden sm:flex items-center gap-5">
          <div className="text-center">
            <p className="text-white/70 text-xs">Superficie</p>
            <p className="text-white font-bold text-lg">
              {region ? `${region.area_km2.toLocaleString('fr-FR')} km²` : '—'}
            </p>
          </div>
          <div className="w-px h-10 bg-white/30" />
          <div className="text-center">
            <p className="text-white/70 text-xs">Population</p>
            <p className="text-white font-bold text-lg">
              {region ? `${(region.population_2023 / 1_000_000).toFixed(1)}M` : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div
        className='flex flex-row items-center gap-1 border-b'
        style={{ borderColor: 'var(--stroke-dark)' }}
      >
        {[
          { to: `/admin/regions/${regionId}/insight/ai`, label: 'Analyse IA', icon: <Sparkles size={15} />, roles: null },
          { to: `/admin/regions/${regionId}/insight/history`, label: 'Historique climatique', icon: <History size={15} />, roles: null },
          { to: `/admin/regions/${regionId}/insight/scenario`, label: 'Scénarios', icon: <FlaskConical size={15} />, roles: ['regional', 'national', 'admin'] },
          { to: `/admin/regions/${regionId}/insight/reports`, label: 'Rapports terrain', icon: <Rows3 size={15} />, roles: null },
          { to: `/admin/regions/${regionId}/insight/agents`, label: 'Agents', icon: <Users size={15} />, roles: ['regional', 'national', 'admin'] },
        ].filter(({ roles }) => roles === null || roles.includes(role))
         .map(({ to, label, icon }) => (
          <NavLinkComponent
            key={to}
            to={to}
            displayName={label}
            icon={icon}
            exact
            className='flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors rounded-t-lg'
            activeClassName='font-semibold border-b-2 -mb-px'
            style={{ color: 'var(--texte-gray)' }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="pt-2">
        <Outlet />
      </div>
    </div>
  )
}
