# Kontrak API – Tunjangan Hari Raya (THR)

Dokumen ini merinci kontrak API untuk fitur `Tunjangan Hari Raya` (Holiday Allowance) pada modul Payroll Configuration.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>`
- Method: Menggunakan `POST` dengan field `_method: PATCH` untuk update
- Content-Type: `multipart/form-data`

---

## Halaman: Tunjangan Hari Raya

### Daftar THR

Endpoint: `GET /api/payroll/payroll-configuration/holiday-allowance/mt-holiday-allowance/index`

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Successfully retrieved holiday allowance configurations."
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": "480ef6e3-0f28-41b0-9be5-9b73c53f081c",
                "length_of_service": "2 tahun atau lebih",
                "description": "THR dibayarkan 1(satu) kali Gaji Penuh"
            },
            {
                "id": "34ff493d-23ac-43b2-9cd0-23a5e1f23d9a",
                "length_of_service": "Kurang dari 1 Tahun",
                "description": "Masa Kerja: Dihitung dalam satuan bulan "
            }
        ],
        "first_page_url": "http://192.168.2.237:8000/api/payroll/payroll-configuration/holiday-allowance/mt-holiday-allowance/index?page=1",
        "from": 1,
        "last_page": 1,
        "last_page_url": "http://192.168.2.237:8000/api/payroll/payroll-configuration/holiday-allowance/mt-holiday-allowance/index?page=1",
        "links": [
            {
                "url": null,
                "label": "&laquo; Previous",
                "page": null,
                "active": false
            },
            {
                "url": "http://192.168.2.237:8000/api/payroll/payroll-configuration/holiday-allowance/mt-holiday-allowance/index?page=1",
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
        "path": "http://192.168.2.237:8000/api/payroll/payroll-configuration/holiday-allowance/mt-holiday-allowance/index",
        "per_page": 10,
        "prev_page_url": null,
        "to": 2,
        "total": 2
    }
}
```

---

## Operasi CRUD

### Detail THR

Endpoint: `GET /api/payroll/payroll-configuration/holiday-allowance/mt-holiday-allowance/{id}/show`

Path Parameters:
- `id` (string, required) – ID

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Successfully retrieved holiday allowance configuration."
    },
    "data": {
        "id": "480ef6e3-0f28-41b0-9be5-9b73c53f081c",
        "length_of_service": "2 tahun atau lebih",
        "description": "THR dibayarkan 1(satu) kali Gaji Penuh",
        "is_active": 1,
        "deleted_at": null,
        "created_at": null,
        "updated_at": "2026-01-22T07:24:04.000000Z"
    }
}
```

### Update THR

Endpoint: `POST /api/payroll/payroll-configuration/holiday-allowance/mt-holiday-allowance/{id}/update`

Method Spoofing: `_method: PATCH`

Request Body (form-data):
- `_method`: `PATCH`
- `length_of_service`: string
- `description`: string (optional)

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Successfully updated holiday allowance configuration."
    },
    "data": {
        "id": "480ef6e3-0f28-41b0-9be5-9b73c53f081c",
        "length_of_service": "2 tahun atau lebih",
        "description": "THR dibayarkan 1(satu) kali Gaji Penuh",
        "is_active": 1,
        "deleted_at": null,
        "created_at": null,
        "updated_at": "2026-01-22T07:24:04.000000Z"
    }
}
```

### Update Status THR

Endpoint: `POST /api/payroll/payroll-configuration/holiday-allowance/mt-holiday-allowance/update-status`

Method Spoofing: `_method: PATCH`

Request Body (form-data):
- `_method`: `PATCH`
- `is_active`: string (1 = active, 0 = inactive)

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Successfully updated holiday allowance status."
    },
    "data": {
        "rows_updated": 2,
        "is_active": true
    }
}
```
