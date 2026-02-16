export interface Module {
  id: number;
  title: string;
  description: string;
  level: 'basico' | 'intermediario' | 'avancado';
  icon: string;
  lessons: LessonMeta[];
}

export interface LessonMeta {
  id: string;
  title: string;
  duration: string;
}

export interface Section {
  title: string;
  body: string;
  code?: string;
  codeExplanation?: string;
  tip?: string;
  warning?: string;
}

export interface LessonContent {
  id: string;
  moduleId: number;
  objectives: string[];
  sections: Section[];
  commonErrors?: { title: string; description: string; code?: string }[];
  withoutPoo?: string;
  withPoo?: string;
  comparisonExplanation?: string;
  summary: string[];
}

export interface QuizQuestion {
  id: string;
  lessonId: string;
  question: string;
  code?: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface InterviewQuestion {
  id: string;
  category: string;
  level: 'basico' | 'intermediario' | 'avancado';
  question: string;
  answer: string;
  code?: string;
  tip: string;
}
