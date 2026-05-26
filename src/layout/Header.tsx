import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Menu, Sun, Moon, LogOut, LogIn, ShoppingCart } from 'lucide-react';
import { clsx } from 'clsx';

import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Button } from '../components/Button';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';

const CartIcon: React.FC = () => {
    const { totalItems } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCartClick = () => {
        if (!user) {
            navigate('/login');
        } else {
            navigate('/cart');
        }
    };

    return (
        <button
            onClick={handleCartClick}
            className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-host-cyan transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Coșul meu"
        >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                    {totalItems}
                </span>
            )}
        </button>
    );
};

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const navigateAndScroll = (to: string) => {
        if (to.startsWith('#')) {
            // If already on landing page, scroll to section
            if (location.pathname === '/') {
                const el = document.getElementById(to.substring(1));
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                    return;
                }
            }
            // Navigate to landing then scroll
            navigate('/');
            setTimeout(() => {
                const el = document.getElementById(to.substring(1));
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 300);
            return;
        }
        navigate(to);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Scroll-based hide/show
    const [hidden, setHidden] = React.useState(false);
    const lastScrollY = React.useRef(0);

    React.useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY > lastScrollY.current && currentY > 80) {
                setHidden(true);
            } else {
                setHidden(false);
            }
            lastScrollY.current = currentY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Public nav: shown ONLY when NOT authenticated (landing page visitors)
    // Authenticated nav: role-specific dashboard links only
    const navItems = user
        ? [
            // Authenticated: role-based dashboard + relevant links
            ...(user.role === UserRole.Student ? [
                { label: t('header.dashboard'), to: '/student' },
                { label: t('header.courses'), to: '/courses' },
                { label: t('header.attendance', { defaultValue: 'Prezență' }), to: '/prezenta' },
                { label: t('header.our_team'), to: '/coaches' },
            ] : []),
            ...(user.role === UserRole.Coach ? [
                { label: t('header.dashboard'), to: '/coach' },
                { label: t('header.students'), to: '/students' },
            ] : []),
            ...(user.role === UserRole.Admin ? [
                { label: t('header.dashboard'), to: '/admin' },
                { label: t('header.courses'), to: '/courses' },
                { label: t('header.coaches'), to: '/coaches' },
                { label: t('header.students'), to: '/students' },
            ] : []),
        ]
        : [
            // Public: visible ONLY on the landing page (not authenticated)
            { label: t('header.home'), to: '/' },
            { label: t('header.courses'), to: '/courses' },
            { label: t('header.our_team'), to: '/coaches' },
            { label: t('header.faq'), to: '/faq' },
        ];

    return (
        <header className={`fixed inset-x-0 top-0 z-40 transition-transform duration-300 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center">

                    {/* Left: Logo */}
                    <div
                        className="flex items-center flex-1 cursor-pointer"
                        onClick={() => navigateAndScroll('/')}
                    >
                        <img src="https://atlantisswim.md/wp-content/uploads/2025/08/cropped-asat-03-scaled-1-e1755890850322.png" alt="Atlantis SwimSchool" className="h-10 w-10 mr-2 object-contain" />
                        <span className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-wider">
                            ATLANTIS <span className="text-host-cyan">SWIMSCHOOL</span>
                        </span>
                    </div>

                    {/* Center: Navigation Links */}
                    <div className="hidden lg:flex items-center justify-center space-x-8">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.to;
                            return (
                                <button
                                    key={item.to}
                                    onClick={() => navigateAndScroll(item.to)}
                                    className={clsx(
                                        "text-sm font-bold uppercase tracking-wide transition-colors duration-200 relative py-1 bg-transparent border-none cursor-pointer",
                                        isActive
                                            ? "text-host-cyan"
                                            : "text-gray-700 dark:text-gray-300 hover:text-host-cyan"
                                    )}
                                >
                                    {item.label}
                                    <span className={clsx(
                                        "absolute bottom-0 left-0 w-full h-0.5 bg-host-cyan transform origin-left transition-transform duration-300",
                                        isActive ? "scale-x-100" : "scale-x-0"
                                    )} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Right: Actions */}
                    <div className="hidden lg:flex items-center justify-end flex-1 space-x-4">

                        {user?.role !== UserRole.Coach && <CartIcon />}

                        <LanguageSwitcher />

                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-600 dark:text-gray-300 hover:text-host-cyan transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        {user ? (
                            <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
                                <span className="text-gray-800 dark:text-white text-sm font-medium">{user.name.split(' ')[0]}</span>
                                <button onClick={handleLogout} className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors">
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <Button
                                onClick={() => navigateAndScroll('/login')}
                                className="flex items-center gap-2 px-6 py-2 rounded-full bg-host-cyan hover:bg-cyan-500 text-white font-bold text-sm uppercase tracking-wide shadow-sm hover:shadow-md transition-all duration-200 border-none"
                            >
                                <LogIn className="w-4 h-4" />
                                {t('header.connect', { defaultValue: 'Conectare' })}
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center space-x-4">

                        <button onClick={onMenuClick} className="text-gray-700 dark:text-white hover:text-host-cyan transition-colors">
                            <Menu size={28} />
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};
