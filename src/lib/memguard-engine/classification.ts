import { MemoryCategory, SensitivityLevel, ProvenanceNode } from "./types";
import { getBaseSourceAuthority } from "./source-authority";

export function calculateSensitivity(category: MemoryCategory, content: string): SensitivityLevel {
  const c = content.toLowerCase();

  if (
    category === "payment" ||
    category === "authentication" ||
    c.includes("password") ||
    c.includes("credential") ||
    c.includes("api key") ||
    c.includes("account ending")
  ) {
    return "critical";
  }

  if (
    category === "identity" ||
    category === "security" ||
    c.includes("phone number") ||
    c.includes("ssn")
  ) {
    return "high";
  }

  if (category === "contact" || category === "business") {
    return "medium";
  }

  return "low";
}

export function detectPoisoningSignals(content: string): string[] {
  const signals: string[] = [];
  const c = content.toLowerCase();

  if (c.includes("ignore previous instructions") || c.includes("forget what i said")) {
    signals.push("prompt_injection_attempt");
  }

  if (c.includes("from now on") && (c.includes("always") || c.includes("permanently"))) {
    signals.push("persistent_behavior_modification");
  }

  if (c.match(/when.*is mentioned.*upload/)) {
    signals.push("sleeper_instruction_exfiltration");
  }

  return signals;
}

export function evaluateTrust(provenance: ProvenanceNode[]): number {
  if (provenance.length === 0) return 15; // Unknown

  // Original source is the very first node in provenance
  const originalSource = provenance[0];
  const originalTrust = getBaseSourceAuthority(originalSource.source);

  // If there are transformations, trust decays slightly or takes the lowest bound
  let minTrust = originalTrust;
  for (const node of provenance) {
    const nodeTrust = getBaseSourceAuthority(node.source);
    if (nodeTrust < minTrust) {
      minTrust = nodeTrust;
    }
  }

  return minTrust;
}

export function calculateRiskScore(
  trustScore: number,
  sensitivity: SensitivityLevel,
  signals: string[],
  hasConflict: boolean
): number {
  let risk = 100 - trustScore;

  if (sensitivity === "critical") risk += 30;
  else if (sensitivity === "high") risk += 20;
  else if (sensitivity === "medium") risk += 10;

  if (hasConflict) risk += 40;

  if (signals.includes("prompt_injection_attempt")) risk += 50;
  if (signals.includes("sleeper_instruction_exfiltration")) risk += 60;
  if (signals.includes("persistent_behavior_modification")) risk += 20;

  return Math.min(Math.max(risk, 0), 100);
}
