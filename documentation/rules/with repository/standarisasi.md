# 📘 Standarisasi Arsitektur Frontend (Repository WAJIB)

## 🎯 Tujuan

Standarisasi ini bertujuan untuk:

- **Semua akses data harus lewat 1 pintu (Repository)**
- **Menghindari ketergantungan langsung ke API di hook/UI**
- **Memastikan perubahan API cukup di 1 layer**
- Menjaga **konsistensi struktur kode**
- Memudahkan **kolaborasi tim**
- Meningkatkan **maintainability & scalability**
- Menyamakan pola pikir frontend dengan backend berbasis **Clean Architecture**

---

## 🔁 Alur Kerja Frontend (Repository Pattern)

```text
User Action
 → Page (UI)
   → Hook (State & Logic)
     → Repository (PusatData)
       → Service (API Call)
         → Model (Mapping)
           → Backend
         ← Response
       ← Mapped Data
     ← Ready Data
   → Hook (decision)
 → Page (render)
 → Component (display)
```

**Aturan utama:**

- **Repository sebagai pusat data**
- **Tidak ada akses API langsung dari hook/UI**
- **Semua perubahan API cukup di Repository dan Model**
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

- **Manage state (loading, error, data)**
- **Trigger action (fetch, submit, dll)**
- **Hanya komunikasi ke Repository**
- Validasi dan decision making
- Orkestrasi proses
- Handling loading & error

**Contoh:**
```javascript
// hooks/useUsers.js
import { useEffect, useState } from 'react'
import { userRepository } from '@/repositories/userRepository'

export const useUsers = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    userRepository.getUsers().then(setUsers)
  }, [])

  return { users }
}
```

**Do:**

- **Hanya panggil Repository**
- Simpan state dan aturan bisnis
- Validasi dan pengambilan keputusan
- Mengelola loading dan error state
- Menggabungkan data dari berbagai sumber

**Don't:**

- **Mengolah response API mentah**
- **Melakukan mapping data API**
- JSX / UI
- Styling
- Manipulasi DOM

---

### `services/`

**Peran:** Data Access Layer (API Only)

**Tanggung jawab:**

- **Pure API call**
- **Tidak ada logic tambahan**
- Komunikasi dengan API backend
- Definisi endpoint
- Pengaturan header & auth

**Contoh:**
```javascript
// services/userService.js
import axios from '@/api/axiosInstance'

export const fetchUsers = async () => {
  const res = await axios.get('/users')
  return res.data
}
```

**Do:**

- Return response mentah (Promise)
- Pisahkan service per domain

**Don'T:**

- **Melakukan transformasi data**
- **Menyimpan state**
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

### `models/` (WAJIB)

**Peran:** Mapping Layer

**Tanggung jawab:**

- **Mapping response API format internal**
- Mengubah DTO (dari backend) menjadi Entity (format internal aplikasi)
- Menyamakan struktur data agar konsisten di seluruh app
- Menjadi satu-satunya tempat yang terdampak jika API berubah

**Contoh:**
```javascript
// models/userModel.js
export const mapUser = (data) => ({
  id: data.user_id,
  name: data.user_name,
})
```

**Do:**

- Mengubah DTO menjadi Entity
- Menyamakan struktur data
- Menjadi satu-satunya tempat yang terdampak jika API berubah

**Don't:**

- Menyimpan business logic
- Melakukan validasi

---

### `types/`

**Peran:** Contract Layer

**Tanggung jawab:**

- Definisi type TypeScript
- Kontrak frontend ↔ backend
- DTO, Meta, Error response

**Struktur yang direkomendasikan:**
- `types/dto` → untuk kontrak dari backend
- `types/entity` → untuk struktur internal aplikasi

**Do:**

- Definisikan interface request & response
- Gunakan type sebagai pengaman perubahan API

**Don't:**

- Menulis logic atau function

---

### `repositories/`

**Peran:** Pusat Utama Data

**Tanggung jawab:**

- **Ini jadi pusat utama data**
- Ambil data dari Service
- Gunakan Model untuk mapping
- Gabungkan beberapa API jika perlu
- Return data yang sudah siap pakai

**Contoh:**
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

---

## 🚨 Rules (Penting)

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

---

## 🏆 Golden Rule

**Perubahan backend hanya boleh berdampak ke:**
- DTO
- Model
- Service
- Repository

**Tidak boleh berdampak ke:**
- Hook
- UI

---

## 🔄 Handle Perubahan API

Contoh perubahan backend:
```javascript
// sebelum
{
  "user_id": 1,
  "user_name": "Brian"
}

// sesudah
{
  "id": 1,
  "full_name": "Brian"
}
```

**Yang diubah:**
- Model
```javascript
export const mapUser = (data) => ({
  id: data.id,
  name: data.full_name,
})
```
- (Opsional) Repository jika logic berubah

**Yang TIDAK diubah:**
- Hook
- UI
- Page

---

## 📋 Quick Reference

| Update Type | Primary Files | Secondary Files |
| ----------- | ------------- | --------------- |
| API berubah | `types/dto`, `models`, `services` | `repositories` |
| Logic berubah | `hooks` | `types/entity` |
| UI berubah | `components`, `pages` | `hooks` |
| Struktur data berubah | `models` | `types/entity` |

---
