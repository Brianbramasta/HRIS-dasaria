# Data Master Karyawan

## List Karyawan

**URL:** `{{base_url}}/api/employee-master-data/employees`  
**Method:** GET

**Query (opsional):**

- `search` - Pencarian berdasarkan nama, NIK, email
- `sort` - Urutan: `asc` atau `desc`
- `column` - Kolom untuk sorting (default: `created_at`)
- `per_page` - Jumlah data per halaman (default: 10)
- `page` - Nomor halaman
- `filter[]` - Filter berdasarkan kriteria tertentu

**Response:**

```json
{
  "meta": { "status": 200, "message": "Success get employees" },
  "data": {
    "current_page": 1,
    "data": [
      {
        "id_employee": "019b0b60-173a-7260-a049-d494f5707e8c",
        "full_name": "John Doe",
        "national_id": "1234567890",
        "email": "john@example.com",
        "position": "Software Engineer",
        "department": "IT Department"
      }
    ],
    "per_page": 10,
    "total": 50
  }
}
```

---

## Get Detail Karyawan

**URL:** `{{base_url}}/api/employee-master-data/employees/{id_employee}`  
**Method:** GET

---

## Create Karyawan

**URL:** `{{base_url}}/api/employee-master-data/employees`  
**Method:** POST  
**Content-Type:** `multipart/form-data`

**Body (form-data):**

**Data Pribadi:**

- `full_name` (required)
- `national_id` (required)
- `email` (required)
- `religion` (required) - 1=Islam, 2=Protestant, 3=Catholic, 4=Hindu, 5=Buddhist, 6=Confucianism
- `blood_type`
- `birth_place` (required)
- `birth_date` (required) - Format: YYYY-MM-DD
- `last_education` (required) - 1=SD, 2=SMP, 3=SMA, 4=D1, 5=D2, 6=D3, 7=S1, 8=S2, 9=S3
- `marital_status` (required) - 1=Single, 2=Married
- `gender` (required) - 1=Male, 2=Female
- `household_dependents`
- `phone_number` (required)
- `current_address` (required)
- `ktp_address` (required)

**Data Finansial & Pajak:**

- `bank_account_number` (required)
- `bank_name` (required)
- `bank_account_holder` (required)
- `npwp`
- `ptkp_id` (required)

**Data BPJS:**

- `bpjs_employment_number`
- `bpjs_employment_status` - 1=Active, 2=Inactive
- `bpjs_health_number`
- `bpjs_health_status` - 1=Active, 2=Inactive

**Dokumen (Array):**

- `documents[0][file_type]` - 1=SK Pengalaman, 2=Pakta Integritas, 3=PKWT/PKWTT, 4=SPB, 5=Lainnya
- `documents[0][file]` (file)

**Pendidikan Formal (Array):**

- `education_formal_detail[0][education_level]`
- `education_formal_detail[0][institution_name]`
- `education_formal_detail[0][degree]`
- `education_formal_detail[0][final_grade]`
- `education_formal_detail[0][major]`
- `education_formal_detail[0][graduation_year]`

**Data Organisasi:**

- `company_id` (required)
- `office_id` (required)
- `directorate_id` (required)
- `division_id` (required)
- `department_id` (required)
- `position_id` (required)
- `job_title_id` (required)
- `start_date` (required) - Format: YYYY-MM-DD
- `end_date`
- `position_level` (required) - 1=General, 2=Junior, 3=Middle, 4=Senior
- `payroll_status` (required) - 1=Active, 2=Inactive, 3=Suspended
- `employee_category` (required) - 1=Non-Staff, 2=Staff, 3=Partner

**Pendidikan Non-Formal (Array):**

- `non_formal_education[0][certificate_name]`
- `non_formal_education[0][institution_name]`
- `non_formal_education[0][start_date]`
- `non_formal_education[0][end_date]`
- `non_formal_education[0][certificate_id]`
- `non_formal_education[0][certificate_file]` (file)

**Kontak Darurat & Media Sosial:**

- `emergency_contact_number` (required)
- `emergency_contact_name` (required)
- `emergency_contact_relationship` (required)
- `facebook_name`
- `instagram_name`
- `linkedin_name`
- `twitter_name`
- `relative_social_media`

---

## Update Karyawan

**URL:** `{{base_url}}/api/employee-master-data/employees/{id_employee}`  
**Method:** POST  
**Content-Type:** `multipart/form-data`

**Body (form-data):**

- `_method`: `PATCH`
- (Semua field dari Create, kirim hanya yang ingin diubah)

---

## Delete Karyawan

**URL:** `{{base_url}}/api/employee-master-data/employees/{id_employee}`  
**Method:** POST

**Body (form-data):**

- `_method`: `DELETE`

---

## Dropdown Perusahaan

**URL:** `{{base_url}}/api/employee-master-data/companies`  
**Method:** GET

**Query (opsional):**

- `search`

**Response:**

```json
{
  "meta": { "status": 200, "message": "Success get companies for dropdown" },
  "data": [
    {
      "id_company": "019ae365-412f-701f-983f-b17071f92ba2",
      "company_name": "PT. Artificial Intelligence Indonesia"
    }
  ]
}
```

---

## Dropdown Office

**URL:** `{{base_url}}/api/employee-master-data/offices`  
**Method:** GET

**Query (opsional):**

- `search`

**Response:**

```json
{
  "meta": { "status": 200, "message": "Success get offices" },
  "data": [
    {
      "id_office": "019af2d8-b94d-70ea-85ba-03c0c9be7ef9",
      "office_name": "Jakarta Office"
    }
  ]
}
```

---

## Dropdown Directorate

**URL:** `{{base_url}}/api/employee-master-data/directorate`  
**Method:** GET

**Query (opsional):**

- `search`

---

## Dropdown Division by Directorate

**URL:** `{{base_url}}/api/employee-master-data/division/{id_directorate}`  
**Method:** GET

**Response:**

```json
{
  "meta": { "status": 200, "message": "Success get divisions" },
  "data": [
    {
      "id": "019ae833-9eee-71a2-929f-918f233f6d4e",
      "division_name": "Engineering Division"
    }
  ]
}
```

---

## Dropdown Department by Division

**URL:** `{{base_url}}/api/employee-master-data/department/{id_division}`  
**Method:** GET

**Response:**

```json
{
  "meta": { "status": 200, "message": "Success get departments" },
  "data": [
    {
      "id": "019aed99-53bc-71af-aa7f-07b317ff29d8",
      "department_name": "Finance & Accounting"
    }
  ]
}
```

---

## Dropdown Jabatan + Golongan

**URL:** `{{base_url}}/api/employee-master-data/jabatan-dropdown`  
**Method:** GET

**Query (opsional):**

- `search`

**Response:**

```json
{
  "meta": { "status": 200, "message": "Success get job title for dropdown" },
  "data": [
    {
      "id_job_title": "019aee8b-ab6d-707c-8fc8-34147caf1254",
      "job_title_name": "Manager",
      "grade": "MGR-001"
    }
  ]
}
```

---

## Dropdown Posisi

**URL:** `{{base_url}}/api/employee-master-data/position-dropdown`  
**Method:** GET

**Query (opsional):**

- `search`

**Response:**

```json
{
  "meta": { "status": 200, "message": "Success get positions for dropdown" },
  "data": [
    {
      "id_position": "019af279-9974-73eb-9630-2d353b23bc24",
      "position_name": "Software Engineer"
    }
  ]
}
```

---

## Dropdown PTKP

**URL:** `{{base_url}}/api/employee-master-data/ptkp-dropdown`  
**Method:** GET

**Query (opsional):**

- `search`

**Response:**

```json
{
  "meta": { "status": 200, "message": "Success get PTKP for dropdown" },
  "data": [
    {
      "id_ptkp": "84649b16-fa71-4074-bd90-49b36386f983",
      "ptkp_code": "TK/0",
      "ptkp_description": "Tidak Kawin, Tanggungan 0",
      "ptkp_amount": 54000000
    }
  ]
}
```
