import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

import { Avatar } from '../components/ui/Avatar';
import {
    Dropdown,
    DropdownButton,
    DropdownMenu,
    DropdownItem,
    DropdownLabel,
} from '../components/ui/Dropdown';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Logo } from '../components/Logo';

import {
    SunIcon,
    MoonIcon,
    MagnifyingGlassIcon,
    ShoppingCartIcon,
    Bars3Icon,
    UserCircleIcon,
    CreditCardIcon,
    CalendarDaysIcon,
    TrophyIcon,
    ArrowRightStartOnRectangleIcon,
    ClipboardDocumentListIcon,
    UserGroupIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    AcademicCapIcon,
    BookOpenIcon,
    ArrowRightEndOnRectangleIcon,
} from '@heroicons/react/24/outline';

/* ══════════════════════════════════════════════════════════════
   NAVBAR PRIMITIVES
   ══════════════════════════════════════════════════════════════ */

const Navbar: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className,
}) => (
    <nav className={clsx('container mx-auto px-4 py-4 sm:px-6', className)}>
        <div className="relative flex items-center justify-between gap-3">{children}</div>
    </nav>
);

const NavbarSection: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => (
    <div className={clsx('flex items-center', className)}>{children}</div>
);

const NavbarItem: React.FC<{
    label: string;
    to: string;
    isActive?: boolean;
    onClick?: () => void;
}> = ({ label, to, isActive, onClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const handleClick = () => {
        if (to.startsWith('#')) {
            if (location.pathname === '/') {
                const el = document.getElementById(to.substring(1));
                if (el) { el.scrollIntoView({ behavior: 'smooth' }); onClick?.(); return; }
            }
            navigate('/');
            setTimeout(() => {
                const el = document.getElementById(to.substring(1));
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        } else {
            navigate(to);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        onClick?.();
    };

    return (
        <button
            onClick={handleClick}
            className={clsx(
                'text-sm font-bold uppercase tracking-wide transition-colors duration-200 relative py-1 bg-transparent cursor-pointer',
                isActive
                    ? 'text-host-cyan'
                    : 'text-gray-700 dark:text-gray-300 hover:text-host-cyan',
            )}
        >
            {label}
            <span
                className={clsx(
                    'absolute bottom-0 left-0 w-full h-0.5 bg-host-cyan transform origin-left transition-transform duration-300',
                    isActive ? 'scale-x-100' : 'scale-x-0',
                )}
            />
        </button>
    );
};

/* ══════════════════════════════════════════════════════════════
   CART BADGE (inline)
   ══════════════════════════════════════════════════════════════ */

const CartBadge: React.FC = () => {
    const { totalItems } = useCart();
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/cart')}
            className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-host-cyan transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Coșul meu"
        >
            <ShoppingCartIcon className="w-5 h-5" />
            {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                </span>
            )}
        </button>
    );
};

/* ══════════════════════════════════════════════════════════════
   ROLE-BASED AVATAR DROPDOWN
   ══════════════════════════════════════════════════════════════ */

const UserAvatarDropdown: React.FC = () => {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    if (!user) return null;

    const go = (path: string) => {
        navigate(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const initials = user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const studentItems = (
        <>
            <DropdownLabel>{t('header.student', { defaultValue: 'Student' })}</DropdownLabel>
            <DropdownItem onClick={() => go('/student/profile')}>
                <UserCircleIcon className="w-4 h-4" />
                {t('dropdown.my_profile', { defaultValue: 'My Profile' })}
            </DropdownItem>
            <DropdownItem onClick={() => go('/student/subscription')}>
                <CreditCardIcon className="w-4 h-4" />
                {t('dropdown.my_subscription', { defaultValue: 'My Subscription' })}
            </DropdownItem>
            <DropdownItem onClick={() => go('/student/schedule')}>
                <CalendarDaysIcon className="w-4 h-4" />
                {t('dropdown.schedule', { defaultValue: 'Schedule' })}
            </DropdownItem>
            <DropdownItem onClick={() => go('/student/results')}>
                <TrophyIcon className="w-4 h-4" />
                {t('dropdown.results', { defaultValue: 'Results' })}
            </DropdownItem>
        </>
    );

    const coachItems = (
        <>
            <DropdownLabel>{t('header.coach', { defaultValue: 'Coach' })}</DropdownLabel>
            <DropdownItem onClick={() => go('/coach/profile')}>
                <UserCircleIcon className="w-4 h-4" />
                {t('dropdown.my_profile', { defaultValue: 'My Profile' })}
            </DropdownItem>
            <DropdownItem onClick={() => go('/coach/schedule')}>
                <CalendarDaysIcon className="w-4 h-4" />
                {t('dropdown.training_schedule', { defaultValue: 'Training Schedule' })}
            </DropdownItem>
            <DropdownItem onClick={() => go('/coach/attendance')}>
                <ClipboardDocumentListIcon className="w-4 h-4" />
                {t('dropdown.attendance', { defaultValue: 'Attendance' })}
            </DropdownItem>
            <DropdownItem onClick={() => go('/coach/results')}>
                <TrophyIcon className="w-4 h-4" />
                {t('dropdown.student_results', { defaultValue: 'Student Results' })}
            </DropdownItem>
        </>
    );

    const adminItems = (
        <>
            <DropdownLabel>{t('header.admin', { defaultValue: 'Admin' })}</DropdownLabel>
            <DropdownItem onClick={() => go('/admin')}>
                <AcademicCapIcon className="w-4 h-4" />
                {t('dropdown.admin_dashboard', { defaultValue: 'Admin Dashboard' })}
            </DropdownItem>
            <DropdownItem onClick={() => go('/admin/users')}>
                <UserGroupIcon className="w-4 h-4" />
                {t('dropdown.manage_users', { defaultValue: 'Manage Users' })}
            </DropdownItem>
            <DropdownItem onClick={() => go('/admin/reservations')}>
                <BookOpenIcon className="w-4 h-4" />
                {t('dropdown.reservations', { defaultValue: 'Reservations' })}
            </DropdownItem>
            <DropdownItem onClick={() => go('/admin')}>
                <ChartBarIcon className="w-4 h-4" />
                {t('dropdown.reports', { defaultValue: 'Reports / Statistics' })}
            </DropdownItem>
            <DropdownItem onClick={() => go('/admin')}>
                <Cog6ToothIcon className="w-4 h-4" />
                {t('dropdown.system_settings', { defaultValue: 'System Settings' })}
            </DropdownItem>
        </>
    );

    const roleItems =
        user.role === 'admin' ? adminItems : user.role === 'coach' ? coachItems : studentItems;

    return (
        <Dropdown>
            <DropdownButton
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="User menu"
            >
                <Avatar
                    src={user.avatar}
                    initials={initials}
                    alt={user.name}
                    size="sm"
                />
                <span className="hidden md:inline text-sm font-medium text-gray-800 dark:text-white">
                    {user.name.split(' ')[0]}
                </span>
            </DropdownButton>

            <DropdownMenu anchor="right" className="translate-x-2">
                {/* Header */}
                <div className="px-4 py-3">
                    <p className="text-sm font-bold text-gray-800 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-widest text-host-cyan bg-host-cyan/10 px-2 py-0.5 rounded-full">
                        {user.role}
                    </span>
                </div>

                {roleItems}
                <DropdownItem onClick={logout} destructive>
                    <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
                    {t('header.logout', { defaultValue: 'Sign out' })}
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

/* ══════════════════════════════════════════════════════════════
   MAIN EXPORTED NAVBAR
   ══════════════════════════════════════════════════════════════ */

interface AtlantisNavbarProps {
    onMenuClick: () => void;
    onSearchClick: () => void;
}

export const AtlantisNavbar: React.FC<AtlantisNavbarProps> = ({ onMenuClick, onSearchClick }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    /* ── Scroll-based hide / show ─────────────────────── */
    const [hidden, setHidden] = React.useState(false);
    const lastScrollY = React.useRef(0);

    React.useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            setHidden(y > lastScrollY.current && y > 80);
            lastScrollY.current = y;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    /* ── Center nav items (role-based) ────────────────── */
    const navItems = user
        ? [
            ...(user.role === 'student'
                ? [
                    { label: t('header.dashboard'), to: '/student' },
                    { label: t('header.courses'), to: '/courses' },
                    { label: t('header.our_team'), to: '/coaches' },
                ]
                : []),
            ...(user.role === 'coach'
                ? [
                    { label: t('header.dashboard'), to: '/coach' },
                    { label: t('header.courses'), to: '/courses' },
                    { label: t('header.students'), to: '/students' },
                ]
                : []),
            ...(user.role === 'admin'
                ? [
                    { label: t('header.dashboard'), to: '/admin' },
                    { label: t('header.courses'), to: '/courses' },
                    { label: t('header.coaches'), to: '/coaches' },
                    { label: t('header.students'), to: '/students' },
                ]
                : []),
        ]
        : [
            { label: t('header.home'), to: '/' },
            { label: t('header.courses'), to: '/courses' },
            { label: t('header.our_team'), to: '/coaches' },
            { label: t('header.faq'), to: '/faq' },
        ];

    const navigateAndScroll = (to: string) => {
        navigate(to);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <header
            className={clsx(
                'fixed inset-x-0 top-0 z-50 w-full bg-[#071a33] transition-transform duration-300',
                hidden ? '-translate-y-full' : 'translate-y-0',
            )}
        >
            <Navbar>
                {/* ── LEFT: Logo ──────────────────────────────── */}
                <NavbarSection className="flex-1 min-w-0 max-w-[60%] cursor-pointer lg:max-w-none">
                    <div
                        className="flex min-w-0 items-center"
                        onClick={() => navigateAndScroll('/')}
                    >
                        <Logo
                            className="min-w-0 max-w-full gap-2 lg:gap-3"
                            iconClassName="h-8 w-8 shrink-0 lg:h-10 lg:w-10"
                            titleClassName="hidden truncate whitespace-nowrap text-sm text-white md:inline-flex lg:text-2xl"
                            subtitleClassName="hidden truncate whitespace-nowrap text-sm text-host-cyan md:inline-flex lg:text-2xl"
                            textClassName="hidden min-w-0 gap-1 md:flex lg:gap-2"
                        />
                    </div>
                </NavbarSection>

                {/* ── CENTER: Nav Links (absolute-centered, desktop only) ── */}
                <NavbarSection className="hidden lg:flex absolute inset-x-0 justify-center pointer-events-none">
                    <div className="flex items-center space-x-10 pointer-events-auto">
                        {navItems.map((item) => (
                            <NavbarItem
                                key={item.to}
                                label={item.label}
                                to={item.to}
                                isActive={location.pathname === item.to}
                            />
                        ))}
                    </div>
                </NavbarSection>

                {/* ── RIGHT: Actions (desktop) ────────────────── */}
                <NavbarSection className="hidden lg:flex flex-1 items-center justify-end space-x-2">
                    {/* Search */}
                    <button
                        onClick={onSearchClick}
                        className="rounded-full p-2 text-slate-200 transition-colors hover:bg-white/10 hover:text-host-cyan"
                    >
                        <MagnifyingGlassIcon className="w-5 h-5" />
                    </button>

                    {/* Cart */}
                    <CartBadge />

                    {/* Language Switcher */}
                    <LanguageSwitcher />

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="rounded-full p-2 text-slate-200 transition-colors hover:bg-white/10 hover:text-host-cyan"
                    >
                        {theme === 'light' ? (
                            <MoonIcon className="w-5 h-5" />
                        ) : (
                            <SunIcon className="w-5 h-5" />
                        )}
                    </button>

                    {/* User Avatar / Login */}
                    {user ? (
                        <UserAvatarDropdown />
                    ) : (
                        <button
                            onClick={() => navigateAndScroll('/login')}
                            className="flex items-center gap-2 px-6 py-2 rounded-full bg-host-cyan hover:bg-cyan-500 text-white font-bold text-sm uppercase tracking-wide transition-all duration-200"
                        >
                            <ArrowRightEndOnRectangleIcon className="w-4 h-4" />
                            {t('header.connect', { defaultValue: 'Conectare' })}
                        </button>
                    )}
                </NavbarSection>

                {/* ── MOBILE: Menu + Search buttons ────────────── */}
                <NavbarSection className="lg:hidden shrink-0 items-center justify-end space-x-1 sm:space-x-2">
                    <button
                        onClick={onSearchClick}
                        className="rounded-full p-2 text-white transition-colors hover:bg-white/10 hover:text-host-cyan"
                    >
                        <MagnifyingGlassIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                        onClick={onMenuClick}
                        className="rounded-full p-2 text-white transition-colors hover:bg-white/10 hover:text-host-cyan"
                    >
                        <Bars3Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </button>
                </NavbarSection>
            </Navbar>
        </header>
    );
};
