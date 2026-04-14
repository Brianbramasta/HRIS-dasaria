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
        "message": "Berhasil mendapatkan data tunjangan pernikahan"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": "019be229-bdaa-7382-9a25-e0047f56c672",
                "code": "TK/1",
                "category": "Tidak Menikah",
                "dependents": 1,
                "nominal_value": 4100000
            },
            {
                "id": "019be229-bdb5-7110-a51b-c366485a4366",
                "code": "TK/2",
                "category": "Tidak Menikah",
                "dependents": 2,
                "nominal_value": 4100000
            },
            {
                "id": "019be229-bdb9-724d-9322-fb5550439c4e",
                "code": "TK/3",
                "category": "Tidak Menikah",
                "dependents": 3,
                "nominal_value": 3524238
            },
            {
                "id": "019be229-bd76-73c5-863a-dcdb2eab7a2b",
                "code": "K/A-0",
                "category": "Menikah",
                "dependents": 0,
                "nominal_value": 3524238
            },
            {
                "id": "019be229-bd84-7383-86c4-596f4561f34d",
                "code": "K/A-1",
                "category": "Menikah",
                "dependents": 1,
                "nominal_value": 3524238
            },
            {
                "id": "019be229-bd8b-71c1-b370-19a31b82bea8",
                "code": "K/A-2",
                "category": "Menikah",
                "dependents": 2,
                "nominal_value": 3524238
            },
            {
                "id": "019be229-bd93-7178-9847-03ea341a367a",
                "code": "K/A-3",
                "category": "Menikah",
                "dependents": 3,
                "nominal_value": 3524238
            },
            {
                "id": "019be229-bda1-7169-b577-704c576a5f1c",
                "code": "TK/0",
                "category": "Tidak Menikah",
                "dependents": 0,
                "nominal_value": 3524238
            }
        ],
        "first_page_url": "http://192.168.2.237:8000/api/payroll/payroll-configuration/martial-allowance/index?page=1",
        "from": 1,
        "last_page": 1,
        "last_page_url": "http://192.168.2.237:8000/api/payroll/payroll-configuration/martial-allowance/index?page=1",
        "links": [
            {
                "url": null,
                "label": "&laquo; Previous",
                "page": null,
                "active": false
            },
            {
                "url": "http://192.168.2.237:8000/api/payroll/payroll-configuration/martial-allowance/index?page=1",
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
        "path": "http://192.168.2.237:8000/api/payroll/payroll-configuration/martial-allowance/index",
        "per_page": 10,
        "prev_page_url": null,
        "to": 8,
        "total": 8
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
        "message": "Berhasil mendapatkan data tunjangan pernikahan berdasarkan ID"
    },
    "data": {
        "id": "019be229-bd76-73c5-863a-dcdb2eab7a2b",
        "code": "K/A-0",
        "category": "Menikah",
        "dependents": 0,
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
        "message": "Berhasil memperbarui data tunjangan pernikahan"
    },
    "data": 1
}
```
