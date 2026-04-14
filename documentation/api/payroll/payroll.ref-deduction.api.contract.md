# Kontrak API – Acuan Potong (Ref Deduction)

Dokumen ini merinci kontrak API untuk fitur `Acuan Potong` (Reference Deduction) pada modul Payroll Configuration.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>`
- Method: Menggunakan `POST` dengan field `_method: PATCH` untuk update
- Content-Type: `multipart/form-data`

---

## Halaman: Acuan Potong

### Daftar Acuan Potong

Endpoint: `GET /api/payroll/payroll-configuration/ref-deduction/index`

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Berhasil mendapatkan data referensi potongan"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": "426449c5-1339-4e6f-b4ed-a9cec653e57c",
                "reference_name": "UMR",
                "category": "BPJS Kesehatan",
                "nominal_value": 3524238,
                "description": ""
            },
            {
                "id": "54da3f81-74eb-468f-a517-b1f8870920ba",
                "reference_name": "Non-UMR",
                "category": "BPJS Kesehatan",
                "nominal_value": 4100000,
                "description": ""
            },
            {
                "id": "5a0ff312-2222-4c90-9c7d-11809b1e5005",
                "reference_name": "Gaji Tipe 7",
                "category": "BPJS Ketenagakerjaan",
                "nominal_value": 12000000,
                "description": "Salary > 13000000"
            },
            {
                "id": "86914675-86d7-4408-9b2c-8a092c3b3172",
                "reference_name": "Gaji Tipe 4",
                "category": "BPJS Ketenagakerjaan",
                "nominal_value": 5000000,
                "description": "Salary > 5000000"
            },
            {
                "id": "aa8b3aac-7446-4688-b2c3-c970377f1ada",
                "reference_name": "Gaji Tipe 6",
                "category": "BPJS Ketenagakerjaan",
                "nominal_value": 10000000,
                "description": "Salary > 10000000"
            },
            {
                "id": "b9731766-f251-4f98-96fe-deb1e7b196fa",
                "reference_name": "Gaji Tipe 5",
                "category": "BPJS Ketenagakerjaan",
                "nominal_value": 7000000,
                "description": "Salary > 7000000"
            },
            {
                "id": "ba93ee90-cf56-447d-ae13-32f7b97591ca",
                "reference_name": "Gaji Tipe 1",
                "category": "BPJS Ketenagakerjaan",
                "nominal_value": 3524238,
                "description": "Salary < UMK"
            },
            {
                "id": "d0cd2024-2c7c-4f9a-84f3-f66bac109c44",
                "reference_name": "Gaji Tipe 3",
                "category": "BPJS Ketenagakerjaan",
                "nominal_value": 4000000,
                "description": "Salary > 4000000"
            },
            {
                "id": "f7b1a8ec-fbb5-437a-bf64-918038f192b9",
                "reference_name": "Gaji Tipe 2",
                "category": "BPJS Ketenagakerjaan",
                "nominal_value": 3524238,
                "description": "Salary >= UMK"
            }
        ],
        "per_page": 10,
        "to": 9,
        "total": 9
    }
}
```

---

## Operasi CRUD

### Detail Acuan Potong

Endpoint: `GET /api/payroll/payroll-configuration/ref-deduction/{id}/show`

Path Parameters:
- `id` (string, required) – ID

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Berhasil mendapatkan data referensi potongan"
    },
    "data": {
        "id": "426449c5-1339-4e6f-b4ed-a9cec653e57c",
        "reference_name": "UMR",
        "category": "BPJS Kesehatan",
        "nominal_value": 3524238,
        "description": "",
        "deleted_at": null,
        "created_at": "2026-01-21T09:17:28.000000Z",
        "updated_at": "2026-01-21T10:19:18.000000Z"
    }
}
```

### Update Acuan Potong

Endpoint: `POST /api/payroll/payroll-configuration/ref-deduction/{id}/update`

Method Spoofing: `_method: PATCH`

Request Body (form-data):
- `_method`: `PATCH`
- `nominal_value`: number
- `description`: string

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Berhasil memperbarui data referensi potongan"
    },
    "data": {
        "id": "426449c5-1339-4e6f-b4ed-a9cec653e57c",
        "reference_name": "UMR",
        "category": "BPJS Kesehatan",
        "nominal_value": "3524238",
        "description": "",
        "deleted_at": null,
        "created_at": "2026-01-21T09:17:28.000000Z",
        "updated_at": "2026-01-21T10:19:18.000000Z"
    }
}
```
