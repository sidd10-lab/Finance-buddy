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
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-[71px] z-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-around sm:justify-start gap-1 sm:gap-2 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-400'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ml-0.5 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
