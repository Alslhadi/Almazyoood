
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IMAGE_MAKER_THEME_URL } from '../constants';

interface ImageMakerToolProps {
    t: (key: string) => string;
    onBack: () => void;
}

const ImageMakerTool: React.FC<ImageMakerToolProps> = ({ t, onBack }) => {
    const [size, setSize] = useState<'square' | 'story'>('square');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [customText, setCustomText] = useState('');
    const [isThemeLoading, setIsThemeLoading] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const themeImageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = IMAGE_MAKER_THEME_URL;
        img.onload = () => {
            themeImageRef.current = img;
            setIsThemeLoading(false);
        };
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

    const drawCustomText = (ctx: CanvasRenderingContext2D) => {
        const text = customText.trim();
        if (!text) return;
        const canvas = ctx.canvas;
        const lines = text.split(' ').filter(Boolean).slice(0, 2);
        if (lines.length === 0) return;
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxWidth = canvas.width * 0.65;
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let fontSize = 220;
        let longestLine = lines.length > 1 ? (lines[0].length > lines[1].length ? lines[0] : lines[1]) : lines[0];
        
        do {
            const fontLang = document.documentElement.lang === 'ar' ? 'IBM Plex Sans Arabic' : 'Poppins';
            ctx.font = `900 ${fontSize}px '${fontLang}'`;
            if (ctx.measureText(longestLine).width < maxWidth) break;
            fontSize -= 10;
        } while (fontSize > 40);
        
        const lineHeight = fontSize;
        if (lines.length === 1) {
            ctx.fillText(lines[0], centerX, centerY);
        } else {
            const y1 = centerY - (lineHeight / 1.9);
            const y2 = centerY + (lineHeight / 1.9);
            ctx.fillText(lines[0], centerX, y1);
            ctx.fillText(lines[1], centerX, y2);
        }
    };
    
    const generateImage = useCallback(async () => {
        if (!imageFile || !canvasRef.current || !themeImageRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const userImg = await createImageFromFile(imageFile);
        
        canvas.width = size === 'story' ? 1080 : 1080;
        canvas.height = size === 'story' ? 1920 : 1080;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCoverImage(ctx, userImg);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        drawCustomText(ctx);
        
        if (size === 'story') {
            const themeSize = canvas.width;
            const yOffset = (canvas.height - themeSize) / 2;
            ctx.drawImage(themeImageRef.current, 0, yOffset, themeSize, themeSize);
        } else {
            ctx.drawImage(themeImageRef.current, 0, 0, canvas.width, canvas.height);
        }
    }, [imageFile, size, customText]);

    useEffect(() => {
        generateImage();
    }, [generateImage]);
    
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleDownload = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = `mazyooud-cover-${size}.png`;
        link.href = canvasRef.current.toDataURL('image/png');
        link.click();
    };
    
    const commonBtnClass = "font-semibold py-2 px-8 rounded-full border border-gray-700 transition-all duration-200";
    const selectedBtnClass = "bg-[--accent-color] border-[--accent-color] text-black font-bold";
    const unselectedBtnClass = "text-gray-300 hover:border-gray-500";
    const framerBtnClass = "py-2 px-8 rounded-full inline-block text-black font-semibold bg-[--accent-color] hover:scale-105 hover:shadow-[0_0_20px_var(--accent-color)] transition-all duration-200";


    return (
         <div className="w-full max-w-2xl text-center">
            <button onClick={onBack} className="back-to-tools-btn mb-8 font-semibold" style={{color: 'var(--text-secondary-dark)'}}>&larr; <span>{t('back_button')}</span></button>
            <div className="w-full rounded-2xl p-8 shadow-lg" style={{backgroundColor: 'var(--tool-card-bg-dark)', border: '1px solid var(--tool-card-border-dark)'}}>
                <h3 className="text-3xl font-bold mb-8">{t('tool_card_title')}</h3>
                
                <div className="mb-6">
                    <p className="text-md font-semibold mb-3" style={{color: 'var(--text-secondary-dark)'}}>{t('tool_step1')}</p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => setSize('square')} className={`${commonBtnClass} ${size === 'square' ? selectedBtnClass : unselectedBtnClass}`}>{t('tool_square')}</button>
                        <button onClick={() => setSize('story')} className={`${commonBtnClass} ${size === 'story' ? selectedBtnClass : unselectedBtnClass}`}>{t('tool_story')}</button>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-md font-semibold mb-3" style={{color: 'var(--text-secondary-dark)'}}>{t('tool_step2')}</p>
                    <label htmlFor="photo-upload" className={`cursor-pointer ${framerBtnClass} ${isThemeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <span>{isThemeLoading ? t('tool_loading') : t('tool_choose_image')}</span>
                    </label>
                    <input type="file" id="photo-upload" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} disabled={isThemeLoading} />
                    <p className="text-xs mt-3 h-4 truncate">{imageFile?.name || ''}</p>
                </div>

                <div className="mb-6">
                    <p className="text-md font-semibold mb-3" style={{color: 'var(--text-secondary-dark)'}}>{t('tool_step3')}</p>
                    <input 
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder={t('tool_placeholder')}
                        className="w-full max-w-xs mx-auto text-center border rounded-full py-2 px-4 focus:outline-none focus:ring-2 bg-black border-gray-700 text-white" 
                        style={{'--tw-ring-color': 'var(--accent-color)'} as React.CSSProperties}
                    />
                </div>

                {imageFile && (
                    <div id="result-area">
                        <canvas ref={canvasRef} className="mx-auto rounded-lg max-w-full bg-black/20" />
                        <button onClick={handleDownload} className={`mt-6 ${framerBtnClass}`}>{t('tool_download')}</button>
                    </div>
                )}
             </div>
        </div>
    );
};

export default ImageMakerTool;