import type { SqlExecInput } from '@spce/shared';
import { Candidate } from '../../domain/entities/Candidate';
import type { CandidateRepository } from '../../domain/repositories/CandidateRepository';
import type { SqlExecutionPort } from '../ports/SqlExecutionPort';

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
FROM ADMSPCE16.EPC_PESSOA p
INNER JOIN ADMSPCE16.EPC_ENTREGA_PRESTACAO e
  ON e.SQ_ENTREGA_PRESTACAO = p.SQ_ENTREGA_PRESTACAO
WHERE p.TP_PESSOA = 'CA'
ORDER BY p.NM_PESSOA
`.trim();

export class ElectronSqlCandidateRepository implements CandidateRepository {
  private readonly sql: SqlExecutionPort;

  private readonly defaultHost: string;

  constructor(sql: SqlExecutionPort, defaultHost: string) {
    this.sql = sql;
    this.defaultHost = defaultHost;
  }

  async findAll(): Promise<Candidate[]> {
    const input: SqlExecInput = {
      connection: { host: this.defaultHost },
      query: CANDIDATE_SELECT_ALL,
    };
    const { results } = await this.sql.exec(input);
    if (!Array.isArray(results)) {
      throw new Error(
        `Expected result set array from candidate query, got ${typeof results}`,
      );
    }
    return results.map((row) =>
      Candidate.fromDatabaseRow(row as Record<string, unknown>),
    );
  }
}
