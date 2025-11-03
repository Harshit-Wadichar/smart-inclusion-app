import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import api from '../utils/apiClient'

// fix default marker icon path for bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
    iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
    shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

export default function AccessibilityMap({ center = [28.6139, 77.2090], zoom = 13 }) {
    const [places, setPlaces] = useState([])
    const [volunteers, setVolunteers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true
        Promise.all([
            api.get('/places').catch(() => ({ data: [] })),
            api.get('/volunteers').catch(() => ({ data: [] }))
        ]).then(([placesRes, volunteersRes]) => {
            if (!isMounted) return
            setPlaces(placesRes.data || [])
            setVolunteers(volunteersRes.data || [])
            setLoading(false)
        })
        return () => { isMounted = false }
    }, [])

    return (
        <div className="max-w-5xl mx-auto p-4">
            <header className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Accessibility Map</h1>
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-medium text-gray-700">{places.length}</span> places and <span className="font-medium text-gray-700">{volunteers.length}</span> volunteers
                    </p>
                </div>
                <div className="text-sm text-gray-500">
                    Center: <span className="font-mono text-xs text-gray-700">{center.join(', ')}</span>
                </div>
            </header>

            <div className="relative rounded-lg shadow-md overflow-hidden border border-gray-200">
                <MapContainer
                    center={center}
                    zoom={zoom}
                    className="w-full h-96 sm:h-[500px]"
                    id="map"
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Places markers (accessible places) */}
                    {places.map(place => (
                        place.location && place.location.coordinates && (
                            <Marker
                                key={place._id}
                                position={[place.location.coordinates[1], place.location.coordinates[0]]}
                            >
                                <Popup>
                                    <div className="max-w-xs">
                                        <div className="font-semibold text-gray-800">{place.name}</div>
                                        <div className="text-sm text-gray-600 mt-1">{place.description}</div>
                                        <div className="mt-2 text-xs text-gray-500">Accessibility: <span className="font-medium text-gray-700">{place.accessibility || 'N/A'}</span></div>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    ))}

                    {/* Volunteers markers */}
                    {volunteers.map(v => (
                        v.location && v.location.coordinates && (
                            <Marker
                                key={v._id}
                                position={[v.location.coordinates[1], v.location.coordinates[0]]}
                            >
                                <Popup>
                                    <div className="max-w-xs">
                                        <div className="font-semibold text-gray-800">{v.name}</div>
                                        <div className="text-sm text-gray-600 mt-1">{v.city} • <span className="font-mono text-xs">{v.phone}</span></div>
                                        <div className="mt-2 text-xs text-gray-500">Skills: <span className="font-medium text-gray-700">{(v.skills || []).join(', ') || 'N/A'}</span></div>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    ))}
                </MapContainer>

                {/* Loading overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <div className="flex items-center space-x-3">
                            <svg className="w-6 h-6 text-gray-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                            <span className="text-gray-700">Loading map data...</span>
                        </div>
                    </div>
                )}
            </div>

            <footer className="mt-3 text-sm text-gray-500">
                Tip: click markers to see details. Map styling via Tailwind CSS.
            </footer>
        </div>
    )
}