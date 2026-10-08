import { CandidateMemory, ConflictResult } from "./types";
import { normalizeMemory } from "./normalizer";

// Mock DB context since these are pure functions
export interface ExistingMemory {
  id: string;
  content: string;
  normalizedContent: string;
  category: string;
  trustScore: number;
  status: string;
}

export function detectConflicts(candidate: CandidateMemory, existingMemories: ExistingMemory[]): ConflictResult[] {
  const conflicts: ConflictResult[] = [];
  const candidateNorm = normalizeMemory(candidate.content);
  
  for (const mem of existingMemories) {
    if (mem.status !== "verified" && mem.status !== "trusted") {
      continue; // Only conflict against trusted context
    }

    // Heuristic 1: Exact match contradiction or override in the same category
    // For MVP hackathon demo: detect if both memories talk about ACME payment accounts
    if (candidate.category === "payment" && mem.category === "payment") {
      const isCandidateAcme = candidateNorm.includes("acme");
      const isMemAcme = mem.normalizedContent.includes("acme");

      if (isCandidateAcme && isMemAcme) {
        // Find 4 digit account numbers
        const candidateAccountMatch = candidateNorm.match(/\d{4}/);
        const memAccountMatch = mem.normalizedContent.match(/\d{4}/);
        
        if (candidateAccountMatch && memAccountMatch && candidateAccountMatch[0] !== memAccountMatch[0]) {
          conflicts.push({
            hasConflict: true,
            conflictType: "contradiction",
            conflictingMemoryId: mem.id,
            description: `Incoming payment information attempts to modify existing verified financial memory (Account ${memAccountMatch[0]} vs ${candidateAccountMatch[0]})`,
            conflictingMemoryTrust: mem.trustScore
          });
        }
      }
    }

    // Semantic conflict heuristic (if not strictly structural)
    // If it's the exact same string, it's just a duplicate, not a conflict.
  }

  return conflicts;
}
