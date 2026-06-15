import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, KeyRound, Waves, ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';
import { passwordService } from '../services/api';

export const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();

    const [step, setStep]         = useState<'request' | 'reset'>('request');
    const [email, setEmail]       = useState('');
    const [token, setToken]       = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm]   = useState('');
    const [info, setInfo]         = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);

    const requestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setInfo(''); setLoading(true);
        try {
            const res = await passwordService.forgot(email.trim());
            // In development the backend returns the token directly so the flow is testable.
            if (res.token) {
                setToken(res.token);
                setInfo('Cod de resetare generat (mod dezvoltare) — completat automat mai jos.');
            } else {
                setInfo('Dacă adresa există, vei primi un cod de resetare pe email.');
            }
            setStep('reset');
        } catch {
            setError('A apărut o eroare. Verifică serverul și încearcă din nou.');
        } finally {
            setLoading(false);
        }
    };

    const doReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setInfo('');
        if (password.length < 6) { setError('Parola trebuie să aibă cel puțin 6 caractere.'); return; }
        if (password !== confirm) { setError('Parolele nu coincid.'); return; }
        setLoading(true);
        try {
            const res = await passwordService.reset(token.trim(), password);
            if (res.isSuccess) {
                setInfo('Parola a fost resetată! Te poți autentifica acum.');
                setTimeout(() => navigate('/login'), 1500);
            } else {
                setError(res.message || 'Token invalid sau expirat.');
            }
        } catch (err: any) {
            setError(err?.response?.data?.message ?? 'Token invalid sau expirat.');
        } finally {
            setLoading(false);
        }
    };

    const inputCls = "w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-blue-300/40 outline-none focus:border-host-cyan focus:ring-1 focus:ring-host-cyan/50 transition-all";

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-host-gradient animate-gradient-x font-sans">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
                <div className="absolute bottom-[-20%] left-[30%] w-[40%] h-[40%] bg-host-blue/40 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-md w-full relative z-10 px-6 py-8">
                <div className="text-center mb-8">
                    <div className="mb-4 flex justify-center">
                        <div className="relative animate-float">
                            <KeyRound className="w-16 h-16 text-host-cyan drop-shadow-2xl" />
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2 drop-shadow-lg">
                        Resetare parolă
                    </h1>
                    <p className="text-blue-100/80">
                        {step === 'request'
                            ? 'Introdu adresa de email pentru a primi un cod de resetare.'
                            : 'Introdu codul primit și noua parolă.'}
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                    {step === 'request' ? (
                        <form onSubmit={requestReset} className="space-y-5">
                            <div className="relative group">
                                <div className="absolute left-4 top-3.5 text-blue-300"><Mail size={20} /></div>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="Email" required autoComplete="username" className={inputCls} />
                            </div>
                            {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">{error}</p>}
                            <button type="submit" disabled={loading}
                                style={{ borderRadius: '9999px' }}
                                className={clsx("btn-pill w-full py-4 text-lg font-bold uppercase tracking-wider text-white shadow-xl transition-all bg-gradient-to-r from-host-cyan to-blue-600 hover:scale-[1.02]", loading && "opacity-80 cursor-wait")}>
                                {loading ? <span className="flex items-center justify-center"><Waves className="animate-spin mr-2" /> Se trimite…</span> : 'Trimite codul'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={doReset} className="space-y-5">
                            {info && <p className="text-host-cyan text-sm bg-host-cyan/10 border border-host-cyan/30 rounded-lg px-4 py-2">{info}</p>}
                            <div className="relative group">
                                <div className="absolute left-4 top-3.5 text-blue-300"><KeyRound size={20} /></div>
                                <input type="text" value={token} onChange={e => setToken(e.target.value)}
                                    placeholder="Cod de resetare" required className={inputCls} />
                            </div>
                            <div className="relative group">
                                <div className="absolute left-4 top-3.5 text-blue-300"><Lock size={20} /></div>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder="Parolă nouă" required autoComplete="new-password" className={inputCls} />
                            </div>
                            <div className="relative group">
                                <div className="absolute left-4 top-3.5 text-blue-300"><Lock size={20} /></div>
                                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                                    placeholder="Confirmă parola" required autoComplete="new-password" className={inputCls} />
                            </div>
                            {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">{error}</p>}
                            <button type="submit" disabled={loading}
                                style={{ borderRadius: '9999px' }}
                                className={clsx("btn-pill w-full py-4 text-lg font-bold uppercase tracking-wider text-white shadow-xl transition-all bg-gradient-to-r from-host-cyan to-blue-600 hover:scale-[1.02]", loading && "opacity-80 cursor-wait")}>
                                {loading ? <span className="flex items-center justify-center"><Waves className="animate-spin mr-2" /> Se resetează…</span> : 'Resetează parola'}
                            </button>
                        </form>
                    )}

                    <Link to="/login" className="mt-6 flex items-center justify-center gap-2 text-blue-200/70 hover:text-host-cyan transition-colors text-sm">
                        <ArrowLeft size={16} /> Înapoi la autentificare
                    </Link>
                </div>
            </div>
        </div>
    );
};
