# Tipos de dados (referência — H2 / JDBC)

Metadados exportados do catálogo de **tipos de dados** do banco (compatível com **H2**): nome lógico do tipo, precisão e faixa de escala quando aplicável, descrição.

Útil para mapear colunas DDL (`DECIMAL`, `VARCHAR`, `TIMESTAMP`, etc.) e drivers JDBC ao modelar entidades ou gerar SQL.

| Nome | Precisão | Escala Min | Escala Max | Descrição |
|------|----------|------------|------------|-----------|
| RESULT_SET | 0 | 0 | 0 | RESULT_SET |
| TINYINT | 3 | 0 | 0 | TINYINT |
| BIGINT | 19 | 0 | 0 | BIGINT |
| IDENTITY | 19 | 0 | 0 | IDENTITY |
| LONGVARBINARY | 2147483647 | 0 | 0 | LONGVARBINARY |
| VARBINARY | 2147483647 | 0 | 0 | VARBINARY |
| BINARY | 2147483647 | 0 | 0 | BINARY |
| UUID | 2147483647 | 0 | 0 | UUID |
| LONGVARCHAR | 2147483647 | 0 | 0 | LONGVARCHAR |
| CHAR | 2147483647 | 0 | 0 | CHAR |
| NUMERIC | 2147483647 | 0 | 0 | NUMERIC |
| DECIMAL | 2147483647 | 0 | 0 | DECIMAL |
| INTEGER | 10 | 0 | 0 | INTEGER |
| SERIAL | 10 | 0 | 0 | SERIAL |
| SMALLINT | 5 | 0 | 0 | SMALLINT |
| FLOAT | 17 | 0 | 0 | FLOAT |
| REAL | 7 | 0 | 0 | REAL |
| DOUBLE | 17 | 0 | 0 | DOUBLE |
| VARCHAR | 2147483647 | 0 | 0 | VARCHAR |
| VARCHAR_IGNORECASE | 2147483647 | 0 | 0 | VARCHAR_IGNORECASE |
| BOOLEAN | 1 | 0 | 0 | BOOLEAN |
| DATE | 8 | 0 | 0 | DATE |
| TIME | 6 | 0 | 0 | TIME |
| TIMESTAMP | 23 | 0 | 10 | TIMESTAMP |
| TIMESTAMP WITH TIMEZONE | 30 | 0 | 10 | TIMESTAMP WITH TIMEZONE |
| OTHER | 2147483647 | 0 | 0 | OTHER |
| GEOMETRY | 2147483647 | 0 | 0 | GEOMETRY |
| ARRAY | 0 | 0 | 0 | ARRAY |
| BLOB | 2147483647 | 0 | 0 | BLOB |
| CLOB | 2147483647 | 0 | 0 | CLOB |

**Nota:** `2147483647` costuma representar “sem limite fixo” ou tamanho máximo genérico no catálogo JDBC; na prática, `VARCHAR(n)` e `DECIMAL(p,s)` no DDL usam os limites declarados na tabela.
