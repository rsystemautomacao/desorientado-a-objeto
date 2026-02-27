# Melhoria 1: Dark Mode

## Onde foi implementado

| Arquivo | Alteração |
|--------|-----------|
| `index.html` | Script inline no `<head>` que lê `localStorage.theme` e aplica a classe `light` no `<html>` antes da primeira pintura (evita flash). |
| `src/index.css` | Bloco `html.light { ... }` com variáveis CSS do tema claro. `:root` permanece como tema escuro (comportamento atual). |
| `src/contexts/ThemeContext.tsx` | **Novo.** Provider que expõe `theme`, `setTheme`, `toggleTheme`; persiste em `localStorage` com chave `theme`; fallback se localStorage falhar. |
| `src/App.tsx` | Envolve a árvore com `<ThemeProvider>`. |
| `src/components/Layout.tsx` | Botão toggle (ícone Sol/Lua) no header desktop e item "Tema claro/escuro" no menu mobile. |
| `src/pages/Admin.tsx` | Botão toggle (Sol/Lua) no header do painel admin. |

## Como habilitar / testar

- **Não há feature flag:** o tema é 100% opt-in. Quem não clicar no toggle mantém o tema atual (escuro).
- **Testar:** abrir qualquer página (Home, Trilha, Admin etc.), clicar no ícone de Sol (no header) para ir para tema claro; clicar na Lua para voltar ao escuro. Recarregar a página: a preferência deve persistir (sem piscar).
- **Persistência:** a chave no localStorage é `theme`, valores `"light"` ou `"dark"`.

## Como reverter

- **Reverter o commit** da melhoria 1 (um único commit).
- Ou remover manualmente: script em `index.html`; bloco `html.light` em `index.css`; `ThemeContext.tsx`; uso de `ThemeProvider` e `useTheme` em `App.tsx`, `Layout.tsx` e `Admin.tsx`.

## Checklist manual (validação em produção)

1. [ ] Abrir o site **sem** preferência salva (nova aba ou localStorage limpo): deve carregar no tema escuro, sem flash.
2. [ ] Clicar no toggle (Sol) no header: deve mudar para tema claro em todas as áreas visíveis.
3. [ ] Recarregar a página: deve permanecer em tema claro.
4. [ ] Clicar no toggle (Lua): deve voltar ao tema escuro; recarregar e manter escuro.
5. [ ] Navegar para Trilha, Dashboard, Perfil, Admin: toggle deve aparecer e o tema deve ser o mesmo em todas.
6. [ ] No Admin (header do painel): toggle deve funcionar igual.
7. [ ] Em modo anônimo/privado (localStorage pode falhar): o toggle não deve quebrar a página; a preferência pode não persistir após recarregar.
8. [ ] Fluxos existentes (login, trilha, quiz, etc.): devem continuar funcionando com e sem mudança de tema.
