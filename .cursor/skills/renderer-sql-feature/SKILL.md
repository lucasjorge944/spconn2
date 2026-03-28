---
name: renderer-sql-feature
description: >-
  Adiciona uma nova funcionalidade no renderer que executa SQL ADMSPCE16 via
  Electron IPC e jdbc-sidecar, seguindo o padrão DI → Controller → Use case →
  Repository → SqlExecutionPort. Use quando o usuário pedir novo fluxo com banco,
  novo repositório SQL, feature parecida com candidatos/aeroportos, ou
  “seguir o padrão do renderer para SQL”.
---

# Nova feature SQL no renderer (SPCE)

## Documentação de referência

Leia e siga **`docs/renderer-fluxo-sql-di.md`** no monorepo `apps` — descreve o fluxo do `DIContainer` até `sql.exec`, checklist e tabela de arquivos exemplo (módulo candidatos).

Consulte também o DDL em **`docs/database/admspce16-schema.sql`** e a regra **`@.cursor/rules/database-schema.mdc`** ao definir tabelas/colunas/FKs.

## Ordem sugerida de implementação

1. **Contrato de domínio** — interface `*Repository` em `renderer/src/domain/repositories/` com métodos sem expor SQL.
2. **SQL** — `renderer/src/infrastructure/sql/admspce16/<feature>RepositorySql.ts`: constantes de SELECT, funções `build…Sql`, schema `ADMSPCE16`, uso de `sqlStringUtils` / `jdbcRowUtils`.
3. **Repositório** — `ElectronSql*Repository` recebendo `SqlExecutionPort` + host; métodos privados `execUpdate` / `execQueryRows` se necessário.
4. **Use case** — regras de negócio e ordem das operações em `application/usecases/` (fluxos multi-passo) ou `domain/usecases/` (leitura simples).
5. **Controller + página** — se houver UI; obter dependências via `getDIContainer()` do feature container.
6. **DI** — `*Container` com ordem: `ElectronSqlExecutionAdapter` → repositório → use cases → controller; registrar em `DIContainer`.

## O que não duplicar

- **Um** `ElectronSqlExecutionAdapter` por container de feature (compartilhado entre repositórios do mesmo container).
- Não vazar `SqlExecInput` ou strings SQL para controllers; manter SQL nos builders + repositório.

## Execução

Funcionalidade SQL real só com **shell Electron** (`apps/desktop`) e **jdbc-sidecar** ativos — o adapter falha sem `window.api.invoke`.
