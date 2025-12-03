import React from 'react';
import GlowingButton from './GlowingButton';
import { ArrowUpCircle } from 'lucide-react';

interface ForceUpdateModalProps {
    message: string;
    url: string;
}

const ForceUpdateModal: React.FC<ForceUpdateModalProps> = ({ message, url }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[var(--primary)]/50 rounded-2xl w-full max-w-md text-center p-8 shadow-2xl shadow-[var(--glow-1)]">
                <ArrowUpCircle size={56} className="mx-auto text-[var(--primary)] mb-4 animate-bounce" />
                <h2 className="text-3xl font-bold font-orbitron text-white mb-2">Update Required</h2>
                <p className="text-gray-300 mb-6 whitespace-pre-wrap">{message}</p>
                <a href={url} target="_blank" rel="noopener noreferrer" className="block">
                    <GlowingButton Icon={ArrowUpCircle}>
                        Update Now
                    </GlowingButton>
                </a>
            </div>
        </div>
    );
};

export default ForceUpdateModal;