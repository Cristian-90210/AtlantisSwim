import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getRoleKey } from '../types';
import type { AppNotification } from '../types';
import { useAuth } from './AuthContext';
import { chatService } from '../services/chatService';

interface NotificationsContextType {
    notifications: AppNotification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
    pushNotification: (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    // Când se schimbă userul (login/logout), resetăm notificările
    const prevUserIdRef = useRef<string | undefined>(user?.id);
    useEffect(() => {
        if (prevUserIdRef.current !== user?.id) {
            prevUserIdRef.current = user?.id;
            setNotifications([]);
        }
    }, [user]);

    // Push a notification programmatically (used for real-time chat messages, etc.)
    const pushNotification = useCallback((n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
        const notif: AppNotification = {
            ...n,
            id: `push-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
            timestamp: new Date().toISOString(),
            read: false,
        };
        setNotifications(prev => [notif, ...prev]);
    }, []);

    // ── Real-time chat → bell notification ──────────────────────────────────────
    // Keep a single chat connection alive for the whole session so a "Mesaj nou"
    // notification appears no matter which page the user is on.
    useEffect(() => {
        if (!user) {
            chatService.disconnect();
            return;
        }

        const myId = parseInt(user.id);
        const roleKey = getRoleKey(user.role);
        const chatLink = roleKey === 'admin' ? undefined : `/${roleKey}/chat`;
        let unsubscribe: (() => void) | null = null;
        let active = true;

        (async () => {
            try {
                await chatService.connect();
                if (!active) return;
                unsubscribe = chatService.onMessage(msg => {
                    // Ignore my own messages echoed back by the hub.
                    if (msg.senderId === myId) return;

                    const sender = msg.senderName?.trim() || 'Cineva';
                    const preview = msg.content.length > 80
                        ? msg.content.slice(0, 80) + '…'
                        : msg.content;

                    pushNotification({
                        type: 'alert',
                        title: `Mesaj nou de la ${sender}`,
                        message: preview,
                        targetRole: roleKey,
                        link: chatLink,
                    });
                });
            } catch {
                // Connection errors are non-fatal — the chat page will retry.
            }
        })();

        return () => {
            active = false;
            unsubscribe?.();
        };
    }, [user, pushNotification]);

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
        <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, clearAll, pushNotification }}>
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationsContext);
    if (!context) throw new Error('useNotifications must be used within NotificationsProvider');
    return context;
};
