import { SourceType } from "./types";

export function getBaseSourceAuthority(sourceType: SourceType): number {
  switch (sourceType) {
    case "direct_user":
      return 100;
    case "verified_application":
      return 85;
    case "verified_system":
      return 80;
    case "email":
      return 60;
    case "uploaded_document":
      return 45;
    case "webpage":
      return 30;
    case "agent_inference":
      return 25;
    case "unknown_external":
      return 15;
    case "API":
      return 50;
    default:
      return 15;
  }
}
