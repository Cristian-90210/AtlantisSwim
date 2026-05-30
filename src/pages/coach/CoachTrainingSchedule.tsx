import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/PageHeader';
import { Calendar, Clock, User, Users, MapPin } from 'lucide-react';
import { clsx } from 'clsx';
import { scheduleService, reservationService, studentService, courseService } from '../../services/api';
import type { CoachScheduleSlot, Booking, Student, Course } from '../../types';

export const CoachTrainingSchedule: React.FC = () => {
    const { user } = useAuth();
    const coachId = user?.id ?? '';

    const [scheduleSlots, setScheduleSlots] = useState<CoachScheduleSlot[]>([]);
    const [sessions, setSessions]           = useState<(Booking & { student: Pick<Student, 'name' | 'level'>; course?: Course })[]>([]);

    useEffect(() => {
        if (!coachId) return;
        scheduleService.getByCoach(coachId).then(setScheduleSlots);

        Promise.all([
            reservationService.getByCoach(coachId),
            studentService.getAll(),
            courseService.getAll(),
        ]).then(([bookings, students, courses]) => {
            const enriched = bookings
                .map(b => ({
                    ...b,
                    student: students.find(s => s.id === b.studentId) ?? { name: 'Unknown', level: 'N/A' as const },
                    course:  courses.find(c => c.id === b.courseId),
                }))
                .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
            setSessions(enriched as any);
        });
    }, [coachId]);

    const upcoming   = sessions.filter(s => s.status === 'upcoming');
    const completed  = sessions.filter(s => s.status === 'completed');

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            <PageHeader title="Training Schedule" subtitle="Your upcoming and past training sessions" />

            <div className="container mx-auto px-6 mt-10 relative z-20 max-w-5xl space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-host-cyan/10 rounded-full text-host-cyan"><Calendar size={24} /></div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{upcoming.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-500"><Clock size={24} /></div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{completed.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-500"><Users size={24} /></div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Weekly Slots</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{scheduleSlots.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weekly Schedule Slots */}
                {scheduleSlots.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <Users className="text-host-cyan" size={20} />
                            Weekly Schedule
                        </h2>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4 font-semibold">Day</th>
                                            <th className="p-4 font-semibold">Time</th>
                                            <th className="p-4 font-semibold">Students</th>
                                            <th className="p-4 font-semibold">Occupancy</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {scheduleSlots.map(slot => {
                                            const pct = Math.round((slot.currentStudents / slot.maxStudents) * 100);
                                            return (
                                                <tr key={slot.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                    <td className="p-4 font-bold text-gray-800 dark:text-white">{slot.dayOfWeek}</td>
                                                    <td className="p-4 text-gray-600 dark:text-gray-300">{slot.startTime} – {slot.endTime}</td>
                                                    <td className="p-4 font-bold text-host-cyan">{slot.currentStudents} / {slot.maxStudents}</td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                                <div
                                                                    className={clsx('h-2 rounded-full', pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-green-500')}
                                                                    style={{ width: `${pct}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs text-gray-500">{pct}%</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Upcoming Sessions */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Calendar className="text-host-cyan" size={20} />
                        Upcoming Sessions
                    </h2>
                    {upcoming.length > 0 ? (
                        <div className="space-y-4">
                            {upcoming.map(session => (
                                <div key={session.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:border-host-cyan/50 transition-all duration-300">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-1.5 h-14 rounded-full bg-host-cyan flex-shrink-0 mt-1" />
                                            <div>
                                                <h3 className="font-bold text-gray-800 dark:text-white text-lg">
                                                    {session.course?.title ?? 'Training Session'}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                                    <User size={14} />
                                                    <span>{session.student.name}</span>
                                                    <span className="text-gray-300 dark:text-gray-600">·</span>
                                                    <span>{session.student.level}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 sm:text-right space-y-1">
                                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold">
                                                <Calendar size={16} className="text-host-cyan" />
                                                <span className="text-sm">{formatDate(session.date)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Clock size={14} />
                                                <span className="text-sm">{session.time}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                                <MapPin size={12} />
                                                <span>Atlantis Pool</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-12 text-center">
                            <Calendar className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={40} />
                            <p className="text-gray-500 dark:text-gray-400">No upcoming sessions.</p>
                        </div>
                    )}
                </div>

                {/* Completed */}
                {completed.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <Clock className="text-emerald-500" size={20} />
                            Past Sessions
                        </h2>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {completed.map(session => (
                                    <div key={session.id} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-1.5 h-10 rounded-full bg-gray-300 dark:bg-gray-600" />
                                            <div>
                                                <h4 className="font-bold text-gray-700 dark:text-gray-300">{session.course?.title}</h4>
                                                <p className="text-xs text-gray-400 mt-0.5">{session.student.name}</p>
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
