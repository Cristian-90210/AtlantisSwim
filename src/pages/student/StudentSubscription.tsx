import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { subscriptionService } from '../../services/api';
import { PageHeader } from '../../components/PageHeader';
import { Link } from 'react-router-dom';
import { CreditCard, Calendar, Award, TrendingUp } from 'lucide-react';
import type { Subscription } from '../../types';

export const StudentSubscription: React.FC = () => {
    const { user } = useAuth();
    const [mySubscription, setMySubscription] = useState<Subscription | null>(null);

    useEffect(() => {
        if (user) {
            subscriptionService.getByStudent(user.id).then(sub => setMySubscription(sub ?? null));
        }
    }, [user]);

    const sessionsRemaining = mySubscription ? mySubscription.sessionsTotal - mySubscription.sessionsUsed : 0;
    const sessionProgress = mySubscription ? (mySubscription.sessionsUsed / mySubscription.sessionsTotal) * 100 : 0;

    const isExpired = mySubscription ? new Date(mySubscription.expiryDate) < new Date() : false;
    const status = isExpired ? 'Expired' : 'Active';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            <PageHeader title="My Subscription" subtitle="Manage your subscription plan and track your sessions" />

            <div className="container mx-auto px-6 mt-10 relative z-20 max-w-4xl space-y-8">
                {mySubscription ? (
                    <div className="space-y-6">
                        {/* Main Subscription Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-8">
                                {/* Status Row */}
                                <div className="flex items-center justify-between mb-6">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-host-cyan/20 text-host-cyan border-host-cyan/30">
                                        ◎ Plan
                                    </span>
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full shadow ${isExpired
                                        ? 'bg-red-500 text-white'
                                        : 'bg-emerald-500 text-white'
                                        }`}>
                                        <Award className="w-3.5 h-3.5" />
                                        {status}
                                    </span>
                                </div>

                                {/* Plan Name */}
                                <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-2">
                                    {mySubscription.planId}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    ◷ {mySubscription.sessionsTotal} sessions
                                </p>

                                {/* Price */}
                                <div className="flex items-baseline gap-2 mb-8">
                                    <span className="text-3xl font-extrabold text-host-cyan">{mySubscription.amount}</span>
                                    <span className="text-sm text-gray-500 font-medium">MDL</span>
                                </div>

                                {/* Sessions Progress */}
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-3 mb-4">
                                        <TrendingUp className="text-host-cyan" size={20} />
                                        <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">Sessions Progress</h3>
                                    </div>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Sessions Remaining</span>
                                        <span className="text-sm font-extrabold text-host-cyan">
                                            {sessionsRemaining} / {mySubscription.sessionsTotal}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-host-blue to-host-cyan h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${100 - sessionProgress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <span className="text-xs text-gray-400">{mySubscription.sessionsUsed} used</span>
                                        <span className="text-xs text-gray-400">{sessionsRemaining} remaining</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subscription Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2.5 bg-host-cyan/10 rounded-full text-host-cyan">
                                        <CreditCard size={18} />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Paid On</h3>
                                </div>
                                <p className="text-lg font-extrabold text-gray-800 dark:text-white">{mySubscription.paidDate}</p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-500">
                                        <Calendar size={18} />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expires</h3>
                                </div>
                                <p className={`text-lg font-extrabold ${isExpired ? 'text-red-500' : 'text-gray-800 dark:text-white'}`}>
                                    {mySubscription.expiryDate}
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-500">
                                        <Award size={18} />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</h3>
                                </div>
                                <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${isExpired ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                    }`}>
                                    <span className={`w-2 h-2 rounded-full ${isExpired ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                                    {status}
                                </span>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-500">
                                        <TrendingUp size={18} />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usage</h3>
                                </div>
                                <p className="text-lg font-extrabold text-gray-800 dark:text-white">
                                    {Math.round(sessionProgress)}%
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* No Subscription */
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                        <CreditCard className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={48} />
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No Active Subscription</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">You don't have an active subscription yet.</p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-host-cyan text-white font-bold text-sm rounded-full hover:bg-cyan-500 transition-colors shadow-lg"
                        >
                            Browse Plans
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
