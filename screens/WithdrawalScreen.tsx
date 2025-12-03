

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Screen, WithdrawalStatus } from '../types';
import { ArrowLeft, Banknote, ChevronsRight, XCircle, Lock } from 'lucide-react';
import BannerAd from '../components/BannerAd';
import GlowingButton from '../components/GlowingButton';

const WithdrawalScreen: React.FC = () => {
    const { setScreen, user, settings, addWithdrawalRequest, withdrawals } = useApp();
    const [method, setMethod] = useState<'JazzCash' | 'Easypaisa'>('JazzCash');
    const [fullName, setFullName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [amount, setAmount] = useState(''); // This state now holds PKR amount
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const userWithdrawals = useMemo(() => withdrawals.filter(w => w.userId === user?.id), [withdrawals, user]);
    const isNewUser = userWithdrawals.length === 0;

    useEffect(() => {
        if (method === 'JazzCash' && !settings.jazzcashEnabled && settings.easypaisaEnabled) {
            setMethod('Easypaisa');
        } else if (method === 'Easypaisa' && !settings.easypaisaEnabled && settings.jazzcashEnabled) {
            setMethod('JazzCash');
        }
    }, [settings.jazzcashEnabled, settings.easypaisaEnabled, method]);

    // All limits are now treated as PKR
    const minWithdrawalPKR = isNewUser ? settings.minWithdrawalNewUser : settings.minWithdrawalOldUsers;
    const maxWithdrawalPKR = settings.maxWithdrawal;
    const userBalancePKR = user ? user.coins / settings.coinsPerPKR : 0;

    const coinCost = useMemo(() => {
        const pkrAmount = parseFloat(amount);
        if (!isNaN(pkrAmount) && settings.coinsPerPKR > 0) {
            return Math.floor(pkrAmount * settings.coinsPerPKR);
        }
        return 0;
    }, [amount, settings.coinsPerPKR]);
    
    // Determine if withdrawals are disabled and why
    const isGloballyDisabled = !settings.withdrawalsEnabled || (!settings.jazzcashEnabled && !settings.easypaisaEnabled);
    const isBalanceSufficient = userBalancePKR >= minWithdrawalPKR;

    const isNewUserMinEnforced = isNewUser && settings.minWithdrawalNewUserEnabled;
    const isOldUserMinEnforced = !isNewUser && settings.minWithdrawalOldUsersEnabled;

    const showLock = (isNewUserMinEnforced || isOldUserMinEnforced) && !isBalanceSufficient;
    
    let disabledMessage = '';
    if (isGloballyDisabled) {
        disabledMessage = !settings.withdrawalsEnabled ? "Withdrawals are temporarily disabled by the admin." : "All withdrawal methods are currently under maintenance.";
    } else if (showLock) {
         disabledMessage = `A minimum of ${minWithdrawalPKR.toFixed(2)} PKR is required to withdraw. Your balance is too low.`;
    }
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (isGloballyDisabled || showLock || !user) {
            setError(disabledMessage || 'Cannot process request.');
            return;
        }

        const withdrawalAmountPKR = parseFloat(amount);
        if (isNaN(withdrawalAmountPKR) || withdrawalAmountPKR <= 0) {
            setError('Please enter a valid PKR amount.');
            return;
        }
        
        if (withdrawalAmountPKR < minWithdrawalPKR) {
            setError(`Minimum withdrawal is ${minWithdrawalPKR.toFixed(2)} PKR.`);
            return;
        }

        if (settings.maxWithdrawalEnabled && withdrawalAmountPKR > maxWithdrawalPKR) {
             setError(`Maximum withdrawal is ${maxWithdrawalPKR.toFixed(2)} PKR.`);
             return;
        }

        if (coinCost > user.coins) {
            setError("You don't have enough coins for this amount.");
            return;
        }
        if (!fullName.trim() || !mobileNumber.trim()) {
            setError('Please fill in all fields.');
            return;
        }

        await addWithdrawalRequest({
            userId: user.id,
            fullName,
            mobileNumber,
            amount: coinCost, // Send coin amount to context
            method,
        });
        setSuccess('Withdrawal request submitted successfully!');
        setFullName('');
        setMobileNumber('');
        setAmount('');
    };
    
    const getStatusStyle = (status: WithdrawalStatus) => {
        switch (status) {
            case WithdrawalStatus.APPROVED: return 'text-blue-400 border-blue-400';
            case WithdrawalStatus.REJECTED: return 'text-pink-400 border-pink-400';
            case WithdrawalStatus.PENDING: return 'text-yellow-400 border-yellow-400';
        }
    }

    return (
        <div className="pb-10">
            <button onClick={() => setScreen(Screen.HOME)} className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition-colors">
                <ArrowLeft size={20} /> Back to Home
            </button>
            <h1 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] font-orbitron">Withdraw</h1>
            <p className="text-center text-gray-400 mb-6 text-sm">
                Your Balance: {user?.coins.toLocaleString()} Coins ({userBalancePKR.toFixed(2)} PKR)
                <br/>
                Min Withdrawal: {minWithdrawalPKR.toFixed(2)} PKR
                {settings.maxWithdrawalEnabled && ` | Max: ${maxWithdrawalPKR.toFixed(2)} PKR`}
            </p>
            
            <BannerAd position="top" />

            {disabledMessage && (
                <div className="my-6 bg-red-900/50 border border-red-500/50 text-red-300 p-4 rounded-xl text-center flex items-center justify-center gap-3">
                    <XCircle size={24} />
                    <p className="font-semibold">{disabledMessage}</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className={`bg-black/30 p-6 rounded-2xl space-y-4 my-6 border border-[var(--primary)]/20 transition-opacity ${isGloballyDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setMethod('JazzCash')} disabled={!settings.jazzcashEnabled} className={`p-3 rounded-xl font-semibold transition-all duration-300 ${method === 'JazzCash' && settings.jazzcashEnabled ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white ring-2 ring-white/50' : 'bg-black/30'} ${!settings.jazzcashEnabled && 'opacity-50 cursor-not-allowed'}`}>
                        {settings.jazzcashEnabled ? 'JazzCash' : 'JazzCash (Maintenance)'}
                    </button>
                    <button type="button" onClick={() => setMethod('Easypaisa')} disabled={!settings.easypaisaEnabled} className={`p-3 rounded-xl font-semibold transition-all duration-300 ${method === 'Easypaisa' && settings.easypaisaEnabled ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white ring-2 ring-white/50' : 'bg-black/30'} ${!settings.easypaisaEnabled && 'opacity-50 cursor-not-allowed'}`}>
                        {settings.easypaisaEnabled ? 'Easypaisa' : 'Easypaisa (Maintenance)'}
                    </button>
                </div>
                
                <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} disabled={isGloballyDisabled} className="w-full bg-black/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] border border-transparent focus:border-[var(--primary)] transition" />
                <input type="tel" placeholder="Mobile Number (e.g. 03001234567)" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} disabled={isGloballyDisabled} className="w-full bg-black/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] border border-transparent focus:border-[var(--primary)] transition" />
                <div className="relative">
                    <input type="number" placeholder="Withdrawal Amount (PKR)" value={amount} onChange={e => setAmount(e.target.value)} disabled={isGloballyDisabled || showLock} className="w-full bg-black/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] border border-transparent focus:border-[var(--primary)] transition disabled:opacity-70" />
                     {showLock && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-xl pointer-events-none">
                            <Lock size={24} className="text-white/70" />
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-center gap-2 bg-black/20 p-3 rounded-xl text-center">
                    <span className="font-bold text-[var(--success)] text-lg">{parseFloat(amount) || 0} PKR</span>
                    <ChevronsRight size={20} className="text-gray-400" />
                    <span className="font-bold text-[var(--accent)] text-lg">{coinCost.toLocaleString()} Coins</span>
                </div>

                {error && <p className="text-red-400 text-center text-sm">{error}</p>}
                {success && <p className="text-green-400 text-center text-sm">{success}</p>}
                
                <GlowingButton type="submit" Icon={Banknote} disabled={isGloballyDisabled || showLock}>Submit Request</GlowingButton>
            </form>
            
            <div className="my-6">
                <h2 className="text-2xl font-bold text-center mb-4 font-orbitron">History</h2>
                <div className="space-y-3 max-h-60 overflow-y-auto p-1">
                    {userWithdrawals.length > 0 ? userWithdrawals.map(w => (
                        <div key={w.id} className={`bg-black/30 p-3 rounded-xl flex justify-between items-center border-l-4 ${getStatusStyle(w.status)}`}>
                            <div>
                                <p className="font-bold text-white">{(w.amount / settings.coinsPerPKR).toFixed(2)} PKR <span className="text-gray-400 text-sm">({w.amount.toLocaleString()} Coins)</span></p>
                                <p className="text-sm text-gray-400">{w.method} - {new Date(w.date).toLocaleDateString()}</p>
                            </div>
                            <p className={`font-bold text-sm px-2 py-1 rounded-md border bg-black/20 ${getStatusStyle(w.status)}`}>{w.status}</p>
                        </div>
                    )) : <p className="text-center text-gray-500">No withdrawal history.</p>}
                </div>
            </div>

            <BannerAd position="bottom" />
        </div>
    );
};

export default WithdrawalScreen;