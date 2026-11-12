import React, { useState } from 'react';
import { Landmark, ShieldAlert, CheckCircle, FileText, ExternalLink, HelpCircle, PhoneCall } from 'lucide-react';
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
  literacyLevel
}) => {
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);
  const [activeTab, setActiveTab] = useState<'passbook' | 'schemes' | 'safety'>('passbook');

  return (
    <div className="space-y-6">
      {/* Header Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveTab('passbook')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'passbook'
              ? 'bg-peacock-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>सरल डिजिटल पासबुक (Passbook)</span>
        </button>

        <button
          onClick={() => setActiveTab('schemes')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'schemes'
              ? 'bg-peacock-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>सरकारी योजना व सब्सिडी (Schemes)</span>
        </button>

        <button
          onClick={() => setActiveTab('safety')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'safety'
              ? 'bg-peacock-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-300" />
          <span>ठगी व फ्रॉड से सुरक्षा (Safety)</span>
        </button>
      </div>

      {/* TAB 1: Visual Passbook */}
      {activeTab === 'passbook' && (
        <div className="space-y-5">
          {/* Bank Card / Account details */}
          <div className="bg-gradient-to-br from-peacock-600 via-teal-700 to-peacock-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-white/20 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    प्रधानमंत्री जन-धन खाता
                  </span>
                  <span className="bg-emerald-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> DBT चालू
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  बैंक ऑफ महाराष्ट्र (शाखा: रामपुर)
                </h3>
                <p className="text-xs text-teal-200 font-mono mt-1">
                  खाता संख्या: 6048 •••• •••• 3921
                </p>
                <p className="text-xs text-teal-100 font-medium mt-0.5">
                  खाताधारक: {profile.name}
                </p>
              </div>

              <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 sm:text-right border border-white/10">
                <span className="text-xs text-teal-200 font-semibold">उपलब्ध कुल बैंक बैलेंस</span>
                <h2 className="text-3xl sm:text-4xl font-black mt-0.5">
                  ₹{profile.walletBalance.toLocaleString('en-IN')}
                </h2>
                <div className="mt-2">
                  <AudioButton
                    textToSpeak={`आपके बैंक जन धन खाते में कुल दो हजार चार सौ पचास रुपये उपलब्ध हैं। आपका आधार और सरकारी डीबीटी लिंक है।`}
                    lang={lang}
                    size="sm"
                    className="bg-white/20 text-white border-white/30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Simplified Pictorial Passbook Entries */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                पासबुक विवरण (खाता विवरण)
              </h3>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                आधिकारिक बैंक रिकॉर्ड
              </span>
            </div>

            <div className="space-y-3">
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
                  title: 'लाडली बहना / सरकारी महिला सम्मान किस्त (DBT)',
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
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 hover:bg-slate-100/70 border border-slate-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 bg-white rounded-xl shadow-xs border border-slate-200">
                      {entry.icon}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {entry.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {entry.date} • शेष राशि: ₹{entry.balanceAfter}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-base font-black ${
                        entry.type === 'in' ? 'text-emerald-600' : 'text-slate-700'
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
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-amber-950">
                आपकी पात्रता अनुसार सत्यापित योजनाएं
              </h3>
              <p className="text-xs text-amber-900">
                ये योजनाएं विशेष रूप से ग्रामीण महिला उद्यमियों और बालिकाओं के लिए हैं
              </p>
            </div>
            <AudioButton
              textToSpeak="यहाँ भारत सरकार की प्रमाणित योजनाएं हैं जैसे मुद्रा शिशु लोन और सुकन्या समृद्धि। कार्ड पर क्लिक करके आवेदन का तरीका जानें।"
              lang={lang}
              size="sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {governmentSchemes.map((scheme) => (
              <div
                key={scheme.id}
                onClick={() => setSelectedScheme(scheme)}
                className="bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-peacock-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 bg-peacock-50 rounded-2xl border border-peacock-200">
                        {scheme.icon}
                      </span>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">
                          {scheme.hindiName}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {scheme.ministry}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 font-medium my-3 leading-relaxed">
                    {scheme.tagline}
                  </p>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 flex justify-between font-semibold">
                    <span>प्राप्य लाभ:</span>
                    <span className="text-peacock-700 font-bold">{scheme.benefitAmount}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-peacock-700">
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
          {/* Emergency Alert Callout */}
          <div className="bg-rose-600 text-white rounded-3xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl flex-shrink-0">
                  🚨
                </div>
                <div>
                  <h3 className="text-xl font-bold">1930 राष्ट्रीय साइबर हेल्पलाइन</h3>
                  <p className="text-xs sm:text-sm text-rose-100 font-medium mt-0.5">
                    यदि किसी ने धोखे से पैसे निकाल लिए हों, तो तुरंत 1930 पर कॉल करें। 2 घंटे में शिकायत होने पर बैंक पैसा वापस रोक लेता है।
                  </p>
                </div>
              </div>

              <a
                href="tel:1930"
                className="px-5 py-3 bg-white text-rose-700 rounded-2xl font-black text-sm flex items-center gap-2 shadow-md hover:bg-rose-50 active:scale-95 transition-all whitespace-nowrap"
              >
                <PhoneCall className="w-4 h-4 text-rose-600" />
                <span>1930 पर कॉल लगाएं</span>
              </a>
            </div>
          </div>

          {/* Interactive Defense Rule Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border-2 border-rose-200">
              <span className="text-3xl">🔑</span>
              <h4 className="text-base font-bold text-slate-900 mt-2">
                1. OTP और पिन गुप्त रखें
              </h4>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                यह आपके घर की चाबी है। बैंक का अधिकारी या स्वयं सहायता समूह की दीदी भी आपसे OTP नहीं पूछ सकती।
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-rose-200">
              <span className="text-3xl">🔗</span>
              <h4 className="text-base font-bold text-slate-900 mt-2">
                2. अनजान लिंक पर क्लिक न करें
              </h4>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                'मुफ्त मोबाइल मिला' या 'लॉटरी लगी' जैसे व्हाट्सएप संदेशों पर क्लिक करने से बैंक का सारा पैसा कट सकता है।
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-rose-200">
              <span className="text-3xl">👍</span>
              <h4 className="text-base font-bold text-slate-900 mt-2">
                3. अंगूठा केवल बैंक मित्र पर
              </h4>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                Micro-ATM पर अंगूठा लगाते समय पर्ची (Receipt) जरूर लें और अपने फोन पर आए SMS की जांच करें।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border-4 border-peacock-300 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-peacock-50 rounded-xl">
                  {selectedScheme.icon}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedScheme.hindiName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedScheme.ministry}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="my-4">
              <AudioButton
                textToSpeak={selectedScheme.audioExplanation}
                lang={lang}
                label="योजना का विवरण सुनें"
                size="md"
              />
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-peacock-50/70 p-3.5 rounded-2xl border border-peacock-200">
                <h4 className="font-bold text-peacock-900 mb-1">🎯 क्या लाभ मिलता है:</h4>
                <p className="text-slate-800 font-semibold">{selectedScheme.benefitAmount}</p>
                <p className="text-slate-600 text-xs mt-0.5">{selectedScheme.tagline}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1.5">📑 जरूरी दस्तावेज:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedScheme.documentsRequired.map((doc, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold"
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
                    <div key={idx} className="flex items-start gap-2 text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-peacock-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedScheme(null)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
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
