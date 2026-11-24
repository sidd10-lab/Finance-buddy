import React, { useState, useMemo } from 'react';
import { Heart, MessageCircle, Phone, Star, Sparkles, Send } from 'lucide-react';
import { Mentor, CommunityPost, LanguageCode, LiteracyLevel } from '../types';
import { getLocalizedMentors, getLocalizedPosts } from '../data/mockData';
import { AudioButton } from './AudioButton';
import { speechService } from '../services/speechService';
import { UI_STRINGS } from '../services/translations';

interface MentorshipModuleProps {
  lang: LanguageCode;
  literacyLevel: LiteracyLevel;
}

export const MentorshipModule: React.FC<MentorshipModuleProps> = ({
  lang,
}) => {
  const s = UI_STRINGS[lang] || UI_STRINGS.hi;
  const initialLocalizedPosts = useMemo(() => getLocalizedPosts(lang), [lang]);
  const [posts, setPosts] = useState<CommunityPost[]>(initialLocalizedPosts);
  const [newPostText, setNewPostText] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isCallingMentor, setIsCallingMentor] = useState(false);
  const [activeTab, setActiveTab] = useState<'mentors' | 'community'>('mentors');

  const mentorsList = useMemo(() => getLocalizedMentors(lang), [lang]);

  const handleLikePost = (id: string) => {
    setPosts(prev =>
      prev.map(p => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
    speechService.playCoinSound();
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: CommunityPost = {
      id: 'post-' + Date.now(),
      authorName: lang === 'en' ? 'Lakshmi Devi (You)' : 'लक्ष्मी देवी (आप)',
      authorVillage: lang === 'en' ? 'Rampur, Maharashtra' : 'रामपुर, महाराष्ट्र',
      authorAvatar: '👩‍🌾',
      badge: lang === 'en' ? 'Active Sakhi' : 'सक्रिय सखी',
      content: newPostText,
      likes: 1,
      commentsCount: 0,
      timestamp: lang === 'en' ? 'Just now' : 'अभी-अभी',
      category: 'savings_tip'
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    speechService.playSuccessSound();
  };

  const handleCallMentor = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setIsCallingMentor(true);
    speechService.speak(
      mentor.audioIntro,
      lang,
      () => {}
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Bento Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#1c0f18]/90 to-slate-950/95 p-6 sm:p-8 border border-rose-500/25 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-rose-500/20 text-rose-300 text-xs font-bold px-3 py-1 rounded-full border border-rose-500/35 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>{lang === 'en' ? 'Sakhi Forum • Didi Circle' : 'सखी मंच • दीदी चौपाल'}</span>
            </span>
            <AudioButton
              textToSpeak={lang === 'en' ? 'Welcome to Sakhi Circle. Connect with experienced rural women entrepreneurs and bank mitras.' : 'सखी मंच में आपका स्वागत है। यहाँ आप अनुभवी महिला उद्यमियों और बैंक मित्रों से सलाह ले सकती हैं।'}
              lang={lang}
              size="sm"
              className="bg-white/10 text-white border-white/20"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2 leading-tight">
            {lang === 'en' ? 'Mentorship & Sisterhood' : 'मार्गदर्शन और सखी समुदाय'}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
            {lang === 'en' ? 'Connect directly with successful rural female entrepreneurs and certified Bank Mitras to receive guidance and share experiences.' : 'सफल ग्रामीण महिला उद्यमियों और सर्टिफाइड बैंक मित्रों से सीधा संपर्क करें, मार्गदर्शन लें और अपने अनुभव साझा करें।'}
          </p>

          <div className="flex gap-2.5">
            <button
              onClick={() => setActiveTab('mentors')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'mentors'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.35)] font-extrabold'
                  : 'bg-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.14] border border-white/10'
              }`}
            >
              👩‍💼 {lang === 'en' ? 'Meet Mentor Didis' : 'मार्गदर्शक दीदी से मिलें'}
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'community'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] font-extrabold'
                  : 'bg-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.14] border border-white/10'
              }`}
            >
              💬 {lang === 'en' ? 'Community Stories' : 'सखी चौपाल की बातें'}
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: Mentors Showcase */}
      {activeTab === 'mentors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              {lang === 'en' ? 'Verified Female Entrepreneurs & Financial Advisors' : 'सत्यापित महिला उद्यमी व वित्तीय सलाहकार'}
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              3 {lang === 'en' ? 'Mentors Available' : 'मार्गदर्शिका उपलब्ध'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {mentorsList.map((mentor) => (
              <div
                key={mentor.id}
                className="group relative overflow-hidden rounded-3xl bg-slate-900/80 p-5 border border-white/[0.08] hover:border-rose-500/40 shadow-[0_6px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_35px_rgba(244,63,94,0.15)] flex flex-col justify-between transition-all duration-300 backdrop-blur-md hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform">
                      {mentor.avatar}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-400 font-bold text-xs justify-end">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{mentor.rating}</span>
                      </div>
                      {mentor.isOnline && (
                        <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1 mt-1 border border-emerald-400/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          {lang === 'en' ? 'Available' : 'सक्रिय'}
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-white leading-tight group-hover:text-rose-300 transition-colors">
                    {mentor.name}
                  </h4>
                  <p className="text-xs font-semibold text-emerald-400 mt-0.5">
                    {mentor.role}
                  </p>
                  <p className="text-[11px] text-slate-400 mb-3">
                    📍 {mentor.location}
                  </p>

                  <div className="bg-white/[0.04] p-3.5 rounded-2xl border border-white/10 mb-3 text-xs text-slate-200 leading-relaxed font-normal">
                    "{mentor.story}"
                  </div>

                  <div className="space-y-1 mb-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Expertise:' : 'विशेषज्ञता:'}</p>
                    <div className="flex flex-wrap gap-1">
                      {mentor.expertise.map((exp, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-white/[0.06] text-slate-200 font-medium px-2.5 py-0.5 rounded-lg border border-white/10"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3.5 border-t border-white/[0.08] flex items-center justify-between gap-2">
                  <AudioButton
                    textToSpeak={mentor.audioIntro}
                    lang={lang}
                    label={s.listenAudio}
                    size="sm"
                  />
                  <button
                    onClick={() => handleCallMentor(mentor)}
                    className="flex-1 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{s.talkToMentor}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Community Wall */}
      {activeTab === 'community' && (
        <div className="space-y-5">
          {/* Create Post */}
          <form
            onSubmit={handleCreatePost}
            className="relative overflow-hidden rounded-3xl bg-slate-900/80 p-5 sm:p-6 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.5)] backdrop-blur-xl space-y-3.5"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2.5 bg-white/[0.06] border border-white/10 rounded-2xl">👩‍🌾</span>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {lang === 'en' ? 'Share in the Sakhi Community Circle' : 'सखी चौपाल में अपनी बात साझा करें'}
                </h4>
                <p className="text-xs text-slate-400">
                  {lang === 'en' ? 'Your small step can inspire another sister!' : 'आपकी छोटी सी सफलता दूसरी बहन को बड़ा हौसला दे सकती है'}
                </p>
              </div>
            </div>

            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder={lang === 'en' ? "Didi, share your savings or business milestone here..." : "दीदी, आज आपने बचत या व्यापार में क्या नया किया? यहाँ लिखें..."}
              className="w-full p-3.5 bg-white/[0.04] border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none min-h-[75px]"
            />

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setNewPostText(lang === 'en' ? 'Today I saved ₹50 from tailoring into Digital Gold. Truly, small drops make an ocean!' : 'आज मैंने अपनी सिलाई आमदनी में से ₹50 अलग गुल्लक में बचाए। बहुत खुशी हो रही है!');
                }}
                className="text-xs text-amber-300 font-bold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/20 px-3 py-1.5 rounded-xl transition-all"
              >
                ✨ {lang === 'en' ? 'Fill Example' : 'उदाहरण भरें'}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{s.shareCommunity}</span>
              </button>
            </div>
          </form>

          {/* Posts list */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="relative overflow-hidden rounded-3xl bg-slate-900/80 p-5 border border-white/[0.08] shadow-[0_6px_25px_rgba(0,0,0,0.4)] space-y-3 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl p-2.5 bg-white/[0.06] rounded-2xl border border-white/10">
                      {post.authorAvatar}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {post.authorName}
                        </h4>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md border border-emerald-400/30">
                          {post.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">
                        📍 {post.authorVillage} • {post.timestamp}
                      </p>
                    </div>
                  </div>

                  <AudioButton
                    textToSpeak={`${post.authorName}: ${post.content}`}
                    lang={lang}
                    size="sm"
                  />
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  {post.content}
                </p>

                <div className="pt-2.5 border-t border-white/[0.07] flex items-center gap-4">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-rose-300 hover:text-rose-200 active:scale-95 transition-all"
                  >
                    <Heart className="w-4 h-4 text-rose-400 fill-rose-500/40" />
                    <span>{post.likes} {lang === 'en' ? 'Encouraged' : 'हौसला बढ़ाया'}</span>
                  </button>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentsCount} {lang === 'en' ? 'Comments' : 'टिप्पणियां'}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Voice Call Simulation Dialog */}
      {isCallingMentor && selectedMentor && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#180f1e] to-[#0c0812] text-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-rose-500/30 animate-in zoom-in-95">
            <div className="relative w-20 h-20 rounded-3xl bg-rose-500/20 border border-rose-500/40 mx-auto flex items-center justify-center text-4xl mb-4 shadow-[0_0_25px_rgba(244,63,94,0.3)]">
              <span className="animate-pulse">{selectedMentor.avatar}</span>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">{selectedMentor.name}</h3>
            <p className="text-xs text-rose-300 mb-4">{selectedMentor.role}</p>

            <div className="bg-white/[0.05] p-4 rounded-2xl text-xs text-slate-200 mb-6 leading-relaxed border border-white/10">
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="w-1 bg-emerald-400 rounded-full animate-wave-1"></span>
                <span className="w-1 bg-emerald-400 rounded-full animate-wave-2"></span>
                <span className="w-1 bg-emerald-400 rounded-full animate-wave-3"></span>
                <span className="w-1 bg-emerald-400 rounded-full animate-wave-4"></span>
              </div>
              <strong className="text-emerald-400">📞 {lang === 'en' ? 'Call Connected' : 'कॉल कनेक्टेड है'}</strong>
              <p className="mt-1 text-slate-300">
                {lang === 'en' ? 'Didi is on the line to advise you on loans, business or banking.' : 'दीदी से सिलाई मशीन लोन, मसाला व्यापार या बैंक खाता खोलने पर सलाह लें।'}
              </p>
            </div>

            <button
              onClick={() => {
                speechService.stop();
                setIsCallingMentor(false);
              }}
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl font-bold text-xs shadow-lg"
            >
              {lang === 'en' ? 'End Call' : 'कॉल समाप्त करें'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
