import { LessonContent } from './types';

export const lessonContents: Record<string, LessonContent> = {
  'm1-intro': {
    id: 'm1-intro',
    moduleId: 1,
    objectives: [
      'Entender o que é Java e por que é tão usado',
      'Conhecer a estrutura básica de um programa Java',
      'Compilar e executar seu primeiro programa',
      'Entender o conceito de JVM, JDK e JRE',
    ],
    sections: [
      {
        title: 'O que é Java?',
        body: 'Java é uma linguagem de programação criada em 1995 pela Sun Microsystems (hoje Oracle). É uma das linguagens mais populares do mundo, usada em aplicações web, mobile (Android), sistemas bancários, e-commerces e muito mais.\n\nO grande diferencial do Java é o conceito "Write Once, Run Anywhere" (Escreva uma vez, rode em qualquer lugar). Isso é possível graças à JVM (Java Virtual Machine), que interpreta o código compilado (.class) em qualquer sistema operacional.',
      },
      {
        title: 'JDK, JRE e JVM — Qual a diferença?',
        body: 'Esses três termos confundem muita gente, mas são simples:\n\n• JVM (Java Virtual Machine): É a máquina virtual que executa o bytecode Java. Cada sistema operacional tem sua própria JVM.\n\n• JRE (Java Runtime Environment): Contém a JVM + bibliotecas necessárias para RODAR programas Java.\n\n• JDK (Java Development Kit): Contém a JRE + ferramentas para DESENVOLVER (compilador javac, debugger, etc).',
        tip: 'Para programar em Java, você precisa do JDK. Para apenas rodar programas, basta o JRE.',
      },
      {
        title: 'Estrutura Básica de um Programa',
        body: 'Todo programa Java precisa de pelo menos uma classe e um método main. O método main é o ponto de entrada — é por onde o programa começa a executar.',
        code: `// Todo arquivo Java deve ter uma classe com o mesmo nome do arquivo
// Este arquivo se chamaria MeuPrograma.java
public class MeuPrograma {
    
    // O método main é o ponto de entrada do programa
    // public: acessível de qualquer lugar
    // static: pode ser chamado sem criar um objeto
    // void: não retorna nada
    // String[] args: aceita argumentos da linha de comando
    public static void main(String[] args) {
        
        // System.out.println imprime uma linha no console
        System.out.println("Olá, mundo!");
        System.out.println("Estou aprendendo Java!");
        
        // System.out.print NÃO pula linha
        System.out.print("Linha 1 ");
        System.out.print("Linha 1 ainda");
    }
}`,
        codeExplanation: 'A classe MeuPrograma envolve todo o código. O método main é onde a execução começa. System.out.println() imprime texto no console e pula uma linha. System.out.print() imprime sem pular linha.',
      },
      {
        title: 'Compilação e Execução',
        body: 'Java é uma linguagem compilada + interpretada:\n\n1. Você escreve o código-fonte (.java)\n2. O compilador javac transforma em bytecode (.class)\n3. A JVM interpreta e executa o bytecode',
        code: `// No terminal:
// 1. Compilar:
javac MeuPrograma.java

// 2. Executar:
java MeuPrograma

// Saída:
// Olá, mundo!
// Estou aprendendo Java!
// Linha 1 Linha 1 ainda`,
        codeExplanation: 'O comando javac compila o arquivo .java gerando um .class. O comando java executa o programa compilado (note que não colocamos a extensão .class).',
        warning: 'O nome do arquivo DEVE ser igual ao nome da classe pública. Se a classe é MeuPrograma, o arquivo deve ser MeuPrograma.java.',
      },
      {
        title: 'Comentários em Java',
        body: 'Comentários são trechos de texto ignorados pelo compilador. São essenciais para documentar seu código e facilitar a manutenção.',
        code: `// Comentário de uma linha

/* Comentário de
   múltiplas linhas */

/**
 * Comentário Javadoc
 * Usado para documentação oficial
 * @author Seu Nome
 * @version 1.0
 */`,
        codeExplanation: 'Use // para comentários curtos, /* */ para blocos maiores, e /** */ para documentação Javadoc que pode ser extraída automaticamente.',
      },
    ],
    commonErrors: [
      { title: 'Nome do arquivo diferente da classe', description: 'O arquivo deve ter o mesmo nome da classe pública. MeuPrograma.java para a classe MeuPrograma.' },
      { title: 'Esquecer o ponto-e-vírgula', description: 'Toda instrução em Java termina com ; (ponto-e-vírgula).' },
      { title: 'main escrito errado', description: 'A assinatura deve ser exatamente: public static void main(String[] args)' },
    ],
    summary: [
      'Java é compilado para bytecode e executado pela JVM',
      'Todo programa precisa de uma classe e um método main',
      'System.out.println() imprime no console',
      'O nome do arquivo .java deve ser igual ao da classe pública',
      'Use comentários para documentar seu código',
    ],
  },

  'm1-variables': {
    id: 'm1-variables',
    moduleId: 1,
    objectives: [
      'Conhecer os 8 tipos primitivos do Java',
      'Entender a diferença entre tipos primitivos e referência',
      'Declarar, inicializar e usar variáveis',
      'Trabalhar com String e seus métodos',
      'Entender casting (conversão de tipos)',
    ],
    sections: [
      {
        title: 'O que são variáveis?',
        body: 'Variáveis são espaços na memória do computador que guardam valores. Pense nelas como "caixas etiquetadas" — cada caixa tem um nome (identificador), um tipo (o que pode guardar) e um valor.',
      },
      {
        title: 'Tipos Primitivos',
        body: 'Java tem 8 tipos primitivos. Eles são os blocos fundamentais de dados:',
        code: `// INTEIROS (números sem decimal)
byte idade = 25;         // -128 a 127 (1 byte)
short ano = 2024;        // -32768 a 32767 (2 bytes)
int populacao = 215000000; // ~-2bi a ~2bi (4 bytes) - MAIS USADO
long distancia = 9999999999L; // muito grande (8 bytes) - note o L

// DECIMAIS (números com ponto flutuante)
float preco = 29.99f;    // precisão simples (4 bytes) - note o f
double pi = 3.14159265;  // precisão dupla (8 bytes) - MAIS USADO

// CARACTERE
char letra = 'A';        // um único caractere (2 bytes) - aspas simples!

// BOOLEANO
boolean ativo = true;    // true ou false (1 bit)
boolean maior = 10 > 5;  // true`,
        codeExplanation: 'int e double são os mais usados no dia a dia. Use long quando int não for suficiente (adicione L ao final). Use float apenas quando necessário (adicione f ao final). char usa aspas simples, String usa aspas duplas.',
        tip: 'Na dúvida, use int para inteiros e double para decimais. São os padrões do Java.',
      },
      {
        title: 'String — Tipo de Referência',
        body: 'String não é um tipo primitivo, é um objeto. Mas Java permite criar Strings de forma simplificada:',
        code: `// Criando Strings
String nome = "Maria";
String sobrenome = "Silva";

// Concatenação (juntar strings)
String nomeCompleto = nome + " " + sobrenome; // "Maria Silva"

// Métodos úteis de String
System.out.println(nome.length());           // 5 (tamanho)
System.out.println(nome.toUpperCase());      // "MARIA"
System.out.println(nome.toLowerCase());      // "maria"
System.out.println(nome.charAt(0));          // 'M' (primeiro caractere)
System.out.println(nome.contains("ar"));     // true
System.out.println(nome.equals("Maria"));    // true (comparação correta!)
System.out.println(nome.substring(0, 3));    // "Mar"
System.out.println(nome.replace('a', 'o'));  // "Morio"`,
        codeExplanation: 'Strings são imutáveis em Java — métodos como toUpperCase() retornam uma NOVA String, não modificam a original.',
        warning: 'NUNCA compare Strings com ==. Use .equals(). O == compara referências na memória, não o conteúdo!',
      },
      {
        title: 'Casting (Conversão de Tipos)',
        body: 'Às vezes precisamos converter um tipo em outro. Existem dois tipos de casting:',
        code: `// CASTING IMPLÍCITO (automático) - menor para maior
// byte -> short -> int -> long -> float -> double
int numero = 10;
double resultado = numero; // 10.0 (automático, sem perda)

// CASTING EXPLÍCITO (manual) - maior para menor
double preco = 29.99;
int precoInteiro = (int) preco; // 29 (perde a parte decimal!)

// String para número
String idadeTexto = "25";
int idade = Integer.parseInt(idadeTexto);    // 25
double valor = Double.parseDouble("19.90");  // 19.90

// Número para String
String texto = String.valueOf(42);           // "42"
String texto2 = "" + 42;                     // "42" (concatenação)`,
        codeExplanation: 'Casting implícito é seguro (não perde dados). Casting explícito pode perder precisão. Para converter String em número, use Integer.parseInt() ou Double.parseDouble().',
      },
      {
        title: 'Constantes com final',
        body: 'Use a palavra-chave final para criar constantes — valores que não podem ser alterados:',
        code: `// Constantes são escritas em MAIÚSCULAS por convenção
final double PI = 3.14159;
final int MAX_TENTATIVAS = 3;
final String EMPRESA = "Tech Corp";

// PI = 3.14; // ERRO! Não pode alterar uma constante`,
        codeExplanation: 'A convenção em Java é usar SNAKE_CASE em maiúsculas para constantes. Tentar alterar o valor gera um erro de compilação.',
      },
    ],
    commonErrors: [
      { title: 'Comparar String com ==', description: 'Use .equals() para comparar conteúdo de Strings. O == compara referências na memória.' },
      { title: 'Esquecer o f em float', description: 'float preco = 29.99 dá erro. Use float preco = 29.99f;' },
      { title: 'Esquecer o L em long', description: 'Números grandes precisam do L: long x = 9999999999L;' },
      { title: 'Variável não inicializada', description: 'Java exige que variáveis locais sejam inicializadas antes do uso.' },
    ],
    summary: [
      'Java tem 8 tipos primitivos: byte, short, int, long, float, double, char, boolean',
      'int e double são os mais usados',
      'String é um tipo de referência (objeto), não primitivo',
      'Compare Strings com .equals(), nunca com ==',
      'Casting implícito é automático (menor → maior), explícito precisa de (tipo)',
      'Use final para constantes',
    ],
  },

  'm1-operators': {
    id: 'm1-operators', moduleId: 1,
    objectives: ['Dominar operadores aritméticos, relacionais e lógicos', 'Entender precedência de operadores', 'Usar operadores de atribuição compostos'],
    sections: [
      { title: 'Operadores Aritméticos', body: 'São os operadores matemáticos básicos.',
        code: `int a = 10, b = 3;
System.out.println(a + b);  // 13 (soma)
System.out.println(a - b);  // 7  (subtração)
System.out.println(a * b);  // 30 (multiplicação)
System.out.println(a / b);  // 3  (divisão INTEIRA!)
System.out.println(a % b);  // 1  (resto da divisão)

// Divisão com decimais
double c = 10.0 / 3; // 3.3333...

// Incremento e decremento
int x = 5;
x++;  // x = 6
x--;  // x = 5`,
        codeExplanation: 'Cuidado: divisão entre inteiros resulta em inteiro! 10/3 = 3, não 3.33. Para resultado decimal, pelo menos um operando deve ser double.',
        warning: 'Divisão inteira trunca o resultado! 10 / 3 = 3. Se precisa do decimal, use 10.0 / 3.',
      },
      { title: 'Operadores Relacionais', body: 'Comparam dois valores e retornam boolean (true/false).',
        code: `int a = 10, b = 5;
System.out.println(a == b);  // false (igual a?)
System.out.println(a != b);  // true  (diferente de?)
System.out.println(a > b);   // true  (maior que?)
System.out.println(a < b);   // false (menor que?)
System.out.println(a >= 10); // true  (maior ou igual?)
System.out.println(a <= 5);  // false (menor ou igual?)`,
      },
      { title: 'Operadores Lógicos', body: 'Combinam expressões booleanas.',
        code: `boolean temIdade = true;
boolean temDocumento = false;

// AND (&&) - ambos devem ser true
System.out.println(temIdade && temDocumento); // false

// OR (||) - pelo menos um true
System.out.println(temIdade || temDocumento); // true

// NOT (!) - inverte
System.out.println(!temIdade); // false

// Exemplo prático
int idade = 20;
boolean podeVotar = idade >= 16 && idade <= 120; // true`,
        tip: 'Java usa "curto-circuito": em &&, se o primeiro for false, não avalia o segundo. Em ||, se o primeiro for true, não avalia o segundo.',
      },
    ],
    summary: ['Operadores aritméticos: + - * / %', 'Divisão inteira trunca — use double para decimais', 'Operadores relacionais retornam boolean', 'Operadores lógicos: && (e), || (ou), ! (não)'],
  },

  'm1-ifelse': {
    id: 'm1-ifelse', moduleId: 1,
    objectives: ['Usar if, else if e else corretamente', 'Entender operadores ternários', 'Combinar condições com operadores lógicos'],
    sections: [
      { title: 'if / else Básico', body: 'A estrutura if/else permite executar código condicionalmente.',
        code: `int idade = 18;

if (idade >= 18) {
    System.out.println("Maior de idade");
} else {
    System.out.println("Menor de idade");
}

// Com else if
int nota = 7;
if (nota >= 9) {
    System.out.println("Excelente!");
} else if (nota >= 7) {
    System.out.println("Aprovado");
} else if (nota >= 5) {
    System.out.println("Recuperação");
} else {
    System.out.println("Reprovado");
}`,
        codeExplanation: 'O Java avalia as condições de cima para baixo. Quando encontra a primeira verdadeira, executa o bloco e ignora os demais.',
      },
      { title: 'Operador Ternário', body: 'Uma forma resumida do if/else para atribuição simples.',
        code: `int idade = 20;
String status = (idade >= 18) ? "Maior" : "Menor";
// Equivale a:
// if (idade >= 18) status = "Maior"; else status = "Menor";`,
        tip: 'Use ternário apenas para expressões simples. Para lógica complexa, prefira if/else.',
      },
      { title: 'Combinando Condições', body: 'Use operadores lógicos para condições complexas.',
        code: `int idade = 25;
double renda = 3000;
boolean temNome = true;

// Pode financiar?
if (idade >= 18 && renda >= 2000 && temNome) {
    System.out.println("Aprovado para financiamento!");
}

// Desconto para idoso OU estudante
boolean isIdoso = idade >= 65;
boolean isEstudante = idade <= 25;
if (isIdoso || isEstudante) {
    System.out.println("Tem direito a desconto!");
}`,
      },
    ],
    commonErrors: [
      { title: 'Usar = ao invés de ==', description: 'if (x = 5) é atribuição, não comparação. Use if (x == 5).' },
      { title: 'Esquecer as chaves {}', description: 'Sem chaves, apenas a próxima linha pertence ao if. Sempre use chaves!' },
    ],
    summary: ['if/else permite executar código condicionalmente', 'else if encadeia múltiplas condições', 'Operador ternário: condição ? valorTrue : valorFalse', 'Combine condições com && e ||'],
  },

  'm1-switch': {
    id: 'm1-switch', moduleId: 1,
    objectives: ['Usar switch como alternativa ao if/else', 'Entender break e default', 'Saber quando usar switch vs if/else'],
    sections: [
      { title: 'switch case', body: 'O switch é ideal quando você compara UMA variável com MÚLTIPLOS valores fixos.',
        code: `int diaSemana = 3;

switch (diaSemana) {
    case 1:
        System.out.println("Domingo");
        break;
    case 2:
        System.out.println("Segunda");
        break;
    case 3:
        System.out.println("Terça");
        break;
    case 4:
        System.out.println("Quarta");
        break;
    default:
        System.out.println("Outro dia");
        break;
}`,
        codeExplanation: 'O break encerra o switch. Sem break, a execução "cai" para o próximo case (fall-through). default é executado quando nenhum case corresponde.',
        warning: 'Esquecer o break é um erro MUITO comum. Sem ele, todos os cases seguintes são executados!',
      },
      { title: 'switch com String', body: 'A partir do Java 7, switch funciona com Strings.',
        code: `String cor = "verde";

switch (cor.toLowerCase()) {
    case "vermelho":
        System.out.println("Pare!");
        break;
    case "amarelo":
        System.out.println("Atenção!");
        break;
    case "verde":
        System.out.println("Siga!");
        break;
    default:
        System.out.println("Cor inválida");
}`,
      },
    ],
    summary: ['switch compara uma variável com valores fixos', 'Sempre use break para evitar fall-through', 'default é o "else" do switch', 'Funciona com int, char, String, enum'],
  },

  'm1-loops': {
    id: 'm1-loops', moduleId: 1,
    objectives: ['Dominar for, while e do-while', 'Saber quando usar cada tipo de laço', 'Usar break e continue'],
    sections: [
      { title: 'for — Quando você sabe quantas vezes', body: 'O for é ideal quando você sabe o número de repetições.',
        code: `// Contar de 1 a 10
for (int i = 1; i <= 10; i++) {
    System.out.println(i);
}

// Contar de 10 a 1
for (int i = 10; i >= 1; i--) {
    System.out.print(i + " ");
}
// Saída: 10 9 8 7 6 5 4 3 2 1

// Tabuada do 5
for (int i = 1; i <= 10; i++) {
    System.out.println("5 x " + i + " = " + (5 * i));
}`,
        codeExplanation: 'A estrutura é: for (inicialização; condição; incremento). Primeiro inicializa, depois verifica a condição, executa o bloco e incrementa. Repete enquanto a condição for true.',
      },
      { title: 'while — Quando não sabe quantas vezes', body: 'O while repete enquanto a condição for verdadeira.',
        code: `// Exemplo: dividir por 2 até chegar em 1
int numero = 64;
while (numero > 1) {
    System.out.println(numero);
    numero = numero / 2;
}
// Saída: 64, 32, 16, 8, 4, 2`,
      },
      { title: 'do-while — Executa pelo menos uma vez', body: 'Semelhante ao while, mas garante pelo menos uma execução.',
        code: `// Menu que repete até o usuário sair
int opcao;
do {
    System.out.println("1 - Jogar");
    System.out.println("2 - Configurações");
    System.out.println("0 - Sair");
    opcao = 0; // simulando entrada
} while (opcao != 0);`,
        tip: 'Use do-while para menus ou validações onde precisa executar pelo menos uma vez.',
      },
      { title: 'break e continue', body: 'break sai do laço. continue pula para a próxima iteração.',
        code: `// break: para quando encontrar o 5
for (int i = 1; i <= 10; i++) {
    if (i == 5) break;
    System.out.print(i + " "); // 1 2 3 4
}

// continue: pula números pares
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) continue;
    System.out.print(i + " "); // 1 3 5 7 9
}`,
      },
    ],
    summary: ['for: quando sabe o número de repetições', 'while: quando depende de uma condição', 'do-while: garante pelo menos uma execução', 'break sai do laço, continue pula a iteração'],
  },

  'm1-arrays': {
    id: 'm1-arrays', moduleId: 1,
    objectives: ['Criar e manipular arrays', 'Percorrer arrays com for e for-each', 'Evitar erros comuns como IndexOutOfBounds'],
    sections: [
      { title: 'O que são Arrays?', body: 'Arrays são estruturas que armazenam múltiplos valores do mesmo tipo em posições numeradas (índices). O primeiro índice é 0.',
        code: `// Formas de criar arrays
int[] numeros = new int[5]; // array de 5 inteiros (inicializa com 0)
int[] notas = {10, 8, 7, 9, 6}; // com valores iniciais
String[] nomes = {"Ana", "Bruno", "Carlos"};

// Acessar e modificar
System.out.println(notas[0]); // 10 (primeiro elemento)
System.out.println(notas[4]); // 6  (último elemento)
notas[2] = 10; // alterando o terceiro elemento

// Tamanho do array
System.out.println(notas.length); // 5`,
        warning: 'Arrays começam no índice 0! Um array de tamanho 5 vai do índice 0 ao 4.',
      },
      { title: 'Percorrendo Arrays', body: 'Existem duas formas principais de percorrer arrays.',
        code: `int[] valores = {10, 20, 30, 40, 50};

// 1. for clássico (quando precisa do índice)
for (int i = 0; i < valores.length; i++) {
    System.out.println("Índice " + i + ": " + valores[i]);
}

// 2. for-each (quando só precisa do valor)
for (int valor : valores) {
    System.out.println(valor);
}

// Exemplo prático: calcular média
int soma = 0;
for (int v : valores) {
    soma += v;
}
double media = (double) soma / valores.length;
System.out.println("Média: " + media); // 30.0`,
        tip: 'Use for-each quando não precisar do índice. É mais limpo e menos propenso a erros.',
      },
    ],
    commonErrors: [
      { title: 'ArrayIndexOutOfBoundsException', description: 'Acessar um índice que não existe. Ex: array[5] em um array de tamanho 5 (máximo é 4).' },
      { title: 'Confundir length com length()', description: 'Arrays usam .length (sem parênteses). Strings usam .length() (com parênteses).' },
    ],
    summary: ['Arrays armazenam múltiplos valores do mesmo tipo', 'Índices começam em 0', 'Use .length para saber o tamanho', 'for-each é mais limpo quando não precisa do índice', 'Cuidado com IndexOutOfBoundsException'],
  },

  'm1-matrices': {
    id: 'm1-matrices', moduleId: 1,
    objectives: ['Criar e manipular matrizes (arrays 2D)', 'Usar loops aninhados para percorrer matrizes'],
    sections: [
      { title: 'Matrizes (Arrays 2D)', body: 'Uma matriz é um "array de arrays" — como uma tabela com linhas e colunas.',
        code: `// Criar uma matriz 3x3
int[][] matriz = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// Acessar elemento: matriz[linha][coluna]
System.out.println(matriz[0][0]); // 1 (primeira linha, primeira coluna)
System.out.println(matriz[1][2]); // 6 (segunda linha, terceira coluna)

// Percorrer com loops aninhados
for (int i = 0; i < matriz.length; i++) {
    for (int j = 0; j < matriz[i].length; j++) {
        System.out.print(matriz[i][j] + " ");
    }
    System.out.println(); // pula linha
}`,
      },
    ],
    summary: ['Matrizes são arrays de arrays (2D)', 'Acesse com [linha][coluna]', 'Use loops aninhados para percorrer'],
  },

  'm1-functions': {
    id: 'm1-functions', moduleId: 1,
    objectives: ['Criar métodos com parâmetros e retorno', 'Entender void, return e escopo', 'Conhecer sobrecarga de métodos'],
    sections: [
      { title: 'O que são Métodos?', body: 'Métodos (funções) são blocos de código reutilizáveis. Eles organizam o código, evitam repetição e facilitam a manutenção.',
        code: `public class Calculadora {
    
    // Método com retorno
    public static int somar(int a, int b) {
        return a + b;
    }
    
    // Método void (sem retorno)
    public static void saudacao(String nome) {
        System.out.println("Olá, " + nome + "!");
    }
    
    // Sobrecarga: mesmo nome, parâmetros diferentes
    public static double somar(double a, double b) {
        return a + b;
    }
    
    public static void main(String[] args) {
        int resultado = somar(5, 3);    // chama somar(int, int)
        double res2 = somar(2.5, 3.7);  // chama somar(double, double)
        saudacao("Maria");
        
        System.out.println(resultado); // 8
        System.out.println(res2);      // 6.2
    }
}`,
        codeExplanation: 'Sobrecarga permite criar métodos com o mesmo nome mas parâmetros diferentes. O Java escolhe o método correto baseado nos argumentos passados.',
      },
    ],
    summary: ['Métodos organizam e reutilizam código', 'void = sem retorno, return = com retorno', 'Sobrecarga: mesmo nome, parâmetros diferentes', 'Variáveis locais existem apenas dentro do método'],
  },

  'm2-io': {
    id: 'm2-io', moduleId: 2,
    objectives: ['Ler dados do usuário com Scanner', 'Entender boas práticas de entrada/saída'],
    sections: [
      { title: 'Scanner para Entrada de Dados', body: 'O Scanner lê dados digitados pelo usuário no console.',
        code: `import java.util.Scanner;

public class EntradaDados {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Digite seu nome: ");
        String nome = scanner.nextLine();
        
        System.out.print("Digite sua idade: ");
        int idade = scanner.nextInt();
        scanner.nextLine(); // limpa o buffer (importante!)
        
        System.out.print("Digite seu salário: ");
        double salario = scanner.nextDouble();
        
        System.out.println("Nome: " + nome + ", Idade: " + idade);
        
        scanner.close(); // sempre fechar o scanner
    }
}`,
        warning: 'Após nextInt() ou nextDouble(), sempre chame nextLine() para limpar o buffer do teclado. Caso contrário, o próximo nextLine() será pulado!',
      },
    ],
    summary: ['Scanner lê dados do console', 'nextLine() para texto, nextInt() para inteiros', 'Limpe o buffer com nextLine() após ler números', 'Sempre feche o Scanner com close()'],
  },

  'm2-strings': {
    id: 'm2-strings', moduleId: 2,
    objectives: ['Dominar os principais métodos de String', 'Entender imutabilidade e StringBuilder'],
    sections: [
      { title: 'Métodos Essenciais de String', body: 'Strings em Java são imutáveis — toda operação retorna uma NOVA String.',
        code: `String texto = "  Java é incrível!  ";

// Limpeza
texto.trim();           // "Java é incrível!" (remove espaços)
texto.strip();          // "Java é incrível!" (remove espaços Unicode)

// Busca
texto.contains("Java"); // true
texto.indexOf("é");     // 7 (posição)
texto.startsWith("  J"); // true
texto.endsWith("!  ");  // true

// Transformação
texto.toUpperCase();     // "  JAVA É INCRÍVEL!  "
texto.replace("Java", "Python"); // "  Python é incrível!  "

// Divisão
String csv = "nome,idade,cidade";
String[] partes = csv.split(","); // ["nome", "idade", "cidade"]

// StringBuilder para concatenação eficiente
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 100; i++) {
    sb.append("Item ").append(i).append(", ");
}
String resultado = sb.toString();`,
        tip: 'Para concatenar strings em loops, use StringBuilder. Concatenar com + dentro de loops cria muitos objetos desnecessários.',
      },
    ],
    summary: ['Strings são imutáveis em Java', 'Use .equals() para comparar, nunca ==', 'StringBuilder é mais eficiente para concatenações em loop', 'split() divide, trim() limpa espaços'],
  },

  'm2-debug': {
    id: 'm2-debug', moduleId: 2,
    objectives: ['Ler e interpretar stack traces', 'Identificar erros comuns', 'Usar técnicas básicas de debug'],
    sections: [
      { title: 'Lendo um Stack Trace', body: 'Quando ocorre um erro, Java mostra um stack trace. Aprender a lê-lo é ESSENCIAL.',
        code: `// Erro típico:
// Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: 
//     Index 5 out of bounds for length 3
//     at MeuPrograma.main(MeuPrograma.java:10)

// Como ler:
// 1. Tipo do erro: ArrayIndexOutOfBoundsException
// 2. Mensagem: Index 5 out of bounds for length 3
//    (tentou acessar índice 5, mas o array tem tamanho 3)
// 3. Onde: MeuPrograma.java, linha 10
// 4. Método: main

// Leia DE BAIXO PRA CIMA para entender a sequência de chamadas`,
        tip: 'Sempre leia o stack trace! A primeira linha diz o TIPO de erro, a mensagem explica O QUE aconteceu, e o local diz ONDE aconteceu.',
      },
    ],
    summary: ['Stack trace mostra tipo, mensagem e localização do erro', 'Leia de baixo para cima para entender a sequência', 'Erros comuns: NullPointerException, ArrayIndexOutOfBounds, NumberFormatException'],
  },

  'm2-collections': {
    id: 'm2-collections', moduleId: 2,
    objectives: ['Entender a diferença entre Array e ArrayList', 'Usar ArrayList para listas dinâmicas'],
    sections: [
      { title: 'ArrayList vs Array', body: 'Arrays têm tamanho fixo. ArrayList cresce e diminui dinamicamente.',
        code: `import java.util.ArrayList;

// Array: tamanho fixo
int[] notas = new int[3]; // sempre terá 3 elementos

// ArrayList: tamanho dinâmico
ArrayList<String> nomes = new ArrayList<>();
nomes.add("Ana");       // adiciona ao final
nomes.add("Bruno");
nomes.add("Carlos");
nomes.add(1, "Bia");    // adiciona na posição 1

System.out.println(nomes.get(0));  // "Ana"
System.out.println(nomes.size());  // 4
nomes.remove("Bruno");             // remove por valor
nomes.remove(0);                   // remove por índice
System.out.println(nomes.contains("Carlos")); // true

// Percorrer
for (String nome : nomes) {
    System.out.println(nome);
}`,
        tip: 'ArrayList usa tipos wrapper (Integer, Double) ao invés de primitivos (int, double). Ex: ArrayList<Integer>, não ArrayList<int>.',
      },
    ],
    summary: ['Array: tamanho fixo, acesso por índice', 'ArrayList: tamanho dinâmico, mais métodos disponíveis', 'ArrayList usa generics: ArrayList<Tipo>', 'Prefira ArrayList quando o tamanho pode mudar'],
  },

  'm2-packages': {
    id: 'm2-packages', moduleId: 2,
    objectives: ['Organizar código em pacotes', 'Usar import corretamente'],
    sections: [
      { title: 'Pacotes em Java', body: 'Pacotes organizam classes em diretórios lógicos, evitando conflitos de nomes.',
        code: `// Declaração de pacote (primeira linha do arquivo)
package com.empresa.modelo;

// Importações
import java.util.ArrayList;
import java.util.Scanner;

// Classe dentro do pacote
public class Cliente {
    private String nome;
    // ...
}

// Convenção de nomes de pacotes:
// com.empresa.projeto.modulo
// Exemplos:
// com.loja.modelo     (classes de dados)
// com.loja.servico    (lógica de negócio)
// com.loja.util       (utilitários)`,
      },
    ],
    summary: ['Pacotes organizam classes em diretórios', 'Declare com package na primeira linha', 'Use import para usar classes de outros pacotes', 'Convenção: com.empresa.projeto.modulo'],
  },

  'm3-whatispoo': {
    id: 'm3-whatispoo', moduleId: 3,
    objectives: ['Entender o que é Programação Orientada a Objetos', 'Saber por que POO existe e quais problemas resolve', 'Comparar código procedural vs orientado a objetos'],
    sections: [
      { title: 'Por que POO existe?', body: 'Imagine que você está construindo um sistema de cadastro de clientes. No começo, com poucas funções, tudo funciona bem com código procedural. Mas conforme o sistema cresce, o código vira uma bagunça: funções que dependem de variáveis globais, dados misturados, difícil de manter.\n\nPOO surgiu para resolver esse caos. A ideia é modelar o software como o mundo real: com objetos que têm características (atributos) e comportamentos (métodos). Cada objeto é responsável pelos seus próprios dados.', },
      { title: 'Os 4 Pilares da POO', body: '1. **Encapsulamento**: Proteger dados internos, expondo apenas o necessário.\n2. **Herança**: Reaproveitar código, criando classes que herdam de outras.\n3. **Polimorfismo**: Um mesmo método se comporta diferente em classes diferentes.\n4. **Abstração**: Esconder complexidade, mostrando apenas o essencial.',
        tip: 'Não decore os pilares mecanicamente. Entenda o PROBLEMA que cada um resolve.',
      },
    ],
    withoutPoo: `// SEM POO: Código procedural para gerenciar contas bancárias
public class SemPOO {
    public static void main(String[] args) {
        // Dados soltos em arrays
        String[] nomes = {"Ana", "Bruno"};
        double[] saldos = {1000, 2500};
        
        // Função para depositar
        saldos[0] = saldos[0] + 500; // depositar na conta da Ana
        
        // Função para sacar
        if (saldos[1] >= 200) {
            saldos[1] = saldos[1] - 200; // sacar do Bruno
        }
        
        // PROBLEMAS:
        // - Dados não estão protegidos (qualquer um altera saldo)
        // - Sem validação centralizada
        // - Se adicionar mais campos (cpf, tipo), fica caótico
        // - Difícil de manter e escalar
    }
}`,
    withPoo: `// COM POO: Código organizado com classes
public class ContaBancaria {
    private String titular;
    private double saldo;
    
    public ContaBancaria(String titular, double saldoInicial) {
        this.titular = titular;
        this.saldo = saldoInicial;
    }
    
    public void depositar(double valor) {
        if (valor > 0) {
            this.saldo += valor;
            System.out.println("Depósito de R$" + valor + " realizado!");
        }
    }
    
    public boolean sacar(double valor) {
        if (valor > 0 && valor <= this.saldo) {
            this.saldo -= valor;
            return true;
        }
        System.out.println("Saldo insuficiente!");
        return false;
    }
    
    public double getSaldo() { return this.saldo; }
    public String getTitular() { return this.titular; }
}

// Uso:
// ContaBancaria contaAna = new ContaBancaria("Ana", 1000);
// contaAna.depositar(500);  // Validação inclusa!
// contaAna.sacar(200);      // Proteção automática!`,
    comparisonExplanation: 'Com POO, os dados (titular, saldo) ficam PROTEGIDOS dentro da classe. Ninguém pode alterar o saldo diretamente — precisa passar pelos métodos depositar() e sacar(), que fazem validação. O código fica organizado, seguro e fácil de manter.',
    summary: ['POO modela software como o mundo real, com objetos', 'Cada objeto tem atributos (dados) e métodos (comportamentos)', '4 pilares: Encapsulamento, Herança, Polimorfismo, Abstração', 'POO resolve problemas de organização, manutenção e segurança do código', 'Código procedural funciona para projetos simples, mas não escala bem'],
  },

  'm3-classes': {
    id: 'm3-classes', moduleId: 3,
    objectives: ['Criar classes e objetos', 'Entender a diferença entre classe e objeto', 'Modelar entidades do mundo real'],
    sections: [
      { title: 'Classe = Molde, Objeto = Instância', body: 'Uma classe é como uma planta de uma casa. O objeto é a casa construída a partir da planta. Você pode construir várias casas com a mesma planta — cada uma é um objeto independente.',
        code: `// A CLASSE é o molde
public class Carro {
    // Atributos (características)
    String marca;
    String modelo;
    int ano;
    String cor;
    
    // Método (comportamento)
    void ligar() {
        System.out.println(modelo + " ligado!");
    }
    
    void info() {
        System.out.println(marca + " " + modelo + " (" + ano + ") - " + cor);
    }
}

// Criando OBJETOS (instâncias)
Carro meuCarro = new Carro();    // objeto 1
meuCarro.marca = "Toyota";
meuCarro.modelo = "Corolla";
meuCarro.ano = 2024;
meuCarro.cor = "Prata";
meuCarro.ligar(); // "Corolla ligado!"

Carro outroCarro = new Carro();  // objeto 2 (independente)
outroCarro.marca = "Honda";
outroCarro.modelo = "Civic";`,
        codeExplanation: 'A classe Carro define a estrutura. Cada new Carro() cria um objeto independente na memória com seus próprios valores.',
      },
    ],
    summary: ['Classe é o molde/template, Objeto é a instância', 'Use new para criar objetos', 'Cada objeto tem seus próprios dados', 'Modele classes baseado em entidades do mundo real'],
  },

  'm3-attributes': {
    id: 'm3-attributes', moduleId: 3,
    objectives: ['Diferenciar atributos e métodos', 'Entender estado e comportamento'],
    sections: [
      { title: 'Estado e Comportamento', body: 'Atributos representam o ESTADO do objeto (o que ele é/tem). Métodos representam o COMPORTAMENTO (o que ele faz).',
        code: `public class Produto {
    // ESTADO (atributos)
    String nome;
    double preco;
    int estoque;
    
    // COMPORTAMENTO (métodos)
    void vender(int quantidade) {
        if (quantidade <= estoque) {
            estoque -= quantidade;
            System.out.println(quantidade + "x " + nome + " vendido(s)!");
        } else {
            System.out.println("Estoque insuficiente!");
        }
    }
    
    double calcularTotal(int quantidade) {
        return preco * quantidade;
    }
    
    void exibirInfo() {
        System.out.println(nome + " - R$" + preco + " | Estoque: " + estoque);
    }
}`,
      },
    ],
    summary: ['Atributos = estado do objeto (dados)', 'Métodos = comportamento (ações)', 'Métodos podem alterar o estado do objeto', 'Bons métodos fazem validações antes de alterar dados'],
  },

  'm3-constructors': {
    id: 'm3-constructors', moduleId: 3,
    objectives: ['Criar construtores para inicializar objetos', 'Entender construtor padrão e personalizado', 'Usar sobrecarga de construtores'],
    sections: [
      { title: 'O que é um Construtor?', body: 'Um construtor é um método especial que é chamado quando você usa new. Ele inicializa o objeto com valores.',
        code: `public class Pessoa {
    String nome;
    int idade;
    
    // Construtor personalizado
    public Pessoa(String nome, int idade) {
        this.nome = nome;    // this diferencia o atributo do parâmetro
        this.idade = idade;
    }
    
    // Sobrecarga de construtor
    public Pessoa(String nome) {
        this.nome = nome;
        this.idade = 0; // valor padrão
    }
}

// Uso:
Pessoa p1 = new Pessoa("Ana", 25);   // usa primeiro construtor
Pessoa p2 = new Pessoa("Bruno");      // usa segundo construtor`,
      },
    ],
    summary: ['Construtor inicializa o objeto ao usar new', 'Tem o mesmo nome da classe e não tem tipo de retorno', 'this.atributo diferencia do parâmetro', 'Sobrecarga permite múltiplos construtores'],
  },

  'm3-encapsulation': {
    id: 'm3-encapsulation', moduleId: 3,
    objectives: ['Entender por que encapsular dados', 'Usar private, getters e setters', 'Adicionar validações nos setters'],
    sections: [
      { title: 'Por que Encapsular?', body: 'Encapsulamento é esconder os dados internos do objeto, permitindo acesso apenas por métodos controlados. É como um caixa eletrônico: você não acessa o cofre diretamente, mas usa uma interface segura.',
        warning: 'Sem encapsulamento, qualquer parte do código pode colocar valores inválidos nos atributos, como idade negativa ou preço zero.',
      },
      { title: 'Getters e Setters com Validação', body: 'Getters retornam o valor. Setters definem o valor COM validação.',
        code: `public class ContaBancaria {
    // Atributos PRIVADOS (encapsulados)
    private String titular;
    private double saldo;
    private String cpf;
    
    public ContaBancaria(String titular, String cpf) {
        this.titular = titular;
        this.cpf = cpf;
        this.saldo = 0;
    }
    
    // Getter - apenas leitura
    public double getSaldo() {
        return this.saldo;
    }
    
    public String getTitular() {
        return this.titular;
    }
    
    // Setter com VALIDAÇÃO
    public void setTitular(String titular) {
        if (titular != null && !titular.trim().isEmpty()) {
            this.titular = titular;
        } else {
            System.out.println("Nome inválido!");
        }
    }
    
    // Sem setter para saldo! Só pode alterar via métodos de negócio
    public void depositar(double valor) {
        if (valor > 0) {
            this.saldo += valor;
        }
    }
    
    public boolean sacar(double valor) {
        if (valor > 0 && valor <= this.saldo) {
            this.saldo -= valor;
            return true;
        }
        return false;
    }
}`,
        codeExplanation: 'Note que saldo não tem setter! O único jeito de alterar é via depositar() e sacar(), que fazem validação. Isso é encapsulamento de verdade — não é só colocar get/set, é PROTEGER os dados.',
        tip: 'Não crie getters e setters para tudo automaticamente. Pense: esse atributo PRECISA ser acessado de fora? Precisa ser alterável?',
      },
    ],
    withoutPoo: `// SEM encapsulamento
public class ContaSemProtecao {
    public String titular;
    public double saldo;
    
    // Qualquer um pode fazer:
    // conta.saldo = -1000;  // saldo negativo!
    // conta.titular = "";    // nome vazio!
    // conta.saldo = 999999;  // fraude!
}`,
    withPoo: `// COM encapsulamento
public class ContaProtegida {
    private String titular;
    private double saldo;
    
    public void depositar(double valor) {
        if (valor > 0) {
            this.saldo += valor;
            // Pode adicionar: log, notificação, auditoria...
        }
    }
    
    public boolean sacar(double valor) {
        if (valor > 0 && valor <= this.saldo) {
            this.saldo -= valor;
            return true;
        }
        return false; // protegido contra saldo negativo
    }
    
    // Impossível colocar saldo negativo!
    // Impossível alterar sem validação!
}`,
    comparisonExplanation: 'Sem encapsulamento, qualquer parte do código pode corromper os dados. Com encapsulamento, você controla TODO acesso aos dados, pode validar, logar, notificar — tudo em um único lugar.',
    commonErrors: [
      { title: 'Criar get/set para tudo sem pensar', description: 'Gerar getters e setters automáticos derrota o propósito. Pense se o atributo PRECISA ser exposto.' },
      { title: 'Setter sem validação', description: 'Um setter que apenas faz this.x = x não protege nada. Adicione validação!' },
    ],
    summary: ['Encapsulamento protege dados com private', 'Getters fornecem acesso de leitura controlado', 'Setters validam antes de alterar', 'Nem todo atributo precisa de get/set', 'Métodos de negócio (depositar, sacar) são melhor que setters genéricos'],
  },

  'm3-static': {
    id: 'm3-static', moduleId: 3,
    objectives: ['Entender quando usar static', 'Diferenciar membros de instância e de classe'],
    sections: [
      { title: 'static — Pertence à Classe, não ao Objeto', body: 'Membros static são compartilhados entre TODOS os objetos da classe.',
        code: `public class Funcionario {
    // Atributo de instância (cada objeto tem o seu)
    private String nome;
    private double salario;
    
    // Atributo STATIC (compartilhado por todos)
    private static int totalFuncionarios = 0;
    private static final double SALARIO_MINIMO = 1412.00;
    
    public Funcionario(String nome, double salario) {
        this.nome = nome;
        this.salario = Math.max(salario, SALARIO_MINIMO);
        totalFuncionarios++; // incrementa para TODOS
    }
    
    // Método static
    public static int getTotalFuncionarios() {
        return totalFuncionarios;
    }
}

// Uso:
Funcionario f1 = new Funcionario("Ana", 3000);
Funcionario f2 = new Funcionario("Bruno", 4000);
System.out.println(Funcionario.getTotalFuncionarios()); // 2`,
        warning: 'Métodos static NÃO podem acessar atributos de instância (não-static). Eles não sabem qual objeto usar!',
      },
    ],
    summary: ['static pertence à classe, não ao objeto', 'Use para contadores, constantes e utilitários', 'Métodos static não acessam this', 'Acesse via NomeClasse.metodo()'],
  },

  'm3-this': {
    id: 'm3-this', moduleId: 3,
    objectives: ['Entender a referência this', 'Usar this para desambiguar variáveis'],
    sections: [
      { title: 'this — Referência ao Objeto Atual', body: 'this é uma referência ao objeto que está executando o método. É usado para diferenciar atributos de parâmetros com mesmo nome.',
        code: `public class Aluno {
    private String nome;
    private int idade;
    
    // 'this' diferencia atributo do parâmetro
    public Aluno(String nome, int idade) {
        this.nome = nome;   // this.nome = atributo, nome = parâmetro
        this.idade = idade;
    }
    
    // this pode ser usado para encadear métodos
    public Aluno setNome(String nome) {
        this.nome = nome;
        return this; // retorna o próprio objeto
    }
    
    public Aluno setIdade(int idade) {
        this.idade = idade;
        return this;
    }
}

// Method chaining (encadeamento)
Aluno a = new Aluno("Ana", 20);
a.setNome("Ana Maria").setIdade(21); // elegante!`,
      },
    ],
    summary: ['this referencia o objeto atual', 'Usado para desambiguar atributos de parâmetros', 'Permite method chaining retornando this'],
  },

  'm3-inheritance': {
    id: 'm3-inheritance', moduleId: 3,
    objectives: ['Entender herança e quando usá-la', 'Usar extends e super', 'Saber quando herança NÃO é apropriada'],
    sections: [
      { title: 'O que é Herança?', body: 'Herança permite criar uma nova classe (filha) que herda atributos e métodos de outra (pai). Use quando existe uma relação "é um" genuína.\n\nExemplo: Cachorro É UM Animal. Funcionário É UMA Pessoa.',
        code: `// Classe pai (superclasse)
public class Animal {
    protected String nome;
    protected int idade;
    
    public Animal(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    public void comer() {
        System.out.println(nome + " está comendo");
    }
    
    public void dormir() {
        System.out.println(nome + " está dormindo");
    }
}

// Classe filha (subclasse)
public class Cachorro extends Animal {
    private String raca;
    
    public Cachorro(String nome, int idade, String raca) {
        super(nome, idade); // chama construtor do pai
        this.raca = raca;
    }
    
    // Método próprio da subclasse
    public void latir() {
        System.out.println(nome + " está latindo! Au au!");
    }
}

// Uso:
Cachorro rex = new Cachorro("Rex", 3, "Labrador");
rex.comer();   // herdado de Animal
rex.dormir();  // herdado de Animal
rex.latir();   // próprio de Cachorro`,
        codeExplanation: 'Cachorro herda comer() e dormir() de Animal, e adiciona latir(). O super() chama o construtor da classe pai.',
      },
      { title: 'Quando NÃO Usar Herança', body: 'Herança é poderosa mas perigosa se usada errado. Não use apenas para "reaproveitar código" — use quando realmente existe uma relação "é um".',
        warning: 'Carro NÃO É UM Motor. Use composição: Carro TEM UM Motor. Pilha NÃO É UMA ArrayList. Use composição.',
        tip: 'Regra de ouro: "Prefira composição a herança". Herança cria acoplamento forte entre classes. Veremos composição em detalhes numa aula futura.',
      },
    ],
    withoutPoo: `// SEM herança: código duplicado
public class Cachorro {
    String nome; int idade;
    void comer() { System.out.println(nome + " comendo"); }
    void dormir() { System.out.println(nome + " dormindo"); }
    void latir() { System.out.println("Au au!"); }
}

public class Gato {
    String nome; int idade;  // DUPLICADO!
    void comer() { System.out.println(nome + " comendo"); } // DUPLICADO!
    void dormir() { System.out.println(nome + " dormindo"); } // DUPLICADO!
    void miar() { System.out.println("Miau!"); }
}
// Se mudar comer(), precisa mudar em TODAS as classes!`,
    withPoo: `// COM herança: código centralizado
public class Animal {
    protected String nome;
    protected int idade;
    public void comer() { System.out.println(nome + " comendo"); }
    public void dormir() { System.out.println(nome + " dormindo"); }
}

public class Cachorro extends Animal {
    public void latir() { System.out.println("Au au!"); }
}

public class Gato extends Animal {
    public void miar() { System.out.println("Miau!"); }
}
// Mudou comer()? Muda só em Animal!`,
    comparisonExplanation: 'Com herança, o código comum fica na classe pai (Animal). Se precisar alterar o comportamento de comer(), muda em um lugar só. Sem herança, cada animal repete o mesmo código.',
    summary: ['Herança: classe filha herda da pai com extends', 'Use quando existe relação "é um" genuína', 'super() chama o construtor da classe pai', 'protected permite acesso nas subclasses', 'Prefira composição quando a relação é "tem um"'],
  },

  'm3-polymorphism': {
    id: 'm3-polymorphism', moduleId: 3,
    objectives: ['Entender polimorfismo na prática', 'Usar sobrescrita de métodos (@Override)', 'Entender referência do tipo pai'],
    sections: [
      { title: 'O que é Polimorfismo?', body: 'Polimorfismo significa "muitas formas". Na prática: um mesmo método pode ter comportamentos diferentes dependendo do objeto que o executa.',
        code: `public class Animal {
    public void emitirSom() {
        System.out.println("...");
    }
}

public class Cachorro extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
}

public class Gato extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Miau!");
    }
}

// POLIMORFISMO EM AÇÃO:
Animal animal1 = new Cachorro(); // referência de Animal, objeto de Cachorro
Animal animal2 = new Gato();

animal1.emitirSom(); // "Au au!" — executa o do Cachorro!
animal2.emitirSom(); // "Miau!" — executa o do Gato!

// Funciona com arrays/listas:
Animal[] animais = { new Cachorro(), new Gato(), new Cachorro() };
for (Animal a : animais) {
    a.emitirSom(); // cada um faz o seu som!
}`,
        codeExplanation: 'A variável é do tipo Animal, mas o objeto real é Cachorro ou Gato. O Java sabe qual método chamar em tempo de execução. Isso é polimorfismo!',
        tip: '@Override é opcional mas fortemente recomendado. Ele garante que você está realmente sobrescrevendo um método do pai (e não criando um novo por erro de digitação).',
      },
    ],
    summary: ['Polimorfismo: mesmo método, comportamentos diferentes', '@Override indica sobrescrita do método do pai', 'Referência do tipo pai pode apontar para objeto do tipo filho', 'O Java decide qual método chamar em tempo de execução'],
  },

  'm3-abstraction': {
    id: 'm3-abstraction', moduleId: 3,
    objectives: ['Entender classes abstratas', 'Saber quando usar abstract'],
    sections: [
      { title: 'Classes Abstratas', body: 'Uma classe abstrata não pode ser instanciada diretamente. Ela serve como base obrigatória para subclasses.',
        code: `// Classe abstrata — não pode fazer new Forma()
public abstract class Forma {
    protected String cor;
    
    public Forma(String cor) {
        this.cor = cor;
    }
    
    // Método abstrato: SEM corpo, subclasses DEVEM implementar
    public abstract double calcularArea();
    
    // Método concreto: pode ter corpo
    public void exibir() {
        System.out.println("Forma " + cor + " - Área: " + calcularArea());
    }
}

public class Circulo extends Forma {
    private double raio;
    
    public Circulo(String cor, double raio) {
        super(cor);
        this.raio = raio;
    }
    
    @Override
    public double calcularArea() {
        return Math.PI * raio * raio;
    }
}

public class Retangulo extends Forma {
    private double largura, altura;
    
    public Retangulo(String cor, double l, double a) {
        super(cor);
        this.largura = l;
        this.altura = a;
    }
    
    @Override
    public double calcularArea() {
        return largura * altura;
    }
}`,
      },
    ],
    summary: ['abstract class não pode ser instanciada', 'Métodos abstract não têm corpo — subclasses implementam', 'Pode ter métodos concretos (com corpo)', 'Use quando quer forçar subclasses a implementar algo'],
  },

  'm3-interfaces': {
    id: 'm3-interfaces', moduleId: 3,
    objectives: ['Entender interfaces como contratos', 'Implementar interfaces', 'Diferença entre interface e classe abstrata'],
    sections: [
      { title: 'Interfaces — Contratos', body: 'Uma interface define UM CONTRATO: quais métodos uma classe DEVE implementar. Diferente de herança, uma classe pode implementar MÚLTIPLAS interfaces.',
        code: `// Interface define o contrato
public interface Pagavel {
    double calcularPagamento();
    String getDescricao();
}

public interface Imprimivel {
    void imprimir();
}

// Uma classe pode implementar múltiplas interfaces
public class NotaFiscal implements Pagavel, Imprimivel {
    private String cliente;
    private double valor;
    
    public NotaFiscal(String cliente, double valor) {
        this.cliente = cliente;
        this.valor = valor;
    }
    
    @Override
    public double calcularPagamento() {
        return valor * 1.1; // com imposto
    }
    
    @Override
    public String getDescricao() {
        return "NF de " + cliente;
    }
    
    @Override
    public void imprimir() {
        System.out.println(getDescricao() + " - R$" + calcularPagamento());
    }
}`,
        tip: 'Interface = "o que fazer". Classe = "como fazer". Use interfaces para desacoplar seu código.',
      },
    ],
    summary: ['Interface define contratos (métodos obrigatórios)', 'Uma classe pode implementar múltiplas interfaces', 'Todos os métodos da interface devem ser implementados', 'Use interfaces para código desacoplado e flexível'],
  },

  'm3-composition': {
    id: 'm3-composition', moduleId: 3,
    objectives: ['Entender composição vs herança', 'Aplicar "tem um" vs "é um"'],
    sections: [
      { title: 'Composição: "Tem um"', body: 'Composição é quando um objeto CONTÉM outro. É mais flexível que herança.',
        code: `// Motor é um componente independente
public class Motor {
    private int potencia;
    
    public Motor(int potencia) {
        this.potencia = potencia;
    }
    
    public void ligar() {
        System.out.println("Motor de " + potencia + "cv ligado!");
    }
}

// Carro TEM UM Motor (composição)
public class Carro {
    private String modelo;
    private Motor motor; // composição!
    
    public Carro(String modelo, int potencia) {
        this.modelo = modelo;
        this.motor = new Motor(potencia);
    }
    
    public void ligar() {
        System.out.println(modelo + " pronto!");
        motor.ligar(); // delega ao motor
    }
}

// Carro NÃO extends Motor — faz sentido? Carro é um Motor? NÃO!
// Carro TEM um Motor? SIM! Use composição.`,
      },
    ],
    summary: ['Composição: objeto contém outro objeto', 'Use para relação "tem um" (Carro TEM Motor)', 'Herança para relação "é um" (Cachorro É Animal)', 'Composição é mais flexível e desacoplada'],
  },

  'm3-overloading': {
    id: 'm3-overloading', moduleId: 3,
    objectives: ['Diferenciar sobrecarga e sobrescrita', 'Saber quando usar cada uma'],
    sections: [
      { title: 'Sobrecarga vs Sobrescrita', body: 'Sobrecarga (overloading): mesmo nome, parâmetros DIFERENTES, na MESMA classe.\nSobrescrita (overriding): mesmo nome e parâmetros, em classes DIFERENTES (pai/filho).',
        code: `// SOBRECARGA (overloading) - mesma classe, parâmetros diferentes
public class Calculadora {
    int somar(int a, int b) { return a + b; }
    double somar(double a, double b) { return a + b; }
    int somar(int a, int b, int c) { return a + b + c; }
}

// SOBRESCRITA (overriding) - classe filha redefine método do pai
public class Animal {
    void falar() { System.out.println("..."); }
}
public class Cachorro extends Animal {
    @Override
    void falar() { System.out.println("Au au!"); }
}`,
      },
    ],
    summary: ['Sobrecarga: mesmo nome, parâmetros diferentes, mesma classe', 'Sobrescrita: mesmo nome e parâmetros, classe filha redefine', 'Sobrecarga é decidida em compilação', 'Sobrescrita é decidida em execução (polimorfismo)'],
  },

  'm3-access': {
    id: 'm3-access', moduleId: 3,
    objectives: ['Entender public, private, protected e default'],
    sections: [
      { title: 'Modificadores de Acesso', body: 'Controlam quem pode acessar classes, atributos e métodos.',
        code: `public class Exemplo {
    public int a;      // acessível de QUALQUER lugar
    protected int b;   // acessível no pacote + subclasses
    int c;             // default: acessível apenas no MESMO pacote
    private int d;     // acessível SOMENTE dentro desta classe
}

// Ordem de restrição (menos → mais):
// public > protected > default > private`,
        tip: 'Regra geral: use private por padrão. Exponha apenas o necessário com public. Use protected para herança.',
      },
    ],
    summary: ['private: apenas na classe', 'default: apenas no pacote', 'protected: pacote + subclasses', 'public: qualquer lugar'],
  },

  'm3-exceptions': {
    id: 'm3-exceptions', moduleId: 3,
    objectives: ['Usar try/catch/finally', 'Entender exceções checked vs unchecked', 'Criar exceções personalizadas'],
    sections: [
      { title: 'Tratamento de Exceções', body: 'Exceções são erros que ocorrem durante a execução. try/catch permite tratar esses erros de forma elegante.',
        code: `// try/catch/finally
try {
    int resultado = 10 / 0; // ArithmeticException!
    System.out.println(resultado);
} catch (ArithmeticException e) {
    System.out.println("Erro: divisão por zero!");
    System.out.println("Mensagem: " + e.getMessage());
} finally {
    System.out.println("Sempre executa, com ou sem erro");
}

// Múltiplos catches
try {
    String texto = null;
    texto.length(); // NullPointerException
} catch (NullPointerException e) {
    System.out.println("Objeto nulo!");
} catch (Exception e) {
    System.out.println("Erro genérico: " + e.getMessage());
}

// throws: declara que o método pode lançar exceção
public void lerArquivo(String caminho) throws IOException {
    // código que pode falhar
}`,
        codeExplanation: 'try envolve código que pode falhar. catch trata o erro específico. finally sempre executa (útil para fechar recursos). throws declara que o método pode lançar exceção.',
      },
    ],
    summary: ['try/catch trata erros em tempo de execução', 'finally sempre executa (cleanup)', 'Checked exceptions obrigam tratamento (IOException)', 'Unchecked não obrigam (NullPointerException)', 'throws declara exceções que o método pode lançar'],
  },

  'm3-solid': {
    id: 'm3-solid', moduleId: 3,
    objectives: ['Conhecer os 5 princípios SOLID', 'Aplicar SRP e OCP na prática'],
    sections: [
      { title: 'SOLID — Os 5 Princípios', body: 'SOLID são 5 princípios de design orientado a objetos que tornam o código mais limpo, flexível e manutenível.\n\nS — Single Responsibility: Uma classe deve ter apenas UMA responsabilidade.\nO — Open/Closed: Aberta para extensão, fechada para modificação.\nL — Liskov Substitution: Subclasses devem ser substituíveis pela classe pai.\nI — Interface Segregation: Muitas interfaces pequenas > uma interface grande.\nD — Dependency Inversion: Dependa de abstrações, não de implementações.',
        code: `// S — Single Responsibility (antes)
public class Funcionario {
    void calcularSalario() { /* ... */ }
    void gerarRelatorio() { /* ... */ }  // NÃO! Outra responsabilidade
    void salvarNoBanco() { /* ... */ }   // NÃO! Outra responsabilidade
}

// S — Single Responsibility (depois)
public class Funcionario {
    void calcularSalario() { /* ... */ } // Só faz UMA coisa
}
public class RelatorioService {
    void gerar(Funcionario f) { /* ... */ }
}
public class FuncionarioRepository {
    void salvar(Funcionario f) { /* ... */ }
}`,
        tip: 'Comece pelo S (SRP) — ele já resolve a maioria dos problemas de design. Se uma classe faz muita coisa, quebre em classes menores.',
      },
    ],
    summary: ['S: Uma classe, uma responsabilidade', 'O: Estenda comportamento sem modificar código existente', 'L: Subclasses devem funcionar onde a classe pai funciona', 'I: Interfaces pequenas e específicas', 'D: Dependa de abstrações (interfaces)'],
  },

  'm3-project': {
    id: 'm3-project', moduleId: 3,
    objectives: ['Aplicar todos os conceitos de POO', 'Construir um mini-sistema completo'],
    sections: [
      { title: 'Projeto Final: Sistema de Cadastro', body: 'Vamos juntar tudo num mini-sistema de cadastro de produtos com POO.',
        code: `// Interface para itens que podem ser exibidos
public interface Exibivel {
    String exibir();
}

// Classe abstrata base
public abstract class ItemCadastro implements Exibivel {
    private static int contador = 0;
    private final int id;
    private String nome;
    
    public ItemCadastro(String nome) {
        this.id = ++contador;
        this.nome = nome;
    }
    
    public int getId() { return id; }
    public String getNome() { return nome; }
    
    public abstract double calcularValor();
}

// Produto concreto
public class Produto extends ItemCadastro {
    private double preco;
    private int estoque;
    
    public Produto(String nome, double preco, int estoque) {
        super(nome);
        this.preco = preco;
        this.estoque = estoque;
    }
    
    @Override
    public double calcularValor() {
        return preco * estoque;
    }
    
    @Override
    public String exibir() {
        return getId() + " | " + getNome() + " | R$" + preco 
               + " | Estoque: " + estoque + " | Total: R$" + calcularValor();
    }
}

// Uso com ArrayList
ArrayList<Produto> produtos = new ArrayList<>();
produtos.add(new Produto("Notebook", 3500, 10));
produtos.add(new Produto("Mouse", 89.90, 50));

for (Produto p : produtos) {
    System.out.println(p.exibir());
}`,
        codeExplanation: 'Este projeto usa: interface (Exibivel), classe abstrata (ItemCadastro), herança (Produto extends ItemCadastro), encapsulamento (private + getters), static (contador), polimorfismo (calcularValor e exibir).',
      },
    ],
    summary: ['Combine todos os conceitos: classes, herança, interfaces, encapsulamento', 'Use interfaces para contratos', 'Classes abstratas para comportamento base', 'ArrayList para coleções dinâmicas', 'Parabéns! Você completou o curso! 🎉'],
  },
};
