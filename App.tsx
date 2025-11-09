import React, { useState, useEffect, useCallback } from 'react';
import { Page, Language } from './types';
import { translations } from './constants';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import MusicPage from './components/MusicPage';
import EventsPage from './components/EventsPage';
import ToolsPage from './components/ToolsPage';
import SettingsModal from './components/SettingsModal';
import PasscodeModal from './components/PasscodeModal';
import { AuthProvider } from './contexts/AuthContext';

const pageComponents: Record<Page, React.ComponentType<{ t: (key: string) => string; }>> = {
    home: HomePage,
    music: MusicPage,
    events: EventsPage,
    tools: ToolsPage,
};

const AppContent: React.FC = () => {
    const [language, setLanguage] = useState<Language>('ar');
    const [activePage, setActivePage] = useState<Page>('home');
    const [leavingPage, setLeavingPage] = useState<Page | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialLoad(false);
        }, 500); // Animation delay
        return () => clearTimeout(timer);
    }, []);

    const t = useCallback((key: string): string => {
        return translations[language][key] || key;
    }, [language]);

    useEffect(() => {
        const docElement = document.documentElement;
        const bodyElement = document.body;
        
        docElement.lang = language;
        docElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        
        bodyElement.style.fontFamily = language === 'ar' 
            ? "'IBM Plex Sans Arabic', sans-serif" 
            : "'Poppins', sans-serif";

        document.title = t('title');

    }, [language, t]);

    const handleNavigate = (page: Page) => {
        if (page === activePage) return;
        setLeavingPage(activePage);
        setTimeout(() => {
            setActivePage(page);
            setLeavingPage(null);
        }, 300);
    };
    
    const handleLanguageChange = () => {
        setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
    };

    const handleOpenPasscodeModal = () => {
        setIsSettingsOpen(false);
        setIsPasscodeModalOpen(true);
    };

    const ActivePageComponent = pageComponents[activePage];

    return (
        <>
            <div id="gradient-bg">
                <div className="gradient-blob blob-1"></div>
                <div className="gradient-blob blob-2"></div>
                <div className="gradient-blob blob-3"></div>
            </div>

            <NavBar 
                activePage={activePage} 
                isInitialLoad={isInitialLoad}
                onNavigate={handleNavigate} 
                onOpenSettings={() => setIsSettingsOpen(true)}
                t={t}
            />

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onNavigate={handleNavigate}
                onLanguageChange={handleLanguageChange}
                onOpenPasscodeModal={handleOpenPasscodeModal}
                t={t}
            />

            <PasscodeModal
                isOpen={isPasscodeModalOpen}
                onClose={() => setIsPasscodeModalOpen(false)}
                t={t}
            />

            <main className={isInitialLoad ? 'initial-load' : 'loaded'}>
                {Object.keys(pageComponents).map(pageKey => {
                    const PageComponent = pageComponents[pageKey as Page];
                    const isActive = activePage === pageKey;
                    const isLeaving = leavingPage === pageKey;
                    return (
                        <section 
                            key={pageKey}
                            id={`${pageKey}-section`} 
                            className={`page-section ${isActive ? 'active' : ''} ${isLeaving ? 'is-leaving' : ''}`}
                        >
                           {isActive && <PageComponent t={t} />}
                        </section>
                    );
                })}
            </main>
        </>
    );
};


const App: React.FC = () => (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
);


export default App;