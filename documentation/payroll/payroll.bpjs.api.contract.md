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
        "message": "Berhasil mendapatkan data BPJS items"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": "42a3c8bd-6cab-4f82-b07d-686eb9225038",
                "detail_name": "BPJS Kematian",
                "category": "BPJS Ketenagakerjaan",
                "type": "Tunjangan",
                "company_percentage": 0.3
            },
            {
                "id": "86229e8a-976c-46fe-8afd-365a88e18385",
                "detail_name": "BPJS Pensiun",
                "category": "BPJS Ketenagakerjaan",
                "type": "Potongan",
                "company_percentage": 1
            },
            {
                "id": "9664bdbb-0c83-43ab-9234-bc0a5cd0bfc7",
                "detail_name": "BPJS Kesehatan",
                "category": "BPJS Kesehatan",
                "type": "Tunjangan",
                "company_percentage": 2
            },
            {
                "id": "987d9fbb-5192-433f-8809-67ee98471179",
                "detail_name": "BPJS Kecelakaan Kerja",
                "category": "BPJS Ketenagakerjaan",
                "type": "Tunjangan",
                "company_percentage": 0.24
            },
            {
                "id": "c8892409-0393-460a-b918-b1fd5065b989",
                "detail_name": "BPJS Kesehatan",
                "category": "BPJS Kesehatan",
                "type": "Potongan",
                "company_percentage": 1
            },
            {
                "id": "cb26a194-85f8-47bd-85bf-1293e4a12e5e",
                "detail_name": "BPJS Hari Tua",
                "category": "BPJS Ketenagakerjaan",
                "type": "Potongan",
                "company_percentage": 1
            },
            {
                "id": "de0e1fee-0709-4777-953a-1605a5b24914",
                "detail_name": "BPJS Hari Tua",
                "category": "BPJS Ketenagakerjaan",
                "type": "Tunjangan",
                "company_percentage": 3.7
            },
            {
                "id": "fc89e069-1d5b-4a84-b874-d1ceb339e282",
                "detail_name": "BPJS Pensiun",
                "category": "BPJS Ketenagakerjaan",
                "type": "Tunjangan",
                "company_percentage": 5
            }
        ],
        "per_page": 10,
        "to": 8,
        "total": 8
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
        "message": "Berhasil mendapatkan list BPJS items"
    },
    "data": {
        "BPJS Ketenagakerjaan": [
            {
                "id": "42a3c8bd-6cab-4f82-b07d-686eb9225038",
                "detail_name": "BPJS Kematian",
                "type": "Tunjangan"
            },
            {
                "id": "86229e8a-976c-46fe-8afd-365a88e18385",
                "detail_name": "BPJS Pensiun",
                "type": "Potongan"
            },
            {
                "id": "987d9fbb-5192-433f-8809-67ee98471179",
                "detail_name": "BPJS Kecelakaan Kerja",
                "type": "Tunjangan"
            },
            {
                "id": "cb26a194-85f8-47bd-85bf-1293e4a12e5e",
                "detail_name": "BPJS Hari Tua",
                "type": "Potongan"
            },
            {
                "id": "de0e1fee-0709-4777-953a-1605a5b24914",
                "detail_name": "BPJS Hari Tua",
                "type": "Tunjangan"
            },
            {
                "id": "fc89e069-1d5b-4a84-b874-d1ceb339e282",
                "detail_name": "BPJS Pensiun",
                "type": "Tunjangan"
            }
        ],
        "BPJS Kesehatan": [
            {
                "id": "9664bdbb-0c83-43ab-9234-bc0a5cd0bfc7",
                "detail_name": "BPJS Kesehatan",
                "type": "Tunjangan"
            },
            {
                "id": "c8892409-0393-460a-b918-b1fd5065b989",
                "detail_name": "BPJS Kesehatan",
                "type": "Potongan"
            }
        ]
    }
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
        "message": "Berhasil mendapatkan data BPJS item"
    },
    "data": {
        "id": "42a3c8bd-6cab-4f82-b07d-686eb9225038",
        "detail_name": "BPJS Kematian",
        "category": "BPJS Ketenagakerjaan",
        "type": "Tunjangan",
        "company_percentage": 0.3,
        "deleted_at": null,
        "created_at": "2026-01-21T06:24:00.000000Z",
        "updated_at": "2026-01-21T06:24:00.000000Z"
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
        "message": "Berhasil memperbarui data BPJS item"
    },
    "data": {
        "id": "fc89e069-1d5b-4a84-b874-d1ceb339e282",
        "detail_name": "BPJS Pensiun",
        "category": "BPJS Ketenagakerjaan",
        "type": "Tunjangan",
        "company_percentage": "5",
        "deleted_at": null,
        "created_at": "2026-01-21T06:24:00.000000Z",
        "updated_at": "2026-01-21T08:26:04.000000Z"
    }
}
```
