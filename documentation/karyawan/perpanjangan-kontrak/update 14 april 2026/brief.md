### rule
Validasi A — Tanggal Berakhir Kontrak Baru:
Tanggal Berakhir Baru harus > (hari ini + 2 bulan)
Tanggal Berakhir Baru harus > Tanggal Berakhir Kontrak Lama

Validasi B — Tanggal Mulai Kontrak Baru:
Tanggal Mulai Kontrak Baru harus ≥ Tanggal Berakhir Kontrak Lama
(tidak boleh overlap mundur dengan kontrak yang masih berjalan)

Validasi C — Kontrak ke:
Nomor Kontrak ke harus lebih besar dari kontrak sebelumnya
(tidak boleh input kontrak ke-2 jika sudah di kontrak ke-3)

### Edge Cases

- Tanggal Berakhir Baru = Tanggal Berakhir Lama → tidak valid
- Tanggal Berakhir Baru tepat 2 bulan dari hari ini → tidak valid
(harus lebih dari 2 bulan, bukan sama dengan)
- Tanggal Mulai Baru sebelum Tanggal Berakhir Lama → tidak valid (overlap)


## kondisi dan pesan yang ditampilkan

Tanggal Berakhir Baru ≤ hari ini + 2 bulan: "Tanggal berakhir kontrak baru minimal harus lebih dari [tanggal hari ini + 2 bulan]. Hal ini untuk memastikan notifikasi perpanjangan tidak terus muncul."

Tanggal Berakhir Baru ≤ Tanggal Berakhir Lama: "Tanggal berakhir kontrak baru harus lebih dari tanggal berakhir kontrak sebelumnya ([tanggal berakhir lama])."

Tanggal Mulai Baru < Tanggal Berakhir Lama: "Tanggal mulai kontrak baru tidak boleh sebelum tanggal berakhir kontrak sebelumnya ([tanggal berakhir lama])."

Sisa kontrak aktif ≤ 1 hari: "Masa kontrak aktif terlalu singkat untuk memproses perubahan organisasi. Lakukan perpanjangan kontrak terlebih dahulu sebelum mengajukan perubahan organisasi."

Kontrak aktif sudah berakhir: "Kontrak karyawan ini telah berakhir. Lakukan perpanjangan kontrak terlebih dahulu sebelum mengajukan perubahan organisasi."