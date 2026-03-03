 
 # Kontrak API – Persetujuan Periode Gajian (HR Direktur)
 
 Dokumen ini merinci kontrak API untuk fitur `Persetujuan Periode Gajian` pada modul Payroll (role: HR Direktur). Diselaraskan dengan Postman collection yang tersedia.
 
 ## Konvensi Umum
 
 - Header auth: `Authorization: Bearer <token>` untuk semua endpoint yang memodifikasi data
 - Method: Beberapa endpoint update menggunakan `POST` dengan field `_method: PATCH` (method spoofing)
 - Content-Type: `application/x-www-form-urlencoded` atau `multipart/form-data`
 - Response error: `{ errorCode: string, message: string, details?: any }`
 
 ---
 
 ## Halaman: Persetujuan Periode Gajian (HR Direktur)
 
 ### Daftar Periode Gajian (Antrian Approval HR Direktur)
 
 Endpoint: `GET /api/payroll/payroll-periode/index-Directur-HR`

Query Parameters:
- `type` (string, opsional) – nilai: `Mitra` | `Staff`
 
 Response (200 OK):
 ```json
 {
    "meta": {
        "status": 200,
        "message": "Data payroll periode pending approval for Director HR retrieved successfully"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "payroll_id": "019c75f4-9dec-716f-82eb-ac05ee4b41df",
                "employee_id": "DSR041",
                "avatar": null,
                "full_name": "semoga tidak double",
                "periode": "2026-02-19",
                "working_days": 24,
                "net_salary": "6353000",
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 18000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "hr_director_approval_status": "Menunggu diproses"
            },
            {
                "payroll_id": "019c75f4-9e9a-7044-a88d-ec18722a8f16",
                "employee_id": "DSR042",
                "avatar": null,
                "full_name": "kita tes",
                "periode": "2026-02-19",
                "working_days": 24,
                "net_salary": "6341000",
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 6000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "hr_director_approval_status": "Menunggu diproses"
            },
            {
                "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                "employee_id": "DSR035",
                "avatar": null,
                "full_name": "tes direktur",
                "periode": "2026-02-19",
                "working_days": 24,
                "net_salary": "10984000",
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 5125000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "hr_director_approval_status": "Menunggu diproses"
            },
            {
                "payroll_id": "019c75f4-9c10-735e-aa56-78e790a2c2ef",
                "employee_id": "DSR036",
                "avatar": "EmployeeMasterData/Avatar/a8a4bd5b-6caa-4ce2-ad92-4a162ea526cb.jpeg",
                "full_name": "tes direktur",
                "periode": "2026-02-19",
                "working_days": 24,
                "net_salary": "11299000",
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 5440000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "hr_director_approval_status": "Menunggu diproses"
            },
            {
                "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                "employee_id": "DSR038",
                "avatar": null,
                "full_name": "tes direktur",
                "periode": "2026-02-19",
                "working_days": 24,
                "net_salary": "10302000",
                "basic_salary": 5000000,
                "deduction_total": 1141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 5443000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "hr_director_approval_status": "Menunggu diproses"
            },
            {
                "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                "employee_id": "DSR039",
                "avatar": null,
                "full_name": "tes direktur",
                "periode": "2026-02-19",
                "working_days": 24,
                "net_salary": "12100000",
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 6241000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "hr_director_approval_status": "Menunggu diproses"
            },
            {
                "payroll_id": "019c75f4-9d94-7124-bebc-302ecc9ba904",
                "employee_id": "DSR040",
                "avatar": null,
                "full_name": "tes bpjs",
                "periode": "2026-02-19",
                "working_days": 24,
                "net_salary": "10485000",
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 4626000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "hr_director_approval_status": "Menunggu diproses"
            }
        ],
        "per_page": 10,
        "to": 7,
        "total": 7
    }
}
 ```
 
 Status: `200 OK`
 
 ---
 
 ### Detail Periode Gajian (HR Direktur)
 
 Endpoint: `GET /api/payroll/payroll-periode/{payroll_id}/detail-directur-hr`

Path Parameters:
- `payroll_id` (string, required) – ID payroll (UUID)

Query Parameters:
- `type` (string, opsional) – nilai: `Mitra` | `Staff`
 
 Response (200 OK):
 ```json
 {
    "meta": {
        "status": 200,
        "message": "Payroll periode detail for HR Director retrieved successfully"
    },
    "data": {
        "information_employee": {
            "payroll_id": "019c75f4-9e9a-7044-a88d-ec18722a8f16",
            "employee_id": "DSR042",
            "full_name": "kita tes",
            "working_days": 24,
            "basic_salary": 5000000,
            "periode": "2026-02-19",
            "employee_category_name": "Staff",
            "company_name": "Dasaria"
        },
        "salary_comparison": {
            "current": {
                "payroll_id": "019c75f4-9e9a-7044-a88d-ec18722a8f16",
                "periode": "2026-02-19",
                "payroll_periode_id": "019c75f4-9b10-7043-b2ba-b54d409b5e6d",
                "working_days": 24,
                "basic_salary": 5000000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 6000,
                "deduction_total": 141000,
                "net_salary": "6341000"
            },
            "previous": null
        },
        "current": {
            "periode": {
                "id": "019c75f4-9b10-7043-b2ba-b54d409b5e6d",
                "payroll_month": "2026-02-19",
                "allowance_imported_at": "true",
                "approval_hr": "true",
                "approval_direktur_hr": "false",
                "approval_direktur_fat": "false",
                "approval_direktur_bod": "false",
                "distribute": "false",
                "closed": "false",
                "created_at": "2026-02-19T12:51:30.000000Z",
                "updated_at": "2026-02-19T13:16:48.000000Z",
                "status_payroll": "open"
            },
            "fixed_allowance_and_deduction": [
                {
                    "id": "019c75f4-9ea0-73c5-bd1a-d1e7615cc940",
                    "payroll_id": "019c75f4-9e9a-7044-a88d-ec18722a8f16",
                    "componen_id": "935190b2-fb3a-11f0-ac6d-54e1ad857d3e",
                    "componen_name": "Tunjangan Jabatan",
                    "amount": "1000000.00"
                },
                {
                    "id": "019c75f4-9ea8-7069-bb68-9ce6af9b0421",
                    "payroll_id": "019c75f4-9e9a-7044-a88d-ec18722a8f16",
                    "componen_id": "019be556-2d43-7252-bd2c-ef105cf0d5f1",
                    "componen_name": "test",
                    "amount": "3000.00"
                },
                {
                    "id": "019c75f4-9eae-7039-a794-d634f9d9ab1a",
                    "payroll_id": "019c75f4-9e9a-7044-a88d-ec18722a8f16",
                    "componen_id": "019be8bd-dda9-73f3-aa86-cff4c5bcd07e",
                    "componen_name": "test",
                    "amount": "3000.00"
                },
                {
                    "id": "019c75f4-9eb3-7270-b4cc-69795f22d0c2",
                    "payroll_id": "019c75f4-9e9a-7044-a88d-ec18722a8f16",
                    "componen_id": "9664bdbb-0c83-43ab-9234-bc0a5cd0bfc7",
                    "componen_name": "Tunjangan BPJS Kesehatan - BPJS Kesehatan",
                    "amount": "164000.00"
                },
                {
                    "id": "019c75f4-9eb7-7145-a445-24fba1fdc8fb",
                    "payroll_id": "019c75f4-9e9a-7044-a88d-ec18722a8f16",
                    "componen_id": "c8892409-0393-460a-b918-b1fd5065b989",
                    "componen_name": "Potongan BPJS Kesehatan - BPJS Kesehatan",
                    "amount": "41000.00"
                },
                {
                    "id": "019c75f4-9ebd-7245-b177-0a1b5a469c01",
                    "payroll_id": "019c75f4-9e9a-7044-a88d-ec18722a8f16",
                    "componen_id": "42a3c8bd-6cab-4f82-b07d-686eb9225038",
                    "componen_name": "Tunjangan BPJS Ketenagakerjaan - BPJS Kematian",
                    "amount": "15000.00"
                },
                {
                    "id": "019c75f4-9ec5-7049-8aaf-30648e53774e",
                    "payroll_id": "019c75f4-9e9a-7044-a88d-ec18722a8f16",
                    "componen_id": "987d9fbb-5192-433f-8809-67ee98471179",
                    "componen_name": "Tunjangan BPJS Ketenagakerjaan - BPJS Kecelakaan Kerja",
                    "amount": "12000.00"
                },
                {
                    "id": "019c75f4-9ecd-7380-8771-2a3f06f51472",
                    "payroll_id": "019c75f4-9e9a-7044-a88d-ec18722a8f16",
                    "componen_id": "de0e1fee-0709-4777-953a-1605a5b24914",
                    "componen_name": "Tunjangan BPJS Ketenagakerjaan - BPJS Hari Tua",
                    "amount": "185000.00"
                },
                {
                    "id": "019c75f4-9ed4-72fa-bbb3-2e0cca42e690",
                    "payroll_id": "019c75f4-9e9a-7044-a88d-ec18722a8f16",
                    "componen_id": "fc89e069-1d5b-4a84-b874-d1ceb339e282",
                    "componen_name": "Tunjangan BPJS Ketenagakerjaan - BPJS Pensiun",
                    "amount": "100000.00"
                },
                {
                    "id": "019c75f4-9edb-7294-a608-9cf3b848f144",
                    "payroll_id": "019c75f4-9e9a-7044-a88d-ec18722a8f16",
                    "componen_id": "86229e8a-976c-46fe-8afd-365a88e18385",
                    "componen_name": "Potongan BPJS Ketenagakerjaan - BPJS Pensiun",
                    "amount": "50000.00"
                },
                {
                    "id": "019c75f4-9ee4-7216-a526-d4bc4ff42920",
                    "payroll_id": "019c75f4-9e9a-7044-a88d-ec18722a8f16",
                    "componen_id": "cb26a194-85f8-47bd-85bf-1293e4a12e5e",
                    "componen_name": "Potongan BPJS Ketenagakerjaan - BPJS Hari Tua",
                    "amount": "50000.00"
                }
            ],
            "non_fixed_allowance": [
                {
                    "id": "019c75f4-9eeb-71d1-85a0-87bdc8dd9a87",
                    "payroll_id": "019c75f4-9e9a-7044-a88d-ec18722a8f16",
                    "componen_id": "019be556-2d43-7252-bd2c-ef105cf0d5f1",
                    "componen_name": null,
                    "amount": 3000
                },
                {
                    "id": "019c75f4-9ef3-7225-bf5c-3b854ffe233e",
                    "payroll_id": "019c75f4-9e9a-7044-a88d-ec18722a8f16",
                    "componen_id": "019be8bd-dda9-73f3-aa86-cff4c5bcd07e",
                    "componen_name": null,
                    "amount": 3000
                }
            ],
            "non_fixed_deduction": []
        },
        "previous": null,
        "gross_calculation": {
            "gross_salary": 6006000,
            "deduction_total": 141000,
            "net_salary": "6341000",
            "note_hr": null,
            "note_bod": null
        }
    }
}
 ```
 
 Status: `200 OK`
 
 ---
 
 ## Operasi Update – Persetujuan Periode Gajian (HR Direktur)
 
 ### Approval HR Direktur
 
 Endpoint: `POST /api/payroll/payroll-periode/approval-hr-directur`
 
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
     "message": "Approval HR Direktur processed successfully"
   },
   "data": {
     "processed": true
   }
 }
 ```
 
 Status: `200 OK`
 
 ---
 
 ## Contoh Request cURL
 
 ### Daftar Periode Gajian (HR Direktur)
 ```bash
 curl -X GET \
   "http://localhost:3000/api/payroll/payroll-periode/index-Directur-HR" \
   -H "Authorization: Bearer <token>"
 ```
 
 ### Detail Periode Gajian (HR Direktur)
 ```bash
 curl -X GET \
   "http://localhost:3000/api/payroll/payroll-periode/019c75f4-9e9a-7044-a88d-ec18722a8f16/detail-directur-hr" \
   -H "Authorization: Bearer <token>"
 ```
 
 ### Approval HR Direktur
 ```bash
 curl -X POST \
   "http://localhost:3000/api/payroll/payroll-periode/approval-hr-directur" \
   -H "Authorization: Bearer <token>" \
   -F "_method=PATCH" \
   -F "payroll_id[0]=019c75f4-9dec-716f-82eb-ac05ee4b41df" \
   -F "payroll_id[1]=019c75f4-9e9a-7044-a88d-ec18722a8f16"
 ```
