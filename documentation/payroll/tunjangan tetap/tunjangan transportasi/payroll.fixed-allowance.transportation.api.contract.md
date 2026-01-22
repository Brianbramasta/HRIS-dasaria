# Kontrak API – Tunjangan Transportasi (Fixed Allowance)

Dokumen ini merinci kontrak API untuk fitur `Tunjangan Transportasi` pada modul Payroll Configuration.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>`
- Method: Menggunakan `POST` dengan field `_method: PATCH` untuk update
- Content-Type: `multipart/form-data`

---

## Halaman: Tunjangan Transportasi

### Daftar Tunjangan Transportasi

Endpoint: `GET /api/payroll/payroll-configuration/transportation-allowance/index`

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
                "location": "Jakarta",
                "nominal_value": 1000000
            }
        ]
    }
}
```

---

## Operasi CRUD

### Detail Tunjangan Transportasi

Endpoint: `GET /api/payroll/payroll-configuration/transportation-allowance/{id}/show`

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
        "nominal_value": 1000000
    }
}
```

### Update Tunjangan Transportasi

Endpoint: `POST /api/payroll/payroll-configuration/transportation-allowance/{id}/update`

Method Spoofing: `_method: PATCH`

Request Body (form-data):
- `_method`: `PATCH`
- `nominal_value`: number

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Update Success"
    },
    "data": {
        "id": "uuid",
        "nominal_value": 1000000
    }
}
```
