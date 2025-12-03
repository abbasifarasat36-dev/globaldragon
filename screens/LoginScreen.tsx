
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import GlowingButton from '../components/GlowingButton';
import { LogIn, X, UserPlus, Shield } from 'lucide-react';

const NeonDragonSVG: React.FC<{ className?: string }> = ({ className }) => (
     <svg 
        className={className}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
    >
        <defs>
            <filter id="neon-glow-login" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#neon-glow-login)">
            <path d="M60 140 C 40 120, 30 90, 40 70 C 50 50, 80 40, 100 50 C 120 60, 130 80, 140 100" stroke="#1E90FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M140 100 C 150 90, 160 80, 170 85 C 180 90, 175 105, 165 110 L 140 100" stroke="#8A2BE2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M100 50 C 90 30, 110 20, 120 30" stroke="#1E90FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="125" cy="75" r="5" fill="#FFD700" />
            <path d="M60 140 C 80 160, 110 165, 130 150" stroke="#8A2BE2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
    </svg>
);


const LoginScreen: React.FC = () => {
    const { login, register } = useApp();
    const [view, setView] = useState<'login' | 'signup'>('login');
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [lockoutTime, setLockoutTime] = useState(0);
    
    // Signup State
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

    // Common State
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let timer: number;
        if (lockoutTime > 0) {
            timer = window.setTimeout(() => setLockoutTime(lockoutTime - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [lockoutTime]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (lockoutTime > 0) return;

        setIsLoading(true);
        setError('');
        const success = await login(loginEmail, loginPassword);
        if (success) {
            setLoginAttempts(0); // Reset on success
        } else {
            const newAttempts = loginAttempts + 1;
            setLoginAttempts(newAttempts);
            if (newAttempts >= 5) {
                setLockoutTime(30);
                setError('Too many failed login attempts. Please wait 30 seconds.');
            } else {
                setError(`Invalid email or password. ${5 - newAttempts} attempts remaining.`);
            }
        }
        setIsLoading(false);
    };
    
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (signupPassword !== signupConfirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (signupPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        setIsLoading(true);
        setError('');
        const result = await register(signupName, signupEmail, signupPassword);
        if (!result.success) {
            setError(result.message);
        }
        setIsLoading(false);
    };

    const ForgotPasswordModal: React.FC = () => {
        const { settings, requestPasswordReset, verifyOtpAndResetPassword } = useApp();
        const [step, setStep] = useState<'initial' | 'otp' | 'success' | 'manual'>('initial');
        const [modalEmail, setModalEmail] = useState('');
        const [whatsappNumber, setWhatsappNumber] = useState('');
        const [otp, setOtp] = useState('');
        const [newPassword, setNewPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [feedback, setFeedback] = useState('');
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [timer, setTimer] = useState(180); // 3 minutes

        useEffect(() => {
            let interval: number;
            if (step === 'otp' && timer > 0) {
                interval = window.setInterval(() => {
                    setTimer(prev => prev - 1);
                }, 1000);
            }
            return () => window.clearInterval(interval);
        }, [step, timer]);

        const handleRequestSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setIsSubmitting(true);
            setFeedback('');
            const result = await requestPasswordReset(modalEmail, whatsappNumber);
            setFeedback(result.message);
            if (settings.otpBotEnabled) {
                setStep('otp');
                setTimer(180);
            } else {
                setStep('manual');
            }
            setIsSubmitting(false);
        };

        const handleOtpSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (newPassword !== confirmPassword) {
                setFeedback("Passwords do not match.");
                return;
            }
             if (newPassword.length < 6) {
                setFeedback("Password must be at least 6 characters.");
                return;
            }
            setIsSubmitting(true);
            setFeedback('');
            const result = await verifyOtpAndResetPassword(modalEmail, otp, newPassword);
            if (result.success) {
                setFeedback(result.message);
                setStep('success');
            } else {
                setFeedback(result.message);
            }
            setIsSubmitting(false);
        };

        const renderContent = () => {
            switch (step) {
                case 'initial':
                    return (
                        <form onSubmit={handleRequestSubmit} className="space-y-4">
                            <h2 className="text-xl font-bold font-orbitron text-center mb-4">Forgot Password</h2>
                            <p className="text-sm text-gray-400 text-center">Enter your account email and WhatsApp number to begin the recovery process.</p>
                             <input type="email" placeholder="Your Email" value={modalEmail} onChange={e => setModalEmail(e.target.value)} required className="w-full bg-black/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                            <input type="tel" placeholder="WhatsApp Number" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} required className="w-full bg-black/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                            {feedback && <p className="text-red-400 text-center text-sm">{feedback}</p>}
                            <GlowingButton type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Sending...' : 'Send Request'}
                            </GlowingButton>
                        </form>
                    );
                case 'otp':
                    const minutes = Math.floor(timer / 60);
                    const seconds = timer % 60;
                    return (
                        <form onSubmit={handleOtpSubmit} className="space-y-4">
                            <h2 className="text-xl font-bold font-orbitron text-center mb-4">Enter OTP</h2>
                            <p className="text-sm text-gray-400 text-center">{feedback || "An OTP has been sent to your WhatsApp. Enter it below along with your new password."}</p>
                            <div className="font-mono text-center text-lg text-yellow-400">
                                Time remaining: {minutes}:{seconds < 10 ? '0' : ''}{seconds}
                            </div>
                            <input type="text" placeholder="6-Digit OTP" value={otp} onChange={e => setOtp(e.target.value)} required className="w-full bg-black/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                            <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full bg-black/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                            <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full bg-black/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                            <GlowingButton type="submit" disabled={isSubmitting || timer === 0}>
                                {isSubmitting ? 'Verifying...' : 'Reset Password'}
                            </GlowingButton>
                        </form>
                    );
                case 'manual':
                     return (
                        <div className="text-center py-4 space-y-4">
                            <h2 className="text-xl font-bold font-orbitron text-center mb-4">Contact Admin</h2>
                            <p className="text-blue-300">{feedback}</p>
                            <a href={settings.adminWhatsappLink} target="_blank" rel="noopener noreferrer">
                               <GlowingButton>Contact on WhatsApp</GlowingButton>
                            </a>
                        </div>
                    );
                case 'success':
                    return (
                        <div className="text-center py-4">
                            <h2 className="text-xl font-bold font-orbitron text-center mb-4">Success!</h2>
                            <p className="text-green-400">{feedback}</p>
                            <button onClick={() => setIsForgotModalOpen(false)} className="mt-4 text-sm text-gray-300 hover:text-white underline">Close</button>
                        </div>
                    );
            }
        };

        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-blue-500/30 rounded-2xl w-full max-w-sm p-6 relative">
                    <button onClick={() => setIsForgotModalOpen(false)} className="absolute top-2 right-2 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors">
                        <X size={20} />
                    </button>
                    {renderContent()}
                </div>
            </div>
        );
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {isForgotModalOpen && <ForgotPasswordModal />}
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <NeonDragonSVG className="w-24 h-24 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-orbitron">CryptoDragon</h1>
                    <p className="text-gray-300">{view === 'login' ? 'Login to start earning.' : 'Create an account to join.'}</p>
                </div>

                {view === 'login' ? (
                    <form onSubmit={handleLogin} className="bg-black/30 border border-blue-500/20 p-8 rounded-2xl space-y-6">
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={loginEmail}
                            autoComplete="email"
                            onChange={e => setLoginEmail(e.target.value)} 
                            className="w-full bg-black/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent focus:border-blue-500 transition"
                        />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={loginPassword} 
                            autoComplete="current-password"
                            onChange={e => setLoginPassword(e.target.value)} 
                            className="w-full bg-black/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent focus:border-blue-500 transition" 
                        />
                        {error && <p className="text-red-400 text-center text-sm">{error}</p>}
                        <div className="space-y-4">
                            <GlowingButton type="submit" disabled={isLoading || lockoutTime > 0} Icon={LogIn}>
                                {isLoading ? 'Logging In...' : lockoutTime > 0 ? `Try again in ${lockoutTime}s` : 'Login'}
                            </GlowingButton>
                            <GlowingButton type="button" onClick={() => { setView('signup'); setError(''); }} Icon={UserPlus}>
                                Create an Account
                            </GlowingButton>
                        </div>
                        <div className="text-center text-sm">
                            <button type="button" onClick={() => setIsForgotModalOpen(true)} className="text-gray-400 hover:text-white transition">
                                Forgot Password?
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleSignup} className="bg-black/30 border border-purple-500/20 p-8 rounded-2xl space-y-4">
                         <input 
                            type="text" 
                            placeholder="Full Name" 
                            value={signupName}
                            autoComplete="name"
                            onChange={e => setSignupName(e.target.value)} 
                            className="w-full bg-black/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 border border-transparent focus:border-purple-500 transition"
                        />
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={signupEmail}
                            autoComplete="email"
                            onChange={e => setSignupEmail(e.target.value)} 
                            className="w-full bg-black/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 border border-transparent focus:border-purple-500 transition"
                        />
                        <input 
                            type="password" 
                            placeholder="Password (min 6 characters)" 
                            value={signupPassword} 
                            autoComplete="new-password"
                            onChange={e => setSignupPassword(e.target.value)} 
                            className="w-full bg-black/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 border border-transparent focus:border-purple-500 transition" 
                        />
                         <input 
                            type="password" 
                            placeholder="Confirm Password" 
                            value={signupConfirmPassword} 
                            autoComplete="new-password"
                            onChange={e => setSignupConfirmPassword(e.target.value)} 
                            className="w-full bg-black/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 border border-transparent focus:border-purple-500 transition" 
                        />
                        {error && <p className="text-red-400 text-center text-sm">{error}</p>}
                        <div className="space-y-4 pt-4">
                            <GlowingButton type="submit" disabled={isLoading} Icon={UserPlus}>
                                {isLoading ? 'Creating Account...' : 'Sign Up'}
                            </GlowingButton>
                             <GlowingButton type="button" onClick={() => { setView('login'); setError(''); }} Icon={LogIn}>
                                Already have an account? Login
                            </GlowingButton>
                        </div>
                    </form>
                )}

                <div className="text-center mt-6">
                    <p className="font-orbitron text-lg font-bold text-gray-200 uppercase" style={{
                        color: '#e0e0e0',
                        textShadow: `
                            1px 1px 1px #000,
                            2px 2px 1px #000,
                            1px 1px 2px var(--glow-2),
                            -1px -1px 2px var(--glow-1)
                        `,
                        letterSpacing: '0.1em'
                    }}>
                        CipherCore Labs
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;