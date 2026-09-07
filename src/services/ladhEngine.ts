import { HelicopterDesign, LadhStudy, LadhType } from '../types/ladh';

export interface LadhCalculationParams {
  clientId: string;
  studyName: string;
  helipadType: LadhType;
  helicopter: HelicopterDesign;
  availableLengthM: number;
  availableWidthM: number;
  availableLoadBearingKg: number;
  approachSectorsCount?: number;
  approachSlopePercent?: number;
  notes?: string;
}

/**
 * Calcula las dimensiones mínimas, áreas de seguridad y cargas de un helipuerto LADH según RAAC 154
 */
export function calculateLadhStudy(params: LadhCalculationParams): LadhStudy {
  const {
    clientId,
    studyName,
    helipadType,
    helicopter,
    availableLengthM,
    availableWidthM,
    availableLoadBearingKg,
    approachSectorsCount = 2,
    approachSlopePercent = 8.0,
    notes
  } = params;

  const d = helicopter.overallLengthD;
  const rd = helicopter.rotorDiameterRD;

  // 1. TLOF (Área de toma de contacto y elevación):
  // RAAC 154: 0.83D para superficie monomotor, 1.0D para helipuertos elevados o bimotor clase 1
  const isElevatedOrMulti = helipadType === 'ELEVATED' || helipadType === 'HOSPITAL' || helicopter.performanceClass === 1;
  const tlofFactor = isElevatedOrMulti ? 1.0 : 0.83;
  const tlofDimension = Math.round(tlofFactor * d * 10) / 10;

  // 2. FATO (Área de aproximación final y de despegue):
  // RAAC 154: 1.5D para helipuertos en superficie
  const fatoFactor = helipadType === 'SURFACE' ? 1.5 : 1.2;
  const fatoDimension = Math.round(fatoFactor * d * 10) / 10;

  // 3. Área de Seguridad perimetral (Safety Area):
  // Debe extenderse hacia afuera desde el borde de la FATO una distancia de al menos 0.25D o 3 metros (lo que sea mayor)
  const safetyMargin = Math.round(Math.max(0.25 * d, 3.0) * 10) / 10;
  const totalDimensionWithSafety = Math.round((fatoDimension + 2 * safetyMargin) * 10) / 10;

  // 4. Carga estructural de diseño:
  // Factor dinámico reglamentario de 1.5 sobre el MTOW
  const dynamicLoadDesignKg = Math.round(helicopter.mtowKg * 1.5);

  // Verificaciones de Factibilidad
  const isGeometryFeasible =
    availableLengthM >= totalDimensionWithSafety &&
    availableWidthM >= totalDimensionWithSafety;

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
      `Margen perimetral ajustado: Se encuentra dentro de los 3 metros del límite reglamentario de seguridad.`
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
      `Se cuenta con una sola trayectoria de aproximación. RAAC 154 exige preferentemente al menos 2 trayectorias separadas por 150° para operaciones con viento favorable.`
    );
  }

  if (overallFeasibility === 'FEASIBLE') {
    feasibilityNotes.push(
      `Dimensiones de FATO (1.5D = ${fatoDimension}m), TLOF (${tlofDimension}m), área de seguridad y resistencia estructural cumplen plenamente la RAAC Parte 154 para ${helicopter.manufacturer} ${helicopter.model}.`
    );
  }

  return {
    id: `ladh-study-${Date.now()}`,
    clientId,
    studyName,
    helipadType,
    helicopter,
    availableLengthM,
    availableWidthM,
    availableLoadBearingKg,
    dValueM: d,
    rdValueM: rd,
    tlofDimensionRequiredM: tlofDimension,
    fatoDimensionRequiredM: fatoDimension,
    safetyAreaMarginM: safetyMargin,
    totalAreaWithSafetyRequiredM: totalDimensionWithSafety,
    dynamicLoadDesignKg,
    approachSectorsCount,
    approachAngleDeg: 150,
    approachSlopePercent,
    isGeometryFeasible,
    isLoadFeasible,
    isApproachFeasible,
    overallFeasibility,
    feasibilityNotes,
    createdAt: new Date().toISOString().split('T')[0],
    notes
  };
}
