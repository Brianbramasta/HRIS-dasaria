import { parseListParams, applySearch, applySort, paginate, findSkFile, genId } from '../utils.js';

export function registerDepartments(server, db) {
  // GET list
  server.get('/api/departments', (req, res) => {
    const { q, sort, order, page, limit } = parseListParams(req);
    const raw = db.get('departments').filter({ is_deleted: false }).value();
    const divisions = db.get('divisions').filter({ is_deleted: false }).value();
    const divById = new Map(divisions.map((d) => [d.id, d]));
    const filtered = applySearch(raw, q, ['name', 'description']);
    const sorted = applySort(filtered, sort, order);
    const mapped = sorted.map((it) => ({
      id: it.id,
      name: it.name,
      description: it.description || null,
      divisionId: it.division_id || null,
      divisionName: (divById.get(it.division_id) || {}).name || null,
      memoNumber: it.memo_number || null,
      skFile: findSkFile(db, 'department', it.id, it.sk_file_id),
    }));
    const result = paginate(mapped, page, limit);
    return res.status(200).send(JSON.stringify(result));
  });

  // POST create
  server.post('/api/departments', (req, res) => {
    const { divisionId, name, description, memoNumber, skFileId } = req.body || {};
    if (!divisionId || !name || !memoNumber || !skFileId) {
      return res.status(400).send(JSON.stringify({ error: 'divisionId, name, memoNumber, dan skFileId wajib.' }));
    }
    const now = new Date().toISOString();
    const id = genId();
    const record = {
      id,
      division_id: divisionId,
      name,
      description: description || null,
      memo_number: memoNumber,
      sk_file_id: skFileId,
      is_deleted: false,
      created_at: now,
      updated_at: now,
    };
    db.get('departments').push(record).write();
    const div = db.get('divisions').find({ id: divisionId }).value();
    const response = {
      id,
      name,
      description: record.description,
      divisionId,
      divisionName: (div || {}).name || null,
      memoNumber: record.memo_number,
      skFile: findSkFile(db, 'department', id, record.sk_file_id),
    };
    return res.status(201).send(JSON.stringify(response));
  });

  // PATCH update
  server.patch('/api/departments/:id', (req, res) => {
    const id = req.params.id;
    const { divisionId, name, description, memoNumber, skFileId } = req.body || {};
    if (!memoNumber || !skFileId) {
      return res.status(400).send(JSON.stringify({ error: 'memoNumber dan skFileId wajib.' }));
    }
    const existing = db.get('departments').find({ id, is_deleted: false }).value();
    if (!existing) return res.status(404).send(JSON.stringify({ error: 'Department tidak ditemukan' }));
    const now = new Date().toISOString();
    const updated = {
      ...existing,
      division_id: divisionId ?? existing.division_id,
      name: name ?? existing.name,
      description: description ?? existing.description,
      memo_number: memoNumber,
      sk_file_id: skFileId,
      updated_at: now,
    };
    db.get('departments').find({ id }).assign(updated).write();
    const div = db.get('divisions').find({ id: updated.division_id }).value();
    const response = {
      id,
      name: updated.name,
      description: updated.description || null,
      divisionId: updated.division_id,
      divisionName: (div || {}).name || null,
      memoNumber: updated.memo_number,
      skFile: findSkFile(db, 'department', id, updated.sk_file_id),
    };
    return res.status(200).send(JSON.stringify(response));
  });

  // DELETE (soft delete)
  server.delete('/api/departments/:id', (req, res) => {
    const id = req.params.id;
    const { memoNumber, skFileId } = req.body || {};
    if (!memoNumber || !skFileId) {
      return res.status(400).send(JSON.stringify({ error: 'memoNumber dan skFileId wajib.' }));
    }
    const existing = db.get('departments').find({ id, is_deleted: false }).value();
    if (!existing) return res.status(404).send(JSON.stringify({ error: 'Department tidak ditemukan' }));
    db.get('departments').find({ id }).assign({ is_deleted: true, memo_number: memoNumber, sk_file_id: skFileId, updated_at: new Date().toISOString() }).write();
    return res.status(200).send(JSON.stringify({ success: true }));
  });
}