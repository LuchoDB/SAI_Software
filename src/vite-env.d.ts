/// <reference types="vite/client" />

interface Window {
  electronAPI?: {
    isElectron: boolean;
    getClients: () => Promise<unknown[]>;
    saveClient: (client: unknown) => Promise<unknown>;
    deleteClient: (id: string) => Promise<boolean>;
    updateDocStatus: (
      clientId: string,
      docId: string,
      status: string,
      notes?: string
    ) => Promise<unknown>;
    getWindStudies: (clientId?: string) => Promise<unknown[]>;
    saveWindStudy: (study: unknown) => Promise<unknown>;
    getLadStudies: (clientId?: string) => Promise<unknown[]>;
    saveLadStudy: (study: unknown) => Promise<unknown>;
    getLadhStudies: (clientId?: string) => Promise<unknown[]>;
    saveLadhStudy: (study: unknown) => Promise<unknown>;
  };
}
