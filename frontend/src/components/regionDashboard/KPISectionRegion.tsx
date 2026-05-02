import { Box, Warehouse, AlertTriangle, FileText, MoreHorizontal } from 'lucide-react';

interface Props {
  total: number;
  stockGlobal: number;
  lowStock: number;
  value:number
}

export default function KPISectionRegion({
  total,
  stockGlobal,
  lowStock,
  value
  
}: Props) {
  const data = [
    {
      label: 'TOTAL PRODUITS',
      value: total.toLocaleString(),
      subValue: 'actifs dans le catalogue',
      icon: <Box size={20} />,
      color: 'blue'
    },
    {
      label: 'STOCK GLOBAL',
      value: stockGlobal.toLocaleString(),
      subValue: '+4.2%',
      isTrend: true,
      icon: <Warehouse size={20} />,
      color: 'purple'
    },
    {
      label: 'STOCK FAIBLE',
      value: lowStock,
      subValue: 'Urgent',
      isUrgent: true,
      icon: <AlertTriangle size={20} />,
      color: 'red'
    },
    {
      label: 'DEMANDES',
      value: value,
      subValue: '3 urgentes +48h',
      icon: <FileText size={20} />,
      color: 'amber'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((item) => (
        <div
          key={item.label}
          className="relative group backdrop-blur-2xl bg-[#1a1c3d]/50 border border-white/5 rounded-[2rem] p-8 flex flex-col gap-6 transition-all hover:bg-[#1a1c3d]/80"
        >
          {/* Top Row: Icon and More button */}
          <div className="flex justify-between items-start">
            <div className={`
              w-12 h-12 rounded-2xl flex items-center justify-center
              ${item.color === 'blue' ? 'bg-blue-500/10 text-blue-400' : ''}
              ${item.color === 'purple' ? 'bg-purple-500/10 text-purple-400' : ''}
              ${item.color === 'red' ? 'bg-red-500/10 text-red-400' : ''}
              ${item.color === 'amber' ? 'bg-amber-500/10 text-yellow-500' : ''}
            `}>
              {item.icon}
            </div>
            <button className="text-white/20 hover:text-white/50">
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* Bottom Content */}
          <div className="space-y-2">
            <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase">
              {item.label}
            </p>
            <p className="text-4xl font-black text-white tracking-tight">
              {item.value}
            </p>
            <div className="flex items-center gap-1">
              {item.isTrend && <span className="text-emerald-400 text-xs">↗</span>}
              <p className={`text-[11px] font-medium ${
                item.isUrgent ? 'text-red-400' : 
                item.isTrend ? 'text-emerald-400' : 'text-white/30'
              }`}>
                {item.subValue}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}