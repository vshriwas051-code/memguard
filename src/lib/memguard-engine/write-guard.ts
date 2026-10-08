import { CandidateMemory, EvidenceBundle, SecurityDecision } from "./types";
import { normalizeMemory } from "./normalizer";
import { evaluateTrust, calculateSensitivity, detectPoisoningSignals, calculateRiskScore } from "./classification";
import { detectConflicts, ExistingMemory } from "./conflict-detector";
import { evaluatePolicy } from "./policy-engine";

export async function guardMemoryWrite(
  candidate: CandidateMemory,
  existingContext: ExistingMemory[]
): Promise<EvidenceBundle> {
  // 1. Normalize
  const normalizedContent = normalizeMemory(candidate.content);

  // 2. Trust
  const trustScore = evaluateTrust(candidate.provenance);
  const originTrust = candidate.provenance.length > 0 ? candidate.provenance[0].trust : trustScore;

  // 3. Classification
  const sensitivity = calculateSensitivity(candidate.category, candidate.content);

  // 4. Rule-based Signals
  const ruleSignals = detectPoisoningSignals(candidate.content);

  // 5. Conflict Detection
  const conflicts = detectConflicts(candidate, existingContext);
  const hasConflict = conflicts.some((c) => c.hasConflict);

  // 6. Risk Scoring
  const riskScore = calculateRiskScore(trustScore, sensitivity, ruleSignals, hasConflict);

  // 7. Bundle Evidence
  const bundle: EvidenceBundle = {
    candidate,
    normalizedContent,
    originTrust,
    trustScore,
    riskScore,
    confidence: 100 - riskScore / 2, // Heuristic
    sensitivity,
    conflicts,
    semanticSignals: [], // No LLM for MVP fallback
    ruleSignals,
    policyRulesTriggered: [],
    finalDecision: "ALLOW", // placeholder
    explanation: ""
  };

  // 8. Policy Evaluation
  bundle.finalDecision = evaluatePolicy(bundle);

  return bundle;
}
