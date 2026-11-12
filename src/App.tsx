import React, { useState, useEffect } from 'react';
import { UserProfile, ExpenseItem, SavingsGoal, EducationLesson } from './types';
import { initialUserProfile, initialExpenses, initialGoals, educationLessons } from './data/mockData';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { EducationModule } from './components/EducationModule';
import { BudgetingModule } from './components/BudgetingModule';
import { MicroInvestmentModule } from './components/MicroInvestmentModule';
import { BankingModule } from './components/BankingModule';
import { MentorshipModule } from './components/MentorshipModule';
import { SaheliVoiceChatModal } from './components/SaheliVoiceChatModal';
import { Mic, Sparkles, Heart } from 'lucide-react';
import { speechService } from './services/speechService';

export const App: React.FC = () => {
  // Load persisted state or fallback to defaults
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('lakshmi_profile');
    return saved ? JSON.parse(saved) : initialUserProfile;
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem('lakshmi_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('lakshmi_goals');
    return saved ? JSON.parse(saved) : initialGoals;
  });

  const [lessons, setLessons] = useState<EducationLesson[]>(() => {
    const saved = localStorage.getItem('lakshmi_lessons');
    return saved ? JSON.parse(saved) : educationLessons;
  });

  const [activeTab, setActiveTab] = useState<NavTab>('education');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('lakshmi_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('lakshmi_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('lakshmi_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('lakshmi_lessons', JSON.stringify(lessons));
  }, [lessons]);

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
  };

  const handleAddTransaction = (newTx: ExpenseItem) => {
    setExpenses(prev => [newTx, ...prev]);
    // update wallet balance
    if (newTx.type === 'income') {
      setProfile(prev => ({ ...prev, walletBalance: prev.walletBalance + newTx.amount }));
    } else {
      setProfile(prev => ({ ...prev, walletBalance: Math.max(0, prev.walletBalance - newTx.amount) }));
    }
  };

  const handleUpdateGoal = (goalId: string, addAmount: number) => {
    setGoals(prev =>
      prev.map(g => (g.id === goalId ? { ...g, currentAmount: g.currentAmount + addAmount } : g))
    );
    // Deduct from wallet if desired or consider it saved
    setProfile(prev => ({
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance - addAmount)
    }));
  };

  const handleCompleteLesson = (lessonId: string) => {
    setLessons(prev =>
      prev.map(l => (l.id === lessonId ? { ...l, completed: true } : l))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf7ee]">
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
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-6 pb-24">
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
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-saffron-500 via-amber-500 to-saffron-600 hover:from-saffron-600 hover:to-amber-600 text-white px-5 py-3.5 rounded-full shadow-2xl active:scale-95 transition-all duration-300 border-2 border-white/60 touch-target-large"
          title="सखी AI से बोलकर पूछें"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg animate-pulse">
            🧕
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-wide">
            सखी AI बोलें
          </span>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-400"></span>
          </span>
        </button>
      </aside>

      {/* Saheli Voice Chat Modal */}
      <SaheliVoiceChatModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        profile={profile}
        lang={profile.language}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-amber-200/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold">
            <span>🪙 लक्ष्मी सखी (Lakshmi Sakhi)</span>
            <span>•</span>
            <span>आत्मनिर्भर ग्रामीण नारी सशक्तिकरण</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>ग्रामीण विकास मंत्रालय व महिला स्वयं सहायता समूह हेतु समर्पित</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline ml-1" />
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
