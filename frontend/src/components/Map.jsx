import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = ({ incidents }) => {
    const position = [-1.9441, 30.0619]; // Kigali coordinates

    return (
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            {/* Dark Matter Tile Layer for "Command Center" look */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {incidents.map((incident) => (
                <Marker key={incident.id} position={[incident.latitude, incident.longitude]}>
                    <Popup>
                        <div className="p-1 min-w-[200px]">
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${incident.type === 'accident' ? 'bg-red-500/20 text-red-400' :
                                        incident.type === 'congestion' ? 'bg-orange-500/20 text-orange-400' :
                                            'bg-blue-500/20 text-blue-400'
                                    }`}>
                                    {incident.type}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                    {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-sm text-white font-medium mb-2">{incident.description}</p>
                            {incident.video_url && (
                                <a href={incident.video_url} target="_blank" rel="noopener noreferrer" className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 rounded transition-colors">
                                    View Footage
                                </a>
                            )}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
