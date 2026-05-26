import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockBookings, mockStudents, mockCourses } from '../data/mockData';
import { Calendar, CheckCircle, Clock, RotateCcw, Trophy, MessageCircle, Send, Users, User, AlertTriangle, Activity } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import type { AttendanceRecord, SwimmingResult, Message, SwimStyle, SwimDistance, StudentHealthFlag, ProgressSnapshot, RecoveryCredit, RecoveryRequest } from '../types';
import { attendanceService, resultsService, messageService, scheduleService, healthService, progressService, recoveryService, recoveryRequestService } from '../services/api';
import type { CoachScheduleSlot } from '../types';

export const CoachDashboard: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();

    const coachId = user?.id === 'c1' ? 'c1' : 'c1';

    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [allResults, setAllResults] = useState<SwimmingResult[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [scheduleSlots, setScheduleSlots] = useState<CoachScheduleSlot[]>([]);
    const [healthFlags, setHealthFlags] = useState<StudentHealthFlag[]>([]);
    const [progressSnapshots, setProgressSnapshots] = useState<ProgressSnapshot[]>([]);
    const [recoveryCredits, setRecoveryCredits] = useState<RecoveryCredit[]>([]);
    const [recoveryRequests, setRecoveryRequests] = useState<RecoveryRequest[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedParent, setSelectedParent] = useState('user-1');
    const [activeTab, setActiveTab] = useState<'schedule' | 'attendance' | 'results' | 'messages' | 'recovery' | 'individual' | 'count'>('schedule');
    const [confirmationDate, setConfirmationDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [confirmationHour, setConfirmationHour] = useState('17:00');
    const [attendanceMode, setAttendanceMode] = useState<'group' | 'individual'>('group');
    const [attendanceConfirmationFeedback, setAttendanceConfirmationFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [sessionConfirmationFeedback, setSessionConfirmationFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [recoveryRequestFeedback, setRecoveryRequestFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Results form state
    const [resultForm, setResultForm] = useState({
        studentId: 's1',
        style: 'freestyle' as SwimStyle,
        distance: '25m' as SwimDistance,
        time: '',
    });

    useEffect(() => {
        attendanceService.getAll().then(setAttendance);
        resultsService.getAll().then(setAllResults);
        messageService.getByUser(coachId).then(setMessages);
        scheduleService.getByCoach(coachId).then(setScheduleSlots);
        healthService.getAll().then(setHealthFlags);
        progressService.getAllLatest().then(setProgressSnapshots);
        recoveryService.getAll().then(setRecoveryCredits);
        recoveryRequestService.getAll().then(setRecoveryRequests);
    }, [coachId]);

    const buildHourlyRange = (startHour: number, endHour: number) => {
        const hours: string[] = [];
        for (let hour = startHour; hour <= endHour; hour += 1) {
            hours.push(`${String(hour).padStart(2, '0')}:00`);
        }
        return hours;
    };

    const getAllowedHoursForDate = (date: string) => {
        if (attendanceMode === 'individual') {
            return buildHourlyRange(7, 20);
        }

        const day = new Date(`${date}T00:00:00`).getDay();
        return day === 0 || day === 6
            ? ['10:00', '11:00', '12:00']
            : ['17:00', '18:00', '19:00'];
    };

    const allowedConfirmationHours = getAllowedHoursForDate(confirmationDate);

    useEffect(() => {
        if (!allowedConfirmationHours.includes(confirmationHour)) {
            setConfirmationHour(allowedConfirmationHours[0]);
        }
    }, [confirmationDate, confirmationHour, allowedConfirmationHours]);

    const schedule = useMemo(() => {
        return mockBookings
            .filter(b => b.coachId === coachId)
            .map(b => {
                const student = mockStudents.find(s => s.id === b.studentId) || { name: 'Unknown Student', level: 'N/A' };
                const course = mockCourses.find(c => c.id === b.courseId);
                return { ...b, student, course };
            })
            .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
    }, [coachId]);

    const today = new Date().toISOString().split('T')[0];
    const coachedStudentIds = useMemo(() => new Set(schedule.map(s => s.studentId)), [schedule]);

    const pendingRecoveryRequests = useMemo(() => {
        return recoveryRequests
            .filter(r => r.status === 'pending')
            .filter(r => coachedStudentIds.has(r.studentId))
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [recoveryRequests, coachedStudentIds]);

    const confirmedRecoveryRequests = useMemo(() => {
        return recoveryRequests
            .filter(r => r.status === 'confirmed')
            .filter(r => coachedStudentIds.has(r.studentId))
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [recoveryRequests, coachedStudentIds]);

    const scheduleCalendarEntries = useMemo(() => {
        const baseEntries = schedule.map(session => ({
            id: session.id,
            date: session.date,
            time: session.time,
            studentName: session.student.name,
            studentLevel: session.student.level,
            courseLabel: session.course ? t(`courses.${session.course.id}.title`) : session.courseId,
            status: session.status,
            isRecovery: false,
            sortTs: new Date(`${session.date}T${session.time}`).getTime(),
        }));

        const recoveryEntries = confirmedRecoveryRequests.map(request => {
            const student = mockStudents.find(s => s.id === request.studentId);
            const recoveryTime = '18:00';
            return {
                id: `recovery-${request.id}`,
                date: request.date,
                time: recoveryTime,
                studentName: student?.name ?? request.studentId,
                studentLevel: student?.level ?? 'N/A',
                courseLabel: t('coach_dashboard.attendance.recovery'),
                status: 'recovery_confirmed',
                isRecovery: true,
                sortTs: new Date(`${request.date}T${recoveryTime}`).getTime(),
            };
        });

        return [...baseEntries, ...recoveryEntries].sort((a, b) => a.sortTs - b.sortTs);
    }, [schedule, confirmedRecoveryRequests, t]);

    const todaysSessions = scheduleCalendarEntries.filter(s => s.date === today);
    const recoverySessions = attendance.filter(a => a.status === 'recovery');
    const individualSessions = schedule.filter(s => {
        const sameDateSessions = schedule.filter(ss => ss.date === s.date && ss.time === s.time);
        return sameDateSessions.length === 1;
    });

    const handleMarkAttendance = async (studentId: string, bookingId: string, date: string, status: AttendanceRecord['status']) => {
        const record = await attendanceService.mark({
            bookingId,
            studentId,
            date,
            status,
            markedBy: coachId,
            confirmed: false,
            submittedByStudent: false,
        });
        setAttendance(prev => {
            const withoutSame = prev.filter(a => a.bookingId !== bookingId || a.studentId !== studentId);
            return [...withoutSame, record];
        });
        recoveryService.getAll().then(setRecoveryCredits);
        setSessionConfirmationFeedback(null);
    };

    const handleConfirmAllForHour = async () => {
        setAttendanceConfirmationFeedback(null);
        const pendingForHour = attendance
            .filter(a => a.confirmed === false && a.submittedByStudent)
            .filter(a => {
                const session = schedule.find(s => s.id === a.bookingId && s.studentId === a.studentId);
                if (!session) return false;
                if (session.time !== confirmationHour || a.date !== confirmationDate) return false;
                return canStudentAppearAtHour(a.studentId, a.date, confirmationHour);
            });

        if (pendingForHour.length === 0) {
            setAttendanceConfirmationFeedback({ type: 'error', message: t('coach_dashboard.attendance.nothing_to_confirm') });
            return;
        }

        const confirmedRecords = await Promise.all(
            pendingForHour.map(record => attendanceService.confirm(record.id, coachId))
        );

        const confirmedMap = new Map(confirmedRecords.map(r => [r.id, r]));
        setAttendance(prev => prev.map(a => confirmedMap.get(a.id) ?? a));
        setAttendanceConfirmationFeedback({
            type: 'success',
            message: t('coach_dashboard.attendance.confirmation_success', { count: confirmedRecords.length, hour: confirmationHour }),
        });
        setSessionConfirmationFeedback({
            type: 'success',
            message: t('coach_dashboard.attendance.session_confirmed_by_coach', { count: confirmedRecords.length, hour: confirmationHour }),
        });
    };

    const handleCorrectPendingStatus = async (record: AttendanceRecord, nextStatus: 'present' | 'absent') => {
        const updated = await attendanceService.mark({
            bookingId: record.bookingId,
            studentId: record.studentId,
            date: record.date,
            status: nextStatus,
            markedBy: coachId,
            confirmed: false,
            submittedByStudent: true,
        });
        setAttendance(prev => prev.map(a => (a.id === record.id ? { ...updated, id: record.id } : a)));
    };

    const handleMarkAllVisiblePresent = async () => {
        const targetSessions = attendanceMode === 'group'
            ? attendanceSlots
                .filter(slot => slot.type === 'group')
                .filter(slot => slot.date === confirmationDate && slot.time === confirmationHour)
                .flatMap(slot => slot.sessions)
            : attendanceSlots
                .filter(slot => slot.type === 'individual')
                .filter(slot => slot.date === confirmationDate && slot.time === confirmationHour)
                .flatMap(slot => slot.sessions);

        if (targetSessions.length === 0) {
            setSessionConfirmationFeedback({ type: 'error', message: t('coach_dashboard.attendance.nothing_to_confirm') });
            return;
        }

        const updatedRecords = await Promise.all(
            targetSessions.map(session => attendanceService.mark({
                bookingId: session.id,
                studentId: session.studentId,
                date: session.date,
                status: 'present',
                markedBy: coachId,
                confirmed: false,
                submittedByStudent: false,
            }))
        );

        const mapped = new Map(updatedRecords.map(r => [`${r.bookingId}|${r.studentId}`, r]));
        setAttendance(prev => {
            const filtered = prev.filter(a => !mapped.has(`${a.bookingId}|${a.studentId}`));
            return [...filtered, ...updatedRecords];
        });
        setSessionConfirmationFeedback({
            type: 'success',
            message: t('coach_dashboard.attendance.mark_all_present_success', { count: updatedRecords.length }),
        });
    };

    const handleAddResult = async () => {
        if (!resultForm.time) return;
        const newResult = await resultsService.create({
            studentId: resultForm.studentId,
            coachId,
            style: resultForm.style,
            distance: resultForm.distance,
            time: resultForm.time,
            date: new Date().toISOString().split('T')[0],
        });
        setAllResults(prev => [...prev, newResult]);
        setResultForm(prev => ({ ...prev, time: '' }));
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user) return;
        const student = mockStudents.find(s => s.id === selectedParent);
        const sent = await messageService.send({
            senderId: user.id,
            senderName: user.name,
            receiverId: selectedParent,
            receiverName: student ? `Părinte ${student.name}` : 'Părinte',
            content: newMessage,
        });
        setMessages(prev => [...prev, sent]);
        setNewMessage('');
    };

    const handleConfirmRecoveryRequest = async (request: RecoveryRequest) => {
        try {
            const confirmed = await recoveryRequestService.confirm(request.id, coachId);
            setRecoveryRequests(prev => prev.map(r => (r.id === request.id ? confirmed : r)));
            setRecoveryRequestFeedback({
                type: 'success',
                message: t('coach_dashboard.recovery.request_confirmed', { date: confirmed.date }),
            });
        } catch {
            setRecoveryRequestFeedback({
                type: 'error',
                message: t('coach_dashboard.recovery.request_confirm_error'),
            });
        }
    };

    // Count students per time slot
    const studentCountPerSlot = useMemo(() => {
        const countMap: Record<string, number> = {};
        schedule.forEach(s => {
            const key = `${s.date} ${s.time}`;
            countMap[key] = (countMap[key] || 0) + 1;
        });
        return Object.entries(countMap).map(([slot, count]) => ({ slot, count }));
    }, [schedule]);

    const canStudentAppearAtHour = (studentId: string, date: string, targetHour: string) => {
        const hasRecovery = attendance.some(a => a.studentId === studentId && a.date === date && a.status === 'recovery');
        if (hasRecovery) return true;

        const hasEarlierConfirmedPresent = attendance.some(a => {
            if (a.studentId !== studentId || a.date !== date || a.status !== 'present' || a.confirmed !== true) return false;
            const session = schedule.find(s => s.id === a.bookingId && s.studentId === a.studentId);
            if (!session) return false;
            return session.time < targetHour;
        });

        return !hasEarlierConfirmedPresent;
    };

    const getAttendanceStatusClass = (status: AttendanceRecord['status']) => {
        if (status === 'present') return 'bg-green-100 text-green-700';
        if (status === 'absent') return 'bg-red-100 text-red-700';
        if (status === 'absent_medical') return 'bg-orange-100 text-orange-700';
        if (status === 'late') return 'bg-blue-100 text-blue-700';
        return 'bg-yellow-100 text-yellow-700';
    };

    const getAttendanceStatusLabel = (status: AttendanceRecord['status']) => {
        if (status === 'present') return t('coach_dashboard.attendance.present');
        if (status === 'absent') return t('coach_dashboard.attendance.absent');
        if (status === 'absent_medical') return t('coach_dashboard.attendance.absent_medical');
        if (status === 'late') return t('coach_dashboard.attendance.late');
        return t('coach_dashboard.attendance.recovery');
    };

    const attendanceStatusOptions = [
        { value: 'present' as const, label: t('coach_dashboard.attendance.action.mark_present') },
        { value: 'absent' as const, label: t('coach_dashboard.attendance.action.mark_absent') },
        { value: 'absent_medical' as const, label: t('coach_dashboard.attendance.action.mark_absent_medical') },
        { value: 'recovery' as const, label: t('coach_dashboard.attendance.action.mark_recovery') },
        { value: 'late' as const, label: t('coach_dashboard.attendance.action.mark_late') },
    ];

    const getAttendanceSelectClass = (status?: AttendanceRecord['status']) => clsx(
        "w-full md:w-56 rounded-lg border px-3 py-2 text-xs font-semibold outline-none transition-colors dark:bg-gray-700",
        status === 'present' && "border-green-300 text-green-700 dark:text-green-300",
        status === 'absent' && "border-red-300 text-red-700 dark:text-red-300",
        status === 'absent_medical' && "border-orange-300 text-orange-700 dark:text-orange-300",
        status === 'recovery' && "border-yellow-300 text-yellow-700 dark:text-yellow-300",
        status === 'late' && "border-blue-300 text-blue-700 dark:text-blue-300",
        !status && "border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300"
    );

    const handleAttendanceSelectionChange = async (
        studentId: string,
        bookingId: string,
        date: string,
        nextStatus: string
    ) => {
        if (!nextStatus) return;
        await handleMarkAttendance(studentId, bookingId, date, nextStatus as AttendanceRecord['status']);
    };

    const getSessionType = (time: string, slotSize: number): 'group' | 'individual' => {
        const hour = Number(time.split(':')[0]);
        if (slotSize > 2) return 'group';
        if (hour >= 7 && hour <= 20) return 'individual';
        return slotSize <= 2 ? 'individual' : 'group';
    };

    const visibleUpcomingSessions = useMemo(() => {
        return schedule
            .filter(s => s.status === 'upcoming')
            .filter(session => canStudentAppearAtHour(session.studentId, session.date, session.time));
    }, [schedule, attendance]);

    const attendanceSlots = useMemo(() => {
        const grouped = new Map<string, typeof visibleUpcomingSessions>();
        visibleUpcomingSessions.forEach(session => {
            const key = `${session.date}|${session.time}`;
            const existing = grouped.get(key) ?? [];
            grouped.set(key, [...existing, session]);
        });

        return Array.from(grouped.entries())
            .map(([key, sessions]) => {
                const [date, time] = key.split('|');
                return {
                    key,
                    date,
                    time,
                    sessions,
                    type: getSessionType(time, sessions.length),
                };
            })
            .sort((a, b) => {
                const left = `${a.date}T${a.time}`;
                const right = `${b.date}T${b.time}`;
                return new Date(left).getTime() - new Date(right).getTime();
            });
    }, [visibleUpcomingSessions]);

    const pendingAttendancesForSelection = useMemo(() => {
        return attendance.filter(a => a.confirmed === false && a.submittedByStudent).filter(a => {
            const session = schedule.find(s => s.id === a.bookingId && s.studentId === a.studentId);
            if (!session) return false;
            if (session.time !== confirmationHour || a.date !== confirmationDate) return false;
            return canStudentAppearAtHour(a.studentId, a.date, confirmationHour);
        });
    }, [attendance, schedule, confirmationHour, confirmationDate]);

    const healthByStudent = useMemo(() => {
        const map = new Map<string, StudentHealthFlag[]>();
        healthFlags.filter(flag => flag.isActive).forEach(flag => {
            const current = map.get(flag.studentId) ?? [];
            map.set(flag.studentId, [...current, flag]);
        });
        return map;
    }, [healthFlags]);

    const progressByStudent = useMemo(() => {
        const map = new Map<string, ProgressSnapshot>();
        progressSnapshots.forEach(snapshot => map.set(snapshot.studentId, snapshot));
        return map;
    }, [progressSnapshots]);

    const activeRecoveryCountByStudent = useMemo(() => {
        const map = new Map<string, number>();
        recoveryCredits
            .filter(credit => credit.status === 'active')
            .forEach(credit => {
                map.set(credit.studentId, (map.get(credit.studentId) ?? 0) + 1);
            });
        return map;
    }, [recoveryCredits]);

    const selectedSlotStudents = useMemo(() => {
        const slot = attendanceSlots.find(s => s.date === confirmationDate && s.time === confirmationHour);
        return slot ? slot.sessions.map(s => s.studentId) : [];
    }, [attendanceSlots, confirmationDate, confirmationHour]);

    const selectedSlotMedicalAlerts = useMemo(() => {
        return selectedSlotStudents.reduce((total, studentId) => {
            return total + (healthByStudent.get(studentId)?.length ?? 0);
        }, 0);
    }, [selectedSlotStudents, healthByStudent]);

    const tabs = [
        { key: 'schedule' as const, label: t('coach_dashboard.tabs.schedule') },
        { key: 'attendance' as const, label: t('coach_dashboard.tabs.attendance') },
        { key: 'results' as const, label: t('coach_dashboard.tabs.results') },
        { key: 'messages' as const, label: t('coach_dashboard.tabs.messages') },
        { key: 'recovery' as const, label: t('coach_dashboard.tabs.recovery') },
        { key: 'individual' as const, label: t('coach_dashboard.tabs.individual') },
        { key: 'count' as const, label: t('coach_dashboard.tabs.count') },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] pb-24 font-sans text-gray-800 dark:text-gray-200">
            <PageHeader
                title={t('coach_dashboard.welcome', { name: user?.name })}
                subtitle={t('coach_dashboard.subtitle')}
            />

            <div className="container mx-auto px-6 max-w-7xl relative mt-8 z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700/60 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
                        <div>
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('coach_dashboard.stats.todays_sessions')}</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none">{schedule.length}</h3>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center text-host-cyan shrink-0">
                            <Calendar size={28} />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700/60 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
                        <div>
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('coach_dashboard.stats.upcoming_classes')}</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none">{todaysSessions.length}</h3>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center text-host-cyan shrink-0">
                            <Clock size={28} />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700/60 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
                        <div>
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('coach_dashboard.stats.recovery')}</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none">{recoverySessions.length}</h3>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0">
                            <RotateCcw size={28} />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700/60 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
                        <div>
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('coach_dashboard.stats.total_results')}</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none">{allResults.filter(r => r.coachId === coachId).length}</h3>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                            <Trophy size={28} />
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={clsx(
                                "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap",
                                activeTab === tab.key
                                    ? "bg-host-cyan text-white shadow-md shadow-cyan-500/25"
                                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-cyan-500/10 hover:text-host-cyan hover:border-cyan-300/50"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Schedule Tab */}
                {activeTab === 'schedule' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/60 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('coach_dashboard.training_schedule')}</h2>
                            <div className="flex space-x-2">
                                <span className="px-3 py-1 bg-host-cyan/10 text-host-cyan rounded-full text-xs font-bold uppercase tracking-wide">Upcoming</span>
                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-full text-xs font-bold uppercase tracking-wide">Past</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 font-semibold">{t('coach_dashboard.table.time')}</th>
                                        <th className="p-4 font-semibold">{t('coach_dashboard.table.student')}</th>
                                        <th className="p-4 font-semibold">{t('coach_dashboard.table.course')}</th>
                                        <th className="p-4 font-semibold">{t('coach_dashboard.table.status')}</th>
                                        <th className="p-4 font-semibold text-right">{t('coach_dashboard.table.action')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {scheduleCalendarEntries.map((session) => (
                                        <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                                            <td className="p-4">
                                                <div className="font-bold text-gray-800 dark:text-white flex items-center">
                                                    <Calendar size={16} className="mr-2 text-host-cyan" /> {session.date}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1 flex items-center">
                                                    <Clock size={14} className="mr-2" /> {session.time}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium text-gray-800 dark:text-gray-200">{session.studentName}</div>
                                                <div className="text-xs text-gray-500">{session.studentLevel}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                                    {session.courseLabel}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={clsx(
                                                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                                                    session.status === 'upcoming'
                                                        ? "bg-green-100 text-green-700"
                                                        : session.isRecovery
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-gray-100 text-gray-500"
                                                )}>
                                                    {session.isRecovery ? t('coach_dashboard.attendance.recovery') : session.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                {session.isRecovery ? (
                                                    <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
                                                        {t('coach_dashboard.recovery.in_calendar')}
                                                    </span>
                                                ) : (
                                                    <button className="text-gray-400 hover:text-host-cyan transition-colors">
                                                        <CheckCircle size={20} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Attendance Tab */}
                {activeTab === 'attendance' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/60 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('coach_dashboard.attendance.title')}</h2>
                            <div className="mt-4 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setAttendanceMode('group')}
                                    className={clsx(
                                        "px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200",
                                        attendanceMode === 'group'
                                            ? "bg-host-cyan text-white shadow-md shadow-cyan-500/20"
                                            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-cyan-500/10 hover:text-host-cyan hover:border-cyan-300/50"
                                    )}
                                >
                                    {t('coach_dashboard.attendance.mode_group')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAttendanceMode('individual')}
                                    className={clsx(
                                        "px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200",
                                        attendanceMode === 'individual'
                                            ? "bg-host-cyan text-white shadow-md shadow-cyan-500/20"
                                            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-cyan-500/10 hover:text-host-cyan hover:border-cyan-300/50"
                                    )}
                                >
                                    {t('coach_dashboard.attendance.mode_individual')}
                                </button>
                            </div>
                        </div>
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-amber-50/40 dark:bg-amber-900/10">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-3">
                                {t('coach_dashboard.attendance.pending_confirmations')}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <label className="text-xs uppercase tracking-wider text-gray-500">
                                    {t('student_dashboard.results.headers.date')}
                                </label>
                                <input
                                    type="date"
                                    value={confirmationDate}
                                    onChange={e => setConfirmationDate(e.target.value)}
                                    className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200"
                                />
                                <label className="text-xs uppercase tracking-wider text-gray-500">
                                    {t('coach_dashboard.attendance.confirm_hour')}
                                </label>
                                <select
                                    value={confirmationHour}
                                    onChange={e => setConfirmationHour(e.target.value)}
                                    className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 font-bold"
                                >
                                    {allowedConfirmationHours.map(hour => (
                                        <option key={hour} value={hour}>{hour}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleConfirmAllForHour}
                                    className="px-3 py-1.5 rounded-full text-xs font-bold bg-host-cyan text-white hover:bg-host-blue transition-colors"
                                >
                                    {t('coach_dashboard.attendance.action.confirm_all_for_hour', { hour: `${confirmationDate} ${confirmationHour}` })}
                                </button>
                                <button
                                    onClick={handleMarkAllVisiblePresent}
                                    className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                                >
                                    {t('coach_dashboard.attendance.action.mark_all_present')}
                                </button>
                            </div>
                            {selectedSlotMedicalAlerts > 0 && (
                                <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm font-semibold inline-flex items-center gap-2">
                                    <AlertTriangle size={16} />
                                    {t('coach_dashboard.attendance.health_alert_banner', { count: selectedSlotMedicalAlerts })}
                                </div>
                            )}
                            <div className="space-y-3">
                                {pendingAttendancesForSelection.map(a => {
                                    const session = schedule.find(s => s.id === a.bookingId && s.studentId === a.studentId);
                                    const student = mockStudents.find(s => s.id === a.studentId);
                                    const studentHealth = healthByStudent.get(a.studentId) ?? [];
                                    const studentProgress = progressByStudent.get(a.studentId);
                                    const activeRecovery = activeRecoveryCountByStudent.get(a.studentId) ?? 0;
                                    return (
                                        <div key={a.id} className="flex items-center justify-between bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700/50 rounded-lg p-3">
                                            <div>
                                                <div className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                                    {student?.name || a.studentId}
                                                    {studentHealth.length > 0 && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold uppercase">
                                                            <AlertTriangle size={12} />
                                                            {t('coach_dashboard.attendance.health_alert')}
                                                        </span>
                                                    )}
                                                    {activeRecovery > 0 && (
                                                        <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase">
                                                            {t('coach_dashboard.attendance.recovery_credits', { count: activeRecovery })}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {a.date} {session ? `• ${session.time}` : ''} • {getAttendanceStatusLabel(a.status)}
                                                </div>
                                                <div className="mt-1">
                                                    <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold uppercase", getAttendanceStatusClass(a.status))}>
                                                        {getAttendanceStatusLabel(a.status)}
                                                    </span>
                                                </div>
                                                {studentHealth.length > 0 && (
                                                    <div className="text-[11px] text-red-700 mt-1">
                                                        {studentHealth[0].protocolText}
                                                    </div>
                                                )}
                                                {studentProgress && (
                                                    <div className="mt-2">
                                                        <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                                                            <span>{t('coach_dashboard.attendance.progress')}</span>
                                                            <span>{studentProgress.metricValue}%</span>
                                                        </div>
                                                        <div className="w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                                            <div className="h-1.5 rounded-full bg-host-cyan" style={{ width: `${studentProgress.metricValue}%` }} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleCorrectPendingStatus(a, 'present')}
                                                    className={clsx(
                                                        "px-3 py-1 rounded-full text-xs font-bold transition-colors",
                                                        a.status === 'present'
                                                            ? "bg-green-600 text-white"
                                                            : "bg-green-100 text-green-700 hover:bg-green-200"
                                                    )}
                                                >
                                                    {t('coach_dashboard.attendance.action.mark_present')}
                                                </button>
                                                <button
                                                    onClick={() => handleCorrectPendingStatus(a, 'absent')}
                                                    className={clsx(
                                                        "px-3 py-1 rounded-full text-xs font-bold transition-colors",
                                                        a.status === 'absent'
                                                            ? "bg-red-600 text-white"
                                                            : "bg-red-100 text-red-700 hover:bg-red-200"
                                                    )}
                                                >
                                                    {t('coach_dashboard.attendance.action.mark_absent')}
                                                </button>
                                                <button
                                                    onClick={() => handleMarkAttendance(a.studentId, a.bookingId, a.date, 'absent_medical')}
                                                    className={clsx(
                                                        "px-3 py-1 rounded-full text-xs font-bold transition-colors",
                                                        a.status === 'absent_medical'
                                                            ? "bg-orange-600 text-white"
                                                            : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                                                    )}
                                                >
                                                    {t('coach_dashboard.attendance.action.mark_absent_medical')}
                                                </button>
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                                                    {t('coach_dashboard.attendance.awaiting_coach_confirmation')}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                {pendingAttendancesForSelection.length === 0 && (
                                    <div className="text-sm text-gray-500">{t('coach_dashboard.attendance.no_pending_confirmations')}</div>
                                )}
                            </div>
                            {attendanceConfirmationFeedback && (
                                <div className={clsx(
                                    "mt-4 text-sm font-semibold",
                                    attendanceConfirmationFeedback.type === 'success' ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"
                                )}>
                                    {attendanceConfirmationFeedback.message}
                                </div>
                            )}
                            {sessionConfirmationFeedback && (
                                <div className={clsx(
                                    "mt-2 text-sm font-semibold",
                                    sessionConfirmationFeedback.type === 'success' ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"
                                )}>
                                    {sessionConfirmationFeedback.message}
                                </div>
                            )}
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {attendanceMode === 'group' ? (
                                attendanceSlots.filter(slot => slot.type === 'group').length > 0 ? (
                                    attendanceSlots.filter(slot => slot.type === 'group').map(slot => (
                                        <div key={slot.key} className="p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="font-bold text-gray-800 dark:text-white">
                                                    {slot.date} • {slot.time}
                                                </div>
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-host-cyan/10 text-host-cyan">
                                                    {slot.sessions.length} {t('roles.student')}
                                                </span>
                                            </div>
                                            <div className="space-y-3">
                                                {slot.sessions.map(session => {
                                                    const existing = attendance.find(a => a.bookingId === session.id && a.studentId === session.studentId);
                                                    return (
                                                        <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                                                            <div>
                                                                <div className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                                                    {session.student.name}
                                                                    <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-600 text-[10px] font-bold uppercase">
                                                                        {session.student.level}
                                                                    </span>
                                                                    {(healthByStudent.get(session.studentId)?.length ?? 0) > 0 && (
                                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold uppercase">
                                                                            <AlertTriangle size={12} />
                                                                            {t('coach_dashboard.attendance.health_alert')}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-gray-500">{session.course ? t(`courses.${session.course.id}.title`) : session.courseId}</div>
                                                                {progressByStudent.get(session.studentId) && (
                                                                    <div className="text-[10px] text-gray-500 mt-1 inline-flex items-center gap-1">
                                                                        <Activity size={12} />
                                                                        {t('coach_dashboard.attendance.progress')}: {progressByStudent.get(session.studentId)?.metricValue}%
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col items-end gap-2">
                                                                <select
                                                                    value={existing?.status ?? ''}
                                                                    onChange={e => handleAttendanceSelectionChange(session.studentId, session.id, session.date, e.target.value)}
                                                                    className={getAttendanceSelectClass(existing?.status)}
                                                                >
                                                                    <option value="">Selecteaza status</option>
                                                                    {attendanceStatusOptions.map(option => (
                                                                        <option key={option.value} value={option.value}>
                                                                            {option.label}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                {existing && (
                                                                    <span className={clsx(
                                                                        "px-3 py-1 rounded-full text-xs font-bold uppercase",
                                                                        getAttendanceStatusClass(existing.status)
                                                                    )}>
                                                                        {getAttendanceStatusLabel(existing.status)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-sm text-gray-500">{t('coach_dashboard.attendance.no_group_sessions')}</div>
                                )
                            ) : (
                                attendanceSlots.filter(slot => slot.type === 'individual').length > 0 ? (
                                    attendanceSlots.filter(slot => slot.type === 'individual').flatMap(slot => slot.sessions).map(session => {
                                        const existing = attendance.find(a => a.bookingId === session.id && a.studentId === session.studentId);
                                        return (
                                            <div key={session.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <div className="flex items-center space-x-4">
                                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                                        <User size={18} className="text-host-blue" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                                            {session.student.name}
                                                            <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-600 text-[10px] font-bold uppercase">
                                                                {session.student.level}
                                                            </span>
                                                            {(healthByStudent.get(session.studentId)?.length ?? 0) > 0 && (
                                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold uppercase">
                                                                    <AlertTriangle size={12} />
                                                                    {t('coach_dashboard.attendance.health_alert')}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{session.date} • {session.time} • {session.course ? t(`courses.${session.course.id}.title`) : session.courseId}</div>
                                                        {progressByStudent.get(session.studentId) && (
                                                            <div className="text-[10px] text-gray-500 mt-1 inline-flex items-center gap-1">
                                                                <Activity size={12} />
                                                                {t('coach_dashboard.attendance.progress')}: {progressByStudent.get(session.studentId)?.metricValue}%
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <select
                                                        value={existing?.status ?? ''}
                                                        onChange={e => handleAttendanceSelectionChange(session.studentId, session.id, session.date, e.target.value)}
                                                        className={getAttendanceSelectClass(existing?.status)}
                                                    >
                                                        <option value="">Selecteaza status</option>
                                                        {attendanceStatusOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {existing && (
                                                        <>
                                                            <span className={clsx(
                                                                "px-3 py-1 rounded-full text-xs font-bold uppercase",
                                                                existing.confirmed === false ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                                                            )}>
                                                                {existing.confirmed === false
                                                                    ? t('coach_dashboard.attendance.awaiting_coach_confirmation')
                                                                    : t('coach_dashboard.attendance.confirmed')}
                                                            </span>
                                                            {existing.confirmed === true && existing.confirmedBy === coachId && (
                                                                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-100 text-blue-700">
                                                                    {t('coach_dashboard.attendance.confirmed_by_you')}
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-8 text-sm text-gray-500">{t('coach_dashboard.attendance.no_individual_sessions')}</div>
                                )
                            )}
                        </div>
                    </div>
                )}

                {/* Results Tab */}
                {activeTab === 'results' && (
                    <div className="space-y-8">
                        {/* Add Result Form */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/60 p-6">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                                <Trophy className="mr-2 text-host-cyan" size={20} />
                                {t('coach_dashboard.results.add_title')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <select
                                    value={resultForm.studentId}
                                    onChange={e => setResultForm(prev => ({ ...prev, studentId: e.target.value }))}
                                    className="rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                >
                                    {mockStudents.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                <select
                                    value={resultForm.style}
                                    onChange={e => setResultForm(prev => ({ ...prev, style: e.target.value as SwimStyle }))}
                                    className="rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                >
                                    <option value="freestyle">Freestyle</option>
                                    <option value="backstroke">Backstroke</option>
                                    <option value="butterfly">Butterfly</option>
                                    <option value="breaststroke">Breaststroke</option>
                                </select>
                                <select
                                    value={resultForm.distance}
                                    onChange={e => setResultForm(prev => ({ ...prev, distance: e.target.value as SwimDistance }))}
                                    className="rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                >
                                    <option value="25m">25m</option>
                                    <option value="50m">50m</option>
                                    <option value="100m">100m</option>
                                    <option value="200m">200m</option>
                                </select>
                                <input
                                    type="text"
                                    value={resultForm.time}
                                    onChange={e => setResultForm(prev => ({ ...prev, time: e.target.value }))}
                                    placeholder="00:35.20"
                                    className="rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                />
                                <button
                                    onClick={handleAddResult}
                                    className="bg-host-cyan text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-host-blue transition-colors"
                                >
                                    {t('coach_dashboard.results.save')}
                                </button>
                            </div>
                        </div>

                        {/* Results Table */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/60 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('coach_dashboard.results.all_results')}</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4 font-semibold">{t('student_dashboard.results.headers.date')}</th>
                                            <th className="p-4 font-semibold">{t('student_dashboard.results.headers.style')}</th>
                                            <th className="p-4 font-semibold">{t('student_dashboard.results.headers.distance')}</th>
                                            <th className="p-4 font-semibold">{t('student_dashboard.results.headers.time')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {allResults.filter(r => r.coachId === coachId).map(r => {
                                            const student = mockStudents.find(s => s.id === r.studentId);
                                            return (
                                                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{student?.name || r.studentId}</td>
                                                    <td className="p-4">
                                                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 capitalize">
                                                            {r.style}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 font-bold text-gray-800 dark:text-white">{r.distance}</td>
                                                    <td className="p-4 font-bold text-host-cyan">{r.time}</td>
                                                    <td className="p-4 text-gray-500">{r.date}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Messages / Parent Communication Tab */}
                {activeTab === 'messages' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700/60 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-3">
                            <MessageCircle className="text-host-cyan" size={24} />
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('coach_dashboard.messages.title')}</h2>
                        </div>
                        <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                            {messages.length > 0 ? messages.map(m => (
                                <div key={m.id} className={clsx(
                                    "p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                                    m.senderId === coachId ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                                )}>
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-bold text-host-blue dark:text-host-cyan">{m.senderName}</span>
                                        <span className="text-xs text-gray-400">{new Date(m.timestamp).toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{m.content}</p>
                                </div>
                            )) : (
                                <div className="p-10 text-center text-gray-500 text-sm">{t('coach_dashboard.messages.no_messages')}</div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/80">
                            <div className="flex items-center gap-3">
                                <select
                                    value={selectedParent}
                                    onChange={e => setSelectedParent(e.target.value)}
                                    className="border-none bg-gray-200 dark:bg-gray-700/80 text-sm px-5 py-2.5 outline-none focus:ring-2 focus:ring-host-cyan/30 text-gray-700 dark:text-white font-semibold transition-all duration-200 cursor-pointer appearance-none"
                                    style={{ borderRadius: '9999px' }}
                                >
                                    {mockStudents.map(s => (
                                        <option key={s.id} value={s.id}>Părinte {s.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                    placeholder={t('coach_dashboard.messages.placeholder')}
                                    className="flex-1 border-none bg-gray-200 dark:bg-gray-700/80 text-sm px-5 py-2.5 outline-none focus:ring-2 focus:ring-host-cyan/30 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                                    style={{ borderRadius: '9999px' }}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="p-2.5 bg-host-cyan text-white hover:bg-host-blue transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recovery Tab */}
                {activeTab === 'recovery' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/60 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-3">
                                <RotateCcw className="text-yellow-500" size={24} />
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('coach_dashboard.recovery.pending_requests')}</h2>
                            </div>
                            {pendingRecoveryRequests.length > 0 ? (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {pendingRecoveryRequests.map(request => {
                                        const student = mockStudents.find(s => s.id === request.studentId);
                                        return (
                                            <div key={request.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <div className="flex items-center space-x-4">
                                                    <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                                                        <RotateCcw size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-800 dark:text-gray-200">{student?.name || request.studentId}</div>
                                                        <div className="text-xs text-gray-500">{request.date}</div>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleConfirmRecoveryRequest(request)}
                                                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-host-cyan text-white hover:bg-host-blue transition-colors"
                                                >
                                                    {t('coach_dashboard.recovery.confirm_request')}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-10 text-center text-gray-500 text-sm">{t('coach_dashboard.recovery.no_pending_requests')}</div>
                            )}
                            {recoveryRequestFeedback && (
                                <div className={clsx(
                                    "px-6 pb-6 text-sm font-semibold",
                                    recoveryRequestFeedback.type === 'success' ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"
                                )}>
                                    {recoveryRequestFeedback.message}
                                </div>
                            )}
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/60 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-3">
                                <RotateCcw className="text-yellow-500" size={24} />
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('coach_dashboard.recovery.title')}</h2>
                            </div>
                            {recoverySessions.length > 0 ? (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {recoverySessions.map(r => {
                                        const student = mockStudents.find(s => s.id === r.studentId);
                                        return (
                                            <div key={r.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <div className="flex items-center space-x-4">
                                                    <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                                                        <RotateCcw size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-800 dark:text-gray-200">{student?.name || r.studentId}</div>
                                                        <div className="text-xs text-gray-500">{r.date}</div>
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-yellow-100 text-yellow-700">
                                                    {t('coach_dashboard.attendance.recovery')}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-10 text-center text-gray-500 text-sm">{t('coach_dashboard.recovery.no_students')}</div>
                            )}
                        </div>
                    </div>
                )}

                {/* Individual Sessions Tab */}
                {activeTab === 'individual' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/60 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-3">
                            <User className="text-host-blue" size={24} />
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('coach_dashboard.individual.title')}</h2>
                        </div>
                        {individualSessions.length > 0 ? (
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {individualSessions.map(s => (
                                    <div key={s.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                                <User size={18} className="text-host-blue" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 dark:text-gray-200">{s.student.name}</div>
                                                <div className="text-xs text-gray-500">{s.course ? t(`courses.${s.course.id}.title`) : s.courseId}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-700 dark:text-gray-300 flex items-center justify-end">
                                                <Calendar size={16} className="mr-2 text-host-cyan" /> {s.date}
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center justify-end mt-1">
                                                <Clock size={14} className="mr-1" /> {s.time}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-10 text-center text-gray-500 text-sm">{t('coach_dashboard.individual.no_sessions')}</div>
                        )}
                    </div>
                )}

                {/* Student Count per Slot Tab */}
                {activeTab === 'count' && (
                    <div className="space-y-8">
                        {/* From schedule data */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/60 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-3">
                                <Users className="text-host-cyan" size={24} />
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('coach_dashboard.count.title')}</h2>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {studentCountPerSlot.map((entry, idx) => (
                                    <div key={idx} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-host-cyan/10 rounded-full">
                                                <Clock size={18} className="text-host-cyan" />
                                            </div>
                                            <div className="font-bold text-gray-800 dark:text-gray-200">{entry.slot}</div>
                                        </div>
                                        <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">
                                            {entry.count} {entry.count === 1 ? 'copil' : 'copii'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* From coach schedule slots */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/60 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('coach_dashboard.count.week_schedule')}</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4 font-semibold">{t('coach_dashboard.count.headers.day')}</th>
                                            <th className="p-4 font-semibold">{t('coach_dashboard.count.headers.interval')}</th>
                                            <th className="p-4 font-semibold">{t('coach_dashboard.count.headers.students_max')}</th>
                                            <th className="p-4 font-semibold">{t('coach_dashboard.count.headers.occupancy')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {scheduleSlots.map(slot => {
                                            const pct = Math.round((slot.currentStudents / slot.maxStudents) * 100);
                                            return (
                                                <tr key={slot.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                    <td className="p-4 font-bold text-gray-800 dark:text-white">{slot.dayOfWeek}</td>
                                                    <td className="p-4 text-gray-600 dark:text-gray-300">{slot.startTime} - {slot.endTime}</td>
                                                    <td className="p-4 font-bold text-host-cyan">{slot.currentStudents} / {slot.maxStudents}</td>
                                                    <td className="p-4">
                                                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                            <div
                                                                className={clsx(
                                                                    "h-2 rounded-full",
                                                                    pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-green-500"
                                                                )}
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-gray-500 mt-1">{pct}%</span>
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
            </div>
        </div>
    );
};
