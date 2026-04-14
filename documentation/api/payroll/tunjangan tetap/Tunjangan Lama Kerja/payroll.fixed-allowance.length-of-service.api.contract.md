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
        "message": "Berhasil mendapatkan data tunjangan masa kerja"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": "e6e923dd-44d1-46aa-86e8-192e492637c0",
                "length_of_service": "Tahun Ke-1",
                "nominal_value": 3524238
            },
            {
                "id": "0be0a7d4-5dfa-45a3-a740-541985033346",
                "length_of_service": "Tahun Ke-2",
                "nominal_value": 3524238
            },
            {
                "id": "541d6c0f-619e-4c68-9606-5b5fe4e11602",
                "length_of_service": "Tahun Ke-3",
                "nominal_value": 3524238
            },
            {
                "id": "fd476566-c3f1-4782-93ea-37a5349631e1",
                "length_of_service": "Tahun Ke-4",
                "nominal_value": 3524238
            },
            {
                "id": "8ab59a83-deb2-434e-9762-fa7eadf71230",
                "length_of_service": "Tahun Ke-5",
                "nominal_value": 3524238
            }
        ],
        "first_page_url": "http://192.168.2.237:8000/api/payroll/payroll-configuration/length-of-service-allowance/index?page=1",
        "from": 1,
        "last_page": 1,
        "last_page_url": "http://192.168.2.237:8000/api/payroll/payroll-configuration/length-of-service-allowance/index?page=1",
        "links": [
            {
                "url": null,
                "label": "&laquo; Previous",
                "page": null,
                "active": false
            },
            {
                "url": "http://192.168.2.237:8000/api/payroll/payroll-configuration/length-of-service-allowance/index?page=1",
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
        "path": "http://192.168.2.237:8000/api/payroll/payroll-configuration/length-of-service-allowance/index",
        "per_page": 10,
        "prev_page_url": null,
        "to": 5,
        "total": 5
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
        "message": "Berhasil mendapatkan data tunjangan masa kerja berdasarkan ID"
    },
    "data": {
        "id": "e6e923dd-44d1-46aa-86e8-192e492637c0",
        "length_of_service": "Tahun Ke-1",
        "nominal_value": 3524238,
        "deleted_at": null,
        "created_at": "2026-01-21T21:27:26.000000Z",
        "updated_at": "2026-01-21T21:48:32.000000Z"
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
        "message": "Berhasil memperbarui data tunjangan masa kerja"
    },
    "data": {
        "id": "e6e923dd-44d1-46aa-86e8-192e492637c0",
        "length_of_service": "Tahun Ke-1",
        "nominal_value": "3524238",
        "deleted_at": null,
        "created_at": "2026-01-21T21:27:26.000000Z",
        "updated_at": "2026-01-21T21:48:32.000000Z"
    }
}
```
