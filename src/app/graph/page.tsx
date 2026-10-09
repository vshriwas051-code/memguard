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
        background: isVerified ? 'rgba(201, 216, 107, 0.10)' : isQuarantined ? 'rgba(240, 100, 138, 0.12)' : 'rgba(233, 181, 98, 0.10)',
        color: isVerified ? '#dce38a' : isQuarantined ? '#f0648a' : '#e9b562',
        border: `1px solid ${isVerified ? 'rgba(201, 216, 107, 0.55)' : isQuarantined ? 'rgba(240, 100, 138, 0.6)' : 'rgba(233, 181, 98, 0.55)'}`,
        borderRadius: '10px',
        padding: '10px',
        width: 200,
        fontSize: '12px',
        fontFamily: 'var(--font-dm-mono), monospace',
        letterSpacing: '0.04em'
      }
    });

    if (mem.conflictsWith) {
      edges.push({
        id: `e-${mem.id}-${mem.conflictsWith}`,
        source: mem.id,
        target: mem.conflictsWith,
        animated: true,
        style: { stroke: '#f0648a', strokeWidth: 1.5 }
      });
    }
  });

  return (
    <div className="mx-auto flex h-[calc(100vh-88px)] min-h-[560px] max-w-[1400px] flex-col gap-8 px-4 py-8 sm:px-8">
      <div className="space-y-3">
        <div className="mg-eyebrow flex items-center gap-2"><Network className="h-3.5 w-3.5 text-[var(--mg-periwinkle)]" /> 05 / Topology</div>
        <h1 className="text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">
          Memory <span className="mg-gradient-text">Graph</span>
        </h1>
        <p className="max-w-xl text-[13px] text-white/60">Topology of verified context and intercepted attacks.</p>
      </div>

      <div className="mg-flow flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md">
        <GraphClient initialNodes={nodes} initialEdges={edges} />
      </div>
    </div>
  );
}
