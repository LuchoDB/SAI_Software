import { Client } from '../types/client';
import { WindStudyResult } from '../types/wind';
import { LadStudy } from '../types/lad';
import { LadhStudy } from '../types/ladh';
import { generateInitialChecklist } from './regulatoryRequirements';
import { AIRCRAFT_DATABASE } from './aircraftDatabase';
import { HELICOPTER_DATABASE } from './helicopterDatabase';
import {
  getDefaultArgentineWindDistribution,
  calculateRunwayOrientation,
  calculateOACIUsability
} from '../services/windEngine';

// Generador de datos iniciales representativos de clientes de SAI Consult
export function getSampleClients(): {
  clients: Client[];
  windStudies: WindStudyResult[];
  ladStudies: LadStudy[];
  ladhStudies: LadhStudy[];
} {
  const docsClient1 = generateInitialChecklist();
  // Personalizar estados para el cliente 1
  docsClient1[0].status = 'APPROVED';
  docsClient1[0].submittedDate = '2026-06-15';
  docsClient1[0].approvalDate = '2026-07-10';
  docsClient1[0].notes = 'Aprobado formalmente por Mesa de Entradas ANAC.';

  docsClient1[1].status = 'APPROVED';
  docsClient1[1].submittedDate = '2026-06-18';
  docsClient1[1].approvalDate = '2026-07-20';

  docsClient1[2].status = 'IN_PROGRESS';
  docsClient1[2].submittedDate = '2026-07-02';
  docsClient1[2].notes = 'En revisión de curvas de nivel y cerco olímpico.';

  docsClient1[3].status = 'IN_PROGRESS';
  docsClient1[4].status = 'APPROVED';
  docsClient1[4].notes = 'Estudio de vientos concluido con 96.8% de factor de utilización OACI.';

  docsClient1[8].status = 'APPROVED'; // ENACOM No afectación
  docsClient1[11].status = 'APPROVED'; // Título de Propiedad
  docsClient1[12].status = 'APPROVED'; // Plano de Mensura

  const client1: Client = {
    id: 'cli-agro-salado',
    name: 'AgroAérea del Salado S.A.',
    cuit: '30-71458923-8',
    contactPerson: 'Ing. Agr. Martín Echeverría',
    email: 'operaciones@agrosalado.com.ar',
    phone: '+54 9 2241 55-4890',
    projectType: 'LAD',
    locationName: 'Establecimiento La Primavera, Chascomús',
    province: 'Buenos Aires',
    coordinates: {
      lat: -35.5786,
      lng: -58.0124,
      formatted: '35°34\'43" S, 58°00\'44" W'
    },
    elevationMsl: 24,
    referenceTemperatureC: 31.5,
    terrainLengthAvailableM: 1100,
    terrainWidthAvailableM: 120,
    notes:
      'Pista de tierra compactada con siembra de césped de alta densidad. Operaciones agrícolas diurnas VFR y traslado ejecutivo Cessna 182 / Piper Pawnee.',
    documents: docsClient1,
    createdAt: '2026-06-10',
    updatedAt: '2026-08-20'
  };

  // Estudio de viento para Cliente 1
  const windDefaults = getDefaultArgentineWindDistribution();
  const orientation1 = calculateRunwayOrientation(45, -8.2); // TH 045°, Decl -8.2° W -> MH 053° -> QFU 05/23
  const usability1 = calculateOACIUsability(
    orientation1,
    windDefaults.distribution,
    windDefaults.calmsPercent,
    10
  );

  const windStudy1: WindStudyResult = {
    id: 'ws-agro-01',
    clientId: client1.id,
    studyName: 'Estudio de Vientos y Rosa QFU 05/23 - La Primavera',
    orientation: orientation1,
    admissibleCrosswindKt: 10,
    usabilityPercent: usability1.usabilityPercent,
    isCompliantOACI: usability1.isCompliantOACI,
    calmsPercent: windDefaults.calmsPercent,
    windDistribution: windDefaults.distribution,
    createdAt: '2026-07-15',
    notes:
      'Orientación de pista 05/23 alineada con el Pampero (SW) y vientos cálidos del ENE. Coeficiente supera el 95% reglamentario.'
  };

  // Estudio LAD para Cliente 1
  const pawnee = AIRCRAFT_DATABASE.find(a => a.id === 'pa25') || AIRCRAFT_DATABASE[0];
  const ladStudy1: LadStudy = {
    id: 'lad-agro-01',
    clientId: client1.id,
    studyName: 'Factibilidad Técnica Pista LAD - Piper Pawnee PA-25',
    aircraft: pawnee,
    runwayQfu: orientation1.qfuLabel,
    elevationMsl: 24,
    referenceTemperatureC: 31.5,
    longitudinalSlopePercent: 0.4,
    terrainLengthAvailableM: 1100,
    terrainWidthAvailableM: 120,
    basicLengthM: pawnee.referenceFieldLengthM,
    elevationCorrectionM: 2,
    tempCorrectionM: 71,
    slopeCorrectionM: 20,
    correctedRunwayLengthRequiredM: 513,
    runwayWidthRequiredM: 18,
    stripLengthRequiredM: 633,
    stripWidthRequiredM: 60,
    resaLengthM: 60,
    resaWidthM: 36,
    isLengthFeasible: true,
    isWidthFeasible: true,
    overallFeasibility: 'FEASIBLE',
    feasibilityNotes: [
      'Terreno disponible de 1100m excede ampliamente los 633m requeridos de franja.',
      'Pendiente de 0.4% perfectamente nivelada con escurrimiento natural.',
      'Apta para operaciones agrícolas con tolva llena y despegue seguro.'
    ],
    createdAt: '2026-07-20',
    notes: 'Proyecto con viabilidad técnica 100% aprobada en memoria de cálculo.'
  };

  // Cliente 2: Helipuerto Hospitalario LADH
  const docsClient2 = generateInitialChecklist();
  docsClient2[0].status = 'IN_PROGRESS';
  docsClient2[1].status = 'APPROVED';
  docsClient2[8].status = 'APPROVED'; // ENACOM No afectación aprobado
  docsClient2[11].status = 'APPROVED'; // Dominio sanatorio

  const client2: Client = {
    id: 'cli-sanatorio-norte',
    name: 'Sanatorio Metropolitano Norte',
    cuit: '33-65239014-9',
    contactPerson: 'Dr. Guillermo Valenzuela (Director Médico)',
    email: 'direccion@sanatorionorte.com.ar',
    phone: '+54 11 4790-2200',
    projectType: 'LADH',
    locationName: 'Torre Asistencial - Av. del Libertador, Olivos',
    province: 'Buenos Aires',
    coordinates: {
      lat: -34.5123,
      lng: -58.4891,
      formatted: '34°30\'44" S, 58°29\'21" W'
    },
    elevationMsl: 38,
    referenceTemperatureC: 33.0,
    terrainLengthAvailableM: 32,
    terrainWidthAvailableM: 32,
    notes:
      'Helipuerto elevado sobre cubierta de edificio para traslados de alta complejidad y ablación de órganos. Helicóptero de diseño Bell 429 GlobalRanger bimotor.',
    documents: docsClient2,
    createdAt: '2026-07-01',
    updatedAt: '2026-08-25'
  };

  const bell429 = HELICOPTER_DATABASE.find(h => h.id === 'b429') || HELICOPTER_DATABASE[0];
  const ladhStudy2: LadhStudy = {
    id: 'ladh-sana-01',
    clientId: client2.id,
    studyName: 'Factibilidad Helipuerto Elevado Hospitalario - Bell 429',
    helipadType: 'HOSPITAL',
    helicopter: bell429,
    availableLengthM: 32,
    availableWidthM: 32,
    availableLoadBearingKg: 6500,
    dValueM: 13.0,
    rdValueM: 10.97,
    tlofDimensionRequiredM: 13.0,
    fatoDimensionRequiredM: 15.6,
    safetyAreaMarginM: 3.3,
    totalAreaWithSafetyRequiredM: 22.2,
    dynamicLoadDesignKg: 5103,
    approachSectorsCount: 2,
    approachAngleDeg: 150,
    approachSlopePercent: 8.0,
    isGeometryFeasible: true,
    isLoadFeasible: true,
    isApproachFeasible: true,
    overallFeasibility: 'FEASIBLE',
    feasibilityNotes: [
      'Azotea con 32m x 32m alberga con solvencia los 22.2m requeridos para FATO + Área de Seguridad.',
      'Carga admisible estructural de 6500 kg supera la carga dinámica de impacto requerida de 5103 kg (1.5x MTOW).',
      'Posee dos sectores de aproximación libres de obstáculos hacia el Río de la Plata y corredor vial.'
    ],
    createdAt: '2026-08-10',
    notes: 'Helipuerto de alta prioridad sanitaria con cumplimiento de RAAC 154.'
  };

  return {
    clients: [client1, client2],
    windStudies: [windStudy1],
    ladStudies: [ladStudy1],
    ladhStudies: [ladhStudy2]
  };
}
