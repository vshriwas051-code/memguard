// In a real app, this would use DB models. We use any for MVP isolation.
export function guardMemoryRetrieval(rawMemories: any[]): any[] {
  return rawMemories.filter((mem) => {
    // Quarantine and Review memories must NEVER automatically enter trusted agent context
    if (mem.status === "quarantined" || mem.status === "review" || mem.status === "rejected" || mem.status === "superseded") {
      return false;
    }
    
    // Only return verified or trusted memories
    return mem.status === "verified" || mem.status === "trusted";
  });
}
