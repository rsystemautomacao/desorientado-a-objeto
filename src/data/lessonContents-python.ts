import { LessonContent } from './types';

export const pythonLessonContents: Record<string, LessonContent> = {

  'py-m1-intro': {
    id: 'py-m1-intro', moduleId: 1,
    objectives: [
      'Entender o que é Python e por que ele é tão popular',
      'Conhecer a estrutura básica de um programa Python',
      'Escrever e executar seu primeiro programa',
    ],
    sections: [
      {
        title: 'O que é Python?',
        body: 'Python é uma linguagem de programação de alto nível, interpretada e de propósito geral. Foi criada por Guido van Rossum e lançada em 1991. Hoje é a linguagem mais popular do mundo, usada em ciência de dados, inteligência artificial, automação, web e muito mais.\n\nPython se destaca pela sua sintaxe limpa e legível — o código parece quase inglês, o que facilita o aprendizado.',
        tip: 'Python não usa chaves {} para delimitar blocos de código. Ele usa indentação (espaços). Isso força um código mais organizado.',
      },
      {
        title: 'Seu Primeiro Programa',
        body: 'Todo programador começa com o famoso "Hello, World!". Em Python, é extremamente simples:',
        code: 'print("Hello, World!")',
        codeExplanation: 'print() é uma função embutida do Python que exibe texto na tela. As aspas definem uma string (texto).',
        tryItCode: 'print("Hello, World!")\nprint("Meu primeiro programa Python!")',
        tryItPrompt: 'Execute o código e depois mude a mensagem para o seu nome.',
      },
      {
        title: 'Comentários',
        body: 'Comentários são textos que o Python ignora — servem para explicar o código para humanos.',
        code: '# Isso é um comentário de linha\nprint("Isso executa")  # comentário no fim da linha\n\n"""\nIsso é um comentário\nde múltiplas linhas\n"""',
        tip: 'Use comentários para explicar o "por quê" do código, não o "o quê" — o código em si já diz o que faz.',
      },
    ],
    summary: [
      'Python é interpretado: executa linha a linha, sem precisar compilar',
      'print() exibe texto no console',
      'Comentários começam com # ou ficam entre """',
      'Indentação define blocos de código (obrigatório!)',
    ],
  },

  'py-m1-variables': {
    id: 'py-m1-variables', moduleId: 1,
    objectives: [
      'Declarar variáveis em Python',
      'Conhecer os tipos de dados principais',
      'Converter entre tipos (casting)',
    ],
    sections: [
      {
        title: 'Variáveis',
        body: 'Uma variável é um nome que guarda um valor na memória. Em Python, não é necessário declarar o tipo — o Python descobre sozinho.',
        code: 'nome = "Maria"\nidade = 20\naltura = 1.65\nformado = False\n\nprint(nome, idade, altura, formado)',
        codeExplanation: 'Python usa tipagem dinâmica: o tipo é determinado pelo valor atribuído. nome é str, idade é int, altura é float, formado é bool.',
      },
      {
        title: 'Tipos de Dados Principais',
        body: 'Os tipos mais comuns em Python são:',
        code: '# int — número inteiro\nidade = 25\n\n# float — número decimal\npi = 3.14159\n\n# str — texto (string)\nnome = "Python"\n\n# bool — verdadeiro ou falso\nativo = True\n\n# Verificar o tipo de uma variável\nprint(type(idade))   # <class \'int\'>\nprint(type(pi))      # <class \'float\'>\nprint(type(nome))    # <class \'str\'>\nprint(type(ativo))   # <class \'bool\'>\n',
        tryItCode: 'nome = "Seu Nome"\nidade = 18\nnotaMedia = 8.5\naprovado = True\n\nprint("Nome:", nome)\nprint("Idade:", idade)\nprint("Média:", notaMedia)\nprint("Aprovado:", aprovado)',
        tryItPrompt: 'Altere os valores e adicione uma nova variável do tipo float.',
      },
      {
        title: 'Conversão de Tipos (Casting)',
        body: 'Às vezes precisamos converter um tipo em outro:',
        code: '# String para inteiro\nnumero_texto = "42"\nnumero = int(numero_texto)\nprint(numero + 8)  # 50\n\n# Inteiro para string\nidade = 25\nmensagem = "Tenho " + str(idade) + " anos"\nprint(mensagem)\n\n# String para float\nvalor = float("3.14")\nprint(valor * 2)  # 6.28',
        warning: 'int("abc") vai gerar um erro! Só converta strings que realmente contêm números.',
      },
    ],
    summary: [
      'Variáveis não precisam de declaração de tipo em Python',
      'Tipos principais: int, float, str, bool',
      'type() mostra o tipo de uma variável',
      'int(), float(), str() fazem conversão de tipos',
    ],
  },

  'py-m1-operators': {
    id: 'py-m1-operators', moduleId: 1,
    objectives: [
      'Usar operadores aritméticos para cálculos',
      'Comparar valores com operadores relacionais',
      'Combinar condições com operadores lógicos',
    ],
    sections: [
      {
        title: 'Operadores Aritméticos',
        body: 'Python suporta as operações matemáticas básicas e mais algumas:',
        code: 'a = 10\nb = 3\n\nprint(a + b)   # 13  — soma\nprint(a - b)   # 7   — subtração\nprint(a * b)   # 30  — multiplicação\nprint(a / b)   # 3.333... — divisão real\nprint(a // b)  # 3   — divisão inteira\nprint(a % b)   # 1   — resto (módulo)\nprint(a ** b)  # 1000 — potência (10³)',
        tip: '// é divisão inteira (resultado sem decimal). % retorna o resto da divisão — muito útil para verificar se um número é par (n % 2 == 0).',
        tryItCode: 'preco = 49.90\nquantidade = 3\ntotal = preco * quantidade\nprint("Total:", total)\nprint("Metade:", total / 2)',
        tryItPrompt: 'Calcule o total de uma compra e exiba com desconto de 10%.',
      },
      {
        title: 'Operadores Relacionais',
        body: 'Comparam valores e retornam True ou False:',
        code: 'x = 10\ny = 20\n\nprint(x == y)   # False — igual\nprint(x != y)   # True  — diferente\nprint(x < y)    # True  — menor\nprint(x > y)    # False — maior\nprint(x <= 10)  # True  — menor ou igual\nprint(x >= 10)  # True  — maior ou igual',
      },
      {
        title: 'Operadores Lógicos',
        body: 'Combinam expressões booleanas:',
        code: 'nota = 7.5\nfrequencia = 80\n\naprovado = nota >= 6 and frequencia >= 75\nreprovado = nota < 6 or frequencia < 75\nresultado_inverso = not aprovado\n\nprint("Aprovado:", aprovado)        # True\nprint("Reprovado:", reprovado)      # False\nprint("Invertido:", resultado_inverso)  # False',
        codeExplanation: 'and: True somente se AMBOS forem True. or: True se PELO MENOS UM for True. not: inverte o valor.',
      },
    ],
    summary: [
      '** é potência, // é divisão inteira, % é módulo (resto)',
      'Operadores relacionais retornam True ou False',
      'and, or, not combinam condições booleanas',
    ],
  },

  'py-m1-io': {
    id: 'py-m1-io', moduleId: 1,
    objectives: [
      'Exibir dados formatados com print()',
      'Ler dados do usuário com input()',
      'Formatar strings com f-strings',
    ],
    sections: [
      {
        title: 'print() — Saída de Dados',
        body: 'A função print() exibe dados no console. Tem várias formas de uso:',
        code: '# Exibir múltiplos valores\nprint("Nome:", "Ana", "Idade:", 20)\n\n# Separador personalizado\nprint("A", "B", "C", sep="-")  # A-B-C\n\n# Sem pular linha\nprint("Olá", end=" ")\nprint("Mundo!")  # Olá Mundo!\n\n# f-string (forma moderna e recomendada)\nnome = "João"\nidade = 25\nprint(f"Nome: {nome}, Idade: {idade}")',
        tip: 'f-strings (f"...{variavel}...") são a forma mais moderna e legível de formatar texto em Python 3.6+.',
      },
      {
        title: 'input() — Entrada de Dados',
        body: 'A função input() pausa o programa e aguarda o usuário digitar algo. Sempre retorna uma string.',
        code: 'nome = input("Digite seu nome: ")\nprint(f"Olá, {nome}!")\n\n# Para números, precisa converter\nidade = int(input("Digite sua idade: "))\nano_nascimento = 2025 - idade\nprint(f"Você nasceu em {ano_nascimento}")',
        warning: 'input() SEMPRE retorna string. Se precisar de número, use int() ou float() para converter.',
        tryItCode: 'nome = input("Seu nome: ")\nidade = int(input("Sua idade: "))\nprint(f"Olá {nome}! Daqui a 10 anos você terá {idade + 10} anos.")',
        tryItPrompt: 'Execute, digite seu nome e idade, e veja o resultado.',
      },
      {
        title: 'Formatação de Números',
        body: 'Para formatar números com casas decimais:',
        code: 'preco = 49.9\nprint(f"Preço: R$ {preco:.2f}")   # R$ 49.90\n\npi = 3.14159265\nprint(f"Pi = {pi:.4f}")  # Pi = 3.1416\n\n# Alinhamento\nfor i in range(1, 4):\n    print(f"Item {i:>3}: R$ {i * 10.5:.2f}")',
      },
    ],
    summary: [
      'print() aceita sep= e end= para personalizar a saída',
      'f-strings são a forma moderna de formatar strings: f"Olá {nome}"',
      'input() sempre retorna string — converta com int() ou float() quando necessário',
      ':.2f formata um float com 2 casas decimais',
    ],
  },

  'py-m2-ifelse': {
    id: 'py-m2-ifelse', moduleId: 2,
    objectives: [
      'Usar if, elif e else para tomar decisões',
      'Aninhar condicionais',
      'Usar operador ternário',
    ],
    sections: [
      {
        title: 'if, elif, else',
        body: 'Condicionais permitem que o programa tome decisões baseadas em condições:',
        code: 'nota = float(input("Digite a nota: "))\n\nif nota >= 9:\n    print("Conceito A")\nelif nota >= 7:\n    print("Conceito B")\nelif nota >= 5:\n    print("Conceito C")\nelse:\n    print("Reprovado")',
        codeExplanation: 'Python usa indentação (4 espaços) para delimitar os blocos. Não há chaves {}. elif é a versão abreviada de "else if".',
        tryItCode: 'idade = int(input("Digite sua idade: "))\n\nif idade >= 18:\n    print("Maior de idade — pode votar!")\nelif idade >= 16:\n    print("Pode votar, mas não é obrigatorio.")\nelse:\n    print("Ainda não pode votar.")',
        tryItPrompt: 'Teste com diferentes idades e veja qual mensagem aparece.',
      },
      {
        title: 'Condições Compostas',
        body: 'Você pode combinar múltiplas condições:',
        code: 'temperatura = 25\nchuvendo = False\n\nif temperatura > 20 and not chuvendo:\n    print("Bom dia para passear!")\nelif temperatura > 20 and chuvendo:\n    print("Quente mas chuvoso, leve guarda-chuva.")\nelse:\n    print("Melhor ficar em casa.")',
      },
      {
        title: 'Operador Ternário',
        body: 'Para condições simples em uma linha:',
        code: 'nota = 7\nresultado = "Aprovado" if nota >= 6 else "Reprovado"\nprint(resultado)  # Aprovado\n\n# Equivalente ao:\nif nota >= 6:\n    resultado = "Aprovado"\nelse:\n    resultado = "Reprovado"',
        tip: 'Use o ternário apenas para casos simples. Para lógicas complexas, prefira o if/else normal.',
      },
    ],
    summary: [
      'if, elif, else controlam o fluxo do programa',
      'Indentação é obrigatória — 4 espaços por nível',
      'Você pode combinar condições com and, or, not',
      'Operador ternário: valor = A if condição else B',
    ],
  },

  'py-m2-for': {
    id: 'py-m2-for', moduleId: 2,
    objectives: [
      'Usar o laço for para repetir ações',
      'Dominar a função range()',
      'Iterar sobre listas e strings',
    ],
    sections: [
      {
        title: 'O Laço for',
        body: 'O for em Python itera sobre qualquer sequência — listas, strings, range, etc.',
        code: '# Iterando com range\nfor i in range(5):\n    print(i)  # 0, 1, 2, 3, 4\n\n# Iterando sobre uma lista\nfrutas = ["maçã", "banana", "uva"]\nfor fruta in frutas:\n    print(fruta)\n\n# Iterando sobre uma string\nfor letra in "Python":\n    print(letra)',
        tip: 'Em Python, o for é muito mais simples que em C ou Java. Você diz "para cada item EM uma coleção", sem se preocupar com índices.',
      },
      {
        title: 'A Função range()',
        body: 'range() gera uma sequência de números:',
        code: '# range(stop) — de 0 até stop-1\nfor i in range(5):        # 0,1,2,3,4\n    print(i)\n\n# range(start, stop)\nfor i in range(1, 6):     # 1,2,3,4,5\n    print(i)\n\n# range(start, stop, step)\nfor i in range(0, 11, 2): # 0,2,4,6,8,10\n    print(i)\n\n# Contagem regressiva\nfor i in range(5, 0, -1): # 5,4,3,2,1\n    print(i)',
        tryItCode: '# Tabuada do 7\nfor i in range(1, 11):\n    print(f"7 x {i} = {7 * i}")',
        tryItPrompt: 'Mude o número e gere a tabuada de qualquer número de 1 a 10.',
      },
      {
        title: 'enumerate() e zip()',
        body: 'Para acessar índice e valor ao mesmo tempo:',
        code: 'nomes = ["Ana", "Bruno", "Carla"]\n\n# enumerate: obtém índice e valor\nfor i, nome in enumerate(nomes):\n    print(f"{i+1}. {nome}")\n# 1. Ana\n# 2. Bruno\n# 3. Carla\n\n# zip: itera dois iteráveis juntos\nnotas = [8.5, 7.0, 9.5]\nfor nome, nota in zip(nomes, notas):\n    print(f"{nome}: {nota}")',
      },
    ],
    summary: [
      'for item in sequência — forma padrão de iteração em Python',
      'range(start, stop, step) gera sequências numéricas',
      'enumerate() dá acesso ao índice durante a iteração',
      'zip() itera dois iteráveis em paralelo',
    ],
  },

  'py-m2-while': {
    id: 'py-m2-while', moduleId: 2,
    objectives: [
      'Usar while para repetir enquanto uma condição for verdadeira',
      'Controlar laços com break e continue',
      'Evitar laços infinitos',
    ],
    sections: [
      {
        title: 'O Laço while',
        body: 'O while repete um bloco enquanto a condição for True:',
        code: 'contador = 0\n\nwhile contador < 5:\n    print(f"Contador: {contador}")\n    contador += 1  # IMPORTANTE: incrementar!\n\nprint("Fim!")',
        warning: 'Sempre garanta que a condição vai se tornar False em algum momento. Caso contrário, o programa nunca termina (laço infinito).',
        tryItCode: '# Adivinhe o número\nimport random\nsecreto = random.randint(1, 10)\ntentativas = 0\n\nwhile True:\n    chute = int(input("Adivinhe (1-10): "))\n    tentativas += 1\n    if chute == secreto:\n        print(f"Acertou em {tentativas} tentativas!")\n        break\n    elif chute < secreto:\n        print("Muito baixo!")\n    else:\n        print("Muito alto!")',
        tryItPrompt: 'Jogue o jogo de adivinhação!',
      },
      {
        title: 'break e continue',
        body: 'Controlam a execução dentro de laços:',
        code: '# break: sai do laço imediatamente\nfor i in range(10):\n    if i == 5:\n        break\n    print(i)  # 0, 1, 2, 3, 4\n\nprint("---")\n\n# continue: pula para a próxima iteração\nfor i in range(10):\n    if i % 2 == 0:\n        continue  # pula números pares\n    print(i)  # 1, 3, 5, 7, 9',
        tip: 'Use break para sair de um laço quando encontrar o que procura. Use continue para pular iterações específicas.',
      },
      {
        title: 'while com else',
        body: 'Python tem uma construção única: o else no while/for executa quando o laço termina normalmente (sem break):',
        code: 'numero = 17\ndivisor = 2\n\nwhile divisor < numero:\n    if numero % divisor == 0:\n        print(f"{numero} não é primo (divisível por {divisor})")\n        break\n    divisor += 1\nelse:\n    print(f"{numero} é primo!")',
      },
    ],
    summary: [
      'while repete enquanto a condição for True',
      'Sempre incremente variáveis de controle para evitar laços infinitos',
      'break sai do laço; continue pula para a próxima iteração',
      'O else do while/for executa quando o laço termina sem break',
    ],
  },

  'py-m3-functions': {
    id: 'py-m3-functions', moduleId: 3,
    objectives: [
      'Criar e chamar funções com def',
      'Usar parâmetros e valores de retorno',
      'Entender escopo de variáveis',
    ],
    sections: [
      {
        title: 'Definindo Funções',
        body: 'Funções são blocos de código reutilizáveis. Em Python, usamos a palavra-chave def:',
        code: 'def saudar(nome):\n    mensagem = f"Olá, {nome}!"\n    return mensagem\n\n# Chamando a função\nresult = saudar("Ana")\nprint(result)  # Olá, Ana!\n\n# Função sem retorno\ndef imprimir_separador():\n    print("=" * 30)\n\nimprimir_separador()',
        codeExplanation: 'def define a função. O nome, parênteses e dois-pontos são obrigatórios. O bloco indentado é o corpo da função. return devolve um valor.',
        tryItCode: 'def calcular_media(nota1, nota2, nota3):\n    media = (nota1 + nota2 + nota3) / 3\n    return media\n\ndef verificar_aprovacao(media):\n    if media >= 6:\n        return "Aprovado"\n    else:\n        return "Reprovado"\n\nmedia = calcular_media(7, 8, 9)\nprint(f"Média: {media:.1f}")\nprint(f"Resultado: {verificar_aprovacao(media)}")',
        tryItPrompt: 'Altere as notas e veja o resultado mudar.',
      },
      {
        title: 'Parâmetros Padrão e *args',
        body: 'Python permite parâmetros opcionais com valores padrão:',
        code: '# Parâmetro com valor padrão\ndef potencia(base, expoente=2):\n    return base ** expoente\n\nprint(potencia(3))     # 9  (expoente=2 por padrão)\nprint(potencia(3, 3))  # 27\n\n# *args: número variável de argumentos\ndef somar(*numeros):\n    return sum(numeros)\n\nprint(somar(1, 2, 3))        # 6\nprint(somar(10, 20, 30, 40)) # 100',
        tip: 'Parâmetros com valores padrão devem vir sempre DEPOIS dos parâmetros obrigatórios.',
      },
      {
        title: 'Escopo de Variáveis',
        body: 'Variáveis criadas dentro de uma função não existem fora dela:',
        code: 'x = 10  # variável global\n\ndef minha_funcao():\n    y = 20  # variável local\n    print(x)  # pode ler variável global\n    print(y)\n\nminha_funcao()\nprint(x)  # funciona\n# print(y)  # ERRO! y não existe aqui',
        warning: 'Evite usar global dentro de funções. Prefira passar valores como parâmetros e retornar resultados.',
      },
    ],
    summary: [
      'def nome(parâmetros): define uma função',
      'return devolve um valor (sem return, a função retorna None)',
      'Parâmetros padrão: def f(x, y=10) — y é opcional',
      'Variáveis locais só existem dentro da função',
    ],
  },

  'py-m3-lists': {
    id: 'py-m3-lists', moduleId: 3,
    objectives: [
      'Criar e manipular listas',
      'Usar os métodos principais de listas',
      'Aplicar list comprehension',
    ],
    sections: [
      {
        title: 'Listas em Python',
        body: 'Listas são coleções ordenadas e mutáveis. São a estrutura de dados mais usada em Python.',
        code: '# Criar lista\nfrutas = ["maçã", "banana", "uva"]\nnumeros = [1, 2, 3, 4, 5]\nmista = [1, "texto", True, 3.14]\n\n# Acessar elementos (índice começa em 0)\nprint(frutas[0])   # maçã\nprint(frutas[-1])  # uva (último)\n\n# Fatiamento (slicing)\nprint(numeros[1:4])   # [2, 3, 4]\nprint(numeros[:3])    # [1, 2, 3]\nprint(numeros[::2])   # [1, 3, 5] (passo 2)',
        tip: 'Índices negativos contam a partir do final: [-1] é o último, [-2] é o penúltimo.',
      },
      {
        title: 'Métodos de Listas',
        body: 'Listas têm métodos poderosos para manipulação:',
        code: 'lista = [3, 1, 4, 1, 5, 9, 2, 6]\n\n# Adicionar\nlista.append(7)       # adiciona no final\nlista.insert(0, 0)    # insere na posição 0\n\n# Remover\nlista.remove(1)       # remove o primeiro 1\nulitmo = lista.pop()  # remove e retorna o último\n\n# Ordenar\nlista.sort()          # ordena no lugar\nordenada = sorted(lista)  # retorna nova lista ordenada\n\n# Informações\nprint(len(lista))     # tamanho\nprint(lista.count(1)) # quantas vezes aparece\nprint(1 in lista)     # True se existir',
        tryItCode: 'notas = []\n\nfor i in range(3):\n    n = float(input(f"Nota {i+1}: "))\n    notas.append(n)\n\nnotas.sort(reverse=True)\nprint(f"Notas: {notas}")\nprint(f"Maior: {notas[0]}")\nprint(f"Média: {sum(notas)/len(notas):.1f}")',
        tryItPrompt: 'Digite 3 notas e veja a análise.',
      },
      {
        title: 'List Comprehension',
        body: 'Uma forma pythônica e eficiente de criar listas:',
        code: '# Sem list comprehension\nquadrados = []\nfor i in range(1, 6):\n    quadrados.append(i ** 2)\n\n# Com list comprehension (equivalente)\nquadrados = [i ** 2 for i in range(1, 6)]\nprint(quadrados)  # [1, 4, 9, 16, 25]\n\n# Com filtro\npares = [i for i in range(20) if i % 2 == 0]\nprint(pares)  # [0, 2, 4, ..., 18]\n\n# Transformação\nnomes = ["ana", "bruno", "carla"]\nmaius = [n.upper() for n in nomes]\nprint(maius)  # [\'ANA\', \'BRUNO\', \'CARLA\']',
      },
    ],
    summary: [
      'Listas são criadas com [] e aceitam tipos mistos',
      'Índices começam em 0; negativos contam do fim',
      'Métodos principais: append(), insert(), remove(), pop(), sort()',
      'List comprehension: [expressão for item in iterável if condição]',
    ],
  },

  'py-m3-dicts': {
    id: 'py-m3-dicts', moduleId: 3,
    objectives: [
      'Criar e usar dicionários (chave-valor)',
      'Iterar sobre dicionários',
      'Conhecer conjuntos (sets)',
    ],
    sections: [
      {
        title: 'Dicionários',
        body: 'Dicionários armazenam pares chave-valor. São como uma "agenda": você busca pelo nome (chave) e encontra o número (valor).',
        code: '# Criar dicionário\naluno = {\n    "nome": "Ana",\n    "idade": 20,\n    "curso": "Sistemas de Informação",\n    "notas": [8.5, 7.0, 9.0]\n}\n\n# Acessar valores\nprint(aluno["nome"])    # Ana\nprint(aluno.get("cpf", "Não informado"))  # seguro — não dá erro\n\n# Modificar\naluno["idade"] = 21\naluno["email"] = "ana@email.com"  # adiciona nova chave\n\n# Remover\ndel aluno["curso"]\nvalor = aluno.pop("email")  # remove e retorna',
        tryItCode: 'estoque = {\n    "maçã": 10,\n    "banana": 5,\n    "uva": 20\n}\n\nproduto = input("Qual produto? ")\nif produto in estoque:\n    print(f"{produto}: {estoque[produto]} unidades")\nelse:\n    print("Produto não encontrado!")',
        tryItPrompt: 'Digite um produto e verifique o estoque.',
      },
      {
        title: 'Iterando Dicionários',
        body: 'Três formas de percorrer um dicionário:',
        code: 'capitais = {"SP": "São Paulo", "RJ": "Rio de Janeiro", "MG": "Belo Horizonte"}\n\n# Iterando pelas chaves\nfor estado in capitais:\n    print(estado)\n\n# Iterando pelos valores\nfor capital in capitais.values():\n    print(capital)\n\n# Iterando por chave e valor\nfor estado, capital in capitais.items():\n    print(f"{estado} → {capital}")',
      },
      {
        title: 'Conjuntos (Sets)',
        body: 'Sets armazenam elementos únicos, sem ordem definida:',
        code: '# Criar set\ncolores = {"vermelho", "azul", "verde", "vermelho"}\nprint(colores)  # vermelho aparece só uma vez\n\n# Verificar pertencimento\nprint("azul" in colores)  # True — muito rápido!\n\n# Operações de conjuntos\na = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\n\nprint(a | b)   # união: {1,2,3,4,5,6}\nprint(a & b)   # interseção: {3,4}\nprint(a - b)   # diferença: {1,2}',
        tip: 'Use set para remover duplicatas de uma lista: lista_unica = list(set(lista_com_duplicatas))',
      },
    ],
    summary: [
      'Dicionários: {chave: valor} — acesso por chave em O(1)',
      '.get(chave, padrão) é mais seguro que [chave] — não gera erro se não existir',
      '.items() retorna pares (chave, valor) para iteração',
      'Sets: coleção sem duplicatas, ideal para verificar pertencimento',
    ],
  },
};
