import React, { useState } from 'react';
import { Sparkles, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, LanguageCode, LiteracyLevel } from '../types';
import { AudioButton } from './AudioButton';
import { speechService } from '../services/speechService';
import { UI_STRINGS } from '../services/translations';

interface MicroInvestmentModuleProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  lang: LanguageCode;
  literacyLevel: LiteracyLevel;
}

export const MicroInvestmentModule: React.FC<MicroInvestmentModuleProps> = ({
  profile,
  onUpdateProfile,
  lang,
}) => {
  const [goldAmount, setGoldAmount] = useState('50');
  const [shgContribution, setShgContribution] = useState('100');
  const [activeTab, setActiveTab] = useState<'gold' | 'shg' | 'calculator'>('gold');

  const s = UI_STRINGS[lang] || UI_STRINGS.hi;

  // Gold price simulation (₹7,450 per gram)
  const goldPricePerGram = 7450;
  const currentGoldValue = Math.round(profile.digitalGoldGrams * goldPricePerGram);

  // Buy Gold Action
  const handleBuyGold = () => {
    const amt = parseInt(goldAmount, 10);
    if (isNaN(amt) || amt < 10) return;

    if (profile.walletBalance < amt) {
      alert(lang === 'en' ? 'Insufficient balance. Please choose a smaller amount.' : 'उपलब्ध बैलेंस कम है। कृपया छोटी रकम चुनें।');
      return;
    }

    const gramsBought = parseFloat((amt / goldPricePerGram).toFixed(4));
    onUpdateProfile({
      walletBalance: profile.walletBalance - amt,
      digitalGoldGrams: parseFloat((profile.digitalGoldGrams + gramsBought).toFixed(4))
    });

    speechService.playSuccessSound();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // Contribute to SHG Bachat Pool
  const handleSHGDeposit = () => {
    const amt = parseInt(shgContribution, 10);
    if (isNaN(amt) || amt < 50) return;

    if (profile.walletBalance < amt) {
      alert(lang === 'en' ? 'Insufficient wallet balance.' : 'वॉलेट बैलेंस अपर्याप्त है।');
      return;
    }

    onUpdateProfile({
      walletBalance: profile.walletBalance - amt,
      shgPoolContribution: profile.shgPoolContribution + amt
    });

    speechService.playSuccessSound();
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Bento Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#1b1509]/90 to-slate-950/95 p-6 sm:p-8 border border-amber-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/40 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>{lang === 'en' ? 'Micro-Wealth Building' : 'सूक्ष्म निवेश व संचय'}</span>
            </span>
            <AudioButton
              textToSpeak={`${s.goldVaultTitle}. ${s.buyGoldSub}`}
              lang={lang}
              size="sm"
              className="bg-white/10 text-white border-white/20"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2 leading-tight">
            {lang === 'en' ? 'Micro-Wealth & Gold (Micro-Investment)' : 'सूक्ष्म निवेश (Micro-Wealth Platform)'}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
            {s.buyGoldSub}
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('gold')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'gold'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)] font-extrabold'
                  : 'bg-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.14] border border-white/10'
              }`}
            >
              🪙 {s.goldVaultTitle}
            </button>
            <button
              onClick={() => setActiveTab('shg')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'shg'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] font-extrabold'
                  : 'bg-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.14] border border-white/10'
              }`}
            >
              👭 {s.shgTitle}
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'calculator'
                  ? 'bg-white text-slate-950 shadow-md font-extrabold'
                  : 'bg-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.14] border border-white/10'
              }`}
            >
              📈 {s.calculatorTitle}
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: Digital Gold */}
      {activeTab === 'gold' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gold Vault Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c160b]/90 via-[#261f10]/85 to-slate-950/95 p-6 border border-amber-500/35 shadow-[0_10px_35px_rgba(245,158,11,0.15)] flex flex-col justify-between backdrop-blur-xl">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-300/80 uppercase tracking-wider">
                    {s.goldVaultTitle}
                  </span>
                  <h3 className="text-3xl font-black text-amber-200 mt-1 tracking-tight font-mono drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                    {profile.digitalGoldGrams} {lang === 'en' ? 'Grams' : 'ग्राम'}
                  </h3>
                  <p className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1 font-mono">
                    <span>{s.goldVaultDesc}: ₹{currentGoldValue.toLocaleString('en-IN')}</span>
                  </p>
                </div>
                <div className="w-13 h-13 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-3xl shadow-gold-glow animate-pulse-slow">
                  🪙
                </div>
              </div>

              {/* Tangible physical explanation */}
              <div className="mt-5 p-4 bg-white/[0.04] rounded-2xl border border-white/10">
                <p className="text-xs font-bold text-amber-300 mb-1">
                  ✨ {lang === 'en' ? 'Tangible Physical Milestone:' : 'भौतिक स्वरूप में आपकी बचत:'}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {lang === 'en'
                    ? 'Your savings are now approximately equal to a traditional 24K gold nose pin (Nath). Redeem for cash into your bank account or receive physical delivery anytime.'
                    : 'आपकी यह बचत लगभग एक सोने की नथ (Nose Pin) के बराबर पहुंच चुकी है। जब चाहें इसे बैंक खाते में भुना सकती हैं या सिक्का प्राप्त कर सकती हैं।'}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{lang === 'en' ? 'SEBI / RBI Insured Custody Vault' : 'SEBI / RBI बीमित सुरक्षा वॉल्ट में सुरक्षित'}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <AudioButton
                textToSpeak={`${s.goldVaultTitle}: ${profile.digitalGoldGrams} grams. Value: ${currentGoldValue} rupees.`}
                lang={lang}
                label={s.listenAudio}
                size="sm"
              />
              <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                +14.2% {lang === 'en' ? 'Annual Return ↗' : 'वार्षिक वृद्धि ↗'}
              </span>
            </div>
          </div>

          {/* Buy Gold Action Card */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 p-6 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.5)] flex flex-col justify-between backdrop-blur-xl">
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                {s.buyGoldTitle}
              </h3>
              <p className="text-xs text-slate-400 font-medium mb-4">
                {s.buyGoldSub}
              </p>

              {/* Preset buttons */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {['10', '50', '100', '500'].map((val) => (
                  <button
                    key={val}
                    onClick={() => setGoldAmount(val)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      goldAmount === val
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-gold-glow'
                        : 'bg-white/[0.06] text-slate-300 border-white/10 hover:bg-white/[0.1]'
                    }`}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>

              {/* Amount input */}
              <div className="relative mb-4">
                <span className="absolute left-3.5 top-2.5 text-amber-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  min="10"
                  value={goldAmount}
                  onChange={(e) => setGoldAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-white/[0.05] border border-white/15 focus:border-amber-400 rounded-xl text-sm font-bold font-mono text-white focus:outline-none shadow-inner"
                  placeholder="रकम दर्ज करें"
                />
              </div>

              <div className="bg-white/[0.04] p-3 rounded-xl border border-white/10 text-xs text-slate-300 mb-4 flex justify-between font-medium">
                <span>{lang === 'en' ? 'Estimated Pure Gold: ' : 'प्राप्य शुद्ध सोना:'}</span>
                <span className="font-bold text-amber-300 font-mono">
                  {((parseInt(goldAmount, 10) || 0) / goldPricePerGram).toFixed(4)} {lang === 'en' ? 'grams' : 'ग्राम'}
                </span>
              </div>
            </div>

            <button
              onClick={handleBuyGold}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-black rounded-xl text-xs shadow-gold-glow transition-all flex items-center justify-center gap-1.5"
            >
              <span>🪙 ₹{goldAmount} {s.buyGoldBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: SHG Community Bachat Pool */}
      {activeTab === 'shg' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 p-6 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                🤝
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'en' ? 'Jai Bhavani Women SHG Group' : 'जय भवानी महिला स्वयं सहायता समूह'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'en' ? 'Village: Rampur • 14 Sister Members' : 'गाँव: रामपुर • कुल सदस्याएं: 14 बहनें'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/[0.04] p-4 rounded-2xl border border-white/10">
                <p className="text-xs text-slate-400 font-medium">{lang === 'en' ? 'Group Total Pool' : 'समूह का कुल जमा कोष'}</p>
                <h4 className="text-2xl font-black text-white mt-0.5 font-mono">₹48,500</h4>
                <p className="text-[10px] text-emerald-400 font-semibold">{lang === 'en' ? 'Secure in Bank Account' : 'बैंक खाते में सुरक्षित'}</p>
              </div>
              <div className="bg-white/[0.04] p-4 rounded-2xl border border-white/10">
                <p className="text-xs text-slate-400 font-medium">{lang === 'en' ? 'Your Total Contribution' : 'आपका व्यक्तिगत अंशदान'}</p>
                <h4 className="text-2xl font-black text-emerald-400 mt-0.5 font-mono">₹{profile.shgPoolContribution}</h4>
                <p className="text-[10px] text-slate-400">{lang === 'en' ? '12 Months Regular Deposit' : '12 महीने नियमित बचत'}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-xs font-bold text-slate-300">{lang === 'en' ? 'Recent Group Decisions:' : 'हालिया समूह लेन-देन:'}</p>
              <div className="text-xs bg-white/[0.03] p-3 rounded-xl border border-white/[0.08] flex items-center justify-between">
                <span className="text-slate-200">{lang === 'en' ? 'Kamla Didi approved tailoring loan' : 'कमला दीदी को सिलाई हेतु ऋण स्वीकृत'}</span>
                <span className="font-bold text-emerald-400 font-mono">₹5,000</span>
              </div>
              <div className="text-xs bg-white/[0.03] p-3 rounded-xl border border-white/[0.08] flex items-center justify-between">
                <span className="text-slate-200">{lang === 'en' ? 'Annual dividend distributed per sister' : 'वार्षिक लाभांश वितरण (प्रत्येक सदस्या को)'}</span>
                <span className="font-bold text-amber-300 font-mono">₹450</span>
              </div>
            </div>

            <AudioButton
              textToSpeak={`${s.shgTitle}: 48500. ${profile.shgPoolContribution}`}
              lang={lang}
              size="sm"
            />
          </div>

          {/* Deposit Monthly Contribution */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 p-6 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.5)] flex flex-col justify-between backdrop-blur-xl">
            <div>
              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'en' ? 'Contribute Monthly Group Savings' : 'मासिक अंशदान जमा करें'}</span>
              </h3>
              <p className="text-xs text-slate-400 font-medium mb-4">
                {lang === 'en' ? 'Consistent ₹100 deposits qualify you for bank CCL subsidized loans.' : 'नियमित ₹100 जमा करने से बैंक से सीसीएल ऋण पात्रता बढ़ती है।'}
              </p>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {['50', '100', '200'].map((val) => (
                  <button
                    key={val}
                    onClick={() => setShgContribution(val)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      shgContribution === val
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-extrabold'
                        : 'bg-white/[0.06] text-slate-300 border-white/10 hover:bg-white/[0.1]'
                    }`}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>

              <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/25 text-xs text-emerald-200 mb-4 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  {lang === 'en' ? 'Depositing your contribution unlocks the "Sakhi Guardian Star" badge.' : 'इस महीने आपका अंशदान जमा होने पर आपको "सखी समूह रक्षक" स्टार मिलेगा।'}
                </span>
              </div>
            </div>

            <button
              onClick={handleSHGDeposit}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>🤝 ₹{shgContribution} {s.shgDepositBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Growth Calculator */}
      {activeTab === 'calculator' && (
        <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 p-6 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {s.calculatorTitle}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {lang === 'en' ? 'See how small daily decisions compound into financial independence' : 'छोटी नियमित बचत कैसे भविष्य में बड़ा पारिवारिक संबल बनती है'}
              </p>
            </div>
            <AudioButton
              textToSpeak={lang === 'en' ? 'Saving 10 rupees daily compounds into over 1 lakh 18 thousand rupees at 8.2 percent interest in 15 years.' : 'अगर आप रोजाना केवल 10 रुपये सुकन्या या आरडी में बचाती हैं, तो 15 साल में यह पैसा 1 लाख रुपये से ज्यादा बन जाता है।'}
              lang={lang}
              size="sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-5 bg-white/[0.04] rounded-2xl border border-white/10 text-center">
              <p className="text-xs font-medium text-slate-400">{lang === 'en' ? 'Daily Micro-Saving' : 'प्रतिदिन की बचत'}</p>
              <h4 className="text-2xl font-black text-white my-1 font-mono">₹10</h4>
              <p className="text-[11px] text-amber-300">{lang === 'en' ? 'Equal to 1 cup of tea' : '1 कप चाय के बराबर'}</p>
            </div>

            <div className="p-5 bg-white/[0.04] rounded-2xl border border-white/10 text-center">
              <p className="text-xs font-medium text-slate-400">{lang === 'en' ? '15 Years Principal Deposited' : '15 वर्ष में आपकी कुल जमा'}</p>
              <h4 className="text-2xl font-black text-white my-1 font-mono">₹54,000</h4>
              <p className="text-[11px] text-slate-400">{lang === 'en' ? 'Your actual money put in' : 'किस्तों में जमा मूलधन'}</p>
            </div>

            <div className="p-5 bg-gradient-to-br from-emerald-600/30 via-teal-600/20 to-slate-900 border border-emerald-400/40 text-white rounded-2xl text-center shadow-emerald-glow">
              <p className="text-xs font-bold text-emerald-300">{lang === 'en' ? 'At 8.2% Compound Interest' : '8.2% चक्रवृद्धि ब्याज पर कुल प्राप्ति'}</p>
              <h4 className="text-2xl font-black my-1 text-emerald-400 font-mono drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">₹1,18,000+</h4>
              <p className="text-[11px] text-emerald-200">{lang === 'en' ? 'More than double your principal! 🎓' : 'दोगुने से भी अधिक संचय 🎓'}</p>
            </div>
          </div>

          <div className="p-4 bg-white/[0.04] rounded-2xl border border-white/10 text-xs text-slate-300 leading-relaxed">
            <strong className="text-amber-300">💡 {lang === 'en' ? 'Sakhi Principle:' : 'सखी सिद्धांत:'}</strong> {lang === 'en' ? 'Instead of borrowing from moneylenders at 36%, put your money into government schemes earning 8.2% compound interest.' : 'साहूकार से 36% ब्याज पर कर्ज लेने के बजाय बैंक में अपने पैसे पर 8% ब्याज कमाएं।'}
          </div>
        </div>
      )}
    </div>
  );
};
