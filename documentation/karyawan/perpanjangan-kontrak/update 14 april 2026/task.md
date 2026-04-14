# Checklist Update Perpanjangan Kontrak - 14 April 2026

## ✅ Validasi A — Tanggal Berakhir Kontrak Baru
- [x] Tanggal Berakhir Baru harus > (hari ini + 2 bulan)
- [x] Tanggal Berakhir Baru harus > Tanggal Berakhir Kontrak Lama
- [x] Implementasi validasi di `validateNewContractEndDate()`
- [x] Error message: "Tanggal berakhir kontrak baru minimal harus lebih dari [tanggal hari ini + 2 bulan]. Hal ini untuk memastikan notifikasi perpanjangan tidak terus muncul."
- [x] Error message: "Tanggal berakhir kontrak baru harus lebih dari tanggal berakhir kontrak sebelumnya ([tanggal berakhir lama])."

## ✅ Validasi B — Tanggal Mulai Kontrak Baru
- [x] Tanggal Mulai Kontrak Baru harus ≥ Tanggal Berakhir Kontrak Lama
- [x] Tidak boleh overlap mundur dengan kontrak yang masih berjalan
- [x] Implementasi validasi di `validateNewContractStartDate()`
- [x] Error message: "Tanggal mulai kontrak baru tidak boleh sebelum tanggal berakhir kontrak sebelumnya ([tanggal berakhir lama])."

## ✅ Validasi C — Kontrak ke
- [x] Nomor Kontrak ke harus lebih besar dari kontrak sebelumnya
- [x] Tidak boleh input kontrak ke-2 jika sudah di kontrak ke-3
- [x] Implementasi validasi di `validateContractSequence()`
- [x] Error message: "Nomor kontrak ke harus lebih besar dari kontrak sebelumnya ([nomor lama])."

## ✅ Edge Cases
- [x] Tanggal Berakhir Baru = Tanggal Berakhir Lama → tidak valid
- [x] Tanggal Berakhir Baru tepat 2 bulan dari hari ini → tidak valid
- [x] Tanggal Mulai Baru sebelum Tanggal Berakhir Lama → tidak valid (overlap)
- [x] Sisa kontrak aktif ≤ 1 hari → validasi awal
- [x] Kontrak aktif sudah berakhir → validasi awal

## Implementasi Teknis

### Hook Layer (`useContractRenewalDetail.ts`)
- [x] Import `addNotification` dari `notificationStore.ts`
- [x] Interface `ValidationErrors` untuk state error
- [x] Fungsi validasi: `validateNewContractEndDate()`, `validateNewContractStartDate()`, `validateContractSequence()`, `validateRemainingContract()`
- [x] Fungsi `showValidationError()` untuk menampilkan notification
- [x] Update `handleInputChange()` dengan validasi real-time
- [x] Validasi awal saat data dimuat (useEffect)
- [x] Return `validationErrors` untuk UI consumption

### Modal Layer (`useEditContractRenewalStatusModal.ts`)
- [x] Import `addNotification` dari `notificationStore.ts`
- [x] Fungsi `validateAllFields()` untuk validasi submit
- [x] Validasi di submit handler (handleSubmit) - Opsi Pertama
- [x] Stop submit jika ada error dan tampilkan notification

### Component Layer (`ContractRenewalDetail.tsx`)
- [x] Import `validationErrors` dari hook
- [x] Error display di bawah field yang relevan
- [x] Styling error dengan `text-sm text-red-500`
- [x] Field yang divalidasi: Kontrak Ke, Tanggal TTD Kontrak Baru, Tanggal Berakhir Kontrak Baru

### Page Layer (`ContractRenewalPage.tsx`)
- [x] Memanfaatkan notification system global yang sudah ada
- [x] Tidak perlu menambahkan container baru

### Type Safety
- [x] Update interface `Params` dengan `contract_sequence`
- [x] Proper TypeScript typing untuk semua fungsi
- [x] Clean architecture layer separation

## ✅ User Experience
- [x] Real-time validation saat user input
- [x] Error notification muncul langsung
- [x] Error messages jelas dan informatif
- [x] Visual feedback di UI (error messages di bawah field)
- [x] Global notification untuk error penting

## ✅ Testing & Quality Assurance
- [x] Semua validasi sesuai brief
- [x] Edge cases tercover
- [x] Error messages sesuai spesifikasi
- [x] Clean architecture compliance
- [x] Type safety implementation

## 📝 Catatan Tambahan
- Validasi hanya berjalan saat `isEditing = true` dan `value` tidak kosong
- Notification system menggunakan global store yang sudah ada di `App.tsx`
- Error messages dinamis dengan format tanggal Indonesia
- Validasi sisa kontrak berjalan otomatis saat data dimuat

## 🎯 Status: COMPLETED
Semua requirement dari brief telah diimplementasikan dengan mengikuti clean architecture principles yang ada di codebase.