import { UserRole } from '../types';
import type { User, Student, Coach, Course, SwimmingResult, AttendanceRecord, Message, Subscription, CoachScheduleSlot, SpecialOffer, StudentNote, StudentHealthFlag, ProgressSnapshot, RecoveryCredit } from '../types';

export interface MockUserAccount extends User {
    password: string;
}

export const mockCoaches: Coach[] = [
    {
        id: 'c1',
        name: 'Cătălina',
        specialization: 'Manager',
        experienceYears: 5,
        email: 'catalina@atlantisswim.md',
        avatar: 'https://atlantisswim.md/wp-content/uploads/2025/08/1755805148272508-1152x1536.jpg',
        status: 'Active',
        role: UserRole.Coach,
        imagePosition: 'center'
    },
    {
        id: 'c2',
        name: 'Cătălin',
        specialization: 'Antrenor Înot',
        experienceYears: 4,
        email: 'catalin@atlantisswim.md',
        avatar: 'https://atlantisswim.md/wp-content/uploads/2025/08/1755608849746448-1152x1536.jpg',
        status: 'Active',
        role: UserRole.Coach
    },
    {
        id: 'c3',
        name: 'Alexandru',
        specialization: 'Antrenor Înot',
        experienceYears: 3,
        email: 'alexandru@atlantisswim.md',
        avatar: 'https://atlantisswim.md/wp-content/uploads/2025/08/1755805146956334-1152x1536.jpg',
        status: 'Active',
        role: UserRole.Coach
    },
    {
        id: 'c4',
        name: 'Roman',
        specialization: 'Antrenor Înot',
        experienceYears: 3,
        email: 'roman@atlantisswim.md',
        avatar: 'https://atlantisswim.md/wp-content/uploads/2025/08/1755805147472445-1152x1536.jpg',
        status: 'Active',
        role: UserRole.Coach,
        imagePosition: 'center'
    },
    {
        id: 'c5',
        name: 'Nicoleta',
        specialization: 'Antrenor Înot',
        experienceYears: 2,
        email: 'nicoleta@atlantisswim.md',
        avatar: 'https://atlantisswim.md/wp-content/uploads/2025/08/1755805176915236-1152x1536.jpg',
        status: 'Active',
        role: UserRole.Coach,
        imagePosition: 'center'
    },
    {
        id: 'c6',
        name: 'Dumitru',
        specialization: 'Antrenor Înot',
        experienceYears: 2,
        email: 'dumitru@atlantisswim.md',
        avatar: 'https://atlantisswim.md/wp-content/uploads/2025/08/1755608855957162-1152x1536.jpg',
        status: 'Active',
        role: UserRole.Coach,
        imagePosition: 'center'
    }
];

export const mockAdmins: import('../types').Admin[] = [
    {
        id: 'admin-1',
        name: 'Super Admin',
        email: 'admin@school.com',
        role: UserRole.Admin,
        status: 'Active',
        avatar: 'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=Admin'
    }
];

export const mockAnnouncements: import('../types').Announcement[] = [
    {
        id: 'a1',
        title: { en: 'Pool Maintenance', ro: 'Mentenanță Bazin', ru: 'Обслуживание Бассейна' },
        message: {
            en: 'The main pool will be closed on Sunday.',
            ro: 'Bazinul principal va fi închis Duminică.',
            ru: 'Главный бассейн будет закрыт в воскресенье.'
        },
        date: '2026-02-10',
        target: 'all',
        authorId: 'admin-1'
    }
];

export const mockCourses: Course[] = [
    {
        id: 'crs1',
        title: 'Beginner Swim - Kids',
        description: 'Learn the basics of floating and kicking.',
        capacity: 10,
        enrolled: 8,
        coachId: 'c3',
        schedule: 'Mon, Wed 16:00',
        price: 250,
        level: 'Beginner'
    },
    {
        id: 'crs2',
        title: 'Advanced Freestyle',
        description: 'Refine your technique for competition.',
        capacity: 15,
        enrolled: 12,
        coachId: 'c1',
        schedule: 'Tue, Thu 19:00',
        price: 400,
        level: 'Advanced'
    },
    {
        id: 'crs3',
        title: 'Backstroke Mastery',
        description: 'Perfect your backstroke form.',
        capacity: 8,
        enrolled: 5,
        coachId: 'c2',
        schedule: 'Fri 17:00, Sat 10:00',
        price: 300,
        level: 'Intermediate'
    }
];

export const subscriptionPlans = [
    {
        id: 'plan1',
        name: 'Abonament 4 Frecvențe',
        sessions: 4,
        duration: '1 lună',
        price: 1000,
        discountPrice: 900,
        category: 'standard',
    },
    {
        id: 'plan2',
        name: 'Abonament Standard 8 Frecvențe',
        sessions: 8,
        duration: '1 lună',
        price: 2000,
        discountPrice: 1800,
        category: 'standard',
    },
    {
        id: 'plan3',
        name: 'Abonament Pro 12 Frecvențe',
        sessions: 12,
        duration: '1 lună',
        price: 3000,
        discountPrice: 2500,
        category: 'pro',
    },
    {
        id: 'plan4',
        name: 'Abonament Standard 3 Luni',
        sessions: 24,
        duration: '3 luni',
        price: 5400,
        discountPrice: 4860,
        category: 'standard',
    },
    {
        id: 'plan5',
        name: 'Abonament Pro 3 Luni',
        sessions: 36,
        duration: '3 luni',
        price: 7500,
        discountPrice: 6750,
        category: 'pro',
    },
    {
        id: 'plan6',
        name: 'Abonament Individual 5 Antrenamente',
        sessions: 5,
        duration: 'individual',
        price: 2250,
        discountPrice: null,
        category: 'individual',
    },
    {
        id: 'plan7',
        name: 'Abonament Individual 10 Antrenamente',
        sessions: 10,
        duration: 'individual',
        price: 4500,
        discountPrice: 4185,
        category: 'individual',
    },
    {
        id: 'plan8',
        name: 'Abonament cu Transport Chișinău',
        sessions: 8,
        duration: '1 lună',
        price: 2400,
        discountPrice: 2000,
        category: 'transport',
    },
    {
        id: 'plan9',
        name: 'Abonament cu Transport Ialoveni',
        sessions: 8,
        duration: '1 lună',
        price: 2600,
        discountPrice: 2400,
        category: 'transport',
    },
];

export const mockStudents: Student[] = [
    {
        id: 's1',
        name: 'Andrei Popov',
        age: 12,
        email: 'andrei.p@gmail.com',
        level: 'Beginner',
        status: 'Active',
        enrolledCourseId: 'crs1',
        role: UserRole.Student,
        avatar: 'https://ui-avatars.com/api/?name=Andrei+Popa'
    },
    {
        id: 's2',
        name: 'Elena Dumitru',
        age: 24,
        email: 'elena.d@yahoo.com',
        level: 'Advanced',
        status: 'Active',
        enrolledCourseId: 'crs2',
        role: UserRole.Student,
        avatar: 'https://ui-avatars.com/api/?name=Elena+Dumitru'
    },
    {
        id: 's3',
        name: 'Mihai Voicu',
        age: 18,
        email: 'mihai.v@gmail.com',
        level: 'Intermediate',
        status: 'Inactive',
        enrolledCourseId: 'crs3',
        role: UserRole.Student,
        avatar: 'https://ui-avatars.com/api/?name=Mihai+Voicu'
    },
    {
        id: 's4',
        name: 'Ioana Stan',
        age: 10,
        email: 'ioana.s@gmail.com',
        level: 'Beginner',
        status: 'Active',
        enrolledCourseId: 'crs1',
        role: UserRole.Student,
        avatar: 'https://ui-avatars.com/api/?name=Ioana+Stan'
    },
    {
        id: 's5',
        name: 'George Enescu',
        age: 30,
        email: 'george.e@music.com',
        level: 'Advanced',
        status: 'Active',
        enrolledCourseId: 'crs2',
        role: UserRole.Student,
        avatar: 'https://ui-avatars.com/api/?name=George+Enescu'
    }
];

export const mockBookings: import('../types').Booking[] = [
    {
        id: 'b1',
        studentId: 'user-1',
        coachId: 'c1',
        courseId: 'crs2',
        date: '2026-02-15',
        time: '10:00',
        status: 'upcoming'
    },
    {
        id: 'b2',
        studentId: 'user-1',
        coachId: 'c2',
        courseId: 'crs3',
        date: '2026-02-18',
        time: '14:00',
        status: 'upcoming'
    },
    {
        id: 'b3',
        studentId: 's2',
        coachId: 'c1',
        courseId: 'crs2',
        date: '2026-02-14',
        time: '11:00',
        status: 'completed'
    },
    {
        id: 'b4',
        studentId: 's3',
        coachId: 'c1',
        courseId: 'crs2',
        date: '2026-02-20',
        time: '09:00',
        status: 'upcoming'
    },
    {
        id: 'b5',
        studentId: 'user-1',
        coachId: 'c3',
        courseId: 'crs1',
        date: '2026-02-22',
        time: '16:00',
        status: 'upcoming'
    },
    {
        id: 'b6',
        studentId: 's1',
        coachId: 'c1',
        courseId: 'crs2',
        date: '2026-02-19',
        time: '17:00',
        status: 'upcoming'
    },
    {
        id: 'b7',
        studentId: 's2',
        coachId: 'c1',
        courseId: 'crs2',
        date: '2026-02-19',
        time: '17:00',
        status: 'upcoming'
    },
    {
        id: 'b8',
        studentId: 's4',
        coachId: 'c1',
        courseId: 'crs1',
        date: '2026-02-19',
        time: '17:00',
        status: 'upcoming'
    },
    {
        id: 'b9',
        studentId: 's5',
        coachId: 'c1',
        courseId: 'crs2',
        date: '2026-02-19',
        time: '17:00',
        status: 'upcoming'
    }
];

export const mockSwimmingResults: SwimmingResult[] = [
    { id: 'r1', studentId: 's1', coachId: 'c1', style: 'freestyle', distance: '25m', time: '00:18.50', date: '2026-02-10' },
    { id: 'r2', studentId: 's1', coachId: 'c1', style: 'backstroke', distance: '50m', time: '00:42.30', date: '2026-02-12' },
    { id: 'r3', studentId: 's2', coachId: 'c1', style: 'butterfly', distance: '100m', time: '01:15.80', date: '2026-02-11' },
    { id: 'r4', studentId: 's2', coachId: 'c1', style: 'freestyle', distance: '50m', time: '00:30.20', date: '2026-02-13' },
    { id: 'r5', studentId: 's3', coachId: 'c2', style: 'breaststroke', distance: '25m', time: '00:22.10', date: '2026-02-14' },
    { id: 'r6', studentId: 's4', coachId: 'c3', style: 'freestyle', distance: '25m', time: '00:20.00', date: '2026-02-10' },
    { id: 'r7', studentId: 's5', coachId: 'c1', style: 'butterfly', distance: '50m', time: '00:38.90', date: '2026-02-15' },
    { id: 'r8', studentId: 'user-1', coachId: 'c1', style: 'freestyle', distance: '50m', time: '00:35.20', date: '2026-02-10' },
    { id: 'r9', studentId: 'user-1', coachId: 'c2', style: 'backstroke', distance: '25m', time: '00:19.80', date: '2026-02-12' },
];

export const mockAttendance: AttendanceRecord[] = [
    { id: 'att1', bookingId: 'b1', studentId: 'user-1', date: '2026-02-15', status: 'present', markedBy: 'c1' },
    { id: 'att2', bookingId: 'b3', studentId: 's2', date: '2026-02-14', status: 'present', markedBy: 'c1' },
    { id: 'att3', bookingId: 'b4', studentId: 's3', date: '2026-02-13', status: 'absent', markedBy: 'c1' },
    { id: 'att4', bookingId: 'b2', studentId: 'user-1', date: '2026-02-13', status: 'recovery', markedBy: 'c2' },
    { id: 'att5', bookingId: 'b1', studentId: 's1', date: '2026-02-10', status: 'present', markedBy: 'c3' },
    { id: 'att6', bookingId: 'b1', studentId: 's4', date: '2026-02-10', status: 'absent', markedBy: 'c3' },
    { id: 'att7', bookingId: 'b6', studentId: 's1', date: '2026-02-19', status: 'present', markedBy: 's1', confirmed: false, submittedByStudent: true },
    { id: 'att8', bookingId: 'b7', studentId: 's2', date: '2026-02-19', status: 'absent', markedBy: 's2', confirmed: false, submittedByStudent: true },
    { id: 'att9', bookingId: 'b8', studentId: 's4', date: '2026-02-19', status: 'present', markedBy: 's4', confirmed: false, submittedByStudent: true },
    { id: 'att10', bookingId: 'b9', studentId: 's5', date: '2026-02-19', status: 'absent', markedBy: 's5', confirmed: false, submittedByStudent: true },
];

export const mockMessages: Message[] = [
    { id: 'm1', senderId: 'user-1', senderName: 'Regular Student', receiverId: 'c1', receiverName: 'Alex Popov', content: 'Bună ziua! Pot veni la antrenament mâine?', timestamp: '2026-02-15T09:30:00', read: true },
    { id: 'm2', senderId: 'c1', senderName: 'Alex Popov', receiverId: 'user-1', receiverName: 'Regular Student', content: 'Bună! Da, te așteptăm la ora 10:00.', timestamp: '2026-02-15T09:45:00', read: true },
    { id: 'm3', senderId: 'user-1', senderName: 'Regular Student', receiverId: 'admin-1', receiverName: 'Super Admin', content: 'Am o întrebare despre abonament.', timestamp: '2026-02-15T10:00:00', read: false },
    { id: 'm4', senderId: 'c1', senderName: 'Alex Popov', receiverId: 'admin-1', receiverName: 'Super Admin', content: 'Elevul Andrei Popa a avut progrese excelente.', timestamp: '2026-02-14T14:00:00', read: true },
    { id: 'm5', senderId: 'admin-1', senderName: 'Super Admin', receiverId: 'c1', receiverName: 'Alex Popov', content: 'Excelent! Vom actualiza și profilul lui.', timestamp: '2026-02-14T14:30:00', read: true },
];

export const mockSubscriptions: Subscription[] = [
    { id: 'sub1', planId: 'plan3', studentId: 's1', studentName: 'Andrei Popa', paidDate: '2026-02-01', amount: 250, sessionsTotal: 12, sessionsUsed: 5, expiryDate: '2026-03-01' },
    { id: 'sub2', planId: 'plan5', studentId: 's2', studentName: 'Elena Dumitru', paidDate: '2026-02-01', amount: 400, sessionsTotal: 16, sessionsUsed: 10, expiryDate: '2026-03-01' },
    { id: 'sub3', planId: 'plan2', studentId: 's3', studentName: 'Mihai Voicu', paidDate: '2026-01-15', amount: 300, sessionsTotal: 8, sessionsUsed: 8, expiryDate: '2026-02-15' },
    { id: 'sub4', planId: 'plan3', studentId: 's4', studentName: 'Ioana Stan', paidDate: '2026-02-05', amount: 250, sessionsTotal: 12, sessionsUsed: 3, expiryDate: '2026-03-05' },
    { id: 'sub5', planId: 'plan5', studentId: 's5', studentName: 'George Enescu', paidDate: '2026-02-10', amount: 400, sessionsTotal: 16, sessionsUsed: 2, expiryDate: '2026-03-10' },
    { id: 'sub6', planId: 'plan3', studentId: 'user-1', studentName: 'Regular Student', paidDate: '2026-02-01', amount: 350, sessionsTotal: 12, sessionsUsed: 4, expiryDate: '2026-03-01' },
];

export const mockCoachSchedule: CoachScheduleSlot[] = [
    { id: 'sch1', coachId: 'c1', coachName: 'Alex Popov', dayOfWeek: 'Monday', startTime: '09:00', endTime: '11:00', maxStudents: 8, currentStudents: 5 },
    { id: 'sch2', coachId: 'c1', coachName: 'Alex Popov', dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '11:00', maxStudents: 8, currentStudents: 7 },
    { id: 'sch3', coachId: 'c1', coachName: 'Alex Popov', dayOfWeek: 'Friday', startTime: '14:00', endTime: '16:00', maxStudents: 6, currentStudents: 4 },
    { id: 'sch4', coachId: 'c2', coachName: 'Maria Radu', dayOfWeek: 'Tuesday', startTime: '10:00', endTime: '12:00', maxStudents: 10, currentStudents: 6 },
    { id: 'sch5', coachId: 'c2', coachName: 'Maria Radu', dayOfWeek: 'Thursday', startTime: '10:00', endTime: '12:00', maxStudents: 10, currentStudents: 8 },
    { id: 'sch6', coachId: 'c3', coachName: 'Ion Ionescu', dayOfWeek: 'Monday', startTime: '16:00', endTime: '18:00', maxStudents: 12, currentStudents: 9 },
    { id: 'sch7', coachId: 'c3', coachName: 'Ion Ionescu', dayOfWeek: 'Saturday', startTime: '10:00', endTime: '12:00', maxStudents: 12, currentStudents: 11 },
];

export const mockSpecialOffers: SpecialOffer[] = [
    { id: 'off1', studentId: 's1', studentName: 'Andrei Popa', title: 'Reducere Abonament Martie', description: '20% reducere la reînnoire abonament luna martie.', discount: 20, validUntil: '2026-03-15', sentBy: 'admin-1', sentByName: 'Super Admin', sentDate: '2026-02-15' },
    { id: 'off2', studentId: 's3', studentName: 'Mihai Voicu', title: 'Sesiune Gratuită', description: 'O sesiune gratuită de recuperare.', discount: 100, validUntil: '2026-02-28', sentBy: 'admin-1', sentByName: 'Super Admin', sentDate: '2026-02-14' },
];

export const mockStudentNotes: StudentNote[] = [
    { id: 'n1', studentId: 's1', studentName: 'Andrei Popa', content: 'Are nevoie de atenție suplimentară la tehnica de respirație.', authorId: 'admin-1', authorName: 'Super Admin', createdAt: '2026-02-10T10:00:00' },
    { id: 'n2', studentId: 's2', studentName: 'Elena Dumitru', content: 'Pregătire pentru competiția regională din martie.', authorId: 'admin-1', authorName: 'Super Admin', createdAt: '2026-02-12T14:30:00' },
    { id: 'n3', studentId: 's4', studentName: 'Ioana Stan', content: 'Părinții solicită program flexibil din cauza școlii.', authorId: 'admin-1', authorName: 'Super Admin', createdAt: '2026-02-13T09:00:00' },
];

export const mockStudentHealthFlags: StudentHealthFlag[] = [
    { id: 'hf1', studentId: 's1', type: 'asthma', severity: 'high', protocolText: 'Inhalator înainte de încălzire. Pauză la respirație grea.', isActive: true },
    { id: 'hf2', studentId: 's4', type: 'chlorine_allergy', severity: 'medium', protocolText: 'Duș imediat după ședință, evită banda cu clor intens.', isActive: true },
];

export const mockProgressSnapshots: ProgressSnapshot[] = [
    { id: 'pg1', studentId: 's1', metricKey: 'freestyle_technique', metricValue: 62, recordedAt: '2026-02-18T10:00:00' },
    { id: 'pg2', studentId: 's2', metricKey: 'freestyle_technique', metricValue: 84, recordedAt: '2026-02-18T10:00:00' },
    { id: 'pg3', studentId: 's4', metricKey: 'water_confidence', metricValue: 48, recordedAt: '2026-02-18T10:00:00' },
    { id: 'pg4', studentId: 's5', metricKey: 'freestyle_speed', metricValue: 79, recordedAt: '2026-02-18T10:00:00' },
];

export const mockRecoveryCredits: RecoveryCredit[] = [
    { id: 'rc1', studentId: 's2', sourceAttendanceId: 'att8', status: 'active', expiresAt: '2026-03-21T23:59:59' },
];

// ─── MOCK USER ACCOUNTS (email + parolă pentru login) ───────────────────────
export const mockUserAccounts: MockUserAccount[] = [
    // ── ELEVI ──
    {
        id: 'user-1',
        name: 'Andrei Popov',
        email: 'andrei.popov@student.md',
        password: 'elev1234',
        role: UserRole.Student,
        avatar: 'https://ui-avatars.com/api/?background=0ea5e9&color=fff&name=Andrei+Popov',
    },
    {
        id: 'user-2',
        name: 'Elena Dumitru',
        email: 'elena.dumitru@student.md',
        password: 'elev1234',
        role: UserRole.Student,
        avatar: 'https://ui-avatars.com/api/?background=0ea5e9&color=fff&name=Elena+Dumitru',
    },
    {
        id: 'user-3',
        name: 'Mihai Voicu',
        email: 'mihai.voicu@student.md',
        password: 'elev1234',
        role: UserRole.Student,
        avatar: 'https://ui-avatars.com/api/?background=0ea5e9&color=fff&name=Mihai+Voicu',
    },

    // ── ANTRENORI ──
    {
        id: 'c1',
        name: 'Cătălina Moraru',
        email: 'catalina@atlantisswim.md',
        password: 'antrenor1234',
        role: UserRole.Coach,
        avatar: 'https://atlantisswim.md/wp-content/uploads/2025/08/1755805148272508-1152x1536.jpg',
    },
    {
        id: 'c2',
        name: 'Cătălin Ciobanu',
        email: 'catalin@atlantisswim.md',
        password: 'antrenor1234',
        role: UserRole.Coach,
        avatar: 'https://atlantisswim.md/wp-content/uploads/2025/08/1755608849746448-1152x1536.jpg',
    },
    {
        id: 'c3',
        name: 'Alexandru Rusu',
        email: 'alexandru@atlantisswim.md',
        password: 'antrenor1234',
        role: UserRole.Coach,
        avatar: 'https://atlantisswim.md/wp-content/uploads/2025/08/1755805146956334-1152x1536.jpg',
    },

    // ── ADMINISTRATORI ──
    {
        id: 'admin-1',
        name: 'Super Admin',
        email: 'admin@school.com',
        password: 'admin1234',
        role: UserRole.Admin,
        avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Super+Admin',
    },
    {
        id: 'admin-2',
        name: 'Director Ionescu',
        email: 'director@school.com',
        password: 'admin1234',
        role: UserRole.Admin,
        avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Director+Ionescu',
    },
    {
        id: 'admin-3',
        name: 'Manager Stancu',
        email: 'manager@school.com',
        password: 'admin1234',
        role: UserRole.Admin,
        avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Manager+Stancu',
    },
];

export const mockNotifications = [
    // ── ADMIN ──
    { id: 'notif-a1', type: 'alert' as const,   title: 'Rezervare nouă',              message: 'Andrei Popov a făcut o rezervare pentru cursul Advanced Freestyle.',          timestamp: '2026-03-14T22:00:00', read: false, targetRole: 'admin' as const,   link: '/admin/reservations' },
    { id: 'notif-a2', type: 'info' as const,    title: 'Utilizator nou înregistrat',  message: 'Elena Dumitru s-a înregistrat pe platformă.',                                timestamp: '2026-03-14T20:30:00', read: false, targetRole: 'admin' as const,   link: '/admin/users' },
    { id: 'notif-a3', type: 'warning' as const, title: 'Curs aproape plin',           message: 'Cursul "Advanced Freestyle" mai are un singur loc disponibil.',              timestamp: '2026-03-14T18:15:00', read: true,  targetRole: 'admin' as const,   link: '/courses' },
    { id: 'notif-a4', type: 'success' as const, title: 'Plată confirmată',            message: 'Plata abonamentului Pro 3 Luni de la George Enescu a fost procesată.',       timestamp: '2026-03-14T14:00:00', read: true,  targetRole: 'admin' as const,   link: '/admin/reservations' },
    // ── COACH ──
    { id: 'notif-c1', type: 'info' as const,    title: 'Orar actualizat',             message: 'Antrenamentul de Luni a fost mutat la ora 10:00.',                           timestamp: '2026-03-14T21:00:00', read: false, targetRole: 'coach' as const,   link: '/coach/schedule' },
    { id: 'notif-c2', type: 'success' as const, title: 'Prezență confirmată',         message: 'Ai marcat prezența pentru 6 studenți la antrenamentul din 14 Martie.',       timestamp: '2026-03-14T17:00:00', read: false, targetRole: 'coach' as const,   link: '/coach/attendance' },
    { id: 'notif-c3', type: 'warning' as const, title: 'Student absent',              message: 'Mihai Voicu a absentat de la 3 antrenamente consecutive.',                   timestamp: '2026-03-13T09:00:00', read: true,  targetRole: 'coach' as const,   link: '/students' },
    { id: 'notif-c4', type: 'alert' as const,   title: 'Mesaj nou',                   message: 'Ai primit un mesaj de la Super Admin referitor la studenți.',                 timestamp: '2026-03-12T15:30:00', read: true,  targetRole: 'coach' as const,   link: '/coach' },
    // ── STUDENT ──
    { id: 'notif-s1', type: 'success' as const, title: 'Rezervare confirmată',        message: 'Rezervarea ta pentru antrenamentul de Vineri la ora 16:00 a fost confirmată.',timestamp: '2026-03-14T22:30:00', read: false, targetRole: 'student' as const, link: '/student/schedule' },
    { id: 'notif-s2', type: 'info' as const,    title: 'Anunț nou',                   message: 'Bazinul principal va fi închis Duminică pentru mentenanță.',                  timestamp: '2026-03-14T10:00:00', read: false, targetRole: 'student' as const, link: '/student' },
    { id: 'notif-s3', type: 'warning' as const, title: 'Abonament expiră curând',     message: 'Abonamentul tău expiră pe 1 Aprilie 2026. Reînnoire din timp!',              timestamp: '2026-03-14T08:00:00', read: false, targetRole: 'student' as const, link: '/student/subscription' },
    { id: 'notif-s4', type: 'success' as const, title: 'Rezultat nou înregistrat',    message: 'Antrenorul Cătălina a înregistrat un nou rezultat personal la freestyle 50m.',timestamp: '2026-03-13T17:00:00', read: true,  targetRole: 'student' as const, link: '/student/results' },
    { id: 'notif-s5', type: 'alert' as const,   title: 'Ofertă specială',             message: 'Beneficiezi de 20% reducere la reînnoire abonament luna Martie!',            timestamp: '2026-03-12T09:00:00', read: true,  targetRole: 'student' as const, link: '/courses' },
    // ── ALL ──
    { id: 'notif-all1', type: 'info' as const,  title: 'Actualizare platformă',       message: 'Platforma Atlantis SwimSchool a fost actualizată cu funcționalități noi.',   timestamp: '2026-03-10T12:00:00', read: true,  targetRole: 'all' as const,     link: '/' },
];
