import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, Waves, ChevronDown, ChevronUp } from 'lucide-react';

import type { UserRole } from '../types';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

const DEMO_ACCOUNTS: { role: UserRole; name: string; email: string; password: string }[] = [
    // Elevi
    { role: 'student', name: 'Andrei Popov', email: 'andrei.popov@student.md', password: 'elev1234' },
    { role: 'student', name: 'Elena Dumitru', email: 'elena.dumitru@student.md', password: 'elev1234' },
    { role: 'student', name: 'Mihai Voicu', email: 'mihai.voicu@student.md', password: 'elev1234' },
    // Antrenori
    { role: 'coach', name: 'Cătălina Moraru', email: 'catalina@atlantisswim.md', password: 'antrenor1234' },
    { role: 'coach', name: 'Cătălin Ciobanu', email: 'catalin@atlantisswim.md', password: 'antrenor1234' },
    { role: 'coach', name: 'Alexandru Rusu', email: 'alexandru@atlantisswim.md', password: 'antrenor1234' },
    // Administratori
    { role: 'admin', name: 'Super Admin', email: 'admin@school.com', password: 'admin1234' },
    { role: 'admin', name: 'Director Ionescu', email: 'director@school.com', password: 'admin1234' },
    { role: 'admin', name: 'Manager Stancu', email: 'manager@school.com', password: 'admin1234' },
];

const ROLE_COLORS: Record<UserRole, string> = {
    student: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
    coach: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    admin: 'bg-violet-500/20 text-violet-300 border-violet-400/30',
};

export const Login: React.FC = () => {
    const { login, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const redirectPath = location.state?.from?.pathname as string | undefined;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showDemo, setShowDemo] = useState(false);

    // Auto-redirect if already logged in
    React.useEffect(() => {
        if (isAuthenticated && user) {
            if (redirectPath) {
                navigate(redirectPath, { replace: true });
                return;
            }

            if (user.role === 'admin') navigate('/admin', { replace: true });
            else if (user.role === 'coach') navigate('/coach', { replace: true });
            else navigate('/student', { replace: true });
        }
    }, [isAuthenticated, user, navigate, redirectPath]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        setTimeout(() => {
            const ok = login(email.trim(), password);
            if (!ok) {
                setError('Email sau parolă incorectă. Verifică credențialele demo.');
                setIsLoading(false);
            }
            // on success the effect above redirects automatically
        }, 600);
    };

    const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
        setEmail(acc.email);
        setPassword(acc.password);
        setError('');
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-host-gradient animate-gradient-x font-sans selection:bg-host-cyan selection:text-white">

            {/* --- FLUID BACKGROUND EFFECTS --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
                <div className="absolute top-[20%] right-[-20%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[30%] w-[40%] h-[40%] bg-host-blue/40 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <div className="max-w-md w-full relative z-10 px-6 py-8">

                {/* --- HEADER --- */}
                <div className="text-center mb-10">
                    <div className="mb-6 flex justify-center relative">
                        <div className="absolute inset-0 bg-host-cyan/40 blur-2xl rounded-full transform scale-150 animate-pulse"></div>
                        <div className="relative animate-float">
                            <img src="https://atlantisswim.md/wp-content/uploads/2025/08/cropped-asat-03-scaled-1-e1755890850322.png" alt="Atlantis SwimSchool" className="w-28 h-28 object-contain drop-shadow-2xl" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3 drop-shadow-lg animate-in slide-in-from-bottom-5 fade-in duration-700">
                        {t('login.welcome_back')}
                    </h1>
                    <p className="text-blue-100/80 text-lg font-light animate-in slide-in-from-bottom-5 fade-in duration-700 delay-100">
                        {t('login.sign_in_to')} <span className="font-semibold text-host-cyan">SwimSchool</span> dashboard
                    </p>
                </div>

                {/* --- GLASS CARD --- */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 transition-all duration-500 hover:shadow-cyan-500/20 hover:border-white/30 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-200">
                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* EMAIL */}
                        <div className="relative group">
                            <div className="absolute left-4 top-3.5 text-blue-300 group-hover:text-host-cyan transition-colors duration-300">
                                <Mail size={20} />
                            </div>
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('login.email_placeholder')}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-blue-300/40 outline-none focus:border-host-cyan focus:ring-1 focus:ring-host-cyan/50 transition-all duration-300 group-hover:bg-black/30"
                                required
                                autoComplete="username"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="relative group">
                            <div className="absolute left-4 top-3.5 text-blue-300 group-hover:text-host-cyan transition-colors duration-300">
                                <Lock size={20} />
                            </div>
                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('login.password_placeholder')}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-blue-300/40 outline-none focus:border-host-cyan focus:ring-1 focus:ring-host-cyan/50 transition-all duration-300 group-hover:bg-black/30"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        {/* ERROR */}
                        {error && (
                            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 animate-in fade-in duration-300">
                                {error}
                            </p>
                        )}

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{ borderRadius: '9999px' }}
                            className={clsx(
                                "btn-pill w-full py-4 text-lg font-bold uppercase tracking-wider text-white shadow-xl transition-all duration-300 transform relative overflow-hidden group",
                                "bg-gradient-to-r from-host-cyan to-blue-600 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98]",
                                isLoading && "opacity-80 cursor-wait"
                            )}
                        >
                            <span className={clsx("relative z-10 flex items-center justify-center space-x-2", isLoading && "animate-pulse")}>
                                {isLoading ? (
                                    <><Waves className="animate-spin mr-2" /> {t('login.signing_in')}</>
                                ) : (
                                    <span>{t('login.sign_in_button')}</span>
                                )}
                            </span>
                            <div className="absolute top-0 -left-full w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent group-hover:left-full transition-all duration-700 ease-in-out"></div>
                        </button>
                    </form>

                    {/* DEMO ACCOUNTS PANEL */}
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={() => setShowDemo((v) => !v)}
                            className="w-full flex items-center justify-between text-xs text-blue-200/60 hover:text-host-cyan transition-colors px-1 py-1"
                        >
                            <span className="uppercase tracking-widest font-medium">Conturi Demo</span>
                            {showDemo ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>

                        {showDemo && (
                            <div className="mt-3 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                                {(['student', 'coach', 'admin'] as UserRole[]).map((role) => (
                                    <div key={role}>
                                        <p className="text-[10px] uppercase tracking-widest text-blue-200/40 mb-1 mt-2 px-1">
                                            {role === 'student' ? 'Elevi' : role === 'coach' ? 'Antrenori' : 'Administratori'}
                                        </p>
                                        {DEMO_ACCOUNTS.filter((a) => a.role === role).map((acc) => (
                                            <button
                                                key={acc.email}
                                                type="button"
                                                onClick={() => fillDemo(acc)}
                                                className={clsx(
                                                    "w-full text-left px-3 py-2 rounded-lg border text-xs mb-1 transition-all duration-200 hover:brightness-125 hover:scale-[1.01] active:scale-[0.99]",
                                                    ROLE_COLORS[role]
                                                )}
                                            >
                                                <span className="font-semibold block">{acc.name}</span>
                                                <span className="opacity-70">{acc.email}</span>
                                                <span className="float-right opacity-50 font-mono">{acc.password}</span>
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-4 text-center">
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
