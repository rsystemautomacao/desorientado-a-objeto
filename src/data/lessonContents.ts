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
    objectives: [
      'Diferenciar atributos (estado) e métodos (comportamento)',
      'Entender tipos de retorno: void, int, double, String, boolean',
      'Criar métodos com parâmetros e retorno',
      'Escrever métodos que validam antes de alterar estado',
      'Usar métodos que chamam outros métodos da mesma classe',
      'Entender valores padrão dos atributos em Java',
      'Diferenciar métodos que LEEM estado vs métodos que ALTERAM estado',
    ],
    sections: [
      // ────────── SEÇÃO 1: Atributos = Estado ──────────
      {
        title: 'Atributos: O Estado do Objeto',
        body: '**Atributos** são as variáveis declaradas dentro da classe (mas fora de métodos). Eles representam o **estado** do objeto — os dados que ele "carrega".\n\nExemplos:\n- Um Produto tem: `nome`, `preco`, `estoque` (seu estado)\n- Um Aluno tem: `nome`, `ra`, `nota1`, `nota2` (seu estado)\n\nQuando você cria um objeto com `new`, o Java atribui **valores padrão** aos atributos:\n- `int`, `double`, `float` → **0** (ou 0.0)\n- `boolean` → **false**\n- `String` e outros objetos → **null**\n\nIsso significa que se você fizer `new Produto()` sem definir o nome, ele será `null` (nenhum valor), o que pode causar erros!',
        code: `public class Produto {
    // ═══ ATRIBUTOS (estado) ═══
    String nome;        // valor padrão: null
    double preco;       // valor padrão: 0.0
    int estoque;        // valor padrão: 0
    boolean ativo;      // valor padrão: false
    String categoria;   // valor padrão: null
}

public class Main {
    public static void main(String[] args) {
        Produto p = new Produto();

        // Todos os atributos têm valores padrão!
        System.out.println("Nome: " + p.nome);       // null
        System.out.println("Preço: " + p.preco);      // 0.0
        System.out.println("Estoque: " + p.estoque);  // 0
        System.out.println("Ativo: " + p.ativo);      // false

        // Agora atribuímos valores reais
        p.nome = "Camiseta";
        p.preco = 49.90;
        p.estoque = 100;
        p.ativo = true;
        p.categoria = "Vestuário";

        System.out.println("\\nApós atribuir:");
        System.out.println("Nome: " + p.nome);        // Camiseta
        System.out.println("Preço: " + p.preco);       // 49.9
    }
}`,
        codeExplanation: '**Linhas 3-7** (Atributos): Cada um tem um tipo (`String`, `double`, `int`, `boolean`). O Java define valores padrão automaticamente quando o objeto é criado.\n\n**Linha 12** (`new Produto()`): Cria o objeto. Nesse momento, todos os atributos recebem seus valores padrão (null, 0, false).\n\n**Linhas 15-18**: Mostra os valores padrão. `p.nome` é `null` porque é String (objeto). `p.preco` é `0.0` porque é double. `p.ativo` é `false` porque é boolean.\n\n**Linhas 21-25**: Atribuímos valores reais. A partir daqui, o objeto tem dados úteis.\n\n**Por que isso importa?** Se você tentar usar `p.nome.length()` quando nome é null, dá `NullPointerException`! Sempre inicialize seus atributos.',
        warning: 'Atributos do tipo String (e qualquer objeto) começam como null, NÃO como "". Chamar métodos em null causa NullPointerException — o erro mais comum em Java!',
      },

      // ────────── SEÇÃO 2: Métodos = Comportamento ──────────
      {
        title: 'Métodos: O Comportamento do Objeto',
        body: '**Métodos** são as ações que o objeto pode executar. Eles definem o **comportamento** — o que o objeto "faz".\n\nUm método tem:\n- **Tipo de retorno**: o que ele devolve (`void` = nada, `int` = número inteiro, `double` = decimal, `String` = texto, `boolean` = verdadeiro/falso)\n- **Nome**: o que ele faz (convenção: verbo no infinitivo — `calcular`, `exibir`, `vender`)\n- **Parâmetros**: dados que ele precisa receber (entre parênteses)\n- **Corpo**: o código que executa (entre chaves)\n\nExistem dois tipos principais:\n1. **Métodos que LEEM** o estado (getters, cálculos) — não alteram nada\n2. **Métodos que ALTERAM** o estado (setters, ações) — mudam atributos',
        code: `public class ContaBancaria {
    String titular;
    double saldo;
    int totalOperacoes;

    // ═══ MÉTODO VOID (não retorna nada) ═══
    void depositar(double valor) {
        if (valor > 0) {
            saldo += valor;
            totalOperacoes++;
            System.out.println("Depósito de R$" + valor + " realizado!");
        } else {
            System.out.println("Valor inválido!");
        }
    }

    // ═══ MÉTODO COM RETORNO boolean ═══
    boolean sacar(double valor) {
        if (valor > 0 && valor <= saldo) {
            saldo -= valor;
            totalOperacoes++;
            return true;   // sacou com sucesso
        }
        return false;      // não conseguiu sacar
    }

    // ═══ MÉTODO COM RETORNO double ═══
    double getSaldo() {
        return saldo;
    }

    // ═══ MÉTODO COM RETORNO String ═══
    String getResumo() {
        return titular + " | Saldo: R$" + saldo
            + " | Operações: " + totalOperacoes;
    }

    // ═══ MÉTODO QUE CHAMA OUTRO MÉTODO ═══
    void transferir(ContaBancaria destino, double valor) {
        if (this.sacar(valor)) {  // tenta sacar desta conta
            destino.depositar(valor);  // deposita na outra
            System.out.println("Transferência de R$" + valor
                + " de " + this.titular + " para " + destino.titular);
        } else {
            System.out.println("Transferência falhou! Saldo insuficiente.");
        }
    }
}`,
        codeExplanation: '**Linhas 7-15** (`void depositar`): `void` significa que não retorna nada. Recebe `valor` como parâmetro. Valida se é positivo, depois altera `saldo` e incrementa `totalOperacoes`. É um método que ALTERA estado.\n\n**Linhas 18-25** (`boolean sacar`): Retorna `true` se sacou, `false` se não. O chamador pode usar isso: `if (conta.sacar(100)) { ... }`. Note que a validação é dupla: `valor > 0` (não negativo) E `valor <= saldo` (tem saldo).\n\n**Linhas 28-30** (`double getSaldo`): Método simples que apenas RETORNA o saldo. Não altera nada — é um "getter".\n\n**Linhas 33-36** (`String getResumo`): Monta e retorna uma String com informações. Também não altera estado.\n\n**Linhas 39-47** (`transferir`): Método mais complexo que **chama outros métodos**! Primeiro chama `this.sacar(valor)` (que retorna boolean), e se deu certo, chama `destino.depositar(valor)`. Um método pode chamar outros da mesma classe (`this.sacar`) ou de outro objeto (`destino.depositar`).',
        tip: 'Use `void` quando o método faz algo mas não precisa "devolver" um resultado. Use um tipo de retorno (`boolean`, `double`, `String`) quando o chamador precisa saber o resultado.',
      },

      // ────────── SEÇÃO 3: Parâmetros e Retorno na Prática ──────────
      {
        title: 'Parâmetros e Retorno: Como os Métodos se Comunicam',
        body: '**Parâmetros** são os dados que o método precisa receber para trabalhar. **Retorno** é o resultado que ele devolve.\n\nPense assim:\n- Parâmetros = **ingredientes** que você dá para a receita\n- Retorno = **o prato pronto** que a receita devolve\n- Void = a receita não devolve nada (tipo lavar a louça — faz a ação mas não "produz" nada)\n\nRegras importantes:\n- Um método pode ter **0, 1 ou vários parâmetros**\n- Um método pode retornar **apenas 1 valor** (ou void = nenhum)\n- O tipo do `return` DEVE ser compatível com o tipo declarado no método\n- Após o `return`, o método para imediatamente (código depois do return não executa)',
        code: `public class Calculadora {
    // Sem parâmetro, sem retorno
    void exibirMenu() {
        System.out.println("1. Somar");
        System.out.println("2. Subtrair");
    }

    // Com parâmetros, com retorno
    double somar(double a, double b) {
        return a + b;  // retorna o resultado
    }

    // Com parâmetro, com retorno boolean
    boolean ehPositivo(double numero) {
        return numero > 0;  // retorna true ou false
    }

    // Vários parâmetros, com retorno
    double calcularMedia(double n1, double n2, double n3) {
        double soma = n1 + n2 + n3;
        double media = soma / 3.0;
        return media;
    }

    // Retorno String com lógica
    String classificar(double media) {
        if (media >= 9.0) return "Excelente";
        if (media >= 7.0) return "Bom";
        if (media >= 5.0) return "Regular";
        return "Insuficiente";
    }
}

public class Main {
    public static void main(String[] args) {
        Calculadora calc = new Calculadora();

        double resultado = calc.somar(10.5, 20.3);
        System.out.println("Soma: " + resultado); // 30.8

        boolean positivo = calc.ehPositivo(-5);
        System.out.println("É positivo? " + positivo); // false

        double media = calc.calcularMedia(8.0, 7.5, 9.0);
        System.out.println("Média: " + media); // 8.166...
        System.out.println("Classificação: " + calc.classificar(media));
    }
}`,
        codeExplanation: '**Linhas 3-6** (`void exibirMenu()`): Sem parâmetros (parênteses vazios) e sem retorno (void). Apenas imprime na tela.\n\n**Linhas 9-11** (`double somar(double a, double b)`): Recebe DOIS parâmetros (a e b), ambos double. Retorna um double (a soma). Quem chama pode guardar o resultado: `double r = calc.somar(10, 20);`\n\n**Linhas 14-16** (`boolean ehPositivo`): Retorna `boolean` — o resultado da expressão `numero > 0` já é true ou false, então podemos retorná-la diretamente.\n\n**Linhas 19-23** (`calcularMedia`): Recebe 3 parâmetros. Cria variáveis locais (soma, media) para organizar o cálculo. Retorna media.\n\n**Linhas 26-31** (`classificar`): Múltiplos `return` com `if`. O PRIMEIRO return que executa encerra o método. Se media é 9.5, retorna "Excelente" e IGNORA todo o resto.\n\n**Linha 38** (`calc.somar(10.5, 20.3)`): O resultado é "capturado" na variável `resultado`. Se você não guardar o retorno (tipo `calc.somar(10, 20);` sem variável), o valor é perdido!',
        tryItCode: `class Calculadora {
    double somar(double a, double b) { return a + b; }
    double subtrair(double a, double b) { return a - b; }
    double multiplicar(double a, double b) { return a * b; }
    double dividir(double a, double b) {
        if (b == 0) {
            System.out.println("Erro: divisão por zero!");
            return 0;
        }
        return a / b;
    }

    double calcularMedia(double n1, double n2, double n3) {
        return (n1 + n2 + n3) / 3.0;
    }

    String classificar(double media) {
        if (media >= 9.0) return "Excelente";
        if (media >= 7.0) return "Bom";
        if (media >= 5.0) return "Regular";
        return "Insuficiente";
    }
}

public class Main {
    public static void main(String[] args) {
        Calculadora c = new Calculadora();

        System.out.println("10 + 5 = " + c.somar(10, 5));
        System.out.println("10 - 5 = " + c.subtrair(10, 5));
        System.out.println("10 * 5 = " + c.multiplicar(10, 5));
        System.out.println("10 / 3 = " + c.dividir(10, 3));
        System.out.println("10 / 0 = " + c.dividir(10, 0));

        double media = c.calcularMedia(8.0, 7.5, 9.0);
        System.out.println("\\nMédia: " + media);
        System.out.println("Classificação: " + c.classificar(media));
    }
}`,
        tryItPrompt: 'Adicione um método calcularPotencia(base, expoente) que calcule base elevado a expoente usando um loop for!',
      },

      // ────────── SEÇÃO 4: Métodos que Validam Estado ──────────
      {
        title: 'Métodos que Protegem o Estado',
        body: 'A principal vantagem de ter métodos é que eles podem **validar** antes de alterar o estado. Em vez de deixar qualquer código fazer `produto.estoque = -50`, você cria um método que VERIFICA antes de permitir a alteração.\n\nEssa é a base do **encapsulamento** (que veremos com mais profundidade na próxima aula). Por enquanto, o conceito é: **nunca confie em quem está chamando** — valide dentro do método.\n\nPadrão de validação:\n1. Verificar se os parâmetros são válidos\n2. Verificar se a operação é possível\n3. Só então alterar o estado\n4. Retornar feedback (boolean, String, etc.)',
        code: `public class Estoque {
    String produto;
    int quantidade;
    int minimo;  // estoque mínimo antes de alertar

    // Método que VALIDA antes de alterar
    boolean retirar(int qtd) {
        // 1. Parâmetro válido?
        if (qtd <= 0) {
            System.out.println("Quantidade deve ser positiva!");
            return false;
        }
        // 2. Operação possível?
        if (qtd > quantidade) {
            System.out.println("Estoque insuficiente! Tem: "
                + quantidade + ", Pediu: " + qtd);
            return false;
        }
        // 3. Alterar estado
        quantidade -= qtd;
        System.out.println(qtd + "x " + produto + " retirado(s).");

        // 4. Feedback extra: alerta de estoque baixo
        if (quantidade <= minimo) {
            System.out.println("⚠ ALERTA: " + produto
                + " com estoque baixo! (" + quantidade + " restantes)");
        }
        return true;
    }

    boolean repor(int qtd) {
        if (qtd <= 0) {
            System.out.println("Quantidade deve ser positiva!");
            return false;
        }
        quantidade += qtd;
        System.out.println(qtd + "x " + produto + " reposto(s). Total: " + quantidade);
        return true;
    }

    void exibirStatus() {
        String status = quantidade <= minimo ? "BAIXO" : "OK";
        System.out.println(produto + " | Qtd: " + quantidade
            + " | Mín: " + minimo + " | Status: " + status);
    }
}`,
        codeExplanation: '**Linhas 8-11**: PRIMEIRA validação — o parâmetro `qtd` deve ser positivo. Se alguém passar -5, o método bloqueia imediatamente e retorna false.\n\n**Linhas 13-17**: SEGUNDA validação — verifica se tem estoque suficiente. Mostra uma mensagem clara com os números reais.\n\n**Linha 19-20**: Só chega aqui se AMBAS as validações passaram. Agora sim altera o estado.\n\n**Linhas 23-26**: Feedback extra — após a retirada, verifica se o estoque caiu abaixo do mínimo e emite alerta. Isso é lógica de negócio dentro do método!\n\n**Linha 41** (operador ternário): `quantidade <= minimo ? "BAIXO" : "OK"` é um atalho para if/else em uma linha. Se a condição é true, retorna "BAIXO", senão "OK".',
        tip: 'O padrão "validar → alterar → feedback" é usado em TODO sistema real. Acostume-se a sempre validar parâmetros antes de alterar estado.',
      },

      // ────────── SEÇÃO 5: Métodos que Chamam Métodos ──────────
      {
        title: 'Métodos que Chamam Outros Métodos',
        body: 'Um método pode chamar outros métodos da mesma classe. Isso permite:\n- **Reutilizar lógica** sem copiar código\n- **Compor comportamentos complexos** a partir de partes simples\n- **Manter o código organizado** com métodos pequenos e focados\n\nRegra prática: se um método está ficando muito grande (mais de 20 linhas), provavelmente ele deveria ser dividido em métodos menores.',
        code: `public class Pedido {
    String cliente;
    String[] itens;
    double[] precos;
    int totalItens;

    // Método auxiliar: calcula subtotal
    double calcularSubtotal() {
        double subtotal = 0;
        for (int i = 0; i < totalItens; i++) {
            subtotal += precos[i];
        }
        return subtotal;
    }

    // Método auxiliar: calcula desconto
    double calcularDesconto() {
        double subtotal = calcularSubtotal(); // CHAMA outro método!
        if (subtotal >= 500) return subtotal * 0.10;  // 10%
        if (subtotal >= 200) return subtotal * 0.05;  // 5%
        return 0; // sem desconto
    }

    // Método principal: usa os auxiliares
    double calcularTotal() {
        double subtotal = calcularSubtotal();
        double desconto = calcularDesconto();
        return subtotal - desconto;
    }

    // Método que monta relatório completo
    void exibirResumo() {
        System.out.println("=== PEDIDO de " + cliente + " ===");
        for (int i = 0; i < totalItens; i++) {
            System.out.println("  " + itens[i] + " - R$" + precos[i]);
        }
        System.out.println("Subtotal: R$" + calcularSubtotal());
        System.out.println("Desconto: R$" + calcularDesconto());
        System.out.println("TOTAL: R$" + calcularTotal());
    }
}`,
        codeExplanation: '**Linhas 8-13** (`calcularSubtotal`): Método simples que soma todos os preços. Usa um `for` para percorrer o array.\n\n**Linhas 17-21** (`calcularDesconto`): Chama `calcularSubtotal()` para saber o valor e então aplica a regra de desconto. Note que NÃO precisou copiar a lógica de soma — reutilizou!\n\n**Linhas 25-28** (`calcularTotal`): Chama DOIS métodos e combina os resultados. Se a regra de desconto mudar, só muda em `calcularDesconto()` — o `calcularTotal()` não precisa ser alterado.\n\n**Linhas 31-39** (`exibirResumo`): Chama TRÊS métodos para montar o relatório. Cada método tem uma responsabilidade única e focada.\n\n**Vantagem**: Se amanhã o desconto mudar de 10% para 15%, você altera UMA linha em `calcularDesconto()` e TODOS os métodos que o usam (calcularTotal, exibirResumo) automaticamente usam a regra nova.',
        warning: 'Cuidado com chamadas circulares! Se metodoA() chama metodoB() que chama metodoA(), o programa entra em loop infinito e dá StackOverflowError.',
      },

      // ────────── SEÇÃO 6: Exercício Completo ──────────
      {
        title: 'Exercício Completo: Sistema de Notas',
        body: 'Vamos criar um sistema de notas que usa tudo o que aprendemos: atributos para estado, métodos com diferentes tipos de retorno, validações e métodos que chamam outros métodos.',
        code: `import java.util.ArrayList;

class Disciplina {
    String nome;
    double nota1;
    double nota2;
    double notaTrabalho;
    double pesoProva;       // ex: 0.35 (35%)
    double pesoTrabalho;    // ex: 0.30 (30%)

    // Método com cálculo e retorno
    double calcularMedia() {
        return (nota1 * pesoProva) + (nota2 * pesoProva)
            + (notaTrabalho * pesoTrabalho);
    }

    // Método com lógica condicional
    String getSituacao() {
        double media = calcularMedia();
        if (media >= 7.0) return "Aprovado";
        if (media >= 5.0) return "Recuperação";
        return "Reprovado";
    }

    // Método boolean: passou ou não?
    boolean aprovado() {
        return calcularMedia() >= 7.0;
    }

    // Método void: exibe detalhes
    void exibir() {
        System.out.println(nome + " | N1: " + nota1 + " N2: " + nota2
            + " Trab: " + notaTrabalho + " | Média: "
            + String.format("%.1f", calcularMedia())
            + " | " + getSituacao());
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Disciplina> boletim = new ArrayList<>();

        Disciplina d1 = new Disciplina();
        d1.nome = "Java POO";
        d1.nota1 = 8.0; d1.nota2 = 7.5; d1.notaTrabalho = 9.0;
        d1.pesoProva = 0.35; d1.pesoTrabalho = 0.30;
        boletim.add(d1);

        Disciplina d2 = new Disciplina();
        d2.nome = "Banco de Dados";
        d2.nota1 = 5.0; d2.nota2 = 4.0; d2.notaTrabalho = 6.0;
        d2.pesoProva = 0.35; d2.pesoTrabalho = 0.30;
        boletim.add(d2);

        Disciplina d3 = new Disciplina();
        d3.nome = "Redes";
        d3.nota1 = 6.0; d3.nota2 = 6.5; d3.notaTrabalho = 7.0;
        d3.pesoProva = 0.35; d3.pesoTrabalho = 0.30;
        boletim.add(d3);

        System.out.println("=== BOLETIM ===");
        int aprovadas = 0;
        for (Disciplina d : boletim) {
            d.exibir();
            if (d.aprovado()) aprovadas++;
        }
        System.out.println("\\nAprovado em " + aprovadas
            + " de " + boletim.size() + " disciplinas.");
    }
}`,
        codeExplanation: '**Linhas 12-15** (`calcularMedia`): Média ponderada — cada nota multiplicada pelo peso. `nota1 * 0.35 + nota2 * 0.35 + notaTrabalho * 0.30 = 100%`.\n\n**Linha 27** (`aprovado()`): Retorna boolean. Chama `calcularMedia()` e compara com 7.0. Útil para contagem: `if (d.aprovado()) aprovadas++`.\n\n**Linha 34** (`String.format("%.1f", calcularMedia())`): Formata o número com 1 casa decimal. `String.format` é como `printf` mas retorna uma String em vez de imprimir.\n\n**Linhas 63-66**: O for-each percorre todas as disciplinas. Para cada uma, exibe os detalhes e conta se foi aprovada usando o método `aprovado()` que retorna boolean.',
        tryItCode: `import java.util.ArrayList;

class Disciplina {
    String nome;
    double nota1;
    double nota2;
    double notaTrabalho;
    double pesoProva;
    double pesoTrabalho;

    double calcularMedia() {
        return (nota1 * pesoProva) + (nota2 * pesoProva) + (notaTrabalho * pesoTrabalho);
    }

    String getSituacao() {
        double media = calcularMedia();
        if (media >= 7.0) return "Aprovado";
        if (media >= 5.0) return "Recuperação";
        return "Reprovado";
    }

    boolean aprovado() { return calcularMedia() >= 7.0; }

    void exibir() {
        System.out.println(nome + " | Média: "
            + String.format("%.1f", calcularMedia()) + " | " + getSituacao());
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Disciplina> boletim = new ArrayList<>();

        Disciplina d1 = new Disciplina();
        d1.nome = "Java POO"; d1.nota1 = 8.0; d1.nota2 = 7.5;
        d1.notaTrabalho = 9.0; d1.pesoProva = 0.35; d1.pesoTrabalho = 0.30;
        boletim.add(d1);

        Disciplina d2 = new Disciplina();
        d2.nome = "Banco de Dados"; d2.nota1 = 5.0; d2.nota2 = 4.0;
        d2.notaTrabalho = 6.0; d2.pesoProva = 0.35; d2.pesoTrabalho = 0.30;
        boletim.add(d2);

        System.out.println("=== BOLETIM ===");
        int aprovadas = 0;
        for (Disciplina d : boletim) {
            d.exibir();
            if (d.aprovado()) aprovadas++;
        }
        System.out.println("\\nAprovado em " + aprovadas + " de " + boletim.size());
    }
}`,
        tryItPrompt: 'Adicione mais disciplinas e altere as notas. Tente criar um método "precisaDeRecuperacao()" que retorna boolean!',
      },
    ],

    // ────────── Exercícios de Completar Código ──────────
    codeFillExercises: [
      {
        instruction: 'O que define o estado atual de um objeto em POO?',
        snippetBefore: 'Os ',
        snippetAfter: ' armazenam os dados (nome, preço, estoque) do objeto.',
        options: ['atributos', 'métodos', 'construtores', 'classes'],
        correctIndex: 0,
        explanation: 'Atributos são as variáveis que guardam o estado; métodos são as ações/comportamentos.',
      },
      {
        instruction: 'Qual tipo de retorno indica que o método não devolve nenhum valor?',
        snippetBefore: '',
        snippetAfter: ' exibirInfo() {\n    System.out.println(nome);\n}',
        options: ['void', 'null', 'empty', 'none'],
        correctIndex: 0,
        explanation: 'void indica que o método apenas executa ações mas não retorna nenhum valor. Métodos void não usam return com valor.',
      },
      {
        instruction: 'Qual valor padrão um atributo do tipo int recebe ao criar o objeto?',
        snippetBefore: 'int estoque; // valor padrão: ',
        snippetAfter: '',
        options: ['0', 'null', '-1', 'undefined'],
        correctIndex: 0,
        explanation: 'Tipos numéricos primitivos (int, double, float) são inicializados com 0. Strings e objetos são inicializados com null.',
      },
    ],

    // ────────── Erros Comuns ──────────
    commonErrors: [
      {
        title: 'Método que altera estado sem validar',
        description: 'Sempre verifique os parâmetros e condições antes de alterar atributos.',
        code: `// ERRADO: altera sem verificar
void retirar(int qtd) {
    estoque -= qtd; // e se qtd for negativo? Ou maior que estoque?
}

// CORRETO: valida antes
boolean retirar(int qtd) {
    if (qtd > 0 && qtd <= estoque) {
        estoque -= qtd;
        return true;
    }
    return false;
}`,
      },
      {
        title: 'Não guardar o retorno de um método',
        description: 'Se um método retorna um valor e você não guarda, o resultado é perdido.',
        code: `// ERRADO: resultado jogado fora!
calc.somar(10, 20); // somou mas ninguém guardou

// CORRETO: guardar em variável
double resultado = calc.somar(10, 20);
System.out.println(resultado); // 30.0`,
      },
      {
        title: 'Tipo de retorno incompatível',
        description: 'O valor do return DEVE ser compatível com o tipo declarado no método.',
        code: `// ERRADO: método diz double, return dá String
double calcular() {
    return "abc"; // ERRO de compilação!
}

// CORRETO:
double calcular() {
    return 42.5; // OK: double retornando double
}`,
      },
      {
        title: 'Usar atributo null sem verificar',
        description: 'Atributos String começam como null. Chamar .length() ou qualquer método em null dá NullPointerException.',
        code: `Produto p = new Produto();
// p.nome é null! (não foi atribuído)
System.out.println(p.nome.length()); // NullPointerException!

// SEGURO: verificar antes
if (p.nome != null) {
    System.out.println(p.nome.length());
}`,
      },
    ],

    // ────────── Resumo ──────────
    summary: [
      'Atributos guardam o ESTADO do objeto (dados). Métodos definem o COMPORTAMENTO (ações)',
      'Valores padrão: int/double → 0, boolean → false, String/objetos → null',
      'Tipos de retorno: void (nada), int, double, String, boolean, etc.',
      'Métodos void executam ações; métodos com retorno devolvem um resultado',
      'SEMPRE valide parâmetros antes de alterar estado: if (qtd > 0 && qtd <= estoque)',
      'Um método pode chamar outros métodos da mesma classe para reutilizar lógica',
      'Se não guardar o retorno em uma variável, o resultado é perdido',
      'NullPointerException: acontece quando você chama método em um atributo que é null',
    ],

    // ────────── Código final ──────────
    tryItCode: `import java.util.ArrayList;

class Produto {
    String nome;
    double preco;
    int estoque;

    boolean vender(int qtd) {
        if (qtd <= 0) {
            System.out.println("Quantidade inválida!");
            return false;
        }
        if (qtd > estoque) {
            System.out.println("Estoque insuficiente de " + nome
                + "! Tem: " + estoque + ", Pediu: " + qtd);
            return false;
        }
        estoque -= qtd;
        System.out.println(qtd + "x " + nome + " vendido(s)!");
        return true;
    }

    double calcularTotal(int qtd) {
        return preco * qtd;
    }

    void exibirInfo() {
        System.out.println(nome + " - R$" + preco + " | Estoque: " + estoque);
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Produto> loja = new ArrayList<>();

        Produto p1 = new Produto();
        p1.nome = "Notebook"; p1.preco = 3500; p1.estoque = 10;
        loja.add(p1);

        Produto p2 = new Produto();
        p2.nome = "Mouse"; p2.preco = 89.90; p2.estoque = 50;
        loja.add(p2);

        System.out.println("=== LOJA ===");
        for (Produto p : loja) { p.exibirInfo(); }

        System.out.println("\\n=== VENDAS ===");
        p1.vender(2);
        System.out.println("Total: R$" + p1.calcularTotal(2));

        p2.vender(100); // vai falhar!
        p2.vender(5);
        System.out.println("Total: R$" + p2.calcularTotal(5));

        System.out.println("\\n=== ESTOQUE ATUALIZADO ===");
        for (Produto p : loja) { p.exibirInfo(); }
    }
}`,
    tryItPrompt: 'Adicione mais produtos, teste vendas com quantidades inválidas (0, -1, maior que estoque). Crie um método aplicarDesconto(percentual) que reduza o preço!',
  },

  'm3-constructors': {
    id: 'm3-constructors', moduleId: 3,
    objectives: [
      'Entender o que é um construtor e quando ele é chamado',
      'Criar construtores com parâmetros para inicializar objetos',
      'Usar this para diferenciar atributo de parâmetro',
      'Aplicar sobrecarga de construtores (constructor overloading)',
      'Chamar um construtor a partir de outro com this()',
      'Validar dados dentro do construtor',
      'Entender o construtor padrão e quando ele desaparece',
    ],
    sections: [
      // ────────── SEÇÃO 1: O que é Construtor ──────────
      {
        title: 'O que é um Construtor?',
        body: 'O **construtor** é um método especial que roda automaticamente quando você usa **new**. Ele serve para **inicializar** o objeto — garantir que ele nasça já com valores válidos.\n\nSem construtor, você precisaria criar o objeto e depois atribuir cada campo manualmente:\n```\nProduto p = new Produto();\np.nome = "Camiseta";  // pode esquecer!\np.preco = 49.90;      // pode esquecer!\np.estoque = 100;      // pode esquecer!\n```\n\nCom construtor, tudo é obrigatório de uma vez:\n```\nProduto p = new Produto("Camiseta", 49.90, 100); // completo!\n```\n\nRegras do construtor:\n- **Mesmo nome da classe** (exatamente)\n- **Sem tipo de retorno** (nem void!)\n- Pode ter **parâmetros** (ou não)\n- É chamado **automaticamente** pelo new',
        code: `public class Produto {
    String nome;
    double preco;
    int estoque;

    // ═══ CONSTRUTOR ═══
    // Mesmo nome da classe, sem tipo de retorno
    public Produto(String nome, double preco, int estoque) {
        this.nome = nome;       // this.nome = atributo da classe
        this.preco = preco;     // nome = parâmetro recebido
        this.estoque = estoque;
    }

    void exibirInfo() {
        System.out.println(nome + " - R$" + preco + " | Estoque: " + estoque);
    }
}

// Uso:
Produto p1 = new Produto("Camiseta", 49.90, 100);
// O construtor roda AUTOMATICAMENTE e preenche os 3 atributos!

Produto p2 = new Produto("Calça", 129.90, 50);
// Outro objeto, outro construtor executado

p1.exibirInfo(); // Camiseta - R$49.9 | Estoque: 100
p2.exibirInfo(); // Calça - R$129.9 | Estoque: 50`,
        codeExplanation: '**Linha 8** (`public Produto(String nome, double preco, int estoque)`): O construtor tem o MESMO nome da classe (`Produto`) e NÃO tem tipo de retorno (nem `void`!). Se colocar `void Produto(...)`, vira um método comum, não um construtor.\n\n**Linha 9** (`this.nome = nome`): A palavra `this` se refere ao objeto que está sendo criado. `this.nome` é o atributo da classe; `nome` (sem this) é o parâmetro recebido. Sem `this`, o Java não sabe qual é qual quando têm o mesmo nome.\n\n**Linha 20** (`new Produto("Camiseta", 49.90, 100)`): O `new` cria o objeto e AUTOMATICAMENTE chama o construtor, passando os 3 argumentos. Não precisa chamar o construtor separadamente — ele é embutido no `new`.\n\n**Por que usar construtor?** Sem ele, você pode criar um Produto sem nome e sem preço (tudo null/0). Com construtor, é IMPOSSÍVEL criar um Produto incompleto — os dados são obrigatórios.',
        tip: 'Use this quando o parâmetro tem o MESMO nome do atributo. Se os nomes forem diferentes (ex: parâmetro "n" e atributo "nome"), this é opcional (mas recomendado para clareza).',
      },

      // ────────── SEÇÃO 2: Construtor Padrão ──────────
      {
        title: 'O Construtor Padrão (e Quando Ele Desaparece)',
        body: 'Se você NÃO define nenhum construtor, o Java fornece automaticamente um **construtor padrão** (sem parâmetros):\n\n```\npublic class Carro {\n    String marca;\n}\n// Java cria internamente: public Carro() { }\n// Você pode fazer: Carro c = new Carro();\n```\n\n**MAS ATENÇÃO**: No momento em que você define QUALQUER construtor com parâmetros, o construtor padrão **DESAPARECE**!\n\n```\npublic class Carro {\n    String marca;\n    public Carro(String marca) { this.marca = marca; }\n}\n// Carro c = new Carro(); → ERRO! O padrão sumiu!\n// Carro c = new Carro("Toyota"); → OK!\n```\n\nSe precisar dos DOIS (com e sem parâmetros), defina ambos explicitamente.',
        code: `public class Funcionario {
    String nome;
    String cargo;
    double salario;

    // Construtor COM parâmetros
    public Funcionario(String nome, String cargo, double salario) {
        this.nome = nome;
        this.cargo = cargo;
        this.salario = salario;
    }

    // Construtor SEM parâmetros (precisa definir manualmente!)
    // Se NÃO colocar isso, new Funcionario() dá ERRO!
    public Funcionario() {
        this.nome = "Não informado";
        this.cargo = "Não definido";
        this.salario = 0;
    }

    void exibirInfo() {
        System.out.println(nome + " | " + cargo + " | R$" + salario);
    }
}

// Agora ambos funcionam:
Funcionario f1 = new Funcionario("Ana", "Dev", 5000);   // com parâmetros
Funcionario f2 = new Funcionario();                       // sem parâmetros
f1.exibirInfo(); // Ana | Dev | R$5000.0
f2.exibirInfo(); // Não informado | Não definido | R$0.0`,
        codeExplanation: '**Linhas 7-11** (Construtor completo): Recebe todos os dados e preenche os atributos. Quando usado, o objeto nasce completo.\n\n**Linhas 15-19** (Construtor vazio): Como já definimos um construtor com parâmetros (linhas 7-11), o construtor padrão sumiu! Precisamos defini-lo explicitamente se quisermos usar `new Funcionario()`. Aqui usamos valores padrão ("Não informado", etc.).\n\n**Linhas 27-28**: Ambas as formas de criar funcionam porque temos DOIS construtores. O Java escolhe qual usar baseado no número e tipo dos argumentos.',
        warning: 'Erro mais comum: criar um construtor com parâmetros e esquecer que o construtor padrão sumiu. Se alguém tentar new Classe() sem argumentos, dá erro de compilação!',
      },

      // ────────── SEÇÃO 3: Sobrecarga de Construtores ──────────
      {
        title: 'Sobrecarga de Construtores (Constructor Overloading)',
        body: '**Sobrecarga** significa ter **vários construtores na mesma classe**, cada um com uma lista diferente de parâmetros. O Java escolhe qual chamar baseado nos argumentos passados.\n\nIsso é útil quando o objeto pode ser criado de formas diferentes:\n- Com todos os dados\n- Com apenas os dados obrigatórios (os opcionais recebem valores padrão)\n- Sem parâmetros (tudo com valores padrão)\n\nRegra: os construtores DEVEM ter listas de parâmetros diferentes (tipo ou quantidade diferente). Não pode ter dois construtores com exatamente os mesmos tipos de parâmetros.',
        code: `public class Contato {
    String nome;
    String telefone;
    String email;
    String endereco;

    // Construtor 1: todos os campos
    public Contato(String nome, String telefone, String email, String endereco) {
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.endereco = endereco;
    }

    // Construtor 2: sem endereço (opcional)
    public Contato(String nome, String telefone, String email) {
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.endereco = "Não informado";
    }

    // Construtor 3: só nome e telefone (mínimo)
    public Contato(String nome, String telefone) {
        this.nome = nome;
        this.telefone = telefone;
        this.email = "Não informado";
        this.endereco = "Não informado";
    }

    void exibirContato() {
        System.out.println(nome + " | Tel: " + telefone
            + " | Email: " + email + " | End: " + endereco);
    }
}

// O Java escolhe pelo número de argumentos:
Contato c1 = new Contato("Ana", "11-9999", "ana@email.com", "Rua A, 123");
Contato c2 = new Contato("Bruno", "11-8888", "bruno@email.com");
Contato c3 = new Contato("Carlos", "11-7777");`,
        codeExplanation: '**Construtor 1 (linhas 8-13)**: Recebe 4 Strings → usado quando temos TODOS os dados. `new Contato("Ana", "11-9999", "ana@email.com", "Rua A")`\n\n**Construtor 2 (linhas 16-21)**: Recebe 3 Strings → quando não temos o endereço. Define endereço como "Não informado" automaticamente.\n\n**Construtor 3 (linhas 24-29)**: Recebe 2 Strings → o mínimo necessário. Define email e endereço como "Não informado".\n\n**Linhas 38-40**: O Java vê quantos argumentos foram passados e escolhe o construtor correto:\n- 4 argumentos → Construtor 1\n- 3 argumentos → Construtor 2\n- 2 argumentos → Construtor 3\n\n**Problema**: Temos código repetido! `this.nome = nome; this.telefone = telefone;` aparece em TODOS. A próxima seção resolve isso.',
        tip: 'A sobrecarga funciona com qualquer método, não só construtores. Dois métodos podem ter o mesmo nome se tiverem parâmetros diferentes.',
      },

      // ────────── SEÇÃO 4: Encadeamento com this() ──────────
      {
        title: 'Eliminando Código Repetido com this()',
        body: 'No exemplo anterior, as linhas `this.nome = nome; this.telefone = telefone;` se repetem em TODOS os construtores. Isso viola o princípio **DRY** (Don\'t Repeat Yourself).\n\nA solução é usar **this()** — que chama OUTRO construtor da mesma classe. Funciona assim:\n- O construtor mais completo faz a atribuição real\n- Os outros construtores chamam `this(...)` passando os argumentos + valores padrão\n\nRegra: `this()` DEVE ser a **primeira linha** do construtor.',
        code: `public class Contato {
    String nome;
    String telefone;
    String email;
    String endereco;

    // Construtor PRINCIPAL (faz a atribuição real)
    public Contato(String nome, String telefone, String email, String endereco) {
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.endereco = endereco;
    }

    // Chama o construtor principal com valor padrão para endereço
    public Contato(String nome, String telefone, String email) {
        this(nome, telefone, email, "Não informado"); // chama construtor de 4 args!
    }

    // Chama o de 3 args, que chama o de 4 args
    public Contato(String nome, String telefone) {
        this(nome, telefone, "Não informado"); // chama construtor de 3 args!
    }

    void exibirContato() {
        System.out.println(nome + " | Tel: " + telefone
            + " | Email: " + email + " | End: " + endereco);
    }
}`,
        codeExplanation: '**Linhas 8-13** (Construtor principal): É o ÚNICO que faz `this.campo = valor`. Toda a lógica de atribuição está em UM lugar só.\n\n**Linha 17** (`this(nome, telefone, email, "Não informado")`): Em vez de repetir as atribuições, CHAMA o construtor de 4 argumentos, passando "Não informado" como endereço. É como se fizesse `new Contato(nome, telefone, email, "Não informado")` internamente.\n\n**Linha 22** (`this(nome, telefone, "Não informado")`): Chama o construtor de 3 argumentos, que por sua vez chama o de 4. É uma cadeia: 2 args → 3 args → 4 args.\n\n**Vantagem**: Se amanhã precisar adicionar um campo novo, muda APENAS o construtor principal. Os outros automaticamente seguem.\n\n**Regra**: `this()` DEVE ser a PRIMEIRA instrução do construtor. Se tentar colocar qualquer código antes, dá erro de compilação.',
        tip: 'O padrão "construtor principal + construtores auxiliares com this()" é muito usado em projetos reais. Reduz duplicação e centraliza a inicialização.',
      },

      // ────────── SEÇÃO 5: Validação no Construtor ──────────
      {
        title: 'Validando Dados no Construtor',
        body: 'O construtor é o lugar ideal para **validar** os dados antes de criar o objeto. Se os dados são inválidos, o objeto NÃO deveria existir com valores errados.\n\nExemplos de validação:\n- Nome não pode ser vazio ou null\n- Preço não pode ser negativo\n- Idade não pode ser negativa\n- Email deve conter @\n\nSe a validação falha, você pode:\n1. Usar um **valor padrão** seguro\n2. Lançar uma **exceção** (assunto de aula futura)\n3. Ajustar o valor para um mínimo aceitável',
        code: `public class Produto {
    private String nome;
    private double preco;
    private int estoque;

    public Produto(String nome, double preco, int estoque) {
        // Validar nome
        if (nome == null || nome.trim().isEmpty()) {
            this.nome = "Sem nome";
            System.out.println("Aviso: nome inválido, usando padrão.");
        } else {
            this.nome = nome;
        }

        // Validar preço (não pode ser negativo)
        if (preco < 0) {
            this.preco = 0;
            System.out.println("Aviso: preço negativo ajustado para 0.");
        } else {
            this.preco = preco;
        }

        // Validar estoque (não pode ser negativo)
        this.estoque = Math.max(0, estoque); // se for negativo, usa 0
    }

    void exibirInfo() {
        System.out.println(nome + " - R$" + preco + " | Estoque: " + estoque);
    }
}

// Testes de validação:
Produto p1 = new Produto("Camiseta", 49.90, 100);  // tudo OK
Produto p2 = new Produto("", -10, -5);              // tudo inválido!
Produto p3 = new Produto(null, 29.90, 50);          // nome null

p1.exibirInfo(); // Camiseta - R$49.9 | Estoque: 100
p2.exibirInfo(); // Sem nome - R$0.0 | Estoque: 0
p3.exibirInfo(); // Sem nome - R$29.9 | Estoque: 50`,
        codeExplanation: '**Linhas 8-13** (Validar nome): Verifica se é null OU se é uma string vazia (após trim() que remove espaços). Se inválido, usa "Sem nome" como padrão.\n\n**Linha 8** (`nome.trim().isEmpty()`): `trim()` remove espaços do início e fim ("  " vira ""). `isEmpty()` verifica se ficou vazio. Assim, "  " (só espaços) também é inválido.\n\n**Linhas 16-21** (Validar preço): Se o preço for negativo, ajusta para 0. Em um sistema real, poderia lançar exceção em vez de ajustar silenciosamente.\n\n**Linha 24** (`Math.max(0, estoque)`): `Math.max(a, b)` retorna o maior entre a e b. Se estoque for -5, `Math.max(0, -5)` retorna 0. É uma forma compacta de "se for negativo, use 0".\n\n**Linha 35** (`new Produto("", -10, -5)`): Tudo inválido! O construtor corrige cada campo automaticamente.',
        tryItCode: `class Produto {
    private String nome;
    private double preco;
    private int estoque;

    public Produto(String nome, double preco, int estoque) {
        if (nome == null || nome.trim().isEmpty()) {
            this.nome = "Sem nome";
            System.out.println("Aviso: nome inválido!");
        } else {
            this.nome = nome;
        }

        this.preco = Math.max(0, preco);
        this.estoque = Math.max(0, estoque);

        if (preco < 0) System.out.println("Aviso: preço ajustado para 0!");
        if (estoque < 0) System.out.println("Aviso: estoque ajustado para 0!");
    }

    void exibirInfo() {
        System.out.println(nome + " - R$" + preco + " | Estoque: " + estoque);
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Criando produtos ===\\n");

        Produto p1 = new Produto("Camiseta", 49.90, 100);
        Produto p2 = new Produto("", -10, -5);
        Produto p3 = new Produto(null, 29.90, 50);

        System.out.println("\\n=== Produtos criados ===");
        p1.exibirInfo();
        p2.exibirInfo();
        p3.exibirInfo();
    }
}`,
        tryItPrompt: 'Tente criar produtos com dados inválidos (nome vazio, preço negativo, null). Adicione validação para que o preço máximo seja R$10000!',
      },

      // ────────── SEÇÃO 6: Exercício Completo ──────────
      {
        title: 'Exercício Completo: Sistema com Construtores',
        body: 'Vamos criar um sistema completo de gerenciamento de funcionários usando tudo o que aprendemos sobre construtores: construtor principal, sobrecarga, this(), e validação.',
        code: `import java.util.ArrayList;

class Funcionario {
    private String nome;
    private String cargo;
    private double salario;
    private String departamento;

    // Construtor principal (completo)
    public Funcionario(String nome, String cargo, double salario, String depto) {
        this.nome = (nome != null && !nome.trim().isEmpty()) ? nome : "Não informado";
        this.cargo = (cargo != null && !cargo.trim().isEmpty()) ? cargo : "Não definido";
        this.salario = Math.max(0, salario);
        this.departamento = (depto != null) ? depto : "Geral";
    }

    // Sobrecarga: sem departamento
    public Funcionario(String nome, String cargo, double salario) {
        this(nome, cargo, salario, "Geral"); // usa this() !
    }

    // Sobrecarga: só nome e cargo (salário inicial = 0)
    public Funcionario(String nome, String cargo) {
        this(nome, cargo, 0); // encadeia com o de 3 args
    }

    void aumentarSalario(double percentual) {
        if (percentual > 0 && percentual <= 100) {
            salario += salario * (percentual / 100.0);
        }
    }

    void exibirInfo() {
        System.out.println(nome + " | " + cargo + " | "
            + departamento + " | R$" + String.format("%.2f", salario));
    }

    String getNome() { return nome; }
    double getSalario() { return salario; }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Funcionario> equipe = new ArrayList<>();

        // Usando diferentes construtores
        equipe.add(new Funcionario("Ana", "Desenvolvedora", 6000, "TI"));
        equipe.add(new Funcionario("Bruno", "Designer", 5000));
        equipe.add(new Funcionario("Carlos", "Estagiário"));

        System.out.println("=== EQUIPE INICIAL ===");
        for (Funcionario f : equipe) { f.exibirInfo(); }

        System.out.println("\\n=== AUMENTO DE 10% ===");
        for (Funcionario f : equipe) {
            f.aumentarSalario(10);
        }

        System.out.println("\\n=== EQUIPE ATUALIZADA ===");
        for (Funcionario f : equipe) { f.exibirInfo(); }
    }
}`,
        codeExplanation: '**Linhas 10-15** (Construtor principal): Recebe todos os 4 campos. Usa operador ternário `? :` para validar cada um de forma compacta. Se nome for null ou vazio, usa "Não informado".\n\n**Linha 11** (Operador ternário): `(condição) ? valorSeTrue : valorSeFalse`. Equivale a um if/else em uma linha.\n\n**Linha 19** (`this(nome, cargo, salario, "Geral")`): O construtor de 3 args chama o de 4 args, passando "Geral" como departamento padrão.\n\n**Linha 24** (`this(nome, cargo, 0)`): O de 2 args chama o de 3 args (com salário 0), que chama o de 4 args. Cadeia: 2→3→4.\n\n**Linhas 47-49**: Cada `new` usa um construtor diferente: 4 args, 3 args, 2 args. Todos acabam passando pelo construtor principal.',
        tryItCode: `import java.util.ArrayList;

class Funcionario {
    private String nome;
    private String cargo;
    private double salario;
    private String departamento;

    public Funcionario(String nome, String cargo, double salario, String depto) {
        this.nome = (nome != null && !nome.trim().isEmpty()) ? nome : "Não informado";
        this.cargo = (cargo != null) ? cargo : "Não definido";
        this.salario = Math.max(0, salario);
        this.departamento = (depto != null) ? depto : "Geral";
    }

    public Funcionario(String nome, String cargo, double salario) {
        this(nome, cargo, salario, "Geral");
    }

    public Funcionario(String nome, String cargo) {
        this(nome, cargo, 0);
    }

    void aumentarSalario(double percentual) {
        if (percentual > 0 && percentual <= 100) {
            salario += salario * (percentual / 100.0);
        }
    }

    void exibirInfo() {
        System.out.println(nome + " | " + cargo + " | " + departamento
            + " | R$" + String.format("%.2f", salario));
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Funcionario> equipe = new ArrayList<>();

        equipe.add(new Funcionario("Ana", "Dev", 6000, "TI"));
        equipe.add(new Funcionario("Bruno", "Designer", 5000));
        equipe.add(new Funcionario("Carlos", "Estagiário"));

        System.out.println("=== EQUIPE ===");
        for (Funcionario f : equipe) { f.exibirInfo(); }

        System.out.println("\\n=== APÓS AUMENTO DE 15% ===");
        for (Funcionario f : equipe) { f.aumentarSalario(15); }
        for (Funcionario f : equipe) { f.exibirInfo(); }
    }
}`,
        tryItPrompt: 'Adicione mais funcionários usando diferentes construtores. Crie um construtor que receba só o nome (com cargo "Trainee" e salário R$1500 padrão)!',
      },
    ],

    // ────────── Exercícios de Completar Código ──────────
    codeFillExercises: [
      {
        instruction: 'Como referenciar o atributo da classe quando o parâmetro tem o mesmo nome?',
        snippetBefore: 'public Pessoa(String nome) {\n    ',
        snippetAfter: '.nome = nome;\n}',
        options: ['this', 'self', 'super', 'obj'],
        correctIndex: 0,
        explanation: '"this" se refere ao objeto atual. this.nome é o atributo da classe; nome (sem this) é o parâmetro. Sem this, o Java atribuiria o parâmetro a ele mesmo!',
      },
      {
        instruction: 'Para chamar outro construtor da mesma classe, usamos:',
        snippetBefore: 'public Contato(String nome, String tel) {\n    ',
        snippetAfter: '(nome, tel, "Não informado"); // chama construtor de 3 args\n}',
        options: ['this', 'super', 'new', 'constructor'],
        correctIndex: 0,
        explanation: 'this() chama outro construtor da MESMA classe. super() chama o construtor da classe PAI (herança). this() deve ser a primeira linha do construtor.',
      },
      {
        instruction: 'O que acontece se você definir um construtor com parâmetros mas NÃO definir um construtor vazio?',
        snippetBefore: 'class Carro {\n    public Carro(String marca) { ... }\n}\n// Carro c = new Carro(); // ',
        snippetAfter: '',
        options: ['Erro de compilação!', 'Funciona normalmente', 'Usa null como padrão', 'Cria com valores 0'],
        correctIndex: 0,
        explanation: 'Quando você define qualquer construtor, o construtor padrão (sem parâmetros) desaparece. Para usar new Carro() sem argumentos, precisa definir explicitamente um construtor vazio.',
      },
    ],

    // ────────── Erros Comuns ──────────
    commonErrors: [
      {
        title: 'Colocar tipo de retorno no construtor',
        description: 'Construtor não tem void nem nenhum tipo de retorno. Se colocar, vira um método comum!',
        code: `// ERRADO: isso NÃO é construtor, é um método!
void Produto(String nome) {  // void torna isso um método
    this.nome = nome;
}
// new Produto("X") → não chama esse "construtor"!

// CORRETO: sem tipo de retorno
public Produto(String nome) {
    this.nome = nome;
}`,
      },
      {
        title: 'Esquecer que o construtor padrão desaparece',
        description: 'Ao definir um construtor com parâmetros, new Classe() sem argumentos para de funcionar.',
        code: `class Pessoa {
    String nome;
    public Pessoa(String nome) { this.nome = nome; }
}
// Pessoa p = new Pessoa(); // ERRO! Não existe construtor sem args!
// Pessoa p = new Pessoa("Ana"); // OK!

// Solução: definir construtor vazio explicitamente
// public Pessoa() { this.nome = "Desconhecido"; }`,
      },
      {
        title: 'this() não é a primeira linha',
        description: 'Ao chamar outro construtor com this(), essa chamada DEVE ser a primeira instrução.',
        code: `// ERRADO:
public Contato(String nome) {
    System.out.println("Criando..."); // ERRO! Tem código antes do this()
    this(nome, "Sem telefone");
}

// CORRETO:
public Contato(String nome) {
    this(nome, "Sem telefone"); // primeira linha!
    System.out.println("Criando..."); // depois do this() pode
}`,
      },
      {
        title: 'Não usar this e perder a atribuição',
        description: 'Sem this, o parâmetro é atribuído a si mesmo e o atributo da classe fica null/0.',
        code: `// ERRADO:
public Produto(String nome) {
    nome = nome; // atribui o parâmetro a ele mesmo! Atributo continua null!
}

// CORRETO:
public Produto(String nome) {
    this.nome = nome; // this.nome = atributo, nome = parâmetro
}`,
      },
    ],

    // ────────── Resumo ──────────
    summary: [
      'Construtor é chamado automaticamente pelo new — inicializa o objeto',
      'Mesmo nome da classe, SEM tipo de retorno (nem void)',
      'this.atributo diferencia o atributo da classe do parâmetro com mesmo nome',
      'Sem this, a atribuição "nome = nome" não funciona (parâmetro atribui a si mesmo)',
      'Se definir qualquer construtor com parâmetros, o construtor padrão (vazio) desaparece',
      'Sobrecarga: vários construtores com listas de parâmetros diferentes',
      'this() chama outro construtor da mesma classe — DEVE ser a primeira linha',
      'Valide dados no construtor para garantir que o objeto nasce em estado válido',
    ],

    // ────────── Código final ──────────
    tryItCode: `import java.util.ArrayList;

class Aluno {
    private String nome;
    private String ra;
    private double nota1;
    private double nota2;

    // Construtor principal
    public Aluno(String nome, String ra, double nota1, double nota2) {
        this.nome = (nome != null) ? nome : "Sem nome";
        this.ra = (ra != null) ? ra : "0000";
        this.nota1 = Math.max(0, Math.min(10, nota1)); // entre 0 e 10
        this.nota2 = Math.max(0, Math.min(10, nota2)); // entre 0 e 10
    }

    // Sobrecarga: sem notas (aluno novo)
    public Aluno(String nome, String ra) {
        this(nome, ra, 0, 0);
    }

    double calcularMedia() { return (nota1 + nota2) / 2.0; }

    String getSituacao() {
        double m = calcularMedia();
        if (m >= 7) return "Aprovado";
        if (m >= 5) return "Recuperação";
        return "Reprovado";
    }

    void exibir() {
        System.out.println(nome + " (RA: " + ra + ") | N1: " + nota1
            + " N2: " + nota2 + " | Média: "
            + String.format("%.1f", calcularMedia()) + " | " + getSituacao());
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Aluno> turma = new ArrayList<>();

        turma.add(new Aluno("Maria", "2024001", 8.5, 9.0));
        turma.add(new Aluno("João", "2024002", 5.0, 4.5));
        turma.add(new Aluno("Ana", "2024003")); // sem notas
        turma.add(new Aluno("Pedro", "2024004", 15, -3)); // notas inválidas!

        System.out.println("=== BOLETIM DA TURMA ===\\n");
        for (Aluno a : turma) { a.exibir(); }
    }
}`,
    tryItPrompt: 'Veja como a validação ajusta notas inválidas (15 vira 10, -3 vira 0). Crie um construtor que receba só o nome, com RA gerado automaticamente!',
  },

  'm3-encapsulation': {
    id: 'm3-encapsulation', moduleId: 3,
    objectives: [
      'Entender por que encapsular dados (e o problema de não encapsular)',
      'Usar o modificador private para proteger atributos',
      'Criar getters (acesso de leitura) e setters (acesso de escrita com validação)',
      'Saber quando NÃO criar getter/setter e usar métodos de negócio',
      'Diferenciar encapsulamento real de encapsulamento "falso" (get/set sem validação)',
      'Aplicar o padrão private + construtor + métodos de negócio',
    ],
    sections: [
      // ────────── SEÇÃO 1: O Problema SEM Encapsulamento ──────────
      {
        title: 'O Problema: Atributos Públicos São Perigosos',
        body: 'Até agora, nossos atributos eram acessíveis de fora da classe. Qualquer código podia fazer `produto.estoque = -50` ou `conta.saldo = 999999`. Não havia proteção alguma.\n\nIsso é um desastre em sistemas reais:\n- Um bug em uma tela pode corromper os dados do banco\n- Um programador novo pode alterar o saldo sem validar\n- Não há como auditar quem alterou o quê\n\n**Encapsulamento** resolve isso: tornar os atributos **private** (invisíveis de fora) e permitir acesso APENAS por métodos controlados que validam antes de alterar.',
        code: `// ═══ SEM ENCAPSULAMENTO ═══
public class ContaInsegura {
    public String titular;  // qualquer um acessa!
    public double saldo;    // qualquer um altera!
    public String cpf;      // dado sensível exposto!
}

public class Main {
    public static void main(String[] args) {
        ContaInsegura conta = new ContaInsegura();
        conta.titular = "Ana";
        conta.saldo = 1000;

        // Qualquer código pode fazer isso:
        conta.saldo = -5000;    // Saldo negativo! Nenhum erro!
        conta.titular = "";     // Nome vazio! Ninguém impediu!
        conta.cpf = "abc";      // CPF inválido! Aceito!

        System.out.println(conta.titular + " | Saldo: " + conta.saldo);
        // Resultado:  | Saldo: -5000.0   ← CATÁSTROFE!
    }
}`,
        codeExplanation: '**Linhas 3-5** (`public`): Atributos public são acessíveis de qualquer lugar do código. Não há proteção.\n\n**Linha 15** (`conta.saldo = -5000`): Saldo negativo! O Java não reclama porque `saldo` é um double público — aceita qualquer valor. Em um banco real, isso seria um bug gravíssimo.\n\n**Linha 16** (`conta.titular = ""`): Nome vazio. Novamente, sem proteção. Se o sistema enviar um email para o titular, ele terá um campo em branco.\n\n**Linha 17** (`conta.cpf = "abc"`): CPF completamente inválido. Dados sensíveis como CPF NUNCA deveriam ser alteráveis sem validação.\n\n**O problema**: qualquer parte do código pode corromper os dados. Não há um "porteiro" verificando os valores.',
        warning: 'Em sistemas bancários reais, bugs como saldo negativo podem causar prejuízos milionários. Encapsulamento é a primeira linha de defesa contra esse tipo de erro.',
      },

      // ────────── SEÇÃO 2: private + Getters e Setters ──────────
      {
        title: 'A Solução: private + Getters e Setters',
        body: 'O encapsulamento funciona em 3 passos:\n\n1. **Atributos private**: ninguém de fora acessa diretamente\n2. **Getters** (métodos get): permitem LEITURA controlada\n3. **Setters** (métodos set): permitem ESCRITA com validação\n\nConvenção de nomes:\n- Getter: `getTitular()`, `getSaldo()`, `isAtivo()` (para boolean)\n- Setter: `setTitular(String titular)`, `setPreco(double preco)`\n\n**IMPORTANTE**: Nem todo atributo precisa de getter E setter!\n- Alguns atributos são **somente leitura** (só getter, sem setter) — ex: CPF, data de criação\n- Alguns atributos nem precisam de getter (são internos) — ex: contadores, flags internas\n- Alguns são melhor controlados por **métodos de negócio** (depositar/sacar) em vez de setSaldo',
        code: `public class ContaBancaria {
    // ═══ ATRIBUTOS PRIVADOS ═══
    private String titular;
    private String cpf;       // somente leitura (sem setter!)
    private double saldo;     // sem getter/setter! Usa depositar/sacar
    private boolean ativa;

    // ═══ CONSTRUTOR ═══
    public ContaBancaria(String titular, String cpf, double saldoInicial) {
        this.titular = titular;
        this.cpf = cpf;
        this.saldo = Math.max(0, saldoInicial);
        this.ativa = true;
    }

    // ═══ GETTERS (leitura controlada) ═══
    public String getTitular() { return this.titular; }
    public String getCpf() { return this.cpf; }  // leitura, sem setCpf!
    public double getSaldo() { return this.saldo; }
    public boolean isAtiva() { return this.ativa; } // boolean usa "is"

    // ═══ SETTER COM VALIDAÇÃO ═══
    public void setTitular(String titular) {
        if (titular != null && !titular.trim().isEmpty()) {
            this.titular = titular;
        } else {
            System.out.println("Erro: nome do titular inválido!");
        }
    }
    // NÃO existe setCpf! CPF nunca muda.
    // NÃO existe setSaldo! Saldo muda APENAS por depositar/sacar.

    // ═══ MÉTODOS DE NEGÓCIO (melhor que setSaldo!) ═══
    public void depositar(double valor) {
        if (!ativa) {
            System.out.println("Conta inativa! Não é possível depositar.");
            return;
        }
        if (valor > 0) {
            this.saldo += valor;
            System.out.println("Depósito de R$" + valor + " | Novo saldo: R$" + saldo);
        } else {
            System.out.println("Valor de depósito inválido!");
        }
    }

    public boolean sacar(double valor) {
        if (!ativa) {
            System.out.println("Conta inativa!");
            return false;
        }
        if (valor > 0 && valor <= this.saldo) {
            this.saldo -= valor;
            System.out.println("Saque de R$" + valor + " | Novo saldo: R$" + saldo);
            return true;
        }
        System.out.println("Saque negado! Saldo: R$" + saldo + ", Pediu: R$" + valor);
        return false;
    }

    public void desativar() {
        this.ativa = false;
        System.out.println("Conta de " + titular + " desativada.");
    }
}`,
        codeExplanation: '**Linhas 3-6** (`private`): TODOS os atributos são private. Ninguém de fora pode fazer `conta.saldo = -5000` — o compilador nem permite!\n\n**Linha 17** (`getTitular()`): Getter simples que retorna o valor. O chamador pode LER mas não ALTERAR.\n\n**Linha 18** (`getCpf()`): CPF é somente leitura — tem getter mas NÃO tem setter. Uma vez definido no construtor, nunca mais muda.\n\n**Linha 20** (`isAtiva()`): Para atributos boolean, a convenção é usar `is` em vez de `get`: `isAtiva()`, `isVazio()`, `isPago()`.\n\n**Linhas 23-29** (`setTitular`): O setter VALIDA antes de alterar. Se o nome for null ou vazio, RECUSA a alteração.\n\n**Linhas 30-31**: Comentários que deixam claro: NÃO existe setCpf nem setSaldo. Isso é encapsulamento REAL — controlar QUAIS operações são permitidas.\n\n**Linhas 34-44** (`depositar`): Em vez de setSaldo(), usamos um método de negócio que: (1) verifica se a conta está ativa, (2) valida o valor, (3) altera o saldo, (4) mostra feedback. Muito mais seguro que um setSaldo simples!',
        tip: 'A regra de ouro: NÃO crie getters e setters para tudo automaticamente. Pergunte-se: "esse dado PRECISA ser acessado de fora? PRECISA ser alterável? Se sim, com qual validação?"',
      },

      // ────────── SEÇÃO 3: Encapsulamento Falso vs Real ──────────
      {
        title: 'Encapsulamento "Falso" vs Encapsulamento Real',
        body: 'Muitos programadores cometem o erro de criar getters e setters para TODOS os atributos automaticamente, sem validação. Isso é **encapsulamento falso** — os dados continuam desprotegidos.\n\nA diferença:\n- **Falso**: `setSaldo(double s) { this.saldo = s; }` → Aceita qualquer valor, inclusive negativo!\n- **Real**: Métodos de negócio (depositar/sacar) com validação, sem setSaldo\n\nSe o setter apenas faz `this.x = valor` sem validar, é o mesmo que ter o atributo público — com mais código e sem benefício.',
        code: `// ═══ ENCAPSULAMENTO FALSO (não faça isso!) ═══
class ContaFalsa {
    private double saldo;

    // Getter e Setter gerados automaticamente — SEM VALIDAÇÃO!
    public double getSaldo() { return saldo; }
    public void setSaldo(double saldo) { this.saldo = saldo; } // PERIGO!
}
// conta.setSaldo(-5000); → ACEITA! Mesma coisa que public!

// ═══ ENCAPSULAMENTO REAL ═══
class ContaReal {
    private double saldo;

    public double getSaldo() { return saldo; }
    // NÃO tem setSaldo!

    public void depositar(double valor) {
        if (valor > 0) {
            saldo += valor;
            System.out.println("Depósito: R$" + valor);
        }
    }

    public boolean sacar(double valor) {
        if (valor > 0 && valor <= saldo) {
            saldo -= valor;
            return true;
        }
        return false;
    }
}
// conta.depositar(-5000); → RECUSADO! Proteção real!`,
        codeExplanation: '**Linhas 2-8** (Encapsulamento falso): `setSaldo` aceita QUALQUER valor. Fazer `conta.setSaldo(-5000)` funciona perfeitamente — nenhuma validação! O atributo é private mas o setter destrói a proteção.\n\n**Linhas 12-32** (Encapsulamento real): NÃO existe setSaldo. A única forma de alterar o saldo é via `depositar()` e `sacar()`, que validam os valores. É impossível ter saldo negativo.\n\n**A lição**: Encapsulamento não é "colocar private e gerar get/set". É CONTROLAR como os dados são acessados e modificados.',
        warning: 'IDEs como IntelliJ e Eclipse têm opção "Generate Getters and Setters". Use com cuidado! Gerar para todos os atributos sem pensar é o erro mais comum de encapsulamento.',
      },

      // ────────── SEÇÃO 4: Quando Usar Get, Set, ou Nenhum ──────────
      {
        title: 'Guia: Quando Usar Getter, Setter, ou Nenhum',
        body: 'Aqui está um guia prático para decidir como expor (ou não) cada atributo:\n\n**Somente Getter (leitura)** — dados que não devem mudar após criação:\n- CPF, RG, data de nascimento, ID do objeto\n- Resultados calculados (média, total)\n\n**Getter + Setter com validação** — dados que podem ser alterados com regras:\n- Nome (não pode ser vazio), Email (deve ter @)\n- Preço (não pode ser negativo)\n\n**Métodos de negócio (sem getter/setter)** — dados que mudam por operações específicas:\n- Saldo (depositar/sacar), Estoque (vender/repor)\n- Status (ativar/desativar), Senha (alterarSenha)\n\n**Nenhum acesso** — dados 100% internos:\n- Contadores internos, flags de controle, cache',
        code: `public class Usuario {
    // Somente getter (definidos no construtor, nunca mudam)
    private final String id;
    private final String dataCriacao;

    // Getter + setter com validação
    private String nome;
    private String email;

    // Métodos de negócio (sem get/set direto)
    private String senhaHash;
    private boolean ativo;
    private int tentativasLogin; // nenhum acesso externo!

    public Usuario(String id, String nome, String email) {
        this.id = id;
        this.dataCriacao = java.time.LocalDate.now().toString();
        this.nome = nome;
        this.email = email;
        this.senhaHash = "";
        this.ativo = true;
        this.tentativasLogin = 0;
    }

    // ═══ SOMENTE GETTER ═══
    public String getId() { return id; }
    public String getDataCriacao() { return dataCriacao; }

    // ═══ GETTER + SETTER COM VALIDAÇÃO ═══
    public String getNome() { return nome; }
    public void setNome(String nome) {
        if (nome != null && nome.trim().length() >= 2) {
            this.nome = nome;
        }
    }

    public String getEmail() { return email; }
    public void setEmail(String email) {
        if (email != null && email.contains("@")) {
            this.email = email;
        }
    }

    // ═══ MÉTODOS DE NEGÓCIO ═══
    public void alterarSenha(String senhaAtual, String novaSenha) {
        // Não expõe a senha — valida e altera internamente
        if (novaSenha != null && novaSenha.length() >= 6) {
            this.senhaHash = novaSenha; // simplificado; real usaria hash
            System.out.println("Senha alterada com sucesso!");
        }
    }

    public void desativar() { this.ativo = false; }
    public void ativar() { this.ativo = true; }
    public boolean isAtivo() { return ativo; }
    // tentativasLogin → NENHUM acesso externo!
}`,
        codeExplanation: '**Linhas 3-4** (`private final`): `final` significa que o valor é definido UMA vez (no construtor) e nunca mais muda. Ideal para ID e data de criação. Tem getter mas NUNCA terá setter.\n\n**Linhas 31-34** (`setNome`): Valida que o nome tem pelo menos 2 caracteres. Nomes como "" ou "A" são rejeitados.\n\n**Linhas 38-41** (`setEmail`): Valida que contém "@". Uma validação simples (em sistemas reais seria mais completa).\n\n**Linhas 45-50** (`alterarSenha`): Em vez de `setSenha()`, usamos um método que pede a senha atual para validar. A senha NUNCA é exposta — não tem `getSenha()`!\n\n**Linha 56**: `tentativasLogin` não tem NENHUM getter ou setter. É um dado 100% interno — ninguém de fora precisa saber.',
        tip: 'A palavra-chave `final` em atributos significa "não pode ser alterado após inicialização". Combine com private para criar dados imutáveis e seguros.',
      },

      // ────────── SEÇÃO 5: Exercício Completo ──────────
      {
        title: 'Exercício Completo: Sistema de Produtos Encapsulado',
        body: 'Vamos criar um sistema de loja com encapsulamento real: atributos protegidos, validação em construtores e métodos, e controle de acesso pensado.',
        code: `import java.util.ArrayList;

class Produto {
    private final int id;
    private String nome;
    private double preco;
    private int estoque;
    private boolean ativo;
    private static int proximoId = 1;

    public Produto(String nome, double preco, int estoqueInicial) {
        this.id = proximoId++;
        this.nome = (nome != null && !nome.trim().isEmpty()) ? nome : "Sem nome";
        this.preco = Math.max(0.01, preco);
        this.estoque = Math.max(0, estoqueInicial);
        this.ativo = true;
    }

    // Getters (leitura)
    public int getId() { return id; }
    public String getNome() { return nome; }
    public double getPreco() { return preco; }
    public int getEstoque() { return estoque; }
    public boolean isAtivo() { return ativo; }

    // Setter com validação
    public void setNome(String nome) {
        if (nome != null && nome.trim().length() >= 2) {
            this.nome = nome;
        } else {
            System.out.println("Nome deve ter ao menos 2 caracteres!");
        }
    }

    public void setPreco(double preco) {
        if (preco > 0) {
            this.preco = preco;
        } else {
            System.out.println("Preço deve ser positivo!");
        }
    }

    // Métodos de negócio (em vez de setEstoque!)
    public boolean vender(int qtd) {
        if (!ativo) { System.out.println(nome + " está inativo!"); return false; }
        if (qtd <= 0) { System.out.println("Quantidade inválida!"); return false; }
        if (qtd > estoque) {
            System.out.println("Estoque insuficiente de " + nome
                + "! Tem: " + estoque);
            return false;
        }
        estoque -= qtd;
        System.out.println("Vendido: " + qtd + "x " + nome);
        return true;
    }

    public void repor(int qtd) {
        if (qtd > 0) {
            estoque += qtd;
            System.out.println("Reposto: " + qtd + "x " + nome + " | Total: " + estoque);
        }
    }

    public void desativar() { ativo = false; }

    public void exibirInfo() {
        String status = ativo ? "Ativo" : "Inativo";
        System.out.println("[" + id + "] " + nome + " - R$"
            + String.format("%.2f", preco)
            + " | Estoque: " + estoque + " | " + status);
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Produto> loja = new ArrayList<>();
        loja.add(new Produto("Camiseta", 49.90, 100));
        loja.add(new Produto("Calça Jeans", 129.90, 50));
        loja.add(new Produto("Tênis", 199.90, 30));

        System.out.println("=== LOJA ===");
        for (Produto p : loja) { p.exibirInfo(); }

        System.out.println("\\n=== OPERAÇÕES ===");
        loja.get(0).vender(5);
        loja.get(1).vender(100);   // falha!
        loja.get(2).desativar();
        loja.get(2).vender(1);     // falha! (inativo)

        loja.get(0).setPreco(-10); // falha! (preço negativo)
        loja.get(0).setPreco(59.90); // OK

        System.out.println("\\n=== LOJA ATUALIZADA ===");
        for (Produto p : loja) { p.exibirInfo(); }
    }
}`,
        codeExplanation: '**Linha 4** (`private final int id`): ID é final — definido uma vez no construtor e nunca muda. Tem getter mas não tem setter.\n\n**Linha 9** (`static int proximoId`): Contador da classe — cada novo produto recebe um ID sequencial automaticamente (1, 2, 3...).\n\n**Linhas 44-55** (`vender`): Método de negócio com 3 validações: (1) produto ativo?, (2) quantidade válida?, (3) tem estoque?. Muito mais seguro que `setEstoque(estoque - qtd)`.\n\n**Linhas 35-41** (`setPreco`): Setter COM validação — rejeita preços negativos. Note que NÃO existe `setEstoque` nem `setId`.\n\n**Linha 90** (`setPreco(-10)`): Rejeitado! A validação protege. Na linha seguinte, `setPreco(59.90)` funciona porque é positivo.',
        tryItCode: `import java.util.ArrayList;

class Produto {
    private final int id;
    private String nome;
    private double preco;
    private int estoque;
    private boolean ativo;
    private static int proximoId = 1;

    public Produto(String nome, double preco, int estoqueInicial) {
        this.id = proximoId++;
        this.nome = (nome != null) ? nome : "Sem nome";
        this.preco = Math.max(0.01, preco);
        this.estoque = Math.max(0, estoqueInicial);
        this.ativo = true;
    }

    public int getId() { return id; }
    public String getNome() { return nome; }
    public double getPreco() { return preco; }
    public int getEstoque() { return estoque; }
    public boolean isAtivo() { return ativo; }

    public void setPreco(double preco) {
        if (preco > 0) this.preco = preco;
        else System.out.println("Preço inválido!");
    }

    public boolean vender(int qtd) {
        if (!ativo) { System.out.println(nome + " inativo!"); return false; }
        if (qtd > 0 && qtd <= estoque) {
            estoque -= qtd;
            System.out.println("Vendido: " + qtd + "x " + nome);
            return true;
        }
        System.out.println("Venda negada para " + nome + "!");
        return false;
    }

    public void repor(int qtd) {
        if (qtd > 0) { estoque += qtd; System.out.println("Reposto: +" + qtd + " " + nome); }
    }

    public void desativar() { ativo = false; }

    public void exibirInfo() {
        System.out.println("[" + id + "] " + nome + " R$"
            + String.format("%.2f", preco) + " | Est: " + estoque
            + " | " + (ativo ? "Ativo" : "Inativo"));
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Produto> loja = new ArrayList<>();
        loja.add(new Produto("Camiseta", 49.90, 100));
        loja.add(new Produto("Calça", 129.90, 50));
        loja.add(new Produto("Tênis", 199.90, 30));

        System.out.println("=== LOJA ===");
        for (Produto p : loja) { p.exibirInfo(); }

        System.out.println("\\n=== OPERAÇÕES ===");
        loja.get(0).vender(5);
        loja.get(1).vender(100);
        loja.get(2).desativar();
        loja.get(2).vender(1);
        loja.get(0).setPreco(-10);
        loja.get(0).setPreco(59.90);
        loja.get(0).repor(20);

        System.out.println("\\n=== ATUALIZADO ===");
        for (Produto p : loja) { p.exibirInfo(); }
    }
}`,
        tryItPrompt: 'Teste todas as proteções: tente vender produto inativo, setar preço negativo, vender mais que o estoque. Adicione um método aplicarDesconto(percentual) com validação!',
      },
    ],

    // ────────── Comparação COM/SEM ──────────
    withoutPoo: `// SEM encapsulamento
public class ContaSemProtecao {
    public String titular;
    public double saldo;
    public String cpf;

    // Qualquer código pode fazer:
    // conta.saldo = -5000;     → saldo negativo!
    // conta.titular = "";      → nome vazio!
    // conta.cpf = "invalido";  → CPF corrompido!
    // NENHUMA proteção!
}`,
    withPoo: `// COM encapsulamento
public class ContaProtegida {
    private String titular;
    private double saldo;
    private final String cpf; // imutável após criação

    public ContaProtegida(String titular, String cpf) {
        this.titular = titular;
        this.cpf = cpf;
        this.saldo = 0;
    }

    public void depositar(double valor) {
        if (valor > 0) { saldo += valor; }
    }

    public boolean sacar(double valor) {
        if (valor > 0 && valor <= saldo) {
            saldo -= valor; return true;
        }
        return false; // IMPOSSÍVEL ter saldo negativo!
    }

    public double getSaldo() { return saldo; }
    // Sem setSaldo! Sem setCpf! Proteção real!
}`,
    comparisonExplanation: 'SEM encapsulamento: dados expostos, qualquer código corrompe. COM encapsulamento: atributos private, acesso controlado por métodos com validação. Saldo negativo é IMPOSSÍVEL.',

    // ────────── Exercícios de Completar Código ──────────
    codeFillExercises: [
      {
        instruction: 'Qual modificador de acesso esconde o atributo e permite acesso só dentro da própria classe?',
        snippetBefore: '',
        snippetAfter: ' double saldo;\n// conta.saldo = -5000; → ERRO de compilação!',
        options: ['private', 'public', 'protected', 'static'],
        correctIndex: 0,
        explanation: 'private torna o atributo acessível APENAS dentro da própria classe. Código externo não pode nem ler nem alterar diretamente.',
      },
      {
        instruction: 'Para atributos boolean, a convenção do getter é usar:',
        snippetBefore: 'private boolean ativo;\npublic boolean ',
        snippetAfter: '() { return ativo; }',
        options: ['isAtivo', 'getAtivo', 'hasAtivo', 'checkAtivo'],
        correctIndex: 0,
        explanation: 'Para boolean, a convenção Java é usar "is" em vez de "get": isAtivo(), isVazio(), isPago(). Para outros tipos, usa-se get.',
      },
      {
        instruction: 'Qual é melhor para controlar o saldo: setSaldo() ou métodos de negócio?',
        snippetBefore: '// Em vez de setSaldo(valor):\n// Use ',
        snippetAfter: '(valor) e sacar(valor) com validação.',
        options: ['depositar', 'setSaldo', 'atribuir', 'mudarSaldo'],
        correctIndex: 0,
        explanation: 'Métodos de negócio como depositar() e sacar() encapsulam regras reais (valor positivo, saldo suficiente). Um setSaldo genérico não protege nada.',
      },
    ],

    // ────────── Erros Comuns ──────────
    commonErrors: [
      {
        title: 'Criar get/set para TODOS os atributos sem pensar',
        description: 'Gerar getters e setters automáticos para tudo derrota o propósito do encapsulamento. Pense se cada atributo realmente precisa ser exposto.',
        code: `// ERRADO: encapsulamento falso!
private double saldo;
public void setSaldo(double saldo) {
    this.saldo = saldo; // aceita QUALQUER valor! Sem proteção!
}

// CORRETO: método de negócio com validação
private double saldo;
public void depositar(double valor) {
    if (valor > 0) this.saldo += valor; // VALIDADO!
}`,
      },
      {
        title: 'Setter sem validação',
        description: 'Um setter que apenas faz this.x = x não protege nada — é o mesmo que ter o atributo público.',
        code: `// INÚTIL: nenhuma proteção
public void setIdade(int idade) {
    this.idade = idade; // aceita -50, 999...
}

// CORRETO: com validação
public void setIdade(int idade) {
    if (idade >= 0 && idade <= 150) {
        this.idade = idade;
    }
}`,
      },
      {
        title: 'Esquecer que private bloqueia acesso de OUTRA classe',
        description: 'Com private, conta.saldo de fora da classe dá erro de compilação. Use getSaldo().',
        code: `// Na classe Main (FORA de ContaBancaria):
ContaBancaria c = new ContaBancaria("Ana", "123");
// c.saldo = 1000; → ERRO! saldo é private!
// double s = c.saldo; → ERRO! saldo é private!

// CORRETO:
c.depositar(1000);
double s = c.getSaldo(); // usa o getter`,
      },
    ],

    // ────────── Resumo ──────────
    summary: [
      'Encapsulamento = atributos private + acesso controlado por métodos',
      'private: acessível APENAS dentro da própria classe',
      'Getter (get/is): permite leitura controlada do atributo',
      'Setter (set): permite escrita COM VALIDAÇÃO — rejeitar valores inválidos',
      'NÃO crie get/set para tudo! Pense: "esse dado precisa ser exposto? Com qual proteção?"',
      'Métodos de negócio (depositar/sacar) são melhores que setters genéricos para dados sensíveis',
      'final em atributos = definido uma vez, nunca mais muda (ex: id, cpf)',
      'Encapsulamento falso = get/set sem validação = mesmo que public (inútil)',
    ],

    // ────────── Código final ──────────
    tryItCode: `class Conta {
    private String titular;
    private double saldo;

    public Conta(String titular, double saldoInicial) {
        this.titular = (titular != null) ? titular : "Anônimo";
        this.saldo = Math.max(0, saldoInicial);
    }

    public String getTitular() { return titular; }
    public double getSaldo() { return saldo; }

    public void depositar(double v) {
        if (v > 0) {
            saldo += v;
            System.out.println("Depósito: +R$" + v + " | Saldo: R$" + saldo);
        } else {
            System.out.println("Valor inválido para depósito!");
        }
    }

    public boolean sacar(double v) {
        if (v > 0 && v <= saldo) {
            saldo -= v;
            System.out.println("Saque: -R$" + v + " | Saldo: R$" + saldo);
            return true;
        }
        System.out.println("Saque negado! Saldo: R$" + saldo);
        return false;
    }

    public boolean transferir(Conta destino, double valor) {
        if (this.sacar(valor)) {
            destino.depositar(valor);
            System.out.println("Transferência de " + titular + " → " + destino.getTitular());
            return true;
        }
        return false;
    }
}

public class Main {
    public static void main(String[] args) {
        Conta c1 = new Conta("Ana", 1000);
        Conta c2 = new Conta("Bruno", 500);

        System.out.println("=== ESTADO INICIAL ===");
        System.out.println(c1.getTitular() + ": R$" + c1.getSaldo());
        System.out.println(c2.getTitular() + ": R$" + c2.getSaldo());

        System.out.println("\\n=== OPERAÇÕES ===");
        c1.depositar(500);
        c1.sacar(200);
        c1.transferir(c2, 300);
        c1.sacar(5000); // vai falhar!

        System.out.println("\\n=== ESTADO FINAL ===");
        System.out.println(c1.getTitular() + ": R$" + c1.getSaldo());
        System.out.println(c2.getTitular() + ": R$" + c2.getSaldo());
    }
}`,
    tryItPrompt: 'Teste depositar/sacar/transferir. Tente acessar conta.saldo diretamente (vai dar erro!). Crie uma conta com saldo negativo no construtor e veja que o Math.max protege.',
  },

  'm3-static': {
    id: 'm3-static', moduleId: 3,
    objectives: [
      'Entender a diferença entre membros de instância e membros static',
      'Usar atributos static para contadores e constantes da classe',
      'Criar métodos static utilitários',
      'Saber por que métodos static não acessam this',
      'Usar static final para constantes',
      'Entender o public static void main',
    ],
    sections: [
      // ────────── SEÇÃO 1: Instância vs Static ──────────
      {
        title: 'Instância vs Static: Qual a Diferença?',
        body: 'Até agora, todos os atributos e métodos que criamos eram **de instância** — cada objeto tinha sua própria cópia. Quando você faz `f1.nome = "Ana"` e `f2.nome = "Bruno"`, cada um guarda seu próprio nome.\n\nMas e se você precisar de algo **compartilhado por TODOS os objetos**? Por exemplo:\n- Quantos funcionários foram criados no total?\n- Qual o salário mínimo da empresa (igual para todos)?\n- Um gerador de IDs sequenciais?\n\nPara isso existe o **static**: um atributo ou método que pertence à **classe**, não a cada objeto. Existe UMA cópia só, compartilhada por todos.',
        code: `public class Funcionario {
    // ═══ ATRIBUTOS DE INSTÂNCIA (cada objeto tem o seu) ═══
    private String nome;
    private double salario;

    // ═══ ATRIBUTOS STATIC (UM só para a classe toda) ═══
    private static int totalFuncionarios = 0;  // contador compartilhado
    private static final double SALARIO_MINIMO = 1412.00; // constante
    private static int proximoId = 1; // gerador de ID

    private int id; // id de instância (cada um tem o seu)

    public Funcionario(String nome, double salario) {
        this.id = proximoId++;        // pega o próximo ID e incrementa
        this.nome = nome;
        this.salario = Math.max(salario, SALARIO_MINIMO);
        totalFuncionarios++;          // incrementa para TODOS
    }

    // ═══ MÉTODO STATIC (pertence à classe) ═══
    public static int getTotalFuncionarios() {
        return totalFuncionarios;
    }

    public static double getSalarioMinimo() {
        return SALARIO_MINIMO;
    }

    // Método de instância (pertence ao objeto)
    public void exibirInfo() {
        System.out.println("[" + id + "] " + nome + " | R$" + salario);
    }
}`,
        codeExplanation: '**Linha 7** (`static int totalFuncionarios`): Existe UMA cópia para a classe inteira. Quando f1 incrementa, f2 enxerga o novo valor.\n\n**Linha 8** (`static final double SALARIO_MINIMO`): `static` = da classe, `final` = não pode ser alterado. Combinação perfeita para constantes. Convenção: MAIÚSCULAS_COM_UNDERSCORE.\n\n**Linha 9** (`static int proximoId`): Começa em 1. Cada `new Funcionario(...)` pega o valor atual (1, 2, 3...) e incrementa para o próximo.\n\n**Linha 14** (`this.id = proximoId++`): O `++` APÓS a variável significa "use o valor atual, DEPOIS incremente". Então o primeiro objeto pega id=1 e proximoId vira 2.\n\n**Linha 17** (`totalFuncionarios++`): Toda vez que um objeto é criado, o contador da classe aumenta. Se criar 3 funcionários, totalFuncionarios será 3.\n\n**Linhas 21-23** (`static getTotalFuncionarios()`): Método static — chamado pela CLASSE: `Funcionario.getTotalFuncionarios()`, não por um objeto.',
        tip: 'Acesse membros static pela CLASSE: `Funcionario.getTotalFuncionarios()`. Tecnicamente funciona com objeto (`f1.getTotalFuncionarios()`), mas é confuso e má prática.',
      },

      // ────────── SEÇÃO 2: Por que static não acessa this ──────────
      {
        title: 'Por que Métodos Static NÃO Acessam this?',
        body: 'Essa é uma das confusões mais comuns em Java. O `this` se refere ao **objeto atual** — "o objeto que chamou este método". Mas métodos static não são chamados por um objeto! São chamados pela classe.\n\nQuando você faz `Funcionario.getTotalFuncionarios()`, não existe "um funcionário" específico chamando — é a CLASSE. Então `this` não faz sentido.\n\n**Regra**:\n- Método de instância (sem static): pode acessar tudo (instância E static)\n- Método static: só pode acessar membros STATIC da classe',
        code: `public class Exemplo {
    private String nome;        // de instância
    private static int total;   // static

    // MÉTODO DE INSTÂNCIA: acessa TUDO
    public void metodoNormal() {
        System.out.println(this.nome); // OK! Tem this
        System.out.println(total);     // OK! Static é acessível de qualquer lugar
    }

    // MÉTODO STATIC: só acessa STATIC
    public static void metodoStatic() {
        System.out.println(total);     // OK! Ambos são static
        // System.out.println(nome);   // ERRO! nome é de instância
        // System.out.println(this.nome); // ERRO! this não existe em static
    }

    // ENTENDENDO O main
    public static void main(String[] args) {
        // main é static! Por isso não pode acessar atributos de instância:
        // System.out.println(nome); // ERRO!

        // Precisa criar um objeto primeiro:
        Exemplo obj = new Exemplo();
        obj.nome = "Teste";
        System.out.println(obj.nome); // OK! Acessa pelo objeto
    }
}`,
        codeExplanation: '**Linhas 6-9** (Método normal): Pode acessar `this.nome` (instância) e `total` (static). Método de instância tem acesso a tudo.\n\n**Linhas 12-16** (Método static): `total` funciona porque ambos são static. `nome` e `this` dão erro — não existe objeto nesse contexto.\n\n**Linhas 19-25** (`main`): `public static void main` é static! Por isso, dentro do main, você não pode acessar atributos de instância diretamente. Precisa criar um objeto primeiro (`new Exemplo()`) e acessar por ele.\n\n**Por que main é static?** Porque o programa precisa começar de algum lugar ANTES de criar qualquer objeto. O `main` roda sem nenhum objeto existir, por isso é static.',
        warning: 'O main é static — essa é a razão pela qual você sempre precisa fazer `new` para usar objetos dentro do main! Não pode acessar atributos de instância diretamente.',
      },

      // ────────── SEÇÃO 3: Constantes e Utilitários ──────────
      {
        title: 'Usos Práticos: Constantes e Métodos Utilitários',
        body: 'Os dois usos mais comuns de static são:\n\n1. **Constantes** (`static final`): valores fixos que não mudam\n2. **Métodos utilitários**: fazem cálculos sem precisar de um objeto\n\nVocê já usa static sem saber! A classe `Math` do Java é cheia de métodos static:\n- `Math.sqrt(25)` → raiz quadrada\n- `Math.max(5, 10)` → maior valor\n- `Math.PI` → constante pi\n\nEsses métodos não precisam de `new Math()` porque são static — pertencem à classe.',
        code: `// Classe utilitária com métodos static
public class MathUtil {
    // Constantes (static final)
    public static final double PI = 3.14159265;
    public static final double TAXA_IMPOSTO = 0.15; // 15%

    // Métodos utilitários (static)
    public static double calcularAreaCirculo(double raio) {
        return PI * raio * raio;
    }

    public static double calcularImposto(double valor) {
        return valor * TAXA_IMPOSTO;
    }

    public static double celsiusParaFahrenheit(double celsius) {
        return (celsius * 9.0 / 5.0) + 32;
    }

    public static boolean ehPar(int numero) {
        return numero % 2 == 0;
    }
}

// Uso — sem new! Pela classe diretamente:
double area = MathUtil.calcularAreaCirculo(5);
double imposto = MathUtil.calcularImposto(1000);
double fahrenheit = MathUtil.celsiusParaFahrenheit(30);
boolean par = MathUtil.ehPar(7);`,
        codeExplanation: '**Linhas 4-5** (`static final`): Constantes da classe. `PI` e `TAXA_IMPOSTO` são iguais para todos — não faz sentido cada objeto ter seu próprio PI.\n\n**Linhas 8-10** (`static calcularAreaCirculo`): Não precisa de nenhum objeto — só recebe o raio e retorna a área. Faz sentido ser static porque não depende de estado de nenhum objeto.\n\n**Linhas 25-28** (Uso): Chamamos pela CLASSE: `MathUtil.calcularAreaCirculo(5)`. Não precisa de `new MathUtil()`. Isso é o padrão "classe utilitária" — comum em projetos Java.',
        tip: 'A convenção Java para constantes é MAIÚSCULAS_COM_UNDERSCORE: PI, SALARIO_MINIMO, MAX_TENTATIVAS, TAXA_IMPOSTO.',
        tryItCode: `class MathUtil {
    public static final double PI = 3.14159265;

    public static double areaCirculo(double raio) {
        return PI * raio * raio;
    }

    public static double areaRetangulo(double largura, double altura) {
        return largura * altura;
    }

    public static double celsiusParaFahrenheit(double c) {
        return (c * 9.0 / 5.0) + 32;
    }

    public static boolean ehPar(int n) { return n % 2 == 0; }
    public static boolean ehImpar(int n) { return n % 2 != 0; }

    public static int fatorial(int n) {
        int resultado = 1;
        for (int i = 2; i <= n; i++) resultado *= i;
        return resultado;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("Área círculo (r=5): " + MathUtil.areaCirculo(5));
        System.out.println("Área retângulo (3x4): " + MathUtil.areaRetangulo(3, 4));
        System.out.println("30°C em °F: " + MathUtil.celsiusParaFahrenheit(30));
        System.out.println("7 é par? " + MathUtil.ehPar(7));
        System.out.println("5! = " + MathUtil.fatorial(5));
    }
}`,
        tryItPrompt: 'Adicione mais métodos utilitários: fahrenheitParaCelsius, potencia(base, exp), ehPrimo(n). Tudo static!',
      },

      // ────────── SEÇÃO 4: Exercício Completo ──────────
      {
        title: 'Exercício Completo: Contador e ID Automático',
        body: 'Vamos ver um uso prático de static: um sistema onde cada produto recebe um ID automático e temos um contador de produtos criados.',
        code: `import java.util.ArrayList;

class Produto {
    // Static: da classe
    private static int proximoId = 1;
    private static int totalProdutos = 0;

    // Instância: de cada objeto
    private final int id;
    private String nome;
    private double preco;

    public Produto(String nome, double preco) {
        this.id = proximoId++;     // ID automático!
        this.nome = nome;
        this.preco = preco;
        totalProdutos++;
    }

    // Métodos static (da classe)
    public static int getTotalProdutos() { return totalProdutos; }
    public static int getProximoId() { return proximoId; }

    // Métodos de instância (do objeto)
    public void exibirInfo() {
        System.out.println("[ID " + id + "] " + nome + " - R$" + preco);
    }

    public int getId() { return id; }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("Produtos antes: " + Produto.getTotalProdutos());

        ArrayList<Produto> loja = new ArrayList<>();
        loja.add(new Produto("Camiseta", 49.90));
        loja.add(new Produto("Calça", 129.90));
        loja.add(new Produto("Tênis", 199.90));

        System.out.println("\\nProdutos depois: " + Produto.getTotalProdutos());
        System.out.println("Próximo ID será: " + Produto.getProximoId());

        System.out.println("\\n=== PRODUTOS ===");
        for (Produto p : loja) { p.exibirInfo(); }
    }
}`,
        codeExplanation: '**Linhas 5-6** (Static): `proximoId` começa em 1 e incrementa a cada novo produto. `totalProdutos` conta quantos foram criados.\n\n**Linha 14** (`this.id = proximoId++`): Primeiro objeto: id=1, proximoId vira 2. Segundo: id=2, proximoId vira 3. E assim por diante.\n\n**Linha 34** (`Produto.getTotalProdutos()`): Antes de criar qualquer produto, retorna 0. Chamado pela CLASSE.\n\n**Linha 41**: Após criar 3 produtos, retorna 3. O contador é compartilhado — cada `new Produto(...)` incrementa.',
        tryItCode: `import java.util.ArrayList;

class Produto {
    private static int proximoId = 1;
    private static int totalProdutos = 0;
    private final int id;
    private String nome;
    private double preco;

    public Produto(String nome, double preco) {
        this.id = proximoId++;
        this.nome = nome;
        this.preco = preco;
        totalProdutos++;
    }

    public static int getTotalProdutos() { return totalProdutos; }

    public void exibirInfo() {
        System.out.println("[ID " + id + "] " + nome + " - R$" + preco);
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("Total antes: " + Produto.getTotalProdutos());

        ArrayList<Produto> loja = new ArrayList<>();
        loja.add(new Produto("Camiseta", 49.90));
        loja.add(new Produto("Calça", 129.90));
        loja.add(new Produto("Tênis", 199.90));

        System.out.println("Total depois: " + Produto.getTotalProdutos());
        System.out.println("\\n=== PRODUTOS ===");
        for (Produto p : loja) { p.exibirInfo(); }
    }
}`,
        tryItPrompt: 'Adicione mais produtos e veja os IDs sendo gerados automaticamente. Adicione um atributo static "totalEstoque" que soma o estoque de todos os produtos!',
      },
    ],

    // ────────── Exercícios ──────────
    codeFillExercises: [
      {
        instruction: 'Qual palavra-chave indica que um membro pertence à classe e não a cada objeto?',
        snippetBefore: 'private ',
        snippetAfter: ' int totalFuncionarios = 0;',
        options: ['static', 'class', 'shared', 'final'],
        correctIndex: 0,
        explanation: 'static faz o membro ser compartilhado por todos os objetos. Existe UMA cópia só para a classe inteira.',
      },
      {
        instruction: 'Para criar uma constante em Java, usamos:',
        snippetBefore: 'private ',
        snippetAfter: ' double SALARIO_MINIMO = 1412.00;',
        options: ['static final', 'const', 'final static', 'constant'],
        correctIndex: 0,
        explanation: 'static final = da classe (compartilhado) + não pode ser alterado. Em Java não existe "const" — usamos "static final" para constantes.',
      },
      {
        instruction: 'Como chamar um método static corretamente?',
        snippetBefore: 'int total = ',
        snippetAfter: '.getTotalFuncionarios();',
        options: ['Funcionario', 'this', 'new Funcionario()', 'super'],
        correctIndex: 0,
        explanation: 'Métodos static são chamados pela CLASSE: NomeClasse.metodo(). Não precisam de um objeto.',
      },
    ],
    summary: [
      'Membros static pertencem à CLASSE e são compartilhados por todos os objetos',
      'Membros de instância (sem static) são próprios de cada objeto',
      'Métodos static NÃO podem acessar this nem membros de instância',
      'Métodos de instância podem acessar tudo (instância + static)',
      'static final = constante (valor fixo): SALARIO_MINIMO, PI, MAX_TENTATIVAS',
      'Acesse static pela CLASSE: Funcionario.getTotalFuncionarios()',
      'main é static — por isso precisa de new para usar objetos',
      'Use static para: contadores, constantes, IDs automáticos, métodos utilitários',
    ],
    tryItCode: `class Funcionario {
    private static int total = 0;
    private static int proximoId = 1;
    private static final double SALARIO_MINIMO = 1412.00;

    private int id;
    private String nome;
    private double salario;

    public Funcionario(String nome, double salario) {
        this.id = proximoId++;
        this.nome = nome;
        this.salario = Math.max(salario, SALARIO_MINIMO);
        total++;
    }

    public static int getTotal() { return total; }
    public static double getSalarioMinimo() { return SALARIO_MINIMO; }

    public void exibirInfo() {
        System.out.println("[" + id + "] " + nome + " | R$" + salario);
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("Salário mínimo: R$" + Funcionario.getSalarioMinimo());

        new Funcionario("Ana", 5000);
        new Funcionario("Bruno", 1000); // vai usar SALARIO_MINIMO
        new Funcionario("Carlos", 3500);

        System.out.println("Total: " + Funcionario.getTotal());
    }
}`,
    tryItPrompt: 'Veja que Bruno recebeu salário mínimo (1412) mesmo pedindo 1000. Crie mais funcionários e acompanhe o total e os IDs.',
    commonErrors: [
      {
        title: 'Acessar atributo de instância em método static',
        description: 'Dentro de static não existe this. Não dá para acessar nome, salario etc.',
        code: `public static void metodoStatic() {
    // System.out.println(nome); // ERRO!
    // System.out.println(this.nome); // ERRO!
    System.out.println(totalFuncionarios); // OK (static)
}`,
      },
      {
        title: 'Chamar método static pelo objeto',
        description: 'Funciona, mas é confuso. Sempre chame pela classe.',
        code: `Funcionario f = new Funcionario("Ana", 5000);
// f.getTotalFuncionarios(); // funciona mas é MÁ PRÁTICA
Funcionario.getTotalFuncionarios(); // CORRETO: pela classe`,
      },
      {
        title: 'Abusar de static',
        description: 'Se tudo for static, você perde as vantagens da POO. Use static só para o que é realmente da classe.',
      },
    ],
  },

  'm3-this': {
    id: 'm3-this', moduleId: 3,
    objectives: [
      'Entender o que é a referência this',
      'Usar this para desambiguar atributos de parâmetros',
      'Usar this() para chamar outro construtor da mesma classe',
      'Passar this como argumento para outro método',
      'Conhecer method chaining (encadeamento) retornando this',
      'Saber que this não existe em contexto static',
    ],
    sections: [
      // ────────── SEÇÃO 1: O que é this ──────────
      {
        title: 'O que é this? A Referência ao Objeto Atual',
        body: '**this** é uma referência automática ao **objeto que está executando o método**. Quando você faz `meuCarro.ligar()`, dentro do método `ligar()`, o `this` aponta para `meuCarro`.\n\nO uso mais comum é quando o **parâmetro tem o mesmo nome do atributo**:\n- `this.nome` → atributo da classe\n- `nome` (sem this) → parâmetro do método\n\nSem this, Java não sabe qual é qual — e o parâmetro "ganha" (por ser mais local). Resultado: o atributo fica null e o programador fica confuso.',
        code: `public class Produto {
    private String nome;
    private double preco;

    // ═══ COM this: funciona correto! ═══
    public Produto(String nome, double preco) {
        this.nome = nome;     // this.nome = atributo | nome = parâmetro
        this.preco = preco;   // this.preco = atributo | preco = parâmetro
    }

    // ═══ SEM this: BUG! ═══
    // public Produto(String nome, double preco) {
    //     nome = nome;     // parâmetro = parâmetro (atributo fica null!)
    //     preco = preco;   // parâmetro = parâmetro (atributo fica 0.0!)
    // }

    public void setPreco(double preco) {
        if (preco > 0) {
            this.preco = preco;  // this diferencia atributo do parâmetro
        }
    }

    // this também funciona para chamar métodos do próprio objeto
    public void exibirInfo() {
        // Dentro do método, this se refere ao objeto que chamou
        System.out.println("Produto: " + this.nome + " | R$" + this.preco);
        // "this." é opcional quando não há ambiguidade:
        System.out.println("Produto: " + nome + " | R$" + preco);
        // Ambas as linhas fazem o mesmo! Mas this é mais explícito.
    }
}`,
        codeExplanation: '**Linhas 6-9** (Com this): `this.nome` se refere ao atributo da classe. `nome` (sem this) é o parâmetro recebido. A atribuição funciona corretamente.\n\n**Linhas 12-15** (Sem this): `nome = nome` atribui o parâmetro a si mesmo! O atributo `this.nome` continua null. Este é um dos bugs mais difíceis de encontrar.\n\n**Linhas 17-21** (Setter): Mesmo padrão — `this.preco` é o atributo, `preco` é o parâmetro.\n\n**Linhas 24-29** (Em métodos): Quando NÃO há ambiguidade (não tem parâmetro com mesmo nome), `this.` é opcional. `this.nome` e `nome` são iguais. Mas muitos programadores preferem usar `this.` sempre por clareza.',
        warning: 'Sem this, `nome = nome` dentro do construtor é um bug silencioso! O Java não dá erro — simplesmente atribui o parâmetro a ele mesmo e o atributo fica null.',
      },

      // ────────── SEÇÃO 2: this() para chamar construtores ──────────
      {
        title: 'this() para Chamar Outro Construtor',
        body: 'Além de referência ao objeto, `this()` (com parênteses) serve para **chamar outro construtor da mesma classe**. Já vimos isso na aula de construtores, mas vale reforçar:\n\n- `this.nome` → acessa o **atributo** nome\n- `this()` → chama **outro construtor** da mesma classe\n- `this(args)` → chama outro construtor passando argumentos\n\nRegra: `this()` DEVE ser a primeira linha do construtor.',
        code: `public class Contato {
    private String nome;
    private String telefone;
    private String email;

    // Construtor principal
    public Contato(String nome, String telefone, String email) {
        this.nome = nome;         // this.nome = atributo
        this.telefone = telefone;
        this.email = email;
    }

    // this() chama o construtor de 3 argumentos
    public Contato(String nome, String telefone) {
        this(nome, telefone, "não informado"); // chama construtor acima!
    }

    // Encadeia: 1 arg → 2 args → 3 args
    public Contato(String nome) {
        this(nome, "não informado"); // chama construtor de 2 args
    }

    public void exibir() {
        System.out.println(nome + " | " + telefone + " | " + email);
    }
}`,
        codeExplanation: '**Linha 8** (`this.nome = nome`): `this.` acessa o atributo (referência ao objeto).\n\n**Linha 15** (`this(nome, telefone, "não informado")`): `this()` chama outro CONSTRUTOR da mesma classe. Passa os argumentos recebidos mais "não informado" como email padrão.\n\n**Linha 20** (`this(nome, "não informado")`): Encadeia — chama o de 2 args, que chama o de 3 args.\n\n**Resumo**: `this.campo` = atributo, `this()` = construtor, `this` sozinho = o objeto.',
        tip: 'Lembre-se: this.x = ATRIBUTO, this() = CONSTRUTOR, return this = O OBJETO. Três usos diferentes da mesma palavra.',
      },

      // ────────── SEÇÃO 3: Method Chaining ──────────
      {
        title: 'Method Chaining: Encadeando Métodos com return this',
        body: '**Method chaining** (encadeamento de métodos) é um padrão onde cada método retorna **this** (o próprio objeto), permitindo chamar vários métodos em sequência.\n\nEm vez de:\n```\naluno.setNome("Ana");\naluno.setIdade(20);\naluno.setCurso("Java");\n```\n\nVocê faz:\n```\naluno.setNome("Ana").setIdade(20).setCurso("Java");\n```\n\nIsso funciona porque `setNome("Ana")` retorna `this` (o próprio aluno), e sobre esse retorno chamamos `.setIdade(20)`, que também retorna `this`, e assim por diante.',
        code: `public class Config {
    private String titulo;
    private int largura;
    private int altura;
    private boolean telaCheia;
    private String tema;

    // Cada setter retorna 'this' para permitir encadeamento
    public Config setTitulo(String titulo) {
        this.titulo = titulo;
        return this;  // retorna O OBJETO ATUAL
    }

    public Config setLargura(int largura) {
        this.largura = largura;
        return this;
    }

    public Config setAltura(int altura) {
        this.altura = altura;
        return this;
    }

    public Config setTelaCheia(boolean telaCheia) {
        this.telaCheia = telaCheia;
        return this;
    }

    public Config setTema(String tema) {
        this.tema = tema;
        return this;
    }

    public void exibir() {
        System.out.println("Título: " + titulo);
        System.out.println("Resolução: " + largura + "x" + altura);
        System.out.println("Tela cheia: " + telaCheia);
        System.out.println("Tema: " + tema);
    }
}

// Uso com method chaining — elegante e legível!
Config config = new Config()
    .setTitulo("Meu Jogo")
    .setLargura(1920)
    .setAltura(1080)
    .setTelaCheia(true)
    .setTema("escuro");

config.exibir();`,
        codeExplanation: '**Linhas 9-12** (`return this`): O método retorna `this` — o próprio objeto Config. O tipo de retorno é `Config` (não void!).\n\n**Linhas 44-49**: Cada `.setXxx()` retorna o mesmo objeto, permitindo chamar o próximo. É como se fosse:\n- `config.setTitulo("Meu Jogo")` → retorna `config`\n- `config.setLargura(1920)` → retorna `config`\n- `config.setAltura(1080)` → retorna `config`\n- ...\n\nIsso é muito usado em bibliotecas Java como StringBuilder, Streams, e builders.',
        tryItCode: `class Pedido {
    private String cliente;
    private String produto;
    private int quantidade;
    private double desconto;

    public Pedido setCliente(String cliente) {
        this.cliente = cliente;
        return this;
    }
    public Pedido setProduto(String produto) {
        this.produto = produto;
        return this;
    }
    public Pedido setQuantidade(int quantidade) {
        this.quantidade = quantidade;
        return this;
    }
    public Pedido setDesconto(double desconto) {
        this.desconto = desconto;
        return this;
    }

    public void exibir() {
        System.out.println("Pedido de " + cliente + ": "
            + quantidade + "x " + produto
            + " (desconto: " + (desconto * 100) + "%)");
    }
}

public class Main {
    public static void main(String[] args) {
        // Method chaining!
        Pedido p = new Pedido()
            .setCliente("Maria")
            .setProduto("Notebook")
            .setQuantidade(2)
            .setDesconto(0.10);

        p.exibir();

        // Outro pedido
        new Pedido()
            .setCliente("João")
            .setProduto("Mouse")
            .setQuantidade(1)
            .setDesconto(0)
            .exibir();
    }
}`,
        tryItPrompt: 'Crie mais pedidos usando method chaining. Adicione um método calcularTotal(precoUnitario) que retorne this e mostre o preço com desconto!',
      },

      // ────────── SEÇÃO 4: Passando this como Argumento ──────────
      {
        title: 'Passando this como Argumento',
        body: 'Você pode passar `this` como argumento para outro método, quando precisa enviar "o objeto atual" para algum lugar. Isso é útil em padrões como:\n- Registrar o objeto em uma lista\n- Passar o objeto para outro método processar\n- Padrão Observer (notificações)',
        code: `import java.util.ArrayList;

class Gerenciador {
    private ArrayList<Funcionario> lista = new ArrayList<>();

    public void registrar(Funcionario f) {
        lista.add(f);
        System.out.println(f.getNome() + " registrado no gerenciador.");
    }

    public void listarTodos() {
        for (Funcionario f : lista) {
            System.out.println("  - " + f.getNome());
        }
    }
}

class Funcionario {
    private String nome;
    private Gerenciador gerenciador;

    public Funcionario(String nome, Gerenciador gerenciador) {
        this.nome = nome;
        this.gerenciador = gerenciador;
        gerenciador.registrar(this); // passa "eu mesmo" para o gerenciador!
    }

    public String getNome() { return nome; }
}

public class Main {
    public static void main(String[] args) {
        Gerenciador g = new Gerenciador();

        new Funcionario("Ana", g);    // se auto-registra!
        new Funcionario("Bruno", g);  // se auto-registra!
        new Funcionario("Carlos", g); // se auto-registra!

        System.out.println("\\nFuncionários registrados:");
        g.listarTodos();
    }
}`,
        codeExplanation: '**Linha 25** (`gerenciador.registrar(this)`): O Funcionário passa "a si mesmo" (this) para o gerenciador. O `this` aqui é o objeto Funcionário que está sendo construído.\n\n**Linha 6** (`registrar(Funcionario f)`): Recebe o objeto e adiciona na lista. O `f` que chega é o `this` que foi passado.\n\n**Linhas 35-37**: Cada `new Funcionario(...)` se auto-registra no gerenciador durante a construção.',
      },
    ],

    // ────────── Exercícios ──────────
    codeFillExercises: [
      {
        instruction: 'Para encadear chamadas como obj.setA(1).setB(2), o método deve retornar:',
        snippetBefore: 'public Config setTitulo(String t) {\n    this.titulo = t;\n    return ',
        snippetAfter: ';\n}',
        options: ['this', 'self', 'void', 'null'],
        correctIndex: 0,
        explanation: 'return this retorna o próprio objeto, permitindo encadear a próxima chamada de método.',
      },
      {
        instruction: 'Dentro do construtor, como diferenciamos o atributo do parâmetro com mesmo nome?',
        snippetBefore: 'public Produto(String nome) {\n    ',
        snippetAfter: '.nome = nome; // atributo = parâmetro\n}',
        options: ['this', 'self', 'super', 'class'],
        correctIndex: 0,
        explanation: 'this.nome é o atributo da classe. nome (sem this) é o parâmetro. Sem this, nome = nome atribui o parâmetro a si mesmo.',
      },
    ],
    summary: [
      'this é a referência ao objeto que está executando o método',
      'this.nome = atributo da classe; nome = parâmetro do método',
      'Sem this quando há ambiguidade, o parâmetro é atribuído a si mesmo (bug!)',
      'this() chama outro CONSTRUTOR da mesma classe (deve ser 1ª linha)',
      'return this permite method chaining (encadear métodos)',
      'this pode ser passado como argumento: registrar(this)',
      'this NÃO existe em métodos static',
    ],
    tryItCode: `class Builder {
    private String nome;
    private int idade;
    private String curso;

    public Builder setNome(String nome) { this.nome = nome; return this; }
    public Builder setIdade(int idade) { this.idade = idade; return this; }
    public Builder setCurso(String curso) { this.curso = curso; return this; }

    public void exibir() {
        System.out.println(nome + " | " + idade + " anos | " + curso);
    }
}

public class Main {
    public static void main(String[] args) {
        new Builder()
            .setNome("Maria")
            .setIdade(22)
            .setCurso("Eng. Software")
            .exibir();

        new Builder()
            .setNome("Pedro")
            .setIdade(19)
            .setCurso("Ciência da Comp.")
            .exibir();
    }
}`,
    tryItPrompt: 'Crie mais builders usando encadeamento. Adicione validação nos setters (ex: idade > 0) e continue retornando this!',
    commonErrors: [
      {
        title: 'Esquecer this e perder a atribuição',
        description: 'nome = nome atribui o parâmetro a si mesmo. O atributo da classe fica null ou 0.',
        code: `// BUG:
public Produto(String nome) {
    nome = nome; // atributo fica null!
}
// CORRETO:
public Produto(String nome) {
    this.nome = nome; // agora sim!
}`,
      },
      {
        title: 'Usar this em método static',
        description: 'Em contexto static não existe objeto atual. this gera erro de compilação.',
        code: `public static void metodo() {
    // System.out.println(this.nome); // ERRO!
    // this não existe em static!
}`,
      },
      {
        title: 'Retornar this com tipo void',
        description: 'Para method chaining, o tipo de retorno deve ser a CLASSE, não void.',
        code: `// ERRADO (não encadeia):
public void setNome(String n) { this.nome = n; }

// CORRETO (encadeia):
public Config setNome(String n) { this.nome = n; return this; }`,
      },
    ],
  },

  'm3-inheritance': {
    id: 'm3-inheritance', moduleId: 3,
    objectives: [
      'Entender o que é herança e o problema que ela resolve',
      'Usar extends para criar subclasses',
      'Usar super() para chamar o construtor da classe pai',
      'Entender protected e o acesso entre classes pai e filha',
      'Sobrescrever métodos do pai com @Override',
      'Saber quando usar herança ("é um") e quando NÃO usar',
    ],
    sections: [
      // ────────── SEÇÃO 1: O Problema da Duplicação ──────────
      {
        title: 'O Problema: Código Duplicado Entre Classes Parecidas',
        body: 'Imagine que você está criando classes para um sistema de RH: Funcionario, Gerente, Estagiario. Todos têm nome, cpf, salario e os métodos exibirInfo() e receberPagamento(). Sem herança, você teria que copiar esses atributos e métodos em TODAS as classes.\n\nProblemas:\n- Se mudar a regra de receberPagamento(), precisa alterar em 3 classes\n- Se adicionar um atributo (como email), precisa adicionar em 3 classes\n- Se corrigir um bug em exibirInfo(), precisa corrigir em 3 lugares\n\n**Herança** resolve isso: você coloca o que é COMUM em uma classe **pai** e as classes **filhas** herdam automaticamente.',
        code: `// SEM HERANÇA — código duplicado!
class Funcionario {
    String nome; String cpf; double salario;
    void exibirInfo() {
        System.out.println(nome + " | CPF: " + cpf + " | R$" + salario);
    }
}
class Gerente {
    String nome; String cpf; double salario;  // DUPLICADO!
    String departamento;  // próprio do Gerente
    void exibirInfo() {  // DUPLICADO!
        System.out.println(nome + " | CPF: " + cpf + " | R$" + salario);
    }
}
class Estagiario {
    String nome; String cpf; double salario;  // DUPLICADO!
    String faculdade;  // próprio do Estagiário
    void exibirInfo() {  // DUPLICADO!
        System.out.println(nome + " | CPF: " + cpf + " | R$" + salario);
    }
}
// 3 classes com código repetido! Manutenção = pesadelo!`,
        codeExplanation: '**Linhas 2-6, 8-13, 15-21**: nome, cpf, salario e exibirInfo() se repetem em TODAS as classes. Se a empresa mudar o formato de exibição (adicionar email, por exemplo), você precisa alterar 3 classes.\n\nCom herança, colocamos o que é comum em uma classe pai `Funcionario`, e `Gerente` e `Estagiario` herdam tudo.',
        warning: 'Código duplicado é o inimigo número 1 da manutenção. Herança é uma das ferramentas para eliminá-lo.',
      },

      // ────────── SEÇÃO 2: extends e super ──────────
      {
        title: 'Herança com extends e super()',
        body: 'Para criar herança em Java, use **extends**:\n\n```\nclass Gerente extends Funcionario { ... }\n```\n\nIsso significa: "Gerente **é um** Funcionario e herda todos os atributos e métodos".\n\nTerminologia:\n- **Superclasse** (classe pai) = Funcionario\n- **Subclasse** (classe filha) = Gerente\n\nO construtor da subclasse DEVE chamar **super(...)** na primeira linha para inicializar a parte herdada. Se o pai tem `Funcionario(String nome, String cpf, double salario)`, o filho deve fazer `super(nome, cpf, salario)` antes de inicializar seus próprios atributos.',
        code: `// ═══ CLASSE PAI (Superclasse) ═══
class Funcionario {
    protected String nome;
    protected String cpf;
    protected double salario;

    public Funcionario(String nome, String cpf, double salario) {
        this.nome = nome;
        this.cpf = cpf;
        this.salario = salario;
    }

    public void exibirInfo() {
        System.out.println(nome + " | CPF: " + cpf + " | R$" + salario);
    }

    public double calcularPagamento() {
        return salario;
    }
}

// ═══ CLASSE FILHA 1 ═══
class Gerente extends Funcionario {
    private String departamento;

    public Gerente(String nome, String cpf, double salario, String depto) {
        super(nome, cpf, salario);  // chama construtor do PAI
        this.departamento = depto;  // atributo próprio
    }

    // Método próprio (só gerente tem)
    public String getDepartamento() { return departamento; }
}

// ═══ CLASSE FILHA 2 ═══
class Estagiario extends Funcionario {
    private String faculdade;
    private int horasSemanais;

    public Estagiario(String nome, String cpf, double salario, String faculdade, int horas) {
        super(nome, cpf, salario);
        this.faculdade = faculdade;
        this.horasSemanais = horas;
    }

    public String getFaculdade() { return faculdade; }
}`,
        codeExplanation: '**Linha 3** (`protected`): Diferente de `private`, `protected` permite que as subclasses acessem o atributo. `private` bloquearia até as filhas.\n\n**Linha 23** (`extends Funcionario`): Gerente herda TUDO de Funcionario: nome, cpf, salario, exibirInfo(), calcularPagamento(). Não precisa reescrever nada!\n\n**Linha 27** (`super(nome, cpf, salario)`): Chama o construtor de Funcionario para inicializar os atributos herdados. DEVE ser a primeira linha.\n\n**Linha 28** (`this.departamento`): Depois de inicializar a parte herdada com super(), inicializa os atributos próprios.\n\n**Resultado**: Gerente e Estagiario têm nome, cpf, salario e exibirInfo() SEM duplicar código. Mudou exibirInfo()? Muda SÓ em Funcionario!',
        tip: 'protected = acessível dentro da classe E nas subclasses. Use para atributos que filhas precisam acessar. private = só a própria classe acessa.',
      },

      // ────────── SEÇÃO 3: Sobrescrevendo Métodos ──────────
      {
        title: 'Sobrescrevendo Métodos com @Override',
        body: 'A subclasse pode **sobrescrever** (override) um método do pai para mudar o comportamento. Por exemplo, o pagamento de um gerente inclui bônus, e o de um estagiário é proporcional às horas.\n\nUse **@Override** antes do método sobrescrito. Essa anotação:\n1. Deixa CLARO que estamos sobrescrevendo\n2. Faz o compilador VERIFICAR se o método existe no pai (pega erros de digitação)\n\nDentro do método sobrescrito, você pode chamar **super.metodo()** para executar a versão do pai E adicionar comportamento extra.',
        code: `class Gerente extends Funcionario {
    private String departamento;
    private double bonus;

    public Gerente(String nome, String cpf, double salario, String depto, double bonus) {
        super(nome, cpf, salario);
        this.departamento = depto;
        this.bonus = bonus;
    }

    // Sobrescreve calcularPagamento do pai
    @Override
    public double calcularPagamento() {
        return salario + bonus;  // salário + bônus
    }

    // Sobrescreve exibirInfo para incluir departamento
    @Override
    public void exibirInfo() {
        super.exibirInfo();  // chama a versão do PAI primeiro!
        System.out.println("  Depto: " + departamento + " | Bônus: R$" + bonus);
    }
}

class Estagiario extends Funcionario {
    private int horasSemanais;

    public Estagiario(String nome, String cpf, double salario, int horas) {
        super(nome, cpf, salario);
        this.horasSemanais = horas;
    }

    @Override
    public double calcularPagamento() {
        return (salario / 40.0) * horasSemanais;  // proporcional às horas
    }

    @Override
    public void exibirInfo() {
        super.exibirInfo();
        System.out.println("  Horas/semana: " + horasSemanais);
    }
}`,
        codeExplanation: '**Linha 12** (`@Override`): Anotação que indica sobrescrita. Se você escrever `calcularPagemento()` (erro de digitação), o compilador avisa que esse método não existe no pai.\n\n**Linhas 13-15** (`calcularPagamento` do Gerente): Retorna salario + bonus. Substitui completamente a versão do pai.\n\n**Linha 20** (`super.exibirInfo()`): Chama a versão do PAI primeiro (que mostra nome, cpf, salario), e depois adiciona informações extras. Isso evita duplicar a lógica do pai.\n\n**Linhas 34-36** (`calcularPagamento` do Estagiário): Calcula proporcional. Se trabalha 20h/semana com salário de R$2000 (base 40h), recebe R$1000.',
        tryItCode: `class Funcionario {
    protected String nome;
    protected double salario;

    public Funcionario(String nome, double salario) {
        this.nome = nome;
        this.salario = salario;
    }

    public double calcularPagamento() { return salario; }

    public void exibirInfo() {
        System.out.println(nome + " | R$" + String.format("%.2f", calcularPagamento()));
    }
}

class Gerente extends Funcionario {
    private double bonus;
    public Gerente(String nome, double salario, double bonus) {
        super(nome, salario);
        this.bonus = bonus;
    }
    @Override
    public double calcularPagamento() { return salario + bonus; }
}

class Estagiario extends Funcionario {
    private int horas;
    public Estagiario(String nome, double salario, int horas) {
        super(nome, salario);
        this.horas = horas;
    }
    @Override
    public double calcularPagamento() { return (salario / 40.0) * horas; }
}

public class Main {
    public static void main(String[] args) {
        Funcionario f = new Funcionario("Ana", 3000);
        Gerente g = new Gerente("Bruno", 5000, 2000);
        Estagiario e = new Estagiario("Carlos", 2000, 20);

        f.exibirInfo(); // R$3000
        g.exibirInfo(); // R$7000 (salário + bônus)
        e.exibirInfo(); // R$1000 (proporcional)
    }
}`,
        tryItPrompt: 'Altere os valores de bônus e horas. Crie uma classe Diretor que ganha salário + bônus + participação nos lucros!',
      },

      // ────────── SEÇÃO 4: Quando NÃO Usar Herança ──────────
      {
        title: 'Quando Usar e Quando NÃO Usar Herança',
        body: 'Herança é uma ferramenta poderosa mas perigosa quando usada errado. A regra é simples:\n\n**Use herança quando**: existe uma relação genuína "**é um**":\n- Cachorro **é um** Animal ✅\n- Gerente **é um** Funcionário ✅\n- Conta Corrente **é uma** Conta ✅\n\n**NÃO use herança quando**: a relação é "**tem um**":\n- Carro **tem um** Motor ❌ (Motor é um atributo de Carro, não uma superclasse)\n- Pessoa **tem um** Endereço ❌\n- Pedido **tem** Itens ❌\n\nPara "tem um", use **composição**: o objeto é um atributo da classe.\n\nPor que isso importa? Se Carro extends Motor, um Carro herdaria métodos como `injetarCombustivel()` e `girarPistoes()` — métodos que não fazem sentido para um Carro! Herança errada polui a interface da classe com métodos que não deveria ter.',
        code: `// ═══ HERANÇA ERRADA ═══
// Carro NÃO É UM Motor!
class Motor {
    void injetarCombustivel() { }
    void girarPistoes() { }
}
class Carro extends Motor { // ERRADO!
    // Agora Carro tem injetarCombustivel() e girarPistoes()!
    // Faz sentido carro.girarPistoes()? NÃO!
}

// ═══ COMPOSIÇÃO CORRETA ═══
// Carro TEM UM Motor!
class Carro {
    private Motor motor;  // composição: Motor é um atributo
    private String marca;

    public Carro(String marca, Motor motor) {
        this.marca = marca;
        this.motor = motor;
    }

    public void ligar() {
        motor.injetarCombustivel(); // delega ao Motor
        System.out.println(marca + " ligado!");
    }
}`,
        codeExplanation: '**Linhas 7-10** (Herança errada): Se Carro extends Motor, qualquer código poderia chamar `carro.girarPistoes()`. Isso não faz sentido semântico — Carro não é um Motor!\n\n**Linhas 14-26** (Composição correta): Carro TEM um Motor como atributo. O método `ligar()` internamente usa o motor (`motor.injetarCombustivel()`), mas de fora, o usuário só vê `carro.ligar()`. O Motor fica "escondido" dentro do Carro.\n\n**Teste rápido**: Se a frase "X é um Y" soa estranha, NÃO use herança. "Carro é um Motor" → estranho. "Gerente é um Funcionário" → faz sentido.',
        warning: 'Regra de ouro: "Prefira composição a herança". Herança cria acoplamento forte. Se o pai mudar, TODAS as filhas são afetadas. Composição é mais flexível.',
      },
    ],

    // ────────── Comparação ──────────
    withoutPoo: `// SEM herança: código duplicado em cada classe
class Funcionario {
    String nome; double salario;
    void exibirInfo() { System.out.println(nome + " R$" + salario); }
}
class Gerente {
    String nome; double salario; String depto;  // nome e salario DUPLICADOS!
    void exibirInfo() { System.out.println(nome + " R$" + salario); } // DUPLICADO!
}
class Estagiario {
    String nome; double salario; String faculdade;  // DUPLICADOS!
    void exibirInfo() { System.out.println(nome + " R$" + salario); } // DUPLICADO!
}
// Mudou exibirInfo()? Muda em 3 lugares!`,
    withPoo: `// COM herança: código comum centralizado
class Funcionario {
    protected String nome;
    protected double salario;
    public Funcionario(String nome, double sal) { this.nome = nome; this.salario = sal; }
    void exibirInfo() { System.out.println(nome + " R$" + salario); }
}
class Gerente extends Funcionario {
    String depto;
    public Gerente(String n, double s, String d) { super(n, s); depto = d; }
}
class Estagiario extends Funcionario {
    String faculdade;
    public Estagiario(String n, double s, String f) { super(n, s); faculdade = f; }
}
// Mudou exibirInfo()? Muda SÓ em Funcionario!`,
    comparisonExplanation: 'Sem herança, 3 classes repetem nome, salario e exibirInfo(). Com herança, o código comum fica no pai — cada filha adiciona apenas o que é seu.',

    // ────────── Exercícios ──────────
    codeFillExercises: [
      {
        instruction: 'Como declarar que Gerente herda de Funcionario em Java?',
        snippetBefore: 'class Gerente ',
        snippetAfter: ' Funcionario { ... }',
        options: ['extends', 'inherits', 'implements', 'from'],
        correctIndex: 0,
        explanation: '"extends" é a palavra-chave Java para herança. Gerente extends Funcionario = "Gerente é um Funcionario".',
      },
      {
        instruction: 'Como chamar o construtor da classe pai dentro da classe filha?',
        snippetBefore: 'public Gerente(String nome, double salario) {\n    ',
        snippetAfter: '(nome, salario); // inicializa parte herdada\n}',
        options: ['super', 'parent', 'base', 'this'],
        correctIndex: 0,
        explanation: 'super() chama o construtor da classe pai. Deve ser a PRIMEIRA linha do construtor da filha.',
      },
      {
        instruction: 'Qual modificador permite que subclasses acessem o atributo mas código externo não?',
        snippetBefore: '',
        snippetAfter: ' String nome; // acessível nas filhas, não fora',
        options: ['protected', 'private', 'public', 'static'],
        correctIndex: 0,
        explanation: 'protected permite acesso dentro da classe E nas subclasses. private bloqueia até as filhas. public permite acesso de qualquer lugar.',
      },
    ],
    summary: [
      'Herança: classe filha herda atributos e métodos da pai com extends',
      'Use quando existe relação "é um" genuína (Gerente é um Funcionário)',
      'super() chama o construtor da classe pai — deve ser a PRIMEIRA linha',
      'protected permite acesso nas subclasses (diferente de private)',
      '@Override sobrescreve método do pai — compilador verifica a assinatura',
      'super.metodo() chama a versão do PAI dentro de um método sobrescrito',
      'NÃO use herança para "tem um" — use composição (atributo)',
      'Prefira composição a herança: menos acoplamento, mais flexibilidade',
    ],
    tryItCode: `import java.util.ArrayList;

class Funcionario {
    protected String nome;
    protected double salario;
    public Funcionario(String nome, double salario) {
        this.nome = nome; this.salario = salario;
    }
    public double calcularPagamento() { return salario; }
    public void exibirInfo() {
        System.out.println(nome + " | Pagamento: R$"
            + String.format("%.2f", calcularPagamento()));
    }
}

class Gerente extends Funcionario {
    private double bonus;
    public Gerente(String nome, double salario, double bonus) {
        super(nome, salario); this.bonus = bonus;
    }
    @Override
    public double calcularPagamento() { return salario + bonus; }
}

class Estagiario extends Funcionario {
    private int horas;
    public Estagiario(String nome, double salario, int horas) {
        super(nome, salario); this.horas = horas;
    }
    @Override
    public double calcularPagamento() { return (salario / 40.0) * horas; }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Funcionario> equipe = new ArrayList<>();
        equipe.add(new Funcionario("Ana", 3000));
        equipe.add(new Gerente("Bruno", 5000, 2000));
        equipe.add(new Estagiario("Carlos", 2000, 20));

        double totalFolha = 0;
        for (Funcionario f : equipe) {
            f.exibirInfo();
            totalFolha += f.calcularPagamento();
        }
        System.out.println("\\nTotal folha: R$" + String.format("%.2f", totalFolha));
    }
}`,
    tryItPrompt: 'Adicione Diretor (salário + bônus + participação nos lucros) e veja a folha total atualizar. Note que a lista aceita QUALQUER Funcionario (polimorfismo)!',
    commonErrors: [
      {
        title: 'Esquecer super() no construtor da filha',
        description: 'Se o pai não tem construtor sem parâmetros, a filha DEVE chamar super(...) explicitamente.',
        code: `class Gerente extends Funcionario {
    // ERRADO: sem super!
    public Gerente(String nome) {
        this.nome = nome; // ERRO: Funcionario não tem construtor vazio!
    }
    // CORRETO:
    public Gerente(String nome, double salario) {
        super(nome, salario); // primeira linha!
    }
}`,
      },
      {
        title: 'Usar herança para "tem um"',
        description: 'Carro tem Motor → use composição (Motor como atributo), não extends Motor.',
        code: `// ERRADO: Carro extends Motor
// Carro herda girarPistoes()... não faz sentido!

// CORRETO: Carro tem Motor
class Carro {
    private Motor motor; // composição
}`,
      },
      {
        title: 'Esquecer @Override',
        description: 'Sem @Override, se errar o nome do método, cria um método novo em vez de sobrescrever.',
        code: `// SEM @Override: bug silencioso
public double calcularPagemento() { // erro de digitação!
    return salario + bonus; // método NOVO, não sobrescreve!
}
// COM @Override: compilador avisa
@Override
public double calcularPagemento() { // ERRO de compilação!
    // "method does not override a method from its superclass"
}`,
      },
    ],
  },

  'm3-polymorphism': {
    id: 'm3-polymorphism', moduleId: 3,
    objectives: [
      'Entender o conceito de polimorfismo ("muitas formas")',
      'Usar referência do tipo pai para apontar para objetos filhos',
      'Entender binding dinâmico (qual método é chamado em runtime)',
      'Usar polimorfismo em listas e loops para tratar objetos diferentes de forma uniforme',
      'Aplicar @Override para sobrescrever métodos do pai',
      'Criar métodos que aceitam o tipo pai como parâmetro',
    ],
    sections: [
      // ────────── SEÇÃO 1: O que é Polimorfismo ──────────
      {
        title: 'O que é Polimorfismo?',
        body: '**Polimorfismo** significa "muitas formas". Na prática, é quando a **mesma chamada de método** resulta em **comportamentos diferentes** dependendo do tipo real do objeto.\n\nImagine: você tem uma lista de funcionários (Gerente, Estagiário, Vendedor). Todos são "Funcionario", mas cada um calcula pagamento de um jeito diferente. Com polimorfismo, você faz:\n\n```\nfor (Funcionario f : lista) {\n    f.calcularPagamento(); // cada tipo calcula do seu jeito!\n}\n```\n\nO Java, em tempo de execução, olha o **tipo real do objeto** (não o tipo da variável) e chama a versão correta do método. Isso se chama **binding dinâmico**.',
        code: `class Animal {
    String nome;
    public Animal(String nome) { this.nome = nome; }

    public void emitirSom() {
        System.out.println(nome + ": ...");
    }
}

class Cachorro extends Animal {
    public Cachorro(String nome) { super(nome); }

    @Override
    public void emitirSom() {
        System.out.println(nome + ": Au au!");
    }
}

class Gato extends Animal {
    public Gato(String nome) { super(nome); }

    @Override
    public void emitirSom() {
        System.out.println(nome + ": Miau!");
    }
}

class Passaro extends Animal {
    public Passaro(String nome) { super(nome); }

    @Override
    public void emitirSom() {
        System.out.println(nome + ": Piu piu!");
    }
}

// ═══ POLIMORFISMO EM AÇÃO ═══
Animal a1 = new Cachorro("Rex");   // variável Animal, objeto Cachorro
Animal a2 = new Gato("Mimi");     // variável Animal, objeto Gato
Animal a3 = new Passaro("Tweety"); // variável Animal, objeto Passaro

a1.emitirSom(); // Rex: Au au!    (chama versão do Cachorro)
a2.emitirSom(); // Mimi: Miau!    (chama versão do Gato)
a3.emitirSom(); // Tweety: Piu piu! (chama versão do Passaro)`,
        codeExplanation: '**Linhas 38-40**: As variáveis são do tipo `Animal`, mas os objetos reais são Cachorro, Gato e Passaro. Isso é possível porque Cachorro/Gato/Passaro "é um" Animal.\n\n**Linhas 42-44**: Quando chamamos `emitirSom()`, o Java NÃO usa o método de Animal. Ele olha o **tipo real do objeto** na memória e chama a versão correspondente. `a1` é um Cachorro → chama `Cachorro.emitirSom()`.\n\n**@Override** (linhas 13, 22, 31): Cada subclasse redefine o método do pai. O `@Override` garante que a assinatura está correta.\n\n**Por que isso é útil?** Você trata TODOS como Animal, mas cada um se comporta à sua maneira. Não precisa de `if (tipo == "cachorro")` — o polimorfismo faz isso automaticamente!',
      },

      // ────────── SEÇÃO 2: Polimorfismo com Listas ──────────
      {
        title: 'Polimorfismo com Listas: O Poder Real',
        body: 'O verdadeiro poder do polimorfismo aparece com **listas**. Você cria uma `ArrayList<Funcionario>` e coloca Gerentes, Estagiários e Vendedores — todos em uma lista só!\n\nDepois, percorre a lista chamando `calcularPagamento()`. Cada objeto sabe como calcular o seu. Sem polimorfismo, você precisaria de `if/else` para cada tipo — código feio e difícil de manter.\n\nRegra: **sempre que puder, use o tipo mais genérico (pai) em parâmetros e listas**. Isso permite aceitar qualquer subtipo.',
        code: `import java.util.ArrayList;

class Funcionario {
    protected String nome;
    protected double salarioBase;
    public Funcionario(String nome, double salario) {
        this.nome = nome; this.salarioBase = salario;
    }
    public double calcularPagamento() { return salarioBase; }
    public String getTipo() { return "Funcionário"; }
    public void exibir() {
        System.out.println(getTipo() + ": " + nome + " | R$"
            + String.format("%.2f", calcularPagamento()));
    }
}

class Gerente extends Funcionario {
    private double bonus;
    public Gerente(String nome, double salario, double bonus) {
        super(nome, salario); this.bonus = bonus;
    }
    @Override public double calcularPagamento() { return salarioBase + bonus; }
    @Override public String getTipo() { return "Gerente"; }
}

class Vendedor extends Funcionario {
    private double comissao;
    private double totalVendas;
    public Vendedor(String nome, double salario, double comissao, double vendas) {
        super(nome, salario); this.comissao = comissao; this.totalVendas = vendas;
    }
    @Override public double calcularPagamento() {
        return salarioBase + (totalVendas * comissao);
    }
    @Override public String getTipo() { return "Vendedor"; }
}

class Estagiario extends Funcionario {
    private int horas;
    public Estagiario(String nome, double salario, int horas) {
        super(nome, salario); this.horas = horas;
    }
    @Override public double calcularPagamento() {
        return (salarioBase / 40.0) * horas;
    }
    @Override public String getTipo() { return "Estagiário"; }
}

// ═══ POLIMORFISMO COM LISTA ═══
public class Main {
    public static void main(String[] args) {
        ArrayList<Funcionario> equipe = new ArrayList<>();

        equipe.add(new Gerente("Ana", 8000, 3000));
        equipe.add(new Vendedor("Bruno", 2000, 0.05, 50000));
        equipe.add(new Estagiario("Carlos", 2000, 20));
        equipe.add(new Funcionario("Diana", 3500));

        double totalFolha = 0;
        for (Funcionario f : equipe) {
            f.exibir();  // cada um exibe do seu jeito
            totalFolha += f.calcularPagamento();
        }
        System.out.println("\\nTotal folha: R$" + String.format("%.2f", totalFolha));
    }
}`,
        codeExplanation: '**Linha 53** (`ArrayList<Funcionario>`): A lista aceita QUALQUER Funcionario — incluindo Gerente, Vendedor e Estagiario (porque todos "são" Funcionario).\n\n**Linhas 55-58**: Misturamos 4 tipos diferentes na mesma lista. Sem polimorfismo, precisaríamos de uma lista para cada tipo!\n\n**Linhas 61-64**: O for-each trata todos como `Funcionario`, mas cada um executa SUA versão de `calcularPagamento()` e `exibir()`:\n- Ana (Gerente): 8000 + 3000 = R$11000\n- Bruno (Vendedor): 2000 + (50000 * 0.05) = R$4500\n- Carlos (Estagiário): (2000/40) * 20 = R$1000\n- Diana (Funcionário): R$3500\n\nTudo isso sem NENHUM `if/else` para verificar o tipo!',
        tip: 'Use o tipo mais genérico (pai) em parâmetros de método e declarações de lista: `void processar(Funcionario f)` aceita QUALQUER subtipo.',
        tryItCode: `import java.util.ArrayList;

class Funcionario {
    protected String nome;
    protected double salarioBase;
    public Funcionario(String nome, double salario) {
        this.nome = nome; this.salarioBase = salario;
    }
    public double calcularPagamento() { return salarioBase; }
    public void exibir() {
        System.out.println(nome + ": R$" + String.format("%.2f", calcularPagamento()));
    }
}

class Gerente extends Funcionario {
    double bonus;
    public Gerente(String n, double s, double b) { super(n, s); bonus = b; }
    @Override public double calcularPagamento() { return salarioBase + bonus; }
}

class Vendedor extends Funcionario {
    double comissao, vendas;
    public Vendedor(String n, double s, double c, double v) {
        super(n, s); comissao = c; vendas = v;
    }
    @Override public double calcularPagamento() { return salarioBase + vendas * comissao; }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Funcionario> equipe = new ArrayList<>();
        equipe.add(new Gerente("Ana", 8000, 3000));
        equipe.add(new Vendedor("Bruno", 2000, 0.05, 50000));
        equipe.add(new Funcionario("Carlos", 3500));

        double total = 0;
        for (Funcionario f : equipe) {
            f.exibir();
            total += f.calcularPagamento();
        }
        System.out.println("\\nFolha total: R$" + String.format("%.2f", total));
    }
}`,
        tryItPrompt: 'Adicione mais tipos (Estagiário, Diretor). Altere valores e veja a folha mudar. O loop não precisa mudar!',
      },

      // ────────── SEÇÃO 3: Método que Aceita Tipo Pai ──────────
      {
        title: 'Métodos que Aceitam o Tipo Pai como Parâmetro',
        body: 'Outro uso poderoso do polimorfismo: criar métodos que recebem o **tipo pai** como parâmetro. Assim, o método funciona com QUALQUER subtipo, sem saber qual é.\n\nExemplo: um método `processarPagamento(Funcionario f)` funciona com Gerente, Vendedor, Estagiário — qualquer um que seja Funcionario.',
        code: `class FolhaPagamento {
    // Recebe QUALQUER Funcionario (polimorfismo)
    static void processarPagamento(Funcionario f) {
        double pagamento = f.calcularPagamento();
        System.out.println("Processando pagamento de " + f.nome
            + ": R$" + String.format("%.2f", pagamento));
    }

    // Recebe LISTA de qualquer Funcionario
    static double calcularFolhaTotal(ArrayList<Funcionario> equipe) {
        double total = 0;
        for (Funcionario f : equipe) {
            total += f.calcularPagamento();
        }
        return total;
    }
}

// Uso:
Gerente g = new Gerente("Ana", 8000, 3000);
Vendedor v = new Vendedor("Bruno", 2000, 0.05, 50000);

FolhaPagamento.processarPagamento(g); // funciona com Gerente!
FolhaPagamento.processarPagamento(v); // funciona com Vendedor!`,
        codeExplanation: '**Linha 3** (`Funcionario f`): O parâmetro aceita QUALQUER Funcionario. Quando recebe um Gerente, `f.calcularPagamento()` chama a versão do Gerente.\n\n**Linhas 22-23**: Passamos um Gerente e um Vendedor para o mesmo método. Ele não precisa saber qual tipo é — usa polimorfismo!\n\n**Vantagem**: Se amanhã criarmos `class Diretor extends Funcionario`, o método `processarPagamento` funciona automaticamente com Diretor, SEM alterar nada!',
        warning: 'Se precisar verificar o tipo específico, use `instanceof`: `if (f instanceof Gerente)`. Mas se está usando muito instanceof, provavelmente o polimorfismo não está sendo usado corretamente.',
      },
    ],

    // ────────── Exercícios ──────────
    codeFillExercises: [
      {
        instruction: 'Qual anotação indica que o método da subclasse sobrescreve o método do pai?',
        snippetBefore: '',
        snippetAfter: '\npublic void emitirSom() { System.out.println("Au au!"); }',
        options: ['@Override', '@Overrides', '@Override()', '@OverrideMethod'],
        correctIndex: 0,
        explanation: '@Override indica sobrescrita e faz o compilador verificar se o método existe no pai.',
      },
      {
        instruction: 'Se Animal a = new Cachorro(), qual versão de emitirSom() é chamada?',
        snippetBefore: 'Animal a = new Cachorro();\na.emitirSom(); // chama a versão do ',
        snippetAfter: '',
        options: ['Cachorro (tipo real)', 'Animal (tipo da variável)', 'Ambos', 'Nenhum'],
        correctIndex: 0,
        explanation: 'O Java usa binding dinâmico: olha o tipo REAL do objeto (Cachorro) e chama a versão correspondente, não a do tipo da variável (Animal).',
      },
    ],
    summary: [
      'Polimorfismo: mesma chamada de método, comportamentos diferentes conforme o tipo real',
      'Referência do tipo pai pode apontar para objeto do tipo filho: Animal a = new Cachorro()',
      'O Java decide qual método chamar em TEMPO DE EXECUÇÃO (binding dinâmico)',
      '@Override garante que você está realmente sobrescrevendo um método do pai',
      'Use listas do tipo pai para misturar subtipos: ArrayList<Funcionario>',
      'Métodos que aceitam o tipo pai funcionam com QUALQUER subtipo automaticamente',
      'Evite instanceof excessivo — polimorfismo bem usado elimina if/else por tipo',
    ],
    tryItCode: `import java.util.ArrayList;

class Forma {
    String tipo;
    public Forma(String tipo) { this.tipo = tipo; }
    public double calcularArea() { return 0; }
    public void exibir() {
        System.out.println(tipo + ": Área = " + String.format("%.2f", calcularArea()));
    }
}

class Circulo extends Forma {
    double raio;
    public Circulo(double raio) { super("Círculo"); this.raio = raio; }
    @Override public double calcularArea() { return Math.PI * raio * raio; }
}

class Retangulo extends Forma {
    double largura, altura;
    public Retangulo(double l, double a) { super("Retângulo"); largura = l; altura = a; }
    @Override public double calcularArea() { return largura * altura; }
}

class Triangulo extends Forma {
    double base, altura;
    public Triangulo(double b, double a) { super("Triângulo"); base = b; altura = a; }
    @Override public double calcularArea() { return (base * altura) / 2; }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Forma> formas = new ArrayList<>();
        formas.add(new Circulo(5));
        formas.add(new Retangulo(4, 6));
        formas.add(new Triangulo(3, 8));

        double areaTotal = 0;
        for (Forma f : formas) {
            f.exibir();
            areaTotal += f.calcularArea();
        }
        System.out.println("\\nÁrea total: " + String.format("%.2f", areaTotal));
    }
}`,
    tryItPrompt: 'Adicione Quadrado (lado * lado) e Losango (d1 * d2 / 2). A lista e o loop não precisam mudar!',
    commonErrors: [
      {
        title: 'Esquecer @Override e errar a assinatura',
        description: 'Sem @Override, se errar o nome do método (calcularárea em vez de calcularArea), cria um método NOVO e a versão do pai continua sendo chamada.',
        code: `// BUG: sem @Override, erro silencioso
public double calcularárea() { return l * a; } // novo método, não sobrescreve!

// CORRETO: com @Override, compilador avisa
@Override
public double calcularArea() { return l * a; }`,
      },
      {
        title: 'Tentar chamar método específico da filha com referência do pai',
        description: 'Se a variável é do tipo pai, só métodos do pai são visíveis. Para chamar métodos específicos da filha, precisa de cast.',
        code: `Animal a = new Cachorro("Rex");
a.emitirSom(); // OK (método de Animal)
// a.latir();   // ERRO! Animal não tem latir!
// Precisa de cast:
((Cachorro) a).latir(); // OK, mas cuidado!`,
      },
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
