export type AgentType = 'DESIGN' | 'COPYWRITING' | 'LEGAL' | 'ORCHESTRATOR';

export type AgentSeverity = 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';

export interface AgentFinding {
  id: string;
  agent: AgentType;
  severity: AgentSeverity;
  category: string;
  title: string;
  description: string;
  actionRequired?: string;
}

export interface AgentState {
  type: AgentType;
  name: string;
  roleDescription: string;
  avatarIcon: string;
  status: 'OPTIMAL' | 'ATTENTION' | 'ALERT';
  activeFindingsCount: number;
}

export interface OrchestratorVerdict {
  clientId: string;
  clientName: string;
  globalStatus: 'FAVORABLE' | 'FAVORABLE_WITH_RESTRICTIONS' | 'NOT_FAVORABLE';
  scorePercent: number; // 0 a 100
  evaluatedAt: string;
  executiveSummary: string;
  legalCompliance: {
    anac: boolean;
    enacom: boolean;
    catastro: boolean;
    ambiental: boolean;
  };
  technicalFeasibility: {
    windUsability: boolean;
    geometryCompliant: boolean;
    clearanceCompliant: boolean;
  };
  documentationProgress: {
    total: number;
    approved: number;
    inProgress: number;
    pending: number;
    observed: number;
    completionPercent: number;
  };
  findings: AgentFinding[];
  criticalBlockers: string[];
  recommendations: string[];
}
