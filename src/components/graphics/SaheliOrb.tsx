import React from 'react';

interface SaheliOrbProps {
  isListening?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SaheliOrb: React.FC<SaheliOrbProps> = ({
  isListening = false,
  size = 'md'
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeMap[size]}`}>
      {/* Outer Rotating Energy Ring */}
      <div
        className={`absolute inset-0 rounded-full border-2 border-dashed ${
          isListening ? 'border-rose-400 animate-spin-slow' : 'border-emerald-400/50 animate-spin-slow'
        }`}
      />

      {/* Counter-rotating Secondary Ring */}
      <div
        className={`absolute inset-1 rounded-full border border-dotted ${
          isListening ? 'border-amber-400 animate-spin-reverse-slow' : 'border-teal-300/40 animate-spin-reverse-slow'
        }`}
      />

      {/* Ambient Pulsing Glow Backdrop */}
      <div
        className={`absolute inset-0 rounded-full blur-xl opacity-60 ${
          isListening ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500 animate-pulse-slow'
        }`}
      />

      {/* Core Holographic Sphere */}
      <div
        className={`relative z-10 w-3/4 h-3/4 rounded-full flex items-center justify-center shadow-inner text-xl ${
          isListening
            ? 'bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-400 text-white animate-bounce'
            : 'bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-300 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]'
        }`}
      >
        <span>🧕</span>
      </div>
    </div>
  );
};
