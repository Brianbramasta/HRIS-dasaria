# Kontrak API – BPJS Items

Dokumen ini merinci kontrak API untuk fitur `BPJS Items` pada modul Payroll Configuration.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>`
- Method: Menggunakan `POST` dengan field `_method: PATCH` untuk update
- Content-Type: `multipart/form-data`

---

## Halaman: BPJS Items

### Daftar BPJS

Endpoint: `GET /api/payroll/payroll-configuration/bpjs-items/index`

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
                "bpjs_name": "BPJS Kesehatan",
                "company_percentage": 4,
                "employee_percentage": 1
            }
        ]
    }
}
```

### List BPJS (Dropdown/Selection)

Endpoint: `GET /api/payroll/payroll-configuration/bpjs-items/list-bpjs`

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Success"
    },
    "data": [
        {
            "id": "uuid",
            "name": "BPJS Kesehatan"
        }
    ]
}
```

---

## Operasi CRUD

### Detail BPJS

Endpoint: `GET /api/payroll/payroll-configuration/bpjs-items/{id}/show`

Path Parameters:
- `id` (string, required) – ID BPJS

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Success"
    },
    "data": {
        "id": "uuid",
        "bpjs_name": "BPJS Kesehatan",
        "company_percentage": 4,
        "employee_percentage": 1
    }
}
```

### Update BPJS

Endpoint: `POST /api/payroll/payroll-configuration/bpjs-items/{id}/update`

Method Spoofing: `_method: PATCH`

Request Body (form-data):
- `_method`: `PATCH`
- `company_percentage`: number
- `employee_percentage`: number (optional, inferred)

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
