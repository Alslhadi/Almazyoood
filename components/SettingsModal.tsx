import React from 'react';
import { Page } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (page: Page) => void;
    onLanguageChange: () => void;
    onOpenPasscodeModal: () => void;
    t: (key: string) => string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onNavigate, onLanguageChange, onOpenPasscodeModal, t }) => {
    const { isAuthenticated, logout } = useAuth();

    if (!isOpen) {
        return null;
    }

    const handleNavigateTools = () => {
        onNavigate('tools');
        onClose();
    };

    const handleLogin = () => {
        onOpenPasscodeModal();
    };

    const handleSignOut = () => {
        logout();
        onClose();
    };

    return (
        <div className="settings-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="settings-title">
            <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
                
                <h3 id="settings-title" className="text-xl font-bold mb-6 text-center">{t('settings_title')}</h3>

                <div className="flex flex-col gap-4">
                    {isAuthenticated ? (
                        <>
                            <button onClick={handleNavigateTools} className="settings-btn">
                                {t('settings_tools')}
                            </button>
                             <button onClick={onLanguageChange} className="settings-btn">
                                {t('settings_language')} ({t('lang_switcher')})
                            </button>
                            <button onClick={handleSignOut} className="settings-btn !text-red-400 hover:!border-red-400">
                                {t('settings_signout')}
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleLogin} className="settings-btn">
                                {t('settings_signin')}
                            </button>
                             <button onClick={onLanguageChange} className="settings-btn">
                                {t('settings_language')} ({t('lang_switcher')})
                            </button>
                        </>
                    )}
                </div>

                <button onClick={onClose} className="close-btn" aria-label="Close settings">
                    &times;
                </button>
            </div>
        </div>
    );
};

export default SettingsModal;