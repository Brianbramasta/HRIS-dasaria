import { parseListParams, applySearch, applySort, paginate, findSkFile, genId } from '../utils.js';

export function registerDivisions(server, db) {
  // GET list
  server.get('/api/divisions', (req, res) => {
    const { q, sort, order, page, limit } = parseListParams(req);
    const raw = db.get('divisions').filter({ is_deleted: false }).value();
    const dirs = db.get('directorates').filter({ is_deleted: false }).value();
    const dirById = new Map(dirs.map((d) => [d.id, d]));
    const filtered = applySearch(raw, q, ['name', 'description']);
    const sorted = applySort(filtered, sort, order);
    const mapped = sorted.map((it) => ({
      id: it.id,
      name: it.name,
      description: it.description || null,
      directorateId: it.directorate_id || null,
      directorateName: (dirById.get(it.directorate_id) || {}).name || null,
      memoNumber: it.memo_number || null,
      skFile: findSkFile(db, 'division', it.id, it.sk_file_id),
    }));
    const result = paginate(mapped, page, limit);
    return res.status(200).send(JSON.stringify(result));
  });

  // POST create
  server.post('/api/divisions', (req, res) => {
    const { directorateId, name, description, memoNumber, skFileId } = req.body || {};
    if (!directorateId || !name || !memoNumber || !skFileId) {
      return res.status(400).send(JSON.stringify({ error: 'directorateId, name, memoNumber, dan skFileId wajib.' }));
    }
    const now = new Date().toISOString();
    const id = genId();
    const record = {
      id,
      directorate_id: directorateId,
      name,
      description: description || null,
      memo_number: memoNumber,
      sk_file_id: skFileId,
      is_deleted: false,
      created_at: now,
      updated_at: now,
    };
    db.get('divisions').push(record).write();
    const dir = db.get('directorates').find({ id: directorateId }).value();
    const response = {
      id,
      name,
      description: record.description,
      directorateId,
      directorateName: (dir || {}).name || null,
      memoNumber: record.memo_number,
      skFile: findSkFile(db, 'division', id, record.sk_file_id),
    };
    return res.status(201).send(JSON.stringify(response));
  });

  // PATCH update
  server.patch('/api/divisions/:id', (req, res) => {
    const id = req.params.id;
    const { directorateId, name, description, memoNumber, skFileId } = req.body || {};
    if (!memoNumber || !skFileId) {
      return res.status(400).send(JSON.stringify({ error: 'memoNumber dan skFileId wajib.' }));
    }
    const existing = db.get('divisions').find({ id, is_deleted: false }).value();
    if (!existing) return res.status(404).send(JSON.stringify({ error: 'Division tidak ditemukan' }));
    const now = new Date().toISOString();
    const updated = {
      ...existing,
      directorate_id: directorateId ?? existing.directorate_id,
      name: name ?? existing.name,
      description: description ?? existing.description,
      memo_number: memoNumber,
      sk_file_id: skFileId,
      updated_at: now,
    };
    db.get('divisions').find({ id }).assign(updated).write();
    const dir = db.get('directorates').find({ id: updated.directorate_id }).value();
    const response = {
      id,
      name: updated.name,
      description: updated.description || null,
      directorateId: updated.directorate_id,
      directorateName: (dir || {}).name || null,
      memoNumber: updated.memo_number,
      skFile: findSkFile(db, 'division', id, updated.sk_file_id),
    };
    return res.status(200).send(JSON.stringify(response));
  });

  // DELETE (soft delete)
  server.delete('/api/divisions/:id', (req, res) => {
    const id = req.params.id;
    const { memoNumber, skFileId } = req.body || {};
    if (!memoNumber || !skFileId) {
      return res.status(400).send(JSON.stringify({ error: 'memoNumber dan skFileId wajib.' }));
    }
    const existing = db.get('divisions').find({ id, is_deleted: false }).value();
    if (!existing) return res.status(404).send(JSON.stringify({ error: 'Division tidak ditemukan' }));
    db.get('divisions').find({ id }).assign({ is_deleted: true, memo_number: memoNumber, sk_file_id: skFileId, updated_at: new Date().toISOString() }).write();
    return res.status(200).send(JSON.stringify({ success: true }));
  });
}