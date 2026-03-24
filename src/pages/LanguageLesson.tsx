import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import CodeBlock from '@/components/CodeBlock';
import InfoBox from '@/components/InfoBox';
import LangTryItBox from '@/components/LangTryItBox';
import { useLanguage } from '@/contexts/LanguageContext';
import { pythonModules, getPythonAdjacentLessons, getAllPythonLessons } from '@/data/modules-python';
import { cModules, getCAdjacentLessons, getAllCLessons } from '@/data/modules-c';
import { pythonLessonContents } from '@/data/lessonContents-python';
import { cLessonContents } from '@/data/lessonContents-c';
import { ArrowLeft, ArrowRight, CheckCircle2, Target, Clock } from 'lucide-react';

export default function LanguageLesson() {
  const { id } = useParams<{ id: string }>();
  const { lang, label, judge0Id, color, routePrefix } = useLanguage();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(Math.round((scrollTop / docHeight) * 100), 100) : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!id) return null;

  const isPython = lang === 'python';
  const allLessons = isPython ? getAllPythonLessons() : getAllCLessons();
  const lessonMeta = allLessons.find((l) => l.id === id);
  const content = isPython ? pythonLessonContents[id] : cLessonContents[id];
  const { prev, next } = isPython ? getPythonAdjacentLessons(id) : getCAdjacentLessons(id);
  const modules = isPython ? pythonModules : cModules;
  const mod = modules.find((m) => m.id === lessonMeta?.moduleId);
  const codeTitle = isPython ? 'Python' : 'C';

  if (!lessonMeta || !content) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Aula não encontrada</h1>
          <Link to={`${routePrefix}/trilha`} className="text-primary hover:underline">
            Voltar à trilha
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Reading progress bar */}
      <div className="fixed top-16 left-0 right-0 z-40 h-0.5 bg-transparent">
        <div
          className="h-full bg-primary transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="container max-w-4xl py-10 animate-fade-in">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to={`${routePrefix}/trilha`} className="hover:text-foreground">Trilha</Link>
          <span>/</span>
          <span className={color}>Módulo {lessonMeta.moduleId} — {mod?.title}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">{lessonMeta.title}</h1>
          <div className="flex items-center gap-3 flex-wrap text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {lessonMeta.duration}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
              mod?.level === 'basico' ? 'border-green-500/30 bg-green-500/10 text-green-600' :
              mod?.level === 'intermediario' ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600' :
              'border-red-500/30 bg-red-500/10 text-red-600'
            }`}>
              {mod?.level === 'basico' ? 'Básico' : mod?.level === 'intermediario' ? 'Intermediário' : 'Avançado'}
            </span>
            <span className={`font-medium ${color}`}>{label}</span>
          </div>
        </div>

        {/* Objectives */}
        {content.objectives && (
          <div className="mb-8 p-5 rounded-xl border border-border bg-card">
            <h2 className="font-bold flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-primary" /> Objetivos da Aula
            </h2>
            <ul className="space-y-1.5">
              {content.objectives.map((o, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span> {o}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Content Sections */}
        {content.sections.map((s, i) => (
          <section key={i} className="mb-10">
            <h2 className="text-xl font-bold mb-3">{s.title}</h2>
            <div className="text-foreground/85 leading-relaxed whitespace-pre-line text-sm mb-4">{s.body}</div>
            {s.code && <CodeBlock code={s.code} title={codeTitle} />}
            {s.codeExplanation && (
              <div className="mt-2 p-4 rounded-lg bg-secondary text-sm text-foreground/80">
                <span className="font-semibold text-primary">Explicação: </span>{s.codeExplanation}
              </div>
            )}
            {s.tip && <InfoBox type="tip">{s.tip}</InfoBox>}
            {s.warning && <InfoBox type="warning">{s.warning}</InfoBox>}
            {s.tryItCode && (
              <div className="mt-6">
                <LangTryItBox
                  initialCode={s.tryItCode}
                  languageId={judge0Id}
                  langLabel={label}
                  prompt={s.tryItPrompt}
                />
              </div>
            )}
          </section>
        ))}

        {/* Summary */}
        {content.summary && (
          <div className="mb-10 p-5 rounded-xl border border-border bg-card">
            <h2 className="font-bold flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-primary" /> Resumo da Aula
            </h2>
            <ul className="space-y-1.5">
              {content.summary.map((s, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span> {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-border">
          {prev ? (
            <Link
              to={`${routePrefix}/aula/${prev.id}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <div>
                <p className="text-xs uppercase tracking-wide">Anterior</p>
                <p className="font-medium text-foreground">{prev.title}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              to={`${routePrefix}/aula/${next.id}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group text-right"
            >
              <div>
                <p className="text-xs uppercase tracking-wide">Próxima</p>
                <p className="font-medium text-foreground">{next.title}</p>
              </div>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <div className="text-center flex-1">
              <p className="text-sm text-muted-foreground mb-2">Você concluiu a trilha de {label}!</p>
              <Link
                to={`${routePrefix}/exercicios`}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity`}
              >
                Praticar com exercícios →
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
