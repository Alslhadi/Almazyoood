
import React, { useState } from 'react';

interface MusicPageProps {
    t: (key: string) => string;
}

const MusicPage: React.FC<MusicPageProps> = ({ t }) => {
    const [activeTab, setActiveTab] = useState<'spotify' | 'youtube'>('spotify');

    return (
        <div className="text-center w-full max-w-xl mx-auto">
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-4">{t('songs_title')}</h1>
            <p className="text-lg md:text-2xl font-medium mb-10" style={{ color: 'var(--text-secondary-dark)' }}>
                {t('songs_subtitle')}
            </p>
            <div className="flex items-center justify-center gap-2 mb-4 p-1 rounded-lg bg-black/20 w-fit mx-auto">
                <button
                    onClick={() => setActiveTab('spotify')}
                    className={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-300 ${
                        activeTab === 'spotify' ? 'text-white bg-white/10' : 'text-gray-400'
                    }`}
                >
                    {t('music_spotify')}
                </button>
                <button
                    onClick={() => setActiveTab('youtube')}
                    className={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-300 ${
                        activeTab === 'youtube' ? 'text-white bg-white/10' : 'text-gray-400'
                    }`}
                >
                    {t('music_youtube')}
                </button>
            </div>
            <div className="relative h-[220px] md:h-[380px] mb-8">
                <div className={`absolute inset-0 transition-opacity duration-500 ${activeTab === 'spotify' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <iframe
                        style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}
                        src="https://open.spotify.com/embed/artist/3nSx2hjwIan6aGRyNSCOeF?utm_source=generator&theme=0"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                    ></iframe>
                </div>
                <div className={`absolute inset-0 transition-opacity duration-500 ${activeTab === 'youtube' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <iframe
                        style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/videoseries?list=UUJp0f-5yLq-l-H4J_g-l40g"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default MusicPage;