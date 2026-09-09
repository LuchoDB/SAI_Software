export type ProjectType = 'LAD' | 'LADH' | 'MIXED';

export type DocumentCategory = 'ANAC' | 'ESCRIBANÍA' | 'AMBIENTAL' | 'DEFENSA';

export type CanonicalDocumentStatus = 'Pendiente' | 'En trámite' | 'Observado' | 'Aprobado';
export type LegacyDocumentStatus = 'PENDING' | 'IN_PROGRESS' | 'OBSERVED' | 'APPROVED';
export type DocumentStatus = CanonicalDocumentStatus | LegacyDocumentStatus;

export interface DocumentItemModel {
  id: string;
  categoria: 'Obligatorio' | 'Condicional';
  organismo: 'ANAC' | 'ESCRIBANÍA' | 'AMBIENTAL' | 'DEFENSA';
  organismo_dependencia: string;
  titulo: string;
  descripcion: string;
  estado: DocumentStatus;

  // Campos de compatibilidad y UI
  code?: string;
  category?: DocumentCategory | string;
  title?: string;
  description?: string;
  status?: DocumentStatus;
  isMandatory?: boolean;
  submittedDate?: string;
  approvalDate?: string;
  notes?: string;
  fileReference?: string;
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
  isFrontierZone?: boolean; // Aplica Ley 23.554 (FRONT-LEY)
  isAgroEventual?: boolean; // Campo eventual agroaéreo RAAC 137 (AGRO-RAAC137)
  documents: DocumentItemModel[];
  createdAt: string;
  updatedAt: string;
}
