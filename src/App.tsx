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
import { Sparkles } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col bg-[#fbfaf7] text-slate-900">
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
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 pb-24">
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
          className="group relative flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-full shadow-elevated active:scale-95 transition-all duration-200 border border-slate-700/80"
          title="सखी AI से बोलकर पूछें"
        >
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-sm">
            🧕
          </div>
          <span className="font-semibold text-xs sm:text-sm tracking-wide">
            सखी AI बोलें
          </span>
          <span className="flex items-center">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
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
      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <span>लक्ष्मी सखी (Lakshmi Sakhi)</span>
            <span>•</span>
            <span className="text-slate-500 font-normal">आत्मनिर्भर ग्रामीण नारी वित्तीय सशक्तिकरण</span>
          </div>
          <div className="text-slate-400">
            ग्रामीण विकास मंत्रालय (NRLM) एवं स्वयं सहायता समूह (SHG) हेतु समर्पित
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
