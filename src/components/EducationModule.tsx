import React, { useState } from 'react';
import { CheckCircle2, Play, Award, Sparkles, HelpCircle, ArrowRight, BookOpen, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { EducationLesson, LanguageCode, LiteracyLevel } from '../types';
import { AudioButton } from './AudioButton';
import { speechService } from '../services/speechService';

interface EducationModuleProps {
  lessons: EducationLesson[];
  onCompleteLesson: (lessonId: string) => void;
  lang: LanguageCode;
  literacyLevel: LiteracyLevel;
}

export const EducationModule: React.FC<EducationModuleProps> = ({
  lessons,
  onCompleteLesson,
  lang,
  literacyLevel
}) => {
  const [selectedLesson, setSelectedLesson] = useState<EducationLesson | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'सभी पाठ (All)', icon: '📚' },
    { id: 'basics', label: 'बैंक बचत', icon: '🏦' },
    { id: 'debt_freedom', label: 'साहूकार से मुक्ति', icon: '⛓️' },
    { id: 'shg', label: 'SHG समूह शक्ति', icon: '🤝' },
    { id: 'cyber_safety', label: 'डिजिटल सुरक्षा', icon: '🔒' },
  ];

  const filteredLessons = activeCategory === 'all'
    ? lessons
    : lessons.filter(l => l.category === activeCategory);

  const completedCount = lessons.filter(l => l.completed).length;

  const handleOpenLesson = (lesson: EducationLesson) => {
    setSelectedLesson(lesson);
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleQuizSubmit = () => {
    if (quizAnswer === null || !selectedLesson) return;
    setQuizSubmitted(true);

    if (quizAnswer === selectedLesson.quizQuestion.correctIndex) {
      speechService.playSuccessSound();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      onCompleteLesson(selectedLesson.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Progress card */}
      <div className="bg-gradient-to-br from-amber-500 via-saffron-500 to-amber-600 rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-15 translate-x-6 translate-y-6">
          <BookOpen className="w-56 h-56" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              ज्ञान ही समृद्धि है
            </span>
            <AudioButton
              textToSpeak="ज्ञान ही समृद्धि है। यहाँ सरल कहानियों से समझें कि बैंक में पैसे कैसे बढ़ते हैं और साहूकार के भारी ब्याज से कैसे बचा जाता है।"
              lang={lang}
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            सरल आर्थिक ज्ञान केंद्र (Seekho Aur Badho)
          </h2>
          <p className="text-amber-100 text-sm sm:text-base leading-relaxed mb-4">
            छोटी-छोटी कहानियों के माध्यम से सीखें कि कैसे अपने पसीने की कमाई को सुरक्षित रखें, सरकारी सहायता पाएं और अपने परिवार को आत्मनिर्भर बनाएं।
          </p>

          {/* Progress Indicator */}
          <div className="bg-black/15 backdrop-blur-md rounded-2xl p-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-300 text-amber-950 font-black flex items-center justify-center text-lg shadow">
                {completedCount}/{lessons.length}
              </div>
              <div>
                <p className="text-xs text-amber-100 font-semibold">आपके पूरे किए गए पाठ</p>
                <p className="text-sm font-bold">
                  {completedCount === lessons.length ? '🎉 सारे पाठ पूरे हुए! आप लखपति दीदी बनने की राह पर हैं।' : 'हर पाठ पर मिलता है नया सखी सम्मान बैज!'}
                </p>
              </div>
            </div>
            <Award className="w-8 h-8 text-amber-200" />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLessons.map((lesson) => {
          return (
            <div
              key={lesson.id}
              onClick={() => handleOpenLesson(lesson)}
              className="bg-white rounded-2xl p-5 border-2 border-amber-100 hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    {lesson.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {lesson.completed && (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" /> पूर्ण
                      </span>
                    )}
                    <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-1 rounded-full">
                      ⏱️ {lesson.duration}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors mb-1">
                  {lesson.hindiTitle}
                </h3>
                <p className="text-xs text-slate-500 font-medium mb-3">
                  {lesson.title}
                </p>

                {/* Content preview based on literacy level */}
                {literacyLevel === 'visual' ? (
                  <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-100 text-xs text-amber-900 font-medium mb-4 flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <span>कहानी सुनने और बैज जीतने के लिए कार्ड पर टैप करें।</span>
                  </div>
                ) : (
                  <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                    {lesson.storyNarrative}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  {lesson.rewardBadge}
                </span>
                <span className="text-amber-600 font-bold text-xs sm:text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  पाठ खोलें <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Lesson Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-amber-300 p-5 sm:p-7 relative animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-amber-100 rounded-2xl border border-amber-200">
                  {selectedLesson.icon}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedLesson.hindiTitle}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedLesson.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLesson(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            {/* Audio Readout Prompt */}
            <div className="my-4 bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-amber-600 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-amber-900">
                  पूरी कहानी और सीख आवाज़ में सुनें:
                </span>
              </div>
              <AudioButton
                textToSpeak={`${selectedLesson.hindiTitle}. ${selectedLesson.storyNarrative}. मुख्य बातें: ${selectedLesson.keyTakeaways.join('. ')}`}
                lang={lang}
                label="पूरी कहानी सुनें"
                size="md"
              />
            </div>

            {/* Story narrative */}
            <div className="space-y-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <span>📖</span> प्रेरक कहानी
                </h4>
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
                  {selectedLesson.storyNarrative}
                </p>
              </div>

              {/* Key takeaways */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <span>💡</span> 3 मुख्य बातें जो याद रखनी हैं
                </h4>
                <div className="space-y-2">
                  {selectedLesson.keyTakeaways.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-2.5 bg-amber-50/50 rounded-xl border border-amber-100"
                    >
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Micro-Quiz for reward */}
            <div className="bg-gradient-to-br from-amber-100/70 to-saffron-100/50 p-5 rounded-2xl border-2 border-amber-300">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-700" />
                  <span>सखी प्रश्नोत्तरी (Quiz) हल करें और बैज पाएं!</span>
                </h4>
                <AudioButton
                  textToSpeak={`${selectedLesson.quizQuestion.question}. विकल्प: ${selectedLesson.quizQuestion.options.join(', ')}`}
                  lang={lang}
                  label="प्रश्न सुनें"
                  size="sm"
                />
              </div>

              <p className="text-sm font-bold text-slate-900 mb-3">
                {selectedLesson.quizQuestion.question}
              </p>

              <div className="space-y-2 mb-4">
                {selectedLesson.quizQuestion.options.map((option, idx) => {
                  const isSelected = quizAnswer === idx;
                  const isCorrect = idx === selectedLesson.quizQuestion.correctIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => !quizSubmitted && setQuizAnswer(idx)}
                      disabled={quizSubmitted}
                      className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                        isSelected
                          ? quizSubmitted
                            ? isCorrect
                              ? 'bg-emerald-500 text-white border-emerald-600'
                              : 'bg-rose-500 text-white border-rose-600'
                            : 'bg-amber-500 text-white border-amber-600 shadow'
                          : 'bg-white text-slate-800 hover:bg-amber-50 border-slate-200'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={quizAnswer === null}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
                    quizAnswer !== null
                      ? 'bg-saffron-600 hover:bg-saffron-700 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  उत्तर जांचें व बैज जीतें 🏆
                </button>
              ) : (
                <div className="space-y-3">
                  {quizAnswer === selectedLesson.quizQuestion.correctIndex ? (
                    <div className="bg-emerald-100 border border-emerald-300 p-3 rounded-xl text-emerald-950 text-xs sm:text-sm font-bold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span>{selectedLesson.quizQuestion.explanation}</span>
                    </div>
                  ) : (
                    <div className="bg-rose-100 border border-rose-300 p-3 rounded-xl text-rose-950 text-xs sm:text-sm font-bold">
                      पुनः प्रयास करें! सही विकल्प था: {selectedLesson.quizQuestion.options[selectedLesson.quizQuestion.correctIndex]}
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedLesson(null)}
                    className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800"
                  >
                    पाठ बंद करें
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
