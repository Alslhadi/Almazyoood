import React from 'react';
import { SPOTIFY_URL, YOUTUBE_URL, INSTAGRAM_URL, TIKTOK_URL } from '../constants';

const SpotifyIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.583 14.238c-.2.334-.567.434-.9.234-2.733-1.667-6.166-2.033-10.233-1.1a.5.5 0 01-.567-.433c-.066-.333.2-.633.533-.7 4.367-.966 8.1- .566 11.066 1.233.334.2.434.567.234.9zm.667-2.433c-.266.4-.733.533-1.133.3-2.967-1.833-7.4-2.333-11.633-1.266a.625.625 0 01-.7-.6c-.1-.433.3- .8.733-.9 4.633-1.167 9.433-.634 12.7 1.4.4.233.533.7.3 1.133zm.2-2.733C14.05 9.14 8.783 8.907 5.15 9.94a.75.75 0 01-.85-.716c-.133-.517.417-1 .95-1.15 4.016-1.117 9.85- .85 13.916 1.45.483.266.65.85.384 1.333a1.001 1.001 0 01-1.334-.384z" fill="currentColor"/>
    </svg>
);

const YouTubeIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M21.582 7.23c-.23-.84-.888-1.5-1.728-1.728C18.25 5 12 5 12 5s-6.25 0-7.854.502c-.84.23-1.5.888-1.728 1.728C2 8.835 2 12 2 12s0 3.165.502 4.77c.23.84.888 1.5 1.728 1.728C5.75 19 12 19 12 19s6.25 0 7.854-.502c.84-.23 1.5-.888 1.728-1.728C22 15.165 22 12 22 12s0-3.165-.418-4.77zM9.75 15.125V8.875L15.217 12 9.75 15.125z" fill="currentColor"/>
    </svg>
);

const InstagramIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M12 2c-2.717 0-3.056.01-4.122.06-1.065.05-1.79.217-2.428.465a4.897 4.897 0 00-1.77 1.153 4.908 4.908 0 00-1.153 1.77c-.248.638-.415 1.363-.465 2.428C2.01 8.944 2 9.283 2 12s.01 3.056.06 4.122c.05 1.065.217 1.79.465 2.428a4.897 4.897 0 001.153 1.77 4.908 4.908 0 001.77 1.153c.638.248 1.363.415 2.428.465C8.944 21.99 9.283 22 12 22s3.056-.01 4.122-.06c1.065-.05 1.79-.217 2.428-.465a4.897 4.897 0 001.77-1.153 4.908 4.908 0 001.153-1.77c.248-.638.415-1.363.465-2.428C21.99 15.056 22 14.717 22 12s-.01-3.056-.06-4.122c-.05-1.065-.217-1.79-.465-2.428a4.897 4.897 0 00-1.153-1.77 4.908 4.908 0 00-1.77-1.153c-.638-.248-1.363-.415-2.428-.465C15.056 2.01 14.717 2 12 2zm0 1.8c2.649 0 2.956.01 4.004.058.975.045 1.505.207 1.857.344.466.182.799.399 1.15.748.35.351.566.683.748 1.15.137.352.3.882.344 1.857.048.948.058 1.355.058 4.004s-.01 3.056-.058 4.004c-.045.975-.207 1.505-.344 1.857a3.097 3.097 0 01-.748 1.15 3.1 3.1 0 01-1.15.748c-.352.137-.882.3-1.857.344-.948.048-1.355.058-4.004.058s-3.056-.01-4.004-.058c-.975-.045-1.505-.207-1.857-.344a3.097 3.097 0 01-1.15-.748 3.1 3.1 0 01-.748-1.15c-.137-.352-.3-.882-.344-1.857C3.81 15.056 3.8 14.649 3.8 12s.01-3.056.058-4.004c.045-.975.207-1.505.344-1.857.182-.466.399-.799.748-1.15.351-.35.683-.566 1.15-.748.352-.137.882-.3 1.857-.344C8.944 3.81 9.351 3.8 12 3.8zm0 4.35a3.85 3.85 0 100 7.7 3.85 3.85 0 000-7.7zM12 14a2 2 0 110-4 2 2 0 010 4zm6.2-7.1a.9.9 0 100-1.8.9.9 0 000 1.8z" fill="currentColor"/>
    </svg>
);

const TikTokIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M16.6 5.82s.01 0 .01 0c.32 0 .63.02.94.06v3.36c-1.16-.03-2.31-.16-3.44-.42a12.8 12.8 0 01-2.27-1.12v8.52c0 2.22-1.81 4.03-4.03 4.03S4.78 18.45 4.78 16.23s1.81-4.03 4.03-4.03c.18 0 .36.01.53.04v3.2c-.18-.02-.36-.03-.53-.03c-.58 0-1.05.47-1.05 1.05s.47 1.05 1.05 1.05c.58 0 1.05-.47 1.05-1.05v-8.4c1.3-.8 2.8-1.28 4.38-1.42l.2-3.95z" fill="currentColor"/>
    </svg>
);

interface LinkCardProps {
    href: string;
    icon: React.ReactNode;
    text: string;
}

const LinkCard: React.FC<LinkCardProps> = ({ href, icon, text }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between p-6 rounded-2xl w-full transition-all duration-300 hover:transform hover:-translate-y-1.5 hover:border-[--accent-color] group"
        style={{
            backgroundColor: 'var(--tool-card-bg-dark)',
            border: '1px solid var(--tool-card-border-dark)',
            backdropFilter: 'blur(10px)',
        }}
    >
        <div className="flex items-center gap-4">
            <div className="text-white group-hover:text-[--accent-color] transition-colors">{icon}</div>
            <span className="text-xl font-bold">{text}</span>
        </div>
        <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">&rarr;</span>
    </a>
);


interface LinksPageProps {
    t: (key: string) => string;
}

const LinksPage: React.FC<LinksPageProps> = ({ t }) => {
    const links = [
        { href: SPOTIFY_URL, icon: <SpotifyIcon />, textKey: 'links_spotify' },
        { href: YOUTUBE_URL, icon: <YouTubeIcon />, textKey: 'links_youtube' },
        { href: INSTAGRAM_URL, icon: <InstagramIcon />, textKey: 'links_instagram' },
        { href: TIKTOK_URL, icon: <TikTokIcon />, textKey: 'links_tiktok' },
    ];

    return (
        <div className="w-full max-w-lg text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12">{t('links_title')}</h1>
            <div className="space-y-6">
                {links.map((link) => (
                    <LinkCard
                        key={link.href}
                        href={link.href}
                        icon={link.icon}
                        text={t(link.textKey)}
                    />
                ))}
            </div>
        </div>
    );
};

export default LinksPage;
