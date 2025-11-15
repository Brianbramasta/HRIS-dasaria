import { parseListParams, applySearch, applySort, paginate, findSkFile, findLogoFile, toFileSummary, genId } from '../utils.js';

export function registerCompanies(server, db) {
  // GET list
  server.get('/api/companies', (req, res) => {
    const { q, sort, order, page, limit } = parseListParams(req);
    const raw = db.get('companies').filter({ is_deleted: false }).value();
    const bl = db.get('business_lines').filter({ is_deleted: false }).value();
    const blById = new Map(bl.map((b) => [b.id, b]));
    const filtered = applySearch(raw, q, ['name']);
    const sorted = applySort(filtered, sort, order);
    const mapped = sorted.map((it) => ({
      id: it.id,
      name: it.name,
      description: it.description || null,
      businessLineId: it.business_line_id || null,
      businessLineName: (blById.get(it.business_line_id) || {}).name || null,
      memoNumber: it.memo_number || null,
      skFile: findSkFile(db, 'company', it.id, it.sk_file_id),
    }));
    const result = paginate(mapped, page, limit);
    return res.status(200).send(JSON.stringify(result));
  });

  // GET detail
  server.get('/api/companies/:id/detail', (req, res) => {
    const id = req.params.id;
    const company = db.get('companies').find({ id, is_deleted: false }).value();
    if (!company) return res.status(404).send(JSON.stringify({ error: 'Company tidak ditemukan' }));
    const branches = db.get('offices').filter({ company_id: id, is_deleted: false }).value();
    const documents = db.get('files').filter({ owner_type: 'company', owner_id: id, is_deleted: false }).value();
    const bl = db.get('business_lines').find({ id: company.business_line_id }).value();
    const response = {
      company: {
        id: company.id,
        name: company.name,
        logo: findLogoFile(db, 'company', company.id, company.logo_file_id),
        businessLineName: (bl || {}).name || null,
        description: company.description || null,
        address: company.address || null,
        employeeCount: company.employee_count ?? null,
        postalCode: company.postal_code || null,
        email: company.email || null,
        phone: company.phone || null,
        industry: company.industry || null,
        founded: company.founded ?? null,
        type: company.type || null,
        website: company.website || null,
        createdAt: company.created_at || null,
        memoNumber: company.memo_number || null,
        skFile: findSkFile(db, 'company', company.id, company.sk_file_id),
      },
      branches: branches.map((b) => ({ id: b.id, name: b.name, address: b.address || null, employeeCount: b.employee_count ?? null })),
      documents: documents.map(toFileSummary).filter(Boolean),
    };
    return res.status(200).send(JSON.stringify(response));
  });

  // POST create
  server.post('/api/companies', (req, res) => {
    const {
      name,
      businessLineId,
      description,
      address,
      employeeCount,
      postalCode,
      email,
      phone,
      industry,
      founded,
      type,
      website,
      logoFileId,
      memoNumber,
      skFileId,
    } = req.body || {};

    if (!name || !businessLineId || !memoNumber || !skFileId) {
      return res.status(400).send(JSON.stringify({ error: 'name, businessLineId, memoNumber, dan skFileId wajib.' }));
    }

    const now = new Date().toISOString();
    const id = genId();
    const record = {
      id,
      name,
      business_line_id: businessLineId,
      description: description || null,
      address: address || null,
      employee_count: typeof employeeCount === 'number' ? employeeCount : null,
      postal_code: postalCode || null,
      email: email || null,
      phone: phone || null,
      industry: industry || null,
      founded: founded ?? null,
      type: type || null,
      website: website || null,
      logo_file_id: logoFileId || null,
      memo_number: memoNumber,
      sk_file_id: skFileId,
      is_deleted: false,
      created_at: now,
      updated_at: now,
    };
    db.get('companies').push(record).write();

    const bl = db.get('business_lines').find({ id: businessLineId }).value();
    const response = {
      id,
      name,
      businessLineId,
      businessLineName: (bl || {}).name || null,
      memoNumber: record.memo_number,
      skFile: findSkFile(db, 'company', id, record.sk_file_id),
    };
    return res.status(201).send(JSON.stringify(response));
  });

  // PATCH update
  server.patch('/api/companies/:id', (req, res) => {
    const id = req.params.id;
    const {
      name,
      businessLineId,
      description,
      address,
      employeeCount,
      postalCode,
      email,
      phone,
      industry,
      founded,
      type,
      website,
      logoFileId,
      memoNumber,
      skFileId,
    } = req.body || {};

    if (!memoNumber || !skFileId) {
      return res.status(400).send(JSON.stringify({ error: 'memoNumber dan skFileId wajib.' }));
    }
    const existing = db.get('companies').find({ id, is_deleted: false }).value();
    if (!existing) return res.status(404).send(JSON.stringify({ error: 'Company tidak ditemukan' }));
    const now = new Date().toISOString();
    const updated = {
      ...existing,
      name: name ?? existing.name,
      business_line_id: businessLineId ?? existing.business_line_id,
      description: description ?? existing.description,
      address: address ?? existing.address,
      employee_count: typeof employeeCount === 'number' ? employeeCount : existing.employee_count,
      postal_code: postalCode ?? existing.postal_code,
      email: email ?? existing.email,
      phone: phone ?? existing.phone,
      industry: industry ?? existing.industry,
      founded: founded ?? existing.founded,
      type: type ?? existing.type,
      website: website ?? existing.website,
      logo_file_id: logoFileId ?? existing.logo_file_id,
      memo_number: memoNumber,
      sk_file_id: skFileId,
      updated_at: now,
    };
    db.get('companies').find({ id }).assign(updated).write();

    const bl = db.get('business_lines').find({ id: updated.business_line_id }).value();
    const response = {
      id,
      name: updated.name,
      businessLineId: updated.business_line_id,
      businessLineName: (bl || {}).name || null,
      memoNumber: updated.memo_number,
      skFile: findSkFile(db, 'company', id, updated.sk_file_id),
    };
    return res.status(200).send(JSON.stringify(response));
  });

  // DELETE (soft delete)
  server.delete('/api/companies/:id', (req, res) => {
    const id = req.params.id;
    const { memoNumber, skFileId } = req.body || {};
    if (!memoNumber || !skFileId) {
      return res.status(400).send(JSON.stringify({ error: 'memoNumber dan skFileId wajib.' }));
    }
    const existing = db.get('companies').find({ id, is_deleted: false }).value();
    if (!existing) return res.status(404).send(JSON.stringify({ error: 'Company tidak ditemukan' }));
    db.get('companies').find({ id }).assign({ is_deleted: true, memo_number: memoNumber, sk_file_id: skFileId, updated_at: new Date().toISOString() }).write();
    return res.status(200).send(JSON.stringify({ success: true }));
  });
}