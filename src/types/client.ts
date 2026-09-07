export type ProjectType = 'LAD' | 'LADH' | 'MIXED';

export type DocumentCategory = 'ANAC' | 'ENACOM' | 'CATASTRO' | 'AMBIENTAL' | 'MUNICIPAL';

export type DocumentStatus = 'PENDING' | 'IN_PROGRESS' | 'OBSERVED' | 'APPROVED';

export interface DocumentItemModel {
  id: string;
  category: DocumentCategory;
  code: string;
  title: string;
  description: string;
  status: DocumentStatus;
  submittedDate?: string;
  approvalDate?: string;
  notes?: string;
  fileReference?: string;
  isMandatory: boolean;
}

export interface ClientCoordinates {
  lat: number;
  lng: number;
  formatted?: string;
}

export interface Client {
  id: string;
  name: string;
  cuit: string;
  contactPerson: string;
  email: string;
  phone: string;
  projectType: ProjectType;
  locationName: string;
  province: string;
  coordinates: ClientCoordinates;
  elevationMsl: number; // Metros sobre el nivel del mar
  referenceTemperatureC?: number; // Temperatura de referencia mes más caluroso
  terrainLengthAvailableM?: number; // Metros disponibles en predio
  terrainWidthAvailableM?: number; // Metros disponibles en predio
  terrainLengthAvailable?: number; // Compatibilidad
  terrainWidthAvailable?: number; // Compatibilidad
  notes?: string;
  documents: DocumentItemModel[];
  createdAt: string;
  updatedAt: string;
}
