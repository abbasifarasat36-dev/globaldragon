

import React, { useState, useEffect, useRef } from 'react';
import { X, VolumeX, Volume2 } from 'lucide-react';

interface AdPlayerModalProps {
    onClose: () => void;
    adId: string;
}

const AD_VIDEO_URLS = [
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
];


const AdPlayerModal: React.FC<AdPlayerModalProps> = ({ onClose, adId }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
    const [isVideoFinished, setIsVideoFinished] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        // Select a random video when the component mounts
        setSelectedVideoUrl(AD_VIDEO_URLS[Math.floor(Math.random() * AD_VIDEO_URLS.length)]);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !selectedVideoUrl) return;

        const handleTimeUpdate = () => {
            if (video.duration) {
                const currentProgress = (video.currentTime / video.duration) * 100;
                setProgress(currentProgress);
            }
        };
        
        const handleVideoEnd = () => {
             setIsVideoFinished(true);
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('ended', handleVideoEnd);

        // Start playing the video
        video.play().catch(error => console.error("Video autoplay failed:", error));

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('ended', handleVideoEnd);
        };
    }, [selectedVideoUrl]);
    
    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(!isMuted);
        }
    };


    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-0 md:p-4 animate-fadeIn">
            <div className="w-full h-full md:max-w-md md:h-auto md:rounded-2xl bg-black md:border-2 md:border-yellow-500/50 md:shadow-2xl md:shadow-yellow-500/20 text-white overflow-hidden flex flex-col justify-center">
                <div className="relative aspect-video bg-black">
                    {selectedVideoUrl && (
                        <video
                            key={selectedVideoUrl} // Force re-render if URL changes between modal opens
                            ref={videoRef}
                            src={selectedVideoUrl}
                            playsInline
                            muted={isMuted}
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-xs">Sponsored</div>
                    <button onClick={toggleMute} className="absolute top-2 right-12 p-1.5 bg-black/50 rounded-full hover:bg-gray-700 transition-colors">
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <button 
                        onClick={onClose}
                        disabled={!isVideoFinished}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Close ad"
                    >
                        <X size={16} />
                    </button>
                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-500/50">
                        <div className="h-full bg-yellow-400 transition-all duration-100" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="p-3 flex items-center justify-end">
                    <p className="font-semibold text-lg text-yellow-400">
                        {isVideoFinished ? 'Reward Ready!' : `Playing ad...`}
                    </p>
                </div>
            </div>
             <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default AdPlayerModal;