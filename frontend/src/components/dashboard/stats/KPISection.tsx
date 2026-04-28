import { Box, Warehouse, AlertTriangle, FileText, ShoppingCart, Users } from "lucide-react";
import KPICard from "./KPICard";

const KPISection = () => {
  const data = [
    {
      title: "Total Produits",
      value: 142,
      subtitle: "actifs dans le catalogue",
      icon: Box,
      color: "blue",
    },
    {
      title: "Stock Global",
      value: "48 320",
      subtitle: "+4.2% ce mois",
      icon: Warehouse,
      trend: "+4.2%",
      trendType: "positive",
      color: "purple",
    },
    {
      title: "Stock Faible",
      value: 3,
      subtitle: "sous seuil critique",
      icon: AlertTriangle,
      trend: "Urgent",
      trendType: "negative",
      color: "red",
    },
    {
      title: "Demandes",
      value: 7,
      subtitle: "3 urgentes +48h",
      icon: FileText,
      color: "yellow",
    },
    {
      title: "Commandes",
      value: 12,
      subtitle: "2 en retard",
      icon: ShoppingCart,
      color: "cyan",
    },
    {
      title: "Utilisateurs",
      value: 24,
      subtitle: "+2 ce mois",
      icon: Users,
      trend: "+2",
      trendType: "positive",
      color: "green",
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 p-4">
      {data.map((item, index) => (
        <KPICard key={index} {...item} />
      ))}
    </div>
  );
};

export default KPISection;