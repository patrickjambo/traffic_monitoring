import React from 'react';
import {
    ChartBarIcon,
    MapIcon,
    ClipboardDocumentListIcon,
    BellAlertIcon,
    UserGroupIcon,
    Cog6ToothIcon,
    VideoCameraIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <ChartBarIcon /> },
        { id: 'map', label: 'Live Map', icon: <MapIcon /> },
        { id: 'incidents', label: 'Incidents', icon: <ClipboardDocumentListIcon /> },
        { id: 'alerts', label: 'Alerts Center', icon: <BellAlertIcon /> },
        { id: 'analytics', label: 'Analytics', icon: <ChartBarIcon /> }, // Reusing icon for now
        { id: 'users', label: 'User Management', icon: <UserGroupIcon /> },
        { id: 'settings', label: 'System Settings', icon: <Cog6ToothIcon /> },
    ];

    return (
        <aside className="w-64 md:w-20 lg:w-72 flex-shrink-0 glass-panel flex flex-col justify-between z-30 relative h-full bg-[#050b14]/95 backdrop-blur-xl">
            <div>
                <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)] relative z-10 shrink-0">
                        <VideoCameraIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4 block md:hidden lg:block">
                        <h1 className="font-bold text-xl tracking-wide neon-text-blue">RNP<span className="text-blue-400"> TRAFFIC</span></h1>
                        <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">Project Logo</span>
                    </div>
                </div>

                <nav className="mt-8 px-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center justify-center lg:justify-start p-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${activeTab === item.id
                                ? 'bg-blue-600/20 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)] border border-blue-500/30'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                                }`}
                        >
                            {activeTab === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_#3b82f6]" />}
                            <div className={`w-5 h-5 transition-transform duration-300 ${activeTab === item.id ? 'scale-110 text-blue-400' : 'group-hover:scale-110'}`}>
                                {item.icon}
                            </div>
                            <span className="ml-3 block md:hidden lg:block font-medium text-sm tracking-wide">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className="p-6 border-t border-white/5">
                <div className="glass p-4 rounded-xl mb-4 block md:hidden lg:block">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-gray-300">SYSTEM STATUS</span>
                    </div>
                    <span className="text-[10px] text-green-400 font-mono block">OPERATIONAL</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
