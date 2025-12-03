import React from 'react';

// FIX: Added a complete SplashScreen component with a default export to resolve the module import error.
// Reusing the NeonDragonSVG from other components for consistency.
// Using a unique filter ID to avoid potential conflicts with other SVGs.
const NeonDragonSVG: React.FC<{ className?: string }> = ({ className }) => (
     <svg 
        className={className}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
    >
        <defs>
            <filter id="neon-glow-splash" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#neon-glow-splash)">
            <path d="M60 140 C 40 120, 30 90, 40 70 C 50 50, 80 40, 100 50 C 120 60, 130 80, 140 100" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M140 100 C 150 90, 160 80, 170 85 C 180 90, 175 105, 165 110 L 140 100" stroke="var(--secondary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M100 50 C 90 30, 110 20, 120 30" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="125" cy="75" r="5" fill="var(--accent)" />
            <path d="M60 140 C 80 160, 110 165, 130 150" stroke="var(--secondary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
    </svg>
);

interface SplashScreenProps {
    onFadeOut: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFadeOut }) => {
    // This component is displayed while AppContext's isLoading state is true.
    // The onFadeOut prop is passed from App.tsx but a comment there indicates it's handled by the loading state,
    // so this component doesn't need to manage its own lifecycle with timers.
    return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center animated-gradient-bg">
            <NeonDragonSVG className="w-48 h-48 animate-pulse-slow" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] font-orbitron mt-4">
                CryptoDragon
            </h1>
            <p className="text-gray-400 mt-2">Loading your adventure...</p>
             <style>{`
                @keyframes pulse-slow {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.05);
                    }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default SplashScreen;