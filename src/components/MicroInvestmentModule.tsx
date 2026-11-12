import React, { useState } from 'react';
import { Coins, Sparkles, TrendingUp, Users, ShieldCheck, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';
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
  literacyLevel
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
      <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 rounded-3xl p-6 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-black/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>छोटी बचत • बड़ा मुफ़ा</span>
            </span>
            <AudioButton
              textToSpeak="छोटी बचत बड़ा मुनाफा। अब आप सिर्फ 10 रुपये से 24 कैरेट शुद्ध डिजिटल सोना खरीद सकती हैं और स्वयं सहायता समूह में बचत कर सकती हैं।"
              lang={lang}
              size="sm"
              className="bg-white/20 text-white border-white/30"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            सूक्ष्म निवेश (Micro-Investment for Lakshmi)
          </h2>
          <p className="text-yellow-100 text-xs sm:text-sm leading-relaxed mb-4">
            बड़े व्यापारियों की तरह अब ग्रामीण महिलाएं भी ₹10 जैसी छोटी रकम से सोना खरीद सकती हैं या अपने SHG समूह में बचत कर 12% तक लाभांश पा सकती हैं।
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('gold')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'gold' ? 'bg-white text-amber-950 shadow-md' : 'bg-black/20 text-white hover:bg-black/30'
              }`}
            >
              🪙 डिजिटल सोना (₹10 से)
            </button>
            <button
              onClick={() => setActiveTab('shg')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'shg' ? 'bg-white text-amber-950 shadow-md' : 'bg-black/20 text-white hover:bg-black/30'
              }`}
            >
              👭 SHG समूह बचत पूल
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'calculator' ? 'bg-white text-amber-950 shadow-md' : 'bg-black/20 text-white hover:bg-black/30'
              }`}
            >
              📈 भविष्य का जादू (Calculator)
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: Digital Gold */}
      {activeTab === 'gold' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gold Vault Card */}
          <div className="gold-gradient-card rounded-3xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    आपकी स्वर्ण तिजोरी (Digital Gold Vault)
                  </span>
                  <h3 className="text-3xl font-black text-amber-950 mt-1">
                    {profile.digitalGoldGrams} ग्राम शुद्ध सोना
                  </h3>
                  <p className="text-xs font-semibold text-amber-800 mt-0.5">
                    वर्तमान बाजार मूल्य: ₹{currentGoldValue.toLocaleString('en-IN')} (24K - 99.9% शुद्ध)
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl shadow-inner">
                  🪙
                </div>
              </div>

              {/* Tangible physical explanation for rural women */}
              <div className="mt-5 p-3.5 bg-white/70 backdrop-blur-sm rounded-2xl border border-amber-300">
                <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5 mb-1">
                  <span>✨ भौतिक रूप में आपकी बचत:</span>
                </p>
                <p className="text-xs sm:text-sm text-slate-800 font-medium">
                  आपकी यह बचत लगभग एक <strong className="text-amber-900">सोने की नथ (Nose Pin)</strong> के बराबर पहुंच चुकी है! जब भी चाहें इसे बेचकर बैंक खाते में पैसे ले सकती हैं या सिक्का घर मंगवा सकती हैं।
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-amber-900 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>सरकारी मान्यता प्राप्त सुरक्षित वॉल्ट (SEBI / RBI बीमित)</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-amber-300/60 flex items-center justify-between">
              <AudioButton
                textToSpeak={`आपकी तिजोरी में शून्य दशमलव पैंतीस ग्राम शुद्ध सोना है, जिसका आज का मूल्य लगभग ${currentGoldValue} रुपये है।`}
                lang={lang}
                label="सोने की कीमत सुनें"
                size="sm"
              />
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                +14.2% वार्षिक वृद्धि ↗
              </span>
            </div>
          </div>

          {/* Buy Gold Action Card */}
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span>नया सोना जोड़ें (Buy Digital Gold)</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">
                कोई मेकिंग चार्ज नहीं, कोई मिलावट का डर नहीं। मात्र ₹10 से शुरू करें।
              </p>

              {/* Preset buttons */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {['10', '50', '100', '500'].map((val) => (
                  <button
                    key={val}
                    onClick={() => setGoldAmount(val)}
                    className={`py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                      goldAmount === val
                        ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                        : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>

              {/* Amount input */}
              <div className="relative mb-4">
                <span className="absolute left-3 top-3 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min="10"
                  value={goldAmount}
                  onChange={(e) => setGoldAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 border-2 border-slate-200 focus:border-amber-500 rounded-xl text-base font-bold"
                  placeholder="रकम दर्ज करें (न्यूनतम ₹10)"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 mb-4 flex justify-between">
                <span>मिलेगा अनुमानित सोना:</span>
                <span className="font-bold text-amber-900">
                  {((parseInt(goldAmount, 10) || 0) / goldPricePerGram).toFixed(4)} ग्राम
                </span>
              </div>
            </div>

            <button
              onClick={handleBuyGold}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-saffron-600 hover:from-amber-600 hover:to-saffron-700 active:scale-95 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>🪙 ₹{goldAmount} का सोना खरीदें</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: SHG Community Bachat Pool */}
      {activeTab === 'shg' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border-2 border-rose-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center text-2xl">
                🤝
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  जय भवानी महिला स्वयं सहायता समूह (SHG)
                </h3>
                <p className="text-xs text-slate-500">
                  गाँव: रामपुर • कुल सदस्याएं: 14 बहनें
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-rose-50/60 p-3.5 rounded-2xl border border-rose-200">
                <p className="text-xs text-rose-800 font-semibold">समूह का कुल जमा कोष</p>
                <h4 className="text-2xl font-black text-rose-950 mt-0.5">₹48,500</h4>
                <p className="text-[10px] text-rose-700">बैंक खाते में सुरक्षित</p>
              </div>
              <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200">
                <p className="text-xs text-amber-800 font-semibold">आपका व्यक्तिगत योगदान</p>
                <h4 className="text-2xl font-black text-amber-950 mt-0.5">₹{profile.shgPoolContribution}</h4>
                <p className="text-[10px] text-amber-700">12 महीने नियमित बचत</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-xs font-bold text-slate-700">हालिया समूह गतिविधियां:</p>
              <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <span>कमला दीदी को सिलाई के लिए ऋण स्वीकृत</span>
                <span className="font-bold text-emerald-600">₹5,000</span>
              </div>
              <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <span>वार्षिक लाभांश वितरण (प्रत्येक बहन को)</span>
                <span className="font-bold text-amber-600">₹450</span>
              </div>
            </div>

            <AudioButton
              textToSpeak="आपके स्वयं सहायता समूह में कुल 48 हजार 500 रुपये जमा हैं। आपका योगदान 1200 रुपये है। किसी भी बहन को आवश्यकता पड़ने पर तुरंत सहायता मिलती है।"
              lang={lang}
              size="sm"
            />
          </div>

          {/* Deposit Monthly Contribution */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Users className="w-5 h-5 text-rose-600" />
                <span>मासिक समूह अंशदान जमा करें</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">
                नियमित ₹100 जमा करने से आपको बैंक से 1 लाख तक का आसान लोन मिलता है।
              </p>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {['50', '100', '200'].map((val) => (
                  <button
                    key={val}
                    onClick={() => setShgContribution(val)}
                    className={`py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                      shgContribution === val
                        ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
                        : 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>

              <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-950 mb-4 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  इस महीने आपका अंशदान जमा होने पर आपको <strong>"सखी समूह रक्षक"</strong> स्टार मिलेगा।
                </span>
              </div>
            </div>

            <button
              onClick={handleSHGDeposit}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>🤝 ₹{shgContribution} समूह में जमा करें</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Growth Calculator */}
      {activeTab === 'calculator' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>📈 ₹10 रोज की बचत का चमत्कार (Compounding)</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                देखिए छोटी-छोटी बचत कैसे आपकी बेटी को डॉक्टर, इंजीनियर या खुद की दुकान की मालिक बना सकती है
              </p>
            </div>
            <AudioButton
              textToSpeak="अगर आप रोजाना केवल 10 रुपये सुकन्या या आरडी में बचाती हैं, तो 15 साल में यह पैसा 1 लाख रुपये से ज्यादा बन जाता है।"
              lang={lang}
              size="sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center">
              <p className="text-xs font-bold text-amber-800">रोजाना बचत</p>
              <h4 className="text-3xl font-extrabold text-amber-950 my-1">₹10</h4>
              <p className="text-[11px] text-slate-500">1 कप चाय या गुटखा के बराबर</p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <p className="text-xs font-bold text-emerald-800">15 साल में आपकी कुल जमा</p>
              <h4 className="text-3xl font-extrabold text-emerald-950 my-1">₹54,000</h4>
              <p className="text-[11px] text-slate-500">धीरे-धीरे जमा की गई रकम</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-amber-400 to-saffron-500 text-white rounded-2xl text-center shadow">
              <p className="text-xs font-bold text-amber-100">8.2% ब्याज से मिलेगा कुल फंड</p>
              <h4 className="text-3xl font-black my-1">₹1,18,000+</h4>
              <p className="text-[11px] text-amber-100">दोगुने से भी ज्यादा! 🎓</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <strong>💡 सखी सीख:</strong> अमीर लोग पैसे के लिए काम नहीं करते, बल्कि पैसा उनके लिए काम करता है। साहूकार से ब्याज पर लेने के बजाय बैंक में अपना पैसा ब्याज पर बढ़ाएं।
          </div>
        </div>
      )}
    </div>
  );
};
