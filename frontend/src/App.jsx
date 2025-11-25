import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardHome from './components/DashboardHome';
import IncidentManagement from './components/IncidentManagement';
import AnalyticsReporting from './components/AnalyticsReporting';
import AlertsView from './components/AlertsView';
import Login from './components/Login';
import Register from './components/Register';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Main Dashboard Layout
const DashboardLayout = () => {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

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
        const interval = setInterval(fetchIncidents, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex h-screen w-full text-white overflow-hidden bg-[#050b14]">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} />
            </div>

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col h-full overflow-hidden relative w-full">
                {/* Header */}
                <Header onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Dynamic Content */}
                <main className="flex-grow overflow-hidden relative p-4 lg:p-0">
                    <AnimatePresence mode="wait">
                        {activeTab === 'dashboard' && (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="h-full"
                            >
                                <DashboardHome incidents={incidents} loading={loading} />
                            </motion.div>
                        )}

                        {activeTab === 'incidents' && (
                            <motion.div
                                key="incidents"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full"
                            >
                                <IncidentManagement incidents={incidents} />
                            </motion.div>
                        )}

                        {activeTab === 'analytics' && (
                            <motion.div
                                key="analytics"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="h-full"
                            >
                                <AnalyticsReporting />
                            </motion.div>
                        )}

                        {activeTab === 'alerts' && (
                            <motion.div
                                key="alerts"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full p-6"
                            >
                                <AlertsView incidents={incidents} />
                            </motion.div>
                        )}

                        {/* Placeholders for other tabs */}
                        {['map', 'users', 'settings'].includes(activeTab) && (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex items-center justify-center"
                            >
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-gray-500 mb-2">Coming Soon</h2>
                                    <p className="text-gray-600">This module is currently under development.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

import PublicDashboard from './components/PublicDashboard';

// ... (imports remain the same)

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Route */}
                <Route path="/" element={<PublicDashboard />} />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Dashboard Routes */}
                <Route
                    path="/dashboard/*"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
