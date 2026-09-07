export interface AircraftDesign {
  id: string;
  model: string;
  manufacturer: string;
  referenceFieldLengthM: number;     // Longitud básica de campo de referencia (m)
  wingspanM: number;                 // Envergadura (m)
  outerMainGearWheelSpanM: number;   // Anchura exterior entre ruedas del tren principal (m)
  mtowKg: number;                    // Peso máximo de despegue (kg)
  maxDemonstratedCrosswindKt: number;// Viento cruzado máximo demostrado (kt)
  categoryCode: string;              // Ej. "1A", "1B", "2B"
  typicalUse: string;                // Ej. "Fumigación Agrícola", "Aviación Ejecutiva", "Instrucción"
}

export interface LadStudy {
  id: string;
  clientId: string;
  studyName: string;
  aircraft: AircraftDesign;
  runwayQfu: string;
  
  // Parámetros ambientales y topográficos
  elevationMsl: number;              // Elevación (m s.n.m.)
  referenceTemperatureC: number;     // Temperatura media máxima (°C)
  longitudinalSlopePercent: number;  // Pendiente longitudinal (%)
  
  // Disponibilidad de terreno
  terrainLengthAvailableM: number;
  terrainWidthAvailableM: number;
  
  // Cálculos de corrección según RAAC 153
  basicLengthM: number;
  elevationCorrectionM: number;
  tempCorrectionM: number;
  slopeCorrectionM: number;
  correctedRunwayLengthRequiredM: number;
  runwayWidthRequiredM: number;
  
  // Franja y RESA
  stripLengthRequiredM: number;
  stripWidthRequiredM: number;
  resaLengthM: number;
  resaWidthM: number;
  
  // Factibilidad
  isLengthFeasible: boolean;
  isWidthFeasible: boolean;
  overallFeasibility: 'FEASIBLE' | 'CONDITIONED' | 'NOT_FEASIBLE';
  feasibilityNotes: string[];
  
  createdAt: string;
  notes?: string;
}
