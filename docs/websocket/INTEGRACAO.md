# Integração de salas em tempo real

[README](../../README.md) · [HTTP](../api/INTEGRACAO.md)

## Cliente e conexão

O [useRoomSocket](../../src/modules/rooms/composables/useRoomSocket.ts) centraliza a conexão. Os [tipos de mensagens](../../src/modules/rooms/types/roomSocket.types.ts) ficam no módulo de salas; o formato do estado fica em [matches.types.ts](../../src/modules/matches/types/matches.types.ts).

Com `VITE_WS_BASE_URL=ws://localhost:8080/api/v1`, `connect("ABC234")` abre `ws://localhost:8080/api/v1/ws/rooms/ABC234`. Não é exigido JWT para assistir. O servidor consulta a sala antes do upgrade: inexistente retorna HTTP 404, cancelada retorna HTTP 409. No navegador, o erro do socket normalmente não expõe esse corpo HTTP; a consulta prévia de sala permite mostrar o motivo.

O composable expõe `status`, `error`, `roomSnapshot`, `liveState`, `viewerCount`, `lastMessage`, `connect`, `close`, `sendPing` e `sendRoomState`.

## Host e espectador

O setup cria a partida e guarda seu `host_token` na store persistida. A presença desse token habilita os controles de host na interface. Ele é diferente do JWT administrativo e é enviado dentro da mensagem de atualização.

Quem entra pelo código passa por `useJoinRoom`, consulta a partida e carrega os jogadores para reconstruir a tela. Essa consulta não retorna host token, então a entrada é de espectador. As stores aplicam `live_state` recebido e as páginas conectam o socket para acompanhar novas mensagens.

## Eventos recebidos

| Evento | Payload e efeito no composable |
| --- | --- |
| `room_snapshot` | Partida completa; atualiza `roomSnapshot` e inicializa `liveState` a partir de `payload.live_state` |
| `room_state_updated` | Estado novo; substitui `liveState` |
| `viewer_count_updated` | `{ "viewer_count": N }`; atualiza o contador de conexões |
| `error` | Campo `error` com mensagem; atualiza o erro exposto |
| `pong` | Resposta ao ping; fica disponível em `lastMessage` |

As páginas observam `liveState.lives` ou `liveState.scores` e sincronizam suas stores. O contador inclui o host e abas repetidas; não representa usuários únicos. Mensagens inválidas produzem `Mensagem inválida recebida da sala.`. Os tipos não fazem validação estrutural em runtime.

## Estado publicado pelo front

Fodinha usa UUID do jogador como chave:

```json
{
  "type":"room_state_updated",
  "host_token":"TOKEN_DA_CRIACAO",
  "payload":{
    "mode":"fodinha",
    "lives":{
      "11111111-1111-4111-8111-111111111111":3,
      "22222222-2222-4222-8222-222222222222":1
    }
  }
}
```

Truco publica pontuações pelas chaves `apiId` das equipes:

```json
{
  "type":"room_state_updated",
  "host_token":"TOKEN_DA_CRIACAO",
  "payload":{
    "mode":"truco",
    "scores":{
      "aaaaaaaa-1111-4111-8111-111111111111":10,
      "bbbbbbbb-2222-4222-8222-222222222222":7
    }
  }
}
```

A sincronização de Truco aceita chaves por `apiId`, depois `id` local e nome como compatibilidade, mas a publicação atual envia somente equipes com `apiId`.

O servidor valida o host token, salva o JSON e transmite para todos os clientes, incluindo o remetente, sem retransmitir o token. Cada atualização substitui todo o estado anterior: envie o mapa completo de vidas/pontos. O backend aceita JSON genérico; os formatos acima são a convenção adotada pelo frontend.

```typescript
const roomSocket = useRoomSocket();
roomSocket.connect(roomCode);

// Depois de conectado, quando houver mudança no jogo:
const sent = roomSocket.sendRoomState({ mode: "fodinha", lives }, hostToken);
```

`sendRoomState` retorna `false` se a conexão não estiver aberta, exibindo `A sala ainda não está conectada.`. `true` significa que o envio foi solicitado ao WebSocket, sem garantir persistência ou confirmação do servidor. Não há fila de atualizações offline.

## Reconexão e encerramento

Estados: `idle`, `connecting`, `connected`, `reconnecting`, `closed` e `error`. Após fechamento inesperado, o cliente tenta reconectar com atrasos de 1, 2, 5, 10 e 15 segundos. Cada conexão bem-sucedida zera a contagem; ao esgotar tentativas consecutivas, mostra `Conexão com a sala perdida.`.

`close()` cancela reconexões e encerra a conexão manualmente. O composable também fecha ao desmontar o componente. Cada reconexão recebe novo snapshot. `sendPing()` envia `{"type":"ping"}`; não há agendamento periódico de heartbeat no cliente.

## Limites que afetam as telas

- Estado ao vivo não grava resultado final. O host ainda precisa concluir `matchesApi.finish()` via HTTP para atualizar o ranking.
- Adicionar participantes, finalizar e cancelar via HTTP não gera broadcast automático. Não espere receber esses eventos no socket.
- Cancelamento bloqueia novas conexões, mas não encerra automaticamente as existentes; o backend também não bloqueia atualizações de conexões abertas pelo status da partida.
- O hub e o contador ficam na memória de cada processo do backend; não há broadcast compartilhado entre réplicas.
- O snapshot guarda vidas/pontuação, mas não a ordem de eliminação de Fodinha nem o histórico de pontos de Truco. Reconstruir uma sala não recupera esses históricos completos.

A referência do protocolo fica no repositório da API, em `docs/websocket/WEBSOCKET.md`. Este guia descreve o cliente implementado e a convenção de payload usada pelas telas.
