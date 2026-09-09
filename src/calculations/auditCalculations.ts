import { DocumentItemModel } from '../types/client';

export interface DocumentSummary {
  total: number;
  approved: number;
  inProgress: number;
  observed: number;
  pending: number;
  mandatoryCount: number;
  mandatoryApproved: number;
  progressPercent: number;
}

/**
 * Calcula estadísticas y porcentaje de avance de la matriz documental
 */
export function calculateDocumentSummary(documents: DocumentItemModel[]): DocumentSummary {
  const total = documents.length;
  const approved = documents.filter(
    d => d.status === 'APPROVED' || d.estado === 'Aprobado'
  ).length;
  const inProgress = documents.filter(
    d => d.status === 'IN_PROGRESS' || d.estado === 'En trámite'
  ).length;
  const observed = documents.filter(
    d => d.status === 'OBSERVED' || d.estado === 'Observado'
  ).length;
  const pending = documents.filter(
    d => d.status === 'PENDING' || d.estado === 'Pendiente'
  ).length;

  const mandatory = documents.filter(
    d => d.isMandatory || d.categoria === 'Obligatorio'
  );
  const mandatoryApproved = mandatory.filter(
    d => d.status === 'APPROVED' || d.estado === 'Aprobado'
  ).length;

  const progressPercent = total > 0 ? Math.round((approved / total) * 100) : 0;

  return {
    total,
    approved,
    inProgress,
    observed,
    pending,
    mandatoryCount: mandatory.length,
    mandatoryApproved,
    progressPercent
  };
}

export type GlobalAuditStatus = 'FAVORABLE' | 'FAVORABLE_WITH_RESTRICTIONS' | 'NOT_FEASIBLE';

export interface AuditScoreInput {
  docSummary: DocumentSummary;
  windCompliant?: boolean;
  ladFeasibility?: 'FEASIBLE' | 'CONDITIONED' | 'NOT_FEASIBLE';
  ladhFeasibility?: 'FEASIBLE' | 'CONDITIONED' | 'NOT_FEASIBLE';
}

export interface AuditScoreResult {
  scorePercent: number;
  globalStatus: GlobalAuditStatus;
  statusLabel: string;
}

/**
 * Calcula el puntaje de viabilidad técnica global (0-100%) y dictamen
 */
export function calculateViabilityScore(input: AuditScoreInput): AuditScoreResult {
  const { docSummary, windCompliant, ladFeasibility, ladhFeasibility } = input;

  let score = 0;

  // 1. Aporte documental (máximo 40 puntos)
  const docScore = (docSummary.progressPercent / 100) * 40;
  score += docScore;

  // Penalización por documentos observados
  score -= docSummary.observed * 5;

  // 2. Aporte de Viento / QFU (máximo 20 puntos)
  if (windCompliant === true) {
    score += 20;
  } else if (windCompliant === false) {
    score += 8;
  } else {
    score += 15; // neutral si no aplica aún
  }

  // 3. Aporte de Factibilidad Técnica (LAD o LADH) (máximo 40 puntos)
  const techFeasibility = ladFeasibility || ladhFeasibility;
  if (techFeasibility === 'FEASIBLE') {
    score += 40;
  } else if (techFeasibility === 'CONDITIONED') {
    score += 25;
  } else if (techFeasibility === 'NOT_FEASIBLE') {
    score += 5;
  } else {
    score += 25; // neutral
  }

  const boundedScore = Math.max(0, Math.min(100, Math.round(score)));

  let globalStatus: GlobalAuditStatus = 'FAVORABLE';
  let statusLabel = 'FAVORABLE';

  if (docSummary.observed > 0 || techFeasibility === 'NOT_FEASIBLE' || boundedScore < 60) {
    globalStatus = 'NOT_FEASIBLE';
    statusLabel = 'NO FAVORABLE';
  } else if (
    techFeasibility === 'CONDITIONED' ||
    windCompliant === false ||
    boundedScore < 85 ||
    docSummary.mandatoryApproved < docSummary.mandatoryCount
  ) {
    globalStatus = 'FAVORABLE_WITH_RESTRICTIONS';
    statusLabel = 'FAVORABLE CONDICIONADO';
  }

  return {
    scorePercent: boundedScore,
    globalStatus,
    statusLabel
  };
}
