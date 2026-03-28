# Schema ADMSPCE16 (referência)

- **`admspce16-schema.sql`** — DDL exportado (DBeaver), esquema **`ADMSPCE16`**: tabelas de prestação de contas eleitoral (EPC_*), cadastros auxiliares (DRD, UE, AEROPORTO, eleição, etc.), índices e FKs.
- **`admspce16-views.sql`** — definições de **views** (`VW_*`): bem/serviço imobilizado, totais para atualização de receita/despesa, sobra não financeiro 4.2 e pivot. Usam sintaxe típica do export (ex.: `NVL`, `DECODE`, `CASEWHEN`, `CREATE FORCE VIEW`) — podem precisar de ajuste para outro motor.
- **`admspce16-sequences.md`** — **sequências** (`SQ_EPC_*`): valor atual, min/max, incremento (referência para geradores de ID ou alinhamento com o banco).
- **`admspce16-tipos-dados.md`** — **tipos de dados** do catálogo (H2/JDBC): precisão e escala por nome de tipo.
- **`ADMSPCE16.png`** — **diagrama ER** exportado do DBeaver (visão geral de tabelas e relacionamentos). Atualize ao mudar o modelo no banco.

## Diagrama ER

![Diagrama entidade-relacionamento ADMSPCE16](ADMSPCE16.png)

Uso:

- Consulta para nomes de **tabelas**, **colunas** e **views** ao escrever SQL no app ou no `jdbc-sidecar`.
- **Não** é script de migração automática: revisar sintaxe e compatibilidade com o H2/servidor antes de executar.
- Ao atualizar o banco no DBeaver, substitua ou regenere estes arquivos e mantenha o histórico no Git se fizer sentido.

Para o Cursor: mencione `@docs/database`, `@ADMSPCE16.png`, `@admspce16-schema.sql`, `@admspce16-views.sql`, `@admspce16-sequences.md` ou `@admspce16-tipos-dados.md` nas conversas sobre modelo de dados.
