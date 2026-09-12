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

export interface ThresholdsCalculationResult {
  distanceMeters: number;
  trueHeading1to2: number;
  trueHeading2to1: number;
  magneticHeading1to2: number;
  magneticHeading2to1: number;
  qfuPrimary: string;
  qfuSecondary: string;
  qfuLabel: string;
  magneticOrientationString: string;
  midpoint: {
    lat: number;
    lng: number;
  };
}

/**
 * Convierte grados sexagesimales a radianes
 */
export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convierte radianes a grados sexagesimales
 */
export function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Calcula el rumbo geográfico verdadero (azimut geodésico inicial) entre dos coordenadas WGS-84
 * @returns Rumbo verdadero en grados [0, 360)
 */
export function calculateBearingBetweenCoordinates(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  if (lat1 === lat2 && lng1 === lng2) return 0;

  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaLambda = toRadians(lng2 - lng1);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  const theta = Math.atan2(y, x);
  const bearing = ((toDegrees(theta) % 360) + 360) % 360;

  return Math.round(bearing * 10) / 10;
}

/**
 * Calcula la distancia ortodrómica geodésica entre dos coordenadas WGS-84 en metros
 */
export function calculateDistanceBetweenCoordinates(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  if (lat1 === lat2 && lng1 === lng2) return 0;

  const R = 6371000; // Radio medio de la Tierra en metros
  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaPhi = toRadians(lat2 - lat1);
  const deltaLambda = toRadians(lng2 - lng1);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
  return Math.round(R * c);
}

/**
 * Calcula el rumbo geográfico, rumbo magnético, designador QFU y longitud de pista a partir de las coordenadas de sus umbrales
 * @param lat1 Latitud Umbral 1 (grados decimales WGS-84)
 * @param lng1 Longitud Umbral 1 (grados decimales WGS-84)
 * @param lat2 Latitud Umbral 2 (grados decimales WGS-84)
 * @param lng2 Longitud Umbral 2 (grados decimales WGS-84)
 * @param magneticDeclination Declinación magnética en grados (por defecto -8.2° W para Argentina)
 */
export function calculateRunwayFromThresholds(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  magneticDeclination: number = -8.2
): ThresholdsCalculationResult {
  const distanceMeters = calculateDistanceBetweenCoordinates(lat1, lng1, lat2, lng2);
  const trueHeading1to2 = calculateBearingBetweenCoordinates(lat1, lng1, lat2, lng2);
  const trueHeading2to1 = Math.round(((trueHeading1to2 + 180) % 360) * 10) / 10;

  // Rumbo magnético = Rumbo verdadero - declinación magnética
  // Con declinación negativa (Oeste/West): RM = RV - (-8.2) = RV + 8.2°
  const magneticHeading1to2 =
    Math.round(((((trueHeading1to2 - magneticDeclination) % 360) + 360) % 360) * 10) / 10;
  const magneticHeading2to1 =
    Math.round(((((trueHeading2to1 - magneticDeclination) % 360) + 360) % 360) * 10) / 10;

  // Designadores de cabecera QFU (redondeo a la decena más cercana)
  let qfu1Num = Math.round(magneticHeading1to2 / 10);
  if (qfu1Num === 0 || qfu1Num === 36) qfu1Num = 36;
  const qfuPrimary = qfu1Num.toString().padStart(2, '0');

  let qfu2Num = Math.round(magneticHeading2to1 / 10);
  if (qfu2Num === 0 || qfu2Num === 36) qfu2Num = 36;
  const qfuSecondary = qfu2Num.toString().padStart(2, '0');

  const qfuLabel =
    qfu1Num <= qfu2Num ? `${qfuPrimary} / ${qfuSecondary}` : `${qfuSecondary} / ${qfuPrimary}`;

  const h1 = Math.round(magneticHeading1to2).toString().padStart(3, '0');
  const h2 = Math.round(magneticHeading2to1).toString().padStart(3, '0');
  const magneticOrientationString = `${h1}° / ${h2}° (QFU ${qfuLabel})`;

  return {
    distanceMeters,
    trueHeading1to2,
    trueHeading2to1,
    magneticHeading1to2,
    magneticHeading2to1,
    qfuPrimary,
    qfuSecondary,
    qfuLabel,
    magneticOrientationString,
    midpoint: {
      lat: Math.round(((lat1 + lat2) / 2) * 1000000) / 1000000,
      lng: Math.round(((lng1 + lng2) / 2) * 1000000) / 1000000
    }
  };
}
