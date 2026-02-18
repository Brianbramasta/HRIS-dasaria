
# Kontrak API – Periode Penggajian (Payroll Periode)

Dokumen ini merinci kontrak API untuk fitur `Periode Penggajian (Payroll Periode)` pada modul Payroll. Diselaraskan dengan Postman collection yang tersedia.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>` untuk semua endpoint yang memodifikasi data
- Method: Beberapa endpoint update menggunakan `POST` dengan field `_method: PATCH` (method spoofing)
- Content-Type: `application/x-www-form-urlencoded` atau `multipart/form-data`
- Response error: `{ errorCode: string, message: string, details?: any }`

---

## Halaman: Periode Penggajian

### Daftar Periode Penggajian

Endpoint: `GET /api/payroll/payroll-periode/index`

Query Parameters (opsional):
- `page` (integer)
- `per_page` (integer)
- `search` (string)
- `status` (string)
- `column` (string)
- `sort` (`asc` | `desc`)
- `filter_column[<column>][in][]` (string, multiple)
- `filter_column[<column>][range][]` (string, multiple) – format tanggal: `YYYY-MM-DD`

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Data payroll periode retrieved successfully"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "payroll_id": "019c69c6-1a2f-7033-9138-f27b3d9b2c23",
                "employee_id": "DSR042",
                "avatar": null,
                "full_name": "kita tes",
                "periode": "2026-02-17",
                "working_days": 24,
                "net_salary": "6341000",
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 6000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Menunggu Maker"
            },
            {
                "payroll_id": "019c69c6-cb03-706a-9cb8-5837841724f7",
                "employee_id": "DSR042",
                "avatar": null,
                "full_name": "kita tes",
                "periode": "2026-02-17",
                "working_days": 24,
                "net_salary": "6341000",
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 6000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Menunggu Maker"
            },
            {
                "payroll_id": "019c69c6-55e0-70c9-8e0e-591abd25321d",
                "employee_id": "DSR042",
                "avatar": null,
                "full_name": "kita tes",
                "periode": "2026-02-17",
                "working_days": 24,
                "net_salary": "6341000",
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 6000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Menunggu Maker"
            },
            {
                "payroll_id": "019c69c7-bb14-73e1-ba64-078110cf6d73",
                "employee_id": "DSR042",
                "avatar": null,
                "full_name": "kita tes",
                "periode": "2026-02-17",
                "working_days": 24,
                "net_salary": "6341000",
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 6000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Menunggu Maker"
            },
            {
                "payroll_id": "019c69c7-f392-72c5-9c2a-ca246f4dfd5a",
                "employee_id": "DSR042",
                "avatar": null,
                "full_name": "kita tes",
                "periode": "2026-02-17",
                "working_days": 24,
                "net_salary": "6341000",
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 6000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Menunggu Maker"
            },
            {
                "payroll_id": "019c69c8-2ef2-71b2-9666-8d45597795c9",
                "employee_id": "DSR042",
                "avatar": null,
                "full_name": "kita tes",
                "periode": "2026-02-17",
                "working_days": 24,
                "net_salary": "6341000",
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 6000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Menunggu Maker"
            },
            {
                "payroll_id": "019c69c5-e062-706f-aa8e-d19fc7cb00b1",
                "employee_id": "DSR042",
                "avatar": null,
                "full_name": "kita tes",
                "periode": "2026-02-17",
                "working_days": 24,
                "net_salary": "6341000",
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 6000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Menunggu Maker"
            },
            {
                "payroll_id": "019c69c6-8f5f-72b0-88e7-abad461d6b54",
                "employee_id": "DSR042",
                "avatar": null,
                "full_name": "kita tes",
                "periode": "2026-02-17",
                "working_days": 24,
                "net_salary": "6341000",
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 6000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Menunggu Maker"
            },
            {
                "payroll_id": "019c69c7-7b55-71f2-985e-8d79ba1cf45b",
                "employee_id": "DSR042",
                "avatar": null,
                "full_name": "kita tes",
                "periode": "2026-02-17",
                "working_days": 24,
                "net_salary": "6341000",
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 6000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Menunggu Maker"
            },
            {
                "payroll_id": "019c69c7-400e-719d-b2aa-ceb777cda9ff",
                "employee_id": "DSR042",
                "avatar": null,
                "full_name": "kita tes",
                "periode": "2026-02-17",
                "working_days": 24,
                "net_salary": "6341000",
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 6000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Menunggu Maker"
            }
        ],
        "per_page": 10,
        "to": 10,
        "total": 12666
    }
}
```

Status: `200 OK`

---

### Detail Periode Penggajian

Endpoint: `GET /api/payroll/payroll-periode/{payroll_id}/detail`

Path Parameters:
- `payroll_id` (string, required) – ID payroll (UUID)

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Payroll periode detail retrieved successfully"
    },
    "data": {
        "information_employee": {
            "payroll_id": "019c6b53-77b0-7204-b86c-ebbf8cd62af6",
            "employee_id": "DSR040",
            "full_name": "tes bpjs",
            "working_days": 24,
            "basic_salary": 5000000,
            "employee_category_name": "Staff",
            "company_name": "Dasaria"
        },
        "fixed_allowance_and_deduction": {
            "fixed_allowance_and_deduction": [
                {
                    "id": "019c6b53-77b8-70a9-9199-b121fd9168b0",
                    "payroll_id": "019c6b53-77b0-7204-b86c-ebbf8cd62af6",
                    "componen_id": "935190b2-fb3a-11f0-ac6d-54e1ad857d3e",
                    "componen_name": "Tunjangan Jabatan",
                    "amount": "1000000.00"
                },
                {
                    "id": "019c6b53-77c2-7317-9456-d991baaf08b8",
                    "payroll_id": "019c6b53-77b0-7204-b86c-ebbf8cd62af6",
                    "componen_id": "019be556-2d43-7252-bd2c-ef105cf0d5f1",
                    "componen_name": "test",
                    "amount": "3000.00"
                },
                {
                    "id": "019c6b53-77c9-70a1-a37c-5355cc00c454",
                    "payroll_id": "019c6b53-77b0-7204-b86c-ebbf8cd62af6",
                    "componen_id": "019be8bd-dda9-73f3-aa86-cff4c5bcd07e",
                    "componen_name": "test",
                    "amount": "3000.00"
                },
                {
                    "id": "019c6b53-77d0-7231-b5ba-42da77892a2b",
                    "payroll_id": "019c6b53-77b0-7204-b86c-ebbf8cd62af6",
                    "componen_id": "9664bdbb-0c83-43ab-9234-bc0a5cd0bfc7",
                    "componen_name": "Tunjangan BPJS Kesehatan - BPJS Kesehatan",
                    "amount": "164000.00"
                },
                {
                    "id": "019c6b53-77e0-71d9-8cb5-ff93cadaf798",
                    "payroll_id": "019c6b53-77b0-7204-b86c-ebbf8cd62af6",
                    "componen_id": "c8892409-0393-460a-b918-b1fd5065b989",
                    "componen_name": "Potongan BPJS Kesehatan - BPJS Kesehatan",
                    "amount": "41000.00"
                },
                {
                    "id": "019c6b53-77ea-715e-a972-a58b304d8785",
                    "payroll_id": "019c6b53-77b0-7204-b86c-ebbf8cd62af6",
                    "componen_id": "42a3c8bd-6cab-4f82-b07d-686eb9225038",
                    "componen_name": "Tunjangan BPJS Ketenagakerjaan - BPJS Kematian",
                    "amount": "15000.00"
                },
                {
                    "id": "019c6b53-77fd-7251-9b52-dc0f1b1873dc",
                    "payroll_id": "019c6b53-77b0-7204-b86c-ebbf8cd62af6",
                    "componen_id": "987d9fbb-5192-433f-8809-67ee98471179",
                    "componen_name": "Tunjangan BPJS Ketenagakerjaan - BPJS Kecelakaan Kerja",
                    "amount": "12000.00"
                },
                {
                    "id": "019c6b53-7812-7389-a32e-96f0a4c996d4",
                    "payroll_id": "019c6b53-77b0-7204-b86c-ebbf8cd62af6",
                    "componen_id": "de0e1fee-0709-4777-953a-1605a5b24914",
                    "componen_name": "Tunjangan BPJS Ketenagakerjaan - BPJS Hari Tua",
                    "amount": "185000.00"
                },
                {
                    "id": "019c6b53-7819-7194-8570-a9f628134bb4",
                    "payroll_id": "019c6b53-77b0-7204-b86c-ebbf8cd62af6",
                    "componen_id": "fc89e069-1d5b-4a84-b874-d1ceb339e282",
                    "componen_name": "Tunjangan BPJS Ketenagakerjaan - BPJS Pensiun",
                    "amount": "100000.00"
                },
                {
                    "id": "019c6b53-7820-73ab-9328-ab5a6b5f5a81",
                    "payroll_id": "019c6b53-77b0-7204-b86c-ebbf8cd62af6",
                    "componen_id": "86229e8a-976c-46fe-8afd-365a88e18385",
                    "componen_name": "Potongan BPJS Ketenagakerjaan - BPJS Pensiun",
                    "amount": "50000.00"
                },
                {
                    "id": "019c6b53-7827-73a7-b2f0-b49ec4c65277",
                    "payroll_id": "019c6b53-77b0-7204-b86c-ebbf8cd62af6",
                    "componen_id": "cb26a194-85f8-47bd-85bf-1293e4a12e5e",
                    "componen_name": "Potongan BPJS Ketenagakerjaan - BPJS Hari Tua",
                    "amount": "50000.00"
                }
            ],
            "employee_loan": [
                {
                    "id": "969021bf-0102-11f1-95c5-54e1ad857d3e",
                    "application_id": null,
                    "employee_id": "DSR040",
                    "application_date": "2026-02-03",
                    "deduction_start_period": "2026-02-01 00:00:00",
                    "disbursed_at": "2026-02-03",
                    "loan_type_id": "b69d0bf8-6539-4f6c-88e5-b4e07e929726",
                    "nominal_loan": 5000000,
                    "nominal_installment": 700,
                    "loan_period": 4,
                    "loan_status_id": "4e6a7a39-3b7a-4d30-85ee-abbd04a8a98b",
                    "supervisor_approval_file": "anggap ada",
                    "supporting_documents": "anggap ada",
                    "loan_description": "ini untuk istri saya ",
                    "rejection_reason": null,
                    "created_at": null,
                    "updated_at": "2026-02-16T04:20:03.000000Z"
                }
            ]
        },
        "non_fixed_allowance": {
            "non_fixed_allowance": [
                {
                    "id": "019be536-1eeb-72fd-9524-ca1ed8920a0d",
                    "allowance_name": "tes",
                    "category_sub": "Umum",
                    "amount": null
                },
                {
                    "id": "019bfc07-51e4-715a-9f18-925ec9c896bc",
                    "allowance_name": "tes aja",
                    "category_sub": "Umum",
                    "amount": null
                },
                {
                    "id": "019c6eb7-fa2c-7371-8279-541f3a94e521",
                    "allowance_name": "Tunjangan PPh 21",
                    "category_sub": "Umum",
                    "amount": 450000
                },
                {
                    "id": "019c6eb8-d148-71ae-a954-5a62349218bb",
                    "allowance_name": "Tunjangan Pendidikan",
                    "category_sub": "Umum",
                    "amount": 1000000
                },
                {
                    "id": "019c6eba-29ac-71a4-8ae4-9b94e6dca3a6",
                    "allowance_name": "Insentif",
                    "category_sub": "Umum",
                    "amount": 180000
                },
                {
                    "id": "019c6eba-86a0-71ea-8a82-016db6f8409b",
                    "allowance_name": "Overtime",
                    "category_sub": "Umum",
                    "amount": 140000
                },
                {
                    "id": "019c6eba-e49a-7315-8e94-bce16246d549",
                    "allowance_name": "Komisi Sales",
                    "category_sub": "Umum",
                    "amount": 290000
                },
                {
                    "id": "019c6ebb-357e-71ef-92bd-d27272bd7fcc",
                    "allowance_name": "Komisi Survey Sales",
                    "category_sub": "Umum",
                    "amount": 95000
                },
                {
                    "id": "019c6ebb-689c-7373-8213-a53565db82e1",
                    "allowance_name": "Growth Reward",
                    "category_sub": "Umum",
                    "amount": 45000
                },
                {
                    "id": "019c6ebc-d813-70f9-840a-d8a5be8456fb",
                    "allowance_name": "Fee Mitra Subnet",
                    "category_sub": "Umum",
                    "amount": 70000
                },
                {
                    "id": "019c6ebd-1752-72d6-9894-d702fd60224c",
                    "allowance_name": "Uang Saku PKL/Internship",
                    "category_sub": "Umum",
                    "amount": 1700000
                }
            ],
            "employee_non_fixed_allowance": [
                {
                    "id": "019be556-2d43-7252-bd2c-ef105cf0d5f1",
                    "allowance_name": "test",
                    "category_sub": "Diskresi",
                    "amount": 3000
                },
                {
                    "id": "019be8bd-dda9-73f3-aa86-cff4c5bcd07e",
                    "allowance_name": "test",
                    "category_sub": "Diskresi",
                    "amount": 3000
                }
            ]
        },
        "non_fixed_deduction": [
            {
                "id": "019be54d-7d04-72cb-ac68-b7dd95c4adc3",
                "deduction_name": "tes oke",
                "category": "notfixed",
                "amount": 5000
            }
        ],
        "gross_calculation": {
            "gross_salary": 10626000,
            "deduction_total": 141000,
            "net_salary": "10485000"
        }
    }
}
```

Status: `200 OK`

---

## Operasi Update – Payroll Periode

### Update Non-Fix Allowance

Endpoint: `POST /api/payroll/payroll-periode/{payroll_id}/update-non-fix-allowance`

Method Spoofing: gunakan `_method: PATCH` pada form data

Path Parameters:
- `payroll_id` (string, required) – ID payroll (UUID)

Request Body (form-data):
- `_method` (text, required) – nilai: `PATCH`
- `non_fixed_allowances[0][componen_id]` (text, required) – ID komponen allowance
- `non_fixed_allowances[0][amount]` (text, required) – nominal
- `non_fixed_allowances[1][componen_id]` (text, opsional) – ulangi sesuai kebutuhan
- `non_fixed_allowances[1][amount]` (text, opsional) – ulangi sesuai kebutuhan

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "Non fixed allowance updated successfully"
  },
  "data": {
    "payroll_id": "019c6780-821c-7131-af00-1afbabd80980"
  }
}
```

Status: `200 OK`

---

### Update Non-Fix Deduction

Endpoint: `POST /api/payroll/payroll-periode/{payroll_id}/update-non-fix-deduction`

Method Spoofing: gunakan `_method: PATCH` pada form data

Path Parameters:
- `payroll_id` (string, required) – ID payroll (UUID)

Request Body (form-data):
- `_method` (text, required) – nilai: `PATCH`
- `non_fixed_deductions[0][componen_id]` (text, required) – ID komponen deduction
- `non_fixed_deductions[0][amount]` (text, required) – nominal
- `non_fixed_deductions[1][componen_id]` (text, opsional) – ulangi sesuai kebutuhan
- `non_fixed_deductions[1][amount]` (text, opsional) – ulangi sesuai kebutuhan

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "Non fixed deduction updated successfully"
  },
  "data": {
    "payroll_id": "019c6780-821c-7131-af00-1afbabd80980"
  }
}
```

Status: `200 OK`

---

### Update Working Days

Endpoint: `POST /api/payroll/payroll-periode/{payroll_id}/update-working-days`

Method Spoofing: gunakan `_method: PATCH` pada form data

Path Parameters:
- `payroll_id` (string, required) – ID payroll (UUID)

Request Body (form-data):
- `_method` (text, required) – nilai: `PATCH`
- `working_days` (text, required) – jumlah hari kerja

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "Working days updated successfully"
  },
  "data": {
    "payroll_id": "019c6780-821c-7131-af00-1afbabd80980",
    "working_days": 15
  }
}
```

Status: `200 OK`

---

### Approval HR

Endpoint: `POST /api/payroll/payroll-periode/approval-hr`

Method Spoofing: gunakan `_method: PATCH` pada form data

Request Body (form-data):
- `_method` (text, required) – nilai: `PATCH`
- `payroll_id[0]` (text, required) – ID payroll yang akan di-approve
- `payroll_id[1]` (text, opsional) – ulangi sesuai jumlah data yang diproses

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "Approval HR processed successfully"
  },
  "data": {
    "processed": true
  }
}
```

Status: `200 OK`

---

### Import Excel Payroll Periode

Endpoint: `POST /api/payroll/payroll-periode/process-upload`

Request Body (form-data):
- `file_excel` (file, required) – file excel sesuai template import payroll

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "File uploaded successfully"
  },
  "data": {
    "uploaded": true
  }
}
```

Status: `200 OK`

---

## Contoh Request cURL

### Daftar Periode Penggajian
```bash
curl -X GET \
  "http://localhost:3000/api/payroll/payroll-periode/index?page=1&per_page=10" \
  -H "Authorization: Bearer <token>"
```

### Detail Periode Penggajian
```bash
curl -X GET \
  "http://localhost:3000/api/payroll/payroll-periode/019c6b53-77b0-7204-b86c-ebbf8cd62af6/detail" \
  -H "Authorization: Bearer <token>"
```

### Update Non-Fix Allowance
```bash
curl -X POST \
  "http://localhost:3000/api/payroll/payroll-periode/019c6780-821c-7131-af00-1afbabd80980/update-non-fix-allowance" \
  -H "Authorization: Bearer <token>" \
  -F "_method=PATCH" \
  -F "non_fixed_allowances[0][componen_id]=019be536-1eeb-72fd-9524-ca1ed8920a0d" \
  -F "non_fixed_allowances[0][amount]=5000"
```

### Update Non-Fix Deduction
```bash
curl -X POST \
  "http://localhost:3000/api/payroll/payroll-periode/019c6780-821c-7131-af00-1afbabd80980/update-non-fix-deduction" \
  -H "Authorization: Bearer <token>" \
  -F "_method=PATCH" \
  -F "non_fixed_deductions[0][componen_id]=019be54d-7d04-72cb-ac68-b7dd95c4adc3" \
  -F "non_fixed_deductions[0][amount]=5000"
```

### Update Working Days
```bash
curl -X POST \
  "http://localhost:3000/api/payroll/payroll-periode/019c6780-821c-7131-af00-1afbabd80980/update-working-days" \
  -H "Authorization: Bearer <token>" \
  -F "_method=PATCH" \
  -F "working_days=15"
```

### Approval HR
```bash
curl -X POST \
  "http://localhost:3000/api/payroll/payroll-periode/approval-hr" \
  -H "Authorization: Bearer <token>" \
  -F "_method=PATCH" \
  -F "payroll_id[0]=019c69c8-69e0-70bf-94bb-0a09f587c79a" \
  -F "payroll_id[1]=019c69c7-0522-711e-b3f4-459086f580eb"
```

### Import Excel Payroll Periode
```bash
curl -X POST \
  "http://localhost:3000/api/payroll/payroll-periode/process-upload" \
  -H "Authorization: Bearer <token>" \
  -F "file_excel=@./Format Import Payroll Non AE.xlsx"
```
