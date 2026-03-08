import MangeUser from '../components/MangeUser';
import { PermissionGate } from '../components/PermissionGate';
import { useAuth } from '../hooks/useAuth';
import InventorySalesDashboard from '../components/InventorySalesDashboard';

const Dashboard = () => {
  const { user } = useAuth()
  return (
    <div className="w-full relative font-sans">
      {/* Contenu */}
      <InventorySalesDashboard />
      <PermissionGate role={user?.role} permission="MANAGE_USERS">
        <MangeUser />
      </PermissionGate>
    </div>
  );
};

export default Dashboard;