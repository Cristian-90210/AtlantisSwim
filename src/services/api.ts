import type {
    Student, Course, Coach, AnyUser, Announcement, SwimmingResult,
    AttendanceRecord, Subscription, CoachScheduleSlot, SpecialOffer,
    StudentNote, RecoveryCredit, StudentHealthFlag, ProgressSnapshot,
    RecoveryRequest, Booking,
} from '../types';
import { UserRole } from '../types';
import axiosInstance from '../api/axiosInstance';

// ── Helpers ───────────────────────────────────────────────────────────────────

function ageFromDob(dob: string): number {
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())) age--;
    return age;
}

function dobFromAge(age: number): string {
    const d = new Date();
    d.setFullYear(d.getFullYear() - age);
    return d.toISOString();
}

function isoDate(raw: string | null | undefined): string {
    if (!raw) return '';
    try { return new Date(raw).toISOString().split('T')[0]; } catch { return ''; }
}

// ── Entity mappers ────────────────────────────────────────────────────────────

function mapApiStudent(s: any): Student {
    return {
        id:     String(s.id),
        name:   `${s.firstName} ${s.lastName}`.trim(),
        age:    ageFromDob(s.dateOfBirth),
        email:  s.email,
        level:  (s.swimmingLevel as Student['level']) || 'Beginner',
        status: s.isActive ? 'Active' : 'Inactive',
        role:   UserRole.Student,
    };
}

function mapScheduleSlot(s: any): CoachScheduleSlot {
    return {
        id:              String(s.id),
        coachId:         String(s.coachUserId),
        coachName:       s.coachName ?? '',
        dayOfWeek:       s.dayOfWeek ?? '',
        startTime:       s.startTime ?? '',
        endTime:         s.endTime ?? '',
        maxStudents:     s.maxStudents ?? 0,
        currentStudents: s.currentStudents ?? 0,
    };
}

type CoachEnrichment = {
    avatar: string;
    imagePosition?: 'top' | 'center' | 'bottom';
    specialization: string;
    experienceYears: number;
    description?: string;
};

const COACH_ENRICHMENT: Record<string, CoachEnrichment> = {
    'catalina@atlantisswim.md':  { avatar: 'https://atlantisswim.md/wp-content/uploads/2025/08/1755805148272508-1152x1536.jpg',  imagePosition: 'center', specialization: 'Manager', experienceYears: 5 },
    'catalin@atlantisswim.md':   { avatar: 'https://atlantisswim.md/wp-content/uploads/2025/08/1755608849746448-1152x1536.jpg',  specialization: 'Antrenor Înot', experienceYears: 4 },
    'alexandru@atlantisswim.md': { avatar: 'https://atlantisswim.md/wp-content/uploads/2025/08/1755805146956334-1152x1536.jpg',  specialization: 'Antrenor Înot', experienceYears: 3 },
    'roman@atlantisswim.md':     { avatar: 'https://atlantisswim.md/wp-content/uploads/2025/08/1755608855957162-1536x2048.jpg',  imagePosition: 'center', specialization: 'Antrenor Înot', experienceYears: 3 },
    'nicoleta@atlantisswim.md':  { avatar: 'https://atlantisswim.md/wp-content/uploads/2025/08/1755805176915236-1152x1536.jpg',  imagePosition: 'center', specialization: 'Antrenor Înot', experienceYears: 2 },
    'dumitru@atlantisswim.md':   { avatar: 'https://atlantisswim.md/wp-content/uploads/2025/08/1755608855957162-1152x1536.jpg',  imagePosition: 'center', specialization: 'Antrenor Înot', experienceYears: 2 },
};

function mapCoach(c: any): Coach {
    const key     = (c.email ?? '').toLowerCase();
    const enrich  = COACH_ENRICHMENT[key];
    const fullName = c.fullName || `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim();
    const experienceYears = Number(c.experienceYears ?? enrich?.experienceYears ?? 0);
    return {
        id:              String(c.id),
        name:            fullName,
        specialization:  c.specialization ?? enrich?.specialization ?? 'Antrenor Înot',
        experienceYears: Number.isFinite(experienceYears) ? experienceYears : 0,
        email:           c.email ?? '',
        avatar:          c.avatar ?? enrich?.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0ea5e9&color=fff`,
        description:     c.description ?? enrich?.description,
        status:          c.isActive ? 'Active' : 'Inactive',
        role:            UserRole.Coach,
        imagePosition:   c.imagePosition ?? enrich?.imagePosition,
    };
}

function mapAttendance(a: any): AttendanceRecord {
    return {
        id:                 String(a.id),
        bookingId:          '',            // backend does not persist bookingId
        studentId:          String(a.userId ?? a.studentUserId ?? ''),
        date:               isoDate(a.date),
        status:             (a.status?.toLowerCase() as AttendanceRecord['status']) ?? 'present',
        markedBy:           String(a.markedByUserId ?? ''),
        confirmed:          a.confirmed ?? false,
        confirmedBy:        a.confirmedByUserId != null ? String(a.confirmedByUserId) : undefined,
        confirmedAt:        a.confirmedAt ?? undefined,
        submittedByStudent: a.submittedByStudent ?? false,
    };
}

function mapSwimmingResult(r: any): SwimmingResult {
    return {
        id:        String(r.id),
        studentId: String(r.studentUserId),
        coachId:   String(r.coachUserId),
        style:     r.style as SwimmingResult['style'],
        distance:  r.distance as SwimmingResult['distance'],
        time:      r.time ?? '',
        date:      isoDate(r.date),
        notes:     r.notes,
    };
}

function mapSubscription(s: any): Subscription {
    return {
        id:            String(s.id),
        planId:        s.planName ?? String(s.serviceId ?? ''),
        studentId:     String(s.studentUserId),
        studentName:   s.studentName ?? '',
        paidDate:      isoDate(s.startDate),
        amount:        s.amountPaid,
        sessionsTotal: s.sessionsTotal,
        sessionsUsed:  s.sessionsUsed,
        expiryDate:    isoDate(s.expiryDate),
    };
}

function mapBooking(b: any): Booking {
    return {
        id:          String(b.id),
        studentId:   String(b.studentUserId),
        studentName: b.studentName,
        coachId:     String(b.coachUserId),
        coachName:   b.coachName,
        courseId:    String(b.courseId),
        courseName:  b.courseName,
        date:        isoDate(b.date),
        time:        b.time ?? '',
        status:      (b.status?.toLowerCase() as Booking['status']) ?? 'upcoming',
    };
}

function parseI18nField(raw: string | undefined): { en: string; ro: string; ru: string } {
    if (!raw) return { en: '', ro: '', ru: '' };
    try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && 'en' in parsed) return parsed as any;
    } catch { /* not JSON — plain string */ }
    return { en: raw, ro: raw, ru: raw };
}

function mapAnnouncement(a: any): Announcement {
    return {
        id:       String(a.id),
        title:    parseI18nField(a.title),
        message:  parseI18nField(a.message),
        date:     isoDate(a.createdAt),
        target:   (a.target as Announcement['target']) ?? 'all',
        authorId: String(a.authorUserId ?? ''),
    };
}

function currentUserId(): number {
    try {
        const raw = localStorage.getItem('user');
        if (!raw) return 0;
        return parseInt(JSON.parse(raw).id ?? '0', 10) || 0;
    } catch { return 0; }
}

// ── Student Service (real API) ────────────────────────────────────────────────

export const studentService = {
    getAll: async (): Promise<Student[]> => {
        const res = await axiosInstance.get('/students');
        return res.data.map(mapApiStudent);
    },
    getById: async (id: string): Promise<Student | undefined> => {
        try {
            const res = await axiosInstance.get(`/students/${id}`);
            return mapApiStudent(res.data);
        } catch { return undefined; }
    },
    create: async (student: Student): Promise<Student> => {
        const parts     = student.name.trim().split(' ');
        const firstName = parts[0] ?? '';
        const lastName  = parts.slice(1).join(' ') || firstName;
        const res = await axiosInstance.post('/students', {
            firstName, lastName, email: student.email,
            phone: '', dateOfBirth: dobFromAge(student.age), swimmingLevel: student.level,
        });
        return mapApiStudent(res.data);
    },
    update: async (id: string, updates: Partial<Student>): Promise<Student> => {
        const existing = await studentService.getById(id);
        if (!existing) throw new Error('Student not found');
        const merged    = { ...existing, ...updates };
        const parts     = merged.name.trim().split(' ');
        const firstName = parts[0] ?? '';
        const lastName  = parts.slice(1).join(' ') || firstName;
        const res = await axiosInstance.put(`/students/${id}`, {
            firstName, lastName, email: merged.email,
            phone: '', dateOfBirth: dobFromAge(merged.age), swimmingLevel: merged.level,
        });
        return mapApiStudent(res.data);
    },
    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/students/${id}`);
    },
};

// ── Course Service (real API) ─────────────────────────────────────────────────

export const courseService = {
    getAll: async (): Promise<Course[]> => {
        const res = await axiosInstance.get('/course/getAll');
        return res.data.map((c: any): Course => ({
            id:          String(c.id),
            title:       c.name,
            description: c.description,
            capacity:    c.capacity,
            enrolled:    c.enrolled,
            coachId:     '',
            schedule:    c.schedule ?? '',
            price:       c.price,
            level:       (c.level?.name as Course['level']) ?? 'Beginner',
        }));
    },
    getLevels: async (): Promise<{ id: number; name: string }[]> => {
        const res = await axiosInstance.get('/course/levels');
        return res.data;
    },
    create: async (dto: { name: string; description: string; price: number; capacity: number; schedule: string; levelId: number }) => {
        const res = await axiosInstance.post('/course', dto);
        return res.data;
    },
    update: async (id: number, dto: { name: string; description: string; price: number; capacity: number; schedule: string; levelId: number }) => {
        const res = await axiosInstance.put(`/course/${id}`, dto);
        return res.data;
    },
    delete: async (id: number) => {
        await axiosInstance.delete(`/course/${id}`);
    },
};

// ── Coach Service (real API) ──────────────────────────────────────────────────

export const coachService = {
    getAll: async (): Promise<Coach[]> => {
        const res = await axiosInstance.get('/coaches');
        return (res.data as any[]).map(mapCoach);
    },
};

// ── User Service (real API) ───────────────────────────────────────────────────

export const userService = {
    getAll: async (): Promise<AnyUser[]> => {
        const res = await axiosInstance.get('/users');
        return res.data.map((u: any): AnyUser => ({
            id:     String(u.id),
            name:   `${u.firstName} ${u.lastName}`.trim() || u.userName,
            email:  u.email,
            role:   u.roleId as UserRole,
            status: u.isActive ? 'Active' : 'Inactive',
        } as AnyUser));
    },
    updateStatus: async (id: string, status: 'Active' | 'Inactive') => {
        await axiosInstance.put(`/users/${id}`, { isActive: status === 'Active' });
    },
    changeRole: async (id: string, newRoleId: number) => {
        await axiosInstance.put(`/users/${id}`, { roleId: newRoleId });
    },
    create: async (dto: { firstName: string; lastName: string; email: string; password: string; phone?: string; roleId: number }) => {
        const res = await axiosInstance.post('/users', dto);
        return res.data;
    },
    update: async (id: string, dto: { firstName?: string; lastName?: string; email?: string; password?: string; phone?: string; roleId?: number; isActive?: boolean }) => {
        const res = await axiosInstance.put(`/users/${id}`, dto);
        return res.data;
    },
    delete: async (id: string) => {
        await axiosInstance.delete(`/users/${id}`);
    },
    // The logged-in user updates their own avatar (data URL). Returns the new avatar.
    updateMyAvatar: async (avatar: string | null): Promise<string | null> => {
        const res = await axiosInstance.put('/users/me/avatar', { avatar });
        return res.data?.avatar ?? null;
    },
};

// ── Reservation / Booking Service (real API) ──────────────────────────────────

export const reservationService = {
    getAll: async (): Promise<Booking[]> => {
        const res = await axiosInstance.get('/bookings');
        return res.data.map(mapBooking);
    },
    getByStudent: async (studentId: string): Promise<Booking[]> => {
        const numId = parseInt(studentId, 10);
        if (isNaN(numId)) return [];
        const res = await axiosInstance.get('/bookings', { params: { studentId: numId } });
        return res.data.map(mapBooking);
    },
    getByCoach: async (coachId: string): Promise<Booking[]> => {
        const numId = parseInt(coachId, 10);
        if (isNaN(numId)) return [];
        const res = await axiosInstance.get('/bookings', { params: { coachId: numId } });
        return res.data.map(mapBooking);
    },
    updateStatus: async (id: string, status: 'upcoming' | 'completed' | 'cancelled') => {
        const numId = parseInt(id, 10);
        await axiosInstance.put(`/bookings/${numId}/status`, { status });
    },
    create: async (dto: { studentUserId: number; coachUserId: number; courseId: number; date: string; time: string }): Promise<Booking> => {
        const res = await axiosInstance.post('/bookings', dto);
        return mapBooking(res.data);
    },
};

// ── Announcement Service (real API) ───────────────────────────────────────────

export const announcementService = {
    getAll: async (): Promise<Announcement[]> => {
        const res = await axiosInstance.get('/announcements');
        return (res.data as any[]).map(mapAnnouncement);
    },
    send: async (announcement: Omit<Announcement, 'id' | 'date' | 'authorId'>): Promise<Announcement> => {
        const dto = {
            title:        JSON.stringify(announcement.title),
            message:      JSON.stringify(announcement.message),
            target:       announcement.target,
            authorUserId: currentUserId(),
        };
        const res = await axiosInstance.post('/announcements', dto);
        return mapAnnouncement(res.data);
    },
};

// ── Attendance Service (real API) ─────────────────────────────────────────────

export const attendanceService = {
    getAll: async (): Promise<AttendanceRecord[]> => {
        const res = await axiosInstance.get('/attendance');
        return (res.data as any[]).map(mapAttendance);
    },
    getByStudent: async (studentId: string): Promise<AttendanceRecord[]> => {
        const numId = parseInt(studentId, 10);
        if (isNaN(numId)) return [];
        const res = await axiosInstance.get('/attendance', { params: { userId: numId } });
        return (res.data as any[]).map(mapAttendance);
    },
    mark: async (record: Omit<AttendanceRecord, 'id'> & { courseId?: number }): Promise<AttendanceRecord> => {
        const numUserId   = parseInt(record.studentId, 10);
        const numMarkedBy = parseInt(record.markedBy, 10);
        const dto = {
            userId:         numUserId,
            courseId:       record.courseId ?? 0,
            date:           new Date(record.date).toISOString(),
            status:         record.status,
            markedByUserId: isNaN(numMarkedBy) ? undefined : numMarkedBy,
        };
        const res = await axiosInstance.post('/attendance', dto);
        return mapAttendance(res.data);
    },
    confirm: async (recordId: string, coachId: string): Promise<AttendanceRecord> => {
        const numId      = parseInt(recordId, 10);
        const numCoachId = parseInt(coachId, 10);
        const res = await axiosInstance.put(`/attendance/${numId}`, {
            confirmed:          true,
            confirmedByUserId:  numCoachId,
        });
        return mapAttendance(res.data);
    },
};

// ── Swimming Results Service (real API) ───────────────────────────────────────

export const resultsService = {
    getAll: async (): Promise<SwimmingResult[]> => {
        const res = await axiosInstance.get('/results');
        return (res.data as any[]).map(mapSwimmingResult);
    },
    getByStudent: async (studentId: string): Promise<SwimmingResult[]> => {
        const numId = parseInt(studentId, 10);
        if (isNaN(numId)) return [];
        const res = await axiosInstance.get('/results', { params: { studentId: numId } });
        return (res.data as any[]).map(mapSwimmingResult);
    },
    create: async (result: Omit<SwimmingResult, 'id'>): Promise<SwimmingResult> => {
        const dto = {
            studentUserId: parseInt(result.studentId, 10),
            coachUserId:   parseInt(result.coachId, 10),
            style:         result.style,
            distance:      result.distance,
            time:          result.time,
            date:          new Date(result.date).toISOString(),
            notes:         result.notes,
        };
        const res = await axiosInstance.post('/results', dto);
        return mapSwimmingResult(res.data);
    },
    update: async (id: string, updates: Partial<SwimmingResult>): Promise<SwimmingResult> => {
        const numId   = parseInt(id, 10);
        const current = await resultsService.getAll().then(arr => arr.find(r => r.id === id));
        if (!current) throw new Error('Result not found');
        const merged = { ...current, ...updates };
        const dto = {
            studentUserId: parseInt(merged.studentId, 10),
            coachUserId:   parseInt(merged.coachId, 10),
            style:         merged.style,
            distance:      merged.distance,
            time:          merged.time,
            date:          new Date(merged.date).toISOString(),
            notes:         merged.notes,
        };
        const res = await axiosInstance.put(`/results/${numId}`, dto);
        return mapSwimmingResult(res.data);
    },
};

// ── Subscription Service (real API) ───────────────────────────────────────────

export const subscriptionService = {
    getAll: async (): Promise<Subscription[]> => {
        const res = await axiosInstance.get('/subscriptions');
        return (res.data as any[]).map(mapSubscription);
    },
    getByStudent: async (studentId: string): Promise<Subscription | undefined> => {
        const numId = parseInt(studentId, 10);
        if (isNaN(numId)) return undefined;
        const res = await axiosInstance.get('/subscriptions', { params: { studentId: numId } });
        const data = res.data;
        if (Array.isArray(data)) {
            const active = data.find((s: any) => s.status === 'Active') ?? data[0];
            return active ? mapSubscription(active) : undefined;
        }
        return data ? mapSubscription(data) : undefined;
    },
};

// ── Schedule Service (real API) ───────────────────────────────────────────────

export const scheduleService = {
    getAll: async (): Promise<CoachScheduleSlot[]> => {
        const res = await axiosInstance.get('/schedule');
        return (res.data as any[]).map(mapScheduleSlot);
    },
    getByCoach: async (coachId: string): Promise<CoachScheduleSlot[]> => {
        const numId = parseInt(coachId, 10);
        if (isNaN(numId)) return [];
        const res = await axiosInstance.get('/schedule', { params: { coachId: numId } });
        return (res.data as any[]).map(mapScheduleSlot);
    },
    update: async (id: string, updates: Partial<CoachScheduleSlot>): Promise<CoachScheduleSlot> => {
        const numId = parseInt(id, 10);
        const dto: Record<string, unknown> = {};
        if (updates.dayOfWeek     !== undefined) dto.dayOfWeek       = updates.dayOfWeek;
        if (updates.startTime     !== undefined) dto.startTime       = updates.startTime;
        if (updates.endTime       !== undefined) dto.endTime         = updates.endTime;
        if (updates.maxStudents   !== undefined) dto.maxStudents     = updates.maxStudents;
        if (updates.currentStudents !== undefined) dto.currentStudents = updates.currentStudents;
        const res = await axiosInstance.put(`/schedule/${numId}`, dto);
        return mapScheduleSlot(res.data);
    },
    create: async (slot: Omit<CoachScheduleSlot, 'id'>): Promise<CoachScheduleSlot> => {
        const numCoachId = parseInt(slot.coachId, 10);
        const dto = {
            coachUserId:  isNaN(numCoachId) ? 0 : numCoachId,
            dayOfWeek:    slot.dayOfWeek,
            startTime:    slot.startTime,
            endTime:      slot.endTime,
            maxStudents:  slot.maxStudents,
        };
        const res = await axiosInstance.post('/schedule', dto);
        return mapScheduleSlot(res.data);
    },
};

// ── Swimming Service (real API) — subscription plans source ───────────────────

export interface SwimmingServiceItem {
    id: number;
    serviceName: string;
    serviceDescription: string;
    servicePrice: number;
}

export const swimmingServiceService = {
    getAll: async (): Promise<SwimmingServiceItem[]> => {
        const res = await axiosInstance.get('/swimming-service/getAll');
        return res.data as SwimmingServiceItem[];
    },
};

// ── Server Status (real API) ──────────────────────────────────────────────────

export const serverStatusService = {
    healthCheck: async (): Promise<{ status: string }> => {
        const res = await axiosInstance.get('/health');
        return { status: String(res.data) };
    },
};

// ── Mappers for Phase-10 types ────────────────────────────────────────────────

function mapRecoveryCredit(r: any): RecoveryCredit {
    return {
        id:                  String(r.id),
        studentId:           String(r.studentUserId),
        sourceAttendanceId:  r.sourceAttendanceId != null ? String(r.sourceAttendanceId) : '',
        status:              (r.status?.toLowerCase() as RecoveryCredit['status']) ?? 'active',
        expiresAt:           isoDate(r.expiresAt),
        consumedSessionId:   r.consumedByBookingId != null ? String(r.consumedByBookingId) : undefined,
    };
}

function mapRecoveryRequest(r: any): RecoveryRequest {
    return {
        id:           String(r.id),
        studentId:    String(r.studentUserId),
        date:         isoDate(r.date),
        status:       (r.status?.toLowerCase() as RecoveryRequest['status']) ?? 'pending',
        requestedAt:  r.requestedAt ?? '',
        confirmedBy:  r.coachUserId != null ? String(r.coachUserId) : undefined,
        confirmedAt:  r.confirmedAt ?? undefined,
    };
}

function mapHealthFlag(f: any): StudentHealthFlag {
    return {
        id:           String(f.id),
        studentId:    String(f.studentUserId),
        type:         (f.type as StudentHealthFlag['type']) ?? 'other',
        severity:     (f.severity as StudentHealthFlag['severity']) ?? 'medium',
        protocolText: f.protocolText ?? '',
        isActive:     f.isActive ?? true,
    };
}

function mapProgressSnapshot(p: any): ProgressSnapshot {
    return {
        id:          String(p.id),
        studentId:   String(p.studentUserId),
        metricKey:   p.metricKey ?? '',
        metricValue: p.metricValue ?? 0,
        recordedAt:  p.recordedAt ?? '',
    };
}

function mapSpecialOffer(o: any): SpecialOffer {
    return {
        id:          String(o.id),
        studentId:   String(o.studentUserId),
        studentName: o.studentName ?? '',
        title:       o.title ?? '',
        description: o.description ?? '',
        discount:    o.discount ?? 0,
        validUntil:  isoDate(o.validUntil),
        sentBy:      String(o.sentByUserId),
        sentByName:  o.sentByName ?? '',
        sentDate:    isoDate(o.sentAt),
    };
}

function mapStudentNote(n: any): StudentNote {
    return {
        id:          String(n.id),
        studentId:   String(n.studentUserId),
        studentName: n.studentName ?? '',
        content:     n.content ?? '',
        authorId:    String(n.authorUserId),
        authorName:  n.authorName ?? '',
        createdAt:   n.createdAt ?? '',
    };
}

// ── Recovery Credits Service (real API) ───────────────────────────────────────

export const recoveryService = {
    getAll: async (): Promise<RecoveryCredit[]> => {
        const res = await axiosInstance.get('/recovery-credits');
        return (res.data as any[]).map(mapRecoveryCredit);
    },
    getByStudent: async (studentId: string): Promise<RecoveryCredit[]> => {
        const numId = parseInt(studentId, 10);
        if (isNaN(numId)) return [];
        const res = await axiosInstance.get('/recovery-credits', { params: { studentId: numId } });
        return (res.data as any[]).map(mapRecoveryCredit);
    },
    consume: async (creditId: string, bookingId: string): Promise<RecoveryCredit> => {
        const numId = parseInt(creditId, 10);
        const res = await axiosInstance.put(`/recovery-credits/${numId}`, {
            status:              'consumed',
            consumedByBookingId: parseInt(bookingId, 10) || undefined,
        });
        return mapRecoveryCredit(res.data);
    },
};

// ── Recovery Requests Service (real API) ──────────────────────────────────────

export const recoveryRequestService = {
    getAll: async (): Promise<RecoveryRequest[]> => {
        const res = await axiosInstance.get('/recovery-requests');
        return (res.data as any[]).map(mapRecoveryRequest);
    },
    getByStudent: async (studentId: string): Promise<RecoveryRequest[]> => {
        const numId = parseInt(studentId, 10);
        if (isNaN(numId)) return [];
        const res = await axiosInstance.get('/recovery-requests', { params: { studentId: numId } });
        return (res.data as any[]).map(mapRecoveryRequest);
    },
    getByCoach: async (coachId: string): Promise<RecoveryRequest[]> => {
        const numId = parseInt(coachId, 10);
        if (isNaN(numId)) return [];
        const res = await axiosInstance.get('/recovery-requests', { params: { coachId: numId } });
        return (res.data as any[]).map(mapRecoveryRequest);
    },
    create: async (req: Omit<RecoveryRequest, 'id' | 'requestedAt' | 'status'>): Promise<RecoveryRequest> => {
        const dto = {
            studentUserId: parseInt(req.studentId, 10),
            date:          new Date(req.date).toISOString(),
        };
        const res = await axiosInstance.post('/recovery-requests', dto);
        return mapRecoveryRequest(res.data);
    },
    confirm: async (requestId: string, coachId: string): Promise<RecoveryRequest> => {
        const numId = parseInt(requestId, 10);
        const res = await axiosInstance.put(`/recovery-requests/${numId}`, {
            status:     'Confirmed',
            coachUserId: parseInt(coachId, 10) || undefined,
        });
        return mapRecoveryRequest(res.data);
    },
};

// ── Health Flags Service (real API) ───────────────────────────────────────────

export const healthService = {
    getAll: async (): Promise<StudentHealthFlag[]> => {
        const res = await axiosInstance.get('/health-flags');
        return (res.data as any[]).map(mapHealthFlag);
    },
    getByStudent: async (studentId: string): Promise<StudentHealthFlag[]> => {
        const numId = parseInt(studentId, 10);
        if (isNaN(numId)) return [];
        const res = await axiosInstance.get('/health-flags', { params: { studentId: numId } });
        return (res.data as any[]).map(mapHealthFlag);
    },
    create: async (flag: Omit<StudentHealthFlag, 'id'> & { createdByUserId: string }): Promise<StudentHealthFlag> => {
        const dto = {
            studentUserId:   parseInt(flag.studentId, 10),
            createdByUserId: parseInt(flag.createdByUserId, 10),
            type:            flag.type,
            severity:        flag.severity,
            protocolText:    flag.protocolText,
        };
        const res = await axiosInstance.post('/health-flags', dto);
        return mapHealthFlag(res.data);
    },
    update: async (id: string, updates: Partial<Pick<StudentHealthFlag, 'severity' | 'protocolText' | 'isActive'>>): Promise<StudentHealthFlag> => {
        const numId = parseInt(id, 10);
        const res = await axiosInstance.put(`/health-flags/${numId}`, updates);
        return mapHealthFlag(res.data);
    },
    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/health-flags/${parseInt(id, 10)}`);
    },
};

// ── Progress Service (real API) ───────────────────────────────────────────────

export const progressService = {
    getLatestByStudent: async (studentId: string): Promise<ProgressSnapshot | undefined> => {
        const numId = parseInt(studentId, 10);
        if (isNaN(numId)) return undefined;
        const res = await axiosInstance.get('/progress', { params: { studentId: numId, latest: true } });
        const data = res.data as any[];
        return data.length > 0 ? mapProgressSnapshot(data[0]) : undefined;
    },
    getAllLatest: async (): Promise<ProgressSnapshot[]> => {
        const res = await axiosInstance.get('/progress');
        return (res.data as any[]).map(mapProgressSnapshot);
    },
    getByStudent: async (studentId: string): Promise<ProgressSnapshot[]> => {
        const numId = parseInt(studentId, 10);
        if (isNaN(numId)) return [];
        const res = await axiosInstance.get('/progress', { params: { studentId: numId } });
        return (res.data as any[]).map(mapProgressSnapshot);
    },
    create: async (snapshot: Omit<ProgressSnapshot, 'id'> & { coachId?: string }): Promise<ProgressSnapshot> => {
        const dto = {
            studentUserId: parseInt(snapshot.studentId, 10),
            coachUserId:   snapshot.coachId ? parseInt(snapshot.coachId, 10) || undefined : undefined,
            metricKey:     snapshot.metricKey,
            metricValue:   snapshot.metricValue,
            recordedAt:    new Date(snapshot.recordedAt).toISOString(),
        };
        const res = await axiosInstance.post('/progress', dto);
        return mapProgressSnapshot(res.data);
    },
};

// ── Special Offers Service (real API) ─────────────────────────────────────────

export const offerService = {
    getAll: async (): Promise<SpecialOffer[]> => {
        const res = await axiosInstance.get('/offers');
        return (res.data as any[]).map(mapSpecialOffer);
    },
    getByStudent: async (studentId: string): Promise<SpecialOffer[]> => {
        const numId = parseInt(studentId, 10);
        if (isNaN(numId)) return [];
        const res = await axiosInstance.get('/offers', { params: { studentId: numId } });
        return (res.data as any[]).map(mapSpecialOffer);
    },
    send: async (offer: Omit<SpecialOffer, 'id' | 'sentDate'>): Promise<SpecialOffer> => {
        const dto = {
            studentUserId: parseInt(offer.studentId, 10),
            sentByUserId:  parseInt(offer.sentBy, 10),
            title:         offer.title,
            description:   offer.description,
            discount:      offer.discount,
            validUntil:    new Date(offer.validUntil).toISOString(),
        };
        const res = await axiosInstance.post('/offers', dto);
        return mapSpecialOffer(res.data);
    },
    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/offers/${parseInt(id, 10)}`);
    },
};

// ── Student Notes Service (real API) ──────────────────────────────────────────

export const noteService = {
    getAll: async (): Promise<StudentNote[]> => {
        const res = await axiosInstance.get('/notes');
        return (res.data as any[]).map(mapStudentNote);
    },
    getByStudent: async (studentId: string): Promise<StudentNote[]> => {
        const numId = parseInt(studentId, 10);
        if (isNaN(numId)) return [];
        const res = await axiosInstance.get('/notes', { params: { studentId: numId } });
        return (res.data as any[]).map(mapStudentNote);
    },
    create: async (note: Omit<StudentNote, 'id' | 'createdAt'>): Promise<StudentNote> => {
        const dto = {
            studentUserId: parseInt(note.studentId, 10),
            authorUserId:  parseInt(note.authorId, 10),
            content:       note.content,
        };
        const res = await axiosInstance.post('/notes', dto);
        return mapStudentNote(res.data);
    },
    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/notes/${parseInt(id, 10)}`);
    },
};

// ── Payment Service (real API) ────────────────────────────────────────────────

export const paymentService = {
    process: async (dto: {
        studentUserId: number;
        serviceId: number;
        planName: string;
        amount: number;
        sessionsTotal: number;
        method: string;
        cardHolderName: string;
        contactEmail: string;
        contactPhone: string;
    }): Promise<{ isSuccess: boolean; message?: string; transactionReference?: string }> => {
        const res = await axiosInstance.post('/payments/process', dto);
        return res.data;
    },
};

// ── Password reset (self-service) ─────────────────────────────────────────────

export const passwordService = {
    forgot: async (email: string): Promise<{ isSuccess: boolean; message: string; token?: string | null }> => {
        const res = await axiosInstance.post('/session/forgot-password', { email });
        return res.data;
    },
    reset: async (token: string, newPassword: string): Promise<{ isSuccess: boolean; message: string }> => {
        const res = await axiosInstance.post('/session/reset-password', { token, newPassword });
        return res.data;
    },
};
