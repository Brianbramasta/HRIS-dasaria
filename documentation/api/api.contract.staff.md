# Kontrak API – Staff (Satu Halaman Satu API)

Dokumen ini merinci kontrak API untuk fitur `staff` sesuai skema database (`references/database.schema.md`) dan pola service di proyek. Setiap halaman memiliki satu endpoint GET utama (list/detail) dengan data minimal yang dipakai UI. CRUD mengikuti pola create/update/delete dengan field minimal sesuai form. Diselaraskan dengan service yang ada (`karyawanService`) dan kolom-kolom actual di UI.

Konvensi umum:
- Header auth: `Authorization: Bearer <token>` untuk semua endpoint yang memodifikasi data.
- Parameter list mengikuti pola service: `search`, `company`, `department`, `status`, `sortBy`, `order`, `page`, `limit`.
- Response error: `{ errorCode: string, message: string, details?: any }`.

## Halaman: Karyawan (List)
- Endpoint: `GET /staff`
- Query Params:
  - `search` (opsional) – cari di `idKaryawan`, `name`, `email`
  - `status` (opsional) – mis. `aktif`, `cuti`, `resign`, `nonaktif`
  - `company` (opsional)
  - `department` (opsional)
  - `sortBy` (opsional) – salah satu dari kolom di bawah (mis. `name`, `tanggalJoin`)
  - `order` (opsional) – `asc` | `desc`
  - `page` (opsional, default 1)
  - `limit` (opsional, default 10)
- Response (Paginated):
  - `data[]` (sesuai kolom UI DataKaryawanPage)
    - `id` (string)
    - `idKaryawan` (string)
    - `name` (string)
    - `email` (string)
    - `avatar` (string | null)
    - `jabatan` (string | null)
    - `posisi` (string | null)
    - `company` (string)
    - `office` (string | null)
    - `departement` (string | null) — alias tampilan untuk department
    - `divisi` (string | null)
    - `grade` (string | null)
    - `status` (string | null)
    - `statusPayroll` (string | null)
    - `kategori` (string | null)
    - `tanggalJoin` (string)
    - `tanggalBerakhir` (string | null)
  -  `total`, `page`, `pageSize`, `totalPages`

-### Operasi CRUD (Halaman Karyawan – List)
- Create: `POST /staff`
  - Request Body:
    - `idKaryawan` (string, required)
    - `name` (string, required)
    - `email` (string, required)
    - `posisi` (string, optional)
    - `jabatan` (string, optional)
    - `tanggalJoin` (string, required, format ISO date)
    - `companyId` (string, optional)
    - `departmentId` (string, optional)
    - `officeId` (string, optional)
    - `status` (string, optional)
    - `statusPayroll` (string, optional)
    - `kategori` (string, optional)
  - Response: Objek karyawan ringkas seperti di list.
  - Status: `201 Created`
- Update: `PATCH /staff/:id`
  - Path: `id` (string)
  - Request Body (partial): field seperti Create (opsional).
  - Response: Objek karyawan ringkas terkini.
  - Status: `200 OK`
- Delete: `DELETE /staff/:id`
  - Path: `id` (string)
  - Response: `{ success: true }`
  - Status: `200 OK`

## Halaman: Detail Karyawan
- Endpoint: `GET /staff/:id/detail`
- Path Params: `id` – karyawan id
- Response (Composite untuk satu halaman):
  - `karyawan`
    - `id` (string)
    - `idKaryawan` (string)
    - `name` (string)
    - `email` (string)
    - `posisi` (string | null)
    - `jabatan` (string | null)
    - `tanggalJoin` (string)
    - `tanggalBerakhir` (string | null)
    - `company` (string)
    - `companyId` (string | null)
    - `department` (string | null)
    - `departmentId` (string | null)
    - `office` (string | null)
    - `officeId` (string | null)
    - `divisi` (string | null)
    - `grade` (string | null)
    - `status` (string | null)
    - `statusPayroll` (string | null)
    - `kategori` (string | null)
    - `avatar` (string | null)
  - `personalInformation`
    - `nik` (string | null)
    - `agama` (string | null)
    - `tempatLahir` (string | null)
    - `tanggalLahir` (string | null)
    - `jenisKelamin` (string | null)
    - `statusMenikah` (string | null)
    - `nomorTelepon` (string | null)
    - `alamatDomisili` (string | null)
    - `alamatKTP` (string | null)
    - `facebook` (string | null)
    - `xCom` (string | null)
    - `linkedin` (string | null)
    - `instagram` (string | null)
    - `akunSosialMediaTerdekat` (string | null)
    - `noKontakDarurat` (string | null)
    - `namaNoKontakDarurat` (string | null)
    - `hubunganKontakDarurat` (string | null)
  - `financeAndCompliance`
    - `bank` (string | null)
    - `namaAkunBank` (string | null)
    - `noRekening` (string | null)
    - `npwp` (string | null)
    - `noBpjsKesehatan` (string | null)
    - `statusBpjsKesehatan` (string | null)
    - `noBpjsKetenagakerjaan` (string | null)
    - `statusBpjsKetenagakerjaan` (string | null)
    - `nominalBpjsTk` (string | null)
  - `education[]`
    - `id` (string)
    - `namaLembaga` (string)
    - `nilaiPendidikan` (string | null)
    - `jurusanKeahlian` (string | null)
    - `tahunLulus` (string | null)
  - `documents[]`
    - `id` (string)
    - `tipeFile` (string)
    - `namaFile` (string)
    - `filePath` (string | null)

### Operasi CRUD (Halaman Detail Karyawan)
- Update Karyawan: `PATCH /staff/:id`
  - Body (partial): field personal dan finance/compliance di atas (opsional)
  - Response: `karyawan` terkini (bagian yang diedit)
- Education:
  - Create: `POST /staff/:id/education`
    - Body: `namaLembaga` (required), `nilaiPendidikan?`, `jurusanKeahlian?`, `tahunLulus?`
    - Response: Education baru
  - Update: `PATCH /staff/:id/education/:educationId`
    - Body (partial): field seperti create
    - Response: Education terkini
  - Delete: `DELETE /staff/:id/education/:educationId`
    - Response: `{ success: true }`
- Documents:
  - Create: `POST /staff/:id/documents`
    - Body: `tipeFile` (required), `namaFile` (required), `file` (upload) atau `filePath`
    - Response: Document baru
  - Update: `PATCH /staff/:id/documents/:documentId`
    - Body (partial): `tipeFile?`, `namaFile?`
    - Response: Document terkini
  - Delete: `DELETE /staff/:id/documents/:documentId`
    - Response: `{ success: true }`

## Halaman: Pengunduran Diri (List)
- Endpoint: `GET /pengunduran-diri`
- Query Params:
  - `q` (opsional) – cari di `id_karyawan_str`, `name`, `email`
  - `status` (opsional) – `In Progress`, `Pending`, `Approved`, `Rejected`
  - `departmentId` (opsional)
  - `_sort` (opsional) – disarankan `tanggal_pengajuan`
  - `_order` (opsional) – `asc` | `desc`
  - `_page` (wajib)
  - `_limit` (wajib)
- Response (Paginated):
  - `data[]`
    - `id` (string)
    - `karyawanId` (string)
    - `idKaryawanStr` (string)
    - `name` (string)
    - `email` (string | null)
    - `posisi` (string | null)
    - `departmentName` (string)
    - `tanggalPengajuan` (string)
    - `status` (string)
  - `total`, `page`, `pageSize`, `totalPages`

### Operasi CRUD (Halaman Pengunduran Diri – List)
- Create: `POST /pengunduran-diri`
  - Body: `karyawanId` (required), `alasan` (required), `tanggalEfektif?`, `departmentId?`
  - Response: Ringkas seperti di list
  - Status: `201 Created`
- Update: `PATCH /pengunduran-diri/:id`
  - Body (partial): `alasan?`, `tanggalEfektif?`, `status?`
  - Response: Ringkas terkini
- Delete: `DELETE /pengunduran-diri/:id`
  - Response: `{ success: true }`

## Halaman: Detail Pengunduran Diri
- Endpoint: `GET /pengunduran-diri/:id/detail`
- Response (Composite untuk satu halaman):
  - `resign`
    - `id` (string)
    - `karyawanId` (string)
    - `idKaryawanStr` (string)
    - `name` (string)
    - `departmentName` (string)
    - `tanggalPengajuan` (string)
    - `tanggalEfektif` (string | null)
    - `alasan` (string)
    - `status` (string)
  - `karyawanSummary`
    - `id` (string)
    - `idKaryawan` (string)
    - `name` (string)
    - `email` (string | null)
    - `posisi` (string | null)

### Operasi CRUD (Halaman Detail Pengunduran Diri)
- Update: `PATCH /pengunduran-diri/:id`
  - Body (partial): `tanggalEfektif?`, `status?`, `alasan?`
  - Response: `resign` terkini
- Delete: `DELETE /pengunduran-diri/:id`
  - Response: `{ success: true }`

## Halaman: Perpanjangan Kontrak (List)
- Endpoint: `GET /perpanjangan-kontrak`
- Query Params:
  - `q` (opsional) – cari di `karyawan.name` atau `id_karyawan`
  - `status` (opsional) – `pending`, `approved`, `rejected`
  - `_sort` (opsional) – disarankan `tanggal_mulai` atau `tanggal_berakhir`
  - `_order` (opsional) – `asc` | `desc`
  - `_page` (wajib)
  - `_limit` (wajib)
- Response (Paginated):
  - `data[]`
    - `id` (string)
    - `karyawanId` (string)
    - `idKaryawan` (string)
    - `name` (string)
    - `tanggalMulai` (string)
    - `tanggalBerakhir` (string)
    - `status` (string)
  - `total`, `page`, `pageSize`, `totalPages`

### Operasi CRUD (Halaman Perpanjangan Kontrak – List)
- Create: `POST /perpanjangan-kontrak`
  - Body: `karyawanId` (required), `tanggalMulai` (required), `tanggalBerakhir` (required)
  - Response: Ringkas seperti di list (status default `pending`)
  - Status: `201 Created`
- Update: `PATCH /perpanjangan-kontrak/:id`
  - Body (partial): `tanggalMulai?`, `tanggalBerakhir?`, `status?`
  - Response: Ringkas terkini
- Delete: `DELETE /perpanjangan-kontrak/:id`
  - Response: `{ success: true }`

## Halaman: Detail Perpanjangan Kontrak
- Endpoint: `GET /perpanjangan-kontrak/:id/detail`
- Response (Composite untuk satu halaman):
  - `request`
    - `id` (string)
    - `karyawanId` (string)
    - `tanggalMulai` (string)
    - `tanggalBerakhir` (string)
    - `status` (string)
  - `karyawanSummary`
    - `id` (string)
    - `idKaryawan` (string)
    - `name` (string)
    - `email` (string | null)
    - `posisi` (string | null)

### Operasi CRUD (Halaman Detail Perpanjangan Kontrak)
- Update: `PATCH /perpanjangan-kontrak/:id`
  - Body (partial): `tanggalMulai?`, `tanggalBerakhir?`, `status?`
  - Response: `request` terkini
- Delete: `DELETE /perpanjangan-kontrak/:id`
  - Response: `{ success: true }`

---

## Halaman: Riwayat Organisasi (List)
- Endpoint: `GET /riwayat-organisasi`
- Query Params:
  - `search` (opsional) – cari di `idKaryawan`, `user.name`, `jenisPerubahan`
  - `idKaryawan` (opsional) – filter riwayat untuk karyawan tertentu
  - `jenisPerubahan` (opsional) – mis. `Promosi`, `Mutasi`, `Demosi`
  - `tanggalEfektifStart` (opsional) – filter rentang tanggal (mulai)
  - `tanggalEfektifEnd` (opsional) – filter rentang tanggal (akhir)
  - `sortBy` (opsional) – mis. `tanggalEfektif`
  - `order` (opsional) – `asc` | `desc`
  - `page` (opsional, default 1)
  - `limit` (opsional, default 10)
- Response (Paginated):
  - `data[]`
    - `id` (string)
    - `idKaryawan` (string)
    - `user` (object)
      - `name` (string)
      - `avatar` (string | null)
    - `jenisPerubahan` (string)
    - `tanggalEfektif` (string, format ISO date `yyyy-MM-dd`)
    - `posisiLama` (string)
    - `posisiBaru` (string)
    - `divisiLama` (string)
    - `divisiBaru` (string)
    - `direktoratLama` (string)
    - `direktoratBaru` (string)
    - `alasanPerubahan` (string)
  - `total`, `page`, `limit`

### Operasi CRUD (Halaman Riwayat Organisasi – List)
- Create: `POST /riwayat-organisasi`
  - Body: `idKaryawan` (required), `jenisPerubahan` (required), `tanggalEfektif` (required),
    `posisiLama` (required), `posisiBaru` (required), `divisiLama?`, `divisiBaru?`, `direktoratLama?`, `direktoratBaru?`, `alasanPerubahan?`
  - Response: Objek riwayat ringkas seperti di list
  - Status: `201 Created`
- Update: `PATCH /riwayat-organisasi/:id`
  - Body (partial): field seperti create
  - Response: Ringkas terkini
- Delete: `DELETE /riwayat-organisasi/:id`
  - Response: `{ success: true }`

Catatan:
- Alternatif endpoint ter-filter per karyawan: `GET /staff/:id/riwayat-organisasi` dengan response bentuk yang sama namun hanya data milik karyawan tersebut.

---

Catatan Implementasi:
– Field denormalized seperti `departement` (alias `department` untuk tampilan list), `divisi`, dan `grade` ditambahkan agar UI tidak perlu panggilan tambahan.
– Kolom `statusPayroll` dan `kategori` tersedia di list dan detail sesuai kebutuhan tampilan.
– Halaman detail memakai endpoint komposit untuk menggabungkan data terkait (summary karyawan, education, documents; atau detail request) dalam satu panggilan.
– Diselaraskan dengan service yang ada (`karyawanService`): path dasar `/staff` dan nama query params (`search`, `company`, `department`, `status`, `sortBy`, `order`, `page`, `limit`).