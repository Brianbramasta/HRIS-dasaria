import { parseListParams, applySearch, applySort, paginate, findSkFile, toFileSummary, genId } from '../utils.js';

export function registerBusinessLines(server, db) {
  // GET list
  server.get('/api/business-lines', (req, res) => {
    const { q, sort, order, page, limit } = parseListParams(req);
    const raw = db.get('business_lines').filter({ is_deleted: false }).value();
    const filtered = applySearch(raw, q, ['name', 'description']);
    const sorted = applySort(filtered, sort, order);
    const mapped = sorted.map((it) => ({
      id: it.id,
      name: it.name,
      description: it.description || null,
      memoNumber: it.memo_number || null,
      skFile: findSkFile(db, 'business-line', it.id, it.sk_file_id),
    }));
    const result = paginate(mapped, page, limit);
    return res.status(200).send(JSON.stringify(result));
  });

  // GET detail
  server.get('/api/business-lines/:id/detail', (req, res) => {
    const id = req.params.id;
    const bl = db.get('business_lines').find({ id, is_deleted: false }).value();
    if (!bl) return res.status(404).send(JSON.stringify({ error: 'Business line tidak ditemukan' }));
    const companies = db.get('companies').filter({ business_line_id: id, is_deleted: false }).value();
    const documents = db.get('files').filter({ owner_type: 'business-line', owner_id: id, is_deleted: false }).value();
    const response = {
      businessLine: {
        id: bl.id,
        name: bl.name,
        description: bl.description || null,
        memoNumber: bl.memo_number || null,
        skFile: findSkFile(db, 'business-line', bl.id, bl.sk_file_id),
      },
      personalFiles: documents.map(toFileSummary).filter(Boolean),
      companies: companies.map((c) => ({ id: c.id, name: c.name, details: c.details || null })),
    };
    return res.status(200).send(JSON.stringify(response));
  });

  // POST create
  server.post('/api/business-lines', (req, res) => {
    const { name, description, memoNumber, skFileId } = req.body || {};
    if (!name || !memoNumber || !skFileId) {
      return res.status(400).send(JSON.stringify({ error: 'name, memoNumber, dan skFileId wajib.' }));
    }
    const now = new Date().toISOString();
    const id = genId();
    const record = {
      id,
      name,
      description: description || null,
      memo_number: memoNumber,
      sk_file_id: skFileId,
      is_deleted: false,
      created_at: now,
      updated_at: now,
    };
    db.get('business_lines').push(record).write();
    const response = {
      id,
      name,
      description: record.description,
      memoNumber: record.memo_number,
      skFile: findSkFile(db, 'business-line', id, record.sk_file_id),
    };
    return res.status(201).send(JSON.stringify(response));
  });

  // PATCH update
  server.patch('/api/business-lines/:id', (req, res) => {
    const id = req.params.id;
    const { name, description, memoNumber, skFileId } = req.body || {};
    if (!memoNumber || !skFileId) {
      return res.status(400).send(JSON.stringify({ error: 'memoNumber dan skFileId wajib.' }));
    }
    const existing = db.get('business_lines').find({ id, is_deleted: false }).value();
    if (!existing) return res.status(404).send(JSON.stringify({ error: 'Business line tidak ditemukan' }));
    const now = new Date().toISOString();
    const updated = {
      ...existing,
      name: name ?? existing.name,
      description: description ?? existing.description,
      memo_number: memoNumber,
      sk_file_id: skFileId,
      updated_at: now,
    };
    db.get('business_lines').find({ id }).assign(updated).write();
    const response = {
      id,
      name: updated.name,
      description: updated.description || null,
      memoNumber: updated.memo_number,
      skFile: findSkFile(db, 'business-line', id, updated.sk_file_id),
    };
    return res.status(200).send(JSON.stringify(response));
  });

  // DELETE (soft delete)
  server.delete('/api/business-lines/:id', (req, res) => {
    const id = req.params.id;
    const { memoNumber, skFileId } = req.body || {};
    if (!memoNumber || !skFileId) {
      return res.status(400).send(JSON.stringify({ error: 'memoNumber dan skFileId wajib.' }));
    }
    const existing = db.get('business_lines').find({ id, is_deleted: false }).value();
    if (!existing) return res.status(404).send(JSON.stringify({ error: 'Business line tidak ditemukan' }));
    db.get('business_lines').find({ id }).assign({ is_deleted: true, memo_number: memoNumber, sk_file_id: skFileId, updated_at: new Date().toISOString() }).write();
    return res.status(200).send(JSON.stringify({ success: true }));
  });
}