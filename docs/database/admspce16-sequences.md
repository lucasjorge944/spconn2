# Sequências ADMSPCE16 (referência)

Documentação exportada da tabela de **sequências** do banco (nomes de sequence, valor atual, limites e incremento).

Padrão comum neste export: **valor atual** `0`, **mínimo** `1`, **máximo** `9223372036854775807` (limite de inteiro de 64 bits assinado), **incremento** `1`, **descrição** vazia — salvo indicação em contrário em versões futuras do doc.

| Nome | Valor | Valor Min | Valor Max | Descrição | Incremento |
|------|-------|-----------|-----------|-----------|------------|
| SQ_EPC_ADM_FIN_MEMBRO_PARTE | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_DEBITO_CREDITO | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_ARQUIVO_COMPROVANTE | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_CONCILIACAO_BANCARIA | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_EVENTO | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_DESPESA_PES_CONSELHO | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_DETALHE_TIPO_DOCUMENTO | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_PARCELAMENTO | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_PESSOA_PRESTADOR | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_RECIBO_DISTRIBUIDO | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_ADM_FIN_MEMBRO | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_QUALIFICACAO | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_ENTREGA_PRESTACAO | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_PESSOA | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_TRECHO | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_REGISTRO_ERRO | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_VICE_SUPLENTE | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_AEROPORTO | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_RECIBO_RECEBIDO | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_ITEM_ARQ_COMPROVANTE | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_PASSAGEIRO | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_BEM_SERVICO | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_RECEITA | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_BEM_IMOBILIZADO | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_LANCAMENTO | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_EVENTO_DESPESA | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_CONTA_BANCARIA | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_FAIXA_RECIBO | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_DESPESA | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_PESSOA_CONTA_BANCARIA | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_ARQUIVO | 0 | 1 | 9223372036854775807 | | 1 |
| SQ_EPC_PESSOA_RATEIO | 0 | 1 | 9223372036854775807 | | 1 |

**Nota:** algumas sequences podem corresponder a tabelas ou artefatos ainda não listados no `admspce16-schema.sql` (ex.: `SQ_EPC_QUALIFICACAO`, `SQ_EPC_VICE_SUPLENTE`, `SQ_EPC_RECIBO_*`). Ao gerar IDs ou scripts, confira no banco qual objeto consome cada sequence.
