import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guardMemoryRetrieval } from "@/lib/memguard-engine";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    
    // Fetch from database
    const whereClause: any = {};
    if (category) {
      whereClause.category = category;
    }

    const rawMemories = await db.memory.findMany({
      where: whereClause
    });

    // Run Retrieval Guard
    const safeMemories = guardMemoryRetrieval(rawMemories);

    // Create a retrieval event (optional, for demo visibility)
    if (safeMemories.length > 0) {
      // In a real system, we might log retrieval events. 
      // For now, we just return the safe memories.
    }

    return NextResponse.json({ 
      success: true, 
      count: safeMemories.length,
      filteredCount: rawMemories.length - safeMemories.length,
      memories: safeMemories 
    });
  } catch (error) {
    console.error("MemGuard Retrieval error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
