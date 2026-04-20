# Standarisasi Arsitektur Frontend (Repository WAJIB)

## Tujuan
- Semua akses data harus lewat 1 pintu (Repository)
- Menghindari ketergantungan langsung ke API di hook/UI
- Memastikan perubahan API cukup di 1 layer

## 1. Core Architecture Flow
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

## 2. Struktur Folder & Tanggung Jawab

### `pages/` - UI Orchestrator
**Render data**
**Tidak ada logic**
**Tidak tahu soal API**

**DO:**
- Menyusun layout halaman
- Menangani event dari user
- Memanggil hook

**DON'T:**
- Melakukan API call
- Menyimpan business logic

### `hooks/` - Business Logic Layer
**Manage state (loading, error, data)**
**Trigger action (fetch, submit, dll)**
**Hanya komunikasi ke Repository**

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

**DO:**
- Menyimpan logic aplikasi
- Validasi dan pengambilan keputusan
- Mengelola loading dan error state
- Menggabungkan data dari berbagai sumber

**DON'T:**
- Mengolah response API mentah
- Melakukan mapping data API

### `services/` - Data Access Layer (API Only)
**Pure API call**
**Tidak ada logic tambahan**

```javascript
// services/userService.js
import axios from '@/api/axiosInstance'

export const fetchUsers = async () => {
  const res = await axios.get('/users')
  return res.data
}
```

**DON'T:**
- Melakukan transformasi data
- Menyimpan state

### `models/` (WAJIB) - Mapping Layer
**Mapping response API format internal**

```javascript
// models/userModel.js
export const mapUser = (data) => ({
  id: data.user_id,
  name: data.user_name,
})
```

**DO:**
- Mengubah DTO (dari backend) menjadi Entity (format internal aplikasi)
- Menyamakan struktur data agar konsisten di seluruh app
- Menjadi satu-satunya tempat yang terdampak jika API berubah

**DON'T:**
- Menyimpan business logic
- Melakukan validasi

### `types/` - Contract Layer
**Struktur yang direkomendasikan:**
- `types/dto` → untuk kontrak dari backend
- `types/entity` → untuk struktur internal aplikasi

### `repositories/` - Pusat Utama Data
**Ini jadi pusat utama data**

**Tugas:**
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

### `components/` - Reusable UI
**DO:**
- Stateless atau minim logic
- Menggunakan props
- Mengirim event melalui callback

### `store/` - Global State
**DO:**
- Menyimpan data global seperti auth, user, dll

**DON'T:**
- Menyimpan business logic kompleks

### `utils/` - Helper
**DO:**
- Fungsi kecil yang reusable
- Pure function

## 3. Standarisasi Penamaan

### Bahasa & Format
- Gunakan **bahasa Inggris** untuk fungsi, variable, folder, file

### File Naming
- File component/hook: **PascalCase** contoh: `AddStaffModal.tsx`
- Folder: **kebab-case** contoh: `structure-and-organize`
- Function: **camelCase** contoh: `formatDate()`
- Variable: **snake_case** contoh: `staff_status`

## 4. Rules (Penting)

### Yang harus dilakukan
- Gunakan model untuk semua transformasi data API
- Pisahkan DTO dan Entity
- Simpan business logic di hook
- Pastikan UI tidak tergantung struktur API

### Yang tidak boleh dilakukan
- Mapping API di hook
- Menggunakan DTO langsung di UI
- Mencampur naming backend ke frontend
- Lompat layer
- Akses API langsung dari hook/UI

## 5. Golden Rule

**Perubahan backend hanya boleh berdampak ke:**
- DTO
- Model
- Service
- Repository

**Tidak boleh berdampak ke:**
- Hook
- UI

### note
selalu gunakan bahasa inggris untuk penulisan fungsi,variable, folder, file
- untuk file selalu menggunakan huruf depan Besar contoh: "AddStaffModals.tsx"
- folder gunakan huruf kecil kalau lebih dari satu kata gunakan '-' contoh : 'structure-and-organize'
- penamaan fungsi selalu gunakan huruf besar di awal contoh : "FormatDate()"
- penamaan fungsi selalu gunakan huruf kecil dan kalau lebih dari satu kata gunakan '_' contoh : staff_status