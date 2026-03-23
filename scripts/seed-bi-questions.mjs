/**
 * Seed: insere as 29 questoes da VA de BI no banco de questoes (subject: 'bi')
 * Uso:
 *   MONGODB_URI="mongodb+srv://..." node scripts/seed-bi-questions.mjs
 * Ou com vercel env:
 *   vercel env pull .env.local && node scripts/seed-bi-questions.mjs
 */

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env.local');
if (existsSync(envPath)) dotenv.config({ path: envPath });
else dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI nao encontrada. Defina a variavel de ambiente ou crie .env.local');
  process.exit(1);
}

const now = new Date().toISOString();

// Gabarito Versao A: indice 0=A, 1=B, 2=C, 3=D
const gabarito = [2,2,1,0,0,0,1,0,3,3,3,0,2,1,2,2,1,3,3,1,2,1,0,0,0,2,0,1,3];

const questions = [
  {
    title: 'Q1 — Uso de dados: Spotify',
    description: 'Empresas e aplicativos utilizam dados para diversas finalidades. Qual das alternativas abaixo MELHOR descreve o motivo pelo qual o Spotify utiliza dados, de acordo com o material?',
    type: 'multiple-choice',
    options: [
      'Para registrar o desempenho em disciplinas e identificar dificuldades educacionais.',
      'Para analisar o tempo de visualização de vídeos e recomendar novos conteúdos.',
      'Para criar playlists personalizadas com base nos hábitos de escuta do usuário.',
      'Para identificar a localização do usuário e sugerir rotas de deslocamento.',
    ],
    tags: ['Dados', 'Aplicações'],
    difficulty: 'facil',
  },
  {
    title: 'Q2 — Ética como vantagem competitiva',
    description: 'O documento enfatiza que a ética é uma vantagem competitiva no mercado de trabalho em dados. Qual das afirmações abaixo melhor explica por que a ética é crucial para o futuro profissional, de acordo com o material?',
    type: 'multiple-choice',
    options: [
      'A ética é importante apenas para evitar problemas legais, não impactando diretamente o crescimento da carreira.',
      'A ética garante que o profissional será promovido rapidamente, independentemente de suas habilidades técnicas.',
      'A prática ética constrói confiança, abre portas profissionais, atrai empresas que valorizam a integridade e prepara para as exigências regulatórias do mercado.',
      'Profissionais éticos são valorizados apenas em pequenas empresas, não em grandes corporações.',
    ],
    tags: ['Ética', 'Carreira'],
    difficulty: 'medio',
  },
  {
    title: 'Q3 — Indentação no Python',
    description: 'No contexto da "Sintaxe Básica do Python", a indentação é descrita como uma "característica fundamental". Qual das seguintes afirmações melhor descreve a importância e a consequência da indentação no Python, em contraste com outras linguagens de programação que utilizam chaves ou delimitadores explícitos?',
    type: 'multiple-choice',
    options: [
      'A indentação é utilizada para definir comentários de múltiplas linhas e não tem impacto na estrutura lógica do programa, que é determinada por palavras-chave como "begin" e "end".',
      'A indentação é uma característica fundamental que define blocos de código, substituindo o uso de chaves ou outros delimitadores, e é obrigatória para a correta interpretação e execução do programa.',
      'No Python, a indentação é usada exclusivamente para otimização de performance, permitindo ao interpretador pré-compilar seções de código identadas de forma mais eficiente.',
      'A indentação no Python é opcional e serve apenas para melhorar a estética do código, sem afetar sua execução, similar ao uso de chaves em C++ para blocos de código.',
    ],
    tags: ['Python', 'Sintaxe'],
    difficulty: 'medio',
  },
  {
    title: 'Q4 — Características de Dados Estruturados',
    description: 'Qual das seguintes características NÃO pertence aos Dados Estruturados, conforme descrito no documento?',
    type: 'multiple-choice',
    options: [
      'Sem formato predefinido.',
      'Formato definido e previsível.',
      'Ideais para análises numéricas.',
      'Armazenados em bancos de dados relacionais.',
    ],
    tags: ['Dados Estruturados'],
    difficulty: 'facil',
  },
  {
    title: 'Q5 — Distinção entre Dados e Informação',
    description: 'De acordo com o material apresentado, qual a principal distinção entre Dados e Informação?',
    type: 'multiple-choice',
    options: [
      'Dados são informações brutas e sem contexto, enquanto informação é o dado com contexto e significado.',
      'Informação é um conjunto de dados não estruturados, enquanto dados são estruturados.',
      'Dados são sempre numéricos, enquanto informação é sempre textual.',
      'Não há diferença significativa; os termos são sinônimos e podem ser usados de forma intercambiável.',
    ],
    tags: ['Dados', 'Informação'],
    difficulty: 'facil',
  },
  {
    title: 'Q6 — Análise de dados sobre produtos',
    description: 'O documento ressalta a importância dos dados na tomada de decisões em diversos setores. Em um cenário empresarial, qual a principal vantagem de analisar dados sobre produtos, conforme mencionado?',
    type: 'multiple-choice',
    options: [
      'Para otimizar o estoque, identificar produtos com alta saída e pontos fracos.',
      'Para entender a preferência dos clientes e oferecer sugestões personalizadas.',
      'Apenas para gerar relatórios anuais para acionistas.',
      'Exclusivamente para monitorar a concorrência e copiar suas estratégias.',
    ],
    tags: ['Tomada de Decisão', 'Negócios'],
    difficulty: 'facil',
  },
  {
    title: 'Q7 — Elementos da Data Science',
    description: 'Data Science é uma área multidisciplinar que combina tecnologia, estatística e conhecimento de negócio. Qual das opções abaixo NÃO representa um dos elementos cruciais da Data Science, conforme descrito no material?',
    type: 'multiple-choice',
    options: [
      'Análise estatística para encontrar padrões.',
      'Capacidade de identificar falhas em sistemas de segurança.',
      'Tecnologia e programação para processar dados.',
      'Conhecimento do negócio para aplicar soluções.',
    ],
    tags: ['Data Science'],
    difficulty: 'medio',
  },
  {
    title: 'Q8 — Python vs Java vs JavaScript',
    description: 'Ao comparar o Python com outras linguagens como Java e JavaScript, o documento aponta distinções claras. Qual das seguintes opções sintetiza corretamente a principal vantagem do Python em relação ao Java e ao JavaScript, destacando seus nichos de mercado e características chave?',
    type: 'multiple-choice',
    options: [
      'Python é valorizado pela sua simplicidade e desenvolvimento rápido, sendo forte em backend, ciência de dados, IA e automação, enquanto Java é robusto para corporativo/mobile e JavaScript domina o frontend e Node.js.',
      'A principal vantagem do Python é seu controle de memória de baixo nível, permitindo otimizações que Java e JavaScript não conseguem alcançar, o que o torna ideal para jogos e sistemas embarcados.',
      'Python oferece uma performance superior em aplicações móveis e corporativas devido à sua máquina virtual otimizada, enquanto Java e JavaScript são restritos a desenvolvimento web.',
      'Java é mais versátil para scripts de automação e análise de dados complexos, e JavaScript é a linguagem preferida para prototipagem rápida de alto nível, superando o Python em ambos.',
    ],
    tags: ['Python', 'Linguagens'],
    difficulty: 'medio',
  },
  {
    title: 'Q9 — Área que processa grandes volumes',
    description: 'No contexto das quatro áreas de dados (Data Science, Data Analytics, Big Data, Business Intelligence), qual delas tem como foco principal "processar grandes volumes" de dados?',
    type: 'multiple-choice',
    options: [
      'Business Intelligence',
      'Data Analytics',
      'Data Science',
      'Big Data',
    ],
    tags: ['Big Data', 'Áreas de Dados'],
    difficulty: 'facil',
  },
  {
    title: 'Q10 — Python 2 vs Python 3',
    description: 'Considerando a evolução histórica do Python, qual foi o marco mais significativo que diferenciou o Python 3 de seu predecessor, Python 2, tornando-o a versão recomendada para todos os projetos atuais, especialmente no que tange à manipulação de strings e caracteres especiais?',
    type: 'multiple-choice',
    options: [
      'A migração do modelo de gerenciamento de memória do Python 2, baseado em contagem de referências, para um novo sistema de coleta de lixo no Python 3.',
      'A introdução de classes abstratas e interfaces no Python 3, que não existiam no Python 2, otimizando a arquitetura de grandes sistemas.',
      'A inclusão de uma máquina virtual Just-In-Time (JIT) no Python 3, que compilava o código em tempo de execução para otimizar a performance.',
      'O tratamento robusto de Unicode por padrão e a manipulação consistente de strings e bytes, que solucionaram problemas de compatibilidade e internacionalização presentes no Python 2.',
    ],
    tags: ['Python', 'Histórico'],
    difficulty: 'medio',
  },
  {
    title: 'Q11 — Relação entre áreas de dados',
    description: 'O documento enfatiza que todas as áreas ligadas a dados se conectam e se complementam. Qual das afirmações abaixo melhor descreve a relação entre Data Science, Data Analytics, Big Data e Business Intelligence, conforme o slide "O que você precisa guardar desta aula"?',
    type: 'multiple-choice',
    options: [
      'Apenas Data Science e Big Data são essenciais, enquanto as outras são subconjuntos menos relevantes.',
      'São áreas distintas e independentes, com pouca interseção em suas metodologias e objetivos.',
      'São etapas sequenciais de um processo único, onde uma área sempre precede a outra.',
      'Elas se complementam e formam um ecossistema de dados, cada uma com seu foco específico, mas trabalhando em conjunto.',
    ],
    tags: ['Ecossistema de Dados'],
    difficulty: 'medio',
  },
  {
    title: 'Q12 — Dicionário Python: atualizar e adicionar campo',
    description: 'Em um pipeline de BI, você recebe um dicionário representando um produto: `produto = {\'nome\': \'Notebook\', \'preco\': 4500, \'estoque\': 10}`. Qual das alternativas apresenta a forma correta de atualizar o preço para 4800 e adicionar um novo campo chamado "categoria"?',
    type: 'multiple-choice',
    options: [
      "produto['preco'] = 4800; produto['categoria'] = 'Eletrônicos'",
      "produto.preco = 4800; produto.categoria = 'Eletrônicos'",
      "set(produto['preco'] = 4800); set(produto['categoria'] = 'Eletrônicos')",
      "produto.update('preco', 4800); produto.add('categoria', 'Eletrônicos')",
    ],
    tags: ['Python', 'Dicionários'],
    difficulty: 'medio',
  },
  {
    title: 'Q13 — Era dos Dados',
    description: 'O documento afirma que "Vivemos na Era dos Dados". Qual a implicação dessa afirmação para o dia a dia das pessoas, conforme descrito?',
    type: 'multiple-choice',
    options: [
      'Dados são relevantes apenas para profissionais de tecnologia, não para o público em geral.',
      'Apenas grandes corporações e governos têm acesso e utilizam dados.',
      'Praticamente todas as ações digitais geram e consomem dados constantemente, muitas vezes sem percepção.',
      'A maioria das pessoas não interage com dados em seu dia a dia.',
    ],
    tags: ['Era dos Dados'],
    difficulty: 'facil',
  },
  {
    title: 'Q14 — Importação do Pandas',
    description: 'Considere que você está importando a biblioteca Pandas para manipular um arquivo CSV em um projeto de BI. Qual é o comando correto e mais utilizado pela comunidade para realizar essa importação?',
    type: 'multiple-choice',
    options: [
      'load pandas as pd',
      'import pandas as pd',
      'require pandas',
      'using pandas as pd',
    ],
    tags: ['Python', 'Pandas'],
    difficulty: 'facil',
  },
  {
    title: 'Q15 — Mensagem final sobre dados',
    description: 'Qual das seguintes afirmações sobre a importância de entender dados está alinhada com a "Mensagem final" apresentada no material?',
    type: 'multiple-choice',
    options: [
      'A principal importância dos dados reside na sua capacidade de gerar lucro para empresas, sem impacto social.',
      'Entender dados é uma habilidade restrita a cientistas de dados e não tem relevância para outras profissões.',
      'É essencial para compreender o funcionamento do mundo digital e dominar o futuro, além de ser valorizado no mercado de trabalho.',
      'A importância dos dados é um conceito passageiro e logo será substituído por novas tecnologias.',
    ],
    tags: ['Dados', 'Mercado de Trabalho'],
    difficulty: 'facil',
  },
  {
    title: 'Q16 — List comprehension com filtro',
    description: 'Ao trabalhar com o processamento de grandes volumes de dados, muitas vezes precisamos filtrar informações. Qual é a saída do seguinte código?\n\nlista = [10, 25, 40, 55]\nresultado = [x for x in lista if x > 30]\nprint(resultado)',
    type: 'multiple-choice',
    options: [
      '[True, True, False, False]',
      '[10, 25]',
      '[40, 55]',
      '[30, 40, 55]',
    ],
    tags: ['Python', 'List Comprehension'],
    difficulty: 'medio',
    codeSnippet: 'lista = [10, 25, 40, 55]\nresultado = [x for x in lista if x > 30]\nprint(resultado)',
  },
  {
    title: 'Q17 — Criador do Python',
    description: 'A linguagem Python foi criada por Guido van Rossum.',
    type: 'true-false',
    options: ['Falso', 'Verdadeiro'],
    tags: ['Python', 'Histórico'],
    difficulty: 'facil',
  },
  {
    title: 'Q18 — Papel dos dados nas redes sociais',
    description: 'De acordo com o material, qual o papel dos dados nas redes sociais como Instagram, TikTok e YouTube?',
    type: 'multiple-choice',
    options: [
      'Principalmente para monetizar o conteúdo através de vendas diretas de produtos.',
      'Exclusivamente para garantir a segurança dos dados pessoais dos usuários.',
      'Apenas para registrar a quantidade de usuários ativos diariamente.',
      'Para entender o comportamento do usuário, personalizar o feed e mostrar anúncios relevantes.',
    ],
    tags: ['Dados', 'Redes Sociais'],
    difficulty: 'facil',
  },
  {
    title: 'Q19 — Função print() em Python',
    description: 'No contexto da análise de dados com Python, qual das seguintes funções é utilizada para exibir uma mensagem ou o valor de uma variável no console?',
    type: 'multiple-choice',
    options: [
      'display()',
      'show()',
      'output()',
      'print()',
    ],
    tags: ['Python', 'Funções'],
    difficulty: 'facil',
  },
  {
    title: 'Q20 — Dados Não Estruturados: complexidade',
    description: 'No contexto de Dados Não Estruturados, o que os torna mais complexos de analisar em comparação com dados estruturados?',
    type: 'multiple-choice',
    options: [
      'Sua incapacidade de serem armazenados em qualquer sistema.',
      'A ausência de um formato fixo e padrão de organização.',
      'A necessidade de serem convertidos em dados estruturados antes de qualquer análise.',
      'Eles são exclusivamente compostos por números, dificultando a interpretação textual.',
    ],
    tags: ['Dados Não Estruturados'],
    difficulty: 'medio',
  },
  {
    title: 'Q21 — Exemplo de dado estruturado educacional',
    description: 'Qual dos seguintes exemplos representa um DADO ESTRUTURADO no contexto educacional, de acordo com o material?',
    type: 'multiple-choice',
    options: [
      'Uma gravação em áudio de uma aula.',
      'Um ensaio escrito livremente por um aluno.',
      'O boletim de notas de um aluno, com disciplinas e médias em colunas definidas.',
      'Uma foto da turma de formatura em alta resolução.',
    ],
    tags: ['Dados Estruturados', 'Educação'],
    difficulty: 'facil',
  },
  {
    title: 'Q22 — Bibliotecas para sistema de recomendação com imagem',
    description: 'O documento lista diversas "Bibliotecas Python Mais Populares" essenciais para diferentes áreas. Se um desenvolvedor estivesse focado em criar um sistema de recomendação complexo que envolvesse reconhecimento de imagem, qual combinação de bibliotecas seria mais apropriada para iniciar o projeto, considerando as informações fornecidas?',
    type: 'multiple-choice',
    options: [
      'NumPy e Matplotlib, devido à sua capacidade de manipulação numérica e visualização de dados, respectivamente.',
      'TensorFlow e Scikit-learn, que são frameworks robustos para aprendizado de máquina, redes neurais e ML clássico, essenciais para sistemas de recomendação e reconhecimento de imagem.',
      'Django e Requests, pois são ideais para desenvolvimento web e comunicação com APIs externas.',
      'Pandas e Requests, excelentes para análise e manipulação de dados tabulares e requisições HTTP.',
    ],
    tags: ['Python', 'Machine Learning', 'Bibliotecas'],
    difficulty: 'medio',
  },
  {
    title: 'Q23 — Atividade prática de análise de dados',
    description: 'O documento sugere uma atividade prática para analisar dados do cotidiano digital. Qual o principal objetivo dessa atividade?',
    type: 'multiple-choice',
    options: [
      'Identificar padrões e entender como seus próprios dados revelam informações sobre você.',
      'Aprender a programar algoritmos complexos de análise de dados.',
      'Desenvolver um novo aplicativo que colete dados de forma mais eficiente.',
      'Comparar seus hábitos digitais com os de outras pessoas para determinar quem é mais produtivo.',
    ],
    tags: ['Dados', 'Análise Prática'],
    difficulty: 'facil',
  },
  {
    title: 'Q24 — O que NÃO é característica do BI',
    description: 'O Business Intelligence (BI) é fundamental para a tomada de decisões estratégicas nas empresas. Qual das seguintes atividades NÃO é uma característica principal do trabalho de BI, conforme o material?',
    type: 'multiple-choice',
    options: [
      'Criação de modelos preditivos complexos para o futuro.',
      'Utilização de indicadores de desempenho para análise.',
      'Criação de dashboards interativos para monitoramento.',
      'Geração de relatórios automáticos sobre o desempenho.',
    ],
    tags: ['Business Intelligence'],
    difficulty: 'medio',
  },
  {
    title: 'Q25 — Soma de lista em Python',
    description: 'Dada a lista de faturamento semanal `vendas = [1200, 2500, 1800, 3100]`, qual comando Python retornaria corretamente a soma total deste faturamento para um relatório de BI?',
    type: 'multiple-choice',
    options: [
      'sum(vendas)',
      'vendas.total()',
      'aggregate(vendas)',
      'vendas.sum()',
    ],
    tags: ['Python', 'Funções'],
    difficulty: 'facil',
    codeSnippet: 'vendas = [1200, 2500, 1800, 3100]',
  },
  {
    title: 'Q26 — Atividades do Cientista de Dados',
    description: 'O documento descreve o papel do Cientista de Dados como um "explorador do mundo digital". Qual das alternativas abaixo NÃO representa uma de suas principais atividades?',
    type: 'multiple-choice',
    options: [
      'Uso de inteligência artificial e machine learning.',
      'Análise profunda de grandes volumes de dados.',
      'Desenvolvimento de dashboards e painéis gerenciais.',
      'Criação de algoritmos e modelos preditivos.',
    ],
    tags: ['Data Science', 'Carreira'],
    difficulty: 'medio',
  },
  {
    title: 'Q27 — LGPD: dados sensíveis',
    description: 'A Lei Geral de Proteção de Dados (LGPD) do Brasil protege informações que podem identificar um indivíduo. Qual das opções a seguir é considerada uma informação sensível e requer proteção especial, conforme o documento?',
    type: 'multiple-choice',
    options: [
      'Dados de saúde e orientação sexual.',
      'Nome completo e CPF.',
      'Perfis em redes sociais e e-mail.',
      'Histórico de navegação e compras online.',
    ],
    tags: ['LGPD', 'Privacidade'],
    difficulty: 'medio',
  },
  {
    title: 'Q28 — O que Data Analytics NÃO faz',
    description: 'O material apresenta um exemplo prático de Data Analytics no qual um coordenador escolar analisa o desempenho da turma. Qual das ações listadas abaixo representa o que o Data Analytics NÃO faz nesse cenário, de acordo com o texto?',
    type: 'multiple-choice',
    options: [
      'Gerar relatórios e gráficos para apresentar os resultados.',
      'Prever as próximas notas dos alunos com base no histórico de desempenho.',
      'Identificar as disciplinas onde a turma teve mais dificuldade.',
      'Calcular as médias da turma em cada matéria.',
    ],
    tags: ['Data Analytics'],
    difficulty: 'medio',
  },
  {
    title: 'Q29 — Características do Python',
    description: 'Python é considerado uma linguagem:',
    type: 'multiple-choice',
    options: [
      'Exclusiva para jogos',
      'Usada apenas em bancos',
      'Antiga e sem uso atual',
      'Fácil de aprender e com sintaxe simples',
      'Difícil de aprender e com sintaxe complexa',
    ],
    tags: ['Python'],
    difficulty: 'facil',
  },
];

async function main() {
  console.log('🔌 Conectando ao MongoDB...');
  const client = new MongoClient(MONGODB_URI);
  await client.connect();

  const db = client.db('desorientado');
  const bankCol = db.collection('question_bank');

  // Verifica se ja existem questoes de BI para evitar duplicatas
  const existing = await bankCol.countDocuments({ subject: 'bi' });
  if (existing > 0) {
    console.log(`⚠️  Ja existem ${existing} questoes de BI no banco.`);
    const confirm = process.argv.includes('--force');
    if (!confirm) {
      console.log('   Use --force para inserir mesmo assim (vai duplicar). Abortando.');
      await client.close();
      return;
    }
    console.log('   --force ativado, inserindo mesmo assim...');
  }

  const docs = questions.map((q, i) => ({
    type: q.type,
    title: q.title,
    description: q.description,
    starterCode: '',
    testCases: [],
    options: q.options || [],
    correctIndex: gabarito[i],
    codeSnippet: q.codeSnippet || '',
    snippetBefore: '',
    snippetAfter: '',
    explanation: '',
    tags: q.tags || [],
    difficulty: q.difficulty || 'medio',
    subject: 'bi',
    createdAt: now,
    updatedAt: now,
  }));

  const result = await bankCol.insertMany(docs);
  console.log(`✅ ${result.insertedCount} questoes de BI inseridas com sucesso!`);
  console.log('   Acesse: Admin → Banco de Questoes → aba "Business Intelligence"');

  await client.close();
}

main().catch((err) => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
