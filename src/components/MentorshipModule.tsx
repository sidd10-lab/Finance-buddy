import React, { useState } from 'react';
import { Users, Heart, MessageCircle, Phone, Star, Sparkles, Send, Mic, Volume2 } from 'lucide-react';
import { Mentor, CommunityPost, LanguageCode, LiteracyLevel } from '../types';
import { mentorsList, communityPosts } from '../data/mockData';
import { AudioButton } from './AudioButton';
import { speechService } from '../services/speechService';

interface MentorshipModuleProps {
  lang: LanguageCode;
  literacyLevel: LiteracyLevel;
}

export const MentorshipModule: React.FC<MentorshipModuleProps> = ({
  lang,
  literacyLevel
}) => {
  const [posts, setPosts] = useState<CommunityPost[]>(communityPosts);
  const [newPostText, setNewPostText] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isCallingMentor, setIsCallingMentor] = useState(false);
  const [activeTab, setActiveTab] = useState<'mentors' | 'community'>('mentors');

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
      authorName: 'लक्ष्मी देवी (आप)',
      authorVillage: 'रामपुर, महाराष्ट्र',
      authorAvatar: '👩‍🌾',
      badge: 'सक्रिय सखी',
      content: newPostText,
      likes: 1,
      commentsCount: 0,
      timestamp: 'अभी-अभी',
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
      `नमस्ते लक्ष्मी दीदी! मैं ${mentor.name} बोल रही हूँ। बताइए, आपके व्यापार या लोन में मैं क्या मार्गदर्शन कर सकती हूँ?`,
      lang,
      () => {
        // finished
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-gulabi-500 via-rose-500 to-amber-600 rounded-3xl p-6 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-black/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>सखी मंच • दीदी चौपाल</span>
            </span>
            <AudioButton
              textToSpeak="सखी मंच में आपका स्वागत है। यहाँ आप अनुभवी महिला उद्यमियों और बैंक मित्रों से सलाह ले सकती हैं और अपनी प्रेरणादायक कहानी साझा कर सकती हैं।"
              lang={lang}
              size="sm"
              className="bg-white/20 text-white border-white/30"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            मार्गदर्शन और सखी समुदाय (Mentorship & Sisterhood)
          </h2>
          <p className="text-rose-100 text-xs sm:text-sm leading-relaxed mb-4">
            जब एक महिला आगे बढ़ती है, तो पूरा परिवार और गांव समृद्ध होता है। सफल महिला उद्यमियों की आवाज सुनें और उनसे सीधा मार्गदर्शन पाएं।
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('mentors')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'mentors' ? 'bg-white text-rose-950 shadow-md' : 'bg-black/20 text-white hover:bg-black/30'
              }`}
            >
              👩‍💼 मार्गदर्शक दीदी से मिलें
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'community' ? 'bg-white text-rose-950 shadow-md' : 'bg-black/20 text-white hover:bg-black/30'
              }`}
            >
              💬 सखी चौपाल की बातें
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: Mentors Showcase */}
      {activeTab === 'mentors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              सत्यापित महिला उद्यमी व वित्तीय सलाहकार
            </h3>
            <span className="text-xs text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-lg">
              3 दीदियां उपलब्ध
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {mentorsList.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white rounded-3xl p-5 border-2 border-rose-100 hover:border-rose-400 shadow-sm flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-16 h-16 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-3xl shadow-xs">
                      {mentor.avatar}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs justify-end">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{mentor.rating}</span>
                      </div>
                      {mentor.isOnline && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold inline-block mt-1">
                          🟢 अभी बात करने हेतु उपलब्ध
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-tight">
                    {mentor.name}
                  </h4>
                  <p className="text-xs font-semibold text-rose-700 mt-0.5">
                    {mentor.role}
                  </p>
                  <p className="text-[11px] text-slate-500 mb-3">
                    📍 {mentor.location}
                  </p>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-3 text-xs text-slate-700 leading-relaxed">
                    "{mentor.story}"
                  </div>

                  <div className="space-y-1 mb-4">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">विशेषज्ञता:</p>
                    <div className="flex flex-wrap gap-1">
                      {mentor.expertise.map((exp, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-rose-50 text-rose-900 font-bold px-2 py-0.5 rounded-md"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <AudioButton
                    textToSpeak={mentor.audioIntro}
                    lang={lang}
                    label="परिचय सुनें"
                    size="sm"
                  />
                  <button
                    onClick={() => handleCallMentor(mentor)}
                    className="flex-1 py-2 bg-gradient-to-r from-rose-600 to-gulabi-600 hover:from-rose-700 hover:to-gulabi-700 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>दीदी से बात करें</span>
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
            className="bg-white rounded-3xl p-5 border-2 border-rose-100 shadow-sm space-y-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2 bg-rose-50 rounded-xl">👩‍🌾</span>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  सखी चौपाल में अपनी बात या सीख साझा करें
                </h4>
                <p className="text-xs text-slate-500">
                  आपकी छोटी सी सफलता दूसरी बहन को बड़ा हौसला दे सकती है!
                </p>
              </div>
            </div>

            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="दीदी, आज आपने बचत या व्यापार में क्या नया किया? यहाँ लिखें..."
              className="w-full p-3 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:border-rose-400 focus:outline-none min-h-[70px]"
            />

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setNewPostText('आज मैंने अपनी सिलाई आमदनी में से ₹50 अलग गुल्लक में बचाए। बहुत खुशी हो रही है!');
                }}
                className="text-xs text-rose-700 font-bold bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-all"
              >
                ✨ उदाहरण भरें
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>साझा करें</span>
              </button>
            </div>
          </form>

          {/* Posts list */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 bg-rose-50 rounded-2xl">
                      {post.authorAvatar}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">
                          {post.authorName}
                        </h4>
                        <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                          {post.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        📍 {post.authorVillage} • {post.timestamp}
                      </p>
                    </div>
                  </div>

                  <AudioButton
                    textToSpeak={`${post.authorName} ने कहा: ${post.content}`}
                    lang={lang}
                    size="sm"
                  />
                </div>

                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {post.content}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-4">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 active:scale-95 transition-all"
                  >
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                    <span>{post.likes} हौसला बढ़ाया</span>
                  </button>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentsCount} टिप्पणियां</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Voice Call Simulation Dialog */}
      {isCallingMentor && selectedMentor && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border-2 border-rose-500 animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-400 mx-auto flex items-center justify-center text-4xl mb-3 animate-pulse">
              {selectedMentor.avatar}
            </div>

            <h3 className="text-lg font-bold">{selectedMentor.name}</h3>
            <p className="text-xs text-rose-300 mb-4">{selectedMentor.role}</p>

            <div className="bg-white/10 p-4 rounded-2xl text-xs text-slate-200 mb-6 leading-relaxed">
              📞 <strong>कॉल कनेक्ट हो गया है!</strong>
              <p className="mt-1">
                दीदी आपकी आवाज सुन रही हैं। आप सिलाई मशीन लोन, मसाला व्यापार या बैंक खाता खोलने की सलाह ले सकती हैं।
              </p>
            </div>

            <button
              onClick={() => {
                speechService.stop();
                setIsCallingMentor(false);
              }}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-sm shadow-md"
            >
              कॉल समाप्त करें (End Call)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
