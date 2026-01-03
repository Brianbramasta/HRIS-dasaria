# FE-HRIS (Frontend) — Project README

## Ringkasan singkat

Ini adalah frontend aplikasi HRIS (Human Resources Information System) berbasis TypeScript + React. Proyek menggunakan Vite sebagai bundler/dev server dan diorganisir dengan pola fitur di dalam folder `src/features`.

Tujuan proyek: menyediakan antarmuka manajemen karyawan, otentikasi, struktur organisasi, dan modul terkait HR lainnya.

## Teknologi utama

- TypeScript
- React
- Vite (dev server & build)
- React Router (routing — lihat `src/routes`)
- Jest (pengujian unit, konfigurasi di `jest.config.mjs`)
- ESLint (linting, konfigurasi di `eslint.config.js`)
- PostCSS (konfigurasi di `postcss.config.js`)
- Axios (dipakai untuk panggilan API — lihat `src/services/api.ts`)

Tooling & utilitas:

- Node.js + npm (manajer paket). Periksa `package.json` untuk script yang tersedia.

## Struktur Folder & Arsitektur

Proyek ini mengikuti prinsip **Clean Architecture** dengan pemisahan tanggung jawab yang jelas pada setiap folder. Struktur ini berlaku baik di level root (`src/`) maupun di dalam setiap fitur (`src/features/<feature>/`).

Mengacu pada dokumentasi rules dan standarisasi:

### 1. `pages/` (UI Orchestrator)

- **Fungsi**: Merender UI tanpa harus mengetahui detail logic-nya.
- **Tanggung Jawab**: Merangkai tampilan halaman, menangani event UI, dan memanggil hook.
- **Aturan**: Tidak boleh ada business logic kompleks atau fetch API langsung di sini.

### 2. `hooks/` (Business Logic Layer)

- **Fungsi**: Menampung logic yang digunakan pada halaman terkait.
- **Tanggung Jawab**: Validasi, decision making, pemanggilan service, dan mapping data.
- **Aturan**: Pastikan semua logic termasuk kebutuhan variable UI berasal dari sini.

### 3. `services/` (Data Access Layer)

- **Fungsi**: Request endpoint ke API.
- **Tanggung Jawab**: Komunikasi dengan backend, definisi endpoint.
- **Aturan**: Tidak boleh menyimpan state UI.

### 4. `components/` (Reusable UI Component)

- **Fungsi**: Element UI yang dapat digunakan ulang.
- **Tanggung Jawab**: Menampilkan data via props (Presentational).
- **Aturan**: Jangan melakukan fetch API di dalam komponen reusable.

### 5. `store/` (Global State)

- **Fungsi**: Menampung state global.
- **Tanggung Jawab**: Menyimpan data yang dibutuhkan lintas halaman (misal: Auth, User Info).
- **Aturan**: Jika state hanya dipakai di satu halaman, gunakan local state atau hook, bukan store.

### 6. `types/` (Contract Layer)

- **Fungsi**: Mendefinisikan type di TypeScript.
- **Tanggung Jawab**: Kontrak interface request & response backend.

### 7. `utils/` (Helper / Utility)

- **Fungsi**: Menampung fungsi helper.
- **Tanggung Jawab**: Fungsi kecil, pure, dan reusable (misal: format tanggal).

---

## Aturan Penamaan & Konvensi

1.  **Bahasa**: Selalu gunakan **Bahasa Inggris** untuk penulisan fungsi, variable, folder, dan file.
2.  **File Component**: Gunakan PascalCase (huruf depan besar). Contoh: `AddStaffModals.tsx`.
3.  **Folder**: Gunakan huruf kecil. Jika lebih dari satu kata, gunakan tanda hubung (`-`). Contoh: `structure-and-organize`.
4.  **Penamaan Fungsi**:
    - Gunakan PascalCase untuk nama fungsi Component/Hook. Contoh: `FormatDate()` (jika dianggap sebagai utilitas utama atau komponen) atau sesuai konvensi React.
    - Gunakan camelCase untuk variabel dan fungsi umum.

## Cara Menjalankan

1.  **Pasang dependensi**:

    ```powershell
    npm install
    ```

2.  **Jalankan aplikasi (dev server)**:

    ```powershell
    npm run dev
    ```

3.  **Jalankan test**:
    ```powershell
    npm test
    ```

## Kontrak Singkat

- **Input**: Kode sumber di `src/`.
- **Output**: Aplikasi web React yang bisa diakses via Vite dev server.
- **Sukses**: Aplikasi berjalan lokal tanpa error build, halaman otentikasi dan modul staff/dashboards dapat dimuat.
