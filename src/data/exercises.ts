export interface Exercise {
  id: string;
  moduleId: number;
  /** Tópico dentro do módulo (ex: "variaveis", "loops", "classes") */
  topic: string;
  topicLabel: string;
  title: string;
  description: string;
  difficulty: 'facil' | 'medio' | 'dificil';
  starterCode: string;
  /** Cada test case: roda o código com `input` como stdin e espera `expectedOutput` */
  testCases: { input: string; expectedOutput: string; visible: boolean }[];
  /** Dicas opcionais (reveladas uma por vez) */
  hints?: string[];
  xpReward: number;
}

// ─── Módulo 1: Fundamentos ───────────────────────────────────────────

const fundamentosExercises: Exercise[] = [
  // ── Variáveis e Tipos ──
  {
    id: 'ex-m1-var-01',
    moduleId: 1,
    topic: 'variaveis',
    topicLabel: 'Variáveis e Tipos',
    title: 'Declarar e imprimir variáveis',
    description: 'Declare uma variável `nome` do tipo String com valor "Java" e uma variável `ano` do tipo int com valor 1995. Imprima no formato:\n\nLinguagem: Java\nAno: 1995',
    difficulty: 'facil',
    starterCode: `public class Main {
    public static void main(String[] args) {
        // Declare as variáveis aqui

        // Imprima no formato pedido

    }
}`,
    testCases: [
      { input: '', expectedOutput: 'Linguagem: Java\nAno: 1995', visible: true },
    ],
    hints: ['Use String nome = "Java"; e int ano = 1995;', 'System.out.println("Linguagem: " + nome);'],
    xpReward: 10,
  },
  {
    id: 'ex-m1-var-02',
    moduleId: 1,
    topic: 'variaveis',
    topicLabel: 'Variáveis e Tipos',
    title: 'Calcular área de um retângulo',
    description: 'Leia dois valores inteiros (base e altura) da entrada padrão. Calcule e imprima a área do retângulo.\n\nEntrada: dois inteiros separados por linha\nSaída: "Area: X" onde X é base * altura',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Leia base e altura

        // Calcule e imprima a área

    }
}`,
    testCases: [
      { input: '5\n3', expectedOutput: 'Area: 15', visible: true },
      { input: '10\n7', expectedOutput: 'Area: 70', visible: true },
      { input: '1\n1', expectedOutput: 'Area: 1', visible: false },
    ],
    hints: ['int base = sc.nextInt();', 'System.out.println("Area: " + (base * altura));'],
    xpReward: 10,
  },
  {
    id: 'ex-m1-var-03',
    moduleId: 1,
    topic: 'variaveis',
    topicLabel: 'Variáveis e Tipos',
    title: 'Conversão de temperatura',
    description: 'Leia uma temperatura em Celsius (double) e converta para Fahrenheit.\nFórmula: F = C * 9/5 + 32\n\nImprima o resultado com 1 casa decimal no formato: "F: X" (ex: "F: 98.6")',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Leia celsius e converta

    }
}`,
    testCases: [
      { input: '37.0', expectedOutput: 'F: 98.6', visible: true },
      { input: '0.0', expectedOutput: 'F: 32.0', visible: true },
      { input: '100.0', expectedOutput: 'F: 212.0', visible: false },
    ],
    hints: ['double celsius = sc.nextDouble();', 'Use String.format("F: %.1f", fahrenheit)'],
    xpReward: 10,
  },

  // ── Operadores ──
  {
    id: 'ex-m1-op-01',
    moduleId: 1,
    topic: 'operadores',
    topicLabel: 'Operadores',
    title: 'Par ou ímpar',
    description: 'Leia um número inteiro e imprima "par" se for par ou "impar" se for ímpar.',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Verifique se é par ou ímpar

    }
}`,
    testCases: [
      { input: '4', expectedOutput: 'par', visible: true },
      { input: '7', expectedOutput: 'impar', visible: true },
      { input: '0', expectedOutput: 'par', visible: false },
      { input: '-3', expectedOutput: 'impar', visible: false },
    ],
    hints: ['Use o operador módulo: n % 2'],
    xpReward: 10,
  },
  {
    id: 'ex-m1-op-02',
    moduleId: 1,
    topic: 'operadores',
    topicLabel: 'Operadores',
    title: 'Maior de três números',
    description: 'Leia três números inteiros e imprima o maior deles.\n\nSaída: "Maior: X"',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        // Encontre e imprima o maior

    }
}`,
    testCases: [
      { input: '3\n7\n5', expectedOutput: 'Maior: 7', visible: true },
      { input: '10\n10\n5', expectedOutput: 'Maior: 10', visible: true },
      { input: '-1\n-5\n-3', expectedOutput: 'Maior: -1', visible: false },
    ],
    hints: ['Use Math.max(a, Math.max(b, c))'],
    xpReward: 15,
  },

  // ── Condicionais ──
  {
    id: 'ex-m1-if-01',
    moduleId: 1,
    topic: 'condicionais',
    topicLabel: 'if/else e switch',
    title: 'Classificar idade',
    description: 'Leia uma idade (int) e classifique:\n- 0 a 12: "crianca"\n- 13 a 17: "adolescente"\n- 18 a 59: "adulto"\n- 60 ou mais: "idoso"',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int idade = sc.nextInt();
        // Classifique a idade

    }
}`,
    testCases: [
      { input: '5', expectedOutput: 'crianca', visible: true },
      { input: '15', expectedOutput: 'adolescente', visible: true },
      { input: '30', expectedOutput: 'adulto', visible: false },
      { input: '70', expectedOutput: 'idoso', visible: false },
    ],
    hints: ['Use if/else if/else encadeados'],
    xpReward: 10,
  },
  {
    id: 'ex-m1-if-02',
    moduleId: 1,
    topic: 'condicionais',
    topicLabel: 'if/else e switch',
    title: 'Calculadora simples',
    description: 'Leia dois números double e um operador (+, -, *, /). Imprima o resultado com 2 casas decimais.\nSe o operador for / e o segundo número for 0, imprima "Erro: divisao por zero".\nSe o operador for inválido, imprima "Operador invalido".\n\nFormato de entrada:\n5.0\n3.0\n+\n\nFormato de saída: "Resultado: 8.00"',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double a = sc.nextDouble();
        double b = sc.nextDouble();
        String op = sc.next();
        // Implemente a calculadora

    }
}`,
    testCases: [
      { input: '5.0\n3.0\n+', expectedOutput: 'Resultado: 8.00', visible: true },
      { input: '10.0\n4.0\n/', expectedOutput: 'Resultado: 2.50', visible: true },
      { input: '7.0\n0.0\n/', expectedOutput: 'Erro: divisao por zero', visible: true },
      { input: '5.0\n3.0\n%', expectedOutput: 'Operador invalido', visible: false },
    ],
    hints: ['Use switch(op) para cada operador', 'String.format("Resultado: %.2f", resultado)'],
    xpReward: 20,
  },

  // ── Loops ──
  {
    id: 'ex-m1-loop-01',
    moduleId: 1,
    topic: 'loops',
    topicLabel: 'Laços',
    title: 'Tabuada',
    description: 'Leia um número inteiro N e imprima sua tabuada de 1 a 10.\nCada linha no formato: "N x I = R" (ex: "5 x 1 = 5")',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Imprima a tabuada

    }
}`,
    testCases: [
      { input: '5', expectedOutput: '5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50', visible: true },
      { input: '3', expectedOutput: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30', visible: false },
    ],
    hints: ['for (int i = 1; i <= 10; i++)'],
    xpReward: 10,
  },
  {
    id: 'ex-m1-loop-02',
    moduleId: 1,
    topic: 'loops',
    topicLabel: 'Laços',
    title: 'Somatório',
    description: 'Leia N números inteiros (primeira linha = quantidade, depois os N números um por linha) e imprima a soma.\n\nSaída: "Soma: X"',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Leia n números e calcule a soma

    }
}`,
    testCases: [
      { input: '3\n10\n20\n30', expectedOutput: 'Soma: 60', visible: true },
      { input: '5\n1\n2\n3\n4\n5', expectedOutput: 'Soma: 15', visible: true },
      { input: '1\n42', expectedOutput: 'Soma: 42', visible: false },
    ],
    hints: ['Crie uma variável soma = 0 e some dentro do loop'],
    xpReward: 10,
  },
  {
    id: 'ex-m1-loop-03',
    moduleId: 1,
    topic: 'loops',
    topicLabel: 'Laços',
    title: 'Fatorial',
    description: 'Leia um número inteiro N (0 <= N <= 20) e imprima seu fatorial.\n\nSaída: "N! = X" (ex: "5! = 120")\nLembre-se: 0! = 1',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Calcule e imprima o fatorial

    }
}`,
    testCases: [
      { input: '5', expectedOutput: '5! = 120', visible: true },
      { input: '0', expectedOutput: '0! = 1', visible: true },
      { input: '10', expectedOutput: '10! = 3628800', visible: false },
    ],
    hints: ['Use long para o resultado (int estoura para N > 12)', 'Comece com resultado = 1 e multiplique de 1 a N'],
    xpReward: 15,
  },
  {
    id: 'ex-m1-loop-04',
    moduleId: 1,
    topic: 'loops',
    topicLabel: 'Laços',
    title: 'Fibonacci',
    description: 'Leia um número N e imprima os N primeiros termos da sequência de Fibonacci, separados por espaço.\nSequência: 0, 1, 1, 2, 3, 5, 8, ...',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Imprima os N primeiros termos de Fibonacci

    }
}`,
    testCases: [
      { input: '7', expectedOutput: '0 1 1 2 3 5 8', visible: true },
      { input: '1', expectedOutput: '0', visible: true },
      { input: '2', expectedOutput: '0 1', visible: false },
    ],
    hints: ['Use duas variáveis a=0, b=1 e vá atualizando', 'Cuidado com espaço no final — use StringBuilder ou condição'],
    xpReward: 20,
  },

  // ── Arrays ──
  {
    id: 'ex-m1-arr-01',
    moduleId: 1,
    topic: 'arrays',
    topicLabel: 'Vetores e Matrizes',
    title: 'Inverter vetor',
    description: 'Leia N (tamanho do vetor), depois N inteiros. Imprima os elementos na ordem inversa, separados por espaço.',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] v = new int[n];
        for (int i = 0; i < n; i++) {
            v[i] = sc.nextInt();
        }
        // Imprima o vetor invertido

    }
}`,
    testCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1', visible: true },
      { input: '3\n10 20 30', expectedOutput: '30 20 10', visible: true },
      { input: '1\n7', expectedOutput: '7', visible: false },
    ],
    hints: ['Percorra de v.length-1 até 0'],
    xpReward: 10,
  },
  {
    id: 'ex-m1-arr-02',
    moduleId: 1,
    topic: 'arrays',
    topicLabel: 'Vetores e Matrizes',
    title: 'Média e acima da média',
    description: 'Leia N e depois N doubles. Calcule a média e imprima:\n1) "Media: X.XX" (2 casas)\n2) A quantidade de elementos acima da média: "Acima: Y"',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        double[] v = new double[n];
        for (int i = 0; i < n; i++) {
            v[i] = sc.nextDouble();
        }
        // Calcule a média e conte acima

    }
}`,
    testCases: [
      { input: '4\n10.0 20.0 30.0 40.0', expectedOutput: 'Media: 25.00\nAcima: 2', visible: true },
      { input: '3\n5.0 5.0 5.0', expectedOutput: 'Media: 5.00\nAcima: 0', visible: false },
    ],
    hints: ['Primeiro loop para somar, segundo para contar acima da média'],
    xpReward: 15,
  },
  {
    id: 'ex-m1-arr-03',
    moduleId: 1,
    topic: 'arrays',
    topicLabel: 'Vetores e Matrizes',
    title: 'Soma de matrizes',
    description: 'Leia as dimensões M e N, depois duas matrizes M×N de inteiros. Imprima a soma das matrizes.\nCada linha da saída deve ter os valores separados por espaço.',
    difficulty: 'dificil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        int n = sc.nextInt();
        // Leia as duas matrizes e imprima a soma

    }
}`,
    testCases: [
      { input: '2 2\n1 2\n3 4\n5 6\n7 8', expectedOutput: '6 8\n10 12', visible: true },
      { input: '1 3\n1 2 3\n4 5 6', expectedOutput: '5 7 9', visible: false },
    ],
    hints: ['Crie int[][] a e int[][] b, leia ambas, depois some elemento a elemento'],
    xpReward: 25,
  },

  // ── Funções ──
  {
    id: 'ex-m1-func-01',
    moduleId: 1,
    topic: 'funcoes',
    topicLabel: 'Funções (Métodos)',
    title: 'Verificar primo',
    description: 'Crie um método `static boolean ehPrimo(int n)` que retorna true se n é primo.\nLeia um inteiro e imprima "primo" ou "nao primo".',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {

    static boolean ehPrimo(int n) {
        // Implemente aqui
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(ehPrimo(n) ? "primo" : "nao primo");
    }
}`,
    testCases: [
      { input: '7', expectedOutput: 'primo', visible: true },
      { input: '4', expectedOutput: 'nao primo', visible: true },
      { input: '1', expectedOutput: 'nao primo', visible: false },
      { input: '2', expectedOutput: 'primo', visible: false },
    ],
    hints: ['Se n < 2, não é primo', 'Teste divisores de 2 até Math.sqrt(n)'],
    xpReward: 20,
  },
  {
    id: 'ex-m1-func-02',
    moduleId: 1,
    topic: 'funcoes',
    topicLabel: 'Funções (Métodos)',
    title: 'Palíndromo',
    description: 'Crie um método `static boolean ehPalindromo(String s)` que verifica se uma string é palíndromo (ignorando maiúsculas/minúsculas).\nLeia uma string e imprima "sim" ou "nao".',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {

    static boolean ehPalindromo(String s) {
        // Implemente aqui
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(ehPalindromo(s) ? "sim" : "nao");
    }
}`,
    testCases: [
      { input: 'Ana', expectedOutput: 'sim', visible: true },
      { input: 'Java', expectedOutput: 'nao', visible: true },
      { input: 'arara', expectedOutput: 'sim', visible: false },
    ],
    hints: ['Converta para minúsculas primeiro: s.toLowerCase()', 'Compare caractere a caractere das pontas para o centro'],
    xpReward: 20,
  },
];

// ─── Módulo 2: Intermediário ─────────────────────────────────────────

const intermediarioExercises: Exercise[] = [
  // ── Scanner / I-O ──
  {
    id: 'ex-m2-io-01',
    moduleId: 2,
    topic: 'io',
    topicLabel: 'Entrada e Saída',
    title: 'Ler múltiplas linhas',
    description: 'Leia linhas até encontrar "FIM". Imprima quantas linhas foram lidas (sem contar "FIM").\nSaída: "Total: X"',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Leia linhas até "FIM"

    }
}`,
    testCases: [
      { input: 'ola\nmundo\nFIM', expectedOutput: 'Total: 2', visible: true },
      { input: 'FIM', expectedOutput: 'Total: 0', visible: true },
      { input: 'a\nb\nc\nd\nFIM', expectedOutput: 'Total: 4', visible: false },
    ],
    hints: ['Use while(!linha.equals("FIM"))'],
    xpReward: 10,
  },

  // ── Strings ──
  {
    id: 'ex-m2-str-01',
    moduleId: 2,
    topic: 'strings',
    topicLabel: 'Strings',
    title: 'Contar vogais',
    description: 'Leia uma string e imprima a quantidade de vogais (a, e, i, o, u — considere maiúsculas e minúsculas).\nSaída: "Vogais: X"',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        // Conte as vogais

    }
}`,
    testCases: [
      { input: 'Hello World', expectedOutput: 'Vogais: 3', visible: true },
      { input: 'AEIOU', expectedOutput: 'Vogais: 5', visible: true },
      { input: 'xyz', expectedOutput: 'Vogais: 0', visible: false },
    ],
    hints: ['Converta para minúsculas e verifique se "aeiou".indexOf(c) >= 0'],
    xpReward: 10,
  },
  {
    id: 'ex-m2-str-02',
    moduleId: 2,
    topic: 'strings',
    topicLabel: 'Strings',
    title: 'Inverter palavras',
    description: 'Leia uma frase e imprima as palavras na ordem inversa.\nExemplo: "Java eh legal" → "legal eh Java"',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String frase = sc.nextLine();
        // Inverta a ordem das palavras

    }
}`,
    testCases: [
      { input: 'Java eh legal', expectedOutput: 'legal eh Java', visible: true },
      { input: 'Hello', expectedOutput: 'Hello', visible: true },
      { input: 'um dois tres quatro', expectedOutput: 'quatro tres dois um', visible: false },
    ],
    hints: ['Use split(" ") para separar as palavras', 'Percorra o array de trás pra frente'],
    xpReward: 15,
  },
  {
    id: 'ex-m2-str-03',
    moduleId: 2,
    topic: 'strings',
    topicLabel: 'Strings',
    title: 'Senha forte?',
    description: 'Leia uma senha e verifique se é "forte". Regras:\n- Pelo menos 8 caracteres\n- Pelo menos 1 letra maiúscula\n- Pelo menos 1 dígito\n\nImprima "forte" ou "fraca".',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String senha = sc.nextLine();
        // Verifique a força da senha

    }
}`,
    testCases: [
      { input: 'Abc12345', expectedOutput: 'forte', visible: true },
      { input: 'abc123', expectedOutput: 'fraca', visible: true },
      { input: 'ABCDEFGH', expectedOutput: 'fraca', visible: false },
      { input: 'Ab1', expectedOutput: 'fraca', visible: false },
    ],
    hints: ['Use Character.isUpperCase() e Character.isDigit()', 'Verifique as 3 condições com flags booleanas'],
    xpReward: 20,
  },

  // ── Collections ──
  {
    id: 'ex-m2-col-01',
    moduleId: 2,
    topic: 'collections',
    topicLabel: 'Collections',
    title: 'Remover duplicatas',
    description: 'Leia N e depois N inteiros. Imprima apenas os valores únicos (sem duplicatas), na ordem em que aparecem, separados por espaço.',
    difficulty: 'medio',
    starterCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Leia os números e remova duplicatas

    }
}`,
    testCases: [
      { input: '7\n1 2 3 2 1 4 3', expectedOutput: '1 2 3 4', visible: true },
      { input: '3\n5 5 5', expectedOutput: '5', visible: true },
      { input: '4\n1 2 3 4', expectedOutput: '1 2 3 4', visible: false },
    ],
    hints: ['LinkedHashSet mantém a ordem de inserção e remove duplicatas'],
    xpReward: 15,
  },
  {
    id: 'ex-m2-col-02',
    moduleId: 2,
    topic: 'collections',
    topicLabel: 'Collections',
    title: 'Contar frequência de palavras',
    description: 'Leia N e depois N palavras. Imprima cada palavra única e sua frequência em ordem alfabética.\nFormato: "palavra: X" (uma por linha)',
    difficulty: 'dificil',
    starterCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Conte a frequência de cada palavra

    }
}`,
    testCases: [
      { input: '5\njava java python java python', expectedOutput: 'java: 3\npython: 2', visible: true },
      { input: '3\na b c', expectedOutput: 'a: 1\nb: 1\nc: 1', visible: false },
    ],
    hints: ['Use TreeMap<String, Integer> para ordenar automaticamente', 'map.merge(palavra, 1, Integer::sum)'],
    xpReward: 25,
  },
];

// ─── Módulo 3: POO ───────────────────────────────────────────────────

const pooExercises: Exercise[] = [
  // ── Classes e Objetos ──
  {
    id: 'ex-m3-class-01',
    moduleId: 3,
    topic: 'classes',
    topicLabel: 'Classes e Objetos',
    title: 'Classe Retangulo',
    description: 'Crie uma classe Retangulo com atributos double base e double altura, um construtor, e métodos:\n- double area()\n- double perimetro()\n\nNo main, leia base e altura, crie o objeto e imprima:\n"Area: X.XX"\n"Perimetro: X.XX"',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

// Crie a classe Retangulo aqui (pode ser dentro do arquivo)

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double base = sc.nextDouble();
        double altura = sc.nextDouble();
        // Crie o objeto e imprima

    }
}`,
    testCases: [
      { input: '5.0\n3.0', expectedOutput: 'Area: 15.00\nPerimetro: 16.00', visible: true },
      { input: '10.0\n10.0', expectedOutput: 'Area: 100.00\nPerimetro: 40.00', visible: false },
    ],
    hints: ['Em Java, classes não-public podem ficar no mesmo arquivo', 'Use String.format("Area: %.2f", ret.area())'],
    xpReward: 15,
  },
  {
    id: 'ex-m3-class-02',
    moduleId: 3,
    topic: 'classes',
    topicLabel: 'Classes e Objetos',
    title: 'Classe ContaBancaria',
    description: 'Crie uma classe ContaBancaria com:\n- Atributo private double saldo (inicia em 0)\n- void depositar(double valor) — só aceita valor > 0\n- boolean sacar(double valor) — retorna false se saldo insuficiente\n- double getSaldo()\n\nNo main, leia operações até "FIM":\n- "D 100.0" = depositar\n- "S 50.0" = sacar (se falhar, imprima "Saldo insuficiente")\n\nAo final, imprima "Saldo: X.XX"',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

class ContaBancaria {
    // Implemente aqui
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ContaBancaria conta = new ContaBancaria();
        // Processe as operações

    }
}`,
    testCases: [
      { input: 'D 100.0\nD 50.0\nS 30.0\nFIM', expectedOutput: 'Saldo: 120.00', visible: true },
      { input: 'D 50.0\nS 100.0\nFIM', expectedOutput: 'Saldo insuficiente\nSaldo: 50.00', visible: true },
      { input: 'FIM', expectedOutput: 'Saldo: 0.00', visible: false },
    ],
    hints: ['Use sc.nextLine() e split(" ") para separar operação e valor', 'Lembre de usar private e getter'],
    xpReward: 25,
  },

  // ── Encapsulamento ──
  {
    id: 'ex-m3-encap-01',
    moduleId: 3,
    topic: 'encapsulamento',
    topicLabel: 'Encapsulamento',
    title: 'Classe Produto com validação',
    description: 'Crie uma classe Produto com:\n- private String nome\n- private double preco\n- Construtor que recebe nome e preco\n- setPreco(double p) que só aceita p >= 0 (senão mantém o atual)\n- toString() retornando "Nome - R$ X.XX"\n\nLeia nome, preco inicial, e um novo preco. Imprima o produto antes e depois da tentativa de alteração.',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

class Produto {
    // Implemente aqui
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String nome = sc.nextLine();
        double preco = sc.nextDouble();
        double novoPreco = sc.nextDouble();

        Produto p = new Produto(nome, preco);
        System.out.println(p);
        p.setPreco(novoPreco);
        System.out.println(p);
    }
}`,
    testCases: [
      { input: 'Notebook\n2500.0\n2800.0', expectedOutput: 'Notebook - R$ 2500.00\nNotebook - R$ 2800.00', visible: true },
      { input: 'Mouse\n50.0\n-10.0', expectedOutput: 'Mouse - R$ 50.00\nMouse - R$ 50.00', visible: true },
    ],
    hints: ['@Override public String toString() { return nome + " - R$ " + String.format("%.2f", preco); }'],
    xpReward: 20,
  },

  // ── Herança ──
  {
    id: 'ex-m3-her-01',
    moduleId: 3,
    topic: 'heranca',
    topicLabel: 'Herança',
    title: 'Hierarquia de Animais',
    description: 'Crie:\n- Classe Animal com atributo nome e método String falar() que retorna "..."\n- Classe Cachorro extends Animal: falar() retorna "Au au"\n- Classe Gato extends Animal: falar() retorna "Miau"\n\nNo main, leia o tipo ("cachorro" ou "gato") e o nome. Imprima: "Nome fala: Som"',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

class Animal {
    String nome;
    Animal(String nome) { this.nome = nome; }
    String falar() { return "..."; }
}

// Crie Cachorro e Gato aqui

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String tipo = sc.nextLine();
        String nome = sc.nextLine();
        // Crie o animal correto e imprima

    }
}`,
    testCases: [
      { input: 'cachorro\nRex', expectedOutput: 'Rex fala: Au au', visible: true },
      { input: 'gato\nMimi', expectedOutput: 'Mimi fala: Miau', visible: true },
    ],
    hints: ['class Cachorro extends Animal { ... @Override String falar() ... }'],
    xpReward: 15,
  },
  {
    id: 'ex-m3-her-02',
    moduleId: 3,
    topic: 'heranca',
    topicLabel: 'Herança',
    title: 'Sistema de funcionários',
    description: 'Crie:\n- Classe Funcionario com nome (String) e salarioBase (double)\n- Método double calcularSalario() retorna salarioBase\n- Classe Gerente extends Funcionario: calcularSalario() retorna salarioBase * 1.5\n- Classe Estagiario extends Funcionario: calcularSalario() retorna salarioBase * 0.7\n\nLeia tipo (gerente/estagiario/outro), nome e salário base.\nImprima: "Nome: NOME\\nSalario: X.XX"',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

class Funcionario {
    // Implemente
}

// Crie Gerente e Estagiario

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String tipo = sc.nextLine();
        String nome = sc.nextLine();
        double salario = sc.nextDouble();
        // Crie o funcionário correto e imprima

    }
}`,
    testCases: [
      { input: 'gerente\nMaria\n5000.0', expectedOutput: 'Nome: Maria\nSalario: 7500.00', visible: true },
      { input: 'estagiario\nJoao\n2000.0', expectedOutput: 'Nome: Joao\nSalario: 1400.00', visible: true },
      { input: 'outro\nAna\n3000.0', expectedOutput: 'Nome: Ana\nSalario: 3000.00', visible: false },
    ],
    hints: ['Use @Override em calcularSalario()', 'String.format("Salario: %.2f", func.calcularSalario())'],
    xpReward: 25,
  },

  // ── Polimorfismo ──
  {
    id: 'ex-m3-poly-01',
    moduleId: 3,
    topic: 'polimorfismo',
    topicLabel: 'Polimorfismo',
    title: 'Formas geométricas',
    description: 'Crie:\n- Classe abstrata Forma com método abstrato double area()\n- Classe Circulo (raio) extends Forma\n- Classe Quadrado (lado) extends Forma\n\nLeia N formas. Cada linha: "circulo 5.0" ou "quadrado 3.0"\nAo final, imprima "Total: X.XX" (soma das áreas, 2 casas).\nUse Math.PI para pi.',
    difficulty: 'dificil',
    starterCode: `import java.util.Scanner;
import java.util.ArrayList;

abstract class Forma {
    abstract double area();
}

// Crie Circulo e Quadrado

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); sc.nextLine();
        ArrayList<Forma> formas = new ArrayList<>();
        // Leia as formas e calcule a área total

    }
}`,
    testCases: [
      { input: '2\ncirculo 1.0\nquadrado 2.0', expectedOutput: 'Total: 7.14', visible: true },
      { input: '1\ncirculo 5.0', expectedOutput: 'Total: 78.54', visible: false },
    ],
    hints: ['Math.PI * raio * raio para círculo', 'lado * lado para quadrado'],
    xpReward: 30,
  },

  // ── Interfaces ──
  {
    id: 'ex-m3-iface-01',
    moduleId: 3,
    topic: 'interfaces',
    topicLabel: 'Interfaces',
    title: 'Implementar Comparable',
    description: 'Crie uma classe Aluno com nome (String) e nota (double) que implementa Comparable<Aluno> (ordena por nota decrescente).\n\nLeia N alunos (nome nota por linha). Ordene e imprima cada um: "nome: X.X"',
    difficulty: 'dificil',
    starterCode: `import java.util.*;

class Aluno implements Comparable<Aluno> {
    String nome;
    double nota;
    // Implemente construtor e compareTo
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); sc.nextLine();
        List<Aluno> alunos = new ArrayList<>();
        // Leia, ordene e imprima

    }
}`,
    testCases: [
      { input: '3\nAna 8.5\nBruno 9.2\nCarla 7.0', expectedOutput: 'Bruno: 9.2\nAna: 8.5\nCarla: 7.0', visible: true },
      { input: '2\nX 5.0\nY 10.0', expectedOutput: 'Y: 10.0\nX: 5.0', visible: false },
    ],
    hints: ['compareTo deve retornar Double.compare(other.nota, this.nota) para decrescente', 'Use Collections.sort(alunos)'],
    xpReward: 30,
  },

  // ── Classes Abstratas ──
  {
    id: 'ex-m3-abs-01',
    moduleId: 3,
    topic: 'abstracao',
    topicLabel: 'Classes Abstratas',
    title: 'Template Method — Bebida',
    description: 'Crie:\n- Classe abstrata Bebida com método void preparar() que imprime:\n  "Fervendo agua"\n  depois chama String adicionar() (abstrato)\n  depois imprime "Servindo: " + adicionar()\n- Classe Cafe: adicionar() retorna "cafe"\n- Classe Cha: adicionar() retorna "cha"\n\nLeia o tipo ("cafe" ou "cha") e chame preparar().',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

abstract class Bebida {
    // Implemente
}

// Crie Cafe e Cha

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String tipo = sc.nextLine();
        // Crie a bebida e chame preparar()

    }
}`,
    testCases: [
      { input: 'cafe', expectedOutput: 'Fervendo agua\nServindo: cafe', visible: true },
      { input: 'cha', expectedOutput: 'Fervendo agua\nServindo: cha', visible: true },
    ],
    hints: ['abstract String adicionar();', 'preparar() { println("Fervendo agua"); println("Servindo: " + adicionar()); }'],
    xpReward: 20,
  },

  // ── Composição ──
  {
    id: 'ex-m3-comp-01',
    moduleId: 3,
    topic: 'composicao',
    topicLabel: 'Composição',
    title: 'Endereço dentro de Pessoa',
    description: 'Crie:\n- Classe Endereco com rua (String) e numero (int)\n- Classe Pessoa com nome (String) e Endereco\n- Pessoa.toString() retorna "Nome mora em Rua, Num"\n\nLeia nome, rua e número. Imprima a pessoa.',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

class Endereco {
    // Implemente
}

class Pessoa {
    // Implemente com composição
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String nome = sc.nextLine();
        String rua = sc.nextLine();
        int num = sc.nextInt();
        // Crie e imprima

    }
}`,
    testCases: [
      { input: 'Ana\nRua Java\n42', expectedOutput: 'Ana mora em Rua Java, 42', visible: true },
      { input: 'Bob\nAv Principal\n100', expectedOutput: 'Bob mora em Av Principal, 100', visible: false },
    ],
    hints: ['Pessoa tem um Endereco como atributo (composição, não herança)'],
    xpReward: 15,
  },

  // ── Exceções ──
  {
    id: 'ex-m3-exc-01',
    moduleId: 3,
    topic: 'excecoes',
    topicLabel: 'Exceções',
    title: 'Divisão segura',
    description: 'Leia dois inteiros e tente dividir o primeiro pelo segundo.\nSe o segundo for 0, capture a exceção e imprima "Erro: divisao por zero".\nSe a entrada não for número, imprima "Erro: entrada invalida".\nSenão imprima "Resultado: X" (inteiro).',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Use try/catch para tratar erros

    }
}`,
    testCases: [
      { input: '10\n3', expectedOutput: 'Resultado: 3', visible: true },
      { input: '10\n0', expectedOutput: 'Erro: divisao por zero', visible: true },
      { input: 'abc\n5', expectedOutput: 'Erro: entrada invalida', visible: false },
    ],
    hints: ['ArithmeticException para divisão por zero', 'InputMismatchException ou NumberFormatException para entrada inválida'],
    xpReward: 20,
  },
  {
    id: 'ex-m3-exc-02',
    moduleId: 3,
    topic: 'excecoes',
    topicLabel: 'Exceções',
    title: 'Exceção personalizada',
    description: 'Crie uma exceção IdadeInvalidaException.\nCrie um método void validarIdade(int idade) que lança a exceção se idade < 0 ou > 150, com mensagem "Idade invalida: X".\n\nLeia uma idade, valide e imprima "Idade valida: X" ou a mensagem da exceção.',
    difficulty: 'dificil',
    starterCode: `import java.util.Scanner;

class IdadeInvalidaException extends Exception {
    // Implemente
}

public class Main {

    static void validarIdade(int idade) throws IdadeInvalidaException {
        // Implemente
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int idade = sc.nextInt();
        // Use try/catch

    }
}`,
    testCases: [
      { input: '25', expectedOutput: 'Idade valida: 25', visible: true },
      { input: '-5', expectedOutput: 'Idade invalida: -5', visible: true },
      { input: '200', expectedOutput: 'Idade invalida: 200', visible: false },
    ],
    hints: ['class IdadeInvalidaException extends Exception { IdadeInvalidaException(String msg) { super(msg); } }'],
    xpReward: 25,
  },

  // ── SOLID ──
  {
    id: 'ex-m3-solid-01',
    moduleId: 3,
    topic: 'solid',
    topicLabel: 'SOLID',
    title: 'Princípio da Responsabilidade Única',
    description: 'Refatore o código: separe a lógica de cálculo da lógica de exibição.\n\nCrie:\n- Classe Calculadora com método static double calcularMedia(double[] notas)\n- Classe Relatorio com método static String gerar(String aluno, double media) que retorna "Aluno: X\\nMedia: Y.YY\\nSituacao: Z" (Z = "Aprovado" se media >= 7, senão "Reprovado")\n\nLeia nome, N e N notas. Imprima o relatório.',
    difficulty: 'dificil',
    starterCode: `import java.util.Scanner;

class Calculadora {
    // Implemente
}

class Relatorio {
    // Implemente
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String nome = sc.nextLine();
        int n = sc.nextInt();
        double[] notas = new double[n];
        for (int i = 0; i < n; i++) notas[i] = sc.nextDouble();
        // Use Calculadora e Relatorio

    }
}`,
    testCases: [
      { input: 'Ana\n3\n8.0 7.0 9.0', expectedOutput: 'Aluno: Ana\nMedia: 8.00\nSituacao: Aprovado', visible: true },
      { input: 'Bob\n2\n5.0 4.0', expectedOutput: 'Aluno: Bob\nMedia: 4.50\nSituacao: Reprovado', visible: true },
    ],
    hints: ['Calculadora só calcula, Relatorio só formata — Single Responsibility'],
    xpReward: 30,
  },
];

// ─── Exportação ──────────────────────────────────────────────────────

export const exercises: Exercise[] = [
  ...fundamentosExercises,
  ...intermediarioExercises,
  ...pooExercises,
];

/** Retorna todos os tópicos únicos agrupados por módulo */
export function getTopicsByModule(): { moduleId: number; topics: { id: string; label: string }[] }[] {
  const map = new Map<number, Map<string, string>>();
  for (const ex of exercises) {
    if (!map.has(ex.moduleId)) map.set(ex.moduleId, new Map());
    map.get(ex.moduleId)!.set(ex.topic, ex.topicLabel);
  }
  return Array.from(map.entries()).map(([moduleId, topics]) => ({
    moduleId,
    topics: Array.from(topics.entries()).map(([id, label]) => ({ id, label })),
  }));
}

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}
