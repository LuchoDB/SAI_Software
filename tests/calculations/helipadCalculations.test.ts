import { describe, it, expect } from 'vitest';
import {
  calculateTlofDimension,
  calculateFatoDimension,
  calculateSafetyAreaMargin,
  calculateDynamicStructuralLoad,
  computeHelipadFeasibility
} from '../../src/calculations/helipadCalculations';
import { HelicopterDesign } from '../../src/types/ladh';

describe('helipadCalculations (RAAC 154)', () => {
  const bell429: HelicopterDesign = {
    id: 'b429',
    model: 'Bell 429 GlobalRanger',
    manufacturer: 'Bell',
    overallLengthD: 13.1,
    rotorDiameterRD: 11.0,
    mtowKg: 3402,
    performanceClass: 1,
    typicalUse: 'Sanitario / Ejecutivo'
  };

  const r44: HelicopterDesign = {
    id: 'r44',
    model: 'Robinson R44 Raven II',
    manufacturer: 'Robinson',
    overallLengthD: 11.7,
    rotorDiameterRD: 10.1,
    mtowKg: 1134,
    performanceClass: 3,
    typicalUse: 'Privado / Instrucción'
  };

  it('calculates TLOF dimension correctly based on helipad type and performance class', () => {
    // Monomotor en superficie (R44 clase 3) -> 0.83D = 0.83 * 11.7 = 9.7m
    expect(calculateTlofDimension(r44.overallLengthD, 'SURFACE', r44.performanceClass)).toBe(9.7);

    // Bimotor clase 1 (Bell 429) -> 1.0D = 13.1m
    expect(
      calculateTlofDimension(bell429.overallLengthD, 'SURFACE', bell429.performanceClass)
    ).toBe(13.1);

    // Helipuerto elevado -> 1.0D
    expect(calculateTlofDimension(r44.overallLengthD, 'ELEVATED', r44.performanceClass)).toBe(11.7);
  });

  it('calculates FATO dimension correctly (1.5D surface, 1.2D elevated)', () => {
    // Superficie -> 1.5 * 13.1 = 19.65 -> 19.7m
    expect(calculateFatoDimension(13.1, 'SURFACE')).toBe(19.7);
    // Elevado -> 1.2 * 13.1 = 15.72 -> 15.7m
    expect(calculateFatoDimension(13.1, 'ELEVATED')).toBe(15.7);
  });

  it('calculates safety area margin (max of 0.25D or 3.0m)', () => {
    // 0.25 * 13.1 = 3.275 -> 3.3m
    expect(calculateSafetyAreaMargin(13.1)).toBe(3.3);
    // Para D pequeña (ej: 8m), 0.25 * 8 = 2m -> debe aplicar el mínimo reglamentario de 3.0m
    expect(calculateSafetyAreaMargin(8.0)).toBe(3.0);
  });

  it('calculates dynamic structural load as 1.5x MTOW', () => {
    // 3402 * 1.5 = 5103 kg
    expect(calculateDynamicStructuralLoad(3402)).toBe(5103);
    // 1134 * 1.5 = 1701 kg
    expect(calculateDynamicStructuralLoad(1134)).toBe(1701);
  });

  it('computes overall helipad feasibility as FEASIBLE with adequate space and load capacity', () => {
    const result = computeHelipadFeasibility(
      bell429,
      'SURFACE',
      35, // 35m length available
      35, // 35m width available
      6000, // 6000 kg capacity (needs 5103 kg)
      2, // 2 approach sectors
      8.0 // 8% slope
    );

    expect(result.overallFeasibility).toBe('FEASIBLE');
    expect(result.isGeometryFeasible).toBe(true);
    expect(result.isLoadFeasible).toBe(true);
    expect(result.isApproachFeasible).toBe(true);
  });

  it('marks helipad feasibility as NOT_FEASIBLE when load capacity is insufficient', () => {
    const result = computeHelipadFeasibility(
      bell429,
      'SURFACE',
      35,
      35,
      4000, // Insufficient (needs 5103 kg)
      2,
      8.0
    );

    expect(result.overallFeasibility).toBe('NOT_FEASIBLE');
    expect(result.isLoadFeasible).toBe(false);
  });
});
