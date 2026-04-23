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

## Struktur Folder & Arsitektur (Repository WAJIB)

Proyek ini mengikuti prinsip **Clean Architecture dengan Repository Pattern** untuk memastikan semua akses data melalui satu pintu. Struktur ini berlaku baik di level root (`src/`) maupun di dalam setiap fitur (`src/features/<feature>/`).

### Core Architecture Flow
```
User Action  
  Page (UI)  
  Hook (State & Logic)  
  Repository (PusatData)  
  Service (API Call)  
  Model (Mapping)  
  Backend
```

### Prinsip Utama
- **Repository sebagai pusat data**
- **Tidak ada akses API langsung dari hook/UI**
- **Semua perubahan API cukup di Repository dan Model**

### 1. `pages/` (UI Orchestrator)

- **Fungsi**: Render data tanpa logic dan tanpa mengetahui API.
- **Tanggung Jawab**: Menyusun layout halaman, menangani event dari user, memanggil hook.
- **DO**: Gunakan hook untuk logic, fokus pada rendering UI.
- **DON'T**: Melakukan API call, menyimpan business logic.

### 2. `hooks/` (Business Logic Layer)

- **Fungsi**: Manage state (loading, error, data), trigger action, **hanya komunikasi ke Repository**.
- **Tanggung Jawab**: Validasi, pengambilan keputusan, mengelola loading dan error state, menggabungkan data dari berbagai sumber.
- **DO**: Hanya panggil Repository, simpan state dan aturan bisnis.
- **DON'T**: Mengolah response API mentah, melakukan mapping data API.

### 3. `repositories/` (Pusat Utama Data)

- **Fungsi**: Pusat utama data, ambil data dari Service, gunakan Model untuk mapping.
- **Tanggung Jawab**: Gabungkan beberapa API jika perlu, return data yang sudah siap pakai.
- **Contoh**:
```javascript
// repositories/userRepository.js
import { fetchUsers } from '@/services/userService'
import { mapUser } from '@/models/userModel'

export const userRepository = {
  async getUsers() {
    const res = await fetchUsers()
    return res.map(mapUser)
  }
}
```

### 4. `services/` (Data Access Layer - API Only)

- **Fungsi**: Pure API call, tidak ada logic tambahan.
- **Tanggung Jawab**: Komunikasi dengan API backend, definisi endpoint, pengaturan header & auth.
- **DO**: Return response mentah (Promise), pisahkan service per domain.
- **DON'T**: Melakukan transformasi data, menyimpan state.

### 5. `models/` (WAJIB - Mapping Layer)

- **Fungsi**: Mapping response API format internal.
- **Tanggung Jawab**: Mengubah DTO (dari backend) menjadi Entity (format internal aplikasi), menyamakan struktur data.
- **DO**: Menjadi satu-satunya tempat yang terdampak jika API berubah.
- **DON'T**: Menyimpan business logic, melakukan validasi.

### 6. `types/` (Contract Layer)

- **Fungsi**: Mendefinisikan type di TypeScript.
- **Tanggung Jawab**: Kontrak frontend ↔ backend, DTO, Meta, Error response.
- **Struktur**: `types/dto` → untuk kontrak dari backend, `types/entity` → untuk struktur internal aplikasi.

### 7. `components/` (Reusable UI Component)

- **Fungsi**: Element UI yang dapat digunakan ulang, presentational component.
- **Tanggung Jawab**: Stateless atau minim logic, menggunakan props, mengirim event melalui callback.
- **DO**: Terima data via props, emit event via callback.
- **DON'T**: Fetch API, business logic, akses global state langsung.

### 8. `store/` (Global State)

- **Fungsi**: Menampung state global.
- **Tanggung Jawab**: Menyimpan data yang dibutuhkan lintas halaman (Auth, User Info, Theme).
- **DO**: Gunakan untuk data global.
- **DON'T**: Menyimpan business logic kompleks.
- **Rule**: Jika hanya dipakai satu halaman, jangan gunakan store.

### 9. `utils/` (Helper / Utility)

- **Fungsi**: Menampung fungsi helper.
- **Tanggung Jawab**: Fungsi kecil, pure, dan reusable.
- **DO**: Helper umum (format tanggal, helper math, dsb).
- **DON'T**: Akses API, akses state, akses UI.

  
[ USER UI ] 
    │
    ▼
[ Page / Component ] <───> [ Store (Global State) ]
    │ (Memanggil)
    ▼
[ Hook (Business Logic) ] 
    │ (Request Data)
    ▼
[ Repository ] ──────────> [ Model (Mapping DTO to Entity) ]
    │ (Fetch)                ▲ (Transform)
    ▼                        │
[ Service (API Call) ] ──────┘
    │
    ▼
[ Backend API ]

<img width="5408" height="2240" alt="image" src="https://github.com/user-attachments/assets/3107130a-c18c-429c-acf3-17201a61ad4b" />



---

## Aturan Penamaan & Konvensi

### Bahasa & Format
- Gunakan **bahasa Inggris** untuk fungsi, variable, folder, file.

### File Naming
- **File component/hook**: **PascalCase** contoh: `AddStaffModal.tsx`
- **Folder**: **kebab-case** contoh: `structure-and-organize`
- **Function**: **camelCase** contoh: `formatDate()`
- **Variable**: **snake_case** contoh: `staff_status`

## Rules (Penting)

### Yang harus dilakukan
- **Gunakan model untuk semua transformasi data API**
- **Pisahkan DTO dan Entity**
- **Simpan business logic di hook**
- **Pastikan UI tidak tergantung struktur API**
- **Repository sebagai pusat data**

### Yang tidak boleh dilakukan
- **Mapping API di hook**
- **Menggunakan DTO langsung di UI**
- **Mencampur naming backend ke frontend**
- **Lompat layer**
- **Akses API langsung dari hook/UI**

## Golden Rule

**Perubahan backend hanya boleh berdampak ke:**
- DTO
- Model
- Service
- Repository

**Tidak boleh berdampak ke:**
- Hook
- UI

## Quick Reference

| Kebutuhan              | Tempat              |
| ---------------------- | ------------------- |
| Fetch API              | `services/`         |
| **Data Access**        | **`repositories/`**  |
| **Data Mapping**       | **`models/`**       |
| Business rule          | `hooks/`            |
| Event UI               | `pages/`            |
| Validasi form          | `hooks/`            |
| UI reusable            | `components/`       |
| Kontrak data           | `types/`            |
| State global           | `store/`            |
| Helper umum            | `utils/`            |

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
- 
