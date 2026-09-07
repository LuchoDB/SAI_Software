export type LadhType = 'SURFACE' | 'ELEVATED' | 'HOSPITAL';

export interface HelicopterDesign {
  id: string;
  model: string;
  manufacturer: string;
  overallLengthD: number;       // "D" máxima con rotor girando (m)
  rotorDiameterRD: number;      // Diámetro del rotor principal (m)
  mtowKg: number;               // Peso máximo de despegue (kg)
  performanceClass: 1 | 2 | 3;  // Clase de performance OACI
  typicalUse: string;           // "Privado", "Ejecutivo", "Sanitario/Evac"
}

export interface LadhStudy {
  id: string;
  clientId: string;
  studyName: string;
  helipadType: LadhType;
  helicopter: HelicopterDesign;
  
  // Disponibilidad de emplazamiento
  availableLengthM: number;
  availableWidthM: number;
  availableLoadBearingKg: number;
  
  // Parámetros calculados según RAAC 154
  dValueM: number;
  rdValueM: number;
  tlofDimensionRequiredM: number;    // >= 0.83D o 1.0D
  fatoDimensionRequiredM: number;    // >= 1.5D
  safetyAreaMarginM: number;         // >= 0.25D (mínimo 3m)
  totalAreaWithSafetyRequiredM: number;
  dynamicLoadDesignKg: number;       // 1.5 x MTOW
  
  // Trayectorias y pendientes
  approachSectorsCount: number;      // Mínimo 2 sectores
  approachAngleDeg: number;          // Típico 150° entre ejes
  approachSlopePercent: number;      // 8% (1:12.5) estándar o 4.5%
  
  // Dictamen de Factibilidad
  isGeometryFeasible: boolean;
  isLoadFeasible: boolean;
  isApproachFeasible: boolean;
  overallFeasibility: 'FEASIBLE' | 'CONDITIONED' | 'NOT_FEASIBLE';
  feasibilityNotes: string[];
  
  createdAt: string;
  notes?: string;
}
