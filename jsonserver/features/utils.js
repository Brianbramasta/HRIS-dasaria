// Shared utilities for Structure & Organization feature endpoints

export function toFileSummary(file) {
  if (!file) return null;
  return {
    fileName: file.file_name || file.name || null,
    fileUrl: file.file_url || file.path || null,
    fileType: file.file_type || file.fileType || null,
    size: typeof file.size === 'number' ? file.size : null,
  };
}

export function findSkFile(db, ownerType, ownerId, skFileId) {
  const files = db.get('files');
  let found = null;
  if (skFileId) {
    found = files.find({ id: skFileId }).value();
  }
  if (!found) {
    found = files
      .filter({ owner_type: ownerType, owner_id: ownerId, category: 'sk', is_deleted: false })
      .sortBy((f) => new Date(f.updated_at || f.created_at || 0).getTime())
      .last()
      .value();
  }
  return toFileSummary(found);
}

export function findLogoFile(db, ownerType, ownerId, logoFileId) {
  const files = db.get('files');
  let found = null;
  if (logoFileId) {
    found = files.find({ id: logoFileId }).value();
  }
  if (!found) {
    found = files
      .filter({ owner_type: ownerType, owner_id: ownerId, category: 'logo', is_deleted: false })
      .sortBy((f) => new Date(f.updated_at || f.created_at || 0).getTime())
      .last()
      .value();
  }
  return toFileSummary(found);
}

export function parseListParams(req) {
  const q = (req.query.q || '').toString().toLowerCase();
  const sort = (req.query._sort || 'updated_at').toString();
  const order = (req.query._order || 'desc').toString();
  const page = parseInt(req.query._page || req.query.page || '1', 10);
  const limit = parseInt(req.query._limit || req.query.limit || '10', 10);
  return { q, sort, order, page, limit };
}

export function applySearch(items, q, fields = ['name', 'description']) {
  if (!q) return items;
  const words = q.split(/\s+/).filter(Boolean);
  return items.filter((it) => {
    const hay = fields.map((f) => (it[f] || '')).join(' ').toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}

export function applySort(items, sort, order) {
  return items.sort((a, b) => {
    const av = a[sort];
    const bv = b[sort];
    const ad = new Date(av).getTime();
    const bd = new Date(bv).getTime();
    const comp = isNaN(ad) || isNaN(bd) ? (av > bv ? 1 : av < bv ? -1 : 0) : ad - bd;
    return order === 'desc' ? -comp : comp;
  });
}

export function paginate(items, page, limit) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));
  const p = Math.min(Math.max(1, page), totalPages);
  const start = (p - 1) * limit;
  const end = start + limit;
  const data = items.slice(start, end);
  return { data, total, page: p, pageSize: limit, totalPages };
}

export function genId() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}