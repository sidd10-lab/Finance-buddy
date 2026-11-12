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
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      {/* Minimalist trust & cyber security ribbon */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-xs font-medium flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
          <span className="truncate">{strings.safetyAlert}</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 pl-3">
          <span className="text-[11px] text-slate-400">राष्ट्रीय साइबर हेल्पलाइन: <strong className="text-white">1930</strong></span>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand & Persona Profile Badge */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-2xl shadow-2xs">
            {profile.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {strings.appTitle}
              </h1>
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                SHG सत्यापित
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
              <span>{profile.name}</span>
              <span className="text-slate-300">•</span>
              <span>{profile.village}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">{profile.occupation}</span>
            </p>
          </div>
        </div>

        {/* Accessibility & Language Controls */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5 ml-auto">
          {/* Literacy Mode Segmented Switcher */}
          <div className="bg-slate-100/90 p-1 rounded-xl flex items-center gap-1 text-xs border border-slate-200/70">
            <button
              onClick={() => handleLiteracyChange('visual')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all font-semibold ${
                profile.literacyLevel === 'visual'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="चित्र व आवाज़ मोड (Non-reader mode with visual guides)"
            >
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">{strings.literacyVisual}</span>
              <span className="sm:hidden">चित्र</span>
            </button>
            <button
              onClick={() => handleLiteracyChange('simple')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all font-semibold ${
                profile.literacyLevel === 'simple'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="सरल पठन (Easy short text)"
            >
              <span>{strings.literacySimple}</span>
            </button>
            <button
              onClick={() => handleLiteracyChange('standard')}
              className={`px-2.5 py-1.5 rounded-lg transition-all font-semibold hidden md:inline-block ${
                profile.literacyLevel === 'standard'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="विस्तृत मोड (Detailed)"
            >
              {strings.literacyStandard}
            </button>
          </div>

          {/* Multilingual Selector */}
          <div className="relative flex items-center bg-white rounded-xl border border-slate-200 px-2.5 py-1.5 shadow-2xs hover:border-slate-300 transition-colors">
            <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
            <select
              value={currentLang}
              onChange={handleLanguageChange}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
              aria-label="भाषा चुनें"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.nativeName}
                </option>
              ))}
            </select>
          </div>

          {/* AI Voice Assistant Pill Button */}
          <button
            onClick={onOpenVoiceAssistant}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm hover:shadow active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{strings.askSaheli}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
