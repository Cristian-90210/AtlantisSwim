import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import {
    CheckCircle, XCircle, Calendar, BarChart3, Clock,
    ChevronLeft, ChevronRight, RotateCcw, X, Loader2,
    CalendarDays, ArrowRight
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { mockBookings, mockCoaches, mockCourses } from '../data/mockData';
import { attendanceService } from '../services/api';
import type { AttendanceRecord, Booking } from '../types';

/* ──────────────────────────────────────────────────────────────────────────────
   HELPERS — centralised status mapping
   ────────────────────────────────────────────────────────────────────────────── */

type StatusColor = { bg: string; text: string; dot: string; ring: string };

const STATUS_MAP: Record<string, StatusColor> = {
    present:        { bg: 'bg-emerald-500/10', text: 'text-emerald-500', dot: 'bg-emerald-500', ring: 'ring-emerald-500/30' },
    absent:         { bg: 'bg-red-500/10',     text: 'text-red-500',     dot: 'bg-red-500',     ring: 'ring-red-500/30'     },
    absent_medical: { bg: 'bg-orange-500/10',  text: 'text-orange-500',  dot: 'bg-orange-500',  ring: 'ring-orange-500/30'  },
    recovery:       { bg: 'bg-amber-500/10',   text: 'text-amber-500',   dot: 'bg-amber-500',   ring: 'ring-amber-500/30'   },
    late:           { bg: 'bg-blue-500/10',     text: 'text-blue-500',    dot: 'bg-blue-500',    ring: 'ring-blue-500/30'    },
    upcoming:       { bg: 'bg-cyan-500/10',     text: 'text-cyan-500',    dot: 'bg-cyan-500',    ring: 'ring-cyan-500/30'    },
};

const getStatusColor = (status: string): StatusColor =>
    STATUS_MAP[status] ?? { bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400', ring: 'ring-gray-400/30' };

const getStatusLabel = (status: string, t: any): string => {
    const map: Record<string, string> = {
        present: t('student_dashboard.attendance.present', { defaultValue: 'Prezent' }),
        absent: t('student_dashboard.attendance.absent', { defaultValue: 'Absent' }),
        absent_medical: t('student_dashboard.attendance.absent_medical', { defaultValue: 'Absent medical' }),
        recovery: t('student_dashboard.attendance.recovery', { defaultValue: 'Recuperare' }),
        late: t('student_dashboard.attendance.late', { defaultValue: 'Întârziat' }),
        upcoming: 'Programat',
    };
    return map[status] ?? status;
};

/* ──────────────────────────────────────────────────────────────────────────────
   StatusBadge — reusable
   ────────────────────────────────────────────────────────────────────────────── */

const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className }) => {
    const { t } = useTranslation();
    const c = getStatusColor(status);
    return (
        <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide', c.bg, c.text, className)}>
            <span className={clsx('w-1.5 h-1.5 rounded-full', c.dot)} />
            {getStatusLabel(status, t)}
        </span>
    );
};

/* ──────────────────────────────────────────────────────────────────────────────
   Skeleton loaders
   ────────────────────────────────────────────────────────────────────────────── */

const StatsSkeleton: React.FC = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 animate-pulse">
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
                <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
        ))}
    </div>
);

const CalendarSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-6" />
        <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
                <div key={i} className="h-[85px] bg-gray-100 dark:bg-gray-700/50 rounded-xl" />
            ))}
        </div>
    </div>
);

/* ──────────────────────────────────────────────────────────────────────────────
   MAIN PAGE
   ────────────────────────────────────────────────────────────────────────────── */

export const Attendance: React.FC = () => {
    const { user } = useAuth();
    const { t, i18n } = useTranslation();
    const calendarRef = useRef<HTMLDivElement>(null);

    // ── State ──
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // ── Data fetch (simulated async) ──
    useEffect(() => {
        if (!user) return;
        setIsLoading(true);
        attendanceService.getByStudent(user.id).then(data => {
            setAttendance(data);
            setIsLoading(false);
        });
    }, [user]);

    // ── Auto-set calendar to first training month ──
    const myBookings = useMemo(() =>
        mockBookings.filter(b => b.studentId === user?.id && b.status !== 'cancelled'),
    [user]);

    useEffect(() => {
        if (myBookings.length === 0) return;
        const sorted = [...myBookings].sort((a, b) => a.date.localeCompare(b.date));
        const first = sorted[0]?.date;
        if (!first) return;
        const [y, m] = first.split('-').map(Number);
        setCalendarMonth(new Date(y, m - 1, 1));
    }, [myBookings]);

    // ── Locale ──
    const locale = i18n.language === 'ro' ? 'ro-RO' : i18n.language === 'ru' ? 'ru-RU' : 'en-US';

    // ── Calendar data ──
    const weekdays = useMemo(() => {
        const monday = new Date(2026, 0, 5); // a Monday
        return Array.from({ length: 7 }, (_, i) =>
            new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i)
                .toLocaleDateString(locale, { weekday: 'short' })
        );
    }, [locale]);

    const daysInMonth = useMemo(() => {
        return new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
    }, [calendarMonth]);

    const firstDayOffset = useMemo(() => {
        const d = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
        return d === 0 ? 6 : d - 1;
    }, [calendarMonth]);

    const monthLabel = calendarMonth.toLocaleDateString(locale, { month: 'long', year: 'numeric' });

    const bookingsByDate = useMemo(() => {
        const map = new Map<string, Booking[]>();
        myBookings.forEach(b => {
            const arr = map.get(b.date) ?? [];
            arr.push(b);
            map.set(b.date, arr);
        });
        return map;
    }, [myBookings]);

    const attendanceByDate = useMemo(() => {
        const map = new Map<string, AttendanceRecord>();
        attendance.forEach(r => map.set(r.date, r));
        return map;
    }, [attendance]);

    const todayISO = new Date().toISOString().split('T')[0];

    // ── Stats ──
    const stats = useMemo(() => {
        const present = attendance.filter(a => a.status === 'present').length;
        const absent = attendance.filter(a => a.status === 'absent' || a.status === 'absent_medical').length;
        const total = attendance.length;
        const pct = total > 0 ? Math.round((present / total) * 100) : 0;
        const lastPresent = [...attendance]
            .filter(a => a.status === 'present')
            .sort((a, b) => b.date.localeCompare(a.date))[0]?.date ?? '—';
        return { present, absent, total, pct, lastPresent };
    }, [attendance]);

    // ── Mark attendance ──
    const handleMark = useCallback(async (date: string, bookingId: string, status: 'present' | 'absent') => {
        if (!user) return;
        setIsSaving(true);
        setFeedback(null);
        try {
            const record = await attendanceService.mark({
                bookingId,
                studentId: user.id,
                date,
                status,
                markedBy: user.id,
                confirmed: false,
                submittedByStudent: true,
            });
            setAttendance(prev => {
                const without = prev.filter(a => a.date !== date);
                return [record, ...without];
            });
            setFeedback({ type: 'success', message: t('student_dashboard.attendance.saved_success', { defaultValue: 'Prezența a fost salvată cu succes.' }) });
        } catch {
            setFeedback({ type: 'error', message: 'Eroare la salvare. Încearcă din nou.' });
        } finally {
            setIsSaving(false);
        }
    }, [user, t]);

    // ── CTA click: scroll to calendar & select nearest upcoming ──
    const handleCTAClick = () => {
        // Find nearest upcoming session
        const today = todayISO;
        const upcoming = myBookings
            .filter(b => b.date >= today && !attendanceByDate.has(b.date))
            .sort((a, b) => a.date.localeCompare(b.date));

        if (upcoming.length > 0) {
            const nearest = upcoming[0];
            const [y, m] = nearest.date.split('-').map(Number);
            setCalendarMonth(new Date(y, m - 1, 1));
            setSelectedDay(nearest.date);
        }

        calendarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // ── Selected day data ──
    const selectedBookings = selectedDay ? (bookingsByDate.get(selectedDay) ?? []) : [];
    const selectedRecord = selectedDay ? attendanceByDate.get(selectedDay) : undefined;

    // ── Activity list (most recent 8) ──
    const recentActivity = useMemo(() =>
        [...attendance].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8),
    [attendance]);

    // ── Legend items ──
    const legendItems = [
        { status: 'present',  label: 'Prezent' },
        { status: 'absent',   label: 'Absent' },
        { status: 'recovery', label: 'Recuperare' },
        { status: 'upcoming', label: 'Programat' },
    ];

    /* ══════════════════════════════════════════════════════════════════════════
       RENDER
       ══════════════════════════════════════════════════════════════════════════ */

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            <PageHeader
                title={<>PREZENȚĂ <span className="text-host-cyan">ANTRENAMENTE</span></>}
                subtitle="Gestionează și monitorizează participarea la antrenamente"
            />

            <div className="container mx-auto px-6 mt-8 relative z-20 space-y-8">

                {/* ───── Header row: title + CTA ───── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Prezența Mea</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitorizează participarea ta la sesiuni</p>
                    </div>
                    <Button variant="primary" onClick={handleCTAClick}>
                        <CheckCircle size={16} />
                        Marchează prezența
                    </Button>
                </div>

                {/* ───── Stats cards ───── */}
                {isLoading ? <StatsSkeleton /> : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Prezențe',           value: stats.present,     icon: CheckCircle, color: 'text-emerald-500', iconBg: 'bg-emerald-500/10' },
                            { label: 'Absențe',            value: stats.absent,      icon: XCircle,     color: 'text-red-500',     iconBg: 'bg-red-500/10'     },
                            { label: 'Procent prezență',   value: `${stats.pct}%`,   icon: BarChart3,   color: 'text-sky-500',     iconBg: 'bg-sky-500/10'     },
                            { label: 'Ultima prezență',    value: stats.lastPresent, icon: Calendar,    color: 'text-purple-500',  iconBg: 'bg-purple-500/10'  },
                        ].map(card => (
                            <div
                                key={card.label}
                                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{card.label}</span>
                                    <div className={clsx('p-2 rounded-lg', card.iconBg)}>
                                        <card.icon size={18} className={card.color} />
                                    </div>
                                </div>
                                <p className={clsx('text-2xl font-extrabold', card.color)}>{card.value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* ───── Legend ───── */}
                <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm mt-8 mb-4">
                    <span className="text-xs font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest mr-2">Legendă:</span>
                    {legendItems.map(item => {
                        const c = getStatusColor(item.status);
                        return (
                            <div key={item.status} className={clsx("flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider", c.bg, c.text)}>
                                <span className={clsx('w-1.5 h-1.5 rounded-full', c.dot)} />
                                {item.label}
                            </div>
                        );
                    })}
                </div>

                {/* ───── Calendar + Detail panel ───── */}
                <div ref={calendarRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Calendar (8 cols) */}
                    <div className="lg:col-span-8">
                        {isLoading ? <CalendarSkeleton /> : (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                                {/* Month nav */}
                                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                                    <button
                                        onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white capitalize">{monthLabel}</h3>
                                    <button
                                        onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>

                                <div className="p-4">
                                    {/* Weekday headers */}
                                    <div className="grid grid-cols-7 gap-1 mb-1">
                                        {weekdays.map(d => (
                                            <div key={d} className="text-center text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 py-2">{d}</div>
                                        ))}
                                    </div>

                                    {/* Day cells */}
                                    <div className="grid grid-cols-7 gap-1">
                                        {/* Empty offset */}
                                        {Array.from({ length: firstDayOffset }).map((_, i) => (
                                            <div key={`empty-${i}`} className="min-h-[72px] rounded-lg" />
                                        ))}

                                        {Array.from({ length: daysInMonth }, (_, idx) => {
                                            const day = idx + 1;
                                            const iso = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                            const bookings = bookingsByDate.get(iso) ?? [];
                                            const record = attendanceByDate.get(iso);
                                            const hasTraining = bookings.length > 0;
                                            const isToday = iso === todayISO;
                                            const isSelected = iso === selectedDay;
                                            const isFuture = iso > todayISO;

                                            let dayStatus: string | null = null;
                                            if (record) dayStatus = record.status;
                                            else if (hasTraining && isFuture) dayStatus = 'upcoming';

                                            const colors = dayStatus ? getStatusColor(dayStatus) : null;

                                            return (
                                                <button
                                                    key={iso}
                                                    type="button"
                                                    onClick={() => hasTraining ? setSelectedDay(isSelected ? null : iso) : undefined}
                                                    disabled={!hasTraining}
                                                    className={clsx(
                                                        'min-h-[85px] rounded-xl p-2.5 text-left transition-all duration-300 relative group border border-transparent',
                                                        // Selected
                                                        isSelected && '!border-cyan-400 ring-2 ring-cyan-400/50 bg-cyan-50 dark:bg-cyan-900/20 shadow-md scale-[1.02] z-10',
                                                        // Today highlight
                                                        isToday && !isSelected && '!border-sky-400 bg-sky-50 dark:bg-sky-900/20',
                                                        // Hover interactions for active days
                                                        hasTraining && !isSelected && 'hover:scale-[1.02] hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 z-10',
                                                        // Has training + status
                                                        hasTraining && colors && `${colors.bg}`,
                                                        // Has training, no status yet
                                                        hasTraining && !colors && 'bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-white',
                                                        // No training (inactive)
                                                        !hasTraining && 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 opacity-70 cursor-default border-dashed border-gray-200 dark:border-gray-700',
                                                    )}
                                                >
                                                    <div className="flex items-start justify-between mb-1">
                                                        <span className={clsx(
                                                            'text-sm font-extrabold flex items-center justify-center w-6 h-6 rounded-full transition-colors',
                                                            isToday && 'bg-sky-500 text-white shadow-sm',
                                                            !isToday && !hasTraining && 'text-gray-400 dark:text-gray-600',
                                                            !isToday && hasTraining && 'text-gray-700 dark:text-gray-200 group-hover:text-host-cyan'
                                                        )}>
                                                            {day}
                                                        </span>
                                                        {dayStatus && (
                                                            <span className={clsx('px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shadow-sm', getStatusColor(dayStatus).bg, getStatusColor(dayStatus).text)}>
                                                                {getStatusLabel(dayStatus, t)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {hasTraining && (
                                                        <div className="mt-2 space-y-1">
                                                            {bookings.slice(0, 2).map(b => (
                                                                <div key={b.id} className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 truncate bg-white/60 dark:bg-black/20 px-1.5 py-0.5 rounded">
                                                                    {b.time}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Indicator for multiple sessions */}
                                                    {hasTraining && bookings.length > 2 && (
                                                        <div className="text-[9px] text-gray-400 text-right mt-0.5">+{bookings.length - 2}</div>
                                                    )}

                                                    {/* Pulse for today if it has an upcoming active training */}
                                                    {isToday && hasTraining && dayStatus === 'upcoming' && !isSelected && (
                                                        <span className="absolute top-0 right-0 flex h-2.5 w-2.5 -mt-1 -mr-1">
                                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Side panel — detail / empty state (4 cols) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            {selectedDay && selectedBookings.length > 0 ? (
                                /* ─── Day detail panel ─── */
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden animate-in slide-in-from-right-5 duration-300">
                                    {/* Panel header */}
                                    <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                                {new Date(`${selectedDay}T12:00:00`).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {selectedBookings.length} {selectedBookings.length === 1 ? 'sesiune' : 'sesiuni'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedDay(null)}
                                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    {/* Training details */}
                                    <div className="p-5 space-y-4">
                                        {selectedBookings.map(booking => {
                                            const coach = mockCoaches.find(c => c.id === booking.coachId);
                                            const course = mockCourses.find(c => c.id === booking.courseId);
                                            return (
                                                <div key={booking.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="font-bold text-gray-800 dark:text-white text-sm">{course?.title ?? 'Sesiune'}</span>
                                                        {selectedRecord && <StatusBadge status={selectedRecord.status} />}
                                                    </div>
                                                    <div className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
                                                        <div className="flex items-center gap-2">
                                                            <Clock size={14} className="text-gray-400" />
                                                            <span>{booking.time}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <CalendarDays size={14} className="text-gray-400" />
                                                            <span>Antrenor: <span className="font-semibold text-gray-700 dark:text-gray-200">{coach?.name ?? '—'}</span></span>
                                                        </div>
                                                    </div>

                                                    {/* Confirmation status */}
                                                    {selectedRecord && (
                                                        <div className="mt-3">
                                                            <span className={clsx(
                                                                'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide',
                                                                selectedRecord.confirmed !== false
                                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                            )}>
                                                                {selectedRecord.confirmed !== false
                                                                    ? t('student_dashboard.attendance.confirmed_by_teacher', { defaultValue: 'Confirmat' })
                                                                    : t('student_dashboard.attendance.pending_teacher_confirmation', { defaultValue: 'Ateapt\u0103 confirmarea' })}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {/* Action buttons */}
                                        {!selectedRecord && (
                                            <div className="flex gap-3 pt-2">
                                                <Button
                                                    variant="primary"
                                                    fullWidth
                                                    disabled={isSaving}
                                                    isLoading={isSaving}
                                                    onClick={() => handleMark(selectedDay!, selectedBookings[0].id, 'present')}
                                                    className="!bg-emerald-500 hover:!bg-emerald-600 !shadow-emerald-500/30 hover:!shadow-emerald-500/50"
                                                >
                                                    <CheckCircle size={16} />
                                                    Prezent
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    fullWidth
                                                    disabled={isSaving}
                                                    onClick={() => handleMark(selectedDay!, selectedBookings[0].id, 'absent')}
                                                    className="!border-red-500/30 !text-red-500 hover:!bg-red-500/10"
                                                >
                                                    <XCircle size={16} />
                                                    Absent
                                                </Button>
                                            </div>
                                        )}

                                        {selectedRecord && (
                                            <p className="text-xs text-gray-400 dark:text-gray-500 text-center pt-1">
                                                Prezența a fost deja marcată pentru această zi.
                                            </p>
                                        )}

                                        {/* Feedback */}
                                        {feedback && (
                                            <div className={clsx(
                                                'text-sm font-medium text-center p-2 rounded-lg',
                                                feedback.type === 'success'
                                                    ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20'
                                                    : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
                                            )}>
                                                {feedback.message}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* ─── Prompt / empty ─── */
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 text-center">
                                    <CalendarDays className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={40} />
                                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">
                                        {myBookings.length === 0 ? 'Nu ai sesiuni programate' : 'Selectează o zi din calendar'}
                                    </p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500">
                                        {myBookings.length === 0
                                            ? 'Rezervă prima ta sesiune de înot'
                                            : 'Click pe o zi cu antrenament pentru a vedea detaliile'
                                        }
                                    </p>
                                    {myBookings.length === 0 && (
                                        <Link to="/courses" className="inline-flex items-center gap-1 text-host-cyan font-bold text-sm mt-3 hover:underline">
                                            Rezervă prima sesiune <ArrowRight size={14} />
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ───── Activity list ───── */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <RotateCcw size={18} className="text-host-cyan" />
                            Activitate Recentă
                        </h3>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {recentActivity.length} înregistrări
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="p-8 flex justify-center">
                            <Loader2 className="w-6 h-6 text-host-cyan animate-spin" />
                        </div>
                    ) : recentActivity.length > 0 ? (
                        <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[400px] overflow-y-auto">
                            {recentActivity.map(record => {
                                const booking = myBookings.find(b => b.id === record.bookingId);
                                const course = booking ? mockCourses.find(c => c.id === booking.courseId) : null;
                                return (
                                    <div
                                        key={record.id}
                                        className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={clsx('p-2 rounded-lg', getStatusColor(record.status).bg)}>
                                                {record.status === 'present' ? <CheckCircle size={16} className={getStatusColor(record.status).text} /> :
                                                 record.status === 'absent' || record.status === 'absent_medical' ? <XCircle size={16} className={getStatusColor(record.status).text} /> :
                                                 <RotateCcw size={16} className={getStatusColor(record.status).text} />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                                                    {course?.title ?? `Sesiune ${record.bookingId}`}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{record.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <StatusBadge status={record.status} />
                                            {record.confirmed !== undefined && (
                                                <span className={clsx(
                                                    'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                                                    record.confirmed ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                                     : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                                                )}>
                                                    {record.confirmed ? 'Confirmat' : 'Neconfirmat'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <Calendar className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={40} />
                            <p className="text-gray-500 font-medium mb-1">Nicio înregistrare de prezență</p>
                            <p className="text-sm text-gray-400">Prezențele vor apărea aici după marcarea lor</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
