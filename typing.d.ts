declare global {
    interface Window {
      ipcRenderer: {
        removeAllListeners(channel: string): void;
        once(channel: string, listener: (...args: any[]) => void): void;
        send(channel: string, ...args: any[]): void;
        on(channel: string, listener: (...args: any[]) => void): void;
      };
    }
}

export {};