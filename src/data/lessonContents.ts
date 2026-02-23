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
        body: 'Java é uma linguagem de programação criada em 1995 pela Sun Microsystems (hoje Oracle). É uma das linguagens mais populares do mundo e está presente em praticamente todo lugar: aplicações web (backend), apps Android, sistemas bancários, e-commerces, IoT e muito mais.\n\nO grande diferencial do Java é o conceito "Write Once, Run Anywhere" (Escreva uma vez, rode em qualquer lugar). Você compila seu código uma vez e o arquivo gerado (.class) pode ser executado em qualquer sistema que tenha uma JVM — Windows, Linux, Mac. Isso é possível graças à JVM (Java Virtual Machine), que interpreta o bytecode em qualquer sistema operacional.\n\nPor que aprender Java? Além da ampla adoção no mercado, Java tem sintaxe clara, tipagem estática (o que ajuda a evitar erros), enorme ecossistema de bibliotecas e uma comunidade muito ativa. Dominar Java abre portas para desenvolvimento backend, Android e sistemas enterprise.',
      },
      {
        title: 'JDK, JRE e JVM — Qual a diferença?',
        body: 'Esses três termos confundem muita gente, mas são simples:\n\n• JVM (Java Virtual Machine): É a máquina virtual que executa o bytecode Java. Cada sistema operacional tem sua própria JVM.\n\n• JRE (Java Runtime Environment): Contém a JVM + bibliotecas necessárias para RODAR programas Java.\n\n• JDK (Java Development Kit): Contém a JRE + ferramentas para DESENVOLVER (compilador javac, debugger, etc).',
        tip: 'Para programar em Java, você precisa do JDK. Para apenas rodar programas, basta o JRE.',
      },
      {
        title: 'Estrutura Básica de um Programa',
        body: 'Todo programa Java precisa de pelo menos uma classe e um método main. A classe é o “recipiente” do seu código; o método main é o ponto de entrada — é por onde a JVM começa a executar. Sem um método main com essa assinatura exata, o programa não “roda”.\n\nResumo do que você vê no exemplo abaixo:\n• A classe deve ter o mesmo nome do arquivo (ex.: MeuPrograma.java → class MeuPrograma).\n• public static void main(String[] args) é obrigatório para executar.\n• System.out.println() imprime uma linha e pula para a próxima; System.out.print() imprime sem pular linha.',
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
        body: 'Java é uma linguagem compilada e interpretada. O fluxo é:\n\n1. Você escreve o código-fonte em um arquivo .java.\n2. O compilador javac transforma esse código em bytecode (arquivo .class). O bytecode é uma “linguagem intermediária” que a JVM entende.\n3. A JVM lê o .class e executa as instruções no seu sistema.\n\nIsso explica por que Java é portável: o mesmo .class pode rodar em Windows, Linux ou Mac, desde que haja uma JVM instalada.',
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
    tryItCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Olá, mundo!");
        System.out.println("Estou aprendendo Java.");
        System.out.print("Linha sem pular ");
        System.out.print("--- ainda na mesma linha.");
    }
}`,
    tryItPrompt: 'Altere as mensagens, adicione mais println ou print e execute para ver a saída.',
    codeFillExercises: [
      { instruction: 'Selecione o método correto para imprimir Hello World em Java.', snippetBefore: 'System.out.', snippetAfter: '("Hello World");', options: ['prntl', 'println', 'echo', 'printline'], correctIndex: 1, explanation: 'println é o método da classe PrintStream que imprime o texto e pula uma linha.' },
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
        body: 'Variáveis são espaços na memória do computador que guardam valores. Pense nelas como "caixas etiquetadas": cada caixa tem um nome (identificador), um tipo (o que pode guardar) e um valor.\n\nEm Java você declara o tipo antes de usar. Isso ajuda o compilador a encontrar erros e deixa o código mais claro. Exemplo: int idade = 25; declara uma variável chamada idade, do tipo inteiro, com valor 25. Depois você pode usar idade em cálculos ou alterar o valor (idade = 26;).',
      },
      {
        title: 'Tipos Primitivos',
        body: 'Java tem exatamente 8 tipos primitivos. Eles são os blocos fundamentais de dados e não são objetos (não têm métodos). Cada um ocupa um tamanho fixo na memória e tem um intervalo de valores bem definido. Os mais usados no dia a dia são int (números inteiros) e double (números decimais).',
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
    codeFillExercises: [
      { instruction: 'Complete a declaração de uma variável inteira chamada idade com valor 25.', snippetBefore: '', snippetAfter: ' idade = 25;', options: ['int', 'integer', 'Integer', 'var'], correctIndex: 0, explanation: 'Em Java usamos o tipo primitivo int para números inteiros.' },
      { instruction: 'Para comparar o conteúdo de duas Strings em Java, qual método usar?', snippetBefore: 'if (nome.', snippetAfter: '("Maria")) { ... }', options: ['==', 'equals', 'compare', 'same'], correctIndex: 1, explanation: 'Strings devem ser comparadas com .equals() para comparar conteúdo; == compara referências.' },
    ],
    summary: [
      'Java tem 8 tipos primitivos: byte, short, int, long, float, double, char, boolean',
      'int e double são os mais usados',
      'String é um tipo de referência (objeto), não primitivo',
      'Compare Strings com .equals(), nunca com ==',
      'Casting implícito é automático (menor → maior), explícito precisa de (tipo)',
      'Use final para constantes',
    ],
    tryItCode: `public class Main {
    public static void main(String[] args) {
        int idade = 25;
        double preco = 19.90;
        String nome = "Maria";
        System.out.println("Nome: " + nome + ", Idade: " + idade);
        System.out.println("Preco: " + preco);
        // Teste: altere os valores acima e execute novamente.
    }
}`,
    tryItPrompt: 'Altere idade, preco e nome; execute e veja a saída.',
  },

  'm1-operators': {
    id: 'm1-operators', moduleId: 1,
    objectives: ['Dominar operadores aritméticos, relacionais e lógicos', 'Entender precedência de operadores', 'Usar operadores de atribuição compostos'],
    sections: [
      { title: 'Operadores Aritméticos', body: 'Os operadores aritméticos são os mesmos da matemática: +, -, *, /. Em Java, o operador % (módulo) retorna o resto da divisão — muito útil para saber se um número é par (x % 2 == 0) ou para ciclos. Importante: a divisão entre dois inteiros resulta em inteiro (truncada); para obter decimal, use pelo menos um operando como double.',
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
    codeFillExercises: [
      { instruction: 'Qual operador retorna o resto da divisão entre dois inteiros?', snippetBefore: 'int resto = 10 ', snippetAfter: ' 3; // resto = 1', options: ['/', '%', 'mod', 'rem'], correctIndex: 1, explanation: 'O operador % (módulo) retorna o resto da divisão inteira.' },
    ],
    summary: ['Operadores aritméticos: + - * / %', 'Divisão inteira trunca — use double para decimais', 'Operadores relacionais retornam boolean', 'Operadores lógicos: && (e), || (ou), ! (não)'],
    tryItCode: `public class Main {
    public static void main(String[] args) {
        int a = 10, b = 3;
        System.out.println("a + b = " + (a + b));
        System.out.println("a / b (inteiros) = " + (a / b));
        System.out.println("a / b (decimal) = " + (10.0 / 3));
        System.out.println("a % b (resto) = " + (a % b));
        System.out.println("a > b? " + (a > b));
    }
}`,
    tryItPrompt: 'Mude os valores de a e b e veja os resultados.',
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
    codeFillExercises: [
      { instruction: 'Qual operador deve ser usado para comparar dois valores em uma condição?', snippetBefore: 'if (idade ', snippetAfter: ' 18) { ... }', options: ['=', '==', 'equals', ':='], correctIndex: 1, explanation: '== é o operador de igualdade; = é atribuição.' },
    ],
    summary: ['if/else permite executar código condicionalmente', 'else if encadeia múltiplas condições', 'Operador ternário: condição ? valorTrue : valorFalse', 'Combine condições com && e ||'],
    tryItCode: `public class Main {
    public static void main(String[] args) {
        int nota = 7;
        if (nota >= 9) {
            System.out.println("Excelente!");
        } else if (nota >= 7) {
            System.out.println("Aprovado");
        } else if (nota >= 5) {
            System.out.println("Recuperação");
        } else {
            System.out.println("Reprovado");
        }
        // Altere o valor de nota e execute.
    }
}`,
    tryItPrompt: 'Altere o valor de nota (0 a 10) e veja a mensagem.',
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
    codeFillExercises: [
      { instruction: 'Qual palavra-chave encerra cada case no switch para evitar fall-through?', snippetBefore: 'case 1:\n    System.out.println("Domingo");\n    ', snippetAfter: ';\n    break;', options: ['break', 'exit', 'stop', 'end'], correctIndex: 0, explanation: 'break encerra o case e impede que a execução caia nos cases seguintes.' },
    ],
    summary: ['switch compara uma variável com valores fixos', 'Sempre use break para evitar fall-through', 'default é o "else" do switch', 'Funciona com int, char, String, enum'],
    tryItCode: `public class Main {
    public static void main(String[] args) {
        int diaSemana = 3;
        switch (diaSemana) {
            case 1: System.out.println("Domingo"); break;
            case 2: System.out.println("Segunda"); break;
            case 3: System.out.println("Terça"); break;
            case 4: System.out.println("Quarta"); break;
            default: System.out.println("Outro dia"); break;
        }
        // Mude diaSemana de 1 a 7 e execute.
    }
}`,
    tryItPrompt: 'Altere diaSemana (1 a 7) e execute.',
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
    codeFillExercises: [
      { instruction: 'Complete o laço for que repete de 1 a 10. Qual palavra-chave inicia um laço for?', snippetBefore: 'for (int i = 1; i <= 10; i', snippetAfter: ') { ... }', options: ['++', 'i++', '+= 1', '+ 1'], correctIndex: 1, explanation: 'i++ incrementa a variável i em 1 a cada iteração. ++ sozinho não é válido no lugar do incremento.' },
    ],
    summary: ['for: quando sabe o número de repetições', 'while: quando depende de uma condição', 'do-while: garante pelo menos uma execução', 'break sai do laço, continue pula a iteração'],
    tryItCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Contando de 1 a 5:");
        for (int i = 1; i <= 5; i++) {
            System.out.println(i);
        }
        System.out.println("Tabuada do 3:");
        for (int i = 1; i <= 5; i++) {
            System.out.println("3 x " + i + " = " + (3 * i));
        }
    }
}`,
    tryItPrompt: 'Altere o limite do for ou a tabuada e execute.',
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
    codeFillExercises: [
      { instruction: 'Como obter o tamanho de um array em Java?', snippetBefore: 'int[] notas = {10, 8, 7};\nint n = notas.', snippetAfter: ';', options: ['length', 'length()', 'size', 'size()'], correctIndex: 0, explanation: 'Arrays usam o atributo .length (sem parênteses). Strings usam .length().' },
    ],
    summary: ['Arrays armazenam múltiplos valores do mesmo tipo', 'Índices começam em 0', 'Use .length para saber o tamanho', 'for-each é mais limpo quando não precisa do índice', 'Cuidado com IndexOutOfBoundsException'],
    tryItCode: `public class Main {
    public static void main(String[] args) {
        int[] notas = {10, 8, 7, 9, 6};
        System.out.println("Primeira nota: " + notas[0]);
        System.out.println("Quantidade: " + notas.length);
        int soma = 0;
        for (int n : notas) soma += n;
        double media = (double) soma / notas.length;
        System.out.println("Media: " + media);
    }
}`,
    tryItPrompt: 'Altere os valores do array ou adicione mais elementos.',
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
    codeFillExercises: [
      { instruction: 'Como declarar uma matriz (array 2D) de inteiros em Java?', snippetBefore: '', snippetAfter: '[][] matriz = new int[3][4];', options: ['int', 'array', 'matrix', 'Integer'], correctIndex: 0, explanation: 'Matrizes são declaradas com dois pares de colchetes: int[][] para inteiros.' },
    ],
    summary: ['Matrizes são arrays de arrays (2D)', 'Acesse com [linha][coluna]', 'Use loops aninhados para percorrer'],
    tryItCode: `public class Main {
    public static void main(String[] args) {
        int[][] m = { {1, 2}, {3, 4} };
        System.out.println("matriz[0][0] = " + m[0][0]);
        System.out.println("matriz[1][1] = " + m[1][1]);
        for (int i = 0; i < m.length; i++) {
            for (int j = 0; j < m[i].length; j++) {
                System.out.print(m[i][j] + " ");
            }
            System.out.println();
        }
    }
}`,
    tryItPrompt: 'Altere os valores da matriz e execute.',
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
    codeFillExercises: [
      { instruction: 'Qual palavra-chave indica que um método não retorna valor?', snippetBefore: 'public static ', snippetAfter: ' saudacao(String nome) { ... }', options: ['void', 'null', 'none', 'empty'], correctIndex: 0, explanation: 'void indica que o método não retorna nenhum valor.' },
    ],
    summary: ['Métodos organizam e reutilizam código', 'void = sem retorno, return = com retorno', 'Sobrecarga: mesmo nome, parâmetros diferentes', 'Variáveis locais existem apenas dentro do método'],
    tryItCode: `public class Main {
    public static int somar(int a, int b) {
        return a + b;
    }
    public static void main(String[] args) {
        System.out.println("5 + 3 = " + somar(5, 3));
        System.out.println("10 + 20 = " + somar(10, 20));
        // Altere os números na chamada ou crie outro método.
    }
}`,
    tryItPrompt: 'Altere os argumentos de somar() ou crie um método multiplicar().',
  },

  'm2-io': {
    id: 'm2-io', moduleId: 2,
    objectives: ['Ler dados do usuário com Scanner', 'Entender boas práticas de entrada/saída', 'Evitar o bug do buffer ao misturar nextInt/nextDouble com nextLine'],
    sections: [
      { title: 'Scanner para Entrada de Dados', body: 'O Scanner é a forma mais comum de ler dados digitados pelo usuário no console em Java. Ele lê a partir de System.in (entrada padrão) e oferece métodos como nextInt(), nextDouble(), nextLine(), etc., que interpretam o texto digitado.\n\nUse nextLine() para linhas completas (nome, endereço), nextInt() e nextDouble() para números. Um detalhe importante: após ler um número com nextInt() ou nextDouble(), o Enter que o usuário digitou fica no buffer. Se você não consumir essa quebra de linha com um nextLine() em seguida, o próximo nextLine() vai "engolir" essa linha vazia e parecer que pulou a leitura. Sempre que misturar leitura de números e de texto, chame nextLine() após o número para limpar o buffer.',
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
        codeExplanation: 'Criamos o Scanner com System.in. Cada next...() lê o próximo token ou linha. O nextLine() após nextInt() evita que o Enter fique no buffer e atrapalhe a próxima leitura.',
        warning: 'Após nextInt() ou nextDouble(), sempre chame nextLine() para limpar o buffer do teclado. Caso contrário, o próximo nextLine() será pulado!',
      },
      { title: 'Quando usar cada método', body: 'next() lê até o próximo espaço ou quebra de linha. nextLine() lê a linha inteira. nextInt(), nextDouble(), nextBoolean() leem um valor daquele tipo. Para ler vários números na mesma linha, você pode usar nextInt() várias vezes ou ler a linha com nextLine() e depois fazer split() e Integer.parseInt().',
      },
    ],
    codeFillExercises: [
      { instruction: 'Qual método do Scanner lê uma linha completa de texto?', snippetBefore: 'String linha = scanner.', snippetAfter: '();', options: ['next', 'nextLine', 'readLine', 'getLine'], correctIndex: 1, explanation: 'nextLine() lê até a quebra de linha; next() lê apenas até o próximo espaço.' },
    ],
    summary: ['Scanner lê dados do console', 'nextLine() para texto, nextInt()/nextDouble() para números', 'Limpe o buffer com nextLine() após ler números', 'Sempre feche o Scanner com close()'],
    tryItCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Digite seu nome: ");
        String nome = sc.nextLine();
        System.out.print("Digite sua idade: ");
        int idade = sc.hasNextInt() ? sc.nextInt() : 0;
        sc.nextLine();
        System.out.println("Nome: " + nome + ", Idade: " + idade);
        sc.close();
    }
}`,
    tryItPrompt: 'Aqui a entrada é vazia; rode no seu computador (IDE/terminal) para digitar dados de verdade.',
    commonErrors: [
      { title: 'Buffer após nextInt/nextDouble', description: 'Chame nextLine() depois de nextInt() ou nextDouble() para consumir a quebra de linha.' },
      { title: 'Não fechar o Scanner', description: 'Use scanner.close() ao terminar para liberar recursos.' },
    ],
  },

  'm2-strings': {
    id: 'm2-strings', moduleId: 2,
    objectives: ['Dominar os principais métodos de String', 'Entender imutabilidade e StringBuilder', 'Saber quando usar StringBuilder em loops'],
    sections: [
      { title: 'Métodos Essenciais de String', body: 'Strings em Java são imutáveis: você não altera o conteúdo de um objeto String. Métodos como toUpperCase(), trim(), replace() retornam uma NOVA String; a original permanece igual. Por isso é comum fazer: texto = texto.trim(); para "atualizar" a variável com a versão sem espaços.\n\nOs métodos mais usados são: length(), charAt(i), substring(início, fim), indexOf(str), contains(str), startsWith/endsWith, replace, split(regex), trim(), toUpperCase()/toLowerCase(), e para comparar conteúdo use sempre equals() ou equalsIgnoreCase(), nunca ==.',
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
        codeExplanation: 'trim() e strip() removem espaços nas pontas. indexOf retorna a posição (ou -1). split() quebra em um array. StringBuilder evita criar várias Strings ao concatenar em loop.',
        tip: 'Para concatenar strings em loops, use StringBuilder. Concatenar com + dentro de loops cria muitos objetos desnecessários.',
      },
      { title: 'Comparando Strings', body: 'Nunca use == para comparar conteúdo. Use s1.equals(s2) ou s1.equalsIgnoreCase(s2). O == compara se são o mesmo objeto na memória, não o texto.',
      },
    ],
    codeFillExercises: [
      { instruction: 'Qual método divide uma String em um array usando um separador?', snippetBefore: 'String[] partes = "a,b,c".', snippetAfter: '(",");', options: ['split', 'divide', 'break', 'cut'], correctIndex: 0, explanation: 'split(regex) divide a String e retorna um array de partes.' },
    ],
    summary: ['Strings são imutáveis em Java', 'Use .equals() para comparar, nunca ==', 'StringBuilder é mais eficiente para concatenações em loop', 'split() divide, trim() limpa espaços'],
    tryItCode: `public class Main {
    public static void main(String[] args) {
        String s = "  Java Intermediario  ";
        System.out.println("Original: [" + s + "]");
        System.out.println("Trim: [" + s.trim() + "]");
        System.out.println("Maiusculas: " + s.trim().toUpperCase());
        String[] partes = "a,b,c".split(",");
        for (String p : partes) System.out.println("Parte: " + p);
        StringBuilder sb = new StringBuilder();
        sb.append("Hello ").append("World");
        System.out.println(sb);
    }
}`,
    tryItPrompt: 'Altere a String s e os métodos usados; teste split com outro separador.',
    commonErrors: [
      { title: 'Comparar String com ==', description: 'Use .equals() para comparar o conteúdo.' },
      { title: 'Concatenar muitas vezes em loop com +', description: 'Use StringBuilder para melhor desempenho.' },
    ],
  },

  'm2-debug': {
    id: 'm2-debug', moduleId: 2,
    objectives: ['Ler e interpretar stack traces', 'Identificar erros comuns', 'Usar técnicas básicas de debug'],
    sections: [
      { title: 'Lendo um Stack Trace', body: 'Quando ocorre um erro em tempo de execução, a JVM imprime um stack trace (rastro da pilha de chamadas). Saber ler isso é uma das habilidades mais importantes para corrigir bugs.\n\nO stack trace mostra: (1) O tipo da exceção (ex.: ArrayIndexOutOfBoundsException, NullPointerException); (2) A mensagem de erro, que muitas vezes explica o que falhou (ex.: "Index 5 out of bounds for length 3"); (3) A lista de "at arquivo.classe.método(arquivo:linha)" — cada linha é um nível de chamada. O primeiro "at" é onde o erro ocorreu; os de baixo mostram quem chamou quem. Em programas simples, o primeiro at já aponta para a linha do seu código que causou o problema.',
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
        codeExplanation: 'A primeira linha indica a exceção e a mensagem. As linhas "at" indicam o arquivo e a linha exata. Vá direto ao primeiro "at" do seu código para encontrar a causa.',
        tip: 'Sempre leia o stack trace! A primeira linha diz o TIPO de erro, a mensagem explica O QUE aconteceu, e o local diz ONDE aconteceu.',
      },
      { title: 'Erros mais comuns', body: 'NullPointerException: chamou método ou acessou campo em uma referência null. ArrayIndexOutOfBoundsException: índice fora do tamanho do array. NumberFormatException: tentativa de converter uma String que não é número (ex.: Integer.parseInt("abc")). Verifique a linha indicada e a variável que está null ou com índice inválido.',
      },
    ],
    codeFillExercises: [
      { instruction: 'Qual exceção ocorre ao acessar um índice fora do tamanho do array?', snippetBefore: 'int[] a = {1, 2, 3};\nint x = a[5]; // lança ', snippetAfter: '', options: ['ArrayIndexOutOfBoundsException', 'IndexError', 'OutOfBounds', 'ArrayException'], correctIndex: 0, explanation: 'ArrayIndexOutOfBoundsException é lançada quando o índice é negativo ou >= length.' },
    ],
    summary: ['Stack trace mostra tipo, mensagem e localização do erro', 'Leia de baixo para cima para entender a sequência', 'Erros comuns: NullPointerException, ArrayIndexOutOfBounds, NumberFormatException'],
    tryItCode: `public class Main {
    public static void main(String[] args) {
        int[] arr = { 10, 20, 30 };
        System.out.println(arr[5]); // proposital: indice invalido
    }
}`,
    tryItPrompt: 'Execute para ver o stack trace. Depois mude o índice para 0 ou 1 e rode de novo.',
    commonErrors: [
      { title: 'Ignorar o stack trace', description: 'Sempre leia a mensagem e o primeiro "at" do seu arquivo.' },
      { title: 'NullPointerException', description: 'Alguma variável está null; verifique quem chamou o método na linha indicada.' },
    ],
  },

  'm2-collections': {
    id: 'm2-collections', moduleId: 2,
    objectives: ['Entender a diferença entre Array e ArrayList', 'Usar ArrayList para listas dinâmicas', 'Conhecer add, remove, get, size e o for-each'],
    sections: [
      { title: 'ArrayList vs Array', body: 'Um array (int[], String[]) tem tamanho fixo no momento da criação. Se você precisa adicionar ou remover elementos ao longo do programa, use ArrayList, que é uma lista de tamanho dinâmico.\n\nArrayList faz parte do pacote java.util e usa generics: ArrayList<String>, ArrayList<Integer>. Não use ArrayList<int> — para tipos primitivos use o wrapper Integer. Os métodos mais usados são: add(elemento), add(índice, elemento), remove(índice ou elemento), get(índice), size(), contains(elemento), clear(). Você pode percorrer com for-each: for (String s : lista) { ... }.',
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
        codeExplanation: 'new ArrayList<>() cria uma lista vazia. add() insere no final; add(1, "Bia") insere na posição 1. remove() pode ser por índice ou por valor (remove a primeira ocorrência).',
        tip: 'ArrayList usa tipos wrapper (Integer, Double) ao invés de primitivos (int, double). Ex: ArrayList<Integer>, não ArrayList<int>.',
      },
    ],
    codeFillExercises: [
      { instruction: 'Qual método do ArrayList retorna o número de elementos?', snippetBefore: 'ArrayList<String> list = ...;\nint n = list.', snippetAfter: '();', options: ['length', 'size', 'count', 'length()'], correctIndex: 1, explanation: 'ArrayList usa .size(); arrays usam .length (atributo).' },
    ],
    summary: ['Array: tamanho fixo, acesso por índice', 'ArrayList: tamanho dinâmico, mais métodos disponíveis', 'ArrayList usa generics: ArrayList<Tipo>', 'Prefira ArrayList quando o tamanho pode mudar'],
    tryItCode: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> nomes = new ArrayList<>();
        nomes.add("Ana");
        nomes.add("Bruno");
        nomes.add("Carlos");
        System.out.println("Tamanho: " + nomes.size());
        System.out.println("Primeiro: " + nomes.get(0));
        nomes.remove(1);
        for (String n : nomes) System.out.println(n);
    }
}`,
    tryItPrompt: 'Adicione mais nomes, remova por índice ou por valor, e use get(i).',
    commonErrors: [
      { title: 'ArrayList<int>', description: 'Use ArrayList<Integer>; generics não aceitam primitivos.' },
      { title: 'Índice fora do tamanho', description: 'get(i) e remove(i) exigem 0 <= i < size().' },
    ],
  },

  'm2-packages': {
    id: 'm2-packages', moduleId: 2,
    objectives: ['Organizar código em pacotes', 'Usar import corretamente', 'Conhecer a convenção de nomes de pacotes'],
    sections: [
      { title: 'Pacotes em Java', body: 'Pacotes organizam classes em diretórios lógicos e evitam conflitos de nomes: duas classes com o mesmo nome podem coexistir se estiverem em pacotes diferentes (ex.: com.loja.Cliente e com.banco.Cliente).\n\nA declaração package deve ser a primeira linha útil do arquivo (após comentários). O caminho da pasta no disco deve refletir o pacote: a classe com.empresa.modelo.Cliente fica em com/empresa/modelo/Cliente.java. Para usar uma classe de outro pacote, use import no topo do arquivo: import java.util.ArrayList; ou import java.util.*; (importar tudo do pacote). Classes no mesmo pacote não precisam ser importadas.',
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
        codeExplanation: 'package define o "endereço" da classe. import traz classes de outros pacotes para você usar pelo nome curto (ArrayList em vez de java.util.ArrayList).',
      },
      { title: 'Import estático e nome fully qualified', body: 'Você pode usar o nome completo sem import: java.util.ArrayList lista = new java.util.ArrayList<>();. Para métodos estáticos, import static java.lang.Math.PI; permite usar PI em vez de Math.PI.',
      },
    ],
    codeFillExercises: [
      { instruction: 'Como importar a classe ArrayList do pacote java.util?', snippetBefore: '', snippetAfter: ' java.util.ArrayList;', options: ['import', 'use', 'include', 'require'], correctIndex: 0, explanation: 'A palavra-chave import permite usar classes de outros pacotes pelo nome curto.' },
    ],
    summary: ['Pacotes organizam classes em diretórios', 'Declare com package na primeira linha', 'Use import para usar classes de outros pacotes', 'Convenção: com.empresa.projeto.modulo'],
    tryItCode: `import java.util.ArrayList;
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>(Arrays.asList("A", "B", "C"));
        System.out.println("Lista: " + list);
        System.out.println("Classe de list: " + list.getClass().getName());
    }
}`,
    tryItPrompt: 'Veja como import java.util.ArrayList e Arrays.asList permitem usar essas classes.',
    commonErrors: [
      { title: 'Package não bate com a pasta', description: 'O diretório no disco deve corresponder ao nome do pacote.' },
      { title: 'Import de classe que não existe', description: 'Verifique o nome do pacote e da classe (case-sensitive).' },
    ],
  },

  'm3-whatispoo': {
    id: 'm3-whatispoo', moduleId: 3,
    objectives: [
      'Entender o que é Programação Orientada a Objetos (POO)',
      'Compreender os problemas do código procedural que POO resolve',
      'Saber criar um objeto simples com atributos e métodos',
      'Conhecer os 4 pilares da POO com exemplos práticos',
      'Comparar código procedural vs orientado a objetos',
      'Usar Scanner para ler dados do teclado e preencher objetos',
      'Criar múltiplos objetos usando laços de repetição (for)',
    ],
    sections: [
      // ────────── SEÇÃO 1: O Problema do Código Procedural ──────────
      {
        title: 'O Problema do Código Procedural',
        body: 'Antes de entender o que é POO, você precisa entender **qual problema ela resolve**.\n\nImagine que você está criando um sistema de loja para cadastrar produtos. No início, com poucos dados, parece fácil usar variáveis soltas:\n\n- Uma variável para o nome, outra para o preço, outra para o estoque.\n\nMas e quando a loja tiver 50 produtos? 200? Você vai criar 200 variáveis `nome1`, `nome2`, `nome3`...? E se precisar adicionar um campo novo (como "categoria")? Vai alterar TUDO.\n\nEsse é o código **procedural**: tudo solto, sem organização. Os dados ficam espalhados, qualquer parte do código pode mudar qualquer variável, e não há proteção contra erros. Quando o sistema cresce, vira um caos.',
        code: `// CÓDIGO PROCEDURAL — parece funcionar, mas...
public class SemPOO {
    public static void main(String[] args) {
        // Produto 1
        String nome1 = "Camiseta";
        double preco1 = 49.90;
        int estoque1 = 100;

        // Produto 2
        String nome2 = "Calça Jeans";
        double preco2 = 129.90;
        int estoque2 = 50;

        // Vender 1 camiseta
        estoque1 = estoque1 - 1;

        // E se eu quiser validar se tem estoque?
        // Tenho que repetir o if para CADA produto!
        if (estoque2 > 0) {
            estoque2 = estoque2 - 1;
        }

        // Imagina isso com 200 produtos...
        // E se precisar adicionar "categoria"?
        // Vai ter que criar categoria1, categoria2...
        System.out.println(nome1 + " - Estoque: " + estoque1);
        System.out.println(nome2 + " - Estoque: " + estoque2);
    }
}`,
        codeExplanation: '**Linha 4-6**: Cada produto precisa de variáveis separadas (nome1, preco1, estoque1). Imagine fazer isso 200 vezes.\n\n**Linha 14**: Para vender, alteramos a variável diretamente. Não há nenhuma proteção — poderíamos colocar estoque1 = -50 e o programa não reclamaria.\n\n**Linha 17-19**: A validação (verificar se tem estoque) precisa ser repetida manualmente para CADA produto. Se esquecer em um lugar, gera bug.\n\n**Problema central**: os dados não estão agrupados nem protegidos. Qualquer parte do código pode alterar qualquer variável sem validação.',
        warning: 'Código procedural funciona para programas muito pequenos (tipo exercícios de faculdade com 10 linhas). Mas em qualquer sistema real, ele se torna impossível de manter.',
      },

      // ────────── SEÇÃO 2: O que é POO? ──────────
      {
        title: 'O que é POO (Programação Orientada a Objetos)?',
        body: 'POO é uma forma de organizar o código inspirada no mundo real. Em vez de ter variáveis soltas, você agrupa **dados** e **comportamentos** em uma entidade chamada **objeto**.\n\nPense no mundo real: um produto tem nome, preço e estoque (dados), e também tem ações como "vender" e "repor estoque" (comportamentos). Na POO, você cria uma **classe** que define esse molde, e depois cria **objetos** a partir dela.\n\n**Classe** = o molde, a receita, a planta da casa.\n**Objeto** = a coisa real criada a partir do molde.\n\nCom uma única classe `Produto`, você pode criar 1, 50 ou 200 produtos. Cada um tem seus próprios dados, e a validação fica dentro da própria classe — escreveu uma vez, vale para todos.',
        code: `// COM POO: Uma classe resolve tudo
public class Produto {
    // Atributos (dados do produto)
    private String nome;
    private double preco;
    private int estoque;

    // Construtor (como criar um produto)
    public Produto(String nome, double preco, int estoque) {
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoque;
    }

    // Método vender (comportamento)
    public boolean vender(int quantidade) {
        if (quantidade > 0 && quantidade <= this.estoque) {
            this.estoque -= quantidade;
            System.out.println(quantidade + "x " + this.nome + " vendido(s)!");
            return true;
        }
        System.out.println("Estoque insuficiente de " + this.nome + "!");
        return false;
    }

    // Método para exibir informações
    public void exibirInfo() {
        System.out.println(this.nome + " - R$" + this.preco + " | Estoque: " + this.estoque);
    }
}`,
        codeExplanation: '**Linha 3-6** (`private String nome; ...`): Os atributos são **private** — isso significa que NINGUÉM de fora da classe pode alterar esses valores diretamente. Essa é a primeira proteção.\n\n**Linha 9-13** (Construtor): O método especial que roda quando você faz `new Produto(...)`. Ele recebe os dados e preenche os atributos. O `this.nome` se refere ao atributo da classe; `nome` (sem this) é o parâmetro recebido.\n\n**Linha 16-24** (`vender`): A validação está DENTRO da classe! Antes de vender, verifica se `quantidade > 0` e se `quantidade <= this.estoque`. Essa validação vale para TODOS os produtos — não precisa repetir em cada lugar do código.\n\n**Linha 17** (`quantidade <= this.estoque`): `this.estoque` acessa o estoque daquele produto específico. Se você chamar `camiseta.vender(5)`, o `this` se refere à camiseta. Se chamar `calca.vender(2)`, o `this` se refere à calça.\n\n**Linha 18** (`this.estoque -= quantidade`): Só executa se passou na validação. O operador `-=` é atalho para `this.estoque = this.estoque - quantidade`.',
        tip: 'Sempre que pensar "e se alguém alterar esse dado errado?", a resposta é: torne o atributo **private** e crie um método que valida antes de alterar.',
      },

      // ────────── SEÇÃO 3: Criando e Usando Objetos ──────────
      {
        title: 'Criando e Usando Objetos na Prática',
        body: 'Agora que temos a classe `Produto`, vamos usá-la. Para criar um objeto, usamos a palavra-chave **new**:\n\n```\nProduto camiseta = new Produto("Camiseta", 49.90, 100);\n```\n\nIsso cria um objeto do tipo Produto, com nome "Camiseta", preço 49.90 e estoque 100. O construtor é chamado automaticamente.\n\nVocê pode criar quantos objetos quiser a partir da mesma classe. Cada um é independente — alterar o estoque de um não afeta o outro.',
        code: `public class Main {
    public static void main(String[] args) {
        // Criando objetos (cada um é independente!)
        Produto camiseta = new Produto("Camiseta", 49.90, 100);
        Produto calca = new Produto("Calça Jeans", 129.90, 50);
        Produto tenis = new Produto("Tênis", 199.90, 30);

        // Exibir informações
        camiseta.exibirInfo();  // Camiseta - R$49.9 | Estoque: 100
        calca.exibirInfo();     // Calça Jeans - R$129.9 | Estoque: 50

        // Vender produtos
        camiseta.vender(3);     // 3x Camiseta vendido(s)!
        calca.vender(100);      // Estoque insuficiente de Calça Jeans!

        // Ver estoque atualizado
        camiseta.exibirInfo();  // Camiseta - R$49.9 | Estoque: 97
        calca.exibirInfo();     // Calça Jeans - R$129.9 | Estoque: 50 (não mudou!)
    }
}`,
        codeExplanation: '**Linha 4** (`new Produto("Camiseta", 49.90, 100)`): Cria um NOVO objeto na memória e executa o construtor, passando "Camiseta" como nome, 49.90 como preço e 100 como estoque.\n\n**Linha 9** (`camiseta.exibirInfo()`): O ponto (.) significa "chame esse método DESTE objeto". Então exibirInfo() vai mostrar os dados da camiseta, não da calça.\n\n**Linha 13** (`camiseta.vender(3)`): Chama o método vender no objeto camiseta. Dentro do método, `this.estoque` é o estoque DA CAMISETA (100), então 3 <= 100 é true e a venda é realizada.\n\n**Linha 14** (`calca.vender(100)`): Tenta vender 100 calças, mas o estoque é 50. A validação dentro do método impede a venda — sem precisar de nenhum if externo.\n\n**Linha 18**: O estoque da calça continua 50 porque a venda foi rejeitada. A proteção funcionou!',
        tip: 'Cada objeto criado com `new` é independente na memória. Alterar `camiseta` nunca afeta `calca`. Pense neles como cópias separadas do molde.',
        tryItCode: `class Produto {
    private String nome;
    private double preco;
    private int estoque;

    public Produto(String nome, double preco, int estoque) {
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoque;
    }

    public boolean vender(int quantidade) {
        if (quantidade > 0 && quantidade <= this.estoque) {
            this.estoque -= quantidade;
            System.out.println(quantidade + "x " + this.nome + " vendido(s)!");
            return true;
        }
        System.out.println("Estoque insuficiente de " + this.nome + "!");
        return false;
    }

    public void exibirInfo() {
        System.out.println(this.nome + " - R$" + this.preco + " | Estoque: " + this.estoque);
    }
}

public class Main {
    public static void main(String[] args) {
        Produto camiseta = new Produto("Camiseta", 49.90, 100);
        Produto calca = new Produto("Calça Jeans", 129.90, 50);

        camiseta.exibirInfo();
        calca.exibirInfo();

        camiseta.vender(3);
        calca.vender(100);

        System.out.println("\\n--- Após vendas ---");
        camiseta.exibirInfo();
        calca.exibirInfo();
    }
}`,
        tryItPrompt: 'Experimente: crie um terceiro produto (ex: "Boné", 39.90, 20), venda algumas unidades e veja o estoque atualizado. Tente vender mais do que o estoque permite!',
      },

      // ────────── SEÇÃO 4: Usando Scanner para Preencher Objetos ──────────
      {
        title: 'Lendo Dados do Teclado com Scanner',
        body: 'Em programas reais, os dados não vêm escritos no código — vêm do usuário. O **Scanner** é a classe do Java que lê dados do teclado.\n\nPara usar o Scanner, você precisa:\n1. **Importar**: `import java.util.Scanner;` (no topo do arquivo)\n2. **Criar**: `Scanner sc = new Scanner(System.in);`\n3. **Ler**: `sc.nextLine()` para texto, `sc.nextInt()` para inteiro, `sc.nextDouble()` para decimal\n\n**ATENÇÃO** — Existe uma pegadinha famosa: quando você usa `nextInt()` ou `nextDouble()`, o Enter que o usuário apertou fica "sobrando" no buffer. Se depois disso você chamar `nextLine()`, ele vai ler esse Enter vazio em vez do texto! A solução é colocar um `sc.nextLine()` extra para "limpar" o Enter.',
        code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Nome do produto: ");
        String nome = sc.nextLine();

        System.out.print("Preço: ");
        double preco = sc.nextDouble();

        sc.nextLine(); // <-- LIMPA O ENTER que sobrou do nextDouble()

        System.out.print("Estoque inicial: ");
        int estoque = sc.nextInt();

        Produto p = new Produto(nome, preco, estoque);
        p.exibirInfo();

        sc.close();
    }
}`,
        codeExplanation: '**Linha 1** (`import java.util.Scanner`): Importa a classe Scanner. Sem isso, o Java não sabe o que é Scanner.\n\n**Linha 5** (`new Scanner(System.in)`): Cria um Scanner que lê do teclado. `System.in` é a entrada padrão (teclado).\n\n**Linha 7** (`System.out.print`): Usa `print` (sem ln) para que o cursor fique na mesma linha — o usuário digita logo depois dos dois pontos.\n\n**Linha 8** (`sc.nextLine()`): Lê uma linha completa de texto (o nome do produto). O Enter finaliza a leitura.\n\n**Linha 11** (`sc.nextDouble()`): Lê um número decimal. O usuário digita, por exemplo, `49.90` e aperta Enter. O número é lido, mas o Enter fica "pendurado" no buffer.\n\n**Linha 13** (`sc.nextLine()` — LIMPEZA): **Esta linha é ESSENCIAL!** Ela consome o Enter que sobrou do `nextDouble()`. Sem ela, se tivéssemos outro `nextLine()` depois, ele leria uma string vazia em vez de esperar o usuário digitar.\n\n**Linha 18** (`new Produto(nome, preco, estoque)`): Usa as variáveis lidas do teclado para criar o objeto. Os dados vieram do usuário, não do código!\n\n**Linha 21** (`sc.close()`): Fecha o Scanner quando terminar. Boa prática para liberar recursos.',
        warning: 'A pegadinha do nextLine() após nextInt()/nextDouble() é a causa número 1 de bugs em exercícios de faculdade! Sempre coloque um sc.nextLine() extra após ler números se for ler texto depois.',
      },

      // ────────── SEÇÃO 5: Criando Vários Objetos com Laço de Repetição ──────────
      {
        title: 'Criando Vários Objetos com Laço (for)',
        body: 'E se você precisar cadastrar 5 produtos? 10? 50? Não faz sentido escrever `new Produto(...)` cinquenta vezes. É aí que usamos **laços de repetição** (loops).\n\nCom um `for` e um `ArrayList` (uma lista dinâmica do Java), podemos cadastrar quantos produtos quisermos:\n\n- O `for` repete o bloco de código N vezes\n- O `ArrayList` é uma lista que cresce automaticamente (diferente de array que tem tamanho fixo)\n- A cada volta do loop, lemos os dados do teclado e criamos um novo objeto',
        code: `import java.util.Scanner;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ArrayList<Produto> produtos = new ArrayList<>();

        System.out.print("Quantos produtos deseja cadastrar? ");
        int quantidade = sc.nextInt();
        sc.nextLine(); // limpa o Enter

        for (int i = 0; i < quantidade; i++) {
            System.out.println("\\n--- Produto " + (i + 1) + " ---");

            System.out.print("Nome: ");
            String nome = sc.nextLine();

            System.out.print("Preço: ");
            double preco = sc.nextDouble();
            sc.nextLine(); // limpa o Enter após o double

            System.out.print("Estoque: ");
            int estoque = sc.nextInt();
            sc.nextLine(); // limpa o Enter após o int

            Produto p = new Produto(nome, preco, estoque);
            produtos.add(p);
        }

        System.out.println("\\n=== PRODUTOS CADASTRADOS ===");
        for (Produto p : produtos) {
            p.exibirInfo();
        }

        sc.close();
    }
}`,
        codeExplanation: '**Linha 7** (`ArrayList<Produto> produtos = new ArrayList<>()`): Cria uma lista que guarda objetos do tipo Produto. O `<Produto>` indica o tipo dos elementos. Diferente de array (`Produto[]`), o ArrayList cresce automaticamente.\n\n**Linha 10** (`sc.nextInt()`): Lê quantos produtos o usuário quer cadastrar.\n\n**Linha 11** (`sc.nextLine()`): Limpa o Enter — mesma pegadinha de sempre!\n\n**Linha 13** (`for (int i = 0; i < quantidade; i++)`): Repete o bloco `quantidade` vezes. Se o usuário digitou 3, o loop executa 3 vezes (i=0, i=1, i=2).\n\n**Linha 14** (`(i + 1)`): Mostra "Produto 1", "Produto 2"... (somamos 1 porque `i` começa em 0).\n\n**Linha 21 e 25** (`sc.nextLine()` após número): TODA vez que lemos um número e vamos ler texto depois, precisamos limpar o Enter. Dentro do loop isso acontece a cada repetição.\n\n**Linha 27-28** (`new Produto(...)` + `produtos.add(p)`): Cria o objeto com os dados lidos e adiciona na lista. A cada volta do loop, um novo Produto é criado e adicionado.\n\n**Linha 32-34** (`for (Produto p : produtos)`): O **for-each** percorre toda a lista. Para cada Produto `p` na lista, chama `exibirInfo()`. É mais simples que `for (int i = 0; ...)` quando você não precisa do índice.',
        tip: 'O for-each (`for (Tipo item : lista)`) é a forma mais limpa de percorrer uma lista quando você não precisa do índice. Use `for` com índice quando precisar saber em qual posição está.',
        tryItCode: `import java.util.ArrayList;

class Produto {
    private String nome;
    private double preco;
    private int estoque;

    public Produto(String nome, double preco, int estoque) {
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoque;
    }

    public boolean vender(int quantidade) {
        if (quantidade > 0 && quantidade <= this.estoque) {
            this.estoque -= quantidade;
            System.out.println(quantidade + "x " + this.nome + " vendido(s)!");
            return true;
        }
        System.out.println("Estoque insuficiente de " + this.nome + "!");
        return false;
    }

    public void exibirInfo() {
        System.out.println(this.nome + " - R$" + this.preco + " | Estoque: " + this.estoque);
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Produto> produtos = new ArrayList<>();

        // Cadastrando produtos via código (sem Scanner no editor online)
        produtos.add(new Produto("Camiseta", 49.90, 100));
        produtos.add(new Produto("Calça Jeans", 129.90, 50));
        produtos.add(new Produto("Tênis", 199.90, 30));

        System.out.println("=== PRODUTOS ===");
        for (Produto p : produtos) {
            p.exibirInfo();
        }

        System.out.println("\\n=== VENDENDO ===");
        produtos.get(0).vender(5);  // vende 5 camisetas
        produtos.get(1).vender(2);  // vende 2 calças
        produtos.get(2).vender(50); // tenta vender 50 tênis (não tem!)

        System.out.println("\\n=== APÓS VENDAS ===");
        for (Produto p : produtos) {
            p.exibirInfo();
        }
    }
}`,
        tryItPrompt: 'Adicione mais produtos à lista, tente vender quantidades diferentes e veja como a validação funciona para cada objeto independente.',
      },

      // ────────── SEÇÃO 6: Os 4 Pilares da POO ──────────
      {
        title: 'Os 4 Pilares da POO (com Exemplos Práticos)',
        body: 'Agora que você já entendeu o básico, vamos conhecer os **4 pilares da POO** — os princípios que guiam toda a programação orientada a objetos. Não decore nomes: entenda **qual problema cada um resolve**.',
        code: `// ═══ 1. ENCAPSULAMENTO ═══
// Problema: qualquer um pode alterar dados sem validação
// Solução: atributos private + métodos que validam

class ContaBancaria {
    private double saldo; // ninguém acessa diretamente!

    public void depositar(double valor) {
        if (valor > 0) { // <-- validação!
            this.saldo += valor;
        }
    }

    public double getSaldo() {
        return this.saldo; // leitura controlada
    }
}
// saldo é private → só pode ser alterado por depositar()
// Se alguém tentar: conta.saldo = -1000; → ERRO de compilação!

// ═══ 2. HERANÇA ═══
// Problema: repetir código igual em classes parecidas
// Solução: classe filha HERDA atributos e métodos da pai

class Animal {
    String nome;
    public void comer() {
        System.out.println(nome + " está comendo");
    }
}

class Cachorro extends Animal {  // "é um" Animal
    public void latir() {
        System.out.println(nome + " está latindo: Au au!");
    }
}
// Cachorro tem nome e comer() (herdados) + latir() (próprio)

// ═══ 3. POLIMORFISMO ═══
// Problema: tratar tipos diferentes de forma igual
// Solução: mesmo método, comportamento diferente por classe

class Gato extends Animal {
    public void comer() { // sobrescreve o método do pai!
        System.out.println(nome + " come ração de gato");
    }
}
// Animal a = new Gato(); a.comer(); → "come ração de gato"
// O Java chama a versão do OBJETO REAL, não do tipo da variável

// ═══ 4. ABSTRAÇÃO ═══
// Problema: classes muito genéricas não devem ser instanciadas
// Solução: abstract define "o que", subclasses definem "como"

abstract class Forma {
    abstract double calcularArea(); // sem corpo! Cada forma implementa
}

class Circulo extends Forma {
    double raio;
    double calcularArea() { return 3.14159 * raio * raio; }
}

class Retangulo extends Forma {
    double largura, altura;
    double calcularArea() { return largura * altura; }
}`,
        codeExplanation: '**Encapsulamento (linhas 5-18)**: `private double saldo` impede acesso direto. Para alterar, precisa usar `depositar()`, que valida se `valor > 0`. Isso garante que ninguém faça `conta.saldo = -1000` — o compilador nem permite!\n\n**Herança (linhas 24-36)**: `Cachorro extends Animal` significa que Cachorro herda tudo de Animal (nome, comer). Assim você não precisa reescrever `nome` e `comer()` na classe Cachorro. A palavra `extends` cria a relação "é um".\n\n**Polimorfismo (linhas 42-48)**: Gato também herda de Animal, mas **sobrescreve** o método `comer()` com sua própria versão. Quando você faz `Animal a = new Gato(); a.comer();`, o Java chama a versão do Gato, não a do Animal. Isso é polimorfismo: mesmo método, comportamento diferente.\n\n**Abstração (linhas 53-63)**: `abstract class Forma` não pode ser instanciada (não faz sentido criar "uma forma genérica"). O método `calcularArea()` é abstract — não tem corpo. Cada subclasse (Circulo, Retangulo) DEVE implementar sua própria versão. Isso define "o que" (toda forma tem área) sem fixar "como".',
        tip: 'Não decore os pilares mecanicamente. Pense assim:\n- **Encapsulamento** → "proteger dados"\n- **Herança** → "reaproveitar código"\n- **Polimorfismo** → "mesmo método, comportamento diferente"\n- **Abstração** → "definir o que, sem definir como"',
      },

      // ────────── SEÇÃO 7: Quando Usar e Quando NÃO Usar POO ──────────
      {
        title: 'Quando Usar e Quando NÃO Usar POO',
        body: 'POO não é a solução para TUDO. Existem casos onde código procedural é mais adequado:\n\n**Use POO quando:**\n- O sistema tem entidades claras (Produto, Cliente, Pedido, Conta)\n- Dados precisam de validação e proteção\n- Múltiplos objetos do mesmo tipo serão criados\n- O código precisa ser reutilizado e mantido por muito tempo\n- O projeto vai crescer (mais funcionalidades no futuro)\n\n**NÃO precisa de POO quando:**\n- Scripts simples de poucas linhas (ex: calcular média de 3 notas)\n- Algoritmos isolados que não modelam entidades\n- Programas que rodam uma vez e acabam\n\nNa prática, a maioria dos sistemas reais (web, mobile, desktop, jogos) usa POO. Java, em especial, foi projetado para POO — até o `public static void main` está dentro de uma classe!',
        warning: 'Cuidado com os extremos: não crie classes para tudo (over-engineering), mas também não faça um sistema inteiro com variáveis soltas. O equilíbrio vem com prática.',
        tryItCode: `class Aluno {
    private String nome;
    private double nota1;
    private double nota2;

    public Aluno(String nome, double nota1, double nota2) {
        this.nome = nome;
        this.nota1 = nota1;
        this.nota2 = nota2;
    }

    public double calcularMedia() {
        return (this.nota1 + this.nota2) / 2.0;
    }

    public String getSituacao() {
        double media = calcularMedia();
        if (media >= 7.0) return "Aprovado";
        if (media >= 5.0) return "Recuperação";
        return "Reprovado";
    }

    public void exibirBoletim() {
        System.out.println("Aluno: " + this.nome);
        System.out.println("Nota 1: " + this.nota1);
        System.out.println("Nota 2: " + this.nota2);
        System.out.println("Média: " + calcularMedia());
        System.out.println("Situação: " + getSituacao());
        System.out.println("---");
    }
}

public class Main {
    public static void main(String[] args) {
        Aluno a1 = new Aluno("Maria", 8.5, 9.0);
        Aluno a2 = new Aluno("João", 5.0, 4.5);
        Aluno a3 = new Aluno("Ana", 6.0, 5.5);

        a1.exibirBoletim();
        a2.exibirBoletim();
        a3.exibirBoletim();
    }
}`,
        tryItPrompt: 'Crie mais alunos com notas diferentes e veja como o sistema de média e situação funciona automaticamente para cada um. Tente adicionar uma nota3 ao cálculo!',
      },
    ],

    // ────────── Comparação COM POO vs SEM POO ──────────
    withoutPoo: `// SEM POO: Código procedural para gerenciar produtos
public class SemPOO {
    public static void main(String[] args) {
        // Dados soltos em arrays
        String[] nomes = {"Camiseta", "Calça", "Tênis"};
        double[] precos = {49.90, 129.90, 199.90};
        int[] estoques = {100, 50, 30};

        // Vender: preciso repetir a validação PARA CADA produto
        if (estoques[0] >= 3) {
            estoques[0] -= 3;
        }
        // E se eu esquecer o if em algum lugar?
        estoques[1] = estoques[1] - 999; // Bug! Estoque ficou NEGATIVO!

        // Adicionar campo "categoria"? Criar OUTRO array!
        String[] categorias = {"Roupa", "Roupa", "Calçado"};

        // PROBLEMAS:
        // - Nenhuma proteção (estoque negativo é possível)
        // - Validação precisa ser repetida manualmente
        // - Arrays paralelos são difíceis de manter
        // - Adicionar campos = mais arrays = mais caos
        System.out.println(nomes[1] + " estoque: " + estoques[1]); // -949!
    }
}`,
    withPoo: `// COM POO: Tudo organizado e protegido
public class Produto {
    private String nome;
    private double preco;
    private int estoque;
    private String categoria;

    public Produto(String nome, double preco, int estoque, String categoria) {
        this.nome = nome;
        this.preco = preco;
        this.estoque = Math.max(0, estoque); // nunca negativo!
        this.categoria = categoria;
    }

    public boolean vender(int qtd) {
        if (qtd > 0 && qtd <= this.estoque) {
            this.estoque -= qtd;
            return true;
        }
        System.out.println("Não é possível vender " + qtd + "x " + this.nome);
        return false;
    }

    public void exibirInfo() {
        System.out.println("[" + categoria + "] " + nome
            + " - R$" + preco + " | Estoque: " + estoque);
    }
}

// Uso:
// Produto p1 = new Produto("Camiseta", 49.90, 100, "Roupa");
// p1.vender(3);       // OK! Validação automática
// p1.vender(999);     // Bloqueado! Estoque protegido
// Adicionar campo? Muda só a classe, não o sistema inteiro`,
    comparisonExplanation: 'SEM POO: dados em arrays paralelos, sem proteção (estoque ficou -949!), validação esquecida. COM POO: dados e validação juntos na classe, impossível ter estoque negativo, adicionar campo é alterar UM lugar. A diferença fica gritante conforme o sistema cresce.',

    // ────────── Exercícios de Completar Código ──────────
    codeFillExercises: [
      {
        instruction: 'Para proteger os dados de uma classe e impedir acesso direto, usamos qual modificador?',
        snippetBefore: 'class Produto {\n    ',
        snippetAfter: ' String nome;\n    // ninguém altera diretamente!',
        options: ['public', 'private', 'static', 'void'],
        correctIndex: 1,
        explanation: 'O modificador "private" impede que código de fora da classe acesse o atributo diretamente. Esse é o princípio do Encapsulamento.',
      },
      {
        instruction: 'Para criar um novo objeto Produto, qual palavra-chave é necessária?',
        snippetBefore: 'Produto p = ',
        snippetAfter: ' Produto("Camiseta", 49.90, 100);',
        options: ['create', 'new', 'make', 'init'],
        correctIndex: 1,
        explanation: '"new" aloca memória para o objeto e chama o construtor da classe. Sem "new", nenhum objeto é criado.',
      },
      {
        instruction: 'Qual pilar da POO permite que uma classe filha reaproveite atributos e métodos da classe pai?',
        snippetBefore: 'class Cachorro ',
        snippetAfter: ' Animal {\n    // herda nome e comer()\n}',
        options: ['implements', 'extends', 'includes', 'inherits'],
        correctIndex: 1,
        explanation: '"extends" é a palavra-chave Java para herança. Cachorro extends Animal significa que Cachorro herda tudo de Animal.',
      },
    ],

    // ────────── Erros Comuns ──────────
    commonErrors: [
      {
        title: 'Esquecer sc.nextLine() após nextInt()/nextDouble()',
        description: 'O Enter fica no buffer e o próximo nextLine() lê uma string vazia. Sempre coloque sc.nextLine() extra após ler números.',
        code: `Scanner sc = new Scanner(System.in);
int idade = sc.nextInt();
// sc.nextLine(); // <-- SEM ISSO, o nome abaixo fica vazio!
String nome = sc.nextLine(); // Lê "" (Enter do nextInt)
System.out.println(nome); // Imprime vazio!`,
      },
      {
        title: 'Expor atributos com public em vez de private',
        description: 'Atributos public permitem que qualquer código altere os dados sem validação. Sempre use private + métodos.',
        code: `// ERRADO:
class Produto {
    public int estoque; // qualquer um altera!
}
// produto.estoque = -500; // Compila! Nenhum erro!

// CORRETO:
class Produto {
    private int estoque;
    public boolean vender(int qtd) {
        if (qtd > 0 && qtd <= estoque) {
            estoque -= qtd;
            return true;
        }
        return false; // protegido!
    }
}`,
      },
      {
        title: 'Esquecer o "new" ao criar objeto',
        description: 'Sem new, a variável fica null e dá NullPointerException ao usar.',
        code: `// ERRADO:
Produto p; // apenas declarou, NÃO criou o objeto!
p.exibirInfo(); // NullPointerException!

// CORRETO:
Produto p = new Produto("Camiseta", 49.90, 100);
p.exibirInfo(); // Funciona!`,
      },
      {
        title: 'Confundir classe com objeto',
        description: 'A classe é o molde (receita), o objeto é a instância real (bolo). Você não pode "usar" a receita — precisa assar o bolo (new).',
        code: `// Produto é a CLASSE (o molde)
// Para usar, precisa criar OBJETOS (instâncias):
Produto p1 = new Produto("Camiseta", 49.90, 100); // objeto 1
Produto p2 = new Produto("Calça", 129.90, 50);     // objeto 2
// p1 e p2 são independentes!`,
      },
    ],

    // ────────── Resumo ──────────
    summary: [
      'Código procedural usa variáveis soltas — funciona para programas pequenos mas vira caos em sistemas grandes',
      'POO agrupa dados (atributos) e comportamentos (métodos) em objetos',
      'Classe é o molde; Objeto é a instância criada com new',
      'Atributos private + métodos públicos = Encapsulamento (proteger dados)',
      'Scanner lê dados do teclado: nextLine() para texto, nextInt() para inteiro, nextDouble() para decimal',
      'SEMPRE coloque sc.nextLine() extra após nextInt()/nextDouble() para limpar o Enter do buffer',
      'ArrayList + for permitem criar e gerenciar múltiplos objetos facilmente',
      '4 pilares: Encapsulamento (proteger), Herança (reaproveitar), Polimorfismo (mesmo método, comportamento diferente), Abstração (definir o que, não como)',
    ],

    // ────────── Código do "Experimente Aqui" final ──────────
    tryItCode: `import java.util.ArrayList;

class Produto {
    private String nome;
    private double preco;
    private int estoque;

    public Produto(String nome, double preco, int estoque) {
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoque;
    }

    public boolean vender(int quantidade) {
        if (quantidade > 0 && quantidade <= this.estoque) {
            this.estoque -= quantidade;
            System.out.println("Vendido: " + quantidade + "x " + this.nome);
            return true;
        }
        System.out.println("Estoque insuficiente de " + this.nome
            + "! (tem " + this.estoque + ", pediu " + quantidade + ")");
        return false;
    }

    public void exibirInfo() {
        System.out.println(this.nome + " - R$" + this.preco
            + " | Estoque: " + this.estoque);
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Produto> loja = new ArrayList<>();

        loja.add(new Produto("Camiseta", 49.90, 100));
        loja.add(new Produto("Calça Jeans", 129.90, 50));
        loja.add(new Produto("Tênis", 199.90, 30));
        loja.add(new Produto("Boné", 39.90, 80));

        System.out.println("=== ESTOQUE INICIAL ===");
        for (Produto p : loja) {
            p.exibirInfo();
        }

        System.out.println("\\n=== REALIZANDO VENDAS ===");
        loja.get(0).vender(10);  // 10 camisetas
        loja.get(1).vender(3);   // 3 calças
        loja.get(2).vender(50);  // 50 tênis (vai falhar!)
        loja.get(3).vender(5);   // 5 bonés

        System.out.println("\\n=== ESTOQUE ATUALIZADO ===");
        for (Produto p : loja) {
            p.exibirInfo();
        }
    }
}`,
    tryItPrompt: 'Experimente tudo: adicione novos produtos, venda quantidades diferentes, tente vender mais do que o estoque. Veja como a validação protege cada objeto independentemente!',
  },

  'm3-classes': {
    id: 'm3-classes', moduleId: 3,
    objectives: [
      'Entender a diferença entre classe e objeto',
      'Criar classes com atributos e métodos',
      'Instanciar múltiplos objetos independentes com new',
      'Compreender como a memória gerencia objetos',
      'Modelar entidades do mundo real como classes',
      'Usar ArrayList para gerenciar coleções de objetos',
      'Organizar arquivos Java corretamente (1 classe pública por arquivo)',
    ],
    sections: [
      // ────────── SEÇÃO 1: Classe vs Objeto ──────────
      {
        title: 'Classe = Molde, Objeto = Instância',
        body: 'A **classe** é o projeto, o molde, a planta da casa. Ela define **quais atributos** (dados) e **quais métodos** (ações) um objeto terá. Mas a classe em si NÃO é um objeto — ela é só a descrição.\n\nO **objeto** é a instância concreta criada a partir da classe usando **new**. É o objeto que ocupa memória e guarda valores reais.\n\nAnalogia prática:\n- **Classe Carro** = formulário em branco ("marca: ___, modelo: ___, ano: ___")\n- **Objeto meuCarro** = formulário preenchido ("marca: Toyota, modelo: Corolla, ano: 2024")\n\nVocê pode preencher quantos formulários quiser com a mesma estrutura. Cada um é independente — alterar o modelo de meuCarro não muda outroCarro.',
        code: `// ═══ A CLASSE é o MOLDE ═══
public class Carro {
    // Atributos (características que todo carro tem)
    String marca;
    String modelo;
    int ano;
    String cor;

    // Métodos (ações que todo carro pode fazer)
    void ligar() {
        System.out.println(modelo + " ligado! Vrum vrum!");
    }

    void buzinar() {
        System.out.println(modelo + ": BIII BIII!");
    }

    void info() {
        System.out.println(marca + " " + modelo + " (" + ano + ") - " + cor);
    }
}`,
        codeExplanation: '**Linha 2** (`public class Carro`): Define a classe Carro. A palavra `public` significa que outras classes podem usar essa classe. O nome da classe SEMPRE começa com letra maiúscula (PascalCase).\n\n**Linhas 4-7** (Atributos): São as variáveis da classe. Todo objeto Carro terá essas 4 características. Aqui estamos sem `private` ainda (veremos encapsulamento na próxima lição) — por enquanto, os atributos são acessíveis de fora.\n\n**Linhas 10-12** (`void ligar()`): Método que define um comportamento. `void` significa que não retorna nenhum valor. Quando chamado, ele usa `modelo` — que é o atributo daquele objeto específico.\n\n**Linha 19** (`info()`): Outro método que monta uma string com todos os dados do carro. Cada objeto vai mostrar seus próprios dados quando chamar `info()`.',
        tip: 'Nomes de classes em Java SEMPRE começam com letra maiúscula: Carro, Produto, ContaBancaria. Nomes de variáveis e métodos começam com minúscula: meuCarro, calcularTotal.',
      },

      // ────────── SEÇÃO 2: Criando Objetos com new ──────────
      {
        title: 'Criando Objetos com new',
        body: 'Para transformar uma classe em algo utilizável, você precisa **instanciar** um objeto com a palavra-chave **new**:\n\n```\nCarro meuCarro = new Carro();\n```\n\nEssa linha faz três coisas:\n1. **Declara** uma variável `meuCarro` do tipo `Carro`\n2. **Cria** (aloca) um novo objeto na memória com `new Carro()`\n3. **Conecta** a variável ao objeto (a variável "aponta" para o objeto na memória)\n\nDepois de criar o objeto, você acessa seus atributos e métodos usando o **ponto** (`.`):\n- `meuCarro.marca = "Toyota"` → atribui valor ao atributo\n- `meuCarro.ligar()` → chama o método',
        code: `public class Main {
    public static void main(String[] args) {
        // Criando o PRIMEIRO objeto
        Carro meuCarro = new Carro();
        meuCarro.marca = "Toyota";
        meuCarro.modelo = "Corolla";
        meuCarro.ano = 2024;
        meuCarro.cor = "Prata";

        // Criando o SEGUNDO objeto (totalmente independente!)
        Carro outroCarro = new Carro();
        outroCarro.marca = "Honda";
        outroCarro.modelo = "Civic";
        outroCarro.ano = 2023;
        outroCarro.cor = "Preto";

        // Cada objeto tem seus PRÓPRIOS dados
        meuCarro.info();    // Toyota Corolla (2024) - Prata
        outroCarro.info();  // Honda Civic (2023) - Preto

        meuCarro.ligar();   // Corolla ligado! Vrum vrum!
        outroCarro.buzinar(); // Civic: BIII BIII!

        // Alterar meuCarro NÃO afeta outroCarro
        meuCarro.cor = "Vermelho";
        meuCarro.info();    // Toyota Corolla (2024) - Vermelho
        outroCarro.info();  // Honda Civic (2023) - Preto (não mudou!)
    }
}`,
        codeExplanation: '**Linha 4** (`Carro meuCarro = new Carro()`): Lado esquerdo declara a variável. Lado direito cria o objeto na memória. O `=` conecta os dois. A partir daqui, `meuCarro` é um Carro real com atributos próprios.\n\n**Linhas 5-8**: Preenchemos os atributos usando o ponto (`.`). Como os atributos não são `private`, podemos acessá-los diretamente (por enquanto — na aula de encapsulamento isso muda).\n\n**Linha 11** (`new Carro()`): Cria um SEGUNDO objeto, completamente separado na memória. `meuCarro` e `outroCarro` são dois "formulários" diferentes preenchidos com dados diferentes.\n\n**Linhas 18-19**: Quando `meuCarro.info()` é chamado, o Java executa o método `info()` usando os atributos DE `meuCarro`. Quando `outroCarro.info()` é chamado, usa os atributos DE `outroCarro`.\n\n**Linhas 25-27**: Mudar `meuCarro.cor` para "Vermelho" NÃO afeta `outroCarro.cor`. São objetos independentes na memória!',
        tryItCode: `class Carro {
    String marca;
    String modelo;
    int ano;
    String cor;

    void ligar() {
        System.out.println(modelo + " ligado! Vrum vrum!");
    }

    void buzinar() {
        System.out.println(modelo + ": BIII BIII!");
    }

    void info() {
        System.out.println(marca + " " + modelo + " (" + ano + ") - " + cor);
    }
}

public class Main {
    public static void main(String[] args) {
        Carro c1 = new Carro();
        c1.marca = "Toyota";
        c1.modelo = "Corolla";
        c1.ano = 2024;
        c1.cor = "Prata";

        Carro c2 = new Carro();
        c2.marca = "Honda";
        c2.modelo = "Civic";
        c2.ano = 2023;
        c2.cor = "Preto";

        c1.info();
        c2.info();

        c1.ligar();
        c2.buzinar();
    }
}`,
        tryItPrompt: 'Crie um terceiro carro (c3), preencha seus dados e chame info(). Depois altere a cor de c1 e veja que c2 e c3 não mudam!',
      },

      // ────────── SEÇÃO 3: Como a Memória Funciona ──────────
      {
        title: 'Como o Java Gerencia Objetos na Memória',
        body: 'Quando você faz `Carro meuCarro = new Carro()`, duas coisas acontecem na memória:\n\n1. **O objeto** é criado no **Heap** (a área de memória onde objetos vivem). Ele contém os atributos (marca, modelo, ano, cor) com valores iniciais (`null` para Strings, `0` para int).\n\n2. **A variável** `meuCarro` é criada na **Stack** (pilha). Ela NÃO contém o objeto — ela contém uma **referência** (como um endereço) que aponta para o objeto no Heap.\n\nIsso é importante porque:\n- Se você faz `Carro copia = meuCarro;`, a variável `copia` aponta para O MESMO objeto. Alterar `copia.cor` também altera `meuCarro.cor`!\n- Para ter objetos independentes, você precisa de `new` separados.',
        code: `public class Main {
    public static void main(String[] args) {
        // new cria um objeto NOVO no heap
        Carro original = new Carro();
        original.marca = "Toyota";
        original.modelo = "Corolla";
        original.cor = "Prata";

        // CUIDADO: isso NÃO cria uma cópia!
        Carro referencia = original; // aponta pro MESMO objeto!

        referencia.cor = "Vermelho"; // alterou pelo 'referencia'...
        System.out.println(original.cor); // "Vermelho"! Mudou o original!

        // Para ter um objeto SEPARADO, precisa de new
        Carro copia = new Carro();
        copia.marca = original.marca;  // copia os VALORES
        copia.modelo = original.modelo;
        copia.cor = "Azul";

        System.out.println(original.cor);  // "Vermelho" (não mudou)
        System.out.println(copia.cor);     // "Azul" (independente)
    }
}`,
        codeExplanation: '**Linha 4** (`new Carro()`): Cria o objeto no Heap. A variável `original` guarda o "endereço" desse objeto.\n\n**Linha 10** (`Carro referencia = original`): NÃO usa `new`! Apenas copia o endereço. Agora `original` e `referencia` apontam para o MESMO objeto na memória.\n\n**Linhas 12-13**: Como `referencia` aponta para o mesmo objeto que `original`, alterar a cor por `referencia` muda o objeto que `original` também acessa. Parece que "mudou o original", mas na verdade ambos acessam o mesmo objeto.\n\n**Linha 16** (`new Carro()`): Agora sim, cria um objeto NOVO e separado. `copia` aponta para um objeto diferente no Heap.\n\n**Linhas 17-18**: Copia manualmente os valores dos atributos. Os valores são copiados, não a referência.\n\n**Linhas 21-22**: `original` e `copia` são independentes — alterar um não afeta o outro.',
        warning: '`Carro copia = original;` NÃO cria uma cópia! Cria uma segunda variável que aponta para o MESMO objeto. Para criar um objeto realmente independente, você precisa de `new`.',
      },

      // ────────── SEÇÃO 4: Modelando Entidades do Mundo Real ──────────
      {
        title: 'Modelando Entidades do Mundo Real',
        body: 'A grande força da POO é modelar o software como o mundo real. O processo é:\n\n1. **Identifique a entidade**: Qual "coisa" do problema precisa ser representada? (Aluno, Produto, Funcionário, Pedido)\n2. **Defina os atributos**: Quais dados essa entidade tem? (nome, matrícula, nota)\n3. **Defina os métodos**: Quais ações essa entidade faz? (calcularMedia, exibirBoletim)\n\nDica: os **substantivos** do problema viram **classes** e os **verbos** viram **métodos**.\n\n**Exemplo prático**: "O sistema precisa cadastrar **alunos** com **nome**, **RA** e duas **notas**. O aluno pode **calcular a média** e **verificar se passou**."\n- Substantivo: Aluno → classe\n- Dados: nome, ra, nota1, nota2 → atributos\n- Verbos: calcular média, verificar situação → métodos',
        code: `public class Aluno {
    String nome;
    String ra;       // Registro Acadêmico
    double nota1;
    double nota2;

    // Calcular média das duas notas
    double calcularMedia() {
        return (nota1 + nota2) / 2.0;
    }

    // Verificar situação baseado na média
    String getSituacao() {
        double media = calcularMedia();
        if (media >= 7.0) return "Aprovado";
        if (media >= 5.0) return "Recuperação";
        return "Reprovado";
    }

    // Exibir boletim completo
    void exibirBoletim() {
        System.out.println("=== BOLETIM ===");
        System.out.println("Aluno: " + nome + " (RA: " + ra + ")");
        System.out.println("Nota 1: " + nota1);
        System.out.println("Nota 2: " + nota2);
        System.out.println("Média: " + calcularMedia());
        System.out.println("Situação: " + getSituacao());
    }
}`,
        codeExplanation: '**Linhas 2-5** (Atributos): Cada Aluno tem nome, RA e duas notas. Esses dados definem o estado do aluno.\n\n**Linhas 8-10** (`calcularMedia()`): Retorna `double` (a média). Usa `(nota1 + nota2) / 2.0` — o `2.0` (com ponto) garante divisão decimal. Se usasse `/ 2` (inteiro), poderia perder casas decimais.\n\n**Linhas 13-17** (`getSituacao()`): Chama `calcularMedia()` internamente (um método pode chamar outro método da mesma classe!). Usa `if` encadeado para retornar a situação.\n\n**Linhas 21-28** (`exibirBoletim()`): Monta um relatório completo. Note que chama `calcularMedia()` e `getSituacao()` — a lógica está centralizada, se a regra mudar, muda em UM lugar só.',
        tip: 'Para identificar classes e atributos, grife os substantivos do enunciado do problema. Para métodos, grife os verbos. Isso funciona em 90% dos casos!',
      },

      // ────────── SEÇÃO 5: Vários Objetos com ArrayList ──────────
      {
        title: 'Gerenciando Vários Objetos com ArrayList',
        body: 'Em sistemas reais, você não cria objetos um a um. Se o sistema tem 30 alunos, você usa uma **lista** para armazená-los.\n\nO **ArrayList** é a lista dinâmica do Java:\n- Cresce automaticamente (diferente de arrays com tamanho fixo)\n- Aceita qualquer tipo de objeto: `ArrayList<Aluno>`, `ArrayList<Carro>`, etc.\n- Tem métodos prontos: `add()`, `get()`, `size()`, `remove()`\n\nCombinando ArrayList com `for`, você pode cadastrar, buscar e listar objetos facilmente.',
        code: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        // Criar a lista de alunos
        ArrayList<Aluno> turma = new ArrayList<>();

        // Cadastrar alunos
        Aluno a1 = new Aluno();
        a1.nome = "Maria";
        a1.ra = "2024001";
        a1.nota1 = 8.5;
        a1.nota2 = 9.0;
        turma.add(a1); // adiciona na lista

        Aluno a2 = new Aluno();
        a2.nome = "João";
        a2.ra = "2024002";
        a2.nota1 = 5.0;
        a2.nota2 = 4.5;
        turma.add(a2);

        Aluno a3 = new Aluno();
        a3.nome = "Ana";
        a3.ra = "2024003";
        a3.nota1 = 6.0;
        a3.nota2 = 6.5;
        turma.add(a3);

        // Listar todos os alunos
        System.out.println("Total de alunos: " + turma.size());
        for (Aluno aluno : turma) {
            aluno.exibirBoletim();
            System.out.println(); // linha em branco
        }

        // Acessar aluno específico pelo índice
        System.out.println("Primeiro aluno: " + turma.get(0).nome);
    }
}`,
        codeExplanation: '**Linha 1** (`import java.util.ArrayList`): Precisa importar para usar. ArrayList fica no pacote `java.util`.\n\n**Linha 6** (`ArrayList<Aluno> turma = new ArrayList<>()`): Cria uma lista vazia que aceita APENAS objetos Aluno. O `<Aluno>` é o tipo genérico — garante que você não coloque um Carro na lista de alunos por acidente.\n\n**Linha 14** (`turma.add(a1)`): Adiciona o objeto `a1` ao final da lista. A lista cresce automaticamente — não precisa definir tamanho.\n\n**Linha 31** (`turma.size()`): Retorna quantos elementos tem na lista. Como adicionamos 3 alunos, retorna 3.\n\n**Linhas 32-35** (`for (Aluno aluno : turma)`): O for-each percorre todos os alunos da lista. A cada volta, `aluno` recebe o próximo objeto da lista. Muito mais limpo que `for (int i = 0; i < turma.size(); i++)`.\n\n**Linha 38** (`turma.get(0).nome`): `get(0)` retorna o primeiro elemento (índice começa em 0). Como o retorno é um Aluno, podemos acessar `.nome` direto.',
        tryItCode: `import java.util.ArrayList;

class Aluno {
    String nome;
    String ra;
    double nota1;
    double nota2;

    double calcularMedia() {
        return (nota1 + nota2) / 2.0;
    }

    String getSituacao() {
        double media = calcularMedia();
        if (media >= 7.0) return "Aprovado";
        if (media >= 5.0) return "Recuperação";
        return "Reprovado";
    }

    void exibirBoletim() {
        System.out.println("Aluno: " + nome + " (RA: " + ra + ")");
        System.out.println("Notas: " + nota1 + " e " + nota2);
        System.out.println("Média: " + calcularMedia() + " - " + getSituacao());
        System.out.println("---");
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Aluno> turma = new ArrayList<>();

        Aluno a1 = new Aluno();
        a1.nome = "Maria"; a1.ra = "2024001";
        a1.nota1 = 8.5; a1.nota2 = 9.0;
        turma.add(a1);

        Aluno a2 = new Aluno();
        a2.nome = "João"; a2.ra = "2024002";
        a2.nota1 = 5.0; a2.nota2 = 4.5;
        turma.add(a2);

        Aluno a3 = new Aluno();
        a3.nome = "Ana"; a3.ra = "2024003";
        a3.nota1 = 6.0; a3.nota2 = 6.5;
        turma.add(a3);

        System.out.println("=== BOLETIM DA TURMA ===\\n");
        for (Aluno aluno : turma) {
            aluno.exibirBoletim();
        }

        System.out.println("Total de alunos: " + turma.size());
    }
}`,
        tryItPrompt: 'Adicione um quarto e quinto aluno à turma com notas diferentes. Depois tente encontrar quem tem a maior média usando um for!',
      },

      // ────────── SEÇÃO 6: Organizando Arquivos Java ──────────
      {
        title: 'Regras de Organização de Arquivos Java',
        body: 'Em Java, existem regras importantes sobre como organizar as classes em arquivos:\n\n**Regra 1**: Cada arquivo `.java` pode ter **apenas UMA classe `public`**, e o nome do arquivo DEVE ser igual ao nome da classe pública.\n- `Carro.java` → `public class Carro { ... }`\n- `Main.java` → `public class Main { ... }`\n\n**Regra 2**: Você pode ter classes não-públicas (sem `public`) no mesmo arquivo. Útil para classes auxiliares pequenas.\n\n**Regra 3**: O método `main` é o ponto de entrada do programa. Geralmente fica em uma classe separada (como `Main.java` ou `App.java`).\n\n**Na prática (projetos reais)**:\n- Cada classe fica em seu próprio arquivo\n- Arquivos ficam organizados em **pacotes** (pastas)\n- Exemplo: `src/model/Carro.java`, `src/model/Aluno.java`, `src/Main.java`\n\n**No editor online** (como neste curso):\n- Tudo fica em um arquivo só, pois é mais prático para exercícios\n- A classe `Main` (com o `public static void main`) deve ser a pública\n- As outras classes ficam sem `public` antes do `class`',
        code: `// ═══ Em projetos reais: cada classe em seu arquivo ═══

// Arquivo: Carro.java
public class Carro {
    String marca;
    String modelo;
    // ...
}

// Arquivo: Main.java
public class Main {
    public static void main(String[] args) {
        Carro c = new Carro();
        // ...
    }
}

// ═══ No editor online deste curso: tudo junto ═══

// Classe auxiliar SEM public
class Carro {
    String marca;
    String modelo;
    void info() {
        System.out.println(marca + " " + modelo);
    }
}

// Classe principal COM public (nome = Main)
public class Main {
    public static void main(String[] args) {
        Carro c = new Carro();
        c.marca = "Toyota";
        c.modelo = "Corolla";
        c.info();
    }
}`,
        codeExplanation: '**Parte 1 (projeto real)**: Em um projeto Java de verdade, `Carro.java` e `Main.java` são arquivos separados. Cada um tem sua classe `public`. O IDE (como IntelliJ, Eclipse) gerencia isso automaticamente.\n\n**Parte 2 (editor online)**: Como o editor só tem um arquivo, a classe `Carro` fica SEM `public` (linha 21) e a classe `Main` fica COM `public` (linha 29). O Java exige que o arquivo tenha o nome da classe pública — por isso o editor usa `Main`.\n\n**Por que isso importa?** Se você colocar `public` nas duas classes no editor online, dá erro de compilação! Só pode ter UMA classe public por arquivo.',
        warning: 'Se você vir o erro "class X is public, should be declared in a file named X.java", significa que tem mais de uma classe public no mesmo arquivo, ou o nome do arquivo não bate com a classe.',
      },

      // ────────── SEÇÃO 7: Exercício Completo ──────────
      {
        title: 'Exercício Completo: Sistema de Biblioteca',
        body: 'Vamos juntar tudo em um exercício prático: um mini sistema de biblioteca.\n\nO problema: "A biblioteca precisa cadastrar **livros** com **título**, **autor** e **quantidade disponível**. Deve ser possível **emprestar** e **devolver** livros, além de **listar** o acervo."\n\nIdentificando:\n- **Substantivo** → Livro = classe\n- **Dados** → título, autor, quantidadeDisponivel = atributos\n- **Verbos** → emprestar, devolver, exibirInfo = métodos',
        code: `import java.util.ArrayList;

class Livro {
    String titulo;
    String autor;
    int quantidadeDisponivel;

    boolean emprestar() {
        if (quantidadeDisponivel > 0) {
            quantidadeDisponivel--;
            System.out.println("'" + titulo + "' emprestado com sucesso!");
            return true;
        }
        System.out.println("'" + titulo + "' não disponível no momento.");
        return false;
    }

    void devolver() {
        quantidadeDisponivel++;
        System.out.println("'" + titulo + "' devolvido. Obrigado!");
    }

    void exibirInfo() {
        System.out.println(titulo + " - " + autor
            + " | Disponíveis: " + quantidadeDisponivel);
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Livro> acervo = new ArrayList<>();

        Livro l1 = new Livro();
        l1.titulo = "Java Como Programar";
        l1.autor = "Deitel & Deitel";
        l1.quantidadeDisponivel = 3;
        acervo.add(l1);

        Livro l2 = new Livro();
        l2.titulo = "Clean Code";
        l2.autor = "Robert C. Martin";
        l2.quantidadeDisponivel = 1;
        acervo.add(l2);

        System.out.println("=== ACERVO ===");
        for (Livro livro : acervo) {
            livro.exibirInfo();
        }

        System.out.println("\\n=== EMPRÉSTIMOS ===");
        l2.emprestar(); // OK (tinha 1)
        l2.emprestar(); // Falha (agora tem 0)

        System.out.println("\\n=== DEVOLUÇÃO ===");
        l2.devolver();

        System.out.println("\\n=== ACERVO ATUALIZADO ===");
        for (Livro livro : acervo) {
            livro.exibirInfo();
        }
    }
}`,
        codeExplanation: '**Linhas 8-16** (`emprestar()`): Verifica se tem exemplar disponível (quantidadeDisponivel > 0). Se sim, decrementa e retorna `true`. Se não, avisa e retorna `false`. A validação impede que a quantidade fique negativa.\n\n**Linhas 18-21** (`devolver()`): Incrementa a quantidade. Em um sistema real, teríamos validações extras (quem emprestou? quando?), mas para esta aula o conceito é o que importa.\n\n**Linhas 51-52**: O primeiro `emprestar()` funciona (tinha 1 exemplar). O segundo falha porque agora tem 0. A validação dentro do método protege os dados!\n\n**Linha 55** (`devolver()`): Após devolver, a quantidade volta a 1.',
        tryItCode: `import java.util.ArrayList;

class Livro {
    String titulo;
    String autor;
    int quantidadeDisponivel;

    boolean emprestar() {
        if (quantidadeDisponivel > 0) {
            quantidadeDisponivel--;
            System.out.println("'" + titulo + "' emprestado!");
            return true;
        }
        System.out.println("'" + titulo + "' indisponível!");
        return false;
    }

    void devolver() {
        quantidadeDisponivel++;
        System.out.println("'" + titulo + "' devolvido!");
    }

    void exibirInfo() {
        System.out.println(titulo + " (" + autor + ") - Qtd: " + quantidadeDisponivel);
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Livro> acervo = new ArrayList<>();

        Livro l1 = new Livro();
        l1.titulo = "Java Como Programar";
        l1.autor = "Deitel";
        l1.quantidadeDisponivel = 3;
        acervo.add(l1);

        Livro l2 = new Livro();
        l2.titulo = "Clean Code";
        l2.autor = "Uncle Bob";
        l2.quantidadeDisponivel = 1;
        acervo.add(l2);

        System.out.println("=== ACERVO INICIAL ===");
        for (Livro l : acervo) { l.exibirInfo(); }

        System.out.println("\\n=== OPERAÇÕES ===");
        l1.emprestar();
        l2.emprestar();
        l2.emprestar(); // vai falhar!
        l2.devolver();

        System.out.println("\\n=== ACERVO FINAL ===");
        for (Livro l : acervo) { l.exibirInfo(); }
    }
}`,
        tryItPrompt: 'Adicione mais livros ao acervo. Tente emprestar e devolver várias vezes. Adicione um método "temDisponivel()" que retorna true/false!',
      },
    ],

    // ────────── Comparação COM/SEM POO (não se aplica fortemente aqui, omitir) ──────────

    // ────────── Exercícios de Completar Código ──────────
    codeFillExercises: [
      {
        instruction: 'Como criar uma nova instância (objeto) de uma classe em Java?',
        snippetBefore: 'Carro c = ',
        snippetAfter: ' Carro();',
        options: ['new', 'create', 'make', 'instance'],
        correctIndex: 0,
        explanation: 'A palavra-chave "new" aloca memória para o objeto no Heap e chama o construtor da classe.',
      },
      {
        instruction: 'Se fizermos `Carro copia = original;` (sem new), o que acontece?',
        snippetBefore: '// Carro original = new Carro();\n// Carro copia = original;\n// copia e original apontam para o ',
        snippetAfter: ' objeto na memória.',
        options: ['mesmo', 'diferente', 'novo', 'nenhum'],
        correctIndex: 0,
        explanation: 'Sem "new", a variável copia recebe a REFERÊNCIA (endereço) do mesmo objeto. Alterar copia afeta original e vice-versa!',
      },
      {
        instruction: 'Qual método do ArrayList adiciona um elemento ao final da lista?',
        snippetBefore: 'ArrayList<Aluno> turma = new ArrayList<>();\nAluno a = new Aluno();\nturma.',
        snippetAfter: '(a);',
        options: ['add', 'push', 'insert', 'append'],
        correctIndex: 0,
        explanation: 'O método add() adiciona o elemento ao final do ArrayList. Em Java é add(), não push (JavaScript) nem append (Python).',
      },
    ],

    // ────────── Erros Comuns ──────────
    commonErrors: [
      {
        title: 'Esquecer o new ao criar objeto',
        description: 'Sem new, a variável fica como null e dá NullPointerException ao tentar usar.',
        code: `// ERRADO:
Carro c;           // só declarou, NÃO criou objeto
c.marca = "Toyota"; // NullPointerException!

// CORRETO:
Carro c = new Carro(); // agora sim existe um objeto
c.marca = "Toyota";    // funciona!`,
      },
      {
        title: 'Duas classes public no mesmo arquivo',
        description: 'Cada arquivo .java pode ter apenas UMA classe public. No editor online, só Main deve ser public.',
        code: `// ERRADO (no mesmo arquivo):
public class Carro { }
public class Main { } // Erro: só pode ter 1 public!

// CORRETO:
class Carro { }        // sem public
public class Main { }  // só essa é public`,
      },
      {
        title: 'Achar que atribuição copia o objeto',
        description: '`Carro b = a;` não cria uma cópia — ambas as variáveis apontam para o MESMO objeto. Para um objeto independente, use new.',
        code: `Carro a = new Carro();
a.cor = "Azul";

Carro b = a;       // NÃO é cópia! É referência!
b.cor = "Vermelho";

System.out.println(a.cor); // "Vermelho"! (mesmo objeto)`,
      },
      {
        title: 'Confundir atributos de instância com variáveis locais',
        description: 'Atributos pertencem ao objeto (existem enquanto ele existir). Variáveis locais existem só dentro do método.',
        code: `class Exemplo {
    int atributo = 10;  // existe enquanto o objeto existir

    void metodo() {
        int local = 20;  // existe SÓ dentro deste método
        System.out.println(atributo); // OK
    }
    // 'local' não existe mais aqui fora!
}`,
      },
    ],

    // ────────── Resumo ──────────
    summary: [
      'Classe é o molde (estrutura); Objeto é a instância real criada com new',
      'Cada objeto ocupa espaço próprio na memória (Heap) e é independente',
      'Variáveis de objeto guardam REFERÊNCIAS (endereços), não o objeto em si',
      '`Carro b = a;` (sem new) faz b apontar para o MESMO objeto que a',
      'Use ArrayList<Tipo> para guardar coleções de objetos dinâmicamente',
      'for-each (`for (Tipo x : lista)`) é a forma mais limpa de percorrer listas',
      'Substantivos do problema = classes; Verbos = métodos',
      'Cada arquivo .java tem no máximo UMA classe public (nome do arquivo = nome da classe)',
    ],

    // ────────── Código do "Experimente Aqui" final ──────────
    tryItCode: `import java.util.ArrayList;

class Funcionario {
    String nome;
    String cargo;
    double salario;

    void exibirInfo() {
        System.out.println(nome + " | " + cargo + " | R$" + salario);
    }

    void aumentarSalario(double percentual) {
        if (percentual > 0 && percentual <= 100) {
            double aumento = salario * (percentual / 100.0);
            salario += aumento;
            System.out.println(nome + " recebeu aumento de " + percentual
                + "% (+R$" + aumento + ")");
        } else {
            System.out.println("Percentual inválido!");
        }
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Funcionario> equipe = new ArrayList<>();

        Funcionario f1 = new Funcionario();
        f1.nome = "Carlos"; f1.cargo = "Desenvolvedor"; f1.salario = 5000;
        equipe.add(f1);

        Funcionario f2 = new Funcionario();
        f2.nome = "Beatriz"; f2.cargo = "Designer"; f2.salario = 4500;
        equipe.add(f2);

        Funcionario f3 = new Funcionario();
        f3.nome = "Diego"; f3.cargo = "Gerente"; f3.salario = 8000;
        equipe.add(f3);

        System.out.println("=== EQUIPE ANTES DO AUMENTO ===");
        for (Funcionario f : equipe) { f.exibirInfo(); }

        System.out.println("\\n=== APLICANDO AUMENTO DE 10% ===");
        for (Funcionario f : equipe) {
            f.aumentarSalario(10);
        }

        System.out.println("\\n=== EQUIPE APÓS AUMENTO ===");
        for (Funcionario f : equipe) { f.exibirInfo(); }
    }
}`,
    tryItPrompt: 'Adicione mais funcionários, aplique aumentos diferentes para cada um. Crie um método promover(novoCargo) que mude o cargo do funcionário!',
  },

  'm3-attributes': {
    id: 'm3-attributes', moduleId: 3,
    objectives: ['Diferenciar atributos e métodos', 'Entender estado e comportamento', 'Escrever métodos que validam antes de alterar estado'],
    sections: [
      { title: 'Estado e Comportamento', body: '**Atributos** são os dados do objeto: nome, preço, estoque, etc. Eles definem o **estado** em um dado momento. **Métodos** são as ações: vender, calcularTotal, exibirInfo. Eles podem apenas ler o estado ou alterá-lo (com validação).\n\nBoa prática: em vez de permitir que qualquer um faça produto.estoque = -5, crie um método vender(quantidade) que só diminui o estoque se houver quantidade suficiente e que pode registrar a venda. Assim a lógica fica centralizada e os dados protegidos.',
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
        codeExplanation: 'vender() altera o estado (estoque) só se a condição for atendida. calcularTotal() só lê. exibirInfo() mostra o estado atual.',
      },
    ],
    summary: ['Atributos = estado do objeto (dados)', 'Métodos = comportamento (ações)', 'Métodos podem alterar o estado do objeto', 'Bons métodos fazem validações antes de alterar dados'],
    tryItCode: `class Produto {
    String nome;
    double preco;
    int estoque;
    void vender(int qtd) {
        if (qtd <= estoque) { estoque -= qtd; System.out.println(qtd + " vendido(s)"); }
        else System.out.println("Estoque insuficiente");
    }
    void exibirInfo() { System.out.println(nome + " R$" + preco + " Estoque:" + estoque); }
}
public class Main {
    public static void main(String[] args) {
        Produto p = new Produto();
        p.nome = "Notebook";
        p.preco = 3500;
        p.estoque = 10;
        p.exibirInfo();
        p.vender(3);
        p.exibirInfo();
    }
}`,
    tryItPrompt: 'Altere preço e estoque; tente vender mais do que tem em estoque.',
    codeFillExercises: [
      { instruction: 'O que define o estado atual de um objeto em POO?', snippetBefore: 'Os ', snippetAfter: ' armazenam os dados (nome, preço, estoque) do objeto.', options: ['atributos', 'métodos', 'construtores', 'classes'], correctIndex: 0, explanation: 'Atributos são as variáveis que guardam o estado; métodos são as ações.' },
    ],
    commonErrors: [
      { title: 'Método que altera estado sem validar', description: 'Sempre verifique (ex.: quantidade <= estoque) antes de modificar atributos.' },
      { title: 'Atributos públicos demais', description: 'Mais à frente você verá que private + getters/setters protege melhor.' },
    ],
  },

  'm3-constructors': {
    id: 'm3-constructors', moduleId: 3,
    objectives: ['Criar construtores para inicializar objetos', 'Entender construtor padrão e personalizado', 'Usar sobrecarga de construtores'],
    sections: [
      { title: 'O que é um Construtor?', body: 'O **construtor** é um método especial executado no momento do **new**. Ele tem o mesmo nome da classe e não tem tipo de retorno (nem void). Serve para garantir que o objeto nasça já com valores válidos: em vez de criar Pessoa p = new Pessoa(); e depois p.nome = "Ana"; p.idade = 25;, você faz new Pessoa("Ana", 25) e a classe já recebe e atribui os valores.\n\nSe você não definir nenhum construtor, o Java fornece um **construtor padrão** (sem parâmetros). No momento em que você cria um construtor com parâmetros, o padrão deixa de existir — então se precisar de new Pessoa() sem argumentos, terá de definir explicitamente um construtor vazio.',
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
        codeExplanation: 'this.nome refere-se ao atributo da classe; nome sozinho é o parâmetro. Sobrecarga: dois construtores com listas de parâmetros diferentes.',
      },
    ],
    summary: ['Construtor inicializa o objeto ao usar new', 'Tem o mesmo nome da classe e não tem tipo de retorno', 'this.atributo diferencia do parâmetro', 'Sobrecarga permite múltiplos construtores'],
    tryItCode: `class Pessoa {
    String nome;
    int idade;
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    public Pessoa(String nome) {
        this.nome = nome;
        this.idade = 0;
    }
}
public class Main {
    public static void main(String[] args) {
        Pessoa p1 = new Pessoa("Ana", 25);
        Pessoa p2 = new Pessoa("Bruno");
        System.out.println(p1.nome + " " + p1.idade);
        System.out.println(p2.nome + " " + p2.idade);
    }
}`,
    tryItPrompt: 'Crie um terceiro construtor que receba só idade (e use nome padrão).',
    codeFillExercises: [
      { instruction: 'Como referenciar o atributo da classe quando o parâmetro tem o mesmo nome?', snippetBefore: 'public Pessoa(String nome) {\n    ', snippetAfter: '.nome = nome;\n}', options: ['this', 'self', 'super', 'obj'], correctIndex: 0, explanation: 'this refere-se ao objeto atual e diferencia atributo de parâmetro.' },
    ],
    commonErrors: [
      { title: 'Colocar tipo de retorno no construtor', description: 'Construtor não tem void nem nenhum tipo; só o nome da classe.' },
      { title: 'Esquecer que o padrão some', description: 'Se definir Pessoa(String n), new Pessoa() sem argumentos deixa de compilar.' },
    ],
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
    codeFillExercises: [
      { instruction: 'Qual modificador de acesso esconde o atributo de outras classes e permite acesso só por métodos da própria classe?', snippetBefore: 'private double saldo;\n    // ', snippetAfter: ' controla o acesso aos dados.', options: ['private', 'public', 'hidden', 'internal'], correctIndex: 0, explanation: 'private torna o membro acessível apenas dentro da própria classe.' },
    ],
    summary: ['Encapsulamento protege dados com private', 'Getters fornecem acesso de leitura controlado', 'Setters validam antes de alterar', 'Nem todo atributo precisa de get/set', 'Métodos de negócio (depositar, sacar) são melhor que setters genéricos'],
    tryItCode: `class Conta {
    private double saldo = 0;
    public void depositar(double v) { if (v > 0) saldo += v; }
    public boolean sacar(double v) {
        if (v > 0 && v <= saldo) { saldo -= v; return true; }
        return false;
    }
    public double getSaldo() { return saldo; }
}
public class Main {
    public static void main(String[] args) {
        Conta c = new Conta();
        c.depositar(500);
        c.sacar(200);
        System.out.println("Saldo: " + c.getSaldo());
    }
}`,
    tryItPrompt: 'Não existe setSaldo — altere só via depositar/sacar. Teste sacar mais que o saldo.',
  },

  'm3-static': {
    id: 'm3-static', moduleId: 3,
    objectives: ['Entender quando usar static', 'Diferenciar membros de instância e de classe', 'Saber por que métodos static não acessam this'],
    sections: [
      { title: 'static — Pertence à Classe, não ao Objeto', body: 'Atributos e métodos **normais** (sem static) pertencem a cada **objeto**: cada Funcionario tem seu próprio nome e salário. Atributos e métodos **static** pertencem à **classe** e são compartilhados por todos os objetos — por exemplo, um contador totalFuncionarios que aumenta a cada new Funcionario(), ou uma constante SALARIO_MINIMO.\n\nMétodos static **não podem** acessar atributos de instância (não-static), porque não existe "qual objeto" — não há this. Use static para utilitários (Math.sqrt), constantes e contadores de classe.',
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
        codeExplanation: 'totalFuncionarios e getTotalFuncionarios() são da classe; nome e salario são de cada instância. Acesse static pela classe: Funcionario.getTotalFuncionarios().',
        warning: 'Métodos static NÃO podem acessar atributos de instância (não-static). Eles não sabem qual objeto usar!',
      },
    ],
    codeFillExercises: [
      { instruction: 'Qual palavra-chave indica que um membro pertence à classe e não a cada objeto?', snippetBefore: 'private ', snippetAfter: ' int totalFuncionarios = 0;', options: ['static', 'class', 'shared', 'common'], correctIndex: 0, explanation: 'static faz o membro ser compartilhado por todos os objetos da classe.' },
    ],
    summary: ['static pertence à classe, não ao objeto', 'Use para contadores, constantes e utilitários', 'Métodos static não acessam this', 'Acesse via NomeClasse.metodo()'],
    tryItCode: `class Funcionario {
    String nome;
    static int total = 0;
    public Funcionario(String nome) { this.nome = nome; total++; }
    static int getTotal() { return total; }
}
public class Main {
    public static void main(String[] args) {
        new Funcionario("Ana");
        new Funcionario("Bruno");
        System.out.println("Total: " + Funcionario.getTotal());
    }
}`,
    tryItPrompt: 'Crie mais funcionários e veja o contador total subir.',
    commonErrors: [
      { title: 'Acessar atributo de instância em método static', description: 'Dentro de static não existe this; não dá para acessar nome, por exemplo.' },
      { title: 'Abusar de static', description: 'Use static só para o que é realmente da classe (contador, constante, util).' },
    ],
  },

  'm3-this': {
    id: 'm3-this', moduleId: 3,
    objectives: ['Entender a referência this', 'Usar this para desambiguar variáveis', 'Conhecer method chaining retornando this'],
    sections: [
      { title: 'this — Referência ao Objeto Atual', body: 'Dentro de um método de instância, **this** refere-se ao objeto que recebeu a chamada. O uso mais comum é quando o parâmetro tem o mesmo nome do atributo: sem this, nome seria só o parâmetro; com this.nome você deixa claro que está atribuindo ao atributo da classe.\n\n**Method chaining** (encadeamento de métodos) é quando um método retorna **this**, permitindo chamar outro método em sequência: objeto.setNome("A").setIdade(20). Isso só funciona se cada método retornar o próprio objeto.',
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
        codeExplanation: 'No construtor, this.nome = nome atribui o parâmetro ao atributo. setNome retorna this para permitir encadear .setIdade(21).',
      },
    ],
    summary: ['this referencia o objeto atual', 'Usado para desambiguar atributos de parâmetros', 'Permite method chaining retornando this'],
    tryItCode: `class Aluno {
    String nome;
    int idade;
    public Aluno(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}
public class Main {
    public static void main(String[] args) {
        Aluno a = new Aluno("Ana", 20);
        System.out.println(a.nome + " " + a.idade);
    }
}`,
    tryItPrompt: 'Troque o nome do parâmetro para n e use this.nome = n; veja que this continua necessário para o atributo.',
    codeFillExercises: [
      { instruction: 'Para encadear chamadas como obj.setA(1).setB(2), o método deve retornar o quê?', snippetBefore: 'public Aluno setNome(String nome) {\n    this.nome = nome;\n    return ', snippetAfter: ';\n}', options: ['this', 'self', 'obj', 'nome'], correctIndex: 0, explanation: 'Retornar this permite method chaining (encadear chamadas).' },
    ],
    commonErrors: [
      { title: 'Usar this em método static', description: 'Em static não existe "objeto atual", então this não pode ser usado.' },
      { title: 'Confundir parâmetro e atributo', description: 'Se o parâmetro se chama nome, use this.nome para o atributo.' },
    ],
  },

  'm3-inheritance': {
    id: 'm3-inheritance', moduleId: 3,
    objectives: ['Entender herança e quando usá-la', 'Usar extends e super', 'Saber quando herança NÃO é apropriada'],
    sections: [
      { title: 'O que é Herança?', body: '**Herança** permite que uma classe (subclasse/filha) herde atributos e métodos de outra (superclasse/pai), usando **extends**. Use quando a relação entre os conceitos é genuinamente "é um": Cachorro **é um** Animal, Funcionário **é uma** Pessoa.\n\nNa subclasse você pode: usar os membros herdados (nome, comer(), dormir()), adicionar novos (raca, latir()) e **sobrescrever** métodos do pai (redefinir o comportamento). O construtor da subclasse deve chamar **super(...)** na primeira linha para inicializar a parte herdada — senão o compilador tenta super() sem argumentos e pode dar erro se o pai não tiver esse construtor.',
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
        codeExplanation: 'Cachorro herda comer() e dormir() de Animal, e adiciona latir(). O super(nome, idade) chama o construtor da classe pai; deve ser a primeira linha do construtor da filha.',
      },
      { title: 'Quando NÃO Usar Herança', body: 'Herança é poderosa mas perigosa se usada errado. Não use apenas para "reaproveitar código" — use quando realmente existe uma relação "é um". Carro **não é** um Motor; Carro **tem** um Motor (composição). Pilha **não é** uma ArrayList. Prefira composição quando a relação é "tem um".',
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
    codeFillExercises: [
      { instruction: 'Como declarar que Cachorro herda de Animal em Java?', snippetBefore: 'public class Cachorro ', snippetAfter: ' Animal { ... }', options: ['extends', 'inherits', 'implements', 'from'], correctIndex: 0, explanation: 'extends indica que a classe herda da superclasse.' },
    ],
    summary: ['Herança: classe filha herda da pai com extends', 'Use quando existe relação "é um" genuína', 'super() chama o construtor da classe pai', 'protected permite acesso nas subclasses', 'Prefira composição quando a relação é "tem um"'],
    tryItCode: `class Animal {
    protected String nome;
    public Animal(String nome) { this.nome = nome; }
    public void comer() { System.out.println(nome + " comendo"); }
}
class Cachorro extends Animal {
    public Cachorro(String nome) { super(nome); }
    public void latir() { System.out.println(nome + " au au!"); }
}
public class Main {
    public static void main(String[] args) {
        Cachorro rex = new Cachorro("Rex");
        rex.comer();
        rex.latir();
    }
}`,
    tryItPrompt: 'Adicione uma classe Gato extends Animal com método miar() e crie um Gato no main.',
    commonErrors: [
      { title: 'Esquecer super() no construtor da filha', description: 'A primeira linha do construtor da subclasse deve chamar super(...).' },
      { title: 'Herança para "tem um"', description: 'Carro tem Motor → use composição (atributo Motor), não extends Motor.' },
    ],
  },

  'm3-polymorphism': {
    id: 'm3-polymorphism', moduleId: 3,
    objectives: ['Entender polimorfismo na prática', 'Usar sobrescrita de métodos (@Override)', 'Entender referência do tipo pai'],
    sections: [
      { title: 'O que é Polimorfismo?', body: '**Polimorfismo** ("muitas formas") é quando a mesma mensagem (chamada de método) resulta em comportamentos diferentes conforme o tipo real do objeto. Na prática: você declara uma variável do tipo da **superclasse** (Animal) mas ela pode apontar para um objeto de uma **subclasse** (Cachorro ou Gato). Quando chama animal.emitirSom(), o Java não usa o método de Animal — usa o método do **objeto real** (Cachorro ou Gato). Isso é decidido em **tempo de execução** (binding dinâmico). Use **@Override** na subclasse para deixar claro que está sobrescrevendo o método do pai e para o compilador avisar se a assinatura não bater.',
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
    codeFillExercises: [
      { instruction: 'Qual anotação indica que o método da subclasse sobrescreve o método do pai?', snippetBefore: '', snippetAfter: '\n    public void emitirSom() { ... }', options: ['@Override', '@Overrides', '@OverrideMethod', '@OverrideParent'], correctIndex: 0, explanation: '@Override deixa claro que é sobrescrita e o compilador verifica a assinatura.' },
    ],
    summary: ['Polimorfismo: mesmo método, comportamentos diferentes', '@Override indica sobrescrita do método do pai', 'Referência do tipo pai pode apontar para objeto do tipo filho', 'O Java decide qual método chamar em tempo de execução'],
    tryItCode: `class Animal {
    public void emitirSom() { System.out.println("..."); }
}
class Cachorro extends Animal {
    @Override
    public void emitirSom() { System.out.println("Au au!"); }
}
class Gato extends Animal {
    @Override
    public void emitirSom() { System.out.println("Miau!"); }
}
public class Main {
    public static void main(String[] args) {
        Animal a1 = new Cachorro();
        Animal a2 = new Gato();
        a1.emitirSom();
        a2.emitirSom();
    }
}`,
    tryItPrompt: 'A variável é Animal, mas o objeto é Cachorro ou Gato; cada um executa seu emitirSom().',
    commonErrors: [
      { title: 'Esquecer @Override e errar a assinatura', description: 'Com @Override o compilador avisa se o método do pai não existir ou a assinatura for diferente.' },
      { title: 'Atributos e polimorfismo', description: 'Atributos não são polimórficos; o que conta é o tipo da referência. Só métodos são resolvidos pelo objeto real.' },
    ],
  },

  'm3-abstraction': {
    id: 'm3-abstraction', moduleId: 3,
    objectives: ['Entender classes abstratas', 'Saber quando usar abstract', 'Diferenciar método abstrato e concreto'],
    sections: [
      { title: 'Classes Abstratas', body: 'Uma **classe abstrata** (abstract class) não pode ser instanciada com **new**. Ela existe para ser estendida: define parte do comportamento comum e **obriga** as subclasses a implementar certos métodos declarados como **abstract** (sem corpo). Assim você garante que toda "Forma" tenha, por exemplo, calcularArea(), mas cada subclasse (Círculo, Retângulo) implementa do seu jeito. A classe abstrata pode ter construtores (chamados via super nas subclasses), atributos e métodos concretos (com corpo); só os métodos marcados abstract não têm implementação e devem ser implementados nas subclasses.',
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
        codeExplanation: 'Forma é abstrata; calcularArea() é abstract (sem corpo). Circulo e Retangulo são concretas e implementam calcularArea(). exibir() é concreto e usa calcularArea().',
      },
    ],
    codeFillExercises: [
      { instruction: 'Qual palavra-chave declara um método sem implementação que as subclasses devem implementar?', snippetBefore: 'public ', snippetAfter: ' double calcularArea();', options: ['abstract', 'virtual', 'empty', 'override'], correctIndex: 0, explanation: 'Métodos abstract não têm corpo e devem ser implementados nas subclasses concretas.' },
    ],
    summary: ['abstract class não pode ser instanciada', 'Métodos abstract não têm corpo — subclasses implementam', 'Pode ter métodos concretos (com corpo)', 'Use quando quer forçar subclasses a implementar algo'],
    tryItCode: `abstract class Forma {
    protected String cor;
    public Forma(String cor) { this.cor = cor; }
    public abstract double area();
}
class Retangulo extends Forma {
    double l, a;
    public Retangulo(String cor, double l, double a) {
        super(cor);
        this.l = l;
        this.a = a;
    }
    @Override
    public double area() { return l * a; }
}
public class Main {
    public static void main(String[] args) {
        Retangulo r = new Retangulo("azul", 3, 4);
        System.out.println("Area: " + r.area());
    }
}`,
    tryItPrompt: 'Crie uma classe Circulo extends Forma com raio e implemente area() = PI * raio * raio.',
    commonErrors: [
      { title: 'Instanciar classe abstrata', description: 'new Forma() não compila; crie new Circulo() ou new Retangulo().' },
      { title: 'Esquecer de implementar método abstrato', description: 'A subclasse concreta deve implementar todos os métodos abstract do pai.' },
    ],
  },

  'm3-interfaces': {
    id: 'm3-interfaces', moduleId: 3,
    objectives: ['Entender interfaces como contratos', 'Implementar interfaces', 'Diferença entre interface e classe abstrata'],
    sections: [
      { title: 'Interfaces — Contratos', body: 'Uma **interface** define um **contrato**: apenas as assinaturas dos métodos (sem corpo, até Java 7). Quem **implements** a interface se compromete a implementar todos esses métodos. Diferente de herança, uma classe pode implementar **várias** interfaces (implements A, B, C), mas só pode **estender** uma classe. Use interfaces para definir "capacidades" (Pagavel, Imprimivel) sem fixar implementação — isso desacopla e facilita testes e troca de implementação.',
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
    codeFillExercises: [
      { instruction: 'Como declarar que uma classe implementa uma interface em Java?', snippetBefore: 'public class Campainha ', snippetAfter: ' Som { ... }', options: ['implements', 'extends', 'implements interface', 'uses'], correctIndex: 0, explanation: 'implements é usado para interfaces; extends é para herança de classe.' },
    ],
    summary: ['Interface define contratos (métodos obrigatórios)', 'Uma classe pode implementar múltiplas interfaces', 'Todos os métodos da interface devem ser implementados', 'Use interfaces para código desacoplado e flexível'],
    tryItCode: `interface Som {
    void emitir();
}
class Campainha implements Som {
    @Override
    public void emitir() { System.out.println("Trim!"); }
}
public class Main {
    public static void main(String[] args) {
        Som s = new Campainha();
        s.emitir();
    }
}`,
    tryItPrompt: 'Crie outra classe que implemente Som (ex.: Buzina) e use na variável Som.',
    commonErrors: [
      { title: 'Esquecer de implementar um método da interface', description: 'A classe deve implementar todos os métodos declarados na interface.' },
      { title: 'interface vs abstract class', description: 'Interface: só contrato, múltiplas. Abstract class: pode ter estado e implementação, só uma herança.' },
    ],
  },

  'm3-composition': {
    id: 'm3-composition', moduleId: 3,
    objectives: ['Entender composição vs herança', 'Aplicar "tem um" vs "é um"', 'Saber quando preferir composição'],
    sections: [
      { title: 'Composição: "Tem um"', body: '**Composição** é quando um objeto **contém** outro como atributo (um Carro tem um Motor). A relação é "tem um", não "é um". É geralmente mais flexível que herança: você pode trocar o Motor, ter vários motores, ou injetar um Motor mock em testes. Herança cria acoplamento forte (a filha depende da implementação do pai); composição acopla apenas à interface ou tipo do componente. Regra prática: se a frase "X é um Y" não soa natural, use composição (X tem um Y).',
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
        codeExplanation: 'Carro tem um atributo Motor. No construtor cria new Motor(potencia). ligar() delega para motor.ligar().',
      },
    ],
    codeFillExercises: [
      { instruction: 'Quando um Carro contém um Motor como atributo, qual relação estamos modelando?', snippetBefore: 'Carro ', snippetAfter: ' Motor (atributo motor)', options: ['tem um', 'é um', 'extends', 'herda de'], correctIndex: 0, explanation: 'Composição modela "tem um"; herança modela "é um".' },
    ],
    summary: ['Composição: objeto contém outro objeto', 'Use para relação "tem um" (Carro TEM Motor)', 'Herança para relação "é um" (Cachorro É Animal)', 'Composição é mais flexível e desacoplada'],
    tryItCode: `class Motor {
    int potencia;
    Motor(int p) { potencia = p; }
    void ligar() { System.out.println("Motor " + potencia + "cv ligado"); }
}
class Carro {
    String modelo;
    Motor motor;
    Carro(String modelo, int pot) {
        this.modelo = modelo;
        this.motor = new Motor(pot);
    }
    void ligar() { motor.ligar(); }
}
public class Main {
    public static void main(String[] args) {
        Carro c = new Carro("Fusca", 65);
        c.ligar();
    }
}`,
    tryItPrompt: 'Carro tem um Motor (composição). Adicione um atributo Tanque e método abastecer().',
    commonErrors: [
      { title: 'Usar herança para "tem um"', description: 'Carro extends Motor está errado; Carro deve ter um atributo Motor.' },
      { title: 'Não inicializar o componente', description: 'No construtor, crie ou receba o objeto que compõe (ex.: motor = new Motor(pot)).' },
    ],
  },

  'm3-overloading': {
    id: 'm3-overloading', moduleId: 3,
    objectives: ['Diferenciar sobrecarga e sobrescrita', 'Saber quando usar cada uma', 'Entender resolução em compilação vs execução'],
    sections: [
      { title: 'Sobrecarga vs Sobrescrita', body: '**Sobrecarga (overloading)**: vários métodos com o **mesmo nome** na **mesma classe**, mas com **parâmetros diferentes** (número ou tipo). O compilador escolhe qual chamar pelo tipo dos argumentos. Ex.: somar(int, int) e somar(double, double).\n\n**Sobrescrita (overriding)**: a **subclasse** redefine um método que já existe na **superclasse**, com a **mesma assinatura**. Quem decide qual método rodar é a JVM em tempo de execução (polimorfismo). Use @Override na subclasse. Sobrecarga = compilação; sobrescrita = execução.',
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
        codeExplanation: 'Calculadora: três somar() com listas de parâmetros diferentes = sobrecarga. Cachorro.falar() redefine Animal.falar() = sobrescrita.',
      },
    ],
    codeFillExercises: [
      { instruction: 'Vários métodos com o mesmo nome mas parâmetros diferentes na mesma classe é chamado de:', snippetBefore: 'int somar(int a, int b) { ... }\ndouble somar(double a, double b) { ... }\n// Isso é ', snippetAfter: '', options: ['sobrecarga', 'sobrescrita', 'polimorfismo', 'herança'], correctIndex: 0, explanation: 'Sobrecarga (overloading): mesmo nome, parâmetros diferentes, mesma classe.' },
    ],
    summary: ['Sobrecarga: mesmo nome, parâmetros diferentes, mesma classe', 'Sobrescrita: mesmo nome e parâmetros, classe filha redefine', 'Sobrecarga é decidida em compilação', 'Sobrescrita é decidida em execução (polimorfismo)'],
    tryItCode: `class Calc {
    int somar(int a, int b) { return a + b; }
    double somar(double a, double b) { return a + b; }
}
public class Main {
    public static void main(String[] args) {
        Calc c = new Calc();
        System.out.println(c.somar(2, 3));
        System.out.println(c.somar(2.5, 3.5));
    }
}`,
    tryItPrompt: 'Adicione somar(int a, int b, int c) e chame com três inteiros.',
    commonErrors: [
      { title: 'Confundir sobrecarga com sobrescrita', description: 'Sobrecarga = mesma classe, parâmetros diferentes. Sobrescrita = subclasse, mesma assinatura.' },
      { title: 'Mudar só o retorno', description: 'Não é possível sobrecarregar só pelo tipo de retorno; a lista de parâmetros deve ser diferente.' },
    ],
  },

  'm3-access': {
    id: 'm3-access', moduleId: 3,
    objectives: ['Entender public, private, protected e default', 'Aplicar a regra na prática'],
    sections: [
      { title: 'Modificadores de Acesso', body: 'Os modificadores controlam a **visibilidade** de classes, atributos e métodos.\n\n**private**: só dentro da própria classe. É o mais restritivo; use por padrão para atributos.\n\n**default** (sem modificador): visível no **mesmo pacote**. Classes em pacotes diferentes não enxergam.\n\n**protected**: mesmo pacote **ou** subclasses (mesmo em outro pacote). Útil para atributos que a subclasse precisa acessar.\n\n**public**: visível em qualquer lugar. Use para a API que outras classes devem usar (getters, métodos de serviço). Para classes: só uma por arquivo pode ser public e deve ter o nome do arquivo.',
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
    codeFillExercises: [
      { instruction: 'Qual modificador permite acesso apenas no mesmo pacote (sem escrever nada)?', snippetBefore: '// ', snippetAfter: ': visível só no mesmo pacote\nint c;', options: ['default', 'package', 'same', 'internal'], correctIndex: 0, explanation: 'Sem modificador (default/package-private) a visibilidade é apenas no pacote.' },
    ],
    summary: ['private: apenas na classe', 'default: apenas no pacote', 'protected: pacote + subclasses', 'public: qualquer lugar'],
    tryItCode: `class Exemplo {
    private int x = 10;
    public int getX() { return x; }
}
public class Main {
    public static void main(String[] args) {
        Exemplo e = new Exemplo();
        System.out.println(e.getX());
    }
}`,
    tryItPrompt: 'x é private; só getX() é público. Tente acessar e.x no main e veja o erro de compilação.',
    commonErrors: [
      { title: 'Deixar tudo public', description: 'Atributos públicos quebram encapsulamento; prefira private + getters/setters quando fizer sentido.' },
      { title: 'protected em tudo', description: 'Use protected só quando a subclasse realmente precisar acessar; senão private.' },
    ],
  },

  'm3-exceptions': {
    id: 'm3-exceptions', moduleId: 3,
    objectives: ['Usar try/catch/finally', 'Entender exceções checked vs unchecked', 'Quando usar throws'],
    sections: [
      { title: 'Tratamento de Exceções', body: '**Exceções** são condições de erro que ocorrem em tempo de execução (divisão por zero, arquivo não encontrado, etc.). O bloco **try** envolve o código que pode lançar exceção; **catch** captura e trata (por tipo); **finally** executa sempre, com ou sem exceção, e é ideal para fechar recursos (arquivo, conexão).\n\n**Checked exceptions** (ex.: IOException) devem ser tratadas com try/catch ou declaradas com **throws** na assinatura do método. **Unchecked** (RuntimeException e subclasses, ex.: NullPointerException, IllegalArgumentException) não obrigam o programador a tratar. Não use try/catch para controlar fluxo normal; use para falhas reais.',
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
    codeFillExercises: [
      { instruction: 'Qual bloco executa sempre, com ou sem exceção, e é usado para liberar recursos?', snippetBefore: 'try { ... } catch (Exception e) { ... }\n', snippetAfter: ' { System.out.println("Sempre executa"); }', options: ['finally', 'always', 'cleanup', 'end'], correctIndex: 0, explanation: 'O bloco finally é executado sempre, ideal para fechar arquivos ou conexões.' },
    ],
    summary: ['try/catch trata erros em tempo de execução', 'finally sempre executa (cleanup)', 'Checked exceptions obrigam tratamento (IOException)', 'Unchecked não obrigam (NullPointerException)', 'throws declara exceções que o método pode lançar'],
    tryItCode: `public class Main {
    public static void main(String[] args) {
        try {
            int x = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println("Erro: " + e.getMessage());
        } finally {
            System.out.println("Finally sempre executa");
        }
    }
}`,
    tryItPrompt: 'Altere para 10/2 e veja que o finally roda mesmo sem exceção.',
    commonErrors: [
      { title: 'catch genérico demais', description: 'Capture exceções específicas antes da genérica (Exception por último).' },
      { title: 'Ignorar exceção no catch vazio', description: 'No mínimo registre o erro (log) ou re-lance (throw e).' },
    ],
  },

  'm3-solid': {
    id: 'm3-solid', moduleId: 3,
    objectives: ['Conhecer os 5 princípios SOLID', 'Aplicar SRP e OCP na prática', 'Entender L, I e D em resumo'],
    sections: [
      { title: 'SOLID — Os 5 Princípios', body: 'SOLID são cinco princípios de design que ajudam a manter o código limpo, extensível e fácil de manter.\n\n**S — Single Responsibility (SRP)**: Uma classe deve ter **uma única razão para mudar**. Se ela calcula salário, gera relatório e salva no banco, três motivos diferentes podem forçar alteração; prefira separar em classes distintas.\n\n**O — Open/Closed**: Aberta para **extensão** (novas subclasses, novas implementações), fechada para **modificação** (evite mudar código que já funciona). Use polimorfismo e interfaces para estender sem alterar o existente.\n\n**L — Liskov Substitution**: Objetos das subclasses devem poder substituir objetos da superclasse sem quebrar o programa. O contrato (comportamento esperado) deve ser respeitado.\n\n**I — Interface Segregation**: Prefira interfaces pequenas e específicas a uma interface enorme. Quem implementa não deve ser forçado a depender de métodos que não usa.\n\n**D — Dependency Inversion**: Módulos de alto nível não devem depender de módulos de baixo nível; ambos devem depender de **abstrações** (interfaces). Assim você pode trocar implementações (ex.: banco de dados) sem reescrever a lógica.',
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
        codeExplanation: 'SRP: Funcionario só cuida de dados e cálculo de salário. RelatorioService e FuncionarioRepository têm responsabilidades separadas.',
        tip: 'Comece pelo S (SRP) — ele já resolve a maioria dos problemas de design. Se uma classe faz muita coisa, quebre em classes menores.',
      },
    ],
    codeFillExercises: [
      { instruction: 'Qual princípio SOLID diz que uma classe deve ter apenas uma razão para mudar?', snippetBefore: 'O princípio ', snippetAfter: ' (Single Responsibility) diz: uma classe, uma responsabilidade.', options: ['S', 'O', 'L', 'I'], correctIndex: 0, explanation: 'S = Single Responsibility Principle: uma classe deve ter uma única responsabilidade.' },
    ],
    summary: ['S: Uma classe, uma responsabilidade', 'O: Estenda comportamento sem modificar código existente', 'L: Subclasses devem funcionar onde a classe pai funciona', 'I: Interfaces pequenas e específicas', 'D: Dependa de abstrações (interfaces)'],
    commonErrors: [
      { title: 'Classe "Deus" que faz tudo', description: 'Quebre em várias classes com responsabilidades claras (SRP).' },
      { title: 'Estender modificando o pai o tempo todo', description: 'Preferir composição e interfaces para estender (O e D).' },
    ],
  },

  'm3-project': {
    id: 'm3-project', moduleId: 3,
    objectives: ['Aplicar todos os conceitos de POO', 'Construir um mini-sistema completo', 'Revisar interface, classe abstrata, herança e encapsulamento'],
    sections: [
      { title: 'Projeto Final: Sistema de Cadastro', body: 'Este projeto integra os conceitos do módulo: **interface** (Exibivel) define o contrato "exibir"; **classe abstrata** (ItemCadastro) centraliza id, nome e o método abstrato calcularValor(); **herança** (Produto extends ItemCadastro) implementa a lógica concreta; **encapsulamento** (private, getters); **static** (contador de IDs). No main, usamos uma lista (ArrayList) e polimorfismo ao percorrer e chamar exibir(). É um bom modelo para exercitar: você pode adicionar outra subclasse (ex.: Servico com preço por hora) e ver que o código que percorre a lista não precisa mudar.',
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
    codeFillExercises: [
      { instruction: 'Para percorrer uma lista e chamar um método em cada elemento, qual estrutura usar?', snippetBefore: 'for (Produto p : ', snippetAfter: ') {\n    p.exibir();\n}', options: ['produtos', 'lista', 'array', 'itens'], correctIndex: 0, explanation: 'O for-each percorre a coleção e aplica a ação em cada elemento.' },
    ],
    summary: ['Combine todos os conceitos: classes, herança, interfaces, encapsulamento', 'Use interfaces para contratos', 'Classes abstratas para comportamento base', 'ArrayList para coleções dinâmicas', 'Parabéns! Você completou o curso! 🎉'],
    tryItCode: `import java.util.ArrayList;

interface Exibivel { String exibir(); }
abstract class Item {
    String nome;
    Item(String nome) { this.nome = nome; }
    abstract double valor();
}
class Produto extends Item {
    double preco;
    int qtd;
    Produto(String n, double p, int q) { super(n); preco = p; qtd = q; }
    double valor() { return preco * qtd; }
    public String exibir() { return nome + " R$" + preco + " x" + qtd + " = R$" + valor(); }
}
public class Main {
    public static void main(String[] args) {
        ArrayList<Produto> lista = new ArrayList<>();
        lista.add(new Produto("Notebook", 3500, 2));
        lista.add(new Produto("Mouse", 50, 5));
        for (Produto p : lista) System.out.println(p.exibir());
    }
}`,
    tryItPrompt: 'Adicione outro Produto ou crie a classe Servico extends Item e implemente valor() e exibir().',
    commonErrors: [
      { title: 'Esquecer de implementar método abstrato', description: 'Produto deve implementar valor() e exibir().' },
      { title: 'Não chamar super no construtor', description: 'O construtor de Produto deve chamar super(nome) na primeira linha.' },
    ],
  },
};
