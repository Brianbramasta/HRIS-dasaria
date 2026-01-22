# Kontrak API – Tunjangan Lama Kerja (Fixed Allowance)

Dokumen ini merinci kontrak API untuk fitur `Tunjangan Lama Kerja` pada modul Payroll Configuration.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>`
- Method: Menggunakan `POST` dengan field `_method: PATCH` untuk update
- Content-Type: `multipart/form-data`

---

## Halaman: Tunjangan Lama Kerja

### Daftar Tunjangan Lama Kerja

Endpoint: `GET /api/payroll/payroll-configuration/length-of-service-allowance/index`

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
                "years_of_service": "1 Tahun",
                "nominal_value": 3524238
            }
        ]
    }
}
```

---

## Operasi CRUD

### Detail Tunjangan Lama Kerja

Endpoint: `GET /api/payroll/payroll-configuration/length-of-service-allowance/{id}/show`

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

### Update Tunjangan Lama Kerja

Endpoint: `POST /api/payroll/payroll-configuration/length-of-service-allowance/{id}/update`

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
