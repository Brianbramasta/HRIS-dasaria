import { parseListParams, applySearch, applySort, paginate, findSkFile, genId } from '../utils.js';

export function registerPositions(server, db) {
  // GET list
  server.get('/api/positions', (req, res) => {
    const { q, sort, order, page, limit } = parseListParams(req);
    const raw = db.get('positions').filter({ is_deleted: false }).value();
    const filtered = applySearch(raw, q, ['name', 'job_description']);
    const sorted = applySort(filtered, sort, order);
    const mapped = sorted.map((it) => ({
      id: it.id,
      name: it.name,
      grade: it.grade || null,
      jobDescription: it.job_description || null,
      directSubordinates: Array.isArray(it.direct_subordinates) ? it.direct_subordinates : [],
      memoNumber: it.memo_number || null,
      skFile: findSkFile(db, 'position', it.id, it.sk_file_id),
    }));
    const result = paginate(mapped, page, limit);
    return res.status(200).send(JSON.stringify(result));
  });

  // POST create
  server.post('/api/positions', (req, res) => {
    const { name, grade, jobDescription, directSubordinates, memoNumber, skFileId } = req.body || {};
    if (!name || !memoNumber || !skFileId) {
      return res.status(400).send(JSON.stringify({ error: 'name, memoNumber, dan skFileId wajib.' }));
    }
    const now = new Date().toISOString();
    const id = genId();
    const record = {
      id,
      name,
      grade: grade || null,
      job_description: jobDescription || null,
      direct_subordinates: Array.isArray(directSubordinates) ? directSubordinates : [],
      memo_number: memoNumber,
      sk_file_id: skFileId,
      is_deleted: false,
      created_at: now,
      updated_at: now,
    };
    db.get('positions').push(record).write();
    const response = {
      id,
      name,
      grade: record.grade,
      jobDescription: record.job_description,
      directSubordinates: record.direct_subordinates,
      memoNumber: record.memo_number,
      skFile: findSkFile(db, 'position', id, record.sk_file_id),
    };
    return res.status(201).send(JSON.stringify(response));
  });

  // PATCH update
  server.patch('/api/positions/:id', (req, res) => {
    const id = req.params.id;
    const { name, grade, jobDescription, directSubordinates, memoNumber, skFileId } = req.body || {};
    if (!memoNumber || !skFileId) {
      return res.status(400).send(JSON.stringify({ error: 'memoNumber dan skFileId wajib.' }));
    }
    const existing = db.get('positions').find({ id, is_deleted: false }).value();
    if (!existing) return res.status(404).send(JSON.stringify({ error: 'Position tidak ditemukan' }));
    const now = new Date().toISOString();
    const updated = {
      ...existing,
      name: name ?? existing.name,
      grade: grade ?? existing.grade,
      job_description: jobDescription ?? existing.job_description,
      direct_subordinates: Array.isArray(directSubordinates) ? directSubordinates : existing.direct_subordinates,
      memo_number: memoNumber,
      sk_file_id: skFileId,
      updated_at: now,
    };
    db.get('positions').find({ id }).assign(updated).write();
    const response = {
      id,
      name: updated.name,
      grade: updated.grade || null,
      jobDescription: updated.job_description || null,
      directSubordinates: updated.direct_subordinates || [],
      memoNumber: updated.memo_number,
      skFile: findSkFile(db, 'position', id, updated.sk_file_id),
    };
    return res.status(200).send(JSON.stringify(response));
  });

  // DELETE (soft delete)
  server.delete('/api/positions/:id', (req, res) => {
    const id = req.params.id;
    const { memoNumber, skFileId } = req.body || {};
    if (!memoNumber || !skFileId) {
      return res.status(400).send(JSON.stringify({ error: 'memoNumber dan skFileId wajib.' }));
    }
    const existing = db.get('positions').find({ id, is_deleted: false }).value();
    if (!existing) return res.status(404).send(JSON.stringify({ error: 'Position tidak ditemukan' }));
    db.get('positions').find({ id }).assign({ is_deleted: true, memo_number: memoNumber, sk_file_id: skFileId, updated_at: new Date().toISOString() }).write();
    return res.status(200).send(JSON.stringify({ success: true }));
  });
}