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

  const tabs: { id: NavTab; label: string; icon: React.ReactNode; color: string; badge?: string }[] = [
    {
      id: 'education',
      label: strings.navEducation,
      icon: <BookOpen className="w-5 h-5" />,
      color: 'amber',
      badge: 'नया पाठ'
    },
    {
      id: 'budget',
      label: strings.navBudget,
      icon: <PieChart className="w-5 h-5" />,
      color: 'emerald',
    },
    {
      id: 'invest',
      label: strings.navInvest,
      icon: <Coins className="w-5 h-5" />,
      color: 'yellow',
      badge: '₹10 से सोना'
    },
    {
      id: 'banking',
      label: strings.navBanking,
      icon: <Landmark className="w-5 h-5" />,
      color: 'cyan',
    },
    {
      id: 'mentors',
      label: strings.navMentors,
      icon: <Users className="w-5 h-5" />,
      color: 'rose',
      badge: 'सखी चौपाल'
    }
  ];

  return (
    <nav className="bg-white border-b border-amber-100 shadow-sm sticky top-[73px] z-20">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-around sm:justify-start gap-1 sm:gap-4 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-2 px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all touch-target-large ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50/70'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-amber-700'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1 ${
                      isActive
                        ? 'bg-amber-600 text-amber-100'
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
