export type MemoryCategory = "identity" | "preference" | "payment" | "relationship" | "instruction" | "business" | "travel" | "security" | "authentication" | "contact" | "general";
export type SourceType = "direct_user" | "verified_application" | "verified_system" | "email" | "uploaded_document" | "webpage" | "agent_inference" | "API" | "unknown_external";
export type SensitivityLevel = "low" | "medium" | "high" | "critical";
export type SecurityDecision = "ALLOW" | "ALLOW_WITH_WARNING" | "ASK_USER" | "REVIEW" | "QUARANTINE" | "BLOCK";
export type MemoryStatus = "verified" | "trusted" | "review" | "quarantined" | "rejected" | "superseded" | "expired";

export interface ProvenanceNode {
  id: string;
  source: SourceType;
  trust: number;
  description: string;
}

export interface CandidateMemory {
  id?: string;
  content: string;
  category: MemoryCategory;
  sourceType: SourceType;
  sourceName: string;
  provenance: ProvenanceNode[];
}

export interface ConflictResult {
  hasConflict: boolean;
  conflictingMemoryId?: string;
  conflictType?: "contradiction" | "supersession" | "temporal";
  description?: string;
  conflictingMemoryTrust?: number;
}

export interface EvidenceBundle {
  candidate: CandidateMemory;
  normalizedContent: string;
  originTrust: number;
  trustScore: number;
  riskScore: number;
  confidence: number;
  sensitivity: SensitivityLevel;
  conflicts: ConflictResult[];
  semanticSignals: string[];
  ruleSignals: string[];
  policyRulesTriggered: string[];
  finalDecision: SecurityDecision;
  explanation: string;
}
