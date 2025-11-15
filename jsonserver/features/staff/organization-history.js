// Organization history endpoints: /organization-history list & CRUD, and /staff/:id/organization-history
import { applySearch, paginate, genId } from '../utils.js';

function ensureCollection(db, name) {
  const current = db.get(name).value();
  if (!Array.isArray(current)) {
    db.set(name, []).write();
  }
}

function parseHistoryParams(req) {
  const search = (req.query.search || '').toString().toLowerCase();
  const idKaryawan = (req.query.idKaryawan || '').toString();
  const jenisPerubahan = (req.query.jenisPerubahan || '').toString();
  const tanggalEfektifStart = (req.query.tanggalEfektifStart || '').toString();
  const tanggalEfektifEnd = (req.query.tanggalEfektifEnd || '').toString();
  const sortBy = (req.query.sortBy || 'tanggalEfektif').toString();
  const order = (req.query.order || 'desc').toString();
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);
  return { search, idKaryawan, jenisPerubahan, tanggalEfektifStart, tanggalEfektifEnd, sortBy, order, page, limit };
}

function mapHistoryItem(h) {
  return {
    id: h.id,
    idKaryawan: h.idKaryawan || h.id_karyawan || null,
    user: {
      name: h.user?.name || h.user_name || null,
      avatar: h.user?.avatar || h.user_avatar || null,
    },
    jenisPerubahan: h.jenisPerubahan || h.jenis_perubahan || null,
    tanggalEfektif: h.tanggalEfektif || h.tanggal_efektif || null,
    posisiLama: h.posisiLama || null,
    posisiBaru: h.posisiBaru || null,
    divisiLama: h.divisiLama || null,
    divisiBaru: h.divisiBaru || null,
    direktoratLama: h.direktoratLama || null,
    direktoratBaru: h.direktoratBaru || null,
    alasanPerubahan: h.alasanPerubahan || null,
  };
}

export function registerOrganizationHistory(server, db) {
  // GET /organization-history
  server.get('/api/organization-history', (req, res) => {
    ensureCollection(db, 'organization-history');
    let items = (db.get('organization-history').filter((x) => !x.is_deleted).value() || []).map(mapHistoryItem);
    const { search, idKaryawan, jenisPerubahan, tanggalEfektifStart, tanggalEfektifEnd, sortBy, order, page, limit } = parseHistoryParams(req);

    if (search) {
      items = applySearch(items, search, ['idKaryawan', 'user.name', 'jenisPerubahan']);
    }
    if (idKaryawan) {
      items = items.filter((x) => (x.idKaryawan || '') === idKaryawan);
    }
    if (jenisPerubahan) {
      items = items.filter((x) => (x.jenisPerubahan || '') === jenisPerubahan);
    }
    if (tanggalEfektifStart || tanggalEfektifEnd) {
      const start = tanggalEfektifStart ? new Date(tanggalEfektifStart).getTime() : -Infinity;
      const end = tanggalEfektifEnd ? new Date(tanggalEfektifEnd).getTime() : Infinity;
      items = items.filter((x) => {
        const t = new Date(x.tanggalEfektif || 0).getTime();
        return t >= start && t <= end;
      });
    }

    // sort by field
    items = items.sort((a, b) => {
      const av = a[sortBy];
      const bv = b[sortBy];
      const ad = new Date(av).getTime();
      const bd = new Date(bv).getTime();
      const comp = isNaN(ad) || isNaN(bd) ? (av > bv ? 1 : av < bv ? -1 : 0) : ad - bd;
      return order === 'desc' ? -comp : comp;
    });

    const pageResp = paginate(items, page, limit);
    return res.status(200).send(JSON.stringify(pageResp));
  });

  // POST /organization-history
  server.post('/api/organization-history', (req, res) => {
    ensureCollection(db, 'organization-history');
    const body = req.body || {};
    const required = ['idKaryawan', 'jenisPerubahan', 'tanggalEfektif', 'posisiLama', 'posisiBaru'];
    const ok = required.every((f) => body[f] && body[f].toString().trim().length > 0);
    if (!ok) {
      return res.status(400).send(JSON.stringify({ message: 'Invalid payload: required fields missing' }));
    }
    const now = new Date().toISOString();
    const rec = {
      id: genId(),
      ...body,
      is_deleted: false,
      created_at: now,
      updated_at: now,
    };
    db.get('organization-history').push(rec).write();
    return res.status(201).send(JSON.stringify(mapHistoryItem(rec)));
  });

  // PATCH /organization-history/:id
  server.patch('/api/organization-history/:id', (req, res) => {
    ensureCollection(db, 'organization-history');
    const id = req.params.id;
    const existing = db.get('organization-history').find({ id }).value();
    if (!existing || existing.is_deleted) {
      return res.status(404).send(JSON.stringify({ message: 'History not found' }));
    }
    const merged = { ...existing, ...req.body, updated_at: new Date().toISOString() };
    db.get('organization-history').find({ id }).assign(merged).write();
    return res.status(200).send(JSON.stringify(mapHistoryItem(merged)));
  });

  // DELETE /organization-history/:id
  server.delete('/api/organization-history/:id', (req, res) => {
    ensureCollection(db, 'organization-history');
    const id = req.params.id;
    const existing = db.get('organization-history').find({ id }).value();
    if (!existing || existing.is_deleted) {
      return res.status(404).send(JSON.stringify({ message: 'History not found' }));
    }
    db.get('organization-history').find({ id }).assign({ is_deleted: true, updated_at: new Date().toISOString() }).write();
    return res.status(200).send(JSON.stringify({ success: true }));
  });

  // GET /staff/:id/organization-history (filtered per karyawan)
  server.get('/api/staff/:id/organization-history', (req, res) => {
    ensureCollection(db, 'organization-history');
    ensureCollection(db, 'staff');
    const id = req.params.id;
    const staff = db.get('staff').find({ id }).value();
    if (!staff || staff.is_deleted) {
      return res.status(404).send(JSON.stringify({ message: 'Staff not found' }));
    }
    const idKaryawan = staff.idKaryawan || staff.id_karyawan;
    let items = db
      .get('organization-history')
      .filter((h) => !h.is_deleted && (h.idKaryawan === idKaryawan))
      .map(mapHistoryItem)
      .value();
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const pageResp = paginate(items, page, limit);
    return res.status(200).send(JSON.stringify(pageResp));
  });
}