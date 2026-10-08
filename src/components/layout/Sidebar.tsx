import Link from "next/link";
import { Shield, LayoutDashboard, Bot, FileWarning, Search, Activity, Network, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar({ className }: { className?: string }) {
  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, active: true },
    { name: "Agent", href: "/agent", icon: Bot },
    { name: "Graph", href: "/graph", icon: Network },
    { name: "Quarantine", href: "/quarantine", icon: FileWarning },
    { name: "Events", href: "/events", icon: Activity },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className={cn("flex flex-col h-screen w-20 bg-[#060B14] items-center py-6 border-r border-slate-800/30", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-white mb-8 shadow-lg shadow-blue-500/20">
        <Shield className="h-6 w-6" />
      </div>
      <div className="flex-1 flex flex-col gap-4 w-full px-4 mt-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 group",
              item.active 
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" 
                : "text-slate-500 hover:text-white hover:bg-[#131A2B]"
            )}
            title={item.name}
          >
            <item.icon className="h-5 w-5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
