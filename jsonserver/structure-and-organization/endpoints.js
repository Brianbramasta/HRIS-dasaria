// Aggregator: register feature-specific endpoints and common write validation
import { registerBusinessLines } from './features/business-lines.js';
import { registerCompanies } from './features/companies.js';
import { registerOffices } from './features/offices.js';
import { registerDirectorates } from './features/directorates.js';
import { registerDivisions } from './features/divisions.js';
import { registerDepartments } from './features/departments.js';
import { registerPositions } from './features/positions.js';
import { registerEmployeePositions } from './features/employee-positions.js';

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