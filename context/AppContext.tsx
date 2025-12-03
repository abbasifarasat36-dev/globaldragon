

import React, { createContext, useState, useContext, ReactNode, useCallback, useMemo, useEffect, useRef } from 'react';
import { AppState, Screen, User, WithdrawalRequest, AppSettings, AdMobIds, AdRotationState, AdType, WithdrawalStatus, AdIdConfig, AdminSection, SupportMessage, Announcement, PasswordResetRequest, PasswordResetStatus } from '../types';
import * as api from '../services/api';
import { Unsubscribe } from 'firebase/database';

const AppContext = createContext<AppState | undefined>(undefined);

const SUSPICIOUS_ACTION_THRESHOLD_MS = 500; // Actions faster than this are flagged

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [screen, setScreen] = useState<Screen>(Screen.HOME);
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [settings, setSettings] = useState<AppSettings>(api.getDefaultAppSettings());
    const [adMobIds, setAdMobIds] = useState<AdMobIds>(api.getDefaultAdMobIds());
    const [adRotation, setAdRotation] = useState<AdRotationState>(api.getDefaultAdRotationState());
    const [users, setUsers] = useState<User[]>([]);
    const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
    const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [passwordResetRequests, setPasswordResetRequests] = useState<PasswordResetRequest[]>([]);
    const [animationData, setAnimationData] = useState<{ amount: number; message: string } | null>(null);
    const [bubbleAnimationTrigger, setBubbleAnimationTrigger] = useState<{ count: number; id: number } | null>(null);
    const [activeAdminSection, setActiveAdminSection] = useState<AdminSection | null>(null);
    const [isAnnouncementsModalOpen, setAnnouncementsModalOpen] = useState(false);
    const [isInterstitialVisible, setIsInterstitialVisible] = useState(false);
    const [navigationCount, setNavigationCount] = useState(0);

    // Effect for global data listeners, runs only once on mount.
    useEffect(() => {
        let unsubscribers: Unsubscribe[] = [];
        let isMounted = true;

        const bootstrapApp = async () => {
            await api.seedDatabase(); // Ensure DB is seeded on first load
            if (!isMounted) return;

            // Check for persisted user session first
            const storedUserId = localStorage.getItem('cryptoDragonUserId');
            if (storedUserId) {
                const persistedUser = await api.getUserById(storedUserId);
                if (persistedUser && !persistedUser.isBanned) {
                    setUser(persistedUser);
                    // This logic matches the admin check in api.ts
                    const ADMIN_EMAIL = 'farasatabbasi7@gmail.com';
                    const ADMIN_PASSWORD = 'Farasat7';
                    const isAdminUser = persistedUser.email === ADMIN_EMAIL && persistedUser.password === ADMIN_PASSWORD;
                    setIsAdmin(isAdminUser);
                } else {
                    localStorage.removeItem('cryptoDragonUserId');
                }
            }

            const initialLoadChecklist = { settings: false, users: false };
            const checkInitialLoad = () => {
                if (Object.values(initialLoadChecklist).every(Boolean) && isMounted) {
                    setIsLoading(false);
                }
            };

            unsubscribers.push(api.listenToData('settings', (data: AppSettings) => {
                if (isMounted) setSettings(data || api.getDefaultAppSettings());
                initialLoadChecklist.settings = true;
                checkInitialLoad();
            }));
            unsubscribers.push(api.listenToData('adMobIds', (data: AdMobIds) => {
                if (isMounted) setAdMobIds(data || api.getDefaultAdMobIds());
            }));
            unsubscribers.push(api.listenToData('adRotation', (data: AdRotationState) => {
                if (isMounted) setAdRotation(data || api.getDefaultAdRotationState());
            }));
            unsubscribers.push(api.listenToData('users', (data: Record<string, User>) => {
                if (isMounted) setUsers(data ? Object.values(data) : []);
                initialLoadChecklist.users = true;
                checkInitialLoad();
            }));
            unsubscribers.push(api.listenToData('withdrawals', (data: Record<string, WithdrawalRequest>) => {
                if (isMounted) setWithdrawals(data ? Object.values(data) : []);
            }));
            unsubscribers.push(api.listenToData('supportMessages', (data: Record<string, SupportMessage>) => {
                if (isMounted) setSupportMessages(data ? Object.values(data) : []);
            }));
            unsubscribers.push(api.listenToData('announcements', (data: Record<string, Announcement>) => {
                if (isMounted) setAnnouncements(data ? Object.values(data) : []);
            }));
            unsubscribers.push(api.listenToData('passwordResetRequests', (data: Record<string, PasswordResetRequest>) => {
                if (isMounted) setPasswordResetRequests(data ? Object.values(data) : []);
            }));
        };

        bootstrapApp();

        return () => { // Cleanup function
            isMounted = false;
            unsubscribers.forEach(unsub => unsub());
        };
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('cryptoDragonUserId');
        setUser(null);
        setIsAdmin(false);
        setActiveAdminSection(null);
        setScreen(Screen.HOME); // Will be redirected to Login by App.tsx
    }, []);

    // Effect to listen for changes to the currently logged-in user's data.
    // This is more efficient and prevents the infinite loops caused by the previous implementation.
    useEffect(() => {
        if (!user?.id) {
            return; // No user logged in, so no listener needed.
        }

        const unsub = api.listenToData(`users/${user.id}`, (updatedUser: User) => {
            if (updatedUser) {
                setUser(updatedUser); // Keep the user state in sync with any DB changes.
            } else {
                // User might have been deleted from the DB by an admin.
                logout();
            }
        });

        return () => {
            unsub(); // Cleanup the listener when the user logs out or their ID changes.
        };
    }, [user?.id, logout]);


    // Effect to capture referral code from URL on initial load
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get('ref');
        if (refCode) {
            localStorage.setItem('referralCode', refCode);
            // Clean the URL to avoid re-triggering
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);
    
    const triggerBubbleAnimation = useCallback((count: number) => {
        if (count > 0) {
            setBubbleAnimationTrigger({ count, id: Date.now() });
        }
    }, []);

    const autoBanUser = useCallback(async (userId: string, reason: string) => {
        const userToBan = users.find(u => u.id === userId);
        if (userToBan) {
            const updatedUser = { ...userToBan, isBanned: true, banReason: 'AUTO_ANTI_CHEAT' as const };
            await api.updateNode(`users/${userId}`, updatedUser);
            if (user && user.id === userId) {
                setUser(updatedUser);
            }
            alert(`Anti-Cheat System: Your account has been automatically suspended for suspicious activity. Reason: ${reason}. Please contact support.`);
            logout();
        }
    }, [users, user, logout]);


    const checkSuspiciousActivity = useCallback((currentUser: User): boolean => {
        if (!currentUser.lastActionTimestamp) return false;
        const now = new Date().getTime();
        const lastAction = new Date(currentUser.lastActionTimestamp).getTime();
        if (now - lastAction < SUSPICIOUS_ACTION_THRESHOLD_MS) {
            autoBanUser(currentUser.id, "Actions performed too quickly.");
            return true;
        }
        return false;
    }, [autoBanUser]);

    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        const result = await api.login(email, password);
        if (result.user) {
            if (result.user.isBanned) {
                alert('This account has been suspended.');
                return false;
            }
    
            let finalUser = { ...result.user };
            
            // Apply welcome bonus on first login
            if (!finalUser.hasReceivedWelcomeBonus && settings.welcomeBonusCoins > 0) {
                const bonusAmount = settings.welcomeBonusCoins;
                finalUser.coins += bonusAmount; // Add directly to coins
                finalUser.hasReceivedWelcomeBonus = true;
                await api.updateNode(`users/${finalUser.id}`, finalUser);
            }
    
            localStorage.setItem('cryptoDragonUserId', finalUser.id);
            setUser(finalUser);
            setIsAdmin(result.isAdmin);
            setScreen(Screen.HOME);
            return true;
        }
        return false;
    }, [settings.welcomeBonusCoins]);

    const register = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; message: string; }> => {
        const result = await api.register(name, email, password);
        if (result.success && result.user) {
            let finalUser = { ...result.user };
            
            // Apply welcome bonus on first login
            if (!finalUser.hasReceivedWelcomeBonus && settings.welcomeBonusCoins > 0) {
                const bonusAmount = settings.welcomeBonusCoins;
                finalUser.coins += bonusAmount;
                finalUser.hasReceivedWelcomeBonus = true;
                await api.updateNode(`users/${finalUser.id}`, finalUser);
            }
    
            localStorage.setItem('cryptoDragonUserId', finalUser.id);
            setUser(finalUser);
            setIsAdmin(false); // New users are never admins
            setScreen(Screen.HOME);
            return { success: true, message: "Registration successful!" };
        }
        return { success: false, message: result.message };
    }, [settings.welcomeBonusCoins]);

    const updateSettings = useCallback(async (newSettings: Partial<AppSettings>) => {
        const updatedSettings = { ...settings, ...newSettings };
        setSettings(updatedSettings);
        await api.updateNode('settings', updatedSettings);
    }, [settings]);

    const updateAdMobIds = useCallback(async (newIds: Partial<AdMobIds>) => {
        const updatedIds = { ...adMobIds, ...newIds };
        setAdMobIds(updatedIds);
        await api.updateNode('adMobIds', updatedIds);
    }, [adMobIds]);

    const adRotationRef = useRef(adRotation);
    useEffect(() => {
        adRotationRef.current = adRotation;
    }, [adRotation]);

    const getNextAdId = useCallback((type: AdType): string => {
        let indexKey: keyof AdRotationState;
        let idsKey: keyof AdMobIds;
        switch (type) {
            case AdType.BANNER: indexKey = 'bannerIndex'; idsKey = 'bannerIds'; break;
            case AdType.INTERSTITIAL: indexKey = 'interstitialIndex'; idsKey = 'interstitialIds'; break;
            case AdType.REWARDED: indexKey = 'rewardedIndex'; idsKey = 'rewardedIds'; break;
            default: return 'invalid-ad-type';
        }

        const adList = adMobIds[idsKey];
        if (!adList || adList.length === 0) {
            return 'no-ads-configured';
        }

        const enabledAds = adList.filter(ad => ad.enabled);

        if (enabledAds.length === 0) {
            return 'no-enabled-ads';
        }

        // If rotation is disabled, always return the first enabled ad.
        if (!settings.rotatingAdsEnabled) {
            return enabledAds[0].id;
        }

        // --- If rotation is ON, proceed with the existing logic ---
        const rotationCycleLength = 4;
        const relevantAds = enabledAds.slice(0, rotationCycleLength);

        if (relevantAds.length === 0) {
            return 'no-enabled-ads-in-cycle';
        }

        const currentRotationState = adRotationRef.current;
        const currentIndex = currentRotationState[indexKey];
        const adToUse = relevantAds[currentIndex % relevantAds.length];
        
        const nextIndex = (currentIndex + 1) % rotationCycleLength;
        
        const newRotationState = { ...currentRotationState, [indexKey]: nextIndex };
        
        setAdRotation(newRotationState);
        api.updateNode('adRotation', newRotationState);
        
        return adToUse.id;

    }, [adMobIds, settings.rotatingAdsEnabled]);

    const updateUserCoins = useCallback(async (userId: string, newCoins: number) => {
        await api.updateNode(`users/${userId}/coins`, newCoins);
        if (user && user.id === userId) {
            setUser(prev => prev ? { ...prev, coins: newCoins } : null);
        }
    }, [user]);

    const banUser = useCallback(async (userId: string) => {
        const userToUpdate = users.find(u => u.id === userId);
        if(userToUpdate) {
            const isNowBanned = !userToUpdate.isBanned;
            const updates = {
                isBanned: isNowBanned,
                banReason: isNowBanned ? 'MANUAL' as const : null
            };
            await api.updateNode(`users/${userId}`, { ...userToUpdate, ...updates });
        }
    }, [users]);

    const resetUserPassword = useCallback(async (userId: string, newPassword: string) => {
         await api.updateNode(`users/${userId}/password`, newPassword);
    }, []);

    const addWithdrawalRequest = useCallback(async (request: Omit<WithdrawalRequest, 'id' | 'status' | 'date' | 'isNewUser' | 'userName'>) => {
        if (!user) return;
        if (user.isBanned) { logout(); return; }
        const newRequest: Omit<WithdrawalRequest, 'id'> = {
            ...request,
            status: WithdrawalStatus.PENDING,
            date: new Date().toISOString(),
            isNewUser: withdrawals.filter(w => w.userId === user.id).length === 0,
            userName: user.name,
        };
        await api.pushToNode('withdrawals', newRequest);
        const updatedUser = { ...user, coins: user.coins - request.amount };
        await api.updateNode(`users/${user.id}`, updatedUser);
        setUser(updatedUser);
    }, [user, withdrawals, logout]);

    const updateWithdrawalStatus = useCallback(async (id: string, status: WithdrawalStatus) => {
        const withdrawal = withdrawals.find(w => w.id === id);
        if (!withdrawal) return;

        if (withdrawal.status === WithdrawalStatus.PENDING && status === WithdrawalStatus.REJECTED) {
            const userToRefund = users.find(u => u.id === withdrawal.userId);
            if (userToRefund) {
                const refundedCoins = userToRefund.coins + withdrawal.amount;
                await api.updateNode(`users/${withdrawal.userId}/coins`, refundedCoins);
                if (user && user.id === withdrawal.userId) {
                    setUser(prevUser => prevUser ? { ...prevUser, coins: refundedCoins } : null);
                }
            }
        }
        await api.updateNode(`withdrawals/${id}/status`, status);
    }, [withdrawals, users, user]);
    
    const addCoins = useCallback(async (amount: number, message: string): Promise<boolean> => {
        if (!user) return false;
        if (user.isBanned) { logout(); return false; }
        if (checkSuspiciousActivity(user)) return false;

        const updatedUser = { 
            ...user, 
            coins: user.coins + amount,
            lastActionTimestamp: new Date().toISOString()
        };
        await api.updateNode(`users/${user.id}`, updatedUser);
        setUser(updatedUser);
        setAnimationData({ amount, message });
        triggerBubbleAnimation(amount);
        return true;
    }, [user, checkSuspiciousActivity, logout, triggerBubbleAnimation]);
    

    const watchVideo = useCallback(async () => {
        if (!user) return { success: false, message: 'User not found.' };
        if (user.isBanned) { logout(); return { success: false, message: 'Account suspended.' }; }
        if (checkSuspiciousActivity(user)) { return { success: false, message: 'Account suspended.' }; }

        const now = new Date();
        const todayISO = now.toISOString().substring(0, 10);
        let currentUserState = { ...user };
        const lastWatchDateISO = currentUserState.lastVideoWatchDate ? new Date(currentUserState.lastVideoWatchDate).toISOString().substring(0, 10) : null;

        if (lastWatchDateISO !== todayISO) {
            currentUserState = { ...currentUserState, videosWatchedToday: 0, lastVideoWatchDate: now.toISOString(), cooldownUntil: null };
        }
        if (currentUserState.cooldownUntil) {
            const cooldownEnds = new Date(currentUserState.cooldownUntil);
            if (now < cooldownEnds) {
                const remainingSeconds = Math.round((cooldownEnds.getTime() - now.getTime()) / 1000);
                return { success: false, message: `On cooldown. Please wait.`, cooldown: remainingSeconds };
            } else {
                currentUserState.cooldownUntil = null;
            }
        }
        if (currentUserState.videosWatchedToday >= settings.dailyVideoLimit) {
            return { success: false, message: `Daily video limit reached.` };
        }

        const updatedVideosWatched = currentUserState.videosWatchedToday + 1;
        let newCooldownUntil: string | null = currentUserState.cooldownUntil || null;
        const coinsEarned = settings.coinsPerVideo;
        if (updatedVideosWatched > 0 && updatedVideosWatched % settings.videosPerCooldown === 0 && updatedVideosWatched < settings.dailyVideoLimit) {
            newCooldownUntil = new Date(now.getTime() + settings.cooldownMinutes * 60 * 1000).toISOString();
        }
        
        const updatedUser = {
            ...currentUserState,
            coins: currentUserState.coins + coinsEarned,
            videosWatchedToday: updatedVideosWatched,
            lastVideoWatchDate: now.toISOString(),
            cooldownUntil: newCooldownUntil,
            lastActionTimestamp: now.toISOString(),
        };

        await api.updateNode(`users/${user.id}`, updatedUser);
        setUser(updatedUser);
        setAnimationData({ amount: coinsEarned, message: 'Video Watched!' });
        triggerBubbleAnimation(coinsEarned);
        
        const returnPayload: { success: boolean; message: string; cooldown?: number } = { success: true, message: 'Coins earned!' };
        if (newCooldownUntil && newCooldownUntil !== (user.cooldownUntil || null)) {
            returnPayload.cooldown = settings.cooldownMinutes * 60;
        }
        if (updatedVideosWatched >= settings.dailyVideoLimit) {
            returnPayload.message = 'Daily limit reached!';
        }
        return returnPayload;
    }, [user, settings, checkSuspiciousActivity, logout, triggerBubbleAnimation]);

    const watchAnotherVideo = useCallback(async () => {
        if (!user) return { success: false, message: 'User not found.' };
         if (user.isBanned) { logout(); return { success: false, message: 'Account suspended.' }; }
        if (checkSuspiciousActivity(user)) { return { success: false, message: 'Account suspended.' }; }

        const now = new Date();
        const todayISO = now.toISOString().substring(0, 10);
        let currentUserState = { ...user };
        const lastWatchDateISO = currentUserState.lastAnotherVideoWatchDate ? new Date(currentUserState.lastAnotherVideoWatchDate).toISOString().substring(0, 10) : null;

        if (lastWatchDateISO !== todayISO) {
            currentUserState = { ...currentUserState, anotherVideosWatchedToday: 0, lastAnotherVideoWatchDate: now.toISOString(), anotherCooldownUntil: null };
        }
        if (currentUserState.anotherCooldownUntil) {
            const cooldownEnds = new Date(currentUserState.anotherCooldownUntil);
            if (now < cooldownEnds) {
                const remainingSeconds = Math.round((cooldownEnds.getTime() - now.getTime()) / 1000);
                return { success: false, message: `On cooldown. Please wait.`, cooldown: remainingSeconds };
            } else {
                currentUserState.anotherCooldownUntil = null;
            }
        }
        if (currentUserState.anotherVideosWatchedToday >= settings.dailyAnotherVideoLimit) {
            return { success: false, message: `Daily video limit reached.` };
        }

        const updatedVideosWatched = currentUserState.anotherVideosWatchedToday + 1;
        let newCooldownUntil: string | null = currentUserState.anotherCooldownUntil || null;
        const coinsEarned = settings.coinsPerAnotherVideo;
        if (updatedVideosWatched > 0 && updatedVideosWatched % settings.anotherVideosPerCooldown === 0 && updatedVideosWatched < settings.dailyAnotherVideoLimit) {
            newCooldownUntil = new Date(now.getTime() + settings.anotherCooldownMinutes * 60 * 1000).toISOString();
        }
        
        const updatedUser = {
            ...currentUserState,
            coins: currentUserState.coins + coinsEarned,
            anotherVideosWatchedToday: updatedVideosWatched,
            lastAnotherVideoWatchDate: now.toISOString(),
            anotherCooldownUntil: newCooldownUntil,
            lastActionTimestamp: now.toISOString(),
        };

        await api.updateNode(`users/${user.id}`, updatedUser);
        setUser(updatedUser);
        setAnimationData({ amount: coinsEarned, message: 'Video Watched!' });
        triggerBubbleAnimation(coinsEarned);
        
        const returnPayload: { success: boolean; message: string; cooldown?: number } = { success: true, message: 'Coins earned!' };
        if (newCooldownUntil && newCooldownUntil !== (user.anotherCooldownUntil || null)) {
            returnPayload.cooldown = settings.anotherCooldownMinutes * 60;
        }
        if (updatedVideosWatched >= settings.dailyAnotherVideoLimit) {
            returnPayload.message = 'Daily limit reached!';
        }
        return returnPayload;
    }, [user, settings, checkSuspiciousActivity, logout, triggerBubbleAnimation]);

    const claimDailyBonus = useCallback(async () => {
        if (!user) return false;
        if (user.isBanned) { logout(); return false; }
        if (checkSuspiciousActivity(user)) { return false; }

        const now = new Date();
        if (user.lastDailyBonus) {
            const lastBonusDate = new Date(user.lastDailyBonus);
            if ((now.getTime() - lastBonusDate.getTime()) / (1000 * 60 * 60) < 24) return false;
        }

        const bonusAmount = settings.dailyBonusCoins;
        const updatedUser = { ...user, coins: user.coins + bonusAmount, lastDailyBonus: now.toISOString(), lastActionTimestamp: now.toISOString() };
        await api.updateNode(`users/${user.id}`, updatedUser);
        setUser(updatedUser);
        setAnimationData({ amount: bonusAmount, message: 'Daily Bonus Claimed!' });
        triggerBubbleAnimation(bonusAmount);
        return true;
    }, [user, settings.dailyBonusCoins, checkSuspiciousActivity, logout, triggerBubbleAnimation]);

    const claimSpecialTask = useCallback(async (): Promise<{ success: boolean; message: string }> => {
        if (!user) return { success: false, message: 'User not found.' };
        if (user.isBanned) { logout(); return { success: false, message: 'Account suspended.' }; }
        if (checkSuspiciousActivity(user)) { return { success: false, message: 'Account suspended.' }; }

        const today = new Date();
        const todayISO = today.toISOString().substring(0, 10);
        const lastAnotherVideoWatchDateISO = user.lastAnotherVideoWatchDate ? new Date(user.lastAnotherVideoWatchDate).toISOString().substring(0, 10) : null;
        const anotherVideosWatchedToday = lastAnotherVideoWatchDateISO === todayISO ? user.anotherVideosWatchedToday : 0;
        if (anotherVideosWatchedToday < settings.dailyAnotherVideoLimit) {
            return { success: false, message: `Watch all ${settings.dailyAnotherVideoLimit} videos to unlock this task.` };
        }
        if (user.lastSpecialTaskClaim && new Date(user.lastSpecialTaskClaim).toISOString().substring(0, 10) === todayISO) {
            return { success: false, message: 'Special task already claimed for today.' };
        }

        const bonusAmount = settings.specialRewardCoins;
        const updatedUser = { ...user, coins: user.coins + bonusAmount, lastSpecialTaskClaim: today.toISOString(), lastActionTimestamp: today.toISOString() };
        await api.updateNode(`users/${user.id}`, updatedUser);
        setUser(updatedUser);
        setAnimationData({ amount: bonusAmount, message: 'Special Reward Unlocked!' });
        triggerBubbleAnimation(bonusAmount);
        return { success: true, message: `+${bonusAmount} Coins! Special reward unlocked!` };
    }, [user, settings.dailyAnotherVideoLimit, settings.specialRewardCoins, checkSuspiciousActivity, logout, triggerBubbleAnimation]);

    const applyReferralCode = useCallback(async (code: string): Promise<{ success: boolean; message: string }> => {
        if (!user) return { success: false, message: 'You must be logged in.' };
        if (!settings.referralProgramEnabled) return { success: false, message: 'The referral program is currently disabled.' };
        if (user.referredBy) return { success: false, message: 'You have already used a referral code.' };

        const referrer = users.find(u => u.referralCode.toLowerCase() === code.toLowerCase());
        if (!referrer) return { success: false, message: 'Invalid referral code.' };
        if (referrer.id === user.id) return { success: false, message: 'You cannot use your own referral code.' };

        const now = new Date().toISOString();
        const refereeBonus = settings.refereeBonusCoins;
        const referrerBonus = settings.referrerBonusCoins;

        const updatedReferee = { ...user, coins: user.coins + refereeBonus, referredBy: referrer.referralCode, lastActionTimestamp: now };
        await api.updateNode(`users/${user.id}`, updatedReferee);
        setUser(updatedReferee);
        setAnimationData({ amount: refereeBonus, message: 'Referral bonus claimed!' });
        triggerBubbleAnimation(refereeBonus);
        
        const updatedReferrer = { ...referrer, coins: referrer.coins + referrerBonus, referralsCount: referrer.referralsCount + 1, referralBonusEarned: referrer.referralBonusEarned + referrerBonus };
        await api.updateNode(`users/${referrer.id}`, updatedReferrer);
        
        return { success: true, message: `Successfully applied code! You received ${refereeBonus} coins.` };
    }, [user, users, settings, triggerBubbleAnimation]);
    
    useEffect(() => {
        const applyStoredReferral = async () => {
            if (user && !user.referredBy) {
                const storedRefCode = localStorage.getItem('referralCode');
                if (storedRefCode) {
                    await applyReferralCode(storedRefCode);
                    localStorage.removeItem('referralCode');
                }
            }
        };
        applyStoredReferral();
    }, [user, applyReferralCode]);

    const clearAnimation = useCallback(() => setAnimationData(null), []);

    const sendSupportMessage = useCallback(async (subject: string, message: string) => {
        if (!user) return;
        const newMessage: Omit<SupportMessage, 'id'> = {
            userId: user.id, userName: user.name, subject, status: 'OPEN',
            replies: [{ id: `rep-${Date.now()}`, author: 'USER', text: message, date: new Date().toISOString() }]
        };
        await api.pushToNode('supportMessages', newMessage);
    }, [user]);

    const sendAdminReply = useCallback(async (messageId: string, replyText: string) => {
        const message = supportMessages.find(m => m.id === messageId);
        if(!message) return;
        const newReply = { id: `rep-${Date.now()}`, author: 'ADMIN' as const, text: replyText, date: new Date().toISOString() };
        const updatedReplies = [...message.replies, newReply];
        await api.updateNode(`supportMessages/${messageId}/replies`, updatedReplies);
    }, [supportMessages]);

    const addAnnouncement = useCallback(async (title: string, content: string) => {
        const newAnnouncement: Omit<Announcement, 'id'> = { title, content, createdAt: new Date().toISOString() };
        await api.pushToNode('announcements', newAnnouncement);
    }, []);

    const updateAnnouncement = useCallback(async (id: string, title: string, content: string) => {
        await api.updateNode(`announcements/${id}`, { title, content });
    }, []);

    const deleteAnnouncement = useCallback(async (id: string) => {
        await api.updateNode(`announcements/${id}`, null);
    }, []);

    const markAnnouncementsAsSeen = useCallback(async () => {
        if (!user) return;
        const now = new Date().toISOString();
        const updatedUser = { ...user, lastSeenAnnouncementTimestamp: now };
        await api.updateNode(`users/${user.id}/lastSeenAnnouncementTimestamp`, now);
        setUser(updatedUser);
    }, [user]);

    const areNewAnnouncementsAvailable = useMemo(() => {
        if (!user || announcements.length === 0) return false;
        const latestAnnouncement = announcements.reduce((latest, current) => new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest);
        if (!user.lastSeenAnnouncementTimestamp) return true;
        return new Date(latestAnnouncement.createdAt) > new Date(user.lastSeenAnnouncementTimestamp);
    }, [user, announcements]);

    const requestPasswordReset = useCallback(async (email: string, whatsappNumber: string): Promise<{ success: boolean; message: string }> => {
        const userExists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!userExists) { return { success: true, message: "If an account with this email exists, instructions have been sent." }; }
        const existingRequest = passwordResetRequests.find(r => r.userId === userExists.id && r.status === PasswordResetStatus.PENDING);
        if (existingRequest) { return { success: true, message: "A password reset request is already pending for this account." }; }

        let otp: string | null = null, otpExpiresAt: string | null = null, message: string;
        const baseRequest = {
            userId: userExists.id, userName: userExists.name, userEmail: userExists.email,
            whatsappNumber: whatsappNumber, status: PasswordResetStatus.PENDING, requestDate: new Date().toISOString()
        };
        if (settings.otpBotEnabled) {
            otp = Math.floor(100000 + Math.random() * 900000).toString();
            otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000).toISOString();
            console.log(`-- OTP FOR ${whatsappNumber}: ${otp} --`);
            message = "An OTP has been sent to your WhatsApp. Please check and enter it below.";
        } else {
            message = "The automated system is offline. Please contact the admin directly on WhatsApp to reset your password.";
        }
        await api.pushToNode('passwordResetRequests', { ...baseRequest, otp, otpExpiresAt });
        return { success: true, message };
    }, [users, passwordResetRequests, settings.otpBotEnabled]);

    const verifyOtpAndResetPassword = useCallback(async (email: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
        const request = passwordResetRequests.find(r => r.userEmail.toLowerCase() === email.toLowerCase() && r.status === PasswordResetStatus.PENDING);
        if (!request) return { success: false, message: "No pending password reset request found." };
        if (request.otp !== otp) return { success: false, message: "Invalid OTP." };
        if (!request.otpExpiresAt || new Date() > new Date(request.otpExpiresAt)) return { success: false, message: "OTP has expired." };
        
        await resetUserPassword(request.userId, newPassword);
        await resolvePasswordResetRequest(request.id);
        return { success: true, message: "Password has been successfully reset. You can now log in." };
    }, [passwordResetRequests, resetUserPassword]);

    const resolvePasswordResetRequest = useCallback(async (id: string) => {
        await api.updateNode(`passwordResetRequests/${id}/status`, PasswordResetStatus.RESOLVED);
    }, []);

    const hideInterstitial = useCallback(() => {
        setIsInterstitialVisible(false);
    }, []);

    const handleNavigation = useCallback((newScreen: Screen) => {
        if (newScreen === screen) return;

        const isSpecialTransition = screen === Screen.ADMIN_PANEL || newScreen === Screen.ADMIN_PANEL || newScreen === Screen.LOGIN;

        if (!isSpecialTransition && settings.adsEnabled && settings.interstitialFrequency > 0) {
            const newCount = navigationCount + 1;
            if (newCount >= settings.interstitialFrequency) {
                setIsInterstitialVisible(true);
                setNavigationCount(0);
            } else {
                setNavigationCount(newCount);
            }
        }
        
        setScreen(newScreen);
    }, [screen, navigationCount, settings.adsEnabled, settings.interstitialFrequency]);

    const value: AppState = {
        isLoading,
        screen, 
        setScreen: handleNavigation,
        user, setUser,
        isAdmin, login, register, logout,
        settings, updateSettings,
        adMobIds, updateAdMobIds,
        adRotation, getNextAdId,
        users, updateUserCoins, banUser, resetUserPassword,
        withdrawals, addWithdrawalRequest, updateWithdrawalStatus,
        addCoins,
        watchVideo,
        watchAnotherVideo,
        claimDailyBonus,
        claimSpecialTask,
        animationData,
        clearAnimation,
        bubbleAnimationTrigger,
        triggerBubbleAnimation,
        activeAdminSection,
        setActiveAdminSection,
        supportMessages,
        sendSupportMessage,
        sendAdminReply,
        announcements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        areNewAnnouncementsAvailable,
        markAnnouncementsAsSeen,
        isAnnouncementsModalOpen,
        setAnnouncementsModalOpen,
        applyReferralCode,
        passwordResetRequests,
        requestPasswordReset,
        resolvePasswordResetRequest,
        verifyOtpAndResetPassword,
        isInterstitialVisible,
        hideInterstitial,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// FIX: Changed return type to AppState as isLoading is now part of the AppState interface.
export const useApp = (): AppState => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};