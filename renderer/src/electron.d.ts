import type { ApiInvokePayload } from '@spce/shared';

export {};

declare global {
  interface Window {
    isElectron?: boolean;
    api?: {
      invoke: (payload: ApiInvokePayload) => Promise<unknown>;
    };
  }
}
