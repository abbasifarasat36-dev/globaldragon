
import React, { useEffect } from 'react';

interface CoinAnimationProps {
    amount: number;
    message: string;
    onAnimationEnd: () => void;
}

const CoinAnimation: React.FC<CoinAnimationProps> = ({ amount, message, onAnimationEnd }) => {
    useEffect(() => {
        const timer = setTimeout(onAnimationEnd, 2000); // Animation duration is 2 seconds
        return () => clearTimeout(timer);
    }, [onAnimationEnd]);
    
    return (
        <div 
            className="fixed top-24 left-1/2 -translate-x-1/2 w-auto z-[100] pointer-events-none"
        >
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] text-white p-4 rounded-2xl shadow-2xl shadow-yellow-500/30 border-2 border-yellow-400 text-center animate-popAndFade">
                <h2 className="text-2xl font-bold text-yellow-400 font-orbitron whitespace-nowrap">+{amount.toLocaleString()} Coins!</h2>
                <p className="text-sm mt-1 text-gray-300">{message}</p>
            </div>
            <style>{`
                @keyframes popAndFade {
                    0% { transform: scale(0.5) translateY(20px); opacity: 0; }
                    20% { transform: scale(1.1) translateY(0); opacity: 1; }
                    40%, 80% { transform: scale(1) translateY(0); opacity: 1; }
                    100% { transform: scale(0.8) translateY(-10px); opacity: 0; }
                }
                .animate-popAndFade { animation: popAndFade 2s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards; }
            `}</style>
        </div>
    );
};

export default CoinAnimation;