
import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { User, WithdrawalStatus, AdIdConfig, AdMobIds } from '../../types';
import { Users, UserPlus, UserCheck, Banknote, Clock, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';

const generateMockPerformance = (id: string) => {
    const hash = id.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const revenue = parseFloat(((hash & 0xFF) / 255 * 150).toFixed(2));
    const clicks = (hash & 0xFFFF) % 10000;
    return { revenue, clicks };
};


const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType, colorClass: string }> = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-black/20 p-4 rounded-xl flex items-center gap-4">
        <div className={`p-3 rounded-lg ${colorClass}/20`}>
            <Icon size={24} className={colorClass} />
        </div>
        <div>
            <p className="text-2xl font-bold font-orbitron text-white">{value}</p>
            <p className="text-sm text-gray-400">{title}</p>
        </div>
    </div>
);


const DataAnalytics: React.FC = () => {
    const { users, withdrawals, settings, adMobIds } = useApp();
    
    const analyticsData = useMemo(() => {
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

        const newUsersToday = users.filter(u => new Date(u.accountCreatedAt) > twentyFourHoursAgo).length;
        const oldUsers = users.length - newUsersToday;
        
        const pendingWithdrawals = withdrawals.filter(w => w.status === WithdrawalStatus.PENDING);
        const approvedWithdrawals = withdrawals.filter(w => w.status === WithdrawalStatus.APPROVED);

        const totalPaidCoins = approvedWithdrawals.reduce((sum, w) => sum + w.amount, 0);
        const totalPaidPKR = totalPaidCoins / settings.coinsPerPKR;

        const allAdIds = [
            ...adMobIds.appIds,
            ...adMobIds.bannerIds,
            ...adMobIds.interstitialIds,
            ...adMobIds.rewardedIds
        ];
        const mockTotalRevenue = allAdIds
            .filter(ad => ad.enabled)
            .reduce((sum, ad) => sum + generateMockPerformance(ad.id).revenue, 0);

        const profit = mockTotalRevenue - totalPaidPKR;

        return {
            totalUsers: users.length,
            newUsersToday,
            oldUsers,
            totalWithdrawals: withdrawals.length,
            pendingWithdrawalsCount: pendingWithdrawals.length,
            approvedWithdrawalsCount: approvedWithdrawals.length,
            totalPaidPKR,
            mockTotalRevenue,
            profit,
        };
    }, [users, withdrawals, settings.coinsPerPKR, adMobIds]);
    

    return (
        <div className="space-y-6 pb-10">
            <h2 className="text-xl font-bold text-white font-orbitron">Financial & User Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <StatCard title="Total Users" value={analyticsData.totalUsers.toLocaleString()} icon={Users} colorClass="text-blue-400" />
                 <StatCard title="New Users Today" value={analyticsData.newUsersToday.toLocaleString()} icon={UserPlus} colorClass="text-green-400" />
                 <StatCard title="Old Users" value={analyticsData.oldUsers.toLocaleString()} icon={UserCheck} colorClass="text-gray-400" />
                 <StatCard title="Paid Withdrawals" value={analyticsData.approvedWithdrawalsCount.toLocaleString()} icon={CheckCircle} colorClass="text-green-400" />
                 <StatCard title="Pending Withdrawals" value={analyticsData.pendingWithdrawalsCount.toLocaleString()} icon={Clock} colorClass="text-yellow-400" />
                 <StatCard title="Total Withdrawals" value={analyticsData.totalWithdrawals.toLocaleString()} icon={Banknote} colorClass="text-orange-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <StatCard title="Ad Revenue (PKR)" value={analyticsData.mockTotalRevenue.toFixed(2)} icon={TrendingUp} colorClass="text-green-400" />
                 <StatCard title="Given to Users (PKR)" value={analyticsData.totalPaidPKR.toFixed(2)} icon={TrendingDown} colorClass="text-red-400" />
                 <StatCard 
                    title={analyticsData.profit >= 0 ? "Profit (PKR)" : "Loss (PKR)"} 
                    value={analyticsData.profit.toFixed(2)} 
                    icon={analyticsData.profit >= 0 ? TrendingUp : TrendingDown} 
                    colorClass={analyticsData.profit >= 0 ? "text-green-400" : "text-red-400"}
                />
            </div>
            
             <div className="space-y-4">
                <h3 className="font-semibold text-lg text-white font-orbitron">Coin & User Value</h3>
                <div className="bg-black/20 p-4 rounded-xl text-center">
                    <p className="text-gray-400 text-sm">Current Conversion Rate</p>
                    <p className="text-2xl font-bold font-orbitron">
                        <span className="text-yellow-300">{settings.coinsPerPKR.toLocaleString()}</span> Coins = <span className="text-green-400">1 PKR</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">This can be changed in 'App & Coin Controls'</p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-lg text-white font-orbitron">User List</h3>
                <div className="bg-black/20 p-2 rounded-xl max-h-80 overflow-y-auto">
                    {users.map(user => (
                        <div key={user.id} className="flex justify-between items-center p-2 border-b border-gray-800 last:border-b-0">
                            <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-xs text-gray-400">{user.email}</p>
                            </div>
                             <div className="text-right">
                                <p className="font-bold text-yellow-400">{user.coins.toLocaleString()} Coins</p>
                                <p className="text-xs text-green-400">{(user.coins / settings.coinsPerPKR).toFixed(2)} PKR</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default DataAnalytics;