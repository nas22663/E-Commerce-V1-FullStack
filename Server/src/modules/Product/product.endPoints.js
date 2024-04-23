import { systemRoles } from "../../utils/system-roles.js";

export const productEndPoints = {
  addProduct: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
};
