import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { modules } from '@/data/modules';
import { useProgress } from '@/hooks/useProgress';
import { ArrowRight, BookOpen, BriefcaseBusiness, Trophy } from 'lucide-react';

export default function Index() {
  const { progress } = useProgress();
  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);
  const completed = progress.completedLessons.length;

  return (
    <Layout>
      <div className="animate-fade-in">
        {/* Hero */}
        <section className="container py-16 md:py-24 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Do Zero ao Avançado em POO
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Domine <span className="text-gradient-primary">Java</span> com{' '}
            <span className="text-gradient-accent">clareza</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Trilha completa: fundamentos, lógica, POO, SOLID, exercícios práticos, quizzes e perguntas de entrevista. Tudo explicado de verdade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/trilha" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all glow-primary">
              Começar Agora <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg border border-border font-semibold hover:bg-secondary transition-colors">
              Meu Progresso
            </Link>
          </div>
          {completed > 0 && (
            <div className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4 text-accent" />
              {completed}/{totalLessons} aulas concluídas
            </div>
          )}
        </section>

        {/* Modules */}
        <section className="container pb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Módulos do Curso</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {modules.map((m) => {
              const done = m.lessons.filter((l) => progress.completedLessons.includes(l.id)).length;
              const pct = Math.round((done / m.lessons.length) * 100);
              return (
                <div key={m.id} className="rounded-xl border border-border bg-card p-6 card-hover">
                  <div className="text-3xl mb-3">{m.icon}</div>
                  <h3 className="text-lg font-bold mb-1">Módulo {m.id} — {m.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{m.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>{m.lessons.length} aulas</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <Link to={`/aula/${m.lessons[0].id}`} className="mt-4 inline-flex items-center text-sm text-primary hover:underline gap-1">
                    {done > 0 ? 'Continuar' : 'Começar'} <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick links */}
        <section className="container pb-16">
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/entrevistas" className="flex items-center gap-4 p-6 rounded-xl border border-border bg-card card-hover">
              <BriefcaseBusiness className="h-8 w-8 text-accent" />
              <div>
                <h3 className="font-bold">Perguntas de Entrevista</h3>
                <p className="text-sm text-muted-foreground">Prepare-se para processos seletivos</p>
              </div>
            </Link>
            <Link to="/trilha" className="flex items-center gap-4 p-6 rounded-xl border border-border bg-card card-hover">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-bold">Trilha Completa</h3>
                <p className="text-sm text-muted-foreground">Veja todas as aulas organizadas</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
