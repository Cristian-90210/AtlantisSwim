import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AtlantisNavbar } from './AtlantisNavbar';
import { Footer } from './Footer';
import { SideMenu } from '../components/SideMenu';

import { clsx } from 'clsx';

export const MainLayout: React.FC = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    return (
        <div className="min-h-screen bg-white dark:bg-[#0b1220] flex flex-col font-sans transition-colors duration-300">
            <AtlantisNavbar
                onMenuClick={() => setIsMenuOpen(true)}
            />

            <SideMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />



            <main className={clsx('flex-1 flex flex-col', isHome ? 'pt-0' : 'pt-20 md:pt-24')}>
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};
