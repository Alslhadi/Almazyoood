
import React from 'react';

interface HomePageProps {
    t: (key: string) => string;
}

const HomePage: React.FC<HomePageProps> = ({ t }) => {
    return (
        <div className="w-full max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-4">
                {t('home_title')}
            </h1>
            <p className="text-lg md:text-2xl font-medium mb-10" style={{ color: 'var(--text-secondary-dark)' }}>
                {t('home_subtitle')}
            </p>
        </div>
    );
};

export default HomePage;