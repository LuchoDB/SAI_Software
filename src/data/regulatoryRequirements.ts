import {
  DocumentItemModel,
  ProjectType,
  ExpedienteCategory,
  PistaSubtype,
  OwnershipType,
  SociedadType,
  GestoriaData
} from '../types/client';

export interface CanonicalDocDefinition {
  id: string;
  categoria: 'Obligatorio' | 'Condicional';
  organismo: 'ANAC' | 'ESCRIBANÍA' | 'AMBIENTAL' | 'DEFENSA' | 'GESTORÍA' | 'LOCACIÓN';
  organismo_dependencia: string;
  titulo: string;
  descripcion: string;
}

/**
 * LISTA CANÓNICA OFICIAL DE DOCUMENTACIÓN AERONÁUTICA SAI CONSULT
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
      'Nota formal dirigida a la Dirección de Aeródromos describiendo el sitio, firmada por quien acredite derecho de uso del inmueble. Se presenta vía TAD o mesa de entradas.'
  },
  {
    id: 'ANAC-FORM',
    categoria: 'Obligatorio',
    organismo: 'ANAC',
    organismo_dependencia: 'Dirección de Aeródromos - DGIySA',
    titulo: 'Formulario LAD/LADH (Anexo IX)',
    descripcion:
      'Formulario oficial completo unificado. Incluye en su cuerpo la denominación propuesta, datos del responsable legal, datos de contacto de emergencia, y especificaciones técnicas (rumbo magnético, coordenadas WGS-84, dimensiones y superficie).'
  },
  {
    id: 'ANAC-TAS',
    categoria: 'Obligatorio',
    organismo: 'ANAC',
    organismo_dependencia: 'CAD - Casillero Aeronáutico Digital',
    titulo: 'Comprobante de Pago - Arancel A.D.1.9',
    descripcion:
      'Comprobante de pago del arancel correspondiente al registro, generado por VEP o boleta a través del CAD.'
  },
  {
    id: 'ANAC-REG-MOV',
    categoria: 'Obligatorio',
    organismo: 'ANAC',
    organismo_dependencia: 'Dirección Regional de jurisdicción',
    titulo: 'Registro de Movimiento de Aeronaves',
    descripcion:
      'Obligación posterior al registro: llevar un libro foliado y habilitado para asentar operaciones de entrada y salida de aeronaves.'
  },

  // 2. ESCRIBANÍA & PERSONERÍA
  {
    id: 'ESC-DOM',
    categoria: 'Obligatorio',
    organismo: 'ESCRIBANÍA',
    organismo_dependencia: 'Escribano público',
    titulo: 'Título de Propiedad o Contrato de Locación',
    descripcion:
      'Copia certificada por escribano público del título de propiedad o contrato de locación con derecho a uso aeronáutico.'
  },
  {
    id: 'ESC-PLANO',
    categoria: 'Obligatorio',
    organismo: 'ESCRIBANÍA',
    organismo_dependencia: 'Escribano público / Catastro',
    titulo: 'Plano Catastral o de Mensura',
    descripcion:
      'Plano catastral o de mensura georreferenciado, indicando sobre el mismo la ubicación y orientación de la pista o helipuerto.'
  },
  {
    id: 'ESC-ACTA-CONST',
    categoria: 'Condicional',
    organismo: 'ESCRIBANÍA',
    organismo_dependencia: 'Registro Público / IGJ / INAES',
    titulo: 'Estatuto / Contrato Constitutivo Inscripto',
    descripcion:
      'Copia certificada del contrato social o estatuto constitutivo inscripto según tipo societario (S.A., S.R.L., Cooperativa, S.A.S., etc.).'
  },
  {
    id: 'ESC-AUTORIZ-DIR',
    categoria: 'Condicional',
    organismo: 'ESCRIBANÍA',
    organismo_dependencia: 'Escribano público / Órgano de Administración',
    titulo: 'Autorización de Directorio / Gerencia / Consejo',
    descripcion:
      'Acta de designación de autoridades vigentes y resolución expresa del Directorio (S.A.), Gerencia (S.R.L.) o Consejo de Administración (Cooperativa) autorizando la presentación.'
  },
  {
    id: 'ESC-CONDOM',
    categoria: 'Condicional',
    organismo: 'ESCRIBANÍA',
    organismo_dependencia: 'Escribano público',
    titulo: 'Autorización Mancomunada de Condóminos',
    descripcion:
      'Consentimiento notarial expreso o poder especial otorgado por todos los cotitulares de la aeronave o predio para el trámite o afectación correspondiente.'
  },
  {
    id: 'ESC-DNI-TITULARES',
    categoria: 'Condicional',
    organismo: 'ESCRIBANÍA',
    organismo_dependencia: 'Registro Nacional de las Personas',
    titulo: 'DNI y Constancias de CUIT/CUIL de los Titulares',
    descripcion:
      'Copias certificadas de los documentos de identidad y constancias fiscales de todos los titulares intervinientes.'
  },
  {
    id: 'ESC-PODER',
    categoria: 'Condicional',
    organismo: 'ESCRIBANÍA',
    organismo_dependencia: 'Escribano público',
    titulo: 'Poder Notarial de Representación',
    descripcion:
      'Poder especial o general con facultades suficientes a nombre de quien suscribe el trámite ante ANAC.'
  },

  // 3. AMBIENTAL & TERRITORIAL
  {
    id: 'AMB-DJA',
    categoria: 'Obligatorio',
    organismo: 'AMBIENTAL',
    organismo_dependencia: 'Autoridad ambiental competente',
    titulo: 'Declaración Jurada Ambiental',
    descripcion:
      'Declaración Jurada conforme Ley General del Ambiente 25.675 (Art. 11° y 12°) manifestando que la actividad no causará impacto negativo.'
  },
  {
    id: 'AMB-USO-SUELO',
    categoria: 'Obligatorio',
    organismo: 'AMBIENTAL',
    organismo_dependencia: 'Municipio / Comuna local',
    titulo: 'Uso Conforme del Suelo',
    descripcion:
      'Certificado de zonificación y uso conforme del suelo emitido por la autoridad municipal o comunal competente para el aspecto ambiental y territorial.'
  },

  // 4. DEFENSA (Zona de frontera)
  {
    id: 'FRONT-LEY',
    categoria: 'Condicional',
    organismo: 'DEFENSA',
    organismo_dependencia: 'Superintendencia de Fronteras / Min. de Defensa',
    titulo: 'Cumplimiento Normativa de Frontera',
    descripcion:
      'Aplica si el predio se emplaza en zona de seguridad de frontera conforme Ley 23.554 y Decreto-Ley 15.385/44.'
  },

  // 5. CAMPO EVENTUAL AGROAÉREO (RAAC 137)
  {
    id: 'AGRO-FORM-DENUNCIA',
    categoria: 'Obligatorio',
    organismo: 'ANAC',
    organismo_dependencia: 'Dirección Nacional de Seguridad Operacional (DNSO)',
    titulo: 'Denuncia de Campo Eventual Agroaéreo (RAAC 137)',
    descripcion:
      'Formulario/Nota formal de denuncia de campo de operación eventual bajo RAAC 137 Subparte E-137.41 con datos del explotador y aeronave agrícola.'
  },
  {
    id: 'AGRO-AUTORIZ-PREDIO',
    categoria: 'Obligatorio',
    organismo: 'ESCRIBANÍA',
    organismo_dependencia: 'Propietario u ocupante legal',
    titulo: 'Autorización / Consentimiento de Uso del Predio',
    descripcion:
      'Consentimiento formal por escrito del propietario o tenedor legal del predio autorizando los despegues y aterrizajes agrícolas eventuales.'
  },
  {
    id: 'AGRO-CROQUIS-COORD',
    categoria: 'Obligatorio',
    organismo: 'ANAC',
    organismo_dependencia: 'DNSO - ANAC',
    titulo: 'Croquis Operacional con Coordenadas y Rumbo',
    descripcion:
      'Croquis técnico del predio indicando coordenadas geográficas WGS-84, orientación magnética de la faja de operaciones y despeje visual de obstáculos.'
  },

  // 6. GESTORÍA AERONÁUTICA
  {
    id: 'GEST-DOM',
    categoria: 'Obligatorio',
    organismo: 'GESTORÍA',
    organismo_dependencia: 'Registro Nacional de Aeronaves (RNA)',
    titulo: 'Certificado de Dominio',
    descripcion:
      'Informe oficial de dominio, inhibiciones, embargos y gravámenes sobre la aeronave expedido por el RNA.'
  },
  {
    id: 'GEST-TRANSF',
    categoria: 'Obligatorio',
    organismo: 'GESTORÍA',
    organismo_dependencia: 'Registro Nacional de Aeronaves (RNA)',
    titulo: 'Certificado de Transferencia',
    descripcion:
      'Formulario 08 de aeronaves o contrato de transferencia con firmas debidamente certificadas por escribano o autoridad judicial.'
  },
  {
    id: 'GEST-MATRIC',
    categoria: 'Obligatorio',
    organismo: 'GESTORÍA',
    organismo_dependencia: 'Dirección de Aeronavegabilidad - ANAC',
    titulo: 'Matriculación / Rematriculación',
    descripcion:
      'Trámite de asignación, inscripción o renovación de matrícula civil LV o LQ ante la ANAC.'
  },
  {
    id: 'GEST-TRANSF-DOM',
    categoria: 'Obligatorio',
    organismo: 'GESTORÍA',
    organismo_dependencia: 'Registro Nacional de Aeronaves (RNA)',
    titulo: 'Transferencia de Dominio',
    descripcion:
      'Inscripción registral definitiva del cambio de titularidad del derecho de dominio sobre la aeronave.'
  },

  // 7. ALQUILER DE AERONAVES
  {
    id: 'ALQ-CONTRATO',
    categoria: 'Obligatorio',
    organismo: 'LOCACIÓN',
    organismo_dependencia: 'Partes contratantes',
    titulo: 'Contrato de Locación de Aeronave',
    descripcion:
      'Contrato formal de alquiler de aeronave especificando cliente, titular, máquina, destino/uso y horas/kilómetros contratados.'
  },
  {
    id: 'ALQ-POLIZA',
    categoria: 'Obligatorio',
    organismo: 'LOCACIÓN',
    organismo_dependencia: 'Aseguradora aeronáutica',
    titulo: 'Póliza de Seguro Aeronáutico Vigente',
    descripcion:
      'Cobertura de seguro aeronáutico obligatorio vigente por daños a terceros en la superficie y personas transportadas.'
  },
  {
    id: 'ALQ-CERT-AERO',
    categoria: 'Obligatorio',
    organismo: 'LOCACIÓN',
    organismo_dependencia: 'ANAC',
    titulo: 'Certificado de Aeronavegabilidad Estándar',
    descripcion:
      'Certificado de aeronavegabilidad y constancia de mantenimiento al día de la aeronave arrendada.'
  },
  {
    id: 'ALQ-TRIPULACION',
    categoria: 'Obligatorio',
    organismo: 'LOCACIÓN',
    organismo_dependencia: 'ANAC - Centro Médico Aeronáutico',
    titulo: 'Licencia de Piloto y Psicofísico CMA Vigente',
    descripcion:
      'Licencia habilitante de la tripulación al mando adecuada al tipo de aeronave y certificado médico aeronáutico al día.'
  }
];

export interface CanonicalDocsFilterOptions {
  projectType?: ProjectType;
  category?: ExpedienteCategory;
  pistaSubtype?: PistaSubtype;
  ownershipType?: OwnershipType;
  sociedadType?: SociedadType;
  isFrontierZone?: boolean;
  isAgroEventual?: boolean;
  usoConformeSuelo?: boolean;
  gestoriaData?: GestoriaData;
}

/**
 * Retorna la documentación societaria específica según el tipo de persona jurídica
 * (S.A., S.R.L., Cooperativa, S.A.S., Fideicomiso, etc.)
 */
export function getCorporateDocuments(
  sociedadType: SociedadType | undefined,
  baseActa: CanonicalDocDefinition,
  baseAutoriz: CanonicalDocDefinition,
  basePoder: CanonicalDocDefinition
): CanonicalDocDefinition[] {
  if (!sociedadType) {
    return [
      {
        ...baseActa,
        titulo: 'Instrumento Constitutivo inscripto',
        descripcion:
          'Copia certificada por escribano público del Estatuto o Contrato Social inscripto ante el Registro Público u organismo de contralor.'
      },
      {
        ...baseAutoriz,
        titulo: 'Acta de Designación de Autoridades y Autorización',
        descripcion:
          'Copia certificada del Acta de designación de autoridades vigentes y expresa autorización para el trámite.'
      },
      {
        ...basePoder,
        titulo: 'Poder Notarial de Representación Legal',
        descripcion:
          'Poder notarial con facultades suficientes conferido por las autoridades para actuar ante la autoridad aeronáutica.'
      }
    ];
  }
  switch (sociedadType) {
    case 'S.A.':
      return [
        {
          ...baseActa,
          titulo: 'Estatuto Constitutivo inscripto (S.A.)',
          descripcion:
            'Copia certificada por escribano público del Estatuto Constitutivo inscripto ante la Inspección General de Justicia (IGJ) o Registro Público de Comercio provincial.'
        },
        {
          ...baseAutoriz,
          titulo: 'Acta de Asamblea y Directorio + Autorización (S.A.)',
          descripcion:
            'Copia certificada del Acta de Asamblea de designación del Directorio vigente y Resolución formal del Directorio autorizando la gestión aeronáutica.'
        },
        {
          ...basePoder,
          titulo: 'Poder Notarial de Representación (S.A.)',
          descripcion:
            'Poder notarial con facultades de administración y disposición conferido por el Presidente o Directorio para actuar ante la autoridad aeronáutica.'
        }
      ];
    case 'S.R.L.':
      return [
        {
          ...baseActa,
          titulo: 'Contrato Social inscripto con modificaciones (S.R.L.)',
          descripcion:
            'Copia notarialmente certificada del Contrato Social inscripto en el Registro Público y de todas las cesiones o reformas estatutarias vigentes.'
        },
        {
          ...baseAutoriz,
          titulo: 'Acta de Designación y Autorización de Gerencia (S.R.L.)',
          descripcion:
            'Acta formal de designación de la Gerencia vigente y autorización expresa de los gerentes para solicitar la habilitación aeronáutica.'
        },
        {
          ...basePoder,
          titulo: 'Poder Notarial de la Gerencia (S.R.L.)',
          descripcion:
            'Poder especial o general otorgado ante escribano público por la Gerencia de la S.R.L. para suscribir trámites ante la ANAC.'
        }
      ];
    case 'Cooperativa':
      return [
        {
          ...baseActa,
          organismo_dependencia: 'INAES / Registro de Cooperativas',
          titulo: 'Estatuto de la Cooperativa inscripto ante INAES',
          descripcion:
            'Copia certificada del Estatuto Constitutivo registrado ante el INAES (Instituto Nacional de Asociativismo y Economía Social) y Matrícula Nacional vigente.'
        },
        {
          ...baseAutoriz,
          organismo_dependencia: 'Consejo de Administración',
          titulo: 'Acta del Consejo de Administración y Autorización (Cooperativa)',
          descripcion:
            'Acta de Asamblea de designación de consejeros, acta de distribución de cargos del Consejo de Administración y resolución expresa autorizando la presentación.'
        },
        {
          ...basePoder,
          titulo: 'Poder Notarial / Acreditación del Consejo (Cooperativa)',
          descripcion:
            'Poder notarial o personería estatutaria del Presidente y Secretario del Consejo de Administración con facultades suficientes.'
        }
      ];
    case 'S.A.S.':
      return [
        {
          ...baseActa,
          titulo: 'Instrumento Constitutivo digital inscripto (S.A.S.)',
          descripcion:
            'Instrumento de constitución digital con validación de firma e inscripción definitiva ante el Registro Público competente.'
        },
        {
          ...baseAutoriz,
          titulo: 'Designación y Autorización de Administrador Titular (S.A.S.)',
          descripcion:
            'Constancia notarial de designación vigente del Administrador Titular o Suplente y resolución de autorización para la gestión.'
        },
        {
          ...basePoder,
          titulo: 'Poder Notarial del Administrador (S.A.S.)',
          descripcion: 'Poder notarial otorgado por el Administrador Titular de la S.A.S.'
        }
      ];
    case 'Fideicomiso':
      return [
        {
          ...baseActa,
          titulo: 'Contrato de Fideicomiso inscripto',
          descripcion:
            'Copia notarialmente certificada del Contrato de Fideicomiso con facultades de administración fiduciaria sobre el predio.'
        },
        {
          ...baseAutoriz,
          titulo: 'Acreditación y Consentimiento del Fiduciario',
          descripcion:
            'Acreditación notarial de la condición de Fiduciario vigente y declaración formal de afectación del inmueble a la actividad aeronáutica.'
        },
        {
          ...basePoder,
          titulo: 'Poder Notarial conferido por el Fiduciario',
          descripcion:
            'Poder de representación legal otorgado por el Fiduciario para la tramitación del expediente.'
        }
      ];
    case 'Asociación Civil / Aeroclub':
      return [
        {
          ...baseActa,
          organismo_dependencia: 'Dirección Provincial de Personas Jurídicas / IGJ',
          titulo: 'Estatuto de la Asociación Civil / Aeroclub',
          descripcion:
            'Estatuto social certificado con personería jurídica vigente otorgada por la autoridad de contralor correspondiente.'
        },
        {
          ...baseAutoriz,
          organismo_dependencia: 'Comisión Directiva',
          titulo: 'Acta de Comisión Directiva y Autorización de Trámite',
          descripcion:
            'Acta de asamblea de renovación de autoridades y reunión de Comisión Directiva aprobando la afectación o gestión ante la ANAC.'
        },
        {
          ...basePoder,
          titulo: 'Poder Notarial de la Comisión Directiva',
          descripcion:
            'Poder especial o acreditación de mandato del Presidente de la Comisión Directiva.'
        }
      ];
    case 'Sociedad de Hecho / Consorcio':
      return [
        {
          ...baseActa,
          titulo: 'Contrato Asociativo / Consorcio / Acreditación Societaria',
          descripcion:
            'Instrumento de conformación o contrato de consorcio con constancia de CUIT y acreditación de todos los socios integrantes.'
        },
        {
          ...baseAutoriz,
          titulo: 'Acuerdo Unánime o Mayoritario de Socios',
          descripcion:
            'Consentimiento firmado por todos los socios del consorcio autorizando la afectación y gestión aeronáutica.'
        },
        {
          ...basePoder,
          titulo: 'Poder Mancomunado o Especial de Socios',
          descripcion:
            'Poder notarial conferido por todos los socios o condóminos con facultades específicas para el trámite.'
        }
      ];
    default:
      return [
        {
          ...baseActa,
          titulo: `Instrumento Constitutivo inscripto (${sociedadType})`,
          descripcion:
            'Contrato, estatuto o instrumento constitutivo inscripto acreditando la personería jurídica de la entidad.'
        },
        {
          ...baseAutoriz,
          titulo: `Autorización del Órgano de Administración (${sociedadType})`,
          descripcion:
            'Acta formal de designación de autoridades vigentes y autorización expresa para el trámite.'
        },
        {
          ...basePoder,
          titulo: `Poder Notarial de Representación Legal (${sociedadType})`,
          descripcion:
            'Poder notarial con facultades de representación legal suficientes ante la autoridad aeronáutica.'
        }
      ];
  }
}

/**
 * Genera la documentación oficial según la categoría del expediente, personería y condiciones.
 * Se presenta en modalidad checklist: cada ítem tiene estado Pendiente o Presentado (completed).
 */
export function generateCanonicalDocumentation(
  options?: CanonicalDocsFilterOptions
): DocumentItemModel[] {
  const category = options?.category || 'Pistas';
  const ownershipType = options?.ownershipType || 'Razon Social';
  const sociedadType = options?.sociedadType;
  const isFrontier = Boolean(options?.isFrontierZone);
  const isAgroEventual =
    Boolean(options?.isAgroEventual) ||
    options?.pistaSubtype === 'aerodromo privado para uso agroaereo';

  const docMap = new Map<string, CanonicalDocDefinition>(
    CANONICAL_DOCUMENTS_LIST.map(doc => [doc.id, doc])
  );

  const selectedList: CanonicalDocDefinition[] = [];

  // CASO 1: GESTORÍA
  if (category === 'Gestoria') {
    selectedList.push(
      docMap.get('GEST-DOM')!,
      docMap.get('GEST-TRANSF')!,
      docMap.get('GEST-MATRIC')!,
      docMap.get('GEST-TRANSF-DOM')!
    );

    // Documentos según titularidad
    if (ownershipType === 'Razon Social') {
      selectedList.push(
        ...getCorporateDocuments(
          sociedadType,
          docMap.get('ESC-ACTA-CONST')!,
          docMap.get('ESC-AUTORIZ-DIR')!,
          docMap.get('ESC-PODER')!
        )
      );
    } else if (ownershipType === 'Titulares Varios') {
      selectedList.push(docMap.get('ESC-CONDOM')!, docMap.get('ESC-DNI-TITULARES')!);
    } else {
      selectedList.push(docMap.get('ESC-DNI-TITULARES')!);
    }
  }

  // CASO 2: ALQUILER DE AERONAVE
  else if (category === 'Alquiler de Aeronave') {
    selectedList.push(
      docMap.get('ALQ-CONTRATO')!,
      docMap.get('ALQ-POLIZA')!,
      docMap.get('ALQ-CERT-AERO')!,
      docMap.get('ALQ-TRIPULACION')!
    );

    // Solo si se especificó personería expresamente en opciones (alquiler típicamente no requiere personería de pista)
    if (options?.ownershipType === 'Razon Social') {
      selectedList.push(
        ...getCorporateDocuments(
          sociedadType,
          docMap.get('ESC-ACTA-CONST')!,
          docMap.get('ESC-AUTORIZ-DIR')!,
          docMap.get('ESC-PODER')!
        )
      );
    } else if (options?.ownershipType === 'Titulares Varios') {
      selectedList.push(docMap.get('ESC-CONDOM')!, docMap.get('ESC-DNI-TITULARES')!);
    } else if (options?.ownershipType === 'Titular Unico') {
      selectedList.push(docMap.get('ESC-DNI-TITULARES')!);
    }
  }

  // CASO 3: CAMPO EVENTUAL (RAAC 137) - ÚNICOS DOCUMENTOS NECESARIOS PARA DENUNCIARLO
  else if (isAgroEventual) {
    selectedList.push(
      docMap.get('AGRO-FORM-DENUNCIA')!,
      docMap.get('AGRO-AUTORIZ-PREDIO')!,
      docMap.get('AGRO-CROQUIS-COORD')!,
      docMap.get('AMB-USO-SUELO')!
    );

    // Personería aplicable
    if (ownershipType === 'Razon Social') {
      selectedList.push(
        ...getCorporateDocuments(
          sociedadType,
          docMap.get('ESC-ACTA-CONST')!,
          docMap.get('ESC-AUTORIZ-DIR')!,
          docMap.get('ESC-PODER')!
        )
      );
    } else if (ownershipType === 'Titulares Varios') {
      selectedList.push(docMap.get('ESC-CONDOM')!, docMap.get('ESC-DNI-TITULARES')!);
    } else {
      selectedList.push(docMap.get('ESC-DNI-TITULARES')!);
    }
  }

  // CASO 4: PISTAS (LAD, LADH, Aeródromos y Helipuertos Privados/Públicos)
  else {
    // 1. ANAC (Formulario unificado incluye denominación, responsable, contacto y datos técnicos)
    selectedList.push(
      docMap.get('ANAC-NOTA')!,
      docMap.get('ANAC-FORM')!,
      docMap.get('ANAC-TAS')!,
      docMap.get('ANAC-REG-MOV')!
    );

    // 2. Escribanía - Dominio y Plano
    selectedList.push(docMap.get('ESC-DOM')!, docMap.get('ESC-PLANO')!);

    // 2.1 Escribanía - Según Personería Jurídica
    if (ownershipType === 'Razon Social') {
      selectedList.push(
        ...getCorporateDocuments(
          sociedadType,
          docMap.get('ESC-ACTA-CONST')!,
          docMap.get('ESC-AUTORIZ-DIR')!,
          docMap.get('ESC-PODER')!
        )
      );
    } else if (ownershipType === 'Titulares Varios') {
      selectedList.push(docMap.get('ESC-CONDOM')!, docMap.get('ESC-DNI-TITULARES')!);
    } else {
      selectedList.push(docMap.get('ESC-DNI-TITULARES')!);
    }

    // 3. Aspecto Ambiental: DJA + Uso Conforme del Suelo
    selectedList.push(docMap.get('AMB-DJA')!, docMap.get('AMB-USO-SUELO')!);

    // 4. Defensa (Zona de Frontera)
    if (isFrontier) {
      selectedList.push(docMap.get('FRONT-LEY')!);
    }
  }

  // Mapear a modelos de documento en modalidad checklist
  return selectedList.map(def => ({
    id: def.id,
    categoria: def.categoria,
    organismo: def.organismo,
    organismo_dependencia: def.organismo_dependencia,
    titulo: def.titulo,
    descripcion: def.descripcion,
    estado: 'Pendiente',
    completed: false,

    // Compatibilidad y UI
    code: def.id,
    category: def.organismo,
    title: def.titulo,
    description: def.descripcion,
    status: 'PENDING',
    isMandatory: def.categoria === 'Obligatorio',
    notes: '',
    observaciones: ''
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
