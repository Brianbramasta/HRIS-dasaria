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
        "message": "Success"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": "uuid",
                "deduction_name": "string",
                "category": "notfixed"
            }
        ]
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
        "status": 201,
        "message": "Created Success"
    },
    "data": {
        "id": "uuid"
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
        "message": "Success"
    },
    "data": {
        "id": "uuid",
        "deduction_name": "string",
        "category": "string",
        "description": "string"
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
        "message": "Update Success"
    },
    "data": {
        "id": "uuid"
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
        "message": "Delete Success"
    }
}
```
