import React from 'react';

const AlertsView = ({ incidents }) => {
    return (
        <div className="p-8 h-full overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Active Alerts</h2>
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium border border-red-500/30">
                        High Priority: {incidents.filter(i => i.type === 'accident').length}
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                {incidents.map((incident) => (
                    <div key={incident.id} className="glass p-4 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center hover:bg-white/5 transition-colors group">
                        {/* Icon Box */}
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${incident.type === 'accident' ? 'bg-red-500/20 text-red-400' :
                                incident.type === 'congestion' ? 'bg-orange-500/20 text-orange-400' :
                                    'bg-blue-500/20 text-blue-400'
                            }`}>
                            <span className="text-2xl">
                                {incident.type === 'accident' ? '!' : incident.type === 'congestion' ? '≈' : 'i'}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="flex-grow">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg capitalize">{incident.type.replace('_', ' ')}</h3>
                                <span className="text-xs text-gray-400 font-mono">
                                    {new Date(incident.timestamp).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-gray-300 mt-1">{incident.description}</p>
                            <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                <span>Lat: {incident.latitude.toFixed(4)}</span>
                                <span>Lng: {incident.longitude.toFixed(4)}</span>
                                <span className={`uppercase font-bold ${incident.status === 'verified' ? 'text-green-500' : 'text-yellow-500'}`}>
                                    {incident.status}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 w-full md:w-auto">
                            {incident.video_url && (
                                <a
                                    href={incident.video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 md:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors text-center"
                                >
                                    View Video
                                </a>
                            )}
                            <button className="flex-1 md:flex-none px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-lg transition-colors border border-white/10">
                                Dismiss
                            </button>
                        </div>
                    </div>
                ))}

                {incidents.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl">No active alerts</p>
                        <p className="text-sm mt-2">All systems normal</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlertsView;
