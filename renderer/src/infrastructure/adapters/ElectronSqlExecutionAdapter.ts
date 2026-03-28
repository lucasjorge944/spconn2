import { ApiEndpoint, IPC_CHANNEL_HANDLE, type SqlExecInput } from '@spce/shared';
import type { SqlExecutionPort } from '../ports/SqlExecutionPort';
import type { SqlExecResult } from '../types/SqlExecResult';

export class ElectronSqlExecutionAdapter implements SqlExecutionPort {
  async exec(input: SqlExecInput): Promise<SqlExecResult> {
    if (!window.api?.invoke) {
      throw new Error(
        'Electron API unavailable. Run the desktop shell (apps/desktop), not Vite alone.',
      );
    }
    const raw = await window.api.invoke({
      channel: IPC_CHANNEL_HANDLE,
      endpoint: ApiEndpoint.exec,
      input,
    });
    return raw as SqlExecResult;
  }
}
