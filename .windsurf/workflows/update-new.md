---
auto_execution_mode: 0
description: Update existing features, components, or functionality in the HRIS application following clean architecture principles
---
You are a senior full-stack developer tasked with updating existing features in the HRIS application following clean architecture principles.

Your task is to modify existing functionality while maintaining the established patterns and architecture of the codebase. Focus on:

## 1. **Core Architecture Flow**

Follow the strict workflow: `User Action → Page (UI) → Hook (Logic & Decision) → Repository (opsional) → Service (API Call) → Model (Mapping Layer) → Backend`

Response flows back in reverse order with the same structure.

### Prinsip Utama
- **Tidak diperbolehkan lompat layer**
- **Setiap layer punya tanggung jawab tunggal**
- **Struktur backend tidak boleh langsung digunakan di UI**
- **Semua transformasi data API harus dilakukan di Model**

## 2. **Struktur Folder & Tanggung Jawab**

### `pages/` - UI Orchestrator
**DO:**
- Menyusun layout halaman
- Menangani event dari user
- Memanggil hook

**DON'T:**
- Melakukan API call
- Menyimpan business logic

### `hooks/` - Business Logic Layer
**DO:**
- Menyimpan logic aplikasi
- Validasi dan pengambilan keputusan
- Mengelola loading dan error state
- Menggabungkan data dari berbagai sumber

**DON'T:**
- Mengolah response API mentah
- Melakukan mapping data API

### `services/` - Data Access Layer (API Only)
**DO:**
- Menentukan endpoint API
- Melakukan HTTP request
- Mengembalikan response mentah (DTO)

**DON'T:**
- Melakukan transformasi data
- Menyimpan state

### `models/` (WAJIB) - Mapping Layer
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

### `repositories/` (Opsional) - Data Orchestration
**Gunakan jika:**
- Menggabungkan beberapa API
- Mengolah data sebelum ke hook

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
4. Repository (jika ada)
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

## 7. **Golden Rule**

**Perubahan backend hanya boleh berdampak ke:**
- DTO
- Model
- Service

**Tidak boleh berdampak ke:**
- Hook
- UI

## 8. **Quick Reference**

| Update Type | Primary Files | Secondary Files |
|-------------|---------------|-----------------|
| API berubah | `types/dto`, `models`, `services` | `repositories` |
| Logic berubah | `hooks` | `types/entity` |
| UI berubah | `components`, `pages` | `hooks` |
| Struktur data berubah | `models` | `types/entity` |

## 9. **Update Checklist**

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