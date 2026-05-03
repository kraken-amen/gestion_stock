import { Box, Warehouse, AlertTriangle, FileText, ShoppingCart, Users } from "lucide-react";
import KPICard from "./KPICard";
import { getKpiStats } from "../../../services/dashboardService";
import { useState, useEffect } from "react";

const KPISection = () => {
  const [stats, setStats] = useState({
    totalProduits: 0,
    stockGlobal: 0,
    stockFaible: 0,
    demandes: 0,
    commandes: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      const data = await getKpiStats();

      setStats({
        totalProduits: data.totalProducts || 0,
        stockGlobal: data.totalStock || 0,
        stockFaible: data.lowStockProducts?.length || 0,
        demandes: data.demandes || 0,
        commandes: data.commandes || 0,
        users: data.users || 0,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStats();
  }, []);

  const data = [
    {
      title: "Total Produits",
      value: stats.totalProduits,
      subtitle: "actifs dans le catalogue",
      icon: Box,
      color: "blue",
    },
    {
      title: "Stock Global",
      value: stats.stockGlobal.toLocaleString(),
      subtitle: "Quantité totale",
      icon: Warehouse,
      trend: "",
      trendType: "positive",
      color: "purple",
    },
    {
      title: "Stock Faible",
      value: stats.stockFaible,
      subtitle: "sous seuil critique",
      icon: AlertTriangle,
      trend: stats.stockFaible > 0 ? "Urgent" : "",
      trendType: "negative",
      color: "red",
    },
    {
      title: "Demandes",
      value: stats.demandes,
      subtitle: "en cours",
      icon: FileText,
      color: "yellow",
    },
    {
      title: "Commandes",
      value: stats.commandes,
      subtitle: "en cours",
      icon: ShoppingCart,
      color: "cyan",
    },
    {
      title: "Utilisateurs",
      value: stats.users,
      subtitle: "Equipe",
      icon: Users,
      trend: "",
      trendType: "positive",
      color: "green",
    },
  ] as const;

  if (loading) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 p-4">
      {data.map((item, index) => (
        <KPICard key={index} {...item} />
      ))}
    </div>
  );
};

export default KPISection;