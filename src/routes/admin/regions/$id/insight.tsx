import NavLinkComponent from '#/components/NavLinkComponent';
import { createFileRoute, Outlet, Link } from '@tanstack/react-router'
import { ChevronLeft, Rows3, Sparkles, Users, MapPin } from 'lucide-react';

export const Route = createFileRoute('/admin/regions/$id/insight')({
  component: InsightLayout,
})

function InsightLayout() {
  const regionName = Route.useParams().id;
  const displayName = regionName.charAt(0).toUpperCase() + regionName.slice(1).replace(/-/g, ' ');

  return (
    <div className="space-y-0">
      {/* Breadcrumb */}
      <div className='flex flex-row items-center gap-2 px-6 pt-4 pb-3'>
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

      {/* Hero banner */}
      <div
        className="mx-6 rounded-2xl p-6 flex items-center justify-between overflow-hidden relative mb-4"
        style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary2) 100%)' }}
      >
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 60%)'
        }} />
        <div className="relative z-10">
          <h1
            className="text-2xl font-bold text-white mb-1"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            Région {displayName}
          </h1>
          <p className="text-sm text-white/70">Analyse détaillée des données sanitaires et climatiques</p>
        </div>
        <div className="relative z-10 hidden sm:flex items-center gap-4">
          <div className="text-center">
            <p className="text-white/70 text-xs">Superficie</p>
            <p className="text-white font-bold text-lg">~12 500 km²</p>
          </div>
          <div className="w-px h-10 bg-white/30" />
          <div className="text-center">
            <p className="text-white/70 text-xs">Population</p>
            <p className="text-white font-bold text-lg">~3.2M</p>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div
        className='mx-6 flex flex-row items-center gap-1 border-b'
        style={{ borderColor: 'var(--stroke-dark)' }}
      >
        {[
          { to: `/admin/regions/${regionName}/insight/ai`, label: 'Analyse IA', icon: <Sparkles size={15} /> },
          { to: `/admin/regions/${regionName}/insight/reports`, label: 'Rapports', icon: <Rows3 size={15} /> },
          { to: `/admin/regions/${regionName}/insight/agents`, label: 'Agents', icon: <Users size={15} /> },
        ].map(({ to, label, icon }) => (
          <NavLinkComponent
            key={to}
            to={to}
            displayName={label}
            icon={icon}
            className='flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors rounded-t-lg'
            activeClassName='font-semibold border-b-2 -mb-px'
            style={{ color: 'var(--texte-gray)' }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="px-6 pt-4">
        <Outlet />
      </div>
    </div>
  )
}
