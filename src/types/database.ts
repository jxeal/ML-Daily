export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  lesson_count: number;
}

export interface QuizQuestion {
  question: string;
  options: { id: string; text: string }[];
  answer: string;
}

export interface Lesson {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  short_description: string;
  content: string;
  examples: string[];
  quiz: QuizQuestion[];
  icon: string;
  xp_reward?: number;
}

export interface DailyChallenge {
  id: string;
  date: string;
  question: string;
  options: { id: string; text: string }[];
  answer: string;
  explanation: string;
  xpReward: number; // In DB it's xp_reward
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  quote: string;
  icon_name: string;
  image_url?: string;
  created_at: string;
}

export interface UserStats {
  id: string;
  streak: number;
  last_visit: string | null;
  completed_lessons: string[];
  xp: number;
  daily_challenge_done: string | null;
  badges: { id: string; earned_at: string }[];
  updated_at?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
}
