### 📝 Rincian Elemen Formulir Pengunduran Diri

| Kategori             | Elemen Spesifik (Inputan) | Tipe Elemen   | Keterangan/Fungsi                                          |
| :------------------- | :------------------------ | :------------ | :--------------------------------------------------------- |
| **Header**           | Share                     | Tombol Ikon   | Berfungsi untuk berbagi formulir (misalnya, _link_).       |
| **Data Karyawan**    | Nomer/Id Karyawan         | Input Teks    | Kolom isian untuk ID unik karyawan.                        |
|                      | Nama Lengkap              | Input Teks    | Kolom isian untuk nama lengkap.                            |
|                      | Tanggal Pengajuan         | Input Tanggal | Nilai contoh: **28 Januari 1999**. Memiliki ikon kalender. |
|                      | Departement               | Input Teks    | Kolom isian untuk departemen karyawan.                     |
|                      | Posisi                    | Input Teks    | Kolom isian untuk jabatan/posisi karyawan.                 |
| **Detail Pengajuan** | Alasan Pengunduran diri   | Textarea      | Kolom isian panjang (_Enter as description..._).           |
| **Upload Dokumen**   | Surat Pengunduran Diri    | Area Dropzone | Area untuk mengunggah file PDF, mendukung _drag and drop_. |
|                      | Browse File               | Teks/Link     | Link untuk membuka dialog pemilihan file secara manual.    |
| **Aksi**             | Submit                    | Tombol        | Tombol aksi utama untuk mengirimkan formulir.              |

---

### 📋 Rincian Elemen Detail Pengunduran Diri (Dasaria)

#### **I. Data Karyawan & Pengajuan**

| Kategori          | Elemen Spesifik         | Tipe Elemen | Keterangan Nilai/Status                        |
| :---------------- | :---------------------- | :---------- | :--------------------------------------------- |
| **Data Karyawan** | Nama Lengkap            | Teks Statis | Budi                                           |
|                   | ID Karyawan             | Teks Statis | 12345678910                                    |
|                   | Posisi                  | Teks Statis | Direktur Teknologi dan Jaringan                |
|                   | Tanggal Pengajuan       | Teks Statis | 28 Januari 1999                                |
|                   | Sisa Kontrak            | Teks Statis | 5 Bulan                                        |
|                   | Jenis Kontrak           | Teks Statis | PKWT                                           |
| **Pengajuan**     | Alasan Pengunduran Diri | Textarea    | Kolom isian panjang (Enter as description...)  |
| **Preview**       | Preview PDF             | Tombol      | Berfungsi untuk menampilkan pratinjau dokumen. |

---

#### **II. Berkas / Dokumen (Upload)**

| Kategori        | Elemen Spesifik    | Tipe Elemen           | Keterangan                                         |
| :-------------- | :----------------- | :-------------------- | :------------------------------------------------- |
| **Form Upload** | Tipe File          | Dropdown              | (Pilih Jenis Dokumen)                              |
|                 | Pilih File         | Input File            | (Tidak ada file yang dipilih)                      |
|                 | Tombol Tambah File | Tombol Ikon + (Hijau) | Berfungsi untuk memunculkan dialog pemilihan file. |
|                 | Upload             | Tombol                | Tombol Aksi Unggah File.                           |

---

#### **III. Daftar Dokumen yang Sudah Diunggah**

Ini adalah **Tabel** yang berisi daftar dokumen yang terkait dengan proses pengunduran diri:

| Kolom Tabel   | Contoh Isi Baris 1         |
| :------------ | :------------------------- |
| **No.**       | 1                          |
| **Tipe File** | Form Exit Discussion       |
| **Nama File** | Form Exit Discussion.pdf   |
| **Action**    | Ikon Tempat Sampah (Hapus) |

**Daftar Tipe File yang Terlihat dalam Tabel:**

1.  Form Exit Discussion
2.  Surat Balasan Resign
3.  Berita Acara Serah Terima (BAST)
4.  Form Exit Clearance
5.  Form Exit Interview
6.  Form Exit Questionnaire
7.  Informasi Garden Leave
8.  Paklaring (jika ada)

---

#### **IV. Tombol Aksi (Bagian Bawah)**

| Tombol (Buttons) | Warna / Status   | Keterangan                                    |
| :--------------- | :--------------- | :-------------------------------------------- |
| **Save Draft**   | Putih / Primer   | Menyimpan pengajuan sebagai draf.             |
| **Rejected**     | Merah / Sekunder | Menunjukkan atau mengatur status penolakan.   |
| **Approved**     | Hijau / Primer   | Menunjukkan atau mengatur status persetujuan. |

---

#### **V. Navigasi Samping (Sidebar)**

| Kategori                 | Item Menu                          | Keterangan              |
| :----------------------- | :--------------------------------- | :---------------------- |
| **Menu**                 | Dashboard                          | (Ikon Home)             |
|                          | Struktur Dan Organisasi            | (Ikon Organisasi)       |
| **Data Master Karyawan** | (Dropdown)                         |
|                          | $\rightarrow$ Data Karyawan        | Sub-menu                |
|                          | $\rightarrow$ **Pengunduran Diri** | Sub-menu (Sedang Aktif) |
|                          | $\rightarrow$ Perpanjang Kontrak   | Sub-menu                |

---

Antarmuka ini tampaknya digunakan oleh seorang HR atau atasan untuk meninjau dan mengelola proses _off-boarding_ (pemutusan hubungan kerja/pengunduran diri) seorang karyawan, dengan fokus pada pengumpulan dokumen _exit_.

Apakah Anda ingin saya membandingkan antarmuka ini dengan formulir pendaftaran karyawan yang sebelumnya, atau memberikan evaluasi singkat mengenai tata letaknya?
