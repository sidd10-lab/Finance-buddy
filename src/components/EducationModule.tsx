import React, { useState } from 'react';
import { CheckCircle2, Award, Sparkles, HelpCircle, ArrowRight, BookOpen, Volume2, X } from 'lucide-react';
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
      {/* Top Banner / Hero Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
          <BookOpen className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              ज्ञान ही आत्मनिर्भरता है
            </span>
            <AudioButton
              textToSpeak="ज्ञान ही आत्मनिर्भरता है। यहाँ सरल कहानियों से समझें कि बैंक में पैसे कैसे बढ़ते हैं और साहूकार के भारी ब्याज से कैसे बचा जाता है।"
              lang={lang}
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            डिजिटल आर्थिक साक्षरता केंद्र
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">
            सरल कहानियों के माध्यम से अपनी मेहनत की कमाई को सुरक्षित रखने, मुद्रा लोन पाने और ब्याज के चक्रव्यूह से बचने के व्यावहारिक उपाय।
          </p>

          {/* Progress bar */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 flex items-center justify-between gap-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                {completedCount}/{lessons.length}
              </div>
              <div>
                <p className="text-xs text-slate-300 font-medium">पूरे किए गए मॉड्यूल</p>
                <p className="text-xs sm:text-sm font-semibold text-white">
                  {completedCount === lessons.length ? '🎉 सारे पाठ पूरे हुए! आप लखपति दीदी बनने की राह पर हैं।' : 'हर पाठ पर मिलता है आधिकारिक सखी सम्मान बैज'}
                </p>
              </div>
            </div>
            <Award className="w-6 h-6 text-amber-300 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50'
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
              className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-slate-300 shadow-soft hover:shadow-card transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    {lesson.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {lesson.completed && (
                      <span className="bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200/60">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> पूरा हुआ
                      </span>
                    )}
                    <span className="bg-slate-100 text-slate-500 text-[11px] font-medium px-2 py-0.5 rounded-full">
                      ⏱️ {lesson.duration}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-700 transition-colors mb-1 leading-snug">
                  {lesson.hindiTitle}
                </h3>
                <p className="text-xs text-slate-400 font-medium mb-3">
                  {lesson.title}
                </p>

                {literacyLevel === 'visual' ? (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-xs text-slate-600 font-medium mb-4 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span>कहानी सुनने और बैज प्राप्त करने के लिए कार्ड पर टैप करें।</span>
                  </div>
                ) : (
                  <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                    {lesson.storyNarrative}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {lesson.rewardBadge}
                </span>
                <span className="text-slate-900 font-semibold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  पाठ खोलें <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Lesson Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-elevated border border-slate-200 p-6 sm:p-7 relative animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 bg-slate-100 rounded-xl">
                  {selectedLesson.icon}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedLesson.hindiTitle}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {selectedLesson.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLesson(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Audio Readout Prompt */}
            <div className="my-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-semibold text-slate-800">
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
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  📖 प्रेरक वास्तविक कहानी
                </h4>
                <p className="text-slate-800 text-xs sm:text-sm leading-relaxed">
                  {selectedLesson.storyNarrative}
                </p>
              </div>

              {/* Key takeaways */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  💡 मुख्य निष्कर्ष
                </h4>
                <div className="space-y-2">
                  {selectedLesson.keyTakeaways.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200/60"
                    >
                      <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Micro-Quiz for reward */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4 text-slate-600" />
                  <span>सखी प्रश्नोत्तरी (Quiz)</span>
                </h4>
                <AudioButton
                  textToSpeak={`${selectedLesson.quizQuestion.question}. विकल्प: ${selectedLesson.quizQuestion.options.join(', ')}`}
                  lang={lang}
                  label="प्रश्न सुनें"
                  size="sm"
                />
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-3">
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
                      className={`w-full text-left p-3 rounded-xl text-xs font-medium transition-all border ${
                        isSelected
                          ? quizSubmitted
                            ? isCorrect
                              ? 'bg-emerald-600 text-white border-emerald-700'
                              : 'bg-rose-600 text-white border-rose-700'
                            : 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-800 hover:bg-slate-100/70 border-slate-200'
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
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-xs ${
                    quizAnswer !== null
                      ? 'bg-slate-900 hover:bg-slate-800 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  उत्तर जांचें व बैज जीतें 🏆
                </button>
              ) : (
                <div className="space-y-3">
                  {quizAnswer === selectedLesson.quizQuestion.correctIndex ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-950 text-xs font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{selectedLesson.quizQuestion.explanation}</span>
                    </div>
                  ) : (
                    <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-950 text-xs font-semibold">
                      पुनः प्रयास करें! सही विकल्प था: {selectedLesson.quizQuestion.options[selectedLesson.quizQuestion.correctIndex]}
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedLesson(null)}
                    className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
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
