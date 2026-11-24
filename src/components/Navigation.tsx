import React from 'react';
import { BookOpen, PieChart, Coins, Landmark, Users } from 'lucide-react';
import { LanguageCode } from '../types';
import { UI_STRINGS } from '../services/translations';

export type NavTab = 'education' | 'budget' | 'invest' | 'banking' | 'mentors';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  lang: LanguageCode;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  lang
}) => {
  const strings = UI_STRINGS[lang] || UI_STRINGS.hi;

  const tabs: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'education',
      label: strings.navEducation,
      icon: <BookOpen className="w-4 h-4" />,
      badge: 'ज्ञान'
    },
    {
      id: 'budget',
      label: strings.navBudget,
      icon: <PieChart className="w-4 h-4" />,
    },
    {
      id: 'invest',
      label: strings.navInvest,
      icon: <Coins className="w-4 h-4" />,
      badge: 'सोना ₹10'
    },
    {
      id: 'banking',
      label: strings.navBanking,
      icon: <Landmark className="w-4 h-4" />,
    },
    {
      id: 'mentors',
      label: strings.navMentors,
      icon: <Users className="w-4 h-4" />,
    }
  ];

  return (
    <nav className="bg-[#070a13]/70 backdrop-blur-xl border-b border-white/[0.06] sticky top-[71px] z-20 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-around sm:justify-start gap-1 sm:gap-2.5 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-slate-500'}>
                  {tab.icon}
                </span>
                <span className={isActive ? 'font-bold' : ''}>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-0.5 tracking-wide ${
                      isActive
                        ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/30'
                        : 'bg-amber-400/15 text-amber-300 border border-amber-400/25'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 w-8 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
