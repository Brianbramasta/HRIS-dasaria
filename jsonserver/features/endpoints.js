// Aggregator: register feature-specific endpoints and common write validation
import { registerBusinessLines } from './struktur-and-organization/business-lines.js';
import { registerCompanies } from './struktur-and-organization/companies.js';
import { registerOffices } from './struktur-and-organization/offices.js';
import { registerDirectorates } from './struktur-and-organization/directorates.js';
import { registerDivisions } from './struktur-and-organization/divisions.js';
import { registerDepartments } from './struktur-and-organization/departments.js';
import { registerPositions } from './struktur-and-organization/positions.js';
import { registerEmployeePositions } from './struktur-and-organization/employee-positions.js';
import { registerStaffEndpoints } from './staff/index.js';

export function registerStructureAndOrganization(server, db) {
  // Middleware validasi memoNumber & skFileId untuk operasi tulis
  const REQUIRED_CRUD_PREFIXES = [
    '/business-lines',
    '/companies',
    '/offices',
    '/directorates',
    '/divisions',
    '/departments',
    '/positions',
    '/employee-positions',
  ];

  server.use('/api', (req, res, next) => {
    const isWrite = ['POST', 'PATCH', 'DELETE'].includes(req.method);
    if (!isWrite) return next();
    const matches = REQUIRED_CRUD_PREFIXES.some((p) => req.path.startsWith(p));
    if (!matches) return next();
    const memoNumber = req.body && (req.body.memoNumber || req.body.memo_number);
    const skFileId = req.body && (req.body.skFileId || req.body.sk_file_id);
    if (!memoNumber || !skFileId) {
      return res.status(400).send(JSON.stringify({
        error: 'memoNumber dan skFileId wajib untuk operasi CRUD sesuai kontrak API.',
      }));
    }
    next();
  });

  // Middleware auth header presence check untuk operasi tulis fitur staff
  const STAFF_REQUIRED_WRITE_PREFIXES = [
    '/staff',
    '/pengunduran-diri',
    '/perpanjangan-kontrak',
    '/riwayat-organisasi',
  ];

  server.use('/api', (req, res, next) => {
    const isWrite = ['POST', 'PATCH', 'DELETE'].includes(req.method);
    if (!isWrite) return next();
    const matches = STAFF_REQUIRED_WRITE_PREFIXES.some((p) => req.path.startsWith(p));
    if (!matches) return next();
    const auth = req.headers.authorization || req.headers.Authorization || '';
    if (!auth.startsWith('Bearer ')) {
      return res.status(401).send(JSON.stringify({ message: 'Unauthorized' }));
    }
    next();
  });

  // Daftarkan modul fitur
  registerBusinessLines(server, db);
  registerCompanies(server, db);
  registerOffices(server, db);
  registerDirectorates(server, db);
  registerDivisions(server, db);
  registerDepartments(server, db);
  registerPositions(server, db);
  registerEmployeePositions(server, db);
}

// Export staff registration to be wired by server
export { registerStaffEndpoints };