import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { subscriptionPlans } from '../data/mockData';
import {
    ShoppingCart, Trash2, Plus, Minus, CreditCard, Tag,
    Calendar, CheckCircle, Lock, Waves, Users, Clock
} from 'lucide-react';
import { clsx } from 'clsx';

// Helper: find description from subscriptionPlans by matching plan id
const getPlanDetails = (itemId: string) =>
    subscriptionPlans.find((p) => p.id === itemId);

const CATEGORY_LABELS: Record<string, string> = {
    standard: 'Standard',
    pro: 'Pro',
    individual: 'Individual',
    transport: 'Cu Transport',
};

const CATEGORY_COLORS: Record<string, string> = {
    standard: 'bg-sky-500/15 text-sky-400 border-sky-400/30',
    pro: 'bg-violet-500/15 text-violet-400 border-violet-400/30',
    individual: 'bg-amber-500/15 text-amber-400 border-amber-400/30',
    transport: 'bg-emerald-500/15 text-emerald-400 border-emerald-400/30',
};

const HOW_IT_WORKS = [
    { step: '1', title: 'Alege un abonament', icon: ShoppingCart },
    { step: '2', title: 'Adaugă în coș', icon: Plus },
    { step: '3', title: 'Finalizează plata', icon: CreditCard },
];

export const CartPage: React.FC = () => {
    const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
    const navigate = useNavigate();

    // Calculate totals for summary
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalDiscount = items.reduce((sum, i) => {
        if (i.discountPrice && i.discountPrice < i.price) {
            return sum + (i.price - i.discountPrice) * i.quantity;
        }
        return sum;
    }, 0);

    return (
        <div className={clsx(
            'relative overflow-hidden bg-host-gradient animate-gradient-x',
            items.length === 0 ? '-mt-24 pt-24 pb-16' : '-mt-24 pt-24 min-h-screen pb-16'
        )}>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
                <div className="absolute top-[20%] right-[-20%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[30%] w-[40%] h-[40%] bg-host-blue/40 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10 mt-6">

                {items.length === 0 ? (
                    /* ═══════════ EMPTY CART STATE ═══════════ */
                    <div className="flex flex-col items-center text-center pt-8 pb-12">
                        {/* Empty cart icon + text + button */}
                        <div className="w-24 h-24 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-5 shadow-lg shadow-cyan-500/10">
                            <ShoppingCart size={42} className="text-white/40" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Coșul este gol</h2>
                        <p className="text-blue-200/60 mb-6 max-w-sm">
                            Nu ai adăugat încă niciun abonament.
                        </p>
                        <button
                            onClick={() => navigate('/courses')}
                            className="px-8 py-3.5 bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white font-bold rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
                        >
                            <ShoppingCart size={18} />
                            Vezi Abonamente
                        </button>

                        {/* How it works — directly below */}
                        <div className="w-full mt-10">
                            <h3 className="text-lg font-bold text-white mb-5">Cum funcționează</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {HOW_IT_WORKS.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={item.step}
                                            className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center hover:bg-white/12 transition-all duration-200"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-host-cyan/20 border border-host-cyan/30 flex items-center justify-center mx-auto mb-3">
                                                <Icon size={18} className="text-host-cyan" />
                                            </div>
                                            <span className="text-[10px] font-bold text-host-cyan uppercase tracking-wider">
                                                Pasul {item.step}
                                            </span>
                                            <p className="text-sm font-semibold text-white mt-1">{item.title}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ═══════════ CART WITH PRODUCTS ═══════════ */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                        {/* Items list */}
                        <div className="lg:col-span-7 space-y-5">
                            {items.map((item) => {
                                const plan = getPlanDetails(item.id);
                                const unitPrice = item.discountPrice ?? item.price;
                                const originalPrice = item.price;
                                const hasDiscount = item.discountPrice && item.discountPrice < item.price;
                                const savings = hasDiscount ? (originalPrice - (item.discountPrice as number)) * item.quantity : 0;

                                return (
                                    <div
                                        key={item.id}
                                        className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/12 transition-all duration-200"
                                    >
                                        {/* Top row: name + badge + delete */}
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-white text-lg leading-snug">
                                                        {item.name}
                                                    </h3>
                                                    {plan && (
                                                        <span className={clsx(
                                                            'text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border',
                                                            CATEGORY_COLORS[plan.category] ?? 'bg-gray-500/10 text-gray-400 border-gray-400/30'
                                                        )}>
                                                            {CATEGORY_LABELS[plan.category] ?? plan.category}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Plan details */}
                                                {plan && (
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-blue-200/60 mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <Waves size={11} /> {plan.sessions} ședințe
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={11} /> Durată: {plan.duration}
                                                        </span>
                                                        {hasDiscount && (
                                                            <span className="flex items-center gap-1 text-emerald-400 font-medium">
                                                                <Tag size={11} />
                                                                Preț redus
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Savings badge */}
                                                {hasDiscount && savings > 0 && (
                                                    <div className="mt-2">
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-1 rounded-full">
                                                            <CheckCircle size={12} />
                                                            Economisești {savings} MDL
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/15 rounded-full transition-colors flex-shrink-0"
                                                title="Șterge"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        {/* Bottom row: qty controls + price */}
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                                            {/* Quantity */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/15 flex items-center justify-center text-white/70 hover:bg-red-500/20 hover:border-red-400/40 hover:text-red-400 transition-all duration-150 font-bold"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-10 text-center font-bold text-white text-lg select-none">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, +1)}
                                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/15 flex items-center justify-center text-white/70 hover:bg-green-500/20 hover:border-green-400/40 hover:text-green-400 transition-all duration-150 font-bold"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                <p className="text-xl font-extrabold text-host-cyan">
                                                    {unitPrice * item.quantity} MDL
                                                </p>
                                                {hasDiscount && (
                                                    <p className="text-xs text-white/35 line-through mt-0.5">
                                                        {originalPrice * item.quantity} MDL
                                                    </p>
                                                )}
                                                <p className="text-[10px] text-blue-200/45 mt-0.5">
                                                    {unitPrice} MDL / buc
                                                </p>
                                            </div>
                                        </div>

                                        {/* Product benefits */}
                                        <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] text-blue-200/55">
                                            <span className="flex items-center gap-1"><Waves size={10} /> Acces la bazin olimpic</span>
                                            <span className="flex items-center gap-1"><Users size={10} /> Antrenori profesioniști</span>
                                            <span className="flex items-center gap-1"><Calendar size={10} /> Program flexibil</span>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Clear cart */}
                            <button
                                onClick={clearCart}
                                className="text-xs text-red-400/80 hover:text-red-400 flex items-center gap-1 transition-colors mt-1"
                            >
                                <Trash2 size={12} /> Golește coșul
                            </button>
                        </div>

                        {/* Order summary */}
                        <div className="lg:col-span-5 self-start">
                            <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sticky top-24">
                                <h2 className="font-bold text-white text-lg mb-4">Sumar Comandă</h2>

                                <div className="space-y-2 text-sm mb-4">
                                    {items.map((item) => {
                                        const unitPrice = item.discountPrice ?? item.price;
                                        return (
                                            <div key={item.id} className="flex justify-between text-blue-200/60">
                                                <span className="truncate flex-1 mr-2">{item.name} × {item.quantity}</span>
                                                <span className="font-medium text-white/90 flex-shrink-0">
                                                    {unitPrice * item.quantity} MDL
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Subtotal / Discount / Total breakdown */}
                                <div className="border-t border-white/10 pt-4 space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-blue-200/60">Subtotal</span>
                                        <span className="text-white/80 font-medium">{subtotal} MDL</span>
                                    </div>
                                    {totalDiscount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-emerald-400/80">Discount</span>
                                            <span className="text-emerald-400 font-medium">-{totalDiscount} MDL</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                                        <span className="text-blue-200/70 font-medium">Total</span>
                                        <span className="text-2xl font-extrabold text-host-cyan">{totalPrice} MDL</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full py-4 bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                                >
                                    <CreditCard size={18} />
                                    Finalizează Comanda
                                </button>

                                {/* Trust indicators */}
                                <div className="mt-4 space-y-3">
                                    <div className="flex items-center gap-2 text-[11px] text-blue-200/40">
                                        <Lock size={12} className="text-emerald-400/60" />
                                        <span>Plată securizată</span>
                                    </div>
                                    <div className="space-y-2 pl-5">
                                        <div className="text-[11px] text-blue-200/40">Acceptăm plăți</div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-semibold uppercase tracking-wide text-blue-100/65">
                                                Visa
                                            </span>
                                            <span className="px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-semibold uppercase tracking-wide text-blue-100/65">
                                                Mastercard
                                            </span>
                                            <span className="px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-semibold uppercase tracking-wide text-blue-100/65">
                                                Apple Pay
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pl-5 text-[11px] leading-relaxed text-blue-200/35">
                                        Datele tale sunt protejate prin checkout securizat SSL.
                                    </div>
                                    <div className="pl-5 text-[11px] leading-relaxed text-blue-200/35">
                                        Abonamentul se activează imediat după confirmarea plății.
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/courses')}
                                    className="w-full mt-4 py-2.5 text-sm text-blue-200/60 hover:text-host-cyan transition-colors font-medium"
                                >
                                    ← Continuă cumpărăturile
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
