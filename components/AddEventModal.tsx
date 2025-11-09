import React, { useState, useEffect } from 'react';
import { addEvent, updateEvent } from '../services/eventService';
import { EventData } from '../types';

interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEventSaved: () => void;
    t: (key: string) => string;
    eventToEdit?: EventData | null;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onEventSaved, t, eventToEdit }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState(''); // YYYY-MM-DD from input
    const [time, setTime] = useState(''); // HH:mm from input
    const [location, setLocation] = useState('');
    const [locationLink, setLocationLink] = useState('');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const isEditMode = !!eventToEdit;

    const resetForm = () => {
        setName('');
        setDate('');
        setTime('');
        setLocation('');
        setLocationLink('');
        setError('');
    };
    
    useEffect(() => {
        if (isOpen) {
            if (isEditMode && eventToEdit) {
                setName(eventToEdit.name);
                setLocation(eventToEdit.location);
                setLocationLink(eventToEdit.locationLink || '');
                
                const [day, month, year] = eventToEdit.date.split('/');
                if (day && month && year) {
                    setDate(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
                }

                const timeParts = eventToEdit.time.match(/(\d{1,2}):(\d{2})\s*(am|pm|ص|م)?/i);
                if (timeParts) {
                    let [, hoursStr, minutesStr, period] = timeParts;
                    let hours = parseInt(hoursStr, 10);
                    if (period) {
                        if ((period.toLowerCase() === 'pm' || period === 'م') && hours < 12) hours += 12;
                        if ((period.toLowerCase() === 'am' || period === 'ص') && hours === 12) hours = 0;
                    }
                    setTime(`${String(hours).padStart(2, '0')}:${minutesStr}`);
                }

            } else {
                resetForm();
            }
        }
    }, [isOpen, eventToEdit, isEditMode]);


    const handleClose = () => {
        if (isSaving) return;
        // The parent component will call resetForm via the onClose handler logic.
        onClose();
    };

    const isValidUrl = (urlString: string): boolean => {
        try {
            new URL(urlString);
            return true;
        } catch (e) {
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !date || !time || !location.trim()) {
            setError(t('form_error_all_fields'));
            return;
        }
        if (locationLink.trim() && !isValidUrl(locationLink.trim())) {
            setError(t('form_error_invalid_link'));
            return;
        }
        setError('');
        setIsSaving(true);
        
        try {
            const [year, month, day] = date.split('-');
            const formattedDate = `${day}/${month}/${year}`;

            let [hoursStr, minutes] = time.split(':');
            let hours = parseInt(hoursStr, 10);
            const period = document.documentElement.lang === 'ar' ? (hours >= 12 ? 'م' : 'ص') : (hours >= 12 ? 'PM' : 'AM');
            let displayHours = hours % 12;
            displayHours = displayHours ? displayHours : 12;
            const formattedTime = `${displayHours}:${minutes} ${period}`;
            
            const eventPayload = {
                name: name.trim(),
                date: formattedDate,
                time: formattedTime,
                location: location.trim(),
                locationLink: locationLink.trim(),
            };
            
            if (isEditMode && eventToEdit) {
                await updateEvent({ ...eventPayload, id: eventToEdit.id });
            } else {
                await addEvent(eventPayload);
            }

            onEventSaved();
        } catch (err) {
            console.error("Failed to save event:", err);
            setError("Failed to save event. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="settings-modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true" aria-labelledby="add-event-title">
            <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
                <h3 id="add-event-title" className="text-xl font-bold mb-6 text-center">{isEditMode ? t('edit_event_title') : t('add_event_title')}</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="event-name" className="add-event-modal-label">{t('event_name_label')}</label>
                        <input
                            id="event-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('event_name_placeholder')}
                            className="add-event-modal-input"
                            autoFocus
                        />
                    </div>
                     <div>
                        <label htmlFor="event-location" className="add-event-modal-label">{t('event_location_label')}</label>
                        <input
                            id="event-location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder={t('event_location_placeholder')}
                            className="add-event-modal-input"
                        />
                    </div>
                    <div>
                        <label htmlFor="event-location-link" className="add-event-modal-label">{t('event_location_link_label')}</label>
                        <input
                            id="event-location-link"
                            type="url"
                            value={locationLink}
                            onChange={(e) => setLocationLink(e.target.value)}
                            placeholder={t('event_location_link_placeholder')}
                            className="add-event-modal-input"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="event-date" className="add-event-modal-label">{t('event_date_label')}</label>
                            <input
                                id="event-date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="add-event-modal-input"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="event-time" className="add-event-modal-label">{t('event_time_label')}</label>
                            <input
                                id="event-time"
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="add-event-modal-input"
                            />
                        </div>
                    </div>
                    {error && <div className="form-error">{error}</div>}
                    <button type="submit" className="settings-btn mt-2" disabled={isSaving}>
                        {isSaving ? `${t('tool_loading')}...` : t('save_event_button')}
                    </button>
                </form>
                <button onClick={handleClose} className="close-btn" aria-label="Close add event modal" disabled={isSaving}>
                    &times;
                </button>
            </div>
        </div>
    );
};

export default AddEventModal;