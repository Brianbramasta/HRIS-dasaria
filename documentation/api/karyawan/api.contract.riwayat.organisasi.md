# Riwayat Organisasi (Organization History)

## Get List Riwayat Organisasi Karyawan (HR)

**URL:** `{{base_url}}/api/employee-master-data/organization-history`  
**Method:** GET

**Query Parameters:**

- `search` - Pencarian berdasarkan kata kunci (NIP, nama, jenis perubahan)
- `sort` - Urutan: `asc` atau `desc` (default: `desc`)
- `column` - Kolom untuk sorting (default: `created_at`)
- `per_page` - Jumlah data per halaman (default: 10)
- `page` - Nomor halaman (default: 1)
- `filter[]` - Filter berdasarkan kriteria tertentu (dapat digunakan multiple)
- `filter_column[range][column][]` - Filter berdasarkan range tanggal (contoh: `filter_column[range][effective_date][]=2024-01-01&filter_column[range][effective_date][]=2024-01-31`)
- `filter_column[in][column][]` - Filter berdasarkan multiple values/checkbox (contoh: `filter_column[in][change_type][]=Promosi&filter_column[in][change_type][]=Mutasi`)

**Response:**

```json
{
  "meta": {
    "status": 200,
    "message": "Success get organization history list"
  },
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": "019b2b50-935d-7233-9566-ec2ff1d66ab3",
        "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
        "nip": "12345678910",
        "full_name": "Ahmad Fauzi",
        "change_type": "Promosi",
        "effective_date": "2024-01-15",
        "old_position_name": "Staff Developer",
        "new_position_name": "Senior Developer",
        "old_division_name": "IT Development",
        "new_division_name": "IT Development",
        "old_directorate_name": "Teknologi",
        "new_directorate_name": "Teknologi",
        "old_department_name": "Software Engineering",
        "new_department_name": "Software Engineering",
        "old_company_name": "Dasaria",
        "new_company_name": "Dasaria",
        "old_office_name": "Head Office",
        "new_office_name": "Head Office",
        "reason": "Kinerja yang baik dan konsisten",
        "change_status": 1,
        "change_status_name": "Rekomendasi",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad"
      },
      {
        "id": "019b2b64-09f0-702c-815a-b56903aa3a8d",
        "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
        "nip": "12345678911",
        "full_name": "Siti Nurhaliza",
        "change_type": "Mutasi",
        "effective_date": "2024-02-20",
        "old_position_name": "HR Staff",
        "new_position_name": "HR Staff",
        "old_division_name": "HR Operations",
        "new_division_name": "HR Recruitment",
        "old_directorate_name": "Human Resources",
        "new_directorate_name": "Human Resources",
        "old_department_name": "HR Operations",
        "new_department_name": "HR Recruitment",
        "old_company_name": "Dasaria",
        "new_company_name": "Dasaria",
        "old_office_name": "Jakarta Office",
        "new_office_name": "Jakarta Office",
        "reason": "Kebutuhan operasional",
        "change_status": 2,
        "change_status_name": "Selesai",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti"
      }
    ],
    "first_page_url": "http://example.com/api/employee-master-data/organization-history?page=1",
    "from": 1,
    "last_page": 5,
    "last_page_url": "http://example.com/api/employee-master-data/organization-history?page=5",
    "next_page_url": "http://example.com/api/employee-master-data/organization-history?page=2",
    "path": "http://example.com/api/employee-master-data/organization-history",
    "per_page": 10,
    "prev_page_url": null,
    "to": 10,
    "total": 50
  }
}
```

**Status Codes:**

- Change Status: 1=Rekomendasi, 2=Selesai

---

## Get List Riwayat Organisasi & Rekomendasi (Atasan)

**URL:** `{{base_url}}/api/employee-master-data/organization-history/supervisor`  
**Method:** GET

**Query Parameters:**

- `search` - Pencarian berdasarkan kata kunci (NIP, nama, jenis perubahan)
- `sort` - Urutan: `asc` atau `desc` (default: `desc`)
- `column` - Kolom untuk sorting (default: `created_at`)
- `per_page` - Jumlah data per halaman (default: 10)
- `page` - Nomor halaman (default: 1)
- `filter[]` - Filter berdasarkan kriteria tertentu (dapat digunakan multiple)
- `filter_column[range][column][]` - Filter berdasarkan range tanggal (contoh: `filter_column[range][effective_date][]=2024-01-01&filter_column[range][effective_date][]=2024-01-31`)
- `filter_column[in][column][]` - Filter berdasarkan multiple values/checkbox (contoh: `filter_column[in][change_status][]=1&filter_column[in][change_status][]=2`)

**Response:**

```json
{
  "meta": {
    "status": 200,
    "message": "Success get organization history list for supervisor"
  },
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": "019b2b50-935d-7233-9566-ec2ff1d66ab3",
        "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
        "nip": "12345678910",
        "full_name": "Andi Wijaya",
        "change_type": "Promosi",
        "effective_date": "2024-06-15",
        "old_position_name": "Junior Analyst",
        "new_position_name": "Analyst",
        "old_division_name": "Business Intelligence",
        "new_division_name": "Business Intelligence",
        "old_directorate_name": "Strategy",
        "new_directorate_name": "Strategy",
        "old_department_name": "Analytics",
        "new_department_name": "Analytics",
        "old_company_name": "Dasaria",
        "new_company_name": "Dasaria",
        "old_office_name": "Head Office",
        "new_office_name": "Head Office",
        "reason": "Rekomendasi dari atasan langsung",
        "change_status": 1,
        "change_status_name": "Rekomendasi",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Andi"
      },
      {
        "id": "019b2b64-09f0-702c-815a-b56903aa3a8d",
        "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
        "nip": "12345678911",
        "full_name": "Maya Sari",
        "change_type": "Rotasi",
        "effective_date": "2024-07-01",
        "old_position_name": "Designer",
        "new_position_name": "UI/UX Designer",
        "old_division_name": "Creative",
        "new_division_name": "Product Design",
        "old_directorate_name": "Marketing",
        "new_directorate_name": "Product",
        "old_department_name": "Creative",
        "new_department_name": "Design",
        "old_company_name": "Dasaria",
        "new_company_name": "Dasaria",
        "old_office_name": "Head Office",
        "new_office_name": "Head Office",
        "reason": "Pengembangan skill dan karir",
        "change_status": 2,
        "change_status_name": "Selesai",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya"
      }
    ],
    "first_page_url": "http://example.com/api/employee-master-data/organization-history/supervisor?page=1",
    "from": 1,
    "last_page": 3,
    "last_page_url": "http://example.com/api/employee-master-data/organization-history/supervisor?page=3",
    "next_page_url": "http://example.com/api/employee-master-data/organization-history/supervisor?page=2",
    "path": "http://example.com/api/employee-master-data/organization-history/supervisor",
    "per_page": 10,
    "prev_page_url": null,
    "to": 10,
    "total": 30
  }
}
```

**Status Codes:**

- Change Status: 1=Rekomendasi, 2=Selesai

---

## Get Detail Riwayat Organisasi

**URL:** `{{base_url}}/api/employee-master-data/organization-history/{id}`  
**Method:** GET

**Path Parameters:**

- `id` (required) - ID riwayat organisasi (contoh: "019b2b50-935d-7233-9566-ec2ff1d66ab3")

**Response:**

```json
{
  "meta": {
    "status": 200,
    "message": "Success get organization history detail"
  },
  "data": {
    "id": "019b2b50-935d-7233-9566-ec2ff1d66ab3",
    "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
    "nip": "12345678910",
    "full_name": "Ahmad Fauzi",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
    "change_type": "Promosi",
    "effective_date": "2024-01-15",
    "organization_changes": {
      "old_position_id": "019af20b-fabf-725a-98d8-d19d2022165c",
      "old_position_name": "Staff Developer",
      "new_position_id": "019af20b-fabf-725a-98d8-d19d2022165d",
      "new_position_name": "Senior Developer",
      "old_job_title_id": "019aee3e-b586-727f-9464-6d819a5e6278",
      "old_job_title_name": "Junior Level",
      "new_job_title_id": "019aee3e-b586-727f-9464-6d819a5e6279",
      "new_job_title_name": "Middle Level",
      "old_division_id": "019ae833-9eee-71a2-929f-918f233f6d4e",
      "old_division_name": "IT Development",
      "new_division_id": "019ae833-9eee-71a2-929f-918f233f6d4e",
      "new_division_name": "IT Development",
      "old_directorate_id": "019ae21e-7ff8-7315-80a5-a139bbc01e52",
      "old_directorate_name": "Teknologi",
      "new_directorate_id": "019ae21e-7ff8-7315-80a5-a139bbc01e52",
      "new_directorate_name": "Teknologi",
      "old_department_id": "019aed99-53bc-71af-aa7f-07b317ff29d8",
      "old_department_name": "Software Engineering",
      "new_department_id": "019aed99-53bc-71af-aa7f-07b317ff29d8",
      "new_department_name": "Software Engineering",
      "old_company_id": "019ae365-412f-701f-983f-b17071f92ba2",
      "old_company_name": "Dasaria",
      "new_company_id": "019ae365-412f-701f-983f-b17071f92ba2",
      "new_company_name": "Dasaria",
      "old_office_id": "019af2d8-b94d-70ea-85ba-03c0c9be7ef9",
      "old_office_name": "Head Office",
      "new_office_id": "019af2d8-b94d-70ea-85ba-03c0c9be7ef9",
      "new_office_name": "Head Office",
      "old_grade": "D3",
      "new_grade": "D5",
      "old_position_level": 2,
      "old_position_level_name": "Junior",
      "new_position_level": 3,
      "new_position_level_name": "Middle",
      "old_basic_salary": 3000000,
      "new_basic_salary": 4500000
    },
    "reason": "Kinerja yang baik dan konsisten",
    "change_status": 1,
    "change_status_name": "Rekomendasi",
    "notes": "Detail catatan tambahan...",
    "created_at": "2024-01-10 08:30:00",
    "updated_at": "2024-01-10 08:30:00"
  }
}
```

**Status Codes:**

- Change Status: 1=Rekomendasi, 2=Selesai
- Position Level: 1=General, 2=Junior, 3=Middle, 4=Senior

---

## Get Riwayat Organisasi by Employee ID

**URL:** `{{base_url}}/api/employee-master-data/employees/{employeeId}/organization-history`  
**Method:** GET

**Path Parameters:**

- `employeeId` (required) - ID karyawan (contoh: "019b2b20-41d2-7205-8b89-bd5d73f2a7d0")

**Query Parameters:**

- `per_page` - Jumlah data per halaman (default: 10)
- `page` - Nomor halaman (default: 1)

**Response:**

```json
{
  "meta": {
    "status": 200,
    "message": "Success get employee organization history"
  },
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": "019b2b50-935d-7233-9566-ec2ff1d66ab3",
        "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
        "change_type": "Promosi",
        "effective_date": "2024-01-15",
        "old_position_name": "Staff Developer",
        "new_position_name": "Senior Developer",
        "old_division_name": "IT Development",
        "new_division_name": "IT Development",
        "reason": "Kinerja yang baik dan konsisten",
        "change_status": 2,
        "change_status_name": "Selesai",
        "created_at": "2024-01-10 08:30:00"
      }
    ],
    "first_page_url": "http://example.com/api/employee-master-data/employees/019b2b20-41d2-7205-8b89-bd5d73f2a7d0/organization-history?page=1",
    "from": 1,
    "last_page": 2,
    "last_page_url": "http://example.com/api/employee-master-data/employees/019b2b20-41d2-7205-8b89-bd5d73f2a7d0/organization-history?page=2",
    "next_page_url": "http://example.com/api/employee-master-data/employees/019b2b20-41d2-7205-8b89-bd5d73f2a7d0/organization-history?page=2",
    "path": "http://example.com/api/employee-master-data/employees/019b2b20-41d2-7205-8b89-bd5d73f2a7d0/organization-history",
    "per_page": 10,
    "prev_page_url": null,
    "to": 10,
    "total": 15
  }
}
```

---

## Create Riwayat Organisasi

**URL:** `{{base_url}}/api/employee-master-data/organization-history`  
**Method:** POST  
**Content-Type:** `application/json`

**Body (JSON):**

```json
{
  "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
  "change_type": "Promosi",
  "effective_date": "2024-01-15",
  "new_company_id": "019ae365-412f-701f-983f-b17071f92ba2",
  "new_office_id": "019af2d8-b94d-70ea-85ba-03c0c9be7ef9",
  "new_directorate_id": "019ae21e-7ff8-7315-80a5-a139bbc01e52",
  "new_division_id": "019ae833-9eee-71a2-929f-918f233f6d4e",
  "new_department_id": "019aed99-53bc-71af-aa7f-07b317ff29d8",
  "new_position_id": "019af20b-fabf-725a-98d8-d19d2022165d",
  "new_job_title_id": "019aee3e-b586-727f-9464-6d819a5e6279",
  "new_position_level": 3,
  "new_basic_salary": 4500000,
  "reason": "Kinerja yang baik dan konsisten",
  "notes": "Catatan tambahan"
}
```

**Body Parameters:**

- `employee_id` (required) - ID karyawan (char 36)
- `change_type` (required) - Jenis perubahan: "Promosi", "Mutasi", "Rotasi", "Demosi"
- `effective_date` (required) - Tanggal efektif perubahan, Format: YYYY-MM-DD (contoh: "2024-01-15")
- `new_company_id` (required) - ID perusahaan baru (char 36)
- `new_office_id` (required) - ID kantor baru (char 36)
- `new_directorate_id` (required) - ID direktorat baru (char 36)
- `new_division_id` (optional) - ID divisi baru (char 36)
- `new_department_id` (required) - ID departemen baru (char 36)
- `new_position_id` (required) - ID posisi baru (char 36)
- `new_job_title_id` (required) - ID jabatan baru (char 36)
- `new_position_level` (required) - Jenjang jabatan baru: 1=General, 2=Junior, 3=Middle, 4=Senior
- `new_basic_salary` (required) - Gaji pokok baru (numeric)
- `reason` (required) - Alasan perubahan (text)
- `notes` (optional) - Catatan tambahan (text)

**Response:**

```json
{
  "meta": {
    "status": 201,
    "message": "Success create organization history"
  },
  "data": {
    "id": "019b2b50-935d-7233-9566-ec2ff1d66ab3",
    "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
    "nip": "12345678910",
    "full_name": "Ahmad Fauzi",
    "change_type": "Promosi",
    "effective_date": "2024-01-15",
    "new_position_name": "Senior Developer",
    "new_division_name": "IT Development",
    "new_directorate_name": "Teknologi",
    "new_department_name": "Software Engineering",
    "new_company_name": "Dasaria",
    "new_office_name": "Head Office",
    "reason": "Kinerja yang baik dan konsisten",
    "change_status": 1,
    "change_status_name": "Rekomendasi",
    "notes": "Catatan tambahan",
    "created_at": "2024-01-10 08:30:00",
    "updated_at": "2024-01-10 08:30:00"
  }
}
```

---

## Update Riwayat Organisasi

**URL:** `{{base_url}}/api/employee-master-data/organization-history/{id}`  
**Method:** PUT  
**Content-Type:** `application/json`

**Path Parameters:**

- `id` (required) - ID riwayat organisasi (contoh: "019b2b50-935d-7233-9566-ec2ff1d66ab3")

**Body (JSON):**

```json
{
  "change_type": "Promosi",
  "effective_date": "2024-01-20",
  "new_company_id": "019ae365-412f-701f-983f-b17071f92ba2",
  "new_office_id": "019af2d8-b94d-70ea-85ba-03c0c9be7ef9",
  "new_directorate_id": "019ae21e-7ff8-7315-80a5-a139bbc01e52",
  "new_division_id": "019ae833-9eee-71a2-929f-918f233f6d4e",
  "new_department_id": "019aed99-53bc-71af-aa7f-07b317ff29d8",
  "new_position_id": "019af20b-fabf-725a-98d8-d19d2022165d",
  "new_job_title_id": "019aee3e-b586-727f-9464-6d819a5e6279",
  "new_position_level": 3,
  "new_basic_salary": 5000000,
  "reason": "Update alasan perubahan",
  "notes": "Update catatan"
}
```

**Body Parameters:**

- `change_type` (optional) - Jenis perubahan: "Promosi", "Mutasi", "Rotasi", "Demosi"
- `effective_date` (optional) - Tanggal efektif perubahan, Format: YYYY-MM-DD
- `new_company_id` (optional) - ID perusahaan baru (char 36)
- `new_office_id` (optional) - ID kantor baru (char 36)
- `new_directorate_id` (optional) - ID direktorat baru (char 36)
- `new_division_id` (optional) - ID divisi baru (char 36)
- `new_department_id` (optional) - ID departemen baru (char 36)
- `new_position_id` (optional) - ID posisi baru (char 36)
- `new_job_title_id` (optional) - ID jabatan baru (char 36)
- `new_position_level` (optional) - Jenjang jabatan baru: 1=General, 2=Junior, 3=Middle, 4=Senior
- `new_basic_salary` (optional) - Gaji pokok baru (numeric)
- `reason` (optional) - Alasan perubahan (text)
- `notes` (optional) - Catatan tambahan (text)

**Response:**

```json
{
  "meta": {
    "status": 200,
    "message": "Success update organization history"
  },
  "data": {
    "id": "019b2b50-935d-7233-9566-ec2ff1d66ab3",
    "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
    "nip": "12345678910",
    "full_name": "Ahmad Fauzi",
    "change_type": "Promosi",
    "effective_date": "2024-01-20",
    "new_position_name": "Senior Developer",
    "new_division_name": "IT Development",
    "reason": "Update alasan perubahan",
    "change_status": 1,
    "change_status_name": "Rekomendasi",
    "notes": "Update catatan",
    "updated_at": "2024-01-15 10:30:00"
  }
}
```

---

## Update Status Riwayat Organisasi

**URL:** `{{base_url}}/api/employee-master-data/organization-history/{id}/status`  
**Method:** PATCH  
**Content-Type:** `application/json`

**Path Parameters:**

- `id` (required) - ID riwayat organisasi (contoh: "019b2b50-935d-7233-9566-ec2ff1d66ab3")

**Body (JSON):**

```json
{
  "change_status": 2,
  "notes": "Perubahan organisasi telah selesai diproses"
}
```

**Body Parameters:**

- `change_status` (required) - Status perubahan: 1=Rekomendasi, 2=Selesai
- `notes` (optional) - Catatan status (text)

**Response:**

```json
{
  "meta": {
    "status": 200,
    "message": "Success update organization history status"
  },
  "data": {
    "id": "019b2b50-935d-7233-9566-ec2ff1d66ab3",
    "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
    "change_status": 2,
    "change_status_name": "Selesai",
    "notes": "Perubahan organisasi telah selesai diproses",
    "updated_at": "2024-01-15 14:30:00"
  }
}
```

---

## Delete Riwayat Organisasi

**URL:** `{{base_url}}/api/employee-master-data/organization-history/{id}`  
**Method:** DELETE

**Path Parameters:**

- `id` (required) - ID riwayat organisasi (contoh: "019b2b50-935d-7233-9566-ec2ff1d66ab3")

**Response:**

```json
{
  "meta": {
    "status": 200,
    "message": "Success delete organization history"
  }
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "meta": {
    "status": 400,
    "message": "Validation error"
  },
  "errors": {
    "employee_id": ["The employee id field is required."],
    "change_type": ["The change type field is required."],
    "effective_date": ["The effective date must be a valid date."],
    "new_basic_salary": ["The new basic salary must be a number."]
  }
}
```

### 404 Not Found

```json
{
  "meta": {
    "status": 404,
    "message": "Organization history not found"
  }
}
```

### 500 Internal Server Error

```json
{
  "meta": {
    "status": 500,
    "message": "Internal server error"
  }
}
```

---

## Notes

1. Semua response mengikuti format standar API dengan struktur `meta` dan `data`
2. Semua tanggal menggunakan format `YYYY-MM-DD`
3. Semua timestamp menggunakan format `YYYY-MM-DD HH:mm:ss`
4. Pagination menggunakan Laravel pagination standard
5. ID menggunakan ULID (char 36)
6. Status codes menggunakan integer untuk konsistensi dengan database
7. Field yang nullable di database akan return `null` dalam response jika tidak ada data
8. Endpoint `/organization-history` untuk HR menampilkan semua riwayat organisasi karyawan
9. Endpoint `/organization-history/supervisor` untuk Atasan menampilkan riwayat organisasi karyawan yang menjadi bawahannya
10. Jenis perubahan yang tersedia: "Promosi", "Mutasi", "Rotasi", "Demosi"
11. System akan otomatis menyimpan data organisasi lama (old\_\*) dari data karyawan saat ini sebelum perubahan
12. Change Status "Rekomendasi" (1) untuk perubahan yang masih dalam proses, "Selesai" (2) untuk yang sudah diterapkan
