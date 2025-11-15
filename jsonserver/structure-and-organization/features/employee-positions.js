import { parseListParams, applySearch, applySort, paginate, findSkFile, genId } from '../utils.js';

export function registerEmployeePositions(server, db) {
  // GET list
  server.get('/api/employee-positions', (req, res) => {
    const { q, sort, order, page, limit } = parseListParams(req);
    const raw = db.get('employee_positions').filter({ is_deleted: false }).value();
    const positions = db.get('positions').filter({ is_deleted: false }).value();
    const posById = new Map(positions.map((p) => [p.id, p]));
    const departments = db.get('departments').filter({ is_deleted: false }).value();
    const depById = new Map(departments.map((d) => [d.id, d]));
    const divisions = db.get('divisions').filter({ is_deleted: false }).value();
    const divById = new Map(divisions.map((d) => [d.id, d]));
    const directorates = db.get('directorates').filter({ is_deleted: false }).value();
    const dirById = new Map(directorates.map((d) => [d.id, d]));
    const filtered = applySearch(raw, q, ['name', 'employee_id']);
    const sorted = applySort(filtered, sort, order);
    const mapped = sorted.map((it) => {
      const pos = posById.get(it.position_id) || {};
      const dep = depById.get(it.department_id) || {};
      const div = divById.get(it.division_id) || {};
      const dir = dirById.get(it.directorate_id) || {};
      return {
        id: it.id,
        name: it.name,
        positionId: it.position_id || null,
        positionName: pos.name || null,
        directorateId: it.directorate_id || null,
        directorateName: dir.name || null,
        divisionId: it.division_id || null,
        divisionName: div.name || null,
        departmentId: it.department_id || null,
        departmentName: dep.name || null,
        startDate: it.start_date || null,
        endDate: it.end_date || null,
        memoNumber: it.memo_number || null,
        skFile: findSkFile(db, 'employee-position', it.id, it.sk_file_id),
      };
    });
    const result = paginate(mapped, page, limit);
    return res.status(200).send(JSON.stringify(result));
  });

  // POST create
  server.post('/api/employee-positions', (req, res) => {
    const {
      name,
      positionId,
      directorateId,
      divisionId,
      departmentId,
      startDate,
      endDate,
      memoNumber,
      skFileId,
    } = req.body || {};
    if (!name || !positionId || !memoNumber || !skFileId) {
      return res.status(400).send(JSON.stringify({ error: 'name, positionId, memoNumber, dan skFileId wajib.' }));
    }
    if (!directorateId && !divisionId && !departmentId) {
      return res.status(400).send(JSON.stringify({ error: 'Minimal salah satu dari directorateId/divisionId/departmentId harus diisi.' }));
    }
    const now = new Date().toISOString();
    const id = genId();
    const record = {
      id,
      name,
      position_id: positionId,
      directorate_id: directorateId || null,
      division_id: divisionId || null,
      department_id: departmentId || null,
      start_date: startDate || null,
      end_date: endDate || null,
      memo_number: memoNumber,
      sk_file_id: skFileId,
      is_deleted: false,
      created_at: now,
      updated_at: now,
    };
    db.get('employee_positions').push(record).write();
    const pos = db.get('positions').find({ id: positionId }).value();
    const dir = directorateId ? db.get('directorates').find({ id: directorateId }).value() : null;
    const div = divisionId ? db.get('divisions').find({ id: divisionId }).value() : null;
    const dep = departmentId ? db.get('departments').find({ id: departmentId }).value() : null;
    const response = {
      id,
      name,
      positionId,
      positionName: (pos || {}).name || null,
      directorateId: directorateId || null,
      directorateName: (dir || {}).name || null,
      divisionId: divisionId || null,
      divisionName: (div || {}).name || null,
      departmentId: departmentId || null,
      departmentName: (dep || {}).name || null,
      startDate: record.start_date,
      endDate: record.end_date,
      memoNumber: record.memo_number,
      skFile: findSkFile(db, 'employee-position', id, record.sk_file_id),
    };
    return res.status(201).send(JSON.stringify(response));
  });

  // PATCH update
  server.patch('/api/employee-positions/:id', (req, res) => {
    const id = req.params.id;
    const {
      name,
      positionId,
      directorateId,
      divisionId,
      departmentId,
      startDate,
      endDate,
      memoNumber,
      skFileId,
    } = req.body || {};
    if (!memoNumber || !skFileId) {
      return res.status(400).send(JSON.stringify({ error: 'memoNumber dan skFileId wajib.' }));
    }
    const existing = db.get('employee_positions').find({ id, is_deleted: false }).value();
    if (!existing) return res.status(404).send(JSON.stringify({ error: 'EmployeePosition tidak ditemukan' }));
    const now = new Date().toISOString();
    const updated = {
      ...existing,
      name: name ?? existing.name,
      position_id: positionId ?? existing.position_id,
      directorate_id: directorateId ?? existing.directorate_id,
      division_id: divisionId ?? existing.division_id,
      department_id: departmentId ?? existing.department_id,
      start_date: startDate ?? existing.start_date,
      end_date: endDate ?? existing.end_date,
      memo_number: memoNumber,
      sk_file_id: skFileId,
      updated_at: now,
    };
    db.get('employee_positions').find({ id }).assign(updated).write();
    const pos = db.get('positions').find({ id: updated.position_id }).value();
    const dir = updated.directorate_id ? db.get('directorates').find({ id: updated.directorate_id }).value() : null;
    const div = updated.division_id ? db.get('divisions').find({ id: updated.division_id }).value() : null;
    const dep = updated.department_id ? db.get('departments').find({ id: updated.department_id }).value() : null;
    const response = {
      id,
      name: updated.name,
      positionId: updated.position_id,
      positionName: (pos || {}).name || null,
      directorateId: updated.directorate_id || null,
      directorateName: (dir || {}).name || null,
      divisionId: updated.division_id || null,
      divisionName: (div || {}).name || null,
      departmentId: updated.department_id || null,
      departmentName: (dep || {}).name || null,
      startDate: updated.start_date || null,
      endDate: updated.end_date || null,
      memoNumber: updated.memo_number,
      skFile: findSkFile(db, 'employee-position', id, updated.sk_file_id),
    };
    return res.status(200).send(JSON.stringify(response));
  });

  // DELETE (soft delete)
  server.delete('/api/employee-positions/:id', (req, res) => {
    const id = req.params.id;
    const { memoNumber, skFileId } = req.body || {};
    if (!memoNumber || !skFileId) {
      return res.status(400).send(JSON.stringify({ error: 'memoNumber dan skFileId wajib.' }));
    }
    const existing = db.get('employee_positions').find({ id, is_deleted: false }).value();
    if (!existing) return res.status(404).send(JSON.stringify({ error: 'EmployeePosition tidak ditemukan' }));
    db.get('employee_positions').find({ id }).assign({ is_deleted: true, memo_number: memoNumber, sk_file_id: skFileId, updated_at: new Date().toISOString() }).write();
    return res.status(200).send(JSON.stringify({ success: true }));
  });
}