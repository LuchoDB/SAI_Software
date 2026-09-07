import { HelicopterDesign, LadhType } from '../types/ladh';

/**
 * Dimensiones reglamentarias de TLOF (Área de toma de contacto) según RAAC 154
 * Monomotor en superficie: 0.83D
 * Bimotor, Clase 1, Elevado u Hospitalario: 1.0D
 */
export function calculateTlofDimension(
  dValueM: number,
  helipadType: LadhType,
  performanceClass: number
): number {
  const isElevatedOrMulti =
    helipadType === 'ELEVATED' || helipadType === 'HOSPITAL' || performanceClass === 1;
  const factor = isElevatedOrMulti ? 1.0 : 0.83;
  return Math.round(factor * dValueM * 10) / 10;
}

/**
 * Dimensiones reglamentarias de FATO (Área de aproximación final y despegue) según RAAC 154
 * Superficie: 1.5D
 * Elevado / Hospitalario: 1.2D
 */
export function calculateFatoDimension(dValueM: number, helipadType: LadhType): number {
  const factor = helipadType === 'SURFACE' ? 1.5 : 1.2;
  return Math.round(factor * dValueM * 10) / 10;
}

/**
 * Margen del Área de Seguridad perimetral: al menos 0.25D o 3 metros (lo que sea mayor)
 */
export function calculateSafetyAreaMargin(dValueM: number): number {
  return Math.round(Math.max(0.25 * dValueM, 3.0) * 10) / 10;
}

/**
 * Dimensión total requerida con Área de Seguridad perimetral (FATO + 2 * Margen)
 */
export function calculateTotalDimensionWithSafety(
  fatoDimensionM: number,
  safetyMarginM: number
): number {
  return Math.round((fatoDimensionM + 2 * safetyMarginM) * 10) / 10;
}

/**
 * Carga estructural de diseño: 1.5 veces el MTOW según RAAC 154
 */
export function calculateDynamicStructuralLoad(mtowKg: number): number {
  return Math.round(mtowKg * 1.5);
}

export interface PureHelipadCalculationResult {
  dValueM: number;
  rdValueM: number;
  tlofDimensionRequiredM: number;
  fatoDimensionRequiredM: number;
  safetyAreaMarginM: number;
  totalAreaWithSafetyRequiredM: number;
  dynamicLoadDesignKg: number;
  isGeometryFeasible: boolean;
  isLoadFeasible: boolean;
  isApproachFeasible: boolean;
  overallFeasibility: 'FEASIBLE' | 'CONDITIONED' | 'NOT_FEASIBLE';
  feasibilityNotes: string[];
}

/**
 * Función pura que calcula todas las dimensiones y viabilidad de un helipuerto LADH
 */
export function computeHelipadFeasibility(
  helicopter: HelicopterDesign,
  helipadType: LadhType,
  availableLengthM: number,
  availableWidthM: number,
  availableLoadBearingKg: number,
  approachSectorsCount: number = 2,
  approachSlopePercent: number = 8.0
): PureHelipadCalculationResult {
  const d = helicopter.overallLengthD;
  const rd = helicopter.rotorDiameterRD;

  const tlofDimension = calculateTlofDimension(d, helipadType, helicopter.performanceClass);
  const fatoDimension = calculateFatoDimension(d, helipadType);
  const safetyMargin = calculateSafetyAreaMargin(d);
  const totalDimensionWithSafety = calculateTotalDimensionWithSafety(fatoDimension, safetyMargin);
  const dynamicLoadDesignKg = calculateDynamicStructuralLoad(helicopter.mtowKg);

  const isGeometryFeasible =
    availableLengthM >= totalDimensionWithSafety && availableWidthM >= totalDimensionWithSafety;

  const isLoadFeasible = availableLoadBearingKg >= dynamicLoadDesignKg;
  const isApproachFeasible = approachSectorsCount >= 2 && approachSlopePercent <= 8.0;

  const feasibilityNotes: string[] = [];
  let overallFeasibility: 'FEASIBLE' | 'CONDITIONED' | 'NOT_FEASIBLE' = 'FEASIBLE';

  if (!isGeometryFeasible) {
    overallFeasibility = 'NOT_FEASIBLE';
    feasibilityNotes.push(
      `Espacio físico insuficiente: Se requiere un área total de ${totalDimensionWithSafety}m x ${totalDimensionWithSafety}m (FATO ${fatoDimension}m + Seguridad ${safetyMargin}m) y se dispone de ${availableLengthM}m x ${availableWidthM}m.`
    );
  } else if (availableLengthM < totalDimensionWithSafety + 3) {
    overallFeasibility = 'CONDITIONED';
    feasibilityNotes.push(
      'Margen perimetral ajustado: Se encuentra dentro de los 3 metros del límite reglamentario de seguridad.'
    );
  }

  if (!isLoadFeasible) {
    overallFeasibility = 'NOT_FEASIBLE';
    feasibilityNotes.push(
      `Capacidad portante insuficiente: La carga dinámica de impacto requerida es ${dynamicLoadDesignKg} kg (1.5 x MTOW ${helicopter.mtowKg} kg) y la estructura soporta ${availableLoadBearingKg} kg.`
    );
  }

  if (approachSectorsCount < 2) {
    if (overallFeasibility !== 'NOT_FEASIBLE') overallFeasibility = 'CONDITIONED';
    feasibilityNotes.push(
      'Se cuenta con una sola trayectoria de aproximación. RAAC 154 exige preferentemente al menos 2 trayectorias separadas por 150° para operaciones con viento favorable.'
    );
  }

  if (overallFeasibility === 'FEASIBLE') {
    feasibilityNotes.push(
      `Dimensiones de FATO (1.5D = ${fatoDimension}m), TLOF (${tlofDimension}m), área de seguridad y resistencia estructural cumplen plenamente la RAAC Parte 154 para ${helicopter.manufacturer} ${helicopter.model}.`
    );
  }

  return {
    dValueM: d,
    rdValueM: rd,
    tlofDimensionRequiredM: tlofDimension,
    fatoDimensionRequiredM: fatoDimension,
    safetyAreaMarginM: safetyMargin,
    totalAreaWithSafetyRequiredM: totalDimensionWithSafety,
    dynamicLoadDesignKg,
    isGeometryFeasible,
    isLoadFeasible,
    isApproachFeasible,
    overallFeasibility,
    feasibilityNotes
  };
}
