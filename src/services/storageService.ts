import { Client, DocumentStatus } from '../types/client';
import { WindStudyResult } from '../types/wind';
import { LadStudy } from '../types/lad';
import { LadhStudy } from '../types/ladh';
import { getSampleClients } from '../data/sampleData';
import { generateInitialChecklist } from '../data/regulatoryRequirements';

const STORAGE_KEYS = {
  CLIENTS: 'sai_consult_clients',
  WIND_STUDIES: 'sai_consult_wind_studies',
  LAD_STUDIES: 'sai_consult_lad_studies',
  LADH_STUDIES: 'sai_consult_ladh_studies'
};

export class StorageService {
  /**
   * Inicializa el almacenamiento local con datos de muestra si está vacío
   */
  static initialize(): void {
    const existingClients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (!existingClients) {
      const sample = getSampleClients();
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(sample.clients));
      localStorage.setItem(STORAGE_KEYS.WIND_STUDIES, JSON.stringify(sample.windStudies));
      localStorage.setItem(STORAGE_KEYS.LAD_STUDIES, JSON.stringify(sample.ladStudies));
      localStorage.setItem(STORAGE_KEYS.LADH_STUDIES, JSON.stringify(sample.ladhStudies));

      // Sincronizar muestra inicial a SQLite si estamos en Electron
      if (typeof window !== 'undefined' && window.electronAPI) {
        sample.clients.forEach(c => window.electronAPI?.saveClient(c));
        sample.windStudies.forEach(s => window.electronAPI?.saveWindStudy(s));
        sample.ladStudies.forEach(s => window.electronAPI?.saveLadStudy(s));
        sample.ladhStudies.forEach(s => window.electronAPI?.saveLadhStudy(s));
      }
    } else {
      // Migración automática: Si los clientes guardados en localStorage tienen la estructura vieja no canónica
      try {
        const parsed = JSON.parse(existingClients);
        const hasLegacy = parsed.some((c: Client) =>
          c.documents?.some(
            d =>
              d.code === 'ANAC-F501' ||
              (d as unknown as { category: string }).category === 'ENACOM' ||
              d.id === 'ANAC-F501'
          )
        );
        if (hasLegacy) {
          const sample = getSampleClients();
          localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(sample.clients));
        }
      } catch {
        // En caso de parse error ignorar
      }

      if (typeof window !== 'undefined' && window.electronAPI) {
        // Si ya hay clientes en SQLite, hidratar
        window.electronAPI.getClients().then(sqliteClients => {
          if (sqliteClients && sqliteClients.length > 0) {
            localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(sqliteClients));
          }
        });
      }
    }
  }

  // --- CLIENTES ---
  static getClients(): Client[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      const clients: Client[] = data ? JSON.parse(data) : [];
      let needsResave = false;
      const sanitized = clients.map(c => {
        const hasLegacy =
          !c.documents ||
          c.documents.length === 0 ||
          c.documents.some(
            d =>
              !d.categoria ||
              !d.organismo ||
              d.code === 'ANAC-F501' ||
              (d as unknown as { category: string }).category === 'ENACOM' ||
              d.id === 'ANAC-F501'
          );
        if (hasLegacy) {
          needsResave = true;
          return {
            ...c,
            documents: generateInitialChecklist({
              category: c.category,
              projectType: c.projectType,
              pistaSubtype: c.pistaSubtype,
              ownershipType: c.ownershipType,
              sociedadType: c.sociedadType,
              isFrontierZone: c.isFrontierZone,
              isAgroEventual: c.isAgroEventual,
              usoConformeSuelo: c.usoConformeSuelo,
              gestoriaData: c.gestoriaData
            })
          };
        }
        return c;
      });
      if (needsResave) {
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(sanitized));
      }
      return sanitized;
    } catch (e) {
      console.error('Error al leer clientes de localStorage', e);
      return [];
    }
  }

  static getClientById(id: string): Client | undefined {
    const clients = this.getClients();
    return clients.find(c => c.id === id);
  }

  static saveClient(client: Client): Client {
    const clients = this.getClients();
    const existingIdx = clients.findIndex(c => c.id === client.id);

    if (existingIdx >= 0) {
      clients[existingIdx] = {
        ...client,
        updatedAt: new Date().toISOString().split('T')[0]
      };
    } else {
      // Cliente nuevo: asegurar que tenga la lista de documentos regulatorios inicializada
      const newClient: Client = {
        ...client,
        id: client.id || `cli-${Date.now()}`,
        documents:
          client.documents && client.documents.length > 0
            ? client.documents
            : generateInitialChecklist({
                category: client.category,
                projectType: client.projectType,
                pistaSubtype: client.pistaSubtype,
                ownershipType: client.ownershipType,
                sociedadType: client.sociedadType,
                isFrontierZone: client.isFrontierZone,
                isAgroEventual: client.isAgroEventual,
                usoConformeSuelo: client.usoConformeSuelo,
                gestoriaData: client.gestoriaData
              }),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      clients.push(newClient);
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
      if (typeof window !== 'undefined' && window.electronAPI) {
        window.electronAPI.saveClient(newClient);
      }
      return newClient;
    }

    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.saveClient(clients[existingIdx]);
    }
    return clients[existingIdx];
  }

  static deleteClient(id: string): boolean {
    let clients = this.getClients();
    clients = clients.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.deleteClient(id);
    }
    return true;
  }

  // --- DOCUMENTACIÓN REGULATORIA ---
  static updateClientDocumentStatus(
    clientId: string,
    documentId: string,
    newStatus: DocumentStatus,
    notes?: string
  ): Client | undefined {
    const client = this.getClientById(clientId);
    if (!client) return undefined;

    const docIdx = client.documents.findIndex(d => d.id === documentId);
    if (docIdx >= 0) {
      const isApproved = newStatus === 'APPROVED' || newStatus === 'Aprobado';
      client.documents[docIdx].completed = isApproved;
      client.documents[docIdx].status = newStatus;
      client.documents[docIdx].estado = isApproved
        ? 'Aprobado'
        : newStatus === 'IN_PROGRESS' || newStatus === 'En trámite'
          ? 'En trámite'
          : newStatus === 'OBSERVED' || newStatus === 'Observado'
            ? 'Observado'
            : 'Pendiente';

      if (notes !== undefined) {
        client.documents[docIdx].notes = notes;
        client.documents[docIdx].observaciones = notes;
      }
      if (isApproved) {
        client.documents[docIdx].approvalDate = new Date().toISOString().split('T')[0];
      }
      if (
        (newStatus === 'IN_PROGRESS' || newStatus === 'En trámite') &&
        !client.documents[docIdx].submittedDate
      ) {
        client.documents[docIdx].submittedDate = new Date().toISOString().split('T')[0];
      }
      return this.saveClient(client);
    }
    return client;
  }

  // --- ESTUDIOS DE VIENTO ---
  static getWindStudies(clientId?: string): WindStudyResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WIND_STUDIES);
      const studies: WindStudyResult[] = data ? JSON.parse(data) : [];
      return clientId ? studies.filter(s => s.clientId === clientId) : studies;
    } catch {
      return [];
    }
  }

  static saveWindStudy(study: WindStudyResult): WindStudyResult {
    const studies = this.getWindStudies();
    const existingIdx = studies.findIndex(s => s.id === study.id);
    if (existingIdx >= 0) {
      studies[existingIdx] = study;
    } else {
      studies.push(study);
    }
    localStorage.setItem(STORAGE_KEYS.WIND_STUDIES, JSON.stringify(studies));
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.saveWindStudy(study);
    }
    return study;
  }

  // --- ESTUDIOS LAD (PISTAS) ---
  static getLadStudies(clientId?: string): LadStudy[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LAD_STUDIES);
      const studies: LadStudy[] = data ? JSON.parse(data) : [];
      return clientId ? studies.filter(s => s.clientId === clientId) : studies;
    } catch {
      return [];
    }
  }

  static saveLadStudy(study: LadStudy): LadStudy {
    const studies = this.getLadStudies();
    const existingIdx = studies.findIndex(s => s.id === study.id);
    if (existingIdx >= 0) {
      studies[existingIdx] = study;
    } else {
      studies.push(study);
    }
    localStorage.setItem(STORAGE_KEYS.LAD_STUDIES, JSON.stringify(studies));
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.saveLadStudy(study);
    }
    return study;
  }

  // --- ESTUDIOS LADH (HELIPUERTOS) ---
  static getLadhStudies(clientId?: string): LadhStudy[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LADH_STUDIES);
      const studies: LadhStudy[] = data ? JSON.parse(data) : [];
      return clientId ? studies.filter(s => s.clientId === clientId) : studies;
    } catch {
      return [];
    }
  }

  static saveLadhStudy(study: LadhStudy): LadhStudy {
    const studies = this.getLadhStudies();
    const existingIdx = studies.findIndex(s => s.id === study.id);
    if (existingIdx >= 0) {
      studies[existingIdx] = study;
    } else {
      studies.push(study);
    }
    localStorage.setItem(STORAGE_KEYS.LADH_STUDIES, JSON.stringify(studies));
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.saveLadhStudy(study);
    }
    return study;
  }

  // --- EXPORTACIÓN E IMPORTACIÓN DE EXPEDIENTES (BACKUP JSON) ---
  static exportFullBackup(): string {
    const backup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      clients: this.getClients(),
      windStudies: this.getWindStudies(),
      ladStudies: this.getLadStudies(),
      ladhStudies: this.getLadhStudies()
    };
    return JSON.stringify(backup, null, 2);
  }

  static importFullBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.clients)
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(parsed.clients));
      if (parsed.windStudies)
        localStorage.setItem(STORAGE_KEYS.WIND_STUDIES, JSON.stringify(parsed.windStudies));
      if (parsed.ladStudies)
        localStorage.setItem(STORAGE_KEYS.LAD_STUDIES, JSON.stringify(parsed.ladStudies));
      if (parsed.ladhStudies)
        localStorage.setItem(STORAGE_KEYS.LADH_STUDIES, JSON.stringify(parsed.ladhStudies));
      return true;
    } catch (e) {
      console.error('Error al importar backup JSON', e);
      return false;
    }
  }
}
