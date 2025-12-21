# Data Master Karyawan

## List Karyawan (Index)

**URL:** `{{base_url}}/api/employee-master-data/employees`  
**Method:** GET

**Query Parameters (opsional):**

- `search` - Pencarian berdasarkan nama, NIK, email (contoh: `tes44@gmail.com`)
- `sort` - Urutan: `asc` atau `desc` (default: `desc`)
- `column` - Kolom untuk sorting (default: `created_at`, contoh: `email`)
- `per_page` - Jumlah data per halaman (default: 10, contoh: `2`)
- `page` - Nomor halaman (default: 1)
- `filter[]` - Filter berdasarkan kriteria tertentu (dapat digunakan multiple)

**Contoh Request:**

```
GET {{base_url}}/api/employee-master-data/employees?search=tes44@gmail.com&sort=desc&column=email&per_page=2&page=1&filter[]=tes44@gmail.com&filter[]=manager&filter[]=Data Analyst
```

**Response:**

```json
{
  "meta": {
    "status": 200,
    "message": "Success get employees"
  },
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": "019b1849-49a7-73ff-933a-195100f11608",
        "full_name": "Brian Bramasta",
        "national_id": 12222,
        "email": "Brianaldybramasta@gmail.com",
        "religion": 2,
        "blood_type": "O",
        "birth_place": "Bojonegoro",
        "birth_date": "2025-12-14",
        "last_education": 7,
        "marital_status": 1,
        "gender": 1,
        "household_dependents": 1,
        "phone_number": "88886",
        "current_address": "aa",
        "ktp_address": "aa",
        "bank_account_number": 66666,
        "bank_name": "bca",
        "bank_account_holder": "test",
        "npwp": 222,
        "ptkp_id": "00d21049-85ff-40e9-8b8a-f77be7d6b57e",
        "bpjs_employment_number": 4444,
        "bpjs_employment_status": 1,
        "bpjs_health_number": 555,
        "bpjs_health_status": 1,
        "employment_status": 3,
        "resignation_status": null,
        "deleted_at": null,
        "created_at": "2025-12-13T15:16:54.000000Z",
        "updated_at": "2025-12-13T15:16:54.000000Z",
        "start_date": "2025-12-01",
        "end_date": "2025-12-16",
        "position_level": 1,
        "payroll_status": 1,
        "employee_category": 2,
        "user_access": "no",
        "company_name": "PT. Digital Inovasi Indonesia",
        "office_name": "Branch Office Bandung",
        "job_title_name": "Consultant",
        "grade": "CN1",
        "position_name": "Accountant",
        "department_name": "Tax Accounting Department",
        "division_name": "Accounting Division"
      },
      {
        "id": "134de474-214e-43c1-9344-0d0caba32faf",
        "full_name": "Rina Anggraini",
        "national_id": 320808901,
        "email": "rina.anggraini@company.com",
        "religion": 3,
        "blood_type": "O",
        "birth_place": "Palembang",
        "birth_date": "1994-09-05",
        "last_education": 7,
        "marital_status": 1,
        "gender": 2,
        "household_dependents": 0,
        "phone_number": "081234567897",
        "current_address": "Jl. Sudirman No. 1111, Palembang",
        "ktp_address": "Jl. Ahmad Yani No. 1212, Palembang",
        "bank_account_number": 890123456,
        "bank_name": "Bank BRI",
        "bank_account_holder": "Rina Anggraini",
        "npwp": 890123456,
        "ptkp_id": "feabeebd-8e6e-4e38-a303-07f0c5464533",
        "bpjs_employment_number": 89012345,
        "bpjs_employment_status": 1,
        "bpjs_health_number": 890123456,
        "bpjs_health_status": 1,
        "employment_status": 1,
        "resignation_status": null,
        "deleted_at": null,
        "created_at": "2025-12-13T13:44:09.000000Z",
        "updated_at": "2025-12-13T13:44:09.000000Z",
        "start_date": "2023-12-13",
        "end_date": "2026-12-13",
        "position_level": 4,
        "payroll_status": 1,
        "employee_category": 2,
        "user_access": "basic",
        "company_name": "PT. Logistik Express Indonesia",
        "office_name": "Branch Office Balikpapan",
        "job_title_name": "Manager",
        "grade": "B1",
        "position_name": "Backend Developer",
        "department_name": "Budget Planning Department",
        "division_name": "Financial Planning Division"
      },
      {
        "id": "1b791484-35a6-4d05-9bc9-8acc71e0f092",
        "full_name": "Fitri Handayani",
        "national_id": 321010123,
        "email": "fitri.handayani@company.com",
        "religion": 1,
        "blood_type": "A",
        "birth_place": "Manado",
        "birth_date": "1996-02-14",
        "last_education": 6,
        "marital_status": 1,
        "gender": 2,
        "household_dependents": 0,
        "phone_number": "081234567899",
        "current_address": "Jl. Sam Ratulangi No. 1515, Manado",
        "ktp_address": "Jl. Pierre Tendean No. 1616, Manado",
        "bank_account_number": 12345678,
        "bank_name": "Bank BCA",
        "bank_account_holder": "Fitri Handayani",
        "npwp": 12345678,
        "ptkp_id": "feabeebd-8e6e-4e38-a303-07f0c5464533",
        "bpjs_employment_number": 10123456,
        "bpjs_employment_status": 1,
        "bpjs_health_number": 12345678,
        "bpjs_health_status": 1,
        "employment_status": 1,
        "resignation_status": null,
        "deleted_at": null,
        "created_at": "2025-12-13T13:44:09.000000Z",
        "updated_at": "2025-12-13T13:44:09.000000Z",
        "start_date": "2021-12-13",
        "end_date": "2026-12-13",
        "position_level": 4,
        "payroll_status": 1,
        "employee_category": 2,
        "user_access": "basic",
        "company_name": "PT. Hospitality Nusantara",
        "office_name": "Branch Office Medan",
        "job_title_name": "Manager",
        "grade": "B1",
        "position_name": "Budget Analyst",
        "department_name": "Talent Acquisition Department",
        "division_name": "Recruitment Division"
      },
      {
        "id": "477f0269-6324-4cb3-a7fa-eff65bf338f1",
        "full_name": "Ahmad Fauzi",
        "national_id": 320303456,
        "email": "ahmad.fauzi@company.com",
        "religion": 1,
        "blood_type": "B",
        "birth_place": "Surabaya",
        "birth_date": "1988-03-10",
        "last_education": 8,
        "marital_status": 2,
        "gender": 1,
        "household_dependents": 3,
        "phone_number": "081234567892",
        "current_address": "Jl. Raya Darmo No. 111, Surabaya",
        "ktp_address": "Jl. Pemuda No. 222, Surabaya",
        "bank_account_number": 345678901,
        "bank_name": "Bank BNI",
        "bank_account_holder": "Ahmad Fauzi",
        "npwp": 345678901,
        "ptkp_id": "9f26dd2d-9766-4c7c-8ae9-b38f79594bfc",
        "bpjs_employment_number": 34567890,
        "bpjs_employment_status": 1,
        "bpjs_health_number": 345678901,
        "bpjs_health_status": 1,
        "employment_status": 1,
        "resignation_status": null,
        "deleted_at": null,
        "created_at": "2025-12-13T13:44:09.000000Z",
        "updated_at": "2025-12-13T13:44:09.000000Z",
        "start_date": "2023-12-13",
        "end_date": "2026-12-13",
        "position_level": 3,
        "payroll_status": 1,
        "employee_category": 2,
        "user_access": "basic",
        "company_name": "PT. Medika Sehat Sentosa",
        "office_name": "Head Office Jakarta",
        "job_title_name": "Senior Staff",
        "grade": "S3",
        "position_name": "Senior DevOps Engineer",
        "department_name": "Backend Development Department",
        "division_name": "Infrastructure & DevOps Division"
      },
      {
        "id": "4d6f2f7d-abe4-4622-a648-5ca9bb30dba1",
        "full_name": "Dedi Kurniawan",
        "national_id": 320909012,
        "email": "dedi.kurniawan@company.com",
        "religion": 1,
        "blood_type": "AB",
        "birth_place": "Balikpapan",
        "birth_date": "1987-06-22",
        "last_education": 7,
        "marital_status": 2,
        "gender": 1,
        "household_dependents": 3,
        "phone_number": "081234567898",
        "current_address": "Jl. MT Haryono No. 1313, Balikpapan",
        "ktp_address": "Jl. Soekarno Hatta No. 1414, Balikpapan",
        "bank_account_number": 901234567,
        "bank_name": "Bank Mandiri",
        "bank_account_holder": "Dedi Kurniawan",
        "npwp": 901234567,
        "ptkp_id": "9f26dd2d-9766-4c7c-8ae9-b38f79594bfc",
        "bpjs_employment_number": 90123456,
        "bpjs_employment_status": 1,
        "bpjs_health_number": 901234567,
        "bpjs_health_status": 1,
        "employment_status": 1,
        "resignation_status": null,
        "deleted_at": null,
        "created_at": "2025-12-13T13:44:09.000000Z",
        "updated_at": "2025-12-13T13:44:09.000000Z",
        "start_date": "2020-12-13",
        "end_date": "2026-12-13",
        "position_level": 4,
        "payroll_status": 1,
        "employee_category": 2,
        "user_access": "basic",
        "company_name": "PT. Energi Terbarukan Indonesia",
        "office_name": "Branch Office Surabaya",
        "job_title_name": "Manager",
        "grade": "B1",
        "position_name": "HR Recruiter",
        "department_name": "Career Development Department",
        "division_name": "Learning & Development Division"
      }
    ],
    "first_page_url": "http://localhost:8000/api/employee-master-data/employees?per_page=5&page=1",
    "from": 1,
    "last_page": 2,
    "last_page_url": "http://localhost:8000/api/employee-master-data/employees?per_page=5&page=2",
    "links": [
      {
        "url": null,
        "label": "&laquo; Previous",
        "page": null,
        "active": false
      },
      {
        "url": "http://localhost:8000/api/employee-master-data/employees?per_page=5&page=1",
        "label": "1",
        "page": 1,
        "active": true
      },
      {
        "url": "http://localhost:8000/api/employee-master-data/employees?per_page=5&page=2",
        "label": "2",
        "page": 2,
        "active": false
      },
      {
        "url": "http://localhost:8000/api/employee-master-data/employees?per_page=5&page=2",
        "label": "Next &raquo;",
        "page": 2,
        "active": false
      }
    ],
    "next_page_url": "http://localhost:8000/api/employee-master-data/employees?per_page=5&page=2",
    "path": "http://localhost:8000/api/employee-master-data/employees",
    "per_page": 5,
    "prev_page_url": null,
    "to": 5,
    "total": 10
  }
}
```

---

## Get Detail Karyawan

**URL:** `{{base_url}}/api/employee-master-data/employees/{id_employee}`  
**Method:** GET

**Path Parameters:**

- `id_employee` (required) - ID karyawan (contoh: "019b2635-a1a5-71d9-a7f2-b30831cc893f")

**Response:**

```json
{
    "meta": {
        "status": 200,
        "message": "Success get employee detail"
    },
    "data": {
        "Data_Pribadi": {
            "id": "019b2b02-dd65-7084-a30f-1f943a3d2e64",
            "full_name": "Brian Bramasta 2",
            "national_id": "345617",
            "email": "Brianaldybramastaerrr@gmail.com",
            "religion": "Christianity - Protestant",
            "blood_type": "B",
            "birth_place": "Bojonegoro",
            "birth_date": "2025-12-01",
            "last_education": "SD",
            "marital_status": "Belum Menikah",
            "gender": "Laki-laki",
            "household_dependents": "1",
            "phone_number": "333333",
            "current_address": "aa",
            "ktp_address": "aa"
        },
        "Data_Pendidikan": {
            "employee_id": "019b2b02-dd65-7084-a30f-1f943a3d2e64",
            "formal_educations": [
                {
                    "id": "019b2b02-dd76-7255-a6ce-0a6118e45d97",
                    "education_level": "S1",
                    "institution_name": "test",
                    "degree": "aha",
                    "final_grade": "3",
                    "major": "test",
                    "graduation_year": "2022",
                    "employee_id": "019b2b02-dd65-7084-a30f-1f943a3d2e64",
                    "created_at": "2025-12-17T06:32:46.000000Z",
                    "updated_at": "2025-12-17T06:32:46.000000Z"
                }
            ],
            "non_formal_educations": [
                {
                    "id": "019b2b02-dd7a-700b-a21e-d80cafb8baef",
                    "employee_id": "019b2b02-dd65-7084-a30f-1f943a3d2e64",
                    "certificate_name": "test",
                    "institution_name": "testtttt",
                    "start_date": "2025-12-01",
                    "end_date": "2025-12-01",
                    "certificate_id": "55466647",
                    "certificate_file": "EmployeeMasterData\/Education\/non-formal\/f9e5fd1d-a7af-4e32-915c-1865a586e4a1.pdf",
                    "deleted_at": null,
                    "created_at": "2025-12-17T06:32:46.000000Z",
                    "updated_at": "2025-12-17T06:32:46.000000Z"
                }
            ]
        },
        "Data_Sosial_media": {
            "employee_id": "019b2b02-dd65-7084-a30f-1f943a3d2e64",
            "social_media": [
                {
                    "id": "019b2b02-dd7e-7154-8620-b115a5409e54",
                    "facebook_name": "https:\/\/brianaldybramasta.my.id\/",
                    "instagram_name": "https:\/\/brianaldybramasta.my.id\/",
                    "linkedin_name": "https:\/\/brianaldybramasta.my.id\/",
                    "twitter_name": "https:\/\/brianaldybramasta.my.id\/",
                    "relative_social_media": "https:\/\/brianaldybramasta.my.id\/",
                    "emergency_contact_number": "08999999999",
                    "emergency_contact_name": "siapa ya",
                    "emergency_contact_relationship": "oke",
                    "employee_id": "019b2b02-dd65-7084-a30f-1f943a3d2e64",
                    "deleted_at": null,
                    "created_at": "2025-12-17T06:32:46.000000Z",
                    "updated_at": "2025-12-17T06:32:46.000000Z"
                }
            ]
        },
        "Data_Keuangan": {
            "employee_id": "019b2b02-dd65-7084-a30f-1f943a3d2e64",
            "bank_account_number": "235566666",
            "bank_name": "bca",
            "bank_account_holder": "test",
            "npwp": "345678999",
            "ptkp_code": "K\/3"
        },
        "Data_BPJS": {
            "employee_id": "019b2b02-dd65-7084-a30f-1f943a3d2e64",
            "bpjs_employment_number": "123455555",
            "bpjs_employment_status": "Aktif",
            "bpjs_health_number": "123333",
            "bpjs_health_status": "Aktif"
        },
        "Data_Employment_Posisi": {
            "employee_id": "019b2b02-dd65-7084-a30f-1f943a3d2e64",
            "employment_status": "Evaluasi",
            "resignation_status": null,
            "created_at": "2025-12-17T06:32:46.000000Z",
            "updated_at": "2025-12-17T06:32:46.000000Z",
            "company_name": "PT. Artificial Intelligence Indonesia",
            "office_name": "ini kantor ai",
            "directorate_name": "ini nama direktorat 3 jadi 4",
            "division_name": "ini divisi 1",
            "department_name": "Human Resource Development",
            "job_title_name": null,
            "grade": "DA-001",
            "position_name": "Accounting Manager",
            "start_date": "2025-11-01",
            "end_date": "2026-11-01",
            "position_level": "Genereal",
            "payroll_status": "aktif",
            "employee_category": "Staff",
            "user_access": "no"
        },
        "Data_Dokumen": {
            "employee_id": "019b2b02-dd65-7084-a30f-1f943a3d2e64",
            "documents": [
                {
                    "file_type": "Kartu Tanda Penduduk",
                    "file": "EmployeeMasterData\/Document\/372552d2-5553-45ef-9f50-84e39d0cf406.pdf",
                    "name_file": "dummy-pdf_2.pdf"
                }
            ]
        }
    }
}
```

---

## Create Karyawan

**URL:** `{{base_url}}/api/employee-master-data/employees`  
**Method:** POST  
**Content-Type:** `multipart/form-data`

**Body (form-data):**

**Data Pribadi:**

- `full_name` (required) - Nama lengkap (contoh: "tes probation")
- `national_id` (required) - NIK (contoh: "50641555")
- `email` (required) - Email (contoh: "tes4@gmail.com")
- `religion` (required) - 1=Islam, 2=Protestant, 3=Catholic, 4=Hindu, 5=Buddhist, 6=Confucianism
- `blood_type` - Golongan darah (contoh: "b+")
- `birth_place` (required) - Tempat lahir (contoh: "jember")
- `birth_date` (required) - Tanggal lahir, Format: YYYY-MM-DD (contoh: "2003-06-14")
- `last_education` (required) - 1=SD, 2=SMP, 3=SMA, 4=D1, 5=D2, 6=D3, 7=S1, 8=S2, 9=S3
- `marital_status` (required) - 1=Single, 2=Married
- `gender` (required) - 1=Male, 2=Female
- `household_dependents` - Jumlah tanggungan (contoh: "0")
- `phone_number` (required) - Nomor telepon (contoh: "082147xxxx")
- `current_address` (required) - Alamat domisili (contoh: "malang")
- `ktp_address` (required) - Alamat KTP (contoh: "jember")

**Data Finansial & Pajak:**

- `bank_account_number` (required) - Nomor rekening (contoh: "34534635")
- `bank_name` (required) - Nama bank (contoh: "rizal")
- `bank_account_holder` (required) - Nama pemegang rekening (contoh: "morimana")
- `npwp` - Nomor NPWP (contoh: "13432432")
- `ptkp_id` (required) - ID PTKP (contoh: "84649b16-fa71-4074-bd90-49b36386f983")

**Data BPJS:**

- `bpjs_employment_number` - Nomor BPJS Ketenagakerjaan (contoh: "5060")
- `bpjs_employment_status` - 1=Active, 2=Inactive
- `bpjs_health_number` - Nomor BPJS Kesehatan (contoh: "5060")
- `bpjs_health_status` - 1=Active, 2=Inactive

**Status Kepegawaian:**

- `employment_status` - 1=Active, 2=Inactive, 3=Probation, 4=Resigned (disabled dalam contoh)
- `resignation_status` - Status resign (disabled dalam contoh)

**Dokumen (Array):**

- `documents[0][file_type]` - 1=Surat Keterangan Pengalaman Kerja, 2=Pakta Integritas, 3=PKWT/PKWTT, 4=Surat Perjanjian Bersama, 5=Dokumen Lainnya
- `documents[0][file]` (file) - File dokumen

**Pendidikan Formal (Array):**

- `education_formal_detail[0][education_level]` - 1=SD, 2=SMP, 3=SMA, 4=D1, 5=D2, 6=D3, 7=S1, 8=S2, 9=S3
- `education_formal_detail[0][institution_name]` - Nama institusi (contoh: "hasbu")
- `education_formal_detail[0][degree]` - Gelar (contoh: "strkom")
- `education_formal_detail[0][final_grade]` - Nilai akhir (contoh: "3.85")
- `education_formal_detail[0][major]` - Jurusan (contoh: "teknologi informasi")
- `education_formal_detail[0][graduation_year]` - Tahun lulus (contoh: "2025")

**Data Organisasi:**

- `company_id` (required) - ID perusahaan (contoh: "019ae365-412f-701f-983f-b17071f92ba2")
- `office_id` (required) - ID kantor (contoh: "019af2d8-b94d-70ea-85ba-03c0c9be7ef9")
- `directorate_id` (required) - ID direktorat (contoh: "019ae21e-7ff8-7315-80a5-a139bbc01e52")
- `division_id` (required) - ID divisi (contoh: "019ae833-9eee-71a2-929f-918f233f6d4e")
- `department_id` (required) - ID departemen (contoh: "019aed99-53bc-71af-aa7f-07b317ff29d8")
- `position_id` (required) - ID posisi (contoh: "019af20b-fabf-725a-98d8-d19d2022165c")
- `job_title_id` (required) - ID jabatan (contoh: "019aee3e-b586-727f-9464-6d819a5e6278")
- `start_date` (required) - Tanggal mulai, Format: YYYY-MM-DD (contoh: "2025-01-01")
- `end_date` - Tanggal berakhir, Format: YYYY-MM-DD (contoh: "2025-06-01")
- `position_level` (required) - 1=General, 2=Junior, 3=Middle, 4=Senior
- `payroll_status` (required) - 1=Active, 2=Inactive, 3=Suspended
- `employee_category` (required) - 1=Non-Staff, 2=Staff, 3=Partner

**Pendidikan Non-Formal (Array):**

- `non_formal_education[0][certificate_name]` - Nama sertifikat (contoh: "ini sertifikat")
- `non_formal_education[0][institution_name]` - Nama institusi (contoh: "kampus negeri")
- `non_formal_education[0][start_date]` - Tanggal mulai, Format: YYYY-MM-DD (contoh: "2020-01-01")
- `non_formal_education[0][end_date]` - Tanggal selesai, Format: YYYY-MM-DD (contoh: "2025-01-01")
- `non_formal_education[0][certificate_id]` - ID sertifikat (contoh: "ini id")
- `non_formal_education[0][certificate_file]` (file) - File sertifikat

**Kontak Darurat & Media Sosial:**

- `emergency_contact_number` (required) - Nomor kontak darurat (contoh: "0821444")
- `emergency_contact_name` (required) - Nama kontak darurat (contoh: "siti nurjumaatik")
- `emergency_contact_relationship` (required) - Hubungan kontak darurat (contoh: "ibu")
- `facebook_name` - Nama Facebook (contoh: "ini facebook")
- `instagram_name` - Nama Instagram (contoh: "ini instagram")
- `linkedin_name` - Nama LinkedIn (contoh: "ini linkeid")
- `twitter_name` - Nama Twitter (contoh: "ini nama twiter")
- `relative_social_media` - Media sosial kerabat (contoh: "gak ada")

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

**Query Parameters (opsional):**

- `search` - Pencarian perusahaan

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

**Query Parameters (opsional):**

- `search` - Pencarian kantor

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

**Query Parameters (opsional):**

- `search` - Pencarian direktorat

**Response:**

```json
{
  "meta": { "status": 200, "message": "Success get directorates" },
  "data": [
    {
      "id_directorate": "019ae21e-7ff8-7315-80a5-a139bbc01e52",
      "directorate_name": "Technology Directorate"
    }
  ]
}
```

---

## Dropdown Division by Directorate

**URL:** `{{base_url}}/api/employee-master-data/division/{id_directorate}`  
**Method:** GET

**Path Parameters:**

- `id_directorate` (required) - ID direktorat (contoh: "019ae21e-7ff8-7315-80a5-a139bbc01e52")

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

**Path Parameters:**

- `id_division` (required) - ID divisi (contoh: "019ae833-9eee-71a2-929f-918f233f6d4e")

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

**Query Parameters (opsional):**

- `search` - Pencarian jabatan

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

**Query Parameters (opsional):**

- `search` - Pencarian posisi

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

**URL:** `{{base_url}}/api/employee-master-data/ptkp-status-dropdown`  
**Method:** GET

**Query Parameters (opsional):**

- `search` - Pencarian PTKP

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
