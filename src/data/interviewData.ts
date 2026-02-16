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
];
