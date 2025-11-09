
import React, { useState } from 'react';
import { ToolView } from '../types';
import ImageMakerTool from './ImageMakerTool';
import EventAnnouncerTool from './EventAnnouncerTool';

interface ToolsPageProps {
    t: (key: string) => string;
}

const ToolsPage: React.FC<ToolsPageProps> = ({ t }) => {
    const [view, setView] = useState<ToolView>('selection');

    const renderView = () => {
        switch (view) {
            case 'image-maker':
                return <ImageMakerTool t={t} onBack={() => setView('selection')} />;
            case 'event-announcer':
                return <EventAnnouncerTool t={t} onBack={() => setView('selection')} />;
            case 'selection':
            default:
                return (
                    <div className="w-full max-w-3xl text-center">
                        <h2 className="text-4xl md:text-6xl font-bold mb-12">{t('tools_title')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div
                                onClick={() => setView('image-maker')}
                                className="tool-selection-card rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1.5"
                                style={{
                                    backgroundColor: 'var(--tool-card-bg-dark)',
                                    border: '1px solid var(--tool-card-border-dark)',
                                    backdropFilter: 'blur(10px)',
                                }}
                            >
                                <h3 className="text-2xl font-bold mb-2">{t('tool_card_title')}</h3>
                                <p style={{ color: 'var(--text-secondary-dark)' }}>{t('tool_card_desc')}</p>
                            </div>
                            <div
                                onClick={() => setView('event-announcer')}
                                className="tool-selection-card rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1.5"
                                style={{
                                    backgroundColor: 'var(--tool-card-bg-dark)',
                                    border: '1px solid var(--tool-card-border-dark)',
                                    backdropFilter: 'blur(10px)',
                                }}
                            >
                                <h3 className="text-2xl font-bold mb-2">{t('event_announcer_title')}</h3>
                                <p style={{ color: 'var(--text-secondary-dark)' }}>{t('event_announcer_desc')}</p>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return <>{renderView()}</>;
};

export default ToolsPage;