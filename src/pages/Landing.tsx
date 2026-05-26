import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Hero } from '../components/Hero';
import { CTAButton } from '../components/CTAButton';
import { subscriptionPlans, mockCoaches } from '../data/mockData';
import { Users, GraduationCap, Trophy, Mail, Star, Twitter, Linkedin } from 'lucide-react';
import { SubscriptionInfoModal } from '../components/SubscriptionInfoModal';

/** Hook: observes elements with class "scroll-reveal" and adds "revealed" when visible */
function useScrollReveal() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );

        const elements = container.querySelectorAll('.scroll-reveal');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return containerRef;
}

export const Landing: React.FC = () => {
    const { t } = useTranslation();
    const revealRef = useScrollReveal();
    const navigate = useNavigate();

    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const selectedPlan = subscriptionPlans.find(p => p.id === selectedPlanId);

    const services = [
        { title: t('landing.services.expert_coaches.title'), desc: t('landing.services.expert_coaches.desc'), icon: Trophy },
        { title: t('landing.services.active_students.title'), desc: t('landing.services.active_students.desc'), icon: Users },
        { title: t('landing.services.diverse_courses.title'), desc: t('landing.services.diverse_courses.desc'), icon: GraduationCap },
    ];

    return (
        <div ref={revealRef} className="animate-in fade-in duration-500">
            {/* Hero Section */}
            <Hero />

            {/* Services / Why Choose Section */}
            <div className="py-20">
                <div className="container mx-auto px-6">
                    <div className="scroll-reveal reveal-up text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 uppercase tracking-wide">
                            <span className="text-host-cyan">{t('landing.why_choose.title')}</span>
                        </h2>
                        <p className="text-gray-500 dark:text-slate-400 max-w-xl mx-auto">
                            {t('landing.why_choose.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {services.map((service, idx) => (
                            <div
                                key={idx}
                                className={`scroll-reveal reveal-up stagger-${idx + 1} bg-white dark:bg-[#1a2840] p-8 rounded-xl shadow-lg text-center hover:-translate-y-2 transition-transform duration-300 border border-gray-100 dark:border-slate-700/50`}
                            >
                                <div className="mx-auto w-20 h-20 bg-brand-gradient rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-200/50 dark:shadow-none">
                                    <service.icon className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{service.title}</h3>
                                <p className="text-gray-500 dark:text-slate-400 mb-6 leading-relaxed">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Subscription Plans Section */}
            <div className="py-20">
                <div className="container mx-auto px-6">
                    <div className="scroll-reveal reveal-up text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 uppercase tracking-wide">
                            <span className="text-host-cyan">{t('landing.subscriptions.title')}</span>
                        </h2>
                        <p className="text-gray-500 dark:text-slate-400">{t('landing.subscriptions.subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {subscriptionPlans.map((plan, idx) => {
                            const discount = plan.discountPrice ? plan.price - plan.discountPrice : null;
                            const categoryConfig: Record<string, { label: string; icon: string; color: string }> = {
                                standard: { label: t('landing.subscriptions.standard'), icon: '◎', color: 'bg-host-cyan/20 text-host-cyan border-host-cyan/30' },
                                pro: { label: t('landing.subscriptions.pro'), icon: '★', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
                                individual: { label: t('landing.subscriptions.individual'), icon: '✦', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
                                transport: { label: t('landing.subscriptions.transport'), icon: '🚐', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
                            };
                            const cat = categoryConfig[plan.category] || categoryConfig.standard;

                            return (
                                <div key={plan.id} className={`scroll-reveal reveal-up stagger-${Math.min(idx + 1, 6)}`}>
                                    <div
                                        onClick={() => setSelectedPlanId(plan.id)}
                                        className="relative cursor-pointer bg-gray-50 dark:bg-[#1a2840] rounded-2xl border border-gray-200 dark:border-slate-700/50 p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:border-host-cyan/50 overflow-hidden h-full flex flex-col"
                                    >
                                        {discount && (
                                            <div className="absolute top-4 right-4">
                                                <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                                                    -{discount} MDL
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex justify-start items-start mb-4">
                                            <div className="mb-0">
                                                <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${cat.color}`}>
                                                    <span>{cat.icon}</span>
                                                    <span>{cat.label}</span>
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 pr-16">{t(`landing.plans.${plan.id}.name`)}</h3>

                                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                                            <span>◷ {plan.sessions} {t('landing.subscriptions.sessions')}</span>
                                            <span className="text-gray-300 dark:text-gray-600">·</span>
                                            <span>{t(`landing.plans.${plan.id}.duration`)}</span>
                                        </div>

                                        <div className="mt-auto">
                                            <div className="flex items-baseline space-x-3 mb-5">
                                                {plan.discountPrice ? (
                                                    <>
                                                        <span className="text-3xl font-extrabold text-host-cyan">{plan.discountPrice}</span>
                                                        <span className="text-lg text-gray-400 line-through">{plan.price}</span>
                                                        <span className="text-sm text-gray-500 font-medium">MDL</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-3xl font-extrabold text-host-cyan">{plan.price}</span>
                                                        <span className="text-sm text-gray-500 font-medium">MDL</span>
                                                    </>
                                                )}
                                            </div>

                                            <CTAButton onClick={(event) => {
                                                event.stopPropagation();
                                                navigate('/login');
                                            }}>
                                                <span>{t('landing.subscriptions.add_to_cart')}</span>
                                            </CTAButton>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Team / Coaches Section */}
            <div className="py-20">
                <div className="container mx-auto px-6">
                    <div className="scroll-reveal reveal-up text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 uppercase tracking-wide">
                            <span className="text-host-cyan">{t('landing.team.title')}</span>
                        </h2>
                        <p className="text-gray-500 dark:text-slate-400 max-w-xl mx-auto">
                            {t('landing.team.subtitle')}
                        </p>
                    </div>

                    {/* Founder - Featured Card */}
                    <div className="scroll-reveal reveal-up mb-12">
                        <div className="bg-white dark:bg-[#1a2840] rounded-2xl shadow-2xl border-2 border-amber-400/50 dark:border-amber-500/40 overflow-hidden relative">
                            {/* Founder badge */}
                            <div className="absolute top-4 right-4 z-10">
                                <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs font-extrabold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
                                    ★ {t('landing.team.founder')}
                                </span>
                            </div>

                            <div className="flex flex-col md:flex-row">
                                {/* Photo */}
                                <div className="md:w-1/3 relative">
                                    <div className="h-72 md:h-full min-h-[320px]">
                                        <img
                                            src="https://atlantisswim.md/wp-content/uploads/elementor/thumbs/1755608837897778-scaled-rahn3krbfrp4f00rkuc5n12ya756oi93mcf2hn6wxs.jpg"
                                            alt="Varnic Alexandru"
                                            className="w-full h-full object-cover object-top"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 dark:to-gray-800/40 md:block hidden" />
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="md:w-2/3 p-8 md:p-10 flex flex-col justify-center">
                                    <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white mb-1">
                                        Varnic Alexandru
                                    </h3>
                                    <p className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-6">
                                        {t('landing.team.founder_role')}
                                    </p>
                                    <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                                        <p>
                                            {t('landing.team.founder_bio_1')}
                                        </p>
                                        <p>
                                            {t('landing.team.founder_bio_2')}
                                        </p>
                                    </div>

                                    {/* Social icons */}
                                    <div className="flex items-center space-x-3 mt-6">
                                        <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition-all duration-300">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.38 8.59 8.59 0 01-2.72 1.04 4.28 4.28 0 00-7.32 3.91A12.16 12.16 0 013.16 4.86a4.28 4.28 0 001.32 5.72 4.24 4.24 0 01-1.94-.54v.05a4.28 4.28 0 003.43 4.2 4.27 4.27 0 01-1.93.07 4.29 4.29 0 004 2.98A8.59 8.59 0 012 19.54a12.13 12.13 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56A8.72 8.72 0 0024 5.56a8.5 8.5 0 01-2.54.7z" /></svg>
                                        </button>
                                        <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition-all duration-300">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05a3.74 3.74 0 013.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77A1.77 1.77 0 000 1.77v20.46A1.77 1.77 0 001.77 24h20.46A1.77 1.77 0 0024 22.23V1.77A1.77 1.77 0 0022.23 0z" /></svg>
                                        </button>
                                        <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition-all duration-300">
                                            <Mail className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Video Banner */}
                    <div className="mb-16 rounded-2xl overflow-hidden shadow-2xl scroll-reveal reveal-up">
                        <video
                            src="https://atlantisswim.md/wp-content/uploads/2025/08/IMG_2742.mov"
                            className="w-full h-[300px] md:h-[500px] object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                            controls
                        />
                    </div>

                    {/* Rest of the team */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mockCoaches.map((coach, idx) => (
                            <div
                                key={coach.id}
                                className={`scroll-reveal reveal-up stagger-${Math.min(idx + 1, 6)} group relative h-[420px] rounded-2xl shadow-xl overflow-hidden cursor-pointer`}
                            >
                                {/* Layer 1: Background image — hidden by default, fades in on hover */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-105 group-hover:scale-100 transition-transform"
                                    style={{ backgroundImage: `url(${coach.avatar})`, backgroundPosition: coach.imagePosition || 'top' }}
                                />

                                {/* Layer 2: Dark gradient overlay — appears with image on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                                {/* Layer 3: Solid card background — visible by default, fades out on hover */}
                                <div className="absolute inset-0 bg-white dark:bg-[#1a2840] opacity-100 group-hover:opacity-0 transition-opacity duration-500 z-20" />

                                {/* Layer 4: Content — always on top */}
                                <div className="relative z-30 h-full p-6 flex flex-col items-center text-center">

                                    {/* Avatar — shrinks away on hover */}
                                    <div className="mt-6 mb-4 transform transition-all duration-500 group-hover:scale-0 group-hover:opacity-0 group-hover:h-0 group-hover:mt-0 group-hover:mb-0 origin-top">
                                        <div className="relative inline-block">
                                            <div className="absolute inset-0 bg-brand-gradient rounded-full blur-lg opacity-50" />
                                            <img
                                                src={coach.avatar}
                                                alt={coach.name}
                                                className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-xl relative z-10"
                                            />
                                            <div className="absolute bottom-1 right-1 z-20 bg-host-cyan text-white p-1.5 rounded-full border-2 border-white dark:border-slate-700 shadow-md">
                                                <Star className="w-4 h-4 fill-current" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text — slides to bottom on hover */}
                                    <div className="flex-1 flex flex-col justify-center group-hover:justify-end w-full transition-all duration-500">
                                        <h3 className="text-xl font-bold text-host-blue dark:text-white mb-1 group-hover:text-white group-hover:text-2xl transition-all duration-300">
                                            {coach.name}
                                        </h3>
                                        <p className="text-gray-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wider mb-2 group-hover:text-host-cyan transition-colors duration-300">
                                            {t(`coaches.${coach.id}.specialization`)}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 px-2 leading-relaxed italic group-hover:text-gray-200 transition-colors duration-300 line-clamp-4">
                                            "{coach.experienceYears} years of experience..."
                                        </p>
                                        <div className="flex justify-center space-x-3 border-t border-gray-100 dark:border-white/10 pt-4 group-hover:border-white/20 transition-colors duration-300">
                                            <button className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300 hover:text-white hover:bg-[#1DA1F2] group-hover:bg-white/10 group-hover:text-white transition-all duration-300">
                                                <Twitter size={18} />
                                            </button>
                                            <button className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300 hover:text-white hover:bg-[#0077b5] group-hover:bg-white/10 group-hover:text-white transition-all duration-300">
                                                <Linkedin size={18} />
                                            </button>
                                            <a href={`mailto:${coach.email}`} className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300 hover:text-white hover:bg-host-blue group-hover:bg-white/10 group-hover:text-white transition-all duration-300">
                                                <Mail size={18} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA wrapper with single gradient */}
            <div className="bg-host-gradient animate-gradient-x relative overflow-hidden">
                {/* Fluid Background Effects (same as Hero) */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
                    <div className="absolute top-[20%] right-[-20%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-[-20%] left-[30%] w-[40%] h-[40%] bg-host-blue/40 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>

                {/* CTA Section */}
                <div className="py-20 relative">
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="scroll-reveal reveal-scale text-center max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                                {t('landing.cta.title')}
                            </h2>
                            <p className="text-blue-100/80 text-lg mb-8 leading-relaxed">
                                {t('landing.cta.subtitle')}
                            </p>
                            <CTAButton fullWidth={false} onClick={() => navigate('/login')}>
                                {t('landing.cta.button')}
                            </CTAButton>
                        </div>
                    </div>
                </div>
            </div>

            {selectedPlan && (
                <SubscriptionInfoModal
                    isOpen={!!selectedPlanId}
                    onClose={() => setSelectedPlanId(null)}
                    planId={selectedPlan.id}
                    name={t(`landing.plans.${selectedPlan.id}.name`)}
                    price={selectedPlan.price}
                    discountPrice={selectedPlan.discountPrice}
                    category={selectedPlan.category}
                    onSelect={() => {
                        setSelectedPlanId(null);
                        navigate('/login');
                    }}
                />
            )}
        </div>
    );
};
