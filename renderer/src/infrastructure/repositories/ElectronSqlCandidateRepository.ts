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
  buildEnsureEntregaPrestacaoSql,
  buildInsertEnderecoCandidatoSql,
  buildInsertPessoaCandidatoSql,
  buildSelectPessoaCandidatoPorCpfSql,
  CANDIDATE_SELECT_ALL_SQL,
} from '../sql/admspce16/candidateRepositorySql';

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
      query: CANDIDATE_SELECT_ALL_SQL,
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
