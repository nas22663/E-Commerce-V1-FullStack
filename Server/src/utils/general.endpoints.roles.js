import { systemRoles } from "./system-roles.js";

export const endPointsRoles = {
  GENERAL: [systemRoles.USER, systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
  SUPER_ADMIN: [systemRoles.SUPER_ADMIN],
  ADMIN: [systemRoles.ADMIN],
  USER: [systemRoles.USER],
};
