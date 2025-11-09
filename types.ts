export interface EventData {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  locationLink?: string;
}

export type Language = 'ar' | 'en';

export type Page = 'home' | 'music' | 'events' | 'tools';

export type ToolView = 'selection' | 'image-maker' | 'event-announcer';