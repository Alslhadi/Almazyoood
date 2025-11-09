import { EventData } from '../types';

const EVENTS_STORAGE_KEY = 'alMazyooudEvents';

export const fetchEvents = async (): Promise<EventData[]> => {
    // Simulate a short network delay for realism
    await new Promise(resolve => setTimeout(resolve, 500));
     try {
        const eventsJson = localStorage.getItem(EVENTS_STORAGE_KEY);
        return eventsJson ? JSON.parse(eventsJson) : [];
    } catch (error) {
        console.error("Failed to fetch events from localStorage", error);
        return [];
    }
};

export const addEvent = async (eventData: Omit<EventData, 'id'>): Promise<EventData> => {
    const events = await fetchEvents();
    const newEvent: EventData = {
        id: Date.now().toString(),
        ...eventData,
    };
    events.push(newEvent);
    try {
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    } catch (error) {
        console.error("Failed to save event to localStorage", error);
    }
    return newEvent;
};

export const updateEvent = async (updatedEvent: EventData): Promise<EventData> => {
    let events = await fetchEvents();
    const eventIndex = events.findIndex(event => event.id === updatedEvent.id);
    if (eventIndex > -1) {
        events[eventIndex] = updatedEvent;
        try {
            localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
        } catch (error) {
            console.error("Failed to update event in localStorage", error);
        }
    }
    return updatedEvent;
};

export const deleteEvent = async (eventId: string): Promise<void> => {
    let events = await fetchEvents();
    const updatedEvents = events.filter(event => event.id !== eventId);
    try {
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
    } catch (error) {
        console.error("Failed to delete event from localStorage", error);
    }
};


export const parseEventDateTime = (event: EventData): Date | null => {
    const { date: dateStr, time: timeStr } = event;
    if (!dateStr || !timeStr) return null;

    const [day, month, year] = dateStr.split('/').map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

    const timeParts = timeStr.match(/(\d{1,2}):(\d{2})\s*(am|pm|ص|م)?/i);
    if (!timeParts) return null;

    let [, hoursStr, minutesStr, period] = timeParts;
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (isNaN(hours) || isNaN(minutes)) return null;

    if (period) {
        if ((period.toLowerCase() === 'pm' || period === 'م') && hours < 12) {
            hours += 12;
        }
        if ((period.toLowerCase() === 'am' || period === 'ص') && hours === 12) {
            hours = 0; // Midnight case
        }
    }

    // JS months are 0-indexed
    return new Date(year, month - 1, day, hours, minutes);
};