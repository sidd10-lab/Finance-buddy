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
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2.5 text-base gap-2 font-medium'
  };

  return (
    <button
      onClick={toggleSpeak}
      className={`inline-flex items-center justify-center rounded-full transition-all shadow-sm active:scale-95 touch-target-large ${
        isPlaying
          ? 'bg-amber-600 text-white ring-4 ring-amber-300 animate-pulse'
          : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
      } ${sizeClasses[size]} ${className}`}
      title={isPlaying ? "आवाज़ रोकें" : "बोलकर सुनाएं"}
      aria-label={label}
    >
      {isPlaying ? (
        <>
          <div className="flex items-center gap-0.5 h-4">
            <span className="w-1 bg-white rounded-full animate-wave-1"></span>
            <span className="w-1 bg-white rounded-full animate-wave-2"></span>
            <span className="w-1 bg-white rounded-full animate-wave-3"></span>
            <span className="w-1 bg-white rounded-full animate-wave-4"></span>
          </div>
          <VolumeX className="w-4 h-4 ml-1" />
          <span>रोकें</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-amber-700" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
