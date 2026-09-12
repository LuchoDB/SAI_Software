import { describe, it, expect } from 'vitest';
import {
  CANONICAL_DOCUMENTS_LIST,
  generateCanonicalDocumentation,
  generateInitialChecklist
} from '../../src/data/regulatoryRequirements';

describe('Documentación Regulatoria Canónica - SAI Consult', () => {
  const ALL_CANONICAL_IDS = [
    // ANAC Pistas
    'ANAC-NOTA',
    'ANAC-FORM',
    'ANAC-TAS',
    'ANAC-REG-MOV',
    // Escribanía & Dominio
    'ESC-DOM',
    'ESC-PLANO',
    'ESC-ACTA-CONST',
    'ESC-AUTORIZ-DIR',
    'ESC-CONDOM',
    'ESC-DNI-TITULARES',
    'ESC-PODER',
    // Ambiental & Territorial
    'AMB-DJA',
    'AMB-USO-SUELO',
    // Defensa
    'FRONT-LEY',
    // Campo Eventual Agroaéreo
    'AGRO-FORM-DENUNCIA',
    'AGRO-AUTORIZ-PREDIO',
    'AGRO-CROQUIS-COORD',
    // Gestoría Aeronáutica (RNA)
    'GEST-DOM',
    'GEST-TRANSF',
    'GEST-MATRIC',
    'GEST-TRANSF-DOM',
    // Alquiler de Aeronaves
    'ALQ-CONTRATO',
    'ALQ-POLIZA',
    'ALQ-CERT-AERO',
    'ALQ-TRIPULACION'
  ];

  const BANNED_HABILITATION_TERMS = [
    'Memoria Técnica',
    'Plano de Implantación',
    'SLO',
    'Estudio Climatológico',
    'Estudio Geotécnico',
    'Plan SSEI',
    'ENACOM'
  ];

  it('contains exactly the 25 canonical items in CANONICAL_DOCUMENTS_LIST', () => {
    expect(CANONICAL_DOCUMENTS_LIST).toHaveLength(25);
    const ids = CANONICAL_DOCUMENTS_LIST.map(d => d.id);
    expect(ids.sort()).toEqual([...ALL_CANONICAL_IDS].sort());
  });

  it('does NOT contain any banned full aerodrome habilitation terms', () => {
    CANONICAL_DOCUMENTS_LIST.forEach(doc => {
      BANNED_HABILITATION_TERMS.forEach(banned => {
        expect(doc.titulo).not.toContain(banned);
        expect(doc.id).not.toContain(banned);
      });
    });
  });

  it('generates standard Pistas documentation with unified form and environmental requirements', () => {
    const docs = generateCanonicalDocumentation({
      category: 'Pistas',
      ownershipType: 'Razon Social',
      sociedadType: 'S.A.',
      isFrontierZone: false
    });

    const ids = docs.map(d => d.id);
    // Unified form (consolidating denomination, legal responsible, contact and technical data)
    expect(ids).toContain('ANAC-FORM');
    expect(ids).toContain('ANAC-NOTA');
    expect(ids).toContain('ANAC-TAS');
    expect(ids).toContain('ANAC-REG-MOV');
    expect(ids).toContain('ESC-DOM');
    expect(ids).toContain('ESC-PLANO');
    // Environmental & Zoning
    expect(ids).toContain('AMB-DJA');
    expect(ids).toContain('AMB-USO-SUELO');
    // Frontier is omitted when false
    expect(ids).not.toContain('FRONT-LEY');

    // Corporate docs for S.A.
    expect(ids).toContain('ESC-ACTA-CONST');
    expect(ids).toContain('ESC-AUTORIZ-DIR');
    expect(ids).toContain('ESC-PODER');

    const formDoc = docs.find(d => d.id === 'ANAC-FORM');
    expect(formDoc?.descripcion).toContain('rumbo magnético, coordenadas WGS-84');
  });

  it('generates specific corporate documentation for multiple society types (S.A., S.R.L., Cooperativa, S.A.S.)', () => {
    // 1. Sociedad Anónima
    const saDocs = generateCanonicalDocumentation({
      category: 'Pistas',
      ownershipType: 'Razon Social',
      sociedadType: 'S.A.'
    });
    const saActa = saDocs.find(d => d.id === 'ESC-ACTA-CONST');
    const saAutoriz = saDocs.find(d => d.id === 'ESC-AUTORIZ-DIR');
    expect(saActa?.titulo).toContain('(S.A.)');
    expect(saAutoriz?.titulo).toContain('Directorio');

    // 2. S.R.L.
    const srlDocs = generateCanonicalDocumentation({
      category: 'Pistas',
      ownershipType: 'Razon Social',
      sociedadType: 'S.R.L.'
    });
    const srlActa = srlDocs.find(d => d.id === 'ESC-ACTA-CONST');
    const srlAutoriz = srlDocs.find(d => d.id === 'ESC-AUTORIZ-DIR');
    expect(srlActa?.titulo).toContain('(S.R.L.)');
    expect(srlAutoriz?.titulo).toContain('Gerencia');

    // 3. Cooperativa
    const coopDocs = generateCanonicalDocumentation({
      category: 'Pistas',
      ownershipType: 'Razon Social',
      sociedadType: 'Cooperativa'
    });
    const coopActa = coopDocs.find(d => d.id === 'ESC-ACTA-CONST');
    const coopAutoriz = coopDocs.find(d => d.id === 'ESC-AUTORIZ-DIR');
    expect(coopActa?.titulo).toContain('INAES');
    expect(coopAutoriz?.titulo).toContain('Consejo de Administración');

    // 4. S.A.S.
    const sasDocs = generateCanonicalDocumentation({
      category: 'Pistas',
      ownershipType: 'Razon Social',
      sociedadType: 'S.A.S.'
    });
    const sasActa = sasDocs.find(d => d.id === 'ESC-ACTA-CONST');
    const sasAutoriz = sasDocs.find(d => d.id === 'ESC-AUTORIZ-DIR');
    expect(sasActa?.titulo).toContain('(S.A.S.)');
    expect(sasAutoriz?.titulo).toContain('Administrador Titular');

    // 5. Fideicomiso
    const fidDocs = generateCanonicalDocumentation({
      category: 'Pistas',
      ownershipType: 'Razon Social',
      sociedadType: 'Fideicomiso'
    });
    const fidActa = fidDocs.find(d => d.id === 'ESC-ACTA-CONST');
    const fidAutoriz = fidDocs.find(d => d.id === 'ESC-AUTORIZ-DIR');
    expect(fidActa?.titulo).toContain('Fideicomiso');
    expect(fidAutoriz?.titulo).toContain('Fiduciario');
  });

  it('adjusts documentation for Titular Único vs Titulares Varios (Condominio)', () => {
    // Titular Único
    const unicoDocs = generateCanonicalDocumentation({
      category: 'Pistas',
      ownershipType: 'Titular Unico'
    });
    const unicoIds = unicoDocs.map(d => d.id);
    expect(unicoIds).toContain('ESC-DNI-TITULARES');
    expect(unicoIds).not.toContain('ESC-CONDOM');
    expect(unicoIds).not.toContain('ESC-ACTA-CONST');

    // Titulares Varios
    const variosDocs = generateCanonicalDocumentation({
      category: 'Pistas',
      ownershipType: 'Titulares Varios'
    });
    const variosIds = variosDocs.map(d => d.id);
    expect(variosIds).toContain('ESC-CONDOM');
    expect(variosIds).toContain('ESC-DNI-TITULARES');
    expect(variosIds).not.toContain('ESC-ACTA-CONST');
  });

  it('restricts Campo Eventual (RAAC 137) strictly to the only documents needed to denounce it ante DNSO', () => {
    const agroDocs = generateCanonicalDocumentation({
      category: 'Pistas',
      isAgroEventual: true,
      ownershipType: 'Titular Unico'
    });
    const agroIds = agroDocs.map(d => d.id);

    // Only essential docs to denounce ante DNSO
    expect(agroIds).toContain('AGRO-FORM-DENUNCIA');
    expect(agroIds).toContain('AGRO-AUTORIZ-PREDIO');
    expect(agroIds).toContain('AGRO-CROQUIS-COORD');
    expect(agroIds).toContain('AMB-USO-SUELO');

    // Standard LAD items are omitted
    expect(agroIds).not.toContain('ANAC-FORM');
    expect(agroIds).not.toContain('ANAC-TAS');
    expect(agroIds).not.toContain('ANAC-REG-MOV');
  });

  it('generates Gestoría Aeronáutica documentation with RNA procedures', () => {
    const gestoriaDocs = generateCanonicalDocumentation({
      category: 'Gestoria',
      ownershipType: 'Titular Unico'
    });
    const ids = gestoriaDocs.map(d => d.id);

    expect(ids).toContain('GEST-DOM');
    expect(ids).toContain('GEST-TRANSF');
    expect(ids).toContain('GEST-MATRIC');
    expect(ids).toContain('GEST-TRANSF-DOM');
    expect(ids).toContain('ESC-DNI-TITULARES');
  });

  it('generates Alquiler de Aeronave documentation with locación requirements', () => {
    const rentalDocs = generateCanonicalDocumentation({
      category: 'Alquiler de Aeronave',
      ownershipType: 'Razon Social',
      sociedadType: 'S.R.L.'
    });
    const ids = rentalDocs.map(d => d.id);

    expect(ids).toContain('ALQ-CONTRATO');
    expect(ids).toContain('ALQ-POLIZA');
    expect(ids).toContain('ALQ-CERT-AERO');
    expect(ids).toContain('ALQ-TRIPULACION');
    expect(ids).toContain('ESC-ACTA-CONST');
    expect(ids).toContain('ESC-AUTORIZ-DIR');
  });

  it('generates only rental requirements when personeria is not specified for Alquiler de Aeronave', () => {
    const rentalDocs = generateCanonicalDocumentation({
      category: 'Alquiler de Aeronave'
    });
    const ids = rentalDocs.map(d => d.id);

    expect(ids).toEqual(['ALQ-CONTRATO', 'ALQ-POLIZA', 'ALQ-CERT-AERO', 'ALQ-TRIPULACION']);
  });

  it('includes FRONT-LEY when isFrontierZone is true and omits when false', () => {
    const frontierDocs = generateCanonicalDocumentation({
      category: 'Pistas',
      isFrontierZone: true
    });
    expect(frontierDocs.map(d => d.id)).toContain('FRONT-LEY');

    const noFrontierDocs = generateCanonicalDocumentation({
      category: 'Pistas',
      isFrontierZone: false
    });
    expect(noFrontierDocs.map(d => d.id)).not.toContain('FRONT-LEY');
  });

  it('initializes items in checklist mode with status "Pendiente", completed false, and observations ready', () => {
    const docs = generateCanonicalDocumentation({
      category: 'Pistas',
      ownershipType: 'Razon Social'
    });

    docs.forEach(doc => {
      expect(doc.id).toBeDefined();
      expect(doc.titulo).toBeTruthy();
      expect(doc.descripcion).toBeTruthy();
      expect(doc.estado).toBe('Pendiente');
      expect(doc.completed).toBe(false);
      expect(doc.observaciones).toBe('');
      expect(doc.notes).toBe('');
    });
  });

  it('generateInitialChecklist alias produces identical output to generateCanonicalDocumentation', () => {
    const list1 = generateCanonicalDocumentation({
      category: 'Pistas',
      sociedadType: 'Cooperativa',
      isFrontierZone: true
    });
    const list2 = generateInitialChecklist({
      category: 'Pistas',
      sociedadType: 'Cooperativa',
      isFrontierZone: true
    });
    expect(list1).toEqual(list2);
  });
});
