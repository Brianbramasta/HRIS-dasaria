// Staff feature aggregator: registers all staff-related endpoints
import { registerStaffCore } from './staff.js';
import { registerResignations } from './resignations.js';
import { registerContractExtensions } from './contract-extensions.js';
import { registerOrganizationHistory } from './organization-history.js';

export function registerStaffEndpoints(server, db) {
  registerStaffCore(server, db);
  registerResignations(server, db);
  registerContractExtensions(server, db);
  registerOrganizationHistory(server, db);
}