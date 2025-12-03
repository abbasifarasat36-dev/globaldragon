
import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdType } from '../types';

interface BannerAdProps {
    position: 'top' | 'bottom';
}

const liveAdImages = [
    'https://placehold.co/600x120/0D0D0D/1E90FF/png?text=Play+Dragon+Quest',
    'https://placehold.co/600x120/8A2BE2/FFFFFF/png?text=Get+Free+Coins',
    'https://placehold.co/600x120/FFD700/0D0D0D/png?text=Limited+Time+Offer',
    'https://placehold.co/600x120/28a745/FFFFFF/png?text=Join+the+Adventure',
    'https://placehold.co/600x120/d00000/ffffff/png?text=Epic+Rewards+Await',
    'https://placehold.co/600x120/ff00ff/000000/png?text=Cyber+Week+Deals'
];

const BannerAd: React.FC<BannerAdProps> = ({ position }) => {
    const { getNextAdId } = useApp();
    const [adId, setAdId] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string>('');

    useEffect(() => {
        const updateAd = () => {
            setAdId(getNextAdId(AdType.BANNER));
            setImageUrl(liveAdImages[Math.floor(Math.random() * liveAdImages.length)]);
        };

        updateAd(); // Initial ad
        const interval = setInterval(updateAd, 15000); // Refresh every 15 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [getNextAdId]);

    return (
        <div className={`w-full h-16 bg-black/30 rounded-lg my-2 overflow-hidden relative group`}>
            {/* Using key to force re-render and a simple fade transition */}
            {imageUrl && <img key={imageUrl} src={imageUrl} alt="Advertisement" className="w-full h-full object-cover animate-fade-in-sm" />}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-1 left-2 text-white text-[8px] bg-black/50 px-1 rounded">
                <p className="font-bold">Ad</p>
            </div>
            <style>{`
                @keyframes fade-in-sm {
                    from { opacity: 0.5; }
                    to { opacity: 1; }
                }
                .animate-fade-in-sm { animation: fade-in-sm 0.5s ease-in-out forwards; }
            `}</style>
        </div>
    );
};

export default BannerAd;