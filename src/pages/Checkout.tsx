import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
    CreditCard, Lock, CheckCircle, ArrowLeft,
    User, Mail, Phone, Calendar, ShieldCheck
} from 'lucide-react';

/* ─── Formatare număr card ─── */
function formatCardNumber(value: string) {
    return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
}

/* ─── Detectare brand card ─── */
function detectBrand(number: string): string {
    const n = number.replace(/\s/g, '');
    if (/^4/.test(n)) return 'VISA';
    if (/^5[1-5]/.test(n)) return 'Mastercard';
    if (/^3[47]/.test(n)) return 'Amex';
    return '';
}

/* ─── Memoized Field wrapper — skips re-render if props unchanged ─── */
const Field = React.memo(function Field({
    label, icon, error, children, className = ''
}: { label: string; icon: React.ReactNode; error?: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={className}>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-blue-200/70 uppercase tracking-wide mb-1.5">
                <span className="text-[#00c6ff]">{icon}</span>{label}
            </label>
            {children}
            {error && <p className="text-red-400 text-[11px] mt-1">{error}</p>}
        </div>
    );
});

function inputCls(hasError: boolean) {
    return [
        'w-full px-4 py-2.5 rounded-xl text-sm bg-white/5 border',
        'text-white placeholder-white/30',
        'focus:outline-none focus:ring-2 focus:ring-[#00c6ff]/50 transition-all duration-200',
        hasError
            ? 'border-red-400 focus:ring-red-400/40'
            : 'border-white/10 focus:border-[#00c6ff]',
    ].join(' ');
}

export const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { items, totalPrice, clearCart } = useCart();

    /* ─── UNCONTROLLED refs for personal data (no live preview needed) ─── */
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);

    /* ─── CONTROLLED state only for card fields (live preview required) ─── */
    const [cardForm, setCardForm] = useState({
        cardNumber: '', cardHolder: '', expiry: '', cvv: '',
    });
    const [errors, setErrors] = useState<Record<string, string | undefined>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [flipped, setFlipped] = useState(false);
    /* Keep email in state only for success screen display */
    const [submittedEmail, setSubmittedEmail] = useState('');

    const brand = detectBrand(cardForm.cardNumber);

    /* dacă coșul e gol, redirect la coș */
    if (items.length === 0 && !isSuccess) {
        return (
            <div className="-mt-24 min-h-screen pt-24 relative overflow-hidden bg-host-gradient animate-gradient-x flex flex-col items-center justify-center gap-4">
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob" />
                    <div className="absolute top-[20%] right-[-20%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000" />
                </div>
                <p className="relative z-10 text-blue-100/80 text-lg">Coșul este gol.</p>
                <button
                    onClick={() => navigate('/courses')}
                    className="relative z-10 px-6 py-3 bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white font-bold rounded-full"
                >
                    Vezi Abonamente
                </button>
            </div>
        );
    }

    /* Validare — reads refs for personal fields, state for card fields */
    function validate() {
        const e: Record<string, string | undefined> = {};
        const name = nameRef.current?.value || '';
        const email = emailRef.current?.value || '';
        const phone = phoneRef.current?.value || '';

        if (!name.trim()) e.name = 'Câmp obligatoriu';
        if (!email.includes('@')) e.email = 'Email invalid';
        if (phone.replace(/\D/g, '').length < 9) e.phone = 'Număr invalid';
        if (cardForm.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Număr card incomplet';
        if (!cardForm.cardHolder.trim()) e.cardHolder = 'Câmp obligatoriu';
        if (cardForm.expiry.length < 5) e.expiry = 'Dată invalidă';
        if (cardForm.cvv.length < 3) e.cvv = 'CVV invalid';
        return e;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setSubmittedEmail(emailRef.current?.value || '');
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 2200)); // simulare procesare
        setIsLoading(false);
        setIsSuccess(true);
        clearCart();
    }

    /* ─── Card field handler — useCallback avoids new function each render ─── */
    const handleCardChange = useCallback((field: keyof typeof cardForm, raw: string) => {
        let value = raw;
        if (field === 'cardNumber') value = formatCardNumber(raw);
        if (field === 'expiry') value = formatExpiry(raw);
        if (field === 'cvv') value = raw.replace(/\D/g, '').slice(0, 4);
        setCardForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
    }, []);

    /* ─── Personal field blur handler — clears validation error on blur ─── */
    const handlePersonalBlur = useCallback((field: string) => {
        setErrors(prev => ({ ...prev, [field]: undefined }));
    }, []);

    /* ─── SUCCESS SCREEN ─── */
    if (isSuccess) {
        return (
            <div className="-mt-24 min-h-screen pt-24 relative overflow-hidden bg-host-gradient animate-gradient-x flex items-center justify-center px-4">
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob" />
                    <div className="absolute top-[20%] right-[-20%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000" />
                    <div className="absolute bottom-[-20%] left-[30%] w-[40%] h-[40%] bg-host-blue/40 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000" />
                </div>
                <div className="relative z-10 text-center max-w-md animate-in zoom-in duration-500">
                    <div className="w-24 h-24 rounded-full bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-14 h-14 text-emerald-400 animate-in zoom-in duration-700" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white mb-3">Plată reușită! 🎉</h1>
                    <p className="text-blue-100/70 mb-2">
                        Abonamentul tău a fost activat cu succes.
                    </p>
                    <p className="text-sm text-blue-200/50 mb-8">
                        Un email de confirmare a fost trimis la <span className="text-host-cyan font-medium">{submittedEmail}</span>
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white font-bold rounded-full hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.02]"
                    >
                        Mergi la Pagina Principală
                    </button>
                </div>
            </div>
        );
    }

    /* ─── CHECKOUT FORM ─── */
    return (
        <div className="-mt-24 min-h-screen relative overflow-hidden bg-host-gradient animate-gradient-x pt-24 pb-16 px-4">
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob" />
                <div className="absolute top-[20%] right-[-20%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-20%] left-[30%] w-[40%] h-[40%] bg-host-blue/40 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000" />
            </div>
            <div className="container mx-auto max-w-5xl relative z-10">

                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => navigate('/cart')}
                        className="p-2 rounded-full bg-white/10 border border-white/15 text-white/70 hover:text-[#00c6ff] hover:bg-white/15 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
                            <CreditCard className="text-[#00c6ff]" size={28} />
                            Finalizare Comandă
                        </h1>
                        <p className="text-blue-200/60 text-sm mt-0.5 flex items-center gap-1">
                            <Lock size={13} className="text-emerald-400" /> Plată securizată și criptată
                        </p>
                    </div>
                </div>

                {/* Progress stepper */}
                <div className="flex items-center gap-2 mb-5 text-xs font-semibold">
                    {['Coș', 'Date personale', 'Plată', 'Confirmare'].map((step, i) => (
                        <React.Fragment key={step}>
                            <span className={i === 2
                                ? 'text-host-cyan border-b border-host-cyan pb-0.5'
                                : i < 2 ? 'text-blue-200/40 line-through' : 'text-blue-200/30'
                            }>
                                {step}
                            </span>
                            {i < 3 && <span className="text-white/20 text-[10px]">›</span>}
                        </React.Fragment>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* ─── FORMULAR ─── */}
                    <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">

                        {/* Date personale — UNCONTROLLED (useRef + onBlur) */}
                        <div className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-5">
                            <h2 className="font-bold text-white text-lg mb-3 flex items-center gap-2">
                                <User size={18} className="text-[#00c6ff]" /> Date Personale
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Field label="Nume complet" icon={<User size={15} />} error={errors.name}>
                                    <input
                                        ref={nameRef}
                                        type="text"
                                        placeholder="Ion Popescu"
                                        defaultValue=""
                                        onBlur={() => handlePersonalBlur('name')}
                                        className={inputCls(!!errors.name)}
                                    />
                                </Field>
                                <Field label="Email" icon={<Mail size={15} />} error={errors.email}>
                                    <input
                                        ref={emailRef}
                                        type="email"
                                        placeholder="ion@email.com"
                                        defaultValue=""
                                        onBlur={() => handlePersonalBlur('email')}
                                        className={inputCls(!!errors.email)}
                                    />
                                </Field>
                                <Field label="Telefon" icon={<Phone size={15} />} error={errors.phone} className="sm:col-span-2">
                                    <input
                                        ref={phoneRef}
                                        type="tel"
                                        placeholder="+373 60 000 000"
                                        defaultValue=""
                                        onBlur={() => handlePersonalBlur('phone')}
                                        className={inputCls(!!errors.phone)}
                                    />
                                </Field>
                            </div>
                        </div>

                        {/* Date card — CONTROLLED (live preview required) */}
                        <div className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                                <h2 className="font-bold text-white text-lg flex items-center gap-2">
                                    <CreditCard size={18} className="text-[#00c6ff]" /> Date Card Bancar
                                </h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] text-blue-200/40 mr-1">Acceptăm:</span>
                                    {['Visa', 'Mastercard', 'Apple Pay'].map(m => (
                                        <span key={m} className="px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-semibold text-blue-100/60 uppercase tracking-wide">{m}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Card preview */}
                            <div
                                className="relative h-36 rounded-2xl mb-4 overflow-hidden cursor-pointer select-none"
                                style={{ perspective: '1000px' }}
                                onClick={() => setFlipped(f => !f)}
                            >
                                <div
                                    className="absolute inset-0 transition-all duration-700"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                    }}
                                >
                                    {/* Față */}
                                    <div
                                        className="absolute inset-0 rounded-2xl p-5 flex flex-col justify-between"
                                        style={{
                                            background: 'linear-gradient(135deg, #020024 0%, #090979 50%, #00d4ff 100%)',
                                            backfaceVisibility: 'hidden',
                                        }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="w-9 h-6 rounded bg-yellow-400/80 flex items-center justify-center text-[8px] font-bold text-gray-900">CHIP</div>
                                            <span className="text-white font-bold text-base tracking-widest opacity-80">{brand || 'CARD'}</span>
                                        </div>
                                        <div>
                                            <p className="text-white font-mono text-lg tracking-[0.25em] mb-1">
                                                {cardForm.cardNumber || '•••• •••• •••• ••••'}
                                            </p>
                                            <div className="flex justify-between text-white/70 text-xs">
                                                <span>{cardForm.cardHolder || 'TITULCARDULUI'}</span>
                                                <span>{cardForm.expiry || 'MM/YY'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Spate */}
                                    <div
                                        className="absolute inset-0 rounded-2xl overflow-hidden"
                                        style={{
                                            background: 'linear-gradient(135deg, #090979 0%, #020024 100%)',
                                            backfaceVisibility: 'hidden',
                                            transform: 'rotateY(180deg)',
                                        }}
                                    >
                                        <div className="h-8 bg-black/40 mt-4" />
                                        <div className="px-5 mt-3 flex items-center justify-end gap-3">
                                            <div className="flex-1 h-7 bg-white/20 rounded" />
                                            <div className="bg-white rounded px-3 py-1 font-mono font-bold text-gray-900 text-sm min-w-[50px] text-center">
                                                {cardForm.cvv || '•••'}
                                            </div>
                                        </div>
                                        <p className="text-white/40 text-[10px] text-center mt-2">Apasă cardul pentru a-l întoarce</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Field label="Număr card" icon={<CreditCard size={15} />} error={errors.cardNumber} className="sm:col-span-2">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="1234 5678 9012 3456"
                                        value={cardForm.cardNumber}
                                        onChange={e => handleCardChange('cardNumber', e.target.value)}
                                        className={inputCls(!!errors.cardNumber) + ' font-mono tracking-widest'}
                                    />
                                </Field>
                                <Field label="Titular card" icon={<User size={15} />} error={errors.cardHolder} className="sm:col-span-2">
                                    <input
                                        type="text"
                                        placeholder="ION POPESCU"
                                        value={cardForm.cardHolder}
                                        onChange={e => handleCardChange('cardHolder', e.target.value.toUpperCase())}
                                        className={inputCls(!!errors.cardHolder) + ' uppercase tracking-widest'}
                                    />
                                </Field>
                                <Field label="Dată expirare" icon={<Calendar size={15} />} error={errors.expiry}>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="MM/YY"
                                        value={cardForm.expiry}
                                        onChange={e => handleCardChange('expiry', e.target.value)}
                                        className={inputCls(!!errors.expiry) + ' font-mono'}
                                    />
                                </Field>
                                <Field label="CVV" icon={<ShieldCheck size={15} />} error={errors.cvv}>
                                    <input
                                        type="password"
                                        inputMode="numeric"
                                        placeholder="•••"
                                        value={cardForm.cvv}
                                        onFocus={() => setFlipped(true)}
                                        onBlur={() => setFlipped(false)}
                                        onChange={e => handleCardChange('cvv', e.target.value)}
                                        className={inputCls(!!errors.cvv) + ' font-mono tracking-widest'}
                                    />
                                </Field>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white font-extrabold rounded-2xl text-lg flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Se procesează plata...
                                </>
                            ) : (
                                <>
                                    <Lock size={20} />
                                    Plătește {totalPrice} MDL
                                </>
                            )}
                        </button>
                    </form>

                    {/* ─── SUMAR COMANDĂ ─── */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-5 sticky top-24">
                            <h2 className="font-bold text-white text-lg mb-3">Sumar Comandă</h2>
                            <div className="space-y-2.5 mb-3">
                                {items.map(item => {
                                    const price = item.discountPrice ?? item.price;
                                    return (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-blue-200/75 truncate flex-1 mr-2">
                                                {item.name} × {item.quantity}
                                            </span>
                                            <span className="font-semibold text-white/90 flex-shrink-0">
                                                {price * item.quantity} MDL
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="border-t border-white/10 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-200/70 font-medium">Total</span>
                                    <span className="text-2xl font-extrabold text-[#00c6ff]">{totalPrice} MDL</span>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-col gap-2 text-xs text-blue-200/65">
                                <div className="flex items-center gap-2"><Lock size={12} className="text-emerald-400" /> Plată 100% securizată</div>
                                <div className="flex items-center gap-2"><ShieldCheck size={12} className="text-emerald-400" /> Criptare SSL 256-bit</div>
                                <div className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-400" /> Confirmare imediată pe email</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
