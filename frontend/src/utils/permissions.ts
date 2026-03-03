export type Role = 'administrateur' | 'resbonsable region' | 'utilisateur';

export const rolePermissions: Record<Role, string[]> = {
  utilisateur: ["VIEW_STOCK"],
  "resbonsable region": ["VIEW_STOCK", "MANAGE_STOCK", "CREATE_DEMANDE", "VIEW_ALERTS"],
  administrateur: ["VIEW_STOCK", "MANAGE_STOCK", "CREATE_DEMANDE", "VIEW_ALERTS", "MANAGE_USERS", "APPROVE_DEMANDE"]
};

export const hasPermission = (role: Role, permission: string): boolean => {
  return rolePermissions[role]?.includes(permission) ?? false;
};