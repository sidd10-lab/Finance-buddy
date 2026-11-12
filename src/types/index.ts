export type LanguageCode = 'hi' | 'mr' | 'ta' | 'te' | 'bn' | 'kn' | 'gu' | 'en';

export type LiteracyLevel = 'visual' | 'simple' | 'standard';

export interface UserProfile {
  name: string;
  avatar: string;
  village: string;
  state: string;
  occupation: string;
  language: LanguageCode;
  literacyLevel: LiteracyLevel;
  audioAutoPlay: boolean;
  walletBalance: number;
  digitalGoldGrams: number;
  shgPoolContribution: number;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  icon: string;
  date: string;
  note?: string;
  audioHint?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  icon: string;
  category: 'asset' | 'education' | 'emergency' | 'business';
  visualMilestone: string;
}

export interface EducationLesson {
  id: string;
  title: string;
  hindiTitle: string;
  category: 'basics' | 'shg' | 'schemes' | 'debt_freedom' | 'cyber_safety';
  icon: string;
  duration: string;
  storyNarrative: string;
  keyTakeaways: string[];
  audioScript: string;
  quizQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  rewardBadge: string;
  completed?: boolean;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  hindiName: string;
  ministry: string;
  tagline: string;
  benefitAmount: string;
  targetGroup: string;
  eligibility: string[];
  documentsRequired: string[];
  icon: string;
  applySteps: string[];
  audioExplanation: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  location: string;
  story: string;
  expertise: string[];
  avatar: string;
  isOnline: boolean;
  rating: number;
  languages: string[];
  audioIntro: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorVillage: string;
  authorAvatar: string;
  badge: string;
  content: string;
  audioUrl?: string;
  likes: number;
  commentsCount: number;
  timestamp: string;
  category: 'success_story' | 'savings_tip' | 'question' | 'shg_update';
}
