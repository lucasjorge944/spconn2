/**
 * Shape returned by Electron IPC + jdbc-sidecar for POST /exec.
 */
export type SqlExecResult = {
  query: string;
  results: unknown;
};
