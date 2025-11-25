import React, { useState, useEffect } from 'react';
import { BellIcon, UserCircleIcon, Bars3Icon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="h-16 lg:h-20 glass-panel border-b border-white/5 flex items-center justify-between px-4 lg:px-8 z-20 shrink-0">
            {/* Left: Mobile Menu & Title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                >
                    <Bars3Icon className="w-6 h-6" />
                </button>

                <div>
                    <h2 className="text-lg lg:text-xl font-bold text-white tracking-wide">Dashboard</h2>
                    <span className="text-[10px] lg:text-xs text-gray-400 hidden sm:block">Welcome back, Officer</span>
                </div>
            </div>

            {/* Right: Clock, Notifications, Profile */}
            <div className="flex items-center gap-3 lg:gap-6">
                {/* Real-time Clock */}
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-lg font-mono font-bold text-blue-400">
                        {format(currentTime, 'HH:mm:ss')}
                    </span>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">
                        {format(currentTime, 'EEEE, MMM do yyyy')}
                    </span>
                </div>

                <div className="h-8 w-px bg-white/10 hidden md:block"></div>

                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                    <BellIcon className="w-6 h-6" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>

                {/* User Profile & Logout */}
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-bold text-white">Admin User</div>
                        <div className="text-[10px] text-gray-400">System Administrator</div>
                    </div>
                    <UserCircleIcon className="w-8 h-8 lg:w-10 lg:h-10 text-gray-300" />

                    <button
                        onClick={handleLogout}
                        className="ml-2 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Logout"
                    >
                        <ArrowRightOnRectangleIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
