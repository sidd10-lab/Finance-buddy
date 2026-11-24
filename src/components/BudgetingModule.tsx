import React, { useState } from 'react';
import { Mic, MicOff, PlusCircle, ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExpenseItem, SavingsGoal, LanguageCode, LiteracyLevel, UserProfile } from '../types';
import { AudioButton } from './AudioButton';
import { speechService } from '../services/speechService';
import { AIAdvisorService } from '../services/aiAdvisorService';
import { UI_STRINGS } from '../services/translations';
import { SavingsHealthGauge } from './graphics/SavingsHealthGauge';
import { ExpenseDonutChart } from './graphics/ExpenseDonutChart';

interface BudgetingModuleProps {
  profile: UserProfile;
  expenses: ExpenseItem[];
  goals: SavingsGoal[];
  onAddTransaction: (tx: ExpenseItem) => void;
  onUpdateGoal: (goalId: string, addAmount: number) => void;
  lang: LanguageCode;
  literacyLevel: LiteracyLevel;
}

export const BudgetingModule: React.FC<BudgetingModuleProps> = ({
  expenses,
  goals,
  onAddTransaction,
  onUpdateGoal,
  lang,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [micRecognizer, setMicRecognizer] = useState<{ stop: () => void } | null>(null);

  const s = UI_STRINGS[lang] || UI_STRINGS.hi;

  // Manual fast-entry drawer state
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category] = useState('dairy');

  // Deposit to goal modal state
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState('100');

  // Calculate totals
  const totalIncome = expenses
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = expenses
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const netSavings = totalIncome - totalExpense;

  // Voice transaction listener
  const toggleListening = () => {
    if (isListening) {
      if (micRecognizer) micRecognizer.stop();
      setIsListening(false);
    } else {
      setVoiceText(s.voiceLedgerSub);
      setIsListening(true);
      const rec = speechService.startListening(
        lang,
        (transcript) => {
          setVoiceText(transcript);
          const parsed = AIAdvisorService.parseVoiceTransaction(transcript);
          if (parsed && parsed.amount) {
            const newTx: ExpenseItem = {
              id: 'tx-' + Date.now(),
              title: parsed.title || 'वॉइस एंट्री',
              amount: parsed.amount,
              type: parsed.type || 'expense',
              category: parsed.category || 'other',
              icon: parsed.icon || '🪙',
              date: new Date().toISOString().split('T')[0],
              note: transcript,
              audioHint: `${parsed.title} - ${parsed.amount}`
            };
            onAddTransaction(newTx);
            speechService.playCoinSound();
            setVoiceText(`${s.save}: ${newTx.title} - ₹${newTx.amount}`);
          } else {
            setVoiceText(`"${transcript}"`);
          }
          setIsListening(false);
        },
        (error) => {
          setVoiceText(`${error}`);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
      setMicRecognizer(rec);
    }
  };

  const handleQuickAdd = (title: string, amount: number, type: 'income' | 'expense', cat: string, icon: string) => {
    const newTx: ExpenseItem = {
      id: 'tx-' + Date.now(),
      title,
      amount,
      type,
      category: cat,
      icon,
      date: new Date().toISOString().split('T')[0],
      audioHint: `${title} - ${amount}`
    };
    onAddTransaction(newTx);
    speechService.playCoinSound();
  };

  const handleDepositToGoal = () => {
    if (!selectedGoal) return;
    const add = parseInt(depositAmount, 10);
    if (add > 0) {
      onUpdateGoal(selectedGoal.id, add);
      speechService.playSuccessSound();
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.7 }
      });
      setSelectedGoal(null);
    }
  };

  const seasonalAdvice = AIAdvisorService.getSeasonalCashflowWarning(new Date().getMonth() + 1);

  return (
    <div className="space-y-6">
      {/* Overview Bento KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Income */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-5 border border-white/[0.08] hover:border-emerald-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {s.todayIncome}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight font-mono">
            ₹{totalIncome.toLocaleString('en-IN')}
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-1">{lang === 'en' ? 'Dairy, tailoring & harvest' : 'डेयरी, सिलाई व कृषि उत्पाद'}</p>
        </div>

        {/* Total Expense */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-5 border border-white/[0.08] hover:border-rose-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {s.todayExpense}
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight font-mono">
            ₹{totalExpense.toLocaleString('en-IN')}
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-1">{lang === 'en' ? 'Ration, medical & household' : 'राशन, दवा व घरेलू जरूरतें'}</p>
        </div>

        {/* Net Savings - Featured Bento Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#06241a]/90 via-[#071d18]/90 to-slate-950/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-emerald-500/40 backdrop-blur-xl group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              {s.netSavingsTitle}
            </span>
            <AudioButton
              textToSpeak={`${s.todayIncome} ${totalIncome}. ${s.todayExpense} ${totalExpense}. ${s.netSavingsTitle} ${netSavings}`}
              lang={lang}
              size="sm"
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border-emerald-400/30"
            />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2 tracking-tight font-mono drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            ₹{netSavings.toLocaleString('en-IN')}
          </h3>
          <p className="text-xs text-emerald-300/80 font-medium mt-1">{lang === 'en' ? 'Available surplus funds' : 'उपलब्ध अधिशेष राशि'}</p>
        </div>
      </div>

      {/* Visual Analytics Bento Row: Financial Health Dial + Expense Distribution Donut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SavingsHealthGauge
          score={totalIncome > 0 ? Math.min(100, Math.round(((netSavings) / totalIncome) * 100) + 35) : 75}
          lang={lang}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
        />
        <ExpenseDonutChart
          expenses={expenses}
          lang={lang}
        />
      </div>

      {/* Voice Entry Bar */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#0d1525]/90 to-slate-950/95 p-5 sm:p-6 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <button
              onClick={toggleListening}
              className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg active:scale-95 flex-shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white ring-4 ring-rose-500/40 animate-pulse shadow-[0_0_25px_rgba(244,63,94,0.6)]'
                  : 'bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.35)] border border-emerald-300/40'
              }`}
              title={s.voiceAssistant}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6 text-slate-950" />}
            </button>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{s.voiceLedgerTitle}</span>
                {isListening && (
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2.5 py-0.5 rounded-full border border-rose-500/40 animate-pulse">
                    {s.listening}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                {voiceText || s.voiceLedgerSub}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full sm:w-auto px-4 py-2.5 bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 border border-white/10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>{s.manualAdd}</span>
          </button>
        </div>

        {/* 1-Tap Quick Action Buttons */}
        <div className="mt-5 pt-4 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.quickPresets}:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => handleQuickAdd(lang === 'en' ? 'Milk Sold' : 'दूध मिला', 120, 'income', 'dairy', '🥛')}
              className="p-3 bg-white/[0.04] hover:bg-emerald-500/10 border border-white/[0.08] hover:border-emerald-500/40 rounded-xl flex items-center gap-2.5 text-left transition-all active:scale-95 group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🥛</span>
              <div>
                <p className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200">{s.quickMilk}</p>
                <p className="text-[10px] text-slate-400">{lang === 'en' ? 'Dairy Earning' : 'डेयरी कमाई'}</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickAdd(lang === 'en' ? 'Tailoring Income' : 'सिलाई कमाई', 200, 'income', 'tailoring', '🧵')}
              className="p-3 bg-white/[0.04] hover:bg-emerald-500/10 border border-white/[0.08] hover:border-emerald-500/40 rounded-xl flex items-center gap-2.5 text-left transition-all active:scale-95 group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🧵</span>
              <div>
                <p className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200">{s.quickTailoring}</p>
                <p className="text-[10px] text-slate-400">{lang === 'en' ? 'Blouse / Dress' : 'ब्लाउज/सूट'}</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickAdd(lang === 'en' ? 'Ration Grocery' : 'राशन खर्च', 80, 'expense', 'grocery', '🌾')}
              className="p-3 bg-white/[0.04] hover:bg-rose-500/10 border border-white/[0.08] hover:border-rose-500/40 rounded-xl flex items-center gap-2.5 text-left transition-all active:scale-95 group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🌾</span>
              <div>
                <p className="text-xs font-bold text-rose-300 group-hover:text-rose-200">{s.quickGrocery}</p>
                <p className="text-[10px] text-slate-400">{lang === 'en' ? 'Market Spend' : 'हाट खर्च'}</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickAdd(lang === 'en' ? 'Medicine' : 'दवा खर्च', 150, 'expense', 'health', '💊')}
              className="p-3 bg-white/[0.04] hover:bg-rose-500/10 border border-white/[0.08] hover:border-rose-500/40 rounded-xl flex items-center gap-2.5 text-left transition-all active:scale-95 group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">💊</span>
              <div>
                <p className="text-xs font-bold text-rose-300 group-hover:text-rose-200">{s.quickHealth}</p>
                <p className="text-[10px] text-slate-400">{lang === 'en' ? 'Healthcare' : 'स्वास्थ्य व्यय'}</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Manual Entry Form */}
      {showAddForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const amt = parseInt(amount, 10);
            if (!title || !amt) return;
            const newTx: ExpenseItem = {
              id: 'tx-' + Date.now(),
              title,
              amount: amt,
              type,
              category,
              icon: type === 'income' ? '💵' : '🛒',
              date: new Date().toISOString().split('T')[0],
              audioHint: `${title} - ${amt}`
            };
            onAddTransaction(newTx);
            speechService.playCoinSound();
            setTitle('');
            setAmount('');
            setShowAddForm(false);
          }}
          className="bg-slate-900/90 p-6 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl space-y-4"
        >
          <h4 className="text-sm font-bold text-white">{s.manualAdd}</h4>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                type === 'income' ? 'bg-emerald-600 text-white shadow-emerald-glow' : 'bg-white/[0.06] text-slate-300'
              }`}
            >
              {s.addIncome}
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                type === 'expense' ? 'bg-rose-600 text-white shadow-md' : 'bg-white/[0.06] text-slate-300'
              }`}
            >
              {s.addExpense}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder={lang === 'en' ? "Description (e.g. Milk, Tailoring, Ration)" : "विवरण (उदा. राशन, दूध, सिलाई)"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 bg-white/[0.05] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              required
            />
            <input
              type="number"
              placeholder="रकम (₹ Amount)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="p-3 bg-white/[0.05] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-300 rounded-xl text-xs font-semibold"
            >
              {s.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-md"
            >
              {s.save}
            </button>
          </div>
        </form>
      )}

      {/* Seasonal Rural Cashflow Alert */}
      <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-600/10 border border-amber-500/30 p-4.5 rounded-2xl flex items-start justify-between gap-3 shadow-[0_4px_20px_rgba(245,158,11,0.1)]">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
          <div>
            <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">{lang === 'en' ? 'Seasonal Crop & Cashflow Forecast' : 'ऋतु चक्र व नकदी परामर्श (AI Forecast)'}</p>
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed mt-1">
              {seasonalAdvice}
            </p>
          </div>
        </div>
        <AudioButton
          textToSpeak={seasonalAdvice}
          lang={lang}
          size="sm"
          className="flex-shrink-0 bg-amber-500/20 text-amber-300 border-amber-500/30"
        />
      </div>

      {/* Visual Smart Gullak (Goal-Based Savings) */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 p-6 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {s.targetGoalsTitle}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {s.targetGoalsSub}
            </p>
          </div>
          <AudioButton
            textToSpeak={`${s.targetGoalsTitle}. ${s.targetGoalsSub}`}
            lang={lang}
            size="sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            return (
              <div
                key={goal.id}
                className="bg-white/[0.03] hover:bg-white/[0.06] rounded-2xl p-4.5 border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 bg-white/[0.08] rounded-xl border border-white/10 shadow-inner group-hover:scale-105 transition-transform">
                        {goal.icon}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">
                          {goal.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {lang === 'en' ? 'Target Date: ' : 'लक्ष्य तिथि: '} {goal.targetDate}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 rounded-md font-mono">
                      {percent}%
                    </span>
                  </div>

                  {/* Clean progress bar */}
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden my-3">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2 font-mono">
                    <span className="text-emerald-400">{lang === 'en' ? 'Saved: ' : 'जमा: '} ₹{goal.currentAmount.toLocaleString('en-IN')}</span>
                    <span className="text-slate-400">{lang === 'en' ? 'Target: ' : 'लक्ष्य: '} ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <p className="text-[11px] text-amber-200 font-medium bg-amber-500/10 p-2.5 rounded-xl border border-amber-400/20">
                    ✨ {goal.visualMilestone}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.08]">
                  <button
                    onClick={() => {
                      setSelectedGoal(goal);
                      setDepositAmount('100');
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 border border-emerald-400/30"
                  >
                    {s.depositToGoal}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction History */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 p-6 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">
            {s.recentLedger}
          </h3>
          <span className="text-xs text-slate-400 font-medium">{expenses.length} {s.entriesCount}</span>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {expenses.map((tx) => (
            <div
              key={tx.id}
              className="py-3 flex items-center justify-between hover:bg-white/[0.04] px-2.5 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl p-2 bg-white/[0.06] rounded-xl border border-white/10 shadow-inner">
                  {tx.icon}
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-100">{tx.title}</h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {tx.date} {tx.note && `• ${tx.note}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-bold font-mono ${
                    tx.type === 'income' ? 'text-emerald-400' : 'text-slate-300'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'}₹{tx.amount}
                </span>
                <AudioButton
                  textToSpeak={tx.audioHint || `${tx.title}: ${tx.amount} rupees`}
                  lang={lang}
                  size="sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deposit to Goal Modal */}
      {selectedGoal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1220] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-white/15 animate-in zoom-in-95 text-slate-100">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <span>{selectedGoal.icon}</span>
              <span>{selectedGoal.title}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {s.depositModalTitle}
            </p>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {['50', '100', '250', '500'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setDepositAmount(preset)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    depositAmount === preset
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-extrabold'
                      : 'bg-white/[0.06] text-slate-300 border-white/10 hover:bg-white/[0.1]'
                  }`}
                >
                  +₹{preset}
                </button>
              ))}
            </div>

            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full p-3 bg-white/[0.06] border border-white/15 rounded-xl text-center text-lg font-bold font-mono text-emerald-400 mb-4 focus:border-emerald-400 focus:outline-none shadow-inner"
              placeholder="रकम दर्ज करें"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedGoal(null)}
                className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-slate-300 rounded-xl text-xs font-semibold"
              >
                {s.cancel}
              </button>
              <button
                onClick={handleDepositToGoal}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-md"
              >
                {s.depositToGoal}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
