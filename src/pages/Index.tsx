import { Link, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, BookOpen, BriefcaseBusiness, Code2, Trophy, Map, Zap, Target, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LANGUAGES = [
  {
    to: '/trilha',
    homeTo: '/',
    label: 'Java',
    tag: 'POO & Backend',
    description: 'Orientação a Objetos, SOLID, Design Patterns, Collections, Streams e perguntas de entrevista. O curso mais completo da plataforma.',
    color: 'text-orange-400',
    border: 'border-orange-400/30',
    bg: 'bg-orange-400/5 hover:bg-orange-400/10',
    badge: 'bg-orange-400/10 text-orange-400',
    glyph: '☕',
    highlights: ['Trilha completa do zero ao avançado', 'Exercícios com execução online', 'Quizzes por aula', 'Perguntas de entrevista'],
    cta: 'Começar Java',
  },
  {
    to: '/python/trilha',
    homeTo: '/python',
    label: 'Python',
    tag: 'Lógica & Dados',
    description: 'Do print("Hello") até listas, funções e dicionários. Base sólida para ciência de dados, automação e muito mais.',
    color: 'text-blue-400',
    border: 'border-blue-400/30',
    bg: 'bg-blue-400/5 hover:bg-blue-400/10',
    badge: 'bg-blue-400/10 text-blue-400',
    glyph: '🐍',
    highlights: ['Trilha do zero ao avançado', 'Exercícios práticos', 'Sintaxe limpa e intuitiva', 'Execução de código online'],
    cta: 'Começar Python',
  },
  {
    to: '/c/trilha',
    homeTo: '/c',
    label: 'Linguagem C',
    tag: 'Fundamentos & Sistemas',
    description: 'Ponteiros, memória, arrays e funções. A linguagem que está por baixo de tudo — aprenda C e entenda como os computadores realmente funcionam.',
    color: 'text-cyan-400',
    border: 'border-cyan-400/30',
    bg: 'bg-cyan-400/5 hover:bg-cyan-400/10',
    badge: 'bg-cyan-400/10 text-cyan-400',
    glyph: '⚙️',
    highlights: ['Trilha do zero ao avançado', 'Ponteiros sem mistério', 'Exercícios com compilação online', 'Base para sistemas embarcados'],
    cta: 'Começar C',
  },
];

const FEATURES = [
  { icon: Map, label: 'Trilhas estruturadas', desc: 'Aulas em ordem lógica, do básico ao avançado' },
  { icon: Code2, label: 'Exercícios práticos', desc: 'Execute código diretamente no navegador' },
  { icon: Target, label: 'Quizzes por aula', desc: 'Fixe o conteúdo com perguntas interativas' },
  { icon: BriefcaseBusiness, label: 'Prep. para entrevistas', desc: 'Perguntas reais de processos seletivos (Java)' },
  { icon: Zap, label: 'Progresso salvo', desc: 'Continue de onde parou em qualquer dispositivo' },
  { icon: BookOpen, label: 'Conteúdo gratuito', desc: 'Tudo acessível com login pelo Google' },
];

export default function Index() {
  const [searchParams] = useSearchParams();
  const needsLogin = searchParams.get('login') === '1';
  const { user, signInWithGoogle } = useAuth();

  return (
    <Layout>
      <div className="animate-fade-in">
        {needsLogin && !user && (
          <div className="container pt-6">
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-foreground">
                <strong>Faça login com Google</strong> para acessar as trilhas, salvar seu progresso e continuar de onde parou em qualquer dispositivo.
              </p>
              <Button onClick={() => signInWithGoogle()} className="gap-2 shrink-0">
                Entrar com Google
              </Button>
            </div>
          </div>
        )}

        {/* ── Hero ── */}
        <section className="container py-16 md:py-24 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Plataforma de aprendizado de programação
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Aprenda a programar{' '}
            <span className="text-gradient-accent">com clareza</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Trilhas completas do zero ao avançado em <span className="text-orange-400 font-semibold">Java</span>,{' '}
            <span className="text-blue-400 font-semibold">Python</span> e{' '}
            <span className="text-cyan-400 font-semibold">C</span>. Com exercícios práticos, quizzes e execução de código online.
          </p>
          <button
            onClick={() => document.getElementById('linguagens')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all glow-primary"
          >
            Escolher linguagem <ChevronDown className="h-5 w-5" />
          </button>
        </section>

        {/* ── Language Cards ── */}
        <section id="linguagens" className="container pb-16">
          <h2 className="text-2xl font-bold mb-2 text-center">Escolha sua linguagem</h2>
          <p className="text-muted-foreground text-center mb-10 text-sm">Cada trilha é independente — você pode aprender uma ou todas.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {LANGUAGES.map((lang) => (
              <div key={lang.label} className={`rounded-xl border ${lang.border} ${lang.bg} p-6 flex flex-col transition-colors`}>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{lang.glyph}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${lang.badge}`}>{lang.tag}</span>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${lang.color}`}>{lang.label}</h3>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed flex-1">{lang.description}</p>
                <ul className="space-y-1.5 mb-6">
                  {lang.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Trophy className={`h-3.5 w-3.5 shrink-0 ${lang.color}`} />
                      {h}
                    </li>
                  ))}
                </ul>
                <Link
                  to={lang.to}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border ${lang.border} ${lang.color} hover:opacity-80 transition-opacity`}
                >
                  {lang.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section className="container pb-20">
          <h2 className="text-2xl font-bold mb-8 text-center">O que você encontra aqui</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{f.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
