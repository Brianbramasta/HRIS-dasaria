---
auto_execution_mode: 0
description: Update existing features, components, or functionality in the HRIS application following clean repository architecture principles
---
You are a senior full-stack developer tasked with updating existing features in the HRIS application following clean repository architecture principles.

Your task is to modify existing functionality while maintaining the established patterns and architecture of the codebase. Focus on:

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

## 2. **Struktur Folder & Tanggung Jawab**

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

## 3. **Strategi Update**

### Sebelum Update
- **Identifikasi layer yang terdampak:**
  - API berubah → service, model, dto
  - Logic berubah → hook
  - UI berubah → page/component
- **Cek dependensi**
- **Pastikan type tetap konsisten**

### Saat Update
**Jika API berubah:**
1. Update DTO (types/dto)
2. Update Model (models)
3. Update Service (jika endpoint berubah)
4. Update Repository (jika ada)

*Hook dan UI seharusnya tidak perlu diubah*

**Jika logic berubah:**
1. Update Hook
2. Sesuaikan Entity jika diperlukan

**Jika UI berubah:**
1. Update Component
2. Update Page

### Setelah Update
- Test semua fitur
- Pastikan mapping benar
- Pastikan UI tidak terpengaruh perubahan API
- Validasi error handling

## 4. **Skenario Umum**

### Perubahan field API (contoh: name → full_name)
**Yang diubah:**
1. DTO
2. Model

### Perubahan struktur API
**Yang diubah:**
1. Model

### Perubahan endpoint API
**Yang diubah:**
1. Service

### Penambahan field baru
**Yang diubah:**
1. DTO
2. Model
3. Hook
4. UI

## 5. **Breaking Changes Protocol**

**Urutan perubahan:**
1. DTO (types/dto)
2. Model (models)
3. Service (services)
4. Repository
5. Hook (hooks)
6. UI (components/pages)

## 6. **Rules (Penting)**

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

## 7. **Golden Rule**

**Perubahan backend hanya boleh berdampak ke:**
- DTO
- Model
- Service
- Repository

**Tidak boleh berdampak ke:**
- Hook
- UI

## 8. **Handle Perubahan API**

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

## 9. **Quick Reference**

| Update Type | Primary Files | Secondary Files |
|-------------|---------------|-----------------|
| API berubah | `types/dto`, `models`, `services` | `repositories` |
| Logic berubah | `hooks` | `types/entity` |
| UI berubah | `components`, `pages` | `hooks` |
| Struktur data berubah | `models` | `types/entity` |

## 10. **File Structure Example**
```
src/
  repositories/
    userRepository.ts
    employeeRepository.ts
    contractRepository.ts
  services/
    userService.ts
    employeeService.ts
    contractService.ts
  models/
    userModel.ts
    employeeModel.ts
    contractModel.ts
  hooks/
    useUsers.ts
    useEmployees.ts
    useContracts.ts
```

## 11. **Update Checklist**

### Before Updating:
- [ ] Identifikasi layer yang terdampak
- [ ] Cek dependensi yang ada
- [ ] Review kontrak API (DTO)
- [ ] Verifikasi struktur Entity yang ada

### During Updating:
- [ ] Ikuti urutan breaking changes protocol
- [ ] Pastikan tidak ada lompat layer
- [ ] Update types secara konsisten
- [ ] Maintain error handling

### After Updating:
- [ ] Test semua fitur terdampak
- [ ] Verifikasi mapping data benar
- [ ] Pastikan UI tidak terpengaruh perubahan API
- [ ] Validasi error handling

**Insight Penting:** Backend pasti akan berubah. Arsitektur frontend yang baik memastikan perubahan tersebut tidak merusak sistem.

When updating existing features, always preserve the established patterns and only modify what's necessary for the required change.