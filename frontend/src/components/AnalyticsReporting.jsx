import React from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const AnalyticsReporting = () => {
    // Mock Data
    const hourlyData = [
        { time: '06:00', incidents: 2 },
        { time: '08:00', incidents: 8 },
        { time: '10:00', incidents: 5 },
        { time: '12:00', incidents: 6 },
        { time: '14:00', incidents: 12 },
        { time: '16:00', incidents: 15 },
        { time: '18:00', incidents: 10 },
        { time: '20:00', incidents: 4 },
    ];

    const zoneData = [
        { zone: 'City Center', accidents: 12, congestion: 25 },
        { zone: 'Kimironko', accidents: 8, congestion: 15 },
        { zone: 'Kacyiru', accidents: 5, congestion: 10 },
        { zone: 'Remera', accidents: 15, congestion: 20 },
        { zone: 'Nyamirambo', accidents: 7, congestion: 12 },
    ];

    return (
        <div className="h-full p-6 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">ANALYTICS & REPORTS</h2>
                    <span className="text-sm text-gray-400">Traffic Trends & Performance Metrics</span>
                </div>
                <div className="flex gap-3">
                    <button className="glass px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        Export PDF
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30">
                        Download CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Peak Hours Chart */}
                <div className="glass p-6 rounded-2xl border border-white/10">
                    <h3 className="font-bold text-white mb-4">PEAK HOURS • INCIDENT FREQUENCY</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={hourlyData}>
                                <defs>
                                    <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00F3FF" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00F3FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#00F3FF' }}
                                />
                                <Area type="monotone" dataKey="incidents" stroke="#00F3FF" strokeWidth={3} fillOpacity={1} fill="url(#colorIncidents)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Hotspot Zones Chart */}
                <div className="glass p-6 rounded-2xl border border-white/10">
                    <h3 className="font-bold text-white mb-4">HOTSPOT ZONES • WEEKLY COMPARISON</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={zoneData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="zone" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                />
                                <Bar dataKey="accidents" name="Accidents" fill="#F87171" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="congestion" name="Congestion" fill="#FB923C" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl border border-white/10 text-center">
                    <span className="text-gray-400 text-xs uppercase tracking-wider">Most Affected Road</span>
                    <div className="text-xl font-bold text-white mt-2">KN 3 Rd</div>
                    <span className="text-red-400 text-xs">15 Incidents this week</span>
                </div>
                <div className="glass p-6 rounded-2xl border border-white/10 text-center">
                    <span className="text-gray-400 text-xs uppercase tracking-wider">Peak Congestion Time</span>
                    <div className="text-xl font-bold text-white mt-2">17:30 - 18:30</div>
                    <span className="text-orange-400 text-xs">Avg delay: 25 mins</span>
                </div>
                <div className="glass p-6 rounded-2xl border border-white/10 text-center">
                    <span className="text-gray-400 text-xs uppercase tracking-wider">Safest Zone</span>
                    <div className="text-xl font-bold text-white mt-2">Kiyovu</div>
                    <span className="text-green-400 text-xs">0 Accidents today</span>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsReporting;
