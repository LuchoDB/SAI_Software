import { describe, it, expect } from 'vitest';
import {
  calculateDocumentSummary,
  calculateViabilityScore
} from '../../src/calculations/auditCalculations';
import { DocumentItemModel } from '../../src/types/client';

describe('auditCalculations', () => {
  const sampleDocs: DocumentItemModel[] = [
    {
      id: 'ANAC-NOTA',
      categoria: 'Obligatorio',
      organismo: 'ANAC',
      organismo_dependencia: 'Dirección de Aeródromos - DGIySA',
      titulo: 'Nota de Presentación',
      descripcion: 'Nota dirigida a la Dirección de Aeródromos describiendo el sitio...',
      estado: 'Aprobado',
      category: 'ANAC',
      code: 'ANAC-NOTA',
      title: 'Nota de Presentación',
      description: 'Nota dirigida a la Dirección de Aeródromos describiendo el sitio...',
      isMandatory: true,
      status: 'APPROVED'
    },
    {
      id: 'ESC-DOM',
      categoria: 'Obligatorio',
      organismo: 'ESCRIBANÍA',
      organismo_dependencia: 'Escribano público',
      titulo: 'Título de Propiedad o Contrato de Locación',
      descripcion: 'Copia certificada por escribano público...',
      estado: 'En trámite',
      category: 'ESCRIBANÍA',
      code: 'ESC-DOM',
      title: 'Título de Propiedad o Contrato de Locación',
      description: 'Copia certificada por escribano público...',
      isMandatory: true,
      status: 'IN_PROGRESS'
    },
    {
      id: 'AMB-DJA',
      categoria: 'Obligatorio',
      organismo: 'AMBIENTAL',
      organismo_dependencia: 'Autoridad ambiental competente',
      titulo: 'Declaración Jurada Ambiental',
      descripcion: 'Declaración Jurada conforme Ley 25.675...',
      estado: 'Pendiente',
      category: 'AMBIENTAL',
      code: 'AMB-DJA',
      title: 'Declaración Jurada Ambiental',
      description: 'Declaración Jurada conforme Ley 25.675...',
      isMandatory: true,
      status: 'PENDING'
    }
  ];

  it('calculates document checklist summary statistics accurately', () => {
    const summary = calculateDocumentSummary(sampleDocs);
    expect(summary.total).toBe(3);
    expect(summary.approved).toBe(1);
    expect(summary.inProgress).toBe(1);
    expect(summary.pending).toBe(1);
    expect(summary.observed).toBe(0);
    expect(summary.mandatoryCount).toBe(3);
    expect(summary.mandatoryApproved).toBe(1);
    expect(summary.progressPercent).toBe(33); // 1/3 ~ 33%
  });

  it('returns FAVORABLE when all conditions, documentation, and technical studies are met', () => {
    const allApprovedDocs = sampleDocs.map(d => ({
      ...d,
      estado: 'Aprobado' as const,
      status: 'APPROVED' as const
    }));
    const summary = calculateDocumentSummary(allApprovedDocs);

    const scoreResult = calculateViabilityScore({
      docSummary: summary,
      windCompliant: true,
      ladFeasibility: 'FEASIBLE'
    });

    expect(scoreResult.globalStatus).toBe('FAVORABLE');
    expect(scoreResult.scorePercent).toBeGreaterThanOrEqual(85);
  });

  it('penalizes and returns NOT_FEASIBLE when documents are observed or technical feasibility is negative', () => {
    const observedDocs: DocumentItemModel[] = [
      ...sampleDocs,
      {
        id: 'ESC-PLANO',
        categoria: 'Obligatorio',
        organismo: 'ESCRIBANÍA',
        organismo_dependencia: 'Escribano público / Catastro',
        titulo: 'Plano Catastral o de Mensura',
        descripcion: 'Plano catastral o de mensura según título...',
        estado: 'Observado',
        category: 'ESCRIBANÍA',
        code: 'ESC-PLANO',
        title: 'Plano Catastral o de Mensura',
        description: 'Plano catastral o de mensura según título...',
        isMandatory: true,
        status: 'OBSERVED'
      }
    ];
    const summary = calculateDocumentSummary(observedDocs);

    const scoreResult = calculateViabilityScore({
      docSummary: summary,
      windCompliant: true,
      ladFeasibility: 'FEASIBLE'
    });

    expect(scoreResult.globalStatus).toBe('NOT_FEASIBLE');
  });
});
