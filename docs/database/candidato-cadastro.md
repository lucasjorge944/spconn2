# Cadastro de candidato (referência SPCE / ADMSPCE16)

Este documento relaciona os blocos da **Qualificação** no SPCE (telas *Prestador de contas* e *Endereço do candidato*) às tabelas do schema `ADMSPCE16`, como implementado no app (`CandidatesPage` → `InsertCandidateInput` → `ElectronSqlCandidateRepository`).

## Visão geral

| Área na UI SPCE | Tabela(s) | Observação |
|-----------------|-----------|------------|
| Dados básicos + dados eleitorais | `EPC_PESSOA` | `TP_PESSOA = 'CA'` |
| Dados da prestação de contas | `EPC_ENTREGA_PRESTACAO` | Uma entrega por campanha; na primeira carga vazia o app insere linha mínima |
| Endereço para comunicação com a JE | `EPC_ENDERECO` | `TP_ENDERECO = 'Q'` (check `CK_EPC_ENDRECO_TP_ENDERECO`: `'P'`, `'Q'`, `'M'`) |

Chaves estrangeiras usuais: `UE` (`SG_UE`, `SG_UE_PESSOA`, `EPC_ENDERECO.SG_UE`), `CONFIGURACAO_ELEICAO` (`CD_ELEICAO`), `TIPO_LOGRADOURO` (`CD_TIPO_LOGRADOURO`).

## Prestador de contas — campos e colunas

O app está restrito a **candidato a vereador**: `CD_CARGO` é fixo pela constante `CD_CARGO_VEREADOR` (valor padrão **13** em `renderer/src/domain/entities/candidateInsertForm.ts`). Ajuste essa constante se o catálogo do seu ambiente usar outro código para vereador.

| Campo na UI | Coluna | Domínio / notas |
|-------------|--------|-----------------|
| CPF | `EPC_PESSOA.NR_CPF` | 11 dígitos |
| Nome | `EPC_PESSOA.NM_PESSOA` | até 150 caracteres |
| Título de Eleitor | `EPC_PESSOA.NR_TITULO_ELEITOR` | até 12; opcional (NULL) |
| CNPJ (campanha) | `EPC_PESSOA.NR_CNPJ` | 14 dígitos; opcional (NULL); único por par (`NR_CNPJ`, `SQ_ENTREGA_PRESTACAO`) |
| Candidatura | `EPC_PESSOA.CD_CARGO` | **Vereador** — não editável na UI; valor = `CD_CARGO_VEREADOR` |
| (insert app) | `EPC_PESSOA.ST_PRESTADOR_CONTA` | Check `IN ('0','1')` — na inserção o app grava **`'1'`** (prestador de contas) |
| Partido | `EPC_PESSOA.NR_PARTIDO` | |
| Número na urna | `EPC_PESSOA.NR_CANDIDATO` | Deve iniciar com os dígitos do partido (regra de urna); o app valida antes de inserir |
| Município eleitoral (candidatura) | `EPC_PESSOA.SG_UE_PESSOA` | FK `UE.SG_UE` — ex. município `71072` (São Paulo capital) em `UE.json` |
| Código da eleição (app) | `EPC_ENTREGA_PRESTACAO.CD_ELEICAO` | Só na criação da primeira `EPC_ENTREGA_PRESTACAO` se o banco não tiver nenhuma linha |
| Tipo de entrega | `EPC_ENTREGA_PRESTACAO.TP_ENTREGA` | Check: `'0'..'3'`. No app: `0` Relatório financeiro (72h), `1` Parcial, `2` Final, `3` Cancelamento de controle (confirmar com negócio se a ordem bate com o sistema oficial) |
| Turno (1º / 2º) | `EPC_ENTREGA_PRESTACAO.ST_CONCORRE_SEGUNDO_TURNO` | `'0'` 1º turno, `'1'` concorre 2º turno |
| Prestação retificadora? | `EPC_ENTREGA_PRESTACAO.ST_RETIFICADORA` | `'0'` / `'1'` |

**Município eleitoral** na UI oficial pode corresponder a outro código ou relação além de `SG_UE`; no modelo atual o app usa apenas `SG_UE_PESSOA` para a candidatura. Ajuste futuro se o DDL expuser coluna específica de município eleitoral.

## Endereço do candidato — campos e colunas

Correspondência com `EPC_ENDERECO` (linha com `TP_ENDERECO = 'Q'`).

| Campo na UI | Coluna | Notas |
|-------------|--------|-------|
| Tipo (Rua, Avenida, …) | `CD_TIPO_LOGRADOURO` | FK `TIPO_LOGRADOURO` — códigos de até 4 caracteres (ex.: `R`, `AV` em `docs/database/data/TIPO_LOGRADOURO.json`) |
| Logradouro | `DS_LOGRADOURO` | |
| Número | `NR_LOGRADOURO` | NOT NULL no DDL |
| Complemento | `DS_COMPLEMENTO` | |
| Bairro / Distrito | `DS_BAIRRO` | |
| UF + Município | `SG_UE` | FK `UE`; na prática o município costuma ser um `SG_UE` na hierarquia de UEs |
| CEP | `NR_CEP` | 8 dígitos |
| Telefone | `NR_TELEFONE` | até 11 dígitos |
| Celular | `NR_CELULAR` | até 11 dígitos |
| Fax | `NR_FAX` | até 11 dígitos |
| E-mail | `NM_EMAIL` | até 80 caracteres |

## Dados iniciais e FKs

- `UE.json`, `CONFIGURACAO_ELEICAO.json`, `TIPO_LOGRADOURO.json` em `docs/database/data/` para códigos válidos.
- Se `EPC_ENTREGA_PRESTACAO` **já existir** no banco, o app **não** altera `TP_ENTREGA` / retificadora / turno da linha existente — apenas usa a primeira entrega encontrada ao inserir pessoa e endereço. Para ambientes de teste vazios, a primeira inserção define esses campos.

## Limitações atuais do app

- Uma execução = vários `exec` JDBC sem transação explícita; falha após criar `EPC_PESSOA` pode deixar pessoa sem endereço até correção manual.
- Reexecução com o mesmo CPF cria **nova** pessoa se o modelo permitir CPF duplicado (sem UK em `NR_CPF` no DDL analisado).

Atualize este arquivo quando o DDL ou o DBeaver divergirem do banco real.
