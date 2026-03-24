import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { modules } from '@/data/modules';
import { exercises } from '@/data/exercises';
import { Code2, BookOpen, GraduationCap, BriefcaseBusiness, ArrowRight, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function JavaLanding() {
  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);
  const totalExercises = exercises.length;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-orange-600/20 to-orange-900/10">
        <div className="container max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold border border-orange-400/20 bg-orange-400/10 text-orange-400 mb-4">
            Java / POO
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="text-orange-400">Aprenda Java do zero ao avançado</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Orientação a Objetos, SOLID, Design Patterns, Collections, Streams e muito mais. O curso mais completo da plataforma, com trilha estruturada, exercícios práticos e prep. para entrevistas.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link to="/trilha">
                <BookOpen className="h-5 w-5" />
                Começar Trilha Java
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 border-orange-400/30 text-orange-400 hover:bg-orange-400/10">
              <Link to="/exercicios">
                <Code2 className="h-5 w-5" />
                Ver Exercícios ({totalExercises} disponíveis)
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-400">{totalLessons}</p>
              <p className="text-sm text-muted-foreground">Aulas</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-400">{totalExercises}</p>
              <p className="text-sm text-muted-foreground">Exercícios</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-400">{modules.length}</p>
              <p className="text-sm text-muted-foreground">Módulos</p>
            </div>
          </div>
        </div>
      </section>

      {/* O que você vai aprender */}
      <section className="container max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">O que você vai aprender</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: BookOpen,
              title: 'Fundamentos',
              desc: 'Variáveis, tipos, operadores, controle de fluxo e estruturas de dados básicas.',
            },
            {
              icon: GraduationCap,
              title: 'Orientação a Objetos',
              desc: 'Classes, objetos, herança, polimorfismo, encapsulamento e interfaces.',
            },
            {
              icon: Target,
              title: 'SOLID & Patterns',
              desc: 'Princípios de design de software e os principais padrões de projeto.',
            },
            {
              icon: BriefcaseBusiness,
              title: 'Entrevistas',
              desc: 'Perguntas reais de processos seletivos para vagas Java/backend.',
            },
          ].map((card) => (
            <div key={card.title} className="rounded-xl border border-border bg-card p-6 flex flex-col gap-3">
              <card.icon className="h-8 w-8 text-orange-400" />
              <h3 className="font-semibold text-lg">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Módulos */}
      <section className="container max-w-5xl mx-auto pb-16 px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Módulos do Curso</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {modules.map((m) => (
            <Link
              key={m.id}
              to={`/aula/${m.lessons[0].id}`}
              className="rounded-xl border border-border bg-card p-5 flex flex-col gap-2 hover:bg-secondary/50 transition-colors group"
            >
              <div className="text-3xl">{m.icon}</div>
              <h3 className="font-bold text-base">Módulo {m.id} — {m.title}</h3>
              <p className="text-sm text-muted-foreground flex-1">{m.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.lessons.length} aulas</p>
              <span className="text-xs text-orange-400 group-hover:underline flex items-center gap-1 mt-1">
                Começar <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild size="lg" className="gap-2">
            <Link to="/trilha">
              <BookOpen className="h-5 w-5" />
              Ver trilha completa
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
