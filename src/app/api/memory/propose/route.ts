import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guardMemoryWrite, CandidateMemory, ExistingMemory } from "@/lib/memguard-engine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Basic structural validation to simulate fallback for malformed AI output
    if (!body || !body.content || !body.category || !body.sourceType) {
      return NextResponse.json({ 
        error: "Malformed candidate memory payload. Rejected." 
      }, { status: 400 });
    }

    const candidate: CandidateMemory = {
      content: String(body.content),
      category: body.category,
      sourceType: body.sourceType,
      sourceName: body.sourceName || "Unknown",
      provenance: Array.isArray(body.provenance) ? body.provenance : [],
    };

    // Load existing verified context from database for conflict detection
    const existingDbMemories = await db.memory.findMany({
      where: {
        status: {
          in: ["verified", "trusted"]
        }
      }
    });

    const existingContext: ExistingMemory[] = existingDbMemories.map(m => ({
      id: m.id,
      content: m.content,
      normalizedContent: m.normalizedContent,
      category: m.category,
      trustScore: m.trustScore,
      status: m.status
    }));

    // Run the candidate through the MemGuard Deterministic Pipeline
    const evidenceBundle = await guardMemoryWrite(candidate, existingContext);

    // Map SecurityDecision to MemoryStatus
    let finalStatus = "review";
    if (evidenceBundle.finalDecision === "ALLOW") finalStatus = "verified";
    if (evidenceBundle.finalDecision === "QUARANTINE" || evidenceBundle.finalDecision === "BLOCK") finalStatus = "quarantined";
    if (evidenceBundle.finalDecision === "ASK_USER") finalStatus = "review";

    // Persist Candidate Memory
    const memory = await db.memory.create({
      data: {
        content: candidate.content,
        normalizedContent: evidenceBundle.normalizedContent,
        category: candidate.category,
        sourceType: candidate.sourceType,
        sourceName: candidate.sourceName,
        originTrust: evidenceBundle.originTrust,
        trustScore: evidenceBundle.trustScore,
        riskScore: evidenceBundle.riskScore,
        confidence: evidenceBundle.confidence,
        sensitivity: evidenceBundle.sensitivity,
        status: finalStatus,
        provenance: JSON.stringify(candidate.provenance),
        conflictsWith: evidenceBundle.conflicts.length > 0 ? evidenceBundle.conflicts[0].conflictingMemoryId : null,
      }
    });

    // Create a Security Event reflecting this decision
    await db.securityEvent.create({
      data: {
        memoryId: memory.id,
        eventType: `memory_${evidenceBundle.finalDecision.toLowerCase()}`,
        details: JSON.stringify({
          policyRulesTriggered: evidenceBundle.policyRulesTriggered,
          conflicts: evidenceBundle.conflicts,
          explanation: evidenceBundle.explanation,
          ruleSignals: evidenceBundle.ruleSignals,
          semanticSignals: evidenceBundle.semanticSignals
        })
      }
    });

    return NextResponse.json({ 
      success: true,
      decision: evidenceBundle.finalDecision,
      memory, 
      evidenceBundle 
    });
  } catch (error) {
    console.error("MemGuard Propose error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
