export interface PythonExercise {
  id: string;
  moduleId: number;
  topic: string;
  topicLabel: string;
  title: string;
  description: string;
  difficulty: 'facil' | 'medio' | 'dificil';
  starterCode: string;
  testCases: { input: string; expectedOutput: string; visible: boolean }[];
  hints?: string[];
  xpReward: number;
}

export const pythonExercises: PythonExercise[] = [
  {
    id: 'py-01',
    moduleId: 1,
    topic: 'fundamentos',
    topicLabel: 'Fundamentos',
    title: 'Olá, Mundo!',
    description: 'Escreva um programa Python que exiba a mensagem <strong>Hello, World!</strong> no console.',
    difficulty: 'facil',
    starterCode: '# Escreva seu codigo aqui\n',
    testCases: [
      { input: '', expectedOutput: 'Hello, World!', visible: true },
    ],
    hints: ['Use a função print() para exibir texto.', 'print("Hello, World!")'],
    xpReward: 10,
  },
  {
    id: 'py-02',
    moduleId: 1,
    topic: 'fundamentos',
    topicLabel: 'Fundamentos',
    title: 'Soma de dois números',
    description: 'Leia dois números inteiros da entrada (um por linha) e exiba a soma deles.',
    difficulty: 'facil',
    starterCode: '# Leia dois inteiros e imprima a soma\n',
    testCases: [
      { input: '3\n7', expectedOutput: '10', visible: true },
      { input: '10\n20', expectedOutput: '30', visible: false },
      { input: '-5\n5', expectedOutput: '0', visible: false },
    ],
    hints: [
      'Use int(input()) para ler um número inteiro.',
      'Armazene em variáveis e some: a = int(input()); b = int(input()); print(a + b)',
    ],
    xpReward: 15,
  },
  {
    id: 'py-03',
    moduleId: 1,
    topic: 'condicionais',
    topicLabel: 'Condicionais',
    title: 'Maior de dois',
    description: 'Leia dois números inteiros (um por linha) e exiba o maior deles.',
    difficulty: 'facil',
    starterCode: '# Leia dois inteiros e imprima o maior\n',
    testCases: [
      { input: '5\n3', expectedOutput: '5', visible: true },
      { input: '2\n9', expectedOutput: '9', visible: false },
      { input: '7\n7', expectedOutput: '7', visible: false },
    ],
    hints: [
      'Use if/else para comparar os dois valores.',
      'Ou use a função embutida max(a, b).',
    ],
    xpReward: 20,
  },
  {
    id: 'py-04',
    moduleId: 2,
    topic: 'repeticao',
    topicLabel: 'Repetição',
    title: 'Fatorial',
    description: 'Leia um número inteiro <code>n</code> (0 ≤ n ≤ 12) e exiba o seu fatorial.',
    difficulty: 'medio',
    starterCode: 'n = int(input())\n# Calcule e imprima o fatorial de n\n',
    testCases: [
      { input: '5', expectedOutput: '120', visible: true },
      { input: '0', expectedOutput: '1', visible: true },
      { input: '10', expectedOutput: '3628800', visible: false },
    ],
    hints: [
      'Fatorial de 0 é 1 por definição.',
      'Use um loop for: resultado = 1; for i in range(1, n+1): resultado *= i',
      'Ou use math.factorial(n) da biblioteca math.',
    ],
    xpReward: 30,
  },
  {
    id: 'py-05',
    moduleId: 2,
    topic: 'listas',
    topicLabel: 'Listas',
    title: 'Soma de lista',
    description: 'Leia um número <code>n</code> e depois <code>n</code> inteiros (um por linha). Exiba a soma de todos.',
    difficulty: 'medio',
    starterCode: 'n = int(input())\n# Leia n numeros e imprima a soma\n',
    testCases: [
      { input: '3\n10\n20\n30', expectedOutput: '60', visible: true },
      { input: '4\n1\n2\n3\n4', expectedOutput: '10', visible: false },
      { input: '1\n99', expectedOutput: '99', visible: false },
    ],
    hints: [
      'Use um loop for e acumule a soma.',
      'numeros = [int(input()) for _ in range(n)]; print(sum(numeros))',
    ],
    xpReward: 30,
  },
  {
    id: 'py-06',
    moduleId: 3,
    topic: 'funcoes',
    topicLabel: 'Funções',
    title: 'Número par ou ímpar',
    description: 'Leia um inteiro e exiba <strong>PAR</strong> se for par, ou <strong>IMPAR</strong> se for ímpar.',
    difficulty: 'facil',
    starterCode: 'n = int(input())\n# Escreva a logica aqui\n',
    testCases: [
      { input: '4', expectedOutput: 'PAR', visible: true },
      { input: '7', expectedOutput: 'IMPAR', visible: true },
      { input: '0', expectedOutput: 'PAR', visible: false },
    ],
    hints: ['Use o operador de módulo: n % 2 == 0 significa par.'],
    xpReward: 15,
  },
  {
    id: 'py-07',
    moduleId: 3,
    topic: 'strings',
    topicLabel: 'Strings',
    title: 'Contagem de vogais',
    description: 'Leia uma palavra e exiba a quantidade de vogais (a, e, i, o, u) que ela contém. Ignore maiúsculas/minúsculas.',
    difficulty: 'medio',
    starterCode: 'palavra = input()\n# Conte as vogais\n',
    testCases: [
      { input: 'Python', expectedOutput: '1', visible: true },
      { input: 'Educacao', expectedOutput: '5', visible: false },
      { input: 'sky', expectedOutput: '0', visible: false },
    ],
    hints: [
      'Converta para minúsculas com .lower().',
      'Verifique se cada letra está em "aeiou".',
    ],
    xpReward: 25,
  },
];

export function getPythonExerciseById(id: string): PythonExercise | undefined {
  return pythonExercises.find((e) => e.id === id);
}

export function getPythonTopicsByModule() {
  const map = new Map<number, { moduleId: number; topics: string[] }>();
  pythonExercises.forEach((ex) => {
    if (!map.has(ex.moduleId)) map.set(ex.moduleId, { moduleId: ex.moduleId, topics: [] });
    const m = map.get(ex.moduleId)!;
    if (!m.topics.includes(ex.topic)) m.topics.push(ex.topic);
  });
  return Array.from(map.values());
}
