import React, { useState, useEffect, useCallback } from 'react';
import { deleteEvent, fetchEvents, parseEventDateTime } from '../services/eventService';
import { EventData } from '../types';
import EventCard from './EventCard';
import AddEventModal from './AddEventModal';
import { useAuth } from '../contexts/AuthContext';

interface ProcessedEvent extends EventData {
    eventDate: Date;
}

interface EventsPageProps {
    t: (key: string) => string;
}

const EventsPage: React.FC<EventsPageProps> = ({ t }) => {
    const [events, setEvents] = useState<ProcessedEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<EventData | null>(null);


    const loadEvents = useCallback(async () => {
        try {
            setIsLoading(true);
            const eventsData = await fetchEvents();
            const now = new Date();
            const threeHoursAgo = new Date(now.getTime() - (3 * 60 * 60 * 1000));

            const processedEvents = eventsData
                .map(event => ({
                    ...event,
                    eventDate: parseEventDateTime(event)
                }))
                .filter((event): event is ProcessedEvent & { eventDate: Date } => {
                    return event.eventDate instanceof Date && event.eventDate > threeHoursAgo;
                })
                .sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());

            setEvents(processedEvents);
        } catch (err) {
            setError(t('events_none'));
            console.error("Error fetching events:", err);
        } finally {
            setIsLoading(false);
        }
    }, [t]);
    
    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    const handleEventSaved = () => {
        setAddModalOpen(false);
        setEventToEdit(null);
        loadEvents();
    };

    const handleOpenEditModal = (event: EventData) => {
        setEventToEdit(event);
        setAddModalOpen(true);
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (window.confirm(t('delete_confirm_message'))) {
            try {
                await deleteEvent(eventId);
                loadEvents();
            } catch (error) {
                console.error("Failed to delete event:", error);
            }
        }
    };


    return (
        <div className="w-full max-w-3xl text-center">
             <div className={`flex ${isAuthenticated ? 'justify-between' : 'justify-center'} items-center mb-10 w-full gap-4`}>
                <h1 className={`text-4xl md:text-7xl font-bold tracking-tight flex-1 ${isAuthenticated ? 'text-right' : 'text-center'}`}>{t('events_title')}</h1>
                {isAuthenticated && (
                    <button onClick={() => setAddModalOpen(true)} className="py-2 px-5 rounded-full text-black font-semibold bg-[--accent-color] hover:scale-105 transition-transform duration-200 whitespace-nowrap text-sm md:text-base">
                        {t('add_event_button')}
                    </button>
                )}
            </div>
            <div className="w-full space-y-6">
                {isLoading ? (
                    <p>{t('events_loading')}</p>
                ) : error ? (
                    <p>{error}</p>
                ) : events.length > 0 ? (
                    events.map((event) => (
                       <EventCard 
                            key={event.id} 
                            event={event} 
                            eventDate={event.eventDate} 
                            t={t}
                            isAuthenticated={isAuthenticated}
                            onEdit={handleOpenEditModal}
                            onDelete={handleDeleteEvent}
                        />
                    ))
                ) : (
                    <p>{t('events_none')}</p>
                )}
            </div>
             <AddEventModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setAddModalOpen(false);
                    setEventToEdit(null);
                }}
                onEventSaved={handleEventSaved}
                t={t}
                eventToEdit={eventToEdit}
            />
        </div>
    );
};

export default EventsPage;