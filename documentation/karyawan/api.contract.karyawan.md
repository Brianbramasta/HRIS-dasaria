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

**URL:** `{{base_url}}/api/employee-master-data/ptkp-dropdown`  
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
