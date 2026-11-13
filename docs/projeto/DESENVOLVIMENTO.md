# Desenvolvimento do frontend

[README](../../README.md) · [Integração HTTP](../api/INTEGRACAO.md) · [WebSocket](../websocket/INTEGRACAO.md)

## Ambiente e comandos

Use Node 22.12+ da linha 22 e npm. O repositório contém `package-lock.json` e `yarn.lock`; os exemplos desta documentação usam npm e seu lockfile. `npm ci` instala as dependências registradas sem atualizar o lockfile.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Vite com recarga automática; porta configurada 3000 |
| `npm run type-check` | `vue-tsc --build --force` |
| `npm run lint` | ESLint, sem correção automática |
| `npm run lint:fix` | ESLint com correção automática |
| `npm run build` | Tipagem e build de produção em paralelo |
| `npm run build-only` | Apenas build do Vite |
| `npm run preview` | Servir localmente o build já gerado |

## Configuração da API

| Variável | Exemplo local | Uso |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:8080/api/v1` | Base do cliente Axios; os módulos acrescentam `/players`, `/matches` etc. |
| `VITE_WS_BASE_URL` | `ws://localhost:8080/api/v1` | Base do socket; o composable acrescenta `/ws/rooms/:roomCode` |

Não acrescente `/ws` à segunda base nem repita `/api/v1` nas rotas dos módulos. Configure ambas para o mesmo ambiente: uma não é derivada da outra. Ausentes, o código usa `https://ultimate-fodinha-api.onrender.com/api/v1` e `wss://ultimate-fodinha-api.onrender.com/api/v1`. Strings vazias não ativam esse fallback.

O `.env.example` aponta para o ambiente hospedado. Use `.env.local` para os valores da sua máquina. Variáveis `VITE_*` são incluídas no frontend e não devem conter segredos do servidor. Reinicie o Vite após trocar o ambiente; em produção, faça novo build. Em páginas HTTPS, configure HTTP seguro e `wss://`.

Para usar o backend local, siga o README do [repositório da API](https://github.com/joaosimonis/Ultimate-Fodinha-2.0-API/tree/development), aplique as migrations e carregue os jogadores. A origem do frontend precisa estar em `ALLOWED_ORIGINS` do backend. O cadastro administrativo requer um usuário criado pelo comando de admin da API.

## Organização do código

| Caminho | Responsabilidade |
| --- | --- |
| `src/main.ts`, `src/App.vue` | Entrada e estrutura principal |
| `src/app/router` | Rotas e guardas de navegação |
| `src/app/plugins` | Vuetify, Pinia, persistência e registro do router |
| `src/api` | Axios, métodos HTTP, envelopes e extração de erros |
| `src/modules/auth` | Login, token administrativo e telas de administração |
| `src/modules/players` | API, tipos, catálogo e perfil de jogadores |
| `src/modules/matches` | API e tipos de partidas usados pelos dois jogos |
| `src/modules/fodinha`, `src/modules/truco` | Setup, telas de jogo, regras e stores |
| `src/modules/rooms` | Listagem, entrada em sala e conexão WebSocket |
| `src/modules/ranking` | API, tipos e visualização dos rankings |
| `src/shared` | Componentes, composables, utilitários e store de jogadores |
| `src/assets` | Avatares, imagens, animações e áudios |

O alias `@` aponta para `src`. Os módulos HTTP separam caminhos (`api/routes.ts`), chamadas (`api/index.ts`) e tipos (`types`). Novas telas devem usar esses clientes e o helper de erros, seguindo o [guia de integração](../api/INTEGRACAO.md).

## Telas e navegação

| Caminho | Tela |
| --- | --- |
| `/` | Início e acesso ao login administrativo |
| `/fodinha/setup`, `/truco/setup` | Seleção de jogadores e configuração |
| `/fodinha/game/:roomCode?`, `/truco/game/:roomCode?` | Jogo ativo ou acompanhamento |
| `/rooms` | Salas em andamento, com filtro de modo feito no front |
| `/rooms/:roomCode` | Carregamento e entrada na sala |
| `/players`, `/players/:id` | Catálogo e perfil |
| `/ranking` | Rankings de Fodinha, Truco e equipes |
| `/admin/players` | Administração de jogadores e cancelamento por código |

Sem estado de jogo, uma URL de jogo com código redireciona para a entrada da sala; sem código, para o setup. A rota administrativa verifica apenas a presença do token. O backend valida sua autenticidade e expiração. Caminhos desconhecidos redirecionam para `/`.

## Estado e persistência

As stores `fodinha` e `truco` persistem seleção, placar/vidas, identificação da partida, código e `hostToken` pelo plugin de persistência do Pinia, com armazenamento padrão em `localStorage`. As chaves são `fodinha` e `truco`. O JWT administrativo usa `sessionStorage`, na chave `ultimate-fodinha:admin-access-token`.

Presença de `hostToken` define o papel de host na interface. Quem entra pela consulta de sala não recebe esse token e acompanha como espectador. Apagar o armazenamento do host perde essa identificação; a API não oferece recuperação do token. Consulte os fluxos no [guia de WebSocket](../websocket/INTEGRACAO.md).

`usePlayersStore` transforma `avatar_key` em `avatarKey` e mantém a lista simplificada usada nas seleções e salas. As telas de perfil usam os dados completos. O catálogo precisa conter os jogadores referenciados pela partida para reconstruir uma sala.

## Build e publicação

`npm run build` gera `dist/`. O servidor de hospedagem precisa encaminhar URLs da SPA, como `/rooms/ABC234`, para `index.html`, pois o router usa history de navegador.

O Vite configura PWA com atualização automática, precache de assets e cache de áudios MP3/OGG. Isso não implementa uma fila de mutações offline: criar/finalizar partidas e acompanhar salas continuam dependendo do backend. `npm run preview` ajuda a inspecionar o build local.

## Diagnóstico rápido

- Chamadas indo para o servidor hospedado: confira as duas bases e reinicie o Vite.
- HTTP bloqueado pelo navegador: confira endereço do backend, protocolo e CORS.
- Socket falhando com HTTP funcionando: confira `VITE_WS_BASE_URL`, `ws`/`wss` e o código da sala.
- Cadastro ou cancelamento retorna `401`: faça login novamente; não há refresh automático.
- Sala não carrega: confira status, participantes cadastrados e dados de equipe.
- Resultado aparece na tela mas não no ranking: confira se a chamada HTTP de finalização concluiu; o estado WebSocket não finaliza a partida.
