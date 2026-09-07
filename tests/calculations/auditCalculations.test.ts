import { describe, it, expect } from 'vitest';
import {
  calculateDocumentSummary,
  calculateViabilityScore
} from '../../src/calculations/auditCalculations';
import { DocumentItemModel } from '../../src/types/client';

describe('auditCalculations', () => {
  const sampleDocs: DocumentItemModel[] = [
    {
      id: 'd1',
      category: 'ANAC',
      code: 'ANAC-F501',
      title: 'Formulario de Solicitud',
      description: 'Formulario oficial',
      isMandatory: true,
      status: 'APPROVED'
    },
    {
      id: 'd2',
      category: 'ANAC',
      code: 'ANAC-MEM',
      title: 'Memoria Técnica',
      description: 'Memoria descriptiva',
      isMandatory: true,
      status: 'IN_PROGRESS'
    },
    {
      id: 'd3',
      category: 'ENACOM',
      code: 'ENA-RAD',
      title: 'No Afectación Radioeléctrica',
      description: 'Certificado ENACOM',
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
    const allApprovedDocs = sampleDocs.map(d => ({ ...d, status: 'APPROVED' as const }));
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
    const observedDocs = [
      ...sampleDocs,
      {
        id: 'd4',
        category: 'ANAC' as const,
        code: 'ANAC-PL',
        title: 'Plano Implantación',
        description: 'Plano',
        isMandatory: true,
        status: 'OBSERVED' as const
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
