# HRIS - Fitur: Struktur & Organisasi

Fitur ini berfungsi untuk mengelola struktur organisasi perusahaan secara hierarkis, mulai dari lini bisnis hingga posisi jabatan.  
Setiap entitas memiliki tab tersendiri dengan fungsi utama **Tambah Data**, **Export Data**, **Pencarian**, dan **Filter Kolom**, serta tabel data dengan aksi **Edit** dan **Delete**.

---

## 1. Lini Bisnis

Menampilkan daftar seluruh lini bisnis dalam organisasi.

### Komponen

- **Button:** Tambah, Export
- **Input:** Search, Filter Kolom
- **Tabel Kolom:**
  | No | Lini Bisnis | Deskripsi Umum | File SK dan Memo | Action |
  |----|--------------|----------------|------------------|---------|
  | | | | | Edit / Delete |

---

## 2. Perusahaan

Menampilkan daftar perusahaan yang berada di bawah setiap lini bisnis.

### Komponen

- **Button:** Tambah, Export
- **Input:** Search, Filter Kolom
- **Tabel Kolom:**
  | No | Nama Perusahaan | Deskripsi Umum | Lini Bisnis | Detail | Action |
  |----|-----------------|----------------|--------------|---------|---------|
  | | | | | | Edit / Delete |

---

## 3. Office

Mengelola daftar kantor (office) yang dimiliki oleh perusahaan.

### Komponen

- **Button:** Tambah, Export
- **Input:** Search, Filter Kolom
- **Tabel Kolom:**
  | No | Office | Deskripsi Umum | File SK dan Memo | Action |
  |----|---------|----------------|------------------|---------|
  | | | | | Edit / Delete |

---

## 4. Direktorat

Menampilkan daftar direktorat di dalam struktur organisasi.

### Komponen

- **Button:** Tambah, Export
- **Input:** Search, Filter Kolom
- **Tabel Kolom:**
  | No | Nama Direktorat | Deskripsi Umum | File SK dan Memo | Action |
  |----|------------------|----------------|------------------|---------|
  | | | | | Edit / Delete |

---

## 5. Divisi

Menampilkan daftar divisi yang berada di bawah direktorat.

### Komponen

- **Button:** Tambah, Export
- **Input:** Search, Filter Kolom
- **Tabel Kolom:**
  | No | Nama Divisi | Deskripsi Umum | File SK dan Memo | Action |
  |----|---------------|----------------|------------------|---------|
  | | | | | Edit / Delete |

---

## 6. Departemen

Menampilkan daftar departemen dalam setiap divisi.

### Komponen

- **Button:** Tambah, Export
- **Input:** Search, Filter Kolom
- **Tabel Kolom:**
  | No | Nama Departemen | File SK dan Memo | Action |
  |----|------------------|------------------|---------|
  | | | | Edit / Delete |

---

## 7. Jabatan

Menampilkan struktur jabatan beserta detail tanggung jawab dan hierarkinya.

### Komponen

- **Button:** Tambah, Export
- **Input:** Search, Filter Kolom
- **Tabel Kolom:**
  | No | Nama Jabatan | Grade | Deskripsi Tugas | Bawahan Langsung | File SK & MoU | Action |
  |----|---------------|--------|------------------|-------------------|----------------|---------|
  | | | | | | | Edit / Delete |

---

## 8. Posisi

Menampilkan daftar posisi karyawan yang terkait dengan jabatan dan unit organisasi.

### Komponen

- **Button:** Tambah, Export
- **Input:** Search, Filter Kolom
- **Tabel Kolom:**
  | No | Nama Posisi | Jabatan | Direktorat | Divisi | Departemen | File SK & MoU | Action |
  |----|---------------|----------|--------------|----------|--------------|----------------|---------|
  | | | | | | | | Edit / Delete |

---
