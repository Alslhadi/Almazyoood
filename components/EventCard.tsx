import React, { useState, useEffect } from 'react';
import { EventData } from '../types';

interface Countdown {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

interface EventCardProps {
    event: EventData;
    eventDate: Date;
    t: (key: string) => string;
    isAuthenticated: boolean;
    onEdit: (event: EventData) => void;
    onDelete: (eventId: string) => void;
}

const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 20l-4.95-5.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const EventCard: React.FC<EventCardProps> = ({ event, eventDate, t, isAuthenticated, onEdit, onDelete }) => {
    const [timeLeft, setTimeLeft] = useState<Countdown | null>(null);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = eventDate.getTime() - now.getTime();

            // Check if the event is currently live (e.g., within 3 hours of start time)
            const threeHours = 3 * 60 * 60 * 1000;
            if (difference <= 0 && difference > -threeHours) {
                 setIsLive(true);
                 setTimeLeft(null);
                 if(timer) clearInterval(timer);
                 return;
            }

            if (difference <= -threeHours) {
                setIsLive(false);
                setTimeLeft(null);
                if(timer) clearInterval(timer);
                return;
            }

            setIsLive(false);
            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            });
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft(); // Initial calculation

        return () => clearInterval(timer);
    }, [eventDate]);

    const renderCountdown = () => {
        if (!timeLeft) return null;

        return (
            <div className="flex justify-center gap-4 text-center">
                <div>
                    <div className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>{String(timeLeft.days).padStart(2, '0')}</div>
                    <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-secondary-dark)' }}>{t('countdown_days')}</div>
                </div>
                <div>
                    <div className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-secondary-dark)' }}>{t('countdown_hours')}</div>
                </div>
                <div>
                    <div className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-secondary-dark)' }}>{t('countdown_minutes')}</div>
                </div>
                <div>
                    <div className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-secondary-dark)' }}>{t('countdown_seconds')}</div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full rounded-2xl p-6 flex flex-col items-center gap-4 text-center relative"
            style={{
                backgroundColor: 'var(--tool-card-bg-dark)',
                border: '1px solid var(--tool-card-border-dark)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
            }}>
            
            {isAuthenticated && (
                <div className="absolute top-3 ltr:right-3 rtl:left-3 flex gap-2">
                    <button onClick={() => onEdit(event)} className="text-xs py-1 px-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                        {t('edit_event_button')}
                    </button>
                    <button onClick={() => onDelete(event.id)} className="text-xs py-1 px-3 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors">
                        {t('delete_event_button')}
                    </button>
                </div>
            )}
            
            <h3 className="text-2xl font-bold mt-4">{event.name}</h3>
            
            <div className="font-medium" style={{ color: 'var(--text-secondary-dark)' }}>
                {event.locationLink ? (
                    <a href={event.locationLink} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center justify-center gap-2 transition-colors hover:text-white">
                        <MapPinIcon />
                        <span>{event.location}</span>
                    </a>
                ) : (
                    <span>{event.location}</span>
                )}
            </div>

            <p className="text-sm font-semibold tracking-wider">
                {event.date} | {event.time}
            </p>
            <div className="w-full h-px my-2 bg-[--tool-card-border-dark]" />
            {isLive ? (
                 <p className="font-bold text-xl text-red-500 live-badge">{t('event_now')}</p>
            ) : (
                renderCountdown()
            )}
        </div>
    );
};

export default EventCard;