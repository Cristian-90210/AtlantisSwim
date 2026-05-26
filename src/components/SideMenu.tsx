import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Home,
    User,
    Users,
    BookOpen,
    LayoutDashboard,
    X,
    LogOut,
    UserCircle,
    CreditCard,
    Calendar,
    Trophy,
    ClipboardList,
    Megaphone,
    ShoppingCart,
    Languages,
    Sun,
    Moon,
    Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole, getRoleLabel } from '../types';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Logo } from '../components/Logo';
import clsx from 'clsx';

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
    const { t, i18n } = useTranslation();
    const { logout, user } = useAuth();
    const { totalItems } = useCart();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const languages = ['ro', 'en', 'ru'] as const;

    // Public menu: landing page links only when NOT logged in
    // Authenticated: role-specific dashboard + relevant links
    const links = user
        ? [
            ...(user.role === UserRole.Student ? [
                { to: '/student', label: t('header.dashboard'), icon: LayoutDashboard },
                { to: '/prezenta', label: t('header.attendance', { defaultValue: 'Prezență' }), icon: ClipboardList },
                { to: '/student/profile', label: t('dropdown.my_profile', { defaultValue: 'My Profile' }), icon: UserCircle },
                { to: '/student/subscription', label: t('dropdown.my_subscription', { defaultValue: 'My Subscription' }), icon: CreditCard },
                { to: '/student/schedule', label: t('dropdown.schedule', { defaultValue: 'Schedule' }), icon: Calendar },
                { to: '/student/results', label: t('dropdown.results', { defaultValue: 'Results' }), icon: Trophy },
                { to: '/student/settings', label: t('dropdown.settings', { defaultValue: 'Settings' }), icon: Settings },
            ] : []),
            ...(user.role === UserRole.Coach ? [
                { to: '/coach', label: t('header.dashboard'), icon: LayoutDashboard },
                { to: '/coach/profile', label: t('dropdown.my_profile', { defaultValue: 'My Profile' }), icon: UserCircle },
                { to: '/coach/schedule', label: t('dropdown.training_schedule', { defaultValue: 'Training Schedule' }), icon: Calendar },
                { to: '/coach/attendance', label: t('dropdown.attendance', { defaultValue: 'Attendance' }), icon: ClipboardList },
                { to: '/coach/results', label: t('dropdown.student_results', { defaultValue: 'Student Results' }), icon: Trophy },
                { to: '/coach/settings', label: t('dropdown.settings', { defaultValue: 'Settings' }), icon: Settings },
            ] : []),
            ...(user.role === UserRole.Admin ? [
                { to: '/admin', label: t('header.dashboard'), icon: LayoutDashboard },
                { to: '/admin/users', label: t('dropdown.manage_users', { defaultValue: 'Manage Users' }), icon: Users },
                { to: '/admin/reservations', label: t('dropdown.reservations', { defaultValue: 'Reservations' }), icon: BookOpen },
                { to: '/admin/announcements', label: t('dropdown.announcements', { defaultValue: 'Announcements' }), icon: Megaphone },
                { to: '/courses', label: t('header.courses'), icon: BookOpen },
                { to: '/coaches', label: t('header.coaches', { defaultValue: 'Coaches' }), icon: User },
                { to: '/students', label: t('header.students'), icon: Users },
            ] : []),
        ]
        : [
            { to: '/', label: t('header.home'), icon: Home },
            { to: '/courses', label: t('header.courses'), icon: BookOpen },
            { to: '/coaches', label: t('header.our_team'), icon: User },
            { to: '/faq', label: t('header.faq'), icon: BookOpen },
        ];

    const actionButtonClassName =
        'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-100 transition-colors duration-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300';


    const handleCartClick = () => {
        navigate('/cart');
        onClose();
    };

    const handleLoginClick = () => {
        navigate('/login');
        onClose();
    };

    const handleLogoutClick = () => {
        logout();
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={clsx(
                    'fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 md:hidden',
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
                aria-hidden={!isOpen}
            />

            {/* Sidebar Drawer */}
            <aside
                className={clsx(
                    'fixed left-0 top-0 z-50 flex h-full w-[min(22rem,88vw)] transform flex-col overflow-hidden bg-gradient-to-b from-[#061c3a] via-[#0a2548] to-[#04152f] text-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden',
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
                aria-hidden={!isOpen}
                aria-label="Meniu principal"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
                    <Logo
                        iconClassName="h-9 w-9"
                        titleClassName="text-sm tracking-[0.22em] text-white"
                        subtitleClassName="text-sm tracking-[0.18em] text-host-cyan"
                        textClassName="gap-1"
                    />
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-200 transition-colors duration-300 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                        aria-label="Închide meniul"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Profile Card */}
                {user && (
                    <div className="border-b border-white/10 bg-black/10 px-4 py-4">
                        <div className="flex items-center space-x-3">
                            <img
                                src={user.avatar || `https://ui-avatars.com/api/?background=0ea5e9&color=fff&name=${encodeURIComponent(user.name)}`}
                                alt={user.name}
                                className="h-12 w-12 rounded-full object-cover ring-2 ring-cyan-300/40 shadow"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-white">{user.name}</p>
                                <p className="truncate text-xs text-slate-300">{user.email}</p>
                                <span className="mt-1 inline-block rounded-full bg-cyan-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-cyan-200">
                                    {getRoleLabel(user.role)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                    <nav className="space-y-1.5" aria-label="Navigare mobilă">
                    {links.map((link: any) => {
                        if (link.to.startsWith('#')) {
                            return (
                                <button
                                    key={link.to}
                                    onClick={() => {
                                        onClose();
                                        const id = link.to.substring(1);
                                        if (location.pathname === '/') {
                                            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                                        } else {
                                            navigate('/');
                                            setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
                                        }
                                    }}
                                    className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-300 text-slate-100 hover:bg-white/10 hover:text-cyan-200 w-full text-left"
                                    aria-label={link.label}
                                >
                                    <link.icon size={20} />
                                    <span>{link.label}</span>
                                </button>
                            );
                        }
                        return (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={onClose}
                                className={({ isActive }) => clsx(
                                    'flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-300',
                                    isActive
                                        ? 'bg-cyan-300/15 font-bold text-cyan-200 ring-1 ring-cyan-300/20'
                                        : 'text-slate-100 hover:bg-white/10 hover:text-cyan-200'
                                )}
                                aria-label={link.label}
                            >
                                <link.icon size={20} />
                                <span>{link.label}</span>
                            </NavLink>
                        );
                    })}
                    </nav>

                    <div className="my-4 border-t border-white/10" />

                    <div className="space-y-1.5" aria-label="Acțiuni rapide">

                        <button
                            type="button"
                            onClick={handleCartClick}
                            className={actionButtonClassName}
                            aria-label={t('header.cart', { defaultValue: 'Cart' })}
                        >
                            <span className="flex items-center gap-3">
                                <ShoppingCart size={18} />
                                <span>{t('header.cart', { defaultValue: 'Cart' })}</span>
                            </span>
                            <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-cyan-300 px-2 py-1 text-xs font-bold text-slate-950">
                                {totalItems}
                            </span>
                        </button>

                        <div className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-100">
                            <span className="flex items-center gap-3 font-medium">
                                <Languages size={18} />
                                <span>{t('header.language', { defaultValue: 'Language' })}</span>
                            </span>
                            <div
                                className="flex items-center gap-1"
                                role="group"
                                aria-label={t('header.language', { defaultValue: 'Language selector' })}
                            >
                                {languages.map((language) => {
                                    const isActive = i18n.language === language;
                                    return (
                                        <button
                                            key={language}
                                            type="button"
                                            onClick={() => i18n.changeLanguage(language)}
                                            className={clsx(
                                                'rounded-lg px-2.5 py-1.5 text-xs font-bold uppercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300',
                                                isActive
                                                    ? 'bg-cyan-300 text-slate-950'
                                                    : 'text-slate-100 hover:bg-white/10'
                                            )}
                                            aria-pressed={isActive}
                                        >
                                            {language}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-100">
                            <span className="flex items-center gap-3 font-medium">
                                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                                <span>{t('header.theme', { defaultValue: 'Dark Mode' })}</span>
                            </span>
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className={clsx(
                                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300',
                                    theme === 'dark' ? 'bg-cyan-300' : 'bg-white/20'
                                )}
                                aria-label={theme === 'dark' ? 'Comută pe tema luminoasă' : 'Comută pe tema întunecată'}
                                aria-pressed={theme === 'dark'}
                                role="switch"
                            >
                                <span
                                    className={clsx(
                                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300',
                                        theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                                    )}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-white/10 p-4">
                    {user ? (
                        <button
                            onClick={handleLogoutClick}
                            className="flex w-full items-center justify-center space-x-3 rounded-full border border-red-300/30 bg-red-400/10 px-4 py-3 font-semibold text-red-100 transition-colors duration-300 hover:bg-red-400/20"
                            aria-label={t('header.logout')}
                        >
                            <LogOut size={20} />
                            <span>{t('header.logout')}</span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleLoginClick}
                            className="w-full rounded-lg bg-cyan-300 px-4 py-3 text-center font-bold text-slate-950 shadow-lg shadow-cyan-950/30 transition-all duration-300 hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100"
                            aria-label={t('header.connect', { defaultValue: 'Conectare' })}
                        >
                            {t('header.connect', { defaultValue: 'Conectare' })}
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
};
