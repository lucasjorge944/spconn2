/** Canal exposto no preload (`api.invoke`). */
export const IPC_CHANNEL_HANDLE = 'handle' as const;

export type IpcChannel = typeof IPC_CHANNEL_HANDLE;

/** Endpoints alinhados ao roteador do Electron main. */
export const ApiEndpoint = {
  root: '/',
  /** Única rota SQL: SELECT / INSERT / UPDATE / DDL — o sidecar interpreta o comando. */
  exec: '/exec',
} as const;

export type ApiEndpointPath =
  (typeof ApiEndpoint)[keyof typeof ApiEndpoint];

export type ApiInvokePayload = {
  channel: IpcChannel;
  endpoint: ApiEndpointPath | (string & {});
  input?: unknown;
};

/** Payload mínimo para conexão (H2 / JDBC). */
export type DbConnectionInput = {
  host: string;
};

/** Corpo enviado ao sidecar e ao IPC para executar SQL. */
export type SqlExecInput = {
  connection: DbConnectionInput;
  query: string;
};
