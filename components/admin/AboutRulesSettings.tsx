

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Save } from 'lucide-react';

const AboutRulesSettings: React.FC = () => {
    const { settings, updateSettings } = useApp();
    const [aboutText, setAboutText] = useState(settings.aboutText);
    const [rulesText, setRulesText] = useState(settings.rulesText);

    const handleSave = async () => {
        await updateSettings({
            aboutText,
            rulesText,
        });
        alert('About & Rules information updated!');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white font-orbitron">Edit About & Rules</h2>
            
            <div className="bg-black/20 p-4 rounded-xl space-y-4">
                <h3 className="font-semibold text-lg text-blue-300 font-orbitron">About Us Section</h3>
                <textarea
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    rows={6}
                    className="w-full bg-black/40 p-2 rounded-lg"
                    placeholder="Enter information about the app..."
                />
            </div>
            
            <div className="bg-black/20 p-4 rounded-xl space-y-4">
                <h3 className="font-semibold text-lg text-blue-300 font-orbitron">App Rules Section</h3>
                 <textarea
                    value={rulesText}
                    onChange={(e) => setRulesText(e.target.value)}
                    rows={8}
                    className="w-full bg-black/40 p-2 rounded-lg"
                    placeholder="Enter app rules. Use new lines for each rule."
                />
            </div>
            
            <button 
                onClick={handleSave} 
                className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 p-3 rounded-lg font-bold text-lg font-orbitron"
            >
                <Save size={20} />
                Save Settings
            </button>
        </div>
    );
};

export default AboutRulesSettings;