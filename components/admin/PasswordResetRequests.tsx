import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PasswordResetRequest, PasswordResetStatus } from '../../types';
import { Check, Clock } from 'lucide-react';

const PasswordResetRequests: React.FC = () => {
    const { passwordResetRequests, resolvePasswordResetRequest } = useApp();
    const [activeTab, setActiveTab] = useState<'pending' | 'resolved'>('pending');

    const filteredRequests = useMemo(() => {
        const targetStatus = activeTab === 'pending' ? PasswordResetStatus.PENDING : PasswordResetStatus.RESOLVED;
        return passwordResetRequests
            .filter(req => req.status === targetStatus)
            .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
    }, [passwordResetRequests, activeTab]);

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white font-orbitron">Password Reset Requests</h2>
            <p className="text-gray-400 text-sm">
                Users who forget their password will appear here. After resetting their password in 'User Management', mark the request as resolved.
            </p>
            
            <div className="flex border-b border-gray-700">
                <button onClick={() => setActiveTab('pending')} className={`flex items-center gap-2 px-4 py-2 font-semibold ${activeTab === 'pending' ? 'border-b-2 border-yellow-400 text-yellow-400' : 'text-gray-400'}`}>
                    <Clock size={16} />
                    Pending ({passwordResetRequests.filter(r => r.status === PasswordResetStatus.PENDING).length})
                </button>
                <button onClick={() => setActiveTab('resolved')} className={`flex items-center gap-2 px-4 py-2 font-semibold ${activeTab === 'resolved' ? 'border-b-2 border-blue-400 text-blue-400' : 'text-gray-400'}`}>
                    <Check size={16} />
                    Resolved
                </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto p-1">
                {filteredRequests.length > 0 ? (
                    filteredRequests.map(req => (
                        <div key={req.id} className="p-4 rounded-xl bg-black/40">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                                <div>
                                    <p className="font-bold text-white">{req.userName}</p>
                                    <p className="text-sm text-gray-400">{req.userEmail}</p>
                                    <p className="text-sm text-gray-400">WhatsApp: {req.whatsappNumber}</p>
                                    {req.otp && <p className="text-sm font-mono text-yellow-300">OTP: {req.otp}</p>}
                                    <p className="text-xs text-gray-500 mt-1">
                                        Requested: {new Date(req.requestDate).toLocaleString()}
                                    </p>
                                </div>
                                {activeTab === 'pending' && (
                                    <button 
                                        onClick={() => resolvePasswordResetRequest(req.id)}
                                        className="mt-3 sm:mt-0 flex items-center gap-2 bg-green-600 hover:bg-green-500 text-sm py-2 px-4 rounded-lg font-semibold transition-colors"
                                    >
                                        <Check size={16} /> Mark as Resolved
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No {activeTab} requests found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PasswordResetRequests;