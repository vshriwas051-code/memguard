import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { db } from "@/lib/db";
import { HeroArt } from "@/components/layout/HeroArt";

const pipeline = ["Trust Engine", "Sensitivity", "Conflict Detector", "Policy Engine"];

export default async function DashboardPage() {
  const verifiedCount = await db.memory.count({ where: { status: "verified" } });
  const quarantinedCount = await db.memory.count({ where: { status: "quarantined" } });
  const reviewCount = await db.memory.count({ where: { status: "review" } });

  const memoryScore = 100 - (quarantinedCount * 5) - (reviewCount * 2);

  const stats = [
    { value: `${memoryScore}`, suffix: "/100", label: "Security Score" },
    { value: verifiedCount.toLocaleString(), label: "Verified" },
    { value: quarantinedCount.toLocaleString(), label: "Quarantined", danger: quarantinedCount > 0 },
    { value: reviewCount.toLocaleString(), label: "In Review" },
  ];

  return (
    <div className="mx-auto flex min-h-[calc(100vh-88px)] max-w-[1400px] flex-col px-4 pb-8 sm:px-8">
      {/* Hero */}
      <section className="relative flex min-w-0 flex-1 flex-col items-center justify-center pt-4">
        <p className="hidden self-end text-right sm:block text-[12px] tracking-wide text-white/80 sm:mr-[4%]">
          Safeguarding What Your AI Remembers .
        </p>

        <div className="relative mt-4 w-full overflow-x-clip">
          <h1
            className="select-none text-center font-light leading-none tracking-[-0.04em] text-white"
            style={{ fontSize: "clamp(3rem, 14.5vw, 13.5rem)" }}
          >
            MemGuard
          </h1>
          <HeroArt className="pointer-events-none absolute left-1/2 top-1/2 w-[min(78vw,520px)] -translate-x-1/2 -translate-y-[46%]" />
        </div>

        <div className="relative z-10 mt-[clamp(5rem,13vw,9rem)] flex flex-wrap items-center justify-center gap-6">
          <Link href="/events" className="text-[13px] text-white/80 transition-colors hover:text-white">
            View Audit Log
          </Link>
          <Link href="/attack-lab" className="mg-pill">
            Run Attack Simulation
          </Link>
        </div>
      </section>

      {/* Stats strip */}
      <section className="mt-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap items-stretch gap-y-6">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`pr-6 sm:pr-8 ${i > 0 ? "border-l border-white/20 pl-6 sm:pl-8" : ""}`}
            >
              <div className={`text-2xl font-light sm:text-3xl ${s.danger ? "text-[var(--mg-danger)]" : "text-white"}`}>
                {s.value}
                {s.suffix && <span className="text-base text-white/45">{s.suffix}</span>}
              </div>
              <div className="mt-1 text-[12px] text-white/60">{s.label}</div>
            </div>
          ))}
          <p className="max-w-[15rem] border-l border-white/20 pl-6 text-[12px] leading-relaxed text-white/75 sm:pl-8">
            Every memory is checked for origin, sensitivity and conflicts before your agent can use it.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[12px] text-white/70">
          {pipeline.map((step, i) => (
            <span key={step} className="flex items-center gap-2">
              <span className="text-white/35">0{i + 1}</span>
              {step}
            </span>
          ))}
          <Link href="/graph" className="flex items-center gap-1 text-white transition-opacity hover:opacity-80">
            Graph <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
