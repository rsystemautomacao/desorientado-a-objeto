import { Module } from './types';

export const cModules: Module[] = [
  {
    id: 0,
    title: 'Fluxogramas e Pensamento Algorítmico',
    description: 'Aprenda a pensar como programador: algoritmos, símbolos de fluxograma e como traduzir diagramas em código C.',
    level: 'basico',
    icon: '📐',
    lessons: [
      { id: 'c-m0-algo',     title: 'O que é um Algoritmo?',                        duration: '15 min' },
      { id: 'c-m0-symbols',  title: 'Símbolos dos Fluxogramas',                      duration: '20 min' },
      { id: 'c-m0-seq',      title: 'Fluxogramas Sequenciais e Código C',            duration: '20 min' },
      { id: 'c-m0-decision', title: 'Fluxogramas com Decisão (if/else)',             duration: '25 min' },
      { id: 'c-m0-loops',    title: 'Fluxogramas com Repetição (while e for)',       duration: '25 min' },
    ],
  },
  {
    id: 1,
    title: 'Fundamentos de C',
    description: 'Introdução à linguagem C, variáveis, tipos, operadores e entrada/saída.',
    level: 'basico',
    icon: '🟢',
    lessons: [
      { id: 'c-m1-intro',     title: 'Introdução ao C e Estrutura de um Programa', duration: '20 min' },
      { id: 'c-m1-variables', title: 'Variáveis, Tipos e Constantes',               duration: '20 min' },
      { id: 'c-m1-operators', title: 'Operadores Aritméticos, Relacionais e Lógicos', duration: '20 min' },
      { id: 'c-m1-io',        title: 'Entrada e Saída: printf() e scanf()',           duration: '20 min' },
    ],
  },
  {
    id: 2,
    title: 'Controle de Fluxo',
    description: 'Condicionais, switch, laços for e while.',
    level: 'intermediario',
    icon: '🟡',
    lessons: [
      { id: 'c-m2-ifelse', title: 'if, else e Operadores Lógicos',       duration: '20 min' },
      { id: 'c-m2-switch', title: 'switch / case na Prática',             duration: '15 min' },
      { id: 'c-m2-loops',  title: 'Laços for, while e do-while',          duration: '25 min' },
    ],
  },
  {
    id: 3,
    title: 'Funções e Arrays',
    description: 'Modularização com funções, vetores, strings e introdução a ponteiros.',
    level: 'avancado',
    icon: '🔴',
    lessons: [
      { id: 'c-m3-functions', title: 'Funções: declaração, parâmetros e retorno', duration: '25 min' },
      { id: 'c-m3-arrays',    title: 'Vetores (Arrays) e Matrizes',               duration: '25 min' },
      { id: 'c-m3-pointers',  title: 'Introdução a Ponteiros',                    duration: '30 min' },
    ],
  },
];

export function getCAdjacentLessons(lessonId: string) {
  const all = cModules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id })));
  const idx = all.findIndex((l) => l.id === lessonId);
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}

export function getAllCLessons() {
  return cModules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id })));
}
