
import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import HomeScreen from './screens/HomeScreen';
import EarnMoreScreen from './screens/EarnMoreScreen';
import WithdrawalScreen from './screens/WithdrawalScreen';
import LoginScreen from './screens/LoginScreen';
import AdminPanelScreen from './screens/AdminPanelScreen';
import ContactUsScreen from './screens/ContactUsScreen';
import AboutRulesScreen from './screens/AboutRulesScreen';
import { Screen } from './types';
import { Lock } from 'lucide-react';
import CoinAnimation from './components/CoinAnimation';
import AnnouncementsModal from './components/AnnouncementsModal';
import ThemeProvider from './components/ThemeProvider';
import SplashScreen from './components/SplashScreen';
import ForceUpdateModal from './components/ForceUpdateModal';
import BubbleCollector from './components/BubbleCollector';
import InterstitialAdModal from './components/InterstitialAdModal';

const AppContent: React.FC = () => {
    const { screen, setScreen, isAdmin, user, animationData, clearAnimation, isAnnouncementsModalOpen, settings, isLoading, isInterstitialVisible } = useApp();

    if (isLoading) {
        return <SplashScreen onFadeOut={() => {}} />;
    }
    
    if (settings.forceUpdateEnabled) {
        return <ForceUpdateModal message={settings.updateMessage} url={settings.updateUrl} />;
    }

    if (!user) {
        return (
             <div className="min-h-screen animated-gradient-bg font-sans">
                <div className="container mx-auto max-w-md p-4 relative">
                    <LoginScreen />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen animated-gradient-bg font-sans">
            <div className="container mx-auto max-w-md p-4 relative">
                {isInterstitialVisible && <InterstitialAdModal />}
                {isAnnouncementsModalOpen && <AnnouncementsModal />}
                {user && <BubbleCollector />}
                {animationData && (
                    <CoinAnimation
                        amount={animationData.amount}
                        message={animationData.message}
                        onAnimationEnd={clearAnimation}
                    />
                )}

                <div key={Screen.HOME} style={{ display: screen === Screen.HOME ? 'block' : 'none' }}>
                    <HomeScreen />
                </div>
                <div key={Screen.EARN_MORE} style={{ display: screen === Screen.EARN_MORE ? 'block' : 'none' }}>
                    <EarnMoreScreen />
                </div>
                <div key={Screen.WITHDRAWAL} style={{ display: screen === Screen.WITHDRAWAL ? 'block' : 'none' }}>
                    <WithdrawalScreen />
                </div>
                <div key={Screen.CONTACT_US} style={{ display: screen === Screen.CONTACT_US ? 'block' : 'none' }}>
                    <ContactUsScreen />
                </div>
                <div key={Screen.ABOUT_RULES} style={{ display: screen === Screen.ABOUT_RULES ? 'block' : 'none' }}>
                    <AboutRulesScreen />
                </div>
                {isAdmin && (
                    <div key={Screen.ADMIN_PANEL} style={{ display: screen === Screen.ADMIN_PANEL ? 'block' : 'none' }}>
                        <AdminPanelScreen />
                    </div>
                )}
                
                 {isAdmin && screen !== Screen.ADMIN_PANEL && (
                    <button
                        onClick={() => setScreen(Screen.ADMIN_PANEL)}
                        className="fixed bottom-4 right-4 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white p-4 rounded-full shadow-lg hover:opacity-90 transition-all duration-300 z-50 flex items-center gap-2 glowing-button-pulse"
                        style={{ boxShadow: '0 0 15px var(--glow-1)'}}
                    >
                        <Lock size={24} />
                    </button>
                )}
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <ThemeProvider>
                <AppContent />
            </ThemeProvider>
        </AppProvider>
    );
};

export default App;