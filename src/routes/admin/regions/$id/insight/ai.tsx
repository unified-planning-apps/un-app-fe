import WeatherDetail from '#/components/WeatherDetail';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/regions/$id/insight/ai')({
  component: RouteComponent,
})

function RouteComponent() {
  const regionName = Route.useParams().id;
  return (
    <div className='flex flex-wrap gap-4 p-3.5'>
      <WeatherDetail 
        name='Temperature'
        description={`The current temperature in ${regionName[0].toUpperCase() + regionName.slice(1)}`}>
        <p>Current temperature: 25°C</p>
      </WeatherDetail>
      <WeatherDetail 
        name='Humidity'
        description={`The current humidity in ${regionName[0].toUpperCase() + regionName.slice(1)}`}>
        <p>Current humidity: 60%</p>
      </WeatherDetail>
      <WeatherDetail 
        name='Wind Speed'
        description={`The current wind speed in ${regionName[0].toUpperCase() + regionName.slice(1)}`}>
        <p>Current wind speed: 10 km/h</p>
      </WeatherDetail>
    </div>
  )
}
