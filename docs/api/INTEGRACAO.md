# Integração HTTP consumida pelo frontend

[README](../../README.md) · [Desenvolvimento](../projeto/DESENVOLVIMENTO.md) · [Tempo real](../websocket/INTEGRACAO.md)

Este guia reúne o contrato necessário às telas e aos clientes atuais. A referência completa fica no [repositório da API](https://github.com/joaosimonis/Ultimate-Fodinha-2.0-API/tree/development), em `docs/api`. Os exemplos usam UUIDs fictícios; substitua-os por valores retornados pelo backend.

## Cliente, retornos e erros

A base vem de `VITE_API_BASE_URL` e já inclui `/api/v1`. Os caminhos deste guia são relativos a essa base. O Axios é configurado em [src/api/client/index.ts](../../src/api/client/index.ts), com `Content-Type: application/json`. Os métodos de [src/api/http.ts](../../src/api/http.ts) devolvem o corpo HTTP; os clientes dos módulos extraem seu campo `data`.

Exemplo: HTTP retorna `{"data":[...]}`; `await playersApi.list()` devolve diretamente a lista. A exceção é `playersApi.remove()`, que devolve `{"message":"jogador removido com sucesso"}`. Não extraia `.data` novamente nas telas.

```typescript
import { playersApi } from "@/modules/players/api";
import { getApiErrorMessage, getApiErrorStatus } from "@/api/error";

try {
  const players = await playersApi.list();
  console.log(players);
} catch (error) {
  console.error(getApiErrorMessage(error), getApiErrorStatus(error));
}
```

O helper de [erros](../../src/api/error.ts) procura `response.data.error`, depois `response.data.message`. Para falha Axios sem mensagem usa `Erro ao comunicar com o servidor.`; para outros erros, `Erro inesperado.`. `getApiErrorStatus` retorna o status ou `null` quando não há resposta HTTP. Erros locais de domínio do frontend podem exigir preservar `Error.message`, como faz a tela de salas.

| Status | Significado para a integração |
| --- | --- |
| 400 | JSON/campos inválidos, regra de partida ou filtro de ranking rejeitado |
| 401 | Login inválido ou JWT ausente, inválido ou expirado |
| 404 | Jogador, partida ou sala não encontrada |
| 409 | Nome de jogador em uso ou sala cancelada/conflito de criação |
| 500 | Erro interno; alguns UUIDs inválidos e violações de referência também chegam assim |
| Sem status | Rede, CORS ou outra falha sem resposta acessível |

Os clientes propagam erros; não há interceptor de refresh, logout automático ou retry HTTP global. Os tipos TypeScript não validam a resposta em runtime.

## Autenticação

Cliente: [authApi](../../src/modules/auth/api/index.ts). Tipos: [auth.types.ts](../../src/modules/auth/types/auth.types.ts).

`authApi.login(payload)` → `POST /auth/login`, sucesso `200`.

Payload:

```json
{"username":"admin","password":"sua-senha"}
```

Resposta HTTP:

```json
{
  "data": {
    "authenticated": true,
    "access_token": "JWT_RETORNADO",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {"username":"admin","role":"admin"}
  }
}
```

O cliente salva `access_token` em `sessionStorage` e devolve o objeto interno. `getAdminAuthHeaders()` acrescenta `Authorization: Bearer <token>` em criar/excluir jogador e cancelar partida. Sem token, devolve headers vazios e o servidor rejeita a operação. `adminAuthStorage.removeToken()` limpa o token local. Não há refresh automático; a guarda de rota verifica somente sua presença.

Erros principais: `400` com `dados inválidos`; `401` com `credenciais inválidas`, `token inválido` ou `token expirado`; `500` com `erro ao autenticar`.

## Jogadores

Cliente: [playersApi](../../src/modules/players/api/index.ts). Tipos: [players.types.ts](../../src/modules/players/types/players.types.ts).

| Método do cliente | HTTP | Retorno do cliente |
| --- | --- | --- |
| `list()` | `GET /players` | `PlayerResponse[]` |
| `getById(id)` | `GET /players/:id` | `PlayerResponse` |
| `create(payload)` | `POST /players`, JWT | `PlayerResponse`; HTTP 201 |
| `remove(id)` | `DELETE /players/:id`, JWT, sem corpo | Objeto `message`; HTTP 200 |

As consultas retornam HTTP `200`; listas são ordenadas por `avatar_key`. Criação recebe:

```json
{
  "name":"Jogador Exemplo",
  "avatar_key":"exemplo",
  "title":"Guardião",
  "lore":"História do personagem.",
  "ultimate":{"name":"Proteção","description":"Protege os aliados."}
}
```

Resposta HTTP de criação ou consulta individual:

```json
{
  "data": {
    "id":"11111111-1111-4111-8111-111111111111",
    "name":"Jogador Exemplo",
    "avatar_key":"exemplo",
    "title":"Guardião",
    "lore":"História do personagem.",
    "ultimate":{"name":"Proteção","description":"Protege os aliados."},
    "created_at":"2026-11-13T12:00:00Z"
  }
}
```

A listagem envolve esses objetos em `data: [...]`. `avatar_key` é resolvido em assets locais pelo frontend; não é uma URL enviada pela API. O tipo de criação do front exige todos os campos acima; o backend exige `name`, `avatar_key` e o objeto `ultimate`.

Erros principais: `400` dados inválidos; `401` nas mutações; `404` jogador não encontrado; `409` nome em uso. Excluir um jogador que participa de partidas pode retornar `500` pela chave estrangeira.

**Diferenças atuais:** sem jogadores, o backend retorna `data: null`, enquanto `playersApi.list()` é tipado como array e a store chama `.map()` diretamente. Registros consultados também podem ter `ultimate: null`, embora o tipo do front o declare obrigatório. Esses casos não são normalizados pelo cliente atual.

## Partidas e salas

Cliente: [matchesApi](../../src/modules/matches/api/index.ts). Tipos: [matches.types.ts](../../src/modules/matches/types/matches.types.ts).

| Método do cliente | HTTP | Retorno do cliente |
| --- | --- | --- |
| `list({ status: "live" })` | `GET /matches?status=live` | `MatchResponse[]`, sem participantes/equipes |
| `getById(id)` | `GET /matches/:id` | Detalhe `MatchResponse` |
| `getRoomByCode(code)` | `GET /rooms/:room_code` | Detalhe `MatchResponse` |
| `create(payload)` | `POST /matches` | `MatchResponse` com token; HTTP 201 |
| `addPlayers(id, payload)` | `POST /matches/:id/players` | Detalhe atualizado |
| `finish(id, payload)` | `PATCH /matches/:id/finish` | Detalhe finalizado |
| `cancelByRoomCode(code)` | `PATCH /admin/matches/room/:room_code/cancel`, JWT, sem corpo | Detalhe cancelado |

Exceto criação, sucessos retornam HTTP `200`. A API tem outras operações/filtros, mas a tabela descreve o cliente implementado no front. Mutações HTTP de partida são públicas, com exceção do cancelamento; o front limita controles de jogo pela presença do `hostToken`, mas isso não equivale a uma validação do servidor nessas rotas.

### Criar e associar participantes

Fodinha: `create({ mode: "fodinha", lives: 3 })`; vidas de 1 a 5. Truco: `create({ mode: "truco", max_score: 15 })`; pontuação de 15, 24 ou 30. Não misture configuração dos dois modos.

Exemplo de resposta da criação:

```json
{
  "data": {
    "id":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    "mode":"fodinha",
    "status":"ongoing",
    "room_code":"ABC234",
    "host_token":"TOKEN_DA_SALA",
    "lives":3,
    "created_at":"2026-11-13T12:00:00Z"
  }
}
```

O `host_token` aparece somente nesta resposta. Guarde o objeto da criação enquanto faz a associação; a resposta de `addPlayers` não devolve o token novamente.

Payload de associação de Fodinha:

```json
{
  "players": [
    {"player_id":"11111111-1111-4111-8111-111111111111"},
    {"player_id":"22222222-2222-4222-8222-222222222222"}
  ]
}
```

No Truco, cada objeto também recebe `team_name`. Envie todos os quatro ou seis participantes em uma chamada, divididos em exatamente duas equipes iguais. A operação adiciona, sem substituir participantes existentes; duplicação gera erro.

O setup segue: criar partida → associar participantes → preencher store com UUID/código/token → abrir tela de jogo. Essas duas chamadas não são uma transação conjunta; uma falha na associação pode deixar uma partida criada sem configuração completa.

### Detalhe e campos opcionais

Uma consulta de detalhe retorna o modelo da criação, sem `host_token`, e pode incluir `players`, `teams`, `live_state`, `finished_at` e `cancelled_at`. Status: `ongoing`, `finished` ou `cancelled`. Datas são strings RFC 3339.

Exemplo do formato de uma participação no detalhe:

```json
{
  "id":"bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  "match_id":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  "player_id":"11111111-1111-4111-8111-111111111111",
  "placement":null,
  "is_winner":false
}
```

Participantes de Truco também podem incluir `team_id`, `team_name` e `final_score`; Fodinha pode incluir `remaining_lives`. O `id` da participação é diferente do UUID de cadastro em `player_id`.

Exemplo do formato de equipe em `teams`:

```json
{
  "id":"aaaaaaaa-1111-4111-8111-111111111111",
  "match_id":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  "team_name":"Equipe A",
  "placement":null,
  "is_winner":false
}
```

O backend pode omitir `final_score` antes da finalização; o tipo `MatchTeamResponse` do front atualmente declara `number | null`, sem marcar o campo opcional. Trate campos ainda ausentes com esse comportamento em mente. A listagem de partidas não carrega `players` e `teams`: consulte o detalhe antes de reconstruir o jogo.

No Truco, `applyMatchTeamIds` associa equipes usando os participantes e depois o nome. A store mantém `apiId` para enviar ao backend; `id` também pode ser gerado localmente. Não envie um ID exclusivamente local como `team_id`.

### Finalizar

Fodinha envia todos os participantes com colocação única de 1 a N e vidas restantes entre zero e as iniciais:

```json
{
  "players": [
    {"player_id":"11111111-1111-4111-8111-111111111111","remaining_lives":2,"placement":1},
    {"player_id":"22222222-2222-4222-8222-222222222222","remaining_lives":0,"placement":2}
  ]
}
```

Truco envia duas equipes distintas; uma deve atingir `max_score`, sem empate:

```json
{
  "teams": [
    {"team_id":"aaaaaaaa-1111-4111-8111-111111111111","final_score":15},
    {"team_id":"bbbbbbbb-2222-4222-8222-222222222222","final_score":9}
  ]
}
```

O front usa `team_id` a partir de `apiId`, com fallback para `team_name`. Se ambos forem enviados, o backend prioriza o ID. Não envie `players` para finalizar Truco ou `teams` para Fodinha.

O retorno é o detalhe com `status: finished`, `finished_at` e resultados dos participantes/equipes. Somente a finalização HTTP salva o resultado que entra no ranking. Os watchers de vencedor tentam finalizar no host; falhas são exibidas em `finishError`. Revanche cria uma nova partida e outro código/token.

### Entrada e cancelamento

A lista de salas consulta `status=live`, alias de `ongoing`. `useJoinRoom` consulta a sala, exige `ongoing`, carrega o catálogo e reconstrói o jogo. A consulta de sala não devolve host token, portanto uma entrada por código configura um espectador. Use o código exatamente como retornado pela API.

O cancelamento administrativo devolve `status: cancelled` e `cancelled_at`. A API também permite cancelar uma partida já finalizada, retirando-a do ranking. Consulta de sala cancelada retorna `409` com `message`, não `error`:

```json
{"message":"Essa partida foi cancelada pelo admin."}
```

Outros erros: `400` para configuração/resultado inválido, duplicação ou partida já finalizada; `404` para partida/sala inexistente; `409` ao finalizar cancelada; `401` no cancelamento sem JWT válido. UUIDs inválidos e jogadores inexistentes na associação podem retornar `500`.

## Ranking

Cliente: [rankingApi](../../src/modules/ranking/api/index.ts). Tipos completos: [ranking.types.ts](../../src/modules/ranking/types/ranking.types.ts).

| Método | Requisição | Retorno do cliente |
| --- | --- | --- |
| `getFodinhaRanking(limit)` | `GET /ranking?mode=fodinha&limit=10` | `FodinhaRankingResponse[]` |
| `getTrucoRanking(teamSize, limit)` | `GET /ranking?mode=truco&team_size=2&limit=10` | `TrucoRankingResponse[]` |
| `getTrucoTeamRanking(teamSize, limit)` | `GET /ranking/truco/teams?team_size=2&limit=10` | `TrucoTeamRankingResponse[]` |

`limit` tem padrão 10, precisa ser inteiro positivo e é limitado a 100 no backend. `teamSize` é 2 ou 3; não envie `team_size` para Fodinha. Sucesso HTTP `200`, com `data: []` quando vazio. Somente partidas finalizadas entram no resultado.

Cada item de Fodinha tem `position`, `player_id`, `name`, `avatar_key`, `games_played`, `gold_medals`, `silver_medals`, `bronze_medals` e `podiums`. A ordem prioriza ouro, prata e bronze, depois os demais desempates do backend.

Cada item de Truco individual tem identificação do jogador, `position`, `games_played`, `wins`, `losses` e `win_rate`. O percentual vai de 0 a 100, não de 0 a 1. A ordem prioriza vitórias e aproveitamento.

Cada item de equipe tem `position`, `team_key`, `players` (objetos `id`, `name`, `avatar_key`), `games_played`, `wins`, `losses`, `win_rate`, `points_for`, `points_against`, `point_diff` e `last_played_at`. `team_key` representa uma composição de jogadores entre partidas, não o `team_id` de uma partida. A ordem vem pronta do backend e inclui saldo de pontos nos desempates.

Filtros inválidos retornam `400` com `error`; falhas internas retornam `500`. Não recalcule posições ou aproveitamento nas telas: use o retorno do serviço.

## Ao alterar a integração

Atualize caminhos, cliente e tipos do módulo juntos. Confira payloads e erros no backend e revise este guia quando o consumo mudar. O contrato completo dos endpoints permanece no repositório da API; este documento registra o recorte e as adaptações do frontend.
