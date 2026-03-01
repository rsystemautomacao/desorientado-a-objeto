# Arquitetura do Projeto — Desorientado a Objetos

Este documento descreve a estrutura, fluxos e padrões do projeto para facilitar manutenção e onboarding.

---

## 1. Estrutura de pastas

```
Desorientado a Objetos/
├── api/                    # Serverless functions (Vercel)
│   ├── progress.ts         # GET/PUT progresso do usuário
│   ├── profile.ts          # GET/PUT perfil do usuário
│   ├── auth-status.ts      # Diagnóstico Firebase Admin (sem auth)
│   └── admin/
│       └── study-history.ts # Histórico de estudo (admin)
├── public/                 # Assets estáticos
│   ├── robots.txt
│   └── placeholder.svg
├── scripts/                # Utilitários para configuração (env Vercel)
│   ├── vercel-env-service-account.js
│   ├── vercel-env-service-account-b64.js
│   └── vercel-env-service-account-b64-parts.js
├── src/
│   ├── main.tsx            # Entry point; monta app em #root
│   ├── App.tsx             # Providers, rotas e ScrollToTop
│   ├── index.css           # Estilos globais (Tailwind)
│   ├── contexts/           # Contextos React
│   │   └── AuthContext.tsx
│   ├── lib/                # Firebase cliente, utils, stores de API
│   │   ├── firebase.ts
│   │   ├── utils.ts
│   │   ├── profileStore.ts
│   │   └── progressStore.ts
│   ├── hooks/
│   │   ├── useProgress.ts
│   │   ├── use-toast.ts
│   │   └── use-mobile.tsx
│   ├── components/         # Componentes de aplicação
│   │   ├── ProtectedRoute.tsx
│   │   ├── Layout.tsx
│   │   ├── NavLink.tsx
│   │   ├── ScrollToTop.tsx
│   │   ├── QuizComponent.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── CodeFillExerciseBox.tsx
│   │   ├── TryItBox.tsx
│   │   ├── InfoBox.tsx
│   │   └── ui/             # Componentes shadcn (button, card, dialog, etc.)
│   ├── pages/              # Uma página por rota
│   │   ├── Index.tsx
│   │   ├── Trail.tsx
│   │   ├── Lesson.tsx
│   │   ├── Interview.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Profile.tsx
│   │   ├── Admin.tsx
│   │   └── NotFound.tsx
│   ├── data/               # Dados estáticos e tipos
│   │   ├── modules.ts
│   │   ├── lessonContents.ts
│   │   ├── quizData.ts
│   │   ├── interviewData.ts
│   │   └── types.ts
│   └── test/
│       ├── setup.ts
│       └── example.test.ts
├── .env.example            # Template de variáveis de ambiente
├── components.json         # Config shadcn (aliases, Tailwind)
├── index.html
├── package.json
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── vite.config.ts
└── vercel.json             # Rewrites: /api/* → API; resto → SPA
```

**Configuração relevante**

- **Alias:** `@/*` → `./src/*` (tsconfig + Vite).
- **vercel.json:** `/api/(.*)` vai para a API; `/admin` e demais rotas vão para `/index.html` (SPA).
- **Scripts (package.json):** `dev`, `build`, `build:dev`, `lint`, `preview`, `test`, `test:watch`.

---

## 2. Fluxo de autenticação

### Cliente (Firebase Auth + Google)

1. **Inicialização**  
   - `src/lib/firebase.ts`: `initializeApp(firebaseConfig)` com variáveis `VITE_FIREBASE_*` e `getAuth(app)`; exporta `auth`.

2. **Estado e login**  
   - `src/contexts/AuthContext.tsx`:  
     - `onAuthStateChanged(auth, …)` atualiza `user`.  
     - `signInWithGoogle` usa `signInWithPopup(auth, new GoogleAuthProvider())`.  
     - Após login, chama `user.getIdToken(true)` e `getProfileFromApi(token)` para definir `profileComplete` e `profileLoading`.

3. **Uso do token no cliente**  
   - **AuthContext:** após login, usa `getIdToken(true)` e `getProfileFromApi(token)` para checar perfil completo.  
   - **profileStore:** `getProfileFromApi(token)` e `saveProfileToApi(token, profile)` enviam `Authorization: Bearer <token>` em GET/PUT `/api/profile`.  
   - **progressStore:** `getProgressFromApi(token)` e `saveProgressToApi(token, progress)` enviam o mesmo header em GET/PUT `/api/progress`.  
   - **useProgress:** obtém token com `user.getIdToken(true)` e chama as funções do progressStore.  
   - **Profile.tsx:** `getIdToken(true)` para carregar e salvar perfil.  
   - **Admin.tsx:** `getIdToken(true)` e header `Authorization: Bearer <token>` em GET `/api/admin/study-history`.

4. **Proteção de rotas**  
   - `src/components/ProtectedRoute.tsx`: usa `useAuth()`.  
     - Se não houver `user` → redireciona para `/?login=1`.  
     - Se `profileComplete === false` → redireciona para `/perfil`.  
   - Rotas protegidas em `App.tsx`: `/trilha`, `/aula/:id`, `/dashboard`, `/perfil` (todas dentro de `<ProtectedRoute>`).

5. **Admin**  
   - Rota `/admin` não usa `ProtectedRoute`.  
   - Exige query `?k=` igual a `VITE_ADMIN_KEY` (ou chave padrão).  
   - Depois exige login com email igual a `ADMIN_EMAIL` e envia o token do Firebase na API.

### Backend (Firebase Admin)

- **Verificação do token:**  
  - Leitura do header `Authorization`; esperado `Bearer <token>`.  
  - Se ausente ou inválido → 401 com `code` (ex.: `NO_HEADER`, `TOKEN_VERIFY_FAILED`).  
  - Caso contrário: `getAuth(app).verifyIdToken(token)` e uso de `decoded.uid` (ou `decoded.email` no admin).

- **Onde é usado:**  
  - `api/progress.ts` e `api/profile.ts`: `getUserIdFromToken(req)` → `uid`.  
  - `api/admin/study-history.ts`: `requireAdminEmail(req)` → verifica token e compara `decoded.email` com `ADMIN_EMAIL`; 403 se não for admin.

- **Inicialização do Firebase Admin:**  
  - Service account via env: B64 em partes (`FIREBASE_SERVICE_ACCOUNT_B64_PART1`…), ou `FIREBASE_SERVICE_ACCOUNT_B64`, ou `FIREBASE_SERVICE_ACCOUNT_JSON`.  
  - Inicialização lazy em cada API que precisa (ex.: `getFirebaseApp()` / `ensureFirebaseApp()`).

**Resumo de endpoints e auth**

| Endpoint                     | Autenticação              |
|-----------------------------|---------------------------|
| GET/PUT `/api/progress`     | Bearer token → `uid`      |
| GET/PUT `/api/profile`      | Bearer token → `uid`      |
| GET `/api/admin/study-history` | Bearer + email = admin   |
| GET `/api/auth-status`      | Nenhuma (diagnóstico)     |

---

## 3. Conexão com MongoDB

- **Variável de ambiente:** `MONGODB_URI` (connection string; ex.: Atlas com database `desorientado`). Documentada em `.env.example`.

- **Padrão de uso:**  
  - Não há um módulo único de conexão; cada API que usa Mongo instancia o cliente com o mesmo padrão.  
  - Função `getMongoClient()`: lê `MONGODB_URI` e reutiliza `(global as any)._mongoClient` para evitar múltiplas conexões em ambiente serverless.

- **Database:** `desorientado`.

- **Coleções e modelos:**

  | Coleção   | Uso                    | Documento (resumo) |
  |-----------|------------------------|-------------------------------------|
  | `progress` | Progresso do usuário   | `userId`, `completedLessons[]`, `quizResults`, `favorites[]` |
  | `profiles` | Perfil do usuário      | `userId`, `nome`, `tipo`, `curso`, `serieOuSemestre`, `observacoes`, `updatedAt` |

- **Operações:**  
  - **progress:** GET por `userId`; PUT com `updateOne` e `upsert: true`.  
  - **profiles:** GET por `userId`; PUT com `updateOne` e `upsert: true`.  
  - **admin/study-history:** `find({})` em `progress` e `profiles`, agregação por `userId`.

- **Acesso:** direto com `MongoClient` e `collection<T>()`, sem ODM.

---

## 4. Padrão de componentes

- **Organização em `src`:**
  - **`components/`:** componentes de aplicação (Layout, ProtectedRoute, Quiz, CodeBlock, etc.).
  - **`components/ui/`:** primitivos shadcn (button, card, input, dialog, etc.).
  - **`pages/`:** uma página por rota; export default.
  - **`lib/`:** Firebase cliente, utils, stores de API (profileStore, progressStore).
  - **`contexts/`:** apenas `AuthContext`.
  - **`hooks/`:** useProgress, use-toast, use-mobile.
  - **`data/`:** módulos, aulas, quiz, entrevistas e tipos.

- **React + TypeScript:** Uso em todo o `src` (`.tsx`/`.ts`); alias `@/` para `src/`.

- **Estado global:**
  - **Context:** `AuthContext` — `user`, `loading`, `profileComplete`, `profileLoading`, `signInWithGoogle`, `signOut`, `refreshProfileStatus`.
  - **Stores:** `profileStore` e `progressStore` são módulos com funções assíncronas (get/save na API); não há Redux/Zustand global. Estado de progresso é local via **useProgress** (useState + efeitos que chamam progressStore e, opcionalmente, localStorage).

- **Convenções:**
  - Páginas: default export, nome em PascalCase (Index, Trail, Lesson, Profile, Admin, etc.).
  - Componentes: PascalCase; funções/hooks: camelCase.
  - UI em `components/ui/` alinhado ao shadcn (componentes pequenos e reutilizáveis).

---

## 5. Padrão de API routes

- **Localização:** pasta `api/` na raiz. Cada arquivo (ou handler em subpasta) vira rota Vercel:
  - `api/progress.ts` → `/api/progress`
  - `api/profile.ts` → `/api/profile`
  - `api/auth-status.ts` → `/api/auth-status`
  - `api/admin/study-history.ts` → `/api/admin/study-history`

- **Convenção:** Nome do arquivo = segmento da URL. Handler **export default** assíncrono `(req: VercelRequest, res: VercelResponse)`.

- **Request:**
  - Tipos: `VercelRequest`, `VercelResponse` de `@vercel/node`.
  - OPTIONS tratado no início (CORS); depois GET/PUT (ou só GET) conforme a rota.
  - Body em PUT: `req.body` pode vir como string; usar `JSON.parse(body)` quando `typeof body === 'string'`.
  - Auth: header `Authorization: Bearer <token>`.

- **Validação de auth:**
  - Rotas protegidas: chamam `getUserIdFromToken(req)` ou `requireAdminEmail(req)`; em falha respondem **401** (ou **403** no admin) com JSON `{ error, code }` (e opcionalmente `detail`).
  - Firebase Admin inicializado de forma lazy com service account (B64 em partes ou variável única); depois `getAuth(app).verifyIdToken(token)`.

- **Resposta:**
  - Sempre JSON: `res.status(...).json(...)`.
  - Sucesso: 200 e payload (objeto ou lista).
  - Erros: 400 (body inválido), 401 (Unauthorized + `code`), 403 (Forbidden no admin), 405 (Method not allowed), 500 (erro interno; em produção às vezes sem `message`; em algumas rotas pode incluir `hint`).
  - CORS: `Access-Control-Allow-Origin: *` e headers/métodos permitidos definidos por rota.

---

*Documento gerado a partir da análise do repositório. Atualize conforme a evolução do projeto.*
