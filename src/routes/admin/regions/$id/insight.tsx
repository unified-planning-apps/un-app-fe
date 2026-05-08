import NavLinkComponent from '#/components/NavLinkComponent';
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ChevronLeft, Rows3, Sparkle, Sparkles, Users } from 'lucide-react';

export const Route = createFileRoute('/admin/regions/$id/insight')({
  component: InsightLayout,
})

function InsightLayout() {
  const regionName = Route.useParams().id;
  return (
    <div>
      <div className='flex flex-row items-center gap-2'>
        <NavLinkComponent
          to='/admin/regions'
          icon={<ChevronLeft size={18} />}
          displayName='Back'
          className='font-medium bg-transparent underline underline-offset-4'
        />
        | {regionName} | Insights
      </div>
      <div className='w-full bg-primary h-30 flex flex-row items-center justify-space-between'>
        <h1>{regionName} region Insight</h1>
      </div>
      <div className='w-full flex flex-row items-center justify-center gap-10 border-b-2 border-gray-200'>
        <NavLinkComponent
          to='/admin/regions/$id/insight/ai'
          displayName='AI Insights'
          icon={<Sparkles size={18} />}
          className='font-medium bg-transparent p-2.5'
          activeClassName='font-bold bg-black-100  border-b-2 border-blue-800'
        />
        <NavLinkComponent
          to='/admin/regions/$id/insight/reports'
          displayName='Reports'
          icon={<Rows3 size={18} />}
          className='font-medium bg-transparent p-2.5'
          activeClassName='font-bold bg-blue-100  border-b-2 border-blue-800'
        />
        <NavLinkComponent
          to='/admin/regions/$id/insight/agents'
          displayName='Agents'
          icon={<Users size={18} />}
          className='font-medium bg-transparent p-2.5'
          activeClassName='font-bold bg-blue-100  border-b-2 border-blue-800'
        />
      </div>

      <Outlet />

    </div>
  )
}
