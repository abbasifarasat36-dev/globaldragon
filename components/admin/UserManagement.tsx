

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { Search, ShieldAlert, Eye, EyeOff } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

const UserManagement: React.FC = () => {
    const { users, updateUserCoins, banUser, settings, resetUserPassword } = useApp();
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [modalView, setModalView] = useState<'coins' | 'password' | null>(null);
    const [newCoins, setNewCoins] = useState<number>(0);
    const [newPassword, setNewPassword] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleUsersCount, setVisibleUsersCount] = useState(ITEMS_PER_PAGE);
    const [passwordVisibility, setPasswordVisibility] = useState<Record<string, boolean>>({});


    const handleEditCoinsClick = (user: User) => {
        setEditingUser(user);
        setNewCoins(user.coins);
        setModalView('coins');
    };
    
    const handleResetPasswordClick = (user: User) => {
        setEditingUser(user);
        setNewPassword('');
        setModalView('password');
    };

    const handleSaveCoins = async () => {
        if (editingUser) {
            await updateUserCoins(editingUser.id, newCoins);
            closeModal();
        }
    };
    
    const handleConfirmPasswordReset = async () => {
        if (editingUser && newPassword.length >= 6) {
            if (window.confirm(`Are you sure you want to reset the password for ${editingUser.name}?`)) {
                await resetUserPassword(editingUser.id, newPassword);
                alert('Password has been reset.');
                closeModal();
            }
        } else {
            alert('Password must be at least 6 characters long.');
        }
    };
    
    const closeModal = () => {
        setEditingUser(null);
        setModalView(null);
    };
    
    const togglePasswordVisibility = (userId: string) => {
        setPasswordVisibility(prev => ({ ...prev, [userId]: !prev[userId] }));
    };

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        return users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const paginatedUsers = useMemo(() => {
        return filteredUsers.slice(0, visibleUsersCount);
    }, [filteredUsers, visibleUsersCount]);

    const renderEditModal = () => {
        if (!editingUser) return null;

        if (modalView === 'coins') {
            return (
                <div className="bg-black/80 backdrop-blur-sm border border-blue-500/30 p-6 rounded-2xl w-full max-w-sm space-y-4">
                    <h3 className="text-lg font-bold font-orbitron">Editing Coins for {editingUser.name}</h3>
                    <input 
                        type="number" 
                        value={newCoins} 
                        onChange={e => setNewCoins(Number(e.target.value))}
                        className="w-full bg-black/40 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <div className="flex gap-4">
                        <button onClick={handleSaveCoins} className="flex-1 bg-blue-600 hover:bg-blue-500 p-3 rounded-lg font-semibold">Save</button>
                        <button onClick={closeModal} className="flex-1 bg-gray-600 hover:bg-gray-500 p-3 rounded-lg font-semibold">Cancel</button>
                    </div>
                </div>
            );
        }

        if (modalView === 'password') {
             return (
                <div className="bg-black/80 backdrop-blur-sm border border-blue-500/30 p-6 rounded-2xl w-full max-w-sm space-y-4">
                    <h3 className="text-lg font-bold font-orbitron">Reset Password for {editingUser.name}</h3>
                    <input 
                        type="text" 
                        placeholder="Enter new password (min 6 chars)"
                        value={newPassword} 
                        onChange={e => setNewPassword(e.target.value)}
                        className="w-full bg-black/40 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <div className="flex gap-4">
                        <button onClick={handleConfirmPasswordReset} className="flex-1 bg-red-600 hover:bg-red-500 p-3 rounded-lg font-semibold">Confirm Reset</button>
                        <button onClick={closeModal} className="flex-1 bg-gray-600 hover:bg-gray-500 p-3 rounded-lg font-semibold">Cancel</button>
                    </div>
                </div>
            );
        }
        
        return null;
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white font-orbitron">User Management</h2>
            
            <div className="relative">
                 <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    className="w-full bg-black/20 p-3 pl-10 rounded-xl"
                />
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto p-1">
                {paginatedUsers.map(user => (
                    <div key={user.id} className={`p-4 rounded-xl bg-black/40 ${user.isBanned ? 'opacity-50' : ''}`}>
                        <div className="flex justify-between items-start">
                             <div>
                                <div className="flex items-center gap-2">
                                     <p className="font-bold text-white">{user.name}</p>
                                     {user.isFlagged && <ShieldAlert size={16} className="text-yellow-400" title="User Flagged for Suspicious Activity" />}
                                </div>
                                <p className="text-sm text-gray-400">{user.email}</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-gray-400 font-mono">
                                        Pass: {passwordVisibility[user.id] ? user.password : '******'}
                                    </p>
                                    <button onClick={() => togglePasswordVisibility(user.id)} className="text-gray-500 hover:text-white">
                                        {passwordVisibility[user.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Joined: {new Date(user.accountCreatedAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <div className="flex items-baseline gap-2 justify-end">
                                    <p className="text-lg font-bold text-yellow-300">{user.coins.toLocaleString()} Coins</p>
                                    <p className="text-sm font-semibold text-green-400">
                                        ({(user.coins / settings.coinsPerPKR).toFixed(2)} PKR)
                                    </p>
                                </div>
                            </div>
                        </div>
                         <div className="flex gap-2 mt-3 pt-3 border-t border-gray-700/50">
                            <button onClick={() => handleEditCoinsClick(user)} className="flex-1 bg-blue-600 hover:bg-blue-500 text-sm py-1.5 rounded-lg font-semibold">Edit Coins</button>
                            <button onClick={() => handleResetPasswordClick(user)} className="flex-1 bg-orange-600 hover:bg-orange-500 text-sm py-1.5 rounded-lg font-semibold">Reset Pass</button>
                            <button onClick={() => banUser(user.id)} className={`flex-1 ${user.isBanned ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-red-600 hover:bg-red-500'} text-sm py-1.5 rounded-lg font-semibold`}>
                                {user.isBanned ? 'Unban' : 'Ban'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredUsers.length > visibleUsersCount && (
                <button 
                    onClick={() => setVisibleUsersCount(prev => prev + ITEMS_PER_PAGE)}
                    className="w-full bg-black/30 hover:bg-black/50 p-3 rounded-lg font-bold text-blue-300"
                >
                    Load More ({filteredUsers.length - visibleUsersCount} remaining)
                </button>
            )}

            {modalView && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                   {renderEditModal()}
                </div>
            )}
        </div>
    );
};

export default UserManagement;