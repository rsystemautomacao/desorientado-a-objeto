import { Module } from './types';

export const pythonModules: Module[] = [
  {
    id: 1,
    title: 'Fundamentos de Python',
    description: 'Introdução à linguagem, variáveis, tipos, operadores e entrada/saída.',
    level: 'basico',
    icon: '🟢',
    lessons: [
      { id: 'py-m1-intro',      title: 'Introdução ao Python e Primeiro Programa', duration: '15 min' },
      { id: 'py-m1-variables',  title: 'Variáveis e Tipos de Dados',               duration: '20 min' },
      { id: 'py-m1-operators',  title: 'Operadores Aritméticos e de Comparação',   duration: '20 min' },
      { id: 'py-m1-io',         title: 'Entrada e Saída: print() e input()',        duration: '15 min' },
    ],
  },
  {
    id: 2,
    title: 'Controle de Fluxo',
    description: 'Condicionais, laços de repetição e controle de execução.',
    level: 'intermediario',
    icon: '🟡',
    lessons: [
      { id: 'py-m2-ifelse',   title: 'if, elif, else — Tomando Decisões',   duration: '20 min' },
      { id: 'py-m2-for',      title: 'Laço for e a Função range()',          duration: '25 min' },
      { id: 'py-m2-while',    title: 'Laço while, break e continue',         duration: '20 min' },
    ],
  },
  {
    id: 3,
    title: 'Funções e Estruturas de Dados',
    description: 'Criação de funções, listas, dicionários e organização de código.',
    level: 'avancado',
    icon: '🔴',
    lessons: [
      { id: 'py-m3-functions', title: 'Funções: def, parâmetros e retorno',  duration: '25 min' },
      { id: 'py-m3-lists',     title: 'Listas — A Estrutura Mais Usada',     duration: '25 min' },
      { id: 'py-m3-dicts',     title: 'Dicionários e Conjuntos',             duration: '25 min' },
    ],
  },
];

export function getPythonAdjacentLessons(lessonId: string) {
  const all = pythonModules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id })));
  const idx = all.findIndex((l) => l.id === lessonId);
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}

export function getAllPythonLessons() {
  return pythonModules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id })));
}
