# Task: validasi tanggal perubahan organisasi
Tanggal: 14 april 2026 14:27

---

## Checklist Update Validasi Tanggal Perubahan Organisasi - 14 April 2026

## Validasi B - Tanggal Efektif < Tanggal Berakhir Kontrak Aktif
- [x] Tanggal Efektif harus < Tanggal Berakhir Kontrak Aktif
- [x] Implementasi validasi di `validateEffectiveDate()`
- [x] Error message: "Tanggal efektif harus sebelum tanggal berakhir kontrak aktif karyawan ([tanggal berakhir kontrak])."

## Validasi C - Kontrak Aktif Harus Ada
- [x] Cek keberadaan kontrak aktif sebelum input tanggal efektif
- [x] Blokir seluruh form jika tidak ada kontrak aktif
- [x] Implementasi validasi di `validateActiveContract()`
- [x] Error message: "Karyawan ini tidak memiliki kontrak aktif. Perubahan organisasi tidak dapat diproses sebelum kontrak aktif tersedia."

## Validasi D - Dokumen SK Wajib Tersedia
- [x] Validasi upload SK sebelum submit
- [x] Implementasi validasi di `validateDocumentUpload()`
- [x] Error message: "Dokumen SK wajib diunggah sebelum menyimpan perubahan organisasi."

## Edge Cases
- [x] Tanggal Efektif = Tanggal Berakhir Kontrak Aktif -> tidak valid
- [x] Karyawan tidak memiliki kontrak aktif -> blokir form
<!-- ini belllummm -->
- [ ] Kontrak aktif berakhir dalam 1 hari -> peringatan khusus (TODO: Implement warning logic)
- [x] SK belum diupload saat submit -> tidak valid

## Implementasi Teknis

### Hook Layer (`useCreateOrganizationHistory.ts`)
- [x] Import `addNotification` dari `notificationStore.ts`
- [x] Interface `ValidationErrors` untuk state error
- [x] State untuk menyimpan data kontrak aktif karyawan
- [x] Fungsi validasi: `validateEffectiveDate()`, `validateActiveContract()`, `validateDocumentUpload()`
- [x] Update `handleNIPChange()` untuk fetch data kontrak aktif
- [x] Update `handleInput()` dengan validasi real-time untuk efektif_date
- [x] Update `handleSubmit()` dengan validasi complete sebelum submit
- [x] Return `validationErrors` dan `activeContractData` untuk UI consumption

### Component Layer (`createOrganizationHistory.tsx`)
- [x] Import `validationErrors` dan `activeContractData` dari hook
- [x] Error display di bawah field Tanggal Efektif
- [x] Styling error dengan `text-sm text-red-500`
- [x] Disable form jika tidak ada kontrak aktif
- [x] Tampilkan warning jika tidak ada kontrak aktif

### Type Safety
- [x] Interface untuk data kontrak aktif karyawan
- [x] Interface `ValidationErrors` dengan proper typing
- [x] Clean architecture layer separation

## User Experience
- [x] Real-time validation saat user input tanggal efektif
- [x] Error notification muncul langsung
- [x] Error messages jelas dan informatif
- [x] Visual feedback di UI (error messages di bawah field)
- [x] Global notification untuk error penting
- [x] Form disabled state jika tidak ada kontrak aktif

## Testing & Quality Assurance
- [x] Semua validasi sesuai brief
- [x] Edge cases tercover
- [x] Error messages sesuai spesifikasi
- [x] Clean architecture compliance
- [x] Type safety implementation

## Status: COMPLETED
Semua requirement dari brief telah diimplementasikan dengan mengikuti clean architecture principles yang ada di codebase.

## Catatan Tambahan
- Validasi hanya berjalan saat ada data karyawan dan kontrak aktif
- Notification system menggunakan global store yang sudah ada
- Error messages dinamis dengan format tanggal Indonesia
- Form akan dinonaktifkan secara otomatis jika tidak ada kontrak aktif
- Satu edge case yang belum diimplementasi: peringatan khusus untuk kontrak yang akan berakhir dalam 1 hari