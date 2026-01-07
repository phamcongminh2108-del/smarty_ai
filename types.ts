
export type Language = 'en' | 'vi';

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: string;
  imageUrl?: string;
  quiz?: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

export enum Voice {
  KORE = 'Kore',
  PUCK = 'Puck',
  CHARON = 'Charon',
  FENRIR = 'Fenrir',
  ZEPHYR = 'Zephyr'
}

export type LessonTheme = 'minimal' | 'cyberpunk' | 'academic' | 'playful';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  email: string;
  grade: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
  theme: LessonTheme;
  onboarded: boolean;
  smartInsights?: string;
  language?: Language;
  coins?: number;
  streak?: number;
}
