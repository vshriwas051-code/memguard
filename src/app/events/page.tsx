import { db } from "@/lib/db";
import { Activity, ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function EventsPage() {
  const events = await db.securityEvent.findMany({
    orderBy: { timestamp: "desc" },
    include: { memory: true }
  });

  return (
    <div className="mx-auto max-w-[1400px] space-y-10 px-4 py-8 sm:px-8">
      <div className="space-y-3">
        <div className="mg-eyebrow flex items-center gap-2"><Activity className="h-3.5 w-3.5 text-[var(--mg-lime)]" /> 04 / Ledger</div>
        <h1 className="text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">
          Security <span className="mg-gradient-text">Audit Log</span>
        </h1>
        <p className="max-w-xl text-[13px] text-white/60">Immutable ledger of all memory security interventions.</p>
      </div>

      <Card className="backdrop-blur-md">
        <CardHeader>
          <CardTitle className="font-normal">System Events</CardTitle>
          <CardDescription>Chronological log of MemGuard policy executions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => {
              const isBlock = event.eventType.includes("block") || event.eventType.includes("quarantine");
              const isReview = event.eventType.includes("review") || event.eventType.includes("ask");
              
              let Icon = ShieldCheck;
              let color = "text-[var(--mg-safe)]";
              
              if (isBlock) {
                Icon = ShieldAlert;
                color = "text-[var(--mg-danger)]";
              } else if (isReview) {
                Icon = Shield;
                color = "text-[var(--mg-warn)]";
              }

              let detailsObj: any = {};
              try { detailsObj = JSON.parse(event.details); } catch(e){}

              return (
                <div key={event.id} className="flex gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <div className={`mt-1 h-fit rounded-full border border-white/10 bg-white/[0.04] p-2`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="flex flex-wrap items-center gap-2 text-sm tracking-wide text-white">
                        {event.eventType.toUpperCase().replace(/_/g, " ")}
                        {detailsObj.policyRulesTriggered && detailsObj.policyRulesTriggered.length > 0 && (
                          <Badge variant="outline" className="border-white/15 bg-white/5 text-xs text-white/75">
                            {detailsObj.policyRulesTriggered[0]}
                          </Badge>
                        )}
                      </p>
                      <span className="text-xs text-white/40">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="rounded-lg border border-white/10 bg-black/30 p-2 font-mono text-sm text-white/80">
                      Target: "{event.memory.content}"
                    </p>
                    {detailsObj.explanation && (
                      <p className="mt-1 text-xs text-white/55">
                        Reason: {detailsObj.explanation}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            
            {events.length === 0 && (
              <div className="py-8 text-center text-white/45">
                No security events recorded.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
