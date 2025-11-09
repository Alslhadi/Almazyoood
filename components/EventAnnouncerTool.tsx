
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { EventData } from '../types';
import { fetchEvents } from '../services/eventService';
import { EVENT_ANNOUNCER_LOGO_URL, CIRCULAR_LOGO_WATERMARK_URL } from '../constants';

interface EventAnnouncerToolProps {
    t: (key: string) => string;
    onBack: () => void;
}

const EventAnnouncerTool: React.FC<EventAnnouncerToolProps> = ({ t, onBack }) => {
    const [events, setEvents] = useState<EventData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
    const [welcomeText, setWelcomeText] = useState('يا مرحبابكم');
    const [bgFile, setBgFile] = useState<File | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const logoImageRef = useRef<HTMLImageElement | null>(null);
    const watermarkImageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const eventsData = await fetchEvents();
                setEvents(eventsData);
            } catch (err) {
                console.error("Failed to load events", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadEvents();

        const logoImg = new Image();
        logoImg.crossOrigin = "anonymous";
        logoImg.src = EVENT_ANNOUNCER_LOGO_URL;
        logoImg.onload = () => { logoImageRef.current = logoImg; };

        const watermarkImg = new Image();
        watermarkImg.crossOrigin = "anonymous";
        watermarkImg.src = CIRCULAR_LOGO_WATERMARK_URL;
        watermarkImg.onload = () => { watermarkImageRef.current = watermarkImg; };
    }, []);

    const drawCoverImage = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
        const canvas = ctx.canvas;
        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = img.width / img.height;
        let sx, sy, sWidth, sHeight;
        if (imgAspect > canvasAspect) {
            sHeight = img.height;
            sWidth = sHeight * canvasAspect;
            sx = (img.width - sWidth) / 2;
            sy = 0;
        } else {
            sWidth = img.width;
            sHeight = sWidth / canvasAspect;
            sx = 0;
            sy = (img.height - sHeight) / 2;
        }
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
    };

    const createImageFromFile = (file: File): Promise<HTMLImageElement> => {
         return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (!e.target?.result) return reject(new Error('FileReader error'));
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = e.target.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const generateImage = useCallback(async () => {
        if (!bgFile || !selectedEvent || !canvasRef.current || !logoImageRef.current || !watermarkImageRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bgImg = await createImageFromFile(bgFile);
        
        canvas.width = 1080;
        canvas.height = 1920;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawCoverImage(ctx, bgImg);

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height / 2);
        gradient.addColorStop(0, 'rgba(0,0,0,0.8)');
        gradient.addColorStop(0.5, 'rgba(0,0,0,0.4)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.globalAlpha = 0.1;
        const watermarkSize = canvas.width * 0.8;
        ctx.drawImage(watermarkImageRef.current, (canvas.width - watermarkSize) / 2, (canvas.height - watermarkSize) / 2, watermarkSize, watermarkSize);
        ctx.restore();

        const logoWidth = canvas.width;
        const logoHeight = (logoImageRef.current.height / logoImageRef.current.width) * logoWidth;
        const logoY = 80;
        ctx.drawImage(logoImageRef.current, 0, logoY, logoWidth, logoHeight);

        ctx.fillStyle = 'white';
        const fontLang = 'IBM Plex Sans Arabic';
        
        ctx.textAlign = 'center';
        ctx.font = `500 50px '${fontLang}'`;
        const textMetrics = ctx.measureText(welcomeText);
        const boxWidth = textMetrics.width + 80;
        const boxHeight = 90;
        const boxX = (canvas.width - boxWidth) / 2;
        const boxY = logoY + logoHeight + 40;
        const cornerRadius = 25;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxWidth, boxHeight, [cornerRadius]);
        ctx.stroke();
        ctx.textBaseline = 'middle';
        ctx.fillText(welcomeText, canvas.width / 2, boxY + boxHeight / 2);
        ctx.textBaseline = 'alphabetic';

        ctx.textAlign = 'right';
        ctx.font = `bold 120px '${fontLang}'`;
        ctx.fillText(selectedEvent.name, canvas.width - 80, canvas.height - 300);

        ctx.font = `500 60px '${fontLang}'`;
        ctx.fillStyle = '#a1a1a6'; // var(--text-secondary-dark)
        ctx.fillText(selectedEvent.location, canvas.width - 80, canvas.height - 200);

        ctx.fillStyle = '#30E8BF'; // var(--accent-color)
        ctx.font = `bold 70px '${fontLang}'`;
        ctx.fillText(`${selectedEvent.date} | ${selectedEvent.time}`, canvas.width - 80, canvas.height - 100);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 15;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

    }, [bgFile, selectedEvent, welcomeText]);
    
    useEffect(() => {
        generateImage();
    }, [generateImage]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setBgFile(e.target.files[0]);
        }
    };

    const handleDownload = () => {
        if (!canvasRef.current || !selectedEvent) return;
        const link = document.createElement('a');
        link.download = `mazyooud-event-${selectedEvent.name.replace(/ /g, '_')}.png`;
        link.href = canvasRef.current.toDataURL('image/png');
        link.click();
    };

    const framerBtnClass = "py-2 px-8 rounded-full inline-block text-black font-semibold bg-[--accent-color] hover:scale-105 hover:shadow-[0_0_20px_var(--accent-color)] transition-all duration-200";

    return (
        <div className="w-full max-w-2xl text-center">
            <button onClick={onBack} className="back-to-tools-btn mb-8 font-semibold" style={{color: 'var(--text-secondary-dark)'}}>&larr; <span>{t('back_button')}</span></button>
            <div className="w-full rounded-2xl p-8 shadow-lg" style={{backgroundColor: 'var(--tool-card-bg-dark)', border: '1px solid var(--tool-card-border-dark)'}}>
                <h3 className="text-3xl font-bold mb-8">{t('event_announcer_title')}</h3>
                
                <div className="mb-6">
                    <p className="text-md font-semibold mb-3">{t('event_announcer_step1')}</p>
                    <div className="max-h-40 overflow-y-auto space-y-2 rounded-lg p-2 bg-black/20">
                        {isLoading ? <p>{t('events_loading')}</p> : events.map((event, index) => (
                            <button key={index} onClick={() => setSelectedEvent(event)} className={`w-full p-3 rounded-lg text-right font-semibold border transition-colors duration-200 ${selectedEvent?.name === event.name ? 'bg-[--accent-color] border-[--accent-color] text-black' : 'border-gray-700 text-gray-300 hover:border-gray-500'}`}>
                                {event.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-md font-semibold mb-3">{t('event_announcer_step2')}</p>
                    <input type="text" value={welcomeText} onChange={(e) => setWelcomeText(e.target.value)} placeholder={t('event_announcer_welcome_placeholder')} className="w-full max-w-xs mx-auto text-center border rounded-full py-2 px-4 focus:outline-none focus:ring-2 bg-black border-gray-700 text-white" style={{'--tw-ring-color': 'var(--accent-color)'} as React.CSSProperties} />
                </div>

                <div className="mb-6">
                    <p className="text-md font-semibold mb-3">{t('event_announcer_step3')}</p>
                    <label htmlFor="announcer-photo-upload" className={`cursor-pointer ${framerBtnClass}`}><span >{t('event_announcer_choose_image')}</span></label>
                    <input type="file" id="announcer-photo-upload" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} />
                    <p className="text-xs mt-3 h-4 truncate">{bgFile?.name || ''}</p>
                </div>
                
                {bgFile && selectedEvent && (
                    <div id="announcer-result-area">
                        <canvas ref={canvasRef} className="mx-auto rounded-lg max-w-full bg-black/20" />
                        <button onClick={handleDownload} className={`mt-6 ${framerBtnClass}`}>{t('event_announcer_download')}</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventAnnouncerTool;