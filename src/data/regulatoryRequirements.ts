import { DocumentItemModel, ProjectType } from '../types/client';

export interface CanonicalDocDefinition {
  id: string;
  categoria: 'Obligatorio' | 'Condicional';
  organismo: 'ANAC' | 'ESCRIBANÍA' | 'AMBIENTAL' | 'DEFENSA';
  organismo_dependencia: string;
  titulo: string;
  descripcion: string;
}

/**
 * LISTA CANÓNICA OFICIAL DE DOCUMENTACIÓN LAD/LADH
 * No inventar, agregar ni quitar ítems. Usar exclusivamente los ítems de esta lista.
 */
export const CANONICAL_DOCUMENTS_LIST: CanonicalDocDefinition[] = [
  // 1. ANAC (Dirección de Aeródromos - DGIySA / CAD / Dirección Regional)
  {
    id: 'ANAC-NOTA',
    categoria: 'Obligatorio',
    organismo: 'ANAC',
    organismo_dependencia: 'Dirección de Aeródromos - DGIySA',
    titulo: 'Nota de Presentación',
    descripcion:
      'Nota dirigida a la Dirección de Aeródromos describiendo el sitio, firmada por quien acredite derecho de uso del inmueble. Se presenta vía TAD o mesa de entradas (Balcarce 290, CABA).'
  },
  {
    id: 'ANAC-FORM',
    categoria: 'Obligatorio',
    organismo: 'ANAC',
    organismo_dependencia: 'Dirección de Aeródromos - DGIySA',
    titulo: 'Formulario LAD/LADH',
    descripcion:
      'Formulario oficial completo (Anexo IX), indicando el tipo de lugar apto: LAD (aeronaves) o LADH (helicópteros).'
  },
  {
    id: 'ANAC-DENOM',
    categoria: 'Obligatorio',
    organismo: 'ANAC',
    organismo_dependencia: 'Dirección de Aeródromos - DGIySA',
    titulo: 'Denominación Propuesta',
    descripcion: 'Nombre propuesto para el LAD/LADH.'
  },
  {
    id: 'ANAC-RESP',
    categoria: 'Obligatorio',
    organismo: 'ANAC',
    organismo_dependencia: 'Dirección de Aeródromos - DGIySA',
    titulo: 'Datos del Responsable',
    descripcion:
      'Apellido, nombre, tipo y número de documento, domicilio, teléfono y correo electrónico de la persona responsable del lugar.'
  },
  {
    id: 'ANAC-CONT',
    categoria: 'Obligatorio',
    organismo: 'ANAC',
    organismo_dependencia: 'Dirección de Aeródromos - DGIySA',
    titulo: 'Datos de Contacto del Lugar',
    descripcion:
      'Teléfono, teléfono alternativo/de emergencia y correo electrónico del lugar de operación.'
  },
  {
    id: 'ANAC-TEC-LAD',
    categoria: 'Condicional',
    organismo: 'ANAC',
    organismo_dependencia: 'Dirección de Aeródromos - DGIySA',
    titulo: 'Datos Técnicos de Pista (solo LAD)',
    descripcion:
      'Largo, ancho y superficie de pista; rumbo magnético; coordenadas WGS-84 de cada umbral y centro geométrico; elevación AMSL; equipo GPS empleado.'
  },
  {
    id: 'ANAC-TEC-LADH',
    categoria: 'Condicional',
    organismo: 'ANAC',
    organismo_dependencia: 'Dirección de Aeródromos - DGIySA',
    titulo: 'Datos Técnicos de FATO (solo LADH)',
    descripcion:
      'Dimensiones del FATO (largo, ancho o diámetro) y superficie; trayectorias de aproximación/despegue con rumbo magnético; coordenadas WGS-84 del centro del FATO; elevación AMSL; equipo GPS empleado.'
  },
  {
    id: 'ANAC-TAS',
    categoria: 'Obligatorio',
    organismo: 'ANAC',
    organismo_dependencia: 'CAD - Casillero Aeronáutico Digital',
    titulo: 'Comprobante de Pago - Arancel A.D.1.9',
    descripcion:
      'Comprobante de pago del arancel correspondiente al registro (uno solo por registro), generado por VEP o boleta a través del CAD.'
  },
  {
    id: 'ANAC-REG-MOV',
    categoria: 'Obligatorio',
    organismo: 'ANAC',
    organismo_dependencia: 'Dirección Regional de jurisdicción',
    titulo: 'Registro de Movimiento de Aeronaves',
    descripcion:
      'Obligación posterior al registro: llevar un libro foliado y habilitado por la Dirección Regional, Jefe de Aeródromo Controlado o Dirección de Aeródromos, para asentar operaciones de entrada y salida.'
  },

  // 2. ESCRIBANÍA
  {
    id: 'ESC-DOM',
    categoria: 'Obligatorio',
    organismo: 'ESCRIBANÍA',
    organismo_dependencia: 'Escribano público',
    titulo: 'Título de Propiedad o Contrato de Locación',
    descripcion:
      'Copia certificada por escribano público del título de propiedad o del contrato de locación (si no es el propietario) del inmueble donde se ubica el lugar apto.'
  },
  {
    id: 'ESC-PLANO',
    categoria: 'Obligatorio',
    organismo: 'ESCRIBANÍA',
    organismo_dependencia: 'Escribano público / Catastro',
    titulo: 'Plano Catastral o de Mensura',
    descripcion:
      'Plano catastral o de mensura según título, indicando sobre el mismo la ubicación de la pista/FATO/área de aterrizaje.'
  },
  {
    id: 'ESC-PODER',
    categoria: 'Condicional',
    organismo: 'ESCRIBANÍA',
    organismo_dependencia: 'Escribano público',
    titulo: 'Poder Certificado',
    descripcion:
      'Copia certificada del poder a nombre de quien presenta el trámite, cuando actúa como apoderado y no como propietario.'
  },
  {
    id: 'ESC-ACTA',
    categoria: 'Condicional',
    organismo: 'ESCRIBANÍA',
    organismo_dependencia: 'Escribano público',
    titulo: 'Última Acta de Directorio',
    descripcion: 'Cuando el propietario del inmueble es una persona jurídica (firma).'
  },

  // 3. AMBIENTAL
  {
    id: 'AMB-DJA',
    categoria: 'Obligatorio',
    organismo: 'AMBIENTAL',
    organismo_dependencia: 'Autoridad ambiental competente (Nacional/Provincial/Municipal)',
    titulo: 'Declaración Jurada Ambiental',
    descripcion:
      'Declaración Jurada conforme Ley 25.675 (Art. 11° y 12°) manifestando que la obra/actividad no afectará significativamente el ambiente, con aceptación de la autoridad competente. No confundir con un Estudio de Impacto Ambiental completo.'
  },

  // 4. DEFENSA (Zona de frontera)
  {
    id: 'FRONT-LEY',
    categoria: 'Condicional',
    organismo: 'DEFENSA',
    organismo_dependencia: 'Autoridad de frontera correspondiente',
    titulo: 'Cumplimiento Normativa de Frontera',
    descripcion:
      'Aplica solo si el lugar apto se emplaza en zona de frontera: debe ajustarse a la Ley 23.554 y el Decreto-Ley 15.385/44.'
  },

  // 5. ANAC (DNSO, solo caso agroaéreo)
  {
    id: 'AGRO-RAAC137',
    categoria: 'Condicional',
    organismo: 'ANAC',
    organismo_dependencia: 'Dirección Nacional de Seguridad Operacional (DNSO)',
    titulo: 'Denuncia como Campo Eventual Agroaéreo',
    descripcion:
      'Alternativa al registro LAD para explotadores agroaéreos que operan bajo RAAC 137 Subparte E-137.41, denunciando el campo eventual en vez de tramitar el registro LAD estándar. Este ítem reemplaza al registro LAD estándar, no lo complementa.'
  }
];

export interface CanonicalDocsFilterOptions {
  projectType?: ProjectType;
  isFrontierZone?: boolean;
  isAgroEventual?: boolean;
}

/**
 * Genera la documentación oficial LAD/LADH agrupada y ordenada por organismo:
 * ANAC -> ESCRIBANÍA -> AMBIENTAL -> DEFENSA -> ANAC (DNSO, solo caso agroaéreo).
 *
 * Cada ítem respeta estrictamente los campos:
 * id, categoria, organismo, organismo_dependencia, titulo, descripcion, estado ("Pendiente").
 */
export function generateCanonicalDocumentation(
  options?: CanonicalDocsFilterOptions
): DocumentItemModel[] {
  const isLadh = options?.projectType === 'LADH';
  const isFrontier = Boolean(options?.isFrontierZone);
  const isAgro = Boolean(options?.isAgroEventual);

  const docMap = new Map<string, CanonicalDocDefinition>(
    CANONICAL_DOCUMENTS_LIST.map(doc => [doc.id, doc])
  );

  const orderedList: CanonicalDocDefinition[] = [];

  // 1. ANAC
  const anacNota = docMap.get('ANAC-NOTA')!;
  const anacForm = docMap.get('ANAC-FORM')!;
  const anacDenom = docMap.get('ANAC-DENOM')!;
  const anacResp = docMap.get('ANAC-RESP')!;
  const anacCont = docMap.get('ANAC-CONT')!;
  orderedList.push(anacNota, anacForm, anacDenom, anacResp, anacCont);

  // Técnico condicional: SOLO uno según tipo (LAD -> ANAC-TEC-LAD, LADH -> ANAC-TEC-LADH)
  if (isLadh) {
    orderedList.push(docMap.get('ANAC-TEC-LADH')!);
  } else {
    orderedList.push(docMap.get('ANAC-TEC-LAD')!);
  }

  orderedList.push(docMap.get('ANAC-TAS')!);
  orderedList.push(docMap.get('ANAC-REG-MOV')!);

  // 2. ESCRIBANÍA
  orderedList.push(
    docMap.get('ESC-DOM')!,
    docMap.get('ESC-PLANO')!,
    docMap.get('ESC-PODER')!,
    docMap.get('ESC-ACTA')!
  );

  // 3. AMBIENTAL
  orderedList.push(docMap.get('AMB-DJA')!);

  // 4. DEFENSA (Únicamente si en zona de frontera)
  if (isFrontier) {
    orderedList.push(docMap.get('FRONT-LEY')!);
  }

  // 5. ANAC (DNSO, solo caso agroaéreo)
  if (isAgro) {
    orderedList.push(docMap.get('AGRO-RAAC137')!);
  }

  return orderedList.map(def => ({
    id: def.id,
    categoria: def.categoria,
    organismo: def.organismo,
    organismo_dependencia: def.organismo_dependencia,
    titulo: def.titulo,
    descripcion: def.descripcion,
    estado: 'Pendiente',

    // Campos de compatibilidad y renderizado UI
    code: def.id,
    category: def.organismo,
    title: def.titulo,
    description: def.descripcion,
    status: 'PENDING',
    isMandatory: def.categoria === 'Obligatorio',
    notes: ''
  }));
}

/**
 * Función principal para compatibilidad con código existente
 */
export function generateInitialChecklist(
  options?: CanonicalDocsFilterOptions
): DocumentItemModel[] {
  return generateCanonicalDocumentation(options);
}
