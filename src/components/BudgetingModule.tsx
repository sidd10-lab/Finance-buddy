import React, { useState } from 'react';
import { Mic, MicOff, PlusCircle, ArrowUpRight, ArrowDownRight, Target, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
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
  profile,
  expenses,
  goals,
  onAddTransaction,
  onUpdateGoal,
  lang,
  literacyLevel
}) => {
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [micRecognizer, setMicRecognizer] = useState<{ stop: () => void } | null>(null);

  // Manual fast-entry drawer state
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState('dairy');

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
            setVoiceText(`सफलतापूर्वक जोड़ा: ${newTx.title} - ₹${newTx.amount}`);
          } else {
            setVoiceText(`सुना: "${transcript}". रकम समझ नहीं आई, कृपया स्पष्ट बोलें (उदा: 100 रुपये मिले)`);
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

  // Quick 1-tap presets for rural users
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
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Income */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              <span>कुल आमदनी (Income)</span>
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              ₹{totalIncome.toLocaleString('en-IN')}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">डेयरी, सिलाई व कृषि कार्य से</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">
            🌾
          </div>
        </div>

        {/* Expense */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-rose-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
              <ArrowDownRight className="w-4 h-4 text-rose-600" />
              <span>कुल खर्च (Expense)</span>
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              ₹{totalExpense.toLocaleString('en-IN')}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">राशन, दवा व घरेलू जरूरतें</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-2xl">
            🛒
          </div>
        </div>

        {/* Net Savings */}
        <div className="bg-gradient-to-br from-amber-400 to-saffron-500 text-white rounded-2xl p-4 sm:p-5 shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-100 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-amber-200" />
              <span>हाथ में शुद्ध बचत (Savings)</span>
            </p>
            <h3 className="text-2xl sm:text-3xl font-black mt-1">
              ₹{netSavings.toLocaleString('en-IN')}
            </h3>
            <div className="mt-1">
              <AudioButton
                textToSpeak={`आपकी कुल आमदनी ${totalIncome} रुपये और खर्च ${totalExpense} रुपये है। हाथ में बची शुद्ध बचत ${netSavings} रुपये है।`}
                lang={lang}
                size="sm"
                className="bg-white/20 text-white border-white/30"
              />
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
            🏺
          </div>
        </div>
      </div>

      {/* Voice Entry Bar (Special AI Feature for low-literacy women) */}
      <div className="bg-gradient-to-r from-amber-100 via-saffron-50 to-amber-100 rounded-3xl p-5 border-2 border-amber-300 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={toggleListening}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-95 flex-shrink-0 touch-target-large ${
                isListening
                  ? 'bg-rose-600 text-white ring-8 ring-rose-200 animate-pulse'
                  : 'bg-saffron-600 hover:bg-saffron-700 text-white'
              }`}
              title="माइक दबाकर बोलें"
            >
              {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </button>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>बोलकर हिसाब लिखें (Voice Hisaab)</span>
                {isListening && (
                  <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full animate-bounce">
                    सुन रहे हैं...
                  </span>
                )}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {voiceText || 'माइक दबाकर बोलें: "दूध के 80 रुपये मिले" या "सब्जी में 50 खर्च हुए"'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-amber-600" />
            <span>हाथ से दर्ज करें</span>
          </button>
        </div>

        {/* 1-Tap Quick Action Buttons (Visual First for Lakshmi) */}
        <div className="mt-4 pt-3 border-t border-amber-200/80">
          <p className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1">
            <span>⚡ 1-क्लिक त्वरित जोड़ें (Quick Add):</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handleQuickAdd('दूध बिक्री आमदनी', 120, 'income', 'dairy', '🥛')}
              className="p-2.5 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-left transition-all active:scale-95 shadow-xs"
            >
              <span className="text-xl">🥛</span>
              <div>
                <p className="text-xs font-bold text-emerald-900">+₹120 दूध मिला</p>
                <p className="text-[10px] text-slate-500">डेयरी कमाई</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickAdd('सिलाई काम कमाई', 200, 'income', 'tailoring', '🧵')}
              className="p-2.5 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-left transition-all active:scale-95 shadow-xs"
            >
              <span className="text-xl">🧵</span>
              <div>
                <p className="text-xs font-bold text-emerald-900">+₹200 सिलाई मिली</p>
                <p className="text-[10px] text-slate-500">ब्लाउज/सूट</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickAdd('दैनिक राशन व सब्जी', 80, 'expense', 'grocery', '🌾')}
              className="p-2.5 bg-white hover:bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-left transition-all active:scale-95 shadow-xs"
            >
              <span className="text-xl">🌾</span>
              <div>
                <p className="text-xs font-bold text-rose-900">-₹80 राशन</p>
                <p className="text-[10px] text-slate-500">हाट खर्च</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickAdd('दवा व डॉक्टर परामर्श', 150, 'expense', 'health', '💊')}
              className="p-2.5 bg-white hover:bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-left transition-all active:scale-95 shadow-xs"
            >
              <span className="text-xl">💊</span>
              <div>
                <p className="text-xs font-bold text-rose-900">-₹150 दवा खर्च</p>
                <p className="text-[10px] text-slate-500">स्वास्थ्य व्यय</p>
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
          className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-4"
        >
          <h4 className="text-sm font-bold text-slate-900">नया हिसाब दर्ज करें</h4>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold ${
                type === 'income' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              + आमदनी (कमाई)
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold ${
                type === 'expense' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              - खर्च (व्यय)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="विवरण (उदा. राशन, दूध, चूड़ी, खाद)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 border border-slate-300 rounded-xl text-sm"
              required
            />
            <input
              type="number"
              placeholder="रकम (₹ Amount)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="p-3 border border-slate-300 rounded-xl text-sm"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow"
            >
              सहेजें
            </button>
          </div>
        </form>
      )}

      {/* Seasonal Rural Cashflow Alert */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs font-bold text-amber-900 uppercase">ऋतु चक्र व नकदी परामर्श (AI Forecast):</p>
          <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed mt-0.5">
            {seasonalAdvice}
          </p>
        </div>
        <AudioButton
          textToSpeak={seasonalAdvice}
          lang={lang}
          size="sm"
          className="flex-shrink-0"
        />
      </div>

      {/* Visual Smart Gullak (Goal-Based Savings) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>🏺 सखी गुल्लक लक्ष्य (Visual Goals)</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              मटके या अलमारी के बजाय हर लक्ष्य के लिए अलग गुल्लक बनाएं
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
                className="bg-amber-50/40 rounded-2xl p-4 border border-amber-200 flex flex-col justify-between hover:border-amber-400 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl p-2 bg-white rounded-xl shadow-xs border border-amber-100">
                        {goal.icon}
                      </span>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                          {goal.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          लक्ष्य तिथि: {goal.targetDate}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      {percent}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden my-3">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-saffron-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
                    <span>जमा: ₹{goal.currentAmount.toLocaleString('en-IN')}</span>
                    <span>कुल लक्ष्य: ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <p className="text-[11px] text-amber-900 font-medium bg-amber-100/60 px-2.5 py-1 rounded-lg">
                    ✨ {goal.visualMilestone}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedGoal(goal);
                      setDepositAmount('100');
                    }}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>🪙 गुल्लक में ₹ जमा करें</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction History (Visual Passbook Style) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            हालिया लेनदेन (Passbook History)
          </h3>
          <span className="text-xs text-slate-500 font-semibold">{expenses.length} प्रविष्टियां</span>
        </div>

        <div className="space-y-2.5">
          {expenses.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200/80 transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl ${
                    tx.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {tx.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{tx.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {tx.date} {tx.note && `• ${tx.note}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-base font-extrabold ${
                    tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-4 border-amber-300">
            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <span>{selectedGoal.icon}</span>
              <span>{selectedGoal.title}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              अपनी गुल्लक में आज कितनी बचत डालना चाहती हैं?
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {['50', '100', '250', '500', '1000'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setDepositAmount(preset)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    depositAmount === preset
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'bg-amber-50 text-amber-900 border-amber-200'
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
              className="w-full p-3 border-2 border-amber-300 rounded-xl text-center text-xl font-bold mb-4"
              placeholder="अन्य रकम दर्ज करें"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedGoal(null)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
              >
                रद्द करें
              </button>
              <button
                onClick={handleDepositToGoal}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow"
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
