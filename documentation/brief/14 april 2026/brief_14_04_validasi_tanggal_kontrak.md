

# Brief Validasi Kontrak

Validasi A — Tanggal Mulai Kontrak:
Tanggal Mulai Kontrak harus lebih dari atau sama dengan Tanggal Masuk karyawan
Tanggal Mulai Kontrak harus lebih dari atau sama dengan hari ini

Validasi B — Tanggal Berakhir Kontrak:
Tanggal Berakhir Kontrak harus lebih besar dari Tanggal Mulai Kontrak
Tanggal Berakhir Kontrak harus lebih besar dari hari ini

Validasi C — Relasi antar tanggal:
Tanggal Masuk ≤ Tanggal Mulai Kontrak < Tanggal Berakhir Kontrak
Tanggal Berakhir Kontrak > hari ini

### Edge Cases

- Tanggal Mulai Kontrak sama dengan Tanggal Berakhir Kontrak → tidak valid
- Tanggal Berakhir Kontrak tepat hari ini → tidak valid (harus lebih dari hari ini)
- Tanggal Mulai Kontrak lebih awal dari Tanggal Masuk karyawan → tidak valid
- Salah satu field tanggal kosong saat submit → tidak valid
- Input tanggal dengan format tidak sesuai (bukan DD/MM/YYYY) → tidak valid

## kondisi dan pesan yang ditampilkan

- Tanggal Mulai Kontrak kosong: "Tanggal mulai kontrak wajib diisi."
- Tanggal Berakhir Kontrak kosong: "Tanggal berakhir kontrak wajib diisi."
- Tanggal Mulai < Tanggal Masuk: "Tanggal mulai kontrak tidak boleh sebelum tanggal masuk karyawan ([tanggal masuk])."
- Tanggal Mulai = Tanggal Berakhir: "Tanggal berakhir kontrak harus lebih dari tanggal mulai kontrak."
- Tanggal Berakhir < Tanggal Mulai: "Tanggal berakhir kontrak tidak boleh sebelum tanggal mulai kontrak."
- Tanggal Berakhir = hari ini: "Tanggal berakhir kontrak harus lebih dari hari ini."
- Tanggal Berakhir < hari ini: "Tanggal berakhir kontrak tidak boleh di masa lalu. Masukkan tanggal yang akan datang."

## teknis
- tampilkan error di bawah field tanggal (gunakan hint)
- triggernya tampil pesan error  adalah ketika user menginputakan data di fieldnya
- blokir submit jika validasi gagal
- gunakan src\stores\notificationStore.ts untuk menampilkan pesan errornya 