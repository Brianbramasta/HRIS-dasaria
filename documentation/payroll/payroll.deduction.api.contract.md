# Kontrak API – Potongan (Deduction)

Dokumen ini merinci kontrak API untuk fitur `Potongan` (Deduction) pada modul Payroll Configuration.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>`
- Method: Menggunakan `POST` dengan field `_method: PATCH` untuk update, `DELETE` untuk delete
- Content-Type: `multipart/form-data`

---

## Halaman: Potongan

### Daftar Potongan

Endpoint: `GET /api/payroll/payroll-configuration/deduction/mt-deduction/index`

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Berhasil mendapatkan data potongan MT"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": "019be30b-9ebf-7235-9420-a2622f0fefe7",
                "deduction_name": "tes",
                "category": "notfixed",
                "description": "tes"
            }
        ],
        "per_page": 10,
        "to": 1,
        "total": 1
    }
}
```

---

## Operasi CRUD

### Create Potongan

Endpoint: `POST /api/payroll/payroll-configuration/deduction/mt-deduction/create`

Request Body (form-data):
- `deduction_name`: string
- `category`: string (e.g., "notfixed")
- `description`: string

Response (201 Created):
```json
{
    "meta": {
        "status": 200,
        "message": "Berhasil membuat data potongan MT"
    },
    "data": {
        "deduction_name": "tes",
        "category": "notfixed",
        "description": null,
        "id": "019be54d-7d04-72cb-ac68-b7dd95c4adc3",
        "updated_at": "2026-01-22T10:43:39.000000Z",
        "created_at": "2026-01-22T10:43:39.000000Z"
    }
}
```

### Detail Potongan

Endpoint: `GET /api/payroll/payroll-configuration/deduction/mt-deduction/{id}/show`

Path Parameters:
- `id` (string, required) – ID

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Berhasil mendapatkan data potongan MT berdasarkan ID"
    },
    "data": {
        "id": "019be30b-9ebf-7235-9420-a2622f0fefe7",
        "deduction_name": "tes",
        "category": "notfixed",
        "description": "tes",
        "is_active": 1,
        "deleted_at": null,
        "created_at": "2026-01-22T00:12:28.000000Z",
        "updated_at": "2026-01-22T00:17:26.000000Z"
    }
}
```

### Update Potongan

Endpoint: `POST /api/payroll/payroll-configuration/deduction/mt-deduction/{id}/update`

Method Spoofing: `_method: PATCH`

Request Body (form-data):
- `_method`: `PATCH`
- `deduction_name`: string
- `category`: string
- `description`: string

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Berhasil memperbarui data potongan MT"
    },
    "data": {
        "id": "019be30b-9ebf-7235-9420-a2622f0fefe7",
        "deduction_name": "tes",
        "category": "notfixed",
        "description": "tes",
        "is_active": 1,
        "deleted_at": null,
        "created_at": "2026-01-22T00:12:28.000000Z",
        "updated_at": "2026-01-22T00:17:26.000000Z"
    }
}
```

### Delete Potongan

Endpoint: `POST /api/payroll/payroll-configuration/deduction/mt-deduction/{id}/delete`

Method Spoofing: `_method: DELETE`

Request Body (form-data):
- `_method`: `DELETE`

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Berhasil menghapus data potongan MT"
    },
    "data": null
}
```
