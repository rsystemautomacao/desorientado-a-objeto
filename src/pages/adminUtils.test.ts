import { describe, it, expect } from 'vitest';
import {
  getProgressPct,
  getQuizAccuracy,
  formatLastActivity,
  getAlerts,
  TOTAL_LESSONS,
  type StudyHistoryEntry,
} from './adminUtils';

function makeEntry(overrides: Partial<StudyHistoryEntry> = {}): StudyHistoryEntry {
  return {
    userId: 'u1',
    nome: 'Aluno Teste',
    tipo: 'Superior',
    curso: 'TI',
    serieOuSemestre: '1',
    completedLessons: [],
    completedCount: 0,
    quizResults: {},
    favorites: [],
    updatedAt: '',
    ...overrides,
  };
}

describe('adminUtils', () => {
  describe('getProgressPct', () => {
    it('retorna 0 quando total de aulas é 0', () => {
      expect(getProgressPct(makeEntry({ completedCount: 5 }), 0)).toBe(0);
    });
    it('retorna percentual arredondado', () => {
      expect(getProgressPct(makeEntry({ completedCount: 10 }), 31)).toBe(32);
      expect(getProgressPct(makeEntry({ completedCount: 31 }), 31)).toBe(100);
    });
  });

  describe('getQuizAccuracy', () => {
    it('retorna null quando não há quizzes', () => {
      expect(getQuizAccuracy(makeEntry())).toBe(null);
    });
    it('retorna percentual de acertos', () => {
      expect(
        getQuizAccuracy(makeEntry({ quizResults: { l1: { score: 5, total: 10 } } }))
      ).toBe(50);
      expect(
        getQuizAccuracy(makeEntry({ quizResults: { l1: { score: 8, total: 10 } } }))
      ).toBe(80);
    });
  });

  describe('formatLastActivity', () => {
    it('retorna N/D para string vazia', () => {
      expect(formatLastActivity('')).toBe('N/D');
      expect(formatLastActivity('   ')).toBe('N/D');
    });
    it('retorna N/D para data inválida', () => {
      expect(formatLastActivity('invalid')).toBe('N/D');
    });
    it('retorna formato de data para data válida antiga', () => {
      const d = new Date();
      d.setDate(d.getDate() - 100);
      const s = d.toISOString();
      const result = formatLastActivity(s);
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{2}/);
    });
  });

  describe('getAlerts', () => {
    it('inclui "Taxa de acerto baixa" quando acerto < 50%', () => {
      const entry = makeEntry({
        quizResults: { l1: { score: 2, total: 10 } },
        updatedAt: new Date().toISOString(),
      });
      const alerts = getAlerts(entry, 999);
      expect(alerts).toContain('Taxa de acerto baixa');
    });
    it('não inclui taxa baixa quando acerto >= 50%', () => {
      const entry = makeEntry({
        quizResults: { l1: { score: 5, total: 10 } },
        updatedAt: new Date().toISOString(),
      });
      const alerts = getAlerts(entry, 999);
      expect(alerts).not.toContain('Taxa de acerto baixa');
    });
  });
});
