

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Screen } from '../types';
import GlowingButton from '../components/GlowingButton';
import { ArrowLeft, KeyRound } from 'lucide-react';

const AdminLoginScreen: React.FC = () => {
    // FIX: Replaced `loginAdmin` with `login` as it does not exist on AppState. The `login` function handles admin authentication.
    const { setScreen, login } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        // FIX: Replaced `loginAdmin` with `login` as it does not exist on AppState. The `login` function handles admin authentication.
        const success = await login(email, password);
        if (!success) {
            setError('Invalid credentials.');
        }
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-full max-w-md">
                <button onClick={() => setScreen(Screen.HOME)} className="absolute top-4 left-4 flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                    <ArrowLeft size={20} /> Back to App
                </button>
                <div className="text-center mb-8">
                    <KeyRound className="mx-auto h-16 w-16 text-yellow-400 mb-4 animate-pulse" />
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-orbitron">Admin Login</h1>
                    <p className="text-gray-300">Enter credentials to access the panel.</p>
                </div>
                <form onSubmit={handleLogin} className="bg-black/30 border border-blue-500/20 p-8 rounded-2xl space-y-6">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        className="w-full bg-black/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent focus:border-blue-500 transition"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        className="w-full bg-black/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent focus:border-blue-500 transition" 
                    />
                    {error && <p className="text-red-400 text-center">{error}</p>}
                    <GlowingButton type="submit" disabled={isLoading}>
                        {isLoading ? 'Logging In...' : 'Login'}
                    </GlowingButton>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginScreen;