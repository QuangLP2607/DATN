declare global {
  interface Window {
    JitsiMeetExternalAPI: new (
      domain: string,
      options: JitsiMeetExternalAPIOptions
    ) => JitsiMeetExternalAPI;
  }
}

export interface JitsiMeetExternalAPIOptions {
  roomName: string;
  parentNode: HTMLElement;
  userInfo?: { displayName?: string };
  width?: string | number;
  height?: string | number;
  configOverwrite?: Record<string, unknown>;
  interfaceConfigOverwrite?: Record<string, unknown>;
  jwt?: string;
}

export interface JitsiMeetExternalAPI {
  dispose(): void;
  addListener(event: string, handler: (payload: unknown) => void): void;
  executeCommand(command: string, ...args: unknown[]): void;
}

export {};
