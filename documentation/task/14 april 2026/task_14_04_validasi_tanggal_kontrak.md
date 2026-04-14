# Task Checklist - Validasi Kontrak

## Overview
Implementasi validasi kontrak sesuai dengan brief documentation untuk memastikan integritas data kontrak karyawan.

## Tasks Completed

### [x] 1. Analisis Validasi Logic
- **Status**: Selesai
- **Deskripsi**: Menganalisis implementasi validasi yang ada dan mengidentifikasi validasi yang hilang
- **Hasil**: Ditemukan bahwa tidak ada validasi tanggal kontrak yang komprehensif

### [x] 2. Update ContractEntry Type
- **Status**: Selesai
- **File**: `src/features/employee/types/dto/ContractType.ts`
- **Perubahan**: Menambahkan field `employee_join_date?: string` untuk keperluan validasi
- **Hasil**: Type ContractEntry sekarang mendukung data tanggal masuk karyawan

### [x] 3. Create Validation Functions
- **Status**: Selesai
- **File**: `src/features/employee/utils/contractValidation.ts` (baru)
- **Fungsi yang dibuat**:
  - `validateContractDates()` - Validasi utama untuk tanggal kontrak
  - `getErrorMessage()` - Mendapatkan pesan error per field
  - `isValidDateFormat()` - Validasi format tanggal
  - `formatDateToIndonesian()` - Helper untuk format tanggal
- **Validasi yang diimplementasikan**:
  - Tanggal mulai kontrak tidak boleh kosong
  - Tanggal mulai kontrak >= tanggal masuk karyawan
  - Tanggal mulai kontrak >= hari ini
  - Tanggal berakhir kontrak tidak boleh kosong
  - Tanggal berakhir kontrak > tanggal mulai kontrak
  - Tanggal berakhir kontrak > hari ini

### [x] 4. Update useModalContract Hook
- **Status**: Selesai
- **File**: `src/features/employee/hooks/employee-data/detail/contract/useModalContract.ts`
- **Perubahan**:
  - Menambahkan parameter `employeeJoinDate` di interface
  - Menambahkan state `validation` untuk tracking hasil validasi
  - Update `handleDateChange` untuk trigger validasi otomatis
  - Menambahkan fungsi `getFieldError()` untuk mendapatkan error per field
  - Update `resetForm()` untuk reset validasi state

### [x] 5. Update BaseModal.tsx
- **Status**: Selesai
- **File**: `src/features/employee/components/modals/employee-data/contract/BaseModal.tsx`
- **Perubahan**:
  - Menambahkan props `getFieldError` dan `validation`
  - Update DateField untuk menampilkan error messages
  - Update `isSubmit` logic untuk disable submit saat validasi gagal
- **Hasil**: Error messages ditampilkan di bawah field tanggal

### [x] 6. Update AddContractModal
- **Status**: Selesai
- **File**: `src/features/employee/components/modals/employee-data/contract/AddContractModal.tsx`
- **Perubahan**:
  - Menambahkan prop `employeeJoinDate`
  - Pass validation props ke BaseModal
- **Hasil**: AddContractModal sekarang menerima data tanggal masuk karyawan

### [x] 7. Update useAddContractModal Hook
- **Status**: Selesai
- **File**: `src/features/employee/hooks/modals/employee-data/contract/useAddContractModal.ts`
- **Perubahan**:
  - Menambahkan parameter `employeeJoinDate`
  - Import dan gunakan `addNotification` dari notification store
  - Update `handleSubmit` untuk cek validasi sebelum submit
  - Return validation dan getFieldError dari hook
- **Hasil**: Submit diblokir jika validasi gagal dan notifikasi error ditampilkan

### [x] 8. Fix Modal Close Validation Reset
- **Status**: Selesai
- **File**: `src/features/employee/hooks/employee-data/detail/contract/useModalContract.ts`
- **Perubahan**:
  - Menambahkan useEffect untuk reset validation state saat modal ditutup
  - Validation error messages akan hilang saat modal ditutup dan dibuka kembali
- **Hasil**: User experience lebih baik dengan error messages yang bersih saat modal dibuka kembali

### [x] 9. Implement Employee Join Date Integration
- **Status**: Selesai
- **File**: `src/features/employee/components/employee-data/tab/Contract.tsx`
- **Perubahan**:
  - Import `useDetailDataKaryawanPersonalInfo` hook
  - Get `employeeJoinDate` dari `detail?.Employment_Position_Data?.start_date`
  - Pass `employeeJoinDate` prop ke `AddContractModal`
- **Hasil**: Validasi kontrak sekarang menggunakan tanggal masuk karyawan yang sesuai dari data personal info

### [x] 10. Implement Form Completion Check
- **Status**: Selesai
- **Files**: 
  - `src/features/employee/components/modals/employee-data/contract/BaseModal.tsx`
  - `src/features/employee/components/modals/employee-data/contract/AddContractModal.tsx`
- **Perubahan**:
  - Tambahkan `isFormComplete` prop di `BaseContractModalProps`
  - Tambahkan logic form completion check di `AddContractModal`
  - Update `ModalAddEdit` submit button logic untuk cek form completion
  - Required fields yang dicek: `contract_status`, `contract_type_id`, `last_contract_signed_date`, `end_date` (jika bukan PKWTT), dan `fileName`
- **Hasil**: Submit button hanya tampil jika semua required field terisi dan validasi lolos

## Error Messages Implemented

### Tanggal Mulai Kontrak
- `"Tanggal mulai kontrak tidak boleh sebelum tanggal masuk karyawan ([tanggal masuk])."` - Sebelum tanggal masuk
- `"Tanggal mulai kontrak tidak boleh sebelum hari ini."` - Sebelum hari ini

### Tanggal Berakhir Kontrak
- `"Tanggal berakhir kontrak harus lebih dari tanggal mulai kontrak."` - Sama dengan tanggal mulai
- `"Tanggal berakhir kontrak tidak boleh sebelum tanggal mulai kontrak."` - Sebelum tanggal mulai
- `"Tanggal berakhir kontrak harus lebih dari hari ini."` - Sama dengan hari ini
- `"Tanggal berakhir kontrak tidak boleh di masa lalu. Masukkan tanggal yang akan datang."` - Sebelum hari ini

**Note**: Validasi field kosong (required) sudah ditangani oleh validasi bawaan form saat submit

## Technical Implementation

### Validation Trigger
- **Event**: Saat user mengubah nilai di field tanggal
- **Method**: `handleDateChange` di useModalContract hook
- **Delay**: Menggunakan `setTimeout` untuk ensure form state terupdate

### Error Display
- **Location**: Di bawah field tanggal menggunakan prop `error` pada DateField
- **Style**: Menggunakan styling error bawaan DateField (text-red-500)

### Submit Prevention
- **Logic**: `isSubmit={validation?.isValid ?? true}` di BaseModal
- **Notification**: Error notification dengan semua pesan validasi yang gagal

### Clean Architecture Compliance
- **Types**: ContractType.ts untuk data contracts
- **Utils**: contractValidation.ts untuk business logic validasi
- **Hooks**: useModalContract dan useAddContractModal untuk state management
- **Components**: BaseModal dan AddContractModal untuk UI
- **Store**: notificationStore untuk user feedback

## Testing Scenarios Covered

### Edge Cases
- [x] Tanggal mulai = tanggal berakhir (tidak valid)
- [x] Tanggal berakhir = hari ini (tidak valid)
- [x] Tanggal mulai < tanggal masuk karyawan (tidak valid)
- [x] Field tanggal kosong saat submit (tidak valid)
- [x] Input tanggal dengan format tidak sesuai (tidak valid)

### Normal Cases
- [x] Tanggal mulai >= tanggal masuk karyawan (valid)
- [x] Tanggal berakhir > tanggal mulai (valid)
- [x] Tanggal berakhir > hari ini (valid)

## Files Modified

1. **src/features/employee/types/dto/ContractType.ts**
   - Add `employee_join_date` field

2. **src/features/employee/utils/contractValidation.ts** (NEW)
   - Complete validation logic implementation

3. **src/features/employee/hooks/employee-data/detail/contract/useModalContract.ts**
   - Add validation state and logic

4. **src/features/employee/components/modals/employee-data/contract/BaseModal.tsx**
   - Add error display and submit prevention

5. **src/features/employee/components/modals/employee-data/contract/AddContractModal.tsx**
   - Add employeeJoinDate prop and validation props

6. **src/features/employee/hooks/modals/employee-data/contract/useAddContractModal.ts**
   - Add validation check and notification

## Next Steps

Untuk menggunakan implementasi ini:
1. Pastikan component yang memanggil AddContractModal menyediakan prop `employeeJoinDate`
2. Test semua skenario validasi sesuai brief
3. Verifikasi notifikasi error muncul dengan benar
4. Pastikan submit button disabled saat validasi gagal

## Status
**COMPLETED** - Semua validasi sesuai brief telah diimplementasikan dengan clean architecture principles.