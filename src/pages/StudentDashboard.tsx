import React, { useMemo, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockBookings, mockCoaches, mockCourses, mockSubscriptions, subscriptionPlans } from '../data/mockData';
import { Calendar, Clock, User, ArrowRight, Trophy, CreditCard, Award, Plus, GraduationCap, Users, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { PageHeader } from '../components/PageHeader';
import { useTranslation } from 'react-i18next';
import type { SwimmingResult } from '../types';
import { resultsService } from '../services/api';

export const StudentDashboard: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [results, setResults] = useState<SwimmingResult[]>([]);

    useEffect(() => {
        if (user) {
            resultsService.getByStudent(user.id).then(setResults);
        }
    }, [user]);

    const myBookings = useMemo(() => {
        return mockBookings.filter(b => b.studentId === user?.id).map(b => {
            const course = mockCourses.find(c => c.id === b.courseId);
            const coach = mockCoaches.find(c => c.id === b.coachId);
            return { ...b, course, coach };
        });
    }, [user]);

    const upcoming = myBookings.filter(b => b.status === 'upcoming');
    const mySubscription = mockSubscriptions.find(s => s.studentId === user?.id);
    const matchedPlan = mySubscription ? subscriptionPlans.find(p => p.id === mySubscription.planId) : null;
    const sessionsRemaining = mySubscription ? mySubscription.sessionsTotal - mySubscription.sessionsUsed : 0;
    const sessionProgress = mySubscription ? (mySubscription.sessionsUsed / mySubscription.sessionsTotal) * 100 : 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] pb-24 font-sans text-gray-800 dark:text-gray-200">
            <PageHeader
                title={<>Bine ai venit, <span className="text-white">{user?.name}</span></>}
                subtitle="Gestionează progresul înotului tău și sesiunile viitoare."
            />

            <div className="container mx-auto px-6 max-w-7xl relative mt-8 z-20">
                {/* 1. Top Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700/60 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
                        <div>
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('student_dashboard.stats.upcoming_sessions')}</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none">{upcoming.length}</h3>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center text-host-cyan shrink-0">
                            <Calendar size={28} />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700/60 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
                        <div>
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('student_dashboard.stats.student_level')}</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none">{t('hero.levels.beginner')}</h3>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center text-host-cyan shrink-0">
                            <User size={28} />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-host-blue to-host-cyan rounded-2xl p-6 shadow-xl border-none flex flex-col justify-between text-white relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/20 transition-all duration-500"/>
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-cyan-100 uppercase tracking-wider mb-2 text-shadow-sm">{t('student_dashboard.stats.next_session')}</p>
                            <h3 className="text-xl font-extrabold leading-tight text-shadow-sm">
                                {upcoming[0] ? `${upcoming[0].date} @ ${upcoming[0].time}` : t('student_dashboard.stats.no_upcoming')}
                            </h3>
                        </div>
                        <button onClick={() => navigate('/courses')} className="relative z-10 self-end mt-4 text-xs font-extrabold uppercase tracking-wide bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors flex items-center backdrop-blur-sm shadow-sm ring-1 ring-white/20">
                            {t('student_dashboard.stats.book_new')} <ArrowRight size={14} className="ml-1.5" />
                        </button>
                    </div>
                </div>

                {/* 2. Main 12-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN: Main Content (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-8 animate-in fade-in duration-500">
                        
                        {/* Bookings View */}
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
                                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center">
                                    <Calendar className="mr-3 text-host-cyan" size={20} />
                                    {t('student_dashboard.my_bookings')}
                                </h2>
                                <button onClick={() => navigate('/courses')} className="self-start sm:self-auto flex items-center bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:bg-host-cyan dark:hover:bg-host-cyan dark:hover:text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg transform hover:-translate-y-0.5 transition-all">
                                    <Plus size={14} className="mr-2" />
                                    {t('student_dashboard.stats.book_new')}
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {myBookings.length > 0 ? (
                                    myBookings.map((binding) => (
                                        <div key={binding.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xl border border-gray-100 dark:border-gray-700/60 hover:border-host-cyan/40 hover:shadow-cyan-900/10 transform hover:-translate-y-0.5 transition-all duration-300 group flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                                            <div className="flex items-start sm:items-center space-x-4">
                                                <div className={clsx(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110",
                                                    binding.status === 'upcoming' ? "bg-cyan-50 dark:bg-cyan-500/10 text-host-cyan" : "bg-gray-100 dark:bg-gray-700/50 text-gray-400"
                                                )}>
                                                    {binding.status === 'upcoming' ? <Clock size={20} /> : <CheckCircle size={20} />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-extrabold text-gray-900 dark:text-white group-hover:text-host-cyan transition-colors">
                                                            {binding.course ? t(`courses.${binding.course.id}.title`, { defaultValue: binding.course.title }) : 'Sesiune Înot'}
                                                        </h4>
                                                        <span className={clsx(
                                                            "px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest border",
                                                            binding.status === 'upcoming' ? "bg-cyan-50 dark:bg-cyan-500/10 text-host-cyan border-cyan-200 dark:border-cyan-500/20" : "bg-gray-50 dark:bg-gray-700/30 text-gray-500 border-gray-200 dark:border-gray-600"
                                                        )}>
                                                            {binding.status === 'upcoming' ? 'Urmează' : 'Finalizat'}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="flex items-center font-medium"><User size={14} className="mr-1.5 opacity-50" /> {binding.coach?.name ?? 'Antrenor'}</span>
                                                        <span className="flex items-center font-medium"><Calendar size={14} className="mr-1.5 opacity-50" /> {binding.date}</span>
                                                        <span className="flex items-center font-bold text-gray-900 dark:text-gray-300"><Clock size={14} className="mr-1.5 text-host-cyan opacity-80" /> {binding.time}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {binding.status === 'upcoming' && (
                                                <div className="flex items-center gap-2 border-t border-gray-100 dark:border-gray-700 sm:border-t-0 pt-3 sm:pt-0">
                                                    <button className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Detalii</button>
                                                    <button className="px-3 py-1.5 text-xs font-bold rounded-lg bg-cyan-50 dark:bg-cyan-500/10 text-host-cyan hover:bg-cyan-100 dark:hover:bg-cyan-500/20 transition-colors">Reprogramează</button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-8 text-center flex flex-col items-center">
                                        <div className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center mb-3 text-gray-400">
                                            <Calendar size={28} />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('student_dashboard.no_bookings', { defaultValue: 'Nu ai sesiuni programate' })}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mb-5">Rezervă acum prima ta sesiune de înot pentru a începe aventura.</p>
                                        <button onClick={() => navigate('/courses')} className="bg-host-cyan text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-cyan-600 transition-colors">
                                            Rezervă o Sesiune
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Results View */}
                        <div>
                            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center mb-5">
                                <Trophy className="mr-3 text-host-cyan" size={20} />
                                {t('student_dashboard.results.title')}
                            </h2>
                            
                            {results.length > 0 ? (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/60 overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50/80 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700/60">
                                            <tr>
                                                <th className="px-5 py-3 text-[10px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{t('student_dashboard.results.headers.date')}</th>
                                                <th className="px-5 py-3 text-[10px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{t('student_dashboard.results.headers.style')}</th>
                                                <th className="px-5 py-3 text-[10px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{t('student_dashboard.results.headers.distance')}</th>
                                                <th className="px-5 py-3 text-[10px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{t('student_dashboard.results.headers.time')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                                            {results.map((r, i) => (
                                                <tr key={r.id} className={clsx("hover:bg-cyan-50/50 dark:hover:bg-gray-700/30 transition-colors group", i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50/30 dark:bg-gray-800/80")}>
                                                    <td className="px-5 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">{r.date}</td>
                                                    <td className="px-5 py-3">
                                                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 capitalize tracking-wide group-hover:bg-cyan-50 dark:group-hover:bg-cyan-500/10 group-hover:text-host-cyan transition-colors border border-gray-200 dark:border-gray-600">
                                                            {r.style}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3 text-sm font-extrabold text-gray-900 dark:text-white">{r.distance}</td>
                                                    <td className="px-5 py-3 text-sm font-extrabold text-host-cyan tracking-wide">{r.time}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/60 p-8 text-center">
                                    <Trophy className="mx-auto text-gray-300 dark:text-gray-500 mb-3" size={36} />
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('student_dashboard.results.no_results')}</p>
                                </div>
                            )}
                        </div>
                    </div> {/* End Left Column */}

                    {/* RIGHT COLUMN: Subscription & Quick Actions (4 cols, Sticky) */}
                    <div className="lg:col-span-4 sticky top-24 space-y-6">
                        
                        {/* Subscription Card */}
                        <div>
                            <h3 className="text-xs font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 flex items-center">
                                <CreditCard size={14} className="mr-2" /> {t('student_dashboard.subscription.title')}
                            </h3>

                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xl border border-gray-100 dark:border-gray-700/60 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                                {/* Decorative Glow */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-host-cyan/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-host-cyan/10 transition-all duration-500 pointer-events-none"/>
                                
                                {mySubscription && matchedPlan ? (
                                    <div className="relative z-10 space-y-5">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="mb-2">
                                                    {(() => {
                                                        const categoryConfig: Record<string, { label: string; icon: string; color: string }> = {
                                                            standard: { label: t('landing.subscriptions.standard'), icon: '◎', color: 'bg-host-cyan/10 text-host-cyan border-cyan-200 dark:border-cyan-500/20' },
                                                            pro: { label: t('landing.subscriptions.pro'), icon: '★', color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-200 dark:border-yellow-500/20' },
                                                            individual: { label: t('landing.subscriptions.individual'), icon: '✦', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20' },
                                                            transport: { label: t('landing.subscriptions.transport'), icon: '🚐', color: 'bg-green-500/10 text-emerald-600 dark:text-emerald-400 border-green-200 dark:border-green-500/20' },
                                                        };
                                                        const cat = categoryConfig[matchedPlan.category] || categoryConfig.standard;
                                                        return (
                                                            <span className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-widest border ${cat.color}`}>
                                                                <span>{cat.icon}</span>
                                                                <span>{cat.label}</span>
                                                            </span>
                                                        );
                                                    })()}
                                                </div>
                                                <h4 className="text-lg font-extrabold text-gray-900 dark:text-white">
                                                    {t(`landing.plans.${matchedPlan.id}.name`)}
                                                </h4>
                                            </div>
                                            <span className="inline-flex items-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[9px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm uppercase tracking-widest shrink-0">
                                                <Award size={12} className="mr-1.5" /> Activ
                                            </span>
                                        </div>

                                        <div className="bg-gray-50/80 dark:bg-gray-900/50 rounded-xl p-3 border border-gray-100 dark:border-gray-800">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sesiuni Rămase</span>
                                                <span className="text-xs font-extrabold text-gray-900 dark:text-white">
                                                    {sessionsRemaining} <span className="text-gray-400 font-semibold">/ {mySubscription.sessionsTotal}</span>
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700/80 rounded-full h-1.5 overflow-hidden mb-2">
                                                <div
                                                    className="bg-host-cyan h-1.5 rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${100 - sessionProgress}%` }}
                                                />
                                            </div>
                                            <p className="text-[10px] text-gray-500 font-semibold text-center mt-2">
                                                Valabil până pe <span className="text-gray-800 dark:text-gray-300 ml-1">{mySubscription.expiryDate}</span>
                                            </p>
                                        </div>
                                        
                                        <button className="w-full py-2 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700">
                                            Gestionare Abonament
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-5">
                                        <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100 dark:border-gray-700">
                                            <CreditCard className="text-gray-400" size={20} />
                                        </div>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-4">{t('student_dashboard.subscription.no_subscription')}</p>
                                        <button onClick={() => navigate('/')} className="w-full py-2 bg-host-cyan text-white rounded-lg text-xs font-bold shadow-md hover:bg-cyan-600 transition-colors">
                                            {t('student_dashboard.subscription.browse_plans')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <h3 className="text-xs font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 ml-1 flex items-center">
                                {t('student_dashboard.quick_actions')}
                            </h3>

                            <div className="space-y-2.5">
                                <button
                                    onClick={() => navigate('/courses')}
                                    className="w-full text-left bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700/60 p-3.5 transition-all duration-300 hover:border-host-cyan/50 hover:shadow-cyan-900/10 transform hover:-translate-y-1 group flex items-center"
                                >
                                    <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-400 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-500/10 group-hover:text-host-cyan mr-3 transition-colors">
                                        <GraduationCap size={18} />
                                    </div>
                                    <span className="flex-1 font-bold text-gray-900 dark:text-white group-hover:text-host-cyan transition-colors text-sm">
                                        {t('student_dashboard.actions.browse_all')}
                                    </span>
                                    <ArrowRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-host-cyan transition-colors" />
                                </button>

                                <button
                                    onClick={() => navigate('/coaches')}
                                    className="w-full text-left bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700/60 p-3.5 transition-all duration-300 hover:border-host-cyan/50 hover:shadow-cyan-900/10 transform hover:-translate-y-1 group flex items-center"
                                >
                                    <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-400 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-500/10 group-hover:text-host-cyan mr-3 transition-colors">
                                        <Users size={18} />
                                    </div>
                                    <span className="flex-1 font-bold text-gray-900 dark:text-white group-hover:text-host-cyan transition-colors text-sm">
                                        {t('student_dashboard.actions.meet_coaches')}
                                    </span>
                                    <ArrowRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-host-cyan transition-colors" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};
