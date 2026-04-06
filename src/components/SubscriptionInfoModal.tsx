import React, { useEffect } from 'react';
import { X, Check, ArrowRight, CalendarDays, Clock3, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CTAButton } from './CTAButton';
import { planDetails } from '../data/subscriptionDetails';

export interface SubscriptionInfoModalProps {
    planId: string;
    name: string;
    price: number;
    discountPrice: number | null;
    category: string;
    isOpen: boolean;
    onClose: () => void;
    onSelect: () => void;
}

export const SubscriptionInfoModal: React.FC<SubscriptionInfoModalProps> = ({
    planId, name, price, discountPrice, category, isOpen, onClose, onSelect
}) => {
    const { t } = useTranslation();

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEsc);
        }
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const details = planDetails[planId];
    if (!details) return null;

    const finalPrice = discountPrice ?? price;
    const savings = discountPrice ? price - discountPrice : 0;
    const formatPrice = (value: number) => new Intl.NumberFormat('ro-RO').format(value);
    const sectionDividerClassName = 'border-t border-slate-200/80 dark:border-white/10 pt-6';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6">
            <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity" onClick={onClose} />
            
            <div
                className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[30px] border border-white/10 bg-white shadow-[0_30px_90px_rgba(2,8,23,0.36)] transition-all dark:bg-slate-900"
                onClick={(event) => event.stopPropagation()}
            >
                {/* Header Image */}
                <div className="relative h-56 w-full shrink-0 sm:h-64">
                    <img
                        src={details.image}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/5" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/35 via-transparent to-cyan-400/10" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.35),transparent_34%)]" />
                    <button
                        type="button"
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            onClose();
                        }}
                        aria-label="Închide detaliile abonamentului"
                        className="absolute right-4 top-4 z-30 rounded-full border border-white/20 bg-black/30 p-2 text-white backdrop-blur-xl transition-all hover:scale-105 hover:bg-black/50 sm:right-5 sm:top-5"
                    >
                        <X size={18} />
                    </button>
                    <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8">
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85 backdrop-blur-xl">
                                {category}
                            </div>
                            {savings > 0 && (
                                <div className="inline-flex items-center rounded-full border border-cyan-300/25 bg-cyan-400/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100 backdrop-blur-xl">
                                    Economisești {formatPrice(savings)} MDL
                                </div>
                            )}
                        </div>

                        <div className="max-w-xl">
                            <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">{name}</h2>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80 sm:text-[15px]">
                                {details.summary}
                            </p>
                        </div>

                        <div className="mt-5 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
                                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
                                    <CalendarDays size={14} />
                                    <span>Valabilitate</span>
                                </div>
                                <p className="mt-2 text-base font-semibold text-white sm:text-lg">{details.validity}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
                                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
                                    <Clock3 size={14} />
                                    <span>Durata unei ședințe</span>
                                </div>
                                <p className="mt-2 text-base font-semibold text-white sm:text-lg">{details.sessionLength}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Body - Scrollable */}
                <div className="custom-scrollbar flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(248,250,252,0.98)_0%,rgba(255,255,255,1)_28%,rgba(248,250,252,0.98)_100%)] p-6 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92)_0%,rgba(15,23,42,1)_24%,rgba(2,6,23,0.96)_100%)] sm:p-8">
                    {/* Price section */}
                    <div className="rounded-[26px] border border-slate-200/80 bg-slate-950 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.2)] dark:border-white/10 sm:p-6">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-400">
                                    Tarif final
                                </p>
                                <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-2">
                                    <div className="flex items-end gap-2 text-white">
                                        <span className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                                            {formatPrice(finalPrice)}
                                        </span>
                                        <span className="mb-1 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                                            MDL
                                        </span>
                                    </div>
                                    {discountPrice && (
                                        <span className="mb-1 text-base font-medium text-slate-500 line-through">
                                            {formatPrice(price)} MDL
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-cyan-400/15 bg-white/5 px-4 py-3 backdrop-blur-xl">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                                    Ce câștigi
                                </p>
                                <p className="mt-1 text-sm font-semibold text-cyan-300">
                                    {savings > 0 ? `Economisești ${formatPrice(savings)} MDL față de prețul integral` : 'Preț clar, fără costuri ascunse'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Checkmarks / Text */}
                    {details.text && details.text.length > 0 && (
                        <div className="pt-6">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Ce este inclus în acest plan</h4>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Toate elementele esențiale pe care le primești din prima zi.</p>
                            <ul className="mt-4 space-y-2.5">
                                {details.text.map((tText, idx) => (
                                    <li key={idx} className="flex items-start rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                                        <Check size={16} className="mr-3 mt-0.5 shrink-0 text-cyan-500" />
                                        <span>{tText}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Program Schedule */}
                    {details.program && details.program.length > 0 && (
                        <div className={sectionDividerClassName}>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Când poți veni la antrenament</h4>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Alegi intervalul potrivit în funcție de disponibilitate.</p>
                            <ul className="mt-4 space-y-2.5">
                                {details.program.map((p, idx) => (
                                    <li key={idx} className="flex items-start rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                                        <div className="mr-3 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                                        <span>{p}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Benefits */}
                    {details.benefits && details.benefits.length > 0 && (
                        <div className={sectionDividerClassName}>
                            <div className="rounded-[24px] border border-cyan-200/70 bg-gradient-to-br from-cyan-50 via-white to-sky-50 p-5 dark:border-cyan-400/15 dark:bg-[linear-gradient(135deg,rgba(34,211,238,0.12),rgba(15,23,42,0.3))]">
                                <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300">
                                    <Sparkles size={16} />
                                    <h4 className="text-sm font-semibold">Avantaje care fac diferența</h4>
                                </div>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Beneficii suplimentare care ridică experiența peste un abonament standard.</p>
                                <ul className="mt-4 space-y-2">
                                    {details.benefits.map((b, idx) => (
                                        <li key={idx} className="flex items-start text-sm font-semibold text-slate-700 dark:text-slate-100">
                                            <Check size={14} className="mr-3 mt-0.5 shrink-0 text-cyan-500" />
                                            <span>{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Extra / Notes */}
                    {details.extra && details.extra.length > 0 && (
                        <div className={sectionDividerClassName}>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Detalii utile înainte de înscriere</h4>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Aspecte practice care te ajută să alegi mai repede.</p>
                            <ul className="mt-4 space-y-2.5">
                                {details.extra.map((e, idx) => (
                                    <li key={idx} className="flex items-start rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-sm font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                                        <span className="mr-3 mt-0.5 shrink-0 text-slate-400">•</span>
                                        <span>{e}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Footer CTA */}
                <div className="shrink-0 border-t border-slate-200/80 bg-white/90 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90 sm:p-6">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-x-12 -bottom-3 h-12 rounded-full bg-cyan-400/30 blur-2xl" />
                        <CTAButton
                            onClick={() => { onClose(); onSelect(); }}
                            className="group relative w-full overflow-hidden border border-cyan-200/50 bg-[linear-gradient(135deg,#0284c7_0%,#06b6d4_50%,#38bdf8_100%)] shadow-[0_16px_34px_rgba(14,165,233,0.32)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(14,165,233,0.42)]"
                        >
                            <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_44%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <span className="relative flex items-center justify-center gap-2">
                                <span>{t('landing.subscriptions.add_to_cart', { defaultValue: 'Alege planul' })}</span>
                                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                        </CTAButton>
                    </div>
                </div>
            </div>
        </div>
    );
};
