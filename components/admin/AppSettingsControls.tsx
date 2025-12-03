

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

const AppSettingsControls: React.FC = () => {
    const { settings, updateSettings } = useApp();
    const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const type = 'type' in e.target ? e.target.type : 'textarea';
        setLocalSettings(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
    };

    const handleSave = async () => {
        await updateSettings(localSettings);
        alert('App settings updated!');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white font-orbitron">Coin & App Control</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/20 p-4 rounded-xl">
                <div className="space-y-1">
                    <label className="text-sm text-gray-400">App Name</label>
                    <input type="text" name="appName" value={localSettings.appName} onChange={handleChange} className="w-full bg-black/40 p-2 rounded-lg" />
                </div>
                <div className="space-y-1">
                    <label className="text-sm text-gray-400">Welcome Text</label>
                    <input type="text" name="welcomeText" value={localSettings.welcomeText} onChange={handleChange} className="w-full bg-black/40 p-2 rounded-lg" />
                </div>
                <div className="space-y-1">
                    <label className="text-sm text-gray-400">Coins Per Video (Home)</label>
                    <input type="number" name="coinsPerVideo" value={localSettings.coinsPerVideo} onChange={handleChange} className="w-full bg-black/40 p-2 rounded-lg" />
                </div>
                <div className="space-y-1">
                    <label className="text-sm text-gray-400">Coins Per Video (Earn More)</label>
                    <input type="number" name="coinsPerAnotherVideo" value={localSettings.coinsPerAnotherVideo} onChange={handleChange} className="w-full bg-black/40 p-2 rounded-lg" />
                </div>
                <div className="space-y-1">
                    <label className="text-sm text-gray-400">Daily Bonus Coins</label>
                    <input type="number" name="dailyBonusCoins" value={localSettings.dailyBonusCoins} onChange={handleChange} className="w-full bg-black/40 p-2 rounded-lg" />
                </div>
                 <div className="space-y-1">
                    <label className="text-sm text-gray-400">Welcome Bonus Coins</label>
                    <input type="number" name="welcomeBonusCoins" value={localSettings.welcomeBonusCoins} onChange={handleChange} className="w-full bg-black/40 p-2 rounded-lg" />
                </div>
                 <div className="space-y-1">
                    <label className="text-sm text-gray-400">Special Reward Coins</label>
                    <input type="number" name="specialRewardCoins" value={localSettings.specialRewardCoins} onChange={handleChange} className="w-full bg-black/40 p-2 rounded-lg" />
                </div>
                 <div className="space-y-1">
                    <label className="text-sm text-gray-400">Coins per PKR (Converter)</label>
                    <input type="number" name="coinsPerPKR" value={localSettings.coinsPerPKR} onChange={handleChange} className="w-full bg-black/40 p-2 rounded-lg" />
                </div>
                <div className="space-y-1">
                    <label className="text-sm text-gray-400">WhatsApp Group Link</label>
                    <input type="text" name="whatsappLink" value={localSettings.whatsappLink} onChange={handleChange} className="w-full bg-black/40 p-2 rounded-lg" />
                </div>

                <div className="md:col-span-2 border-t border-blue-500/20 pt-4 mt-2">
                    <h3 className="font-semibold text-lg text-blue-300 font-orbitron mb-2">Home Screen Video Limits</h3>
                </div>

                 <div className="space-y-1">
                    <label className="text-sm text-gray-400">Daily Video Limit</label>
                    <input type="number" name="dailyVideoLimit" value={localSettings.dailyVideoLimit} onChange={handleChange} className="w-full bg-black/40 p-2 rounded-lg" />
                </div>
                 <div className="space-y-1">
                    <label className="text-sm text-gray-400">Videos Per Cooldown</label>
                    <input type="number" name="videosPerCooldown" value={localSettings.videosPerCooldown} onChange={handleChange} className="w-full bg-black/40 p-2 rounded-lg" />
                </div>
                 <div className="space-y-1">
                    <label className="text-sm text-gray-400">Cooldown Duration (Minutes)</label>
                    <input type="number" name="cooldownMinutes" value={localSettings.cooldownMinutes} onChange={handleChange} className="w-full bg-black/40 p-2 rounded-lg" />
                </div>
                
                <div className="md:col-span-2 border-t border-blue-500/20 pt-4 mt-2">
                    <h3 className="font-semibold text-lg text-blue-300 font-orbitron mb-2">Earn More Video Limits</h3>
                </div>

                 <div className="space-y-1">
                    <label className="text-sm text-gray-400">Daily Video Limit (Earn More)</label>
                    <input type="number" name="dailyAnotherVideoLimit" value={localSettings.dailyAnotherVideoLimit} onChange={handleChange} className="w-full bg-black/40 p-2 rounded-lg" />
                </div>
                 <div className="space-y-1">
                    <label className="text-sm text-gray-400">Videos Per Cooldown (Earn More)</label>
                    <input type="number" name="anotherVideosPerCooldown" value={localSettings.anotherVideosPerCooldown} onChange={handleChange} className="w-full bg-black/40 p-2 rounded-lg" />
                </div>
                 <div className="space-y-1">
                    <label className="text-sm text-gray-400">Cooldown Duration (Minutes, Earn More)</label>
                    <input type="number" name="anotherCooldownMinutes" value={localSettings.anotherCooldownMinutes} onChange={handleChange} className="w-full bg-black/40 p-2 rounded-lg" />
                </div>
                
                <div className="md:col-span-2 border-t border-blue-500/20 pt-4 mt-2">
                    <h3 className="font-semibold text-lg text-blue-300 font-orbitron mb-2">Interstitial Ad Settings</h3>
                </div>
                <div className="space-y-1 md:col-span-2">
                    <label className="text-sm text-gray-400">Interstitial Ad Frequency</label>
                    <p className="text-xs text-gray-500">Show ad after this many screen changes (0 to disable).</p>
                    <input type="number" name="interstitialFrequency" value={localSettings.interstitialFrequency || 0} onChange={handleChange} className="w-full bg-black/40 p-2 rounded-lg" />
                </div>

                <div className="md:col-span-2 border-t border-blue-500/20 pt-4 mt-2">
                    <h3 className="font-semibold text-lg text-blue-300 font-orbitron mb-2">Force Update Settings</h3>
                </div>

                <div className="md:col-span-2 flex items-center justify-between p-2 bg-black/30 rounded-lg">
                    <label className={`font-bold text-lg ${localSettings.forceUpdateEnabled ? 'text-red-400' : 'text-green-400'}`}>
                        {localSettings.forceUpdateEnabled ? 'Force Update Enabled' : 'Force Update Disabled'}
                    </label>
                    <Toggle 
                        enabled={localSettings.forceUpdateEnabled} 
                        onChange={enabled => setLocalSettings(prev => ({ ...prev, forceUpdateEnabled: enabled }))} 
                    />
                </div>
                
                <div className={`space-y-1 transition-opacity ${!localSettings.forceUpdateEnabled ? 'opacity-50' : ''}`}>
                    <label className="text-sm text-gray-400">Latest App Version</label>
                    <input type="text" name="latestAppVersion" value={localSettings.latestAppVersion} onChange={handleChange} className="w-full bg-black/40 p-2 rounded-lg" disabled={!localSettings.forceUpdateEnabled} />
                </div>
                <div className={`space-y-1 transition-opacity ${!localSettings.forceUpdateEnabled ? 'opacity-50' : ''}`}>
                    <label className="text-sm text-gray-400">Update URL (e.g., Play Store)</label>
                    <input type="text" name="updateUrl" value={localSettings.updateUrl} onChange={handleChange} className="w-full bg-black/40 p-2 rounded-lg" disabled={!localSettings.forceUpdateEnabled}/>
                </div>

                <div className={`md:col-span-2 space-y-1 transition-opacity ${!localSettings.forceUpdateEnabled ? 'opacity-50' : ''}`}>
                    <label className="text-sm text-gray-400">Update Message</label>
                    <textarea 
                        name="updateMessage" 
                        value={localSettings.updateMessage} 
                        onChange={handleChange} 
                        rows={4} 
                        className="w-full bg-black/40 p-2 rounded-lg" 
                        disabled={!localSettings.forceUpdateEnabled}
                    />
                </div>

            </div>

            <button onClick={handleSave} className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 p-3 rounded-lg font-bold text-lg font-orbitron">
                <Save size={20} />
                Save Settings
            </button>
        </div>
    );
};

export default AppSettingsControls;