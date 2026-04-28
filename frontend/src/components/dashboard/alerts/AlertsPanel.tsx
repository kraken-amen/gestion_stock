interface Alert {
  id: string;
  message: string;
  detail?: string;
  type: "critical" | "warning" | "info";
}

const typeStyles = {
  critical: "bg-red-500/10 border-red-500/20 text-red-400",
  warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
};

const AlertsPanel = () => {
  const alerts: Alert[] = [
    { id: "1", message: "Stock critique — Modem ADSL v2", detail: "Gafsa • 4 unités restantes", type: "critical" },
    { id: "2", message: "3 demandes en attente +48h", detail: "DEM-108, 109, 110", type: "warning" },
    { id: "3", message: "Commande en retard", detail: "CMD-089 • retard 3 jours", type: "warning" },
  ];

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl p-5 rounded-2xl border border-white/5 shadow-xl group relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
           style={{ background: 'radial-gradient(circle at top right, rgba(239,68,68,0.05) 0%, transparent 50%)' }} />

      <div className="flex justify-between items-center mb-5 relative">
        <h3 className="text-white font-medium text-sm">Alertes actives</h3>
        <span className="bg-white/10 text-white/40 text-[10px] px-2 py-0.5 rounded-full font-bold">{alerts.length}</span>
      </div>

      <div className="space-y-3 relative">
        {alerts.map((alert) => (
          <div key={alert.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] transition-all duration-300">
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border ${typeStyles[alert.type]}`}>
              {alert.type}
            </span>
            <p className="text-[13px] text-white/90 mt-2 font-semibold leading-tight">{alert.message}</p>
            {alert.detail && <p className="text-[11px] text-white/30 mt-1 font-medium">{alert.detail}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;