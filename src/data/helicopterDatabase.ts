import { HelicopterDesign } from '../types/ladh';

export const HELICOPTER_DATABASE: HelicopterDesign[] = [
  {
    id: 'r44',
    model: 'R44 Raven II',
    manufacturer: 'Robinson',
    overallLengthD: 11.75,
    rotorDiameterRD: 10.06,
    mtowKg: 1134,
    performanceClass: 3,
    typicalUse: 'Privado / Instrucción / Relevamiento Aéreo'
  },
  {
    id: 'r66',
    model: 'R66 Turbine',
    manufacturer: 'Robinson',
    overallLengthD: 11.66,
    rotorDiameterRD: 10.06,
    mtowKg: 1225,
    performanceClass: 3,
    typicalUse: 'Privado / Corporativo Ligero'
  },
  {
    id: 'as350',
    model: 'H125 / AS350 B3e',
    manufacturer: 'Airbus Helicopters',
    overallLengthD: 12.94,
    rotorDiameterRD: 10.69,
    mtowKg: 2250,
    performanceClass: 2,
    typicalUse: 'Trabajo Aéreo / Evacuación Médica / Rescate'
  },
  {
    id: 'ec130',
    model: 'H130 / EC130 T2',
    manufacturer: 'Airbus Helicopters',
    overallLengthD: 12.64,
    rotorDiameterRD: 10.69,
    mtowKg: 2500,
    performanceClass: 2,
    typicalUse: 'Transporte VIP / Sanitario / Bajas Emisiones Sonoras'
  },
  {
    id: 'b407',
    model: 'Bell 407 GXi',
    manufacturer: 'Bell',
    overallLengthD: 12.61,
    rotorDiameterRD: 10.67,
    mtowKg: 2381,
    performanceClass: 2,
    typicalUse: 'Gubernamental / Policial / Corporativo'
  },
  {
    id: 'b429',
    model: 'Bell 429 GlobalRanger',
    manufacturer: 'Bell',
    overallLengthD: 13.00,
    rotorDiameterRD: 10.97,
    mtowKg: 3402,
    performanceClass: 1,
    typicalUse: 'Hospitalario / Helitransporte de Emergencia / Bimotor'
  },
  {
    id: 'aw139',
    model: 'AW139',
    manufacturer: 'Leonardo',
    overallLengthD: 16.66,
    rotorDiameterRD: 13.80,
    mtowKg: 6800,
    performanceClass: 1,
    typicalUse: 'Offshore / Búsqueda y Salvamento / Presidencial'
  }
];
