# Task: Upload Kontrak tanpa Posisi Karyawan 
Tanggal: 15 april 2026 09:33

---

## Validasi A - Posisi Karyawan Harus Terisi
- [x] Cek apakah data karyawan ada di useDetailDataKaryawanPersonalInfo
- [x] Jika tidak ada: tampilkan error "Data karyawan tidak ditemukan. Pastikan karyawan sudah terdaftar di sistem."
- [x] Cek apakah Employment_Position_Data ada
- [x] Jika tidak ada: tampilkan error "Belum ada posisi. Lengkapi data jabatan karyawan terlebih dahulu sebelum mengunggah kontrak."

## Validasi B - Field Posisi Wajib Terisi
- [x] Cek directorate_id terisi
- [x] Cek division_id terisi  
- [x] Cek department_id terisi
- [x] Cek job_title_id terisi
- [x] Cek position_id terisi
- [x] Jika ada yang kosong: tampilkan error "Belum ada posisi. Lengkapi data jabatan karyawan terlebih dahulu sebelum mengunggah kontrak."

## Validasi C - Frontend Handling
- [x] Pastikan format file hanya PDF
- [x] Pastikan ukuran file tidak lebih dari 10 MB
- [x] Tampilkan Alert component di AddContractModal jika validasi gagal
- [x] Disable form submission jika validasi gagal

## Implementasi Teknis

### AddContractModal Component
- [x] Import Alert component dari @/components/ui/alert/Alert
- [x] Import useDetailDataKaryawanPersonalInfo
- [x] Tambahkan validasi posisi sebelum render form
- [x] Tampilkan Alert dengan variant "error" jika validasi gagal

### Hook Layer (useAddContractModal.ts)
- [x] Tambahkan fungsi validateEmployeePosition()
- [x] Return state untuk menunjukkan apakah validasi posisi lolos
- [x] Prevent submit jika validasi posisi gagal
- [x] Implementasi comprehensive error handling untuk API responses
- [x] Validasi file (PDF only, max 10MB) di handleFileChangeWrapper
- [x] Error handling untuk 404, 422, 500, dan network errors

### BaseModal Component
- [x] Tambahkan props untuk menampilkan Alert
- [x] Render Alert di atas form jika ada error
- [x] Styling yang sesuai untuk error banner

## Edge Cases
- [x] Employment_Position_Data null
- [x] Beberapa field posisi kosong (jabatan terisi tapi struktural kosong)
- [x] Semua field posisi kosong
- [x] Data karyawan tidak ditemukan (404)

## Error Messages
- [x] "Data karyawan tidak ditemukan. Pastikan karyawan sudah terdaftar di sistem."
- [x] "Belum ada posisi. Lengkapi data jabatan karyawan terlebih dahulu sebelum mengunggah kontrak."
- [x] Error format file: "Format file tidak didukung. Harap unggah dokumen dalam format PDF."
- [x] Error ukuran file: "Ukuran file terlalu besar. Maksimal ukuran file yang diizinkan adalah 10 MB."
- [x] Gagal upload dokumen: "Gagal mengunggah file. Periksa koneksi internet Anda dan coba lagi."
- [x] Error tidak terduga: "Terjadi kesalahan pada sistem. Silakan coba beberapa saat lagi atau hubungi tim IT."

## Testing & Quality Assurance
- [ ] Test dengan data karyawan lengkap
- [ ] Test dengan Employment_Position_Data kosong
- [ ] Test dengan beberapa field posisi kosong
- [ ] Test upload file PDF
- [ ] Test upload file non-PDF
- [ ] Test upload file > 10MB

## Status: COMPLETED