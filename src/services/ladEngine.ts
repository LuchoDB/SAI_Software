import { AircraftDesign, LadStudy } from '../types/lad';

export interface LadCalculationParams {
  clientId: string;
  studyName: string;
  aircraft: AircraftDesign;
  runwayQfu: string;
  elevationMsl: number;
  referenceTemperatureC: number;
  longitudinalSlopePercent: number;
  terrainLengthAvailableM: number;
  terrainWidthAvailableM: number;
  notes?: string;
}

/**
 * Calcula la longitud corregida de pista y márgenes según ANAC RAAC Parte 153
 */
export function calculateLadStudy(params: LadCalculationParams): LadStudy {
  const {
    clientId,
    studyName,
    aircraft,
    runwayQfu,
    elevationMsl,
    referenceTemperatureC,
    longitudinalSlopePercent,
    terrainLengthAvailableM,
    terrainWidthAvailableM,
    notes
  } = params;

  const basicLength = aircraft.referenceFieldLengthM;

  // 1. Corrección por elevación (+7% cada 300m s.n.m.)
  const elevationFactor = 1 + (0.07 * (elevationMsl / 300));
  const elevationCorrection = Math.max(0, basicLength * (elevationFactor - 1));
  const l1 = basicLength + elevationCorrection;

  // 2. Corrección por temperatura (+1% cada 1°C sobre atmósfera estándar ISA)
  // T_ISA = 15 - 0.0065 * h
  const isaTemp = 15 - (0.0065 * elevationMsl);
  const deltaTemp = Math.max(0, referenceTemperatureC - isaTemp);
  const tempCorrection = l1 * (0.01 * deltaTemp);
  const l2 = l1 + tempCorrection;

  // 3. Corrección por pendiente longitudinal (+10% cada 1% de pendiente efectiva ascendente)
  const slopeCorrection = l2 * (0.10 * Math.max(0, longitudinalSlopePercent));
  const correctedLength = Math.ceil(l2 + slopeCorrection);

  // Ancho reglamentario de pista según clave de referencia
  let runwayWidth = 18;
  if (aircraft.categoryCode.includes('2') || aircraft.wingspanM >= 15) {
    runwayWidth = 23;
  }
  if (aircraft.categoryCode.includes('3')) {
    runwayWidth = 30;
  }

  // Franja de pista (Strip) según RAAC 153:
  // Se extiende al menos 60m antes y después de los extremos de pista
  const stripLength = correctedLength + 120;
  // Ancho de franja: 60m para clave 1/2 VFR
  const stripWidth = runwayWidth >= 23 ? 80 : 60;

  // RESA (Runway End Safety Area)
  const resaLength = 60;
  const resaWidth = Math.max(30, runwayWidth * 2);

  // Comprobación de factibilidad
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
      `Margen longitudinal ajustado: Margen remanente menor a 50m respecto a la franja de seguridad.`
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
    feasibilityNotes.push(
      `Elevación de ${elevationMsl}m introduce un incremento de longitud del ${Math.round((elevationFactor - 1) * 100)}% sobre el campo básico.`
    );
  }

  if (overallFeasibility === 'FEASIBLE') {
    feasibilityNotes.push(
      `Cumple plenamente con las longitudes de carrera de despegue y aterrizaje corregidas según RAAC 153 para ${aircraft.manufacturer} ${aircraft.model}.`
    );
  }

  return {
    id: `lad-study-${Date.now()}`,
    clientId,
    studyName,
    aircraft,
    runwayQfu,
    elevationMsl,
    referenceTemperatureC,
    longitudinalSlopePercent,
    terrainLengthAvailableM,
    terrainWidthAvailableM,
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
    feasibilityNotes,
    createdAt: new Date().toISOString().split('T')[0],
    notes
  };
}
