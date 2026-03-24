export interface CExercise {
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

export const cExercises: CExercise[] = [
  {
    id: 'c-01',
    moduleId: 1,
    topic: 'fundamentos',
    topicLabel: 'Fundamentos',
    title: 'Olá, Mundo!',
    description: 'Escreva um programa em C que exiba a mensagem <strong>Hello, World!</strong> no console.',
    difficulty: 'facil',
    starterCode: '#include <stdio.h>\n\nint main() {\n    // Escreva seu codigo aqui\n    return 0;\n}\n',
    testCases: [
      { input: '', expectedOutput: 'Hello, World!', visible: true },
    ],
    hints: [
      'Use printf() para exibir texto.',
      'printf("Hello, World!\\n");',
    ],
    xpReward: 10,
  },
  {
    id: 'c-02',
    moduleId: 1,
    topic: 'fundamentos',
    topicLabel: 'Fundamentos',
    title: 'Soma de dois números',
    description: 'Leia dois números inteiros e exiba a soma deles.',
    difficulty: 'facil',
    starterCode: '#include <stdio.h>\n\nint main() {\n    int a, b;\n    // Leia a e b e imprima a soma\n    return 0;\n}\n',
    testCases: [
      { input: '3 7', expectedOutput: '10', visible: true },
      { input: '10 20', expectedOutput: '30', visible: false },
      { input: '-5 5', expectedOutput: '0', visible: false },
    ],
    hints: [
      'Use scanf("%d %d", &a, &b); para ler dois inteiros.',
      'Use printf("%d\\n", a + b); para exibir o resultado.',
    ],
    xpReward: 15,
  },
  {
    id: 'c-03',
    moduleId: 1,
    topic: 'condicionais',
    topicLabel: 'Condicionais',
    title: 'Maior de dois',
    description: 'Leia dois números inteiros e exiba o maior deles.',
    difficulty: 'facil',
    starterCode: '#include <stdio.h>\n\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    // Imprima o maior\n    return 0;\n}\n',
    testCases: [
      { input: '5 3', expectedOutput: '5', visible: true },
      { input: '2 9', expectedOutput: '9', visible: false },
      { input: '7 7', expectedOutput: '7', visible: false },
    ],
    hints: [
      'Use if/else para comparar a e b.',
    ],
    xpReward: 20,
  },
  {
    id: 'c-04',
    moduleId: 2,
    topic: 'repeticao',
    topicLabel: 'Repetição',
    title: 'Fatorial',
    description: 'Leia um número inteiro <code>n</code> (0 ≤ n ≤ 12) e exiba o seu fatorial.',
    difficulty: 'medio',
    starterCode: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    // Calcule e imprima o fatorial de n\n    return 0;\n}\n',
    testCases: [
      { input: '5', expectedOutput: '120', visible: true },
      { input: '0', expectedOutput: '1', visible: true },
      { input: '10', expectedOutput: '3628800', visible: false },
    ],
    hints: [
      'Fatorial de 0 é 1 por definição.',
      'Use long long para valores maiores: long long fat = 1; for(int i=1; i<=n; i++) fat *= i;',
    ],
    xpReward: 30,
  },
  {
    id: 'c-05',
    moduleId: 2,
    topic: 'repeticao',
    topicLabel: 'Repetição',
    title: 'Soma de N números',
    description: 'Leia um número <code>n</code> e depois <code>n</code> inteiros. Exiba a soma de todos.',
    difficulty: 'medio',
    starterCode: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    // Leia n numeros e imprima a soma\n    return 0;\n}\n',
    testCases: [
      { input: '3\n10\n20\n30', expectedOutput: '60', visible: true },
      { input: '4\n1\n2\n3\n4', expectedOutput: '10', visible: false },
      { input: '1\n99', expectedOutput: '99', visible: false },
    ],
    hints: [
      'Use um loop for e uma variável acumuladora.',
      'int soma = 0; int x; for(int i=0; i<n; i++) { scanf("%d",&x); soma += x; }',
    ],
    xpReward: 30,
  },
  {
    id: 'c-06',
    moduleId: 2,
    topic: 'condicionais',
    topicLabel: 'Condicionais',
    title: 'Número par ou ímpar',
    description: 'Leia um inteiro e exiba <strong>PAR</strong> se for par, ou <strong>IMPAR</strong> se for ímpar.',
    difficulty: 'facil',
    starterCode: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    // Escreva a logica aqui\n    return 0;\n}\n',
    testCases: [
      { input: '4', expectedOutput: 'PAR', visible: true },
      { input: '7', expectedOutput: 'IMPAR', visible: true },
      { input: '0', expectedOutput: 'PAR', visible: false },
    ],
    hints: ['Use o operador de módulo: n % 2 == 0 significa par.'],
    xpReward: 15,
  },
  {
    id: 'c-07',
    moduleId: 3,
    topic: 'funcoes',
    topicLabel: 'Funções',
    title: 'Média de N números',
    description: 'Leia um inteiro <code>n</code> e depois <code>n</code> números reais. Exiba a média com 2 casas decimais.',
    difficulty: 'medio',
    starterCode: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    // Calcule e imprima a media\n    return 0;\n}\n',
    testCases: [
      { input: '3\n6.0\n8.0\n10.0', expectedOutput: '8.00', visible: true },
      { input: '2\n5.0\n7.0', expectedOutput: '6.00', visible: false },
    ],
    hints: [
      'Use double para números reais.',
      'printf("%.2f\\n", soma / n);',
    ],
    xpReward: 35,
  },
];

export function getCExerciseById(id: string): CExercise | undefined {
  return cExercises.find((e) => e.id === id);
}

export function getCTopicsByModule() {
  const map = new Map<number, { moduleId: number; topics: string[] }>();
  cExercises.forEach((ex) => {
    if (!map.has(ex.moduleId)) map.set(ex.moduleId, { moduleId: ex.moduleId, topics: [] });
    const m = map.get(ex.moduleId)!;
    if (!m.topics.includes(ex.topic)) m.topics.push(ex.topic);
  });
  return Array.from(map.values());
}
