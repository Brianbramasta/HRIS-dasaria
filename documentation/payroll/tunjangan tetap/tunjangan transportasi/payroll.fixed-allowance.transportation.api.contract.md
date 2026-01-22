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
        "message": "Berhasil mendapatkan data tunjangan transportasi"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": "019be2a7-5e30-73d8-8356-8b936678c6ad",
                "name_transportation": "Transportasi-01",
                "category_id": "c62158fa-eb4a-4d9b-ba81-345bc8a74ade",
                "category_name": "Staff",
                "nominal_value": 1000000
            },
            {
                "id": "019be2a7-5e41-70f8-aefc-1e3757215b29",
                "name_transportation": "Transportasi-02",
                "category_id": "04912ece-c12f-45a9-8d00-b73b68465c29",
                "category_name": "Mitra",
                "nominal_value": 1000000
            }
        ],
        "first_page_url": "http://192.168.2.237:8000/api/payroll/payroll-configuration/transportation-allowance/index?page=1",
        "from": 1,
        "last_page": 1,
        "last_page_url": "http://192.168.2.237:8000/api/payroll/payroll-configuration/transportation-allowance/index?page=1",
        "links": [
            {
                "url": null,
                "label": "&laquo; Previous",
                "page": null,
                "active": false
            },
            {
                "url": "http://192.168.2.237:8000/api/payroll/payroll-configuration/transportation-allowance/index?page=1",
                "label": "1",
                "page": 1,
                "active": true
            },
            {
                "url": null,
                "label": "Next &raquo;",
                "page": null,
                "active": false
            }
        ],
        "next_page_url": null,
        "path": "http://192.168.2.237:8000/api/payroll/payroll-configuration/transportation-allowance/index",
        "per_page": 10,
        "prev_page_url": null,
        "to": 2,
        "total": 2
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
        "message": "Berhasil mendapatkan data tunjangan transportasi berdasarkan ID"
    },
    "data": {
        "id": "019be2a7-5e30-73d8-8356-8b936678c6ad",
        "name_transportation": "Transportasi-01",
        "category_name": "Staff",
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
        "message": "Berhasil memperbarui data tunjangan transportasi"
    },
    "data": {
        "id": "019be2a7-5e30-73d8-8356-8b936678c6ad",
        "name_transportation": "Transportasi-01",
        "category": "c62158fa-eb4a-4d9b-ba81-345bc8a74ade",
        "nominal_value": "1000000",
        "deleted_at": null,
        "created_at": "2026-01-21T22:22:58.000000Z",
        "updated_at": "2026-01-21T22:49:28.000000Z"
    }
}
```
