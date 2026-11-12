import React, { useState } from 'react';
import { Sparkles, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, LanguageCode, LiteracyLevel } from '../types';
import { AudioButton } from './AudioButton';
import { speechService } from '../services/speechService';

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

  // Gold price simulation (₹7,450 per gram)
  const goldPricePerGram = 7450;
  const currentGoldValue = Math.round(profile.digitalGoldGrams * goldPricePerGram);

  // Buy Gold Action
  const handleBuyGold = () => {
    const amt = parseInt(goldAmount, 10);
    if (isNaN(amt) || amt < 10) return;

    if (profile.walletBalance < amt) {
      alert('उपलब्ध बैलेंस कम है। कृपया छोटी रकम चुनें।');
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
      alert('वॉलेट बैलेंस अपर्याप्त है।');
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
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-400/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>सूक्ष्म निवेश व संचय</span>
            </span>
            <AudioButton
              textToSpeak="छोटी बचत बड़ा मुनाफा। अब आप सिर्फ 10 रुपये से 24 कैरेट शुद्ध डिजिटल सोना खरीद सकती हैं और स्वयं सहायता समूह में बचत कर सकती हैं।"
              lang={lang}
              size="sm"
              className="bg-white/10 text-white border-white/20"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            सूक्ष्म निवेश (Micro-Wealth Platform)
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">
            बिना किसी मेकिंग चार्ज या मिलावट के डर के, मात्र ₹10 से 24 कैरेट डिजिटल सोना खरीदें या अपने स्वयं सहायता समूह में पूंजी संचय करें।
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('gold')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'gold' ? 'bg-white text-slate-900 shadow-xs' : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              🪙 डिजिटल सोना (₹10 से)
            </button>
            <button
              onClick={() => setActiveTab('shg')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'shg' ? 'bg-white text-slate-900 shadow-xs' : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              👭 SHG समूह बचत पूल
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'calculator' ? 'bg-white text-slate-900 shadow-xs' : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              📈 कंपाउंडिंग का जादू (Calculator)
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: Digital Gold */}
      {activeTab === 'gold' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gold Vault Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    डिजिटल स्वर्ण तिजोरी (Gold Vault)
                  </span>
                  <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">
                    {profile.digitalGoldGrams} ग्राम
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 mt-1">
                    वर्तमान मूल्य: ₹{currentGoldValue.toLocaleString('en-IN')} (24K - 99.9% शुद्ध)
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl">
                  🪙
                </div>
              </div>

              {/* Tangible physical explanation */}
              <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <p className="text-xs font-semibold text-slate-900 mb-1">
                  ✨ भौतिक स्वरूप में आपकी बचत:
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  आपकी यह बचत लगभग एक <strong>सोने की नथ (Nose Pin)</strong> के बराबर पहुंच चुकी है। जब चाहें इसे बैंक खाते में भुना सकती हैं या सिक्का प्राप्त कर सकती हैं।
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>SEBI / RBI बीमित सुरक्षा वॉल्ट में सुरक्षित</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <AudioButton
                textToSpeak={`आपकी तिजोरी में शून्य दशमलव पैंतीस ग्राम शुद्ध सोना है, जिसका आज का मूल्य लगभग ${currentGoldValue} रुपये है।`}
                lang={lang}
                label="सोने की कीमत सुनें"
                size="sm"
              />
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                +14.2% वार्षिक वृद्धि ↗
              </span>
            </div>
          </div>

          {/* Buy Gold Action Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-soft flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                नया सोना जोड़ें (Buy 24K Gold)
              </h3>
              <p className="text-xs text-slate-400 font-medium mb-4">
                कोई मेकिंग चार्ज नहीं, कोई मिलावट नहीं। मात्र ₹10 से शुरुआत।
              </p>

              {/* Preset buttons */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {['10', '50', '100', '500'].map((val) => (
                  <button
                    key={val}
                    onClick={() => setGoldAmount(val)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      goldAmount === val
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>

              {/* Amount input */}
              <div className="relative mb-4">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  min="10"
                  value={goldAmount}
                  onChange={(e) => setGoldAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-slate-200 focus:border-slate-400 rounded-xl text-sm font-semibold focus:outline-none"
                  placeholder="रकम दर्ज करें"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 mb-4 flex justify-between">
                <span>प्राप्य शुद्ध सोना:</span>
                <span className="font-bold text-slate-900">
                  {((parseInt(goldAmount, 10) || 0) / goldPricePerGram).toFixed(4)} ग्राम
                </span>
              </div>
            </div>

            <button
              onClick={handleBuyGold}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>🪙 ₹{goldAmount} का सोना खरीदें</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: SHG Community Bachat Pool */}
      {activeTab === 'shg' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                🤝
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  जय भवानी महिला स्वयं सहायता समूह
                </h3>
                <p className="text-xs text-slate-400">
                  गाँव: रामपुर • कुल सदस्याएं: 14 बहनें
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <p className="text-xs text-slate-500 font-medium">समूह का कुल जमा कोष</p>
                <h4 className="text-2xl font-black text-slate-900 mt-0.5">₹48,500</h4>
                <p className="text-[10px] text-emerald-600 font-semibold">बैंक खाते में सुरक्षित</p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <p className="text-xs text-slate-500 font-medium">आपका व्यक्तिगत अंशदान</p>
                <h4 className="text-2xl font-black text-slate-900 mt-0.5">₹{profile.shgPoolContribution}</h4>
                <p className="text-[10px] text-slate-400">12 महीने नियमित बचत</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-xs font-bold text-slate-600">हालिया समूह लेन-देन:</p>
              <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <span>कमला दीदी को सिलाई हेतु ऋण स्वीकृत</span>
                <span className="font-bold text-emerald-600">₹5,000</span>
              </div>
              <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <span>वार्षिक लाभांश वितरण (प्रत्येक सदस्या को)</span>
                <span className="font-bold text-slate-800">₹450</span>
              </div>
            </div>

            <AudioButton
              textToSpeak="आपके स्वयं सहायता समूह में कुल 48 हजार 500 रुपये जमा हैं। आपका योगदान 1200 रुपये है।"
              lang={lang}
              size="sm"
            />
          </div>

          {/* Deposit Monthly Contribution */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-soft flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-600" />
                <span>मासिक अंशदान जमा करें</span>
              </h3>
              <p className="text-xs text-slate-400 font-medium mb-4">
                नियमित ₹100 जमा करने से बैंक से सीसीएल ऋण पात्रता बढ़ती है।
              </p>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {['50', '100', '200'].map((val) => (
                  <button
                    key={val}
                    onClick={() => setShgContribution(val)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      shgContribution === val
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 mb-4 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  इस महीने आपका अंशदान जमा होने पर आपको <strong>"सखी समूह रक्षक"</strong> स्टार मिलेगा।
                </span>
              </div>
            </div>

            <button
              onClick={handleSHGDeposit}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>🤝 ₹{shgContribution} समूह में जमा करें</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Growth Calculator */}
      {activeTab === 'calculator' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                ₹10 रोज की बचत का चमत्कार (The Compounding Effect)
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                छोटी नियमित बचत कैसे भविष्य में बड़ा पारिवारिक संबल बनती है
              </p>
            </div>
            <AudioButton
              textToSpeak="अगर आप रोजाना केवल 10 रुपये सुकन्या या आरडी में बचाती हैं, तो 15 साल में यह पैसा 1 लाख रुपये से ज्यादा बन जाता है।"
              lang={lang}
              size="sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <p className="text-xs font-medium text-slate-500">प्रतिदिन की बचत</p>
              <h4 className="text-2xl font-black text-slate-900 my-1">₹10</h4>
              <p className="text-[11px] text-slate-400">1 कप चाय के बराबर</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <p className="text-xs font-medium text-slate-500">15 वर्ष में आपकी कुल जमा</p>
              <h4 className="text-2xl font-black text-slate-900 my-1">₹54,000</h4>
              <p className="text-[11px] text-slate-400">किस्तों में जमा मूलधन</p>
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-xl text-center shadow-xs">
              <p className="text-xs font-medium text-emerald-400">8.2% चक्रवृद्धि ब्याज पर कुल प्राप्ति</p>
              <h4 className="text-2xl font-black my-1 text-emerald-300">₹1,18,000+</h4>
              <p className="text-[11px] text-slate-300">दोगुने से भी अधिक संचय 🎓</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <strong>💡 सखी सिद्धांत:</strong> साहूकार से 36% ब्याज पर कर्ज लेने के बजाय बैंक में अपने पैसे पर 8% ब्याज कमाएं।
          </div>
        </div>
      )}
    </div>
  );
};
