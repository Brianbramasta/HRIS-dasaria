# Kontrak API – Tunjangan Posisi dan BPJS (Fixed Allowance)

Dokumen ini merinci kontrak API untuk fitur `Tunjangan Posisi dan BPJS` pada modul Payroll Configuration.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>`
- Method: Menggunakan `POST` dengan field `_method: PATCH` untuk update
- Content-Type: `multipart/form-data`
- Response error: `{ errorCode: string, message: string, details?: any }`

---

## Halaman: Tunjangan Posisi dan BPJS

### Daftar Tunjangan Posisi

Endpoint: `GET /api/payroll/payroll-configuration/fixed-allowance/indexPositionAllowances`

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
                "job_level_name": "string",
                "percentage_value": 0,
                "nominal_value": 0
            }
        ],
        "total": 100
    }
}
```

---

## Operasi CRUD

### Detail Tunjangan Posisi

Endpoint: `GET /api/payroll/payroll-configuration/fixed-allowance/{id}/show`

Path Parameters:
- `id` (string, required) – ID allowance

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Success"
    },
    "data": {
        "id": "uuid",
        "job_level_id": "uuid",
        "percentage_value": 0,
        "nominal_value": 0,
        "position_allowance_bpjs": [
            {
                "bpjs_item_id": "uuid",
                "is_active": 1
            }
        ]
    }
}
```

### Update Tunjangan Posisi

Endpoint: `POST /api/payroll/payroll-configuration/fixed-allowance/{id}/update`

Method Spoofing: `_method: PATCH`

Request Body (form-data):
- `_method`: `PATCH`
- `job_level_id`: string (UUID)
- `percentage_value`: number (optional)
- `nominal_value`: number (optional)
- `position_allowance_bpjs[0][bpjs_item_id]`: string (UUID)
- `position_allowance_bpjs[0][is_active]`: 1 or 0
- ... (array items)

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

### Detail Lengkap (Detail View)

Endpoint: `GET /api/payroll/payroll-configuration/fixed-allowance/{id}/detail`

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Success"
    },
    "data": {
        "id": "uuid",
        "details": "..."
    }
}
```
