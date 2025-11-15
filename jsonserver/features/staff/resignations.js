// Resignations endpoints: /resignations list & CRUD, detail
import { parseListParams, applySearch, applySort, paginate, genId } from '../utils.js';

function ensureCollection(db, name) {
  const current = db.get(name).value();
  if (!Array.isArray(current)) {
    db.set(name, []).write();
  }
}

function mapResignListItem(r) {
  return {
    id: r.id,
    karyawanId: r.karyawanId || r.staffId || null,
    idKaryawanStr: r.idKaryawanStr || r.id_karyawan_str || null,
    name: r.name || null,
    email: r.email || null,
    posisi: r.posisi || null,
    departmentName: r.departmentName || r.department || null,
    tanggalPengajuan: r.tanggalPengajuan || r.tanggal_pengajuan || null,
    status: r.status || null,
  };
}

export function registerResignations(server, db) {
  // GET /resignations
  server.get('/api/resignations', (req, res) => {
    ensureCollection(db, 'resignations');
    let items = (db.get('resignations').filter((x) => !x.is_deleted).value() || []).map(mapResignListItem);
    console.log(items);
    const { q, sort, order, page, limit } = parseListParams(req);
    const status = (req.query.status || '').toString();
    const departmentId = (req.query.departmentId || '').toString();

    if (q) {
      items = applySearch(items, q, ['idKaryawanStr', 'name', 'email']);
    }
    if (status) {
      items = items.filter((x) => (x.status || '') === status);
    }
    if (departmentId) {
      items = items.filter((x) => (x.departmentId || '') === departmentId);
    }

    items = applySort(items, sort, order);
    const pageResp = paginate(items, page, limit);
    return res.status(200).send(JSON.stringify(pageResp));
  });

  // POST /resignations
  server.post('/api/resignations', (req, res) => {
    ensureCollection(db, 'resignations');
    const body = req.body || {};
    if (!body.karyawanId || !body.alasan) {
      return res.status(400).send(JSON.stringify({ message: 'karyawanId and alasan required' }));
    }
    const now = new Date().toISOString();
    const rec = {
      id: genId(),
      karyawanId: body.karyawanId,
      alasan: body.alasan,
      tanggalPengajuan: body.tanggalPengajuan || now,
      tanggalEfektif: body.tanggalEfektif || null,
      departmentId: body.departmentId || null,
      status: body.status || 'Pending',
      is_deleted: false,
      created_at: now,
      updated_at: now,
    };
    db.get('resignations').push(rec).write();
    return res.status(201).send(JSON.stringify(mapResignListItem(rec)));
  });

  // PATCH /resignations/:id
  server.patch('/api/resignations/:id', (req, res) => {
    ensureCollection(db, 'resignations');
    const id = req.params.id;
    const existing = db.get('resignations').find({ id }).value();
    if (!existing || existing.is_deleted) {
      return res.status(404).send(JSON.stringify({ message: 'Resign not found' }));
    }
    const merged = { ...existing, ...req.body, updated_at: new Date().toISOString() };
    db.get('resignations').find({ id }).assign(merged).write();
    return res.status(200).send(JSON.stringify(mapResignListItem(merged)));
  });

  // DELETE /resignations/:id
  server.delete('/api/resignations/:id', (req, res) => {
    ensureCollection(db, 'resignations');
    const id = req.params.id;
    const existing = db.get('resignations').find({ id }).value();
    if (!existing || existing.is_deleted) {
      return res.status(404).send(JSON.stringify({ message: 'Resign not found' }));
    }
    db.get('resignations').find({ id }).assign({ is_deleted: true, updated_at: new Date().toISOString() }).write();
    return res.status(200).send(JSON.stringify({ success: true }));
  });

  // GET /resignations/:id/detail
  server.get('/api/resignations/:id/detail', (req, res) => {
    ensureCollection(db, 'resignations');
    ensureCollection(db, 'staff');
    const id = req.params.id;
    const r = db.get('resignations').find({ id }).value();
    if (!r || r.is_deleted) {
      return res.status(404).send(JSON.stringify({ message: 'Resign not found' }));
    }
    const staff = db.get('staff').find((s) => !s.is_deleted && (s.id === r.karyawanId || s.idKaryawan === r.idKaryawanStr)).value();
    const result = {
      resign: {
        id: r.id,
        karyawanId: r.karyawanId || null,
        idKaryawanStr: r.idKaryawanStr || null,
        name: r.name || (staff && staff.name) || null,
        departmentName: r.departmentName || (staff && (staff.departmentName || staff.departement)) || null,
        tanggalPengajuan: r.tanggalPengajuan || null,
        tanggalEfektif: r.tanggalEfektif || null,
        alasan: r.alasan || null,
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