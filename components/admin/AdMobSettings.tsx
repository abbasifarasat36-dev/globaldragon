

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdMobIds, AdIdConfig } from '../../types';
import { Star, Trash2, PlusCircle, Save } from 'lucide-react';

const Toggle: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${enabled ? 'bg-blue-600' : 'bg-gray-600'}`}
    >
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);


const AdMobSettings: React.FC = () => {
    const { adMobIds, updateAdMobIds, settings, updateSettings } = useApp();
    const [ids, setIds] = useState<AdMobIds>(adMobIds);
    const [adsEnabled, setAdsEnabled] = useState(settings.adsEnabled);
    const [testAdsEnabled, setTestAdsEnabled] = useState(settings.testAdsEnabled);
    const [highEcpmModeEnabled, setHighEcpmModeEnabled] = useState(settings.highEcpmModeEnabled);
    const [rotatingAdsEnabled, setRotatingAdsEnabled] = useState(settings.rotatingAdsEnabled);
    const [areIdsEditable, setAreIdsEditable] = useState(false);

    const handleIdChange = (type: keyof AdMobIds, index: number, value: string) => {
        setIds(prevIds => ({
            ...prevIds,
            [type]: prevIds[type].map((ad, i) => i === index ? { ...ad, id: value } : ad)
        }));
    };

    const handleToggleChange = (type: keyof AdMobIds, index: number, enabled: boolean) => {
         setIds(prevIds => ({
            ...prevIds,
            [type]: prevIds[type].map((ad, i) => i === index ? { ...ad, enabled } : ad)
        }));
    };

    const handleHighEcpmToggle = (type: keyof AdMobIds, index: number, isHighEcpm: boolean) => {
         setIds(prevIds => ({
            ...prevIds,
            [type]: prevIds[type].map((ad, i) => i === index ? { ...ad, isHighEcpm } : ad)
        }));
    };

    const addId = (type: keyof AdMobIds) => {
        const newIdValue = `ca-app-pub-NEW/ID-${Math.random().toString(36).substring(2, 9)}`;
        const newAdConfig: AdIdConfig = { id: newIdValue, enabled: true, isHighEcpm: false };
        setIds(prevIds => ({
            ...prevIds,
            [type]: [...prevIds[type], newAdConfig]
        }));
    };

    const removeId = (type: keyof AdMobIds, indexToRemove: number) => {
        if (window.confirm('Are you sure you want to remove this Ad ID?')) {
            setIds(prevIds => ({
                ...prevIds,
                [type]: prevIds[type].filter((_, index) => index !== indexToRemove)
            }));
        }
    };

    const handleSave = async () => {
        await updateAdMobIds(ids);
        await updateSettings({
            adsEnabled,
            testAdsEnabled,
            highEcpmModeEnabled,
            rotatingAdsEnabled,
        });
        alert('AdMob settings have been saved!');
        setAreIdsEditable(false);
    };

    const renderIdList = (type: keyof AdMobIds, title: string) => (
        <div className="space-y-2">
            <h3 className="font-semibold text-lg text-blue-300 font-orbitron">{title}</h3>
            {ids[type].map((config, index) => (
                <div key={index} className="flex items-center gap-2 bg-black/30 p-2 rounded-lg">
                    <input
                        type="text"
                        value={config.id}
                        onChange={(e) => handleIdChange(type, index, e.target.value)}
                        className="flex-1 bg-black/40 p-2 rounded-md disabled:opacity-50"
                        disabled={!areIdsEditable}
                    />
                    <button onClick={() => handleHighEcpmToggle(type, index, !config.isHighEcpm)} title="Toggle High eCPM" className={`p-2 rounded-md ${config.isHighEcpm ? 'bg-yellow-500/30 text-yellow-300' : 'bg-gray-600/30 text-gray-400'}`}>
                        <Star size={16} />
                    </button>
                    <Toggle enabled={config.enabled} onChange={(enabled) => handleToggleChange(type, index, enabled)} />
                    <button onClick={() => removeId(type, index)} disabled={!areIdsEditable} className="p-2 bg-red-600/20 text-red-400 rounded-md disabled:opacity-50 hover:bg-red-600/50">
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}
            <button onClick={() => addId(type)} disabled={!areIdsEditable} className="w-full mt-2 bg-blue-600/30 hover:bg-blue-600/50 p-2 rounded-lg font-bold text-sm text-blue-300 disabled:opacity-50 flex items-center justify-center gap-2">
                <PlusCircle size={16}/> Add ID
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white font-orbitron">AdMob Settings</h2>
            
            <div className="bg-black/20 p-4 rounded-xl space-y-4">
                 <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg">
                    <label className={`font-bold text-lg ${adsEnabled ? 'text-green-400' : 'text-red-400'}`}>
                        {adsEnabled ? 'Ad System LIVE' : 'Ad System OFFLINE'}
                    </label>
                    <Toggle enabled={adsEnabled} onChange={setAdsEnabled} />
                </div>
                 <div className="flex items-center justify-between">
                    <label className="text-gray-300">Test Ads Mode</label>
                    <Toggle enabled={testAdsEnabled} onChange={setTestAdsEnabled} />
                </div>
                <div className="flex items-center justify-between">
                    <label className="text-gray-300">High eCPM Priority Mode</label>
                    <Toggle enabled={highEcpmModeEnabled} onChange={setHighEcpmModeEnabled} />
                </div>
                 <div className="flex items-center justify-between">
                    <label className="text-gray-300">Rotating Mode</label>
                    <Toggle enabled={rotatingAdsEnabled} onChange={setRotatingAdsEnabled} />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-white font-orbitron">Ad Unit IDs</h3>
                    <button onClick={() => setAreIdsEditable(!areIdsEditable)} className="bg-orange-600 hover:bg-orange-500 p-2 rounded-lg font-bold text-sm">
                       {areIdsEditable ? 'Lock IDs' : 'Edit IDs'}
                    </button>
                </div>
                {renderIdList('appIds', 'App IDs')}
                {renderIdList('bannerIds', 'Banner IDs')}
                {renderIdList('interstitialIds', 'Interstitial IDs')}
                {renderIdList('rewardedIds', 'Rewarded IDs')}
            </div>
            
            <button onClick={handleSave} className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 p-3 rounded-lg font-bold text-lg font-orbitron">
                <Save size={20} />
                Save Settings
            </button>
        </div>
    );
};

export default AdMobSettings;