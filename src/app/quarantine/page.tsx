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
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-rose-500 flex items-center gap-2">
          <ShieldAlert className="h-8 w-8" />
          Quarantine Zone
        </h1>
        <p className="text-muted-foreground mt-1">Memories isolated by the MemGuard policy engine pending human review.</p>
      </div>

      <div className="grid gap-6">
        {quarantined.length === 0 ? (
          <div className="text-center p-12 border border-dashed border-slate-800 rounded-lg text-slate-500">
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
              <Card key={memory.id} className="bg-black/50 border-rose-900/50">
                <CardHeader className="border-b border-white/5 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        Intercepted {memory.category} Memory
                        <Badge variant="outline" className="bg-rose-950/50 text-rose-400 border-rose-900/50">
                          {memory.status.toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Source: {memory.sourceName} ({memory.sourceType})
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {/* For hackathon demo, these are purely visual non-functional buttons */}
                      <Button variant="outline" size="sm" className="bg-slate-900 hover:bg-emerald-950 hover:text-emerald-400 border-slate-800">
                        <CheckCircle className="mr-2 h-4 w-4" /> Verify & Allow
                      </Button>
                      <Button variant="outline" size="sm" className="bg-slate-900 hover:bg-rose-950 hover:text-rose-400 border-slate-800">
                        <XCircle className="mr-2 h-4 w-4" /> Reject & Purge
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="bg-slate-950 p-4 rounded-md border border-slate-800 font-mono text-sm text-rose-200/80">
                    "{memory.content}"
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Triggered Rules</div>
                      <div className="text-sm font-medium text-amber-500">
                        {eventDetails.policyRulesTriggered?.join(", ") || "Unknown Rule"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Risk Score</div>
                      <div className="text-sm font-bold text-rose-500">
                        {memory.riskScore} / 100
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Sensitivity</div>
                      <div className="text-sm font-medium text-rose-400">
                        {memory.sensitivity.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  {eventDetails.explanation && (
                    <div className="mt-4 p-3 bg-rose-950/20 border border-rose-900/30 rounded text-sm text-rose-300">
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
