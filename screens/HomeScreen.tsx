

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Screen, AdType } from '../types';
import DragonHeader from '../components/DragonHeader';
import BalanceDisplay from '../components/BalanceDisplay';
import GlowingButton from '../components/GlowingButton';
import BannerAd from '../components/BannerAd';
import AdPlayerModal from '../components/AdPlayerModal';
import { PlayCircle, ArrowRight, DollarSign, Mail, Info } from 'lucide-react';

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);


const HomeScreen: React.FC = () => {
    const { setScreen, user, settings, getNextAdId, watchVideo } = useApp();
    const [cooldownTime, setCooldownTime] = useState(0); // in seconds
    const [statusMessage, setStatusMessage] = useState('');
    const [isAdModalOpen, setIsAdModalOpen] = useState(false);
    const [currentAdId, setCurrentAdId] = useState('');

    useEffect(() => {
        if (cooldownTime > 0) {
            const interval = setInterval(() => {
                setCooldownTime(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [cooldownTime]);

    useEffect(() => {
        if (!user) return;
        const checkCooldown = () => {
            if (user.cooldownUntil) {
                const cooldownEnds = new Date(user.cooldownUntil);
                const now = new Date();
                if (now < cooldownEnds) {
                    const remainingSeconds = Math.round((cooldownEnds.getTime() - now.getTime()) / 1000);
                    setCooldownTime(remainingSeconds > 0 ? remainingSeconds : 0);
                } else {
                    setCooldownTime(0);
                }
            } else {
                setCooldownTime(0);
            }
        };
        checkCooldown();
        // Clear status message when user state changes (e.g., cooldown ends)
        setStatusMessage('');
    }, [user]);

    // Safely get user's video watch progress
    const today = new Date().toISOString().substring(0, 10);
    const lastWatchDate = user?.lastVideoWatchDate ? new Date(user.lastVideoWatchDate).toISOString().substring(0, 10) : null;
    const videosWatched = (user && lastWatchDate === today) ? user.videosWatchedToday : 0;
    const dailyLimit = settings.dailyVideoLimit;
    const isLimitReached = videosWatched >= dailyLimit;

    const isButtonDisabled = isLimitReached || cooldownTime > 0;

    const handleWatchVideo = () => {
        if (isButtonDisabled) return;
        setStatusMessage('');
        const adId = getNextAdId(AdType.REWARDED);
        setCurrentAdId(adId);
        setIsAdModalOpen(true);
    };

    const handleAdCloseAndReward = async () => {
        setIsAdModalOpen(false);
        setCurrentAdId('');
        const result = await watchVideo();
        if (!result.success) {
            setStatusMessage(result.message);
            if (result.cooldown) {
                setCooldownTime(result.cooldown);
            }
        }
    };

    let buttonText: string;
    if (cooldownTime > 0) {
        const minutes = Math.floor(cooldownTime / 60);
        const seconds = cooldownTime % 60;
        buttonText = `Next videos in ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    } else if (isLimitReached) {
        buttonText = `Daily Limit Reached (${dailyLimit}/${dailyLimit})`;
    } else {
        buttonText = `Watch Video & Earn (${videosWatched}/${dailyLimit})`;
    }

    return (
        <div className="flex flex-col min-h-screen justify-between">
            {isAdModalOpen && (
                <AdPlayerModal 
                    onClose={handleAdCloseAndReward}
                    adId={currentAdId}
                />
            )}
            <main>
                <BannerAd position="top" />
                <DragonHeader />
                <BalanceDisplay />
                <div className="space-y-4 my-8">
                    <GlowingButton onClick={handleWatchVideo} disabled={isButtonDisabled} Icon={PlayCircle}>
                        {buttonText}
                    </GlowingButton>
                    {statusMessage && <p className="text-center text-sm text-red-400 mt-2">{statusMessage}</p>}
                </div>
            </main>
            <footer className="space-y-4">
                 <button 
                    onClick={() => setScreen(Screen.EARN_MORE)}
                    className="w-full flex items-center justify-center gap-2 text-lg font-semibold py-3 px-6 rounded-2xl transition-all duration-300 bg-black/20 hover:bg-black/40 text-gray-300 hover:text-white">
                    Earn More Coins <ArrowRight size={22} />
                </button>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setScreen(Screen.WITHDRAWAL)} className="flex items-center justify-center gap-2 text-sm font-semibold py-3 px-4 rounded-2xl transition-all duration-300 bg-black/20 hover:bg-black/40 text-gray-300 hover:text-white">
                        <DollarSign size={18} /> Withdraw
                    </button>
                    <a href={settings.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm font-semibold py-3 px-4 rounded-2xl transition-all duration-300 bg-black/20 hover:bg-black/40 text-gray-300 hover:text-white">
                        <WhatsAppIcon /> Join
                    </a>
                    <button onClick={() => setScreen(Screen.CONTACT_US)} className="flex items-center justify-center gap-2 text-sm font-semibold py-3 px-4 rounded-2xl transition-all duration-300 bg-black/20 hover:bg-black/40 text-gray-300 hover:text-white">
                        <Mail size={18} /> Contact
                    </button>
                    <button onClick={() => setScreen(Screen.ABOUT_RULES)} className="flex items-center justify-center gap-2 text-sm font-semibold py-3 px-4 rounded-2xl transition-all duration-300 bg-black/20 hover:bg-black/40 text-gray-300 hover:text-white">
                        <Info size={18} /> About & Rules
                    </button>
                </div>
                <BannerAd position="bottom" />
            </footer>
        </div>
    );
};

export default HomeScreen;