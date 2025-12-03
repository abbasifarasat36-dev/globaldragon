

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppSettings } from '../../types';
import { Save } from 'lucide-react';

const Toggle: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${enabled ? 'bg-blue-600' : 'bg-gray-600'}`}
    >
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

const ReferralSettings: React.FC = () => {
    const { settings, updateSettings } = useApp();
    const [enabled, setEnabled] = useState(settings.referralProgramEnabled);
    const [referrerBonus, setReferrerBonus] = useState(settings.referrerBonusCoins);
    const [refereeBonus, setRefereeBonus] = useState(settings.refereeBonusCoins);

    const handleSave = async () => {
        await updateSettings({
            referralProgramEnabled: enabled,
            referrerBonusCoins: referrerBonus,
            refereeBonusCoins: refereeBonus,
        });
        alert('Referral program settings updated!');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white font-orbitron">Referral Program Controls</h2>
            
            <div className="bg-black/20 p-4 rounded-xl space-y-4">
                <h3 className="font-semibold text-gray-200">Program Status & Rewards</h3>
                
                <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg">
                    <label className={`font-bold text-lg ${enabled ? 'text-green-400' : 'text-red-400'}`}>
                        {enabled ? 'Referral Program Enabled' : 'Referral Program Disabled'}
                    </label>
                    <Toggle enabled={enabled} onChange={setEnabled} />
                </div>

                <div className={`space-y-3 transition-opacity ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="space-y-2 pt-2 border-t border-blue-500/10">
                         <label className="font-medium text-gray-300 text-sm">Referrer Bonus (Coins for inviter)</label>
                         <input type="number" value={referrerBonus} onChange={e => setReferrerBonus(Number(e.target.value))} className="w-full bg-black/40 p-2 rounded-lg text-white" placeholder="e.g. 250"/>
                    </div>
                    <div className="space-y-2">
                         <label className="font-medium text-gray-300 text-sm">Referee Bonus (Coins for new user)</label>
                         <input type="number" value={refereeBonus} onChange={e => setRefereeBonus(Number(e.target.value))} className="w-full bg-black/40 p-2 rounded-lg text-white" placeholder="e.g. 150"/>
                    </div>
                </div>

                <button onClick={handleSave} className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 p-3 rounded-lg font-bold text-lg font-orbitron">
                    <Save size={20} />
                    Save Settings
                </button>
            </div>
        </div>
    );
};

// FIX: Added default export to make the component importable.
export default ReferralSettings;
