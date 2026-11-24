import React, { useState, useMemo } from 'react';
import { Landmark, ShieldAlert, CheckCircle, FileText, PhoneCall, X } from 'lucide-react';
import { GovernmentScheme, LanguageCode, LiteracyLevel, UserProfile } from '../types';
import { getLocalizedSchemes } from '../data/mockData';
import { AudioButton } from './AudioButton';
import { UI_STRINGS } from '../services/translations';

interface BankingModuleProps {
  profile: UserProfile;
  lang: LanguageCode;
  literacyLevel: LiteracyLevel;
}

export const BankingModule: React.FC<BankingModuleProps> = ({
  profile,
  lang,
}) => {
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);
  const [activeTab, setActiveTab] = useState<'passbook' | 'schemes' | 'safety'>('passbook');

  const s = UI_STRINGS[lang] || UI_STRINGS.hi;
  const schemes = useMemo(() => getLocalizedSchemes(lang), [lang]);

  return (
    <div className="space-y-6">
      {/* Header Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveTab('passbook')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all duration-200 ${
            activeTab === 'passbook'
              ? 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] font-extrabold'
              : 'bg-slate-900/80 text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>{s.passbookTitle}</span>
        </button>

        <button
          onClick={() => setActiveTab('schemes')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all duration-200 ${
            activeTab === 'schemes'
              ? 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] font-extrabold'
              : 'bg-slate-900/80 text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{s.schemesTitle}</span>
        </button>

        <button
          onClick={() => setActiveTab('safety')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all duration-200 ${
            activeTab === 'safety'
              ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] font-extrabold'
              : 'bg-slate-900/80 text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>{s.safetyTitle}</span>
        </button>
      </div>

      {/* TAB 1: Visual Passbook */}
      {activeTab === 'passbook' && (
        <div className="space-y-5">
          {/* Bank Card / Account details - Luxury Holographic Debit Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c182c]/95 via-[#0f213c]/90 to-[#071324]/95 p-6 sm:p-7 border border-emerald-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="bg-white/10 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-white/10 text-slate-200">
                    {lang === 'en' ? 'PM Jan Dhan Scheme Account' : 'प्रधानमंत्री जन-धन योजना खाता'}
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-400/30 shadow-sm">
                    <CheckCircle className="w-3 h-3 text-emerald-400" /> {lang === 'en' ? 'Aadhaar DBT Active' : 'आधार DBT लिंक'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Bank of Maharashtra (Rampur Branch)' : 'बैंक ऑफ महाराष्ट्र (शाखा: रामपुर)'}
                </h3>
                <div className="flex items-center gap-2 my-1">
                  <div className="w-8 h-6 bg-gradient-to-r from-amber-400 to-amber-200 rounded-md border border-amber-500/40 opacity-90 shadow-sm" />
                  <p className="text-xs text-slate-400 font-mono tracking-wider">
                    {lang === 'en' ? 'A/C: ' : 'खाता: '} 6048 •••• •••• 3921
                  </p>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  {lang === 'en' ? 'Account Holder: ' : 'खाताधारक: '} <strong className="text-white">{profile.name}</strong>
                </p>
              </div>

              <div className="bg-white/[0.06] backdrop-blur-md rounded-2xl p-5 sm:text-right border border-white/10 shadow-inner">
                <span className="text-xs text-slate-400 font-medium">{s.currentBalance}</span>
                <h2 className="text-3xl sm:text-4xl font-black mt-0.5 tracking-tight text-emerald-400 font-mono drop-shadow-[0_0_12px_rgba(16,185,129,0.35)]">
                  ₹{profile.walletBalance.toLocaleString('en-IN')}
                </h2>
                <div className="mt-2.5">
                  <AudioButton
                    textToSpeak={`${s.currentBalance}: ₹${profile.walletBalance}`}
                    lang={lang}
                    size="sm"
                    className="bg-white/10 text-white border-white/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Simplified Pictorial Passbook Entries */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 p-6 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">
                {s.passbookTitle}
              </h3>
              <span className="text-xs text-emerald-300 font-bold bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                {lang === 'en' ? 'Verified Bank Records' : 'सत्यापित बैंक प्रविष्टि'}
              </span>
            </div>

            <div className="divide-y divide-white/[0.06]">
              {[
                {
                  id: 'bk-1',
                  date: lang === 'en' ? '10 Nov 2026' : '10 नवम्बर 2026',
                  title: lang === 'en' ? 'Dairy Cooperative Direct Deposit (DBT)' : 'दूध समिति सीधी बैंक जमा (DBT)',
                  type: 'in',
                  amount: 850,
                  icon: '🥛',
                  balanceAfter: 2450
                },
                {
                  id: 'bk-2',
                  date: lang === 'en' ? '04 Nov 2026' : '04 नवम्बर 2026',
                  title: lang === 'en' ? 'Micro-ATM Biometric Withdrawal' : 'राशन डीलर बायोमेट्रिक निकासी (Micro-ATM)',
                  type: 'out',
                  amount: 500,
                  icon: '🌾',
                  balanceAfter: 1600
                },
                {
                  id: 'bk-3',
                  date: lang === 'en' ? '28 Oct 2026' : '28 अक्टूबर 2026',
                  title: lang === 'en' ? 'Women Empowerment Subsidy (DBT)' : 'लाडली बहना सम्मान किस्त (DBT)',
                  type: 'in',
                  amount: 1250,
                  icon: '🏛️',
                  balanceAfter: 2100
                },
                {
                  id: 'bk-4',
                  date: lang === 'en' ? '15 Oct 2026' : '15 अक्टूबर 2026',
                  title: lang === 'en' ? 'Annual Insurance Premium (PMSBY)' : 'वार्षिक प्रधानमंत्री सुरक्षा बीमा (PMSBY)',
                  type: 'out',
                  amount: 20,
                  icon: '☂️',
                  balanceAfter: 850
                }
              ].map((entry) => (
                <div
                  key={entry.id}
                  className="py-3.5 flex items-center justify-between hover:bg-white/[0.04] px-2.5 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl p-2.5 bg-white/[0.06] rounded-xl border border-white/10 shadow-inner">
                      {entry.icon}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-100">
                        {entry.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {entry.date} • {lang === 'en' ? 'Balance: ' : 'शेष: '} <span className="font-mono text-slate-300">₹{entry.balanceAfter}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-bold font-mono ${
                        entry.type === 'in' ? 'text-emerald-400' : 'text-slate-300'
                      }`}
                    >
                      {entry.type === 'in' ? '+' : '-'}₹{entry.amount}
                    </span>
                    <AudioButton
                      textToSpeak={`${entry.title}: ${entry.amount} rupees`}
                      lang={lang}
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Government Schemes */}
      {activeTab === 'schemes' && (
        <div className="space-y-4">
          <div className="bg-white/[0.04] p-4.5 rounded-2xl border border-white/10 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">
                {lang === 'en' ? 'Verified Government Schemes for Your Profile' : 'आपकी प्रोफाइल अनुसार सत्यापित सरकारी योजनाएं'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'en' ? 'Special opportunities for rural women entrepreneurs and girl children' : 'विशेष रूप से ग्रामीण महिला उद्यमियों और बालिकाओं के लिए भारत सरकार के कार्यक्रम'}
              </p>
            </div>
            <AudioButton
              textToSpeak={lang === 'en' ? 'Here are verified government schemes including Mudra Loans and Sukanya Samriddhi.' : 'यहाँ भारत सरकार की प्रमाणित योजनाएं हैं जैसे मुद्रा शिशु लोन और सुकन्या समृद्धि।'}
              lang={lang}
              size="sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schemes.map((scheme) => (
              <div
                key={scheme.id}
                onClick={() => setSelectedScheme(scheme)}
                className="group relative overflow-hidden rounded-2xl bg-slate-900/80 p-5 border border-white/[0.08] hover:border-emerald-500/40 shadow-[0_6px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_35px_rgba(16,185,129,0.15)] transition-all duration-300 cursor-pointer flex flex-col justify-between backdrop-blur-md hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 bg-white/[0.06] rounded-xl border border-white/10 shadow-inner group-hover:scale-105 transition-transform">
                        {scheme.icon}
                      </span>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {scheme.hindiName}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {scheme.ministry}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-medium my-3 leading-relaxed">
                    {scheme.tagline}
                  </p>

                  <div className="bg-white/[0.04] p-3 rounded-xl border border-white/10 text-xs text-slate-200 flex justify-between font-semibold">
                    <span>{lang === 'en' ? 'Benefit: ' : 'प्राप्य लाभ:'}</span>
                    <span className="text-emerald-400 font-bold font-mono">{scheme.benefitAmount}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                    {lang === 'en' ? 'View Application Process →' : 'आवेदन प्रक्रिया देखें →'}
                  </span>
                  <AudioButton
                    textToSpeak={scheme.audioExplanation}
                    lang={lang}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Cyber Fraud & Safety */}
      {activeTab === 'safety' && (
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-950 p-6 sm:p-7 shadow-[0_10px_35px_rgba(244,63,94,0.2)] border border-rose-500/30 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-13 h-13 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-3xl flex-shrink-0 animate-pulse">
                  🚨
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{lang === 'en' ? 'National Cyber Helpline 1930' : '1930 राष्ट्रीय साइबर हेल्पलाइन'}</h3>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    {lang === 'en' ? 'If fraudulent deductions happen, call 1930 immediately to freeze unauthorized transactions.' : 'यदि किसी ने धोखे से पैसे निकाल लिए हों, तो तुरंत 1930 पर कॉल करें।'}
                  </p>
                </div>
              </div>

              <a
                href="tel:1930"
                className="px-5 py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.4)] whitespace-nowrap active:scale-95 transition-all"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <span>{s.helplineBtn}</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/10 shadow-[0_6px_20px_rgba(0,0,0,0.3)]">
              <span className="text-2xl">🔑</span>
              <h4 className="text-sm font-bold text-white mt-2">
                {lang === 'en' ? '1. Keep OTP & PIN Secret' : '1. OTP और पिन गुप्त रखें'}
              </h4>
              <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                {lang === 'en' ? 'This is the key to your bank vault. Never share it with anyone over the phone.' : 'यह आपके खाते की चाबी है। बैंक का अधिकारी भी आपसे OTP नहीं मांगता।'}
              </p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/10 shadow-[0_6px_20px_rgba(0,0,0,0.3)]">
              <span className="text-2xl">🔗</span>
              <h4 className="text-sm font-bold text-white mt-2">
                {lang === 'en' ? '2. Beware of Unknown Links' : '2. अनजान लिंक पर क्लिक न करें'}
              </h4>
              <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                {lang === 'en' ? 'Do not click on lottery or free gift links sent via WhatsApp or SMS.' : 'मुफ्त मोबाइल या लॉटरी जैसे संदेशों पर क्लिक करने से बैंक का पैसा चोरी हो सकता है।'}
              </p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/10 shadow-[0_6px_20px_rgba(0,0,0,0.3)]">
              <span className="text-2xl">👍</span>
              <h4 className="text-sm font-bold text-white mt-2">
                {lang === 'en' ? '3. Biometrics at Certified Counters' : '3. अंगूठा केवल बैंक मित्र पर'}
              </h4>
              <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                {lang === 'en' ? 'Only use biometrics at authorized kiosks and always verify the printed transaction slip.' : 'Micro-ATM पर निकासी के समय रसीद अवश्य लें और SMS की जांच करें।'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#0c1424] to-[#080d18] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-white/15 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 text-slate-100">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 bg-white/[0.08] rounded-xl border border-white/10">
                  {selectedScheme.icon}
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedScheme.hindiName}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {selectedScheme.ministry}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-3">
              <AudioButton
                textToSpeak={selectedScheme.audioExplanation}
                lang={lang}
                label={s.listenAudio}
                size="md"
              />
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-white/[0.04] p-4 rounded-xl border border-white/10">
                <h4 className="font-bold text-white mb-1">🎯 {lang === 'en' ? 'What Benefit You Receive:' : 'क्या लाभ मिलता है:'}</h4>
                <p className="text-emerald-400 font-bold font-mono text-base">{selectedScheme.benefitAmount}</p>
                <p className="text-slate-300 text-xs mt-0.5">{selectedScheme.tagline}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-200 mb-1.5">📑 {lang === 'en' ? 'Required Documents:' : 'जरूरी दस्तावेज:'}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedScheme.documentsRequired.map((doc, idx) => (
                    <span
                      key={idx}
                      className="bg-white/[0.06] text-slate-200 px-3 py-1 rounded-lg text-xs font-medium border border-white/10"
                    >
                      ✓ {doc}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-200 mb-1.5">🚶 {lang === 'en' ? 'How to Apply:' : 'आवेदन कैसे करें:'}</h4>
                <div className="space-y-2">
                  {selectedScheme.applySteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-slate-300 text-xs">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedScheme(null)}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-bold shadow-md"
              >
                {lang === 'en' ? 'Understood, Thank You' : 'समझ आ गया, धन्यवाद'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
