

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Screen, AdType } from '../types';
import BalanceDisplay from '../components/BalanceDisplay';
import GlowingButton from '../components/GlowingButton';
import BannerAd from '../components/BannerAd';
import { Gift, Play, Star, ArrowLeft, X, VolumeX, Volume2, LogOut } from 'lucide-react';
import ReferralProgram from '../components/ReferralProgram';

const AD_VIDEO_URLS = [
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
];

const SKIP_DELAY = 5; // seconds

interface InterstitialPlayerProps {
    onClose: () => void;
    adId: string;
}

const InterstitialPlayer: React.FC<InterstitialPlayerProps> = ({ onClose, adId }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [progress, setProgress] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [canSkip, setCanSkip] = useState(false);
    const [skipTimer, setSkipTimer] = useState(SKIP_DELAY);

    useEffect(() => {
        setVideoUrl(AD_VIDEO_URLS[Math.floor(Math.random() * AD_VIDEO_URLS.length)]);
    }, []);

    useEffect(() => {
        const timerInterval = setInterval(() => {
            setSkipTimer(prev => {
                if (prev <= 1) {
                    setCanSkip(true);
                    clearInterval(timerInterval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerInterval);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !videoUrl) return;

        const handleTimeUpdate = () => {
            if (video.duration) {
                setProgress((video.currentTime / video.duration) * 100);
            }
        };
        
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.play().catch(error => console.error("Video autoplay failed:", error));

        return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }, [videoUrl]);
    
    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-0 md:p-4 animate-fadeIn">
            <div className="w-full h-full md:max-w-md md:h-auto md:rounded-2xl bg-black md:border-2 md:border-purple-500/50 md:shadow-2xl md:shadow-purple-500/20 text-white overflow-hidden flex flex-col justify-center">
                <div className="relative aspect-video bg-black">
                    {videoUrl && (
                        <video
                            ref={videoRef}
                            src={videoUrl}
                            playsInline
                            muted={isMuted}
                            loop
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-xs">Ad</div>
                    <button onClick={toggleMute} className="absolute top-2 right-12 p-1.5 bg-black/50 rounded-full hover:bg-gray-700 transition-colors">
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    {canSkip ? (
                        <button onClick={onClose} className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-gray-700 transition-colors" aria-label="Close ad">
                            <X size={16} />
                        </button>
                    ) : (
                        <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-xs w-7 h-7 flex items-center justify-center font-mono">
                            {skipTimer}
                        </div>
                    )}
                    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-500/50">
                        <div className="h-full bg-purple-400" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>
             <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

const EarnMoreScreen: React.FC = () => {
    const { setScreen, user, settings, getNextAdId, claimDailyBonus, watchAnotherVideo, claimSpecialTask, logout } = useApp();
    const [bonusMessage, setBonusMessage] = useState<string>('');
    const [specialTaskMessage, setSpecialTaskMessage] = useState<string>('');
    const [isBonusAvailable, setIsBonusAvailable] = useState(true);
    const [cooldownTime, setCooldownTime] = useState(0);
    const [isInterstitialOpen, setIsInterstitialOpen] = useState(false);

    useEffect(() => {
        if (!user) return;
        if (user.lastDailyBonus) {
            const lastBonusDate = new Date(user.lastDailyBonus);
            const diffHours = (new Date().getTime() - lastBonusDate.getTime()) / (1000 * 60 * 60);
            setIsBonusAvailable(diffHours >= 24);
        } else {
            setIsBonusAvailable(true);
        }
    }, [user]);

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
            if (user.anotherCooldownUntil) {
                const cooldownEnds = new Date(user.anotherCooldownUntil);
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
    }, [user]);

    const today = new Date().toISOString().substring(0, 10);
    const lastWatchDate = user?.lastAnotherVideoWatchDate ? new Date(user.lastAnotherVideoWatchDate).toISOString().substring(0, 10) : null;
    const videosWatched = (user && lastWatchDate === today) ? user.anotherVideosWatchedToday : 0;
    const dailyLimit = settings.dailyAnotherVideoLimit;
    const isLimitReached = videosWatched >= dailyLimit;
    const isSpecialTaskUnlocked = videosWatched >= settings.dailyAnotherVideoLimit;
    const lastClaimDate = user?.lastSpecialTaskClaim ? new Date(user.lastSpecialTaskClaim).toISOString().substring(0, 10) : null;
    const isSpecialTaskClaimedToday = lastClaimDate === today;

    const isVideoButtonDisabled = isLimitReached || cooldownTime > 0;
    
    const handleWatchVideo = () => {
        if (isVideoButtonDisabled) return;
        setIsInterstitialOpen(true);
    };

    const handleInterstitialClose = async () => {
        setIsInterstitialOpen(false);
        const result = await watchAnotherVideo();
        if (!result.success && result.cooldown) {
            setCooldownTime(result.cooldown);
        }
    };
    
    const handleClaimSpecialTask = async () => {
        const result = await claimSpecialTask();
        setSpecialTaskMessage(result.message);
        setTimeout(() => setSpecialTaskMessage(''), 3000);
    };

    const handleDailyBonus = async () => {
        const success = await claimDailyBonus();
        if (success) {
            setBonusMessage('Bonus claimed!');
            setIsBonusAvailable(false);
        } else {
            setBonusMessage('Daily bonus already claimed.');
        }
        setTimeout(() => setBonusMessage(''), 3000);
    };
    
    let videoButtonText: string;
    if (cooldownTime > 0) {
        const minutes = Math.floor(cooldownTime / 60);
        const seconds = cooldownTime % 60;
        videoButtonText = `Next videos in ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    } else if (isLimitReached) {
        videoButtonText = `Daily Limit Reached (${dailyLimit}/${dailyLimit})`;
    } else {
        videoButtonText = `Watch Another Video (${videosWatched}/${dailyLimit})`;
    }

    return (
        <div className="flex flex-col min-h-screen justify-between">
            {isInterstitialOpen && (
                <InterstitialPlayer 
                    onClose={handleInterstitialClose}
                    adId={getNextAdId(AdType.INTERSTITIAL)}
                />
            )}
            <main>
                <div className="flex items-center justify-center relative my-4">
                    <button 
                        onClick={() => setScreen(Screen.HOME)}
                        className="absolute left-0 p-2 rounded-full bg-black/20 hover:bg-black/40 text-gray-300 hover:text-white transition-all duration-300"
                        aria-label="Go back to Home"
                    >
                        <ArrowLeft size={22} /> 
                    </button>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] font-orbitron">Earn More</h1>
                        <p className="text-gray-300">Complete tasks for extra rewards.</p>
                    </div>
                    <button 
                        onClick={logout}
                        className="absolute right-0 p-2 rounded-full bg-black/20 hover:bg-black/40 text-gray-300 hover:text-white transition-all duration-300"
                        aria-label="Logout"
                    >
                        <LogOut size={22} /> 
                    </button>
                </div>

                <BannerAd position="top" />
                
                <BalanceDisplay />
                <div className="space-y-4 my-8">
                    <GlowingButton onClick={handleWatchVideo} disabled={isVideoButtonDisabled} Icon={Play}>
                        {videoButtonText}
                    </GlowingButton>
                    
                    {isSpecialTaskUnlocked && (
                        <div className="relative">
                            <GlowingButton 
                                onClick={handleClaimSpecialTask} 
                                variant="secondary" 
                                Icon={Star}
                                disabled={isSpecialTaskClaimedToday}
                            >
                                {isSpecialTaskClaimedToday ? 'Special Task Claimed Today' : `Claim ${settings.specialRewardCoins} Coins`}
                            </GlowingButton>
                             {specialTaskMessage && <p className={`text-center text-sm mt-2 ${specialTaskMessage.includes('claimed') || specialTaskMessage.includes('unlocked') ? 'text-green-400' : 'text-yellow-400'}`}>{specialTaskMessage}</p>}
                        </div>
                    )}
                    
                    <div className="relative">
                        <GlowingButton 
                            onClick={handleDailyBonus} 
                            Icon={Gift} 
                            disabled={!isBonusAvailable}
                            className={`
                                from-[var(--accent)] to-[var(--secondary)] disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 disabled:shadow-none
                                shadow-[0_0_15px_var(--glow-2)] hover:shadow-[0_0_25px_var(--glow-2)]
                                focus:ring-[var(--accent)]/50
                            `}
                        >
                            {isBonusAvailable ? 'Claim Daily Bonus' : 'Bonus Claimed'}
                        </GlowingButton>
                        {bonusMessage && <p className="text-center text-sm mt-2 text-[var(--accent)]">{bonusMessage}</p>}
                    </div>
                </div>

                <ReferralProgram />

            </main>
            <footer className="space-y-4 mt-8">
                <BannerAd position="bottom" />
            </footer>
        </div>
    );
};

export default EarnMoreScreen;