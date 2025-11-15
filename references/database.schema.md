# Skema Database HRIS (Disesuaikan dengan Fitur Saat Ini)

Dokumen ini menyajikan skema database yang hanya mencerminkan fitur yang ada di proyek saat ini: `auth`, `staff` (Data Master Karyawan, Pengunduran Diri, Perpanjangan Kontrak), dan `structure-and-organize`. Fitur `dashboard` saat ini berbasis UI/komponen dan tidak memerlukan tabel khusus.

Tipe data menggunakan SQL generik berorientasi PostgreSQL (`uuid`, `varchar`, `text`, `integer`, `numeric`, `timestamp`, `date`, `boolean`). Silakan sesuaikan detail minor jika DBMS berbeda.

## Konvensi Umum

- Semua tabel memiliki kolom `id uuid PRIMARY KEY`, `created_at timestamp`, `updated_at timestamp`.
- Semua tabel menerapkan soft delete dengan kolom `is_deleted boolean DEFAULT false` (di level API dapat diakses sebagai `isDelete`).
- Kolom referensi menggunakan `*_id uuid` yang merujuk ke tabel terkait.
- Gunakan `varchar(N)` untuk teks pendek; `text` untuk teks panjang; `numeric(18,2)` untuk nilai uang.
- Setiap operasi Create/Update/Delete wajib menyertakan nomor memo (`memo_number`) dan referensi berkas SK (`sk_file_id` → `files.id`). Khusus operasi Delete, sistem wajib membuat entri file dengan penanda operasi `operation = 'delete'` dan mengisi `memo_number`/`doc_number` beserta berkas SK.

## Fitur: Auth

### `users`

- `id uuid PK`
- `email varchar(255) UNIQUE NOT NULL`
- `password_hash varchar(255) NOT NULL`
- `name varchar(150) NULL`
- `role varchar(50) NOT NULL` (mis. `hr/admin`, `staff`)
- `avatar_url text NULL`
- `last_login_at timestamp NULL`
- `is_active boolean DEFAULT true`
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`
- `is_deleted boolean DEFAULT false`

### `refresh_tokens`

- `id uuid PK`
- `user_id uuid NOT NULL` (FK `users.id`)
- `token varchar(255) UNIQUE NOT NULL`
- `expires_at timestamp NOT NULL`
- `revoked boolean DEFAULT false`
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`
- `is_deleted boolean DEFAULT false`

### `password_resets`

- `id uuid PK`
- `user_id uuid NOT NULL` (FK `users.id`)
- `email varchar(255) NOT NULL`
- `token varchar(255) UNIQUE NOT NULL`
- `status varchar(20) NOT NULL` (mis. `pending`, `completed`, `expired`)
- `requested_at timestamp NOT NULL`
- `completed_at timestamp NULL`
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`
- `is_deleted boolean DEFAULT false`

Catatan: Sistem peran saat ini cukup diwakili oleh kolom `users.role`. Tabel `roles`/`permissions` belum diperlukan dari sisi fitur yang ada.

## Fitur: Structure and Organize

Mengacu pada `src/features/structure-and-organize/types/organization.types.ts`.

### `files`

- `id uuid PK`
- `owner_type varchar(50) NOT NULL` (mis. `business-line`, `company`, `office`, `directorate`, `division`, `department`, `position`, `employee-position`)
- `owner_id uuid NOT NULL` (polimorfik, merujuk ke `id` resource terkait)
- `category varchar(20) NOT NULL` (mis. `sk`, `logo`, `document`)
- `name varchar(150) NOT NULL` (nama file untuk ditampilkan di UI)
- `doc_number varchar(100) NULL` (nomor dokumen/arsip bila ada)
- `memo_number varchar(100) NULL` (nomor memo terkait aksi perubahan/hapus)
- `file_name varchar(150) NOT NULL` (nama berkas fisik)
- `file_url text NOT NULL` (URL akses berkas)
- `file_type varchar(50) NOT NULL` (MIME type, mis. `application/pdf`)
- `size integer NULL` (ukuran berkas dalam bytes)
- `operation varchar(10) NOT NULL` (nilai yang diizinkan: `create`, `update`, `delete`) — membedakan dokumen berasal dari proses tambah, edit, atau hapus
- `action_note text NULL` (catatan alasan/perubahan terkait operasi)
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`
- `is_deleted boolean DEFAULT false`

Catatan:

- Tabel ini menstandarkan penyimpanan file dinamis sesuai kontrak API terbaru (respons `FileSummary`: `fileName`, `fileUrl`, `fileType`, `size`).
- Relasi bersifat polimorfik melalui `owner_type` + `owner_id`. Tambahkan indeks gabungan pada kedua kolom tersebut untuk mempercepat query.
- Nilai `category` dapat digunakan untuk menandai tipe file (mis. SK, logo, atau dokumen umum) sehingga memudahkan pengambilan SK spesifik per resource.
- Kolom `operation` berfungsi untuk membedakan asal proses berkas (`create`/`update`/`delete`). Untuk operasi Delete, wajib isi `operation = 'delete'` dan lengkapi `memo_number`/`doc_number` serta berkas SK.

### `business_lines`

- `id uuid PK`
- `name varchar(150) NOT NULL`
- `description text NULL`
<!-- - `sk_file text NULL`
- `memo_file text NULL` -->
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`
- `is_deleted boolean DEFAULT false`

### `companies`

- `id uuid PK`
- `name varchar(150) NOT NULL`
- `description text NULL`
- `business_line_id uuid NOT NULL` (FK `business_lines.id`)
- `details text NULL`
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`
- `is_deleted boolean DEFAULT false`

### `offices`

- `id uuid PK`
- `name varchar(150) NOT NULL`
- `description text NULL`
<!-- - `sk_file text NULL`
- `memo_file text NULL` -->
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`
- `is_deleted boolean DEFAULT false`

### `directorates`

- `id uuid PK`
- `name varchar(150) NOT NULL`
- `description text NULL`
<!-- - `sk_file text NULL`
- `memo_file text NULL` -->
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`
- `is_deleted boolean DEFAULT false`

### `divisions`

- `id uuid PK`
- `name varchar(150) NOT NULL`
- `description text NULL`
- `directorate_id uuid NOT NULL` (FK `directorates.id`)
<!-- - `sk_file text NULL`
- `memo_file text NULL` -->
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`
- `is_deleted boolean DEFAULT false`

### `departments`

- `id uuid PK`
- `name varchar(150) NOT NULL`
- `division_id uuid NOT NULL` (FK `divisions.id`)
<!-- - `sk_file text NULL`
- `memo_file text NULL` -->
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`
- `is_deleted boolean DEFAULT false`

### `positions`

- `id uuid PK`
- `name varchar(150) NOT NULL`
- `grade varchar(50) NULL`
- `job_description text NULL`
- `direct_subordinates text NULL` (JSON array of string)
<!-- - `sk_file text NULL`
- `memo_file text NULL` -->
- `memo_number varchar(100) NULL`
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`
- `is_deleted boolean DEFAULT false`

### `employee_positions`

- `id uuid PK`
- `name varchar(150) NOT NULL`
- `position_id uuid NOT NULL` (FK `positions.id`)
- `directorate_id uuid NOT NULL` (FK `directorates.id`)
- `division_id uuid NOT NULL` (FK `divisions.id`)
- `department_id uuid NOT NULL` (FK `departments.id`)
- `description text NULL`
<!-- - `sk_file text NULL`
- `memo_file text NULL` -->
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`
- `is_deleted boolean DEFAULT false`

Catatan Relasi File:

- Untuk menyesuaikan kontrak API terkini yang mewajibkan `skFileId` pada operasi Create/Update/Delete, direkomendasikan menambahkan kolom `sk_file_id uuid NULL` pada tabel resource (mis. `business_lines`, `offices`, `directorates`, `divisions`, `departments`, `positions`, `employee_positions`) yang mereferensikan `files.id`.
- Nilai `sk_file` bertipe `text` saat ini dapat dipertahankan sebagai kompatibilitas mundur, namun untuk data baru lebih disarankan menggunakan referensi ke tabel `files`.
- Saat melakukan soft delete pada resource, sistem wajib:
  - Membuat entri di `files` dengan `category = 'sk'`, `operation = 'delete'`, mengisi `memo_number` dan/atau `doc_number`, serta metadata berkas (`file_name`, `file_url`, `file_type`, `size`).
  - Menyimpan referensi ke entri tersebut di kolom `sk_file_id` pada resource (meskipun resource disoft-delete), agar audit dan pelacakan tetap konsisten.
  - Menyetel `is_deleted = true` pada resource.

## Fitur: Staff

Mengacu pada `src/features/staff/types/Karyawan.ts` dan `PengunduranDiri.ts`.

### `karyawan`

- `id uuid PK`
- `id_karyawan varchar(50) UNIQUE NOT NULL`
- `name varchar(150) NOT NULL`
- `email varchar(255) NOT NULL`
- `posisi varchar(100) NULL`
- `jabatan varchar(100) NULL`
- `tanggal_join date NOT NULL`
- `tanggal_berakhir date NULL`
- `company varchar(150) NOT NULL`
- `company_id uuid NULL` (FK `companies.id`)
- `department varchar(150) NULL`
- `department_id uuid NULL` (FK `departments.id`)
- `office varchar(150) NULL`
- `office_id uuid NULL` (FK `offices.id`)
- `status varchar(20) NULL` (mis. `aktif`, `cuti`, `resign`, `nonaktif`)
- `avatar text NULL`
- `nik varchar(50) NULL`
- `agama varchar(50) NULL`
- `tempat_lahir varchar(100) NULL`
- `gol_darah varchar(10) NULL`
- `tanggal_lahir date NULL`
- `jenis_kelamin varchar(20) NULL`
- `status_menikah varchar(20) NULL`
- `nomor_telepon varchar(30) NULL`
- `jumlah_tanggungan integer NULL`
- `alamat_domisili text NULL`
- `alamat_ktp text NULL`
- `facebook varchar(150) NULL`
- `x_com varchar(150) NULL`
- `linkedin varchar(150) NULL`
- `instagram varchar(150) NULL`
- `akun_sosial_media_terdekat varchar(150) NULL`
- `no_kontak_darurat varchar(30) NULL`
- `nama_no_kontak_darurat varchar(150) NULL`
- `hubungan_kontak_darurat varchar(50) NULL`
- `bank varchar(100) NULL`
- `nama_akun_bank varchar(150) NULL`
- `no_rekening varchar(50) NULL`
- `npwp varchar(50) NULL`
- `no_bpjs_kesehatan varchar(50) NULL`
- `status_bpjs_kesehatan varchar(50) NULL`
- `no_bpjs_ketenagakerjaan varchar(50) NULL`
- `status_bpjs_ketenagakerjaan varchar(50) NULL`
- `nominal_bpjs_tk numeric(18,2) NULL`
- `is_active boolean DEFAULT true`
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`
- `is_deleted boolean DEFAULT false`

### `karyawan_education`

- `id uuid PK`
- `karyawan_id uuid NOT NULL` (FK `karyawan.id`)
- `nama_lembaga varchar(150) NOT NULL`
- `nilai_pendidikan varchar(50) NULL`
- `jurusan_keahlian varchar(150) NULL`
- `tahun_lulus varchar(4) NULL`
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`
- Index unik (`karyawan_id`, `nama_lembaga`, `tahun_lulus`)
- `is_deleted boolean DEFAULT false`

### `karyawan_documents`

- `id uuid PK`
- `karyawan_id uuid NOT NULL` (FK `karyawan.id`)
- `tipe_file varchar(50) NOT NULL`
- `nama_file varchar(150) NOT NULL`
- `file_path text NULL`
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`
- `is_deleted boolean DEFAULT false`

### `pengunduran_diri`

- `id uuid PK`
- `karyawan_id uuid NOT NULL` (FK `karyawan.id`)
- `id_karyawan_str varchar(50) NOT NULL`
- `name varchar(150) NOT NULL`
- `email varchar(255) NULL`
- `posisi varchar(100) NULL`
- `department varchar(150) NOT NULL`
- `department_id uuid NULL` (FK `departments.id`)
- `tanggal_pengajuan date NOT NULL`
- `tanggal_efektif date NULL`
- `alasan text NOT NULL`
- `status varchar(20) NOT NULL` (mis. `In Progress`, `Pending`, `Approved`, `Rejected`)
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`
- `is_deleted boolean DEFAULT false`

### `perpanjangan_kontrak_requests`

- `id uuid PK`
- `karyawan_id uuid NOT NULL` (FK `karyawan.id`)
- `tanggal_mulai date NOT NULL`
- `tanggal_berakhir date NOT NULL`
- `status varchar(20) NOT NULL` (mis. `pending`, `approved`, `rejected`)
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`
- `is_deleted boolean DEFAULT false`

## Indeks & Relasi Penting

- Tambahkan indeks pada kolom FK yang sering dipakai: `company_id`, `department_id`, `office_id`, `position_id`.
- Pertahankan integritas data dengan constraint unik pada `karyawan.id_karyawan` dan kombinasi unik yang relevan.
- Simpan `positions.direct_subordinates` sebagai JSON di kolom `text` atau buat tabel relasi terpisah jika diperlukan nanti.

## Soft Delete

- Semua penghapusan data dilakukan secara soft delete dengan menyetel `is_deleted = true`.
- Query baca default sebaiknya memfilter `WHERE is_deleted = false`.
- Pertimbangkan indeks parsial/komposit yang melibatkan `is_deleted` untuk query yang sering digunakan.

### Praktik unggah dokumen saat Delete

- Untuk setiap tindakan Delete, backend membuat entri berkas di `files` dengan `operation = 'delete'` dan `category = 'sk'` (atau kategori sesuai kebutuhan), sambil mengisi `memo_number`/`doc_number` serta berkas yang diunggah.
- Entri ini direferensikan oleh resource melalui `sk_file_id` agar histori perubahan dapat ditelusuri.
- Disarankan menambahkan indeks komposit: `(owner_type, owner_id, category, operation, is_deleted)` untuk mempercepat pencarian riwayat dokumen per resource.

## Catatan

- Fitur `dashboard` saat ini tidak membutuhkan tabel database tersendiri.
- Skema ini sengaja dibatasi agar sesuai dengan fitur yang ada sekarang. Jika nanti fitur berkembang (mis. kehadiran/cuti/payroll), skema dapat diperluas mengikuti pola umum di atas.
