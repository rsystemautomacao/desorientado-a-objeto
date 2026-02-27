import { InterviewQuestion } from './types';

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: 'i1', category: 'Java Básico', level: 'basico',
    question: 'Qual a diferença entre JDK, JRE e JVM?',
    answer: 'JVM (Java Virtual Machine) executa o bytecode. JRE (Runtime Environment) contém a JVM + bibliotecas para rodar programas. JDK (Development Kit) contém o JRE + ferramentas de desenvolvimento como o compilador javac.',
    tip: 'O entrevistador quer ver se você entende a arquitetura da plataforma Java, não apenas "programar em Java".',
  },
  {
    id: 'i2', category: 'Java Básico', level: 'basico',
    question: 'Qual a diferença entre == e .equals() em Java?',
    answer: '== compara referências (endereço na memória). .equals() compara o conteúdo dos objetos. Para tipos primitivos, == compara valores.',
    code: `String a = new String("Java");
String b = new String("Java");
System.out.println(a == b);      // false (referências diferentes)
System.out.println(a.equals(b)); // true  (conteúdo igual)`,
    tip: 'Pergunta clássica. Mostre que entende a diferença entre referência e valor, e cite que primitivos usam ==.',
  },
  {
    id: 'i3', category: 'POO', level: 'intermediario',
    question: 'O que é encapsulamento e por que é importante?',
    answer: 'Encapsulamento é o princípio de esconder dados internos de uma classe (usando private) e fornecer acesso controlado via métodos públicos (getters/setters). É importante porque: protege a integridade dos dados, permite validação centralizada, reduz acoplamento, e facilita mudanças internas sem afetar o código externo.',
    code: `public class ContaBancaria {
    private double saldo; // protegido!
    
    public void depositar(double valor) {
        if (valor > 0) saldo += valor; // validação
    }
    // Sem setter para saldo — só altera via métodos de negócio
}`,
    tip: 'Não diga apenas "usar getters e setters". Explique o PORQUÊ: proteção, validação, manutenção. Dê um exemplo prático.',
  },
  {
    id: 'i4', category: 'POO', level: 'intermediario',
    question: 'Qual a diferença entre classe abstrata e interface?',
    answer: 'Classe abstrata pode ter métodos com e sem implementação, atributos, construtores, e uma classe só pode estender UMA. Interface define apenas contratos (métodos sem corpo), e uma classe pode implementar MÚLTIPLAS. A partir do Java 8, interfaces podem ter métodos default.',
    code: `// Classe abstrata: tem construtor e implementação parcial
abstract class Animal {
    protected String nome;
    Animal(String nome) { this.nome = nome; }
    abstract void emitirSom();
    void dormir() { System.out.println("Zzz"); }
}

// Interface: apenas contrato
interface Nadador {
    void nadar();
}

// Pode implementar múltiplas interfaces
class Pato extends Animal implements Nadador {
    Pato(String nome) { super(nome); }
    void emitirSom() { System.out.println("Quack"); }
    public void nadar() { System.out.println("Nadando!"); }
}`,
    tip: 'Pergunta muito comum. Cite: herança simples vs múltipla, construtores, e quando usar cada uma.',
  },
  {
    id: 'i5', category: 'POO', level: 'intermediario',
    question: 'O que é polimorfismo na prática?',
    answer: 'Polimorfismo permite que um mesmo método se comporte de formas diferentes dependendo do objeto que o executa. Na prática, isso permite tratar objetos de diferentes classes de forma uniforme através de uma referência da superclasse.',
    code: `Animal[] animais = { new Cachorro(), new Gato() };
for (Animal a : animais) {
    a.emitirSom(); // cada um faz seu som!
}`,
    tip: 'Dê um exemplo prático. O entrevistador quer ver que você sabe USAR polimorfismo, não apenas definir.',
  },
  {
    id: 'i6', category: 'POO', level: 'avancado',
    question: 'Quando usar composição ao invés de herança?',
    answer: 'Use composição quando a relação é "tem um" (Carro TEM Motor). Use herança quando é "é um" (Cachorro É Animal). Composição é mais flexível: permite trocar comportamento em runtime, não cria acoplamento forte, e facilita testes.',
    tip: 'Cite o princípio "Prefer composition over inheritance". Mostre que sabe que herança cria acoplamento forte.',
  },
  {
    id: 'i7', category: 'POO', level: 'intermediario',
    question: 'Qual a diferença entre sobrecarga e sobrescrita?',
    answer: 'Sobrecarga (overloading): mesmo nome, parâmetros DIFERENTES, na MESMA classe. Resolvida em tempo de compilação. Sobrescrita (overriding): mesmo nome e parâmetros, classe FILHA redefine método do PAI. Resolvida em tempo de execução.',
    code: `// Sobrecarga
int somar(int a, int b) { return a + b; }
double somar(double a, double b) { return a + b; }

// Sobrescrita
class Animal { void falar() { } }
class Cachorro extends Animal {
    @Override void falar() { System.out.println("Au!"); }
}`,
    tip: 'Cite que sobrecarga é compile-time e sobrescrita é runtime. Use os termos corretos em inglês.',
  },
  {
    id: 'i8', category: 'Exceptions', level: 'intermediario',
    question: 'Explique try/catch e a diferença entre checked e unchecked exceptions.',
    answer: 'try/catch trata erros em tempo de execução. Checked exceptions (IOException, SQLException) OBRIGAM tratamento — o compilador exige try/catch ou throws. Unchecked exceptions (NullPointerException, ArrayIndexOutOfBounds) não obrigam, são erros de programação.',
    tip: 'Mostre que entende a hierarquia: Throwable → Exception → RuntimeException (unchecked) e Exception (checked).',
  },
  {
    id: 'i9', category: 'Java Básico', level: 'basico',
    question: 'Java é pass-by-value ou pass-by-reference?',
    answer: 'Java é SEMPRE pass-by-value. Para primitivos, passa uma cópia do valor. Para objetos, passa uma cópia da referência (não o objeto em si). Isso significa que você pode alterar os atributos do objeto dentro do método, mas não pode fazer a referência original apontar para outro objeto.',
    tip: 'Pegadinha clássica! Muitos dizem pass-by-reference para objetos, mas é pass-by-value da referência.',
  },
  {
    id: 'i10', category: 'SOLID', level: 'avancado',
    question: 'Explique o princípio da Responsabilidade Única (SRP).',
    answer: 'O SRP diz que uma classe deve ter apenas UMA razão para mudar — ou seja, uma única responsabilidade. Se uma classe faz validação, cálculo e persistência, ela tem três razões para mudar. Solução: separar em ValidadorService, CalculadoraService e Repository.',
    tip: 'Dê exemplos concretos de classes que violam SRP e como separar. Evite respostas teóricas.',
  },
  {
    id: 'i11', category: 'Collections', level: 'intermediario',
    question: 'Qual a diferença entre ArrayList e LinkedList?',
    answer: 'ArrayList usa array interno. Acesso por índice O(1), mas inserção/remoção no meio é O(n). LinkedList usa nós encadeados. Inserção/remoção O(1) se tem o nó, mas acesso por índice é O(n). Na maioria dos casos, ArrayList é mais performático por cache-friendliness.',
    tip: 'Na prática, ArrayList é quase sempre melhor. Cite Big O notation para impressionar.',
  },
  {
    id: 'i12', category: 'Java Básico', level: 'basico',
    question: 'String é imutável em Java. O que isso significa?',
    answer: 'Uma vez criada, uma String não pode ser alterada. Métodos como toUpperCase() retornam uma NOVA String, não modificam a original. Por isso, para concatenações em loop, use StringBuilder (mutável e mais eficiente).',
    tip: 'Conecte com StringBuilder/StringBuffer e explique por que importa para performance.',
  },
  {
    id: 'i13', category: 'POO', level: 'avancado',
    question: 'O que é o princípio Open/Closed?',
    answer: 'O princípio Open/Closed (O de SOLID) diz que classes devem ser abertas para extensão e fechadas para modificação. Em vez de modificar código existente para adicionar funcionalidade, use herança, interfaces ou padrões como Strategy.',
    tip: 'Dê um exemplo: adicionar novo tipo de desconto sem modificar a classe existente, usando polimorfismo.',
  },
  {
    id: 'i14', category: 'Java Básico', level: 'basico',
    question: 'Qual a diferença entre final, finally e finalize?',
    answer: 'final: constante (variável), impede herança (classe), impede sobrescrita (método). finally: bloco que sempre executa após try/catch. finalize: método chamado pelo garbage collector antes de destruir um objeto (deprecated desde Java 9).',
    tip: 'Pergunta clássica de entrevista Java. Cite que finalize é deprecated.',
  },
  {
    id: 'i15', category: 'POO', level: 'intermediario',
    question: 'O que é o modificador de acesso protected?',
    answer: 'protected permite acesso dentro do mesmo pacote E nas subclasses (mesmo em pacotes diferentes). É mais restritivo que public mas mais permissivo que default (package-private).',
    tip: 'Desenhe a tabela: private < default < protected < public. Mostre que sabe a diferença.',
  },

  // ===== Novas perguntas =====

  // Java Básico
  {
    id: 'i16', category: 'Java Básico', level: 'basico',
    question: 'Quais são os 8 tipos primitivos do Java?',
    answer: 'byte (8 bits), short (16 bits), int (32 bits), long (64 bits), float (32 bits), double (64 bits), char (16 bits Unicode), boolean (true/false). Todos têm tamanho fixo independente da plataforma — isso faz parte da portabilidade do Java.',
    tip: 'Decore os 8 tipos e seus tamanhos. É pergunta de aquecimento, errar aqui passa má impressão.',
  },
  {
    id: 'i17', category: 'Java Básico', level: 'basico',
    question: 'O que é autoboxing e unboxing?',
    answer: 'Autoboxing é a conversão automática de primitivo para wrapper (int → Integer). Unboxing é o contrário (Integer → int). O Java faz isso automaticamente, mas cuidado: unboxing de null causa NullPointerException.',
    code: `Integer x = 10;       // autoboxing: int → Integer
int y = x;             // unboxing: Integer → int

Integer z = null;
int w = z;             // NullPointerException!`,
    tip: 'Cite o risco de NullPointerException no unboxing. Mostra maturidade técnica.',
  },
  {
    id: 'i18', category: 'Java Básico', level: 'intermediario',
    question: 'Qual a diferença entre String, StringBuilder e StringBuffer?',
    answer: 'String é imutável — cada alteração cria um novo objeto. StringBuilder é mutável e mais rápido, mas NÃO é thread-safe. StringBuffer é mutável e thread-safe (métodos sincronizados), porém mais lento. Para a maioria dos casos, use StringBuilder.',
    code: `// Ruim: cria muitos objetos String temporários
String s = "";
for (int i = 0; i < 1000; i++) s += i;

// Bom: um único objeto mutável
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) sb.append(i);
String resultado = sb.toString();`,
    tip: 'Se te perguntarem sobre performance com Strings, sempre cite StringBuilder. É uma resposta esperada.',
  },
  {
    id: 'i19', category: 'Java Básico', level: 'basico',
    question: 'O que é o garbage collector (GC) em Java?',
    answer: 'O garbage collector é o mecanismo automático que libera memória de objetos que não são mais referenciados. Diferente de C/C++, em Java você não precisa liberar memória manualmente. O GC roda em segundo plano na JVM e coleta objetos sem referência ativa.',
    tip: 'Mostre que sabe que o GC não é instantâneo — ele roda quando a JVM decide. Cite que System.gc() é apenas uma sugestão, não uma ordem.',
  },
  {
    id: 'i20', category: 'Java Básico', level: 'intermediario',
    question: 'O que são generics em Java e para que servem?',
    answer: 'Generics permitem parametrizar tipos em classes, interfaces e métodos. Garantem segurança de tipo em tempo de compilação, evitando ClassCastException em runtime. Sem generics, teríamos que usar Object e fazer cast manual.',
    code: `// Sem generics (perigoso)
List lista = new ArrayList();
lista.add("texto");
Integer num = (Integer) lista.get(0); // ClassCastException!

// Com generics (seguro)
List<String> lista = new ArrayList<>();
lista.add("texto");
String s = lista.get(0); // sem cast, tipo garantido`,
    tip: 'Cite type safety e eliminação de casts. Se souber, mencione type erasure — impressiona o entrevistador.',
  },

  // POO
  {
    id: 'i21', category: 'POO', level: 'basico',
    question: 'Quais são os 4 pilares da POO?',
    answer: 'Abstração (modelar apenas o essencial do mundo real), Encapsulamento (esconder implementação interna), Herança (reaproveitar código da classe pai), e Polimorfismo (mesmo método com comportamentos diferentes). Juntos, permitem criar código organizado, reutilizável e manutenível.',
    tip: 'Não apenas liste os 4 pilares — dê um exemplo prático de cada. O entrevistador quer ver que você ENTENDE, não que decorou.',
  },
  {
    id: 'i22', category: 'POO', level: 'intermediario',
    question: 'O que é uma classe interna (inner class) em Java?',
    answer: 'É uma classe definida dentro de outra. Existem 4 tipos: classe interna regular (acessa membros da classe externa), classe interna estática (não precisa de instância da externa), classe local (definida dentro de um método) e classe anônima (sem nome, usada inline). Classes anônimas são muito usadas com interfaces funcionais.',
    code: `// Classe anônima (muito usada antes do Java 8)
Comparator<String> comp = new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return a.length() - b.length();
    }
};

// Equivalente com lambda (Java 8+)
Comparator<String> comp = (a, b) -> a.length() - b.length();`,
    tip: 'Cite classes anônimas e conecte com lambdas. Mostra que você conhece a evolução da linguagem.',
  },
  {
    id: 'i23', category: 'POO', level: 'avancado',
    question: 'O que é o princípio de Liskov Substitution (LSP)?',
    answer: 'O LSP (L de SOLID) diz que objetos de uma subclasse devem poder substituir objetos da superclasse sem quebrar o programa. Se Quadrado herda de Retangulo, mas setLargura() muda também a altura (para manter quadrado), isso viola LSP — o comportamento esperado de Retangulo muda.',
    code: `// Viola LSP
class Retangulo {
    int largura, altura;
    void setLargura(int l) { largura = l; }
    int area() { return largura * altura; }
}

class Quadrado extends Retangulo {
    @Override
    void setLargura(int l) {
        largura = l;
        altura = l; // surpresa! muda altura também
    }
}

// Código que espera Retangulo vai quebrar com Quadrado:
Retangulo r = new Quadrado();
r.setLargura(5);
r.setAltura(3);
// Esperado: area = 15, Real: area = 9 (bug!)`,
    tip: 'O exemplo Quadrado/Retangulo é clássico de LSP. Se souber, cite que a solução é usar composição ou interfaces separadas.',
  },
  {
    id: 'i24', category: 'POO', level: 'avancado',
    question: 'O que é o princípio de Inversão de Dependência (DIP)?',
    answer: 'O DIP (D de SOLID) diz que módulos de alto nível não devem depender de módulos de baixo nível — ambos devem depender de abstrações. Na prática: programe para interfaces, não para implementações. Isso facilita trocar implementações e testar com mocks.',
    code: `// Errado: alto nível depende de baixo nível
class PedidoService {
    private MySQLRepository repo = new MySQLRepository();
}

// Certo: ambos dependem de abstração
class PedidoService {
    private Repository repo; // interface!
    PedidoService(Repository repo) { this.repo = repo; }
}
// Pode injetar MySQLRepository, MongoRepository, MockRepository...`,
    tip: 'Conecte com injeção de dependência e testes unitários. Mostra que você pensa em arquitetura.',
  },
  {
    id: 'i25', category: 'POO', level: 'avancado',
    question: 'O que é o princípio de Segregação de Interfaces (ISP)?',
    answer: 'O ISP (I de SOLID) diz que nenhuma classe deve ser forçada a implementar métodos que não usa. Se uma interface Animal tem voar(), nadar() e correr(), um Cachorro seria forçado a implementar voar(). Solução: criar interfaces menores e específicas (Voador, Nadador, Corredor).',
    code: `// Errado: interface gorda
interface Animal {
    void voar();
    void nadar();
    void correr();
}

// Certo: interfaces segregadas
interface Voador { void voar(); }
interface Nadador { void nadar(); }
interface Corredor { void correr(); }

class Pato implements Voador, Nadador { ... }
class Cachorro implements Corredor, Nadador { ... }`,
    tip: 'Cite "interface gorda" como anti-pattern. Mostre que sabe dividir responsabilidades em interfaces.',
  },

  // Collections
  {
    id: 'i26', category: 'Collections', level: 'intermediario',
    question: 'Qual a diferença entre HashMap, TreeMap e LinkedHashMap?',
    answer: 'HashMap: sem ordem garantida, O(1) para get/put. TreeMap: ordenado pelas chaves (usa Comparable), O(log n). LinkedHashMap: mantém a ordem de inserção, O(1). Use HashMap quando não importa ordem, TreeMap quando precisa de chaves ordenadas, e LinkedHashMap quando a ordem de inserção importa.',
    tip: 'Cite Big O de cada um. Se te perguntarem "qual usar?", responda: "depende do requisito" — e explique cada caso.',
  },
  {
    id: 'i27', category: 'Collections', level: 'intermediario',
    question: 'Por que é importante sobrescrever hashCode() quando sobrescreve equals()?',
    answer: 'O contrato do Java diz: se dois objetos são iguais por equals(), DEVEM ter o mesmo hashCode(). Coleções como HashMap e HashSet usam hashCode() para encontrar o bucket e equals() para confirmar igualdade. Se hashCode() não for consistente com equals(), o HashMap não vai encontrar o objeto.',
    code: `class Pessoa {
    String cpf;

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Pessoa)) return false;
        return cpf.equals(((Pessoa) o).cpf);
    }

    @Override
    public int hashCode() {
        return cpf.hashCode(); // consistente com equals
    }
}`,
    tip: 'Pergunta muito frequente. Cite o contrato equals/hashCode e dê exemplo com HashMap.',
  },
  {
    id: 'i28', category: 'Collections', level: 'intermediario',
    question: 'Qual a diferença entre List, Set e Map?',
    answer: 'List: coleção ordenada que permite duplicatas (ArrayList, LinkedList). Set: coleção que NÃO permite duplicatas (HashSet, TreeSet). Map: coleção de pares chave-valor, chaves únicas (HashMap, TreeMap). List usa índice, Set garante unicidade, Map associa chaves a valores.',
    tip: 'Cite exemplos práticos: List para lista de pedidos, Set para e-mails únicos, Map para cache ou dicionário.',
  },

  // Exceptions
  {
    id: 'i29', category: 'Exceptions', level: 'intermediario',
    question: 'Como criar uma exceção personalizada em Java?',
    answer: 'Estenda Exception para checked ou RuntimeException para unchecked. Adicione construtores que chamam super() com a mensagem de erro. Use exceções personalizadas para representar erros específicos do seu domínio (SaldoInsuficienteException, UsuarioNaoEncontradoException).',
    code: `public class SaldoInsuficienteException extends RuntimeException {
    private final double saldoAtual;

    public SaldoInsuficienteException(double saldoAtual, double valorSaque) {
        super("Saldo insuficiente: R$" + saldoAtual +
              " para saque de R$" + valorSaque);
        this.saldoAtual = saldoAtual;
    }

    public double getSaldoAtual() { return saldoAtual; }
}`,
    tip: 'Mostre que sabe quando usar checked vs unchecked. Erros de negócio geralmente são unchecked (RuntimeException).',
  },
  {
    id: 'i30', category: 'Exceptions', level: 'avancado',
    question: 'O que é try-with-resources e por que usar?',
    answer: 'try-with-resources (Java 7+) garante que recursos que implementam AutoCloseable sejam fechados automaticamente ao final do bloco, mesmo se ocorrer exceção. Substitui o padrão try/finally para fechar recursos. Evita resource leaks.',
    code: `// Antes (verboso e propenso a erro)
BufferedReader br = null;
try {
    br = new BufferedReader(new FileReader("file.txt"));
    String linha = br.readLine();
} finally {
    if (br != null) br.close(); // e se close() lançar exceção?
}

// Com try-with-resources (limpo e seguro)
try (BufferedReader br = new BufferedReader(new FileReader("file.txt"))) {
    String linha = br.readLine();
} // br.close() é chamado automaticamente`,
    tip: 'Cite AutoCloseable e que funciona com qualquer recurso que implemente essa interface. Mostra código moderno.',
  },

  // Design Patterns
  {
    id: 'i31', category: 'Design Patterns', level: 'avancado',
    question: 'O que é o padrão Singleton e quando usar?',
    answer: 'Singleton garante que uma classe tenha apenas UMA instância em toda a aplicação. Usa construtor privado e método estático para obter a instância. Útil para: gerenciadores de conexão, configurações globais, loggers. Cuidado: dificulta testes e cria acoplamento global.',
    code: `public class Configuracao {
    private static Configuracao instancia;

    private Configuracao() { } // construtor privado

    public static Configuracao getInstancia() {
        if (instancia == null) {
            instancia = new Configuracao();
        }
        return instancia;
    }
}`,
    tip: 'Cite prós (uma única instância) E contras (dificulta testes, acoplamento). Mostra senso crítico.',
  },
  {
    id: 'i32', category: 'Design Patterns', level: 'avancado',
    question: 'O que é o padrão Strategy?',
    answer: 'Strategy permite definir uma família de algoritmos, encapsular cada um e torná-los intercambiáveis. O cliente escolhe qual estratégia usar em runtime. Exemplo: diferentes formas de calcular frete (Sedex, PAC, transportadora) — o código que calcula o pedido não muda.',
    code: `interface CalculoFrete {
    double calcular(double peso, double distancia);
}

class FreteSedex implements CalculoFrete {
    public double calcular(double peso, double distancia) {
        return peso * 2 + distancia * 0.5;
    }
}

class FretePAC implements CalculoFrete {
    public double calcular(double peso, double distancia) {
        return peso * 1 + distancia * 0.3;
    }
}

class Pedido {
    private CalculoFrete frete; // estratégia injetada
    Pedido(CalculoFrete frete) { this.frete = frete; }

    double calcularTotal(double peso, double dist) {
        return frete.calcular(peso, dist);
    }
}`,
    tip: 'Strategy é um dos padrões mais pedidos. Conecte com Open/Closed e polimorfismo.',
  },
  {
    id: 'i33', category: 'Design Patterns', level: 'avancado',
    question: 'O que é o padrão Observer?',
    answer: 'Observer define uma dependência um-para-muitos: quando um objeto muda de estado, todos os dependentes são notificados automaticamente. Exemplo: sistema de notificações — quando um pedido é criado, envia e-mail, atualiza estoque e gera nota fiscal, sem acoplamento direto.',
    code: `interface Observer {
    void atualizar(String evento);
}

class EmailService implements Observer {
    public void atualizar(String evento) {
        System.out.println("Enviando e-mail: " + evento);
    }
}

class Pedido {
    private List<Observer> observers = new ArrayList<>();

    void adicionarObserver(Observer o) { observers.add(o); }

    void finalizar() {
        // notifica todos os interessados
        for (Observer o : observers) {
            o.atualizar("Pedido finalizado!");
        }
    }
}`,
    tip: 'Cite aplicações reais: listeners em interfaces gráficas, eventos em frameworks, pub/sub.',
  },

  // Extras
  {
    id: 'i34', category: 'Java Básico', level: 'intermediario',
    question: 'O que são enums em Java e quando usar?',
    answer: 'Enums são tipos especiais que representam um conjunto fixo de constantes. São mais seguros que constantes int ou String porque o compilador valida os valores. Podem ter atributos, métodos e construtores. Use para: status (ATIVO, INATIVO), dias da semana, tipos de pagamento.',
    code: `public enum StatusPedido {
    PENDENTE("Aguardando pagamento"),
    PAGO("Pagamento confirmado"),
    ENVIADO("Em transporte"),
    ENTREGUE("Entregue ao cliente");

    private final String descricao;
    StatusPedido(String descricao) { this.descricao = descricao; }
    public String getDescricao() { return descricao; }
}

// Uso
StatusPedido status = StatusPedido.PAGO;
System.out.println(status.getDescricao()); // "Pagamento confirmado"`,
    tip: 'Mostre que enum em Java é mais poderoso que em outras linguagens — pode ter métodos e atributos.',
  },
  {
    id: 'i35', category: 'Java Básico', level: 'intermediario',
    question: 'O que é o operador instanceof e quando usar?',
    answer: 'instanceof verifica se um objeto é instância de uma classe ou interface em tempo de execução. Retorna boolean. Usado antes de fazer cast para evitar ClassCastException. A partir do Java 16, pode fazer pattern matching com instanceof.',
    code: `Object obj = "texto";

if (obj instanceof String) {
    String s = (String) obj; // cast seguro
    System.out.println(s.length());
}

// Java 16+ (pattern matching)
if (obj instanceof String s) {
    System.out.println(s.length()); // já faz cast!
}`,
    tip: 'Cite que uso excessivo de instanceof pode indicar design ruim — polimorfismo geralmente é melhor.',
  },
  {
    id: 'i36', category: 'POO', level: 'intermediario',
    question: 'O que é coesão e acoplamento? Qual a relação ideal?',
    answer: 'Coesão é o grau em que os elementos de uma classe se relacionam (alta coesão = classe focada em uma responsabilidade). Acoplamento é o grau de dependência entre classes (baixo acoplamento = classes independentes). O ideal é ALTA coesão e BAIXO acoplamento.',
    tip: 'Conecte com SRP (alta coesão) e DIP (baixo acoplamento). Mostra que entende princípios de design.',
  },
  {
    id: 'i37', category: 'Collections', level: 'avancado',
    question: 'O que são Streams em Java e para que servem?',
    answer: 'Streams (Java 8+) permitem processar coleções de forma declarativa, similar a SQL. Suportam operações como filter(), map(), reduce(), sorted(). São lazy (só executam quando necessário) e podem ser paralelizadas. Não modificam a coleção original.',
    code: `List<String> nomes = Arrays.asList("Ana", "Bruno", "Carlos", "Amanda");

// Filtrar, transformar e coletar
List<String> resultado = nomes.stream()
    .filter(n -> n.startsWith("A"))    // filtrar
    .map(String::toUpperCase)          // transformar
    .sorted()                          // ordenar
    .collect(Collectors.toList());     // coletar

// resultado: [AMANDA, ANA]`,
    tip: 'Streams são muito pedidos. Saiba filter, map, reduce e collect. Mencione lazy evaluation.',
  },
  {
    id: 'i38', category: 'Exceptions', level: 'intermediario',
    question: 'Qual a diferença entre throw e throws?',
    answer: 'throw é usado para LANÇAR uma exceção manualmente no código. throws é usado na assinatura do método para DECLARAR que ele pode lançar exceções. throw cria a exceção, throws avisa quem vai chamar o método.',
    code: `// throws: declara que o método pode lançar exceção
public void sacar(double valor) throws SaldoInsuficienteException {
    if (valor > saldo) {
        // throw: lança a exceção
        throw new SaldoInsuficienteException("Saldo insuficiente");
    }
    saldo -= valor;
}`,
    tip: 'Pergunta simples mas muitos confundem. throw = ação, throws = declaração.',
  },
  {
    id: 'i39', category: 'POO', level: 'intermediario',
    question: 'O que é o @Override e por que usar?',
    answer: '@Override é uma anotação que indica que o método está sobrescrevendo um método da superclasse. Se você errar o nome ou parâmetros, o compilador avisa. Sem @Override, o Java criaria um método novo sem aviso, e o polimorfismo não funcionaria como esperado.',
    code: `class Animal {
    void emitirSom() { System.out.println("..."); }
}

class Cachorro extends Animal {
    @Override
    void emitirSom() { System.out.println("Au!"); } // OK

    @Override
    void emitirSon() { } // ERRO de compilação! Método não existe na superclasse
}`,
    tip: 'Sempre use @Override ao sobrescrever. Mostra disciplina e previne bugs sutis.',
  },
  {
    id: 'i40', category: 'Design Patterns', level: 'avancado',
    question: 'O que é o padrão Factory Method?',
    answer: 'Factory Method define um método para criar objetos, mas deixa as subclasses decidirem qual classe instanciar. Desacopla a criação do objeto do código que o usa. Útil quando o tipo exato do objeto depende de uma condição ou configuração.',
    code: `interface Notificacao {
    void enviar(String mensagem);
}

class EmailNotificacao implements Notificacao {
    public void enviar(String msg) { System.out.println("E-mail: " + msg); }
}

class SMSNotificacao implements Notificacao {
    public void enviar(String msg) { System.out.println("SMS: " + msg); }
}

class NotificacaoFactory {
    static Notificacao criar(String tipo) {
        return switch (tipo) {
            case "email" -> new EmailNotificacao();
            case "sms" -> new SMSNotificacao();
            default -> throw new IllegalArgumentException("Tipo inválido");
        };
    }
}

// Uso: código não sabe qual classe concreta é criada
Notificacao n = NotificacaoFactory.criar("email");
n.enviar("Olá!");`,
    tip: 'Conecte com Open/Closed: para adicionar um novo tipo, basta criar uma nova classe e atualizar o factory.',
  },
];
