import React from 'react';
import { motion } from 'framer-motion';
import {
    ExclamationTriangleIcon,
    TruckIcon,
    NoSymbolIcon,
    ClockIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const IncidentCard = ({ incident }) => {
    const isAccident = incident.type === 'accident';
    const isCongestion = incident.type === 'congestion';
    const isBlockage = incident.type === 'road_blockage';

    const getIcon = () => {
        if (isAccident) return <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />;
        if (isCongestion) return <TruckIcon className="w-5 h-5 text-orange-400" />;
        return <NoSymbolIcon className="w-5 h-5 text-blue-400" />;
    };

    const getBorderColor = () => {
        if (isAccident) return 'border-red-500/30 hover:border-red-500/60';
        if (isCongestion) return 'border-orange-500/30 hover:border-orange-500/60';
        return 'border-blue-500/30 hover:border-blue-500/60';
    };

    const getGlow = () => {
        if (isAccident) return 'shadow-[0_0_15px_rgba(255,0,85,0.15)]';
        if (isCongestion) return 'shadow-[0_0_15px_rgba(255,153,0,0.15)]';
        return 'shadow-[0_0_15px_rgba(0,243,255,0.15)]';
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className={`relative glass p-4 rounded-xl border transition-all duration-300 group ${getBorderColor()} ${getGlow()}`}
        >
            {/* Decorative line */}
            <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${isAccident ? 'bg-red-500' : isCongestion ? 'bg-orange-500' : 'bg-blue-500'
                }`} />

            <div className="pl-3">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${isAccident ? 'bg-red-500/10' : isCongestion ? 'bg-orange-500/10' : 'bg-blue-500/10'
                            }`}>
                            {getIcon()}
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${isAccident ? 'text-red-400' : isCongestion ? 'text-orange-400' : 'text-blue-400'
                            }`}>
                            {incident.type.replace('_', ' ')}
                        </span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full">
                        <ClockIcon className="w-3 h-3" />
                        {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                <p className="text-sm text-gray-200 font-medium leading-relaxed mb-3">
                    {incident.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                        <CheckCircleIcon className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-[10px] uppercase tracking-widest text-green-400 font-bold">
                            {incident.status}
                        </span>
                    </div>

                    {incident.video_url && (
                        <button className="text-[10px] text-blue-300 hover:text-white transition-colors underline decoration-blue-500/30 hover:decoration-blue-400">
                            View Footage
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default IncidentCard;
