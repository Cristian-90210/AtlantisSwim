import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/PageHeader';
import { Mail, Award, Briefcase, Clock, User } from 'lucide-react';
import { coachService } from '../../services/api';
import type { Coach } from '../../types';

export const CoachProfile: React.FC = () => {
    const { user } = useAuth();
    const [coachData, setCoachData] = useState<Coach | null>(null);

    useEffect(() => {
        coachService.getAll().then(coaches => {
            const found = coaches.find(c => c.email === user?.email) ?? coaches.find(c => c.id === user?.id) ?? null;
            setCoachData(found);
        });
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            <PageHeader title="My Profile" subtitle="Your coaching profile and details" />

            <div className="container mx-auto px-6 mt-10 relative z-20 max-w-4xl space-y-8">
                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Avatar + Name Header */}
                    <div className="p-8 flex flex-col sm:flex-row items-center gap-6 border-b border-gray-100 dark:border-gray-700">
                        <div className="relative">
                            <img
                                src={user?.avatar || coachData?.avatar || `https://ui-avatars.com/api/?background=0ea5e9&color=fff&name=${encodeURIComponent(user?.name || 'C')}`}
                                alt={user?.name}
                                className="w-24 h-24 rounded-full object-cover ring-4 ring-host-cyan/30 shadow-lg"
                            />
                            <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white dark:border-gray-800" />
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">{user?.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
                            <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-widest text-host-cyan bg-host-cyan/10 px-3 py-1 rounded-full">
                                Coach
                            </span>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-gray-700">
                        <div className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-500">
                                <Mail size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Email</p>
                                <p className="text-sm font-semibold text-gray-800 dark:text-white mt-0.5">{user?.email}</p>
                            </div>
                        </div>

                        <div className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-500">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Specialization</p>
                                <p className="text-sm font-semibold text-gray-800 dark:text-white mt-0.5">{coachData?.specialization ?? '—'}</p>
                            </div>
                        </div>

                        <div className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-host-cyan/10 rounded-full text-host-cyan">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Experience</p>
                                <p className="text-sm font-semibold text-gray-800 dark:text-white mt-0.5">{coachData?.experienceYears ?? '—'} years</p>
                            </div>
                        </div>

                        <div className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-500">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Status</p>
                                <span className={`mt-1 inline-block text-xs font-bold px-3 py-1 rounded-full border ${coachData?.status === 'Active'
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                                    }`}>
                                    {coachData?.status ?? 'Active'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Status */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3">
                        <Award className="text-host-cyan" size={22} />
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Account Status</h3>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest bg-emerald-500 text-white px-4 py-1.5 rounded-full shadow">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            Active
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Your coaching account is active and in good standing.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
