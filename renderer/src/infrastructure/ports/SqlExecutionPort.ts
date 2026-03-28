import type { SqlExecInput } from '@spce/shared';
import type { SqlExecResult } from '../types/SqlExecResult';

/**
 * Abstraction over SQL execution (Electron IPC → sidecar).
 */
export interface SqlExecutionPort {
  exec(input: SqlExecInput): Promise<SqlExecResult>;
}
