import React, { useState } from 'react';
import {
    MapPinIcon,
    VideoCameraIcon,
    UserGroupIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const IncidentManagement = ({ incidents }) => {
    const [selectedIncident, setSelectedIncident] = useState(incidents[0] || null);

    if (!selectedIncident) {
        return (
            <div className="h-full flex items-center justify-center text-gray-500">
                Select an incident to view details
            </div>
        );
    }

    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* List Sidebar */}
            <div className="glass rounded-2xl border border-white/10 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-white/5 bg-white/5">
                    <h3 className="font-bold text-white">INCIDENT LIST</h3>
                </div>
                <div className="overflow-y-auto p-2 space-y-2 flex-grow custom-scrollbar">
                    {incidents.map((incident) => (
                        <button
                            key={incident.id}
                            onClick={() => setSelectedIncident(incident)}
                            className={`w-full text-left p-3 rounded-xl transition-all border ${selectedIncident.id === incident.id
                                    ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                                    : 'bg-white/5 border-transparent hover:bg-white/10'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${incident.type === 'accident' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                                    }`}>
                                    {incident.type}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                    {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-sm text-gray-200 truncate">{incident.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Detail View */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Header Card */}
                <div className="glass p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ExclamationTriangleIcon className="w-32 h-32 text-white" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-black text-white tracking-tight">INCIDENT #TRF-2024-{selectedIncident.id}</h2>
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">CRITICAL</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                            <div>
                                <span className="text-gray-400 block text-xs uppercase tracking-wider mb-1">Location</span>
                                <div className="flex items-center gap-2 text-white font-medium">
                                    <MapPinIcon className="w-4 h-4 text-blue-400" />
                                    {selectedIncident.description}
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-400 block text-xs uppercase tracking-wider mb-1">Coordinates</span>
                                <div className="font-mono text-blue-300">
                                    {selectedIncident.latitude.toFixed(4)}, {selectedIncident.longitude.toFixed(4)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="glass p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all group flex flex-col items-center justify-center gap-2">
                        <VideoCameraIcon className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold">VIEW EVIDENCE</span>
                    </button>
                    <button className="glass p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all group flex flex-col items-center justify-center gap-2">
                        <UserGroupIcon className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold">ASSIGN TEAM</span>
                    </button>
                    <button className="glass p-4 rounded-xl border border-white/10 hover:bg-green-500/20 transition-all group flex flex-col items-center justify-center gap-2">
                        <CheckCircleIcon className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold text-green-400">MARK RESOLVED</span>
                    </button>
                    <button className="glass p-4 rounded-xl border border-white/10 hover:bg-red-500/20 transition-all group flex flex-col items-center justify-center gap-2">
                        <XCircleIcon className="w-8 h-8 text-red-400 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold text-red-400">FALSE POSITIVE</span>
                    </button>
                </div>

                {/* Live Feed Placeholder */}
                <div className="glass rounded-2xl border border-white/10 overflow-hidden flex-grow relative min-h-[200px] group">
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center">
                            <VideoCameraIcon className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                            <span className="text-gray-500 font-mono text-sm">LIVE FEED SIGNAL LOST</span>
                        </div>
                    </div>
                    <div className="absolute top-4 left-4 bg-red-500/20 text-red-400 px-2 py-1 rounded text-[10px] font-bold border border-red-500/30 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        LIVE
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncidentManagement;
