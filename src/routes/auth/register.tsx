import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full flex items-center justify-between">
        <div className="w-full">
            Illustration
        </div>
        <div className='w-full h-full flex flex-col items-center justify-center gap-4'>
            test
        </div>
    </div>
  )
}
