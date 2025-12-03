
import React from 'react';
import { useApp } from '../context/AppContext';
import { Screen, AdminSection, PasswordResetStatus } from '../types';
import { LogOut, ArrowLeft, Shield, Settings, Users, DollarSign, BarChart2, MessageSquare, Megaphone, Palette, ShieldAlert, Info, Share2, KeyRound, Bot } from 'lucide-react';
import WithdrawalControls from '../components/admin/WithdrawalControls';
import AdMobSettings from '../components/admin/AdMobSettings';
import AppSettingsControls from '../components/admin/AppSettingsControls';
import UserManagement from '../components/admin/UserManagement';
import DataAnalytics from '../components/admin/DataAnalytics';
import SupportMessages from '../components/admin/SupportMessages';
import AnnouncementsAdmin from '../components/admin/AnnouncementsAdmin';
import ThemeSettings from '../components/admin/ThemeSettings';
import AntiCheatPanel from '../components/admin/AntiCheatPanel';
import AboutRulesSettings from '../components/admin/AboutRulesSettings';
import ReferralSettings from '../components/admin/ReferralSettings';
import PasswordResetRequests from '../components/admin/PasswordResetRequests';
import OtpBotSettings from '../components/admin/OtpBotSettings';

const SECTIONS: Record<AdminSection, { title: string; component: React.FC; icon: React.ElementType }> = {
    analytics: { title: 'Data Analytics', component: DataAnalytics, icon: BarChart2 },
    users: { title: 'User Management', component: UserManagement, icon: Users },
    passwordResets: { title: 'Password Resets', component: PasswordResetRequests, icon: KeyRound },
    withdrawals: { title: 'Withdrawal Controls', component: WithdrawalControls, icon: DollarSign },
    appSettings: { title: 'App & Coin Controls', component: AppSettingsControls, icon: Settings },
    otpBotSettings: { title: 'OTP Bot Settings', component: OtpBotSettings, icon: Bot },
    referralSettings: { title: 'Referral Program', component: ReferralSettings, icon: Share2 },
    themeSettings: { title: 'Theme Settings', component: ThemeSettings, icon: Palette },
    admob: { title: 'AdMob Settings', component: AdMobSettings, icon: Shield },
    announcements: { title: 'Announcements', component: AnnouncementsAdmin, icon: Megaphone },
    contact: { title: 'Support Messages', component: SupportMessages, icon: MessageSquare },
    antiCheat: { title: 'Anti-Cheat Panel', component: AntiCheatPanel, icon: ShieldAlert },
    aboutRules: { title: 'About & Rules', component: AboutRulesSettings, icon: Info },
};

const SECTION_ORDER: AdminSection[] = [
    'analytics',
    'users',
    'passwordResets',
    'withdrawals',
    'contact',
    'announcements',
    'appSettings',
    'otpBotSettings',
    'referralSettings',
    'themeSettings',
    'admob',
    'antiCheat',
    'aboutRules',
];


interface MenuButtonProps {
    section: AdminSection;
    onClick: () => void;
}
const MenuButton: React.FC<MenuButtonProps> = ({ section, onClick }) => {
    const { passwordResetRequests } = useApp();
    const { title, icon: Icon } = SECTIONS[section];
    
    const pendingResetsCount = passwordResetRequests.filter(r => r.status === PasswordResetStatus.PENDING).length;

    return (
         <button
            onClick={onClick}
            className="relative flex flex-col items-center justify-center text-center bg-black/30 p-6 rounded-2xl aspect-square transition-all duration-300 shadow-lg border border-[var(--primary)]/20 glowing-card-hover"
        >
            <Icon className="w-10 h-10 text-[var(--primary)] mb-3" />
            <span className="text-sm font-semibold break-words leading-tight">{title}</span>
            {section === 'passwordResets' && pendingResetsCount > 0 && (
                <span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold ring-2 ring-black/50">
                    {pendingResetsCount}
                </span>
            )}
        </button>
    )
}

const AdminPanelScreen: React.FC = () => {
    const { setScreen, logout, activeAdminSection, setActiveAdminSection } = useApp();

    if (activeAdminSection) {
        const { title, component: Component } = SECTIONS[activeAdminSection];
        return (
            <div className="pb-24 animate-fadeIn">
                <header className="flex items-center pb-4 border-b border-[var(--primary)]/20 mb-4">
                    <button onClick={() => setActiveAdminSection(null)} className="p-2 mr-4 bg-black/30 rounded-lg hover:bg-black/50 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-xl font-bold font-orbitron">{title}</h2>
                    <button onClick={logout} className="p-3 bg-red-600/80 text-white rounded-lg hover:bg-red-600 transition ml-auto">
                        <LogOut size={20} />
                    </button>
                </header>
                <div className="overflow-y-auto">
                    <Component />
                </div>
                 <style>{`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
                `}</style>
            </div>
        );
    }

    return (
        <div className="pb-24 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] font-orbitron">Admin</h1>
                    <p className="text-gray-400 text-sm">CryptoDragon Panel</p>
                </div>
                <div className="flex gap-2">
                     <button onClick={() => setScreen(Screen.HOME)} className="p-3 bg-black/30 text-white rounded-lg hover:bg-black/50 transition">
                        <ArrowLeft size={20} />
                     </button>
                    <button onClick={logout} className="p-3 bg-red-600/80 text-white rounded-lg hover:bg-red-600 transition">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
                {SECTION_ORDER.map(key => (
                     <MenuButton key={key} section={key} onClick={() => setActiveAdminSection(key)} />
                ))}
            </div>
             <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default AdminPanelScreen;