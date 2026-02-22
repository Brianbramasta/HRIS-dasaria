
 # Kontrak API – Persetujuan Periode Gajian (BOD)
 
 Dokumen ini merinci kontrak API untuk fitur `Persetujuan Periode Gajian` pada modul Payroll (role: BOD). Diselaraskan dengan Postman collection yang tersedia.
 
 ## Konvensi Umum
 
 - Header auth: `Authorization: Bearer <token>` untuk semua endpoint yang memodifikasi data
 - Method: Beberapa endpoint update menggunakan `POST` dengan field `_method: PATCH` (method spoofing)
 - Content-Type: `application/x-www-form-urlencoded` atau `multipart/form-data`
 - Response error: `{ errorCode: string, message: string, details?: any }`
 
 ---
 
 ## Halaman: Persetujuan Periode Gajian (BOD)
 
 ### Daftar Periode Gajian (Antrian Approval BOD)
 
 Endpoint: `GET /api/payroll/payroll-periode/index-BOD`
 
 Response (200 OK):
 ```json
 {
    "meta": {
        "status": 200,
        "message": "Data payroll periode BOD retrieved successfully"
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
                "net_salary": "10984000",
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 5125000,
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
                "net_salary": "10984000",
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 5125000,
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
                "net_salary": "11299000",
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 5440000,
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
                "net_salary": "10302000",
                "basic_salary": 5000000,
                "deduction_total": 1141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 5443000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Selesai"
            },
            {
                "payroll_id": "019c7a5e-2451-7107-8e51-3f73645de761",
                "employee_id": "DSR039",
                "avatar": null,
                "full_name": "tes direktur",
                "periode": "2026-02-20",
                "working_days": 24,
                "net_salary": "12094000",
                "basic_salary": 5000000,
                "deduction_total": 141000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 6235000,
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Selesai"
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
                "payroll_status_name": "Menunggu diproses BOD"
            }
        ],
        "per_page": 10,
        "to": 6,
        "total": 6
    }
}
 ```
 
 Status: `200 OK`
 
 ---
 
 ### Detail Periode Gajian (BOD)
 
 Endpoint: `GET /api/payroll/payroll-periode/{payroll_id}/detail-bod`
 
 Path Parameters:
 - `payroll_id` (string, required) – ID payroll (UUID)
 
 Response (200 OK):
 ```json
 {
    "meta": {
        "status": 200,
        "message": "Payroll periode detail for approval retrieved successfully"
    },
    "data": {
        "information_employee": {
            "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
            "employee_id": "DSR035",
            "full_name": "tes direktur",
            "working_days": 24,
            "basic_salary": 5000000,
            "periode": "2026-02-19",
            "employee_category_name": "Staff",
            "company_name": "Dasaria"
        },
        "salary_comparison": {
            "current": {
                "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                "periode": "2026-02-19",
                "payroll_periode_id": "019c75f4-9b10-7043-b2ba-b54d409b5e6d",
                "working_days": 24,
                "basic_salary": 5000000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 5125000,
                "deduction_total": 141000,
                "net_salary": "10984000"
            },
            "previous": null
        },
        "current": {
            "periode": {
                "id": "019c75f4-9b10-7043-b2ba-b54d409b5e6d",
                "payroll_month": "2026-02-19",
                "allowance_imported_at": "true",
                "approval_hr": "true",
                "approval_direktur_hr": "true",
                "approval_direktur_fat": "true",
                "approval_direktur_bod": "true",
                "distribute": "true",
                "closed": "true",
                "created_at": "2026-02-19T12:51:30.000000Z",
                "updated_at": "2026-02-20T09:58:04.000000Z",
                "status_payroll": "closed"
            },
            "fixed_allowance_and_deduction": [
                {
                    "id": "019c75f4-9bbc-7265-beda-d526800ef4fd",
                    "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                    "componen_id": "935190b2-fb3a-11f0-ac6d-54e1ad857d3e",
                    "componen_name": "Tunjangan Jabatan",
                    "amount": "1000000.00"
                },
                {
                    "id": "019c75f4-9bc0-701c-afda-11b095440580",
                    "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                    "componen_id": "9664bdbb-0c83-43ab-9234-bc0a5cd0bfc7",
                    "componen_name": "Tunjangan BPJS Kesehatan - BPJS Kesehatan",
                    "amount": "164000.00"
                },
                {
                    "id": "019c75f4-9bc4-7158-a979-b288fbaf3eb5",
                    "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                    "componen_id": "c8892409-0393-460a-b918-b1fd5065b989",
                    "componen_name": "Potongan BPJS Kesehatan - BPJS Kesehatan",
                    "amount": "41000.00"
                },
                {
                    "id": "019c75f4-9bc9-73fd-91c6-8fbc0526f7d2",
                    "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                    "componen_id": "42a3c8bd-6cab-4f82-b07d-686eb9225038",
                    "componen_name": "Tunjangan BPJS Ketenagakerjaan - BPJS Kematian",
                    "amount": "15000.00"
                },
                {
                    "id": "019c75f4-9bd1-7183-98f9-0797e2096d34",
                    "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                    "componen_id": "987d9fbb-5192-433f-8809-67ee98471179",
                    "componen_name": "Tunjangan BPJS Ketenagakerjaan - BPJS Kecelakaan Kerja",
                    "amount": "12000.00"
                },
                {
                    "id": "019c75f4-9bd8-72ae-8054-94f1c4698864",
                    "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                    "componen_id": "de0e1fee-0709-4777-953a-1605a5b24914",
                    "componen_name": "Tunjangan BPJS Ketenagakerjaan - BPJS Hari Tua",
                    "amount": "185000.00"
                },
                {
                    "id": "019c75f4-9bde-7272-a577-687c8a2dd805",
                    "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                    "componen_id": "fc89e069-1d5b-4a84-b874-d1ceb339e282",
                    "componen_name": "Tunjangan BPJS Ketenagakerjaan - BPJS Pensiun",
                    "amount": "100000.00"
                },
                {
                    "id": "019c75f4-9be5-7377-8663-f3bd09f97fb1",
                    "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                    "componen_id": "86229e8a-976c-46fe-8afd-365a88e18385",
                    "componen_name": "Potongan BPJS Ketenagakerjaan - BPJS Pensiun",
                    "amount": "50000.00"
                },
                {
                    "id": "019c75f4-9bec-71c5-bb80-1465864cff2d",
                    "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                    "componen_id": "cb26a194-85f8-47bd-85bf-1293e4a12e5e",
                    "componen_name": "Potongan BPJS Ketenagakerjaan - BPJS Hari Tua",
                    "amount": "50000.00"
                }
            ],
            "non_fixed_allowance": [
                {
                    "id": "019c7603-6521-7319-86b2-8d11135605ea",
                    "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                    "componen_id": "019c6eb7-fa2c-7371-8279-541f3a94e521",
                    "componen_name": null,
                    "amount": 500000
                },
                {
                    "id": "019c7603-654f-705f-9c75-73febfa921f1",
                    "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                    "componen_id": "019c6eb8-d148-71ae-a954-5a62349218bb",
                    "componen_name": null,
                    "amount": 1000000
                },
                {
                    "id": "019c7603-6556-71d6-bfba-9808afec5fac",
                    "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                    "componen_id": "019c6eb9-6455-7171-a685-2d1b863288e2",
                    "componen_name": null,
                    "amount": 750000
                },
                {
                    "id": "019c7603-655b-72f7-9226-7161dea91a2a",
                    "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                    "componen_id": "019c6eba-29ac-71a4-8ae4-9b94e6dca3a6",
                    "componen_name": null,
                    "amount": 200000
                },
                {
                    "id": "019c7603-6564-7338-883c-b75622e4b25e",
                    "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                    "componen_id": "019c6eba-86a0-71ea-8a82-016db6f8409b",
                    "componen_name": null,
                    "amount": 150000
                },
                {
                    "id": "019c7603-656b-71f1-9e4b-7f1694a49c77",
                    "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                    "componen_id": "019c6eba-e49a-7315-8e94-bce16246d549",
                    "componen_name": null,
                    "amount": 300000
                },
                {
                    "id": "019c7603-6574-7231-9516-cce578e643a9",
                    "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                    "componen_id": "019c6ebb-357e-71ef-92bd-d27272bd7fcc",
                    "componen_name": null,
                    "amount": 100000
                },
                {
                    "id": "019c7603-657a-72ef-8111-124fcefcf63c",
                    "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                    "componen_id": "019c6ebb-689c-7373-8213-a53565db82e1",
                    "componen_name": null,
                    "amount": 50000
                },
                {
                    "id": "019c7603-6580-7203-a832-02bac198b630",
                    "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                    "componen_id": "019c6ebc-d813-70f9-840a-d8a5be8456fb",
                    "componen_name": null,
                    "amount": 75000
                },
                {
                    "id": "019c7603-6586-72f3-b7a1-208fd141693f",
                    "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                    "componen_id": "019c6ebd-1752-72d6-9894-d702fd60224c",
                    "componen_name": null,
                    "amount": 2000000
                }
            ],
            "non_fixed_deduction": []
        },
        "previous": null,
        "gross_calculation": {
            "gross_salary": 11125000,
            "deduction_total": 141000,
            "net_salary": "10984000",
            "note_hr": "tes 1",
            "note_bod": "tes 2"
        }
    }
}
 ```
 
 Status: `200 OK`
 
 ---
 
 ## Operasi Update – Persetujuan Periode Gajian (BOD)
 
 ### Approval BOD
 
 Endpoint: `POST /api/payroll/payroll-periode/approval-bod`
 
 Method Spoofing: gunakan `_method: PATCH` pada form data
 
 Request Body (form-data):
 - `_method` (text, required) – nilai: `PATCH`
 - `payroll_id[0]` (text, opsional) – ID payroll yang akan di-approve
 - `payroll_id[1]` (text, opsional) – ulangi sesuai jumlah data yang diproses
 - `all` (text, opsional) – jika diisi, server dapat memproses seluruh data (berdasarkan implementasi backend)
 
 Response (200 OK):
 ```json
 {
   "meta": {
     "status": 200,
     "message": "Approval BOD processed successfully"
   },
   "data": {
     "processed": true
   }
 }
 ```
 
 Status: `200 OK`
 
 ---
 
 ## Contoh Request cURL
 
 ### Daftar Periode Gajian (BOD)
 ```bash
 curl -X GET \
   "http://localhost:3000/api/payroll/payroll-periode/index-BOD" \
   -H "Authorization: Bearer <token>"
 ```
 
 ### Detail Periode Gajian (BOD)
 ```bash
 curl -X GET \
   "http://localhost:3000/api/payroll/payroll-periode/019c75f4-9bb7-710e-b1e1-cc57bdded9ff/detail-bod" \
   -H "Authorization: Bearer <token>"
 ```
 
 ### Approval BOD
 ```bash
 curl -X POST \
   "http://localhost:3000/api/payroll/payroll-periode/approval-bod" \
   -H "Authorization: Bearer <token>" \
   -F "_method=PATCH" \
   -F "payroll_id[0]=019c75f4-9bb7-710e-b1e1-cc57bdded9ff"
 ```
