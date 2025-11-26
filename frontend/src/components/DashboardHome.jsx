import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { AlertTriangle, Clock, CheckCircle, Activity, ShieldCheck } from 'lucide-react';
import L from 'leaflet';

// Helper to get icon based on type
const getMarkerIcon = (type) => {
    const colors = {
        accident: '#EF4444',
        congestion: '#F59E0B',
        road_blockage: '#3B82F6',
        default: '#10B981'
    };

    const color = colors[type] || colors.default;

    return L.divIcon({
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
        className: '',
        iconSize: [24, 24]
    });
};

const DashboardHome = ({ incidents, loading }) => {
    const stats = [
        {
            label: 'Active Incidents',
            value: incidents.length,
            subtext: `${incidents.filter(i => i.type === 'accident').length} Critical`,
            icon: AlertTriangle,
            color: 'red'
        },
        {
            label: 'Avg Response Time',
            value: '4.2m',
            subtext: '↓ 12% vs last week',
            icon: Clock,
            color: 'blue'
        },
        {
            label: 'Resolved Today',
            value: '28',
            subtext: '92% Clearance Rate',
            icon: CheckCircle,
            color: 'green'
        },
        {
            label: 'System Health',
            value: '98%',
            subtext: 'All Systems Operational',
            icon: Activity,
            color: 'purple'
        }
    ];

    return (
        <div className="p-6 h-full overflow-y-auto custom-scrollbar">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-white">{stat.value}</p>
                            </div>
                            <div className={`p-3 bg-${stat.color}-500/20 rounded-lg`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                            </div>
                        </div>
                        <p className="text-sm text-green-400">{stat.subtext}</p>
                    </div>
                ))}
            </div>

            {/* Map and Incidents Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Live Traffic Heatmap */}
                <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                            LIVE TRAFFIC HEATMAP
                        </h3>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded border border-red-500/30">High Congestion (0)</span>
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded border border-yellow-500/30">Medium (0)</span>
                        </div>
                    </div>
                    <div className="h-96 bg-slate-900 rounded-lg overflow-hidden relative z-0">
                        <MapContainer
                            center={[-1.9441, 30.0619]}
                            zoom={13}
                            className="h-full w-full"
                            style={{ height: '100%', width: '100%', zIndex: 0 }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {incidents.map(incident => (
                                <Marker
                                    key={incident.id}
                                    position={[incident.latitude, incident.longitude]}
                                    icon={getMarkerIcon(incident.type)}
                                >
                                    <Popup>
                                        <div className="text-sm">
                                            <p className="font-semibold">{incident.description}</p>
                                            <p className="text-xs text-gray-600 mt-1">Type: {incident.type}</p>
                                            <p className="text-xs text-gray-500">{new Date(incident.timestamp).toLocaleString()}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>

                {/* Incident Feed */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col h-full">
                    <h3 className="text-lg font-semibold text-white mb-4">INCIDENT FEED</h3>
                    <p className="text-sm text-slate-400 mb-2">Real-time Stream</p>

                    <div className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar max-h-[400px]">
                        {loading ? (
                            <div className="text-center py-10 text-slate-500 animate-pulse">Initializing Feed...</div>
                        ) : incidents.length === 0 ? (
                            <div className="flex items-center justify-center h-64 text-slate-500">
                                <div className="text-center">
                                    <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p className="text-sm font-mono">NO ACTIVE INCIDENTS</p>
                                    <p className="text-xs mt-2">All clear on monitored routes</p>
                                </div>
                            </div>
                        ) : (
                            incidents.map(incident => (
                                <div key={incident.id} className="p-3 bg-slate-900 rounded-lg border border-slate-700 hover:bg-slate-700/50 transition-colors">
                                    <div className="flex items-start">
                                        <AlertTriangle className={`w-4 h-4 mr-2 mt-0.5 ${incident.type === 'accident' ? 'text-red-400' : 'text-yellow-400'}`} />
                                        <div>
                                            <p className="text-sm text-white font-medium">{incident.description}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded ${incident.type === 'accident' ? 'bg-red-500/20 text-red-400' :
                                                        incident.type === 'congestion' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                    {incident.type}
                                                </span>
                                                <span className="text-[10px] text-slate-400">{new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Recommended Police Deployment */}
            <div className="mt-6 bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-2 text-blue-400" />
                    RECOMMENDED POLICE DEPLOYMENT
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {incidents.filter(i => i.type === 'accident').length === 0 ? (
                        <div className="text-center py-8 text-slate-400 col-span-2">
                            <p className="text-sm">No critical incidents requiring immediate deployment.</p>
                        </div>
                    ) : (
                        incidents.filter(i => i.type === 'accident').map(incident => (
                            <div key={incident.id} className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">💥</span>
                                        <span className="font-bold text-sm text-white">Accident at {incident.latitude.toFixed(3)}, {incident.longitude.toFixed(3)}</span>
                                    </div>
                                    <p className="text-xs text-blue-200">Requires Traffic Control Unit</p>
                                </div>
                                <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-600/20">
                                    DEPLOY UNIT
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
