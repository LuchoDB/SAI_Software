export type CompassPoint =
  | 'N'
  | 'NNE'
  | 'NE'
  | 'ENE'
  | 'E'
  | 'ESE'
  | 'SE'
  | 'SSE'
  | 'S'
  | 'SSW'
  | 'SW'
  | 'WSW'
  | 'W'
  | 'WNW'
  | 'NW'
  | 'NNW';

export interface WindSpeedBracket {
  range: '0-5' | '6-10' | '11-15' | '16-20' | '>20';
  avgSpeedKt: number;
  frequencyPercent: number; // Porcentaje de ocurrencia histórica
}

export interface WindSectorData {
  direction: CompassPoint;
  degrees: number;
  totalFrequencyPercent: number;
  brackets: {
    b0_5: number; // 0 a 5 kt (%)
    b6_10: number; // 6 a 10 kt (%)
    b11_15: number; // 11 a 15 kt (%)
    b16_20: number; // 16 a 20 kt (%)
    b21_plus: number; // >20 kt (%)
  };
}

export interface RunwayOrientation {
  trueHeading: number; // Rumbo geográfico verdadero (0-359°)
  magneticDeclination: number; // Declinación magnética (+ Este, - Oeste)
  magneticHeading: number; // Rumbo magnético corregido
  reciprocalHeading: number; // Rumbo recíproco magnético
  qfuPrimary: string; // Ej. "04"
  qfuSecondary: string; // Ej. "22"
  qfuLabel: string; // Ej. "04 / 22"
}

export interface WindVectorAnalysis {
  sector: CompassPoint;
  degrees: number;
  windSpeedKt: number;
  angleToRunwayPrimary: number;
  crosswindKt: number;
  headwindKt: number;
  tailwindKt: number;
  isUsable: boolean;
}

export interface WindStudyResult {
  id: string;
  clientId: string;
  studyName: string;
  orientation: RunwayOrientation;
  admissibleCrosswindKt: 10 | 13 | 20; // 10 kt (clave 1), 13 kt (clave 2), 20 kt (claves 3/4)
  usabilityPercent: number; // Coeficiente de utilización OACI
  isCompliantOACI: boolean; // >= 95.0%
  calmsPercent: number; // Porcentaje de calmas meteorológicas
  windDistribution: WindSectorData[];
  createdAt: string;
  notes?: string;
}
