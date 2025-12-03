

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { themes, Theme } from '../../styles/themes';
import { CheckCircle, Save } from 'lucide-react';

const ThemeSettings: React.FC = () => {
    const { settings, updateSettings } = useApp();
    const [selectedThemeName, setSelectedThemeName] = useState(settings.theme);

    const handleThemeSelect = (themeName: string) => {
        setSelectedThemeName(themeName);
    };

    const handleSave = async () => {
        await updateSettings({ theme: selectedThemeName });
        alert('Theme settings have been saved!');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white font-orbitron">App Theme Customization</h2>
            <p className="text-gray-400">Select a theme to change the application's appearance for all users. Click 'Save Theme' to apply the change.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {themes.map((theme) => (
                    <div key={theme.name} className="relative">
                        <button
                            onClick={() => handleThemeSelect(theme.name)}
                            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                                selectedThemeName === theme.name ? 'border-[var(--primary)] scale-105' : 'border-transparent hover:border-gray-600'
                            }`}
                            // FIX: Cast style object to React.CSSProperties to allow for custom properties.
                            style={{
                                '--primary': theme.colors['--primary'],
                                '--success': theme.colors['--success'],
                            } as React.CSSProperties}
                        >
                            <div className="flex items-center justify-center h-16 rounded-lg" style={{ background: `linear-gradient(45deg, ${theme.colors['--gradient-accent1']}, ${theme.colors['--gradient-accent2']})` }}>
                                {/* Preview area */}
                            </div>
                            <p className="mt-3 font-semibold text-center">{theme.name}</p>
                        </button>
                        {selectedThemeName === theme.name && (
                             <div className="absolute top-2 right-2 p-1 bg-black/50 rounded-full">
                                <CheckCircle size={20} className="text-[var(--success)]" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            <button 
                onClick={handleSave} 
                className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 p-3 rounded-lg font-bold text-lg font-orbitron"
            >
                <Save size={20} />
                Save Theme
            </button>
        </div>
    );
};

export default ThemeSettings;