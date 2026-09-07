import { AircraftDesign } from '../types/lad';

export const AIRCRAFT_DATABASE: AircraftDesign[] = [
  {
    id: 'c172',
    model: 'Skyhawk 172S',
    manufacturer: 'Cessna',
    referenceFieldLengthM: 510,
    wingspanM: 11.0,
    outerMainGearWheelSpanM: 2.7,
    mtowKg: 1157,
    maxDemonstratedCrosswindKt: 15,
    categoryCode: '1A',
    typicalUse: 'Aviación General / Instrucción / Traslado Privado'
  },
  {
    id: 'c182',
    model: 'Skylane 182T',
    manufacturer: 'Cessna',
    referenceFieldLengthM: 580,
    wingspanM: 11.0,
    outerMainGearWheelSpanM: 2.8,
    mtowKg: 1406,
    maxDemonstratedCrosswindKt: 15,
    categoryCode: '1A',
    typicalUse: 'Aviación General / Transporte Rural'
  },
  {
    id: 'pa25',
    model: 'Pawnee PA-25-235',
    manufacturer: 'Piper',
    referenceFieldLengthM: 420,
    wingspanM: 11.0,
    outerMainGearWheelSpanM: 2.4,
    mtowKg: 1315,
    maxDemonstratedCrosswindKt: 12,
    categoryCode: '1A',
    typicalUse: 'Fumigación Agrícola / Siembra Aérea'
  },
  {
    id: 'at402',
    model: 'Air Tractor AT-402B',
    manufacturer: 'Air Tractor',
    referenceFieldLengthM: 670,
    wingspanM: 15.5,
    outerMainGearWheelSpanM: 3.5,
    mtowKg: 3175,
    maxDemonstratedCrosswindKt: 17,
    categoryCode: '1B',
    typicalUse: 'Aeroaplicación Intensiva / Lucha contra Incendios'
  },
  {
    id: 'b200',
    model: 'Super King Air B200',
    manufacturer: 'Beechcraft',
    referenceFieldLengthM: 780,
    wingspanM: 16.6,
    outerMainGearWheelSpanM: 5.2,
    mtowKg: 5670,
    maxDemonstratedCrosswindKt: 25,
    categoryCode: '2B',
    typicalUse: 'Aviación Ejecutiva / Sanitaria / Corporativa'
  },
  {
    id: 'pc12',
    model: 'PC-12 NGX',
    manufacturer: 'Pilatus',
    referenceFieldLengthM: 755,
    wingspanM: 16.28,
    outerMainGearWheelSpanM: 4.5,
    mtowKg: 4740,
    maxDemonstratedCrosswindKt: 20,
    categoryCode: '2B',
    typicalUse: 'Transporte Ejecutivo / Pistas no Pavimentadas'
  },
  {
    id: 'c208',
    model: 'Grand Caravan EX 208B',
    manufacturer: 'Cessna',
    referenceFieldLengthM: 660,
    wingspanM: 15.87,
    outerMainGearWheelSpanM: 3.9,
    mtowKg: 3995,
    maxDemonstratedCrosswindKt: 20,
    categoryCode: '1B',
    typicalUse: 'Carga Rural / Pasajeros / Operación en Pistas Cortas'
  }
];
