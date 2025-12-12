<!-- Dibuat sesuai HRIS-Dasaria.postman_collection 2; mencakup Create Karyawan dan dropdown terkait -->
# Karyawan

<!-- Endpoint Create Karyawan dari collection 2 -->
## Create Karyawan

URL: `http://127.0.0.1:8000/api/employee-master-data/employees`
Method: POST
Body (form-data):

- `full_name`
- `national_id`
- `email`
- `religion` (1=islam, 2=protestant, 3=catholic, 4=hindu, 5=buddhist, 6=confucianism)
- `blood_type`
- `birth_place`
- `birth_date`
- `last_education` (1=sd, 2=smp, 3=sma, 4=d1, 5=d2, 6=d3, 7=s1, 8=s2, 9=s3)
- `marital_status` (1=single, 2=married)
- `gender` (1=male, 2=female)
- `household_dependents`
- `phone_number`
- `current_address`
- `ktp_address`
- `bank_account_number`
- `bank_name`
- `bank_account_holder`
- `npwp`
- `ptkp_id`
- `bpjs_employment_number`
- `bpjs_employment_status` (1=active, 2=inactive)
- `bpjs_health_number`
- `bpjs_health_status` (1=active, 2=inactive)
- `employment_status` (1=active, 2=inactive)
- `documents[0][file_type]` (1: pengalaman kerja, 2: pakta integritas, 3: PKWT/PKWTT, 4: perjanjian bersama, 5: lainnya)
- `documents[0][file]` (file)
- `education_formal_detail[0][education_level]` (lihat `last_education` enum)
- `education_formal_detail[0][institution_name]`
- `education_formal_detail[0][degree]`
- `education_formal_detail[0][final_grade]`
- `education_formal_detail[0][major]`
- `education_formal_detail[0][graduation_year]`
- `id_company`
- `id_office`
- `id_directorate`
- `id_division`
- `id_department`
- `id_position`
- `id_job_title`
- `start_date`
- `end_date`
- `position_level` (1=General, 2=Junior, 3=Middle, 4=Senior)
- `payroll_status` (1=Active, 2=Inactive, 3=Suspended)
- `employee_category` (1=Non-Staff, 2=Staff, 3=Partner)
- `non_formal_education[0][certificate_name]`
- `non_formal_education[0][institution_name]`
- `non_formal_education[0][start_date]`
- `non_formal_education[0][end_date]`
- `non_formal_education[0][certificate_id]`
- `non_formal_education[0][certificate_file]` (file)
- `facebook_name`
- `instagram_name`
- `linkedin_name`
- `twitter_name`
- `relative_social_media`
- `emergency_contact_number`
- `emergency_contact_name`
- `emergency_contact_relationship`

<!-- Dropdown dependensi untuk form Karyawan dari collection 2 -->
## Dropdown Division by Directorate

URL: `http://127.0.0.1:8000/api/employee-master-data/division/{id_directorate}`
Method: GET
```
{
    "meta": {
        "status": 200,
        "message": "Success get divisions"
    },
    "data": [
        {
            "id": "019ae833-9eee-71a2-929f-918f233f6d4e",
            "division_name": "ini divis 2"
        },
        {
            "id": "019ae8a3-11de-7361-8643-e0e0166a1c03",
            "division_name": "test"
        },
        {
            "id": "019ae88e-c9e8-70dd-8ae7-2355d3d078c1",
            "division_name": "test brian 4"
        },
        {
            "id": "019ae890-e026-734b-a932-dba7c8dbf88f",
            "division_name": "test brian 4"
        }
    ]
}
```

## Dropdown Departemen by Division

URL: `http://127.0.0.1:8000/api/employee-master-data/department/{id_division}`
Method: GET
```
{
    "meta": {
        "status": 200,
        "message": "Success get departments"
    },
    "data": [
        {
            "id": "019aed99-53bc-71af-aa7f-07b317ff29d8",
            "department_name": "Finance & Accounting"
        }
    ]
}
```

## Dropdown Jabatan + Golongan

URL: `http://127.0.0.1:8000/api/employee-master-data/jabatan-dropdown`
Method: GET
Query (opsional):
- `search`

Response (contoh):
```
{
  "meta": { "status": 200, "message": "Success get job title for dropdown" },
  "data": [
    { "id_job_title": "019a...", "job_title_name": "Manager" },
    { "id_job_title": "019b...", "job_title_name": "Staff" }
  ]
}
```
