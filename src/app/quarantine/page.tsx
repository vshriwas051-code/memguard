import { db } from "@/lib/db";
import { ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function QuarantinePage() {
  const quarantined = await db.memory.findMany({
    where: {
      status: { in: ["quarantined", "review"] }
    },
    orderBy: { createdAt: "desc" },
    include: {
      events: {
        orderBy: { timestamp: "desc" },
        take: 1
      }
    }
  });

  return (
    <div className="mx-auto max-w-[1400px] space-y-10 px-4 py-8 sm:px-8">
      <div className="space-y-3">
        <div className="mg-eyebrow flex items-center gap-2"><ShieldAlert className="h-3.5 w-3.5 text-[var(--mg-danger)]" /> 03 / Isolation</div>
        <h1 className="text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">
          Quarantine <span className="mg-gradient-text">Zone</span>
        </h1>
        <p className="max-w-xl text-[13px] text-white/60">Memories isolated by the MemGuard policy engine pending human review.</p>
      </div>

      <div className="grid gap-6">
        {quarantined.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-white/45">
            No memories currently in quarantine. System is clear.
          </div>
        ) : (
          quarantined.map((memory) => {
            let eventDetails: any = {};
            try {
              if (memory.events[0]?.details) {
                eventDetails = JSON.parse(memory.events[0].details);
              }
            } catch (e) {}

            return (
              <Card key={memory.id} className="ring-[var(--mg-danger)]/25 backdrop-blur-md">
                <CardHeader className="border-b border-white/10 pb-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <CardTitle className="flex flex-wrap items-center gap-2 text-lg font-normal">
                        Intercepted {memory.category} Memory
                        <Badge variant="outline" className="border-[var(--mg-danger)]/40 bg-[var(--mg-danger)]/10 text-[var(--mg-danger)]">
                          {memory.status.toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Source: {memory.sourceName} ({memory.sourceType})
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {/* For hackathon demo, these are purely visual non-functional buttons */}
                      <Button variant="outline" size="sm" className="border-white/15 bg-transparent hover:border-[var(--mg-safe)]/50 hover:bg-[var(--mg-safe)]/10 hover:text-[var(--mg-safe)]">
                        <CheckCircle className="mr-2 h-4 w-4" /> Verify & Allow
                      </Button>
                      <Button variant="outline" size="sm" className="border-white/15 bg-transparent hover:border-[var(--mg-danger)]/50 hover:bg-[var(--mg-danger)]/10 hover:text-[var(--mg-danger)]">
                        <XCircle className="mr-2 h-4 w-4" /> Reject & Purge
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="rounded-lg border border-white/10 bg-black/30 p-4 font-mono text-sm text-[var(--mg-lime)]">
                    "{memory.content}"
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <div className="mg-eyebrow mb-1">Triggered Rules</div>
                      <div className="text-sm text-[var(--mg-warn)]">
                        {eventDetails.policyRulesTriggered?.join(", ") || "Unknown Rule"}
                      </div>
                    </div>
                    <div>
                      <div className="mg-eyebrow mb-1">Risk Score</div>
                      <div className="text-sm font-medium text-[var(--mg-danger)]">
                        {memory.riskScore} / 100
                      </div>
                    </div>
                    <div>
                      <div className="mg-eyebrow mb-1">Sensitivity</div>
                      <div className="text-sm text-[var(--mg-danger)]">
                        {memory.sensitivity.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  {eventDetails.explanation && (
                    <div className="mt-4 rounded-lg border border-[var(--mg-danger)]/25 bg-[var(--mg-danger)]/[0.06] p-3 text-sm text-white/80">
                      <strong>AI Security Analyst:</strong> {eventDetails.explanation}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
