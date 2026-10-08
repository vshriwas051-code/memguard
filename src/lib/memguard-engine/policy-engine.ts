import { EvidenceBundle, SecurityDecision } from "./types";

export function evaluatePolicy(bundle: EvidenceBundle): SecurityDecision {
  const { trustScore, riskScore, sensitivity, conflicts, ruleSignals } = bundle;
  const hasCriticalConflict = conflicts.some(c => c.conflictingMemoryTrust && c.conflictingMemoryTrust > 80);

  // 1. High trust conflict
  if (hasCriticalConflict && trustScore > 80) {
    bundle.policyRulesTriggered.push("HIGH_TRUST_CONFLICT");
    bundle.explanation = "Two highly trusted sources conflict. Human verification required.";
    return "ASK_USER";
  }

  // 2. Clear malicious intent
  if (ruleSignals.includes("sleeper_instruction_exfiltration") || ruleSignals.includes("prompt_injection_attempt")) {
    bundle.policyRulesTriggered.push("MALICIOUS_INTENT_DETECTED");
    bundle.explanation = "Detected explicit malicious instruction or prompt injection attempt.";
    return "BLOCK";
  }

  // 3. Critical sensitivity with low trust or conflict
  if (sensitivity === "critical") {
    if (hasCriticalConflict && trustScore <= 80) {
      bundle.policyRulesTriggered.push("CRITICAL_SENSITIVITY_CONFLICT");
      bundle.explanation = "Incoming external information attempts to modify an existing verified critical memory (e.g. financial).";
      return "QUARANTINE";
    }
    
    if (trustScore < 50) {
      bundle.policyRulesTriggered.push("CRITICAL_SENSITIVITY_LOW_TRUST");
      bundle.explanation = "Critical information from a low-trust source.";
      return "QUARANTINE";
    }
  }

  // 4. General Risk Thresholds
  if (riskScore >= 80) {
    bundle.policyRulesTriggered.push("HIGH_RISK_SCORE");
    bundle.explanation = `Risk score (${riskScore}) exceeds threshold.`;
    return "QUARANTINE";
  }

  if (riskScore >= 60) {
    bundle.policyRulesTriggered.push("MODERATE_RISK_SCORE");
    bundle.explanation = `Moderate risk score (${riskScore}).`;
    return "REVIEW";
  }

  // Default Allow
  bundle.policyRulesTriggered.push("DEFAULT_ALLOW");
  bundle.explanation = "No high risk signals detected.";
  return "ALLOW";
}
