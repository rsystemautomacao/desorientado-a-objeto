import { Module } from './types';

export const modules: Module[] = [
  {
    id: 1,
    title: 'Fundamentos',
    description: 'Revisão completa do básico: variáveis, operadores, estruturas de controle, arrays e funções.',
    level: 'basico',
    icon: '🟢',
    lessons: [
      { id: 'm1-intro', title: 'Introdução ao Java e Estrutura de um Programa', duration: '20 min' },
      { id: 'm1-variables', title: 'Variáveis e Tipos (Primitivos e String)', duration: '25 min' },
      { id: 'm1-operators', title: 'Operadores e Expressões', duration: '20 min' },
      { id: 'm1-ifelse', title: 'if / else e Operadores Lógicos', duration: '25 min' },
      { id: 'm1-switch', title: 'switch case com Exemplos Práticos', duration: '20 min' },
      { id: 'm1-loops', title: 'Laços: for, while, do-while', duration: '30 min' },
      { id: 'm1-arrays', title: 'Vetores (Arrays)', duration: '30 min' },
      { id: 'm1-matrices', title: 'Matrizes e Loops Aninhados', duration: '25 min' },
      { id: 'm1-functions', title: 'Funções (Métodos): Parâmetros, Retorno e Sobrecarga', duration: '30 min' },
    ],
  },
  {
    id: 2,
    title: 'Intermediário',
    description: 'Preparação para POO: entrada/saída, Strings, debug, Collections e organização de código.',
    level: 'intermediario',
    icon: '🟡',
    lessons: [
      { id: 'm2-io', title: 'Entrada e Saída com Scanner', duration: '20 min' },
      { id: 'm2-strings', title: 'Manipulação de Strings', duration: '25 min' },
      { id: 'm2-debug', title: 'Debug e Leitura de Erros (Stack Trace)', duration: '20 min' },
      { id: 'm2-collections', title: 'Introdução a Collections: ArrayList vs Array', duration: '25 min' },
      { id: 'm2-packages', title: 'Organizando Código em Pacotes', duration: '20 min' },
    ],
  },
  {
    id: 3,
    title: 'POO — Do Zero ao Avançado',
    description: 'Programação Orientada a Objetos completa: classes, herança, polimorfismo, interfaces, SOLID e mais.',
    level: 'avancado',
    icon: '🔴',
    lessons: [
      { id: 'm3-whatispoo', title: 'O que é POO e Por Que Existe', duration: '25 min' },
      { id: 'm3-classes', title: 'Classe e Objeto (Modelagem do Mundo Real)', duration: '30 min' },
      { id: 'm3-attributes', title: 'Atributos e Métodos (Estado e Comportamento)', duration: '25 min' },
      { id: 'm3-constructors', title: 'Construtores', duration: '20 min' },
      { id: 'm3-encapsulation', title: 'Encapsulamento (get/set, private, validações)', duration: '30 min' },
      { id: 'm3-static', title: 'static — Quando Usar e Quando Evitar', duration: '20 min' },
      { id: 'm3-this', title: 'this e Referência', duration: '15 min' },
      { id: 'm3-inheritance', title: 'Herança — Quando Faz Sentido e Quando Não', duration: '35 min' },
      { id: 'm3-polymorphism', title: 'Polimorfismo (Sobrescrita e Referência do Tipo Pai)', duration: '30 min' },
      { id: 'm3-abstraction', title: 'Abstração (Classes Abstratas)', duration: '25 min' },
      { id: 'm3-interfaces', title: 'Interfaces (Contratos)', duration: '25 min' },
      { id: 'm3-composition', title: 'Composição vs Herança na Prática', duration: '30 min' },
      { id: 'm3-overloading', title: 'Sobrecarga vs Sobrescrita', duration: '20 min' },
      { id: 'm3-access', title: 'Packages e Modificadores de Acesso', duration: '25 min' },
      { id: 'm3-exceptions', title: 'Tratamento de Exceções (try/catch/finally)', duration: '30 min' },
      { id: 'm3-solid', title: 'Introdução a SOLID', duration: '35 min' },
      { id: 'm3-project', title: 'Projeto Final: Mini-Sistema com POO', duration: '60 min' },
    ],
  },
];

export function getAllLessons() {
  return modules.flatMap((m) =>
    m.lessons.map((l, i) => ({ ...l, moduleId: m.id, moduleTitle: m.title, order: i }))
  );
}

export function getLessonIndex(lessonId: string) {
  const all = getAllLessons();
  return all.findIndex((l) => l.id === lessonId);
}

export function getAdjacentLessons(lessonId: string) {
  const all = getAllLessons();
  const idx = all.findIndex((l) => l.id === lessonId);
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}
