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
        codeExplanation: '#include <stdio.h> importa a biblioteca padrão de entrada/saída. int main() é a função principal — todo programa começa por aqui. printf() imprime texto na tela. return 0 indica que o programa terminou com sucesso. Toda instrução em C termina com ponto e vírgula (;) — esquecer o ; é um dos erros mais comuns em C!',
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
      'Toda instrução termina com ponto e vírgula (;)',
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
      {
        title: 'Tipo bool com <stdbool.h>',
        body: 'Em C padrão (sem bibliotecas extras), não existe tipo booleano nativo — usa-se 0 para falso e qualquer outro valor para verdadeiro. A partir do C99, a biblioteca <stdbool.h> introduz o tipo bool e as constantes true e false, tornando o código mais legível:',
        code: '#include <stdio.h>\n#include <stdbool.h>\n\nint main() {\n    bool aprovado = true;\n    bool reprovado = false;\n\n    if (aprovado) {\n        printf("Aprovado!\\n");\n    }\n\n    float nota = 8.5;\n    bool passou = (nota >= 6.0);  // retorna true (1) ou false (0)\n\n    printf("Passou: %d\\n", passou); // 1\n    printf("Reprovado: %d\\n", reprovado); // 0\n\n    return 0;\n}',
        codeExplanation: 'bool, true e false são definidos em <stdbool.h>. true equivale a 1, false equivale a 0. O comportamento é o mesmo que usar 1 e 0 — a diferença é apenas na legibilidade do código.',
        tip: 'Em C moderno (C99+), prefira bool com <stdbool.h> para variáveis que representam verdadeiro/falso. O código fica mais expressivo e fácil de entender.',
      },
    ],
    summary: [
      'if testa uma condição; else executa quando a condição é falsa',
      'else if encadeia múltiplas condições — testadas em ordem',
      'Em C, 0 = falso, qualquer outro valor = verdadeiro',
      'Operador ternário: cond ? a : b — substitui if/else simples',
      'Sempre use {} para delimitar blocos, mesmo que tenham 1 linha',
      '<stdbool.h> define bool, true e false para booleanos explícitos (C99+)',
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

  // ─────────────────────────────────────────────────────────────────────────
  // MÓDULO 0 — Fluxogramas e Pensamento Algorítmico
  // ─────────────────────────────────────────────────────────────────────────

  'c-m0-algo': {
    id: 'c-m0-algo', moduleId: 0,
    objectives: [
      'Entender o conceito de algoritmo',
      'Reconhecer algoritmos no cotidiano',
      'Distinguir as características de um bom algoritmo',
      'Compreender por que pensar antes de codificar economiza tempo',
    ],
    sections: [
      {
        title: 'O que é um Algoritmo?',
        body: `Um algoritmo é uma sequência finita e ordenada de passos que resolve um problema ou realiza uma tarefa.

A palavra vem do nome do matemático persa Al-Khwarizmi (século IX), autor de um tratado sobre cálculo que influenciou toda a matemática ocidental.

O conceito parece sofisticado, mas você usa algoritmos o tempo todo no dia a dia, sem perceber.`,
        tip: 'Algoritmo ≠ código. Um algoritmo é a ideia da solução. O código é apenas uma das formas de expressá-la — em qualquer linguagem.',
      },
      {
        title: 'Algoritmos no Cotidiano',
        body: `Exemplos de algoritmos que você já conhece:

► Receita de bolo
   1. Pré-aqueça o forno a 180°C
   2. Misture os ingredientes secos
   3. Acrescente os ovos e o leite
   4. Bata por 5 minutos
   5. Despeje na forma e leve ao forno por 40 min

► Trocar um pneu furado
► Resolver uma equação de segundo grau
► Buscar um contato na agenda telefônica

Todos têm em comum: passos bem definidos, ordem importa, têm começo e fim.`,
        code: `ALGORITMO: Verificar se número é par ou ímpar

INÍCIO
   1. Receber um número inteiro N
   2. Calcular o resto de N dividido por 2
   3. SE o resto for igual a 0:
         Exibir "Par"
      SENÃO:
         Exibir "Ímpar"
   4. Encerrar
FIM`,
        codeExplanation: 'Este é um algoritmo escrito em pseudocódigo — linguagem intermediária entre português e código. Antes de escrever C, muitos programadores escrevem o pseudocódigo para organizar o raciocínio.',
      },
      {
        title: 'Características de um Bom Algoritmo',
        body: `Para ser válido, um algoritmo precisa ter:

✔  FINITUDE — deve terminar após um número finito de passos.
   (Um loop infinito não é um algoritmo correto!)

✔  DEFINIÇÃO — cada passo deve ser preciso e sem ambiguidade.
   ("Adicione um pouco de sal" é ambíguo. "Adicione 5g de sal" não é.)

✔  ENTRADAS — zero ou mais dados de entrada bem definidos.

✔  SAÍDAS — pelo menos uma saída (o resultado do processamento).

✔  EFETIVIDADE — cada passo deve ser executável na prática.`,
        warning: 'Um algoritmo que nunca termina (loop infinito não controlado) não é considerado correto — mesmo que pareça produzir resultados durante a execução.',
      },
      {
        title: 'Por que Pensar Antes de Codificar?',
        body: `Programadores iniciantes costumam abrir o editor e começar a digitar código imediatamente. Resultado: código desorganizado, cheio de bugs e difícil de consertar.

Programadores experientes seguem o ciclo:

   PROBLEMA → ALGORITMO → CÓDIGO → TESTE

Investir 10 minutos desenhando o algoritmo (no papel, em pseudocódigo ou em fluxograma) pode economizar 2 horas de depuração depois.

Nas próximas aulas você aprenderá a usar FLUXOGRAMAS — a ferramenta visual para representar algoritmos — e depois traduzirá cada símbolo para código C real.`,
        tip: 'Regra prática: se você não consegue explicar o algoritmo para alguém sem usar computador, você ainda não entende o problema completamente.',
      },
    ],
    summary: [
      'Algoritmo é uma sequência finita, ordenada e precisa de passos para resolver um problema',
      'Algoritmos existem no cotidiano: receitas, instruções, procedimentos',
      'Um bom algoritmo é finito, definido, tem entradas e saídas, e é efetivo',
      'Pensar no algoritmo antes de codificar evita bugs e retrabalho',
      'Pseudocódigo e fluxogramas são formas de representar algoritmos antes do código',
    ],
  },

  'c-m0-symbols': {
    id: 'c-m0-symbols', moduleId: 0,
    objectives: [
      'Conhecer os 6 símbolos principais de fluxogramas',
      'Identificar cada símbolo pelo seu formato visual',
      'Entender quando usar cada símbolo',
      'Ler um fluxograma simples com os símbolos corretos',
    ],
    sections: [
      {
        title: 'Por que Usar Símbolos Padronizados?',
        body: `Fluxogramas seguem um padrão internacional (norma ISO 5807) para que qualquer pessoa do mundo, independente da linguagem de programação que usa, consiga ler e entender o diagrama.

Cada forma geométrica tem um significado específico. Usar os símbolos errados é como usar sinais de trânsito no lugar errado — causa confusão.

Veja os 6 símbolos que você usará durante todo o curso de C:`,
      },
      {
        title: 'Símbolo 1 — Início / Fim (Oval ou Cápsula)',
        body: `FORMA: Oval ou cápsula arredondada
USO: Marca onde o algoritmo começa e onde termina.
REGRA: Todo fluxograma deve ter exatamente um INÍCIO e pelo menos um FIM.`,
        flowchart: `{"nodes":[{"id":"a","type":"start","label":"INÍCIO"},{"id":"b","type":"end","label":"FIM"}],"edges":[{"from":"a","to":"b"}]}`,
        codeExplanation: 'O símbolo oval/cápsula representa Início e Fim. Use verde para INÍCIO e vermelho para FIM por convenção visual.',
        tip: 'Nunca use retângulos para início/fim — retângulos têm outro significado (processamento).',
      },
      {
        title: 'Símbolo 2 — Processamento (Retângulo)',
        body: `FORMA: Retângulo simples
USO: Representa qualquer operação de cálculo ou atribuição de valor.
EXEMPLOS: calcular soma, incrementar contador, atribuir resultado.`,
        flowchart: `{"nodes":[{"id":"a","type":"process","label":"soma ← a + b"},{"id":"b","type":"process","label":"contador ← contador + 1"},{"id":"c","type":"process","label":"media ← soma / n"}],"edges":[{"from":"a","to":"b"},{"from":"b","to":"c"}]}`,
        codeExplanation: 'Em C, retângulos viram atribuições: soma = a + b; ou contador++;',
      },
      {
        title: 'Símbolo 3 — Entrada e Saída de Dados (Paralelogramo)',
        body: `FORMA: Paralelogramo (retângulo inclinado)
USO:
  • ENTRADA — ler dados do usuário (teclado, arquivo, sensor)
  • SAÍDA — exibir dados ao usuário (tela, impressora, arquivo)`,
        flowchart: `{"nodes":[{"id":"a","type":"input","label":"Ler: nota do aluno"},{"id":"b","type":"output","label":"Exibir: Aprovado!"}],"edges":[{"from":"a","to":"b"}]}`,
        codeExplanation: 'Em C: entrada → scanf("%f", &nota);  |  saída → printf("Aprovado!");',
        tip: 'O paralelogramo é sempre comunicação com o mundo externo — seja lendo ou escrevendo.',
      },
      {
        title: 'Símbolo 4 — Decisão (Losango / Diamante)',
        body: `FORMA: Losango (diamante)
USO: Representa uma condição cuja resposta é SIM ou NÃO.
REGRA: Do losango saem DUAS setas — uma para "Sim" e outra para "Não".`,
        flowchart: `{"nodes":[{"id":"c","type":"decision","label":"nota >= 7?"},{"id":"d","type":"output","label":"Exibir: Aprovado"},{"id":"e","type":"output","label":"Exibir: Reprovado"}],"edges":[{"from":"c","to":"d","label":"Sim"},{"from":"c","to":"e","label":"Não"}]}`,
        codeExplanation: 'Em C: if (nota >= 7) { printf("Aprovado"); } else { printf("Reprovado"); }',
        warning: 'O losango deve ter EXATAMENTE duas saídas: Sim e Não. Para mais condições, encadeie vários losangos.',
      },
      {
        title: 'Símbolo 5 — Seta de Fluxo (Conector Direcional)',
        body: `FORMA: Seta direcional (→)
USO: Indica a direção do fluxo de execução — de onde vem e para onde vai.
REGRAS:
  • Setas geralmente fluem de cima para baixo
  • Em loops, uma seta pode voltar para cima (para repetir)`,
        flowchart: `{"nodes":[{"id":"a","type":"start","label":"INÍCIO"},{"id":"b","type":"input","label":"Ler valor"},{"id":"c","type":"process","label":"total = total + valor"},{"id":"d","type":"end","label":"FIM"}],"edges":[{"from":"a","to":"b"},{"from":"b","to":"c"},{"from":"c","to":"d"}]}`,
        tip: 'Setas que voltam para um ponto anterior indicam REPETIÇÃO (loops: for, while, do-while).',
      },
      {
        title: 'Símbolo 6 — Interligação de Páginas (Círculo)',
        body: `FORMA: Círculo pequeno com uma letra ou número dentro
USO: Conecta partes do fluxograma em páginas diferentes ou em regiões distantes.
Quando o fluxograma é muito grande para caber em uma página, use círculos com a mesma letra nos dois pontos.`,
        flowchart: `{"nodes":[{"id":"a","type":"start","label":"INÍCIO"},{"id":"b","type":"input","label":"Ler dados"},{"id":"c","type":"connector","label":"A"},{"id":"d","type":"process","label":"Processar"},{"id":"e","type":"end","label":"FIM"}],"edges":[{"from":"a","to":"b"},{"from":"b","to":"c"},{"from":"c","to":"d"},{"from":"d","to":"e"}]}`,
        tip: 'Em fluxogramas pequenos, raramente precisamos do conector de página. Mas é importante conhecê-lo para leitura de diagramas profissionais.',
      },
      {
        title: 'Todos os Símbolos em um Fluxograma Completo',
        body: `Veja um fluxograma usando todos os símbolos juntos — ler uma nota, verificar aprovação e exibir o resultado:`,
        flowchart: `{"nodes":[{"id":"a","type":"start","label":"INÍCIO"},{"id":"b","type":"input","label":"Ler: nota"},{"id":"c","type":"decision","label":"nota >= 7?"},{"id":"d","type":"output","label":"Exibir: Aprovado"},{"id":"e","type":"output","label":"Exibir: Reprovado"},{"id":"f","type":"end","label":"FIM"}],"edges":[{"from":"a","to":"b"},{"from":"b","to":"c"},{"from":"c","to":"d","label":"Sim"},{"from":"c","to":"e","label":"Não"},{"from":"d","to":"f"},{"from":"e","to":"f"}]}`,
        codeExplanation: 'Verde = Início/Fim (oval), Azul = Processamento (retângulo), Laranja = Entrada/Saída (paralelogramo), Vermelho = Decisão (losango).',
      },
    ],
    summary: [
      'Oval/Cápsula (verde) → Início e Fim do algoritmo',
      'Retângulo (azul) → Processamento (cálculos e atribuições)',
      'Paralelogramo (laranja) → Entrada de dados (ler) e Saída de dados (exibir)',
      'Losango (vermelho) → Decisão (condição com dois caminhos: Sim e Não)',
      'Seta → Direção do fluxo de execução',
      'Círculo (roxo) → Conector entre partes distantes ou páginas diferentes',
    ],
  },

  'c-m0-seq': {
    id: 'c-m0-seq', moduleId: 0,
    objectives: [
      'Construir fluxogramas de sequência simples',
      'Identificar a estrutura linear: entrada → processamento → saída',
      'Traduzir um fluxograma sequencial para código C',
      'Praticar com exemplos reais de cálculo',
    ],
    sections: [
      {
        title: 'A Estrutura Sequencial',
        body: `A estrutura mais simples de algoritmo é a SEQUÊNCIA — os passos executam um após o outro, de cima para baixo, sem desvios.

É como seguir uma receita passo a passo: primeiro bate os ovos, depois adiciona a farinha, depois leva ao forno. Não há escolhas nem repetições.

No fluxograma sequencial, não existe nenhum losango (decisão) — apenas ovals, paralelogramos, retângulos e setas.`,
      },
      {
        title: 'Exemplo 1 — Calcular a Área de um Retângulo',
        body: `Problema: Dado a base e a altura, calcule e exiba a área de um retângulo.`,
        flowchart: `{"nodes":[{"id":"a","type":"start","label":"INÍCIO"},{"id":"b","type":"input","label":"Ler: base"},{"id":"c","type":"input","label":"Ler: altura"},{"id":"d","type":"process","label":"area = base × altura"},{"id":"e","type":"output","label":"Exibir: area"},{"id":"f","type":"end","label":"FIM"}],"edges":[{"from":"a","to":"b"},{"from":"b","to":"c"},{"from":"c","to":"d"},{"from":"d","to":"e"},{"from":"e","to":"f"}]}`,
        codeExplanation: 'Dois paralelogramos de entrada (laranja), um retângulo de processamento (azul), um paralelogramo de saída (laranja). Tudo conectado de cima para baixo.',
      },
      {
        title: 'Do Fluxograma para o Código C',
        body: `Cada símbolo mapeia diretamente para código C:

  Oval INÍCIO/FIM → implícito no main()
  Paralelogramo Ler → scanf()
  Retângulo calcular → operação aritmética
  Paralelogramo Exibir → printf()`,
        code: `#include <stdio.h>

int main() {
    float base, altura, area;

    // Paralelogramo: Ler base
    printf("Digite a base: ");
    scanf("%f", &base);

    // Paralelogramo: Ler altura
    printf("Digite a altura: ");
    scanf("%f", &altura);

    // Retangulo: area = base * altura
    area = base * altura;

    // Paralelogramo: Exibir area
    printf("Area = %.2f\n", area);

    return 0;
}`,
        codeExplanation: 'Cada bloco do fluxograma vira exatamente uma ou duas linhas de C. O mapeamento é direto!',
        tryItCode: `#include <stdio.h>

int main() {
    float base = 5.0;
    float altura = 3.0;
    float area;

    area = base * altura;

    printf("Base: %.1f\n", base);
    printf("Altura: %.1f\n", altura);
    printf("Area do retangulo: %.2f\n", area);

    return 0;
}`,
        tryItPrompt: 'Execute e veja o resultado. Tente adicionar o cálculo do perímetro (2*base + 2*altura) como novo retângulo no fluxograma.',
      },
      {
        title: 'Exemplo 2 — Calcular Média de Três Notas',
        body: `Problema: Ler três notas e calcular a média aritmética. Ainda é puramente sequencial — sem nenhum losango.`,
        flowchart: `{"nodes":[{"id":"a","type":"start","label":"INÍCIO"},{"id":"b","type":"input","label":"Ler: nota1"},{"id":"c","type":"input","label":"Ler: nota2"},{"id":"d","type":"input","label":"Ler: nota3"},{"id":"e","type":"process","label":"media = (nota1+nota2+nota3) / 3"},{"id":"f","type":"output","label":"Exibir: media"},{"id":"g","type":"end","label":"FIM"}],"edges":[{"from":"a","to":"b"},{"from":"b","to":"c"},{"from":"c","to":"d"},{"from":"d","to":"e"},{"from":"e","to":"f"},{"from":"f","to":"g"}]}`,
        codeExplanation: 'Três entradas (paralelogramos laranja), um processamento (retângulo azul), uma saída (paralelogramo laranja).',
        tip: 'A ORDEM importa! Calcular a média antes de ler as notas geraria valores incorretos (lixo de memória em C).',
      },
    ],
    summary: [
      'Estrutura sequencial: passos executam um após o outro, sem desvios',
      'Fluxo: INÍCIO → Entradas → Processamento → Saídas → FIM',
      'Paralelogramo de entrada (laranja) → scanf() em C',
      'Retângulo de processamento (azul) → operação aritmética em C',
      'Paralelogramo de saída (laranja) → printf() em C',
      'A ordem dos blocos no fluxograma define a ordem do código',
    ],
  },

  'c-m0-decision': {
    id: 'c-m0-decision', moduleId: 0,
    objectives: [
      'Representar condições em fluxogramas com o símbolo losango',
      'Desenhar os dois caminhos Sim/Não corretamente',
      'Encadear múltiplas decisões (else if)',
      'Traduzir fluxogramas com decisão para if/else em C',
    ],
    sections: [
      {
        title: 'Quando o Fluxo Se Divide',
        body: `Nem sempre o algoritmo segue um caminho único. Frequentemente precisamos tomar decisões:

  "Se a nota for maior ou igual a 7, o aluno está aprovado. Caso contrário, está reprovado."

Esse tipo de lógica é representada pelo LOSANGO (diamante vermelho) no fluxograma.

O losango sempre contém uma condição de Sim ou Não e sempre tem duas saídas: o caminho do "Sim" e o caminho do "Não".`,
        tip: 'A pergunta dentro do losango deve ter sempre resposta SIM ou NÃO. Prefira "nota >= 7?" a perguntas vagas como "nota boa?".',
      },
      {
        title: 'Exemplo 1 — Aprovado ou Reprovado',
        body: `Problema: Ler a nota de um aluno e informar se foi aprovado (nota ≥ 7) ou reprovado.`,
        flowchart: `{"nodes":[{"id":"a","type":"start","label":"INÍCIO"},{"id":"b","type":"input","label":"Ler: nota"},{"id":"c","type":"decision","label":"nota >= 7?"},{"id":"d","type":"output","label":"Exibir: Aprovado!"},{"id":"e","type":"output","label":"Exibir: Reprovado!"},{"id":"f","type":"end","label":"FIM"}],"edges":[{"from":"a","to":"b"},{"from":"b","to":"c"},{"from":"c","to":"d","label":"Sim"},{"from":"c","to":"e","label":"Não"},{"from":"d","to":"f"},{"from":"e","to":"f"}]}`,
        codeExplanation: 'Os dois caminhos (Aprovado / Reprovado) se reúnem no FIM. Em C, isso é o if/else.',
      },
      {
        title: 'Traduzindo para Código C',
        body: `O losango vira if, o caminho Sim vira o bloco {}, o caminho Não vira o else:`,
        code: `#include <stdio.h>

int main() {
    float nota;
    printf("Digite a nota: ");
    scanf("%f", &nota);

    if (nota >= 7) {
        printf("Aprovado!\n");   // Caminho Sim
    } else {
        printf("Reprovado!\n");  // Caminho Não
    }

    return 0;
}`,
        tryItCode: `#include <stdio.h>

int main() {
    float nota = 8.5;

    if (nota >= 7) {
        printf("Resultado: Aprovado!\n");
    } else {
        printf("Resultado: Reprovado!\n");
    }

    printf("Nota: %.1f\n", nota);
    return 0;
}`,
        tryItPrompt: 'Execute com nota = 8.5. Depois mude para 4.0 e veja a diferença.',
      },
      {
        title: 'Decisões Encadeadas — Três Caminhos',
        body: `Para três resultados possíveis, encadeamos dois losangos:
  • Nota ≥ 9 → "Excelente"
  • Nota ≥ 7 → "Aprovado"
  • Nota < 7  → "Reprovado"`,
        flowchart: `{"nodes":[{"id":"a","type":"start","label":"INÍCIO"},{"id":"b","type":"input","label":"Ler: nota"},{"id":"c","type":"decision","label":"nota >= 9?"},{"id":"d","type":"output","label":"Exibir: Excelente!"},{"id":"e","type":"decision","label":"nota >= 7?"},{"id":"f","type":"output","label":"Exibir: Aprovado!"},{"id":"g","type":"output","label":"Exibir: Reprovado!"},{"id":"h","type":"end","label":"FIM"}],"edges":[{"from":"a","to":"b"},{"from":"b","to":"c"},{"from":"c","to":"d","label":"Sim"},{"from":"c","to":"e","label":"Não"},{"from":"d","to":"h"},{"from":"e","to":"f","label":"Sim"},{"from":"e","to":"g","label":"Não"},{"from":"f","to":"h"},{"from":"g","to":"h"}]}`,
        codeExplanation: 'Dois losangos encadeados → if / else if / else em C.',
      },
      {
        title: 'Código com else if',
        body: `Cada losango encadeado vira um else if:`,
        code: `#include <stdio.h>

int main() {
    float nota;
    printf("Digite a nota: ");
    scanf("%f", &nota);

    if (nota >= 9) {
        printf("Excelente!\n");     // 1º losango: Sim
    } else if (nota >= 7) {
        printf("Aprovado!\n");      // 2º losango: Sim
    } else {
        printf("Reprovado!\n");     // 2º losango: Não
    }

    return 0;
}`,
        codeExplanation: 'Cada losango vira um if ou else if. A ordem importa: sempre teste do mais restritivo para o mais genérico.',
        tip: 'A ordem dos losangos/ifs define prioridade. Sempre teste do mais específico para o mais genérico.',
      },
    ],
    summary: [
      'Losango (diamante) representa decisão com dois caminhos: Sim e Não',
      'A pergunta no losango deve ser verdadeiro/falso (comparação)',
      'Losango → if/else em C',
      'Losangos encadeados (Não entra em outro losango) → if/else if/else em C',
      'A ordem dos losangos define a prioridade das condições',
      'Os dois caminhos do losango sempre se reencontram antes do FIM',
    ],
  },

  'c-m0-loops': {
    id: 'c-m0-loops', moduleId: 0,
    objectives: [
      'Representar repetição em fluxogramas com setas de retorno',
      'Identificar a condição de parada no losango de loop',
      'Distinguir loops verificar-antes (while) de verificar-depois (do-while)',
      'Traduzir fluxogramas com repetição para for/while em C',
    ],
    sections: [
      {
        title: 'Repetição em Fluxogramas',
        body: `Muitos algoritmos precisam repetir ações: somar vários números, percorrer uma lista, tentar até o usuário acertar.

No fluxograma, REPETIÇÃO é representada por uma seta que volta para um ponto anterior — criando um laço no diagrama.

Sempre há um losango (decisão) que controla quando o loop para:
  • Condição verdadeira → continua repetindo
  • Condição falsa → sai do loop e segue em frente`,
        warning: 'Todo loop precisa de condição de saída! Uma seta que sempre volta sem losango de controle é um loop infinito — um bug.',
      },
      {
        title: 'Exemplo 1 — Somar Números até Digitar Zero',
        body: `Problema: Ler números e somar. Parar quando digitar 0.

Observe a seta de E voltando para C — isso é o loop. O losango D controla a saída:`,
        flowchart: `{"nodes":[{"id":"a","type":"start","label":"INÍCIO"},{"id":"b","type":"process","label":"soma ← 0"},{"id":"c","type":"input","label":"Ler: numero"},{"id":"d","type":"decision","label":"numero != 0?"},{"id":"e","type":"process","label":"soma = soma + numero"},{"id":"f","type":"output","label":"Exibir: soma"},{"id":"g","type":"end","label":"FIM"}],"edges":[{"from":"a","to":"b"},{"from":"b","to":"c"},{"from":"c","to":"d"},{"from":"d","to":"e","label":"Sim"},{"from":"d","to":"f","label":"Não"},{"from":"e","to":"c","back":true},{"from":"f","to":"g"}]}`,
        codeExplanation: 'A seta de E volta para C — esse é o laço! Quando numero == 0, o losango D vai para F (Exibir soma) e encerra.',
      },
      {
        title: 'Traduzindo para while em C',
        body: `O fluxograma verificar → executar → voltar corresponde ao while:`,
        code: `#include <stdio.h>

int main() {
    int numero, soma = 0;

    printf("Digite um numero (0 para parar): ");
    scanf("%d", &numero);

    while (numero != 0) {
        soma = soma + numero;
        printf("Digite: ");
        scanf("%d", &numero);
    }

    printf("Soma total: %d\n", soma);
    return 0;
}`,
        codeExplanation: 'while verifica a condição ANTES de executar — o losango fica antes do bloco de processamento no fluxograma.',
        tryItCode: `#include <stdio.h>

int main() {
    int contador = 1;

    while (contador <= 5) {
        printf("Contagem: %d\n", contador);
        contador = contador + 1;
    }

    printf("Loop encerrado!\n");
    return 0;
}`,
        tryItPrompt: 'Execute e observe o loop contando de 1 a 5. O que acontece se você esquecer o "contador = contador + 1"?',
      },
      {
        title: 'Exemplo 2 — Loop com Contador (for)',
        body: `Quando sabemos exatamente quantas vezes repetir, o fluxograma tem três partes: inicialização, condição e incremento — que mapeiam diretamente para o for em C.

Problema: Imprimir os números de 1 a N.`,
        flowchart: `{"nodes":[{"id":"a","type":"start","label":"INÍCIO"},{"id":"b","type":"input","label":"Ler: N"},{"id":"c","type":"process","label":"i ← 1"},{"id":"d","type":"decision","label":"i <= N?"},{"id":"e","type":"output","label":"Exibir: i"},{"id":"f","type":"process","label":"i ← i + 1"},{"id":"g","type":"end","label":"FIM"}],"edges":[{"from":"a","to":"b"},{"from":"b","to":"c"},{"from":"c","to":"d"},{"from":"d","to":"e","label":"Sim"},{"from":"d","to":"g","label":"Não"},{"from":"e","to":"f"},{"from":"f","to":"d","back":true}]}`,
        codeExplanation: 'C = inicialização, D = condição, F = incremento. A seta de F volta para D — esse ciclo é exatamente o for em C.',
      },
      {
        title: 'Traduzindo para for em C',
        body: `Inicialização + condição + incremento viram o for — mais compacto que o while para loops com contador:`,
        code: `#include <stdio.h>

int main() {
    int N, i;
    printf("Imprimir de 1 ate qual numero? ");
    scanf("%d", &N);

    //  [i←1]   {i<=N?}   [i←i+1]
    //    ↓         ↓          ↓
    for (i = 1; i <= N; i++) {
        printf("%d\n", i);
    }

    return 0;
}`,
        codeExplanation: 'O for condensa os três elementos: for(inicialização; condição; incremento).',
        tip: 'Use for quando sabe quantas vezes vai repetir. Use while quando a condição depende de entrada do usuário ou de um evento.',
      },
    ],
    summary: [
      'Repetição no fluxograma = seta que volta para um ponto anterior',
      'O losango de controle define a condição de parada do loop',
      'Losango antes do bloco → while (verifica antes de executar)',
      'Losango depois do bloco → do-while (executa pelo menos uma vez)',
      'Loop com contador (inicialização + condição + incremento) → for em C',
      'Todo loop precisa de condição de saída para não ser infinito',
    ],
  },
};
