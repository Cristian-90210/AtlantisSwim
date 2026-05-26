import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { mockCoaches } from '../data/mockData';
import { Star, Mail, Linkedin, Twitter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Coaches: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20">
            <PageHeader
                title={<>{t('coaches_page.title')} <span className="text-host-cyan">{t('coaches_page.title_highlight')}</span></>}
                subtitle={t('coaches_page.subtitle')}
            />

            <div className="container mx-auto px-6 -mt-10 relative z-20">

                {/* Founder - Featured Card */}
                <div className="mb-10 mt-16">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-amber-400/50 dark:border-amber-500/40 overflow-hidden relative">
                        <div className="absolute top-4 right-4 z-10">
                            <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs font-extrabold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
                                ★ {t('landing.team.founder')}
                            </span>
                        </div>
                        <div className="flex flex-col md:flex-row">
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
                            <div className="md:w-2/3 p-8 md:p-10 flex flex-col justify-center">
                                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white mb-1">
                                    Varnic Alexandru
                                </h3>
                                <p className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-6">
                                    {t('landing.team.founder_role')}
                                </p>
                                <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                                    <p>{t('landing.team.founder_bio_1')}</p>
                                    <p>{t('landing.team.founder_bio_2')}</p>
                                </div>
                                <div className="flex items-center space-x-4 mt-6">
                                    <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-white hover:bg-amber-500 transition-all duration-300 shadow-sm hover:shadow-md"><Twitter size={18} /></button>
                                    <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-white hover:bg-amber-500 transition-all duration-300 shadow-sm hover:shadow-md"><Linkedin size={18} /></button>
                                    <a href="mailto:contact@atlantisswim.md" className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-white hover:bg-amber-500 transition-all duration-300 shadow-sm hover:shadow-md">
                                        <Mail size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Video Banner */}
                <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 duration-700">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockCoaches.map((coach) => (
                        <div key={coach.id} className="group relative h-[420px] rounded-2xl shadow-xl overflow-hidden transition-all duration-500 cursor-pointer">

                            {/* 1. Full Background Image (Visible on hover via z-index/opacity tricks) */}
                            <div
                                className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-700 active:scale-105 group-active:scale-105"
                                style={{ backgroundImage: `url(${coach.avatar})`, backgroundPosition: coach.imagePosition || 'top' }}
                            />

                            {/* 2. Dark Overlay for Hover State (Fades in) */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                            {/* 3. Default Background (Solid Color - Fades OUT on hover) */}
                            <div className="absolute inset-0 bg-white dark:bg-gray-800 opacity-100 group-hover:opacity-0 transition-opacity duration-500 z-20" />

                            {/* 4. Content Container */}
                            <div className="relative z-30 h-full p-6 flex flex-col items-center text-center transition-all duration-500">

                                {/* Avatar Layer (Visible default, Fades/Scales out on hover) */}
                                <div className="mt-6 mb-4 transform transition-all duration-500 group-hover:scale-0 group-hover:opacity-0 group-hover:h-0 group-hover:mt-0 group-hover:mb-0 origin-top">
                                    <div className="relative inline-block">
                                        <div className="absolute inset-0 bg-brand-gradient rounded-full blur-lg opacity-50"></div>
                                        <img
                                            src={coach.avatar}
                                            alt={coach.name}
                                            className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl relative z-10"
                                        />
                                        <div className="absolute bottom-1 right-1 z-20 bg-host-cyan text-white p-1.5 rounded-full border-2 border-white dark:border-gray-800 shadow-md">
                                            <Star className="w-4 h-4 fill-current" />
                                        </div>
                                    </div>
                                </div>

                                {/* Text Content (Moves and changes color on hover) */}
                                <div className="flex-1 flex flex-col justify-center group-hover:justify-end w-full transition-all duration-500">
                                    <h3 className="text-xl font-bold text-host-blue dark:text-white mb-1 group-hover:text-white group-hover:text-2xl transition-all duration-500">
                                        {coach.name}
                                    </h3>
                                    <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-2 group-hover:text-host-cyan group-hover:mb-1 transition-all duration-500">
                                        {t(`coaches.${coach.id}.specialization`)}
                                    </p>

                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 px-2 leading-relaxed italic group-hover:text-gray-200 group-hover:mb-3 transition-colors duration-500 line-clamp-4">
                                        "{t('coaches_page.experience', { count: coach.experienceYears })}..."
                                    </p>

                                    <div className="flex justify-center space-x-4 border-t border-gray-100 dark:border-gray-700 pt-4 group-hover:border-white/20 transition-colors duration-500">
                                        <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-white hover:bg-[#1DA1F2] transition-all duration-300 shadow-sm hover:shadow-md group-hover:bg-white/10 group-hover:text-white group-hover:hover:bg-host-cyan">
                                            <Twitter size={18} />
                                        </button>
                                        <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-white hover:bg-[#0077b5] transition-all duration-300 shadow-sm hover:shadow-md group-hover:bg-white/10 group-hover:text-white group-hover:hover:bg-host-cyan">
                                            <Linkedin size={18} />
                                        </button>
                                        <a href={`mailto:${coach.email}`} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-white hover:bg-host-blue transition-all duration-300 shadow-sm hover:shadow-md group-hover:bg-white/10 group-hover:text-white group-hover:hover:bg-host-cyan">
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
    );
};
