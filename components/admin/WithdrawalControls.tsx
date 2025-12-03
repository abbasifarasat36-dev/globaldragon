

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { WithdrawalRequest, WithdrawalStatus } from '../../types';
import { Search, ArrowUp, ArrowDown, Save } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

const Toggle: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${enabled ? 'bg-blue-600' : 'bg-gray-600'}`}
    >
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);


const WithdrawalControls: React.FC = () => {
    const { withdrawals, updateWithdrawalStatus, settings, updateSettings } = useApp();
    const [activeTab, setActiveTab] = useState<'new' | 'old' | 'history'>('new');
    // Local state for settings
    const [withdrawalsEnabled, setWithdrawalsEnabled] = useState(settings.withdrawalsEnabled);
    const [minNewUser, setMinNewUser] = useState(settings.minWithdrawalNewUser);
    const [minNewUserEnabled, setMinNewUserEnabled] = useState(settings.minWithdrawalNewUserEnabled);
    const [minOldUsers, setMinOldUsers] = useState(settings.minWithdrawalOldUsers);
    const [minOldUsersEnabled, setMinOldUsersEnabled] = useState(settings.minWithdrawalOldUsersEnabled);
    const [maxWithdrawal, setMaxWithdrawal] = useState(settings.maxWithdrawal);
    const [maxEnabled, setMaxEnabled] = useState(settings.maxWithdrawalEnabled);
    const [easypaisaEnabled, setEasypaisaEnabled] = useState(settings.easypaisaEnabled);
    const [jazzcashEnabled, setJazzcashEnabled] = useState(settings.jazzcashEnabled);
    // State for list controls
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<WithdrawalStatus.APPROVED | WithdrawalStatus.REJECTED | 'ALL'>('ALL');
    const [sortConfig, setSortConfig] = useState<{ key: keyof WithdrawalRequest; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });
    const [visibleItemsCount, setVisibleItemsCount] = useState(ITEMS_PER_PAGE);

    const handleSettingsUpdate = async () => {
        await updateSettings({ 
            withdrawalsEnabled,
            minWithdrawalNewUser: minNewUser,
            minWithdrawalNewUserEnabled: minNewUserEnabled,
            minWithdrawalOldUsers: minOldUsers,
            minWithdrawalOldUsersEnabled: minOldUsersEnabled,
            maxWithdrawal,
            maxWithdrawalEnabled: maxEnabled,
            easypaisaEnabled,
            jazzcashEnabled,
        });
        alert('Withdrawal settings updated!');
    };
    
    const getStatusStyle = (status: WithdrawalStatus) => {
        switch (status) {
            case WithdrawalStatus.APPROVED: return 'border-blue-500 text-blue-400';
            case WithdrawalStatus.REJECTED: return 'border-pink-500 text-pink-400';
            case WithdrawalStatus.PENDING: return 'border-yellow-500 text-yellow-400';
        }
    }

    const filteredAndSortedWithdrawals = useMemo(() => {
        let sourceList: WithdrawalRequest[];

        if (activeTab === 'new') {
            sourceList = withdrawals.filter(w => w.isNewUser && w.status === WithdrawalStatus.PENDING);
        } else if (activeTab === 'old') {
            sourceList = withdrawals.filter(w => !w.isNewUser && w.status === WithdrawalStatus.PENDING);
        } else { // 'history'
            sourceList = withdrawals.filter(w => w.status !== WithdrawalStatus.PENDING);
        }

        let filtered = sourceList;

        if (searchTerm) {
            filtered = filtered.filter(w =>
                w.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                w.fullName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (statusFilter !== 'ALL' && activeTab === 'history') {
            filtered = filtered.filter(w => w.status === statusFilter);
        }

        filtered.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [withdrawals, activeTab, searchTerm, statusFilter, sortConfig]);
    
    const paginatedWithdrawals = useMemo(() => {
        return filteredAndSortedWithdrawals.slice(0, visibleItemsCount);
    }, [filteredAndSortedWithdrawals, visibleItemsCount]);


    const requestSort = (key: keyof WithdrawalRequest) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const renderWithdrawalList = () => (
        <>
            <div className="space-y-3 max-h-[50vh] overflow-y-auto p-1">
                {paginatedWithdrawals.length === 0 && <p className="text-center text-gray-500 py-4">No requests found.</p>}
                {paginatedWithdrawals.map((w: WithdrawalRequest) => (
                    <div key={w.id} className={`p-4 rounded-xl bg-black/40 border-l-4 ${getStatusStyle(w.status)}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold">{w.fullName} <span className="text-gray-400 text-sm">({w.userName})</span></p>
                                <p className="text-sm text-gray-300">{w.mobileNumber} - {w.method}</p>
                                <p className="text-lg font-bold text-yellow-300">{(w.amount / settings.coinsPerPKR).toFixed(2)} PKR <span className="text-gray-400 text-sm">({w.amount.toLocaleString()} Coins)</span></p>
                                <p className="text-xs text-gray-500">{new Date(w.date).toLocaleString()}</p>
                            </div>
                            <p className={`font-bold text-sm px-2 py-1 rounded-md border bg-black/20 ${getStatusStyle(w.status)}`}>{w.status}</p>
                        </div>
                        {w.status === WithdrawalStatus.PENDING && (
                            <div className="flex gap-2 mt-3">
                                <button onClick={() => updateWithdrawalStatus(w.id, WithdrawalStatus.APPROVED)} className="flex-1 bg-green-600 hover:bg-green-500 text-sm py-1.5 rounded-lg font-semibold">Approve</button>
                                <button onClick={() => updateWithdrawalStatus(w.id, WithdrawalStatus.REJECTED)} className="flex-1 bg-red-600 hover:bg-red-500 text-sm py-1.5 rounded-lg font-semibold">Reject</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
             {filteredAndSortedWithdrawals.length > visibleItemsCount && (
                <button 
                    onClick={() => setVisibleItemsCount(prev => prev + ITEMS_PER_PAGE)}
                    className="w-full mt-2 bg-black/30 hover:bg-black/50 p-3 rounded-lg font-bold text-blue-300"
                >
                    Load More ({filteredAndSortedWithdrawals.length - visibleItemsCount} remaining)
                </button>
            )}
        </>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white font-orbitron">Withdrawal Controls</h2>
            
            <div className="bg-black/20 p-4 rounded-xl space-y-4">
                <h3 className="font-semibold text-gray-200">Withdrawal Status & Limits</h3>
                
                <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg">
                    <label className={`font-bold text-lg ${withdrawalsEnabled ? 'text-green-400' : 'text-red-400'}`}>
                        {withdrawalsEnabled ? 'Withdrawals Enabled' : 'Withdrawals Disabled'}
                    </label>
                    <Toggle enabled={withdrawalsEnabled} onChange={setWithdrawalsEnabled} />
                </div>

                <div className={`space-y-3 transition-opacity ${!withdrawalsEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg">
                        <label className={`font-medium text-sm ${jazzcashEnabled ? 'text-gray-200' : 'text-gray-500'}`}>
                            Enable JazzCash
                        </label>
                        <Toggle enabled={jazzcashEnabled} onChange={setJazzcashEnabled} />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg">
                        <label className={`font-medium text-sm ${easypaisaEnabled ? 'text-gray-200' : 'text-gray-500'}`}>
                            Enable Easypaisa
                        </label>
                        <Toggle enabled={easypaisaEnabled} onChange={setEasypaisaEnabled} />
                    </div>

                    <div className="space-y-2 pt-2 border-t border-blue-500/10">
                         <div className="flex items-center justify-between">
                            <label className={`font-medium text-sm ${minNewUserEnabled ? 'text-gray-300' : 'text-gray-500'}`}>Min Limit (PKR) for New Users</label>
                            <Toggle enabled={minNewUserEnabled} onChange={setMinNewUserEnabled} />
                        </div>
                         <input type="number" value={minNewUser} onChange={e => setMinNewUser(Number(e.target.value))} className={`w-full bg-black/40 p-2 rounded-lg text-white ${!minNewUserEnabled && 'opacity-50'}`} placeholder="Min for first withdrawal" disabled={!minNewUserEnabled}/>
                    </div>
                    <div className="space-y-2">
                         <div className="flex items-center justify-between">
                            <label className={`font-medium text-sm ${minOldUsersEnabled ? 'text-gray-300' : 'text-gray-500'}`}>Min Limit (PKR) for Old Users</label>
                            <Toggle enabled={minOldUsersEnabled} onChange={setMinOldUsersEnabled} />
                        </div>
                         <input type="number" value={minOldUsers} onChange={e => setMinOldUsers(Number(e.target.value))} className={`w-full bg-black/40 p-2 rounded-lg text-white ${!minOldUsersEnabled && 'opacity-50'}`} placeholder="Min for subsequent withdrawals" disabled={!minOldUsersEnabled}/>
                    </div>
                     <div className="space-y-2">
                        <div className="flex items-center justify-between">
                             <label className={`font-medium text-sm ${maxEnabled ? 'text-gray-300' : 'text-gray-500'}`}>Max Limit (PKR)</label>
                             <Toggle enabled={maxEnabled} onChange={setMaxEnabled} />
                        </div>
                        <input type="number" value={maxWithdrawal} onChange={e => setMaxWithdrawal(Number(e.target.value))} className={`w-full bg-black/40 p-2 rounded-lg text-white ${!maxEnabled && 'opacity-50'}`} placeholder="Max Limit" disabled={!maxEnabled}/>
                    </div>
                </div>
                <button onClick={handleSettingsUpdate} className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 p-3 rounded-lg font-bold text-lg font-orbitron">
                    <Save size={20} />
                    Save Settings
                </button>
            </div>

            <div>
                <div className="flex border-b border-gray-700 mb-4">
                    <button onClick={() => setActiveTab('new')} className={`px-4 py-2 font-semibold ${activeTab === 'new' ? 'border-b-2 border-blue-400 text-blue-400' : 'text-gray-400'}`}>New User Pending</button>
                    <button onClick={() => setActiveTab('old')} className={`px-4 py-2 font-semibold ${activeTab === 'old' ? 'border-b-2 border-yellow-400 text-yellow-400' : 'text-gray-400'}`}>Old User Pending</button>
                    <button onClick={() => setActiveTab('history')} className={`px-4 py-2 font-semibold ${activeTab === 'history' ? 'border-b-2 border-green-400 text-green-400' : 'text-gray-400'}`}>History</button>
                </div>
                
                <div className="bg-black/20 p-3 rounded-xl space-y-3 mb-4">
                    <div className="relative">
                         <input type="text" placeholder="Search by name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-black/40 p-2 pl-8 rounded-lg" />
                         <Search size={18} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <div className="flex gap-2">
                        {activeTab === 'history' && (
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="flex-1 bg-black/40 p-2 rounded-lg">
                                <option value="ALL">All History</option>
                                <option value={WithdrawalStatus.APPROVED}>Approved</option>
                                <option value={WithdrawalStatus.REJECTED}>Rejected</option>
                            </select>
                        )}
                         <button onClick={() => requestSort('date')} className="flex-1 bg-black/40 p-2 rounded-lg flex items-center justify-center gap-1">
                            Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                        </button>
                         <button onClick={() => requestSort('amount')} className="flex-1 bg-black/40 p-2 rounded-lg flex items-center justify-center gap-1">
                            Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                        </button>
                    </div>
                </div>

                {renderWithdrawalList()}
            </div>
        </div>
    );
};

export default WithdrawalControls;