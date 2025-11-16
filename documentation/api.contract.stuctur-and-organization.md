# Kontrak API – Structure and Organize (Satu Halaman Satu API)

Dokumen ini merinci kontrak API untuk fitur `structure-and-organize`. Fokus pada endpoint GET dengan prinsip “satu halaman satu API” — setiap halaman (list/detail) memiliki satu endpoint utama yang mengembalikan data yang digunakan UI.

Konvensi parameter list mengikuti service existing: `q` (search), `_sort`, `_order`, `_page`, `_limit`.

## Kebijakan dan Standarisasi Terbaru
- Semua operasi Create, Update, dan Delete pada resource di modul ini WAJIB melampirkan:
  - `memoNumber` (string) — nomor memo pengesahan perubahan.
  - `skFileId` (string) — ID file SK yang diunggah via endpoint file.
- Standar respons file yang ditampilkan di GET (bukan hanya `fileName`) harus menyertakan:
  - `fileName` (string)
  - `fileUrl` (string)
  - `fileType` (string)
  - `size` (string | number | null)
- Untuk konsistensi, properti yang semula berupa `string` (mis. `skFile`, `memoFile`, `logo`) di respons GET diubah menjadi objek `FileSummary` dengan struktur di atas. Bila tidak ada file, nilai `null`.

### Tipe: FileSummary
Objek ringkas untuk representasi file di respons:
```
FileSummary {
  fileName: string,
  fileUrl: string,
  fileType: string,
  size: string | number | null
}
```

## Halaman: Lini Bisnis (List)
- Endpoint: `GET /business-lines`
- Query Params:
  - `q` (opsional) – kata kunci pencarian
  - `_sort` (opsional) – kolom sortir, disarankan `name`
  - `_order` (opsional) – `asc` | `desc`
  - `_page` (wajib) – nomor halaman (1-based)
  - `_limit` (wajib) – jumlah baris per halaman
- Response (Paginated):
  - `data[]`
    - `id` (string)
    - `name` (string)
    - `description` (string)
    - `memoNumber` (string | null)
    - `skFile` (FileSummary | null)
  - `total` (number)
  - `page` (number)
  - `pageSize` (number)
  - `totalPages` (number)

### Operasi CRUD (Halaman Lini Bisnis – List)
- Create: `POST /business-lines`
  - Body:
    - `name` (required)
    - `description?`
    - `memoNumber` (required)
    - `skFileId` (required)
  - Response: BusinessLine baru (`id`, `name`, `description`, `memoNumber`, `skFile`)
- Update: `PATCH /business-lines/:id`
  - Body (partial): `name?`, `description?`, `memoNumber` (required), `skFileId` (required)
  - Response: BusinessLine terkini (dengan `memoNumber`, `skFile`)
- Delete: `DELETE /business-lines/:id`
  - Body: `memoNumber` (required), `skFileId` (required)
  - Response: `{ success: true }`

## Halaman: Detail Lini Bisnis
- Endpoint: `GET /business-lines/:id/detail`
- Path Params:
  - `id` – business line id
- Response (Composite untuk satu halaman):
  - `businessLine`
    - `id` (string)
    - `name` (string)
    - `description` (string)
     - `memoNumber` (string | null)
     - `skFile` (FileSummary | null)
  - `personalFiles[]` (berkas milik lini bisnis)
    - `id` (string)
    - `name` (string) – ditampilkan sebagai “Nama File”
    - `fileName` (string)
    - `fileUrl` (string)
    - `fileType` (string)
    - `size` (string | number | null)
  - `companies[]` (daftar perusahaan di lini bisnis ini)
    - `id` (string)
    - `name` (string)
    - `details` (string | null) – ditampilkan sebagai kolom “Dokumen”

Catatan: Endpoint ini menggantikan kebutuhan multi-call (`/business-lines/:id`, `/files?ownerType=business-line&ownerId=:id`, `/companies?businessLineId=:id`) menjadi satu panggilan per halaman.

### Operasi CRUD (Halaman Detail Lini Bisnis)
- File pribadi lini bisnis:
  - Create: `POST /files`
    - Body: `ownerType="business-line"`, `ownerId` (required), `name` (required), `docNumber?`, `file` (upload)
    - Response: File baru (`id`, `name`, `docNumber`, `fileName`, `fileUrl`, `fileType`, `size`)
  - Update metadata: `PATCH /files/:id`
    - Body (partial): `name?`, `docNumber?`
    - Response: File terkini (`id`, `name`, `docNumber`, `fileName`, `fileUrl`, `fileType`, `size`)
  - Delete: `DELETE /files/:id`
    - Response: `{ success: true }`

## Halaman: Perusahaan (List)
- Endpoint: `GET /companies`
- Query Params:
  - `q` (opsional)
  - `_sort` (opsional) – disarankan `name`
  - `_order` (opsional)
  - `_page` (wajib)
  - `_limit` (wajib)
- Response (Paginated):
  - `data[]`
    - `id` (string)
    - `name` (string) – “Nama Perusahaan”
    - `description` (string) – “Deskripsi Umum”
    - `businessLineId` (string)
    - `businessLineName` (string) – “Lini Bisnis” (denormalized agar tidak perlu join di client)
    - `memoNumber` (string | null)
    - `skFile` (FileSummary | null)
  - `total` (number)
  - `page` (number)
  - `pageSize` (number)
  - `totalPages` (number)

### Operasi CRUD (Halaman Perusahaan – List)
- Create: `POST /companies`
  - Body: `name` (required), `businessLineId` (required), `description?`, `address?`, `employeeCount?`, `postalCode?`, `email?`, `phone?`, `industry?`, `founded?`, `type?`, `website?`, `logoFileId?`
    - `memoNumber` (required)
    - `skFileId` (required)
  - Response: Company baru (dengan `businessLineName` jika tersedia, `memoNumber`, `skFile`)
- Update: `PATCH /companies/:id`
  - Body (partial): field seperti Create (opsional) ditambah `memoNumber` (required), `skFileId` (required)
  - Response: Company terkini
- Delete: `DELETE /companies/:id`
  - Body: `memoNumber` (required), `skFileId` (required)
  - Response: `{ success: true }`

## Halaman: Detail Perusahaan
- Endpoint: `GET /companies/:id/detail`
- Path Params:
  - `id` – company id
- Response (Composite untuk satu halaman):
  - `company`
    - `id` (string)
    - `name` (string)
    - `logo` (FileSummary | null)
    - `businessLineName` (string | null)
    - `description` (string | null)
    - `address` (string | null)
    - `employeeCount` (number | null)
    - `postalCode` (string | null)
    - `email` (string | null)
    - `phone` (string | null)
    - `industry` (string | null)
    - `founded` (string | number | null)
    - `type` (string | null)
    - `website` (string | null)
    - `createdAt` (string)
    - `memoNumber` (string | null)
    - `skFile` (FileSummary | null)
  - `branches[]` (kantor/branch perusahaan)
    - `id` (string)
    - `name` (string)
    - `address` (string | null)
    - `employeeCount` (number | null)
  - `documents[]`
    - `id` (string)
    - `name` (string)
    - `docNumber` (string | null)
    - `fileName` (string)
    - `fileUrl` (string)
    - `fileType` (string)
    - `size` (string | number | null)

Catatan: Endpoint ini menggantikan multi-call (`/companies/:id`, `/offices?companyId=:id`, `/files?ownerType=company&ownerId=:id`) menjadi satu panggilan per halaman.

### Operasi CRUD (Halaman Detail Perusahaan)
- Branch/Kantor perusahaan:
  - Create: `POST /offices`
    - Body: `companyId` (required), `name` (required), `address?`, `description?`, `employeeCount?`, `memoNumber` (required), `skFileId` (required)
    - Response: Office baru
  - Update: `PATCH /offices/:id`
    - Body (partial): field seperti Create (opsional) ditambah `memoNumber` (required), `skFileId` (required)
    - Response: Office terkini
  - Delete: `DELETE /offices/:id`
    - Body: `memoNumber` (required), `skFileId` (required)
    - Response: `{ success: true }`
- Dokumen perusahaan:
  - Create: `POST /files`
    - Body: `ownerType="company"`, `ownerId` (required), `name` (required), `docNumber?`, `file` (upload)
    - Response: File baru (`id`, `name`, `docNumber`, `fileName`, `fileUrl`, `fileType`, `size`)
  - Update metadata: `PATCH /files/:id`
    - Body (partial): `name?`, `docNumber?`
    - Response: File terkini (`id`, `name`, `docNumber`, `fileName`, `fileUrl`, `fileType`, `size`)
  - Delete: `DELETE /files/:id`
    - Response: `{ success: true }`

## Halaman: Kantor (List)
- Endpoint: `GET /offices`
- Query Params: `q`, `_sort`, `_order`, `_page`, `_limit`
- Response (Paginated):
  - `data[]`
    - `id` (string)
    - `name` (string) – “Office”
    - `description` (string)
    - `memoNumber` (string | null)
    - `skFile` (FileSummary | null)
  - `total`, `page`, `pageSize`, `totalPages`

### Operasi CRUD (Halaman Kantor – List)
- Create: `POST /offices`
  - Body: `companyId` (required), `name` (required), `address?`, `description?`, `employeeCount?`, `memoNumber` (required), `skFileId` (required)
  - Response: Office baru
- Update: `PATCH /offices/:id`
  - Body (partial): field seperti Create (opsional) ditambah `memoNumber` (required), `skFileId` (required)
  - Response: Office terkini
- Delete: `DELETE /offices/:id`
  - Body: `memoNumber` (required), `skFileId` (required)
  - Response: `{ success: true }`

## Halaman: Direktorat (List)
- Endpoint: `GET /directorates`
- Query Params: `q`, `_sort`, `_order`, `_page`, `_limit`
- Response (Paginated):
  - `data[]`
    - `id` (string)
    - `name` (string) – “Nama Direktorat”
    - `description` (string) – “Deskripsi Umum”
    - `memoNumber` (string | null)
    - `skFile` (FileSummary | null)
  - `total`, `page`, `pageSize`, `totalPages`

### Operasi CRUD (Halaman Direktorat – List)
- Create: `POST /directorates`
  - Body: `name` (required), `description?`, `memoNumber` (required), `skFileId` (required)
  - Response: Directorate baru
- Update: `PATCH /directorates/:id`
  - Body (partial): `name?`, `description?`, `memoNumber` (required), `skFileId` (required)
  - Response: Directorate terkini
- Delete: `DELETE /directorates/:id`
  - Body: `memoNumber` (required), `skFileId` (required)
  - Response: `{ success: true }`

## Halaman: Divisi (List)
- Endpoint: `GET /divisions`
- Query Params: `q`, `_sort`, `_order`, `_page`, `_limit`
- Response (Paginated):
  - `data[]`
    - `id` (string)
    - `name` (string) – “Nama Divisi”
    - `description` (string)
    - `memoNumber` (string | null)
    - `skFile` (FileSummary | null)
  - `total`, `page`, `pageSize`, `totalPages`

### Operasi CRUD (Halaman Divisi – List)
- Create: `POST /divisions`
  - Body: `directorateId` (required), `name` (required), `description?`, `memoNumber` (required), `skFileId` (required)
  - Response: Division baru
- Update: `PATCH /divisions/:id`
  - Body (partial): `directorateId?`, `name?`, `description?`, `memoNumber` (required), `skFileId` (required)
  - Response: Division terkini
- Delete: `DELETE /divisions/:id`
  - Body: `memoNumber` (required), `skFileId` (required)
  - Response: `{ success: true }`

## Halaman: Departemen (List)
- Endpoint: `GET /departments`
- Query Params: `q`, `_sort`, `_order`, `_page`, `_limit`
- Response (Paginated):
  - `data[]`
    - `id` (string)
    - `name` (string) – “Nama Departemen”
    - `divisionId` (string)
    - `divisionName` (string) – “Nama Divisi” (denormalized)
    - `memoNumber` (string | null)
    - `skFile` (FileSummary | null)
  - `total`, `page`, `pageSize`, `totalPages`

### Operasi CRUD (Halaman Departemen – List)
- Create: `POST /departments`
  - Body: `divisionId` (required), `name` (required), `description?`, `memoNumber` (required), `skFileId` (required)
  - Response: Department baru
- Update: `PATCH /departments/:id`
  - Body (partial): `divisionId?`, `name?`, `description?`, `memoNumber` (required), `skFileId` (required)
  - Response: Department terkini
- Delete: `DELETE /departments/:id`
  - Body: `memoNumber` (required), `skFileId` (required)
  - Response: `{ success: true }`

## Halaman: Jabatan (List)
- Endpoint: `GET /positions`
- Query Params: `q`, `_sort`, `_order`, `_page`, `_limit`
- Response (Paginated):
  - `data[]`
    - `id` (string)
    - `name` (string) – “Nama Jabatan”
    - `grade` (string)
    - `jobDescription` (string)
    - `directSubordinates` (string[]) – “Bawahan Langsung”
    - `memoNumber` (string | null)
    - `skFile` (FileSummary | null)
  - `total`, `page`, `pageSize`, `totalPages`

### Operasi CRUD (Halaman Jabatan – List)
- Create: `POST /positions`
  - Body: `name` (required), `grade?`, `jobDescription?`, `directSubordinates?`, `memoNumber` (required), `skFileId` (required)
  - Response: Position baru
- Update: `PATCH /positions/:id`
  - Body (partial): field seperti Create (opsional) ditambah `memoNumber` (required), `skFileId` (required)
  - Response: Position terkini
- Delete: `DELETE /positions/:id`
  - Body: `memoNumber` (required), `skFileId` (required)
  - Response: `{ success: true }`

## Halaman: Posisi Pegawai (List)
- Endpoint: `GET /employee-positions`
- Query Params: `q`, `_sort`, `_order`, `_page`, `_limit`
- Response (Paginated):
  - `data[]`
    - `id` (string)
    - `name` (string) – “Nama Posisi”
    - `positionId` (string)
    - `positionName` (string) – “Jabatan” (denormalized)
    - `directorateId` (string)
    - `directorateName` (string) – “Direktorat”
    - `divisionId` (string)
    - `divisionName` (string) – “Divisi”
    - `departmentId` (string)
    - `departmentName` (string) – “Departemen”
    - `memoNumber` (string | null)
    - `skFile` (FileSummary | null)
  - `total`, `page`, `pageSize`, `totalPages`

### Operasi CRUD (Halaman Posisi Pegawai – List)
- Create: `POST /employee-positions`
  - Body: `name` (required), `positionId` (required), `directorateId?`, `divisionId?`, `departmentId?`, `memoNumber` (required), `skFileId` (required)
  - Validasi: minimal salah satu dari `directorateId`, `divisionId`, atau `departmentId` harus diisi.
  - Response: EmployeePosition baru
- Update: `PATCH /employee-positions/:id`
  - Body (partial): field seperti Create (opsional) ditambah `memoNumber` (required), `skFileId` (required)
  - Response: EmployeePosition terkini
- Delete: `DELETE /employee-positions/:id`
  - Body: `memoNumber` (required), `skFileId` (required)
  - Response: `{ success: true }`

---

Catatan Implementasi:
- Untuk konsistensi dengan hooks dan service yang ada, parameter pagination mengikuti `_page` dan `_limit` (1-based paging di komponen).
- Field denormalized seperti `businessLineName`, `divisionName`, `positionName`, dst. direkomendasikan muncul di response agar UI tidak perlu memanggil endpoint tambahan.
- Endpoint `GET /offices?companyId=:id` tetap dapat disediakan sebagai utilitas, tetapi halaman detail perusahaan lebih baik menggunakan `GET /companies/:id/detail` agar tetap satu halaman satu API.
 - Perubahan kebijakan: Create/Update/Delete wajib `memoNumber` dan `skFileId`. GET yang menampilkan file harus menyertakan `FileSummary` (fileName, fileUrl, fileType, size).

## Operasi CRUD Per Resource

Semua endpoint berikut memerlukan header `Authorization: Bearer <token>`.

### Lini Bisnis (BusinessLine)
- Create: `POST /business-lines`
  - Request Body:
    - `name` (string, required)
    - `description` (string, optional)
    - `memoNumber` (string, required)
    - `skFileId` (string, required)
  - Response: Objek BusinessLine yang dibuat (`id`, `name`, `description`, `memoNumber`, `skFile`).
  - Status: `201 Created`
- Update: `PATCH /business-lines/:id`
  - Path: `id` (string)
  - Request Body (partial):
    - `name` (string, optional)
    - `description` (string, optional)
    - `memoNumber` (string, required)
    - `skFileId` (string, required)
  - Response: Objek BusinessLine terkini.
  - Status: `200 OK`
- Delete: `DELETE /business-lines/:id`
  - Path: `id` (string)
  - Request Body:
    - `memoNumber` (string, required)
    - `skFileId` (string, required)
  - Response: `{ success: true }`
  - Status: `200 OK`

### Perusahaan (Company)
- Create: `POST /companies`
  - Request Body:
    - `name` (string, required)
    - `businessLineId` (string, required)
    - `description` (string, optional)
    - `address` (string, optional)
    - `employeeCount` (number, optional)
    - `postalCode` (string, optional)
    - `email` (string, optional)
    - `phone` (string, optional)
    - `industry` (string, optional)
    - `founded` (string, optional)
    - `type` (string, optional)
    - `website` (string, optional)
    - `logoFileId` (string, optional) – jika upload logo via endpoint file terpisah
    - `memoNumber` (string, required)
    - `skFileId` (string, required)
  - Response: Objek Company yang dibuat (dengan `businessLineName` terdenormalisasi jika tersedia).
  - Status: `201 Created`
- Update: `PATCH /companies/:id`
  - Path: `id` (string)
  - Request Body (partial): field yang sama seperti Create (opsional) ditambah `memoNumber` (required), `skFileId` (required).
  - Response: Objek Company terkini.
  - Status: `200 OK`
- Delete: `DELETE /companies/:id`
  - Path: `id` (string)
  - Request Body:
    - `memoNumber` (string, required)
    - `skFileId` (string, required)
  - Response: `{ success: true }`
  - Status: `200 OK`

### Kantor (Office)
- Create: `POST /offices`
  - Request Body:
    - `companyId` (string, required)
    - `name` (string, required)
    - `address` (string, optional)
    - `description` (string, optional)
    - `employeeCount` (number, optional)
    - `memoNumber` (string, required)
    - `skFileId` (string, required)
  - Response: Objek Office yang dibuat.
  - Status: `201 Created`
- Update: `PATCH /offices/:id`
  - Path: `id` (string)
  - Request Body (partial): field yang sama seperti Create (opsional) ditambah `memoNumber` (required), `skFileId` (required).
  - Response: Objek Office terkini.
  - Status: `200 OK`
- Delete: `DELETE /offices/:id`
  - Path: `id` (string)
  - Request Body:
    - `memoNumber` (string, required)
    - `skFileId` (string, required)
  - Response: `{ success: true }`
  - Status: `200 OK`

### Direktorat (Directorate)
- Create: `POST /directorates`
  - Request Body:
    - `name` (string, required)
    - `description` (string, optional)
    - `memoNumber` (string, required)
    - `skFileId` (string, required)
  - Response: Objek Directorate yang dibuat.
  - Status: `201 Created`
- Update: `PATCH /directorates/:id`
  - Path: `id` (string)
  - Request Body (partial): `name?`, `description?`, `memoNumber` (required), `skFileId` (required).
  - Response: Objek Directorate terkini.
  - Status: `200 OK`
- Delete: `DELETE /directorates/:id`
  - Path: `id` (string)
  - Request Body:
    - `memoNumber` (string, required)
    - `skFileId` (string, required)
  - Response: `{ success: true }`
  - Status: `200 OK`

### Divisi (Division)
- Create: `POST /divisions`
  - Request Body:
    - `directorateId` (string, required)
    - `name` (string, required)
    - `description` (string, optional)
    - `memoNumber` (string, required)
    - `skFileId` (string, required)
  - Response: Objek Division yang dibuat.
  - Status: `201 Created`
- Update: `PATCH /divisions/:id`
  - Path: `id` (string)
  - Request Body (partial): `directorateId?`, `name?`, `description?`, `memoNumber` (required), `skFileId` (required).
  - Response: Objek Division terkini.
  - Status: `200 OK`
- Delete: `DELETE /divisions/:id`
  - Path: `id` (string)
  - Request Body:
    - `memoNumber` (string, required)
    - `skFileId` (string, required)
  - Response: `{ success: true }`
  - Status: `200 OK`

### Departemen (Department)
- Create: `POST /departments`
  - Request Body:
    - `divisionId` (string, required)
    - `name` (string, required)
    - `description` (string, optional)
    - `memoNumber` (string, required)
    - `skFileId` (string, required)
  - Response: Objek Department yang dibuat (dengan `divisionName` terdenormalisasi jika tersedia).
  - Status: `201 Created`
- Update: `PATCH /departments/:id`
  - Path: `id` (string)
  - Request Body (partial): `divisionId?`, `name?`, `description?`, `memoNumber` (required), `skFileId` (required).
  - Response: Objek Department terkini.
  - Status: `200 OK`
- Delete: `DELETE /departments/:id`
  - Path: `id` (string)
  - Request Body:
    - `memoNumber` (string, required)
    - `skFileId` (string, required)
  - Response: `{ success: true }`
  - Status: `200 OK`

### Jabatan (Position)
- Create: `POST /positions`
  - Request Body:
    - `name` (string, required)
    - `grade` (string, optional)
    - `jobDescription` (string, optional)
    - `directSubordinates` (string[], optional)
    - `memoNumber` (string, required)
    - `skFileId` (string, required)
  - Response: Objek Position yang dibuat.
  - Status: `201 Created`
- Update: `PATCH /positions/:id`
  - Path: `id` (string)
  - Request Body (partial): field yang sama seperti Create (opsional) ditambah `memoNumber` (required), `skFileId` (required).
  - Response: Objek Position terkini.
  - Status: `200 OK`
- Delete: `DELETE /positions/:id`
  - Path: `id` (string)
  - Request Body:
    - `memoNumber` (string, required)
    - `skFileId` (string, required)
  - Response: `{ success: true }`
  - Status: `200 OK`

### Posisi Pegawai (EmployeePosition)
- Create: `POST /employee-positions`
  - Request Body:
    - `name` (string, required)
    - `positionId` (string, required)
    - `directorateId` (string, optional)
    - `divisionId` (string, optional)
    - `departmentId` (string, optional)
    - `memoNumber` (string, required)
    - `skFileId` (string, required)
  - Validasi: minimal salah satu dari `directorateId`, `divisionId`, atau `departmentId` harus diisi.
  - Response: Objek EmployeePosition yang dibuat (dengan nama terdenormalisasi jika tersedia).
  - Status: `201 Created`
- Update: `PATCH /employee-positions/:id`
  - Path: `id` (string)
  - Request Body (partial): field yang sama seperti Create (opsional) ditambah `memoNumber` (required), `skFileId` (required).
  - Response: Objek EmployeePosition terkini.
  - Status: `200 OK`
- Delete: `DELETE /employee-positions/:id`
  - Path: `id` (string)
  - Request Body:
    - `memoNumber` (string, required)
    - `skFileId` (string, required)
  - Response: `{ success: true }`
  - Status: `200 OK`

### Standar Error
- Respons error disarankan memakai format:
  - `{ errorCode: string, message: string, details?: any }`
- Contoh kode status:
  - `400 Bad Request` – validasi gagal
  - `401 Unauthorized` – token tidak valid/expired
  - `403 Forbidden` – tidak punya akses
  - `404 Not Found` – resource tidak ditemukan
  - `409 Conflict` – data bentrok (mis. nama unik)
  - `500 Internal Server Error` – kesalahan server