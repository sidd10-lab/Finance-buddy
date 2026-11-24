import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, ExpenseItem, SavingsGoal } from './types';
import { initialUserProfile, getLocalizedLessons, getLocalizedGoals, getLocalizedExpenses } from './data/mockData';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { EducationModule } from './components/EducationModule';
import { BudgetingModule } from './components/BudgetingModule';
import { MicroInvestmentModule } from './components/MicroInvestmentModule';
import { BankingModule } from './components/BankingModule';
import { MentorshipModule } from './components/MentorshipModule';
import { SaheliVoiceChatModal } from './components/SaheliVoiceChatModal';
import { Sparkles } from 'lucide-react';
import { speechService } from './services/speechService';
import { UI_STRINGS } from './services/translations';

export const App: React.FC = () => {
  // Load persisted state or fallback to defaults
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('lakshmi_profile');
    return saved ? JSON.parse(saved) : initialUserProfile;
  });

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('lakshmi_completed_lessons');
    return saved ? JSON.parse(saved) : ['lesson-1'];
  });

  const [activeTab, setActiveTab] = useState<NavTab>('education');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('lakshmi_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('lakshmi_completed_lessons', JSON.stringify(completedLessonIds));
  }, [completedLessonIds]);

  // Dynamically compute localized content based on selected language
  const lessons = useMemo(() => {
    const localized = getLocalizedLessons(profile.language);
    return localized.map(l => ({
      ...l,
      completed: completedLessonIds.includes(l.id)
    }));
  }, [profile.language, completedLessonIds]);

  const [userCustomExpenses, setUserCustomExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem('lakshmi_custom_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('lakshmi_custom_expenses', JSON.stringify(userCustomExpenses));
  }, [userCustomExpenses]);

  const expenses = useMemo(() => {
    const base = getLocalizedExpenses(profile.language);
    return [...userCustomExpenses, ...base];
  }, [profile.language, userCustomExpenses]);

  const [customGoalAmounts, setCustomGoalAmounts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('lakshmi_goal_amounts');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('lakshmi_goal_amounts', JSON.stringify(customGoalAmounts));
  }, [customGoalAmounts]);

  const goals = useMemo(() => {
    const base = getLocalizedGoals(profile.language);
    return base.map(g => ({
      ...g,
      currentAmount: customGoalAmounts[g.id] !== undefined ? customGoalAmounts[g.id] : g.currentAmount
    }));
  }, [profile.language, customGoalAmounts]);

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    speechService.stop();
    setProfile(prev => ({ ...prev, ...updated }));
  };

  const handleAddTransaction = (newTx: ExpenseItem) => {
    setUserCustomExpenses(prev => [newTx, ...prev]);
    if (newTx.type === 'income') {
      setProfile(prev => ({ ...prev, walletBalance: prev.walletBalance + newTx.amount }));
    } else {
      setProfile(prev => ({ ...prev, walletBalance: Math.max(0, prev.walletBalance - newTx.amount) }));
    }
  };

  const handleUpdateGoal = (goalId: string, addAmount: number) => {
    setCustomGoalAmounts(prev => ({
      ...prev,
      [goalId]: (prev[goalId] !== undefined ? prev[goalId] : goals.find(g => g.id === goalId)?.currentAmount || 0) + addAmount
    }));
    setProfile(prev => ({
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance - addAmount)
    }));
  };

  const handleCompleteLesson = (lessonId: string) => {
    setCompletedLessonIds(prev => (prev.includes(lessonId) ? prev : [...prev, lessonId]));
  };

  const strings = UI_STRINGS[profile.language] || UI_STRINGS.hi;

  return (
    <div className="min-h-screen flex flex-col bg-[#05070e] text-slate-100 bg-mesh-dark subtle-grid-pattern relative selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Decorative ambient blurred glow orbs */}
      <div className="fixed top-[-100px] left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-[40%] right-[-100px] w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Sticky App Header */}
      <Header
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onOpenVoiceAssistant={() => setIsAiModalOpen(true)}
      />

      {/* Main Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          speechService.stop();
          setActiveTab(tab);
        }}
        lang={profile.language}
      />

      {/* Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 pb-28 relative z-10">
        {activeTab === 'education' && (
          <EducationModule
            lessons={lessons}
            onCompleteLesson={handleCompleteLesson}
            lang={profile.language}
            literacyLevel={profile.literacyLevel}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetingModule
            profile={profile}
            expenses={expenses}
            goals={goals}
            onAddTransaction={handleAddTransaction}
            onUpdateGoal={handleUpdateGoal}
            lang={profile.language}
            literacyLevel={profile.literacyLevel}
          />
        )}

        {activeTab === 'invest' && (
          <MicroInvestmentModule
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            lang={profile.language}
            literacyLevel={profile.literacyLevel}
          />
        )}

        {activeTab === 'banking' && (
          <BankingModule
            profile={profile}
            lang={profile.language}
            literacyLevel={profile.literacyLevel}
          />
        )}

        {activeTab === 'mentors' && (
          <MentorshipModule
            lang={profile.language}
            literacyLevel={profile.literacyLevel}
          />
        )}
      </main>

      {/* Floating Action Button for Voice AI Assistant */}
      <aside aria-label="AI Voice Assistant Launcher" className="fixed bottom-6 right-6 z-40">
        <div className="relative group">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 opacity-60 blur-md group-hover:opacity-100 transition duration-300 animate-pulse-slow"></div>
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="relative flex items-center gap-2.5 bg-slate-900/90 hover:bg-slate-800 text-white px-5 py-3 rounded-full shadow-2xl backdrop-blur-xl active:scale-95 transition-all duration-200 border border-emerald-400/30 hover:border-emerald-400/60"
            title="सखी AI से बोलकर पूछें"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-amber-500/20 border border-emerald-400/40 flex items-center justify-center text-base shadow-inner">
              🧕
            </div>
            <span className="font-semibold text-xs sm:text-sm tracking-wide text-slate-100">
              {strings.askSaheli}
            </span>
            <span className="flex items-center">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            </span>
          </button>
        </div>
      </aside>

      {/* Saheli Voice Chat Modal */}
      <SaheliVoiceChatModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        profile={profile}
        lang={profile.language}
      />

      {/* Footer */}
      <footer className="bg-slate-950/80 backdrop-blur-md border-t border-white/[0.07] py-6 text-center text-xs text-slate-400 relative z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <span className="text-white font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {strings.appTitle}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{strings.tagline}</span>
          </div>
          <div className="text-slate-500">
            {strings.appSubtitle}
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
