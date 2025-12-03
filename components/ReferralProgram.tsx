import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Share2, Copy, Check } from 'lucide-react';
import GlowingButton from './GlowingButton';

const ReferralProgram: React.FC = () => {
    const { user, settings, applyReferralCode } = useApp();
    const [referralCodeInput, setReferralCodeInput] = useState('');
    const [message, setMessage] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    if (!settings.referralProgramEnabled || !user) {
        return null;
    }

    const handleApplyCode = async () => {
        if (!referralCodeInput.trim()) {
            setMessage('Please enter a referral code.');
            return;
        }
        const result = await applyReferralCode(referralCodeInput);
        setMessage(result.message);
        if (result.success) {
            setReferralCodeInput('');
        }
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(user.referralCode);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };
    
    const handleShare = () => {
        if (navigator.share) {
             navigator.share({
                title: `${settings.appName} Referral`,
                text: `Join me on ${settings.appName} and get ${settings.refereeBonusCoins} bonus coins! Use my code: ${user.referralCode}`,
                url: `${window.location.origin}?ref=${user.referralCode}`,
            });
        } else {
            handleCopyToClipboard();
            alert('Share API not supported. Referral link copied to clipboard!');
        }
    };

    return (
        <div className="bg-black/30 p-4 rounded-2xl border border-[var(--primary)]/20 space-y-4">
            <div className="flex items-center gap-3">
                <Share2 size={24} className="text-[var(--primary)]" />
                <h3 className="text-xl font-bold text-white font-orbitron">Referral Program</h3>
            </div>
            
            <p className="text-sm text-gray-300">
                Invite friends and earn <span className="font-bold text-[var(--accent)]">{settings.referrerBonusCoins}</span> coins for each referral. Your friend gets <span className="font-bold text-[var(--accent)]">{settings.refereeBonusCoins}</span> coins too!
            </p>

            <div className="bg-black/40 p-3 rounded-xl">
                <p className="text-xs text-gray-400">Your Referral Code:</p>
                <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="font-mono text-lg font-bold text-white tracking-widest">{user.referralCode}</p>
                    <div className="flex gap-2">
                        <button onClick={handleCopyToClipboard} className="p-2 bg-gray-600/50 hover:bg-gray-600/80 rounded-lg">
                            {isCopied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                        </button>
                         <button onClick={handleShare} className="p-2 bg-blue-600/50 hover:bg-blue-600/80 rounded-lg">
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
            
             <div className="flex items-center justify-around text-center">
                <div>
                    <p className="text-2xl font-bold font-orbitron text-white">{user.referralsCount}</p>
                    <p className="text-xs text-gray-400">Friends Joined</p>
                </div>
                <div>
                    <p className="text-2xl font-bold font-orbitron text-[var(--accent)]">
                        {user.referralBonusEarned.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">Bonus Earned</p>
                </div>
            </div>

            {!user.referredBy && (
                <div className="pt-4 border-t border-[var(--primary)]/10">
                    <p className="text-sm text-gray-300 mb-2">Have a referral code?</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter code"
                            value={referralCodeInput}
                            onChange={(e) => setReferralCodeInput(e.target.value)}
                            className="w-full bg-black/40 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
                        />
                        <GlowingButton onClick={handleApplyCode} className="w-auto px-6 py-3 text-base">
                            Apply
                        </GlowingButton>
                    </div>
                </div>
            )}
            
            {message && <p className="text-center text-sm mt-2 text-yellow-300">{message}</p>}

        </div>
    );
};

export default ReferralProgram;