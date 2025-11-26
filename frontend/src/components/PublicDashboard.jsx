import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { AlertTriangle, Navigation, MapPin, Bell } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Routing Component using Polyline
function RouteDisplay({ start, end }) {
    const map = useMap();

    useEffect(() => {
        if (!start || !end || !map) return;

        // Clear previous routes
        map.eachLayer((layer) => {
            if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
                map.removeLayer(layer);
            }
        });

        // Simple straight line route (in production, you'd use a routing API)
        const routeLine = L.polyline([start, end], {
            color: '#3B82F6',
            weight: 4,
            opacity: 0.8,
            smoothFactor: 1
        }).addTo(map);

        // Add animated dash
        let offset = 0;
        const animate = () => {
            offset += 0.5;
            if (offset > 20) offset = 0;
            routeLine.setStyle({ dashOffset: offset + 'px' });
            requestAnimationFrame(animate);
        };
        animate();

        // Fit bounds to show entire route
        map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

        return () => {
            map.removeLayer(routeLine);
        };
    }, [start, end, map]);

    return null;
}

const PublicDashboard = () => {
    const [startPoint, setStartPoint] = useState('');
    const [destination, setDestination] = useState('');
    const [showRoute, setShowRoute] = useState(false);
    const [incidents, setIncidents] = useState([]);

    // Mock alerts for now
    const [alerts, setAlerts] = useState([
        {
            id: 1,
            type: 'warning',
            message: 'Heavy traffic on KN 3 Ave',
            time: '5 min ago',
            severity: 'medium',
            icon: '⚠️'
        },
        {
            id: 2,
            type: 'info',
            message: 'Road construction on KG 11 Ave',
            time: '15 min ago',
            severity: 'low',
            icon: '🚧'
        },
        {
            id: 3,
            type: 'danger',
            message: 'Accident reported near Kigali Convention Centre',
            time: '23 min ago',
            severity: 'high',
            icon: '🚨'
        }
    ]);

    const locations = {
        'Kigali Heights': { lat: -1.9536, lng: 30.0919 },
        'Remera': { lat: -1.9578, lng: 30.1132 },
        'Kimironko': { lat: -1.9443, lng: 30.1257 },
        'Nyabugogo': { lat: -1.9706, lng: 30.0588 },
        'City Center': { lat: -1.9536, lng: 30.0606 },
        'Kigali Convention Centre': { lat: -1.9514, lng: 30.0944 },
        'Airport': { lat: -1.9686, lng: 30.1395 }
    };

    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                const response = await axios.get('http://localhost:8000/incidents/');
                setIncidents(response.data);
            } catch (error) {
                console.error("Error fetching incidents:", error);
            }
        };

        fetchIncidents();
        const interval = setInterval(fetchIncidents, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleCheckRoute = () => {
        if (startPoint && destination && startPoint !== destination) {
            setShowRoute(true);
        }
    };

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
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            {/* Header */}
            <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                            <Navigation className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">TRAFFIC MONITOR</h1>
                            <p className="text-xs text-slate-400">Public Access Portal</p>
                        </div>
                    </div>
                    <Link
                        to="/login"
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition shadow-lg shadow-blue-600/20"
                    >
                        Official Login
                    </Link>
                </div>
            </header>

            <div className="flex flex-grow overflow-hidden relative flex-row">
                {/* Left Sidebar */}
                <div className="w-80 bg-slate-800 border-r border-slate-700 overflow-y-auto flex-shrink-0 z-10">
                    <div className="p-6 space-y-6">
                        {/* Check Route Section */}
                        <div className="bg-slate-900 rounded-xl p-5 border border-slate-700">
                            <h2 className="text-base font-bold text-white mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                                Check Your Route
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                                        Start Point
                                    </label>
                                    <select
                                        value={startPoint}
                                        onChange={(e) => {
                                            setStartPoint(e.target.value);
                                            setShowRoute(false);
                                        }}
                                        className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    >
                                        <option value="">Select Start...</option>
                                        {Object.keys(locations).map(loc => (
                                            <option key={loc} value={loc}>{loc}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                                        Destination
                                    </label>
                                    <select
                                        value={destination}
                                        onChange={(e) => {
                                            setDestination(e.target.value);
                                            setShowRoute(false);
                                        }}
                                        className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    >
                                        <option value="">Select Destination...</option>
                                        {Object.keys(locations).map(loc => (
                                            <option key={loc} value={loc}>{loc}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={handleCheckRoute}
                                    disabled={!startPoint || !destination || startPoint === destination}
                                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition flex items-center justify-center shadow-lg"
                                >
                                    <Navigation className="w-4 h-4 mr-2" />
                                    Check Route
                                </button>
                            </div>
                        </div>

                        {/* Recent Incidents */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold text-white">Recent Incidents</h3>
                                <span className="px-2.5 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">
                                    {incidents.length} Active
                                </span>
                            </div>

                            <div className="space-y-2">
                                {incidents.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500">
                                        <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm italic">No active incidents reported</p>
                                    </div>
                                ) : (
                                    incidents.map(inc => (
                                        <div
                                            key={inc.id}
                                            className={`p-3 bg-slate-900 rounded-lg border-l-4 ${inc.type === 'accident' ? 'border-red-500' :
                                                    inc.type === 'congestion' ? 'border-yellow-500' :
                                                        'border-green-500'
                                                } hover:bg-slate-800 transition cursor-pointer`}
                                        >
                                            <div className="flex items-start">
                                                <AlertTriangle className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${inc.type === 'accident' ? 'text-red-400' :
                                                        inc.type === 'congestion' ? 'text-yellow-400' :
                                                            'text-green-400'
                                                    }`} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-white font-medium">{inc.description}</p>
                                                    <p className="text-xs text-slate-400 mt-1">Lat: {inc.latitude.toFixed(3)}, Lng: {inc.longitude.toFixed(3)}</p>
                                                    <p className="text-xs text-slate-500 mt-1">{new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Active Alerts */}
                        <div>
                            <h3 className="text-sm font-bold text-white mb-3 flex items-center">
                                <Bell className="w-4 h-4 mr-2 text-yellow-400" />
                                Active Alerts
                            </h3>
                            <div className="space-y-2">
                                {alerts.map(alert => (
                                    <div
                                        key={alert.id}
                                        className={`p-3 rounded-lg border ${alert.severity === 'high' ? 'bg-red-500/10 border-red-500/30' :
                                                alert.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                                                    'bg-blue-500/10 border-blue-500/30'
                                            } hover:shadow-lg transition`}
                                    >
                                        <div className="flex items-start space-x-2">
                                            <span className="text-lg">{alert.icon}</span>
                                            <div className="flex-1">
                                                <p className="text-sm text-white font-medium leading-snug">{alert.message}</p>
                                                <p className="text-xs text-slate-400 mt-1">{alert.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="flex-1 relative bg-gray-100 h-full">
                    <MapContainer
                        center={[-1.9536, 30.0919]}
                        zoom={13}
                        className="h-full w-full"
                        style={{ height: '100%', width: '100%', zIndex: 0 }}
                        zoomControl={true}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {showRoute && startPoint && destination && locations[startPoint] && locations[destination] && (
                            <>
                                <RouteDisplay
                                    start={locations[startPoint]}
                                    end={locations[destination]}
                                />
                                <Marker position={locations[startPoint]} icon={L.divIcon({
                                    html: `<div style="background-color: #10B981; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">S</div>`,
                                    className: '',
                                    iconSize: [24, 24],
                                    iconAnchor: [12, 12]
                                })}>
                                    <Popup>
                                        <div className="text-sm">
                                            <p className="font-bold text-green-600">Start Point</p>
                                            <p className="text-xs mt-1">{startPoint}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                                <Marker position={locations[destination]} icon={L.divIcon({
                                    html: `<div style="background-color: #EF4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">D</div>`,
                                    className: '',
                                    iconSize: [24, 24],
                                    iconAnchor: [12, 12]
                                })}>
                                    <Popup>
                                        <div className="text-sm">
                                            <p className="font-bold text-red-600">Destination</p>
                                            <p className="text-xs mt-1">{destination}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            </>
                        )}

                        {incidents.map(incident => (
                            <Marker
                                key={incident.id}
                                position={[incident.latitude, incident.longitude]}
                                icon={getMarkerIcon(incident.type)}
                            >
                                <Popup>
                                    <div className="text-sm p-1">
                                        <p className="font-bold text-gray-800">{incident.description}</p>
                                        <p className="text-xs text-gray-600 mt-1">Type: {incident.type}</p>
                                        <p className="text-xs text-gray-500 mt-1">{new Date(incident.timestamp).toLocaleString()}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    {/* Map Legend */}
                    <div className="absolute bottom-6 right-6 bg-slate-800/95 backdrop-blur border border-slate-700 rounded-lg p-4 shadow-2xl z-[1000]">
                        <h4 className="text-xs font-bold text-white mb-3 uppercase tracking-wide">Map Legend</h4>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow"></div>
                                <span className="text-xs text-slate-300">Accident (High)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full border-2 border-white shadow"></div>
                                <span className="text-xs text-slate-300">Congestion (Medium)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow"></div>
                                <span className="text-xs text-slate-300">Road Block (Low)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicDashboard;
