import type { AppRole, GlobalRole } from "@/lib/domain";

export const PUBLIC_USER_REGISTRATION_ENABLED = false;

export const LOGIN_ACCESS_NOTICE =
  "El alta de usuarios la realiza un administrador desde Usuarios y roles.";

export function canCreateProjectWithRoles(roles: AppRole[]): boolean {
  return roles.includes("admin") || roles.includes("resident");
}

export function canManageUsersWithRoles(args: {
  appRoles: AppRole[];
  globalRoles?: GlobalRole[];
}): boolean {
  return (
    args.appRoles.includes("admin") ||
    Boolean(args.globalRoles?.some((role) => role === "super_admin" || role === "admin_empresa"))
  );
}

export function canQueryEntity(args: {
  isGlobalAdmin?: boolean;
  requestedEntityId: string | null | undefined;
  allowedEntityIds: string[];
}): boolean {
  if (args.isGlobalAdmin) return true;
  if (!args.requestedEntityId) return false;
  return args.allowedEntityIds.includes(args.requestedEntityId);
}
