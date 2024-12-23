declare global {
  interface Window {
    electronAPI: {
      queryDatabase: (sql: string, params: any[]) => Promise<any>;
      insertDatabase: (sql: string, params: any[]) => Promise<any>;
      searchCompany: (name: string, regNumber: string) => Promise<any>;
      updateCompany: (company: any) => Promise<any>;
      getCompanyById(idNumber: string): Promise<any>;
      registerPayment(paymentData: any): Promise<any>;
      updatePayment(paymentData: any): Promise<any>;
      updatePayer: (companyData: any) => Promise<boolean>;
      getCompanyByPayerID(payerID: string): Promise<any>;

      // Methods for auto-update functionality
      on: (channel: string, listener: (...args: any[]) => void) => void;
      removeListener: (channel: string, listener: (...args: any[]) => void) => void;
      onUpdateAvailable: (callback: (event: Event, info: { version: string }) => void) => void;
      onUpdateDownloaded: (callback: (event: Event) => void) => void;
      onUpdateError: (callback: (event: Event, errorMessage: string) => void) => void;
      onUpdateNotAvailable(callback: () => void): void;
      restartApp: () => void;
    };

    ipcRenderer: {
      removeAllListeners(channel: string): void;
      once(channel: string, listener: (...args: any[]) => void): void;
      send(channel: string, ...args: any[]): void;
      on(channel: string, listener: (...args: any[]) => void): void;
    };
  }
}

export {};
