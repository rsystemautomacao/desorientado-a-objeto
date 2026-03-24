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

  // ─────────────────────────────────────────────────────────────────────────
  // MÓDULO 4 — Python para BI e Data Science
  // ─────────────────────────────────────────────────────────────────────────

  'py-m4-numpy': {
    id: 'py-m4-numpy', moduleId: 4,
    objectives: [
      'Entender o que é NumPy e por que ele é a base do ecossistema de dados em Python',
      'Criar e manipular arrays unidimensionais e bidimensionais',
      'Aplicar operações vetorizadas e funções estatísticas básicas',
    ],
    sections: [
      {
        title: 'Por que NumPy?',
        body: 'Python puro é lento para operações matemáticas em grandes volumes de dados. Listas comuns não suportam operações vetorizadas — se você quiser multiplicar todos os elementos por 2, precisa de um loop.\n\nNumPy (Numerical Python) resolve isso com arrays otimizados em C, que são até 100× mais rápidos que listas Python. É a base de praticamente toda a stack de Data Science: Pandas, Scikit-learn, TensorFlow e Matplotlib todas dependem do NumPy internamente.',
        code: '# Sem NumPy — lento\nprecos = [10, 20, 30, 40]\ndobrado = [p * 2 for p in precos]   # loop necessário\n\n# Com NumPy — vetorizado\nimport numpy as np\nprecos = np.array([10, 20, 30, 40])\ndobrado = precos * 2                 # sem loop!',
        codeExplanation: 'A operação precos * 2 aplica a multiplicação em todos os elementos simultaneamente, usando código C otimizado. Nenhum loop Python é executado.',
        tip: 'Instale NumPy com: pip install numpy. Em ambientes como Jupyter, Google Colab e Anaconda ele já vem instalado.',
      },
      {
        title: 'Criando Arrays',
        body: 'NumPy oferece várias formas de criar arrays:',
        code: 'import numpy as np\n\n# A partir de uma lista Python\nnotas = np.array([7.0, 8.5, 6.0, 9.0, 7.5])\n\n# Sequência de números\nsequencia = np.arange(0, 10, 2)     # [0, 2, 4, 6, 8]\n\n# N valores igualmente espaçados\ninterpolado = np.linspace(0, 1, 5)  # [0, 0.25, 0.5, 0.75, 1]\n\n# Arrays prontos\nzeros   = np.zeros(5)               # [0. 0. 0. 0. 0.]\nums     = np.ones((2, 3))           # matriz 2x3 de uns\naleator = np.random.rand(3)         # 3 números aleatórios [0,1)\n\nprint(sequencia)\nprint(interpolado)',
        codeExplanation: 'np.arange() funciona como range() mas retorna um array. np.linspace() é útil para criar eixos de gráficos. np.zeros() e np.ones() geram arrays inicializados.',
      },
      {
        title: 'Operações Vetorizadas',
        body: 'Com NumPy, operações matemáticas aplicam-se a todos os elementos automaticamente:',
        code: 'import numpy as np\n\nvendas = np.array([1200, 980, 1500, 730, 1100])\n\n# Operações elemento a elemento\nvendas_com_bonus = vendas * 1.10          # +10% em tudo\nvendas_normalizadas = vendas / vendas.max() # normalizar 0-1\n\n# Comparações retornam array booleano\nacima_da_meta = vendas > 1000\nprint(acima_da_meta)          # [True False True False True]\n\n# Filtrar usando máscara booleana\nmeta_atingida = vendas[acima_da_meta]\nprint(meta_atingida)          # [1200 1500 1100]',
        tip: 'A filtragem com máscara booleana (fancy indexing) é uma das funcionalidades mais poderosas do NumPy — e é exatamente como o Pandas filtra DataFrames.',
      },
      {
        title: 'Funções Estatísticas',
        body: 'NumPy inclui todas as funções estatísticas básicas que você vai usar em BI:',
        code: 'import numpy as np\n\nnotas = np.array([6.5, 7.0, 8.5, 9.0, 5.0, 7.5, 8.0])\n\nprint("Média:      ", np.mean(notas))        # 7.357...\nprint("Mediana:    ", np.median(notas))      # 7.5\nprint("Desvio pad: ", np.std(notas))         # 1.206...\nprint("Mínimo:     ", np.min(notas))         # 5.0\nprint("Máximo:     ", np.max(notas))         # 9.0\nprint("Soma:       ", np.sum(notas))         # 51.5\nprint("Percentil75:", np.percentile(notas, 75))  # 8.0\n\n# Índice do maior e menor\nprint("Posição do máximo:", np.argmax(notas))  # 3',
        tryItCode: '# Calcule estatísticas manualmente (sem bibliotecas)\nnotas = [6.5, 7.0, 8.5, 9.0, 5.0, 7.5, 8.0]\n\nmedia = sum(notas) / len(notas)\n\nnotas_ord = sorted(notas)\nn = len(notas_ord)\nif n % 2 == 0:\n    mediana = (notas_ord[n//2 - 1] + notas_ord[n//2]) / 2\nelse:\n    mediana = notas_ord[n//2]\n\ndesvio = (sum((x - media)**2 for x in notas) / len(notas)) ** 0.5\n\nprint(f"Media:      {media:.2f}")\nprint(f"Mediana:    {mediana:.2f}")\nprint(f"Desvio pad: {desvio:.2f}")\nprint(f"Minimo:     {min(notas)}")\nprint(f"Maximo:     {max(notas)}")',
        tryItPrompt: 'Execute e compare com os resultados do NumPy acima.',
      },
      {
        title: 'Arrays 2D — Matrizes',
        body: 'NumPy suporta arrays multidimensionais, essenciais para representar tabelas e imagens:',
        code: 'import numpy as np\n\n# Matriz 3x4 — 3 meses, 4 produtos\nvendas = np.array([\n    [100, 200, 150, 300],   # Janeiro\n    [120, 180, 160, 310],   # Fevereiro\n    [130, 220, 140, 290],   # Março\n])\n\nprint("Shape:", vendas.shape)         # (3, 4)\nprint("Total geral:", vendas.sum())   # soma tudo\n\n# Somar por coluna (por produto)\ntotal_produto = vendas.sum(axis=0)\nprint("Total por produto:", total_produto)\n\n# Média por linha (por mês)\nmedia_mes = vendas.mean(axis=1)\nprint("Media por mes:", media_mes)',
        codeExplanation: 'axis=0 opera ao longo das linhas (agrega por coluna). axis=1 opera ao longo das colunas (agrega por linha). Essa convenção é a mesma no Pandas.',
      },
    ],
    summary: [
      'NumPy é a fundação do ecossistema de Data Science em Python',
      'Arrays NumPy são até 100× mais rápidos que listas para cálculos numéricos',
      'Operações vetorizadas eliminam a necessidade de loops explícitos',
      'np.mean, np.std, np.median, np.percentile fazem estatística básica de forma concisa',
      'Arrays 2D representam tabelas; axis=0 agrega por coluna, axis=1 por linha',
    ],
  },

  'py-m4-pandas': {
    id: 'py-m4-pandas', moduleId: 4,
    objectives: [
      'Criar e inspecionar DataFrames com Pandas',
      'Entender a diferença entre Series e DataFrame',
      'Ler arquivos CSV e explorar um dataset real',
    ],
    sections: [
      {
        title: 'O que é Pandas?',
        body: 'Pandas é a principal biblioteca para manipulação de dados tabulares em Python. O nome vem de "Panel Data" — termo econométrico para dados multidimensionais.\n\nSe você já trabalhou com Excel ou SQL, vai reconhecer as operações: filtrar linhas, selecionar colunas, agrupar por categoria, calcular totais. O Pandas faz tudo isso programaticamente, com centenas de linhas de dados em segundos.\n\nDuas estruturas principais:\n- **Series**: coluna única (como uma lista nomeada)\n- **DataFrame**: tabela com múltiplas colunas (como uma planilha)',
        code: 'import pandas as pd\n\n# Series — uma coluna com índice\nnotas = pd.Series([7.0, 8.5, 6.0, 9.0], index=["Ana", "Bruno", "Carla", "Diego"])\nprint(notas)\nprint("\\nMédia:", notas.mean())',
        codeExplanation: 'Uma Series tem um índice (rótulo) para cada valor. Por padrão o índice é 0, 1, 2... mas pode ser qualquer coisa (nomes, datas, IDs).',
      },
      {
        title: 'Criando DataFrames',
        body: 'Um DataFrame é uma tabela — colunas de diferentes tipos, todas com o mesmo número de linhas. Pode ser criado a partir de dicionários, listas ou arquivos.',
        code: 'import pandas as pd\n\n# A partir de um dicionário — chave = nome da coluna\ndf = pd.DataFrame({\n    "nome":    ["Ana", "Bruno", "Carla", "Diego", "Elena"],\n    "idade":   [22, 35, 28, 41, 19],\n    "salario": [3500.0, 7200.0, 5100.0, 9800.0, 2800.0],\n    "depto":   ["TI", "RH", "TI", "Financeiro", "RH"],\n})\n\nprint(df)\nprint("\\nShape:", df.shape)   # (5, 4) → 5 linhas, 4 colunas',
        codeExplanation: 'Cada chave do dicionário vira uma coluna. As listas de valores devem ter o mesmo tamanho. O índice é criado automaticamente (0, 1, 2...).',
        tip: 'Em projetos reais você raramente cria DataFrames na mão — você os carrega de arquivos (CSV, Excel, banco de dados). O dicionário é útil para testes e aprendizado.',
      },
      {
        title: 'Lendo Arquivos CSV',
        body: 'A forma mais comum de carregar dados no Pandas é ler um arquivo CSV:',
        code: 'import pandas as pd\n\n# Lendo um arquivo CSV\ndf = pd.read_csv("vendas.csv")\n\n# Lendo com opções\ndf = pd.read_csv(\n    "vendas.csv",\n    sep=";",                  # separador ponto e vírgula (padrão BR)\n    encoding="utf-8",         # codificação\n    decimal=",",              # decimal com vírgula (padrão BR)\n    parse_dates=["data"],     # converter coluna "data" para datetime\n)\n\n# Lendo do Google Drive (Colab)\ndf = pd.read_csv("https://raw.githubusercontent.com/user/repo/main/dados.csv")\n\n# Excel\ndf = pd.read_excel("relatorio.xlsx", sheet_name="Planilha1")',
        tip: 'No Google Colab você pode fazer upload de arquivos com: from google.colab import files; files.upload(). Depois leia normalmente com pd.read_csv().',
      },
      {
        title: 'Inspecionando o Dataset',
        body: 'Antes de qualquer análise, sempre inspecione o DataFrame para entender o que você tem:',
        code: 'import pandas as pd\n\ndf = pd.DataFrame({\n    "produto": ["Notebook", "Mouse", "Monitor", "Teclado", "Headset"],\n    "preco":   [3200.0, 89.90, 1200.0, 149.90, 299.0],\n    "estoque": [15, 200, 42, 130, 75],\n    "ativo":   [True, True, True, False, True],\n})\n\nprint(df.head(3))       # primeiras 3 linhas\nprint(df.tail(2))       # últimas 2 linhas\nprint(df.shape)         # (5, 4)\nprint(df.columns)       # Index(["produto", "preco"...])\nprint(df.dtypes)        # tipo de cada coluna\nprint(df.info())        # resumo: tipos + nulos\nprint(df.describe())    # estatísticas: count, mean, std, min, max...',
        codeExplanation: 'df.describe() é um dos comandos mais usados em EDA — ele mostra médias, desvio padrão e percentis de todas as colunas numéricas de uma só vez.',
      },
      {
        title: 'Selecionando Colunas e Linhas',
        body: 'Pandas tem duas formas principais de acessar dados: por rótulo (loc) e por posição (iloc).',
        code: 'import pandas as pd\n\ndf = pd.DataFrame({\n    "nome":   ["Ana", "Bruno", "Carla", "Diego"],\n    "nota":   [8.5, 6.0, 9.0, 7.5],\n    "turma":  ["A", "B", "A", "B"],\n})\n\n# Selecionar uma coluna → retorna Series\nprint(df["nota"])\n\n# Selecionar múltiplas colunas → retorna DataFrame\nprint(df[["nome", "nota"]])\n\n# Selecionar por rótulo de linha (loc)\nprint(df.loc[1])             # linha de índice 1 (Bruno)\nprint(df.loc[0:2, "nome"])   # linhas 0-2, coluna "nome"\n\n# Selecionar por posição (iloc)\nprint(df.iloc[0])            # primeira linha\nprint(df.iloc[-1])           # última linha\nprint(df.iloc[0:2, 0:2])     # primeiras 2 linhas e 2 colunas',
        tryItCode: '# Simule um DataFrame com dicionários\nalunos = [\n    {"nome": "Ana",   "nota": 8.5, "turma": "A"},\n    {"nome": "Bruno", "nota": 6.0, "turma": "B"},\n    {"nome": "Carla", "nota": 9.0, "turma": "A"},\n    {"nome": "Diego", "nota": 7.5, "turma": "B"},\n]\n\n# Acessar "coluna"\nnotas = [a["nota"] for a in alunos]\nprint("Notas:", notas)\nprint("Media:", sum(notas) / len(notas))\n\n# Acessar "linha"\nprint("\\nPrimeiro aluno:", alunos[0])\nprint("Ultimo aluno:", alunos[-1])\n\n# Filtrar turma A\nturma_a = [a for a in alunos if a["turma"] == "A"]\nfor a in turma_a:\n    print(f"{a[\'nome\']}: {a[\'nota\']}")',
        tryItPrompt: 'Adicione mais alunos e calcule também a maior e a menor nota.',
      },
    ],
    summary: [
      'Series = coluna; DataFrame = tabela com múltiplas colunas',
      'pd.read_csv() carrega arquivos — use sep=";", encoding="utf-8" para dados BR',
      'head(), tail(), info(), describe() são os primeiros comandos em qualquer análise',
      'df["coluna"] seleciona uma coluna; df[["col1","col2"]] seleciona várias',
      'loc[] seleciona por rótulo; iloc[] seleciona por posição numérica',
    ],
  },

  'py-m4-filter': {
    id: 'py-m4-filter', moduleId: 4,
    objectives: [
      'Filtrar linhas de um DataFrame com condições booleanas',
      'Agrupar dados com groupby() e calcular agregações',
      'Criar novas colunas, ordenar e combinar DataFrames',
    ],
    sections: [
      {
        title: 'Filtros Booleanos',
        body: 'Para filtrar linhas de um DataFrame, passe uma condição booleana dentro de colchetes. O Pandas mantém apenas as linhas onde a condição é True — o mesmo mecanismo do NumPy.',
        code: 'import pandas as pd\n\ndf = pd.DataFrame({\n    "produto":  ["Notebook", "Mouse", "Monitor", "Teclado", "Headset"],\n    "categoria":["TI", "TI", "TI", "TI", "Acessório"],\n    "preco":    [3200.0, 89.90, 1200.0, 149.90, 299.0],\n    "vendas":   [15, 200, 42, 130, 75],\n})\n\n# Filtro simples\ncaro = df[df["preco"] > 500]\nprint("Produtos acima de R$ 500:")\nprint(caro)\n\n# Filtro múltiplo com & (E) e | (OU)\n# ATENÇÃO: use parênteses em cada condição!\nbom_custo = df[(df["preco"] < 200) & (df["vendas"] > 100)]\nprint("\\nBarato E com muitas vendas:")\nprint(bom_custo)',
        warning: 'Use & (E), | (OU) e ~ (NÃO) para combinar condições — nunca use "and"/"or" com Pandas. E sempre coloque cada condição entre parênteses!',
      },
      {
        title: 'isin() e query()',
        body: 'Para filtros com múltiplos valores ou expressões complexas, Pandas oferece métodos mais legíveis:',
        code: 'import pandas as pd\n\ndf = pd.DataFrame({\n    "nome":   ["Ana", "Bruno", "Carla", "Diego", "Elena"],\n    "depto":  ["TI", "RH", "TI", "Financeiro", "RH"],\n    "salario":[5000, 4200, 6800, 9100, 3800],\n})\n\n# isin() — equivale a vários ORs\nti_ou_rh = df[df["depto"].isin(["TI", "RH"])]\nprint(ti_ou_rh)\n\n# query() — sintaxe mais próxima do SQL\nalto_salario_ti = df.query("depto == \'TI\' and salario > 5000")\nprint(alto_salario_ti)\n\n# str.contains() — filtro em texto\ntem_a = df[df["nome"].str.contains("a", case=False)]\nprint(tem_a)',
        tip: 'query() é especialmente útil em análises interativas (Jupyter) porque é mais legível que encadear condições com & e |.',
      },
      {
        title: 'groupby() — Agrupando Dados',
        body: 'groupby() é o equivalente do GROUP BY do SQL — agrupa linhas por uma coluna e calcula métricas para cada grupo. É um dos comandos mais usados em BI.',
        code: 'import pandas as pd\n\ndf = pd.DataFrame({\n    "vendedor": ["Ana", "Bruno", "Ana", "Carla", "Bruno", "Ana"],\n    "produto":  ["A", "B", "C", "A", "A", "B"],\n    "valor":    [1200, 850, 3200, 900, 1100, 750],\n    "mes":      ["Jan", "Jan", "Fev", "Fev", "Mar", "Mar"],\n})\n\n# Total de vendas por vendedor\ntotal = df.groupby("vendedor")["valor"].sum()\nprint("Total por vendedor:")\nprint(total)\n\n# Múltiplas métricas com agg()\nresumo = df.groupby("vendedor")["valor"].agg(["sum", "mean", "count"])\nresumo.columns = ["Total", "Ticket Médio", "Qtd Vendas"]\nprint("\\nResumo:")\nprint(resumo)',
        codeExplanation: '.agg() aceita uma lista de funções ("sum", "mean", "count", "min", "max", "std") e retorna um DataFrame com uma coluna para cada métrica.',
      },
      {
        title: 'Criando e Transformando Colunas',
        body: 'É muito comum criar novas colunas calculadas a partir das existentes:',
        code: 'import pandas as pd\n\ndf = pd.DataFrame({\n    "produto": ["A", "B", "C", "D"],\n    "custo":   [100, 200, 150, 80],\n    "preco":   [150, 350, 200, 120],\n    "vendas":  [50, 30, 70, 100],\n})\n\n# Nova coluna calculada\ndf["lucro_unit"] = df["preco"] - df["custo"]\ndf["receita"]    = df["preco"] * df["vendas"]\ndf["margem_%"]   = (df["lucro_unit"] / df["preco"] * 100).round(1)\n\n# Categorizar com apply() e lambda\ndf["categoria"] = df["margem_%"].apply(lambda m: "Alta" if m > 30 else "Baixa")\n\nprint(df)',
        tip: 'apply() + lambda é poderoso para transformações que não cabem em uma expressão simples. Para transformações complexas, defina uma função com def e passe-a para apply().',
      },
      {
        title: 'Ordenação e Ranking',
        body: 'sort_values() organiza o DataFrame por uma ou mais colunas:',
        code: 'import pandas as pd\n\ndf = pd.DataFrame({\n    "produto": ["A", "B", "C", "D", "E"],\n    "vendas":  [120, 450, 80, 300, 210],\n    "preco":   [50, 30, 100, 75, 60],\n})\n\n# Ordenar por vendas (decrescente)\nranking = df.sort_values("vendas", ascending=False)\nprint("Ranking de vendas:")\nprint(ranking)\n\n# Criar coluna de ranking\ndf["rank_vendas"] = df["vendas"].rank(ascending=False).astype(int)\n\n# Top 3\ntop3 = df.nlargest(3, "vendas")\nprint("\\nTop 3:")\nprint(top3)',
        tryItCode: '# Simule groupby com Python puro\nvendas = [\n    {"vendedor": "Ana", "valor": 1200},\n    {"vendedor": "Bruno", "valor": 850},\n    {"vendedor": "Ana", "valor": 3200},\n    {"vendedor": "Carla", "valor": 900},\n    {"vendedor": "Bruno", "valor": 1100},\n    {"vendedor": "Ana", "valor": 750},\n]\n\n# Agrupar e somar\ntotais = {}\nfor v in vendas:\n    nome = v["vendedor"]\n    totais[nome] = totais.get(nome, 0) + v["valor"]\n\n# Ordenar por total (ranking)\nranking = sorted(totais.items(), key=lambda x: x[1], reverse=True)\n\nprint("=== RANKING DE VENDAS ===")\nfor pos, (nome, total) in enumerate(ranking, 1):\n    print(f"{pos}. {nome}: R$ {total:.2f}")',
        tryItPrompt: 'Adicione mais vendedores e calcule também a média por vendedor.',
      },
    ],
    summary: [
      'Filtros booleanos: df[df["col"] > valor] — use & (E), | (OU), ~ (NÃO) com parênteses',
      'isin() verifica múltiplos valores; query() usa sintaxe semelhante a SQL',
      'groupby("coluna")["outra"].agg(["sum","mean"]) é o GROUP BY do Pandas',
      'Crie novas colunas com df["nova"] = expressão; use apply() para lógica complexa',
      'sort_values(), nlargest() e nsmallest() para ordenação e ranking',
    ],
  },

  'py-m4-matplotlib': {
    id: 'py-m4-matplotlib', moduleId: 4,
    objectives: [
      'Criar gráficos de linhas, barras, histogramas e scatter plots',
      'Customizar títulos, rótulos, cores e legendas',
      'Integrar Matplotlib com Pandas para visualizar dados rapidamente',
    ],
    sections: [
      {
        title: 'Por que Visualizar Dados?',
        body: 'Dados em forma de tabela são difíceis de interpretar. Um gráfico bem feito revela padrões, tendências e anomalias em segundos — o que levaria horas analisando planilhas.\n\nMatplotlib é a biblioteca de visualização mais usada em Python. Seaborn e Plotly são construídas sobre ela e adicionam estilos e interatividade. Pandas integra o Matplotlib diretamente via df.plot().\n\nO fluxo básico é sempre:\n1. Prepare os dados (geralmente com Pandas)\n2. Crie a figura e os eixos\n3. Plote os dados\n4. Customize (títulos, cores, rótulos)\n5. Mostre ou salve',
        code: '# Estrutura básica de um gráfico Matplotlib\nimport matplotlib.pyplot as plt\n\nfig, ax = plt.subplots(figsize=(10, 6))  # cria figura e eixos\n\nax.plot([1, 2, 3, 4], [10, 24, 18, 35])  # plota dados\n\nax.set_title("Meu Primeiro Gráfico")     # título\nax.set_xlabel("Mês")                     # eixo X\nax.set_ylabel("Vendas")                  # eixo Y\n\nplt.tight_layout()  # ajusta espaçamentos\nplt.show()          # exibe o gráfico',
        tip: 'Use plt.savefig("grafico.png", dpi=150) para salvar em vez de plt.show(). Em Jupyter/Colab, adicione %matplotlib inline no início do notebook.',
      },
      {
        title: 'Gráfico de Linhas — Séries Temporais',
        body: 'O gráfico de linhas é ideal para mostrar evolução ao longo do tempo:',
        code: 'import matplotlib.pyplot as plt\nimport numpy as np\n\nmeses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"]\nvendas_2023 = [8500, 9200, 7800, 10500, 11200, 9800]\nvendas_2024 = [9100, 10300, 8900, 12100, 13500, 11800]\n\nfig, ax = plt.subplots(figsize=(10, 5))\n\nax.plot(meses, vendas_2023, marker="o", color="steelblue",\n        linewidth=2, label="2023")\nax.plot(meses, vendas_2024, marker="s", color="coral",\n        linewidth=2, linestyle="--", label="2024")\n\nax.set_title("Comparativo de Vendas — 2023 vs 2024", fontsize=14, fontweight="bold")\nax.set_xlabel("Mês")\nax.set_ylabel("Vendas (R$)")\nax.legend()\nax.grid(True, alpha=0.3)\n\nplt.tight_layout()\nplt.show()',
        codeExplanation: 'marker="o" adiciona marcadores nos pontos. linewidth controla a espessura. linestyle="--" cria linha tracejada. alpha=0.3 torna a grade translúcida.',
      },
      {
        title: 'Gráfico de Barras — Comparações',
        body: 'Barras são ideais para comparar categorias. Use barras horizontais quando os rótulos forem longos:',
        code: 'import matplotlib.pyplot as plt\n\ndeptos     = ["TI", "RH", "Financeiro", "Marketing", "Vendas"]\ncusto_med  = [8500, 5200, 7100, 4800, 6300]\n\ncolores = ["#3498db" if c > 6000 else "#95a5a6" for c in custo_med]\n\nfig, axes = plt.subplots(1, 2, figsize=(12, 5))\n\n# Vertical\naxes[0].bar(deptos, custo_med, color=colores)\naxes[0].set_title("Salário Médio por Depto")\naxes[0].set_ylabel("Salário (R$)")\naxes[0].tick_params(axis="x", rotation=30)\n\n# Horizontal\naxes[1].barh(deptos, custo_med, color=colores)\naxes[1].set_title("Salário Médio por Depto (Horizontal)")\naxes[1].set_xlabel("Salário (R$)")\n\nfor ax in axes:\n    ax.grid(True, alpha=0.2, axis="y" if ax == axes[0] else "x")\n\nplt.tight_layout()\nplt.show()',
        tip: 'A lista comprehension na linha de cores destaca automaticamente os departamentos acima de R$ 6000 em azul e os demais em cinza. Esse padrão de "destaque condicional" é muito usado em dashboards.',
      },
      {
        title: 'Histograma e Scatter Plot',
        body: 'Histogramas mostram a distribuição de uma variável. Scatter plots mostram a relação entre duas variáveis numéricas.',
        code: 'import matplotlib.pyplot as plt\nimport numpy as np\n\n# Dados simulados\nnp.random.seed(42)\nsalarios = np.random.normal(loc=6000, scale=1500, size=200)\nidade    = np.random.randint(20, 60, size=200)\nbonus    = salarios * 0.1 + np.random.normal(0, 200, size=200)\n\nfig, axes = plt.subplots(1, 2, figsize=(12, 5))\n\n# Histograma\naxes[0].hist(salarios, bins=20, color="steelblue", edgecolor="white", alpha=0.8)\naxes[0].axvline(salarios.mean(), color="red", linestyle="--", label=f"Média: R${salarios.mean():.0f}")\naxes[0].set_title("Distribuição de Salários")\naxes[0].set_xlabel("Salário (R$)")\naxes[0].set_ylabel("Frequência")\naxes[0].legend()\n\n# Scatter\nsc = axes[1].scatter(idade, salarios, c=bonus, cmap="RdYlGn",\n                     alpha=0.6, s=50)\nplt.colorbar(sc, ax=axes[1], label="Bônus (R$)")\naxes[1].set_title("Salário × Idade")\naxes[1].set_xlabel("Idade")\naxes[1].set_ylabel("Salário (R$)")\n\nplt.tight_layout()\nplt.show()',
        codeExplanation: 'bins=20 divide o histograma em 20 faixas. axvline() traça uma linha vertical (útil para mostrar médias). No scatter, cmap="RdYlGn" usa uma paleta de cores para uma terceira variável.',
      },
      {
        title: 'Pandas + Matplotlib',
        body: 'Pandas tem integração direta com Matplotlib via df.plot() — ótimo para análises rápidas:',
        code: 'import pandas as pd\nimport matplotlib.pyplot as plt\n\ndf = pd.DataFrame({\n    "mes":    ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],\n    "TI":     [42, 45, 43, 48, 51, 50],\n    "RH":     [31, 30, 33, 32, 29, 34],\n    "Vendas": [58, 62, 55, 70, 74, 68],\n}).set_index("mes")\n\n# Plot direto do DataFrame\ndf.plot(kind="line", marker="o", figsize=(10, 5))\nplt.title("Headcount por Departamento")\nplt.ylabel("Número de Funcionários")\nplt.grid(True, alpha=0.3)\nplt.tight_layout()\nplt.show()\n\n# Barras empilhadas\ndf.plot(kind="bar", stacked=True, figsize=(10, 5), colormap="tab10")\nplt.title("Headcount Total Empilhado")\nplt.tight_layout()\nplt.show()',
        tryItCode: '# Visualize dados como grafico de barras em ASCII\nvendas = {"Jan": 85, "Fev": 92, "Mar": 78, "Abr": 105, "Mai": 112, "Jun": 98}\n\nmax_val = max(vendas.values())\nescala = 30  # largura maxima da barra\n\nprint("=== GRAFICO DE VENDAS ===")\nprint()\nfor mes, val in vendas.items():\n    tamanho = int(val / max_val * escala)\n    barra = "█" * tamanho\n    print(f"{mes:>4} | {barra:<{escala}} {val}")\n\nprint()\nprint(f"Maior: {max(vendas, key=vendas.get)} ({max(vendas.values())})")\nprint(f"Menor: {min(vendas, key=vendas.get)} ({min(vendas.values())})")',
        tryItPrompt: 'Adicione mais meses ou mude os valores e observe como o gráfico se adapta.',
      },
    ],
    summary: [
      'plt.subplots() cria figura e eixos; ax.plot/bar/hist/scatter plota os dados',
      'Sempre adicione títulos, rótulos de eixo e legendas — gráficos sem contexto são inúteis',
      'Histograma → distribuição de uma variável; Scatter → relação entre duas variáveis',
      'df.plot(kind="line/bar/hist") integra Pandas ao Matplotlib para análises rápidas',
      'plt.savefig() salva o gráfico; plt.tight_layout() evita sobreposição de elementos',
    ],
  },

  'py-m4-cleaning': {
    id: 'py-m4-cleaning', moduleId: 4,
    objectives: [
      'Identificar e tratar valores nulos em um DataFrame',
      'Remover duplicatas e corrigir tipos de dados',
      'Padronizar strings e tratar outliers',
    ],
    sections: [
      {
        title: 'Por que Limpeza de Dados?',
        body: 'Em projetos reais, 60 a 80% do tempo de um analista de dados é gasto limpando dados. Dados sujos geram análises erradas — e decisões erradas custam caro.\n\nProblemas mais comuns:\n- **Valores nulos (NaN)**: campos não preenchidos\n- **Duplicatas**: a mesma linha registrada duas vezes\n- **Tipos errados**: número gravado como texto, data como string\n- **Inconsistências de texto**: "São Paulo", "SP", "sao paulo" representam a mesma cidade\n- **Outliers**: valores impossíveis (idade = 999, salário = -500)',
        code: 'import pandas as pd\nimport numpy as np\n\n# Dataset propositalmente sujo\ndf = pd.DataFrame({\n    "nome":    ["Ana", "Bruno", None, "Ana", "Elena"],\n    "idade":   [25, None, 30, 25, 999],\n    "salario": ["3500", "4200", "5100", "3500", None],\n    "cidade":  ["são paulo", "SP", "Rio de Janeiro", "São Paulo", "RIO DE JANEIRO"],\n})\n\nprint(df)\nprint("\\nValores nulos por coluna:")\nprint(df.isnull().sum())',
        codeExplanation: 'isnull() retorna True para cada célula nula. .sum() conta os True por coluna. isnull().sum().sum() conta o total de nulos no DataFrame inteiro.',
        tip: 'Execute df.info() logo no início de toda análise — ele mostra o número de valores não-nulos por coluna, revelando rapidamente onde estão os problemas.',
      },
      {
        title: 'Tratando Valores Nulos',
        body: 'Você tem três opções para lidar com nulos: remover, preencher ou ignorar.',
        code: 'import pandas as pd\nimport numpy as np\n\ndf = pd.DataFrame({\n    "produto": ["A", "B", "C", "D", "E"],\n    "preco":   [100, None, 150, None, 200],\n    "vendas":  [50, 30, None, 80, 60],\n})\n\n# 1. REMOVER linhas com qualquer nulo\ndf_sem_nulos = df.dropna()\n\n# 2. REMOVER apenas se a coluna específica for nula\ndf_sem_preco_nulo = df.dropna(subset=["preco"])\n\n# 3. PREENCHER com um valor fixo\ndf_zero = df.fillna(0)\n\n# 4. PREENCHER com a média da coluna\ndf_media = df.copy()\ndf_media["preco"]  = df["preco"].fillna(df["preco"].mean())\ndf_media["vendas"] = df["vendas"].fillna(df["vendas"].median())\n\n# 5. PREENCHER com o valor anterior (forward fill) — útil em séries temporais\ndf_ffill = df.fillna(method="ffill")\n\nprint(df_media)',
        warning: 'Nunca remova nulos automaticamente sem analisar o padrão. Se todos os clientes acima de R$ 10.000 não informaram renda, remover essas linhas cria um viés grave na análise.',
      },
      {
        title: 'Duplicatas e Tipos de Dados',
        body: 'Linhas duplicadas distorcem médias, somas e contagens. Tipos errados impedem operações matemáticas.',
        code: 'import pandas as pd\n\ndf = pd.DataFrame({\n    "id":      [1, 2, 2, 3, 4, 4],\n    "nome":    ["Ana", "Bruno", "Bruno", "Carla", "Diego", "Diego"],\n    "salario": ["3500.00", "4200,50", "4200,50", "5100.00", "6200.00", "6200.00"],\n})\n\n# Verificar duplicatas\nprint("Duplicatas encontradas:", df.duplicated().sum())\n\n# Remover duplicatas — mantém a primeira ocorrência\ndf = df.drop_duplicates()\n\n# Corrigir tipo: string → float\n# Substituir vírgula decimal por ponto (padrão BR)\ndf["salario"] = df["salario"].str.replace(",", ".").astype(float)\n\nprint(df.dtypes)\nprint(df)\nprint("\\nMédia salarial: R$", df["salario"].mean())',
        codeExplanation: 'drop_duplicates() mantém a primeira ocorrência por padrão. Use keep="last" para manter a última, ou keep=False para remover todas as duplicatas.',
      },
      {
        title: 'Padronizando Strings',
        body: 'Inconsistências de texto são um problema clássico em dados do mundo real:',
        code: 'import pandas as pd\n\ndf = pd.DataFrame({\n    "cidade": ["são paulo", "SP", "São Paulo", "SÃO PAULO", "Rio", "RIO DE JANEIRO", "Rio de Janeiro"],\n    "estado": [" SP ", "SP", "sp", "SP", "RJ", " RJ", "rj"],\n})\n\n# Padronizar: remover espaços, maiúsculas\ndf["estado"] = df["estado"].str.strip().str.upper()\n\n# Substituir abreviações\nmapeamento_cidade = {\n    "SP": "São Paulo", "são paulo": "São Paulo", "SÃO PAULO": "São Paulo",\n    "Rio": "Rio de Janeiro", "RIO DE JANEIRO": "Rio de Janeiro",\n}\ndf["cidade"] = df["cidade"].replace(mapeamento_cidade)\n\n# .str.title() coloca primeira letra de cada palavra em maiúscula\ndf["cidade"] = df["cidade"].str.title()\n\nprint(df)',
        tip: 'Para mapeamentos grandes, use um arquivo CSV com a tabela de equivalências e carregue-o como dicionário. Isso permite manter o mapeamento separado do código.',
        tryItCode: '# Limpeza de dados com Python puro\ndados_brutos = [\n    {"nome": "  ANA SILVA  ", "salario": "3.500,00", "cidade": "sao paulo"},\n    {"nome": "Bruno Costa",   "salario": "4200.50",  "cidade": "SP"},\n    {"nome": "  CARLA  ",     "salario": "5.100,00", "cidade": "Rio"},\n    {"nome": "Bruno Costa",   "salario": "4200.50",  "cidade": "SP"},  # duplicata\n]\n\ncidades = {"sp": "Sao Paulo", "sao paulo": "Sao Paulo",\n           "rio": "Rio de Janeiro"}\n\nregistros_vistos = set()\ndados_limpos = []\n\nfor d in dados_brutos:\n    nome = d["nome"].strip().title()\n    cidade = cidades.get(d["cidade"].lower(), d["cidade"].title())\n    # Limpar salario: remover pontos, trocar virgula por ponto\n    sal_str = d["salario"].replace(".", "").replace(",", ".")\n    salario = float(sal_str)\n\n    chave = (nome, salario)  # detectar duplicata\n    if chave not in registros_vistos:\n        registros_vistos.add(chave)\n        dados_limpos.append({"nome": nome, "salario": salario, "cidade": cidade})\n\nprint("=== DADOS LIMPOS ===")\nfor r in dados_limpos:\n    print(f"{r[\'nome\']:15} | R$ {r[\'salario\']:>8.2f} | {r[\'cidade\']}")',
        tryItPrompt: 'Adicione mais registros com inconsistências e veja como o código os trata.',
      },
    ],
    summary: [
      'isnull().sum() identifica nulos; dropna() remove, fillna() preenche',
      'Prefira fillna(média/mediana) a fillna(0) para não distorcer estatísticas',
      'drop_duplicates() remove linhas repetidas — verifique antes com duplicated().sum()',
      'Corrija tipos com astype(); use str.replace() para padronizar valores antes',
      'Padronize strings com str.strip(), str.upper(), str.title() e replace() com dicionário',
    ],
  },

  'py-m4-eda': {
    id: 'py-m4-eda', moduleId: 4,
    objectives: [
      'Entender o processo de Análise Exploratória de Dados (EDA)',
      'Calcular e interpretar correlações entre variáveis',
      'Detectar outliers e analisar a distribuição dos dados',
      'Executar uma EDA completa em um dataset de exemplo',
    ],
    sections: [
      {
        title: 'O que é EDA?',
        body: 'EDA (Exploratory Data Analysis) é o processo de investigar um dataset antes de qualquer modelagem ou conclusão. O objetivo é entender a estrutura dos dados, identificar padrões, detectar problemas e formular hipóteses.\n\nFoi popularizada pelo estatístico John Tukey nos anos 1970. A filosofia central: "Deixe os dados falarem antes de impor um modelo."\n\nUma EDA típica segue este roteiro:\n1. **Inspeção inicial**: shape, tipos, primeiras linhas\n2. **Estatísticas descritivas**: média, mediana, desvio\n3. **Análise de nulos**: onde estão e o que significam\n4. **Distribuições**: como cada variável se distribui\n5. **Relações**: correlações entre variáveis\n6. **Outliers**: identificar e decidir o que fazer',
        code: '# ─── PASSO 1: Inspeção inicial ───────────────────────────────────\nimport pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# Carregue seu dataset real aqui\n# df = pd.read_csv("vendas.csv")\n\n# Para demonstração, criamos um dataset simulado\nnp.random.seed(42)\nn = 200\ndf = pd.DataFrame({\n    "idade":    np.random.randint(18, 65, n),\n    "salario":  np.random.normal(6000, 2000, n).clip(1800, 20000).round(2),\n    "compras":  np.random.poisson(4, n),\n    "ticket":   np.random.exponential(250, n).round(2),\n    "depto":    np.random.choice(["TI", "RH", "Vendas", "Financeiro"], n),\n    "ativo":    np.random.choice([True, False], n, p=[0.85, 0.15]),\n})\n\nprint("Shape:", df.shape)\nprint(df.head())\nprint("\\nTipos:"); print(df.dtypes)',
        codeExplanation: 'clip(1800, 20000) garante que os salários fiquem entre R$ 1.800 e R$ 20.000 — simulando um limite realista. poisson() gera número de eventos discretos (compras por mês).',
      },
      {
        title: 'Estatísticas Descritivas',
        body: 'describe() é o ponto de partida para entender a distribuição numérica. Compare média e mediana — se forem muito diferentes, a distribuição é assimétrica.',
        code: 'import pandas as pd\nimport numpy as np\n\n# ... (df criado como no passo anterior)\nnp.random.seed(42); n = 200\ndf = pd.DataFrame({\n    "salario": np.random.normal(6000, 2000, n).clip(1800, 20000).round(2),\n    "ticket":  np.random.exponential(250, n).round(2),\n    "compras": np.random.poisson(4, n),\n})\n\n# Estatísticas completas\nprint(df.describe().round(2))\n\n# Verificar assimetria (skewness) e curtose (kurtosis)\nprint("\\nAssimetria (skew):")\nprint(df.skew().round(3))\n\nprint("\\nCurtose:")\nprint(df.kurtosis().round(3))',
        tip: 'Skewness > 0: cauda direita (ex: renda). Skewness < 0: cauda esquerda. Valores > 1 ou < -1 indicam assimetria significativa. Lembre-se: outliers puxam a média para longe da mediana.',
      },
      {
        title: 'Análise de Correlação',
        body: 'Correlação mede a força e direção da relação linear entre duas variáveis numéricas. Varia de -1 (inversa perfeita) a +1 (direta perfeita). Próximo de 0: sem relação linear.',
        code: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42); n = 200\nidade   = np.random.randint(22, 60, n)\nsalario = idade * 150 + np.random.normal(0, 800, n) + 1000\nexper   = (idade - 22) * 0.7 + np.random.normal(0, 1, n)\n\ndf = pd.DataFrame({"idade": idade, "salario": salario, "experiencia": exper})\n\n# Matriz de correlação\ncorr = df.corr().round(3)\nprint("Matriz de correlação:")\nprint(corr)\n\n# Heatmap com Matplotlib\nfig, ax = plt.subplots(figsize=(6, 5))\nim = ax.imshow(corr, cmap="RdYlGn", vmin=-1, vmax=1)\nplt.colorbar(im, ax=ax)\n\ncols = corr.columns\nax.set_xticks(range(len(cols))); ax.set_xticklabels(cols, rotation=30)\nax.set_yticks(range(len(cols))); ax.set_yticklabels(cols)\n\nfor i in range(len(cols)):\n    for j in range(len(cols)):\n        ax.text(j, i, str(corr.iloc[i, j]), ha="center", va="center", fontweight="bold")\n\nax.set_title("Heatmap de Correlação")\nplt.tight_layout()\nplt.show()',
        warning: 'Correlação não implica causalidade. Vender mais sorvete e mais afogamentos têm correlação alta — ambos sobem no verão. Sempre procure a variável confundidora antes de concluir causalidade.',
      },
      {
        title: 'Detectando Outliers',
        body: 'Outliers são valores extremos que podem distorcer análises. Os dois métodos mais comuns: IQR (robusto) e Z-score (assume distribuição normal).',
        code: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\ndf = pd.DataFrame({"salario": np.append(\n    np.random.normal(6000, 1500, 97),  # dados normais\n    [500, 45000, -200]                 # outliers injetados\n)})\n\n# ─── Método 1: IQR ─────────────────────────────────────────────\nQ1  = df["salario"].quantile(0.25)\nQ3  = df["salario"].quantile(0.75)\nIQR = Q3 - Q1\nlim_inf = Q1 - 1.5 * IQR\nlim_sup = Q3 + 1.5 * IQR\n\noutliers_iqr = df[(df["salario"] < lim_inf) | (df["salario"] > lim_sup)]\nprint(f"IQR — limites: [{lim_inf:.0f}, {lim_sup:.0f}]")\nprint(f"Outliers detectados: {len(outliers_iqr)}")\nprint(outliers_iqr)\n\n# ─── Método 2: Z-score ─────────────────────────────────────────\nzscore = (df["salario"] - df["salario"].mean()) / df["salario"].std()\noutliers_z = df[zscore.abs() > 3]\nprint(f"\\nZ-score — outliers: {len(outliers_z)}")',
        codeExplanation: 'IQR Method: qualquer valor além de 1,5× o intervalo interquartil é outlier. Z-score: valores a mais de 3 desvios padrão da média. IQR é mais robusto para distribuições assimétricas.',
      },
      {
        title: 'EDA Completa — Mini Projeto',
        body: 'Aqui está o fluxo completo de uma EDA, do carregamento à conclusão:',
        code: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# ─── Dataset: vendas de um e-commerce ─────────────────────────\nnp.random.seed(0); n = 300\ndf = pd.DataFrame({\n    "categoria":  np.random.choice(["Eletrônicos","Roupas","Casa","Livros"], n, p=[0.3,0.35,0.2,0.15]),\n    "valor":      np.random.exponential(180, n).round(2) + 20,\n    "frete":      np.random.choice([0, 15, 25, 40], n, p=[0.4,0.3,0.2,0.1]),\n    "avaliacao":  np.random.choice([1,2,3,4,5], n, p=[0.05,0.08,0.15,0.42,0.30]),\n    "devolvido":  np.random.choice([False, True], n, p=[0.88, 0.12]),\n})\n\n# 1. Inspeção\nprint("Shape:", df.shape)\nprint(df.describe().round(2))\n\n# 2. Distribuição de vendas por categoria\nvendas_cat = df.groupby("categoria")["valor"].agg(["count","mean","sum"]).round(2)\nvendas_cat.columns = ["Pedidos", "Ticket Médio", "Receita Total"]\nvendas_cat = vendas_cat.sort_values("Receita Total", ascending=False)\nprint("\\nVendas por categoria:")\nprint(vendas_cat)\n\n# 3. Taxa de devolução por categoria\ndev_cat = df.groupby("categoria")["devolvido"].mean().round(3) * 100\nprint("\\nTaxa de devolução (%):")\nprint(dev_cat.sort_values(ascending=False))\n\n# 4. Correlação avaliação × valor\ncorr_av = df["avaliacao"].corr(df["valor"])\nprint(f"\\nCorrelação avaliação × valor: {corr_av:.3f}")',
        tryItCode: '# EDA simplificada com Python puro\nimport random\nrandom.seed(42)\n\ncategorias = ["Eletronicos", "Roupas", "Casa", "Livros"]\npedidos = [\n    {"cat": random.choice(categorias),\n     "valor": round(random.uniform(20, 500), 2),\n     "avaliacao": random.choices([1,2,3,4,5], weights=[5,8,15,42,30])[0],\n     "devolvido": random.random() < 0.12}\n    for _ in range(200)\n]\n\n# Receita por categoria\nreceita = {}\ncontagem = {}\nfor p in pedidos:\n    c = p["cat"]\n    receita[c]  = receita.get(c, 0)  + p["valor"]\n    contagem[c] = contagem.get(c, 0) + 1\n\nprint("=== RECEITA POR CATEGORIA ===")\nfor cat in sorted(receita, key=receita.get, reverse=True):\n    ticket = receita[cat] / contagem[cat]\n    print(f"{cat:15} | Pedidos: {contagem[cat]:>3} | Receita: R${receita[cat]:>8.2f} | Ticket: R${ticket:>6.2f}")\n\n# Taxa de devolucao\ndevolvidos = {c: 0 for c in categorias}\nfor p in pedidos:\n    if p["devolvido"]: devolvidos[p["cat"]] += 1\n\nprint("\\n=== TAXA DE DEVOLUCAO ===")\nfor cat in categorias:\n    taxa = devolvidos[cat] / contagem[cat] * 100\n    print(f"{cat:15} | {taxa:.1f}%")',
        tryItPrompt: 'Calcule também a avaliação média por categoria e identifique qual tem a melhor e a pior.',
      },
    ],
    summary: [
      'EDA segue 6 etapas: inspeção, estatísticas, nulos, distribuições, correlações, outliers',
      'Compare sempre média vs mediana — grande diferença indica assimetria ou outliers',
      'describe() + info() são os dois primeiros comandos de qualquer EDA',
      'Correlação mede relação linear (−1 a +1); não implica causalidade',
      'IQR é o método mais robusto para detectar outliers em dados assimétricos',
      'EDA não tem resposta certa — é uma conversa com os dados para guiar hipóteses',
    ],
  },
};
