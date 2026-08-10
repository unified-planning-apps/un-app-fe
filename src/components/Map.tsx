import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { REGIONS } from '#/lib/regions'
import { Button } from './ui/button'
import { useNavigate } from '@tanstack/react-router'
import { useMalariaRiskMap } from '#/hooks/use-malaria'

// Madagascar Center & Bounds
const MADAGASCAR_CENTER: [number, number] = [-18.7669, 46.8691]
const MADAGASCAR_BOUNDS: L.LatLngBoundsExpression = [
    [-26.0, 43.0], // Southwest corner
    [-11.0, 51.0]  // Northeast corner
]

const RISK_COLOR: Record<string, string> = {
    faible: '#22c55e',
    moyen: '#eab308',
    'élevé': '#f97316',
    'très élevé': '#ef4444',
}

export default function MapView() {
    const navigate = useNavigate();
    const riskMap = useMalariaRiskMap()

    const riskByRegion = new Map(
        riskMap.data?.carte.map((c) => [c.region_id, c]) ?? [],
    )

    const handleRegionNavigation = (regionId: string) => {
        navigate({ to: `/admin/regions/${regionId}/insight/ai` });
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
                REGIONS.map((region) => {
                    const risk = riskByRegion.get(region.id)
                    const color = risk ? RISK_COLOR[risk.niveau_risque] ?? '#206ebb' : '#206ebb'
                    return (
                        <Marker
                            key={region.id}
                            position={[region.latitude, region.longitude]}
                            icon={L.divIcon({
                                className: '',
                                html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.15)"></div>`,
                            })}
                        >
                            <Popup>
                                <div className="space-y-2">
                                    <p className="font-semibold text-sm">{region.name}</p>
                                    {risk && (
                                        <p className="text-xs">
                                            Risque paludisme : <span style={{ color }}>{risk.niveau_risque}</span>
                                        </p>
                                    )}
                                    <Button className='cursor-pointer w-full' size="sm" onClick={() => handleRegionNavigation(region.id)}>
                                        View details
                                    </Button>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })
            }
        </MapContainer>
    )
}
