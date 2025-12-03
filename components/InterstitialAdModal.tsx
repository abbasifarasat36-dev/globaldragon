

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AdType } from '../types';
import { X, VolumeX, Volume2 } from 'lucide-react';

const AD_VIDEO_URLS = [
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
];

const SKIP_DELAY = 5; // seconds

const InterstitialAdModal: React.FC = () => {
    const { hideInterstitial, getNextAdId } = useApp();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [progress, setProgress] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [canSkip, setCanSkip] = useState(false);
    const [skipTimer, setSkipTimer] = useState(SKIP_DELAY);
    const adId = getNextAdId(AdType.INTERSTITIAL);

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
                        <button onClick={hideInterstitial} className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-gray-700 transition-colors" aria-label="Close ad">
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

export default InterstitialAdModal;