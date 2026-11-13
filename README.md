# Ultimate Fodinha 2.0

Frontend para organizar e acompanhar partidas de Fodinha e Truco, consultar jogadores e rankings e administrar jogadores e cancelamentos de salas.

O projeto usa Vue 3, TypeScript, Vuetify 4, Pinia, Vue Router, Axios e Vite. A comunicação com o backend usa HTTP e WebSocket. Também há suporte a instalação como PWA.

## Apresentação

Conheça o app em 30 segundos: Truco, Fodinha, personagens e ranking da turma.

<a href="public/videos/ultimate-fodinha-apresentacao.mp4">
  <img src="public/videos/ultimate-fodinha-apresentacao-capa.jpg" alt="Assistir à apresentação do Ultimate Fodinha 2.0" width="220" />
</a>

[Assistir ou baixar o vídeo em MP4](public/videos/ultimate-fodinha-apresentacao.mp4)

## Executar localmente

Com Node.js compatível com o projeto (use Node 22.12+ da linha 22) e npm:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

O endereço configurado é `http://localhost:3000`; se a porta estiver ocupada, confira o endereço exibido pelo Vite. O arquivo de exemplo aponta para a API hospedada. Para desenvolver com o backend local, ajuste `.env.local`:

```dotenv
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_WS_BASE_URL=ws://localhost:8080/api/v1
```

Inicie a API separadamente e permita `http://localhost:3000` no CORS do backend. Veja o [guia de desenvolvimento](docs/projeto/DESENVOLVIMENTO.md).

## Documentação

| Guia | Conteúdo |
| --- | --- |
| [Desenvolvimento](docs/projeto/DESENVOLVIMENTO.md) | Ambiente, comandos, organização do código, rotas, estado e publicação |
| [Integração HTTP](docs/api/INTEGRACAO.md) | Clientes, autenticação, payloads, respostas, erros e diferenças de contrato |
| [Tempo real](docs/websocket/INTEGRACAO.md) | Host e espectador, formato do estado, eventos e reconexão |
| [Repositório da API](https://github.com/joaosimonis/Ultimate-Fodinha-2.0-API/tree/development) | Referência completa e implementação do backend |

A documentação deste repositório acompanha o consumo feito pelo frontend. Regras completas de domínio, persistência e operação do servidor ficam no repositório da API, em `docs/api`, `docs/projeto` e `docs/websocket`.

## Verificação

```bash
npm run type-check
npm run lint
npm run build
```

O comando `build` inclui a checagem de tipos e gera `dist/`. Não há script de testes automatizados no `package.json` atual.
