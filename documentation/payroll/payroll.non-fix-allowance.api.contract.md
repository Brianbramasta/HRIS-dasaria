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
        "message": "Berhasil mendapatkan data tunjangan tidak tetap"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": "019be2d6-5f13-729d-b0e8-3441d3a0b52d",
                "allowance_name": "tes",
                "category_sub": "umum",
                "description": "jadi ada"
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
        "status": 200,
        "message": "Berhasil membuat data tunjangan tidak tetap"
    },
    "data": {
        "allowance_name": "tes",
        "category_sub": "umum",
        "description": "gak ada",
        "id": "019be536-1eeb-72fd-9524-ca1ed8920a0d",
        "updated_at": "2026-01-22T10:18:07.000000Z",
        "created_at": "2026-01-22T10:18:07.000000Z"
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
        "message": "Berhasil mendapatkan data tunjangan tidak tetap berdasarkan ID"
    },
    "data": {
        "id": "019be2d6-5f13-729d-b0e8-3441d3a0b52d",
        "allowance_name": "tes",
        "category_sub": "umum",
        "description": "jadi ada",
        "deleted_at": null,
        "created_at": "2026-01-21T23:14:18.000000Z",
        "updated_at": "2026-01-21T23:19:55.000000Z"
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
        "message": "Berhasil memperbarui data tunjangan tidak tetap"
    },
    "data": null
}
```
