# Kontrak API – Tunjangan Tetap (Fee)

Dokumen ini merinci kontrak API untuk fitur `Tunjangan Tetap (Fee)` pada modul Payroll. Diselaraskan dengan Postman collection yang tersedia.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>` untuk semua endpoint yang memodifikasi data
- Method: Menggunakan `POST` dengan field `_method: PATCH` (method spoofing)
- Content-Type: `application/x-www-form-urlencoded` atau `multipart/form-data`
- Response error: `{ errorCode: string, message: string, details?: any }`

---

## Halaman: Tunjangan Tetap (Fee)

### Daftar Tunjangan Tetap (Fee)

Endpoint: `GET /api/payroll/payroll-configuration/fee/index`

Query Parameters (opsional):
- `search` (string)
- `filter[]` (string, multiple)
- `page` (integer)
- `per_page` (integer)

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Berhasil mendapatkan data tunjangan fee"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": "51efa816-000b-4289-b0b0-260058aa9cd7",
                "name": "FEE AE",
                "amount": 500
            }
        ],
        "first_page_url": "http://cf71-103-184-18-88.ngrok-free.app/api/payroll/payroll-configuration/fee/index?page=1",
        "from": 1,
        "last_page": 1,
        "last_page_url": "http://cf71-103-184-18-88.ngrok-free.app/api/payroll/payroll-configuration/fee/index?page=1",
        "links": [
            {
                "url": null,
                "label": "&laquo; Previous",
                "page": null,
                "active": false
            },
            {
                "url": "http://cf71-103-184-18-88.ngrok-free.app/api/payroll/payroll-configuration/fee/index?page=1",
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
        "path": "http://cf71-103-184-18-88.ngrok-free.app/api/payroll/payroll-configuration/fee/index",
        "per_page": 10,
        "prev_page_url": null,
        "to": 1,
        "total": 1
    }
}
```

Status: `200 OK`

---

## Operasi CRUD – Tunjangan Tetap (Fee)

### Detail Tunjangan Tetap (Fee)

Endpoint: `GET /api/payroll/payroll-configuration/fee/{id}/show`

Path Parameters:
- `id` (string, required) – ID tunjangan tetap (UUID)

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Berhasil mendapatkan data tunjangan fee berdasarkan ID"
    },
    "data": {
        "id": "51efa816-000b-4289-b0b0-260058aa9cd7",
        "name": "FEE AE",
        "amount": 500,
        "created_at": "2026-02-11T03:32:21.000000Z",
        "updated_at": "2026-02-11T04:39:25.000000Z"
    }
}
```

Status: `200 OK`

---

### Update Tunjangan Tetap (Fee)

Endpoint: `POST /api/payroll/payroll-configuration/fee/{id}/update`

Method Spoofing: gunakan `_method: PATCH` pada form data

Path Parameters:
- `id` (string, required) – ID tunjangan tetap (UUID)

Request Body (form-data):
- `_method` (text, required) – nilai: `PATCH`
- `amount` (text, optional) – nilai nominal tunjangan tetap

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Tunjangan tetap berhasil diperbarui"
    },
    "data": {
        "id": "51efa816-000b-4289-b0b0-260058aa9cd7",
        "nominal_value": 5500000,
        "updated_at": "2026-01-15T09:10:00.000000Z"
    }
}
```

Status: `200 OK`

---
<!-- 
## Operasi Tambahan

### Detail Fee Karyawan

Endpoint: `GET /api/employee-master-data/employees/{employee_id}/fee`

Path Parameters:
- `employee_id` (string, required) – ID karyawan (UUID)

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Detail fee karyawan berhasil diambil"
    },
    "data": {
        "employee_id": "04912ece-c12f-45a9-8d00-b73b68465c29",
        "employee_name": "John Doe",
        "fee": [
            {
                "id": "51efa816-000b-4289-b0b0-260058aa9cd7",
                "fee_name": "Tunjangan Tetap Pokok",
                "nominal_value": 5000000
            }
        ]
    }
}
```

Status: `200 OK`

--- -->

## Contoh Request cURL

### Daftar Tunjangan Tetap (Fee)
```bash
curl -X GET \
  "http://localhost:3000/api/payroll/payroll-configuration/fee/index?page=1&per_page=10" \
  -H "Authorization: Bearer <token>"
```

### Detail Tunjangan Tetap (Fee)
```bash
curl -X GET \
  "http://localhost:3000/api/payroll/payroll-configuration/fee/51efa816-000b-4289-b0b0-260058aa9cd7/show" \
  -H "Authorization: Bearer <token>"
```

### Update Tunjangan Tetap (Fee)
```bash
curl -X POST \
  "http://localhost:3000/api/payroll/payroll-configuration/fee/51efa816-000b-4289-b0b0-260058aa9cd7/update" \
  -H "Authorization: Bearer <token>" \
  -d "_method=PATCH" \
  -d "amount=500"
```

### Detail Fee Karyawan
```bash
curl -X GET \
  "http://localhost:3000/api/employee-master-data/employees/04912ece-c12f-45a9-8d00-b73b68465c29/fee" \
  -H "Authorization: Bearer <token>"
```

---

## Catatan Implementasi

- Method Spoofing: backend menggunakan `_method` untuk override method HTTP (`PATCH`)
- Nominal Value: parameter `nominal_value` berisi jumlah nominal tunjangan tetap dalam rupiah
- Paginasi: gunakan parameter `page` dan `per_page` untuk navigasi data
- Filter: gunakan `filter[]` untuk menerapkan filter pada daftar

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
        "nominal_value": ["Nominal value harus berupa angka"]
    }
}
```

### 404 Not Found
```json
{
    "meta": {
        "status": 404,
        "message": "Tunjangan tetap tidak ditemukan"
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
