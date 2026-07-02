## ADDED Requirements

### Requirement: Auditoria apenas de mutações
A trilha de auditoria DEVE (MUST) ser gerada para métodos CUD (`POST`, `PATCH`, `PUT`,
`DELETE`) e NÃO DEVE (MUST NOT) ser gerada para leituras (`GET`).

#### Scenario: Mutação gera registro
- **WHEN** uma requisição `POST`/`PATCH`/`PUT`/`DELETE` conclui com sucesso
- **THEN** um registro de auditoria é criado

#### Scenario: Leitura não gera registro
- **WHEN** uma requisição `GET` é processada
- **THEN** nenhum registro de auditoria é criado

### Requirement: Resolução do usuário auditor
O registro de auditoria DEVE (MUST) associar a ação ao usuário autenticado, resolvido a
partir de `req.user` (`sub`) populado pelo guard de identidade. Quando não houver usuário
autenticado, o campo de usuário DEVE (MUST) ficar nulo, sem impedir a gravação da trilha.

#### Scenario: Ação de usuário autenticado
- **WHEN** uma mutação é feita por um usuário autenticado
- **THEN** o registro de auditoria contém o `sub` do usuário como autor

#### Scenario: Ação sem usuário autenticado
- **WHEN** uma mutação ocorre em contexto sem `req.user`
- **THEN** o registro é gravado com usuário nulo

### Requirement: Redaction do payload de auditoria
O `payload` do registro de auditoria DEVE (MUST) passar por redaction que ofusca campos
sensíveis (ex.: `password`, `token`, `authorization`, `secret`) antes de ser persistido.

#### Scenario: Campo sensível é ofuscado no payload
- **WHEN** uma mutação inclui um campo sensível no corpo da requisição
- **THEN** o valor é ofuscado no `payload` persistido, sem expor o valor original
