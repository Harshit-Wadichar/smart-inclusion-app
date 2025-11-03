import { useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch'
import SchemeForm from '../components/SchemeForm'
import api from '../utils/apiClient'

function IconVolunteer() {
    return (
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
            <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}
function IconScheme() {
    return (
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
            <path d="M3 13l9-9 9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 21H3v-8h18v8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}
function IconSOS() {
    return (
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
            <path d="M12 9v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12A9 9 0 1111.999 3 9 9 0 0121 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

export default function AdminDashboard() {
    const { data: volunteers = [], loading: vLoading } = useFetch('/volunteers', [])
    const { data: schemes = [], loading: sLoading } = useFetch('/schemes', [])
    const [sosList, setSosList] = useState([])
    const [loadingSOS, setLoadingSOS] = useState(true)

    useEffect(() => {
        let mounted = true
        api.get('/sos')
            .then(res => { if (mounted) setSosList(res.data || []) })
            .catch(() => { if (mounted) setSosList([]) })
            .finally(() => { if (mounted) setLoadingSOS(false) })
        return () => { mounted = false }
    }, [])

    const handleClearSOS = async (id) => {
        try {
            await api.post('/sos/resolve', { id })
            setSosList(prev => prev.filter(s => s._id !== id))
        } catch (err) {
            console.error(err)
            alert('Failed to resolve SOS (endpoint might not exist)')
        }
    }

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Admin Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">Overview of volunteers, schemes and active SOS alerts</p>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg shadow">
                    <div className="p-3 bg-white/10 rounded-full">
                        <IconVolunteer />
                    </div>
                    <div>
                        <div className="text-sm font-medium opacity-90">Volunteers</div>
                        <div className="text-2xl font-semibold">{vLoading ? '...' : (volunteers || []).length}</div>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg shadow">
                    <div className="p-3 bg-white/10 rounded-full">
                        <IconScheme />
                    </div>
                    <div>
                        <div className="text-sm font-medium opacity-90">Schemes</div>
                        <div className="text-2xl font-semibold">{sLoading ? '...' : (schemes || []).length}</div>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg shadow">
                    <div className="p-3 bg-white/10 rounded-full">
                        <IconSOS />
                    </div>
                    <div>
                        <div className="text-sm font-medium opacity-90">Active SOS</div>
                        <div className="text-2xl font-semibold">{loadingSOS ? '...' : (sosList || []).length}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Scheme Form */}
                <div className="p-6 bg-white border rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Create Scheme</h3>
                        <span className="text-xs text-gray-400">Quick add</span>
                    </div>
                    <div className="space-y-4">
                        <SchemeForm />
                    </div>
                </div>

                {/* SOS List */}
                <div className="p-6 bg-white border rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Recent SOS Alerts</h3>
                        <span className="text-xs text-gray-400">{loadingSOS ? 'Loading…' : `${sosList.length} active`}</span>
                    </div>

                    {loadingSOS && <div className="text-sm text-gray-500">Fetching latest alerts…</div>}
                    {!loadingSOS && sosList.length === 0 && <div className="text-sm text-gray-500">No active SOS alerts.</div>}

                    <div className="mt-3 space-y-3 max-h-96 overflow-auto pr-2">
                        {sosList.map(s => (
                            <div key={s._id || s.createdAt} className="flex flex-col sm:flex-row sm:items-start gap-3 p-3 border rounded-lg hover:shadow-md transition">
                                <div className="flex-none">
                                    <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-semibold">
                                        {s.user ? s.user.split(' ').map(n => n[0]).slice(0,2).join('') : 'SOS'}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="font-semibold">{s.user || 'Anonymous'}</div>
                                            <div className="text-sm text-gray-600">{s.message}</div>
                                        </div>
                                        <div className="text-xs text-gray-400">{new Date(s.createdAt).toLocaleString()}</div>
                                    </div>

                                    {s.location?.coordinates && (
                                        <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 11.5a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1118 0z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <span>Coords: {s.location.coordinates[1]?.toFixed(5)}, {s.location.coordinates[0]?.toFixed(5)}</span>
                                            <a
                                                className="ml-2 text-xs text-blue-600 hover:underline"
                                                href={`https://www.google.com/maps/search/?api=1&query=${s.location.coordinates[1]},${s.location.coordinates[0]}`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                View
                                            </a>
                                        </div>
                                    )}

                                    <div className="mt-3 flex gap-2">
                                        <button
                                            onClick={() => handleClearSOS(s._id)}
                                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition"
                                        >
                                            Mark Resolved
                                        </button>
                                        <button
                                            onClick={() => navigator.clipboard?.writeText(JSON.stringify(s))}
                                            className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200 transition"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Volunteers preview */}
            <div className="p-6 bg-white border rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Volunteers (preview)</h3>
                    <div className="text-sm text-gray-400">{vLoading ? 'Loading…' : `${Math.min((volunteers || []).length, 9)} shown`}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {(volunteers || []).slice(0, 9).map(v => (
                        <div key={v._id} className="p-4 flex items-start gap-3 border rounded hover:shadow-sm transition">
                            <div className="flex-none">
                                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-semibold">
                                    {(v.name || '').split(' ').map(n => n[0]).slice(0,2).join('')}
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="font-medium">{v.name}</div>
                                <div className="text-sm text-gray-600">{v.city} • {v.phone}</div>
                                <div className="text-xs mt-2 text-gray-500">Skills: {(v.skills || []).slice(0,4).join(', ') || '—'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}