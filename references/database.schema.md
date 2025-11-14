# Skema Database HRIS (Disesuaikan dengan Fitur Saat Ini)

Dokumen ini menyajikan skema database yang hanya mencerminkan fitur yang ada di proyek saat ini: `auth`, `staff` (Data Master Karyawan, Pengunduran Diri, Perpanjangan Kontrak), dan `structure-and-organize`. Fitur `dashboard` saat ini berbasis UI/komponen dan tidak memerlukan tabel khusus.

Tipe data menggunakan SQL generik berorientasi PostgreSQL (`uuid`, `varchar`, `text`, `integer`, `numeric`, `timestamp`, `date`, `boolean`). Silakan sesuaikan detail minor jika DBMS berbeda.

## Konvensi Umum
- Semua tabel memiliki kolom `id uuid PRIMARY KEY`, `created_at timestamp`, `updated_at timestamp`.
- Kolom referensi menggunakan `*_id uuid` yang merujuk ke tabel terkait.
- Gunakan `varchar(N)` untuk teks pendek; `text` untuk teks panjang; `numeric(18,2)` untuk nilai uang.

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

### `refresh_tokens`
- `id uuid PK`
- `user_id uuid NOT NULL` (FK `users.id`)
- `token varchar(255) UNIQUE NOT NULL`
- `expires_at timestamp NOT NULL`
- `revoked boolean DEFAULT false`
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`

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

Catatan: Sistem peran saat ini cukup diwakili oleh kolom `users.role`. Tabel `roles`/`permissions` belum diperlukan dari sisi fitur yang ada.

## Fitur: Structure and Organize

Mengacu pada `src/features/structure-and-organize/types/organization.types.ts`.

### `business_lines`
- `id uuid PK`
- `name varchar(150) NOT NULL`
- `description text NULL`
- `sk_file text NULL`
- `memo_file text NULL`
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`

### `companies`
- `id uuid PK`
- `name varchar(150) NOT NULL`
- `description text NULL`
- `business_line_id uuid NOT NULL` (FK `business_lines.id`)
- `details text NULL`
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`

### `offices`
- `id uuid PK`
- `name varchar(150) NOT NULL`
- `description text NULL`
- `sk_file text NULL`
- `memo_file text NULL`
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`

### `directorates`
- `id uuid PK`
- `name varchar(150) NOT NULL`
- `description text NULL`
- `sk_file text NULL`
- `memo_file text NULL`
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`

### `divisions`
- `id uuid PK`
- `name varchar(150) NOT NULL`
- `description text NULL`
- `directorate_id uuid NOT NULL` (FK `directorates.id`)
- `sk_file text NULL`
- `memo_file text NULL`
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`

### `departments`
- `id uuid PK`
- `name varchar(150) NOT NULL`
- `division_id uuid NOT NULL` (FK `divisions.id`)
- `sk_file text NULL`
- `memo_file text NULL`
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`

### `positions`
- `id uuid PK`
- `name varchar(150) NOT NULL`
- `grade varchar(50) NULL`
- `job_description text NULL`
- `direct_subordinates text NULL` (JSON array of string)
- `sk_file text NULL`
- `memo_file text NULL`
- `memo_number varchar(100) NULL`
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`

### `employee_positions`
- `id uuid PK`
- `name varchar(150) NOT NULL`
- `position_id uuid NOT NULL` (FK `positions.id`)
- `directorate_id uuid NOT NULL` (FK `directorates.id`)
- `division_id uuid NOT NULL` (FK `divisions.id`)
- `department_id uuid NOT NULL` (FK `departments.id`)
- `description text NULL`
- `sk_file text NULL`
- `memo_file text NULL`
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`

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

### `karyawan_documents`
- `id uuid PK`
- `karyawan_id uuid NOT NULL` (FK `karyawan.id`)
- `tipe_file varchar(50) NOT NULL`
- `nama_file varchar(150) NOT NULL`
- `file_path text NULL`
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`

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

### `perpanjangan_kontrak_requests`
- `id uuid PK`
- `karyawan_id uuid NOT NULL` (FK `karyawan.id`)
- `tanggal_mulai date NOT NULL`
- `tanggal_berakhir date NOT NULL`
- `status varchar(20) NOT NULL` (mis. `pending`, `approved`, `rejected`)
- `created_at timestamp NOT NULL`
- `updated_at timestamp NOT NULL`

## Indeks & Relasi Penting
- Tambahkan indeks pada kolom FK yang sering dipakai: `company_id`, `department_id`, `office_id`, `position_id`.
- Pertahankan integritas data dengan constraint unik pada `karyawan.id_karyawan` dan kombinasi unik yang relevan.
- Simpan `positions.direct_subordinates` sebagai JSON di kolom `text` atau buat tabel relasi terpisah jika diperlukan nanti.

## Catatan
- Fitur `dashboard` saat ini tidak membutuhkan tabel database tersendiri.
- Skema ini sengaja dibatasi agar sesuai dengan fitur yang ada sekarang. Jika nanti fitur berkembang (mis. kehadiran/cuti/payroll), skema dapat diperluas mengikuti pola umum di atas.