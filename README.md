# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Login com Google e progresso por aluno

O curso exige login com Google para acessar a **Trilha**, **Aulas** e **Dashboard**. O progresso (aulas concluídas, quizzes, favoritos) é salvo no **MongoDB Atlas** (plano free), vinculado à conta do aluno, via API serverless no Vercel.

### 1. Firebase (login com Google)

1. Crie um projeto em [Firebase Console](https://console.firebase.google.com).
2. Ative **Authentication** → Sign-in method → **Google** (ative e salve).
3. Em **Configurações do projeto** → **Seus apps** → Adicionar app → **Web**. Copie o `firebaseConfig`.
4. Para a API validar o token: **Configurações** → **Contas de serviço** → **Gerar nova chave privada**. Guarde o JSON (será usado como `FIREBASE_SERVICE_ACCOUNT_JSON` no Vercel).

### 2. MongoDB Atlas (banco de progresso)

1. Crie uma conta em [MongoDB Atlas](https://cloud.mongodb.com) e um **cluster Free** (M0).
2. **Database Access** → Add New Database User (usuário e senha).
3. **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`) para o Vercel conseguir conectar.
4. **Database** → Connect → **Drivers** → copie a connection string. Use no formato:
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/desorientado?retryWrites=true&w=majority`
   (o banco `desorientado` e a collection `progress` são criados automaticamente pela API.)

### 3. Variáveis de ambiente

- **No seu `.env`** (copie de `.env.example`): preencha as `VITE_FIREBASE_*` (front) e, se for rodar a API localmente, `MONGODB_URI` e `FIREBASE_SERVICE_ACCOUNT_JSON`.
- **No Vercel** (Settings → Environment Variables): adicione todas:
  - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
  - `MONGODB_URI` (connection string do Atlas)
  - `FIREBASE_SERVICE_ACCOUNT_JSON` (JSON em uma linha) **ou** `FIREBASE_SERVICE_ACCOUNT_B64` (Base64; recomendado se o Vercel alterar o JSON)

### Se as APIs retornam 401 (Unauthorized)

O 401 nas rotas `/api/progress` e `/api/profile` significa que o **token do Firebase não foi aceito** no servidor. Confira:

1. **Mesmo projeto Firebase**  
   A chave em `FIREBASE_SERVICE_ACCOUNT_JSON` no Vercel **tem que ser** do **mesmo** projeto em que o app web faz login (o que está em `VITE_FIREBASE_PROJECT_ID`).  
   No JSON da chave, o campo `project_id` deve ser igual ao `VITE_FIREBASE_PROJECT_ID` (ex.: `desorientado-a-objetos`).

2. **Onde gerar a chave**  
   Firebase Console → projeto do app → **Configurações do projeto** (engrenagem) → **Contas de serviço** → **Gerar nova chave privada**. Use esse JSON no Vercel.

3. **Formato no Vercel**  
   O Vercel às vezes altera ou trunca o JSON (aspas, barras). Se `/api/auth-status` retornar `json_invalid`, use **Base64** em vez de JSON:
   - **Opção A (recomendada – Base64):** No terminal, na pasta do projeto:
     ```bash
     node scripts/vercel-env-service-account-b64.js "C:\Users\richa\Downloads\sua-chave.json"
     ```
     Copie **toda** a saída e cole no valor da variável **`FIREBASE_SERVICE_ACCOUNT_B64`** no Vercel (crie a variável se não existir; pode remover ou deixar `FIREBASE_SERVICE_ACCOUNT_JSON` em branco). Depois, **Redeploy**.
   - **Opção B (JSON em uma linha):** `node scripts/vercel-env-service-account.js "C:\caminho\para\sua-chave.json"` → copie a saída em `FIREBASE_SERVICE_ACCOUNT_JSON`.

4. **Ambiente**  
   No Vercel, a variável `FIREBASE_SERVICE_ACCOUNT_JSON` precisa existir no ambiente que você está usando (Production / Preview).

5. **Diagnóstico no navegador**  
   Abra no navegador: `https://seu-dominio.vercel.app/api/auth-status`  
   - Se retornar `{ "ok": false, "reason": "...", "hint": "..." }`, o servidor não está com a chave correta; siga o `hint`.  
   - Se retornar `{ "ok": true, "projectId": "desorientado-a-objetos" }`, a chave está OK no servidor; se ainda der 401 ao salvar, faça logout e login novamente com Google.

6. **Logs no Vercel**  
   Em **Vercel → projeto → Logs** (ou Deployments → função), veja se aparece:
   - `FIREBASE_SERVICE_ACCOUNT_JSON: JSON invalido...` ou `...falta private_key ou client_email` → o valor foi truncado; use uma única linha e redeploy.
   - `Progress API verifyIdToken failed:` ou `Profile API verifyIdToken failed:` → mensagem do Firebase (ex.: "Decoding error", "Expected project X").

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
