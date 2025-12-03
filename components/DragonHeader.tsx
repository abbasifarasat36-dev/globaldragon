
import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell } from 'lucide-react';

const NeonDragonSVG: React.FC<{ className?: string }> = ({ className }) => (
     <svg 
        className={className}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
    >
        <defs>
            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#neon-glow)">
            <path d="M60 140 C 40 120, 30 90, 40 70 C 50 50, 80 40, 100 50 C 120 60, 130 80, 140 100" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M140 100 C 150 90, 160 80, 170 85 C 180 90, 175 105, 165 110 L 140 100" stroke="var(--secondary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M100 50 C 90 30, 110 20, 120 30" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="125" cy="75" r="5" fill="var(--accent)" />
            <path d="M60 140 C 80 160, 110 165, 130 150" stroke="var(--secondary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
    </svg>
);


const DragonHeader: React.FC = () => {
    const { settings, areNewAnnouncementsAvailable, setAnnouncementsModalOpen, markAnnouncementsAsSeen } = useApp();

    const handleBellClick = () => {
        markAnnouncementsAsSeen();
        setAnnouncementsModalOpen(true);
    };

    return (
        <div className="flex items-center justify-between text-center my-4 p-4 rounded-2xl bg-black/30 border border-[var(--primary)]/30 shadow-[0_0_15px_var(--glow-1)]">
            <div className="flex items-center">
                <NeonDragonSVG className="w-16 h-16 mr-4" />
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] font-orbitron">{settings.appName}</h1>
                    <p className="text-gray-300 text-sm mt-1 text-left">{settings.welcomeText}</p>
                </div>
            </div>
            <div className="flex items-center">
                <button 
                    onClick={handleBellClick} 
                    className="relative p-3 rounded-full bg-black/20 text-gray-300 hover:bg-black/40 hover:text-[var(--primary)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-dark)] focus:ring-[var(--primary)]"
                    aria-label="View announcements"
                >
                    <Bell size={24} />
                    {areNewAnnouncementsAvailable && (
                        <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-black/50 animate-pulse"></span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default DragonHeader;