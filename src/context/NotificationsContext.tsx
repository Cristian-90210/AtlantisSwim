import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getRoleKey } from '../types';
import type { AppNotification, UserRole } from '../types';
import { mockNotifications } from '../data/mockData';
import { useAuth } from './AuthContext';

// ── Notificări simulate "în timp real" ──────────────────────────────────────
const liveNotificationPool: Omit<AppNotification, 'id' | 'timestamp' | 'read'>[] = [
    { type: 'info',    title: 'Activitate nouă', message: 'Un antrenament a fost adăugat în orar.',         targetRole: 'all' },
    { type: 'success', title: 'Bazin disponibil', message: 'Bazinul olimpic este disponibil acum.',           targetRole: 'all' },
    { type: 'warning', title: 'Reamintire',       message: 'Ai un antrenament programat mâine dimineață.',   targetRole: 'student' },
    { type: 'alert',   title: 'Mesaj nou',        message: 'Ai primit un mesaj nou pe platformă.',            targetRole: 'all' },
    { type: 'info',    title: 'Statistici update', message: 'Raportul lunar de activitate este disponibil.', targetRole: 'admin' },
    { type: 'success', title: 'Student activ',    message: 'Un student a finalizat toate ședințele lunare.',  targetRole: 'coach' },
];

interface NotificationsContextType {
    notifications: AppNotification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

const INTERVAL_MS = 20000; // Notificare nouă la 20 de secunde

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    // Filtrăm notificările inițiale în funcție de rol
    const getInitialNotifications = useCallback((role: UserRole | undefined): AppNotification[] => {
        if (role === undefined) return [];
        const key = getRoleKey(role);
        return mockNotifications.filter(n => n.targetRole === 'all' || n.targetRole === key);
    }, []);

    const [notifications, setNotifications] = useState<AppNotification[]>(() =>
        getInitialNotifications(user?.role)
    );

    // Când se schimbă userul (login/logout), resetăm notificările
    const prevUserIdRef = useRef<string | undefined>(user?.id);
    useEffect(() => {
        if (prevUserIdRef.current !== user?.id) {
            prevUserIdRef.current = user?.id;
            setNotifications(getInitialNotifications(user?.role));
        }
    }, [user, getInitialNotifications]);

    // Simulare "timp real": adaugă o notificare din pool la interval
    const liveIndexRef = useRef(0);
    useEffect(() => {
        if (!user) return;

        const interval = setInterval(() => {
            const roleKey = getRoleKey(user.role);
            const pool = liveNotificationPool.filter(
                n => n.targetRole === 'all' || n.targetRole === roleKey
            );
            if (pool.length === 0) return;

            const template = pool[liveIndexRef.current % pool.length];
            liveIndexRef.current += 1;

            const newNotif: AppNotification = {
                ...template,
                id: `live-${Date.now()}`,
                timestamp: new Date().toISOString(),
                read: false,
            };

            setNotifications(prev => [newNotif, ...prev]);
        }, INTERVAL_MS);

        return () => clearInterval(interval);
    }, [user]);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, clearAll }}>
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationsContext);
    if (!context) throw new Error('useNotifications must be used within NotificationsProvider');
    return context;
};
