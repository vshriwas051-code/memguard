import { db as prisma } from "../src/lib/db";

async function main() {
  console.log("Seeding database...");

  // Clean existing
  await prisma.securityEvent.deleteMany();
  await prisma.memory.deleteMany();

  // Create Verified Trusted Memory
  await prisma.memory.create({
    data: {
      content: "ACME Corporation verified payment account is ****4421.",
      normalizedContent: "acmecorporationverifiedpaymentaccountis****4421.",
      category: "payment",
      sourceType: "direct_user",
      sourceName: "Authenticated User",
      originTrust: 100,
      trustScore: 100,
      riskScore: 0,
      confidence: 100,
      sensitivity: "critical",
      status: "verified",
      userVerified: true,
      humanVerifiedAt: new Date(),
      humanVerificationReason: "Direct authenticated user input",
      provenance: JSON.stringify([
        {
          id: "sys-0",
          source: "direct_user",
          trust: 100,
          description: "Authenticated user input",
        },
      ]),
      securityDecisionVersion: 1,
      version: 1,
    },
  });
  
  await prisma.memory.create({
    data: {
      content: "User prefers dark mode.",
      normalizedContent: "userprefersdarkmode.",
      category: "preference",
      sourceType: "direct_user",
      sourceName: "Authenticated User",
      originTrust: 100,
      trustScore: 100,
      riskScore: 0,
      confidence: 100,
      sensitivity: "low",
      status: "verified",
      userVerified: true,
      humanVerifiedAt: new Date(),
      humanVerificationReason: "Direct authenticated user input",
      provenance: JSON.stringify([
        {
          id: "sys-1",
          source: "direct_user",
          trust: 100,
          description: "Authenticated user input",
        },
      ]),
      securityDecisionVersion: 1,
      version: 1,
    },
  });

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
