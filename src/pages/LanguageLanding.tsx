import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Code2, BookOpen, GraduationCap, ArrowRight, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pythonExercises } from '@/data/exercises-python';
import { cExercises } from '@/data/exercises-c';
import { pythonModules } from '@/data/modules-python';
import { cModules } from '@/data/modules-c';

export default function LanguageLanding() {
  const { lang, label, routePrefix } = useLanguage();

  const totalExercises = lang === 'python' ? pythonExercises.length : cExercises.length;
  const mods = lang === 'python' ? pythonModules : cModules;
  const totalLessons = mods.reduce((acc, m) => acc + m.lessons.length, 0);

  const info = {
    python: {
      subtitle: 'Aprenda Python do zero ao avançado',
      desc: 'Python é uma linguagem versátil e de fácil aprendizado, usada em ciência de dados, automação, web e muito mais.',
      color: 'text-blue-400',
      bg: 'from-blue-600/20 to-blue-900/10',
      badge: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    },
    c: {
      subtitle: 'Aprenda Linguagem C do zero ao avançado',
      desc: 'C é uma das linguagens mais importantes da computação, base para sistemas operacionais, drivers e softwares de alta performance.',
      color: 'text-cyan-400',
      bg: 'from-cyan-600/20 to-cyan-900/10',
      badge: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
    },
  }[lang as 'python' | 'c'];

  return (
    <Layout>
      {/* Hero */}
      <section className={`relative py-20 px-4 bg-gradient-to-br ${info.bg}`}>
        <div className="container max-w-4xl mx-auto text-center">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${info.badge}`}>
            {label}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className={info.color}>{info.subtitle}</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">{info.desc}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link to={`${routePrefix}/trilha`}>
                <Map className="h-5 w-5" />
                Começar Trilha ({totalLessons} aulas)
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to={`${routePrefix}/exercicios`}>
                <Code2 className="h-5 w-5" />
                Ver Exercícios ({totalExercises})
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Cards de destaque */}
      <section className="container max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">O que você vai aprender</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: BookOpen, title: 'Fundamentos', desc: 'Variáveis, tipos de dados, operadores e estrutura básica do programa.' },
            { icon: Code2, title: 'Controle de fluxo', desc: 'Condicionais (if/else), laços (for, while) e lógica de repetição.' },
            { icon: GraduationCap, title: 'Funções e modularização', desc: 'Criação de funções, parâmetros, retorno e organização do código.' },
          ].map((card) => (
            <div key={card.title} className="rounded-xl border border-border bg-card p-6 flex flex-col gap-3">
              <card.icon className={`h-8 w-8 ${info.color}`} />
              <h3 className="font-semibold text-lg">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="gap-2">
            <Link to={`${routePrefix}/trilha`}>
              <Map className="h-5 w-5" />
              Começar Trilha de Aulas
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to={`${routePrefix}/exercicios`}>
              <Code2 className="h-5 w-5" />
              Ir para Exercícios
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
