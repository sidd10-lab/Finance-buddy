import React, { useState } from 'react';
import { Mic, MicOff, PlusCircle, ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExpenseItem, SavingsGoal, LanguageCode, LiteracyLevel, UserProfile } from '../types';
import { AudioButton } from './AudioButton';
import { speechService } from '../services/speechService';
import { AIAdvisorService } from '../services/aiAdvisorService';

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
      setVoiceText('बोलिए... (उदा. "सिलाई के 200 मिले" या "राशन 150")');
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
              audioHint: `${parsed.title} में ${parsed.amount} रुपये का हिसाब दर्ज किया गया`
            };
            onAddTransaction(newTx);
            speechService.playCoinSound();
            setVoiceText(`सफलतापूर्वक दर्ज: ${newTx.title} - ₹${newTx.amount}`);
          } else {
            setVoiceText(`सुना: "${transcript}". कृपया स्पष्ट बोलें (उदा: 100 रुपये मिले)`);
          }
          setIsListening(false);
        },
        (error) => {
          setVoiceText(`त्रुटि: ${error}. कृपया नीचे दिए बटन से चुनें.`);
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
      audioHint: `${title} - ${amount} रुपये जोड़े गए`
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
      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Income */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              कुल आमदनी (Income)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            ₹{totalIncome.toLocaleString('en-IN')}
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-1">डेयरी, सिलाई व कृषि उत्पाद</p>
        </div>

        {/* Total Expense */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              कुल खर्च (Expense)
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            ₹{totalExpense.toLocaleString('en-IN')}
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-1">राशन, दवा व घरेलू जरूरतें</p>
        </div>

        {/* Net Savings */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-card border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              हाथ में शुद्ध बचत (Savings)
            </span>
            <AudioButton
              textToSpeak={`आपकी कुल आमदनी ${totalIncome} रुपये और खर्च ${totalExpense} रुपये है। हाथ में बची शुद्ध बचत ${netSavings} रुपये है।`}
              lang={lang}
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-2 tracking-tight">
            ₹{netSavings.toLocaleString('en-IN')}
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-1">उपलब्ध अधिशेष राशि</p>
        </div>
      </div>

      {/* Voice Entry Bar (Refined & Minimalist) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-soft">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <button
              onClick={toggleListening}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm active:scale-95 flex-shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white ring-4 ring-rose-100 animate-pulse'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
              title="माइक दबाकर बोलें"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span>बोलकर हिसाब लिखें (Voice Ledger)</span>
                {isListening && (
                  <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full border border-rose-200 animate-pulse">
                    रिकॉर्डिंग जारी...
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {voiceText || 'माइक दबाकर बोलें: "दूध के 80 रुपये मिले" या "सब्जी में 50 खर्च हुए"'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full sm:w-auto px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>मैनुअल जोड़ें</span>
          </button>
        </div>

        {/* 1-Tap Quick Action Buttons */}
        <div className="mt-4 pt-3.5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">त्वरित प्रविष्टियां (1-Click Presets):</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handleQuickAdd('दूध बिक्री आमदनी', 120, 'income', 'dairy', '🥛')}
              className="p-2.5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-200 rounded-xl flex items-center gap-2 text-left transition-all active:scale-95"
            >
              <span className="text-lg">🥛</span>
              <div>
                <p className="text-xs font-bold text-emerald-800">+₹120 दूध मिला</p>
                <p className="text-[10px] text-slate-400">डेयरी कमाई</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickAdd('सिलाई काम कमाई', 200, 'income', 'tailoring', '🧵')}
              className="p-2.5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-200 rounded-xl flex items-center gap-2 text-left transition-all active:scale-95"
            >
              <span className="text-lg">🧵</span>
              <div>
                <p className="text-xs font-bold text-emerald-800">+₹200 सिलाई मिली</p>
                <p className="text-[10px] text-slate-400">ब्लाउज/सूट</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickAdd('दैनिक राशन व सब्जी', 80, 'expense', 'grocery', '🌾')}
              className="p-2.5 bg-slate-50 hover:bg-rose-50/60 border border-slate-200/80 hover:border-rose-200 rounded-xl flex items-center gap-2 text-left transition-all active:scale-95"
            >
              <span className="text-lg">🌾</span>
              <div>
                <p className="text-xs font-bold text-rose-800">-₹80 राशन</p>
                <p className="text-[10px] text-slate-400">हाट खर्च</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickAdd('दवा व परामर्श', 150, 'expense', 'health', '💊')}
              className="p-2.5 bg-slate-50 hover:bg-rose-50/60 border border-slate-200/80 hover:border-rose-200 rounded-xl flex items-center gap-2 text-left transition-all active:scale-95"
            >
              <span className="text-lg">💊</span>
              <div>
                <p className="text-xs font-bold text-rose-800">-₹150 दवा खर्च</p>
                <p className="text-[10px] text-slate-400">स्वास्थ्य व्यय</p>
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
              audioHint: `${title} - ${amt} रुपये दर्ज किए गए`
            };
            onAddTransaction(newTx);
            speechService.playCoinSound();
            setTitle('');
            setAmount('');
            setShowAddForm(false);
          }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4"
        >
          <h4 className="text-sm font-bold text-slate-900">नया हिसाब दर्ज करें</h4>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                type === 'income' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
              }`}
            >
              + आमदनी (कमाई)
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                type === 'expense' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
              }`}
            >
              - खर्च (व्यय)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="विवरण (उदा. राशन, दूध, सिलाई)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-slate-400 focus:outline-none"
              required
            />
            <input
              type="number"
              placeholder="रकम (₹ Amount)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="p-3 border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-slate-400 focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              सहेजें
            </button>
          </div>
        </form>
      )}

      {/* Seasonal Rural Cashflow Alert */}
      <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-2xl flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-950 uppercase tracking-wider">ऋतु चक्र व नकदी परामर्श (AI Cashflow Forecast)</p>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mt-0.5">
              {seasonalAdvice}
            </p>
          </div>
        </div>
        <AudioButton
          textToSpeak={seasonalAdvice}
          lang={lang}
          size="sm"
          className="flex-shrink-0"
        />
      </div>

      {/* Visual Smart Gullak (Goal-Based Savings) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-soft">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              सखी गुल्लक लक्ष्य (Target Asset Savings)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              मटके या अलमारी के बजाय हर लक्ष्य के लिए समर्पित बचत
            </p>
          </div>
          <AudioButton
            textToSpeak="सखी गुल्लक में आप सिलाई मशीन, बच्चों की पढ़ाई या नई भैंस के लिए रोज थोड़े-थोड़े पैसे जमा कर सकती हैं।"
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
                className="bg-slate-50/60 rounded-xl p-4 border border-slate-200/70 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-1.5 bg-white rounded-lg border border-slate-200/80 shadow-2xs">
                        {goal.icon}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                          {goal.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium">
                          लक्ष्य तिथि: {goal.targetDate}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200/80 px-2 py-0.5 rounded-md">
                      {percent}%
                    </span>
                  </div>

                  {/* Clean progress bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden my-3">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
                    <span>जमा: ₹{goal.currentAmount.toLocaleString('en-IN')}</span>
                    <span className="text-slate-400">लक्ष्य: ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <p className="text-[11px] text-slate-600 font-medium bg-white p-2 rounded-lg border border-slate-200/60">
                    ✨ {goal.visualMilestone}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60">
                  <button
                    onClick={() => {
                      setSelectedGoal(goal);
                      setDepositAmount('100');
                    }}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition-all active:scale-95"
                  >
                    🪙 गुल्लक में ₹ जमा करें
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">
            हालिया प्रविष्टियां (Ledger History)
          </h3>
          <span className="text-xs text-slate-400 font-medium">{expenses.length} प्रविष्टियां</span>
        </div>

        <div className="divide-y divide-slate-100">
          {expenses.map((tx) => (
            <div
              key={tx.id}
              className="py-3 flex items-center justify-between hover:bg-slate-50/60 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl p-2 bg-slate-100/80 rounded-xl">
                  {tx.icon}
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900">{tx.title}</h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {tx.date} {tx.note && `• ${tx.note}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-bold ${
                    tx.type === 'income' ? 'text-emerald-600' : 'text-slate-800'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'}₹{tx.amount}
                </span>
                <AudioButton
                  textToSpeak={tx.audioHint || `${tx.title}: ${tx.amount} रुपये`}
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-elevated border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <span>{selectedGoal.icon}</span>
              <span>{selectedGoal.title}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              गुल्लक में कितनी बचत डालना चाहती हैं?
            </p>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {['50', '100', '250', '500'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setDepositAmount(preset)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    depositAmount === preset
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
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
              className="w-full p-3 border border-slate-300 rounded-xl text-center text-lg font-bold mb-4 focus:border-slate-500 focus:outline-none"
              placeholder="रकम दर्ज करें"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedGoal(null)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
              >
                रद्द करें
              </button>
              <button
                onClick={handleDepositToGoal}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                गुल्लक में डालें 🪙
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
