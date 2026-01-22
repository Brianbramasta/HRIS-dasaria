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
        "message": "Berhasil mendapatkan data tunjangan tetap"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": "019be1cc-f89d-73e0-97fc-c73959d75d05",
                "job_title_name": "kita tes oke apakah di position allawance langsung terbuat",
                "percentage_value": 2,
                "nominal_value": null
            },
            {
                "id": "019be1c0-816b-7310-8b77-7f883200d7dd",
                "job_title_name": "kita tes oke apakah di position allawance langsung terbuat",
                "percentage_value": 0,
                "nominal_value": null
            },
            {
                "id": "019be09b-70df-715c-9ddb-e2f85d174d60",
                "job_title_name": "kita tes oke apakah di position allawance langsung terbuat",
                "percentage_value": 0,
                "nominal_value": null
            }
        ],
        "first_page_url": "http://192.168.2.237:8000/api/payroll/payroll-configuration/fixed-allowance/index?page=1",
        "from": 1,
        "last_page": 1,
        "last_page_url": "http://192.168.2.237:8000/api/payroll/payroll-configuration/fixed-allowance/index?page=1",
        "links": [
            {
                "url": null,
                "label": "&laquo; Previous",
                "page": null,
                "active": false
            },
            {
                "url": "http://192.168.2.237:8000/api/payroll/payroll-configuration/fixed-allowance/index?page=1",
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
        "path": "http://192.168.2.237:8000/api/payroll/payroll-configuration/fixed-allowance/index",
        "per_page": 10,
        "prev_page_url": null,
        "to": 3,
        "total": 3
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
        "message": "Berhasil mendapatkan detail data tunjangan tetap berdasarkan ID"
    },
    "data": {
        "id": "019be09b-70df-715c-9ddb-e2f85d174d60",
        "job_title_id": "019be09b-70d8-72e3-b502-662998614709",
        "job_title_name": "kita tes oke apakah di position allawance langsung terbuat",
        "percentage_value": 0,
        "nominal_value": null,
        "position_allowance_bpjs": [
            {
                "bpjs_item_id": "42a3c8bd-6cab-4f82-b07d-686eb9225038",
                "bpjs_item_name": "BPJS Kematian",
                "bpjs_is_active": 1
            },
            {
                "bpjs_item_id": "86229e8a-976c-46fe-8afd-365a88e18385",
                "bpjs_item_name": "BPJS Pensiun",
                "bpjs_is_active": 1
            },
            {
                "bpjs_item_id": "9664bdbb-0c83-43ab-9234-bc0a5cd0bfc7",
                "bpjs_item_name": "BPJS Kesehatan",
                "bpjs_is_active": 1
            },
            {
                "bpjs_item_id": "c8892409-0393-460a-b918-b1fd5065b989",
                "bpjs_item_name": "BPJS Kesehatan",
                "bpjs_is_active": 1
            }
        ]
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
        "message": "Berhasil memperbarui data tunjangan tetap"
    },
    "data": {
        "id": "019be09b-70df-715c-9ddb-e2f85d174d60",
        "job_level_id": "019be09b-70d8-72e3-b502-662998614709",
        "percentage_value": "0",
        "nominal_value": null,
        "bpjs_item_id": null,
        "deleted_at": null,
        "created_at": "2026-01-21T12:50:42.000000Z",
        "updated_at": "2026-01-21T12:50:42.000000Z"
    }
}
```
