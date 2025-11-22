import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from './components/Map';
import AnalyticsView from './components/AnalyticsView';
import AlertsView from './components/AlertsView';
import {
  ChartBarIcon,
  MapIcon,
  BellAlertIcon,
  VideoCameraIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

function App() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/incidents/');
        setIncidents(response.data);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
    const interval = setInterval(fetchIncidents, 5000); // Poll faster for "real-time" feel
    return () => clearInterval(interval);
  }, []);

  // Stats calculation
  const stats = {
    total: incidents.length,
    accidents: incidents.filter(i => i.type === 'accident').length,
    congestion: incidents.filter(i => i.type === 'congestion').length,
    active: incidents.filter(i => i.status === 'verified').length
  };

  return (
    <div className="flex h-screen w-full text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 flex-shrink-0 glass-panel flex flex-col justify-between z-20 transition-all duration-300">
        <div>
          <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-white/5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
              <VideoCameraIcon className="w-5 h-5 text-white" />
            </div>
            <span className="ml-3 font-bold text-lg hidden lg:block tracking-wide">TrafficAI</span>
          </div>

          <nav className="mt-6 px-2 space-y-2">
            <NavItem icon={<MapIcon />} label="Live Map" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <NavItem icon={<ChartBarIcon />} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
            <NavItem icon={<BellAlertIcon />} label="Alerts" active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')} badge={incidents.length} />
          </nav>
        </div>

        <div className="p-4 border-t border-white/5">
          <button className="flex items-center justify-center lg:justify-start w-full p-2 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
            <Cog6ToothIcon className="w-6 h-6" />
            <span className="ml-3 hidden lg:block text-sm font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow relative bg-slate-900 h-full overflow-hidden">
        {/* Header Overlay (Only show on Map/Dashboard view) */}
        {activeTab === 'dashboard' && (
          <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
            <div className="glass px-6 py-3 rounded-2xl pointer-events-auto flex gap-6 shadow-2xl shadow-black/20">
              <StatItem label="Total Incidents" value={stats.total} color="text-white" />
              <div className="w-px bg-white/10"></div>
              <StatItem label="Accidents" value={stats.accidents} color="text-red-400" />
              <div className="w-px bg-white/10"></div>
              <StatItem label="Congestion" value={stats.congestion} color="text-orange-400" />
            </div>

            <div className="glass px-4 py-2 rounded-xl pointer-events-auto flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-medium text-gray-300">System Online</span>
            </div>
          </div>
        )}

        {/* Content Switcher */}
        {activeTab === 'dashboard' && (
          <>
            <div className="absolute inset-0 z-0">
              <Map incidents={incidents} />
            </div>
            {/* Recent Activity Sidebar (Floating) */}
            <div className="absolute top-24 right-4 bottom-4 w-80 pointer-events-none flex flex-col gap-4">
              <div className="glass rounded-2xl p-4 flex-grow overflow-hidden flex flex-col pointer-events-auto shadow-2xl shadow-black/50">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Live Feed</h3>
                <div className="overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading feed...</div>
                  ) : (
                    incidents.map((incident) => (
                      <IncidentCard key={incident.id} incident={incident} />
                    ))
                  )}
                  {incidents.length === 0 && !loading && (
                    <div className="text-center py-10 text-gray-500">No active incidents</div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && <AnalyticsView incidents={incidents} />}
        {activeTab === 'alerts' && <AlertsView incidents={incidents} />}

      </main>
    </div>
  );
}

// Sub-components
const NavItem = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-center lg:justify-start p-3 rounded-xl transition-all duration-200 group ${active ? 'bg-blue-600 shadow-lg shadow-blue-900/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
  >
    <div className="w-6 h-6">{icon}</div>
    <span className="ml-3 hidden lg:block font-medium">{label}</span>
    {badge > 0 && (
      <span className="ml-auto hidden lg:flex bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </button>
);

const StatItem = ({ label, value, color }) => (
  <div className="flex flex-col">
    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{label}</span>
    <span className={`text-xl font-bold ${color}`}>{value}</span>
  </div>
);

const IncidentCard = ({ incident }) => {
  const isAccident = incident.type === 'accident';
  const isCongestion = incident.type === 'congestion';

  return (
    <div className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 p-3 rounded-xl transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-1">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${isAccident ? 'bg-red-500/20 text-red-400' :
          isCongestion ? 'bg-orange-500/20 text-orange-400' :
            'bg-blue-500/20 text-blue-400'
          }`}>
          {incident.type}
        </span>
        <span className="text-[10px] text-gray-500">
          {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <p className="text-sm text-gray-200 font-medium leading-snug">{incident.description}</p>
      <div className="mt-2 flex items-center text-[10px] text-gray-500 gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
        {incident.status}
      </div>
    </div>
  );
}

export default App;
