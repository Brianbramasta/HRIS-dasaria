// Staff core endpoints: /staff list & CRUD, /staff/:id/detail, nested education/documents
import { parseListParams, applySearch, applySort, paginate, genId } from '../utils.js';

function ensureCollection(db, name) {
  const current = db.get(name).value();
  if (!Array.isArray(current)) {
    db.set(name, []).write();
  }
}

function mapStaffListItem(rec) {
  return {
    id: rec.id,
    idKaryawan: rec.idKaryawan || rec.id_karyawan || null,
    name: rec.name || null,
    email: rec.email || null,
    avatar: rec.avatar || rec.avatar_url || null,
    jabatan: rec.jabatan || null,
    posisi: rec.posisi || null,
    company: rec.company || rec.companyName || null,
    office: rec.office || rec.officeName || null,
    departement: rec.departement || rec.department || rec.departmentName || null,
    divisi: rec.divisi || rec.division || rec.divisionName || null,
    grade: rec.grade || null,
    status: rec.status || null,
    statusPayroll: rec.statusPayroll || null,
    kategori: rec.kategori || null,
    tanggalJoin: rec.tanggalJoin || rec.tanggal_join || null,
    tanggalBerakhir: rec.tanggalBerakhir || rec.tanggal_berakhir || null,
    sisaKontrak: rec.sisaKontrak || rec.sisaKontrak || null,
  };
}

function mapStaffDetail(rec) {
  return {
    id: rec.id,
    idKaryawan: rec.idKaryawan || rec.id_karyawan || null,
    name: rec.name || null,
    email: rec.email || null,
    posisi: rec.posisi || null,
    jabatan: rec.jabatan || null,
    tanggalJoin: rec.tanggalJoin || rec.tanggal_join || null,
    tanggalBerakhir: rec.tanggalBerakhir || rec.tanggal_berakhir || null,
    company: rec.company || rec.companyName || null,
    companyId: rec.companyId || rec.company_id || null,
    department: rec.department || rec.departmentName || rec.departement || null,
    departmentId: rec.departmentId || rec.department_id || null,
    office: rec.office || rec.officeName || null,
    officeId: rec.officeId || rec.office_id || null,
    divisi: rec.divisi || rec.division || rec.divisionName || null,
    grade: rec.grade || null,
    status: rec.status || null,
    statusPayroll: rec.statusPayroll || null,
    kategori: rec.kategori || null,
    avatar: rec.avatar || rec.avatar_url || null,
  };
}

function parseStaffListParams(req) {
  const search = (req.query.search || '').toString().toLowerCase();
  const company = (req.query.company || '').toString();
  const department = (req.query.department || '').toString();
  const status = (req.query.status || '').toString();
  const sortBy = (req.query.sortBy || 'updated_at').toString();
  const order = (req.query.order || 'desc').toString();
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);
  return { search, company, department, status, sortBy, order, page, limit };
}

export function registerStaffCore(server, db) {
  // GET /staff (list with filters)
  server.get('/api/staff', (req, res) => {
    ensureCollection(db, 'staff');
    let items = (db.get('staff').filter((s) => !s.is_deleted).value() || []).map(mapStaffListItem);
    const { search, company, department, status, sortBy, order, page, limit } = parseStaffListParams(req);

    if (search) {
      items = applySearch(items, search, ['idKaryawan', 'name', 'email']);
    }
    if (company) {
      items = items.filter((x) => (x.company || '') === company);
    }
    if (department) {
      items = items.filter((x) => (x.departement || x.department || '') === department);
    }
    if (status) {
      items = items.filter((x) => (x.status || '') === status);
    }

    items = applySort(items, sortBy, order);
    const pageResp = paginate(items, page, limit);
    return res.status(200).send(JSON.stringify(pageResp));
  });

  // POST /staff (create)
  server.post('/api/staff', (req, res) => {
    ensureCollection(db, 'staff');
    const body = req.body || {};
    const required = ['idKaryawan', 'name', 'email', 'tanggalJoin'];
    const ok = required.every((f) => body[f] && body[f].toString().trim().length > 0);
    if (!ok) {
      return res.status(400).send(JSON.stringify({ message: 'Invalid payload: idKaryawan, name, email, tanggalJoin required' }));
    }
    const now = new Date().toISOString();
    const rec = {
      id: genId(),
      is_deleted: false,
      created_at: now,
      updated_at: now,
      ...body,
    };
    db.get('staff').push(rec).write();
    return res.status(201).send(JSON.stringify(mapStaffListItem(rec)));
  });

  // PATCH /staff/:id (partial update)
  server.patch('/api/staff/:id', (req, res) => {
    ensureCollection(db, 'staff');
    const id = req.params.id;
    const existing = db.get('staff').find({ id }).value();
    if (!existing || existing.is_deleted) {
      return res.status(404).send(JSON.stringify({ message: 'Staff not found' }));
    }
    const updates = req.body || {};
    const now = new Date().toISOString();
    const merged = { ...existing, ...updates, updated_at: now };
    db.get('staff').find({ id }).assign(merged).write();
    return res.status(200).send(JSON.stringify(mapStaffListItem(merged)));
  });

  // DELETE /staff/:id (soft delete)
  server.delete('/api/staff/:id', (req, res) => {
    ensureCollection(db, 'staff');
    const id = req.params.id;
    const existing = db.get('staff').find({ id }).value();
    if (!existing || existing.is_deleted) {
      return res.status(404).send(JSON.stringify({ message: 'Staff not found' }));
    }
    db.get('staff').find({ id }).assign({ is_deleted: true, updated_at: new Date().toISOString() }).write();
    return res.status(200).send(JSON.stringify({ success: true }));
  });

  // GET /staff/:id/detail (composite)
  server.get('/api/staff/:id/detail', (req, res) => {
    ensureCollection(db, 'staff');
    const id = req.params.id;
    const staff = db.get('staff').find({ id }).value();
    if (!staff || staff.is_deleted) {
      return res.status(404).send(JSON.stringify({ message: 'Staff not found' }));
    }

    // Ensure related collections
    ensureCollection(db, 'education');
    ensureCollection(db, 'documents');

    const staffId = staff.id;
    const idKaryawan = staff.idKaryawan || staff.id_karyawan;

    const education = db
      .get('education')
      .filter((e) => !e.is_deleted && (e.staffId === staffId || e.karyawanId === idKaryawan))
      .map((e) => ({
        id: e.id,
        namaLembaga: e.namaLembaga || e.institution || null,
        nilaiPendidikan: e.nilaiPendidikan || e.grade || null,
        jurusanKeahlian: e.jurusanKeahlian || e.major || null,
        tahunLulus: e.tahunLulus || e.graduationYear || null,
      }))
      .value();

    const documents = db
      .get('documents')
      .filter((d) => !d.is_deleted && (d.staffId === staffId || d.karyawanId === idKaryawan))
      .map((d) => ({
        id: d.id,
        tipeFile: d.tipeFile || d.type || null,
        namaFile: d.namaFile || d.name || null,
        filePath: d.filePath || d.path || null,
      }))
      .value();

    const result = {
      karyawan: mapStaffDetail(staff),
      personalInformation: {
        nik: staff.nik || null,
        agama: staff.agama || null,
        tempatLahir: staff.tempatLahir || null,
        tanggalLahir: staff.tanggalLahir || null,
        jenisKelamin: staff.jenisKelamin || null,
        statusMenikah: staff.statusMenikah || null,
        nomorTelepon: staff.nomorTelepon || null,
        alamatDomisili: staff.alamatDomisili || null,
        alamatKTP: staff.alamatKTP || null,
        facebook: staff.facebook || null,
        xCom: staff.xCom || null,
        linkedin: staff.linkedin || null,
        instagram: staff.instagram || null,
        akunSosialMediaTerdekat: staff.akunSosialMediaTerdekat || null,
        noKontakDarurat: staff.noKontakDarurat || null,
        namaNoKontakDarurat: staff.namaNoKontakDarurat || null,
        hubunganKontakDarurat: staff.hubunganKontakDarurat || null,
      },
      financeAndCompliance: {
        bank: staff.bank || null,
        namaAkunBank: staff.namaAkunBank || null,
        noRekening: staff.noRekening || null,
        npwp: staff.npwp || null,
        noBpjsKesehatan: staff.noBpjsKesehatan || null,
        statusBpjsKesehatan: staff.statusBpjsKesehatan || null,
        noBpjsKetenagakerjaan: staff.noBpjsKetenagakerjaan || null,
        statusBpjsKetenagakerjaan: staff.statusBpjsKetenagakerjaan || null,
        nominalBpjsTk: staff.nominalBpjsTk || null,
      },
      education,
      documents,
    };

    return res.status(200).send(JSON.stringify(result));
  });

  // Education nested endpoints
  server.post('/api/staff/:id/education', (req, res) => {
    ensureCollection(db, 'staff');
    ensureCollection(db, 'education');
    const id = req.params.id;
    const staff = db.get('staff').find({ id }).value();
    if (!staff || staff.is_deleted) {
      return res.status(404).send(JSON.stringify({ message: 'Staff not found' }));
    }
    const body = req.body || {};
    if (!body.namaLembaga) {
      return res.status(400).send(JSON.stringify({ message: 'namaLembaga required' }));
    }
    const rec = {
      id: genId(),
      staffId: staff.id,
      karyawanId: staff.idKaryawan || staff.id_karyawan,
      namaLembaga: body.namaLembaga,
      nilaiPendidikan: body.nilaiPendidikan || null,
      jurusanKeahlian: body.jurusanKeahlian || null,
      tahunLulus: body.tahunLulus || null,
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.get('education').push(rec).write();
    return res.status(201).send(JSON.stringify(rec));
  });

  server.patch('/api/staff/:id/education/:educationId', (req, res) => {
    ensureCollection(db, 'education');
    const educationId = req.params.educationId;
    const existing = db.get('education').find({ id: educationId }).value();
    if (!existing || existing.is_deleted) {
      return res.status(404).send(JSON.stringify({ message: 'Education not found' }));
    }
    const updates = req.body || {};
    const merged = { ...existing, ...updates, updated_at: new Date().toISOString() };
    db.get('education').find({ id: educationId }).assign(merged).write();
    return res.status(200).send(JSON.stringify(merged));
  });

  server.delete('/api/staff/:id/education/:educationId', (req, res) => {
    ensureCollection(db, 'education');
    const educationId = req.params.educationId;
    const existing = db.get('education').find({ id: educationId }).value();
    if (!existing || existing.is_deleted) {
      return res.status(404).send(JSON.stringify({ message: 'Education not found' }));
    }
    db.get('education').find({ id: educationId }).assign({ is_deleted: true, updated_at: new Date().toISOString() }).write();
    return res.status(200).send(JSON.stringify({ success: true }));
  });

  // Documents nested endpoints
  server.post('/api/staff/:id/documents', (req, res) => {
    ensureCollection(db, 'staff');
    ensureCollection(db, 'documents');
    const id = req.params.id;
    const staff = db.get('staff').find({ id }).value();
    if (!staff || staff.is_deleted) {
      return res.status(404).send(JSON.stringify({ message: 'Staff not found' }));
    }
    const body = req.body || {};
    if (!body.tipeFile || !body.namaFile) {
      return res.status(400).send(JSON.stringify({ message: 'tipeFile and namaFile required' }));
    }
    const rec = {
      id: genId(),
      staffId: staff.id,
      karyawanId: staff.idKaryawan || staff.id_karyawan,
      tipeFile: body.tipeFile,
      namaFile: body.namaFile,
      filePath: body.filePath || (body.file && body.file.path) || null,
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.get('documents').push(rec).write();
    return res.status(201).send(JSON.stringify(rec));
  });

  server.patch('/api/staff/:id/documents/:documentId', (req, res) => {
    ensureCollection(db, 'documents');
    const documentId = req.params.documentId;
    const existing = db.get('documents').find({ id: documentId }).value();
    if (!existing || existing.is_deleted) {
      return res.status(404).send(JSON.stringify({ message: 'Document not found' }));
    }
    const updates = req.body || {};
    const merged = { ...existing, ...updates, updated_at: new Date().toISOString() };
    db.get('documents').find({ id: documentId }).assign(merged).write();
    return res.status(200).send(JSON.stringify(merged));
  });

  server.delete('/api/staff/:id/documents/:documentId', (req, res) => {
    ensureCollection(db, 'documents');
    const documentId = req.params.documentId;
    const existing = db.get('documents').find({ id: documentId }).value();
    if (!existing || existing.is_deleted) {
      return res.status(404).send(JSON.stringify({ message: 'Document not found' }));
    }
    db.get('documents').find({ id: documentId }).assign({ is_deleted: true, updated_at: new Date().toISOString() }).write();
    return res.status(200).send(JSON.stringify({ success: true }));
  });
}