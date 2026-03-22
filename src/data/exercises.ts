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

  // ── Entrada e Saída (Scanner) ──
  {
    id: 'ex-m1-io-01',
    moduleId: 1,
    topic: 'io',
    topicLabel: 'Entrada e Saída',
    title: 'Ler nome e idade',
    description: 'Leia o nome (nextLine) e a idade (nextInt) de uma pessoa. Imprima no formato:\n\n"Nome: X, Idade: Y anos"',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: 'Maria\n25', expectedOutput: 'Nome: Maria, Idade: 25 anos', visible: true },
      { input: 'Joao\n30', expectedOutput: 'Nome: Joao, Idade: 30 anos', visible: true },
      { input: 'Ana\n0', expectedOutput: 'Nome: Ana, Idade: 0 anos', visible: false },
    ],
    hints: ['Use sc.nextLine() para ler o nome e sc.nextInt() para a idade', 'System.out.println("Nome: " + nome + ", Idade: " + idade + " anos");'],
    xpReward: 10,
  },
  {
    id: 'ex-m1-io-02',
    moduleId: 1,
    topic: 'io',
    topicLabel: 'Entrada e Saída',
    title: 'Calculadora simples',
    description: 'Leia dois números double e um operador (+, -, *, /). Imprima o resultado com 2 casas decimais no formato "Resultado: X.XX".\nSe a operação for divisão e o segundo número for 0, imprima "Erro: divisao por zero".\n\nFormato de entrada:\n5.0\n3.0\n+',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '5.0\n3.0\n+', expectedOutput: 'Resultado: 8.00', visible: true },
      { input: '10.0\n4.0\n/', expectedOutput: 'Resultado: 2.50', visible: true },
      { input: '7.0\n0.0\n/', expectedOutput: 'Erro: divisao por zero', visible: false },
    ],
    hints: ['Use sc.nextDouble() para os números e sc.next() para o operador', 'Use String.format("Resultado: %.2f", resultado) para formatar'],
    xpReward: 10,
  },
  {
    id: 'ex-m1-io-03',
    moduleId: 1,
    topic: 'io',
    topicLabel: 'Entrada e Saída',
    title: 'Dados do produto',
    description: 'Leia o nome do produto (String), a quantidade (int) e o preço unitário (double). Imprima:\n\n"Produto: X"\n"Quantidade: Y"\n"Total: R$ Z.ZZ"\n\nOnde Z.ZZ é quantidade * preço unitário com 2 casas decimais.',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: 'Caneta\n10\n2.50', expectedOutput: 'Produto: Caneta\nQuantidade: 10\nTotal: R$ 25.00', visible: true },
      { input: 'Caderno\n3\n15.99', expectedOutput: 'Produto: Caderno\nQuantidade: 3\nTotal: R$ 47.97', visible: true },
      { input: 'Borracha\n1\n1.00', expectedOutput: 'Produto: Borracha\nQuantidade: 1\nTotal: R$ 1.00', visible: false },
    ],
    hints: ['Use sc.nextLine() para o nome, sc.nextInt() para quantidade e sc.nextDouble() para preço', 'Use String.format("Total: R$ %.2f", quantidade * preco) para formatar o total'],
    xpReward: 15,
  },

  // ── if/else (extras) ──
  {
    id: 'ex-m1-if-03',
    moduleId: 1,
    topic: 'condicionais',
    topicLabel: 'if/else e switch',
    title: 'Classificar numero',
    description: 'Leia um número inteiro e imprima:\n- "positivo" se for maior que zero\n- "negativo" se for menor que zero\n- "zero" se for igual a zero',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '5', expectedOutput: 'positivo', visible: true },
      { input: '-3', expectedOutput: 'negativo', visible: true },
      { input: '0', expectedOutput: 'zero', visible: false },
    ],
    hints: ['Use if (n > 0) para verificar se é positivo', 'Use else if (n < 0) para negativo e else para zero'],
    xpReward: 10,
  },
  {
    id: 'ex-m1-if-04',
    moduleId: 1,
    topic: 'condicionais',
    topicLabel: 'if/else e switch',
    title: 'Maior de tres',
    description: 'Leia três números inteiros e imprima o maior deles.',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '3\n7\n5', expectedOutput: '7', visible: true },
      { input: '10\n10\n5', expectedOutput: '10', visible: true },
      { input: '-1\n-5\n-3', expectedOutput: '-1', visible: false },
    ],
    hints: ['Use Math.max(a, Math.max(b, c)) para encontrar o maior', 'Ou use if/else if comparando os três valores'],
    xpReward: 10,
  },
  {
    id: 'ex-m1-if-05',
    moduleId: 1,
    topic: 'condicionais',
    topicLabel: 'if/else e switch',
    title: 'Classificar triangulo',
    description: 'Leia três valores double representando os lados de um triângulo. Verifique se formam um triângulo válido (a soma de dois lados deve ser maior que o terceiro). Se não formar, imprima "Nao forma triangulo".\nSe formar, classifique:\n- "Equilatero" (3 lados iguais)\n- "Isosceles" (2 lados iguais)\n- "Escaleno" (3 lados diferentes)',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '3.0\n3.0\n3.0', expectedOutput: 'Equilatero', visible: true },
      { input: '3.0\n3.0\n5.0', expectedOutput: 'Isosceles', visible: true },
      { input: '1.0\n2.0\n10.0', expectedOutput: 'Nao forma triangulo', visible: false },
      { input: '3.0\n4.0\n5.0', expectedOutput: 'Escaleno', visible: false },
    ],
    hints: ['Condição de triângulo: a + b > c && a + c > b && b + c > a', 'Verifique igualdade dos lados com == para doubles com os mesmos valores de entrada'],
    xpReward: 15,
  },
  {
    id: 'ex-m1-if-06',
    moduleId: 1,
    topic: 'condicionais',
    topicLabel: 'if/else e switch',
    title: 'Calculadora de IMC',
    description: 'Leia o peso (double, em kg) e a altura (double, em metros). Calcule o IMC = peso / (altura * altura).\nImprima "IMC: X.X" (1 casa decimal) e a classificação:\n- "Abaixo do peso" se IMC < 18.5\n- "Normal" se IMC >= 18.5 e < 25.0\n- "Sobrepeso" se IMC >= 25.0 e < 30.0\n- "Obeso" se IMC >= 30.0',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '70.0\n1.75', expectedOutput: 'IMC: 22.9\nNormal', visible: true },
      { input: '50.0\n1.70', expectedOutput: 'IMC: 17.3\nAbaixo do peso', visible: true },
      { input: '90.0\n1.70', expectedOutput: 'IMC: 31.1\nObeso', visible: false },
      { input: '80.0\n1.75', expectedOutput: 'IMC: 26.1\nSobrepeso', visible: false },
    ],
    hints: ['double imc = peso / (altura * altura);', 'Use String.format("IMC: %.1f", imc) para formatar com 1 casa decimal'],
    xpReward: 15,
  },
  {
    id: 'ex-m1-if-07',
    moduleId: 1,
    topic: 'condicionais',
    topicLabel: 'if/else e switch',
    title: 'Faixa etaria',
    description: 'Leia uma idade (int) e classifique:\n- "Bebe" se 0 a 1\n- "Crianca" se 2 a 12\n- "Adolescente" se 13 a 17\n- "Adulto" se 18 a 59\n- "Idoso" se 60 ou mais\n- "Idade invalida" se negativa',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '0', expectedOutput: 'Bebe', visible: true },
      { input: '10', expectedOutput: 'Crianca', visible: true },
      { input: '-5', expectedOutput: 'Idade invalida', visible: false },
      { input: '15', expectedOutput: 'Adolescente', visible: false },
      { input: '65', expectedOutput: 'Idoso', visible: false },
    ],
    hints: ['Verifique primeiro se a idade é negativa', 'Use if/else if encadeados para cada faixa etária'],
    xpReward: 15,
  },

  // ── Switch ──
  {
    id: 'ex-m1-sw-01',
    moduleId: 1,
    topic: 'condicionais',
    topicLabel: 'if/else e switch',
    title: 'Dia da semana',
    description: 'Leia um número inteiro de 1 a 7 e imprima o dia da semana correspondente:\n1=Domingo, 2=Segunda, 3=Terca, 4=Quarta, 5=Quinta, 6=Sexta, 7=Sabado.\nSe o número for inválido, imprima "Dia invalido".',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '1', expectedOutput: 'Domingo', visible: true },
      { input: '4', expectedOutput: 'Quarta', visible: true },
      { input: '8', expectedOutput: 'Dia invalido', visible: false },
    ],
    hints: ['Use switch(n) com case 1: ... case 7:', 'Use default: para o caso inválido'],
    xpReward: 10,
  },
  {
    id: 'ex-m1-sw-02',
    moduleId: 1,
    topic: 'condicionais',
    topicLabel: 'if/else e switch',
    title: 'Mes do ano',
    description: 'Leia um número inteiro de 1 a 12 e imprima o nome do mês correspondente:\n1=Janeiro, 2=Fevereiro, 3=Marco, 4=Abril, 5=Maio, 6=Junho, 7=Julho, 8=Agosto, 9=Setembro, 10=Outubro, 11=Novembro, 12=Dezembro.\nSe inválido, imprima "Mes invalido".',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '1', expectedOutput: 'Janeiro', visible: true },
      { input: '7', expectedOutput: 'Julho', visible: true },
      { input: '13', expectedOutput: 'Mes invalido', visible: false },
    ],
    hints: ['Use switch(n) com case 1 a 12', 'Use default: para imprimir "Mes invalido"'],
    xpReward: 10,
  },
  {
    id: 'ex-m1-sw-03',
    moduleId: 1,
    topic: 'condicionais',
    topicLabel: 'if/else e switch',
    title: 'Operacao matematica',
    description: 'Leia dois números inteiros e um inteiro representando a operação:\n1=soma, 2=subtracao, 3=multiplicacao, 4=divisao.\nUse switch para calcular e imprima "Resultado: X".\nSe for divisão por zero, imprima "Erro: divisao por zero".\nSe a operação for inválida, imprima "Operacao invalida".',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '10\n5\n1', expectedOutput: 'Resultado: 15', visible: true },
      { input: '10\n0\n4', expectedOutput: 'Erro: divisao por zero', visible: true },
      { input: '8\n3\n5', expectedOutput: 'Operacao invalida', visible: false },
      { input: '12\n4\n4', expectedOutput: 'Resultado: 3', visible: false },
    ],
    hints: ['Use switch(op) com case 1, 2, 3, 4', 'No case 4, verifique se o segundo número é zero antes de dividir'],
    xpReward: 15,
  },
  {
    id: 'ex-m1-sw-04',
    moduleId: 1,
    topic: 'condicionais',
    topicLabel: 'if/else e switch',
    title: 'Estacao do ano',
    description: 'Leia um número inteiro representando o mês (1-12). Use switch para imprimir a estação do ano:\n- Meses 12, 1, 2: "Verao"\n- Meses 3, 4, 5: "Outono"\n- Meses 6, 7, 8: "Inverno"\n- Meses 9, 10, 11: "Primavera"\nSe inválido, imprima "Mes invalido".',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '1', expectedOutput: 'Verao', visible: true },
      { input: '6', expectedOutput: 'Inverno', visible: true },
      { input: '13', expectedOutput: 'Mes invalido', visible: false },
      { input: '9', expectedOutput: 'Primavera', visible: false },
    ],
    hints: ['Agrupe cases: case 12: case 1: case 2: println("Verao"); break;', 'Use default para meses inválidos'],
    xpReward: 15,
  },
  {
    id: 'ex-m1-sw-05',
    moduleId: 1,
    topic: 'condicionais',
    topicLabel: 'if/else e switch',
    title: 'Nota para conceito',
    description: 'Leia uma nota double (0 a 10). Converta para conceito usando switch sobre (int)nota:\n- 10, 9: "A"\n- 8, 7: "B"\n- 6, 5: "C"\n- 4, 3: "D"\n- 2, 1, 0: "F"\nSe a nota for menor que 0 ou maior que 10, imprima "Nota invalida".',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '9.5', expectedOutput: 'A', visible: true },
      { input: '7.0', expectedOutput: 'B', visible: true },
      { input: '-1.0', expectedOutput: 'Nota invalida', visible: false },
      { input: '4.0', expectedOutput: 'D', visible: false },
    ],
    hints: ['Use int notaInt = (int) nota; e depois switch(notaInt)', 'Verifique antes do switch se a nota está fora do intervalo 0-10'],
    xpReward: 15,
  },

  // ── Loops (extras) ──

  // FOR loops
  {
    id: 'ex-m1-loop-05',
    moduleId: 1,
    topic: 'loops',
    topicLabel: 'Laços',
    title: 'Tabuada completa',
    description: 'Leia um número inteiro N e imprima sua tabuada de 1 a 10.\nCada linha no formato: "N x I = R" (ex: "5 x 1 = 5")',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '7', expectedOutput: '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70', visible: true },
      { input: '1', expectedOutput: '1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n1 x 4 = 4\n1 x 5 = 5\n1 x 6 = 6\n1 x 7 = 7\n1 x 8 = 8\n1 x 9 = 9\n1 x 10 = 10', visible: true },
      { input: '0', expectedOutput: '0 x 1 = 0\n0 x 2 = 0\n0 x 3 = 0\n0 x 4 = 0\n0 x 5 = 0\n0 x 6 = 0\n0 x 7 = 0\n0 x 8 = 0\n0 x 9 = 0\n0 x 10 = 0', visible: false },
    ],
    hints: ['Use for (int i = 1; i <= 10; i++)', 'System.out.println(n + " x " + i + " = " + (n * i));'],
    xpReward: 10,
  },
  {
    id: 'ex-m1-loop-06',
    moduleId: 1,
    topic: 'loops',
    topicLabel: 'Laços',
    title: 'Soma de 1 a N',
    description: 'Leia um número inteiro N e imprima a soma de todos os números de 1 até N.\nSaída: "Soma: X"',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '10', expectedOutput: 'Soma: 55', visible: true },
      { input: '5', expectedOutput: 'Soma: 15', visible: true },
      { input: '1', expectedOutput: 'Soma: 1', visible: false },
    ],
    hints: ['Use for (int i = 1; i <= n; i++) e acumule em uma variável soma', 'A fórmula direta é n * (n + 1) / 2, mas use loop para praticar'],
    xpReward: 10,
  },
  {
    id: 'ex-m1-loop-07',
    moduleId: 1,
    topic: 'loops',
    topicLabel: 'Laços',
    title: 'Numeros pares',
    description: 'Leia um número inteiro N e imprima todos os números pares de 1 até N (inclusive), separados por espaço.',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '10', expectedOutput: '2 4 6 8 10', visible: true },
      { input: '7', expectedOutput: '2 4 6', visible: true },
      { input: '1', expectedOutput: '', visible: false },
    ],
    hints: ['Use for (int i = 2; i <= n; i += 2)', 'Cuidado com o espaço: use StringBuilder ou condição para não ter espaço extra'],
    xpReward: 15,
  },
  {
    id: 'ex-m1-loop-08',
    moduleId: 1,
    topic: 'loops',
    topicLabel: 'Laços',
    title: 'Fatorial com for',
    description: 'Leia um número inteiro N (0 a 20) e imprima seu fatorial.\nSaída: "N! = X"\nLembre-se: 0! = 1',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '5', expectedOutput: '5! = 120', visible: true },
      { input: '0', expectedOutput: '0! = 1', visible: true },
      { input: '10', expectedOutput: '10! = 3628800', visible: false },
      { input: '20', expectedOutput: '20! = 2432902008176640000', visible: false },
    ],
    hints: ['Use long para armazenar o resultado, pois int estoura para N > 12', 'Comece com long fat = 1 e multiplique de 1 a N'],
    xpReward: 15,
  },
  {
    id: 'ex-m1-loop-09',
    moduleId: 1,
    topic: 'loops',
    topicLabel: 'Laços',
    title: 'Fibonacci com for',
    description: 'Leia um número inteiro N e imprima os N primeiros termos da sequência de Fibonacci, separados por espaço.\nSequência: 0 1 1 2 3 5 8 ...',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '7', expectedOutput: '0 1 1 2 3 5 8', visible: true },
      { input: '1', expectedOutput: '0', visible: true },
      { input: '2', expectedOutput: '0 1', visible: false },
      { input: '10', expectedOutput: '0 1 1 2 3 5 8 13 21 34', visible: false },
    ],
    hints: ['Use duas variáveis a = 0, b = 1 e vá atualizando: temp = a + b; a = b; b = temp;', 'Cuidado com o espaço entre os números — use StringBuilder'],
    xpReward: 15,
  },

  // WHILE loops
  {
    id: 'ex-m1-loop-10',
    moduleId: 1,
    topic: 'loops',
    topicLabel: 'Laços',
    title: 'Contagem regressiva',
    description: 'Leia um número inteiro N e imprima uma contagem regressiva de N até 0, cada número em uma linha separada.',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '5', expectedOutput: '5\n4\n3\n2\n1\n0', visible: true },
      { input: '3', expectedOutput: '3\n2\n1\n0', visible: true },
      { input: '0', expectedOutput: '0', visible: false },
    ],
    hints: ['Use while (n >= 0) e decremente n a cada iteração', 'System.out.println(n); n--;'],
    xpReward: 10,
  },
  {
    id: 'ex-m1-loop-11',
    moduleId: 1,
    topic: 'loops',
    topicLabel: 'Laços',
    title: 'Soma ate zero',
    description: 'Leia números inteiros até que o valor 0 seja digitado. Imprima a soma de todos os valores lidos (sem incluir o zero).\nSaída: "Soma: X"',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '5\n3\n2\n0', expectedOutput: 'Soma: 10', visible: true },
      { input: '10\n-3\n0', expectedOutput: 'Soma: 7', visible: true },
      { input: '0', expectedOutput: 'Soma: 0', visible: false },
    ],
    hints: ['Use while e leia o número dentro do loop. Se for 0, pare', 'int soma = 0; int n = sc.nextInt(); while (n != 0) { soma += n; n = sc.nextInt(); }'],
    xpReward: 15,
  },
  {
    id: 'ex-m1-loop-12',
    moduleId: 1,
    topic: 'loops',
    topicLabel: 'Laços',
    title: 'Maior valor',
    description: 'Leia N (quantidade de números) e depois N números inteiros. Imprima o maior valor lido.\nSaída: "Maior: X"',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '5\n3 7 2 9 4', expectedOutput: 'Maior: 9', visible: true },
      { input: '3\n-1 -5 -2', expectedOutput: 'Maior: -1', visible: true },
      { input: '1\n42', expectedOutput: 'Maior: 42', visible: false },
    ],
    hints: ['Inicialize o maior com o primeiro número lido', 'Use while ou for para ler os próximos e comparar com Math.max()'],
    xpReward: 15,
  },
  {
    id: 'ex-m1-loop-13',
    moduleId: 1,
    topic: 'loops',
    topicLabel: 'Laços',
    title: 'Potencia de 2',
    description: 'Leia um número inteiro N e imprima todas as potências de 2 que são menores ou iguais a N, uma por linha.\nExemplo: para N=20, imprima 1, 2, 4, 8, 16 (cada um em uma linha)',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '20', expectedOutput: '1\n2\n4\n8\n16', visible: true },
      { input: '1', expectedOutput: '1', visible: true },
      { input: '64', expectedOutput: '1\n2\n4\n8\n16\n32\n64', visible: false },
    ],
    hints: ['Comece com pot = 1 e multiplique por 2 enquanto pot <= n', 'while (pot <= n) { println(pot); pot *= 2; }'],
    xpReward: 15,
  },
  {
    id: 'ex-m1-loop-14',
    moduleId: 1,
    topic: 'loops',
    topicLabel: 'Laços',
    title: 'Numero primo',
    description: 'Leia um número inteiro N e imprima "Primo" se for primo ou "Nao primo" caso contrário.\nLembre-se: 1 não é primo, 2 é primo.',
    difficulty: 'dificil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '7', expectedOutput: 'Primo', visible: true },
      { input: '4', expectedOutput: 'Nao primo', visible: true },
      { input: '1', expectedOutput: 'Nao primo', visible: false },
      { input: '2', expectedOutput: 'Primo', visible: false },
    ],
    hints: ['Se n < 2, não é primo. Teste divisores de 2 até Math.sqrt(n)', 'Se encontrar algum divisor, não é primo. Use um boolean ehPrimo = true;'],
    xpReward: 25,
  },

  // DO-WHILE loops
  {
    id: 'ex-m1-loop-15',
    moduleId: 1,
    topic: 'loops',
    topicLabel: 'Laços',
    title: 'Menu simples',
    description: 'Exiba um menu que lê opções (int) até o usuário digitar 0:\n- Opção 1: imprima "Opcao 1 selecionada"\n- Opção 2: imprima "Opcao 2 selecionada"\n- Opção 0: imprima "Saindo..."\n- Qualquer outra: imprima "Opcao invalida"',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '1\n2\n3\n0', expectedOutput: 'Opcao 1 selecionada\nOpcao 2 selecionada\nOpcao invalida\nSaindo...', visible: true },
      { input: '0', expectedOutput: 'Saindo...', visible: true },
      { input: '1\n0', expectedOutput: 'Opcao 1 selecionada\nSaindo...', visible: false },
    ],
    hints: ['Use do { ... } while (opcao != 0);', 'Dentro do do, leia a opção e use switch ou if/else para tratar cada caso'],
    xpReward: 10,
  },
  {
    id: 'ex-m1-loop-16',
    moduleId: 1,
    topic: 'loops',
    topicLabel: 'Laços',
    title: 'Adivinhar numero',
    description: 'O número secreto é 42. Leia tentativas do usuário até acertar.\nPara cada tentativa errada, imprima "Tente novamente".\nQuando acertar, imprima "Acertou em N tentativa(s)!".',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '10\n20\n42', expectedOutput: 'Tente novamente\nTente novamente\nAcertou em 3 tentativa(s)!', visible: true },
      { input: '42', expectedOutput: 'Acertou em 1 tentativa(s)!', visible: true },
      { input: '1\n42', expectedOutput: 'Tente novamente\nAcertou em 2 tentativa(s)!', visible: false },
    ],
    hints: ['Use do { ... } while (palpite != 42); e um contador de tentativas', 'Incremente o contador a cada leitura, imprima "Tente novamente" se errou'],
    xpReward: 15,
  },
  {
    id: 'ex-m1-loop-17',
    moduleId: 1,
    topic: 'loops',
    topicLabel: 'Laços',
    title: 'Validar entrada',
    description: 'Leia números inteiros até que um valor entre 1 e 10 (inclusive) seja digitado.\nPara cada valor inválido, imprima "Valor invalido! Digite entre 1 e 10:".\nQuando o valor for válido, imprima "Valor aceito: X".',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '0\n15\n5', expectedOutput: 'Valor invalido! Digite entre 1 e 10:\nValor invalido! Digite entre 1 e 10:\nValor aceito: 5', visible: true },
      { input: '7', expectedOutput: 'Valor aceito: 7', visible: true },
      { input: '-1\n11\n10', expectedOutput: 'Valor invalido! Digite entre 1 e 10:\nValor invalido! Digite entre 1 e 10:\nValor aceito: 10', visible: false },
    ],
    hints: ['Use do { ... } while (n < 1 || n > 10);', 'Dentro do loop, leia e verifique se é válido. Se não, imprima a mensagem de erro'],
    xpReward: 15,
  },
  {
    id: 'ex-m1-loop-18',
    moduleId: 1,
    topic: 'loops',
    topicLabel: 'Laços',
    title: 'Soma positivos',
    description: 'Leia números inteiros em loop.\n- Se o número for positivo, some ao total.\n- Se for negativo, imprima "Negativo ignorado".\n- Se for 0, pare e imprima "Soma: X".',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '5\n-2\n3\n0', expectedOutput: 'Negativo ignorado\nSoma: 8', visible: true },
      { input: '10\n20\n0', expectedOutput: 'Soma: 30', visible: true },
      { input: '-1\n-2\n0', expectedOutput: 'Negativo ignorado\nNegativo ignorado\nSoma: 0', visible: false },
    ],
    hints: ['Use do { ... } while (n != 0); com verificações dentro do loop', 'Se n > 0, soma += n. Se n < 0, imprima "Negativo ignorado". Se n == 0, pare'],
    xpReward: 15,
  },
  {
    id: 'ex-m1-loop-19',
    moduleId: 1,
    topic: 'loops',
    topicLabel: 'Laços',
    title: 'Calculadora repetida',
    description: 'Implemente uma calculadora em loop:\n1. Leia dois doubles e um operador (+, -, *, /)\n2. Imprima "= X.XX" (2 casas decimais)\n3. Leia "s" para continuar ou "n" para parar\n\nQuando parar, imprima "Total de X operacao(oes)".',
    difficulty: 'dificil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '5.0\n3.0\n+\ns\n10.0\n2.0\n*\nn', expectedOutput: '= 8.00\n= 20.00\nTotal de 2 operacao(oes)', visible: true },
      { input: '4.0\n2.0\n/\nn', expectedOutput: '= 2.00\nTotal de 1 operacao(oes)', visible: true },
      { input: '7.0\n3.0\n-\ns\n1.0\n1.0\n+\ns\n9.0\n3.0\n/\nn', expectedOutput: '= 4.00\n= 2.00\n= 3.00\nTotal de 3 operacao(oes)', visible: false },
    ],
    hints: ['Use do { ... } while (continuar.equals("s")); e um contador', 'Use String.format("= %.2f", resultado) para formatar o resultado'],
    xpReward: 25,
  },

  // ── Vetores e Matrizes (extras) ──
  {
    id: 'ex-m1-arr-04',
    moduleId: 1,
    topic: 'arrays',
    topicLabel: 'Vetores e Matrizes',
    title: 'Inverter vetor',
    description: 'Leia N (tamanho do vetor) e depois N números inteiros. Imprima os elementos na ordem inversa, separados por espaço.',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1', visible: true },
      { input: '3\n10 20 30', expectedOutput: '30 20 10', visible: true },
      { input: '1\n7', expectedOutput: '7', visible: false },
    ],
    hints: ['Leia todos os valores em um array e depois percorra de trás pra frente', 'for (int i = n - 1; i >= 0; i--)'],
    xpReward: 10,
  },
  {
    id: 'ex-m1-arr-05',
    moduleId: 1,
    topic: 'arrays',
    topicLabel: 'Vetores e Matrizes',
    title: 'Media do vetor',
    description: 'Leia N e depois N números double. Calcule e imprima a média aritmética.\nSaída: "Media: X.XX" (2 casas decimais)',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '4\n10.0 20.0 30.0 40.0', expectedOutput: 'Media: 25.00', visible: true },
      { input: '3\n5.0 5.0 5.0', expectedOutput: 'Media: 5.00', visible: true },
      { input: '2\n0.0 10.0', expectedOutput: 'Media: 5.00', visible: false },
    ],
    hints: ['Some todos os elementos e divida pelo tamanho N', 'Use String.format("Media: %.2f", soma / n)'],
    xpReward: 10,
  },
  {
    id: 'ex-m1-arr-06',
    moduleId: 1,
    topic: 'arrays',
    topicLabel: 'Vetores e Matrizes',
    title: 'Contar pares e impares',
    description: 'Leia N e depois N números inteiros. Conte quantos são pares e quantos são ímpares.\nImprima:\n"Pares: X"\n"Impares: Y"',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: 'Pares: 2\nImpares: 3', visible: true },
      { input: '4\n2 4 6 8', expectedOutput: 'Pares: 4\nImpares: 0', visible: true },
      { input: '3\n1 3 5', expectedOutput: 'Pares: 0\nImpares: 3', visible: false },
    ],
    hints: ['Use n % 2 == 0 para verificar se é par', 'Mantenha dois contadores: pares e impares'],
    xpReward: 15,
  },
  {
    id: 'ex-m1-arr-07',
    moduleId: 1,
    topic: 'arrays',
    topicLabel: 'Vetores e Matrizes',
    title: 'Segundo maior',
    description: 'Leia N (>= 2) e depois N números inteiros. Encontre e imprima o segundo maior valor.\nSaída: "Segundo maior: X"',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '5\n3 7 2 9 4', expectedOutput: 'Segundo maior: 7', visible: true },
      { input: '3\n10 10 5', expectedOutput: 'Segundo maior: 10', visible: true },
      { input: '2\n1 2', expectedOutput: 'Segundo maior: 1', visible: false },
    ],
    hints: ['Mantenha duas variáveis: maior e segundoMaior', 'Se o novo valor for maior que maior, segundoMaior = maior e maior = novo valor'],
    xpReward: 15,
  },
  {
    id: 'ex-m1-arr-08',
    moduleId: 1,
    topic: 'arrays',
    topicLabel: 'Vetores e Matrizes',
    title: 'Ordenar vetor',
    description: 'Leia N e depois N números inteiros. Ordene-os em ordem crescente usando Bubble Sort e imprima separados por espaço.',
    difficulty: 'dificil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '5\n5 3 1 4 2', expectedOutput: '1 2 3 4 5', visible: true },
      { input: '3\n3 2 1', expectedOutput: '1 2 3', visible: true },
      { input: '4\n1 2 3 4', expectedOutput: '1 2 3 4', visible: false },
    ],
    hints: ['Bubble Sort: dois loops aninhados, compare elementos adjacentes e troque se necessário', 'for (int i = 0; i < n-1; i++) for (int j = 0; j < n-1-i; j++) if (v[j] > v[j+1]) troque'],
    xpReward: 25,
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

  // ── Matrizes ──
  {
    id: 'ex-m2-mat-01',
    moduleId: 2,
    topic: 'arrays',
    topicLabel: 'Vetores e Matrizes',
    title: 'Soma elementos da matriz',
    description: 'Leia M (linhas) e N (colunas), depois leia M*N números inteiros formando uma matriz. Imprima a soma de todos os elementos.\nSaída: "Soma: X"',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '2\n3\n1 2 3\n4 5 6', expectedOutput: 'Soma: 21', visible: true },
      { input: '3\n3\n1 0 0\n0 1 0\n0 0 1', expectedOutput: 'Soma: 3', visible: true },
      { input: '1\n4\n10 20 30 40', expectedOutput: 'Soma: 100', visible: false },
    ],
    hints: ['Use dois loops aninhados para percorrer todas as posições da matriz', 'Acumule a soma em uma variável: soma += matriz[i][j]'],
    xpReward: 10,
  },
  {
    id: 'ex-m2-mat-02',
    moduleId: 2,
    topic: 'arrays',
    topicLabel: 'Vetores e Matrizes',
    title: 'Diagonal principal',
    description: 'Leia N (matriz quadrada NxN), depois leia N*N números inteiros. Imprima os elementos da diagonal principal separados por espaço.',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '3\n1 2 3\n4 5 6\n7 8 9', expectedOutput: '1 5 9', visible: true },
      { input: '2\n10 20\n30 40', expectedOutput: '10 40', visible: true },
      { input: '4\n1 0 0 0\n0 2 0 0\n0 0 3 0\n0 0 0 4', expectedOutput: '1 2 3 4', visible: false },
    ],
    hints: ['Os elementos da diagonal principal têm índice i == j', 'Percorra com um único loop: matriz[i][i]'],
    xpReward: 15,
  },
  {
    id: 'ex-m2-mat-03',
    moduleId: 2,
    topic: 'arrays',
    topicLabel: 'Vetores e Matrizes',
    title: 'Maior de cada linha',
    description: 'Leia M (linhas) e N (colunas), depois leia os valores da matriz. Imprima o maior valor de cada linha, um por linha.',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '2\n3\n1 5 3\n8 2 4', expectedOutput: '5\n8', visible: true },
      { input: '3\n2\n10 20\n5 15\n30 25', expectedOutput: '20\n15\n30', visible: true },
      { input: '1\n4\n3 1 4 1', expectedOutput: '4', visible: false },
    ],
    hints: ['Para cada linha, inicialize o maior com o primeiro elemento e compare com os demais', 'Use dois loops: o externo para linhas e o interno para colunas'],
    xpReward: 15,
  },
  {
    id: 'ex-m2-mat-04',
    moduleId: 2,
    topic: 'arrays',
    topicLabel: 'Vetores e Matrizes',
    title: 'Transposta',
    description: 'Leia M (linhas) e N (colunas), depois leia os valores da matriz. Imprima a matriz transposta (troque linhas por colunas).\nCada linha da saída deve ter os valores separados por espaço.',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '2\n3\n1 2 3\n4 5 6', expectedOutput: '1 4\n2 5\n3 6', visible: true },
      { input: '3\n2\n1 2\n3 4\n5 6', expectedOutput: '1 3 5\n2 4 6', visible: true },
      { input: '1\n3\n10 20 30', expectedOutput: '10\n20\n30', visible: false },
    ],
    hints: ['A transposta de uma matriz MxN é uma matriz NxM', 'transposta[j][i] = original[i][j]'],
    xpReward: 15,
  },
  {
    id: 'ex-m2-mat-05',
    moduleId: 2,
    topic: 'arrays',
    topicLabel: 'Vetores e Matrizes',
    title: 'Soma de matrizes',
    description: 'Leia M (linhas) e N (colunas), depois leia duas matrizes MxN de inteiros. Imprima a soma das duas matrizes.\nCada linha da saída deve ter os valores separados por espaço.',
    difficulty: 'dificil',
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '2\n2\n1 2\n3 4\n5 6\n7 8', expectedOutput: '6 8\n10 12', visible: true },
      { input: '2\n3\n1 0 0\n0 1 0\n0 0 1\n0 1 0', expectedOutput: '1 0 1\n0 2 0', visible: true },
      { input: '1\n3\n1 2 3\n4 5 6', expectedOutput: '5 7 9', visible: false },
    ],
    hints: ['Leia as duas matrizes separadamente em dois arrays bidimensionais', 'Some elemento a elemento: resultado[i][j] = a[i][j] + b[i][j]'],
    xpReward: 25,
  },

  // ── Collections (extras) ──
  {
    id: 'ex-m2-col-03',
    moduleId: 2,
    topic: 'collections',
    topicLabel: 'Collections',
    title: 'Lista de nomes',
    description: 'Leia N e depois N nomes. Imprima a lista ordenada alfabeticamente, um nome por linha.',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;
import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '3\nCarlos\nAna\nBruno', expectedOutput: 'Ana\nBruno\nCarlos', visible: true },
      { input: '4\nZara\nMaria\nLucia\nBeatriz', expectedOutput: 'Beatriz\nLucia\nMaria\nZara', visible: true },
      { input: '2\nBob\nAna', expectedOutput: 'Ana\nBob', visible: false },
    ],
    hints: ['Use ArrayList<String> e Collections.sort() para ordenar', 'sc.nextLine() para ler cada nome'],
    xpReward: 10,
  },
  {
    id: 'ex-m2-col-04',
    moduleId: 2,
    topic: 'collections',
    topicLabel: 'Collections',
    title: 'Remover duplicatas',
    description: 'Leia N e depois N números inteiros. Imprima apenas os valores únicos na ordem em que aparecem, separados por espaço.',
    difficulty: 'facil',
    starterCode: `import java.util.Scanner;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '7\n1 2 3 2 1 4 3', expectedOutput: '1 2 3 4', visible: true },
      { input: '5\n5 5 5 5 5', expectedOutput: '5', visible: true },
      { input: '4\n1 2 3 4', expectedOutput: '1 2 3 4', visible: false },
    ],
    hints: ['Use um ArrayList e antes de adicionar, verifique se já contém o elemento com contains()', 'Ou use LinkedHashSet que mantém a ordem e remove duplicatas automaticamente'],
    xpReward: 10,
  },
  {
    id: 'ex-m2-col-05',
    moduleId: 2,
    topic: 'collections',
    topicLabel: 'Collections',
    title: 'Lista de compras',
    description: 'Leia itens (String) até que "fim" seja digitado. Imprima a lista numerada e o total de itens.\nFormato:\n"1. Item1"\n"2. Item2"\n...\n"Total: X item(ns)"',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: 'Arroz\nFeijao\nMacarrao\nfim', expectedOutput: '1. Arroz\n2. Feijao\n3. Macarrao\nTotal: 3 item(ns)', visible: true },
      { input: 'Leite\nfim', expectedOutput: '1. Leite\nTotal: 1 item(ns)', visible: true },
      { input: 'Pao\nQueijo\nfim', expectedOutput: '1. Pao\n2. Queijo\nTotal: 2 item(ns)', visible: false },
    ],
    hints: ['Leia com sc.nextLine() em loop até que a linha seja "fim"', 'Use ArrayList para armazenar os itens e depois imprima com índice + 1'],
    xpReward: 15,
  },
  {
    id: 'ex-m2-col-06',
    moduleId: 2,
    topic: 'collections',
    topicLabel: 'Collections',
    title: 'Filtrar maiores',
    description: 'Leia N, depois N números inteiros, e depois um valor T (threshold). Imprima todos os valores maiores que T separados por espaço.\nSe nenhum valor for encontrado, imprima "Nenhum valor encontrado".',
    difficulty: 'medio',
    starterCode: `import java.util.Scanner;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: '5\n3 7 2 9 4\n5', expectedOutput: '7 9', visible: true },
      { input: '4\n1 2 3 4\n10', expectedOutput: 'Nenhum valor encontrado', visible: true },
      { input: '3\n10 20 30\n5', expectedOutput: '10 20 30', visible: false },
    ],
    hints: ['Percorra a lista e adicione a uma nova lista os valores > T', 'Se a lista filtrada estiver vazia, imprima "Nenhum valor encontrado"'],
    xpReward: 15,
  },
  {
    id: 'ex-m2-col-07',
    moduleId: 2,
    topic: 'collections',
    topicLabel: 'Collections',
    title: 'Frequencia de palavras',
    description: 'Leia uma linha de texto. Imprima cada palavra única e sua frequência na ordem em que aparecem.\nFormato: "palavra: X" (uma por linha).\nAs palavras devem ser convertidas para minúsculas.',
    difficulty: 'dificil',
    starterCode: `import java.util.Scanner;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Seu codigo aqui

    }
}`,
    testCases: [
      { input: 'Java java Python java python', expectedOutput: 'java: 3\npython: 2', visible: true },
      { input: 'Hello World Hello', expectedOutput: 'hello: 2\nworld: 1', visible: true },
      { input: 'um dois tres', expectedOutput: 'um: 1\ndois: 1\ntres: 1', visible: false },
    ],
    hints: ['Use split(" ") para separar as palavras e toLowerCase() para converter', 'Use um LinkedHashMap<String, Integer> para manter a ordem de inserção e contar frequências'],
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
