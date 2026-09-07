import { describe, it, expect } from 'vitest';
import {
  calculateIsaTemperature,
  calculateElevationCorrection,
  calculateTemperatureCorrection,
  calculateSlopeCorrection,
  calculateRunwayWidth,
  calculateStripDimensions,
  computeRunwayFeasibility
} from '../../src/calculations/runwayCalculations';
import { AircraftDesign } from '../../src/types/lad';

describe('runwayCalculations (RAAC 153)', () => {
  const sampleAircraft: AircraftDesign = {
    id: 'c182',
    model: 'Skylane 182T',
    manufacturer: 'Cessna',
    referenceFieldLengthM: 460,
    wingspanM: 11.0,
    outerMainGearWheelSpanM: 2.7,
    mtowKg: 1406,
    maxDemonstratedCrosswindKt: 15,
    categoryCode: '1A',
    typicalUse: 'Aviación General'
  };

  it('calculates standard ISA temperature correctly', () => {
    // ISA a nivel del mar = 15°C
    expect(calculateIsaTemperature(0)).toBe(15);
    // ISA a 1000m = 15 - 6.5 = 8.5°C
    expect(calculateIsaTemperature(1000)).toBeCloseTo(8.5, 2);
  });

  it('calculates elevation correction (+7% per 300m)', () => {
    // A 0m, corrección = 0
    expect(calculateElevationCorrection(460, 0)).toBe(0);
    // A 300m, +7% de 460 = 32.2m
    expect(calculateElevationCorrection(460, 300)).toBeCloseTo(32.2, 1);
    // A 600m, +14% de 460 = 64.4m
    expect(calculateElevationCorrection(460, 600)).toBeCloseTo(64.4, 1);
  });

  it('calculates temperature correction (+1% per 1°C over ISA)', () => {
    const l1 = 460;
    // ISA at 0m is 15°C. Ref temp 25°C -> delta = 10°C -> +10%
    const corr = calculateTemperatureCorrection(l1, 0, 25);
    expect(corr).toBeCloseTo(46, 1);
  });

  it('calculates longitudinal slope correction (+10% per 1% slope)', () => {
    const l2 = 500;
    // 1% slope -> +10% of 500 = 50m
    expect(calculateSlopeCorrection(l2, 1.0)).toBeCloseTo(50, 1);
    // 0% slope -> 0
    expect(calculateSlopeCorrection(l2, 0)).toBe(0);
  });

  it('determines runway width based on category and wingspan', () => {
    expect(calculateRunwayWidth('1A', 11.0)).toBe(18);
    expect(calculateRunwayWidth('2B', 16.0)).toBe(23);
    expect(calculateRunwayWidth('3C', 28.0)).toBe(30);
  });

  it('determines strip dimensions according to runway width', () => {
    const strip1 = calculateStripDimensions(600, 18);
    expect(strip1.stripLength).toBe(720); // 600 + 120
    expect(strip1.stripWidth).toBe(60);

    const strip2 = calculateStripDimensions(800, 23);
    expect(strip2.stripWidth).toBe(80);
  });

  it('computes overall runway feasibility as FEASIBLE with sufficient terrain', () => {
    const result = computeRunwayFeasibility(
      sampleAircraft,
      50, // 50m MSL
      30, // 30°C
      0.5, // 0.5% slope
      1200, // 1200m available
      100 // 100m width available
    );

    expect(result.overallFeasibility).toBe('FEASIBLE');
    expect(result.isLengthFeasible).toBe(true);
    expect(result.isWidthFeasible).toBe(true);
    expect(result.correctedRunwayLengthRequiredM).toBeGreaterThan(
      sampleAircraft.referenceFieldLengthM
    );
  });

  it('marks overall runway feasibility as NOT_FEASIBLE when terrain is too short', () => {
    const result = computeRunwayFeasibility(
      sampleAircraft,
      50,
      30,
      0.5,
      400, // Insufficient (less than strip)
      100
    );

    expect(result.overallFeasibility).toBe('NOT_FEASIBLE');
    expect(result.isLengthFeasible).toBe(false);
  });
});
