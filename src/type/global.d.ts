import type { IpcRendererEvent } from 'electron';


declare global {
  interface Window {
    electronAPI: {
      getLocalIPs: () => Promise<string>
      // getAllInterfaces: () => Promise<any[]>
      callSoapService: (data: unknown) => Promise<{ NumberToWordsResult: string }>
      getJsonData: (configName: string) => Promise<JSON>
      getDomains: () => Promise<Record<string, string>>
    },
    // ipcRenderer: {
    //   on(
    //     channel: string,
    //     listener: (event: IpcRendererEvent, ...args: unknown[]) => void
    //   ): void;
    //   once(
    //     channel: string,
    //     listener: (event: IpcRendererEvent, ...args: unknown[]) => void
    //   ): void;
    //   off(
    //     channel: string,
    //     listener: (event: IpcRendererEvent, ...args: unknown[]) => void
    //   ): void;
    //   send(channel: string, ...args: unknown[]): void;
    //   invoke<T = unknown>(channel: string, ...args: unknown[]): Promise<T>;
    // };
  }
}

export {}
