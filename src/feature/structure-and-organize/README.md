# Fitur Struktur dan Organisasi

Fitur ini menyediakan manajemen struktur organisasi perusahaan dengan 8 tab utama:

## 8 Tab Utama

1. **Lini Bisnis** - Mengelola lini bisnis perusahaan
2. **Perusahaan** - Mengelola data perusahaan
3. **Kantor** - Mengelola data kantor/cabang
4. **Direktorat** - Mengelola direktorat
5. **Divisi** - Mengelola divisi
6. **Departemen** - Mengelola departemen
7. **Posisi** - Mengelola posisi/jabatan
8. **Posisi Karyawan** - Mengelola penempatan karyawan

## Arsitektur

Fitur ini mengikuti prinsip clean architecture dengan pemisahan yang jelas antara:

- **Types** - Definisi interface dan type TypeScript
- **Services** - Logic bisnis dan komunikasi API
- **Hooks** - Custom React hooks untuk state management
- **Components** - Komponen UI reusable
- **Pages** - Halaman utama fitur

## Cara Penggunaan

### 1. Menjalankan json-server

```bash
# Install json-server secara global
npm install -g json-server

# Di root project
json-server organization-db.json --watch --port 3001 --routes routes.json

# Atau menggunakan file konfigurasi
json-server --watch organization-db.json --config json-server.json
```

### 2. Import Halaman

```typescript
import { StrukturOrganisasiPage } from '../feature/structure-and-organize';

// Dalam routing aplikasi
<Route path="/struktur-organisasi" element={<StrukturOrganisasiPage />} />
```

### 3. Menggunakan Komponen Individual

```typescript
import { DataTable, Tabs } from '../feature/structure-and-organize';

// Menggunakan DataTable
<DataTable
  columns={columns}
  data={data}
  loading={loading}
  error={error}
  total={total}
  page={page}
  pageSize={pageSize}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
  onSort={setSort}
  sortBy={sortBy}
  sortOrder={sortOrder}
/>

// Menggunakan Tabs
<Tabs
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="scrollable"
  orientation="horizontal"
/>
```

### 4. Menggunakan Hooks

```typescript
import { useBusinessLines, useCompanies } from '../feature/structure-and-organize';

// Menggunakan hook untuk business lines
const {
  businessLines,
  loading,
  error,
  total,
  page,
  pageSize,
  fetchBusinessLines,
  createBusinessLine,
  updateBusinessLine,
  deleteBusinessLine,
  setPage,
  setPageSize,
  setSort,
  setSearch
} = useBusinessLines();

// Menggunakan hook untuk companies
const {
  companies,
  loading,
  error,
  total,
  page,
  pageSize,
  fetchCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  setPage,
  setPageSize,
  setSort,
  setSearch
} = useCompanies();
```

## Fitur Utama

### Dynamic Table dengan Column Filter

Tabel pada setiap tab memiliki fitur:
- Sorting (ascending/descending)
- Pagination
- Column filtering (dengan popup)
- Search
- CRUD operations (Create, Read, Update, Delete)

### Responsive Design

Semua komponen dibuat responsive dan dapat digunakan di berbagai ukuran layar.

### Error Handling

Fitur ini memiliki error handling yang komprehensif untuk:
- Network errors
- Validation errors
- Server errors

## API Endpoints

Berikut adalah endpoint yang tersedia di json-server:

- `GET /business-lines` - Mendapatkan daftar lini bisnis
- `GET /business-lines/:id` - Mendapatkan detail lini bisnis
- `POST /business-lines` - Membuat lini bisnis baru
- `PUT /business-lines/:id` - Update lini bisnis
- `DELETE /business-lines/:id` - Hapus lini bisnis

- `GET /companies` - Mendapatkan daftar perusahaan
- `GET /companies/:id` - Mendapatkan detail perusahaan
- `POST /companies` - Membuat perusahaan baru
- `PUT /companies/:id` - Update perusahaan
- `DELETE /companies/:id` - Hapus perusahaan

- `GET /offices` - Mendapatkan daftar kantor
- `GET /offices/:id` - Mendapatkan detail kantor
- `POST /offices` - Membuat kantor baru
- `PUT /offices/:id` - Update kantor
- `DELETE /offices/:id` - Hapus kantor

- `GET /directorates` - Mendapatkan daftar direktorat
- `GET /directorates/:id` - Mendapatkan detail direktorat
- `POST /directorates` - Membuat direktorat baru
- `PUT /directorates/:id` - Update direktorat
- `DELETE /directorates/:id` - Hapus direktorat

- `GET /divisions` - Mendapatkan daftar divisi
- `GET /divisions/:id` - Mendapatkan detail divisi
- `POST /divisions` - Membuat divisi baru
- `PUT /divisions/:id` - Update divisi
- `DELETE /divisions/:id` - Hapus divisi

- `GET /departments` - Mendapatkan daftar departemen
- `GET /departments/:id` - Mendapatkan detail departemen
- `POST /departments` - Membuat departemen baru
- `PUT /departments/:id` - Update departemen
- `DELETE /departments/:id` - Hapus departemen

- `GET /positions` - Mendapatkan daftar posisi
- `GET /positions/:id` - Mendapatkan detail posisi
- `POST /positions` - Membuat posisi baru
- `PUT /positions/:id` - Update posisi
- `DELETE /positions/:id` - Hapus posisi

- `GET /employee-positions` - Mendapatkan daftar posisi karyawan
- `GET /employee-positions/:id` - Mendapatkan detail posisi karyawan
- `POST /employee-positions` - Membuat posisi karyawan baru
- `PUT /employee-positions/:id` - Update posisi karyawan
- `DELETE /employee-positions/:id` - Hapus posisi karyawan

## Struktur Folder

```
structure-and-organize/
├── types/
│   └── organization.types.ts
├── services/
│   └── organization.service.ts
├── hooks/
│   ├── useBusinessLines.ts
│   ├── useCompanies.ts
│   ├── useOffices.ts
│   ├── useDirectorates.ts
│   ├── useDivisions.ts
│   ├── useDepartments.ts
│   ├── usePositions.ts
│   └── useEmployeePositions.ts
├── components/
│   ├── DataTable.tsx
│   └── Tabs.tsx
├── pages/
│   └── StrukturOrganisasiPage.tsx
├── db.json
├── json-server.json
├── routes.json
├── index.ts
└── README.md
```