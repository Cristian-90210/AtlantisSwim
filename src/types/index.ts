/**
 * Standardised role values — must match the backend UserRole enum.
 * 1 = Student (Elev), 2 = Coach (Antrenor), 3 = Admin
 *
 * Using a const object instead of enum so that esbuild/Vite can strip it
 * (required by erasableSyntaxOnly in tsconfig.app.json).
 */
export const UserRole = {
    Student: 1,
    Coach:   2,
    Admin:   3,
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

/** Human-readable Romanian label for a role. */
export function getRoleLabel(role: UserRole): string {
    switch (role) {
        case UserRole.Student: return 'Elev';
        case UserRole.Coach:   return 'Antrenor';
        case UserRole.Admin:   return 'Admin';
    }
}

/**
 * URL / notification-target key for a role.
 * Used wherever a lowercase string key is needed (routes, notification targetRole, etc.)
 */
export function getRoleKey(role: UserRole): 'student' | 'coach' | 'admin' {
    switch (role) {
        case UserRole.Student: return 'student';
        case UserRole.Coach:   return 'coach';
        case UserRole.Admin:   return 'admin';
    }
}

export interface Booking {
    id: string;
    studentId: string;
    coachId: string;
    courseId: string;
    date: string; // ISO Date YYYY-MM-DD
    time: string; // HH:mm
    status: 'upcoming' | 'completed' | 'cancelled';
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;  // numeric: 1 | 2 | 3
    avatar?: string;
}

export interface Student {
    id: string;
    name: string;
    age: number;
    email: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    status: 'Active' | 'Inactive';
    enrolledCourseId?: string;
    role: typeof UserRole.Student;  // discriminator = 1
    avatar?: string;
}

export type MedicalFlagType = 'asthma' | 'chlorine_allergy' | 'other';
export type MedicalFlagSeverity = 'low' | 'medium' | 'high';

export interface StudentHealthFlag {
    id: string;
    studentId: string;
    type: MedicalFlagType;
    severity: MedicalFlagSeverity;
    protocolText: string;
    isActive: boolean;
}

export interface Admin {
    id: string;
    name: string;
    email: string;
    role: typeof UserRole.Admin;  // discriminator = 3
    avatar?: string;
    status: 'Active' | 'Inactive';
}

export type AnyUser = Student | Coach | Admin;

export interface Announcement {
    id: string;
    title: { en: string; ro: string; ru: string };
    message: { en: string; ro: string; ru: string };
    date: string;
    target: 'all' | 'students' | 'coaches';
    authorId: string;
}

export interface Coach {
    id: string;
    name: string;
    specialization: string;
    experienceYears: number;
    email: string;
    avatar?: string;
    status: 'Active' | 'Inactive';
    role: typeof UserRole.Coach;  // discriminator = 2
    imagePosition?: 'top' | 'center' | 'bottom';
}

export interface Course {
    id: string;
    title: string;
    description: string;
    capacity: number;
    enrolled: number;
    coachId: string;
    schedule: string; // e.g., "Mon, Wed 18:00"
    price: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
}

// Enrollment Types
export interface TimeSlot {
    time: string;
    isAvailable: boolean;
}

export interface DayAvailability {
    date: string; // ISO string YYYY-MM-DD
    slots: TimeSlot[];
}

export type SwimStyle = 'freestyle' | 'backstroke' | 'butterfly' | 'breaststroke';
export type SwimDistance = '25m' | '50m' | '100m' | '200m';

export interface SwimmingResult {
    id: string;
    studentId: string;
    coachId: string;
    style: SwimStyle;
    distance: SwimDistance;
    time: string; // e.g. "00:32.45"
    date: string; // ISO Date
    notes?: string;
}

export interface AttendanceRecord {
    id: string;
    bookingId: string;
    studentId: string;
    date: string;
    status: 'present' | 'absent' | 'absent_medical' | 'recovery' | 'late';
    markedBy: string; // coach or admin id
    confirmed?: boolean;
    confirmedBy?: string;
    confirmedAt?: string;
    submittedByStudent?: boolean;
    note?: string;
}

export interface RecoveryCredit {
    id: string;
    studentId: string;
    sourceAttendanceId: string;
    status: 'active' | 'reserved' | 'consumed' | 'expired';
    expiresAt: string;
    consumedSessionId?: string;
}

export interface RecoveryRequest {
    id: string;
    studentId: string;
    date: string;
    status: 'pending' | 'confirmed' | 'rejected';
    requestedAt: string;
    confirmedBy?: string;
    confirmedAt?: string;
}

export interface ProgressSnapshot {
    id: string;
    studentId: string;
    metricKey: string;
    metricValue: number; // 0..100
    recordedAt: string;
}

export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    receiverId: string;
    receiverName: string;
    content: string;
    timestamp: string;
    read: boolean;
}

export interface Subscription {
    id: string;
    planId: string;
    studentId: string;
    studentName: string;
    paidDate: string;
    amount: number;
    sessionsTotal: number;
    sessionsUsed: number;
    expiryDate: string;
}

export interface CoachScheduleSlot {
    id: string;
    coachId: string;
    coachName: string;
    dayOfWeek: string; // 'Monday', 'Tuesday', etc.
    startTime: string;
    endTime: string;
    maxStudents: number;
    currentStudents: number;
}

export interface SpecialOffer {
    id: string;
    studentId: string;
    studentName: string;
    title: string;
    description: string;
    discount: number; // percentage
    validUntil: string;
    sentBy: string;
    sentByName: string;
    sentDate: string;
}

export interface StudentNote {
    id: string;
    studentId: string;
    studentName: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'alert';

export interface AppNotification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string; // ISO string
    read: boolean;
    targetRole: 'all' | 'student' | 'coach' | 'admin';  // use getRoleKey() to compare with UserRole
    link?: string; // optional route to navigate to on click
}
