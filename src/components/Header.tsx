import React from 'react';
import { Sparkles, Globe, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { UserProfile, LanguageCode, LiteracyLevel } from '../types';
import { LANGUAGES, UI_STRINGS } from '../services/translations';

interface HeaderProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenVoiceAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onUpdateProfile,
  onOpenVoiceAssistant
}) => {
  const currentLang = profile.language;
  const strings = UI_STRINGS[currentLang] || UI_STRINGS.hi;

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateProfile({ language: e.target.value as LanguageCode });
  };

  const handleLiteracyChange = (level: LiteracyLevel) => {
    onUpdateProfile({ literacyLevel: level });
  };

  return (
    <header className="sticky top-0 z-30 bg-[#070a13]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      {/* Minimalist trust & cyber security ribbon */}
      <div className="bg-[#03050a]/90 text-slate-300 px-4 py-1.5 text-xs font-medium flex items-center justify-between border-b border-white/[0.05]">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="flex h-2 w-2 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
          <span className="truncate text-slate-300 text-[11px] sm:text-xs">{strings.safetyAlert}</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 pl-3">
          <span className="text-[11px] text-slate-400">राष्ट्रीय साइबर हेल्पलाइन: <strong className="text-emerald-300 font-mono tracking-wider ml-1">1930</strong></span>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand & Persona Profile Badge */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-slate-800 to-emerald-500/20 border border-amber-400/40 flex items-center justify-center text-2xl shadow-gold-glow">
              {profile.avatar}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-slate-950 stroke-[3]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-200 tracking-tight">
                {strings.appTitle}
              </h1>
              <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 shadow-sm">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                SHG सत्यापित
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
              <span className="text-slate-200 font-semibold">{profile.name}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">{profile.village}</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400/90">{profile.occupation}</span>
            </p>
          </div>
        </div>

        {/* Accessibility & Language Controls */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5 ml-auto">
          {/* Literacy Mode Segmented Switcher */}
          <div className="bg-slate-900/90 p-1 rounded-xl flex items-center gap-1 text-xs border border-white/10 shadow-inner">
            <button
              onClick={() => handleLiteracyChange('visual')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all font-semibold ${
                profile.literacyLevel === 'visual'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
              title="चित्र व आवाज़ मोड (Non-reader mode with visual guides)"
            >
              <Eye className="w-3.5 h-3.5 text-inherit" />
              <span className="hidden sm:inline">{strings.literacyVisual}</span>
              <span className="sm:hidden">चित्र</span>
            </button>
            <button
              onClick={() => handleLiteracyChange('simple')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all font-semibold ${
                profile.literacyLevel === 'simple'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
              title="सरल पठन (Easy short text)"
            >
              <span>{strings.literacySimple}</span>
            </button>
            <button
              onClick={() => handleLiteracyChange('standard')}
              className={`px-2.5 py-1.5 rounded-lg transition-all font-semibold hidden md:inline-block ${
                profile.literacyLevel === 'standard'
                  ? 'bg-white text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
              title="विस्तृत मोड (Detailed)"
            >
              {strings.literacyStandard}
            </button>
          </div>

          {/* Multilingual Selector */}
          <div className="relative flex items-center bg-slate-900/90 rounded-xl border border-white/10 px-2.5 py-1.5 hover:border-emerald-500/40 transition-colors shadow-inner">
            <Globe className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
            <select
              value={currentLang}
              onChange={handleLanguageChange}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer pr-1"
              aria-label="भाषा चुनें"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-100">
                  {lang.flag} {lang.nativeName}
                </option>
              ))}
            </select>
          </div>

          {/* AI Voice Assistant Pill Button */}
          <button
            onClick={onOpenVoiceAssistant}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-emerald-glow active:scale-95 transition-all border border-emerald-400/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{strings.askSaheli}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
