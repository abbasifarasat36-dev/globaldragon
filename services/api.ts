
import { db } from './firebase';
import { ref, get, set, update, push, onValue, Unsubscribe, DataSnapshot, query, orderByChild, equalTo } from 'firebase/database';
import { User, AppSettings, AdMobIds, AdRotationState, WithdrawalRequest, WithdrawalStatus, AdIdConfig, SupportMessage, Announcement, PasswordResetRequest } from '../types';

// --- DEFAULT DATA FOR SEEDING ---
const ADMIN_EMAIL = 'farasatabbasi7@gmail.com';
const ADMIN_PASSWORD = 'Farasat7';

const defaultUsers: User[] = [
    { id: 'user-0', name: 'Admin Dragon', email: ADMIN_EMAIL.toLowerCase(), password: ADMIN_PASSWORD, coins: 0, isBanned: false, banReason: null, lastDailyBonus: null, videosWatchedToday: 0, lastVideoWatchDate: null, cooldownUntil: null, anotherVideosWatchedToday: 0, lastAnotherVideoWatchDate: null, anotherCooldownUntil: null, accountCreatedAt: new Date('2023-01-01').toISOString(), isFlagged: false, lastActionTimestamp: null, lastSeenAnnouncementTimestamp: new Date().toISOString(), referralCode: 'DRAGON-ADMIN', referredBy: null, referralsCount: 0, referralBonusEarned: 0, hasReceivedWelcomeBonus: true, lastSpecialTaskClaim: null },
    { id: 'user-1', name: 'NewPlayer', email: 'user1@example.com', password: 'password1', coins: 0, isBanned: false, banReason: null, lastDailyBonus: null, videosWatchedToday: 0, lastVideoWatchDate: null, cooldownUntil: null, anotherVideosWatchedToday: 0, lastAnotherVideoWatchDate: null, anotherCooldownUntil: null, accountCreatedAt: new Date().toISOString(), isFlagged: false, lastActionTimestamp: null, lastSeenAnnouncementTimestamp: null, referralCode: 'NEW-PLAYER-CODE', referredBy: null, referralsCount: 0, referralBonusEarned: 0, hasReceivedWelcomeBonus: false, lastSpecialTaskClaim: null },
];

const defaultAppSettings: AppSettings = {
    appName: 'CryptoDragon',
    welcomeText: 'Welcome to CryptoDragon! Watch and Earn.',
    coinsPerVideo: 25,
    coinsPerAnotherVideo: 15,
    dailyBonusCoins: 100,
    specialRewardCoins: 500,
    welcomeBonusCoins: 200,
    withdrawalsEnabled: true,
    minWithdrawalNewUser: 500,
    minWithdrawalNewUserEnabled: true,
    minWithdrawalOldUsers: 1000,
    minWithdrawalOldUsersEnabled: true,
    maxWithdrawal: 5000,
    maxWithdrawalEnabled: true,
    coinsPerPKR: 100,
    dailyVideoLimit: 400,
    videosPerCooldown: 20,
    cooldownMinutes: 20,
    dailyAnotherVideoLimit: 400,
    anotherVideosPerCooldown: 20,
    anotherCooldownMinutes: 20,
    whatsappLink: 'https://chat.whatsapp.com/your-group-id',
    easypaisaEnabled: true,
    jazzcashEnabled: true,
    theme: 'DefaultDragon',
    adsEnabled: true,
    testAdsEnabled: false,
    highEcpmModeEnabled: false,
    rotatingAdsEnabled: true,
    aboutText: 'CryptoDragon is a watch-to-earn application designed to provide a fun and engaging way to earn rewards. Our mission is to create a seamless experience for users to enjoy content while earning coins that can be converted to real value.',
    rulesText: '1. One account per user. Multiple accounts are not allowed.\n2. Do not use emulators, VPNs, or any other tools to manipulate the app.\n3. Be respectful to other users and the support team.\n4. Any attempt at cheating will result in a permanent ban.\n5. Withdrawals are processed within 3-5 business days.',
    referralProgramEnabled: true,
    referrerBonusCoins: 250,
    refereeBonusCoins: 150,
    forceUpdateEnabled: false,
    latestAppVersion: '1.0.0',
    updateUrl: 'https://play.google.com/store/apps/details?id=com.yourapp.id',
    updateMessage: 'A critical update is required to continue using CryptoDragon. Please update to the latest version to enjoy new features and important security improvements.',
    otpBotEnabled: true,
    adminWhatsappLink: 'https://wa.me/1234567890',
    otpMessageTemplate: 'Your CryptoDragon password reset code is: {{OTP}}. It is valid for 3 minutes.',
    interstitialFrequency: 3,
};

const createAdIdConfigs = (ids: string[]): AdIdConfig[] => ids.map((id, index) => ({ id, enabled: true, isHighEcpm: index < 2 }));

const defaultAdMobIds: AdMobIds = {
    appIds: createAdIdConfigs(['ca-app-pub-1111/0001', 'ca-app-pub-1111/0002', 'ca-app-pub-1111/0003', 'ca-app-pub-1111/0004']),
    bannerIds: createAdIdConfigs([
        'ca-app-pub-2222/1001', 'ca-app-pub-2222/1002', 'ca-app-pub-2222/1003', 'ca-app-pub-2222/1004',
        'ca-app-pub-2222/1005', 'ca-app-pub-2222/1006', 'ca-app-pub-2222/1007', 'ca-app-pub-2222/1008',
    ]),
    interstitialIds: createAdIdConfigs([
        'ca-app-pub-3333/2001', 'ca-app-pub-3333/2002', 'ca-app-pub-3333/2003', 'ca-app-pub-3333/2004',
        'ca-app-pub-3333/2005', 'ca-app-pub-3333/2006', 'ca-app-pub-3333/2007', 'ca-app-pub-3333/2008',
    ]),
    rewardedIds: createAdIdConfigs([
        'ca-app-pub-4444/3001', 'ca-app-pub-4444/3002', 'ca-app-pub-4444/3003', 'ca-app-pub-4444/3004',
        'ca-app-pub-4444/3005', 'ca-app-pub-4444/3006', 'ca-app-pub-4444/3007', 'ca-app-pub-4444/3008',
    ]),
};

const defaultAdRotationState: AdRotationState = { bannerIndex: 0, interstitialIndex: 0, rewardedIndex: 0 };

const defaultAnnouncements: Announcement[] = [{
    id: `anno-${Date.now()}`,
    title: 'Welcome to CryptoDragon!',
    content: 'We are officially live! Thank you for joining. Start watching videos to earn coins. Check out the "Earn More" section for additional rewards.',
    createdAt: new Date().toISOString(),
}];


// --- PUBLIC GETTERS FOR DEFAULTS ---
export const getDefaultAppSettings = (): AppSettings => defaultAppSettings;
export const getDefaultAdMobIds = (): AdMobIds => defaultAdMobIds;
export const getDefaultAdRotationState = (): AdRotationState => defaultAdRotationState;


// --- FIREBASE API FUNCTIONS ---

/**
 * Checks if the database is empty and seeds it with default data if necessary.
 */
export const seedDatabase = async () => {
    const settingsRef = ref(db, 'settings');
    const snapshot = await get(settingsRef);
    if (!snapshot.exists()) {
        console.log("Database is empty. Seeding with default data...");
        const usersObject = defaultUsers.reduce((acc, user) => ({ ...acc, [user.id]: user }), {});
        const announcementsObject = defaultAnnouncements.reduce((acc, item) => ({...acc, [item.id]: item}), {});

        const initialData = {
            settings: defaultAppSettings,
            adMobIds: defaultAdMobIds,
            adRotation: defaultAdRotationState,
            users: usersObject,
            announcements: announcementsObject,
            withdrawals: {},
            supportMessages: {},
            passwordResetRequests: {},
        };
        await set(ref(db), initialData);
        console.log("Database seeded successfully.");
    }
};

/**
 * Creates a real-time listener for a specific path in the database.
 * @param path The path to listen to (e.g., 'users', 'settings').
 * @param callback The function to call with the data when it changes.
 * @returns An unsubscribe function to detach the listener.
 */
export const listenToData = (path: string, callback: (data: any) => void): Unsubscribe => {
    const dataRef = ref(db, path);
    return onValue(dataRef, (snapshot: DataSnapshot) => {
        callback(snapshot.val());
    });
};

/**
 * Updates a node at a specific path in the database.
 * Can be used to update a whole object or a single property.
 * @param path The path to the node to update (e.g., `users/user-1`).
 * @param data The new data to write to the node.
 */
export const updateNode = async (path: string, data: any): Promise<void> => {
    const dataRef = ref(db, path);
    if (data === null || data === undefined) {
         return set(dataRef, null); // Use set for deletion
    }
    return update(ref(db), { [path]: data });
};

/**
 * Pushes a new item to a list in the database, generating a unique key.
 * @param path The path to the list (e.g., 'withdrawals').
 * @param data The data for the new item.
 * @returns The unique key of the newly created item.
 */
export const pushToNode = async (path: string, data: any): Promise<string | null> => {
    const listRef = ref(db, path);
    const newItemRef = push(listRef);
    const itemWithId = { ...data, id: newItemRef.key };
    await set(newItemRef, itemWithId);
    return newItemRef.key;
};

/**
 * Authenticates a user by querying for their email and checking the password.
 * This is more secure and performant than fetching all users.
 */
export const login = async (email: string, password: string): Promise<{ user: User | null, isAdmin: boolean }> => {
    const usersRef = ref(db, 'users');
    const userQuery = query(usersRef, orderByChild('email'), equalTo(email.toLowerCase()));
    const snapshot = await get(userQuery);

    if (snapshot.exists()) {
        const usersData: Record<string, User> = snapshot.val();
        const userKey = Object.keys(usersData)[0];
        const foundUser = usersData[userKey];
        
        if (foundUser && foundUser.password === password) {
            const isAdmin = foundUser.email === ADMIN_EMAIL && foundUser.password === ADMIN_PASSWORD;
            return { user: { ...foundUser }, isAdmin };
        }
    }
    return { user: null, isAdmin: false };
};


/**
 * Registers a new user after checking if the email already exists using a query.
 */
export const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string; user: User | null }> => {
    const lowerCaseEmail = email.toLowerCase();
    // 1. Check for existing user with a query for performance and security.
    const usersRef = ref(db, 'users');
    const emailQuery = query(usersRef, orderByChild('email'), equalTo(lowerCaseEmail));
    const snapshot = await get(emailQuery);
    if (snapshot.exists()) {
        return { success: false, message: 'An account with this email already exists.', user: null };
    }

    // 2. Create new user object
    const newUserIdRef = push(usersRef);
    const newUserId = newUserIdRef.key;
    if (!newUserId) {
        return { success: false, message: 'Failed to create user ID.', user: null };
    }

    const referralCode = `${name.toUpperCase().replace(/\s/g, '')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const newUser: User = {
        id: newUserId,
        name,
        email: lowerCaseEmail,
        password,
        coins: 0,
        isBanned: false,
        banReason: null,
        lastDailyBonus: null,
        videosWatchedToday: 0,
        lastVideoWatchDate: null,
        cooldownUntil: null,
        anotherVideosWatchedToday: 0,
        lastAnotherVideoWatchDate: null,
        anotherCooldownUntil: null,
        accountCreatedAt: new Date().toISOString(),
        isFlagged: false,
        lastActionTimestamp: null,
        lastSeenAnnouncementTimestamp: null,
        referralCode,
        referredBy: null,
        referralsCount: 0,
        referralBonusEarned: 0,
        hasReceivedWelcomeBonus: false,
        lastSpecialTaskClaim: null,
    };

    // 3. Save to database
    await set(ref(db, `users/${newUserId}`), newUser);

    // 4. Return success
    return { success: true, message: 'Registration successful.', user: newUser };
};

/**
 * Fetches a single user by their ID.
 * @param userId The ID of the user to fetch.
 * @returns The user object or null if not found.
 */
export const getUserById = async (userId: string): Promise<User | null> => {
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
        return snapshot.val() as User;
    }
    return null;
};