## ADDED Requirements

### Requirement: Bootstrap da aplicação com prefixo de versão
A aplicação NestJS DEVE (MUST) expor todas as rotas sob o prefixo global `/v1` e
DEVE (MUST) subir com um `ValidationPipe` global aplicando as regras dos DTOs.

#### Scenario: Rotas servidas sob /v1
- **WHEN** um cliente acessa uma rota da API
- **THEN** ela responde sob o prefixo `/v1` (ex.: `/v1/health`)

#### Scenario: Payload inválido é rejeitado
- **WHEN** uma requisição envia um corpo que viola as regras do DTO (campo faltante, tipo inválido ou campo não permitido)
- **THEN** a API responde `400` no formato RFC 9457

### Requirement: Erros no formato RFC 9457 (Problem Details)
Todas as respostas de erro DEVEM (MUST) seguir o formato RFC 9457 (Problem Details),
emitidas por um filtro global único, contendo ao menos `type`, `title`, `status`,
`detail` e `instance`. O filtro DEVE (MUST) tratar tanto exceções HTTP quanto erros
genéricos não previstos.

#### Scenario: Exceção HTTP mapeada para Problem Details
- **WHEN** um handler lança uma `HttpException` (ex.: 404 em rota inexistente)
- **THEN** a resposta tem `Content-Type` de problema e corpo `{ type, title, status, detail, instance }` com o status correspondente

#### Scenario: Erro genérico não vaza stack trace
- **WHEN** ocorre um erro não tratado durante o processamento da requisição
- **THEN** a resposta é `500` no formato RFC 9457, sem expor stack trace ou detalhes internos

### Requirement: Configuração global validada no boot
A aplicação DEVE (MUST) carregar a configuração a partir do `.env` único da raiz via
um `ConfigModule` global e DEVE (MUST) validar as variáveis obrigatórias na
inicialização, falhando o boot (fail-fast) quando alguma estiver ausente.

#### Scenario: Boot falha sem variável obrigatória
- **WHEN** a aplicação é iniciada sem uma variável de ambiente obrigatória
- **THEN** o processo falha na inicialização com mensagem clara indicando a variável ausente

#### Scenario: Configuração válida permite o boot
- **WHEN** todas as variáveis obrigatórias estão presentes e válidas
- **THEN** a aplicação inicializa normalmente

### Requirement: Documentação OpenAPI/Swagger
A aplicação DEVE (MUST) servir documentação OpenAPI/Swagger em `/docs`, gerada a
partir dos decorators dos DTOs e controllers.

#### Scenario: Swagger disponível
- **WHEN** um desenvolvedor acessa `/docs`
- **THEN** a interface OpenAPI é servida refletindo as rotas e DTOs registrados

### Requirement: Endpoint de health
A aplicação DEVE (MUST) expor `GET /v1/health` para verificação de liveness/readiness.

#### Scenario: Health responde 200
- **WHEN** um cliente faz `GET /v1/health`
- **THEN** a API responde `200` indicando que a aplicação está no ar
