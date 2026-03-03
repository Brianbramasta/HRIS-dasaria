
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
- `type` (string) - nilai: `Mitra` | `Staff`
- `column` (string)
- `sort` (`asc` | `desc`)
- `filter_column[<column>][in][]` (string, multiple)
- `filter_column[<column>][range][]` (string, multiple) – format tanggal: `YYYY-MM-DD`

Response (200 OK):
```json
// response data if type Staff
{
    "meta": {
        "status": 200,
        "message": "Data payroll periode retrieved successfully"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                "employee_id": "DSR035",
                "avatar": null,
                "full_name": "tes direktur",
                "periode": "2026-02-19",
                "working_days": 24,
                "net_salary": 10984000,
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 5125000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Selesai"
            },
            {
                "payroll_id": "019c7a5e-2404-7125-8652-1a7903a7cafc",
                "employee_id": "DSR038",
                "avatar": null,
                "full_name": "tes direktur",
                "periode": "2026-02-20",
                "working_days": 24,
                "net_salary": 10302000,
                "basic_salary": 5000000,
                "deduction_total": 1141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 5443000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Selesai"
            },
            {
                "payroll_id": "019c7a5e-23b5-7158-a4a7-c40ac5e222ad",
                "employee_id": "DSR036",
                "avatar": "EmployeeMasterData/Avatar/a8a4bd5b-6caa-4ce2-ad92-4a162ea526cb.jpeg",
                "full_name": "tes direktur",
                "periode": "2026-02-20",
                "working_days": 24,
                "net_salary": 11299000,
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 5440000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Selesai"
            },
            {
                "payroll_id": "019c7a5e-2363-713c-9972-eea47f2abcf3",
                "employee_id": "DSR035",
                "avatar": null,
                "full_name": "tes direktur",
                "periode": "2026-02-20",
                "working_days": 24,
                "net_salary": 10984000,
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 5125000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Selesai"
            },
            {
                "payroll_id": "019c75f4-9e9a-7044-a88d-ec18722a8f16",
                "employee_id": "DSR042",
                "avatar": null,
                "full_name": "kita tes",
                "periode": "2026-02-19",
                "working_days": 24,
                "net_salary": 6168022,
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 309022,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Proses distribusi"
            },
            {
                "payroll_id": "019c75f4-9dec-716f-82eb-ac05ee4b41df",
                "employee_id": "DSR041",
                "avatar": null,
                "full_name": "semoga tidak double",
                "periode": "2026-02-19",
                "working_days": 24,
                "net_salary": 16888921,
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 11029921,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Menunggu diproses BOD"
            },
            {
                "payroll_id": "019c75f4-9d94-7124-bebc-302ecc9ba904",
                "employee_id": "DSR040",
                "avatar": null,
                "full_name": "tes bpjs",
                "periode": "2026-02-19",
                "working_days": 25,
                "net_salary": 16454349,
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 9279001,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Menunggu diproses Direktur HRGA"
            },
            {
                "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                "employee_id": "DSR038",
                "avatar": null,
                "full_name": "tes direktur",
                "periode": "2026-02-19",
                "working_days": 24,
                "net_salary": 21831001,
                "basic_salary": 5000000,
                "deduction_total": 5000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 15836001,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Menunggu diproses Direktur HRGA"
            },
            {
                "payroll_id": "019c75f4-9c10-735e-aa56-78e790a2c2ef",
                "employee_id": "DSR036",
                "avatar": "EmployeeMasterData/Avatar/a8a4bd5b-6caa-4ce2-ad92-4a162ea526cb.jpeg",
                "full_name": "tes direktur",
                "periode": "2026-02-19",
                "working_days": 24,
                "net_salary": 11299000,
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 5440000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Selesai"
            },
            {
                "payroll_id": "019cad74-3da2-7053-ade7-a35a01c5bedd",
                "employee_id": "DSR041",
                "avatar": null,
                "full_name": "semoga tidak double",
                "periode": "2026-03-02",
                "working_days": 26,
                "net_salary": 6338000,
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 3000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Menunggu Maker"
            }
        ],
        "per_page": 10,
        "to": 10,
        "total": 73
    }
}

//response data if type Mitra
{
    "meta": {
        "status": 200,
        "message": "Data payroll periode retrieved successfully"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "payroll_id": "019c8f06-ed56-709f-8d73-12008b45d83a",
                "employee_id": "DSR037",
                "avatar": "EmployeeMasterData/Avatar/34515eda-b1ec-48e5-8125-3e685ee9b685.jpg",
                "full_name": "Brian Bramasta",
                "periode": "2026-02-24",
                "working_days": null,
                "net_salary": 4600,
                "basic_salary": 100,
                "deduction_total": 0,
                "allowance_total": 0,
                "non_fixed_allowance_total": 4500,
                "employee_category_name": "Mitra",
                "company_name": "Dasaria",
                "payroll_status_name": "Selesai"
            },
            {
                "payroll_id": "019cad78-d028-71a2-a1cc-27633f26afee",
                "employee_id": "DSR037",
                "avatar": "EmployeeMasterData/Avatar/34515eda-b1ec-48e5-8125-3e685ee9b685.jpg",
                "full_name": "Brian Bramasta",
                "periode": "2026-03-02",
                "working_days": null,
                "net_salary": 100,
                "basic_salary": 100,
                "deduction_total": 0,
                "allowance_total": 0,
                "non_fixed_allowance_total": 0,
                "employee_category_name": "Mitra",
                "company_name": "Dasaria",
                "payroll_status_name": "Menunggu Maker"
            },
            {
                "payroll_id": "019cad74-3ea7-71d9-b7b6-54599b47c8c4",
                "employee_id": "DSR037",
                "avatar": "EmployeeMasterData/Avatar/34515eda-b1ec-48e5-8125-3e685ee9b685.jpg",
                "full_name": "Brian Bramasta",
                "periode": "2026-03-02",
                "working_days": null,
                "net_salary": 100,
                "basic_salary": 100,
                "deduction_total": 0,
                "allowance_total": 0,
                "non_fixed_allowance_total": 0,
                "employee_category_name": "Mitra",
                "company_name": "Dasaria",
                "payroll_status_name": "Menunggu Maker"
            },
            {
                "payroll_id": "019cad25-90ec-71c9-b1c2-bd2cb203bfbf",
                "employee_id": "DSR037",
                "avatar": "EmployeeMasterData/Avatar/34515eda-b1ec-48e5-8125-3e685ee9b685.jpg",
                "full_name": "Brian Bramasta",
                "periode": "2026-03-02",
                "working_days": null,
                "net_salary": 100,
                "basic_salary": 100,
                "deduction_total": 0,
                "allowance_total": 0,
                "non_fixed_allowance_total": 0,
                "employee_category_name": "Mitra",
                "company_name": "Dasaria",
                "payroll_status_name": "Menunggu Maker"
            },
            {
                "payroll_id": "019cace7-3dc6-7059-ad8c-d21e01c05e1d",
                "employee_id": "DSR037",
                "avatar": "EmployeeMasterData/Avatar/34515eda-b1ec-48e5-8125-3e685ee9b685.jpg",
                "full_name": "Brian Bramasta",
                "periode": "2026-03-02",
                "working_days": null,
                "net_salary": 100,
                "basic_salary": 100,
                "deduction_total": 0,
                "allowance_total": 0,
                "non_fixed_allowance_total": 0,
                "employee_category_name": "Mitra",
                "company_name": "Dasaria",
                "payroll_status_name": "Menunggu Maker"
            },
            {
                "payroll_id": "019cace6-52c2-71b4-bd24-cd4d295341a4",
                "employee_id": "DSR037",
                "avatar": "EmployeeMasterData/Avatar/34515eda-b1ec-48e5-8125-3e685ee9b685.jpg",
                "full_name": "Brian Bramasta",
                "periode": "2026-03-02",
                "working_days": null,
                "net_salary": 100,
                "basic_salary": 100,
                "deduction_total": 0,
                "allowance_total": 0,
                "non_fixed_allowance_total": 0,
                "employee_category_name": "Mitra",
                "company_name": "Dasaria",
                "payroll_status_name": "Menunggu Maker"
            },
            {
                "payroll_id": "019cace5-682e-71ba-94b3-0305ce2a55be",
                "employee_id": "DSR037",
                "avatar": "EmployeeMasterData/Avatar/34515eda-b1ec-48e5-8125-3e685ee9b685.jpg",
                "full_name": "Brian Bramasta",
                "periode": "2026-03-02",
                "working_days": null,
                "net_salary": 100,
                "basic_salary": 100,
                "deduction_total": 0,
                "allowance_total": 0,
                "non_fixed_allowance_total": 0,
                "employee_category_name": "Mitra",
                "company_name": "Dasaria",
                "payroll_status_name": "Menunggu Maker"
            },
            {
                "payroll_id": "019cace4-83de-7100-9630-ad32b2f5cc60",
                "employee_id": "DSR037",
                "avatar": "EmployeeMasterData/Avatar/34515eda-b1ec-48e5-8125-3e685ee9b685.jpg",
                "full_name": "Brian Bramasta",
                "periode": "2026-03-02",
                "working_days": null,
                "net_salary": 100,
                "basic_salary": 100,
                "deduction_total": 0,
                "allowance_total": 0,
                "non_fixed_allowance_total": 0,
                "employee_category_name": "Mitra",
                "company_name": "Dasaria",
                "payroll_status_name": "Menunggu Maker"
            },
            {
                "payroll_id": "019cacdc-4822-71e6-855c-e55b90edc7bd",
                "employee_id": "DSR037",
                "avatar": "EmployeeMasterData/Avatar/34515eda-b1ec-48e5-8125-3e685ee9b685.jpg",
                "full_name": "Brian Bramasta",
                "periode": "2026-03-02",
                "working_days": null,
                "net_salary": 100,
                "basic_salary": 100,
                "deduction_total": 0,
                "allowance_total": 0,
                "non_fixed_allowance_total": 0,
                "employee_category_name": "Mitra",
                "company_name": "Dasaria",
                "payroll_status_name": "Menunggu Maker"
            }
        ],
        "per_page": 10,
        "to": 9,
        "total": 9
    }
}

```

Status: `200 OK`

---

### Detail Periode Penggajian

Endpoint: `GET /api/payroll/payroll-periode/{payroll_id}/detail`

Query Parameters (opsional):
- `type` (string) - nilai: `Mitra` | `Staff`

Path Parameters:
- `payroll_id` (string, required) – ID payroll (UUID)

Response (200 OK):
```json

// if response type Staff

{
    "meta": {
        "status": 200,
        "message": "Payroll periode detail retrieved successfully"
    },
    "data": {
        "information_employee": {
            "payroll_id": "019c8f06-ed56-709f-8d73-12008b45d83a",
            "employee_id": "DSR037",
            "full_name": "Brian Bramasta",
            "working_days": null,
            "basic_salary": 100,
            "periode": "2026-02-24",
            "employee_category_name": "Mitra",
            "company_name": "Dasaria",
            "payroll_status_name": "Selesai"
        },
        "fixed_allowance_and_deduction": {
            "fixed_allowance_and_deduction": [],
            "employee_loan": []
        },
        "non_fixed_allowance": {
            "non_fixed_allowance": [
                {
                    "componen_id": "019be2d6-5f13-729d-b0e8-3441d3a0b52d",
                    "allowance_name": "tes",
                    "category_sub": "Umum",
                    "amount": null
                },
                {
                    "componen_id": "019be536-1eeb-72fd-9524-ca1ed8920a0d",
                    "allowance_name": "tes",
                    "category_sub": "Umum",
                    "amount": null
                },
                {
                    "componen_id": "019be543-f736-73f3-adde-58b4dfe5cecc",
                    "allowance_name": "test",
                    "category_sub": "Umum",
                    "amount": null
                },
                {
                    "componen_id": "019bfc07-51e4-715a-9f18-925ec9c896bc",
                    "allowance_name": "tes aja",
                    "category_sub": "Umum",
                    "amount": null
                },
                {
                    "componen_id": "019c6eb7-fa2c-7371-8279-541f3a94e521",
                    "allowance_name": "Tunjangan PPh 21",
                    "category_sub": "Umum",
                    "amount": null
                },
                {
                    "componen_id": "019c6eb8-d148-71ae-a954-5a62349218bb",
                    "allowance_name": "Tunjangan Pendidikan",
                    "category_sub": "Umum",
                    "amount": null
                },
                {
                    "componen_id": "019c6eba-29ac-71a4-8ae4-9b94e6dca3a6",
                    "allowance_name": "Insentif",
                    "category_sub": "Umum",
                    "amount": 500
                },
                {
                    "componen_id": "019c6eba-86a0-71ea-8a82-016db6f8409b",
                    "allowance_name": "Overtime",
                    "category_sub": "Umum",
                    "amount": 500
                },
                {
                    "componen_id": "019c6eba-e49a-7315-8e94-bce16246d549",
                    "allowance_name": "Komisi Sales",
                    "category_sub": "Umum",
                    "amount": 500
                },
                {
                    "componen_id": "019c6ebb-357e-71ef-92bd-d27272bd7fcc",
                    "allowance_name": "Komisi Survey Sales",
                    "category_sub": "Umum",
                    "amount": 500
                },
                {
                    "componen_id": "019c6ebb-689c-7373-8213-a53565db82e1",
                    "allowance_name": "Growth Reward",
                    "category_sub": "Umum",
                    "amount": 500
                },
                {
                    "componen_id": "019c6ebc-d813-70f9-840a-d8a5be8456fb",
                    "allowance_name": "Fee Mitra Subnet",
                    "category_sub": "Umum",
                    "amount": 500
                },
                {
                    "componen_id": "019c6ebd-1752-72d6-9894-d702fd60224c",
                    "allowance_name": "Uang Saku PKL/Internship",
                    "category_sub": "Umum",
                    "amount": 500
                },
                {
                    "componen_id": "019c9f57-03f2-7290-b22a-c87337de3be6",
                    "allowance_name": "Tunjangan Pendidikan",
                    "category_sub": "Umum",
                    "amount": 500
                }
            ]
        },
        "non_fixed_deduction": [],
        "gross_calculation": {
            "gross_salary": 4600,
            "deduction_total": 0,
            "net_salary": 4600,
            "note_hr": "tes",
            "note_bod": "tes"
        }
    }
}

// if response type Mitra

{
    "meta": {
        "status": 200,
        "message": "Payroll periode detail retrieved successfully"
    },
    "data": {
        "information_employee": {
            "payroll_id": "019c8f06-ed56-709f-8d73-12008b45d83a",
            "employee_id": "DSR037",
            "full_name": "Brian Bramasta",
            "working_days": null,
            "basic_salary": 100,
            "periode": "2026-02-24",
            "employee_category_name": "Mitra",
            "company_name": "Dasaria",
            "payroll_status_name": "Selesai"
        },
        "non_fixed_allowance": {
            "non_fixed_allowance": [
                {
                    "componen_id": "019be2d6-5f13-729d-b0e8-3441d3a0b52d",
                    "allowance_name": "tes",
                    "category_sub": "Umum",
                    "amount": null
                },
                {
                    "componen_id": "019be536-1eeb-72fd-9524-ca1ed8920a0d",
                    "allowance_name": "tes",
                    "category_sub": "Umum",
                    "amount": null
                },
                {
                    "componen_id": "019be543-f736-73f3-adde-58b4dfe5cecc",
                    "allowance_name": "test",
                    "category_sub": "Umum",
                    "amount": null
                },
                {
                    "componen_id": "019bfc07-51e4-715a-9f18-925ec9c896bc",
                    "allowance_name": "tes aja",
                    "category_sub": "Umum",
                    "amount": null
                },
                {
                    "componen_id": "019c6eb7-fa2c-7371-8279-541f3a94e521",
                    "allowance_name": "Tunjangan PPh 21",
                    "category_sub": "Umum",
                    "amount": null
                },
                {
                    "componen_id": "019c6eb8-d148-71ae-a954-5a62349218bb",
                    "allowance_name": "Tunjangan Pendidikan",
                    "category_sub": "Umum",
                    "amount": null
                },
                {
                    "componen_id": "019c6eba-29ac-71a4-8ae4-9b94e6dca3a6",
                    "allowance_name": "Insentif",
                    "category_sub": "Umum",
                    "amount": 500
                },
                {
                    "componen_id": "019c6eba-86a0-71ea-8a82-016db6f8409b",
                    "allowance_name": "Overtime",
                    "category_sub": "Umum",
                    "amount": 500
                },
                {
                    "componen_id": "019c6eba-e49a-7315-8e94-bce16246d549",
                    "allowance_name": "Komisi Sales",
                    "category_sub": "Umum",
                    "amount": 500
                },
                {
                    "componen_id": "019c6ebb-357e-71ef-92bd-d27272bd7fcc",
                    "allowance_name": "Komisi Survey Sales",
                    "category_sub": "Umum",
                    "amount": 500
                },
                {
                    "componen_id": "019c6ebb-689c-7373-8213-a53565db82e1",
                    "allowance_name": "Growth Reward",
                    "category_sub": "Umum",
                    "amount": 500
                },
                {
                    "componen_id": "019c6ebc-d813-70f9-840a-d8a5be8456fb",
                    "allowance_name": "Fee Mitra Subnet",
                    "category_sub": "Umum",
                    "amount": 500
                },
                {
                    "componen_id": "019c6ebd-1752-72d6-9894-d702fd60224c",
                    "allowance_name": "Uang Saku PKL/Internship",
                    "category_sub": "Umum",
                    "amount": 500
                },
                {
                    "componen_id": "019c9f57-03f2-7290-b22a-c87337de3be6",
                    "allowance_name": "Tunjangan Pendidikan",
                    "category_sub": "Umum",
                    "amount": 500
                }
            ]
        },
        "gross_calculation": {
            "gross_salary": 4600,
            "deduction_total": 0,
            "net_salary": 4600,
            "note_hr": "tes",
            "note_bod": "tes"
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

Query Parameters (opsional):
- `type` (string) - nilai: `Mitra` | `Staff`

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

Query Parameters (opsional):
- `type` (string) - nilai: `Mitra` | `Staff`

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

Query Parameters (opsional):
- `type` (string) - nilai: `Mitra` | `Staff`

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

Query Parameters (opsional):
- `type` (string) - nilai: `Mitra` | `Staff`

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

Query Parameters (opsional):
- `type` (string) - nilai: `Mitra` | `Staff`

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
