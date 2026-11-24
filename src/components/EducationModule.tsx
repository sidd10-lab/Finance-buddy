import React, { useState } from 'react';
import { CheckCircle2, Award, Sparkles, HelpCircle, ArrowRight, BookOpen, Volume2, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { EducationLesson, LanguageCode, LiteracyLevel } from '../types';
import { AudioButton } from './AudioButton';
import { speechService } from '../services/speechService';
import { UI_STRINGS } from '../services/translations';

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

  const s = UI_STRINGS[lang] || UI_STRINGS.hi;

  const categories = [
    { id: 'all', label: s.allLessons, icon: '📚' },
    { id: 'basics', label: s.catBasics, icon: '🏦' },
    { id: 'debt_freedom', label: s.catDebt, icon: '⛓️' },
    { id: 'shg', label: s.catShg, icon: '🤝' },
    { id: 'cyber_safety', label: s.catCyber, icon: '🔒' },
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
      {/* Top Banner / Bento Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#0d1627]/95 to-[#061814]/90 p-6 sm:p-8 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        {/* Ambient background glow inside card */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
          <BookOpen className="w-56 h-56 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2.5 mb-3 flex-wrap">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{s.eduHeroTag}</span>
            </span>
            <AudioButton
              textToSpeak={`${s.eduHeroTitle}. ${s.eduHeroDesc}`}
              lang={lang}
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2 leading-tight">
            {s.eduHeroTitle}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
            {s.eduHeroDesc}
          </p>

          {/* Progress bar pill */}
          <div className="bg-white/[0.06] backdrop-blur-md rounded-2xl p-4 flex items-center justify-between gap-4 border border-white/10 shadow-inner">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black flex items-center justify-center text-sm shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-emerald-300/40">
                {completedCount}/{lessons.length}
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">{s.modulesCompleted}</p>
                <p className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  {completedCount === lessons.length ? s.allCompletedMsg : s.badgePraise}
                </p>
              </div>
            </div>
            <Award className="w-7 h-7 text-amber-400 flex-shrink-0 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 ${
              activeCategory === cat.id
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] font-extrabold'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-white/10 hover:border-white/20 hover:bg-slate-800/80'
            }`}
          >
            <span className="text-sm">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Visual Learning Roadmap Graphic: Lakshmi Gyan Yatra */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900/90 via-[#0a1826]/90 to-slate-950 p-5 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {lang === 'en' ? 'Financial Mastery Roadmap (Gyan Yatra)' : 'सखी वित्तीय ज्ञान यात्रा (Roadmap)'}
            </h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-400/30 font-mono">
            LEVEL 1 • SHG SAKHI
          </span>
        </div>

        <div className="relative py-2">
          {/* Connecting Track Line */}
          <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-white/10 rounded-full">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full w-2/3 shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
          </div>

          <div className="relative z-10 grid grid-cols-4 gap-2 text-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-[0_0_15px_rgba(16,185,129,0.5)] border-2 border-emerald-300">
                ✓
              </div>
              <span className="text-[11px] font-bold text-white mt-2 leading-tight">
                {lang === 'en' ? 'Basic Banking' : 'बुनियादी खाता'}
              </span>
              <span className="text-[9px] text-emerald-400 font-semibold">{lang === 'en' ? 'Completed' : 'सत्यापित'}</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-[0_0_15px_rgba(245,158,11,0.5)] border-2 border-amber-300 animate-pulse">
                2
              </div>
              <span className="text-[11px] font-bold text-amber-200 mt-2 leading-tight">
                {lang === 'en' ? 'Debt Freedom' : 'साहूकार मुक्ति'}
              </span>
              <span className="text-[9px] text-amber-300 font-semibold">{lang === 'en' ? 'In Progress' : 'चल रहा है'}</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl bg-white/[0.08] text-slate-300 font-bold flex items-center justify-center text-sm border border-white/15">
                3
              </div>
              <span className="text-[11px] font-bold text-slate-300 mt-2 leading-tight">
                {lang === 'en' ? 'Micro-Gold' : 'डिजिटल सोना'}
              </span>
              <span className="text-[9px] text-slate-500 font-semibold">{lang === 'en' ? 'Unlocked' : 'उपलब्ध'}</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl bg-white/[0.04] text-slate-500 font-bold flex items-center justify-center text-sm border border-white/10">
                🏆
              </div>
              <span className="text-[11px] font-bold text-slate-400 mt-2 leading-tight">
                {lang === 'en' ? 'SHG Leader' : 'दीदी उद्यम'}
              </span>
              <span className="text-[9px] text-slate-500 font-semibold">{lang === 'en' ? 'Master Badge' : 'फाइनल बैज'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento-styled Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLessons.map((lesson) => {
          return (
            <div
              key={lesson.id}
              onClick={() => handleOpenLesson(lesson)}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/90 p-5 sm:p-6 border border-white/[0.08] hover:border-emerald-500/40 shadow-[0_6px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.15)] transition-all duration-300 cursor-pointer flex flex-col justify-between backdrop-blur-md hover:-translate-y-1"
            >
              {/* Subtle card ambient highlight on hover */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div>
                <div className="flex items-start justify-between gap-3 mb-3.5">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:border-emerald-400/40 transition-all duration-300 shadow-inner">
                    {lesson.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {lesson.completed && (
                      <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-400/30 shadow-sm">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {lang === 'en' ? 'Completed' : 'पूर्ण'}
                      </span>
                    )}
                    <span className="bg-slate-800/80 text-slate-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-white/[0.05]">
                      ⏱️ {lesson.duration}
                    </span>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-1 leading-snug">
                  {lesson.hindiTitle}
                </h3>
                <p className="text-xs text-slate-400 font-medium mb-3">
                  {lesson.title}
                </p>

                {literacyLevel === 'visual' ? (
                  <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-400/20 text-xs text-amber-200 font-medium mb-4 flex items-center gap-2.5">
                    <Volume2 className="w-4 h-4 text-amber-300 flex-shrink-0 animate-pulse" />
                    <span>{lang === 'en' ? 'Tap to listen to this story and earn a badge.' : 'कहानी सुनने और बैज प्राप्त करने के लिए कार्ड पर टैप करें।'}</span>
                  </div>
                ) : (
                  <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4 font-normal">
                    {lesson.storyNarrative}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3.5 border-t border-white/[0.07]">
                <span className="text-[11px] font-bold text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-md border border-amber-400/20">
                  {lesson.rewardBadge}
                </span>
                <span className="text-emerald-400 font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {s.openLesson} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Lesson Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-gradient-to-b from-[#0c1322] to-[#070b14] rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/15 p-6 sm:p-7 relative text-slate-100 animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2.5 bg-white/[0.08] border border-white/10 rounded-xl shadow-inner">
                  {selectedLesson.icon}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {selectedLesson.hindiTitle}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {selectedLesson.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLesson(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Audio Readout Prompt */}
            <div className="my-4 bg-white/[0.05] p-3.5 rounded-2xl border border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-200">
                  {s.fullStoryAudio}:
                </span>
              </div>
              <AudioButton
                textToSpeak={`${selectedLesson.hindiTitle}. ${selectedLesson.storyNarrative}. ${selectedLesson.keyTakeaways.join('. ')}`}
                lang={lang}
                label={s.listenAudio}
                size="md"
              />
            </div>

            {/* Story narrative */}
            <div className="space-y-4 mb-6">
              <div className="bg-white/[0.04] p-4 rounded-2xl border border-white/10">
                <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span>📖</span>
                  <span>{lang === 'en' ? 'Inspiring Story' : 'प्रेरक कहानी'}</span>
                </h4>
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                  {selectedLesson.storyNarrative}
                </p>
              </div>

              {/* Key takeaways */}
              <div>
                <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span>💡</span>
                  <span>{lang === 'en' ? 'Key Takeaways' : 'मुख्य सीख'}</span>
                </h4>
                <div className="space-y-2">
                  {selectedLesson.keyTakeaways.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 bg-white/[0.03] rounded-xl border border-white/[0.07]"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-200 font-medium leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Micro-Quiz for reward */}
            <div className="bg-white/[0.04] p-5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                  <span>{s.quizTitle}</span>
                </h4>
                <AudioButton
                  textToSpeak={`${selectedLesson.quizQuestion.question}. ${selectedLesson.quizQuestion.options.join(', ')}`}
                  lang={lang}
                  label={s.listenAudio}
                  size="sm"
                />
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-100 mb-3">
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
                      className={`w-full text-left p-3.5 rounded-xl text-xs font-medium transition-all border ${
                        isSelected
                          ? quizSubmitted
                            ? isCorrect
                              ? 'bg-emerald-600/90 text-white border-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                              : 'bg-rose-600/90 text-white border-rose-400 font-bold'
                            : 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                          : 'bg-white/[0.05] text-slate-200 hover:bg-white/[0.1] border-white/10'
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
                  className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md ${
                    quizAnswer !== null
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                      : 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/5'
                  }`}
                >
                  {s.quizSubmit}
                </button>
              ) : (
                <div className="space-y-3">
                  {quizAnswer === selectedLesson.quizQuestion.correctIndex ? (
                    <div className="bg-emerald-500/20 border border-emerald-400/40 p-3.5 rounded-xl text-emerald-200 text-xs font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-pulse" />
                      <span>{selectedLesson.quizQuestion.explanation}</span>
                    </div>
                  ) : (
                    <div className="bg-rose-500/20 border border-rose-400/40 p-3.5 rounded-xl text-rose-200 text-xs font-semibold">
                      {lang === 'en' ? 'Try again! The correct answer was: ' : 'पुनः प्रयास करें! सही विकल्प था: '} {selectedLesson.quizQuestion.options[selectedLesson.quizQuestion.correctIndex]}
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedLesson(null)}
                    className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/10"
                  >
                    {s.closeLesson}
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
