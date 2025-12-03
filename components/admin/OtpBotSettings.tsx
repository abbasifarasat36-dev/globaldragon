
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

const OtpBotSettings: React.FC = () => {
    const { settings, updateSettings } = useApp();
    const [enabled, setEnabled] = useState(settings.otpBotEnabled);
    const [adminLink, setAdminLink] = useState(settings.adminWhatsappLink);
    const [template, setTemplate] = useState(settings.otpMessageTemplate);

    const handleSave = async () => {
        await updateSettings({
            otpBotEnabled: enabled,
            adminWhatsappLink: adminLink,
            otpMessageTemplate: template,
        });
        alert('OTP Bot settings updated!');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white font-orbitron">WhatsApp OTP Bot</h2>
            
            <div className="bg-black/20 p-4 rounded-xl space-y-4">
                <h3 className="font-semibold text-gray-200">Bot Configuration</h3>
                
                <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg">
                    <label className={`font-bold text-lg ${enabled ? 'text-green-400' : 'text-red-400'}`}>
                        {enabled ? 'Automated OTP Bot Enabled' : 'Automated OTP Bot Disabled'}
                    </label>
                    <Toggle enabled={enabled} onChange={setEnabled} />
                </div>
                
                <p className="text-xs text-gray-500 px-2">
                    When enabled, the app will automatically send a 6-digit OTP to the user's WhatsApp for password resets.
                    When disabled, users will be prompted to contact you directly via the link below.
                </p>

                <div className={`space-y-3 transition-opacity`}>
                    <div className="space-y-2 pt-2 border-t border-blue-500/10">
                         <label className="font-medium text-gray-300 text-sm">Admin WhatsApp Link</label>
                         <p className="text-xs text-gray-500">The link users will be directed to if the bot is off. (e.g. https://wa.me/YOUR_NUMBER)</p>
                         <input type="text" value={adminLink} onChange={e => setAdminLink(e.target.value)} className="w-full bg-black/40 p-2 rounded-lg text-white" placeholder="e.g. https://wa.me/123456789"/>
                    </div>
                     <div className={`space-y-2 transition-opacity ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                         <label className="font-medium text-gray-300 text-sm">OTP Message Template</label>
                         {/* FIX: Escaped curly braces to prevent JSX from parsing {{OTP}} as an object. */}
                         <p className="text-xs text-gray-500">The message sent to the user. Use `{"{{OTP}}"}` as a placeholder for the code.</p>
                         <textarea 
                             value={template} 
                             onChange={e => setTemplate(e.target.value)} 
                             rows={3}
                             className="w-full bg-black/40 p-2 rounded-lg text-white" 
                             placeholder="Your reset code is: {{OTP}}"
                         />
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

export default OtpBotSettings;
