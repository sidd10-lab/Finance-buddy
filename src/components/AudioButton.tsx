import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speechService } from '../services/speechService';
import { LanguageCode } from '../types';

interface AudioButtonProps {
  textToSpeak: string;
  lang: LanguageCode;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  textToSpeak,
  lang,
  label = 'सुनें',
  className = '',
  size = 'md'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
    } else {
      speechService.playCoinSound();
      setIsPlaying(true);
      speechService.speak(textToSpeak, lang, () => {
        setIsPlaying(false);
      });
    }
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-[11px] gap-1.5',
    md: 'px-3 py-1.5 text-xs gap-1.5',
    lg: 'px-4 py-2 text-sm gap-2 font-medium'
  };

  return (
    <button
      onClick={toggleSpeak}
      className={`inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 active:scale-95 ${
        isPlaying
          ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/20'
          : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs hover:border-slate-300'
      } ${sizeClasses[size]} ${className}`}
      title={isPlaying ? "आवाज़ रोकें (Stop audio)" : "बोलकर सुनाएं (Read aloud)"}
      aria-label={label}
    >
      {isPlaying ? (
        <>
          <div className="flex items-center gap-0.5 h-3">
            <span className="w-0.5 bg-white rounded-full animate-wave-1"></span>
            <span className="w-0.5 bg-white rounded-full animate-wave-2"></span>
            <span className="w-0.5 bg-white rounded-full animate-wave-3"></span>
            <span className="w-0.5 bg-white rounded-full animate-wave-4"></span>
          </div>
          <VolumeX className="w-3.5 h-3.5 ml-0.5 text-slate-300" />
          <span>रोकें</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-slate-500" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
