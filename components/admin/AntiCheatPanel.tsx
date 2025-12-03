
import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { ShieldCheck, ShieldX } from 'lucide-react';

const AntiCheatPanel: React.FC = () => {
    const { users, banUser } = useApp();

    const caughtUsers = useMemo(() => {
        return users.filter(user => user.isBanned && user.banReason === 'AUTO_ANTI_CHEAT');
    }, [users]);

    const handleUnban = (userId: string) => {
        if (window.confirm('Are you sure you want to unban this user? This will allow them to use the app again.')) {
            banUser(userId); // banUser toggles the ban state and resets the reason
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white font-orbitron">Anti-Cheat Detections</h2>
            <p className="text-gray-400 text-sm">
                This list shows users who were automatically banned by the system for suspicious activity, such as clicking too fast.
                You can review their case and unban them if you believe it was a mistake.
            </p>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto p-1">
                {caughtUsers.length > 0 ? (
                    caughtUsers.map(user => (
                        <div key={user.id} className="p-4 rounded-xl bg-black/40 border-l-4 border-red-500">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                <div>
                                    <p className="font-bold text-white">{user.name}</p>
                                    <p className="text-sm text-gray-400">{user.email}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Joined: {new Date(user.accountCreatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="mt-3 sm:mt-0 flex gap-2">
                                    <button 
                                        onClick={() => handleUnban(user.id)}
                                        className="flex items-center gap-2 text-sm py-2 px-4 rounded-lg font-semibold bg-green-600 hover:bg-green-500 transition-colors"
                                    >
                                        <ShieldCheck size={16} />
                                        Unban User
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10">
                        <ShieldX size={48} className="mx-auto text-gray-600 mb-2" />
                        <p className="text-gray-500">No automatically banned users found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AntiCheatPanel;
