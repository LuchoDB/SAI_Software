import { describe, it, expect } from 'vitest';
import {
  normalizeAngle,
  calculateRunwayOrientation,
  calculateWindComponents,
  isSectorFavorable,
  calculateOACIUsability,
  getDefaultArgentineWindDistribution
} from '../../src/calculations/windCalculations';

describe('windCalculations (OACI Anexo 14)', () => {
  it('normalizes angles properly to [0, 360)', () => {
    expect(normalizeAngle(0)).toBe(0);
    expect(normalizeAngle(360)).toBe(0);
    expect(normalizeAngle(-10)).toBe(350);
    expect(normalizeAngle(375)).toBe(15);
  });

  it('calculates runway orientation and QFU designators correctly', () => {
    // Rumbo verdadero 45°, declinación -8.2° W
    // Rumbo magnético = 45 - (-8.2) = 53.2° -> Cabecera 05
    // Recíproco = 53.2 + 180 = 233.2° -> Cabecera 23
    const orient = calculateRunwayOrientation(45, -8.2);
    expect(orient.magneticHeading).toBeCloseTo(53.2, 1);
    expect(orient.reciprocalHeading).toBeCloseTo(233.2, 1);
    expect(orient.qfuPrimary).toBe('05');
    expect(orient.qfuSecondary).toBe('23');
    expect(orient.qfuLabel).toBe('05 / 23');
  });

  it('handles edge QFU wrap-around near 360°', () => {
    // Rumbo magnético 358° -> redondea a 36, recíproco 178° -> 18
    const orient = calculateRunwayOrientation(358, 0);
    expect(orient.qfuPrimary).toBe('36');
    expect(orient.qfuSecondary).toBe('18');
    expect(orient.qfuLabel).toBe('18 / 36');
  });

  it('decomposes wind into crosswind, headwind, and tailwind accurately', () => {
    // Pista rumbo 90° (Este), viento desde 90° (frente puro a 20 kt)
    const headwindPure = calculateWindComponents(90, 20, 90);
    expect(headwindPure.crosswind).toBe(0);
    expect(headwindPure.headwind).toBe(20);
    expect(headwindPure.tailwind).toBe(0);

    // Pista rumbo 90°, viento desde 0° (Norte - cruzado a 90° a 20 kt)
    const crosswindPure = calculateWindComponents(0, 20, 90);
    expect(crosswindPure.crosswind).toBe(20);
    expect(crosswindPure.headwind).toBe(0);

    // Viento a 45° de la pista a 20 kt
    // Crosswind = 20 * sin(45°) = 14.1 kt
    const angle45 = calculateWindComponents(45, 20, 90);
    expect(angle45.crosswind).toBeCloseTo(14.1, 1);
    expect(angle45.headwind).toBeCloseTo(14.1, 1);
  });

  it('determines sector favorability against admissible crosswind', () => {
    // Pista 05/23 (53° / 233°)
    // Viento desde sector NE (45°) a 15 kt -> cruzado bajo -> operable
    expect(isSectorFavorable(45, 53, 233, 15, 10)).toBe(true);

    // Viento desde sector NW (315°) perpendicular a la pista a 15 kt -> cruzado alto
    expect(isSectorFavorable(315, 53, 233, 15, 10)).toBe(false);
  });

  it('calculates historical OACI usability factor percentage', () => {
    const { distribution, calmsPercent } = getDefaultArgentineWindDistribution();
    const orientation = calculateRunwayOrientation(45, -8.2);

    // Con 10 kt de viento cruzado admisible
    const result10 = calculateOACIUsability(orientation, distribution, calmsPercent, 10);
    expect(result10.usabilityPercent).toBeGreaterThan(85);
    expect(typeof result10.isCompliantOACI).toBe('boolean');

    // Con 20 kt de viento cruzado admisible (aeronaves ejecutivas/comerciales), supera el 95%
    const result20 = calculateOACIUsability(orientation, distribution, calmsPercent, 20);
    expect(result20.usabilityPercent).toBeGreaterThanOrEqual(95);
    expect(result20.isCompliantOACI).toBe(true);
  });
});
