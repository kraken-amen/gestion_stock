export type Role = 'administrateur' | 'responsable region' | 'utilisateur' | "gestionnaire de stock";

export const rolePermissions: Record<Role, string[]> = {
  "utilisateur": ["VIEW_REGION"],
  "responsable region": ["VIEW_DEMANDE", "VIEW_COMMANDE", "VIEW_REGION"],
  "administrateur": ["MANAGE_USERS", "VIEW_COMMANDE", "VIEW_DEMANDE", "VIEW_DASHBOARD", "VIEW_MAP"],
  "gestionnaire de stock": ["VIEW_COMMANDE", "VIEW_REGION"]
};

export const hasPermission = (role: Role, permission: string): boolean => {
  return rolePermissions[role]?.includes(permission) ?? false;
};