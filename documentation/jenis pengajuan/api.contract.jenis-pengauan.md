# Kontrak API – Jenis Pengajuan (DSR042)

Dokumen ini merinci kontrak API untuk fitur `Jenis Pengajuan` kode `DSR042` berdasarkan koleksi Postman yang disediakan.

## Konvensi Umum

- Base URL: sesuai environment (`{{base_url}}` atau `{{ngrok}}`)
- Content-Type:
  - `multipart/form-data` untuk endpoint penyimpanan
  - `application/json` untuk endpoint lainnya
- Response Standard: JSON

---

## Operations

### 1. Menyimpan Pengajuan

Endpoint: `POST /api/type-of-application/DSR042/store`

Content-Type: `multipart/form-data`

Form Fields:
- `submission`: string, contoh: `"Kasbon"`
- `tanggal_pengajuan`: string (YYYY-MM-DD), contoh: `"2026-02-07"`
- `document_lampiran`: file, opsional
- `loan_type_id`: string (UUID), contoh: `"fd854227-c6e1-4359-8c42-e9e6a042fec0"`
- `nominal_loan`: string/number, contoh: `"5000000"`
- `loan_period`: string/number, contoh: `"5"`
- `supervisor_approval_file`: file
- `supporting_documents`: file
- `loan_description`: string, contoh: `"kita tes dari pengajuan"`
- `nominal_installment`: string/number, contoh: `"3000000"`

Contoh (form-data representasi):
```json
{
  "submission": "Kasbon",
  "tanggal_pengajuan": "2026-02-07",
  "document_lampiran": "(file)",
  "loan_type_id": "fd854227-c6e1-4359-8c42-e9e6a042fec0",
  "nominal_loan": "5000000",
  "loan_period": "5",
  "supervisor_approval_file": "(file)",
  "supporting_documents": "(file)",
  "loan_description": "kita tes dari pengajuan",
  "nominal_installment": "3000000"
}
```

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "berhasil menyimpan pengajuan"
  },
  "data": {}
}
```

---

### 2. Daftar Pengajuan (Index)

Endpoint: `GET /api/type-of-application/DSR042/index`

Query Parameters: tidak ada

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Applications retrieved successfully."
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": "019c4121-ed62-7232-a04e-3eca27295a60",
                "submission_type": "Kasbon",
                "submission_date": "2026-02-07",
                "attachment_document": null,
                "status": "Menunggu Persetujuan FAT",
                "note": null
            },
            {
                "id": "019c3734-f43d-73a7-945a-71dd367cd54d",
                "submission_type": "Pengunduran Diri",
                "submission_date": "2026-02-07",
                "attachment_document": null,
                "status": "Menunggu Diproses",
                "note": null
            }
        ],
        "per_page": 10,
        "to": 2,
        "total": 2
    }
}
```

---

### 3. Popup Detail Pengajuan

Endpoint: `GET /api/type-of-application/DSR042/popup-application-detail`

Query Parameters:
- `status`: string, contoh: `"Pengunduran Diri"` (contoh lain: `"Kasbon"`)

Contoh:
```
/api/type-of-application/DSR042/popup-application-detail?status=Pengunduran Diri
```

Response (200 OK):
```json
// status pengunduran diri
{
    "meta": {
        "status": 200,
        "message": "Application detail retrieved successfully."
    },
    "data": {
        "nip": "DSR042",
        "full_name": "kita tes",
        "company_name": "Dasaria",
        "directorate_name": "directorat 1",
        "department_name": "hris",
        "division_name": "test 2",
        "position_name": "test"
    }
}

// status kasbon
{
    "meta": {
        "status": 200,
        "message": "Application detail retrieved successfully."
    },
    "data": {
        "nip": "DSR042",
        "full_name": "kita tes",
        "department_name": "hris",
        "position_name": "test",
        "position_level": "Senior",
        "basic_salary": 5000000
    }
}
```

---

### 4. Hitung Cicilan Pinjaman

Endpoint: `GET /api/type-of-application/DSR042/calculate-loan-installment/{nominal}`

Path Parameters:
- `nominal`: string/number, contoh: `3000000`

Contoh:
```
/api/type-of-application/DSR042/calculate-loan-installment/3000000
```

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Loan installment calculated successfully."
    },
    "data": {
        "installment_per_month": -3000000,
        "months_remaining": -1
    }
}
```

