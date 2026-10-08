export function normalizeMemory(content: string): string {
  if (!content) return "";
  
  return content
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") // Remove all non-alphanumeric (including whitespace)
    .trim();
}
