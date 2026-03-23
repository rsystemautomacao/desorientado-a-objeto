# Como restaurar a versão estável

Se algo der errado, copie os arquivos desta pasta de volta para os seus lugares originais:

## Arquivos de backup
- `_stable/AdminExams.tsx` → `src/components/AdminExams.tsx`
- `_stable/exams.ts` → `api/admin/exams.ts`

## Comandos para restaurar (rodar na raiz do projeto)
```bash
cp _stable/AdminExams.tsx src/components/AdminExams.tsx
cp _stable/exams.ts api/admin/exams.ts
```

## O que era a versão estável
Versão salva em 2026-03-23, antes de adicionar separação por matérias (POO / BI / Lógica de Programação).
Tudo funcionava: criação de provas, resultados, anti-cheat, exportação CSV.
