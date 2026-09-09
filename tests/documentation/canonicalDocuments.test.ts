import { describe, it, expect } from 'vitest';
import {
  CANONICAL_DOCUMENTS_LIST,
  generateCanonicalDocumentation,
  generateInitialChecklist
} from '../../src/data/regulatoryRequirements';

describe('Documentación Regulatoria - Lista Canónica LAD/LADH', () => {
  const CANONICAL_IDS = [
    'ANAC-NOTA',
    'ANAC-FORM',
    'ANAC-DENOM',
    'ANAC-RESP',
    'ANAC-CONT',
    'ANAC-TEC-LAD',
    'ANAC-TEC-LADH',
    'ANAC-TAS',
    'ANAC-REG-MOV',
    'ESC-DOM',
    'ESC-PLANO',
    'ESC-PODER',
    'ESC-ACTA',
    'AMB-DJA',
    'FRONT-LEY',
    'AGRO-RAAC137'
  ];

  const BANNED_HABILITATION_TERMS = [
    'Memoria Técnica',
    'Plano de Implantación',
    'SLO',
    'Estudio Climatológico',
    'Estudio Geotécnico',
    'Plan SSEI',
    'ENACOM',
    'Zonificación Municipal',
    'RAAC 153',
    'RAAC 154'
  ];

  it('contains exactly the 16 canonical items in CANONICAL_DOCUMENTS_LIST', () => {
    expect(CANONICAL_DOCUMENTS_LIST).toHaveLength(16);
    const ids = CANONICAL_DOCUMENTS_LIST.map(d => d.id);
    expect(ids.sort()).toEqual([...CANONICAL_IDS].sort());
  });

  it('does NOT contain any banned full aerodrome habilitation terms', () => {
    CANONICAL_DOCUMENTS_LIST.forEach(doc => {
      BANNED_HABILITATION_TERMS.forEach(banned => {
        expect(doc.titulo).not.toContain(banned);
        expect(doc.id).not.toContain(banned);
      });
    });
  });

  it('respects required fields structure and initial state "Pendiente"', () => {
    const docs = generateCanonicalDocumentation({ projectType: 'LAD' });
    docs.forEach(item => {
      expect(item.id).toBeDefined();
      expect(CANONICAL_IDS).toContain(item.id);
      expect(['Obligatorio', 'Condicional']).toContain(item.categoria);
      expect(['ANAC', 'ESCRIBANÍA', 'AMBIENTAL', 'DEFENSA']).toContain(item.organismo);
      expect(item.organismo_dependencia).toBeTruthy();
      expect(item.titulo).toBeTruthy();
      expect(item.descripcion).toBeTruthy();
      expect(item.estado).toBe('Pendiente');
    });
  });

  it('includes ANAC-TEC-LAD for LAD and omits ANAC-TEC-LADH', () => {
    const docs = generateCanonicalDocumentation({ projectType: 'LAD' });
    const ids = docs.map(d => d.id);
    expect(ids).toContain('ANAC-TEC-LAD');
    expect(ids).not.toContain('ANAC-TEC-LADH');
  });

  it('includes ANAC-TEC-LADH for LADH and omits ANAC-TEC-LAD', () => {
    const docs = generateCanonicalDocumentation({ projectType: 'LADH' });
    const ids = docs.map(d => d.id);
    expect(ids).toContain('ANAC-TEC-LADH');
    expect(ids).not.toContain('ANAC-TEC-LAD');
  });

  it('omits FRONT-LEY when isFrontierZone is false or not provided', () => {
    const docsNoFrontier = generateCanonicalDocumentation({ projectType: 'LAD', isFrontierZone: false });
    const ids = docsNoFrontier.map(d => d.id);
    expect(ids).not.toContain('FRONT-LEY');
  });

  it('includes FRONT-LEY under DEFENSA when isFrontierZone is true', () => {
    const docsFrontier = generateCanonicalDocumentation({ projectType: 'LAD', isFrontierZone: true });
    const frontItem = docsFrontier.find(d => d.id === 'FRONT-LEY');
    expect(frontItem).toBeDefined();
    expect(frontItem?.organismo).toBe('DEFENSA');
    expect(frontItem?.descripcion).toContain('Ley 23.554 y el Decreto-Ley 15.385/44');
  });

  it('omits AGRO-RAAC137 when isAgroEventual is false or not provided', () => {
    const docs = generateCanonicalDocumentation({ projectType: 'LAD', isAgroEventual: false });
    const ids = docs.map(d => d.id);
    expect(ids).not.toContain('AGRO-RAAC137');
  });

  it('includes AGRO-RAAC137 when isAgroEventual is true and clarifies that it replaces LAD', () => {
    const docs = generateCanonicalDocumentation({ projectType: 'LAD', isAgroEventual: true });
    const agroItem = docs.find(d => d.id === 'AGRO-RAAC137');
    expect(agroItem).toBeDefined();
    expect(agroItem?.organismo).toBe('ANAC');
    expect(agroItem?.organismo_dependencia).toBe('Dirección Nacional de Seguridad Operacional (DNSO)');
    expect(agroItem?.descripcion).toContain('reemplaza al registro LAD estándar, no lo complementa');
  });

  it('strictly groups and orders documents: ANAC -> ESCRIBANÍA -> AMBIENTAL -> DEFENSA -> ANAC (DNSO)', () => {
    const docs = generateCanonicalDocumentation({
      projectType: 'LAD',
      isFrontierZone: true,
      isAgroEventual: true
    });

    // Check relative ordering of sections
    const anacStandardIndices = docs
      .map((d, i) => (d.organismo === 'ANAC' && d.id !== 'AGRO-RAAC137' ? i : -1))
      .filter(i => i !== -1);
    const escribaniaIndices = docs
      .map((d, i) => (d.organismo === 'ESCRIBANÍA' ? i : -1))
      .filter(i => i !== -1);
    const ambientalIndices = docs
      .map((d, i) => (d.organismo === 'AMBIENTAL' ? i : -1))
      .filter(i => i !== -1);
    const defensaIndices = docs
      .map((d, i) => (d.organismo === 'DEFENSA' ? i : -1))
      .filter(i => i !== -1);
    const agroIndices = docs
      .map((d, i) => (d.id === 'AGRO-RAAC137' ? i : -1))
      .filter(i => i !== -1);

    const maxAnacStandard = Math.max(...anacStandardIndices);
    const minEscribania = Math.min(...escribaniaIndices);
    const maxEscribania = Math.max(...escribaniaIndices);
    const minAmbiental = Math.min(...ambientalIndices);
    const maxAmbiental = Math.max(...ambientalIndices);
    const minDefensa = Math.min(...defensaIndices);
    const maxDefensa = Math.max(...defensaIndices);
    const minAgro = Math.min(...agroIndices);

    expect(maxAnacStandard).toBeLessThan(minEscribania);
    expect(maxEscribania).toBeLessThan(minAmbiental);
    expect(maxAmbiental).toBeLessThan(minDefensa);
    expect(maxDefensa).toBeLessThan(minAgro);
  });

  it('generateInitialChecklist alias produces identical output to generateCanonicalDocumentation', () => {
    const list1 = generateCanonicalDocumentation({ projectType: 'LADH', isFrontierZone: true });
    const list2 = generateInitialChecklist({ projectType: 'LADH', isFrontierZone: true });
    expect(list1).toEqual(list2);
  });
});
