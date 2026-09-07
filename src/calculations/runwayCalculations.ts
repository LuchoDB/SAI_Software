import { AircraftDesign } from '../types/lad';

/**
 * Calcula la temperatura ISA para una elevación dada (gradiente estándar -6.5°C cada 1000m)
 */
export function calculateIsaTemperature(elevationMsl: number): number {
  return 15 - 0.0065 * Math.max(0, elevationMsl);
}

/**
 * Corrección de longitud de pista por elevación MSL según RAAC 153 (+7% cada 300m)
 */
export function calculateElevationCorrection(basicLengthM: number, elevationMsl: number): number {
  if (elevationMsl <= 0) return 0;
  const elevationFactor = 1 + 0.07 * (elevationMsl / 300);
  return basicLengthM * (elevationFactor - 1);
}

/**
 * Corrección de longitud de pista por temperatura según RAAC 153 (+1% cada 1°C sobre atmósfera estándar ISA)
 * Se aplica sobre la longitud ya corregida por elevación (l1)
 */
export function calculateTemperatureCorrection(
  l1: number,
  elevationMsl: number,
  referenceTemperatureC: number
): number {
  const isaTemp = calculateIsaTemperature(elevationMsl);
  const deltaTemp = Math.max(0, referenceTemperatureC - isaTemp);
  return l1 * (0.01 * deltaTemp);
}

/**
 * Corrección de longitud de pista por pendiente longitudinal ascendente según RAAC 153 (+10% cada 1% de pendiente efectiva)
 * Se aplica sobre la longitud corregida por elevación y temperatura (l2)
 */
export function calculateSlopeCorrection(l2: number, longitudinalSlopePercent: number): number {
  const effectiveSlope = Math.max(0, longitudinalSlopePercent);
  return l2 * (0.1 * effectiveSlope);
}

/**
 * Determina el ancho reglamentario de pista según envergadura y clave de referencia (RAAC 153)
 */
export function calculateRunwayWidth(categoryCode: string, wingspanM: number): number {
  if (categoryCode.includes('3')) return 30;
  if (categoryCode.includes('2') || wingspanM >= 15) return 23;
  return 18;
}

/**
 * Dimensiones de la Franja de Pista (Strip):
 * Longitud: Longitud corregida + 120m (60m en cada extremo)
 * Ancho: 60m (pistas clave 1) u 80m (pistas clave 2+)
 */
export function calculateStripDimensions(
  correctedLengthM: number,
  runwayWidthM: number
): { stripLength: number; stripWidth: number } {
  const stripLength = correctedLengthM + 120;
  const stripWidth = runwayWidthM >= 23 ? 80 : 60;
  return { stripLength, stripWidth };
}

/**
 * Dimensiones de la RESA (Runway End Safety Area):
 * Longitud: 60m mínimo
 * Ancho: al menos el doble del ancho de pista (mínimo 30m)
 */
export function calculateResaDimensions(runwayWidthM: number): {
  resaLength: number;
  resaWidth: number;
} {
  return {
    resaLength: 60,
    resaWidth: Math.max(30, runwayWidthM * 2)
  };
}

export interface PureRunwayCalculationResult {
  basicLengthM: number;
  elevationCorrectionM: number;
  tempCorrectionM: number;
  slopeCorrectionM: number;
  correctedRunwayLengthRequiredM: number;
  runwayWidthRequiredM: number;
  stripLengthRequiredM: number;
  stripWidthRequiredM: number;
  resaLengthM: number;
  resaWidthM: number;
  isLengthFeasible: boolean;
  isWidthFeasible: boolean;
  overallFeasibility: 'FEASIBLE' | 'CONDITIONED' | 'NOT_FEASIBLE';
  feasibilityNotes: string[];
}

/**
 * Función pura que calcula todas las dimensiones y viabilidad de una pista LAD
 */
export function computeRunwayFeasibility(
  aircraft: AircraftDesign,
  elevationMsl: number,
  referenceTemperatureC: number,
  longitudinalSlopePercent: number,
  terrainLengthAvailableM: number,
  terrainWidthAvailableM: number
): PureRunwayCalculationResult {
  const basicLength = aircraft.referenceFieldLengthM;

  // 1. Elevación
  const elevationCorrection = calculateElevationCorrection(basicLength, elevationMsl);
  const l1 = basicLength + elevationCorrection;

  // 2. Temperatura
  const tempCorrection = calculateTemperatureCorrection(l1, elevationMsl, referenceTemperatureC);
  const l2 = l1 + tempCorrection;

  // 3. Pendiente
  const slopeCorrection = calculateSlopeCorrection(l2, longitudinalSlopePercent);
  const correctedLength = Math.ceil(l2 + slopeCorrection);

  // 4. Geometría
  const runwayWidth = calculateRunwayWidth(aircraft.categoryCode, aircraft.wingspanM);
  const { stripLength, stripWidth } = calculateStripDimensions(correctedLength, runwayWidth);
  const { resaLength, resaWidth } = calculateResaDimensions(runwayWidth);

  // 5. Viabilidad
  const isLengthFeasible = terrainLengthAvailableM >= stripLength;
  const isWidthFeasible = terrainWidthAvailableM >= stripWidth;

  const feasibilityNotes: string[] = [];
  let overallFeasibility: 'FEASIBLE' | 'CONDITIONED' | 'NOT_FEASIBLE' = 'FEASIBLE';

  if (!isLengthFeasible) {
    overallFeasibility = 'NOT_FEASIBLE';
    feasibilityNotes.push(
      `Longitud de predio insuficiente: Se requieren ${stripLength}m (pista ${correctedLength}m + franjas) y se dispone de ${terrainLengthAvailableM}m.`
    );
  } else if (terrainLengthAvailableM < stripLength + 50) {
    overallFeasibility = 'CONDITIONED';
    feasibilityNotes.push(
      'Margen longitudinal ajustado: Margen remanente menor a 50m respecto a la franja de seguridad.'
    );
  }

  if (!isWidthFeasible) {
    overallFeasibility = 'NOT_FEASIBLE';
    feasibilityNotes.push(
      `Ancho de predio insuficiente: Se requieren ${stripWidth}m para la franja despejada y se dispone de ${terrainWidthAvailableM}m.`
    );
  }

  if (longitudinalSlopePercent > 2.0) {
    if (overallFeasibility !== 'NOT_FEASIBLE') overallFeasibility = 'CONDITIONED';
    feasibilityNotes.push(
      `Pendiente longitudinal de ${longitudinalSlopePercent}% supera el 2.0% recomendado por RAAC 153. Se requiere nivelación topográfica.`
    );
  }

  if (elevationMsl > 500) {
    const elevationPercentage = Math.round((elevationCorrection / basicLength) * 100);
    feasibilityNotes.push(
      `Elevación de ${elevationMsl}m introduce un incremento de longitud del ${elevationPercentage}% sobre el campo básico.`
    );
  }

  if (overallFeasibility === 'FEASIBLE') {
    feasibilityNotes.push(
      `Cumple plenamente con las longitudes de carrera de despegue y aterrizaje corregidas según RAAC 153 para ${aircraft.manufacturer} ${aircraft.model}.`
    );
  }

  return {
    basicLengthM: basicLength,
    elevationCorrectionM: Math.round(elevationCorrection),
    tempCorrectionM: Math.round(tempCorrection),
    slopeCorrectionM: Math.round(slopeCorrection),
    correctedRunwayLengthRequiredM: correctedLength,
    runwayWidthRequiredM: runwayWidth,
    stripLengthRequiredM: stripLength,
    stripWidthRequiredM: stripWidth,
    resaLengthM: resaLength,
    resaWidthM: resaWidth,
    isLengthFeasible,
    isWidthFeasible,
    overallFeasibility,
    feasibilityNotes
  };
}
