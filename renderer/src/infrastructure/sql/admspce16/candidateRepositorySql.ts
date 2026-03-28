import type { NormalizedInsertCandidate } from '@/domain/entities/NormalizedInsertCandidate';
import {
  sqlNullOrString,
  sqlStringLiteral,
} from '@/infrastructure/sql/sqlStringUtils';

export const ADMSPCE16_SCHEMA = 'ADMSPCE16';

/** ST_PRESTADOR_CONTA para candidato como prestador de contas. */
export const ST_PRESTADOR_CONTA_CANDIDATO = '1';

/** TP_ENDERECO para endereço de comunicação com a JE neste fluxo. */
export const TP_ENDERECO_COMUNICACAO_JE = 'Q';

const S = ADMSPCE16_SCHEMA;

export const CANDIDATE_SELECT_ALL_SQL = `
SELECT
  p.SQ_PESSOA,
  p.SQ_ENTREGA_PRESTACAO,
  e.CD_ELEICAO,
  p.NM_PESSOA,
  p.NR_CPF,
  p.NR_CANDIDATO,
  p.CD_CARGO,
  p.NR_PARTIDO,
  p.SG_UE_PESSOA
FROM ${S}.EPC_PESSOA p
INNER JOIN ${S}.EPC_ENTREGA_PRESTACAO e
  ON e.SQ_ENTREGA_PRESTACAO = p.SQ_ENTREGA_PRESTACAO
WHERE p.TP_PESSOA = 'CA'
ORDER BY p.NM_PESSOA
`.trim();

export function buildEnsureEntregaPrestacaoSql(
  p: NormalizedInsertCandidate,
): string {
  return `
INSERT INTO ${S}.EPC_ENTREGA_PRESTACAO (
  SQ_ENTREGA_PRESTACAO,
  CD_ELEICAO,
  TP_ENTREGA,
  ST_RETIFICADORA,
  ST_CONCORRE_SEGUNDO_TURNO
)
SELECT
  NEXT VALUE FOR ${S}.SQ_EPC_ENTREGA_PRESTACAO,
  ${p.cdEleicao},
  '${p.tpEntrega}',
  '${p.stRetificadora}',
  '${p.stSegundoTurno}'
WHERE NOT EXISTS (SELECT 1 FROM ${S}.EPC_ENTREGA_PRESTACAO)
`.trim();
}

export function buildInsertPessoaCandidatoSql(
  p: NormalizedInsertCandidate,
): string {
  return `
INSERT INTO ${S}.EPC_PESSOA (
  SQ_PESSOA,
  SQ_ENTREGA_PRESTACAO,
  SG_UE_PESSOA,
  CD_CARGO,
  TP_PESSOA,
  NR_CPF,
  NM_PESSOA,
  NR_PARTIDO,
  NR_CANDIDATO,
  NR_TITULO_ELEITOR,
  NR_CNPJ,
  ST_PRESTADOR_CONTA
)
SELECT
  NEXT VALUE FOR ${S}.SQ_EPC_PESSOA,
  e.SQ_ENTREGA_PRESTACAO,
  ${sqlStringLiteral(p.sgUePessoa)},
  ${p.cdCargo},
  'CA',
  ${sqlStringLiteral(p.nrCpf)},
  ${sqlStringLiteral(p.nmPessoa)},
  ${p.nrPartido},
  ${p.nrCandidato},
  ${sqlNullOrString(p.nrTituloEleitor)},
  ${sqlNullOrString(p.nrCnpj)},
  '${ST_PRESTADOR_CONTA_CANDIDATO}'
FROM ${S}.EPC_ENTREGA_PRESTACAO e
FETCH FIRST 1 ROW ONLY
`.trim();
}

export function buildSelectPessoaCandidatoPorCpfSql(nrCpf: string): string {
  return `
SELECT
  p.SQ_PESSOA AS SQ_PESSOA,
  p.SQ_ENTREGA_PRESTACAO AS SQ_ENTREGA_PRESTACAO
FROM ${S}.EPC_PESSOA p
WHERE p.NR_CPF = ${sqlStringLiteral(nrCpf)}
  AND p.TP_PESSOA = 'CA'
ORDER BY p.SQ_PESSOA DESC
FETCH FIRST 1 ROW ONLY
`.trim();
}

export function buildInsertEnderecoCandidatoSql(
  p: NormalizedInsertCandidate,
  sqPessoa: string,
  sqEntrega: string,
): string {
  return `
INSERT INTO ${S}.EPC_ENDERECO (
  SQ_PESSOA,
  SQ_ENTREGA_PRESTACAO,
  TP_ENDERECO,
  CD_TIPO_LOGRADOURO,
  SG_UE,
  NR_LOGRADOURO,
  DS_LOGRADOURO,
  DS_COMPLEMENTO,
  DS_BAIRRO,
  NR_CEP,
  NR_TELEFONE,
  NR_CELULAR,
  NR_FAX,
  NM_EMAIL
) VALUES (
  ${sqPessoa},
  ${sqEntrega},
  '${TP_ENDERECO_COMUNICACAO_JE}',
  ${sqlStringLiteral(p.cdTipoLogradouro)},
  ${sqlNullOrString(p.sgUeEndereco)},
  ${sqlStringLiteral(p.nrLogradouro)},
  ${sqlNullOrString(p.dsLogradouro)},
  ${sqlNullOrString(p.dsComplemento)},
  ${sqlNullOrString(p.dsBairro)},
  ${sqlNullOrString(p.nrCep)},
  ${sqlNullOrString(p.nrTelefone)},
  ${sqlNullOrString(p.nrCelular)},
  ${sqlNullOrString(p.nrFax)},
  ${sqlNullOrString(p.nmEmail)}
)
`.trim();
}
