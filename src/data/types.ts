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
  /** Código Java completo (classe + main) para o aluno editar e executar nesta seção */
  tryItCode?: string;
  /** Instrução curta para o exercício (ex: "Altere a mensagem e execute.") */
  tryItPrompt?: string;
}

export interface LessonContent {
  id: string;
  moduleId: number;
  objectives: string[];
  sections: Section[];
  /** Código Java completo para "Experimente aqui" ao final da aula (classe + main) */
  tryItCode?: string;
  /** Instrução para o bloco Experimente (ex: "Teste o que você aprendeu: altere valores e execute.") */
  tryItPrompt?: string;
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
