
import React from 'react';
import { useApp } from '../context/AppContext';
import { Coins, Wallet } from 'lucide-react';

const BalanceDisplay: React.FC = () => {
    const { user, settings } = useApp();

    if (!user) return null;
    
    const pkrBalance = (user.coins / settings.coinsPerPKR).toFixed(2);

    return (
        <div className="flex items-center justify-center my-6">
            <div className="bg-black/40 p-4 rounded-2xl shadow-lg border border-[var(--primary)]/30 shadow-[0_0_20px_var(--glow-1)] w-full max-w-sm">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2">
                        <Wallet size={20} className="text-[var(--success)]"/>
                        <p className="text-gray-300 text-sm">Balance</p>
                    </div>
                    <p className="text-4xl font-bold text-[var(--success)] tracking-wider font-orbitron">{pkrBalance} <span className="text-2xl opacity-80">PKR</span></p>
                </div>
                <div className="border-t border-[var(--primary)]/20 my-3"></div>
                <div className="flex items-center justify-center gap-2">
                    <Coins className="w-6 h-6 text-[var(--accent)]" />
                    <p className="text-2xl font-bold text-[var(--accent)] tracking-wider font-orbitron">{user.coins.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default BalanceDisplay;