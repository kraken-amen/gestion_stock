import { hasPermission } from "../utils/permissions";
import type { PropsDashboard } from "../types";

export const PermissionGate = ({ role, permission, children }: PropsDashboard) => {
  if (!role) {
    return null;
  }
  if (hasPermission(role, permission)) {
    return <>{children}</>;
  }
  return null;
};