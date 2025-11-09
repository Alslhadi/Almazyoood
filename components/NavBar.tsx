
import React from 'react';
import { Page } from '../types';
import { CIRCULAR_LOGO_WATERMARK_URL } from '../constants';

interface NavBarProps {
    activePage: Page;
    isInitialLoad: boolean;
    onNavigate: (page: Page) => void;
    onOpenSettings: () => void;
    t: (key: string) => string;
}

const navItems: { id: Page; key: string }[] = [
    { id: 'home', key: 'nav_main' },
    { id: 'music', key: 'nav_songs' },
    { id: 'events', key: 'nav_events' },
];

const NavLink: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
    <button
        onClick={onClick}
        className={`nav-link text-sm md:text-base font-medium transition-colors duration-300 ${isActive ? 'active text-white' : 'text-gray-300 hover:text-white'}`}
    >
        {children}
    </button>
);

const NavBar: React.FC<NavBarProps> = ({ activePage, isInitialLoad, onNavigate, onOpenSettings, t }) => {
    return (
        <header 
            className={`fixed bottom-4 left-1/2 z-50 h-16 rounded-full transition-all duration-1000 ease-in-out ${isInitialLoad ? 'initial-load' : 'loaded'}`}
            style={{
                backgroundColor: 'var(--nav-bg-dark)',
                backdropFilter: 'saturate(180%) blur(20px)',
                WebkitBackdropFilter: 'saturate(180%) blur(20px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                border: '1px solid var(--tool-card-border-dark)'
            }}
        >
            <nav className="h-full flex items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <button 
                    onClick={onOpenSettings} 
                    className="flex-shrink-0 p-1 rounded-full transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-[--accent-color]"
                    aria-label={t('settings_title')}
                >
                     <img src={CIRCULAR_LOGO_WATERMARK_URL} alt={t('settings_title')} className="h-10 w-10 invert" />
                </button>

                {/* Links */}
                <div className="flex items-center gap-5 md:gap-8">
                    {navItems.map(item => (
                        <NavLink
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            isActive={activePage === item.id}
                        >
                           {t(item.key)}
                        </NavLink>
                    ))}
                </div>

                {/* Invisible Spacer to balance the logo and perfectly center the links */}
                <div className="w-12 flex-shrink-0" aria-hidden="true" />
            </nav>
        </header>
    );
};

export default NavBar;