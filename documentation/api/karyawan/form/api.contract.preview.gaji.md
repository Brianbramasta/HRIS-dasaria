# Kontrak API – Preview Gaji

Dokumen ini merinci kontrak API untuk fitur `Preview Gaji` pada form karyawan.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>`
- Content-Type: `multipart/form-data` (untuk method POST/Form Data) atau default

---

## Halaman: Preview Gaji

### 1. Preview Payroll (Saat Menambah Karyawan)

Endpoint: `GET /api/payroll/payrollpreview`

Query Parameters:
- `Position_level_id` (string, required) - ID Level Posisi
- `category` (string, required) - Kategori (contoh: "Menikah")
- `dependents` (integer, required) - Jumlah Tanggungan
- `job_title_id` (string, required) - ID Job Title
- `employee_categories_id` (string, required) - ID Kategori Karyawan

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Preview Payroll retrieved successfully"
    },
    "data": {
        "ptkp_status": "K/A-3",
        "basic_salary": 5000000,
        "position_allowance": 0,
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
        "salary_with_allowance": 10096238,
        "salary_after_deduction": 9946238
    }
}
```

### 2. Preview Calculate Gaji Bersih

Endpoint: `POST /api/payroll/payrollpreview/calculate`

Request Body (form-data):
- `salary_after_deduction` (text, required) - Gaji setelah potongan
- `non_fix_allowance` (array) - Array tunjangan tidak tetap
    - `non_fix_allowance[x][id]` (text) - ID Tunjangan (bisa kosong jika baru/custom)
    - `non_fix_allowance[x][amount]` (text) - Nominal Tunjangan

Contoh Payload:
```text
salary_after_deduction: 10197349
non_fix_allowance[0][id]: 
non_fix_allowance[0][amount]: 1000000
non_fix_allowance[1][amount]: 1000000
```

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Payroll Preview calculated successfully"
    },
    "data": {
        "total_salary": 11197349
    }
}
```

### 3. Dropdown Non-Fix Allowance

Endpoint: `GET /api/payroll/payrollpreview/dropdown-nonfix-allowance`

Query Parameters:
- `non_fix_allowance_name` (string, optional) - Filter nama tunjangan

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Dropdown data retrieved successfully"
    },
    "data": [
        {
            "id": "019bfc07-51e4-715a-9f18-925ec9c896bc",
            "allowance_name": "tes aja"
        }
    ]
}
```
