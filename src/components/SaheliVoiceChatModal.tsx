import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Sparkles, Volume2, Bot, User, X } from 'lucide-react';
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
      text: `नमस्ते ${profile.name} दीदी! मैं आपकी डिजिटल सखी AI हूँ। आप मुझसे घर का बजट बनाने, साहूकार के भारी ब्याज से बचने, सुकन्या योजना, या ₹10 से सोना खरीदने के बारे में बोलकर या लिखकर कभी भी पूछ सकती हैं।`,
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

      // Automatically speak the response warm and clearly
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-lg w-full h-[85vh] flex flex-col shadow-2xl border-4 border-amber-300 overflow-hidden animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-saffron-500 via-amber-500 to-amber-600 p-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/30">
              🧕
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold flex items-center gap-1.5">
                <span>सखी AI (Saheli Mitra)</span>
                <Sparkles className="w-4 h-4 text-amber-200" />
              </h3>
              <p className="text-xs text-amber-100 font-medium">
                आपकी 24/7 व्यक्तिगत वित्तीय मार्गदर्शिका
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              speechService.stop();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-bold transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-amber-50/70 p-2.5 border-b border-amber-200/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q.query)}
              className="bg-white hover:bg-amber-100 text-amber-950 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shadow-2xs active:scale-95 transition-all"
            >
              💬 {q.label}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'saheli' && (
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm flex-shrink-0 mt-1 shadow-sm">
                  🧕
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-saffron-600 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-amber-200/80 rounded-bl-xs'
                }`}
              >
                <p>{msg.text}</p>

                {msg.actionableStep && (
                  <div className="mt-2.5 pt-2 border-t border-amber-100 text-amber-900 font-bold bg-amber-50/70 p-2 rounded-xl text-[11px] flex items-center gap-1">
                    <span>👉 अगला कदम:</span>
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
                      label="दोबारा सुनें"
                    />
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm flex-shrink-0 mt-1">
                  👩‍🌾
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          {/* Voice Input Button */}
          <button
            onClick={toggleMic}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 shadow-sm ${
              isListening
                ? 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
            }`}
            title="बोलकर पूछें"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isListening ? 'बोलिए, सखी सुन रही है...' : 'सवाल लिखें या माइक दबाएं...'}
            className="flex-1 px-4 py-2.5 border border-slate-300 focus:border-amber-500 rounded-2xl text-xs sm:text-sm focus:outline-none"
          />

          <button
            onClick={() => handleSendMessage()}
            className="w-11 h-11 rounded-2xl bg-saffron-600 hover:bg-saffron-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
