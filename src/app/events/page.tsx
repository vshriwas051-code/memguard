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
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Activity className="h-8 w-8 text-emerald-500" />
          Security Audit Log
        </h1>
        <p className="text-muted-foreground mt-1">Immutable ledger of all memory security interventions.</p>
      </div>

      <Card className="bg-black/50">
        <CardHeader>
          <CardTitle>System Events</CardTitle>
          <CardDescription>Chronological log of MemGuard policy executions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => {
              const isBlock = event.eventType.includes("block") || event.eventType.includes("quarantine");
              const isReview = event.eventType.includes("review") || event.eventType.includes("ask");
              
              let Icon = ShieldCheck;
              let color = "text-emerald-500";
              
              if (isBlock) {
                Icon = ShieldAlert;
                color = "text-rose-500";
              } else if (isReview) {
                Icon = Shield;
                color = "text-amber-500";
              }

              let detailsObj: any = {};
              try { detailsObj = JSON.parse(event.details); } catch(e){}

              return (
                <div key={event.id} className="flex gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className={`mt-1 bg-slate-900 p-2 rounded-full border border-white/5`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm flex items-center gap-2">
                        {event.eventType.toUpperCase().replace(/_/g, " ")}
                        {detailsObj.policyRulesTriggered && detailsObj.policyRulesTriggered.length > 0 && (
                          <Badge variant="outline" className="text-xs bg-slate-900 border-slate-700 text-slate-300">
                            {detailsObj.policyRulesTriggered[0]}
                          </Badge>
                        )}
                      </p>
                      <span className="text-xs text-slate-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 bg-slate-950 p-2 rounded border border-slate-800 font-mono">
                      Target: "{event.memory.content}"
                    </p>
                    {detailsObj.explanation && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Reason: {detailsObj.explanation}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            
            {events.length === 0 && (
              <div className="text-center text-slate-500 py-8">
                No security events recorded.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
