import type { SqlExecInput } from '@spce/shared';
import { Airport } from '../../domain/entities/Airport';
import type { AirportRepository } from '../../domain/repositories/AirportRepository';
import type { SqlExecutionPort } from '../ports/SqlExecutionPort';

const AIRPORT_SELECT_ALL = 'SELECT * FROM ADMSPCE16.AEROPORTO';

export class ElectronSqlAirportRepository implements AirportRepository {
  private readonly sql: SqlExecutionPort;

  private readonly defaultHost: string;

  constructor(sql: SqlExecutionPort, defaultHost: string) {
    this.sql = sql;
    this.defaultHost = defaultHost;
  }

  async findAll(): Promise<Airport[]> {
    const input: SqlExecInput = {
      connection: { host: this.defaultHost },
      query: AIRPORT_SELECT_ALL,
    };
    const { results } = await this.sql.exec(input);
    if (!Array.isArray(results)) {
      throw new Error(
        `Expected result set array from airport query, got ${typeof results}`,
      );
    }
    return results.map((row) =>
      Airport.fromDatabaseRow(row as Record<string, unknown>),
    );
  }
}
