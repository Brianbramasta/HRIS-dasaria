# Kontrak API – Tunjangan Menikah (Fixed Allowance)

Dokumen ini merinci kontrak API untuk fitur `Tunjangan Menikah` pada modul Payroll Configuration.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>`
- Method: Menggunakan `POST` dengan field `_method: PATCH` untuk update
- Content-Type: `multipart/form-data`

---

## Halaman: Tunjangan Menikah

### Daftar Tunjangan Menikah

Endpoint: `GET /api/payroll/payroll-configuration/martial-allowance/index`

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
                "status": "Menikah",
                "nominal_value": 3524238
            }
        ],
        "total": 10
    }
}
```

---

## Operasi CRUD

### Detail Tunjangan Menikah

Endpoint: `GET /api/payroll/payroll-configuration/martial-allowance/{id}/show`

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
        "nominal_value": 3524238
    }
}
```

### Update Tunjangan Menikah

Endpoint: `POST /api/payroll/payroll-configuration/martial-allowance/{id}/update`

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
        "nominal_value": 3524238
    }
}
```
