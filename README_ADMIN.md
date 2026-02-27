# Admin — Trilhas Java

Documentação da área de administração do curso Desorientado a Objetos.

## Rotas do admin

| Rota      | Descrição |
|-----------|-----------|
| `/admin`  | Página única do admin. **Requer** query `?k=<chave>` na URL; caso contrário retorna 404. |

- A chave padrão é `desorientado-admin`. Uma chave extra pode ser configurada em `VITE_ADMIN_KEY` (build).
- Após acessar com chave válida, o admin deve fazer login com **e-mail/senha** (Firebase Auth). Apenas o e-mail configurado em `ADMIN_EMAIL` (backend) tem acesso aos dados.

## Endpoints (backend)

| Método | Endpoint                     | Autenticação | Descrição |
|--------|------------------------------|--------------|-----------|
| GET    | `/api/admin/study-history`   | `Authorization: Bearer <token>` + e-mail do token deve ser `ADMIN_EMAIL` | Retorna lista de alunos com progresso e perfil (progress + profiles do MongoDB). |

- Em caso de token ausente ou e-mail diferente de `ADMIN_EMAIL`, a API responde **403 Forbidden**.
- Resposta de sucesso: `{ "entries": StudyHistoryEntry[] }`.

## Como rodar local

1. Configure as variáveis de ambiente (veja `.env.example`):
   - `VITE_ADMIN_KEY` (opcional): chave para acessar `/admin?k=...`
   - No servidor (Vercel): `ADMIN_EMAIL`, `MONGODB_URI`, Firebase service account (B64 ou JSON).

2. Frontend:
   ```bash
   npm run dev
   ```
   Acesse: `http://localhost:5173/admin?k=desorientado-admin`

3. Backend (APIs): as funções em `api/` rodam no Vercel. Para testar localmente use `vercel dev` (se configurado).

## Como validar antes do deploy

- [ ] Acessar `/admin` **sem** `?k=...` → deve exibir 404 (NotFound).
- [ ] Acessar `/admin?k=desorientado-admin` → deve exibir tela de login (se não logado).
- [ ] Login com conta **diferente** de `ADMIN_EMAIL` → deve exibir 404.
- [ ] Login com `ADMIN_EMAIL` → deve carregar o dashboard (cards, tabela de alunos).
- [ ] Verificar que a tabela mostra: Nome, Trilha atual, Progresso %, Última atividade, Exercícios, Taxa de acerto, Alertas.
- [ ] Testar busca por nome, filtros (trilha, progresso, status), ordenação e paginação.
- [ ] Clicar em um aluno → abre modal de detalhe (progresso por módulo, quizzes, pontos de dificuldade).
- [ ] Exportar CSV → download do arquivo com os dados da tabela filtrada.
- [ ] Confirmar que rotas antigas (`/`, `/trilha`, `/dashboard`, etc.) continuam funcionando.

## Segurança

- Não exponha a chave `?k=` em lugares públicos.
- `ADMIN_EMAIL` deve ser o único e-mail com acesso à API admin; mantido no servidor (Vercel).
- Dados sensíveis (ex.: userId) são exibidos apenas para o admin logado; não há vazamento para outras rotas.

## Observabilidade

- Em caso de erro 500 na API admin, a resposta pode incluir `hint` com orientação (MongoDB, Firebase, etc.).
- Logs do handler em `api/admin/study-history.ts` aparecem em Vercel > Deployments > Functions.
