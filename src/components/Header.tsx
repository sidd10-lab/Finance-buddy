import React from 'react';
import { Sparkles, Globe, Eye, Volume2, ShieldCheck, UserCheck } from 'lucide-react';
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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-sm">
      {/* Top emergency & trust ribbon */}
      <div className="bg-gradient-to-r from-saffron-600 via-amber-600 to-saffron-700 text-white px-3 py-1.5 text-xs sm:text-sm font-medium flex items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
          <ShieldCheck className="w-4 h-4 flex-shrink-0 text-amber-200" />
          <span className="truncate">{strings.safetyAlert}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 pl-2">
          <span className="bg-white/20 px-2 py-0.5 rounded text-xs">हेल्पलाइन: 1930</span>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Persona Badge */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-saffron-600 flex items-center justify-center text-2xl shadow-md border-2 border-amber-200">
            {profile.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                {strings.appTitle}
                <span className="text-xs bg-saffron-100 text-saffron-800 font-semibold px-2 py-0.5 rounded-full border border-saffron-300">
                  सखी 2.0
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <span>{profile.name}</span>
              <span>•</span>
              <span>{profile.village}</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                <UserCheck className="w-3 h-3" /> SHG सदस्या
              </span>
            </p>
          </div>
        </div>

        {/* Accessibility & Language Controls */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3 ml-auto">
          {/* Literacy Mode Selector */}
          <div className="bg-amber-50 p-1 rounded-xl border border-amber-200 flex items-center gap-1 text-xs">
            <button
              onClick={() => handleLiteracyChange('visual')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all font-medium ${
                profile.literacyLevel === 'visual'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
              title="चित्र व आवाज़ मोड (Non-reader mode)"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{strings.literacyVisual}</span>
              <span className="sm:hidden">चित्र</span>
            </button>
            <button
              onClick={() => handleLiteracyChange('simple')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all font-medium ${
                profile.literacyLevel === 'simple'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
              title="सरल पठन मोड (Short text)"
            >
              <span>{strings.literacySimple}</span>
            </button>
            <button
              onClick={() => handleLiteracyChange('standard')}
              className={`px-2 py-1.5 rounded-lg transition-all font-medium hidden md:inline-block ${
                profile.literacyLevel === 'standard'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
              title="विस्तृत मोड (Detailed)"
            >
              {strings.literacyStandard}
            </button>
          </div>

          {/* Multilingual Selector */}
          <div className="relative flex items-center bg-white rounded-xl border border-slate-300 px-2 py-1 shadow-sm">
            <Globe className="w-4 h-4 text-slate-500 mr-1.5" />
            <select
              value={currentLang}
              onChange={handleLanguageChange}
              className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer pr-2"
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
            className="flex items-center gap-1.5 bg-gradient-to-r from-saffron-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all touch-target-large"
          >
            <Sparkles className="w-4 h-4 text-amber-200 animate-spin" style={{ animationDuration: '4s' }} />
            <span>{strings.askSaheli}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
