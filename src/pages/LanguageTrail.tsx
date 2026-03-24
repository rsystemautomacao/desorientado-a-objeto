import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { pythonModules } from '@/data/modules-python';
import { cModules } from '@/data/modules-c';
import { BookOpen, Clock, ChevronRight, Code2 } from 'lucide-react';

const LEVEL_STYLES = {
  basico:       { label: 'Básico',       badge: 'border-green-500/30 bg-green-500/10 text-green-600',  dot: 'bg-green-500' },
  intermediario:{ label: 'Intermediário',badge: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600', dot: 'bg-yellow-500' },
  avancado:     { label: 'Avançado',     badge: 'border-red-500/30 bg-red-500/10 text-red-600',        dot: 'bg-red-500' },
};

export default function LanguageTrail() {
  const { lang, label, routePrefix, color, accent } = useLanguage();
  const modules = lang === 'python' ? pythonModules : cModules;

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Trilha de Aprendizado — {label}</h1>
          <p className="text-muted-foreground">Do zero ao avançado, passo a passo</p>
        </div>

        {/* Modules */}
        <div className="space-y-10">
          {modules.map((mod, modIdx) => {
            const lvl = LEVEL_STYLES[mod.level];
            return (
              <div key={mod.id}>
                {/* Module header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl border-2 ${accent} font-bold text-lg ${color} shrink-0`}>
                    {mod.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-bold text-lg">Módulo {mod.id} — {mod.title}</h2>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${lvl.badge}`}>
                        {lvl.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{mod.description}</p>
                  </div>
                </div>

                {/* Lessons */}
                <div className="ml-3 pl-8 border-l-2 border-border space-y-2">
                  {mod.lessons.map((lesson, lessonIdx) => (
                    <Link
                      key={lesson.id}
                      to={`${routePrefix}/aula/${lesson.id}`}
                      className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 ${accent} ${color}`}>
                          {lessonIdx + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" /> {lesson.duration}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>

                {/* Connector */}
                {modIdx < modules.length - 1 && (
                  <div className="ml-3 pl-8 mt-2">
                    <div className="w-0.5 h-4 bg-border" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-10 rounded-xl border border-border bg-card p-6 text-center">
          <Code2 className={`h-8 w-8 mx-auto mb-3 ${color}`} />
          <h3 className="font-semibold mb-1">Pronto para praticar?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Resolva exercícios práticos com execução de código em tempo real.
          </p>
          <Link
            to={`${routePrefix}/exercicios`}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${accent} ${color} hover:opacity-80`}
          >
            <BookOpen className="h-4 w-4" />
            Ver exercícios de {label}
          </Link>
        </div>
      </div>
    </Layout>
  );
}
