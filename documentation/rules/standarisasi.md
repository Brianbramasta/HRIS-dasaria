# 📘 Standarisasi Arsitektur Frontend

## 🎯 Tujuan

Standarisasi ini bertujuan untuk:

- Menjaga **konsistensi struktur kode**
- Memudahkan **kolaborasi tim**
- Meningkatkan **maintainability & scalability**
- Menyamakan pola pikir frontend dengan backend berbasis **Clean Architecture**

---

## 🔁 Alur Kerja Frontend (High-Level Flow)

```text
User Action
 → Page (UI)
   → Hook (Logic)
     → Service (API)
       → Backend
     ← Response
   → Hook (decision & mapping)
 → Page (render)
 → Component (display)
```

**Aturan utama:**

- Tidak diperbolehkan lompat layer
- Setiap layer memiliki satu tanggung jawab utama

---

## 📂 Struktur Folder & Tanggung Jawab

### `pages/`

**Peran:** UI Orchestrator

**Tanggung jawab:**

- Merangkai tampilan halaman (layout & composition)
- Menangani event UI (click, submit)
- Mengambil data dan action dari hook

**Do:**

- Gunakan hook untuk logic
- Fokus pada rendering UI

**Don’t:**

- Fetch API langsung
- Menyimpan business logic
- Validasi kompleks

---

### `hooks/`

**Peran:** Business Logic Layer

**Tanggung jawab:**

- Seluruh logic aplikasi
- Validasi dan decision making
- Orkestrasi proses
- Mapping data API ke kebutuhan UI
- Handling loading & error

**Do:**

- Panggil service
- Simpan state dan aturan bisnis

**Don’t:**

- JSX / UI
- Styling
- Manipulasi DOM

---

### `services/`

**Peran:** Data Access Layer

**Tanggung jawab:**

- Komunikasi dengan API backend
- Definisi endpoint
- Pengaturan header & auth

**Do:**

- Return response mentah (Promise)
- Pisahkan service per domain

**Don’t:**

- Menyimpan state
- Validasi atau mapping kompleks
- Logic UI

---

### `components/`

**Peran:** Reusable UI Component

**Tanggung jawab:**

- Elemen UI yang dapat digunakan ulang
- Presentational component

**Do:**

- Terima data via props
- Emit event via callback

**Don’t:**

- Fetch API
- Business logic
- Akses global state secara langsung

**Prinsip:** _Dumb Component, Smart Hook_

---

### `types/`

**Peran:** Contract Layer

**Tanggung jawab:**

- Definisi type TypeScript
- Kontrak frontend ↔ backend
- DTO, Meta, Error response

**Do:**

- Definisikan interface request & response
- Gunakan type sebagai pengaman perubahan API

**Don’t:**

- Menulis logic atau function

---

### `store/`

**Peran:** Global State

**Tanggung jawab:**

- Menyimpan state lintas halaman
- Auth, user info, theme, dsb

**Do:**

- Gunakan untuk data global

**Don’t:**

- Menyimpan semua state ke store
- Menaruh business logic kompleks

**Rule:** Jika hanya dipakai satu halaman, **jangan gunakan store**

---

### `utils/`

**Peran:** Helper / Utility

**Tanggung jawab:**

- Fungsi kecil dan reusable
- Pure function

**Do:**

- Helper umum (format tanggal, helper math, dsb)

**Don’t:**

- Akses API
- Akses state
- Akses UI

---

## 🧠 Tabel Keputusan Cepat

| Kebutuhan     | Tempat        |
| ------------- | ------------- |
| Fetch API     | `services/`   |
| Business rule | `hooks/`      |
| Event UI      | `pages/`      |
| Validasi form | `hooks/`      |
| UI reusable   | `components/` |
| Kontrak data  | `types/`      |
| State global  | `store/`      |
| Helper umum   | `utils/`      |

---
