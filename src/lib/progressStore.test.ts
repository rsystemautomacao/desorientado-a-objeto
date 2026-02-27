import { describe, it, expect } from 'vitest';
import {
  addQuizAttempt,
  addLessonTime,
  type QuizHistory,
} from './progressStore';

describe('addQuizAttempt', () => {
  it('adiciona primeira tentativa quando não há histórico', () => {
    const history = addQuizAttempt(undefined, 'lesson-1', 3, 5, '2025-01-01T00:00:00.000Z', 10);
    expect(history['lesson-1']).toHaveLength(1);
    expect(history['lesson-1'][0]).toMatchObject({ score: 3, total: 5 });
  });

  it('mantém no máximo N tentativas por aula (mais recentes)', () => {
    const existing: QuizHistory = {
      'lesson-1': Array.from({ length: 10 }, (_, i) => ({
        score: i,
        total: 5,
        timestamp: `2025-01-0${i + 1}T00:00:00.000Z`,
      })),
    };
    const history = addQuizAttempt(existing, 'lesson-1', 10, 5, '2025-01-20T00:00:00.000Z', 10);
    expect(history['lesson-1']).toHaveLength(10);
    // deve ter descartado a primeira tentativa (score 0) e mantido as mais recentes
    expect(history['lesson-1'][0].score).toBe(1);
    expect(history['lesson-1'][9].score).toBe(10);
  });
});

describe('addLessonTime', () => {
  it('soma tempo para uma aula, criando objeto quando necessário', () => {
    const first = addLessonTime(undefined, 'lesson-1', 30);
    expect(first['lesson-1']).toBe(30);
    const second = addLessonTime(first, 'lesson-1', 15);
    expect(second['lesson-1']).toBe(45);
  });

  it('ignora valores não positivos mantendo o estado', () => {
    const base = { 'lesson-1': 60 };
    const same = addLessonTime(base, 'lesson-1', 0);
    expect(same['lesson-1']).toBe(60);
  });
});
