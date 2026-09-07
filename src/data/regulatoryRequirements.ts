import { DocumentItemModel } from '../types/client';

export const MASTER_DOCUMENT_CHECKLIST: Omit<DocumentItemModel, 'id' | 'status'>[] = [
  // ANAC
  {
    category: 'ANAC',
    code: 'ANAC-F501',
    title: 'Formulario Oficial de Solicitud de Habilitación',
    description: 'Presentación formal ante la Dirección Nacional de Infraestructura y Servicios Aeroportuarios (DINAyG - ANAC).',
    isMandatory: true
  },
  {
    category: 'ANAC',
    code: 'ANAC-MEM',
    title: 'Memoria Técnica Descriptiva de Proyecto',
    description: 'Documento técnico integral con fundamentos operativos, aeronave de diseño y cálculo de capacidades, visado por profesional matriculado (CPA).',
    isMandatory: true
  },
  {
    category: 'ANAC',
    code: 'ANAC-PL-IMP',
    title: 'Plano General de Implantación (Escala 1:1000)',
    description: 'Plano acotado con ubicación de pista/FATO/TLOF, calles de rodaje, plataforma, orientación geográfica y cerco perimetral reglamentario.',
    isMandatory: true
  },
  {
    category: 'ANAC',
    code: 'ANAC-PL-SLO',
    title: 'Plano de Superficies Limitadoras de Obstáculos (SLO)',
    description: 'Relevamiento perimétrico a 360° con conos de aproximación, despegue y transición conforme RAAC 153 o 154.',
    isMandatory: true
  },
  {
    category: 'ANAC',
    code: 'ANAC-MET',
    title: 'Estudio Climatológico y Rosa de los Vientos',
    description: 'Análisis estadístico de vientos representativo de la zona y cálculo del factor de utilización OACI (>= 95%).',
    isMandatory: true
  },
  {
    category: 'ANAC',
    code: 'ANAC-SUE',
    title: 'Estudio Geotécnico de Suelos y Capacidad Portante',
    description: 'Ensayo de suelo (CBR para pistas naturales o cálculo de resistencia estructural 1.5x MTOW para helipuertos).',
    isMandatory: false
  },
  {
    category: 'ANAC',
    code: 'ANAC-SSEI',
    title: 'Plan de Emergencia y Extinción de Incendios (SSEI)',
    description: 'Esquema de respuesta rápida, agentes extintores mínimos reglamentarios y coordinación con bomberos locales.',
    isMandatory: true
  },
  {
    category: 'ANAC',
    code: 'ANAC-TAS',
    title: 'Comprobante de Pago de Arancel Aeronáutico ANAC',
    description: 'Comprobante oficial de pago de arancel de inspección e inicio de trámite de habilitación.',
    isMandatory: true
  },

  // ENACOM
  {
    category: 'ENACOM',
    code: 'ENA-RAD',
    title: 'Dictamen de No Afectación a Radioenlaces y Radioayudas',
    description: 'Verificación técnica de no perturbación a radioenlaces troncales de telecomunicaciones y radioayudas VOR/ILS/NDB cercanas.',
    isMandatory: true
  },
  {
    category: 'ENACOM',
    code: 'ENA-ANT',
    title: 'Certificación de Alturas de Mástiles y Estructuras (5 km)',
    description: 'Relevamiento de torres de telefonía y líneas de alta tensión en las inmediaciones del punto de referencia de aeródromo (ARP).',
    isMandatory: true
  },
  {
    category: 'ENACOM',
    code: 'ENA-VHF',
    title: 'Factibilidad / Permiso de Estación Terrestre VHF Aeronáutica',
    description: 'Trámite de asignación y autorización de frecuencia operativa aire-tierra (Banda 118-137 MHz).',
    isMandatory: false
  },

  // CATASTRO & JURÍDICO
  {
    category: 'CATASTRO',
    code: 'CAT-DOM',
    title: 'Título de Propiedad o Contrato de Comodato/Uso',
    description: 'Escritura de dominio inscripta en Registro de la Propiedad Inmueble o comodato con firmas certificadas ante escribano público.',
    isMandatory: true
  },
  {
    category: 'CATASTRO',
    code: 'CAT-MENS',
    title: 'Plano de Mensura Catastral Oficial (WGS84 / POSGAR)',
    description: 'Plano de mensura aprobado por la Dirección de Catastro Provincial con coordenadas geodésicas oficiales de los vértices.',
    isMandatory: true
  },
  {
    category: 'CATASTRO',
    code: 'CAT-DOM-LIB',
    title: 'Certificado de Dominio e Inhibiciones',
    description: 'Informe que acredita la titularidad vigente y ausencia de gravámenes o medidas cautelares sobre el inmueble.',
    isMandatory: true
  },

  // MUNICIPAL
  {
    category: 'MUNICIPAL',
    code: 'MUN-USO',
    title: 'Certificado de Zonificación y Compatibilidad de Suelo',
    description: 'Constancia municipal que autoriza o declara compatible el uso aeronáutico en la parcela de emplazamiento.',
    isMandatory: true
  },

  // AMBIENTAL
  {
    category: 'AMBIENTAL',
    code: 'AMB-DIA',
    title: 'Declaración de Impacto Ambiental (DIA / Acústico)',
    description: 'Aprobación del estudio de impacto sonoro y ambiental ante el organismo ambiental provincial correspondiente.',
    isMandatory: false
  }
];

export function generateInitialChecklist(): DocumentItemModel[] {
  return MASTER_DOCUMENT_CHECKLIST.map((item, idx) => ({
    ...item,
    id: `doc-${Date.now()}-${idx}`,
    status: 'PENDING',
    notes: ''
  }));
}
