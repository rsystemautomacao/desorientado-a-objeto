import { createContext, useContext, ReactNode } from 'react';

export type Lang = 'java' | 'python' | 'c';

interface LanguageConfig {
  lang: Lang;
  label: string;
  judge0Id: number;
  color: string;        // tailwind text color
  accent: string;       // tailwind bg/border accent
  routePrefix: string;  // '' | '/python' | '/c'
}

const CONFIGS: Record<Lang, LanguageConfig> = {
  java: {
    lang: 'java',
    label: 'Java / POO',
    judge0Id: 91,
    color: 'text-orange-400',
    accent: 'bg-orange-400/10 border-orange-400/20',
    routePrefix: '',
  },
  python: {
    lang: 'python',
    label: 'Python',
    judge0Id: 71,
    color: 'text-blue-400',
    accent: 'bg-blue-400/10 border-blue-400/20',
    routePrefix: '/python',
  },
  c: {
    lang: 'c',
    label: 'Linguagem C',
    judge0Id: 50,
    color: 'text-cyan-400',
    accent: 'bg-cyan-400/10 border-cyan-400/20',
    routePrefix: '/c',
  },
};

const LanguageContext = createContext<LanguageConfig>(CONFIGS.java);

export function LanguageProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <LanguageContext.Provider value={CONFIGS[lang]}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageConfig {
  return useContext(LanguageContext);
}
