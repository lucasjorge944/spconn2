import type { SqlExecInput } from '@spce/shared';
import type { NormalizedInsertCandidate } from '@/domain/entities/NormalizedInsertCandidate';
import { Candidate } from '../../domain/entities/Candidate';
import type {
  CandidatoPessoaKeys,
  CandidateRepository,
} from '../../domain/repositories/CandidateRepository';
import type { SqlExecutionPort } from '../ports/SqlExecutionPort';
import { getRowString } from '../sql/jdbcRowUtils';
import {
  sqlNullOrString,
  sqlStringLiteral,
} from '../sql/sqlStringUtils';

const SCHEMA = 'ADMSPCE16';

const ST_PRESTADOR_CONTA_CANDIDATO = '1';
const TP_ENDERECO_COMUNICACAO_JE = 'Q';

const CANDIDATE_SELECT_ALL = `
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
FROM ${SCHEMA}.EPC_PESSOA p
INNER JOIN ${SCHEMA}.EPC_ENTREGA_PRESTACAO e
  ON e.SQ_ENTREGA_PRESTACAO = p.SQ_ENTREGA_PRESTACAO
WHERE p.TP_PESSOA = 'CA'
ORDER BY p.NM_PESSOA
`.trim();

function buildEnsureEntregaPrestacaoSql(p: NormalizedInsertCandidate): string {
  return `
INSERT INTO ${SCHEMA}.EPC_ENTREGA_PRESTACAO (
  SQ_ENTREGA_PRESTACAO,
  CD_ELEICAO,
  TP_ENTREGA,
  ST_RETIFICADORA,
  ST_CONCORRE_SEGUNDO_TURNO
)
SELECT
  NEXT VALUE FOR ${SCHEMA}.SQ_EPC_ENTREGA_PRESTACAO,
  ${p.cdEleicao},
  '${p.tpEntrega}',
  '${p.stRetificadora}',
  '${p.stSegundoTurno}'
WHERE NOT EXISTS (SELECT 1 FROM ${SCHEMA}.EPC_ENTREGA_PRESTACAO)
`.trim();
}

function buildInsertPessoaCandidatoSql(p: NormalizedInsertCandidate): string {
  return `
INSERT INTO ${SCHEMA}.EPC_PESSOA (
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
  NEXT VALUE FOR ${SCHEMA}.SQ_EPC_PESSOA,
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
FROM ${SCHEMA}.EPC_ENTREGA_PRESTACAO e
FETCH FIRST 1 ROW ONLY
`.trim();
}

function buildSelectPessoaCandidatoPorCpfSql(nrCpf: string): string {
  return `
SELECT
  p.SQ_PESSOA AS SQ_PESSOA,
  p.SQ_ENTREGA_PRESTACAO AS SQ_ENTREGA_PRESTACAO
FROM ${SCHEMA}.EPC_PESSOA p
WHERE p.NR_CPF = ${sqlStringLiteral(nrCpf)}
  AND p.TP_PESSOA = 'CA'
ORDER BY p.SQ_PESSOA DESC
FETCH FIRST 1 ROW ONLY
`.trim();
}

function buildInsertEnderecoCandidatoSql(
  p: NormalizedInsertCandidate,
  sqPessoa: string,
  sqEntrega: string,
): string {
  return `
INSERT INTO ${SCHEMA}.EPC_ENDERECO (
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

export class ElectronSqlCandidateRepository implements CandidateRepository {
  private readonly sql: SqlExecutionPort;

  private readonly defaultHost: string;

  constructor(sql: SqlExecutionPort, defaultHost: string) {
    this.sql = sql;
    this.defaultHost = defaultHost;
  }

  private connection(): SqlExecInput['connection'] {
    return { host: this.defaultHost };
  }

  private async execUpdate(query: string): Promise<number> {
    const { results } = await this.sql.exec({
      connection: this.connection(),
      query,
    });
    return Number(results);
  }

  private async execQueryRows(query: string): Promise<Record<string, unknown>[]> {
    const { results } = await this.sql.exec({
      connection: this.connection(),
      query,
    });
    if (!Array.isArray(results)) {
      throw new Error(
        `Esperado array de linhas no resultado, obtido ${typeof results}`,
      );
    }
    return results as Record<string, unknown>[];
  }

  async findAll(): Promise<Candidate[]> {
    const { results } = await this.sql.exec({
      connection: this.connection(),
      query: CANDIDATE_SELECT_ALL,
    });
    if (!Array.isArray(results)) {
      throw new Error(
        `Expected result set array from candidate query, got ${typeof results}`,
      );
    }
    return results.map((row) =>
      Candidate.fromDatabaseRow(row as Record<string, unknown>),
    );
  }

  async ensureMinimalEntregaPrestacaoIfNone(
    p: NormalizedInsertCandidate,
  ): Promise<void> {
    await this.execUpdate(buildEnsureEntregaPrestacaoSql(p));
  }

  async insertPessoaCandidato(p: NormalizedInsertCandidate): Promise<number> {
    return this.execUpdate(buildInsertPessoaCandidatoSql(p));
  }

  async findCandidatoPessoaKeysByCpf(
    nrCpf: string,
  ): Promise<CandidatoPessoaKeys | null> {
    const rows = await this.execQueryRows(
      buildSelectPessoaCandidatoPorCpfSql(nrCpf),
    );
    if (rows.length < 1) return null;
    const row = rows[0]!;
    const sqPessoa = getRowString(row, 'SQ_PESSOA');
    const sqEntregaPrestacao = getRowString(row, 'SQ_ENTREGA_PRESTACAO');
    if (sqPessoa === '' || sqEntregaPrestacao === '') return null;
    return { sqPessoa, sqEntregaPrestacao };
  }

  async insertEnderecoCandidatoComunicacaoJe(
    p: NormalizedInsertCandidate,
    sqPessoa: string,
    sqEntregaPrestacao: string,
  ): Promise<number> {
    return this.execUpdate(
      buildInsertEnderecoCandidatoSql(p, sqPessoa, sqEntregaPrestacao),
    );
  }
}
