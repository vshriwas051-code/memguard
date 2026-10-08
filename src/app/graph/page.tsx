import { db } from "@/lib/db";
import { GraphClient } from "./graph-client";
import { Network } from "lucide-react";

export default async function GraphPage() {
  const memories = await db.memory.findMany({
    orderBy: { createdAt: "asc" }
  });

  // Prepare nodes and edges
  const nodes: any[] = [];
  const edges: any[] = [];
  
  // Group by category for X spacing
  const categoryX: Record<string, number> = {};
  let currentX = 100;

  memories.forEach((mem, idx) => {
    if (!categoryX[mem.category]) {
      categoryX[mem.category] = currentX;
      currentX += 300;
    }

    const isVerified = mem.status === "verified";
    const isQuarantined = mem.status === "quarantined";
    
    // We add a random Y offset for visual spreading within the same category column
    const yOffset = (idx % 5) * 100 + 50;
    
    nodes.push({
      id: mem.id,
      position: { x: categoryX[mem.category], y: yOffset },
      data: { 
        label: `${mem.category.toUpperCase()}\n${mem.status.toUpperCase()}`,
        content: mem.content,
        status: mem.status
      },
      type: 'default',
      style: {
        background: isVerified ? '#064e3b' : isQuarantined ? '#4c0519' : '#451a03',
        color: isVerified ? '#34d399' : isQuarantined ? '#f43f5e' : '#fbbf24',
        border: `1px solid ${isVerified ? '#059669' : isQuarantined ? '#e11d48' : '#d97706'}`,
        borderRadius: '8px',
        padding: '10px',
        width: 200,
        fontSize: '12px'
      }
    });

    if (mem.conflictsWith) {
      edges.push({
        id: `e-${mem.id}-${mem.conflictsWith}`,
        source: mem.id,
        target: mem.conflictsWith,
        animated: true,
        style: { stroke: '#f43f5e', strokeWidth: 2 }
      });
    }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Network className="h-8 w-8 text-blue-500" />
          Memory Graph
        </h1>
        <p className="text-muted-foreground mt-1">Topology of verified context and intercepted attacks.</p>
      </div>

      <div className="flex-1 bg-slate-950/50 border border-slate-800 rounded-lg overflow-hidden">
        <GraphClient initialNodes={nodes} initialEdges={edges} />
      </div>
    </div>
  );
}
