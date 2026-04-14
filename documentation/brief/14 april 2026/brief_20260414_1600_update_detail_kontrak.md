# Brief: update  detail kontrak
Tanggal: 14 april 2026 16:00

---
# Context
- pastikan popup detail mengambil data dari response endpoint
- dokument kontrak mengambil dari field `file_contract`
- dokument lampiran mengambil dari field `document_lampiran`
- dokumen berakhir mengambil dari field `document`


# endpoint 
- GET /api/employee-master-data/employees/contracts/:contract_id/show-contract
- response: 
```json
{
    "meta": {
        "status": 200,
        "message": "berhasil mendapatkan data kontrak untuk edit"
    },
    "data": {
        "id": "019cf0cc-0d50-7302-a10d-1e742e571910",
        "employee_id": "DSR048",
        "contract_status": "Aktif",
        "last_contract_signed_date": "2025-01-20",
        "end_date": "2027-07-21T17:00:00.000000Z",
        "contract_type_id": "86b58efc-b8df-43f6-a634-917f08c02efc",
        "contract_number": 1,
        "file_contract": "hris/employee/documents/contracts/PKWT_PKWTT_DSR048_15032026_1773566430.pdf",
        "note_hr": "tes",
        "document_lampiran": "hris/ApplicationDocument/Resignation/document_lampiran_14042026_1776140388.pdf",
        "resign_id": "019d8a35-9e2c-71d8-8adb-81f6995ca0fa",
        "termination_id": "019d8a70-b045-703d-9616-26d7d045fd2d",
        "description": "tes",
        "document": "hris/EmployeeMasterData/Resignation/TerminationDocument/dummy-pdf_22.pdf_14042026_1776144132.pdf.pdf",
        "contract_end_status_name": null,
        "remaining_month": "15 bulan 8 hari",
        "employee": {
            "id": "DSR048",
            "full_name": "g",
            "avatar": "EmployeeMasterData/Avatar/4e98607a-f1f8-48d6-b70f-fa314d6e3dd7.jpeg",
            "national_id": "45678",
            "email": "y@m.c",
            "religion": null,
            "religion_id": "ba20c832-8eb7-4ff7-ab78-68484755f7ef",
            "blood_type": "A",
            "birth_place": "j",
            "birth_date": "2026-03-26",
            "last_education": null,
            "last_education_id": "3069b74f-034b-44ff-8de6-3292b364078a",
            "marital_status": "Menikah",
            "gender": "Perempuan",
            "household_dependents": 3,
            "phone_number": "8",
            "current_address": "8",
            "ktp_address": "7",
            "bank_account_number": "56789",
            "bank_name": null,
            "bank_account_holder": "h",
            "npwp": null,
            "ptkp_id": "205ff4d2-71a9-4a97-8287-87d5f34b1fa7",
            "bpjs_employment_number": null,
            "bpjs_employment_status": "Aktif",
            "bpjs_health_number": null,
            "bpjs_health_status": "Aktif",
            "bpjs_health_type_id": "1d9d2444-2f86-45c3-8469-0b62026fed05",
            "employment_status": null,
            "resignation_status": null,
            "resignation_status_id": null,
            "payroll_status": "Tidak Aktif",
            "user_access": null,
            "bank_id": "2dadc10c-e891-4b93-b400-4c8ef32aaff7",
            "employment_status_id": "88af828e-6ace-4e51-99a1-05b54914dde7",
            "employee_category_id": "21edeb66-898c-484a-bff6-3d3e778f64fb",
            "deleted_at": null,
            "created_at": "2026-03-15T15:36:13.000000Z",
            "updated_at": "2026-03-15T15:36:13.000000Z"
        },
        "contract_type": {
            "id": "86b58efc-b8df-43f6-a634-917f08c02efc",
            "name": "PKWT",
            "deleted_at": null,
            "created_at": "2025-12-30 11:26:37",
            "updated_at": "2025-12-30 11:26:37"
        }
    }
}