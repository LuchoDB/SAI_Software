import { Client } from '../types/client';
import { WindStudyResult } from '../types/wind';
import { LadStudy } from '../types/lad';
import { LadhStudy } from '../types/ladh';
import { AgentFinding, AgentState, OrchestratorVerdict } from '../types/agents';

export function getAgentInitialStates(): AgentState[] {
  return [
    {
      type: 'DESIGN',
      name: 'Agente de Diseño & Ergonomía',
      roleDescription:
        'Visualización de esquemas acotados, ergonomía de cabina y diagramas vectoriales interactivos.',
      avatarIcon: 'Palette',
      status: 'OPTIMAL',
      activeFindingsCount: 0
    },
    {
      type: 'COPYWRITING',
      name: 'Agente de Arquitectura & Copywriting',
      roleDescription:
        'Estandarización de nomenclatura aeronáutica (OACI/ANAC), glosario y redacción de dictámenes ejecutivos.',
      avatarIcon: 'FileText',
      status: 'OPTIMAL',
      activeFindingsCount: 0
    },
    {
      type: 'LEGAL',
      name: 'Agente Legal & Regulatorio',
      roleDescription:
        'Auditoría de cumplimiento RAAC 153/154, Código Aeronáutico Ley 17.285 y normativas ENACOM.',
      avatarIcon: 'Scale',
      status: 'OPTIMAL',
      activeFindingsCount: 0
    },
    {
      type: 'ORCHESTRATOR',
      name: 'Agente Orquestador Master',
      roleDescription:
        'Validación cruzada de datos técnicos, meteorológicos y jurídicos para la emisión del Dictamen SAI.',
      avatarIcon: 'Cpu',
      status: 'OPTIMAL',
      activeFindingsCount: 0
    }
  ];
}

export interface EvaluateContext {
  client: Client;
  windStudy?: WindStudyResult;
  ladStudy?: LadStudy;
  ladhStudy?: LadhStudy;
}

/**
 * Ejecuta la auditoría exhaustiva multi-agente para un cliente
 */
export function runMultiAgentAudit(context: EvaluateContext): OrchestratorVerdict {
  const { client, windStudy, ladStudy, ladhStudy } = context;
  const findings: AgentFinding[] = [];
  const criticalBlockers: string[] = [];
  const recommendations: string[] = [];

  // ==========================================
  // 1. EVALUACIÓN DEL AGENTE LEGAL & REGULATORIO
  // ==========================================
  const mandatoryDocs = client.documents.filter(
    d => d.isMandatory || d.categoria === 'Obligatorio'
  );
  const approvedDocs = client.documents.filter(
    d => d.status === 'APPROVED' || d.estado === 'Aprobado'
  );
  const inProgressDocs = client.documents.filter(
    d => d.status === 'IN_PROGRESS' || d.estado === 'En trámite'
  );
  const pendingDocs = client.documents.filter(
    d => d.status === 'PENDING' || d.estado === 'Pendiente'
  );
  const observedDocs = client.documents.filter(
    d => d.status === 'OBSERVED' || d.estado === 'Observado'
  );

  const anacDocs = client.documents.filter(
    d => d.organismo === 'ANAC' || (d as unknown as { category: string }).category === 'ANAC'
  );
  const escribaniaDocs = client.documents.filter(
    d =>
      d.organismo === 'ESCRIBANÍA' ||
      (d as unknown as { category: string }).category === 'ESCRIBANÍA'
  );
  const ambientalDocs = client.documents.filter(
    d =>
      d.organismo === 'AMBIENTAL' || (d as unknown as { category: string }).category === 'AMBIENTAL'
  );

  const isAnacOk = anacDocs.some(
    d =>
      (d.id === 'ANAC-NOTA' || d.id === 'ANAC-FORM') &&
      (d.status === 'APPROVED' ||
        d.status === 'IN_PROGRESS' ||
        d.estado === 'Aprobado' ||
        d.estado === 'En trámite')
  );
  const isEscribaniaOk = escribaniaDocs.some(
    d =>
      d.id === 'ESC-DOM' &&
      (d.status === 'APPROVED' ||
        d.status === 'IN_PROGRESS' ||
        d.estado === 'Aprobado' ||
        d.estado === 'En trámite')
  );
  const isAmbientalOk =
    ambientalDocs.length === 0 ||
    ambientalDocs.some(d => d.status !== 'PENDING' && d.estado !== 'Pendiente');

  // Observaciones legales
  if (observedDocs.length > 0) {
    findings.push({
      id: 'leg-obs',
      agent: 'LEGAL',
      severity: 'CRITICAL',
      category: 'Expediente Documental LAD/LADH',
      title: `${observedDocs.length} documento(s) con observaciones`,
      description: `Los documentos [${observedDocs.map(d => d.titulo || d.title).join(', ')}] registran observaciones que requieren subsanación urgente.`,
      actionRequired:
        'Corregir las observaciones y reenviar a la mesa de entradas del organismo correspondiente.'
    });
    criticalBlockers.push(
      'Existen documentos oficiales observados por la autoridad de aplicación.'
    );
  }

  const missingMandatory = mandatoryDocs.filter(
    d => d.status === 'PENDING' || d.estado === 'Pendiente'
  );
  if (missingMandatory.length > 0) {
    findings.push({
      id: 'leg-mand',
      agent: 'LEGAL',
      severity: missingMandatory.length > 4 ? 'WARNING' : 'INFO',
      category: 'Cumplimiento Normativo Obligatorio',
      title: `${missingMandatory.length} trámites esenciales pendientes de inicio`,
      description: `Documentación obligatoria pendiente: ${missingMandatory
        .slice(0, 3)
        .map(d => d.titulo || d.title)
        .join(', ')}${missingMandatory.length > 3 ? '...' : ''}.`,
      actionRequired: 'Completar las carpetas técnicas para su radicación ante ANAC y Escribanía.'
    });
  }

  // ==========================================
  // 2. EVALUACIÓN DEL AGENTE DE ARQUITECTURA & COPYWRITING
  // ==========================================
  if (!client.coordinates || !client.coordinates.lat || !client.coordinates.lng) {
    findings.push({
      id: 'copy-coord',
      agent: 'COPYWRITING',
      severity: 'WARNING',
      category: 'Georreferenciación WGS84',
      title: 'Coordenadas del punto de referencia de aeródromo (ARP) no cargadas',
      description:
        'El expediente carece de coordenadas geodésicas oficiales en formato estándar WGS84 requeridas para el formulario oficial ANAC (Anexo IX).',
      actionRequired: 'Ingresar Latitud y Longitud WGS84 en la ficha del cliente.'
    });
  } else {
    findings.push({
      id: 'copy-ok',
      agent: 'COPYWRITING',
      severity: 'SUCCESS',
      category: 'Nomenclatura Aeronáutica',
      title: 'Georreferenciación y designadores conformes a OACI',
      description: `Coordenadas ${client.coordinates.lat.toFixed(4)}°, ${client.coordinates.lng.toFixed(4)}° y elevación ${client.elevationMsl}m MSL correctamente formateadas.`
    });
  }

  // ==========================================
  // 3. EVALUACIÓN TÉCNICA Y DE DISEÑO (VIENTO / LAD / LADH)
  // ==========================================
  let isWindOk = true;
  let isGeometryOk = true;
  let isClearanceOk = true;

  // Evaluación de viento si existe estudio
  if (windStudy) {
    if (!windStudy.isCompliantOACI) {
      isWindOk = false;
      findings.push({
        id: 'wind-non-compliant',
        agent: 'DESIGN',
        severity: 'CRITICAL',
        category: 'Rosa de los Vientos OACI',
        title: `Factor de Usabilidad ${windStudy.usabilityPercent}% por debajo del 95% reglamentario`,
        description: `La orientación de pista ${windStudy.orientation.qfuLabel} no garantiza el 95% de operatividad para el límite de viento cruzado de ${windStudy.admissibleCrosswindKt} kt.`,
        actionRequired:
          'Evaluar reorientación angular de la pista o proyectar una segunda pista cruzada de desahogo.'
      });
      criticalBlockers.push(
        `Coeficiente de utilización de pista (${windStudy.usabilityPercent}%) insuficiente según OACI Anexo 14.`
      );
    } else {
      findings.push({
        id: 'wind-compliant',
        agent: 'DESIGN',
        severity: 'SUCCESS',
        category: 'Orientación de Pista QFU',
        title: `Orientación óptima: Usabilidad OACI ${windStudy.usabilityPercent}%`,
        description: `Pista ${windStudy.orientation.qfuLabel} orientada favorablemente respecto a los cuadrantes de vientos predominantes.`
      });
    }
  }

  // Evaluación de estudio LAD (Pistas)
  if (ladStudy) {
    if (!ladStudy.isLengthFeasible) {
      isGeometryOk = false;
      findings.push({
        id: 'lad-len-fail',
        agent: 'DESIGN',
        severity: 'CRITICAL',
        category: 'Longitud de Pista RAAC 153',
        title: 'Longitud de campo disponible insuficiente',
        description: `Se requieren ${ladStudy.stripLengthRequiredM}m de terreno y solo se disponen de ${ladStudy.terrainLengthAvailableM}m para ${ladStudy.aircraft.manufacturer} ${ladStudy.aircraft.model}.`,
        actionRequired:
          'Adquirir franja adicional o restringir la aeronave de diseño a modelos STOL de despegue corto.'
      });
      criticalBlockers.push(
        'Dimensiones físicas del terreno insuficientes para la longitud de pista requerida.'
      );
    } else if (ladStudy.overallFeasibility === 'CONDITIONED') {
      findings.push({
        id: 'lad-cond',
        agent: 'DESIGN',
        severity: 'WARNING',
        category: 'Márgenes de Seguridad Pista',
        title: 'Operatividad condicionada por topografía o márgenes',
        description: ladStudy.feasibilityNotes.join(' '),
        actionRequired: 'Realizar movimiento de suelos y nivelación de la franja de pista.'
      });
    } else {
      findings.push({
        id: 'lad-ok',
        agent: 'DESIGN',
        severity: 'SUCCESS',
        category: 'Dimensionamiento RAAC 153',
        title: 'Pista y márgenes de seguridad 100% conformes',
        description: `Largo de pista ${ladStudy.correctedRunwayLengthRequiredM}m y franja de seguridad plenamente contenidos en el predio.`
      });
    }
  }

  // Evaluación de estudio LADH (Helipuertos)
  if (ladhStudy) {
    if (!ladhStudy.isGeometryFeasible) {
      isGeometryOk = false;
      findings.push({
        id: 'ladh-geom-fail',
        agent: 'DESIGN',
        severity: 'CRITICAL',
        category: 'Dimensionamiento FATO/TLOF RAAC 154',
        title: 'Superficie de heliplataforma insuficiente',
        description: `Se requiere un área de ${ladhStudy.totalAreaWithSafetyRequiredM}m x ${ladhStudy.totalAreaWithSafetyRequiredM}m para ${ladhStudy.helicopter.manufacturer} ${ladhStudy.helicopter.model}.`,
        actionRequired:
          'Ampliar el área despejada perimetral para cumplir con 1.5D + Área de Seguridad.'
      });
      criticalBlockers.push(
        'Superficie del helipuerto no cumple con las dimensiones mínimas de FATO según RAAC 154.'
      );
    }

    if (!ladhStudy.isLoadFeasible) {
      isClearanceOk = false;
      findings.push({
        id: 'ladh-load-fail',
        agent: 'LEGAL',
        severity: 'CRITICAL',
        category: 'Resistencia Estructural MTOW',
        title: 'Capacidad portante menor a la carga dinámica de diseño',
        description: `Carga requerida de 1.5x MTOW (${ladhStudy.dynamicLoadDesignKg} kg) excede la resistencia portante declarada.`,
        actionRequired: 'Reforzar la estructura o restringir helipuerto a aeronaves de menor MTOW.'
      });
      criticalBlockers.push('Estructura no soporta la carga dinámica reglamentaria de 1.5x MTOW.');
    }
  }

  // ==========================================
  // 4. DICTAMEN DEL AGENTE ORQUESTADOR MASTER
  // ==========================================
  let globalStatus: 'FAVORABLE' | 'FAVORABLE_WITH_RESTRICTIONS' | 'NOT_FAVORABLE' = 'FAVORABLE';
  let scorePercent = 100;

  // Penalizaciones por estado legal
  const completionPercent =
    client.documents.length > 0
      ? Math.round((approvedDocs.length / client.documents.length) * 100)
      : 0;

  scorePercent -= (100 - completionPercent) * 0.3; // 30% del peso es avance documental

  if (criticalBlockers.length > 0) {
    globalStatus = 'NOT_FAVORABLE';
    scorePercent = Math.min(scorePercent, 45);
  } else if (
    (ladStudy && ladStudy.overallFeasibility === 'CONDITIONED') ||
    (ladhStudy && ladhStudy.overallFeasibility === 'CONDITIONED') ||
    completionPercent < 70
  ) {
    globalStatus = 'FAVORABLE_WITH_RESTRICTIONS';
    scorePercent = Math.min(scorePercent, 78);
  }

  scorePercent = Math.max(10, Math.round(scorePercent));

  // Generar recomendaciones del orquestador
  if (pendingDocs.length > 0) {
    recommendations.push(
      `Avanzar en la confección de los ${pendingDocs.length} documentos pendientes, priorizando los trámites ante ANAC y escrituración ante escribano.`
    );
  }
  if (escribaniaDocs.some(d => d.status === 'PENDING' || d.estado === 'Pendiente')) {
    recommendations.push(
      'Asegurar la certificación notarial del título de propiedad o contrato de locación y plano catastral/mensura.'
    );
  }
  if (!windStudy) {
    recommendations.push(
      'Efectuar el cálculo oficial de orientación magnética y viento cruzado para respaldar el expediente técnico ANAC.'
    );
  } else if (windStudy.isCompliantOACI) {
    recommendations.push(
      `Consolidar la orientación de cabecera ${windStudy.orientation.qfuLabel} para el formulario técnico oficial.`
    );
  }

  const executiveSummary =
    globalStatus === 'FAVORABLE'
      ? `El proyecto de ${client.projectType} para el cliente "${client.name}" presenta plena viabilidad técnica, aeronáutica y normativa. Cumple con los requerimientos de registro LAD/LADH ante la autoridad aeronáutica nacional (ANAC Anexo IX) y documentación legal notarial y ambiental.`
      : globalStatus === 'FAVORABLE_WITH_RESTRICTIONS'
        ? `El proyecto presenta viabilidad técnica favorable sujeta a condicionamientos operativos o finalización de trámites documentales ante ANAC/Escribanía. Se recomienda avanzar con las recomendaciones señaladas para obtener el registro definitivo.`
        : `El proyecto presenta observaciones críticas que impiden su registro bajo la configuración actual. Se identificaron no conformidades que vulneran la normativa vigente (RAAC 153/154 u OACI Anexo 14).`;

  return {
    clientId: client.id,
    clientName: client.name,
    globalStatus,
    scorePercent,
    evaluatedAt: new Date().toISOString().split('T')[0],
    executiveSummary,
    legalCompliance: {
      anac: isAnacOk,
      escribania: isEscribaniaOk,
      ambiental: isAmbientalOk
    },
    technicalFeasibility: {
      windUsability: isWindOk,
      geometryCompliant: isGeometryOk,
      clearanceCompliant: isClearanceOk
    },
    documentationProgress: {
      total: client.documents.length,
      approved: approvedDocs.length,
      inProgress: inProgressDocs.length,
      pending: pendingDocs.length,
      observed: observedDocs.length,
      completionPercent
    },
    findings,
    criticalBlockers,
    recommendations
  };
}
