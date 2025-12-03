import React from 'react';
import { useApp } from '../context/AppContext';
import { Screen } from '../types';
import { ArrowLeft, Info, ShieldCheck } from 'lucide-react';

const AboutRulesScreen: React.FC = () => {
    const { setScreen, settings } = useApp();

    return (
        <div className="pb-10">
            <button onClick={() => setScreen(Screen.HOME)} className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition-colors">
                <ArrowLeft size={20} /> Back to Home
            </button>
            <div className="flex items-center justify-center text-center mb-6">
                 <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] font-orbitron">About & Rules</h1>
                    <p className="text-gray-300 text-sm mt-1">Important information about the app.</p>
                </div>
            </div>
            
            <div className="space-y-6">
                <div className="bg-black/30 p-6 rounded-2xl border border-[var(--primary)]/20">
                    <div className="flex items-center gap-3 mb-3">
                        <Info size={24} className="text-[var(--primary)]" />
                        <h2 className="text-2xl font-bold font-orbitron text-white">About Us</h2>
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap">{settings.aboutText}</p>
                </div>

                <div className="bg-black/30 p-6 rounded-2xl border border-[var(--secondary)]/20">
                     <div className="flex items-center gap-3 mb-3">
                        <ShieldCheck size={24} className="text-[var(--secondary)]" />
                        <h2 className="text-2xl font-bold font-orbitron text-white">App Rules</h2>
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap">{settings.rulesText}</p>
                </div>
            </div>
        </div>
    );
};

export default AboutRulesScreen;