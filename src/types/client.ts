export type ProjectType = 'LAD' | 'LADH' | 'MIXED';

export type ExpedienteCategory = 'Pistas' | 'Alquiler de Aeronave' | 'Gestoria';

export type PistaSubtype =
  | 'LAD'
  | 'Aerodromo priv'
  | 'aerodromo publico'
  | 'aerodromo privado para uso agroaereo'
  | 'LADH'
  | 'Helipuerto Privado'
  | 'helipuerto publico';

export type OwnershipType = 'Razon Social' | 'Titular Unico' | 'Titulares Varios';

export type SociedadType =
  | 'S.A.'
  | 'S.R.L.'
  | 'Cooperativa'
  | 'S.A.S.'
  | 'Fideicomiso'
  | 'Asociación Civil / Aeroclub'
  | 'Sociedad de Hecho / Consorcio'
  | 'Otra';

export type DocumentCategory =
  'ANAC' | 'ESCRIBANÍA' | 'AMBIENTAL' | 'DEFENSA' | 'GESTORÍA' | 'LOCACIÓN';

export type CanonicalDocumentStatus = 'Pendiente' | 'En trámite' | 'Observado' | 'Aprobado';
export type LegacyDocumentStatus = 'PENDING' | 'IN_PROGRESS' | 'OBSERVED' | 'APPROVED';
export type DocumentStatus = CanonicalDocumentStatus | LegacyDocumentStatus;

export interface DocumentItemModel {
  id: string;
  categoria: 'Obligatorio' | 'Condicional';
  organismo: 'ANAC' | 'ESCRIBANÍA' | 'AMBIENTAL' | 'DEFENSA' | 'GESTORÍA' | 'LOCACIÓN';
  organismo_dependencia: string;
  titulo: string;
  descripcion: string;
  estado: DocumentStatus;
  completed?: boolean;

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
  observaciones?: string;
  fileReference?: string;
}

export interface ClientCoordinates {
  lat: number;
  lng: number;
  formatted?: string;
}

export interface TitularData {
  id: string;
  nombre: string;
  dniCuit: string;
  telefono?: string;
  email?: string;
  porcentajeParticipacion?: string;
}

export interface AircraftRentalData {
  clientName: string;
  aircraftOwner: string;
  aircraftType: string;
  destinationOrUse: string;
  contractedHoursOrKm: string;
}

export interface GestoriaData {
  applicantName: string;
  certificadoDominio: boolean;
  certificadoTransferencia: boolean;
  matriculacion: boolean;
  transferenciaDominio: boolean;
  observaciones?: string;
}

export interface Client {
  id: string;
  name: string;
  cuit: string;
  contactPerson: string;
  email: string;
  phone: string;
  projectType: ProjectType;

  // Nuevas opciones de categorización y personería
  category?: ExpedienteCategory;
  pistaSubtype?: PistaSubtype;
  ownershipType?: OwnershipType;
  sociedadType?: SociedadType;
  titulares?: TitularData[];
  aircraftRentalData?: AircraftRentalData;
  gestoriaData?: GestoriaData;

  // Emplazamiento, orientación y ambiente
  locationName: string;
  province: string;
  coordinates: ClientCoordinates;
  magneticOrientation?: number | string; // Rumbo magnético ej. 050° / QFU 05-23
  elevationMsl: number; // Metros sobre el nivel del mar
  referenceTemperatureC?: number; // Temperatura de referencia mes más caluroso
  terrainLengthAvailableM?: number; // Metros disponibles en predio
  terrainWidthAvailableM?: number; // Metros disponibles en predio
  terrainLengthAvailable?: number; // Compatibilidad
  terrainWidthAvailable?: number; // Compatibilidad
  notes?: string;
  isFrontierZone?: boolean; // Aplica Ley 23.554 (FRONT-LEY)
  isAgroEventual?: boolean; // Campo eventual agroaéreo RAAC 137 (AGRO-RAAC137)
  usoConformeSuelo?: boolean; // Certificado de uso conforme del suelo (requisito ambiental)

  // Estado del expediente
  isArchived?: boolean; // Expediente finalizado / archivado

  documents: DocumentItemModel[];
  createdAt: string;
  updatedAt: string;
}
