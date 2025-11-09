import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface PasscodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    t: (key: string) => string;
}

const PasscodeModal: React.FC<PasscodeModalProps> = ({ isOpen, onClose, t }) => {
    const { login } = useAuth();
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');

    // Reset state when modal is closed/opened
    useEffect(() => {
        if (isOpen) {
            setPasscode('');
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = login(passcode);
        if (success) {
            onClose();
        } else {
            setError(t('error_wrong_passcode'));
        }
    };

    return (
        <div className="settings-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="passcode-title">
            <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
                <h3 id="passcode-title" className="text-xl font-bold mb-6 text-center">{t('passcode_title')}</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <input
                        type="password"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder={t('passcode_placeholder')}
                        className="passcode-modal-input"
                        autoFocus
                    />
                    <div className="passcode-modal-error text-center">
                        {error}
                    </div>
                    <button type="submit" className="settings-btn mt-2">
                        {t('passcode_enter_button')}
                    </button>
                </form>
                <button onClick={onClose} className="close-btn" aria-label="Close passcode modal">
                    &times;
                </button>
            </div>
        </div>
    );
};

export default PasscodeModal;