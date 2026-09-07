import { AircraftDesign, LadStudy } from '../types/lad';
import { computeRunwayFeasibility } from '../calculations/runwayCalculations';

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
 * Orquesta el estudio de factibilidad técnica de pista LAD delegando en cálculos puros (RAAC 153)
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

  const result = computeRunwayFeasibility(
    aircraft,
    elevationMsl,
    referenceTemperatureC,
    longitudinalSlopePercent,
    terrainLengthAvailableM,
    terrainWidthAvailableM
  );

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
    ...result,
    createdAt: new Date().toISOString().split('T')[0],
    notes
  };
}
