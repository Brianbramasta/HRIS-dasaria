# Brief: validasi tanggal perubahan organisasi
Tanggal: 14 april 2026 14:27

---
Validasi A — Tanggal Efektif harus di masa depan:
Tanggal Efektif > hari ini
(tidak boleh input perubahan organisasi dengan tanggal yang sudah lewat)

Validasi B — Tanggal Efektif harus sebelum kontrak aktif berakhir:
Tanggal Efektif < Tanggal Berakhir Kontrak Aktif
(perubahan organisasi tidak boleh melebihi masa kontrak yang sedang berjalan)

Validasi C — Kontrak aktif harus ada:
Sebelum input Tanggal Efektif, sistem wajib mengecek apakah karyawan
memiliki kontrak aktif. Jika tidak ada kontrak aktif, perubahan
organisasi tidak dapat diproses.

Validasi D — Dokumen wajib tersedia:
 SK wajib diupload sebelum tanggal efektif dapat disimpan.

### Edge Cases

- Tanggal Efektif = hari ini → tidak valid (harus lebih dari hari ini)
- Tanggal Efektif = Tanggal Berakhir Kontrak Aktif → tidak valid
(harus kurang dari, bukan sama dengan)
- Karyawan tidak memiliki kontrak aktif → blokir seluruh form perubahan organisasi
- Kontrak aktif ada tapi akan berakhir dalam 1 hari → Tanggal Efektif
tidak bisa diisi valid → tampilkan peringatan khusus
- SK belum diupload saat submit → tidak valid


## kondisi dan pesan yang ditampilkan
1. Tanggal Efektif = hari ini
"Tanggal efektif perubahan organisasi harus lebih dari hari ini."

2. Tanggal Efektif < hari ini
"Tanggal efektif tidak boleh di masa lalu. Masukkan tanggal yang akan datang."

3. Tanggal Efektif ≥ Tanggal Berakhir Kontrak Aktif
"Tanggal efektif harus sebelum tanggal berakhir kontrak aktif karyawan ([tanggal berakhir kontrak])."

4. Tidak ada kontrak aktif
"Karyawan ini tidak memiliki kontrak aktif. Perubahan organisasi tidak dapat diproses sebelum kontrak aktif tersedia."

5. Kontrak aktif berakhir terlalu dekat
"Sisa masa kontrak aktif terlalu singkat untuk memproses perubahan organisasi. Silakan perpanjang kontrak terlebih dahulu."

6. SK belum diupload
"Dokumen SK wajib diunggah sebelum menyimpan perubahan organisasi."