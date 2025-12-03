

export enum Screen {
    HOME = 'HOME',
    EARN_MORE = 'EARN_MORE',
    WITHDRAWAL = 'WITHDRAWAL',
    ADMIN_PANEL = 'ADMIN_PANEL',
    LOGIN = 'LOGIN',
    CONTACT_US = 'CONTACT_US',
    ABOUT_RULES = 'ABOUT_RULES',
}

export enum WithdrawalStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export enum PasswordResetStatus {
    PENDING = 'PENDING',
    RESOLVED = 'RESOLVED',
}

export enum AdType {
    BANNER = 'BANNER',
    INTERSTITIAL = 'INTERSTITIAL',
    REWARDED = 'REWARDED',
}

export type AdminSection = 'withdrawals' | 'admob' | 'appSettings' | 'users' | 'analytics' | 'contact' | 'announcements' | 'themeSettings' | 'antiCheat' | 'aboutRules' | 'referralSettings' | 'passwordResets' | 'otpBotSettings';

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    coins: number;
    isBanned: boolean;
    banReason: 'MANUAL' | 'AUTO_ANTI_CHEAT' | null;
    lastDailyBonus: string | null; // ISO date string
    // Home screen video stats
    videosWatchedToday: number;
    lastVideoWatchDate: string | null; // ISO date string
    cooldownUntil: string | null; // ISO date string
    // Earn More screen video stats
    anotherVideosWatchedToday: number;
    lastAnotherVideoWatchDate: string | null; // ISO date string
    anotherCooldownUntil: string | null; // ISO date string
    // New fields
    accountCreatedAt: string; // ISO date string
    isFlagged: boolean; // For anti-cheat
    lastActionTimestamp: string | null; // For anti-cheat
    lastSeenAnnouncementTimestamp: string | null; // ISO date string
    // Referral fields
    referralCode: string;
    referredBy: string | null;
    referralsCount: number;
    referralBonusEarned: number;
    // Welcome bonus
    hasReceivedWelcomeBonus: boolean;
    lastSpecialTaskClaim: string | null; // ISO date string
}

export interface WithdrawalRequest {
    id: string;
    userId: string;
    userName: string;
    fullName: string;
    mobileNumber: string;
    amount: number;
    method: 'JazzCash' | 'Easypaisa';
    status: WithdrawalStatus;
    isNewUser: boolean;
    date: string; // ISO date string
}

export interface PasswordResetRequest {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    whatsappNumber: string;
    status: PasswordResetStatus;
    requestDate: string; // ISO date string
    otp: string | null;
    otpExpiresAt: string | null; // ISO date string
}

export interface SupportReply {
    id: string;
    author: 'USER' | 'ADMIN';
    text: string;
    date: string; // ISO date string
}

export interface SupportMessage {
    id:string;
    userId: string;
    userName: string;
    subject: string;
    status: 'OPEN' | 'CLOSED';
    replies: SupportReply[];
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: string; // ISO date string
}

export interface AdIdConfig {
    id: string;
    enabled: boolean;
    isHighEcpm: boolean;
}

export interface AdMobIds {
    appIds: AdIdConfig[];
    bannerIds: AdIdConfig[];
    interstitialIds: AdIdConfig[];
    rewardedIds: AdIdConfig[];
}

export interface AdRotationState {
    bannerIndex: number;
    interstitialIndex: number;
    rewardedIndex: number;
}

export interface AppSettings {
    appName: string;
    welcomeText: string;
    coinsPerVideo: number;
    coinsPerAnotherVideo: number;
    dailyBonusCoins: number;
    specialRewardCoins: number;
    welcomeBonusCoins: number; // New user bonus
    // New withdrawal settings
    withdrawalsEnabled: boolean;
    minWithdrawalNewUser: number;
    minWithdrawalNewUserEnabled: boolean;
    minWithdrawalOldUsers: number;
    minWithdrawalOldUsersEnabled: boolean;
    maxWithdrawal: number;
    maxWithdrawalEnabled: boolean;
    coinsPerPKR: number;
    // Home screen video limits
    dailyVideoLimit: number;
    videosPerCooldown: number;
    cooldownMinutes: number;
    // Earn More screen video limits
    dailyAnotherVideoLimit: number;
    anotherVideosPerCooldown: number;
    anotherCooldownMinutes: number;
    // New settings
    whatsappLink: string;
    easypaisaEnabled: boolean;
    jazzcashEnabled: boolean;
    theme: string;
    adsEnabled: boolean;
    testAdsEnabled: boolean;
    highEcpmModeEnabled: boolean;
    rotatingAdsEnabled: boolean;
    aboutText: string;
    rulesText: string;
    // Referral settings
    referralProgramEnabled: boolean;
    referrerBonusCoins: number;
    refereeBonusCoins: number;
    // Force update settings
    forceUpdateEnabled: boolean;
    latestAppVersion: string;
    updateUrl: string;
    updateMessage: string;
    // OTP Bot Settings
    otpBotEnabled: boolean;
    adminWhatsappLink: string;
    otpMessageTemplate: string;
    interstitialFrequency: number; // How many screen changes trigger an interstitial ad. 0 to disable.
}

export interface AppState {
    isLoading: boolean;
    screen: Screen;
    setScreen: (screen: Screen) => void;
    user: User | null;
    setUser: (user: User | null) => void;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean, message: string }>;
    logout: () => void;
    settings: AppSettings;
    updateSettings: (newSettings: Partial<AppSettings>) => void;
    adMobIds: AdMobIds;
    updateAdMobIds: (newIds: Partial<AdMobIds>) => void;
    adRotation: AdRotationState;
    getNextAdId: (type: AdType) => string;
    users: User[];
    updateUserCoins: (userId: string, newCoins: number) => void;
    banUser: (userId: string) => void;
    resetUserPassword: (userId: string, newPassword: string) => void;
    withdrawals: WithdrawalRequest[];
    addWithdrawalRequest: (request: Omit<WithdrawalRequest, 'id' | 'status' | 'date' | 'isNewUser' | 'userName'>) => void;
    updateWithdrawalStatus: (id: string, status: WithdrawalStatus) => void;
    addCoins: (amount: number, message: string) => Promise<boolean>;
    watchVideo: () => Promise<{ success: boolean; message: string; cooldown?: number }>;
    watchAnotherVideo: () => Promise<{ success: boolean; message: string; cooldown?: number }>;
    // FIX: Changed return type to Promise<boolean> to match the async implementation.
    claimDailyBonus: () => Promise<boolean>;
    claimSpecialTask: () => Promise<{ success: boolean; message: string }>;
    animationData: { amount: number; message: string } | null;
    clearAnimation: () => void;
    bubbleAnimationTrigger: { count: number; id: number } | null;
    triggerBubbleAnimation: (count: number) => void;
    activeAdminSection: AdminSection | null;
    setActiveAdminSection: (section: AdminSection | null) => void;
    supportMessages: SupportMessage[];
    sendSupportMessage: (subject: string, message: string) => void;
    sendAdminReply: (messageId: string, replyText: string) => void;
    // Announcements
    announcements: Announcement[];
    addAnnouncement: (title: string, content: string) => void;
    updateAnnouncement: (id: string, title: string, content: string) => void;
    deleteAnnouncement: (id: string) => void;
    areNewAnnouncementsAvailable: boolean;
    markAnnouncementsAsSeen: () => void;
    isAnnouncementsModalOpen: boolean;
    setAnnouncementsModalOpen: (isOpen: boolean) => void;
    // Referrals
    applyReferralCode: (code: string) => Promise<{ success: boolean; message: string }>;
    // Password Resets
    passwordResetRequests: PasswordResetRequest[];
    requestPasswordReset: (email: string, whatsappNumber: string) => Promise<{ success: boolean; message: string }>;
    resolvePasswordResetRequest: (id: string) => void;
    verifyOtpAndResetPassword: (email: string, otp: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
    // New interstitial state
    isInterstitialVisible: boolean;
    hideInterstitial: () => void;
}