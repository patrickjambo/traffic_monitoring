import React from 'react';
import { motion } from 'framer-motion';
import Map from './Map';
import IncidentCard from './IncidentCard';
import {
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';

const KPICard = ({ title, value, subtext, icon, color, glow }) => (
    <div className={`glass p-5 rounded-2xl border border-white/5 relative overflow-hidden group ${glow}`}>
        <div className={`absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity ${color}`}>
            {icon}
        </div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</h3>
        <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-white tracking-tight">{value}</span>
            <span className={`text-xs font-bold mb-1 ${color}`}>{subtext}</span>
        </div>
    </div>
);

const DashboardHome = ({ incidents, loading }) => {
    const stats = {
        active: incidents.filter(i => i.status === 'verified').length,
        critical: incidents.filter(i => i.type === 'accident').length,
        resolved: 28, // Mock data for now
        avgResponse: '4.2m'
    };

    return (
        <div className="h-full flex flex-col gap-6 p-6 overflow-hidden">
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-shrink-0">
                <KPICard
                    title="Active Incidents"
                    value={stats.active}
                    subtext={`${stats.critical} Critical`}
                    icon={<ExclamationTriangleIcon className="w-12 h-12" />}
                    color="text-red-400"
                    glow="shadow-[0_0_20px_rgba(248,113,113,0.1)]"
                />
                <KPICard
                    title="Avg Response Time"
                    value={stats.avgResponse}
                    subtext="↓ 12% vs last week"
                    icon={<ClockIcon className="w-12 h-12" />}
                    color="text-blue-400"
                />
                <KPICard
                    title="Resolved Today"
                    value={stats.resolved}
                    subtext="92% Clearance Rate"
                    icon={<CheckCircleIcon className="w-12 h-12" />}
                    color="text-green-400"
                />
                <KPICard
                    title="System Health"
                    value="98%"
                    subtext="All Systems Operational"
                    icon={<ShieldCheckIcon className="w-12 h-12" />}
                    color="text-purple-400"
                />
            </div>

            {/* Main Content Grid */}
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Map Section (2/3 width) */}
                <div className="lg:col-span-2 glass rounded-2xl border border-white/10 overflow-hidden relative flex flex-col">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-md z-10">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            LIVE TRAFFIC HEATMAP
                        </h3>
                        <div className="flex gap-2">
                            <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/30">High Congestion (8)</span>
                            <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-1 rounded border border-orange-500/30">Medium (12)</span>
                        </div>
                    </div>
                    <div className="flex-grow relative">
                        <Map incidents={incidents} />
                        {/* Gradient Overlay for better text visibility if needed */}
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 to-transparent" />
                    </div>
                </div>

                {/* Feed Section (1/3 width) */}
                <div className="glass rounded-2xl border border-white/10 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-white/5 bg-white/5 backdrop-blur-md">
                        <h3 className="font-bold text-white">INCIDENT FEED</h3>
                        <span className="text-xs text-gray-400">Real-time Stream</span>
                    </div>

                    <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {loading ? (
                            <div className="text-center py-10 text-gray-500 animate-pulse">Initializing Feed...</div>
                        ) : (
                            incidents.map((incident) => (
                                <IncidentCard key={incident.id} incident={incident} />
                            ))
                        )}
                        {incidents.length === 0 && !loading && (
                            <div className="text-center py-10 text-gray-500 font-mono text-xs">NO ACTIVE INCIDENTS</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
