
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

Query Parameters:
- `type` (string, opsional) – nilai: `Mitra` | `Staff`
 
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
 
### Detail Periode Gajian (FAT)
 
Endpoint: `GET /api/payroll/payroll-periode/{payroll_id}/detail-fat`

Path Parameters:
- `payroll_id` (string, required) – ID payroll (UUID)

Query Parameters:
- `type` (string, opsional) – nilai: `Mitra` | `Staff`
 
Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Payroll periode detail for approval retrieved successfully"
    },
    "data": {
        "information_employee": {
            "payroll_id": "019c7a5e-2451-7107-8e51-3f73645de761",
            "employee_id": "DSR039",
            "full_name": "tes direktur",
            "working_days": 24,
            "basic_salary": 5000000,
            "periode": "2026-02-20",
            "employee_category_name": "Staff",
            "company_name": "Dasaria"
        },
        "current": {
            "salary_comparison": {
                "payroll_id": "019c7a5e-2451-7107-8e51-3f73645de761",
                "periode": "2026-02-20",
                "payroll_periode_id": "019c7a5e-22bd-71ab-a5ae-a7238e5104b6",
                "working_days": 24,
                "basic_salary": 5000000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 6235000,
                "deduction_total": 5000,
                "net_salary": "12230000",
                "note_hr": "tes 7",
                "note_bod": "tes 8"
            },
            "periode": {
                "id": "019c7a5e-22bd-71ab-a5ae-a7238e5104b6",
                "payroll_month": "2026-02-20",
                "allowance_imported_at": "true",
                "approval_hr": "true",
                "approval_direktur_hr": "true",
                "approval_direktur_fat": "true",
                "approval_direktur_bod": "true",
                "distribute": "true",
                "closed": "true",
                "type": null,
                "created_at": "2026-02-20T09:25:15.000000Z",
                "updated_at": "2026-02-21T15:01:11.000000Z",
                "status_payroll": "open"
            },
            "fixed_allowance": [
                {
                    "id": "019c7a5e-2457-729d-90f9-d1587bf6e745",
                    "payroll_id": "019c7a5e-2451-7107-8e51-3f73645de761",
                    "componen_id": "935190b2-fb3a-11f0-ac6d-54e1ad857d3e",
                    "componen_name": "Tunjangan Jabatan",
                    "amount": "1000000.00"
                }
            ],
            "fixed_deduction": [],
            "non_fixed_allowance": [
                {
                    "id": "019c7a7c-023f-71d6-8a85-934fbf9b611b",
                    "payroll_id": "019c7a5e-2451-7107-8e51-3f73645de761",
                    "componen_id": "019c6eb7-fa2c-7371-8279-541f3a94e521",
                    "componen_name": null,
                    "amount": 700000
                },
                {
                    "id": "019c7a7c-0245-73d7-8ebd-0192a18731bd",
                    "payroll_id": "019c7a5e-2451-7107-8e51-3f73645de761",
                    "componen_id": "019c6eb8-d148-71ae-a954-5a62349218bb",
                    "componen_name": null,
                    "amount": 1300000
                },
                {
                    "id": "019c7a7c-024a-7285-b106-869edae71f9e",
                    "payroll_id": "019c7a5e-2451-7107-8e51-3f73645de761",
                    "componen_id": "019c6eb9-6455-7171-a685-2d1b863288e2",
                    "componen_name": null,
                    "amount": 850000
                },
                {
                    "id": "019c7a7c-024f-7373-a1bc-de3daf8f5d51",
                    "payroll_id": "019c7a5e-2451-7107-8e51-3f73645de761",
                    "componen_id": "019c6eba-29ac-71a4-8ae4-9b94e6dca3a6",
                    "componen_name": null,
                    "amount": 300000
                },
                {
                    "id": "019c7a7c-0256-71c3-86e6-9aefcc22733b",
                    "payroll_id": "019c7a5e-2451-7107-8e51-3f73645de761",
                    "componen_id": "019c6eba-86a0-71ea-8a82-016db6f8409b",
                    "componen_name": null,
                    "amount": 200000
                },
                {
                    "id": "019c7a7c-025b-72ca-aa66-00b883447d38",
                    "payroll_id": "019c7a5e-2451-7107-8e51-3f73645de761",
                    "componen_id": "019c6eba-e49a-7315-8e94-bce16246d549",
                    "componen_name": null,
                    "amount": 400000
                },
                {
                    "id": "019c7a7c-0264-7210-9df5-d67aaddd6c37",
                    "payroll_id": "019c7a5e-2451-7107-8e51-3f73645de761",
                    "componen_id": "019c6ebb-357e-71ef-92bd-d27272bd7fcc",
                    "componen_name": null,
                    "amount": 130000
                },
                {
                    "id": "019c7a7c-026d-736a-bd69-f55e4bd0fcdf",
                    "payroll_id": "019c7a5e-2451-7107-8e51-3f73645de761",
                    "componen_id": "019c6ebb-689c-7373-8213-a53565db82e1",
                    "componen_name": null,
                    "amount": 65000
                },
                {
                    "id": "019c7a7c-0276-7196-8494-455a95c13fe9",
                    "payroll_id": "019c7a5e-2451-7107-8e51-3f73645de761",
                    "componen_id": "019c6ebc-d813-70f9-840a-d8a5be8456fb",
                    "componen_name": null,
                    "amount": 90000
                },
                {
                    "id": "019c7a7c-027d-73e1-b942-082d348867cf",
                    "payroll_id": "019c7a5e-2451-7107-8e51-3f73645de761",
                    "componen_id": "019c6ebd-1752-72d6-9894-d702fd60224c",
                    "componen_name": null,
                    "amount": 2200000
                }
            ],
            "non_fixed_deduction": [
                {
                    "id": "019c898a-94dc-7293-84ca-4b0aa1c4bbf8",
                    "payroll_id": "019c7a5e-2451-7107-8e51-3f73645de761",
                    "componen_id": "019be54d-7d04-72cb-ac68-b7dd95c4adc3",
                    "componen_name": "tes oke",
                    "amount": 5000
                }
            ]
        },
        "previous": {
            "salary_comparison": {
                "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                "periode": "2026-02-19",
                "payroll_periode_id": "019c75f4-9b10-7043-b2ba-b54d409b5e6d",
                "working_days": 24,
                "basic_salary": 5000000,
                "allowance_total": 1000000,
                "non_fixed_allowance_total": 6241000,
                "deduction_total": 5000,
                "net_salary": "12236000",
                "note_hr": "tes 7",
                "note_bod": "tes 8"
            },
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
                "type": null,
                "created_at": "2026-02-19T12:51:30.000000Z",
                "updated_at": "2026-02-20T09:58:04.000000Z",
                "status_payroll": "closed"
            },
            "fixed_allowance": [
                {
                    "id": "019c75f4-9d1c-70ba-8f1c-24a202f5b67e",
                    "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                    "componen_id": "935190b2-fb3a-11f0-ac6d-54e1ad857d3e",
                    "componen_name": "Tunjangan Jabatan",
                    "amount": "1000000.00"
                },
                {
                    "id": "019c75f4-9d30-70d5-836e-35af29e8cb09",
                    "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                    "componen_id": "9664bdbb-0c83-43ab-9234-bc0a5cd0bfc7",
                    "componen_name": "Tunjangan BPJS Kesehatan - BPJS Kesehatan",
                    "amount": "164000.00"
                },
                {
                    "id": "019c75f4-9d3b-708a-a3fd-4fa45b8426f2",
                    "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                    "componen_id": "42a3c8bd-6cab-4f82-b07d-686eb9225038",
                    "componen_name": "Tunjangan BPJS Ketenagakerjaan - BPJS Kematian",
                    "amount": "15000.00"
                },
                {
                    "id": "019c75f4-9d40-72ac-ac9b-a731dc179045",
                    "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                    "componen_id": "987d9fbb-5192-433f-8809-67ee98471179",
                    "componen_name": "Tunjangan BPJS Ketenagakerjaan - BPJS Kecelakaan Kerja",
                    "amount": "12000.00"
                },
                {
                    "id": "019c75f4-9d44-73d3-b3f0-66a682944395",
                    "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                    "componen_id": "de0e1fee-0709-4777-953a-1605a5b24914",
                    "componen_name": "Tunjangan BPJS Ketenagakerjaan - BPJS Hari Tua",
                    "amount": "185000.00"
                },
                {
                    "id": "019c75f4-9d4a-7341-ab69-cc02268f2da7",
                    "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                    "componen_id": "fc89e069-1d5b-4a84-b874-d1ceb339e282",
                    "componen_name": "Tunjangan BPJS Ketenagakerjaan - BPJS Pensiun",
                    "amount": "100000.00"
                }
            ],
            "fixed_deduction": [
                {
                    "id": "019c75f4-9d35-7309-9ef2-ef841809817d",
                    "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                    "componen_id": "c8892409-0393-460a-b918-b1fd5065b989",
                    "componen_name": "Potongan BPJS Kesehatan - BPJS Kesehatan",
                    "amount": "41000.00"
                },
                {
                    "id": "019c75f4-9d4f-7076-b6c2-0199fc90cd52",
                    "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                    "componen_id": "86229e8a-976c-46fe-8afd-365a88e18385",
                    "componen_name": "Potongan BPJS Ketenagakerjaan - BPJS Pensiun",
                    "amount": "50000.00"
                },
                {
                    "id": "019c75f4-9d54-712b-b6d4-46adce439056",
                    "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                    "componen_id": "cb26a194-85f8-47bd-85bf-1293e4a12e5e",
                    "componen_name": "Potongan BPJS Ketenagakerjaan - BPJS Hari Tua",
                    "amount": "50000.00"
                }
            ],
            "non_fixed_allowance": [
                {
                    "id": "019c75f4-9d59-71c1-b29b-0a66595a5244",
                    "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                    "componen_id": "019be556-2d43-7252-bd2c-ef105cf0d5f1",
                    "componen_name": null,
                    "amount": 3000
                },
                {
                    "id": "019c75f4-9d5f-71d8-8902-4579153a904d",
                    "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                    "componen_id": "019be8bd-dda9-73f3-aa86-cff4c5bcd07e",
                    "componen_name": null,
                    "amount": 3000
                },
                {
                    "id": "019c7603-6651-7061-a4bd-a28cfbda0146",
                    "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                    "componen_id": "019c6eb7-fa2c-7371-8279-541f3a94e521",
                    "componen_name": null,
                    "amount": 700000
                },
                {
                    "id": "019c7603-665a-712b-ab58-456fd0bfe05f",
                    "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                    "componen_id": "019c6eb8-d148-71ae-a954-5a62349218bb",
                    "componen_name": null,
                    "amount": 1300000
                },
                {
                    "id": "019c7603-6662-73de-945e-0008903c0a82",
                    "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                    "componen_id": "019c6eb9-6455-7171-a685-2d1b863288e2",
                    "componen_name": null,
                    "amount": 850000
                },
                {
                    "id": "019c7603-6669-7097-a570-a87596a5e404",
                    "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                    "componen_id": "019c6eba-29ac-71a4-8ae4-9b94e6dca3a6",
                    "componen_name": null,
                    "amount": 300000
                },
                {
                    "id": "019c7603-666e-71b4-bc77-9e1b5b587292",
                    "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                    "componen_id": "019c6eba-86a0-71ea-8a82-016db6f8409b",
                    "componen_name": null,
                    "amount": 200000
                },
                {
                    "id": "019c7603-6673-70a0-8678-13225e67ed04",
                    "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                    "componen_id": "019c6eba-e49a-7315-8e94-bce16246d549",
                    "componen_name": null,
                    "amount": 400000
                },
                {
                    "id": "019c7603-667a-7087-b80a-34e1480396c3",
                    "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                    "componen_id": "019c6ebb-357e-71ef-92bd-d27272bd7fcc",
                    "componen_name": null,
                    "amount": 130000
                },
                {
                    "id": "019c7603-667e-7105-80ec-36b2cd5dcf8b",
                    "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                    "componen_id": "019c6ebb-689c-7373-8213-a53565db82e1",
                    "componen_name": null,
                    "amount": 65000
                },
                {
                    "id": "019c7603-6683-734e-969f-682bb1214d1b",
                    "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                    "componen_id": "019c6ebc-d813-70f9-840a-d8a5be8456fb",
                    "componen_name": null,
                    "amount": 90000
                },
                {
                    "id": "019c7603-668c-715a-9d59-1c8bffbf5f05",
                    "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                    "componen_id": "019c6ebd-1752-72d6-9894-d702fd60224c",
                    "componen_name": null,
                    "amount": 2200000
                }
            ],
            "non_fixed_deduction": [
                {
                    "id": "019c898d-aa6a-7176-99b8-268a035ebf44",
                    "payroll_id": "019c75f4-9d18-7003-8585-7ecf60b5b251",
                    "componen_id": "019be54d-7d04-72cb-ac68-b7dd95c4adc3",
                    "componen_name": "tes oke",
                    "amount": 5000
                }
            ]
        },
        "gross_calculation": {
            "gross_salary": 12235000,
            "deduction_total": 5000,
            "net_salary": "12230000",
            "note_hr": "tes 7",
            "note_bod": "tes 8"
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
