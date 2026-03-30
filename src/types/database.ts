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
