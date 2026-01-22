# Kontrak API – Tunjangan Tidak Tetap (Non-Fixed Allowance)

Dokumen ini merinci kontrak API untuk fitur `Tunjangan Tidak Tetap` pada modul Payroll Configuration.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>`
- Method: Menggunakan `POST` dengan field `_method: PATCH` untuk update
- Content-Type: `multipart/form-data`

---

## Halaman: Tunjangan Tidak Tetap

### Daftar Tunjangan

Endpoint: `GET /api/payroll/payroll-configuration/non-fix-allowance/index`

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Success"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": "uuid",
                "allowance_name": "string",
                "category_sub": "umum"
            }
        ]
    }
}
```

---

## Operasi CRUD

### Create Tunjangan

Endpoint: `POST /api/payroll/payroll-configuration/non-fix-allowance/create`

Request Body (form-data):
- `allowance_name`: string
- `category_sub`: string (e.g., "umum")
- `description`: string

Response (201 Created):
```json
{
    "meta": {
        "status": 201,
        "message": "Created Success"
    },
    "data": {
        "id": "uuid"
    }
}
```

### Detail Tunjangan

Endpoint: `GET /api/payroll/payroll-configuration/non-fix-allowance/{id}/show`

Path Parameters:
- `id` (string, required) – ID

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Success"
    },
    "data": {
        "id": "uuid",
        "allowance_name": "string",
        "category_sub": "string",
        "description": "string"
    }
}
```

### Update Tunjangan

Endpoint: `POST /api/payroll/payroll-configuration/non-fix-allowance/{id}/update`

Method Spoofing: `_method: PATCH`

Request Body (form-data):
- `_method`: `PATCH`
- `allowance_name`: string
- `category_sub`: string
- `description`: string

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Update Success"
    },
    "data": {
        "id": "uuid"
    }
}
```
