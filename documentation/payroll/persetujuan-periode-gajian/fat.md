
 # Kontrak API – Persetujuan Periode Gajian (FAT)
 
 Dokumen ini merinci kontrak API untuk fitur `Persetujuan Periode Gajian` pada modul Payroll (role: FAT). Diselaraskan dengan Postman collection yang tersedia.
 
 ## Konvensi Umum
 
 - Header auth: `Authorization: Bearer <token>` untuk semua endpoint yang memodifikasi data
 - Method: Beberapa endpoint update menggunakan `POST` dengan field `_method: PATCH` (method spoofing)
 - Content-Type: `application/x-www-form-urlencoded` atau `multipart/form-data`
 - Response error: `{ errorCode: string, message: string, details?: any }`
 
 ---
 
 ## Halaman: Persetujuan Periode Gajian (FAT)
 
 ### Daftar Periode Gajian (Antrian Approval FAT)
 
 Endpoint: `GET /api/payroll/payroll-periode/index-FAT`
 
 Response (200 OK):
 ```json
{
    "meta": {
        "status": 200,
        "message": "Data payroll periode FAT retrieved successfully"
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
 
 ### Detail Periode Gajian (FAT)
 
 Endpoint: `GET /api/payroll/payroll-periode/{payroll_id}/detail-fat`
 
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
            "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
            "employee_id": "DSR038",
            "full_name": "tes direktur",
            "working_days": 24,
            "basic_salary": 5000000,
            "periode": "2026-02-19",
            "employee_category_name": "Staff",
            "company_name": "Dasaria"
        },
        "salary_comparison": {
            "current": {
                "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                "periode": "2026-02-19",
                "payroll_periode_id": "019c75f4-9b10-7043-b2ba-b54d409b5e6d",
                "working_days": 24,
                "basic_salary": 5000000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 5443000,
                "deduction_total": 5000,
                "net_salary": "11438000"
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
                    "id": "019c75f4-9ca1-7217-9fc8-c59052ccd8cd",
                    "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                    "componen_id": "935190b2-fb3a-11f0-ac6d-54e1ad857d3e",
                    "componen_name": "Tunjangan Jabatan",
                    "amount": "1000000.00"
                },
                {
                    "id": "019c75f4-9ca7-70a6-825f-2fd66cf76c99",
                    "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                    "componen_id": "71c9d0b0-0174-11f1-ade4-54e1ad857d3e",
                    "componen_name": "Potongan Kasbon",
                    "amount": "1000000.00"
                },
                {
                    "id": "019c75f4-9cae-7004-8faf-7cd5d7c6b759",
                    "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                    "componen_id": "9664bdbb-0c83-43ab-9234-bc0a5cd0bfc7",
                    "componen_name": "Tunjangan BPJS Kesehatan - BPJS Kesehatan",
                    "amount": "164000.00"
                },
                {
                    "id": "019c75f4-9cb4-70ea-a817-d59362c03e82",
                    "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                    "componen_id": "c8892409-0393-460a-b918-b1fd5065b989",
                    "componen_name": "Potongan BPJS Kesehatan - BPJS Kesehatan",
                    "amount": "41000.00"
                },
                {
                    "id": "019c75f4-9cba-729c-af05-f60a5533e6cb",
                    "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                    "componen_id": "42a3c8bd-6cab-4f82-b07d-686eb9225038",
                    "componen_name": "Tunjangan BPJS Ketenagakerjaan - BPJS Kematian",
                    "amount": "15000.00"
                },
                {
                    "id": "019c75f4-9cc0-7300-981b-efd2fb72b77d",
                    "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                    "componen_id": "987d9fbb-5192-433f-8809-67ee98471179",
                    "componen_name": "Tunjangan BPJS Ketenagakerjaan - BPJS Kecelakaan Kerja",
                    "amount": "12000.00"
                },
                {
                    "id": "019c75f4-9cc7-709b-9c21-389124448ad4",
                    "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                    "componen_id": "de0e1fee-0709-4777-953a-1605a5b24914",
                    "componen_name": "Tunjangan BPJS Ketenagakerjaan - BPJS Hari Tua",
                    "amount": "185000.00"
                },
                {
                    "id": "019c75f4-9ccc-7289-b467-5e8db6851d9e",
                    "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                    "componen_id": "fc89e069-1d5b-4a84-b874-d1ceb339e282",
                    "componen_name": "Tunjangan BPJS Ketenagakerjaan - BPJS Pensiun",
                    "amount": "100000.00"
                },
                {
                    "id": "019c75f4-9cd3-72c7-9899-ec3b9b771e62",
                    "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                    "componen_id": "86229e8a-976c-46fe-8afd-365a88e18385",
                    "componen_name": "Potongan BPJS Ketenagakerjaan - BPJS Pensiun",
                    "amount": "50000.00"
                },
                {
                    "id": "019c75f4-9cd9-71e7-bb92-13a9834c2084",
                    "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                    "componen_id": "cb26a194-85f8-47bd-85bf-1293e4a12e5e",
                    "componen_name": "Potongan BPJS Ketenagakerjaan - BPJS Hari Tua",
                    "amount": "50000.00"
                }
            ],
            "non_fixed_allowance": [
                {
                    "id": "019c7603-65ed-70ba-8861-d149cf4b6eff",
                    "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                    "componen_id": "019c6eb7-fa2c-7371-8279-541f3a94e521",
                    "componen_name": null,
                    "amount": 550000
                },
                {
                    "id": "019c7603-65f4-72eb-9338-cad7bc1c2880",
                    "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                    "componen_id": "019c6eb8-d148-71ae-a954-5a62349218bb",
                    "componen_name": null,
                    "amount": 1150000
                },
                {
                    "id": "019c7603-65fd-710f-8b67-e4d231a80cfb",
                    "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                    "componen_id": "019c6eb9-6455-7171-a685-2d1b863288e2",
                    "componen_name": null,
                    "amount": 700000
                },
                {
                    "id": "019c7603-6605-73d8-b501-8311f6a732a3",
                    "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                    "componen_id": "019c6eba-29ac-71a4-8ae4-9b94e6dca3a6",
                    "componen_name": null,
                    "amount": 220000
                },
                {
                    "id": "019c7603-660c-7281-8683-dbdc2437621d",
                    "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                    "componen_id": "019c6eba-86a0-71ea-8a82-016db6f8409b",
                    "componen_name": null,
                    "amount": 160000
                },
                {
                    "id": "019c7603-6615-73a3-9f5e-d52e26cb0869",
                    "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                    "componen_id": "019c6eba-e49a-7315-8e94-bce16246d549",
                    "componen_name": null,
                    "amount": 320000
                },
                {
                    "id": "019c7603-661a-70cb-afd7-805c64b2807a",
                    "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                    "componen_id": "019c6ebb-357e-71ef-92bd-d27272bd7fcc",
                    "componen_name": null,
                    "amount": 110000
                },
                {
                    "id": "019c7603-6620-7229-8d20-38cf3fc0ac02",
                    "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                    "componen_id": "019c6ebb-689c-7373-8213-a53565db82e1",
                    "componen_name": null,
                    "amount": 55000
                },
                {
                    "id": "019c7603-6628-73ad-a00c-a6d1b073a57a",
                    "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                    "componen_id": "019c6ebc-d813-70f9-840a-d8a5be8456fb",
                    "componen_name": null,
                    "amount": 78000
                },
                {
                    "id": "019c7603-6630-7351-8169-201322e61b68",
                    "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                    "componen_id": "019c6ebd-1752-72d6-9894-d702fd60224c",
                    "componen_name": null,
                    "amount": 2100000
                }
            ],
            "non_fixed_deduction": [
                {
                    "id": "019c7a4f-c562-716d-a2e9-d19bf3f0420a",
                    "payroll_id": "019c75f4-9c9d-7379-8317-cda58066bf7b",
                    "componen_id": "019be54d-7d04-72cb-ac68-b7dd95c4adc3",
                    "componen_name": "tes oke",
                    "amount": 5000
                }
            ]
        },
        "previous": null,
        "gross_calculation": {
            "gross_salary": 11443000,
            "deduction_total": 5000,
            "net_salary": "11438000",
            "note_hr": "tes 5",
            "note_bod": "tes 6"
        }
    }
}
 ```
 
 Status: `200 OK`
 
 ---
 
 ## Operasi Update – Persetujuan Periode Gajian (FAT)
 
 ### Approval FAT
 
 Endpoint: `POST /api/payroll/payroll-periode/approval-fat`
 
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
     "message": "Approval FAT processed successfully"
   },
   "data": {
     "processed": true
   }
 }
 ```
 
 Status: `200 OK`
 
 ---
 
 ## Contoh Request cURL
 
 ### Daftar Periode Gajian (FAT)
 ```bash
 curl -X GET \
   "http://localhost:3000/api/payroll/payroll-periode/index-FAT" \
   -H "Authorization: Bearer <token>"
 ```
 
 ### Detail Periode Gajian (FAT)
 ```bash
 curl -X GET \
   "http://localhost:3000/api/payroll/payroll-periode/019c75f4-9c9d-7379-8317-cda58066bf7b/detail-fat" \
   -H "Authorization: Bearer <token>"
 ```
 
 ### Approval FAT
 ```bash
 curl -X POST \
   "http://localhost:3000/api/payroll/payroll-periode/approval-fat" \
   -H "Authorization: Bearer <token>" \
   -F "_method=PATCH" \
   -F "payroll_id[0]=019c75f4-9bb7-710e-b1e1-cc57bdded9ff" \
   -F "payroll_id[1]=019c75f4-9c10-735e-aa56-78e790a2c2ef"
 ```
