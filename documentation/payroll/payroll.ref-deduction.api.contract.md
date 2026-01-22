# Kontrak API – Acuan Potong (Ref Deduction)

Dokumen ini merinci kontrak API untuk fitur `Acuan Potong` (Reference Deduction) pada modul Payroll Configuration.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>`
- Method: Menggunakan `POST` dengan field `_method: PATCH` untuk update
- Content-Type: `multipart/form-data`

---

## Halaman: Acuan Potong

### Daftar Acuan Potong

Endpoint: `GET /api/payroll/payroll-configuration/ref-deduction/index`

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
                "deduction_name": "string",
                "nominal_value": 0
            }
        ]
    }
}
```

---

## Operasi CRUD

### Detail Acuan Potong

Endpoint: `GET /api/payroll/payroll-configuration/ref-deduction/{id}/show`

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
        "nominal_value": 3524238,
        "description": "string"
    }
}
```

### Update Acuan Potong

Endpoint: `POST /api/payroll/payroll-configuration/ref-deduction/{id}/update`

Method Spoofing: `_method: PATCH`

Request Body (form-data):
- `_method`: `PATCH`
- `nominal_value`: number
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
