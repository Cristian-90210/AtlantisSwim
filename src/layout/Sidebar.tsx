import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    UserCircle,
    Settings,
    LogOut,
    X,
    Waves,
    BookOpen,
    Megaphone,
    CalendarCheck,
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const role = user?.role;

    const publicLinks = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/courses', icon: GraduationCap, label: 'Abonamente' },
    ];

    const studentLinks = role === UserRole.Student ? [
        { to: '/student', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/student/schedule', icon: CalendarCheck, label: 'Orar' },
    ] : [];

    const coachLinks = role === UserRole.Coach ? [
        { to: '/coach', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/coach/schedule', icon: CalendarCheck, label: 'Orar' },
        { to: '/coach/attendance', icon: Users, label: 'Prezență' },
        { to: '/coach/results', icon: BookOpen, label: 'Rezultate' },
    ] : [];

    const adminLinks = role === UserRole.Admin ? [
        { to: '/admin', icon: Settings, label: 'Dashboard Admin' },
        { to: '/admin/users', icon: Users, label: 'Utilizatori' },
        { to: '/students', icon: UserCircle, label: 'Elevi' },
        { to: '/admin/courses', icon: BookOpen, label: 'Cursuri' },
        { to: '/admin/services', icon: Waves, label: 'Servicii Înot' },
        { to: '/admin/announcements', icon: Megaphone, label: 'Anunțuri' },
        { to: '/admin/reservations', icon: CalendarCheck, label: 'Rezervări' },
    ] : [];

    const allLinks = role === UserRole.Admin
        ? adminLinks
        : role === UserRole.Coach
            ? [...publicLinks, ...coachLinks]
            : [...publicLinks, ...studentLinks];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={clsx(
                    "fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={clsx(
                "fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        Atlantis SwimSchool
                    </span>
                    <button onClick={onClose} className="lg:hidden p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
                    {allLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/admin' || link.to === '/' || link.to === '/student' || link.to === '/coach'}
                            onClick={() => window.innerWidth < 1024 && onClose()}
                            className={({ isActive }) => clsx(
                                "flex items-center px-4 py-2.5 text-[14px] font-medium rounded-lg transition-colors",
                                isActive
                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
                            )}
                        >
                            <link.icon className="w-4 h-4 mr-3 shrink-0" />
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
                    {user && (
                        <div className="flex items-center gap-3 mb-3 px-2">
                            <div className="w-8 h-8 rounded-full bg-host-cyan/20 flex items-center justify-center text-host-cyan font-bold text-sm">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-3" />
                        Deconectare
                    </button>
                </div>
            </div>
        </>
    );
};
