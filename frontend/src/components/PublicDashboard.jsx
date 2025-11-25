import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Fix for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Routing Component
const RoutingControl = ({ start, end }) => {
    const map = useMap();

    useEffect(() => {
        if (!start || !end) return;

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(start.lat, start.lng),
                L.latLng(end.lat, end.lng)
            ],
            routeWhileDragging: true,
            lineOptions: {
                styles: [{ color: '#6FA1EC', weight: 4 }]
            },
            show: false, // Hide the default instructions panel
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false
        }).addTo(map);

        return () => map.removeControl(routingControl);
    }, [map, start, end]);

    return null;
};

const PublicDashboard = () => {
    const [incidents, setIncidents] = useState([]);
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [routePoints, setRoutePoints] = useState({ start: null, end: null });

    // Hardcoded locations for demo
    const locations = {
        "Kigali Heights": { lat: -1.9441, lng: 30.0619 },
        "Remera": { lat: -1.9500, lng: 30.0580 },
        "Kimironko": { lat: -1.9350, lng: 30.0800 },
        "Kanombe": { lat: -1.9700, lng: 30.1000 },
        "Kabeza": { lat: -1.9550, lng: 30.1050 },
        "Nyamirambo": { lat: -1.9800, lng: 30.0500 }
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

    const handleCheckRoute = (e) => {
        e.preventDefault();
        const start = locations[startLocation];
        const end = locations[endLocation];

        if (start && end) {
            setRoutePoints({ start, end });
        } else {
            alert("Please select valid locations from the list.");
        }
    };

    // Helper to get icon based on type
    const getIcon = (type) => {
        let emoji = '⚠️';
        if (type === 'accident') emoji = '💥';
        if (type === 'congestion') emoji = '🚗';
        if (type === 'road_blockage') emoji = '🚧';

        return L.divIcon({
            className: 'custom-icon',
            html: `<div style="font-size: 24px;">${emoji}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
            {/* Header */}
            <header className="bg-gray-800 p-4 shadow-lg flex justify-between items-center z-20 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">
                        T
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-wider">TRAFFIC MONITOR</h1>
                        <p className="text-xs text-gray-400">Public Access Portal</p>
                    </div>
                </div>
                <Link
                    to="/login"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
                >
                    Official Login
                </Link>
            </header>

            <div className="flex flex-row flex-grow overflow-hidden relative">
                {/* Left Sidebar - Route & Incidents */}
                <div className="w-96 bg-gray-800/95 backdrop-blur-md p-4 flex flex-col border-r border-gray-700 z-10 shadow-xl overflow-hidden flex-shrink-0">

                    {/* Route Checker Section */}
                    <div className="mb-6 flex-shrink-0">
                        <h2 className="text-lg font-semibold mb-4 text-blue-400 flex items-center gap-2">
                            <span>📍</span> Check Your Route
                        </h2>
                        <form onSubmit={handleCheckRoute} className="space-y-3 bg-gray-700/30 p-4 rounded-xl border border-gray-600">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Start Point</label>
                                <select
                                    className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={startLocation}
                                    onChange={(e) => setStartLocation(e.target.value)}
                                >
                                    <option value="">Select Start...</option>
                                    {Object.keys(locations).map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Destination</label>
                                <select
                                    className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={endLocation}
                                    onChange={(e) => setEndLocation(e.target.value)}
                                >
                                    <option value="">Select Destination...</option>
                                    {Object.keys(locations).map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-2.5 rounded font-bold transition-all shadow-lg mt-2"
                            >
                                Check Route
                            </button>
                        </form>
                    </div>

                    {/* Incidents List Section */}
                    <div className="flex-grow flex flex-col min-h-0">
                        <h3 className="text-sm font-semibold text-gray-300 mb-3 border-b border-gray-700 pb-2 flex justify-between items-center">
                            <span>Active Alerts</span>
                            <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full border border-red-500/30">{incidents.length} Active</span>
                        </h3>

                        <div className="overflow-y-auto space-y-3 pr-2 custom-scrollbar flex-grow">
                            {incidents.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 italic">
                                    <p>No active incidents reported.</p>
                                    <p className="text-xs mt-1">Drive safely!</p>
                                </div>
                            ) : (
                                incidents.map(incident => (
                                    <div key={incident.id} className="bg-gray-700/40 p-3 rounded-lg border border-gray-600 hover:bg-gray-700/60 transition-colors group">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{incident.type === 'accident' ? '💥' : incident.type === 'congestion' ? '🚗' : '⚠️'}</span>
                                                <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${incident.type === 'accident' ? 'bg-red-500/20 text-red-400' :
                                                    incident.type === 'congestion' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                    {incident.type}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-gray-500">{new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>

                                        <div className="pl-1">
                                            <p className="text-sm text-gray-200 font-medium mb-1">{incident.description}</p>
                                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                                <span>📍</span>
                                                <span>Lat: {incident.latitude.toFixed(4)}, Lng: {incident.longitude.toFixed(4)}</span>
                                            </div>
                                            {incident.type === 'accident' && (
                                                <div className="mt-2 text-[10px] text-red-300 bg-red-900/20 p-1.5 rounded border border-red-900/30 flex items-center gap-1">
                                                    <span>🚨</span> High Severity - Delays Expected
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Map Area (Right Side) */}
                <div className="flex-grow h-full relative z-0 bg-gray-100">
                    <MapContainer
                        center={[-1.9441, 30.0619]}
                        zoom={13}
                        style={{ height: '100%', width: '100%', zIndex: 0 }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {/* Incidents Markers */}
                        {incidents.map(incident => (
                            <Marker
                                key={incident.id}
                                position={[incident.latitude, incident.longitude]}
                                icon={getIcon(incident.type)}
                            >
                                <Popup className="custom-popup">
                                    <div className="p-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xl">{incident.type === 'accident' ? '💥' : incident.type === 'congestion' ? '🚗' : '⚠️'}</span>
                                            <strong className="text-sm uppercase font-bold text-gray-800">{incident.type}</strong>
                                        </div>
                                        <p className="text-xs text-gray-600 mb-1">{incident.description}</p>
                                        <p className="text-[10px] text-gray-400">{new Date(incident.timestamp).toLocaleString()}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {/* Route Line */}
                        {routePoints.start && routePoints.end && (
                            <RoutingControl start={routePoints.start} end={routePoints.end} />
                        )}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default PublicDashboard;
