import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Sparkles, X } from 'lucide-react';
import { UserProfile, LanguageCode } from '../types';
import { AIAdvisorService } from '../services/aiAdvisorService';
import { speechService } from '../services/speechService';
import { AudioButton } from './AudioButton';

interface Message {
  id: string;
  sender: 'user' | 'saheli';
  text: string;
  audioText: string;
  timestamp: string;
  actionableStep?: string;
}

interface SaheliVoiceChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  lang: LanguageCode;
}

export const SaheliVoiceChatModal: React.FC<SaheliVoiceChatModalProps> = ({
  isOpen,
  onClose,
  profile,
  lang
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-0',
      sender: 'saheli',
      text: `नमस्ते ${profile.name} दीदी! मैं आपकी डिजिटल सखी AI हूँ। आप मुझसे बजट बनाने, साहूकार के भारी ब्याज से बचने, सुकन्या योजना, या ₹10 से सोना खरीदने के बारे में बोलकर या लिखकर कभी भी पूछ सकती हैं।`,
      audioText: `नमस्ते ${profile.name} दीदी! मैं आपकी सखी AI हूँ। आप मुझसे बजट, सरकारी योजना या कम ब्याज के लोन के बारे में कुछ भी पूछ सकती हैं।`,
      timestamp: 'अभी'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [micRecognizer, setMicRecognizer] = useState<{ stop: () => void } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    { label: 'साहूकार बनाम बैंक लोन', query: 'साहूकार और बैंक लोन में क्या अंतर है?' },
    { label: 'बेटी के लिए सुकन्या खाता', query: 'बेटी के लिए सुकन्या समृद्धि योजना क्या है?' },
    { label: '₹10 से बचत कैसे शुरू करें?', query: 'कम आमदनी में बचत कैसे शुरू करें?' },
    { label: 'OTP धोखाधड़ी से सुरक्षा', query: 'फोन पर कोई OTP मांगे तो क्या करें?' },
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: Message = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: text,
      audioText: text,
      timestamp: 'अभी'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Query AI Advisor
    setTimeout(() => {
      const advice = AIAdvisorService.getFinancialAdvice(text, lang, profile);
      const saheliMsg: Message = {
        id: 's-' + Date.now(),
        sender: 'saheli',
        text: advice.answer,
        audioText: advice.hindiAnswer || advice.answer,
        timestamp: 'अभी',
        actionableStep: advice.actionableStep
      };
      setMessages(prev => [...prev, saheliMsg]);

      // Speak response warmly
      speechService.speak(advice.hindiAnswer || advice.answer, lang);
    }, 400);
  };

  const toggleMic = () => {
    if (isListening) {
      if (micRecognizer) micRecognizer.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      const rec = speechService.startListening(
        lang,
        (transcript) => {
          setIsListening(false);
          handleSendMessage(transcript);
        },
        (error) => {
          setIsListening(false);
          alert(`माइक त्रुटि: ${error}`);
        },
        () => {
          setIsListening(false);
        }
      );
      setMicRecognizer(rec);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-gradient-to-b from-[#0c1424] to-[#070b14] rounded-3xl max-w-lg w-full h-[85vh] flex flex-col shadow-2xl border border-white/15 overflow-hidden animate-in zoom-in-95 text-slate-100">
        {/* Modal Header */}
        <div className="bg-slate-900/90 p-4 text-white flex items-center justify-between border-b border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-amber-500/20 border border-emerald-400/40 flex items-center justify-center text-xl shadow-inner">
              🧕
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold flex items-center gap-1.5">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-emerald-200">सखी AI (Saheli AI Mitra)</span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                आपकी व्यक्तिगत वित्तीय मार्गदर्शिका
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              speechService.stop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white font-bold transition-all border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-white/[0.03] p-2.5 border-b border-white/[0.08] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q.query)}
              className="bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/10 hover:border-emerald-400/40 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap active:scale-95 transition-all"
            >
              💬 {q.label}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#070b14]/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'saheli' && (
                <div className="w-7 h-7 rounded-xl bg-slate-800 border border-white/10 text-white flex items-center justify-center text-xs flex-shrink-0 mt-1 shadow-inner">
                  🧕
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-xs shadow-md font-medium'
                    : 'bg-white/[0.06] text-slate-100 border border-white/10 rounded-bl-xs shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                }`}
              >
                <p>{msg.text}</p>

                {msg.actionableStep && (
                  <div className="mt-2.5 pt-2 border-t border-white/10 text-emerald-300 font-bold bg-emerald-500/10 p-2.5 rounded-xl text-[11px] flex items-center gap-1.5 border border-emerald-400/20">
                    <span className="text-amber-300">👉 कदम:</span>
                    <span>{msg.actionableStep}</span>
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'saheli' && (
                    <AudioButton
                      textToSpeak={msg.audioText}
                      lang={lang}
                      size="sm"
                      label="सुनें"
                    />
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-slate-700/60 border border-white/10 flex items-center justify-center text-xs flex-shrink-0 mt-1">
                  👩‍🌾
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900/90 border-t border-white/10 flex items-center gap-2">
          {/* Voice Input Button */}
          <button
            onClick={toggleMic}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white ring-4 ring-rose-500/30 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                : 'bg-white/[0.08] hover:bg-white/[0.15] text-emerald-400 border border-white/10'
            }`}
            title="बोलकर पूछें"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isListening ? 'बोलिए, सखी सुन रही है...' : 'सवाल लिखें या माइक दबाएं...'}
            className="flex-1 px-3.5 py-2.5 bg-white/[0.05] border border-white/10 focus:border-emerald-400 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
          />

          <button
            onClick={() => handleSendMessage()}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold flex items-center justify-center flex-shrink-0 shadow-md active:scale-95 transition-all"
          >
            <Send className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
};
