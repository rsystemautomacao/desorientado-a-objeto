import { LessonContent } from './types';

export const cLessonContents: Record<string, LessonContent> = {

  'c-m1-intro': {
    id: 'c-m1-intro', moduleId: 1,
    objectives: [
      'Entender o que é a linguagem C e sua importância',
      'Conhecer a estrutura básica de um programa C',
      'Compilar e executar seu primeiro programa',
    ],
    sections: [
      {
        title: 'O que é C?',
        body: 'C é uma linguagem de programação de propósito geral criada por Dennis Ritchie nos anos 1970. É considerada a "mãe" de linguagens como Java, Python e C++. Até hoje é amplamente usada em sistemas operacionais, drivers, firmware e sistemas embarcados.\n\nC é uma linguagem compilada: o código-fonte é transformado em código de máquina antes de ser executado. Isso a torna muito rápida e eficiente.',
        tip: 'Todo o sistema operacional Linux é escrito em C. Aprender C te dá uma visão profunda de como os computadores realmente funcionam.',
      },
      {
        title: 'Estrutura de um Programa C',
        body: 'Todo programa C tem uma estrutura padrão. Veja o exemplo mais simples:',
        code: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
        codeExplanation: '#include <stdio.h> importa a biblioteca padrão de entrada/saída. int main() é a função principal — todo programa começa por aqui. printf() imprime texto. return 0 indica que o programa terminou com sucesso.',
        tryItCode: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    printf("Meu primeiro programa em C!\\n");\n    return 0;\n}',
        tryItPrompt: 'Execute o código e depois mude as mensagens.',
      },
      {
        title: 'Diretivas de Pré-processador',
        body: 'As linhas que começam com # são diretivas de pré-processador. Elas são processadas antes da compilação.',
        code: '#include <stdio.h>   // biblioteca de I/O padrão\n#include <stdlib.h>  // funções utilitárias (abs, rand...)\n#include <math.h>    // funções matemáticas (sqrt, pow...)\n#include <string.h>  // manipulação de strings\n\nint main() {\n    printf("Bibliotecas importadas!\\n");\n    return 0;\n}',
        tip: 'Sempre que precisar de uma função como printf, sqrt ou strlen, inclua a biblioteca correspondente com #include.',
      },
      {
        title: 'Comentários',
        body: 'C suporta dois tipos de comentários:',
        code: '// Comentário de uma linha\n\n/* Comentário\n   de múltiplas\n   linhas */\n\nint main() {\n    printf("Olá!\\n"); // imprime na tela\n    return 0;\n}',
        tip: 'Use comentários para explicar a lógica do código. O compilador ignora completamente os comentários.',
      },
    ],
    summary: [
      'C é compilada: o código vira executável antes de rodar',
      '#include importa bibliotecas externas',
      'int main() é o ponto de entrada de todo programa C',
      'printf() imprime texto — use \\n para quebrar linha',
      'return 0 no final do main indica sucesso',
    ],
  },

  'c-m1-variables': {
    id: 'c-m1-variables', moduleId: 1,
    objectives: [
      'Declarar variáveis nos tipos básicos de C',
      'Entender a diferença entre int, float, double e char',
      'Usar constantes com #define e const',
    ],
    sections: [
      {
        title: 'Declarando Variáveis',
        body: 'Em C, toda variável deve ser declarada com seu tipo antes de ser usada. O tipo define o tamanho em memória e os valores que a variável pode armazenar.',
        code: '#include <stdio.h>\n\nint main() {\n    int idade = 20;\n    float altura = 1.75;\n    double pi = 3.14159265;\n    char inicial = \'M\';\n\n    printf("Idade: %d\\n", idade);\n    printf("Altura: %.2f\\n", altura);\n    printf("Pi: %lf\\n", pi);\n    printf("Inicial: %c\\n", inicial);\n    return 0;\n}',
        codeExplanation: 'int armazena inteiros. float e double armazenam decimais (double tem mais precisão). char armazena um único caractere entre aspas simples.',
      },
      {
        title: 'Tipos Primitivos',
        body: 'Os tipos básicos de C e seus tamanhos típicos:',
        code: '#include <stdio.h>\n\nint main() {\n    // Inteiros\n    int x = 100;           // 4 bytes: -2bi a 2bi\n    short s = 32000;       // 2 bytes\n    long l = 1000000L;     // 4-8 bytes\n\n    // Decimais\n    float f = 3.14f;       // 4 bytes (~7 dígitos)\n    double d = 3.14159265; // 8 bytes (~15 dígitos)\n\n    // Caractere\n    char c = \'A\';          // 1 byte (0-255)\n\n    printf("int: %d, float: %.2f, char: %c\\n", x, f, c);\n    return 0;\n}',
        tip: 'Use double para cálculos científicos onde precisão importa. Use float quando memória for limitada (ex: microcontroladores).',
        tryItCode: '#include <stdio.h>\n\nint main() {\n    int ano = 2024;\n    float temperatura = 36.5;\n    char letra = \'C\';\n\n    printf("Ano: %d\\n", ano);\n    printf("Temperatura: %.1f graus\\n", temperatura);\n    printf("Letra: %c\\n", letra);\n    return 0;\n}',
        tryItPrompt: 'Altere os valores e adicione uma variável double.',
      },
      {
        title: 'Constantes',
        body: 'Constantes são valores que não mudam durante a execução. C oferece duas formas:',
        code: '#include <stdio.h>\n\n// Constante via #define (pré-processador)\n#define PI 3.14159\n#define MAX_ALUNOS 30\n\nint main() {\n    // Constante via const (tem tipo definido)\n    const double GRAVIDADE = 9.81;\n    const int ANO_ATUAL = 2024;\n\n    printf("PI = %.5f\\n", PI);\n    printf("Gravidade = %.2f m/s²\\n", GRAVIDADE);\n    printf("Max alunos: %d\\n", MAX_ALUNOS);\n    return 0;\n}',
        warning: 'Tentar atribuir um novo valor a uma const gera erro de compilação. Use MAIÚSCULAS por convenção para constantes.',
      },
    ],
    summary: [
      'Em C, toda variável precisa de tipo declarado: int, float, double, char',
      'int para inteiros, float/double para decimais, char para caracteres',
      '#define cria constantes no pré-processador (sem tipo)',
      'const declara variável que não pode ser alterada (com tipo)',
      'Tipos com signed/unsigned controlam o intervalo de valores',
    ],
  },

  'c-m1-operators': {
    id: 'c-m1-operators', moduleId: 1,
    objectives: [
      'Usar operadores aritméticos para cálculos',
      'Comparar valores com operadores relacionais',
      'Combinar condições com operadores lógicos',
    ],
    sections: [
      {
        title: 'Operadores Aritméticos',
        body: 'C suporta as operações matemáticas básicas, mais o operador módulo (resto da divisão):',
        code: '#include <stdio.h>\n\nint main() {\n    int a = 10, b = 3;\n\n    printf("a + b = %d\\n", a + b);  // 13\n    printf("a - b = %d\\n", a - b);  // 7\n    printf("a * b = %d\\n", a * b);  // 30\n    printf("a / b = %d\\n", a / b);  // 3  (divisão inteira!)\n    printf("a %% b = %d\\n", a % b);  // 1  (resto)\n\n    float resultado = (float)a / b;   // cast para divisão real\n    printf("10.0/3 = %.4f\\n", resultado); // 3.3333\n    return 0;\n}',
        codeExplanation: 'Divisão entre inteiros resulta em inteiro (truncado). Para obter decimal, converta um dos operandos com (float) antes da operação.',
        tip: 'O operador % (módulo) só funciona com inteiros. Para saber se um número é par: if (n % 2 == 0).',
      },
      {
        title: 'Operadores de Incremento e Atribuição',
        body: 'C oferece atalhos comuns para operações repetitivas:',
        code: '#include <stdio.h>\n\nint main() {\n    int n = 5;\n\n    n++;        // n = 6  (incremento)\n    n--;        // n = 5  (decremento)\n    n += 3;     // n = 8  (equivale a n = n + 3)\n    n -= 2;     // n = 6\n    n *= 2;     // n = 12\n    n /= 4;     // n = 3\n\n    printf("n = %d\\n", n); // 3\n    return 0;\n}',
        tryItCode: '#include <stdio.h>\n\nint main() {\n    int pontos = 0;\n\n    pontos += 10;  // acertou questao\n    pontos += 5;   // bonus\n    pontos -= 2;   // penalidade\n    pontos++;\n\n    printf("Pontuacao final: %d\\n", pontos);\n    return 0;\n}',
        tryItPrompt: 'Calcule a pontuação de um jogo adicionando e subtraindo pontos.',
      },
      {
        title: 'Operadores Relacionais',
        body: 'Comparam dois valores e retornam 1 (verdadeiro) ou 0 (falso):',
        code: '#include <stdio.h>\n\nint main() {\n    int x = 10, y = 20;\n\n    printf("%d == %d: %d\\n", x, y, x == y); // 0 (falso)\n    printf("%d != %d: %d\\n", x, y, x != y); // 1 (verdadeiro)\n    printf("%d <  %d: %d\\n", x, y, x < y);  // 1\n    printf("%d >  %d: %d\\n", x, y, x > y);  // 0\n    printf("%d <= %d: %d\\n", x, y, x <= y); // 1\n    printf("%d >= %d: %d\\n", x, y, x >= y); // 0\n    return 0;\n}',
        warning: 'Não confunda = (atribuição) com == (comparação de igualdade). if (x = 5) sempre será verdadeiro e atribui 5 a x!',
      },
      {
        title: 'Operadores Lógicos',
        body: 'Combinam condições booleanas:',
        code: '#include <stdio.h>\n\nint main() {\n    int idade = 20;\n    float nota = 7.5;\n\n    // && (E): ambas devem ser verdadeiras\n    if (idade >= 18 && nota >= 6.0) {\n        printf("Aprovado e maior de idade\\n");\n    }\n\n    // || (OU): pelo menos uma deve ser verdadeira\n    if (idade < 18 || nota < 6.0) {\n        printf("Reprovado ou menor de idade\\n");\n    }\n\n    // ! (NÃO): inverte\n    int aprovado = (nota >= 6.0);\n    if (!aprovado) {\n        printf("Nao aprovado\\n");\n    }\n    return 0;\n}',
      },
    ],
    summary: [
      'Divisão entre int/int trunca o resultado — use cast (float) para obter decimal',
      '% calcula o resto da divisão inteira',
      'n++, n--, n += x são atalhos de atribuição',
      '==, !=, <, >, <=, >= comparam valores (retornam 0 ou 1)',
      '&&, ||, ! combinam condições lógicas',
    ],
  },

  'c-m1-io': {
    id: 'c-m1-io', moduleId: 1,
    objectives: [
      'Usar printf() para exibir dados formatados',
      'Ler dados do usuário com scanf()',
      'Conhecer os principais especificadores de formato',
    ],
    sections: [
      {
        title: 'printf() — Saída Formatada',
        body: 'printf() permite exibir texto e valores de variáveis usando especificadores de formato. Cada tipo de dado tem seu especificador:',
        code: '#include <stdio.h>\n\nint main() {\n    int idade = 25;\n    float altura = 1.75f;\n    double saldo = 1234.567;\n    char letra = \'A\';\n    char nome[] = "Maria";\n\n    printf("Nome: %s\\n", nome);         // string\n    printf("Idade: %d anos\\n", idade);   // inteiro\n    printf("Altura: %.2f m\\n", altura);  // float (2 casas)\n    printf("Saldo: R$ %.2lf\\n", saldo);  // double\n    printf("Letra: %c\\n", letra);        // caractere\n    return 0;\n}',
        codeExplanation: '%d para int, %f para float, %lf para double, %c para char, %s para string. %.2f limita a 2 casas decimais.',
        tip: 'Outros escapes úteis: \\n (nova linha), \\t (tab), \\\\ (barra invertida), \\" (aspas).',
      },
      {
        title: 'scanf() — Entrada de Dados',
        body: 'scanf() lê dados digitados pelo usuário. Sempre use & antes do nome da variável (exceto para strings):',
        code: '#include <stdio.h>\n\nint main() {\n    int idade;\n    float altura;\n    char nome[50];\n\n    printf("Digite seu nome: ");\n    scanf("%s", nome);        // string: sem &\n\n    printf("Digite sua idade: ");\n    scanf("%d", &idade);      // int: com &\n\n    printf("Digite sua altura: ");\n    scanf("%f", &altura);     // float: com &\n\n    printf("\\nOla, %s!\\n", nome);\n    printf("Idade: %d | Altura: %.2f m\\n", idade, altura);\n    return 0;\n}',
        warning: 'Esquecer o & no scanf() causa comportamento indefinido (geralmente travamento). Strings (char[]) são exceção — não usam &.',
        tryItCode: '#include <stdio.h>\n\nint main() {\n    int a, b;\n\n    printf("Digite o primeiro numero: ");\n    scanf("%d", &a);\n\n    printf("Digite o segundo numero: ");\n    scanf("%d", &b);\n\n    printf("Soma: %d\\n", a + b);\n    printf("Produto: %d\\n", a * b);\n    return 0;\n}',
        tryItPrompt: 'Leia dois números e mostre soma, subtração, multiplicação e divisão.',
      },
      {
        title: 'Lendo Múltiplos Valores',
        body: 'scanf() pode ler múltiplos valores de uma vez:',
        code: '#include <stdio.h>\n\nint main() {\n    int dia, mes, ano;\n\n    printf("Digite a data (dd/mm/aaaa): ");\n    scanf("%d/%d/%d", &dia, &mes, &ano);\n\n    printf("Data: %02d/%02d/%d\\n", dia, mes, ano);\n    return 0;\n}',
        codeExplanation: '%02d exibe o inteiro com no mínimo 2 dígitos, preenchendo com zero à esquerda se necessário (ex: 5 vira 05).',
      },
    ],
    summary: [
      'printf() exibe saída formatada com especificadores: %d, %f, %lf, %c, %s',
      'scanf() lê entrada do usuário — sempre use & para tipos simples',
      '\\n quebra linha, \\t insere tabulação',
      '%.2f limita casas decimais, %02d preenche com zeros à esquerda',
      'Strings (char[]) em scanf não precisam de & — o array já é um ponteiro',
    ],
  },

  'c-m2-ifelse': {
    id: 'c-m2-ifelse', moduleId: 2,
    objectives: [
      'Tomar decisões com if e else',
      'Encadear condições com else if',
      'Usar o operador ternário',
    ],
    sections: [
      {
        title: 'if e else',
        body: 'A estrutura if executa um bloco de código apenas se a condição for verdadeira (diferente de zero em C). O else é executado quando a condição é falsa.',
        code: '#include <stdio.h>\n\nint main() {\n    int nota;\n    printf("Digite a nota (0-10): ");\n    scanf("%d", &nota);\n\n    if (nota >= 6) {\n        printf("Aprovado!\\n");\n    } else {\n        printf("Reprovado.\\n");\n    }\n    return 0;\n}',
        codeExplanation: 'Em C, qualquer valor diferente de 0 é considerado verdadeiro. 0 é falso. Os blocos {} delimitam o escopo de cada branch.',
        tryItCode: '#include <stdio.h>\n\nint main() {\n    int idade;\n    printf("Digite sua idade: ");\n    scanf("%d", &idade);\n\n    if (idade >= 18) {\n        printf("Maior de idade. Pode dirigir!\\n");\n    } else {\n        printf("Menor de idade. Nao pode dirigir.\\n");\n    }\n    return 0;\n}',
        tryItPrompt: 'Teste com valores diferentes: 17, 18, 25.',
      },
      {
        title: 'else if — Múltiplas Condições',
        body: 'Para verificar múltiplas condições em sequência, use else if:',
        code: '#include <stdio.h>\n\nint main() {\n    float nota;\n    printf("Digite sua nota: ");\n    scanf("%f", &nota);\n\n    if (nota >= 9.0) {\n        printf("Conceito A — Excelente!\\n");\n    } else if (nota >= 7.0) {\n        printf("Conceito B — Bom\\n");\n    } else if (nota >= 5.0) {\n        printf("Conceito C — Regular\\n");\n    } else {\n        printf("Conceito D — Reprovado\\n");\n    }\n    return 0;\n}',
        tip: 'As condições são testadas de cima para baixo. Assim que uma for verdadeira, as demais são ignoradas.',
      },
      {
        title: 'Operador Ternário',
        body: 'Para atribuições simples com base em condição, use o operador ternário ? :',
        code: '#include <stdio.h>\n\nint main() {\n    int a = 10, b = 20;\n\n    // Forma longa:\n    int maior;\n    if (a > b) {\n        maior = a;\n    } else {\n        maior = b;\n    }\n\n    // Forma com ternário:\n    int maiorT = (a > b) ? a : b;\n\n    printf("Maior: %d\\n", maiorT);\n    return 0;\n}',
        codeExplanation: 'condição ? valor_se_verdadeiro : valor_se_falso. Ideal para expressões simples. Evite para lógicas complexas.',
      },
    ],
    summary: [
      'if testa uma condição; else executa quando a condição é falsa',
      'else if encadeia múltiplas condições — testadas em ordem',
      'Em C, 0 = falso, qualquer outro valor = verdadeiro',
      'Operador ternário: cond ? a : b — substitui if/else simples',
      'Sempre use {} para delimitar blocos, mesmo que tenham 1 linha',
    ],
  },

  'c-m2-switch': {
    id: 'c-m2-switch', moduleId: 2,
    objectives: [
      'Usar switch/case para comparar valores inteiros ou caracteres',
      'Entender o papel do break',
      'Usar o caso default',
    ],
    sections: [
      {
        title: 'Estrutura switch/case',
        body: 'O switch é ideal quando você precisa comparar uma variável com vários valores fixos. É mais legível que uma cadeia de else if para esse caso.',
        code: '#include <stdio.h>\n\nint main() {\n    int dia;\n    printf("Digite o numero do dia (1-7): ");\n    scanf("%d", &dia);\n\n    switch (dia) {\n        case 1:\n            printf("Domingo\\n");\n            break;\n        case 2:\n            printf("Segunda-feira\\n");\n            break;\n        case 3:\n            printf("Terca-feira\\n");\n            break;\n        case 7:\n            printf("Sabado\\n");\n            break;\n        default:\n            printf("Dia invalido\\n");\n    }\n    return 0;\n}',
        codeExplanation: 'Cada case compara a variável com um valor. O break impede que os casos seguintes sejam executados. O default é executado se nenhum case for encontrado.',
        warning: 'Esquecer o break faz o código "cair" para o próximo case (fall-through). Isso pode ser um bug ou, em casos raros, um comportamento intencional.',
      },
      {
        title: 'Fall-through Intencional',
        body: 'Às vezes, queremos que múltiplos cases compartilhem o mesmo código. Omitimos o break intencionalmente:',
        code: '#include <stdio.h>\n\nint main() {\n    int mes;\n    printf("Digite o mes (1-12): ");\n    scanf("%d", &mes);\n\n    switch (mes) {\n        case 1:\n        case 3:\n        case 5:\n        case 7:\n        case 8:\n        case 10:\n        case 12:\n            printf("Mes com 31 dias\\n");\n            break;\n        case 4:\n        case 6:\n        case 9:\n        case 11:\n            printf("Mes com 30 dias\\n");\n            break;\n        case 2:\n            printf("Fevereiro: 28 ou 29 dias\\n");\n            break;\n        default:\n            printf("Mes invalido\\n");\n    }\n    return 0;\n}',
        tryItCode: '#include <stdio.h>\n\nint main() {\n    char operacao;\n    float a, b;\n\n    printf("Digite a operacao (+, -, *, /): ");\n    scanf(" %c", &operacao);\n\n    printf("Digite dois numeros: ");\n    scanf("%f %f", &a, &b);\n\n    switch (operacao) {\n        case \'+\':\n            printf("Resultado: %.2f\\n", a + b);\n            break;\n        case \'-\':\n            printf("Resultado: %.2f\\n", a - b);\n            break;\n        case \'*\':\n            printf("Resultado: %.2f\\n", a * b);\n            break;\n        case \'/\':\n            if (b != 0)\n                printf("Resultado: %.2f\\n", a / b);\n            else\n                printf("Erro: divisao por zero!\\n");\n            break;\n        default:\n            printf("Operacao invalida!\\n");\n    }\n    return 0;\n}',
        tryItPrompt: 'Execute uma calculadora simples com switch.',
      },
    ],
    summary: [
      'switch compara uma variável com valores constantes (int, char)',
      'break encerra o switch após executar um case',
      'Sem break, a execução "cai" para o próximo case (fall-through)',
      'default é executado quando nenhum case é encontrado (opcional)',
      'switch não suporta float ou strings — use if/else nesses casos',
    ],
  },

  'c-m2-loops': {
    id: 'c-m2-loops', moduleId: 2,
    objectives: [
      'Repetir ações com os laços for, while e do-while',
      'Usar break para sair de um laço e continue para pular uma iteração',
      'Identificar quando usar cada tipo de laço',
    ],
    sections: [
      {
        title: 'Laço for',
        body: 'O for é usado quando sabemos quantas vezes queremos repetir. Tem três partes: inicialização, condição e incremento.',
        code: '#include <stdio.h>\n\nint main() {\n    // for (inicio; condicao; incremento)\n    for (int i = 1; i <= 5; i++) {\n        printf("Iteracao %d\\n", i);\n    }\n\n    // Contagem regressiva\n    for (int n = 10; n >= 1; n--) {\n        printf("%d ", n);\n    }\n    printf("\\nFogo!\\n");\n    return 0;\n}',
        codeExplanation: 'O for executa: (1) inicialização uma vez, (2) verifica a condição — se verdadeira executa o bloco, (3) incremento, volta ao passo 2.',
        tryItCode: '#include <stdio.h>\n\nint main() {\n    int soma = 0;\n\n    for (int i = 1; i <= 10; i++) {\n        soma += i;\n        printf("i=%d, soma parcial=%d\\n", i, soma);\n    }\n\n    printf("\\nSoma de 1 a 10 = %d\\n", soma);\n    return 0;\n}',
        tryItPrompt: 'Calcule a soma de 1 a 100.',
      },
      {
        title: 'Laço while',
        body: 'O while é usado quando não sabemos quantas iterações serão necessárias — repetimos enquanto uma condição for verdadeira.',
        code: '#include <stdio.h>\n\nint main() {\n    int numero;\n    int tentativas = 0;\n    int segredo = 42;\n\n    printf("Adivinhe o numero secreto (1-100):\\n");\n\n    while (numero != segredo) {\n        printf("Sua tentativa: ");\n        scanf("%d", &numero);\n        tentativas++;\n\n        if (numero < segredo)\n            printf("Maior!\\n");\n        else if (numero > segredo)\n            printf("Menor!\\n");\n    }\n\n    printf("Correto! Voce acertou em %d tentativas!\\n", tentativas);\n    return 0;\n}',
        tip: 'Cuidado com loops infinitos! Certifique-se de que a condição do while eventualmente se tornará falsa.',
      },
      {
        title: 'Laço do-while',
        body: 'O do-while é igual ao while, mas garante que o bloco execute pelo menos uma vez (a condição é testada depois):',
        code: '#include <stdio.h>\n\nint main() {\n    int opcao;\n\n    do {\n        printf("\\n=== MENU ===\\n");\n        printf("1 - Jogar\\n");\n        printf("2 - Configuracoes\\n");\n        printf("0 - Sair\\n");\n        printf("Escolha: ");\n        scanf("%d", &opcao);\n\n        switch (opcao) {\n            case 1: printf("Iniciando jogo...\\n"); break;\n            case 2: printf("Abrindo configuracoes...\\n"); break;\n            case 0: printf("Ate logo!\\n"); break;\n            default: printf("Opcao invalida!\\n");\n        }\n    } while (opcao != 0);\n\n    return 0;\n}',
        codeExplanation: 'O menu é exibido pelo menos uma vez. Continua até o usuário digitar 0.',
      },
      {
        title: 'break e continue',
        body: 'break encerra o laço imediatamente. continue pula para a próxima iteração.',
        code: '#include <stdio.h>\n\nint main() {\n    // break: sai do loop ao encontrar numero negativo\n    for (int i = 0; i < 10; i++) {\n        if (i == 5) break;\n        printf("%d ", i);\n    }\n    printf("\\n"); // 0 1 2 3 4\n\n    // continue: pula numeros pares\n    for (int i = 0; i < 10; i++) {\n        if (i % 2 == 0) continue;\n        printf("%d ", i);\n    }\n    printf("\\n"); // 1 3 5 7 9\n    return 0;\n}',
      },
    ],
    summary: [
      'for: ideal quando o número de iterações é conhecido',
      'while: repete enquanto condição for verdadeira (pode não executar nenhuma vez)',
      'do-while: executa pelo menos uma vez, testa no final',
      'break encerra o laço imediatamente',
      'continue pula o restante do bloco e vai para a próxima iteração',
    ],
  },

  'c-m3-functions': {
    id: 'c-m3-functions', moduleId: 3,
    objectives: [
      'Declarar e chamar funções em C',
      'Trabalhar com parâmetros e valor de retorno',
      'Entender protótipos de função',
    ],
    sections: [
      {
        title: 'O que são Funções?',
        body: 'Funções são blocos de código reutilizáveis. Em vez de repetir código, você o escreve uma vez em uma função e a chama quando precisar. Isso torna o código mais organizado e fácil de manter.',
        code: '#include <stdio.h>\n\n// Declaração da função\nvoid saudacao(char nome[]) {\n    printf("Ola, %s! Bem-vindo ao C!\\n", nome);\n}\n\nint main() {\n    saudacao("Maria");   // chamada\n    saudacao("Pedro");   // reutilizacao\n    saudacao("Ana");\n    return 0;\n}',
        codeExplanation: 'void indica que a função não retorna valor. char nome[] é o parâmetro que recebe uma string. A função é definida ANTES do main para que o compilador a conheça.',
      },
      {
        title: 'Parâmetros e Retorno',
        body: 'Funções podem receber valores (parâmetros) e retornar um resultado:',
        code: '#include <stdio.h>\n\n// Função que recebe dois inteiros e retorna a soma\nint somar(int a, int b) {\n    return a + b;\n}\n\n// Função que calcula a média de tres valores\nfloat media(float n1, float n2, float n3) {\n    return (n1 + n2 + n3) / 3.0;\n}\n\nint main() {\n    int resultado = somar(5, 3);\n    printf("Soma: %d\\n", resultado);      // 8\n\n    float m = media(7.0, 8.5, 6.0);\n    printf("Media: %.2f\\n", m);           // 7.17\n    return 0;\n}',
        tryItCode: '#include <stdio.h>\n\nint fatorial(int n) {\n    if (n <= 1) return 1;\n    return n * fatorial(n - 1); // recursao!\n}\n\nint ehPar(int n) {\n    return (n % 2 == 0); // retorna 1 ou 0\n}\n\nint main() {\n    for (int i = 1; i <= 10; i++) {\n        printf("%d! = %d\\n", i, fatorial(i));\n    }\n\n    for (int i = 1; i <= 10; i++) {\n        if (ehPar(i)) printf("%d e par\\n", i);\n    }\n    return 0;\n}',
        tryItPrompt: 'Crie uma função que calcula a potência (base^expoente).',
      },
      {
        title: 'Protótipos de Função',
        body: 'Quando a função é usada antes de ser definida, precisamos declarar seu protótipo no início do arquivo:',
        code: '#include <stdio.h>\n\n// Protótipos (declarações antecipadas)\nint maximo(int a, int b);\nvoid imprimirLinha(int tamanho);\n\nint main() {\n    int m = maximo(15, 27);\n    printf("Maximo: %d\\n", m);\n    imprimirLinha(20);\n    return 0;\n}\n\n// Definicoes aparecem depois do main\nint maximo(int a, int b) {\n    return (a > b) ? a : b;\n}\n\nvoid imprimirLinha(int tamanho) {\n    for (int i = 0; i < tamanho; i++) printf("-");\n    printf("\\n");\n}',
        tip: 'Em projetos maiores, os protótipos ficam em arquivos .h (header). Isso é a base da modularização em C.',
      },
    ],
    summary: [
      'Funções modularizam o código — escreva uma vez, use várias vezes',
      'void indica que a função não retorna nada',
      'Os parâmetros definem os dados que a função recebe',
      'return encerra a função e retorna um valor',
      'Protótipos permitem usar funções antes de defini-las',
    ],
  },

  'c-m3-arrays': {
    id: 'c-m3-arrays', moduleId: 3,
    objectives: [
      'Declarar e acessar elementos de um array',
      'Percorrer arrays com laços',
      'Trabalhar com strings como arrays de char',
    ],
    sections: [
      {
        title: 'Arrays Unidimensionais',
        body: 'Um array armazena múltiplos valores do mesmo tipo em posições contíguas na memória. Os índices começam em 0.',
        code: '#include <stdio.h>\n\nint main() {\n    // Declaração com tamanho fixo\n    int notas[5] = {7, 8, 6, 9, 5};\n\n    // Acessando elementos\n    printf("Primeira nota: %d\\n", notas[0]); // 7\n    printf("Ultima nota:   %d\\n", notas[4]); // 5\n\n    // Percorrendo com for\n    int soma = 0;\n    for (int i = 0; i < 5; i++) {\n        soma += notas[i];\n    }\n    printf("Media: %.1f\\n", (float)soma / 5);\n    return 0;\n}',
        codeExplanation: 'notas[0] acessa o primeiro elemento. O índice vai de 0 a n-1 (para n elementos). Acessar fora dos limites causa comportamento indefinido!',
        warning: 'C não verifica limites de array automaticamente. notas[10] em um array de tamanho 5 não gera erro de compilação mas corrompe a memória.',
        tryItCode: '#include <stdio.h>\n\nint main() {\n    float temperaturas[7] = {28.5, 30.1, 27.3, 29.8, 31.0, 26.5, 28.9};\n    float soma = 0, maxTemp = temperaturas[0];\n\n    for (int i = 0; i < 7; i++) {\n        soma += temperaturas[i];\n        if (temperaturas[i] > maxTemp)\n            maxTemp = temperaturas[i];\n    }\n\n    printf("Media semanal: %.1f°C\\n", soma / 7);\n    printf("Temperatura maxima: %.1f°C\\n", maxTemp);\n    return 0;\n}',
        tryItPrompt: 'Encontre também a temperatura mínima.',
      },
      {
        title: 'Strings — Arrays de char',
        body: 'Em C, strings são arrays de char terminados pelo caractere nulo \'\\0\'. A biblioteca string.h oferece funções para manipulá-las.',
        code: '#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char nome[50] = "DESorientado";\n\n    printf("Nome: %s\\n", nome);\n    printf("Tamanho: %lu\\n", strlen(nome));  // 12\n\n    // Comparar strings\n    if (strcmp(nome, "DESorientado") == 0) {\n        printf("Strings iguais!\\n");\n    }\n\n    // Copiar string\n    char copia[50];\n    strcpy(copia, nome);\n    printf("Copia: %s\\n", copia);\n    return 0;\n}',
        codeExplanation: 'strlen() retorna o comprimento. strcmp() compara (retorna 0 se iguais). strcpy() copia. Nunca compare strings com == em C!',
      },
      {
        title: 'Matrizes (Arrays Bidimensionais)',
        body: 'Matrizes são arrays de arrays — como tabelas com linhas e colunas:',
        code: '#include <stdio.h>\n\nint main() {\n    // Matriz 3x3\n    int matriz[3][3] = {\n        {1, 2, 3},\n        {4, 5, 6},\n        {7, 8, 9}\n    };\n\n    // Exibir a matriz\n    for (int i = 0; i < 3; i++) {\n        for (int j = 0; j < 3; j++) {\n            printf("%3d", matriz[i][j]);\n        }\n        printf("\\n");\n    }\n    return 0;\n}',
        tip: 'matriz[linha][coluna] acessa um elemento. Use dois for aninhados para percorrer todos os elementos.',
      },
    ],
    summary: [
      'Arrays armazenam múltiplos valores do mesmo tipo; índices começam em 0',
      'Acesse com array[i] — cuidado com índices fora dos limites!',
      'Strings em C são char[] terminados com \'\\0\'',
      'Use strlen, strcmp, strcpy da <string.h> para manipular strings',
      'Matrizes são arrays multidimensionais: matriz[linha][coluna]',
    ],
  },

  'c-m3-pointers': {
    id: 'c-m3-pointers', moduleId: 3,
    objectives: [
      'Entender o que são ponteiros e para que servem',
      'Usar os operadores & (endereço) e * (derreferência)',
      'Passar variáveis por referência para funções',
    ],
    sections: [
      {
        title: 'O que é um Ponteiro?',
        body: 'Um ponteiro é uma variável que armazena o endereço de memória de outra variável. É um dos conceitos mais poderosos (e temidos!) de C.',
        code: '#include <stdio.h>\n\nint main() {\n    int numero = 42;\n    int *ptr = &numero;  // ptr aponta para numero\n\n    printf("Valor de numero:  %d\\n", numero);\n    printf("Endereco de numero: %p\\n", (void*)&numero);\n    printf("ptr guarda o endereco: %p\\n", (void*)ptr);\n    printf("*ptr acessa o valor: %d\\n", *ptr);\n\n    // Modificar o valor via ponteiro\n    *ptr = 100;\n    printf("numero agora vale: %d\\n", numero); // 100\n    return 0;\n}',
        codeExplanation: '& (address-of) obtém o endereço de uma variável. * (dereference) acessa o valor apontado. int *ptr declara um ponteiro para int.',
        tip: 'Pense num ponteiro como um endereço de casa: o endereço te diz onde a casa está, mas não é a casa em si. * vai até a casa e abre a porta.',
      },
      {
        title: 'Passagem por Referência',
        body: 'Em C, as funções recebem cópias dos argumentos (passagem por valor). Para modificar a variável original, passamos seu endereço:',
        code: '#include <stdio.h>\n\n// Troca por valor — NÃO funciona\nvoid trocaErrada(int a, int b) {\n    int temp = a;\n    a = b;\n    b = temp;\n    // a e b são cópias locais — original não muda\n}\n\n// Troca por referência — funciona!\nvoid trocar(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n\nint main() {\n    int x = 10, y = 20;\n    printf("Antes: x=%d, y=%d\\n", x, y);\n\n    trocar(&x, &y);  // passa endereços\n    printf("Depois: x=%d, y=%d\\n", x, y); // x=20, y=10\n    return 0;\n}',
        tryItCode: '#include <stdio.h>\n\nvoid incrementar(int *n) {\n    (*n)++;\n}\n\nvoid calcularCirculo(float raio, float *area, float *perimetro) {\n    *area = 3.14159 * raio * raio;\n    *perimetro = 2 * 3.14159 * raio;\n}\n\nint main() {\n    int contador = 0;\n    incrementar(&contador);\n    incrementar(&contador);\n    incrementar(&contador);\n    printf("Contador: %d\\n", contador);  // 3\n\n    float area, perim;\n    calcularCirculo(5.0, &area, &perim);\n    printf("Area: %.2f\\n", area);\n    printf("Perimetro: %.2f\\n", perim);\n    return 0;\n}',
        tryItPrompt: 'Crie uma função que retorna o mínimo e o máximo de um array via ponteiros.',
      },
      {
        title: 'Ponteiros e Arrays',
        body: 'O nome de um array em C é um ponteiro para seu primeiro elemento. Por isso arrays e ponteiros estão intimamente ligados:',
        code: '#include <stdio.h>\n\nvoid imprimirArray(int *arr, int tamanho) {\n    for (int i = 0; i < tamanho; i++) {\n        printf("%d ", arr[i]);  // arr[i] == *(arr + i)\n    }\n    printf("\\n");\n}\n\nint main() {\n    int numeros[] = {10, 20, 30, 40, 50};\n    int tam = 5;\n\n    printf("Via array:   ");\n    for (int i = 0; i < tam; i++)\n        printf("%d ", numeros[i]);\n    printf("\\n");\n\n    printf("Via ponteiro: ");\n    int *p = numeros;  // aponta para o inicio\n    for (int i = 0; i < tam; i++)\n        printf("%d ", *(p + i));  // aritmética de ponteiros\n    printf("\\n");\n\n    imprimirArray(numeros, tam);\n    return 0;\n}',
        warning: 'Ponteiros são poderosos mas perigosos. Um ponteiro não inicializado aponta para endereço desconhecido — sempre inicialize com NULL ou com um endereço válido.',
      },
    ],
    summary: [
      '& obtém o endereço de memória de uma variável',
      '* declara ponteiro e também derreferencia (acessa o valor)',
      'Passagem por referência permite que funções modifiquem variáveis externas',
      'O nome de um array é um ponteiro para seu primeiro elemento',
      'Sempre inicialize ponteiros — ponteiros "soltos" causam crashes',
    ],
  },
};
