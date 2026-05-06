import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { REGION_LOCATION } from '#/shared/constants'
import { Button } from './ui/button'
import { useNavigate } from '@tanstack/react-router'

// Madagascar Center & Bounds
const MADAGASCAR_CENTER: [number, number] = [-18.7669, 46.8691]
const MADAGASCAR_BOUNDS: L.LatLngBoundsExpression = [
    [-26.0, 43.0], // Southwest corner
    [-11.0, 51.0]  // Northeast corner
]

export default function Map() {
    const navigate = useNavigate();
    const handleRegionNavigation = (region: string) => {
        navigate({ to: `/admin/regions/${region.toLowerCase()}/insight/ai` });
    }
    return (
        <MapContainer
            center={MADAGASCAR_CENTER}
            zoom={7}
            minZoom={7}
            maxZoom={8}
            scrollWheelZoom={false}
            maxBounds={MADAGASCAR_BOUNDS}
            maxBoundsViscosity={1.0}
            className="h-150 w-full rounded-lg border"
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {
                Object.entries(REGION_LOCATION).map(([region, coords]) => (
                    <Marker key={region} position={[coords.lat, coords.lng]}>
                        <Popup>
                            <Button className='cursor-pointer' onClick={() => handleRegionNavigation(region)}>
                                {region}
                            </Button>
                        </Popup>
                    </Marker>
                ))
            }
        </MapContainer>
    )
}