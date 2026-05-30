import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/PageHeader';
import { CheckCircle, XCircle, RotateCcw, User, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { attendanceService, reservationService, studentService, courseService } from '../../services/api';
import type { AttendanceRecord, Booking, Student, Course } from '../../types';

export const CoachAttendance: React.FC = () => {
    const { user } = useAuth();
    const coachId = user?.id ?? '';

    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [bookings, setBookings]     = useState<Booking[]>([]);
    const [students, setStudents]     = useState<Student[]>([]);
    const [courses, setCourses]       = useState<Course[]>([]);

    useEffect(() => {
        if (!coachId) return;
        attendanceService.getAll().then(setAttendance);
        Promise.all([
            reservationService.getByCoach(coachId),
            studentService.getAll(),
            courseService.getAll(),
        ]).then(([bks, sts, crs]) => {
            setBookings(bks);
            setStudents(sts);
            setCourses(crs);
        });
    }, [coachId]);

    const schedule = useMemo(() =>
        bookings
            .filter(b => b.status === 'upcoming')
            .map(b => ({
                ...b,
                student: students.find(s => s.id === b.studentId) ?? { name: 'Unknown', level: 'N/A' as const },
                course:  courses.find(c => c.id === b.courseId),
            }))
            .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()),
    [bookings, students, courses]);

    const handleMark = async (studentId: string, booking: Booking, status: 'present' | 'absent' | 'recovery') => {
        const record = await attendanceService.mark({
            bookingId:  booking.id,
            studentId,
            date:       booking.date,
            status,
            markedBy:   coachId,
            courseId:   parseInt(booking.courseId, 10) || 0,
        });
        setAttendance(prev => [...prev, record]);
    };

    const presentCount  = attendance.filter(a => a.status === 'present').length;
    const absentCount   = attendance.filter(a => a.status === 'absent').length;
    const recoveryCount = attendance.filter(a => a.status === 'recovery').length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            <PageHeader title="Attendance" subtitle="Mark and track student attendance for your sessions" />

            <div className="container mx-auto px-6 mt-10 relative z-20 max-w-5xl space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-500"><CheckCircle size={24} /></div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Present</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{presentCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-500"><XCircle size={24} /></div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Absent</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{absentCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-500"><RotateCcw size={24} /></div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Recovery</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{recoveryCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mark Attendance */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <CheckCircle className="text-host-cyan" size={20} />
                        Mark Attendance
                    </h2>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        {schedule.length > 0 ? (
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {schedule.map(session => {
                                    const existing = attendance.find(
                                        a => a.date === session.date && a.studentId === session.studentId
                                    );
                                    return (
                                        <div key={session.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                                    <User size={18} className="text-host-blue" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800 dark:text-gray-200">{session.student.name}</div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                        <Clock size={12} />
                                                        {session.date} • {session.time} • {session.course?.title}
                                                    </div>
                                                </div>
                                            </div>
                                            {existing ? (
                                                <span className={clsx(
                                                    'px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide',
                                                    existing.status === 'present'  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                    existing.status === 'absent'   ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                                                     'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                )}>
                                                    {existing.status}
                                                </span>
                                            ) : (
                                                <div className="flex gap-2 flex-wrap">
                                                    <button
                                                        onClick={() => handleMark(session.studentId, session, 'present')}
                                                        className="px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-700 hover:bg-green-200 transition-colors dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                                                    >
                                                        <CheckCircle size={14} className="inline mr-1" />Present
                                                    </button>
                                                    <button
                                                        onClick={() => handleMark(session.studentId, session, 'absent')}
                                                        className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700 hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                                    >
                                                        <XCircle size={14} className="inline mr-1" />Absent
                                                    </button>
                                                    <button
                                                        onClick={() => handleMark(session.studentId, session, 'recovery')}
                                                        className="px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50"
                                                    >
                                                        <RotateCcw size={14} className="inline mr-1" />Recovery
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-gray-500">No upcoming sessions to mark attendance for.</div>
                        )}
                    </div>
                </div>

                {/* Attendance History */}
                {attendance.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <Clock className="text-emerald-500" size={20} />
                            Attendance History
                        </h2>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {attendance.map(a => {
                                    const student = students.find(s => s.id === a.studentId);
                                    return (
                                        <div key={a.id} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={clsx('p-2 rounded-full',
                                                    a.status === 'present'  ? 'bg-green-100 text-green-600' :
                                                    a.status === 'absent'   ? 'bg-red-100 text-red-600'   : 'bg-yellow-100 text-yellow-600'
                                                )}>
                                                    {a.status === 'present' ? <CheckCircle size={18} /> :
                                                     a.status === 'absent'  ? <XCircle size={18} />     : <RotateCcw size={18} />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-700 dark:text-gray-300">{student?.name ?? a.studentId}</div>
                                                    <div className="text-xs text-gray-400">{a.date}</div>
                                                </div>
                                            </div>
                                            <span className={clsx(
                                                'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide',
                                                a.status === 'present' ? 'bg-green-100 text-green-700' :
                                                a.status === 'absent'  ? 'bg-red-100 text-red-700'    : 'bg-yellow-100 text-yellow-700'
                                            )}>
                                                {a.status}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
