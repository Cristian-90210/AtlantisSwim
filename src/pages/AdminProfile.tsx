import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { Shield, Bell, User as UserIcon, Activity, Calendar, Users, BarChart3, Clock, FileText, CreditCard, Edit2, Trophy, CheckCircle, XCircle, RotateCcw, Gift, Send, Save, ChevronLeft, ChevronRight, MessageCircle, Inbox, Star } from 'lucide-react';

import { Button } from '../components/Button';
import { useTranslation } from 'react-i18next';
import { mockStudents, mockCoaches, mockBookings } from '../data/mockData';
import type { StudentNote, Subscription, CoachScheduleSlot, SwimmingResult, AttendanceRecord, SpecialOffer, SwimStyle, SwimDistance } from '../types';
import { noteService, subscriptionService, scheduleService, resultsService, attendanceService, offerService } from '../services/api';
import { clsx } from 'clsx';

export const AdminProfile: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const role = user?.role || 'student';

    // Role-based tab access
    const roleTabs: Record<string, string[]> = {
        admin: ['overview', 'notes', 'subscriptions', 'schedule', 'attendance', 'results', 'offers'],
        coach: ['schedule', 'attendance', 'results', 'messages', 'requests'],
        student: ['subscriptions', 'calendar', 'attendance', 'results', 'recovery'],
    };
    const allowedTabs = roleTabs[role] || roleTabs.student;
    const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'subscriptions' | 'schedule' | 'attendance' | 'results' | 'offers' | 'calendar' | 'recovery' | 'messages' | 'requests'>(allowedTabs[0] as any);

    // Data states
    const [notes, setNotes] = useState<StudentNote[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [scheduleSlots, setScheduleSlots] = useState<CoachScheduleSlot[]>([]);
    const [allResults, setAllResults] = useState<SwimmingResult[]>([]);
    const [allAttendance, setAllAttendance] = useState<AttendanceRecord[]>([]);
    const [offers, setOffers] = useState<SpecialOffer[]>([]);

    // Student-specific states
    const [mySubscription, setMySubscription] = useState<Subscription | null>(null);
    const [studentAttendance, setStudentAttendance] = useState<AttendanceRecord[]>([]);
    const [studentResults, setStudentResults] = useState<SwimmingResult[]>([]);
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [scheduledTrainings, setScheduledTrainings] = useState<{ date: string; time: string; id: string }[]>([]);
    const [recoveryDate, setRecoveryDate] = useState<string>('');
    const [recoveryTime, setRecoveryTime] = useState<string>('');

    // Form states
    const [noteForm, setNoteForm] = useState({ studentId: 's1', content: '' });
    const [scheduleForm, setScheduleForm] = useState({ coachId: 'c1', dayOfWeek: 'Monday', startTime: '09:00', endTime: '11:00', maxStudents: 8 });
    const [resultForm, setResultForm] = useState({ studentId: 's1', coachId: 'c1', style: 'freestyle' as SwimStyle, distance: '25m' as SwimDistance, time: '' });
    const [offerForm, setOfferForm] = useState({ studentId: 's1', title: '', description: '', discount: 10, validUntil: '2026-03-15' });
    const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

    // Student bookings
    const studentBookings = useMemo(() => {
        if (role !== 'student' || !user) return [];
        return mockBookings.filter(b => b.studentId === user.id);
    }, [user, role]);

    useEffect(() => {
        noteService.getAll().then(setNotes);
        subscriptionService.getAll().then(setSubscriptions);
        scheduleService.getAll().then(setScheduleSlots);
        resultsService.getAll().then(setAllResults);
        attendanceService.getAll().then(setAllAttendance);
        offerService.getAll().then(setOffers);

        // Student-specific data
        if (role === 'student' && user) {
            subscriptionService.getByStudent(user.id).then(sub => setMySubscription(sub || null));
            attendanceService.getByStudent(user.id).then(setStudentAttendance);
            resultsService.getByStudent(user.id).then(setStudentResults);
        }
    }, [role, user]);

    const stats = [
        { label: 'Total Students', value: mockStudents.length.toString(), sub: 'Active accounts', icon: Users, color: 'text-host-blue' },
        { label: 'New Today', value: '12', sub: 'Registrations', icon: UserIcon, color: 'text-host-cyan' },
        { label: 'This Week', value: '45', sub: 'Registrations', icon: Calendar, color: 'text-purple-500' },
        { label: 'This Month', value: '189', sub: 'Registrations', icon: BarChart3, color: 'text-indigo-500' },
        { label: 'Total Courses', value: '24', sub: 'All categories', icon: Activity, color: 'text-green-500' },
        { label: 'Courses Today', value: '8', sub: 'Sessions scheduled', icon: Clock, color: 'text-emerald-500' },
        { label: 'Week Sessions', value: '42', sub: 'Completed', icon: Calendar, color: 'text-teal-500' },
        { label: 'Month Sessions', value: '156', sub: 'Completed', icon: BarChart3, color: 'text-cyan-500' },
    ];

    // Handlers
    const handleAddNote = async () => {
        if (!noteForm.content.trim() || !user) return;
        const student = mockStudents.find(s => s.id === noteForm.studentId);
        const newNote = await noteService.create({
            studentId: noteForm.studentId,
            studentName: student?.name || '',
            content: noteForm.content,
            authorId: user.id,
            authorName: user.name,
        });
        setNotes(prev => [...prev, newNote]);
        setNoteForm(prev => ({ ...prev, content: '' }));
    };

    const handleSaveSchedule = async () => {
        const coach = mockCoaches.find(c => c.id === scheduleForm.coachId);
        if (editingScheduleId) {
            const updated = await scheduleService.update(editingScheduleId, {
                ...scheduleForm,
                coachName: coach?.name || '',
                currentStudents: 0,
            });
            setScheduleSlots(prev => prev.map(s => s.id === editingScheduleId ? updated : s));
            setEditingScheduleId(null);
        } else {
            const newSlot = await scheduleService.create({
                ...scheduleForm,
                coachName: coach?.name || '',
                currentStudents: 0,
            });
            setScheduleSlots(prev => [...prev, newSlot]);
        }
        setScheduleForm({ coachId: 'c1', dayOfWeek: 'Monday', startTime: '09:00', endTime: '11:00', maxStudents: 8 });
    };

    const handleEditSchedule = (slot: CoachScheduleSlot) => {
        setScheduleForm({
            coachId: slot.coachId,
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            maxStudents: slot.maxStudents,
        });
        setEditingScheduleId(slot.id);
    };

    const handleAddResult = async () => {
        if (!resultForm.time) return;
        const newResult = await resultsService.create({
            ...resultForm,
            date: new Date().toISOString().split('T')[0],
        });
        setAllResults(prev => [...prev, newResult]);
        setResultForm(prev => ({ ...prev, time: '' }));
    };

    const handleSendOffer = async () => {
        if (!offerForm.title || !user) return;
        const student = mockStudents.find(s => s.id === offerForm.studentId);
        const newOffer = await offerService.send({
            studentId: offerForm.studentId,
            studentName: student?.name || '',
            title: offerForm.title,
            description: offerForm.description,
            discount: offerForm.discount,
            validUntil: offerForm.validUntil,
            sentBy: user.id,
            sentByName: 'Admin', // Assuming Admin for now
        });
        setOffers(prev => [...prev, newOffer]);
        setOfferForm({ studentId: 's1', title: '', description: '', discount: 10, validUntil: '2026-03-15' });
    };

    const allTabs = [
        { key: 'overview' as const, label: 'Overview', icon: Activity },
        { key: 'notes' as const, label: 'Note Elevi', icon: FileText },
        { key: 'subscriptions' as const, label: role === 'student' ? 'Abonamentul Meu' : 'Abonamente', icon: CreditCard },
        { key: 'schedule' as const, label: role === 'coach' ? 'Programul Meu' : 'Orar Antrenori', icon: Calendar },
        { key: 'calendar' as const, label: 'Calendar Antrenamente', icon: Calendar },
        { key: 'attendance' as const, label: role === 'student' ? 'Prezența Mea' : 'Prezență', icon: CheckCircle },
        { key: 'results' as const, label: role === 'student' ? 'Rezultatele Mele' : 'Rezultate', icon: Trophy },
        { key: 'recovery' as const, label: 'Recuperări', icon: RotateCcw },
        { key: 'offers' as const, label: 'Oferte Speciale', icon: Gift },
        { key: 'messages' as const, label: 'Mesaje', icon: MessageCircle },
        { key: 'requests' as const, label: 'Cereri', icon: Inbox },
    ];
    const tabs = allTabs.filter(tab => allowedTabs.includes(tab.key));

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20">
            <PageHeader
                title={<>{role === 'admin' ? 'ADMIN' : role === 'coach' ? 'COACH' : 'STUDENT'} <span className="text-host-cyan">DASHBOARD</span></>}
                subtitle={role === 'admin' ? 'Comprehensive overview of platform activity and performance.' : role === 'coach' ? 'Training overview and student management.' : 'Your personal overview and progress.'}
            />

            <div className="container mx-auto px-6 -mt-10 relative z-20 space-y-8">

                {/* Info Banner - Admin Only */}
                {role === 'admin' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-host-blue p-6 rounded-r-xl shadow-sm flex items-start space-x-4">
                        <div className="bg-host-blue p-2 rounded-full text-white shadow-lg shadow-blue-200/50 dark:shadow-none">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                                {t('admin_dashboard.welcome', { defaultValue: 'Admin Administration Zone' })}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                {t('admin_dashboard.info', { defaultValue: 'This area is restricted to administrators. Here you can manage user roles, monitor platform activity, and configure system settings. Changes made here affect the entire platform.' })}
                            </p>
                        </div>
                    </div>
                )}

                {/* Management Quick Links - Admin Only */}
                {role === 'admin' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Button onClick={() => window.location.href = '/admin/users'} variant="primary" className="h-auto py-4 justify-start text-left group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="bg-white/20 p-2 rounded-lg mr-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                <Users className="w-6 h-6 animate-pulse" />
                            </div>
                            <div>
                                <div className="font-bold text-lg">Manage Users</div>
                                <div className="text-xs opacity-70 font-normal">Roles, Status & Accounts</div>
                            </div>
                        </Button>
                        <Button onClick={() => window.location.href = '/admin/reservations'} variant="primary" className="h-auto py-4 justify-start text-left group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="bg-white/20 p-2 rounded-lg mr-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                                <Calendar className="w-6 h-6 animate-pulse" />
                            </div>
                            <div>
                                <div className="font-bold text-lg">Reservations</div>
                                <div className="text-xs opacity-70 font-normal">Bookings & Schedules</div>
                            </div>
                        </Button>
                        <Button onClick={() => window.location.href = '/admin/announcements'} variant="primary" className="h-auto py-4 justify-start text-left group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="bg-white/20 p-2 rounded-lg mr-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                <Bell className="w-6 h-6 animate-pulse" />
                            </div>
                            <div>
                                <div className="font-bold text-lg">Announcements</div>
                                <div className="text-xs opacity-70 font-normal">System & Broadcasts</div>
                            </div>
                        </Button>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 justify-center mt-16 mb-8">
                    {tabs.map(tab => (
                        <Button
                            key={tab.key}
                            variant="tab"
                            active={activeTab === tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className="whitespace-nowrap"
                        >
                            <tab.icon size={16} />
                            <span>{tab.label}</span>
                        </Button>
                    ))}
                </div>

                {/* Overview Tab */}
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {role === 'student' ? (
                            <>
                                <div className="rounded-2xl overflow-hidden shadow-2xl relative group">
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent z-10 pointer-events-none" />
                                    <video
                                        src="https://atlantisswim.md/wp-content/uploads/2025/08/IMG_2742.mov"
                                        className="w-full h-[300px] md:h-[450px] object-cover transition-transform duration-1000 group-hover:scale-105"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        controls
                                    />
                                    <div className="absolute bottom-0 left-0 p-8 z-20 text-white max-w-2xl">
                                        <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight drop-shadow-lg">
                                            Bine ai venit{user ? `, ${user.name.split(' ')[0]}` : ''}!
                                        </h2>
                                        <p className="text-lg text-gray-200 font-medium drop-shadow-md italic">
                                            "Succesul nu este final, eșecul nu este fatal: curajul de a continua contează."
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border-l-4 border-l-host-cyan flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-1">Status Abonament</p>
                                            <p className="text-2xl font-extrabold text-host-cyan">Activ</p>
                                        </div>
                                        <div className="bg-cyan-50 dark:bg-cyan-900/30 p-3 rounded-full text-host-cyan">
                                            <CreditCard size={24} />
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border-l-4 border-l-host-blue flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-1">Următoarea Sesiune</p>
                                            <p className="text-xl font-bold text-gray-800 dark:text-white">Azi, 18:00</p>
                                        </div>
                                        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-full text-host-blue">
                                            <Calendar size={24} />
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border-t-4 border-t-host-cyan">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                                        <Activity className="w-5 h-5 mr-2 text-host-cyan" />
                                        Platform Statistics
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {stats.map((stat, idx) => (
                                            <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className={`text-2xl font-extrabold ${stat.color} dark:text-white`}>{stat.value}</p>
                                                        <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                                                    </div>
                                                    <div className={`p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm ${stat.color}`}>
                                                        <stat.icon size={20} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Card header="Recent Logins & Activity" className="border-t-4 border-t-host-blue">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">User / IP</th>
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">First Visit</th>
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Last Visit</th>
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Visits</th>
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Agent</th>
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                {mockStudents.slice(0, 5).map((s, i) => (
                                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                        <td className="p-4">
                                                            <div className="font-bold text-host-blue dark:text-host-cyan">{s.name}</div>
                                                            <div className="text-xs text-gray-400">192.168.1.{10 + i}</div>
                                                        </td>
                                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300">12.02.2026, 09:00</td>
                                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300">Today, 10:{30 + i}</td>
                                                        <td className="p-4">
                                                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">{1 + i * 2}</span>
                                                        </td>
                                                        <td className="p-4 text-sm text-gray-500 truncate max-w-[150px]">
                                                            Mozilla/5.0 (Windows NT 10.0...
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <Button variant="secondary" className="px-3 py-1 bg-red-100 text-red-600 hover:bg-red-500 hover:text-white border-transparent h-auto text-xs">
                                                                Block
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </>
                        )}
                    </div>
                )}

                {/* Notes Tab */}
                {activeTab === 'notes' && (
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                                <FileText className="mr-2 text-host-cyan" size={20} />
                                Adaugă Notă pentru Elev
                            </h3>
                            <div className="flex flex-col md:flex-row gap-4">
                                <select
                                    value={noteForm.studentId}
                                    onChange={e => setNoteForm(prev => ({ ...prev, studentId: e.target.value }))}
                                    className="rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 md:w-48"
                                >
                                    {mockStudents.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    value={noteForm.content}
                                    onChange={e => setNoteForm(prev => ({ ...prev, content: e.target.value }))}
                                    onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                                    placeholder="Scrie o notă..."
                                    className="flex-1 rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                />
                                <button
                                    onClick={handleAddNote}
                                    className="bg-host-cyan text-white rounded-lg px-6 py-2 text-sm font-bold hover:bg-host-blue transition-colors"
                                >
                                    Salvează
                                </button>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Toate Notele</h2>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {notes.map(n => (
                                    <div key={n.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="font-bold text-host-blue dark:text-host-cyan">{n.studentName}</span>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{n.content}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                                                <div className="text-xs text-gray-500 mt-1">de {n.authorName}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Subscriptions Tab */}
                {activeTab === 'subscriptions' && (
                    role === 'student' ? (
                        <div className="space-y-6">
                            {mySubscription ? (() => {
                                const remaining = mySubscription.sessionsTotal - mySubscription.sessionsUsed;
                                const percent = Math.round((mySubscription.sessionsUsed / mySubscription.sessionsTotal) * 100);
                                const isExpired = new Date(mySubscription.expiryDate) < new Date();
                                return (
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                                        <div className="bg-gradient-to-r from-host-blue to-host-cyan p-6 text-white">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <CreditCard size={28} />
                                                <h2 className="text-2xl font-bold">Abonamentul Meu</h2>
                                            </div>
                                            <p className="text-blue-100 text-sm">Abonament activ • {mySubscription.studentName}</p>
                                        </div>
                                        <div className="p-6 space-y-6">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Suma Plătită</p>
                                                    <p className="text-2xl font-extrabold text-host-cyan">{mySubscription.amount} MDL</p>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Sesiuni Totale</p>
                                                    <p className="text-2xl font-extrabold text-gray-800 dark:text-white">{mySubscription.sessionsTotal}</p>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Sesiuni Rămase</p>
                                                    <p className={clsx("text-2xl font-extrabold", remaining === 0 ? "text-red-500" : remaining <= 3 ? "text-yellow-500" : "text-green-500")}>{remaining}</p>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</p>
                                                    <span className={clsx("inline-block px-3 py-1 rounded-full text-xs font-bold uppercase", isExpired ? "bg-red-100 text-red-700" : remaining === 0 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700")}>
                                                        {isExpired ? 'Expirat' : remaining === 0 ? 'Terminat' : 'Activ'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-gray-600 dark:text-gray-400">Progres sesiuni</span>
                                                    <span className="font-bold text-gray-800 dark:text-white">{mySubscription.sessionsUsed} / {mySubscription.sessionsTotal}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                                                    <div className={clsx("h-full rounded-full transition-all duration-500", percent >= 90 ? "bg-red-500" : percent >= 70 ? "bg-yellow-500" : "bg-gradient-to-r from-host-cyan to-host-blue")} style={{ width: `${percent}%` }} />
                                                </div>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                                                <span>Data plății: <span className="font-bold text-gray-700 dark:text-gray-300">{mySubscription.paidDate}</span></span>
                                                <span>Expiră: <span className="font-bold text-gray-700 dark:text-gray-300">{mySubscription.expiryDate}</span></span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })() : (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                                    <CreditCard className="mx-auto mb-4 text-gray-300" size={48} />
                                    <p className="text-gray-500 font-medium">Nu ai un abonament activ</p>
                                    <p className="text-gray-400 text-sm mt-1">Vizitează pagina de cursuri pentru a achiziționa un abonament</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-3">
                                <CreditCard className="text-host-cyan" size={24} />
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Abonamente & Plăți</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4 font-semibold">Elev</th>
                                            <th className="p-4 font-semibold">Data Plății</th>
                                            <th className="p-4 font-semibold">Sumă</th>
                                            <th className="p-4 font-semibold">Sesiuni</th>
                                            <th className="p-4 font-semibold">Rămase</th>
                                            <th className="p-4 font-semibold">Expiră</th>
                                            <th className="p-4 font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {subscriptions.map(sub => {
                                            const remaining = sub.sessionsTotal - sub.sessionsUsed;
                                            const isExpired = new Date(sub.expiryDate) < new Date();
                                            return (
                                                <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                    <td className="p-4 font-bold text-gray-800 dark:text-gray-200">{sub.studentName}</td>
                                                    <td className="p-4 text-gray-500">{sub.paidDate}</td>
                                                    <td className="p-4 font-bold text-host-cyan">{sub.amount} RON</td>
                                                    <td className="p-4 text-gray-600 dark:text-gray-300">{sub.sessionsUsed} / {sub.sessionsTotal}</td>
                                                    <td className="p-4">
                                                        <span className={clsx("font-bold text-lg", remaining === 0 ? "text-red-500" : remaining <= 3 ? "text-yellow-500" : "text-green-500")}>{remaining}</span>
                                                    </td>
                                                    <td className="p-4 text-gray-500">{sub.expiryDate}</td>
                                                    <td className="p-4">
                                                        <span className={clsx("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide", isExpired ? "bg-red-100 text-red-700" : remaining === 0 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700")}>
                                                            {isExpired ? 'Expirat' : remaining === 0 ? 'Terminat' : 'Activ'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                )}

                {/* Schedule & Attendance Tab (Coach View) */}
                {activeTab === 'schedule' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {role === 'coach' ? (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                                        <Calendar className="mr-2 text-host-cyan" />
                                        Programul Meu & Prezență
                                    </h2>
                                    <div className="flex space-x-2">
                                        <Button variant="secondary" className="text-sm">Săptămâna Aceasta</Button>
                                        <Button variant="primary" className="text-sm">Azi</Button>
                                    </div>
                                </div>

                                {/* Today's Classes */}
                                <div className="space-y-6">
                                    {['09:00', '10:30', '16:00', '17:30'].map((time, idx) => (
                                        <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-l-4 border-l-host-cyan overflow-hidden">
                                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/20">
                                                <div>
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-2xl font-black text-gray-800 dark:text-white">{time}</span>
                                                        <span className="px-3 py-1 rounded-full bg-host-cyan/10 text-host-cyan text-xs font-bold uppercase tracking-wider">
                                                            Grupa {idx % 2 === 0 ? 'Începători' : 'Avansați'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        <Users className="inline w-4 h-4 mr-1" />
                                                        {8 + idx} Elevi înscriși
                                                    </p>
                                                </div>
                                                <Button variant="secondary" className="text-xs">Vezi Detalii</Button>
                                            </div>

                                            {/* Student List for Attendance */}
                                            <div className="p-0">
                                                <table className="w-full text-left">
                                                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                                                        <tr>
                                                            <th className="p-4 font-semibold pl-6">Nume Elev</th>
                                                            <th className="p-4 font-semibold">Status</th>
                                                            <th className="p-4 font-semibold text-right pr-6">Acțiune</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                        {mockStudents.slice(0, 4 + idx).map(s => (
                                                            <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                                <td className="p-4 pl-6 font-bold text-gray-700 dark:text-gray-200 flex items-center">
                                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center text-white text-xs mr-3 font-bold shadow-sm">
                                                                        {s.name.charAt(0)}
                                                                    </div>
                                                                    {s.name}
                                                                </td>
                                                                <td className="p-4">
                                                                    <span className="text-xs font-bold text-gray-400 uppercase">Nesetat</span>
                                                                </td>
                                                                <td className="p-4 text-right pr-6">
                                                                    <div className="flex justify-end space-x-2">
                                                                        <button className="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all" title="Prezent">
                                                                            <CheckCircle size={16} />
                                                                        </button>
                                                                        <button className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all" title="Absent">
                                                                            <XCircle size={16} />
                                                                        </button>
                                                                        <button className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-500 hover:text-white flex items-center justify-center transition-all" title="Recuperare">
                                                                            <RotateCcw size={16} />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            // Existing Admin/Other Schedule View
                            <div className="space-y-8">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                                        <Calendar className="mr-2 text-host-cyan" size={20} />
                                        {editingScheduleId ? 'Editează Slot Orar' : 'Adaugă Slot Orar'}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                        <select
                                            value={scheduleForm.coachId}
                                            onChange={e => setScheduleForm(prev => ({ ...prev, coachId: e.target.value }))}
                                            className="rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                        >
                                            {mockCoaches.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={scheduleForm.dayOfWeek}
                                            onChange={e => setScheduleForm(prev => ({ ...prev, dayOfWeek: e.target.value }))}
                                            className="rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                        >
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="time"
                                            value={scheduleForm.startTime}
                                            onChange={e => setScheduleForm(prev => ({ ...prev, startTime: e.target.value }))}
                                            className="rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                        />
                                        <input
                                            type="time"
                                            value={scheduleForm.endTime}
                                            onChange={e => setScheduleForm(prev => ({ ...prev, endTime: e.target.value }))}
                                            className="rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                        />
                                        <input
                                            type="number"
                                            value={scheduleForm.maxStudents}
                                            onChange={e => setScheduleForm(prev => ({ ...prev, maxStudents: Number(e.target.value) }))}
                                            placeholder="Max elevi"
                                            className="rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                        />
                                        <button
                                            onClick={handleSaveSchedule}
                                            className="bg-host-cyan text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-host-blue transition-colors flex items-center justify-center"
                                        >
                                            <Save size={16} className="mr-1" /> {editingScheduleId ? 'Actualizează' : 'Adaugă'}
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Orar Complet Antrenori</h2>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                                                <tr>
                                                    <th className="p-4 font-semibold">Antrenor</th>
                                                    <th className="p-4 font-semibold">Zi</th>
                                                    <th className="p-4 font-semibold">Interval</th>
                                                    <th className="p-4 font-semibold">Max Elevi</th>
                                                    <th className="p-4 font-semibold">Ocupare</th>
                                                    <th className="p-4 font-semibold text-right">Acțiuni</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                {scheduleSlots.map(slot => (
                                                    <tr key={slot.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                        <td className="p-4 font-bold text-host-blue dark:text-host-cyan">{slot.coachName}</td>
                                                        <td className="p-4 text-gray-700 dark:text-gray-300">{slot.dayOfWeek}</td>
                                                        <td className="p-4 text-gray-600 dark:text-gray-400">{slot.startTime} - {slot.endTime}</td>
                                                        <td className="p-4 font-bold text-gray-800 dark:text-white">{slot.maxStudents}</td>
                                                        <td className="p-4">
                                                            <span className="font-bold text-host-cyan">{slot.currentStudents}</span>
                                                            <span className="text-gray-400"> / {slot.maxStudents}</span>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <button
                                                                onClick={() => handleEditSchedule(slot)}
                                                                className="text-gray-300 hover:text-host-cyan transition-colors p-1 rounded hover:bg-cyan-50"
                                                            >
                                                                <Edit2 size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Messages Tab (Coach) */}
                {activeTab === 'messages' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 h-[600px] flex overflow-hidden">
                        {/* Sidebar */}
                        <div className="w-1/3 border-r border-gray-100 dark:border-gray-700 flex flex-col">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                <input
                                    type="text"
                                    placeholder="Caută elev..."
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-host-cyan"
                                />
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {mockStudents.slice(0, 5).map((s, i) => (
                                    <div key={s.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${i === 0 ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-host-cyan' : ''}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-gray-800 dark:text-white">{s.name}</span>
                                            <span className="text-xs text-gray-400">10:30</span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            Bună ziua, aș dori să reprogramăm...
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Chat Area */}
                        <div className="w-2/3 flex flex-col bg-gray-50/30 dark:bg-gray-900/50">
                            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <h3 className="font-bold text-gray-800 dark:text-white">{mockStudents[0].name}</h3>
                                <div className="text-xs text-green-500 font-bold flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                                    Online
                                </div>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%] text-sm text-gray-600 dark:text-gray-300">
                                        Bună ziua, aș dori să reprogramăm ședința de mâine.
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="bg-host-cyan text-white p-3 rounded-2xl rounded-tr-none shadow-md max-w-[80%] text-sm">
                                        Salut! Sigur, ce oră ar fi potrivită pentru tine?
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex space-x-2">
                                <input
                                    type="text"
                                    placeholder="Scrie un mesaj..."
                                    className="flex-1 bg-gray-50 dark:bg-gray-900 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-host-cyan"
                                />
                                <button className="p-3 bg-host-cyan text-white rounded-xl hover:bg-host-blue transition-colors">
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Requests Tab (Recovery/Trials) */}
                {activeTab === 'requests' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {/* Trials */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="bg-purple-600 p-6 text-white flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center">
                                        <Star className="mr-2" /> Cereri Încercare (Trial)
                                    </h2>
                                    <p className="text-purple-100 text-sm mt-1">Viitori elevi programați pentru evaluare</p>
                                </div>
                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">3 Cereri</span>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-left">
                                    <thead className="bg-purple-50 dark:bg-purple-900/10 text-gray-500 uppercase text-xs">
                                        <tr>
                                            <th className="p-4 font-semibold">Nume Copil</th>
                                            <th className="p-4 font-semibold">Vârstă</th>
                                            <th className="p-4 font-semibold">Părinte</th>
                                            <th className="p-4 font-semibold">Data Programată</th>
                                            <th className="p-4 font-semibold text-right">Acțiuni</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {[1, 2, 3].map(i => (
                                            <tr key={i} className="hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors">
                                                <td className="p-4 font-bold text-gray-800 dark:text-white">Matei Popescu</td>
                                                <td className="p-4 text-gray-600">7 ani</td>
                                                <td className="p-4 text-gray-600">Ion Popescu (07xx...)</td>
                                                <td className="p-4 font-bold text-purple-600">Luni, 16:00</td>
                                                <td className="p-4 text-right">
                                                    <Button variant="primary" className="text-xs h-8 px-3">Confirmă</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recovery */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="bg-orange-500 p-6 text-white flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center">
                                        <RotateCcw className="mr-2" /> Cereri Recuperare
                                    </h2>
                                    <p className="text-orange-100 text-sm mt-1">Elevi care recuperează absențe</p>
                                </div>
                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">5 Cereri</span>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 p-4 rounded-xl flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-gray-800 dark:text-white">Elena Radu</p>
                                            <p className="text-xs text-gray-500">Absență: 12.02.2026</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-orange-600">Marți, 17:00</p>
                                            <button className="text-xs text-gray-400 underline hover:text-orange-500">Detalii</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Attendance Tab */}
                {activeTab === 'attendance' && (
                    role === 'student' ? (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-3">
                                    <CheckCircle className="text-green-500" size={24} />
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Prezența Mea</h2>
                                </div>
                                <div className="p-6 grid grid-cols-3 gap-4 border-b border-gray-100 dark:border-gray-700">
                                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-extrabold text-green-600">{studentAttendance.filter(a => a.status === 'present').length}</p>
                                        <p className="text-xs font-bold text-green-500 uppercase">Prezent</p>
                                    </div>
                                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-extrabold text-red-600">{studentAttendance.filter(a => a.status === 'absent').length}</p>
                                        <p className="text-xs font-bold text-red-500 uppercase">Absent</p>
                                    </div>
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-extrabold text-yellow-600">{studentAttendance.filter(a => a.status === 'recovery').length}</p>
                                        <p className="text-xs font-bold text-yellow-500 uppercase">Recuperări</p>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                                            <tr>
                                                <th className="p-4 font-semibold">Data</th>
                                                <th className="p-4 font-semibold">Status</th>
                                                <th className="p-4 font-semibold">Acțiuni</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {studentAttendance.length > 0 ? studentAttendance.map(a => (
                                                <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                    <td className="p-4 font-bold text-gray-800 dark:text-gray-200">{a.date}</td>
                                                    <td className="p-4">
                                                        <span className={clsx(
                                                            "px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center w-fit",
                                                            a.status === 'present' ? "bg-green-100 text-green-700" :
                                                                a.status === 'absent' ? "bg-red-100 text-red-700" :
                                                                    "bg-yellow-100 text-yellow-700"
                                                        )}>
                                                            {a.status === 'present' ? <><CheckCircle className="w-3 h-3 mr-1" /> Prezent</> :
                                                                a.status === 'absent' ? <><XCircle className="w-3 h-3 mr-1" /> Absent</> :
                                                                    <><RotateCcw className="w-3 h-3 mr-1" /> Recuperare</>}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        {a.status === 'absent' && (
                                                            <button onClick={() => setActiveTab('recovery' as any)} className="text-xs font-bold text-host-cyan hover:underline flex items-center">
                                                                <RotateCcw size={12} className="mr-1" /> Programează recuperare
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan={3} className="p-8 text-center text-gray-400">Nu ai înregistrări de prezență</td></tr>
                                            )}
                                            {studentBookings.filter(b => b.status === 'upcoming' && !studentAttendance.some(a => a.bookingId === b.id)).map(b => (
                                                <tr key={b.id} className="bg-blue-50/50 dark:bg-blue-900/10">
                                                    <td className="p-4 font-bold text-gray-800 dark:text-gray-200">{b.date} • {b.time}</td>
                                                    <td className="p-4">
                                                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase">Programat</span>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={async () => {
                                                                    if (!user) return;
                                                                    const record = await attendanceService.mark({ bookingId: b.id, studentId: user.id, date: b.date, status: 'present', markedBy: user.id });
                                                                    setStudentAttendance(prev => [...prev, record]);
                                                                }}
                                                                className="px-3 py-1 rounded-lg bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-colors flex items-center"
                                                            >
                                                                <CheckCircle size={12} className="mr-1" /> Prezent
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    if (!user) return;
                                                                    const record = await attendanceService.mark({ bookingId: b.id, studentId: user.id, date: b.date, status: 'absent', markedBy: user.id });
                                                                    setStudentAttendance(prev => [...prev, record]);
                                                                }}
                                                                className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors flex items-center"
                                                            >
                                                                <XCircle size={12} className="mr-1" /> Absent
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-3">
                                <CheckCircle className="text-green-500" size={24} />
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Prezență – Toate Înregistrările</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4 font-semibold">Elev</th>
                                            <th className="p-4 font-semibold">Data</th>
                                            <th className="p-4 font-semibold">Status</th>
                                            <th className="p-4 font-semibold">Marcat de</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {allAttendance.map(a => {
                                            const student = mockStudents.find(s => s.id === a.studentId);
                                            return (
                                                <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                    <td className="p-4 font-bold text-gray-800 dark:text-gray-200">{student?.name || a.studentId}</td>
                                                    <td className="p-4 text-gray-500">{a.date}</td>
                                                    <td className="p-4">
                                                        <span className={clsx(
                                                            "px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center w-fit",
                                                            a.status === 'present' ? "bg-green-100 text-green-700" :
                                                                a.status === 'absent' ? "bg-red-100 text-red-700" :
                                                                    "bg-yellow-100 text-yellow-700"
                                                        )}>
                                                            {a.status === 'present' ? <><CheckCircle className="w-3 h-3 mr-1" /> Prezent</> :
                                                                a.status === 'absent' ? <><XCircle className="w-3 h-3 mr-1" /> Absent</> :
                                                                    <><RotateCcw className="w-3 h-3 mr-1" /> Recuperare</>}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-gray-500 text-sm">{a.markedBy}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                )}

                {/* Results Tab */}
                {activeTab === 'results' && (
                    role === 'student' ? (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <Trophy size={28} />
                                        <h2 className="text-2xl font-bold">Rezultatele Mele</h2>
                                    </div>
                                    <p className="text-yellow-100 text-sm">{studentResults.length} rezultate înregistrate</p>
                                </div>
                                {studentResults.length > 0 ? (
                                    <div className="p-6 space-y-6">
                                        {Object.entries(studentResults.reduce((acc, r) => {
                                            const key = r.style;
                                            if (!acc[key]) acc[key] = [];
                                            acc[key].push(r);
                                            return acc;
                                        }, {} as Record<string, typeof studentResults>)).map(([style, results]) => (
                                            <div key={style}>
                                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                                                    <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 capitalize mr-2">{style}</span>
                                                    <span className="text-gray-400">({results.length} înregistrări)</span>
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {results.map(r => (
                                                        <div key={r.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex justify-between items-center">
                                                            <div>
                                                                <p className="font-bold text-gray-800 dark:text-white">{r.distance}</p>
                                                                <p className="text-xs text-gray-400">{r.date}</p>
                                                            </div>
                                                            <p className="text-xl font-extrabold text-host-cyan">{r.time}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center">
                                        <Trophy className="mx-auto mb-4 text-gray-300" size={48} />
                                        <p className="text-gray-500 font-medium">Nu ai rezultate înregistrate încă</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                                    <Trophy className="mr-2 text-host-cyan" size={20} />
                                    Adaugă / Modifică Rezultat
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                    <select value={resultForm.studentId} onChange={e => setResultForm(prev => ({ ...prev, studentId: e.target.value }))} className="rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600">
                                        {mockStudents.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
                                    </select>
                                    <select value={resultForm.coachId} onChange={e => setResultForm(prev => ({ ...prev, coachId: e.target.value }))} className="rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600">
                                        {mockCoaches.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                                    </select>
                                    <select value={resultForm.style} onChange={e => setResultForm(prev => ({ ...prev, style: e.target.value as SwimStyle }))} className="rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600">
                                        <option value="freestyle">Freestyle</option>
                                        <option value="backstroke">Backstroke</option>
                                        <option value="butterfly">Butterfly</option>
                                        <option value="breaststroke">Breaststroke</option>
                                    </select>
                                    <select value={resultForm.distance} onChange={e => setResultForm(prev => ({ ...prev, distance: e.target.value as SwimDistance }))} className="rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600">
                                        <option value="25m">25m</option>
                                        <option value="50m">50m</option>
                                        <option value="100m">100m</option>
                                        <option value="200m">200m</option>
                                    </select>
                                    <input type="text" value={resultForm.time} onChange={e => setResultForm(prev => ({ ...prev, time: e.target.value }))} placeholder="00:35.20" className="rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                                    <button onClick={handleAddResult} className="bg-host-cyan text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-host-blue transition-colors">Salvează</button>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Toate Rezultatele</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                                            <tr>
                                                <th className="p-4 font-semibold">Elev</th>
                                                <th className="p-4 font-semibold">Antrenor</th>
                                                <th className="p-4 font-semibold">Stil</th>
                                                <th className="p-4 font-semibold">Distanță</th>
                                                <th className="p-4 font-semibold">Timp</th>
                                                <th className="p-4 font-semibold">Data</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {allResults.map(r => {
                                                const student = mockStudents.find(s => s.id === r.studentId);
                                                const coach = mockCoaches.find(c => c.id === r.coachId);
                                                return (
                                                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                        <td className="p-4 font-bold text-gray-800 dark:text-gray-200">{student?.name || r.studentId}</td>
                                                        <td className="p-4 text-gray-500">{coach?.name || r.coachId}</td>
                                                        <td className="p-4"><span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 capitalize">{r.style}</span></td>
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
                    )
                )}

                {/* Calendar Tab (Student only) */}
                {activeTab === 'calendar' && role === 'student' && (() => {
                    const today = new Date();
                    const year = calendarMonth.getFullYear();
                    const month = calendarMonth.getMonth();
                    const firstDay = new Date(year, month, 1).getDay();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const dayNames = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'];
                    const monthNames = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
                    const availableTimes = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
                    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

                    return (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <div className="bg-gradient-to-r from-host-blue to-host-cyan p-6 text-white">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <Calendar size={28} />
                                        <h2 className="text-2xl font-bold">Calendar Antrenamente</h2>
                                    </div>
                                    <p className="text-blue-100 text-sm">Programează-ți antrenamentele (minim 1 zi în avans)</p>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <button onClick={() => setCalendarMonth(new Date(year, month - 1, 1))} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                            <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
                                        </button>
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{monthNames[month]} {year}</h3>
                                        <button onClick={() => setCalendarMonth(new Date(year, month + 1, 1))} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                            <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 mb-2">
                                        {dayNames.map(d => (
                                            <div key={d} className="text-center text-xs font-bold text-gray-400 uppercase py-2">{d}</div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1">
                                        {Array.from({ length: firstDay }, (_, i) => (
                                            <div key={`empty-${i}`} className="h-12" />
                                        ))}
                                        {Array.from({ length: daysInMonth }, (_, i) => {
                                            const day = i + 1;
                                            const cellDate = new Date(year, month, day);
                                            const isToday = cellDate.toDateString() === today.toDateString();
                                            const isPast = cellDate < tomorrow;
                                            const isSelected = selectedDate === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                            const hasTraining = scheduledTrainings.some(t => t.date === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
                                            return (
                                                <button
                                                    key={day}
                                                    disabled={isPast}
                                                    onClick={() => setSelectedDate(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
                                                    className={clsx(
                                                        "h-12 rounded-lg text-sm font-bold transition-all relative",
                                                        isPast ? "text-gray-300 dark:text-gray-600 cursor-not-allowed" :
                                                            isSelected ? "bg-host-cyan text-white shadow-lg" :
                                                                isToday ? "bg-blue-50 dark:bg-blue-900/30 text-host-blue border-2 border-host-cyan" :
                                                                    "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                                    )}
                                                >
                                                    {day}
                                                    {hasTraining && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-green-500" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {selectedDate && (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Selectează ora pentru {selectedDate}</h3>
                                    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                                        {availableTimes.map(time => (
                                            <button
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={clsx(
                                                    "p-3 rounded-xl text-sm font-bold transition-all border",
                                                    selectedTime === time
                                                        ? "bg-host-cyan text-white border-host-cyan shadow-lg"
                                                        : "bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-host-cyan"
                                                )}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                    {selectedTime && (
                                        <div className="mt-6 flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                                            <div>
                                                <p className="font-bold text-gray-800 dark:text-white">Antrenament pe {selectedDate} la {selectedTime}</p>
                                                <p className="text-sm text-gray-500">Confirmă programarea</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setScheduledTrainings(prev => [...prev, { date: selectedDate, time: selectedTime, id: Date.now().toString() }]);
                                                    setSelectedDate(null);
                                                    setSelectedTime(null);
                                                }}
                                                className="bg-green-500 text-white rounded-lg px-6 py-2 text-sm font-bold hover:bg-green-600 transition-colors flex items-center"
                                            >
                                                <CheckCircle size={16} className="mr-2" /> Confirmă
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {scheduledTrainings.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Antrenamente Programate</h2>
                                    </div>
                                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {scheduledTrainings.map(t => (
                                            <div key={t.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                <div className="flex items-center space-x-3">
                                                    <Calendar className="text-host-cyan" size={18} />
                                                    <span className="font-bold text-gray-800 dark:text-white">{t.date}</span>
                                                    <span className="text-gray-500">la</span>
                                                    <span className="font-bold text-host-cyan">{t.time}</span>
                                                </div>
                                                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase">Confirmat</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })()}

                {/* Recovery Tab (Student only) */}
                {activeTab === 'recovery' && role === 'student' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
                                <div className="flex items-center space-x-3 mb-2">
                                    <RotateCcw size={28} />
                                    <h2 className="text-2xl font-bold">Recuperări</h2>
                                </div>
                                <p className="text-yellow-100 text-sm">Programează recuperări pentru antrenamentele ratate</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Data recuperării</label>
                                        <input
                                            type="date"
                                            value={recoveryDate}
                                            onChange={e => setRecoveryDate(e.target.value)}
                                            min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                                            className="w-full rounded-lg border-gray-300 p-3 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Ora</label>
                                        <select
                                            value={recoveryTime}
                                            onChange={e => setRecoveryTime(e.target.value)}
                                            className="w-full rounded-lg border-gray-300 p-3 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                        >
                                            <option value="">Selectează ora</option>
                                            {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map(t => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            onClick={() => {
                                                if (recoveryDate && recoveryTime) {
                                                    setScheduledTrainings(prev => [...prev, { date: recoveryDate, time: recoveryTime, id: `rec-${Date.now()}` }]);
                                                    setRecoveryDate('');
                                                    setRecoveryTime('');
                                                }
                                            }}
                                            disabled={!recoveryDate || !recoveryTime}
                                            className={clsx(
                                                "w-full rounded-lg px-6 py-3 text-sm font-bold transition-colors flex items-center justify-center",
                                                recoveryDate && recoveryTime
                                                    ? "bg-host-cyan text-white hover:bg-host-blue"
                                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            )}
                                        >
                                            <RotateCcw size={16} className="mr-2" /> Programează Recuperarea
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {scheduledTrainings.filter(t => t.id.startsWith('rec-')).length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recuperări Programate</h2>
                                </div>
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {scheduledTrainings.filter(t => t.id.startsWith('rec-')).map(t => (
                                        <div key={t.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <div className="flex items-center space-x-3">
                                                <RotateCcw className="text-yellow-500" size={18} />
                                                <span className="font-bold text-gray-800 dark:text-white">{t.date}</span>
                                                <span className="text-gray-500">la</span>
                                                <span className="font-bold text-host-cyan">{t.time}</span>
                                            </div>
                                            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold uppercase">Recuperare</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Special Offers Tab */}
                {activeTab === 'offers' && (
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                                <Gift className="mr-2 text-host-cyan" size={20} />
                                Trimite Ofertă Specială
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <select
                                    value={offerForm.studentId}
                                    onChange={e => setOfferForm(prev => ({ ...prev, studentId: e.target.value }))}
                                    className="rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                >
                                    {mockStudents.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} (Părinte)</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    value={offerForm.title}
                                    onChange={e => setOfferForm(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Titlu ofertă..."
                                    className="rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <textarea
                                    value={offerForm.description}
                                    onChange={e => setOfferForm(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Descriere ofertă..."
                                    rows={2}
                                    className="rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 md:col-span-2"
                                />
                                <div className="space-y-2">
                                    <input
                                        type="number"
                                        value={offerForm.discount}
                                        onChange={e => setOfferForm(prev => ({ ...prev, discount: Number(e.target.value) }))}
                                        placeholder="Reducere %"
                                        className="w-full rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                    />
                                    <input
                                        type="date"
                                        value={offerForm.validUntil}
                                        onChange={e => setOfferForm(prev => ({ ...prev, validUntil: e.target.value }))}
                                        className="w-full rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSendOffer}
                                    className="bg-host-cyan text-white rounded-lg px-6 py-2 text-sm font-bold hover:bg-host-blue transition-colors flex items-center"
                                >
                                    <Send size={16} className="mr-2" /> Trimite Oferta
                                </button>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Oferte Trimise</h2>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {offers.map(o => (
                                    <div key={o.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center space-x-3 mb-1">
                                                    <span className="font-bold text-gray-800 dark:text-white">{o.title}</span>
                                                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">-{o.discount}%</span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{o.description}</p>
                                                <p className="text-xs text-gray-400 mt-2">Către: <span className="font-bold text-host-blue dark:text-host-cyan">{o.studentName}</span> • Valid până: {o.validUntil}</p>
                                            </div>
                                            <span className="text-xs text-gray-400">{o.sentDate ? new Date(o.sentDate).toLocaleDateString() : ''}</span>
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
