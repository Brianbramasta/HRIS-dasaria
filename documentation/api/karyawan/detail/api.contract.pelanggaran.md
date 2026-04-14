# Kontrak API – Pelanggaran Karyawan (Detail)

Dokumen ini merinci kontrak API untuk fitur `Pelanggaran` pada halaman Detail Karyawan. Diselaraskan dengan Postman collection yang tersedia.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>` untuk semua endpoint yang memodifikasi data
- Method: Menggunakan `POST` dengan field `_method: PATCH/DELETE` (method spoofing)
- Content-Type: `multipart/form-data` untuk form data dan unggah file
- Response error: `{ errorCode: string, message: string, details?: any }`

---

## Halaman: Pelanggaran

### Daftar Pelanggaran Karyawan

Endpoint: `GET /api/employee-master-data/employees/{employeeId}/violations`

Path Parameters:
- `employeeId` (string, required) – ID/Code karyawan (contoh: `DSR022`)

Query Parameters (opsional):
- `search` (string) – kata kunci pencarian
- `sort` (string) – `asc` | `desc`
- `column` (string) – nama kolom untuk sorting (contoh: `created_at`)
- `per_page` (number) – jumlah item per halaman
- `page` (number) – nomor halaman
- `filter[]` (string, multiple) – filter multi nilai (contoh: tipe tindakan disipliner, direktorat, dsb.)

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "berhasil mendapatkan data pelanggaran karyawan"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id_pelanggaran": "019b8714-eb9e-732f-9b63-843c26301cc2",
                "jenis_pelanggaran": "Penyalahgunaan wewenang",
                "tanggal_pelanggaran": "2024-04-25",
                "deskripsi_pelanggaran": "Menggunakan kendaraan dinas untuk kepentingan pribadi",
                "jenis_tindakan": "SP1",
                "tanggal_mulai_hukuman": "2024-04-26",
                "tanggal_selesai_hukuman": "2024-10-26",
                "file": null
            }
        ],
        "per_page": 10,
        "to": 1,
        "total": 1
    }
}
```

Status: `200 OK`

---

## Operasi CRUD – Pelanggaran

### Menyimpan Pelanggaran

Endpoint: `POST /api/employee-master-data/employees/{employeeId}/violations`

Path Parameters:
- `employeeId` (string, required) – ID/Code karyawan

Request Body (form-data):
- `violation` (text, required) – nama/jenis pelanggaran
- `violation_date` (text, required) – tanggal pelanggaran (ISO: `YYYY-MM-DD`)
- `disciplinary_id` (text, required) – ID tindakan disipliner (UUID)
- `start_date` (text, optional) – tanggal mulai masa sanksi
- `end_date` (text, optional) – tanggal selesai masa sanksi
- `description` (text, optional) – keterangan pelanggaran
- `file` (file, optional) – bukti/dokumen pelanggaran

Response (201 Created):
```json
{
    "meta": {
        "status": 200,
        "message": "berhasil menambahkan pelanggaran karyawan"
    },
    "data": {
        "violation": "Penyalahgunaan wewenang",
        "violation_date": "2024-04-25",
        "disciplinary_id": "43d1d635-d77b-456b-ae24-f1cbc7ce2c5c",
        "start_date": "2024-04-26",
        "end_date": "2024-10-26",
        "description": "Menggunakan kendaraan dinas untuk kepentingan pribadi",
        "employee_id": "3af014cb-0074-427f-abc2-59a5d3c7573a",
        "id": "019b8714-eb9e-732f-9b63-843c26301cc2",
        "updated_at": "2026-01-04T03:37:33.000000Z",
        "created_at": "2026-01-04T03:37:33.000000Z"
    }
}
```

Status: `201 Created`

---

### Detail Pelanggaran

Endpoint: `GET /api/employee-master-data/employees/{violationId}/violations/show`

Path Parameters:
- `violationId` (string, required) – ID pelanggaran (UUID)

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "berhasil mendapatkan data pelanggaran karyawan"
    },
    "data": {
        "nama_karyawan": "Employee Dummy 2",
        "id_pelanggaran": "019b8714-eb9e-732f-9b63-843c26301cc2",
        "jenis_pelanggaran": "Penyalahgunaan wewenang",
        "tanggal_pelanggaran": "2024-04-25",
        "jenis_tindakan_id": "43d1d635-d77b-456b-ae24-f1cbc7ce2c5c",
        "jenis_tindakan": "SP1",
        "tanggal_mulai_hukuman": "2024-04-26",
        "tanggal_selesai_hukuman": "2024-10-26",
        "deskripsi_pelanggaran": "Menggunakan kendaraan dinas untuk kepentingan pribadi",
        "file": null
    }
}
```

Status: `200 OK`

---

### Update Pelanggaran

Endpoint: `POST /api/employee-master-data/employees/{violationId}/violations/update`

Method Spoofing: gunakan `_method: PATCH` pada form data

Path Parameters:
- `violationId` (string, required) – ID pelanggaran (UUID)

Request Body (form-data):
- `_method` (text, required) – nilai: `PATCH`
- `violation` (text, optional)
- `violation_date` (text, optional)
- `disciplinary_id` (text, optional)
- `start_date` (text, optional)
- `end_date` (text, optional)
- `description` (text, optional)
- `file` (file, optional)

Response (200 OK):
```json
{
  "data": {
    "id": "string (UUID)",
    "employee_id": "string",
    "violation": "string",
    "violation_date": "string (ISO date)",
    "disciplinary_id": "string (UUID)",
    "start_date": "string (ISO date) | null",
    "end_date": "string (ISO date) | null",
    "description": "string | null",
    "file": "string (URL/path) | null",
    "updated_at": "string (ISO datetime)"
  }
}
```

Status: `200 OK`

---

### Delete Pelanggaran

Endpoint: `POST /api/employee-master-data/employees/{violationId}/violations/delete`

Method Spoofing: gunakan `_method: DELETE` pada form data

Path Parameters:
- `violationId` (string, required) – ID pelanggaran (UUID)

Request Body (form-data):
- `_method` (text, required) – nilai: `DELETE`

Response (200 OK):
```json
{
  "message": "deleted",
  "data": {
    "id": "string (UUID)"
  }
}
```

Status: `200 OK`

---

### Dropdown Tindakan Disipliner

Endpoint: `GET /api/employee-master-data/employees/dropdown-disciplinary-actions`

Query Parameters:
- `search` (string, optional) – kata kunci pencarian (contoh: `SP1`)

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "berhasil mendapatkan data tindakan disiplin"
    },
    "data": [
        {
            "id": "43d1d635-d77b-456b-ae24-f1cbc7ce2c5c",
            "name_disciplinary": "SP1"
        }
    ]
}
```

Status: `200 OK`

---

## Contoh Request cURL

### Daftar Pelanggaran
```bash
curl -X GET \
  "http://localhost:3000/api/employee-master-data/employees/DSR022/violations" \
  -H "Authorization: Bearer <token>"
```

### Menyimpan Pelanggaran
```bash
curl -X POST \
  "http://localhost:3000/api/employee-master-data/employees/DSR022/violations" \
  -H "Authorization: Bearer <token>" \
  -F "violation=Penyalahgunaan wewenang" \
  -F "violation_date=2024-04-25" \
  -F "disciplinary_id=0ae0e194-c03d-4c8c-9d58-1bb61d92effa" \
  -F "start_date=2024-04-26" \
  -F "end_date=2024-10-26" \
  -F "description=Menggunakan kendaraan dinas untuk kepentingan pribadi" \
  -F "file=@/path/to/tes1.pdf"
```

### Detail Pelanggaran
```bash
curl -X GET \
  "http://localhost:3000/api/employee-master-data/employees/019b7f0a-8668-71c2-aa7b-726c2a19e8a2/violations/show" \
  -H "Authorization: Bearer <token>"
```

### Update Pelanggaran
```bash
curl -X POST \
  "http://localhost:3000/api/employee-master-data/employees/019b7f0a-8668-71c2-aa7b-726c2a19e8a2/violations/update" \
  -H "Authorization: Bearer <token>" \
  -F "_method=PATCH" \
  -F "violation=pencurian 2" \
  -F "violation_date=2026-01-30" \
  -F "disciplinary_id=0ae0e194-c03d-4c8c-9d58-1bb61d92effa" \
  -F "start_date=2026-02-01" \
  -F "end_date=2026-03-30" \
  -F "description=Menggunakan kendaraan dinas untuk kepentingan pribadi"
```

### Delete Pelanggaran
```bash
curl -X POST \
  "http://localhost:3000/api/employee-master-data/employees/019b7ec2-cca2-71a8-a4e4-48f038242cc5/violations/delete" \
  -H "Authorization: Bearer <token>" \
  -F "_method=DELETE"
```

### Dropdown Tindakan Disipliner
```bash
curl -X GET \
  "http://localhost:3000/api/employee-master-data/employees/dropdown-disciplinary-actions?search=SP1" \
  -H "Authorization: Bearer <token)"
```

---

## Catatan Implementasi

- Method Spoofing: backend menggunakan `_method` untuk override method HTTP (`PATCH`, `DELETE`)
- File Upload: kirim `file` sebagai `multipart/form-data`
- Date Format: gunakan format ISO `YYYY-MM-DD` untuk semua field tanggal
- Multiple Filter: gunakan `filter[]` berulang untuk menerapkan banyak filter
- Path ID: operasi `show`, `update`, dan `delete` menggunakan `violationId` (UUID) pada path
