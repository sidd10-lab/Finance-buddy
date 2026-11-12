import React, { useState } from 'react';
import { Landmark, ShieldAlert, CheckCircle, FileText, PhoneCall, X } from 'lucide-react';
import { GovernmentScheme, LanguageCode, LiteracyLevel, UserProfile } from '../types';
import { governmentSchemes } from '../data/mockData';
import { AudioButton } from './AudioButton';

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

  return (
    <div className="space-y-6">
      {/* Header Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveTab('passbook')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'passbook'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>सरल डिजिटल पासबुक (Passbook)</span>
        </button>

        <button
          onClick={() => setActiveTab('schemes')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'schemes'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>सरकारी योजना व सब्सिडी (Schemes)</span>
        </button>

        <button
          onClick={() => setActiveTab('safety')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'safety'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>ठगी व फ्रॉड से सुरक्षा (Safety)</span>
        </button>
      </div>

      {/* TAB 1: Visual Passbook */}
      {activeTab === 'passbook' && (
        <div className="space-y-5">
          {/* Bank Card / Account details */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-card border border-slate-800 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-white/10 text-xs font-semibold px-2 py-0.5 rounded-full border border-white/10">
                    प्रधानमंत्री जन-धन योजना खाता
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/30">
                    <CheckCircle className="w-3 h-3" /> आधार DBT लिंक
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  बैंक ऑफ महाराष्ट्र (शाखा: रामपुर)
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  खाता संख्या: 6048 •••• •••• 3921
                </p>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  खाताधारक: {profile.name}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:text-right border border-white/10">
                <span className="text-xs text-slate-400 font-medium">उपलब्ध कुल बैंक बैलेंस</span>
                <h2 className="text-3xl sm:text-4xl font-black mt-0.5 tracking-tight text-emerald-400">
                  ₹{profile.walletBalance.toLocaleString('en-IN')}
                </h2>
                <div className="mt-2">
                  <AudioButton
                    textToSpeak={`आपके बैंक जन धन खाते में कुल दो हजार चार सौ पचास रुपये उपलब्ध हैं। आपका आधार और सरकारी डीबीटी लिंक है।`}
                    lang={lang}
                    size="sm"
                    className="bg-white/10 text-white border-white/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Simplified Pictorial Passbook Entries */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                पासबुक विवरण (Account Statement)
              </h3>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                सत्यापित बैंक प्रविष्टि
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {[
                {
                  id: 'bk-1',
                  date: '10 नवम्बर 2026',
                  title: 'दूध समिति सीधी बैंक जमा (DBT)',
                  type: 'in',
                  amount: 850,
                  icon: '🥛',
                  balanceAfter: 2450
                },
                {
                  id: 'bk-2',
                  date: '04 नवम्बर 2026',
                  title: 'राशन डीलर बायोमेट्रिक निकासी (Micro-ATM)',
                  type: 'out',
                  amount: 500,
                  icon: '🌾',
                  balanceAfter: 1600
                },
                {
                  id: 'bk-3',
                  date: '28 अक्टूबर 2026',
                  title: 'लाडली बहना सम्मान किस्त (DBT)',
                  type: 'in',
                  amount: 1250,
                  icon: '🏛️',
                  balanceAfter: 2100
                },
                {
                  id: 'bk-4',
                  date: '15 अक्टूबर 2026',
                  title: 'वार्षिक प्रधानमंत्री सुरक्षा बीमा (PMSBY)',
                  type: 'out',
                  amount: 20,
                  icon: '☂️',
                  balanceAfter: 850
                }
              ].map((entry) => (
                <div
                  key={entry.id}
                  className="py-3.5 flex items-center justify-between hover:bg-slate-50/60 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl p-2 bg-slate-100 rounded-xl">
                      {entry.icon}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900">
                        {entry.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {entry.date} • शेष: ₹{entry.balanceAfter}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-bold ${
                        entry.type === 'in' ? 'text-emerald-600' : 'text-slate-800'
                      }`}
                    >
                      {entry.type === 'in' ? '+' : '-'}₹{entry.amount}
                    </span>
                    <AudioButton
                      textToSpeak={`${entry.title}: ${entry.type === 'in' ? 'जमा हुए' : 'निकाले गए'} ${entry.amount} रुपये। शेष बैलेंस ${entry.balanceAfter} रुपये।`}
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
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                आपकी प्रोफाइल अनुसार सत्यापित सरकारी योजनाएं
              </h3>
              <p className="text-xs text-slate-500">
                विशेष रूप से ग्रामीण महिला उद्यमियों और बालिकाओं के लिए भारत सरकार के कार्यक्रम
              </p>
            </div>
            <AudioButton
              textToSpeak="यहाँ भारत सरकार की प्रमाणित योजनाएं हैं जैसे मुद्रा शिशु लोन और सुकन्या समृद्धि।"
              lang={lang}
              size="sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {governmentSchemes.map((scheme) => (
              <div
                key={scheme.id}
                onClick={() => setSelectedScheme(scheme)}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-slate-300 shadow-soft hover:shadow-card transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 bg-slate-100 rounded-xl">
                        {scheme.icon}
                      </span>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900">
                          {scheme.hindiName}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {scheme.ministry}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 font-medium my-3 leading-relaxed">
                    {scheme.tagline}
                  </p>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-xs text-slate-700 flex justify-between font-semibold">
                    <span>प्राप्य लाभ:</span>
                    <span className="text-emerald-700 font-bold">{scheme.benefitAmount}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">
                    आवेदन प्रक्रिया देखें →
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
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-card border border-slate-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-2xl flex-shrink-0">
                  🚨
                </div>
                <div>
                  <h3 className="text-lg font-bold">1930 राष्ट्रीय साइबर हेल्पलाइन</h3>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    यदि किसी ने धोखे से पैसे निकाल लिए हों, तो तुरंत 1930 पर कॉल करें। तुरंत शिकायत करने पर बैंक संदिग्ध लेन-देन रोक लेता है।
                  </p>
                </div>
              </div>

              <a
                href="tel:1930"
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs whitespace-nowrap active:scale-95 transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>1930 पर कॉल करें</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
              <span className="text-2xl">🔑</span>
              <h4 className="text-sm font-bold text-slate-900 mt-2">
                1. OTP और पिन गुप्त रखें
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                यह आपके खाते की चाबी है। बैंक का अधिकारी या स्वयं सहायता समूह की दीदी भी आपसे OTP नहीं मांग सकती।
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
              <span className="text-2xl">🔗</span>
              <h4 className="text-sm font-bold text-slate-900 mt-2">
                2. अनजान लिंक पर क्लिक न करें
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                'मुफ्त मोबाइल' या 'सरकारी लॉटरी' जैसे संदेशों पर क्लिक करने से बैंक का पैसा चोरी हो सकता है।
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
              <span className="text-2xl">👍</span>
              <h4 className="text-sm font-bold text-slate-900 mt-2">
                3. अंगूठा केवल बैंक मित्र पर
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                Micro-ATM पर बायोमेट्रिक निकासी के समय रसीद (Receipt) अवश्य लें और SMS की जांच करें।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-elevated border border-slate-200 max-h-[85vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 bg-slate-100 rounded-xl">
                  {selectedScheme.icon}
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedScheme.hindiName}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {selectedScheme.ministry}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="my-3">
              <AudioButton
                textToSpeak={selectedScheme.audioExplanation}
                lang={lang}
                label="योजना का विवरण सुनें"
                size="md"
              />
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">🎯 क्या लाभ मिलता है:</h4>
                <p className="text-emerald-700 font-bold">{selectedScheme.benefitAmount}</p>
                <p className="text-slate-500 text-xs mt-0.5">{selectedScheme.tagline}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1.5">📑 जरूरी दस्तावेज:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedScheme.documentsRequired.map((doc, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium"
                    >
                      ✓ {doc}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1.5">🚶 आवेदन कैसे करें:</h4>
                <div className="space-y-1.5">
                  {selectedScheme.applySteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-700 text-xs">
                      <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedScheme(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                समझ आ गया, धन्यवाद
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
