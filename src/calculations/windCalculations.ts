import { CompassPoint, RunwayOrientation, WindSectorData } from '../types/wind';

export const COMPASS_POINTS: CompassPoint[] = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW'
];

export const COMPASS_DEGREES: Record<CompassPoint, number> = {
  N: 0,
  NNE: 22.5,
  NE: 45,
  ENE: 67.5,
  E: 90,
  ESE: 112.5,
  SE: 135,
  SSE: 157.5,
  S: 180,
  SSW: 202.5,
  SW: 225,
  WSW: 247.5,
  W: 270,
  WNW: 292.5,
  NW: 315,
  NNW: 337.5
};

/**
 * Normaliza un ángulo en grados al rango [0, 360)
 */
export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

/**
 * Calcula la orientación magnética y los designadores de cabecera (QFU)
 * Rumbo magnético = Rumbo verdadero - Declinación magnética (+ Este, - Oeste)
 * @param trueHeading Rumbo geográfico verdadero (0° a 359°)
 * @param magneticDeclination Declinación magnética en grados
 */
export function calculateRunwayOrientation(
  trueHeading: number,
  magneticDeclination: number
): RunwayOrientation {
  const normalizedTrue = normalizeAngle(trueHeading);

  const magneticHeading = normalizeAngle(normalizedTrue - magneticDeclination);
  const reciprocalHeading = normalizeAngle(magneticHeading + 180);

  // Cabecera 1 (redondeo a la decena más cercana)
  let qfu1Num = Math.round(magneticHeading / 10);
  if (qfu1Num === 0 || qfu1Num === 36) qfu1Num = 36;
  const qfuPrimary = qfu1Num.toString().padStart(2, '0');

  // Cabecera 2 (recíproco redondeado a decena)
  let qfu2Num = Math.round(reciprocalHeading / 10);
  if (qfu2Num === 0 || qfu2Num === 36) qfu2Num = 36;
  const qfuSecondary = qfu2Num.toString().padStart(2, '0');

  const qfuLabel =
    qfu1Num <= qfu2Num ? `${qfuPrimary} / ${qfuSecondary}` : `${qfuSecondary} / ${qfuPrimary}`;

  return {
    trueHeading: Math.round(normalizedTrue * 10) / 10,
    magneticDeclination: Math.round(magneticDeclination * 10) / 10,
    magneticHeading: Math.round(magneticHeading * 10) / 10,
    reciprocalHeading: Math.round(reciprocalHeading * 10) / 10,
    qfuPrimary,
    qfuSecondary,
    qfuLabel
  };
}

export interface WindComponentResult {
  crosswind: number;
  headwind: number;
  tailwind: number;
}

/**
 * Descompone trigonométricamente el vector de viento en componentes
 * @param windDirection Dirección de procedencia del viento en grados (0° a 360°)
 * @param windSpeedKt Velocidad en nudos (kt)
 * @param runwayHeading Rumbo magnético de la pista
 */
export function calculateWindComponents(
  windDirection: number,
  windSpeedKt: number,
  runwayHeading: number
): WindComponentResult {
  const angleRad = ((windDirection - runwayHeading) * Math.PI) / 180;

  const crosswind = Math.abs(windSpeedKt * Math.sin(angleRad));
  const longitudinal = windSpeedKt * Math.cos(angleRad);

  return {
    crosswind: Math.round(crosswind * 10) / 10,
    headwind: longitudinal > 0 ? Math.round(longitudinal * 10) / 10 : 0,
    tailwind: longitudinal < 0 ? Math.round(Math.abs(longitudinal) * 10) / 10 : 0
  };
}

/**
 * Verifica si un sector de viento es operable para una pista con límite de viento cruzado
 */
export function isSectorFavorable(
  sectorDegrees: number,
  magneticHeading: number,
  reciprocalHeading: number,
  windSpeedKt: number,
  admissibleCrosswindKt: number
): boolean {
  const angle1 = Math.abs(sectorDegrees - magneticHeading);
  const angle2 = Math.abs(sectorDegrees - reciprocalHeading);
  const minAngle = Math.min(Math.min(angle1, 360 - angle1), Math.min(angle2, 360 - angle2));

  const crosswind = windSpeedKt * Math.sin((minAngle * Math.PI) / 180);
  return crosswind <= admissibleCrosswindKt;
}

export interface OACIUsabilityResult {
  usabilityPercent: number;
  isCompliantOACI: boolean;
  detailsBySector: Record<CompassPoint, boolean>;
}

/**
 * Evalúa el factor de utilización (usabilidad) histórica según OACI Anexo 14
 * El estándar OACI exige que la usabilidad sea >= 95% para el viento cruzado admisible.
 */
export function calculateOACIUsability(
  orientation: RunwayOrientation,
  windDistribution: WindSectorData[],
  calmsPercent: number,
  admissibleCrosswindKt: 10 | 13 | 20
): OACIUsabilityResult {
  const h1 = orientation.magneticHeading;
  const h2 = orientation.reciprocalHeading;

  let totalUsablePercent = calmsPercent; // Las calmas son 100% operables
  const detailsBySector: Record<string, boolean> = {};

  for (const sector of windDistribution) {
    const angle1 = Math.abs(sector.degrees - h1);
    const angle2 = Math.abs(sector.degrees - h2);
    const minAngle = Math.min(Math.min(angle1, 360 - angle1), Math.min(angle2, 360 - angle2));
    const sinAngle = Math.sin((minAngle * Math.PI) / 180);

    // Calcular componente de viento cruzado en el límite superior de cada rango
    const crosswind5 = 5 * sinAngle;
    const crosswind10 = 10 * sinAngle;
    const crosswind15 = 15 * sinAngle;
    const crosswind20 = 20 * sinAngle;
    const crosswind25 = 25 * sinAngle;

    let sectorUsable = 0;
    if (crosswind5 <= admissibleCrosswindKt) sectorUsable += sector.brackets.b0_5;
    if (crosswind10 <= admissibleCrosswindKt) sectorUsable += sector.brackets.b6_10;
    if (crosswind15 <= admissibleCrosswindKt) sectorUsable += sector.brackets.b11_15;
    if (crosswind20 <= admissibleCrosswindKt) sectorUsable += sector.brackets.b16_20;
    if (crosswind25 <= admissibleCrosswindKt) sectorUsable += sector.brackets.b21_plus;

    totalUsablePercent += sectorUsable;
    detailsBySector[sector.direction] = sectorUsable >= sector.totalFrequencyPercent * 0.9;
  }

  const roundedUsability = Math.min(100, Math.round(totalUsablePercent * 10) / 10);

  return {
    usabilityPercent: roundedUsability,
    isCompliantOACI: roundedUsability >= 95.0,
    detailsBySector: detailsBySector as Record<CompassPoint, boolean>
  };
}

/**
 * Matriz climatológica de referencia para Argentina (zona centro / Pampeana)
 */
export function getDefaultArgentineWindDistribution(): {
  distribution: WindSectorData[];
  calmsPercent: number;
} {
  return {
    calmsPercent: 6.5,
    distribution: [
      {
        direction: 'N',
        degrees: 0,
        totalFrequencyPercent: 9.8,
        brackets: { b0_5: 2.1, b6_10: 4.3, b11_15: 2.4, b16_20: 0.8, b21_plus: 0.2 }
      },
      {
        direction: 'NNE',
        degrees: 22.5,
        totalFrequencyPercent: 7.2,
        brackets: { b0_5: 1.8, b6_10: 3.2, b11_15: 1.6, b16_20: 0.5, b21_plus: 0.1 }
      },
      {
        direction: 'NE',
        degrees: 45,
        totalFrequencyPercent: 8.5,
        brackets: { b0_5: 2.0, b6_10: 3.8, b11_15: 2.0, b16_20: 0.6, b21_plus: 0.1 }
      },
      {
        direction: 'ENE',
        degrees: 67.5,
        totalFrequencyPercent: 6.9,
        brackets: { b0_5: 1.7, b6_10: 3.1, b11_15: 1.6, b16_20: 0.4, b21_plus: 0.1 }
      },
      {
        direction: 'E',
        degrees: 90,
        totalFrequencyPercent: 7.8,
        brackets: { b0_5: 2.2, b6_10: 3.5, b11_15: 1.6, b16_20: 0.4, b21_plus: 0.1 }
      },
      {
        direction: 'ESE',
        degrees: 112.5,
        totalFrequencyPercent: 5.1,
        brackets: { b0_5: 1.5, b6_10: 2.3, b11_15: 1.0, b16_20: 0.3, b21_plus: 0.0 }
      },
      {
        direction: 'SE',
        degrees: 135,
        totalFrequencyPercent: 6.3,
        brackets: { b0_5: 1.8, b6_10: 2.7, b11_15: 1.3, b16_20: 0.4, b21_plus: 0.1 }
      },
      {
        direction: 'SSE',
        degrees: 157.5,
        totalFrequencyPercent: 4.2,
        brackets: { b0_5: 1.2, b6_10: 1.9, b11_15: 0.8, b16_20: 0.2, b21_plus: 0.1 }
      },
      {
        direction: 'S',
        degrees: 180,
        totalFrequencyPercent: 8.4,
        brackets: { b0_5: 2.0, b6_10: 3.6, b11_15: 2.0, b16_20: 0.6, b21_plus: 0.2 }
      },
      {
        direction: 'SSW',
        degrees: 202.5,
        totalFrequencyPercent: 5.6,
        brackets: { b0_5: 1.3, b6_10: 2.4, b11_15: 1.4, b16_20: 0.4, b21_plus: 0.1 }
      },
      {
        direction: 'SW',
        degrees: 225,
        totalFrequencyPercent: 7.9,
        brackets: { b0_5: 1.5, b6_10: 3.2, b11_15: 2.2, b16_20: 0.8, b21_plus: 0.2 }
      },
      {
        direction: 'WSW',
        degrees: 247.5,
        totalFrequencyPercent: 4.8,
        brackets: { b0_5: 1.1, b6_10: 2.1, b11_15: 1.2, b16_20: 0.3, b21_plus: 0.1 }
      },
      {
        direction: 'W',
        degrees: 270,
        totalFrequencyPercent: 3.2,
        brackets: { b0_5: 0.9, b6_10: 1.4, b11_15: 0.7, b16_20: 0.2, b21_plus: 0.0 }
      },
      {
        direction: 'WNW',
        degrees: 292.5,
        totalFrequencyPercent: 2.5,
        brackets: { b0_5: 0.8, b6_10: 1.1, b11_15: 0.5, b16_20: 0.1, b21_plus: 0.0 }
      },
      {
        direction: 'NW',
        degrees: 315,
        totalFrequencyPercent: 3.8,
        brackets: { b0_5: 1.0, b6_10: 1.6, b11_15: 0.9, b16_20: 0.2, b21_plus: 0.1 }
      },
      {
        direction: 'NNW',
        degrees: 337.5,
        totalFrequencyPercent: 4.5,
        brackets: { b0_5: 1.2, b6_10: 2.0, b11_15: 1.0, b16_20: 0.2, b21_plus: 0.1 }
      }
    ]
  };
}
