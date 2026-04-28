import React from "react";
import { MoreHorizontal, TrendingUp, type LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "cyan";
}

// Map lel colors bech nasta3mlouhom dynamically f CSS classes
const stylesMap = {
  blue:   { border: "border-blue-500/20",   icon: "text-blue-400",   bg: "bg-blue-500/10",   glow: "shadow-blue-500/5" },
  purple: { border: "border-purple-500/20", icon: "text-purple-400", bg: "bg-purple-500/10", glow: "shadow-purple-500/5" },
  red:    { border: "border-red-500/20",    icon: "text-red-400",    bg: "bg-red-500/10",    glow: "shadow-red-500/5" },
  yellow: { border: "border-yellow-500/20", icon: "text-yellow-400", bg: "bg-yellow-500/10", glow: "shadow-yellow-500/5" },
  cyan:   { border: "border-cyan-500/20",   icon: "text-cyan-400",   bg: "bg-cyan-500/10",   glow: "shadow-cyan-500/5" },
  green:  { border: "border-green-500/20",  icon: "text-green-400",  bg: "bg-green-500/10",  glow: "shadow-green-500/5" },
};

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = "neutral",
  color = "blue",
}) => {
  const s = stylesMap[color];

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${s.border} bg-white/[0.04] backdrop-blur-xl p-4 hover:bg-white/[0.07] transition-all duration-300 shadow-xl hover:${s.glow} group`}>
      
      {/* Radial Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />

      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 ${s.bg} ${s.icon} rounded-xl flex items-center justify-center`}>
          <Icon size={18} />
        </div>
        <button className="text-white/20 hover:text-white/50 transition-colors">
          <MoreHorizontal size={14} />
        </button>
      </div>

      <p className="text-[11px] font-semibold text-white/45 mb-1 uppercase tracking-wide">
        {title}
      </p>
      
      <p className="text-[28px] font-black text-white leading-none tracking-tight">
        {value}
      </p>

      {/* Trend Logic */}
      <div className="flex items-center gap-1 mt-2">
        {trendType === "positive" && <TrendingUp size={10} className="text-emerald-400" />}
        <p className={`text-[10px] font-bold ${
          trendType === "positive" ? "text-emerald-400" : 
          trendType === "negative" ? "text-red-400" : "text-white/40"
        }`}>
          {trend || subtitle}
        </p>
      </div>
    </div>
  );
};

export default KPICard;