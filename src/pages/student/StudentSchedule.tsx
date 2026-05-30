import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reservationService, coachService, courseService } from '../../services/api';
import { PageHeader } from '../../components/PageHeader';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import type { Booking, Coach, Course } from '../../types';

export const StudentSchedule: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        if (!user) return;
        Promise.all([
            reservationService.getByStudent(user.id),
            coachService.getAll(),
            courseService.getAll(),
        ]).then(([bks, chs, crs]) => {
            setBookings(bks);
            setCoaches(chs);
            setCourses(crs);
        });
    }, [user]);

    const upcomingSessions = useMemo(() => {
        return bookings
            .filter(b => b.status === 'upcoming')
            .map(b => ({
                ...b,
                course: courses.find(c => c.id === b.courseId),
                coach: coaches.find(c => c.id === b.coachId),
            }))
            .sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.time}`);
                const dateB = new Date(`${b.date}T${b.time}`);
                return dateA.getTime() - dateB.getTime();
            });
    }, [bookings, coaches, courses]);

    const completedSessions = useMemo(() => {
        return bookings
            .filter(b => b.status === 'completed')
            .map(b => ({
                ...b,
                course: courses.find(c => c.id === b.courseId),
                coach: coaches.find(c => c.id === b.coachId),
            }));
    }, [bookings, coaches, courses]);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            <PageHeader title="Schedule" subtitle="View your upcoming and past training sessions" />

            <div className="container mx-auto px-6 mt-10 relative z-20 max-w-4xl space-y-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-host-cyan/10 rounded-full text-host-cyan">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming Sessions</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{upcomingSessions.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-500">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Completed Sessions</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{completedSessions.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Sessions */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Calendar className="text-host-cyan" size={20} />
                        Upcoming Training Sessions
                    </h2>
                    {upcomingSessions.length > 0 ? (
                        <div className="space-y-4">
                            {upcomingSessions.map(session => (
                                <div
                                    key={session.id}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:border-host-cyan/50 transition-all duration-300"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-1.5 h-16 rounded-full bg-host-cyan flex-shrink-0 mt-1" />
                                            <div>
                                                <h3 className="font-bold text-gray-800 dark:text-white text-lg">
                                                    {session.course?.title ?? 'Training Session'}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    {session.course?.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 sm:text-right space-y-2">
                                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold">
                                                <Calendar size={16} className="text-host-cyan" />
                                                <span className="text-sm">{formatDate(session.date)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Clock size={14} />
                                                <span className="text-sm font-medium">{session.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <User size={14} />
                                                <span className="text-sm font-medium">{session.coach?.name ?? '—'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Coach Info Bar */}
                                    {session.coach && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center gap-3">
                                            <img
                                                src={session.coach.avatar}
                                                alt={session.coach.name}
                                                className="w-8 h-8 rounded-full object-cover ring-2 ring-host-cyan/20"
                                            />
                                            <div>
                                                <p className="text-sm font-bold text-gray-800 dark:text-white">{session.coach.name}</p>
                                                <p className="text-xs text-gray-400">{session.coach.specialization}</p>
                                            </div>
                                            <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                                                <MapPin size={12} />
                                                <span>Atlantis Pool</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-12 text-center">
                            <Calendar className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={40} />
                            <p className="text-gray-500 dark:text-gray-400">No upcoming sessions scheduled.</p>
                        </div>
                    )}
                </div>

                {/* Completed Sessions */}
                {completedSessions.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <Clock className="text-emerald-500" size={20} />
                            Past Sessions
                        </h2>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {completedSessions.map(session => (
                                    <div key={session.id} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-1.5 h-10 rounded-full bg-gray-300 dark:bg-gray-600" />
                                            <div>
                                                <h4 className="font-bold text-gray-700 dark:text-gray-300">{session.course?.title}</h4>
                                                <p className="text-xs text-gray-400 mt-0.5">{session.coach?.name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{session.date}</p>
                                            <p className="text-xs text-gray-400">{session.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
