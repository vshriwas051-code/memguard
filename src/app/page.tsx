import { Search, Bell, User, ArrowUpRight, ArrowDownRight, Activity, Users, ShieldAlert, Database, Shield } from "lucide-react";
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const verifiedCount = await db.memory.count({ where: { status: "verified" } });
  const quarantinedCount = await db.memory.count({ where: { status: "quarantined" } });
  const reviewCount = await db.memory.count({ where: { status: "review" } });

  const memoryScore = 100 - (quarantinedCount * 5) - (reviewCount * 2);

  return (
    <div className="flex flex-col min-h-full p-8 font-sans text-slate-50 relative">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10 w-full space-y-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search analytics..." 
              className="w-full bg-[#131A2B]/80 backdrop-blur-sm border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 border-2 border-[#0B1121]"></span>
            </button>
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center border-2 border-slate-700/50 cursor-pointer hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h1>
          <p className="text-sm text-slate-400 mt-1">Welcome back, here is your daily breakdown.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-[#131A2B]/80 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6 shadow-xl shadow-black/20 hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-slate-400">Security Score</h3>
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              </div>
            </div>
            <div className="text-[32px] leading-tight font-bold text-white mb-2">{memoryScore} / 100</div>
            <div className="flex items-center text-xs text-emerald-500 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>12.5% vs last month</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#131A2B]/80 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6 shadow-xl shadow-black/20 hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-slate-400">Verified Memories</h3>
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Database className="h-5 w-5 text-purple-500 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
              </div>
            </div>
            <div className="text-[32px] leading-tight font-bold text-white mb-2">{verifiedCount.toLocaleString()}</div>
            <div className="flex items-center text-xs text-emerald-500 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>8.2% vs last month</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#131A2B]/80 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6 shadow-xl shadow-black/20 hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-slate-400">Quarantined</h3>
              <div className="h-10 w-10 rounded-xl bg-slate-800/50 flex items-center justify-center">
                <ShieldAlert className="h-5 w-5 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              </div>
            </div>
            <div className="text-[32px] leading-tight font-bold text-white mb-2">{quarantinedCount.toLocaleString()}</div>
            <div className="flex items-center text-xs text-red-500 font-medium">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              <span>2.1% vs last month</span>
            </div>
          </div>

        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-[#131A2B]/80 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6 shadow-xl shadow-black/20">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-base font-semibold text-white">Traffic Overview</h3>
              <button className="text-xs font-medium bg-[#1E293B] hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg transition-colors border border-slate-700/50">
                This Year
              </button>
            </div>
            
            {/* SVG Chart Mockup matching the image's aesthetic */}
            <div className="relative h-[300px] w-full">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[11px] font-medium text-slate-500 py-2">
                <span>100k</span>
                <span>75k</span>
                <span>50k</span>
                <span>25k</span>
                <span>0</span>
              </div>
              
              {/* Grid lines */}
              <div className="absolute left-10 right-0 top-0 bottom-0 flex flex-col justify-between py-4">
                {[0,1,2,3,4].map(i => (
                  <div key={i} className="w-full h-px bg-slate-800/40"></div>
                ))}
              </div>

              {/* Chart SVG */}
              <svg className="absolute left-10 right-0 top-0 bottom-0 h-full w-[calc(100%-2.5rem)]" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path 
                  d="M0,80 Q10,70 20,85 T40,40 T60,80 T80,30 T100,50 L100,100 L0,100 Z" 
                  fill="url(#gradientArea)" 
                />
                <path 
                  d="M0,80 Q10,70 20,85 T40,40 T60,80 T80,30 T100,50" 
                  fill="none" 
                  stroke="#3B82F6" 
                  strokeWidth="3" 
                  className="drop-shadow-[0_4px_12px_rgba(59,130,246,0.5)]"
                />
                
                {/* Tooltip Dot Mockup */}
                <circle cx="50" cy="56" r="4" fill="#fff" stroke="#3B82F6" strokeWidth="2" className="drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              </svg>
              
              {/* Tooltip Mockup */}
              <div className="absolute top-[20%] left-[46%] bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded shadow-xl shadow-black/50 flex items-center">
                $4,200
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
              </div>
            </div>
          </div>

          {/* Doughnut Chart */}
          <div className="bg-[#131A2B]/80 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6 shadow-xl shadow-black/20 flex flex-col">
            <h3 className="text-base font-semibold text-white mb-6">Device Usage</h3>
            <div className="flex-1 flex flex-col items-center justify-center">
              
              {/* Doughnut SVG Mockup */}
              <div className="relative w-48 h-48 mb-10">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {/* Background Track */}
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1E293B" strokeWidth="12" />
                  
                  {/* Green segment (15%) */}
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="213.52" className="drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]" />

                  {/* Purple segment (30%) */}
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8B5CF6" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="175.84" className="drop-shadow-[0_0_12px_rgba(139,92,246,0.3)]" />
                  
                  {/* Blue segment (55%) */}
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3B82F6" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="113.04" className="drop-shadow-[0_0_12px_rgba(59,130,246,0.4)]" />
                </svg>
                
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow-md">85%</span>
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-1">Mobile</span>
                </div>
              </div>

              {/* Legend */}
              <div className="w-full space-y-4 px-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-3 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                    <span className="text-slate-300 font-medium">Desktop</span>
                  </div>
                  <span className="text-slate-400 font-medium">55%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 mr-3 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></span>
                    <span className="text-slate-300 font-medium">Mobile</span>
                  </div>
                  <span className="text-slate-400 font-medium">30%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-3 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                    <span className="text-slate-300 font-medium">Tablet</span>
                  </div>
                  <span className="text-slate-400 font-medium">15%</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
