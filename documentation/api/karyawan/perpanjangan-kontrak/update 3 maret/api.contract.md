# Kontrak API – Perpanjangan Kontrak Karyawan

Dokumen ini merinci kontrak API untuk fitur `Perpanjangan Kontrak Karyawan` pada modul Karyawan. Diselaraskan dengan Postman collection yang tersedia.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>` untuk semua endpoint yang memodifikasi data
- Method: Menggunakan `POST` dengan field `_method: PATCH` (method spoofing)
- Content-Type: `application/x-www-form-urlencoded` atau `multipart/form-data`
- Response error: `{ errorCode: string, message: string, details?: any }`

---

## Halaman: Perpanjangan Kontrak Karyawan

### Daftar Perpanjangan Kontrak

Endpoint: `GET /api/employee-master-data/contract-extensions/index`

Query Parameters (opsional):
- `column` (string) – kolom untuk sorting (default: remaining_month)
- `direction` (string) – arah sorting: asc/desc (default: desc)
- `search` (string)
- `filter[]` (string, multiple)
- `page` (integer)
- `per_page` (integer)

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Berhasil mendapatkan data perpanjangan kontrak"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": "DSR039",
                "employee_name": "John Doe",
                "remaining_month": 3,
                "contract_end_date": "2026-06-30",
                "status": "pending"
            }
        ],
        "first_page_url": "http://localhost:3000/api/employee-master-data/contract-extensions/index?page=1",
        "from": 1,
        "last_page": 1,
        "last_page_url": "http://localhost:3000/api/employee-master-data/contract-extensions/index?page=1",
        "links": [
            {
                "url": null,
                "label": "&laquo; Previous",
                "page": null,
                "active": false
            },
            {
                "url": "http://localhost:3000/api/employee-master-data/contract-extensions/index?page=1",
                "label": "1",
                "page": 1,
                "active": true
            },
            {
                "url": null,
                "label": "Next &raquo;",
                "page": null,
                "active": false
            }
        ],
        "next_page_url": null,
        "path": "http://localhost:3000/api/employee-master-data/contract-extensions/index",
        "per_page": 10,
        "prev_page_url": null,
        "to": 1,
        "total": 1
    }
}
```

Status: `200 OK`

---

### Karyawan Akan Habis Kontrak

Endpoint: `GET /api/employee-master-data/contract-extensions/employees-near-contract-end`

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Berhasil mendapatkan data karyawan yang akan habis kontrak"
    },
    "data": [
        {
            "id": "DSR038",
            "employee_name": "Jane Smith",
            "remaining_month": 1,
            "contract_end_date": "2026-04-30",
            "department": "IT"
        }
    ]
}
```

Status: `200 OK`

---

### Dropdown Status Perpanjangan

Endpoint: `GET /api/employee-master-data/contract-extensions/dropdown-extension-status`

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Berhasil mendapatkan data status perpanjangan"
    },
    "data": [
        {
            "id": "pending",
            "name": "Pending"
        },
        {
            "id": "approved",
            "name": "Disetujui"
        },
        {
            "id": "rejected",
            "name": "Ditolak"
        }
    ]
}
```

Status: `200 OK`

---

## Operasi CRUD – Perpanjangan Kontrak Karyawan

### Detail Perpanjangan Kontrak

Endpoint: `GET /api/employee-master-data/contract-extensions/{id}/detail`

Path Parameters:
- `id` (string, required) – ID perpanjangan kontrak

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Berhasil mendapatkan detail perpanjangan kontrak"
    },
    "data": {
        "id": "DSR038",
        "employee_name": "Jane Smith",
        "current_contract": {
            "start_date": "2025-01-01",
            "end_date": "2026-04-30",
            "contract_type": "PKWT"
        },
        "extension_history": [
            {
                "sequence": 1,
                "start_date": "2024-01-01",
                "end_date": "2024-12-31",
                "note": "Perpanjangan pertama"
            }
        ]
    }
}
```

Status: `200 OK`

---

### Update Perpanjangan Kontrak

Endpoint: `POST /api/employee-master-data/contract-extensions/{id}/update-contract`

Method Spoofing: gunakan `_method: PATCH` pada form data

Path Parameters:
- `id` (string, required) – ID perpanjangan kontrak

Request Body (form-data):
- `_method` (text, required) – nilai: `PATCH`
- `note` (text, optional) – catatan perpanjangan
- `eval_document` (file, optional) – dokumen evaluasi (PDF)
- `contract_type_id` (text, required) – ID tipe kontrak (UUID)
- `contract_sequence` (text, required) – urutan kontrak (angka)
- `start_date` (text, required) – tanggal mulai kontrak (YYYY-MM-DD)
- `end_date` (text, required) – tanggal selesai kontrak (YYYY-MM-DD)
- `contract_document` (file, optional) – dokumen kontrak (PDF)
- `company_id` (text, required) – ID perusahaan (UUID)
- `office_id` (text, required) – ID kantor (UUID)
- `directorate_id` (text, required) – ID direktorat (UUID)
- `department_id` (text, required) – ID departemen (UUID)
- `division_id` (text, required) – ID divisi (UUID)
- `position_id` (text, required) – ID posisi (UUID)
- `job_title_id` (text, required) – ID jabatan (UUID)
- `structural_job_id` (text, required) – ID jabatan struktural (UUID)
- `unit_id` (text, required) – ID unit (UUID)
- `position_level_id` (text, required) – ID level posisi (UUID)
- `change_type` (text, required) – tipe perubahan (Mutasi/Promosi/Demosi)
- `employee_category_id` (text, required) – ID kategori karyawan (UUID)
- `extension_type` (text, required) – tipe perpanjangan (tetap/berubah)
- `non_fix_allowance[0][non_fix_allowance_id]` (text, optional) – ID tunjangan tidak tetap
- `non_fix_allowance[0][amount]` (text, optional) – jumlah tunjangan tidak tetap

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Perpanjangan kontrak berhasil diperbarui"
    },
    "data": {
        "id": "DSR038",
        "contract_sequence": 2,
        "start_date": "2026-05-05",
        "end_date": "2026-09-06",
        "extension_type": "berubah",
        "status": "pending",
        "updated_at": "2026-03-15T10:30:00.000000Z"
    }
}
```

Status: `200 OK`

---

### Proses Perpanjangan Kontrak

Endpoint: `PATCH /api/employee-master-data/contract-extensions/{id}/process`

Path Parameters:
- `id` (string, required) – ID perpanjangan kontrak

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Perpanjangan kontrak berhasil diproses"
    },
    "data": {
        "id": "DSR038",
        "status": "approved",
        "processed_at": "2026-03-15T11:00:00.000000Z"
    }
}
```

Status: `200 OK`

---

## Contoh Request cURL

### Daftar Perpanjangan Kontrak
```bash
curl -X GET \
  "http://localhost:3000/api/employee-master-data/contract-extensions/index?column=remaining_month&direction=desc&page=1&per_page=10" \
  -H "Authorization: Bearer <token>"
```

### Karyawan Akan Habis Kontrak
```bash
curl -X GET \
  "http://localhost:3000/api/employee-master-data/contract-extensions/employees-near-contract-end" \
  -H "Authorization: Bearer <token>"
```

### Detail Perpanjangan Kontrak
```bash
curl -X GET \
  "http://localhost:3000/api/employee-master-data/contract-extensions/DSR038/detail" \
  -H "Authorization: Bearer <token>"
```

### Update Perpanjangan Kontrak
```bash
curl -X POST \
  "http://localhost:3000/api/employee-master-data/contract-extensions/DSR039/update-contract" \
  -H "Authorization: Bearer <token>" \
  -F "_method=PATCH" \
  -F "note=kita tes update ke berubah" \
  -F "contract_type_id=86b58efc-b8df-43f6-a634-917f08c02efc" \
  -F "contract_sequence=2" \
  -F "start_date=2026-05-05" \
  -F "end_date=2026-09-06" \
  -F "company_id=019ccbaa-1585-73ef-9f99-8c65b9afe813" \
  -F "office_id=019cd277-da8a-72b6-b72d-95ded814dd90" \
  -F "directorate_id=019ccbab-a5c6-73ca-bbb6-08a21add31fd" \
  -F "department_id=019cd0e0-8f46-71a7-b808-6a96f5edfb0d" \
  -F "division_id=019ccbac-0840-701d-ae51-62cdae7dfb67" \
  -F "position_id=019cd600-4ee4-71f8-8e51-35364cac55be" \
  -F "job_title_id=019ccbb4-a30e-72f1-8934-1b517ae6980c" \
  -F "structural_job_id=019bd95d-2d17-7032-b512-50ae7e413f2d" \
  -F "unit_id=019cd5de-b4c3-729f-b893-8c1860f070aa" \
  -F "position_level_id=1c2fb0d4-3134-443c-a190-34b67f6342b6" \
  -F "change_type=Mutasi" \
  -F "employee_category_id=21edeb66-898c-484a-bff6-3d3e778f64fb" \
  -F "extension_type=berubah" \
  -F "non_fix_allowance[0][non_fix_allowance_id]=019cd68d-6a76-70f7-84e0-379e76da65d1" \
  -F "non_fix_allowance[0][amount]=1000000"
```

### Proses Perpanjangan Kontrak
```bash
curl -X PATCH \
  "http://localhost:3000/api/employee-master-data/contract-extensions/DSR038/process" \
  -H "Authorization: Bearer <token>"
```

---

## Catatan Implementasi

- Method Spoofing: backend menggunakan `_method` untuk override method HTTP (`PATCH`)
- File Upload: gunakan `multipart/form-data` untuk upload dokumen (eval_document, contract_document)
- Extension Type: nilai `tetap` untuk perpanjangan tanpa perubahan, `berubah` untuk perpanjangan dengan perubahan
- Non-fix Allowance: dapat mengirim multiple tunjangan tidak tetap dengan format array
- Paginasi: gunakan parameter `page` dan `per_page` untuk navigasi data
- Sort: gunakan parameter `column` dan `direction` untuk sorting data

---

## Error Responses

### 400 Bad Request
```json
{
    "meta": {
        "status": 400,
        "message": "Validasi gagal"
    },
    "errors": {
        "start_date": ["Tanggal mulai harus diisi"],
        "end_date": ["Tanggal selesai harus setelah tanggal mulai"]
    }
}
```

### 404 Not Found
```json
{
    "meta": {
        "status": 404,
        "message": "Data perpanjangan kontrak tidak ditemukan"
    }
}
```

### 401 Unauthorized
```json
{
    "meta": {
        "status": 401,
        "message": "Tidak diotorisasi"
    }
}
```

### 422 Unprocessable Entity
```json
{
    "meta": {
        "status": 422,
        "message": "Data tidak valid"
    },
    "errors": {
        "contract_type_id": ["Tipe kontrak harus diisi"],
        "company_id": ["Perusahaan harus diisi"]
    }
}
```