# Kontrak API – Penggajian Tab (Detail Karyawan)

Dokumen ini merinci kontrak API untuk fitur `Penggajian` pada halaman Detail Karyawan.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>`
- Content-Type: `multipart/form-data` (untuk method POST/Form Data) atau default

---

## Halaman: Detail Karyawan - Tab Penggajian

### 1. Get Temporary Salary (Bagian Atas)

Mengambil data penggajian sementara (temporary salary) untuk ditampilkan di bagian atas form.

Endpoint: `GET /api/employee-master-data/employees/{employee_id}/temporary-salary`

Query Parameters:
- `Position_level_id` (string, required) - ID Level Posisi
- `category` (string, required) - Kategori (contoh: "Menikah")
- `dependents` (integer, required) - Jumlah Tanggungan
- `job_title_id` (string, required) - ID Job Title
- `employee_categories_id` (string, required) - ID Kategori Karyawan

Response (200 OK):
> *Catatan: Struktur response belum tersedia di Postman collection. Berikut adalah estimasi struktur standar.*
```json
{
    "meta": {
        "status": 200,
        "message": "berhasil mendapatkan data gaji karyawan"
    },
    "data": {
        "ptkp_status": "K/A-3",
        "basic_salary": 5000000,
        "position_allowance": 250000,
        "length_of_service_allowance": 1000000,
        "lenght_of_service_allowance": 0,
        "marital_allowance": 3524238,
        "bpjs_allowance_details": [
            {
                "item": "BPJS Kematian",
                "value": 25000
            },
            {
                "item": "BPJS Kesehatan",
                "value": 100000
            },
            {
                "item": "BPJS Kecelakaan Kerja",
                "value": 12000
            },
            {
                "item": "BPJS Hari Tua",
                "value": 185000
            },
            {
                "item": "BPJS Pensiun",
                "value": 250000
            }
        ],
        "bpjs_deduction_details": [
            {
                "item": "BPJS Pensiun",
                "value": 50000
            },
            {
                "item": "BPJS Kesehatan",
                "value": 50000
            },
            {
                "item": "BPJS Hari Tua",
                "value": 50000
            }
        ],
        "salary_with_allowance": 10346238,
        "salary_after_deduction": 10196238,
        "non_fix_allowance_details": [
            {
                "tr_employee_non_fix_allowance_id": "019bfea6-4a70-72e4-9c4c-053df72f35ab",
                "non_fix_allowance_id": "019be556-2d43-7252-bd2c-ef105cf0d5f1",
                "allowance_name": "test",
                "amount": 3000
            },
            {
                "tr_employee_non_fix_allowance_id": "019bffdc-b62c-710e-be7d-62c8853b1018",
                "non_fix_allowance_id": "019be8bd-dda9-73f3-aa86-cff4c5bcd07e",
                "allowance_name": "test",
                "amount": 3000
            }
        ],
        "temporary_salary": 10202238,
        "bank_name": "Bank BCA",
        "bank_account_holder": "morimana",
        "bank_account_number": 34534635,
        "npwp": 13432432
    }
}
```

### 2. Update Temporary Salary

Menyimpan perubahan data penggajian sementara.

Endpoint: `POST /api/employee-master-data/employees/{employee_id}/update-temporary-salary`

**Catatan:** Request menggunakan method `POST` dengan field `_method: PATCH` di dalam body (Form Data).

Request Body (form-data):
- `non_fix_allowance_details` (array) - Daftar detail tunjangan tidak tetap
    - `non_fix_allowance_details[x][tr_employee_non_fix_allowance_id]` (string, optional) - ID Transaksi Employee Non-Fix Allowance (UUID)
    - `non_fix_allowance_details[x][non_fix_allowance_id]` (string, required) - ID Master Non-Fix Allowance (UUID)
    - `non_fix_allowance_details[x][amount]` (numeric, required) - Nominal Tunjangan
- `_method` (string, required) - Value: `PATCH`

Contoh Payload:
```text
non_fix_allowance_details[0][tr_employee_non_fix_allowance_id]: 019bfea6-4a70-72e4-9c4c-053df72f35ab
non_fix_allowance_details[0][non_fix_allowance_id]: 019be556-2d43-7252-bd2c-ef105cf0d5f1
non_fix_allowance_details[0][amount]: 3000
non_fix_allowance_details[1][tr_employee_non_fix_allowance_id]: 019bfea6-4a86-71e1-aaa2-695df115db40
non_fix_allowance_details[1][non_fix_allowance_id]: 019be8bd-dda9-73f3-aa86-cff4c5bcd07e
non_fix_allowance_details[1][amount]: 3000
_method: PATCH
```

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "berhasil memperbarui data gaji karyawan"
    },
    "data": [
        {
            "id": "019bfea6-4a70-72e4-9c4c-053df72f35ab",
            "employee_id": "DSR035",
            "non_fix_allowance_id": "019be556-2d43-7252-bd2c-ef105cf0d5f1",
            "amount": "3000",
            "created_at": "2026-01-27T08:51:09.000000Z",
            "updated_at": "2026-01-27T08:51:09.000000Z"
        },
        {
            "employee_id": "DSR035",
            "non_fix_allowance_id": "019be8bd-dda9-73f3-aa86-cff4c5bcd07e",
            "amount": "3000",
            "id": "019c02fd-b10a-7059-9db0-d7e995768e95",
            "updated_at": "2026-01-28T05:05:06.000000Z",
            "created_at": "2026-01-28T05:05:06.000000Z"
        }
    ]
}
```
