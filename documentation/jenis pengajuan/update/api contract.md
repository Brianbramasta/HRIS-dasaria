# Kontrak API – Jenis Pengajuan (Type of Application)

Dokumen ini merinci kontrak API untuk fitur `Jenis Pengajuan`. Fitur ini mencakup manajemen berbagai jenis pengajuan (seperti Kasbon dan Pengunduran Diri) yang dilakukan oleh karyawan, mulai dari pembuatan pengajuan awal hingga pemutakhiran data detail melalui alur self-service.

## Konvensi Umum

- **Header auth**: `Authorization: Bearer <token>` untuk semua endpoint.
- **Content-Type**: `multipart/form-data` untuk form data (terutama pada POST/PATCH).
- **Response error**: `{ errorCode: string, message: string, details?: any }`.
- **Date Format**: Gunakan format ISO `YYYY-MM-DD` untuk semua field tanggal.

---

## Endpoint Utama

### 1. Simpan Pengajuan Awal
Menyimpan tahap awal pengajuan (Kasbon / Pengunduran Diri).

**Endpoint**: `POST /api/type-of-application/{employee_id}/store`

**Path Parameters**:
- `employee_id` (string, required) – NIP atau ID karyawan.

**Request Body** (form-data):
- `submission` (text, required) – Jenis pengajuan (contoh: `Kasbon`, `Pengunduran Diri`).
- `tanggal_pengajuan` (text, required) – Tanggal pengajuan (format: `YYYY-MM-DD`).

**Response** (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Application submitted successfully."
    },
    "data": {
        "dataTypeOfApplication": {
            "id": "019d3d3c-9dcc-730e-9d75-45950c278e7e",
            "jenis_pengajuan": "Pengunduran Diri",
            "tanggal_pengajuan": "2026-03-09",
            "employee_id": "DSR047",
            "token": "kL23aWhxFRMUulGpjkG7hM3iqb477P81tTiNKiZzVNWt5CJaZrnLpk9PiNjlm8u1",
            "created_at": "2026-03-30T05:34:35.000000Z",
            "updated_at": "2026-03-30T05:34:35.000000Z"
        },
        "dataResignation": {
            "id": "019d3d3c-9dde-7190-a310-fb594e5454db",
            "application_id": "019d3d3c-9dcc-730e-9d75-45950c278e7e",
            "resignation_status_id": "96a0bec7-a884-4a52-893b-7484a986be6c",
            "resignation_reason": null,
            "status_kasbon": "no_kasbon"
        }
    }
}
```

---

### 2. Get Daftar Pengajuan (Index)
Mengambil daftar semua pengajuan yang ada.

**Endpoint**: `GET /api/type-of-application/index`

**Query Parameters** (opsional):
- `search` (string) – pencarian berdasarkan nama, NIP, atau status.
- `per_page` (number) – jumlah data per halaman.
- `page` (number) – nomor halaman.

**Response** (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Applications retrieved successfully."
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "nip": "DSR044",
                "name": "shofyyy",
                "submission_type": "Kasbon",
                "submission_date": "2026-03-09",
                "attachment_document": null,
                "status": "Menunggu Persetujuan FAT",
                "note": null,
                "token": "XkMXQUxsccM95FTyjuDno4vFiByBZKfwNeND8tlQ3ZkKu0jFULvJsi44piyOkWzS"
            },
            {
                "nip": "DSR047",
                "name": "Awan",
                "submission_type": "Pengunduran Diri",
                "submission_date": "2026-03-09",
                "attachment_document": "ApplicationDocument/Resignation/535e62d3.pdf",
                "status": "Menunggu Diproses",
                "note": null,
                "token": "1ZNHRLUt2dKvf1oz0V55b7SAgW4NJKuUmA4tG8mfbb9q3KfD4fOlxcOfl4Gu69nr"
            }
        ],
        "per_page": 10,
        "total": 20
    }
}
```

---

### 3. Get Info Karyawan (Popup Detail)
Mengambil informasi dasar karyawan untuk ditampilkan pada popup/form pengajuan.

**Endpoint**: `GET /api/type-of-application/{employee_id}/popup-application-detail`

**Path Parameters**:
- `employee_id` (string, required) – NIP atau ID karyawan.

**Response** (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Application detail retrieved successfully."
    },
    "data": {
        "nip": "DSR047",
        "full_name": "Awan",
        "company_name": "Dasarata",
        "directorate_name": "Finance&Accounting",
        "department_name": "FAT",
        "division_name": "FAT",
        "position_name": "Beck End"
    }
}
```

---

### 4. Hitung Cicilan Kasbon
Melakukan kalkulasi nominal cicilan berdasarkan jumlah pinjaman dan tenor.

**Endpoint**: `POST /api/type-of-application/{employee_id}/calculate-loan-installment`

**Path Parameters**:
- `employee_id` (string, required) – NIP atau ID karyawan.

**Request Body** (form-data):
- `loanAmount` (number, required) – Total nominal pinjaman.
- `loanPeriodMonths` (number, required) – Tenor pinjaman dalam bulan.

**Response** (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Installment calculated successfully"
    },
    "data": {
        "installment_amount": 500000
    }
}
```

---

### 5. Get Info Self-Service Kasbon
Mengambil detail informasi karyawan dan limit pinjaman untuk pengajuan Kasbon via token.

**Endpoint**: `GET /api/self-service/kasbon/{token}/employee-information/show`

**Path Parameters**:
- `token` (string, required) – Token unik pengajuan.

**Response** (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Application detail retrieved successfully."
    },
    "data": {
        "nip": "DSR044",
        "full_name": "shofyyy",
        "department_name": "IT",
        "position_name": "Beck End",
        "basic_salary": 1500000,
        "tangal_pengajuan": "2026-03-09",
        "limit_loan": "1875000.00",
        "token": "XkMXQUxsccM95FTyjuDno4vFiByBZKfwNeND8tlQ3ZkKu0jFULvJsi44piyOkWzS"
    }
}
```

---

### 6. Get Info Self-Service Pengunduran Diri
Mengambil detail informasi karyawan untuk pengajuan Pengunduran Diri via token.

**Endpoint**: `GET /api/self-service/pengunduran-diri/{token}/employee-information/show`

**Path Parameters**:
- `token` (string, required) – Token unik pengajuan.

**Response** (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Application detail retrieved successfully."
    },
    "data": {
        "nip": "DSR047",
        "full_name": "Awan",
        "company_name": "Dasarata",
        "directorate_name": "Finance&Accounting",
        "department_name": "FAT",
        "division_name": "FAT",
        "position_name": "Beck End",
        "tangal_pengajuan": "2026-03-09",
        "status_kasbon": false,
        "token": "kL23aWhxFRMUulGpjkG7hM3iqb477P81tTiNKiZzVNWt5CJaZrnLpk9PiNjlm8u1"
    }
}
```

---

### 7. Update Detail Kasbon (Self-Service)
Memperbarui data detail pinjaman oleh karyawan.

**Endpoint**: `POST /api/self-service/kasbon/{token}/employee-information/update-personal-data`

**Path Parameters**:
- `token` (string, required) – Token unik pengajuan.

**Request Body** (form-data):
- `_method` (text) – Gunakan `PATCH`.
- `loan_type_id` (text, required) – ID tipe pinjaman.
- `nominal_loan` (number, required) – Nominal pinjaman.
- `loan_period` (number, required) – Tenor pinjaman (bulan).
- `loan_description` (text) – Deskripsi atau alasan pinjaman.
- `supervisor_approval_file` (file) – Dokumen persetujuan atasan.
- `supporting_documents` (file) – Dokumen pendukung lainnya.

**Response** (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Application updated successfully."
    },
    "data": {
        "application": { ... },
        "loan": {
            "id": "019d3d32-a2e0-7226-ad21-e50d7bcf67d2",
            "nominal_loan": "50",
            "loan_period": "9",
            "supervisor_approval_file": "path/to/file.pdf",
            "supporting_documents": "path/to/file.pdf"
        }
    }
}
```

---

### 8. Update Detail Pengunduran Diri (Self-Service)
Memperbarui data detail pengunduran diri oleh karyawan.

**Endpoint**: `POST /api/self-service/pengunduran-diri/{token}/employee-information/update-personal-data`

**Path Parameters**:
- `token` (string, required) – Token unik pengajuan.

**Request Body** (form-data):
- `_method` (text) – Gunakan `PATCH`.
- `resignation_reason` (text, required) – Alasan pengunduran diri.
- `letter_of_commitment` (file) – Surat komitmen.
- `document_lampiran` (file) – Dokumen lampiran tambahan.

**Response** (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Application updated successfully."
    },
    "data": {
        "application": { ... },
        "resignation": {
            "id": "019d2d72-3f9b-7021-974e-75f388876bd0",
            "resignation_reason": "pokok gweh keluar",
            "document_lampiran": "path/to/file.pdf",
            "letter_of_commitment": "path/to/file.pdf"
        }
    }
}
```

---

## Contoh Request cURL

### Simpan Pengajuan
```bash
curl -X POST \
  "http://localhost:3000/api/type-of-application/DSR047/store" \
  -H "Authorization: Bearer <token>" \
  -F "submission=Pengunduran Diri" \
  -F "tanggal_pengajuan=2026-03-09"
```

### Update Detail Kasbon
```bash
curl -X POST \
  "http://localhost:3000/api/self-service/kasbon/<token>/employee-information/update-personal-data" \
  -H "Authorization: Bearer <token>" \
  -F "_method=PATCH" \
  -F "loan_type_id=fd854227-c6e1-4359-8c42-e9e6a042fec0" \
  -F "nominal_loan=3000000" \
  -F "loan_period=6"
```

---

## Catatan Implementasi

- **Method Spoofing**: Untuk endpoint update (PATCH) yang menggunakan `multipart/form-data`, gunakan method `POST` dengan field `_method=PATCH`.
- **Token**: Token dihasilkan saat pengajuan awal disimpan (`store`) dan digunakan untuk akses halaman self-service tanpa harus login ulang (jika diatur demikian oleh sistem).
- **File Handling**: Semua file yang diunggah akan dikembalikan dalam bentuk path relatif yang perlu dikonversi menjadi URL publik.
