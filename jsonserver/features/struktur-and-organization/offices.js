import { parseListParams, applySearch, applySort, paginate, findSkFile, genId } from '../utils.js';

export function registerOffices(server, db) {
  // GET list
  server.get('/api/offices', (req, res) => {
    const { q, sort, order, page, limit } = parseListParams(req);
    const raw = db.get('offices').filter({ is_deleted: false }).value();
    const filtered = applySearch(raw, q, ['name', 'description']);
    const sorted = applySort(filtered, sort, order);
    const mapped = sorted.map((it) => ({
      id: it.id,
      name: it.name,
      description: it.description || null,
      memoNumber: it.memo_number || null,
      skFile: findSkFile(db, 'office', it.id, it.sk_file_id),
    }));
    const result = paginate(mapped, page, limit);
    return res.status(200).send(JSON.stringify(result));
  });

  // POST create
  server.post('/api/offices', (req, res) => {
    const { companyId, name, address, description, employeeCount, memoNumber, skFileId } = req.body || {};
    if (!companyId || !name || !memoNumber || !skFileId) {
      return res.status(400).send(JSON.stringify({ error: 'companyId, name, memoNumber, dan skFileId wajib.' }));
    }
    const now = new Date().toISOString();
    const id = genId();
    const record = {
      id,
      company_id: companyId,
      name,
      address: address || null,
      description: description || null,
      employee_count: typeof employeeCount === 'number' ? employeeCount : null,
      memo_number: memoNumber,
      sk_file_id: skFileId,
      is_deleted: false,
      created_at: now,
      updated_at: now,
    };
    db.get('offices').push(record).write();
    const response = {
      id,
      name,
      description: record.description,
      memoNumber: record.memo_number,
      skFile: findSkFile(db, 'office', id, record.sk_file_id),
    };
    return res.status(201).send(JSON.stringify(response));
  });

  // PATCH update
  server.patch('/api/offices/:id', (req, res) => {
    const id = req.params.id;
    const { companyId, name, address, description, employeeCount, memoNumber, skFileId } = req.body || {};
    if (!memoNumber || !skFileId) {
      return res.status(400).send(JSON.stringify({ error: 'memoNumber dan skFileId wajib.' }));
    }
    const existing = db.get('offices').find({ id, is_deleted: false }).value();
    if (!existing) return res.status(404).send(JSON.stringify({ error: 'Office tidak ditemukan' }));
    const now = new Date().toISOString();
    const updated = {
      ...existing,
      company_id: companyId ?? existing.company_id,
      name: name ?? existing.name,
      address: address ?? existing.address,
      description: description ?? existing.description,
      employee_count: typeof employeeCount === 'number' ? employeeCount : existing.employee_count,
      memo_number: memoNumber,
      sk_file_id: skFileId,
      updated_at: now,
    };
    db.get('offices').find({ id }).assign(updated).write();
    const response = {
      id,
      name: updated.name,
      description: updated.description || null,
      memoNumber: updated.memo_number,
      skFile: findSkFile(db, 'office', id, updated.sk_file_id),
    };
    return res.status(200).send(JSON.stringify(response));
  });

  // DELETE (soft delete)
  server.delete('/api/offices/:id', (req, res) => {
    const id = req.params.id;
    const { memoNumber, skFileId } = req.body || {};
    if (!memoNumber || !skFileId) {
      return res.status(400).send(JSON.stringify({ error: 'memoNumber dan skFileId wajib.' }));
    }
    const existing = db.get('offices').find({ id, is_deleted: false }).value();
    if (!existing) return res.status(404).send(JSON.stringify({ error: 'Office tidak ditemukan' }));
    db.get('offices').find({ id }).assign({ is_deleted: true, memo_number: memoNumber, sk_file_id: skFileId, updated_at: new Date().toISOString() }).write();
    return res.status(200).send(JSON.stringify({ success: true }));
  });
}