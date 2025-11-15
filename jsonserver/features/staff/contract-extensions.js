// Contract extensions endpoints: /contract-extensions list & CRUD, detail
import { parseListParams, applySearch, applySort, paginate, genId } from '../utils.js';

function ensureCollection(db, name) {
  const current = db.get(name).value();
  if (!Array.isArray(current)) {
    db.set(name, []).write();
  }
}

function mapExtensionListItem(r) {
  return {
    id: r.id,
    karyawanId: r.karyawanId || r.staffId || null,
    idKaryawan: r.idKaryawan || r.id_karyawan || null,
    name: r.name || null,
    tanggalMulai: r.tanggalMulai || r.tanggal_mulai || null,
    tanggalBerakhir: r.tanggalBerakhir || r.tanggal_berakhir || null,
    status: r.status || null,
  };
}

export function registerContractExtensions(server, db) {
  // GET /contract-extensions
  server.get('/api/contract-extensions', (req, res) => {
    ensureCollection(db, 'contract-extensions');
    let items = (db.get('contract-extensions').filter((x) => !x.is_deleted).value() || []).map(mapExtensionListItem);
    const { q, sort, order, page, limit } = parseListParams(req);
    const status = (req.query.status || '').toString();

    if (q) {
      items = applySearch(items, q, ['name', 'idKaryawan']);
    }
    if (status) {
      items = items.filter((x) => (x.status || '') === status);
    }

    items = applySort(items, sort, order);
    const pageResp = paginate(items, page, limit);
    return res.status(200).send(JSON.stringify(pageResp));
  });

  // POST /contract-extensions
  server.post('/api/contract-extensions', (req, res) => {
    ensureCollection(db, 'contract-extensions');
    const body = req.body || {};
    if (!body.karyawanId || !body.tanggalMulai || !body.tanggalBerakhir) {
      return res.status(400).send(JSON.stringify({ message: 'karyawanId, tanggalMulai, tanggalBerakhir required' }));
    }
    const now = new Date().toISOString();
    const rec = {
      id: genId(),
      karyawanId: body.karyawanId,
      tanggalMulai: body.tanggalMulai,
      tanggalBerakhir: body.tanggalBerakhir,
      status: body.status || 'pending',
      is_deleted: false,
      created_at: now,
      updated_at: now,
    };
    db.get('contract-extensions').push(rec).write();
    return res.status(201).send(JSON.stringify(mapExtensionListItem(rec)));
  });

  // PATCH /contract-extensions/:id
  server.patch('/api/contract-extensions/:id', (req, res) => {
    ensureCollection(db, 'contract-extensions');
    const id = req.params.id;
    const existing = db.get('contract-extensions').find({ id }).value();
    if (!existing || existing.is_deleted) {
      return res.status(404).send(JSON.stringify({ message: 'Request not found' }));
    }
    const merged = { ...existing, ...req.body, updated_at: new Date().toISOString() };
    db.get('contract-extensions').find({ id }).assign(merged).write();
    return res.status(200).send(JSON.stringify(mapExtensionListItem(merged)));
  });

  // DELETE /contract-extensions/:id
  server.delete('/api/contract-extensions/:id', (req, res) => {
    ensureCollection(db, 'contract-extensions');
    const id = req.params.id;
    const existing = db.get('contract-extensions').find({ id }).value();
    if (!existing || existing.is_deleted) {
      return res.status(404).send(JSON.stringify({ message: 'Request not found' }));
    }
    db.get('contract-extensions').find({ id }).assign({ is_deleted: true, updated_at: new Date().toISOString() }).write();
    return res.status(200).send(JSON.stringify({ success: true }));
  });

  // GET /contract-extensions/:id/detail
  server.get('/api/contract-extensions/:id/detail', (req, res) => {
    ensureCollection(db, 'contract-extensions');
    ensureCollection(db, 'staff');
    const id = req.params.id;
    const r = db.get('contract-extensions').find({ id }).value();
    if (!r || r.is_deleted) {
      return res.status(404).send(JSON.stringify({ message: 'Request not found' }));
    }
    const staff = db.get('staff').find((s) => !s.is_deleted && (s.id === r.karyawanId || s.idKaryawan === r.idKaryawan)).value();
    const result = {
      request: {
        id: r.id,
        karyawanId: r.karyawanId || null,
        tanggalMulai: r.tanggalMulai || null,
        tanggalBerakhir: r.tanggalBerakhir || null,
        status: r.status || null,
      },
      karyawanSummary: staff
        ? {
            id: staff.id,
            idKaryawan: staff.idKaryawan || staff.id_karyawan || null,
            name: staff.name || null,
            email: staff.email || null,
            posisi: staff.posisi || null,
          }
        : null,
    };
    return res.status(200).send(JSON.stringify(result));
  });
}