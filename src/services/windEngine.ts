import { CompassPoint, RunwayOrientation, WindSectorData, WindStudyResult } from '../types/wind';

export const COMPASS_POINTS: CompassPoint[] = [
  'N', 'NNE', 'NE', 'ENE',
  'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW',
  'W', 'WNW', 'NW', 'NNW'
];

export const COMPASS_DEGREES: Record<CompassPoint, number> = {
  N: 0, NNE: 22.5, NE: 45, ENE: 67.5,
  E: 90, ESE: 112.5, SE: 135, SSE: 157.5,
  S: 180, SSW: 202.5, SW: 225, WSW: 247.5,
  W: 270, WNW: 292.5, NW: 315, NNW: 337.5
};

/**
 * Calcula la orientación magnética y los designadores de cabecera (QFU)
 * @param trueHeading Rumbo verdadero (0° a 359°)
 * @param magneticDeclination Declinación magnética en grados (+ Este, - Oeste)
 */
export function calculateRunwayOrientation(
  trueHeading: number,
  magneticDeclination: number
): RunwayOrientation {
  // Normalizar rumbo verdadero
  const normalizedTrue = ((trueHeading % 360) + 360) % 360;

  // Rumbo magnético = Rumbo verdadero - Declinación
  let magneticHeading = normalizedTrue - magneticDeclination;
  magneticHeading = ((magneticHeading % 360) + 360) % 360;

  // Rumbo recíproco magnético
  const reciprocalHeading = (magneticHeading + 180) % 360;

  // Cabecera 1 (redondeo a decena)
  let qfu1Num = Math.round(magneticHeading / 10);
  if (qfu1Num === 0) qfu1Num = 36;
  const qfuPrimary = qfu1Num.toString().padStart(2, '0');

  // Cabecera 2 (redondeo a decena)
  let qfu2Num = Math.round(reciprocalHeading / 10);
  if (qfu2Num === 0) qfu2Num = 36;
  const qfuSecondary = qfu2Num.toString().padStart(2, '0');

  // Ordenar cabeceras en formato estándar ej "04 / 22" (menor primero)
  const qfuLabel = qfu1Num <= qfu2Num
    ? `${qfuPrimary} / ${qfuSecondary}`
    : `${qfuSecondary} / ${qfuPrimary}`;

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

/**
 * Descompone el viento en componentes respecto al eje de pista
 * @param windDirection Dirección de procedencia del viento (grados)
 * @param windSpeed Velocidad del viento (nudos)
 * @param runwayHeading Rumbo magnético de la pista (grados)
 */
export function calculateWindComponents(
  windDirection: number,
  windSpeed: number,
  runwayHeading: number
) {
  const angleRad = ((windDirection - runwayHeading) * Math.PI) / 180;
  
  // Crosswind es el valor absoluto
  const crosswind = Math.abs(windSpeed * Math.sin(angleRad));
  // Longitudinal: positivo = frente, negativo = cola
  const longitudinal = windSpeed * Math.cos(angleRad);
  
  return {
    crosswind: Math.round(crosswind * 10) / 10,
    headwind: longitudinal > 0 ? Math.round(longitudinal * 10) / 10 : 0,
    tailwind: longitudinal < 0 ? Math.round(Math.abs(longitudinal) * 10) / 10 : 0
  };
}

/**
 * Evalúa el factor de utilización (usabilidad) histórica según OACI Anexo 14
 * Considerando ambas cabeceras de pista (se despega/aterriza con menor componente de cola)
 */
export function calculateOACIUsability(
  orientation: RunwayOrientation,
  windDistribution: WindSectorData[],
  calmsPercent: number,
  admissibleCrosswindKt: 10 | 13 | 20
): { usabilityPercent: number; isCompliantOACI: boolean; detailsBySector: Record<CompassPoint, boolean> } {
  const h1 = orientation.magneticHeading;
  const h2 = orientation.reciprocalHeading;

  let totalUsablePercent = calmsPercent; // Las calmas siempre son 100% operables
  const detailsBySector: Record<string, boolean> = {};

  // Puntos medios representativos de cada rango de velocidad
  const midSpeeds = {
    b0_5: 3,     // 0 a 5 kt
    b6_10: 8,    // 6 a 10 kt
    b11_15: 13,  // 11 a 15 kt
    b16_20: 18,  // 16 a 20 kt
    b21_plus: 24 // >20 kt
  };

  for (const sector of windDistribution) {
    const angle1Rad = ((sector.degrees - h1) * Math.PI) / 180;
    const angle2Rad = ((sector.degrees - h2) * Math.PI) / 180;

    // Calculamos el viento cruzado para cada rango
    let sectorUsableFreq = 0;
    let sectorIsGenerallyUsable = true;

    for (const [bracketKey, speed] of Object.entries(midSpeeds)) {
      const cw1 = Math.abs(speed * Math.sin(angle1Rad));
      const cw2 = Math.abs(speed * Math.sin(angle2Rad));
      const minCrosswind = Math.min(cw1, cw2);

      const freq = sector.brackets[bracketKey as keyof typeof sector.brackets] || 0;

      if (minCrosswind <= admissibleCrosswindKt) {
        sectorUsableFreq += freq;
      } else {
        sectorIsGenerallyUsable = false;
      }
    }

    totalUsablePercent += sectorUsableFreq;
    detailsBySector[sector.direction] = sectorIsGenerallyUsable;
  }

  const roundedUsability = Math.min(100, Math.round(totalUsablePercent * 10) / 10);

  return {
    usabilityPercent: roundedUsability,
    isCompliantOACI: roundedUsability >= 95.0,
    detailsBySector: detailsBySector as Record<CompassPoint, boolean>
  };
}

/**
 * Genera una matriz de vientos realista para la región pampeana / llanura argentina
 * con predominio de vientos NE/E (brisa de buen tiempo) y vientos SW (Pampero)
 */
export function getDefaultArgentineWindDistribution(): { distribution: WindSectorData[]; calmsPercent: number } {
  const calmsPercent = 8.5; // 8.5% de calmas

  const rawSectors: Array<{ dir: CompassPoint; total: number; b0_5: number; b6_10: number; b11_15: number; b16_20: number; b21_plus: number }> = [
    { dir: 'N',   total: 8.2,  b0_5: 2.1, b6_10: 3.5, b11_15: 1.8, b16_20: 0.6, b21_plus: 0.2 },
    { dir: 'NNE', total: 6.4,  b0_5: 1.8, b6_10: 2.8, b11_15: 1.2, b16_20: 0.4, b21_plus: 0.2 },
    { dir: 'NE',  total: 10.5, b0_5: 2.5, b6_10: 4.8, b11_15: 2.3, b16_20: 0.7, b21_plus: 0.2 },
    { dir: 'ENE', total: 9.8,  b0_5: 2.2, b6_10: 4.5, b11_15: 2.1, b16_20: 0.8, b21_plus: 0.2 },
    { dir: 'E',   total: 11.2, b0_5: 2.6, b6_10: 5.2, b11_15: 2.4, b16_20: 0.8, b21_plus: 0.2 },
    { dir: 'ESE', total: 6.5,  b0_5: 1.8, b6_10: 3.0, b11_15: 1.2, b16_20: 0.4, b21_plus: 0.1 },
    { dir: 'SE',  total: 5.4,  b0_5: 1.5, b6_10: 2.4, b11_15: 1.1, b16_20: 0.3, b21_plus: 0.1 },
    { dir: 'SSE', total: 4.1,  b0_5: 1.2, b6_10: 1.8, b11_15: 0.8, b16_20: 0.2, b21_plus: 0.1 },
    { dir: 'S',   total: 5.8,  b0_5: 1.4, b6_10: 2.3, b11_15: 1.4, b16_20: 0.5, b21_plus: 0.2 },
    { dir: 'SSW', total: 4.5,  b0_5: 1.1, b6_10: 1.9, b11_15: 1.0, b16_20: 0.4, b21_plus: 0.1 },
    { dir: 'SW',  total: 8.6,  b0_5: 1.6, b6_10: 3.2, b11_15: 2.2, b16_20: 1.2, b21_plus: 0.4 },
    { dir: 'WSW', total: 3.8,  b0_5: 1.0, b6_10: 1.6, b11_15: 0.8, b16_20: 0.3, b21_plus: 0.1 },
    { dir: 'W',   total: 2.5,  b0_5: 0.8, b6_10: 1.1, b11_15: 0.4, b16_20: 0.1, b21_plus: 0.1 },
    { dir: 'WNW', total: 2.2,  b0_5: 0.7, b6_10: 1.0, b11_15: 0.3, b16_20: 0.1, b21_plus: 0.1 },
    { dir: 'NW',  total: 3.6,  b0_5: 1.0, b6_10: 1.5, b11_15: 0.8, b16_20: 0.2, b21_plus: 0.1 },
    { dir: 'NNW', total: 4.1,  b0_5: 1.1, b6_10: 1.8, b11_15: 0.8, b16_20: 0.3, b21_plus: 0.1 }
  ];

  const distribution: WindSectorData[] = rawSectors.map(s => ({
    direction: s.dir,
    degrees: COMPASS_DEGREES[s.dir],
    totalFrequencyPercent: s.total,
    brackets: {
      b0_5: s.b0_5,
      b6_10: s.b6_10,
      b11_15: s.b11_15,
      b16_20: s.b16_20,
      b21_plus: s.b21_plus
    }
  }));

  return { distribution, calmsPercent };
}
