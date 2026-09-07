import { HelicopterDesign, LadhStudy, LadhType } from '../types/ladh';
import { computeHelipadFeasibility } from '../calculations/helipadCalculations';

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
 * Orquesta el estudio de factibilidad técnica de helipuerto LADH delegando en cálculos puros (RAAC 154)
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

  const result = computeHelipadFeasibility(
    helicopter,
    helipadType,
    availableLengthM,
    availableWidthM,
    availableLoadBearingKg,
    approachSectorsCount,
    approachSlopePercent
  );

  return {
    id: `ladh-study-${Date.now()}`,
    clientId,
    studyName,
    helipadType,
    helicopter,
    availableLengthM,
    availableWidthM,
    availableLoadBearingKg,
    approachSectorsCount,
    approachAngleDeg: 150,
    approachSlopePercent,
    ...result,
    createdAt: new Date().toISOString().split('T')[0],
    notes
  };
}
