# Task: penguduran diri - rule tanggal efektif
Tanggal: 25 april 2026 07:25

---

## Checklist:

### 1. Update DTO Types yang Sudah Ada
- [x] Tambahkan field `contract_end_date` ke DTO yang sudah ada di DetailResignationPage
- [x] Tambahkan field `contract_end_date` ke DTO yang sudah ada di AdministrationPopupResult
- [x] Tambahkan TypeScript types untuk handling tanggal (jika belum ada)

### 2. Update Entity Types yang Sudah Ada  
- [x] Tambahkan field `contract_end_date` ke entity yang sudah ada
- [x] Tambahkan field `contract_end_date` ke entity yang sudah ada untuk terminasi
- [x] Tambahkan entity types untuk validasi tanggal (jika belum ada)

### 3. Update Model yang Sudah Ada
- [x] Update model yang sudah ada untuk mapping `contract_end_date`
- [x] Handle formatting dan validasi tanggal
- [x] Tambahkan null safety checks untuk data kontrak yang hilang
- [x] Set dummy data untuk `contract_end_date` (sementara)

### 4. Update Hook yang Sudah Ada - DetailResignationPage
- [x] Update hook `useDetailResignation.ts` untuk mengambil `contract_end_date`
- [x] Tambahkan state untuk tanggal berakhir kontrak
- [x] Tambahkan state untuk error validasi
- [x] Implement fungsi `validateEffectiveDate`
- [x] Tambahkan loading dan error states
- [x] Ambil data `contract_end_date` dari API yang sudah ada

### 5. Update Hook yang Sudah Ada - TerminationAdministration
- [x] Update hook untuk `TerminationAdministrationPage.tsx`
- [x] Tambahkan state untuk tanggal berakhir kontrak
- [x] Tambahkan state untuk error validasi
- [x] Implement fungsi `validateEffectiveDate`
- [x] Tambahkan loading dan error states
- [x] Ambil data `contract_end_date` dari API `getPopup` yang sudah ada

### 6. Update UI Component - EffectiveResignationDateModal
- [x] Update `EffectiveResignationDateModal.tsx` untuk menggunakan validasi
- [x] Gunakan `DateField` component untuk konsistensi UI
- [x] Gunakan error handling bawaan DateField component
- [x] Tambahkan display tanggal berakhir kontrak di bawah input field
- [x] Implement real-time validation saat tanggal berubah
- [x] Tambahkan helper text "Tanggal berakhir kontrak: [tanggal]"
- [x] Disable tanggal di luar tanggal berakhir kontrak dengan maxDate constraint

### 7. Update UI Component - AddUserTermination
- [x] Update `AddUserTermination.tsx` untuk menggunakan validasi
- [x] Gunakan `DateField` component untuk konsistensi UI
- [x] Gunakan error handling bawaan DateField component
- [x] Tambahkan display tanggal berakhir kontrak di bawah input field
- [x] Implement real-time validation saat tanggal berubah
- [x] Tambahkan helper text "Tanggal berakhir kontrak: [tanggal]"
- [x] Disable tanggal di luar tanggal berakhir kontrak dengan maxDate constraint

### 8. Tambahkan Logic Validasi
- [x] Implement aturan: tanggal efektif tidak boleh melebihi tanggal berakhir kontrak
- [x] Tampilkan error message: "Tanggal efektif tidak boleh melebihi tanggal berakhir kontrak"
- [x] Tambahkan visual feedback untuk tanggal tidak valid (border merah, error text)
- [x] Tambahkan success feedback untuk tanggal valid

### 9. Testing & Integrasi
- [x] Test validasi di modal pengunduran diri
- [x] Test validasi di modal terminasi
- [x] Verifikasi dummy data tampil dengan benar
- [x] Test error handling untuk data kontrak yang hilang
- [x] Pastikan UI update dengan benar saat hasil validasi