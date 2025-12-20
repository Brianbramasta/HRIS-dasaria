# Perpanjangan Kontrak (Contract Renewal)

## Get List Pengajuan & Kelola Kontrak

**URL:** `{{base_url}}/api/employee-master-data/contract-renewals`  
**Method:** GET

**Query Parameters:**

- `search` - Pencarian berdasarkan kata kunci (NIP, nama, departemen)
- `sort` - Urutan: `asc` atau `desc` (default: `desc`)
- `column` - Kolom untuk sorting (default: `created_at`)
- `per_page` - Jumlah data per halaman (default: 10)
- `page` - Nomor halaman (default: 1)
- `filter[]` - Filter berdasarkan kriteria tertentu (dapat digunakan multiple)
- `filter_column[range][column][]` - Filter berdasarkan range tanggal (contoh: `filter_column[range][end_date][]=2024-01-01&filter_column[range][end_date][]=2024-01-31`)
- `filter_column[in][column][]` - Filter berdasarkan multiple values/checkbox (contoh: `filter_column[in][renewal_status][]=1&filter_column[in][renewal_status][]=2`)

**Response:**

```json
{
    "meta": {
        "status": 200,
        "message": "Success get contract renewal list"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": "019b2b50-935d-7233-9566-ec2ff1d66ab3",
                "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
                "nip": "12345678910",
                "full_name": "Lindsey Curtis",
                "position_name": "Web Designer",
                "department_name": "Direktur Teknologi dan Jaringan",
                "join_date": "2024-01-01",
                "end_date": "2025-03-12",
                "remaining_contract": "2 bulan",
                "renewal_status": 2,
                "renewal_status_name": "Diperpanjang",
                "supervisor_approval_status": 2,
                "supervisor_approval_status_name": "Disetujui",
                "contract_submission_detail": null,
                "negotiation_date": null,
                "notes": null,
                "employee_status": 2,
                "employee_status_name": "Disetujui",
                "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Lindsey"
            },
            {
                "id": "019b2b64-09f0-702c-815a-b56903aa3a8d",
                "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
                "nip": "12345678911",
                "full_name": "Dedik Mulyadi",
                "position_name": "Data Analyst",
                "department_name": "Manajer Teknologi dan Jaringan",
                "join_date": "2024-01-01",
                "end_date": "2025-03-12",
                "remaining_contract": "2 bulan",
                "renewal_status": 3,
                "renewal_status_name": "Ditolak",
                "supervisor_approval_status": 3,
                "supervisor_approval_status_name": "Ditolak",
                "contract_submission_detail": null,
                "negotiation_date": null,
                "notes": "Kurang Perfom",
                "employee_status": 4,
                "employee_status_name": "Info",
                "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dedik"
            }
        ],
        "first_page_url": "http://example.com/api/employee-master-data/contract-renewals?page=1",
        "from": 1,
        "last_page": 5,
        "last_page_url": "http://example.com/api/employee-master-data/contract-renewals?page=5",
        "next_page_url": "http://example.com/api/employee-master-data/contract-renewals?page=2",
        "path": "http://example.com/api/employee-master-data/contract-renewals",
        "per_page": 10,
        "prev_page_url": null,
        "to": 10,
        "total": 50
    }
}
```

**Status Codes:**

- Renewal Status: 1=Pending, 2=Diperpanjang, 3=Ditolak, 4=Menunggu Jadwal Negoisasi, 5=Negoisasi
- Supervisor Approval Status: 1=Pending, 2=Disetujui, 3=Ditolak
- Employee Status: 1=Pending, 2=Disetujui, 3=Negoisasi, 4=Info, 5=Ditolak

---

## Get List Persetujuan Perpanjangan Kontrak

**URL:** `{{base_url}}/api/employee-master-data/contract-renewals/approval`  
**Method:** GET

**Query Parameters:**

- `search` - Pencarian berdasarkan kata kunci (NIP, nama, departemen)
- `sort` - Urutan: `asc` atau `desc` (default: `desc`)
- `column` - Kolom untuk sorting (default: `created_at`)
- `per_page` - Jumlah data per halaman (default: 10)
- `page` - Nomor halaman (default: 1)
- `filter[]` - Filter berdasarkan kriteria tertentu (dapat digunakan multiple)
- `filter_column[range][column][]` - Filter berdasarkan range tanggal (contoh: `filter_column[range][end_date][]=2024-01-01&filter_column[range][end_date][]=2024-01-31`)
- `filter_column[in][column][]` - Filter berdasarkan multiple values/checkbox (contoh: `filter_column[in][renewal_status][]=1&filter_column[in][renewal_status][]=2`)
  <!-- - status: 1=Pending, 2=Diperpanjang, 3=Ditolak -->

**Response:**

```json
{
    "meta": {
        "status": 200,
        "message": "Success get contract renewal approval list"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": "019b2b50-935d-7233-9566-ec2ff1d66ab3",
                "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
                "nip": "12345678910",
                "full_name": "Lindsey Curtis",
                "position_name": "Web Designer",
                "department_name": "Direktur Teknologi dan Jaringan",
                "join_date": "2024-01-01",
                "end_date": "2025-03-12",
                "remaining_contract": "2 bulan",
                "status": 2,
                "status_name": "Diperpanjang",
                "renewal_detail": null,
                "notes": null,
                "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Lindsey"
            },
            {
                "id": "019b2b64-09f0-702c-815a-b56903aa3a8d",
                "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
                "nip": "12345678911",
                "full_name": "Dedik Mulyadi",
                "position_name": "Data Analyst",
                "department_name": "Manajer Teknologi dan Jaringan",
                "join_date": "2024-01-01",
                "end_date": "2025-03-12",
                "remaining_contract": "2 bulan",
                "status": 3,
                "status_name": "Ditolak",
                "renewal_detail": null,
                "notes": "Kurang Perfom",
                "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dedik"
            }
        ],
        "first_page_url": "http://example.com/api/employee-master-data/contract-renewals/approval?page=1",
        "from": 1,
        "last_page": 3,
        "last_page_url": "http://example.com/api/employee-master-data/contract-renewals/approval?page=3",
        "next_page_url": "http://example.com/api/employee-master-data/contract-renewals/approval?page=2",
        "path": "http://example.com/api/employee-master-data/contract-renewals/approval",
        "per_page": 10,
        "prev_page_url": null,
        "to": 10,
        "total": 30
    }
}
```

**Status Codes:**

- Status: 1=Pending, 2=Diperpanjang, 3=Ditolak

---

## Get Detail Perpanjangan Kontrak

**URL:** `{{base_url}}/api/employee-master-data/contract-renewals/{id}`  
**Method:** GET

**Path Parameters:**

- `id` (required) - ID perpanjangan kontrak (contoh: "019b2b50-935d-7233-9566-ec2ff1d66ab3")

**Response:**

```json
{
    "meta": {
        "status": 200,
        "message": "Success get contract renewal detail"
    },
    "data": {
        "id": "019b2b50-935d-7233-9566-ec2ff1d66ab3",
        "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
        "status_perpanjangan": {
            "nip": "12345678910",
            "full_name": "Budi",
            "position_name": "HR",
            "department_name": "HR",
            "join_date": "2024-01-01",
            "end_date": "2024-12-31",
            "remaining_contract": "2 bulan",
            "renewal_status": 2,
            "renewal_status_name": "Diperpanjang",
            "supervisor_approval_status": 2,
            "supervisor_approval_status_name": "Disetujui",
            "employee_status": 2,
            "employee_status_name": "Disetujui",
            "notes": "Detail Catatan ..."
        },
        "pengajuan_kontrak": {
            "change_type": 1,
            "change_type_name": "Tidak ada",
            "company_id": "019ae365-412f-701f-983f-b17071f92ba2",
            "company_name": "Dasaria",
            "office_id": "019af2d8-b94d-70ea-85ba-03c0c9be7ef9",
            "office_name": "Head Kantor",
            "directorate_id": "019ae21e-7ff8-7315-80a5-a139bbc01e52",
            "directorate_name": "SDM",
            "division_id": "019ae833-9eee-71a2-929f-918f233f6d4e",
            "division_name": "HR",
            "department_id": "019aed99-53bc-71af-aa7f-07b317ff29d8",
            "department_name": "HR",
            "position_id": "019af20b-fabf-725a-98d8-d19d2022165c",
            "position_name": "HR",
            "job_title_id": "019aee3e-b586-727f-9464-6d819a5e6278",
            "job_title_name": "EntryLevel",
            "grade": "D5",
            "position_level": 4,
            "position_level_name": "Senior",
            "basic_salary": 4000000,
            "employee_category": 2,
            "employee_category_name": "Staff"
        },
        "created_at": "2025-12-17 07:57:39",
        "updated_at": "2025-12-17 07:57:39"
    }
}
```

**Status Codes:**

- Renewal Status: 1=Pending, 2=Diperpanjang, 3=Ditolak, 4=Menunggu Jadwal Negoisasi, 5=Negoisasi
- Supervisor Approval Status: 1=Pending, 2=Disetujui, 3=Ditolak
- Employee Status: 1=Pending, 2=Disetujui, 3=Negoisasi, 4=Info, 5=Ditolak
- Change Type: 1=Tidak ada, 2=Perubahan Posisi, 3=Perubahan Gaji, 4=Perubahan Keduanya
- Position Level: 1=General, 2=Junior, 3=Middle, 4=Senior
- Employee Category: 1=Non-Staff, 2=Staff, 3=Partner

---

## Edit Status Perpanjangan

**URL:** `{{base_url}}/api/employee-master-data/contract-renewals/{id}/status`  
**Method:** PUT  
**Content-Type:** `application/json`

**Path Parameters:**

- `id` (required) - ID perpanjangan kontrak (contoh: "019b2b50-935d-7233-9566-ec2ff1d66ab3")

**Body (JSON):**

```json
{
    "renewal_status": 2,
    "supervisor_approval_status": 2,
    "employee_status": 2,
    "negotiation_date": "2025-03-12",
    "notes": "Persetujuan perpanjangan kontrak"
}
```

**Body Parameters:**

- `renewal_status` (required) - Status perpanjangan: 1=Pending, 2=Diperpanjang, 3=Ditolak, 4=Menunggu Jadwal Negoisasi, 5=Negoisasi
- `supervisor_approval_status` (required) - Status persetujuan atasan: 1=Pending, 2=Disetujui, 3=Ditolak
- `employee_status` (required) - Status karyawan: 1=Pending, 2=Disetujui, 3=Negoisasi, 4=Info, 5=Ditolak
- `negotiation_date` (optional) - Tanggal negoisasi, Format: YYYY-MM-DD (contoh: "2025-03-12")
- `notes` (optional) - Catatan tambahan (contoh: "Persetujuan perpanjangan kontrak")

**Response:**

```json
{
    "meta": {
        "status": 200,
        "message": "Success update contract renewal status"
    },
    "data": {
        "id": "019b2b50-935d-7233-9566-ec2ff1d66ab3",
        "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
        "renewal_status": 2,
        "renewal_status_name": "Diperpanjang",
        "supervisor_approval_status": 2,
        "supervisor_approval_status_name": "Disetujui",
        "employee_status": 2,
        "employee_status_name": "Disetujui",
        "negotiation_date": "2025-03-12",
        "notes": "Persetujuan perpanjangan kontrak",
        "updated_at": "2025-12-20 14:00:00"
    }
}
```

---

## Edit Pengajuan Kontrak

**URL:** `{{base_url}}/api/employee-master-data/contract-renewals/{id}/submission`  
**Method:** PUT  
**Content-Type:** `application/json`

**Path Parameters:**

- `id` (required) - ID perpanjangan kontrak (contoh: "019b2b50-935d-7233-9566-ec2ff1d66ab3")

**Body (JSON):**

```json
{
    "change_type": 1,
    "company_id": "019ae365-412f-701f-983f-b17071f92ba2",
    "office_id": "019af2d8-b94d-70ea-85ba-03c0c9be7ef9",
    "directorate_id": "019ae21e-7ff8-7315-80a5-a139bbc01e52",
    "division_id": "019ae833-9eee-71a2-929f-918f233f6d4e",
    "department_id": "019aed99-53bc-71af-aa7f-07b317ff29d8",
    "position_id": "019af20b-fabf-725a-98d8-d19d2022165c",
    "job_title_id": "019aee3e-b586-727f-9464-6d819a5e6278",
    "position_level": 4,
    "basic_salary": 4500000,
    "employee_category": 2
}
```

**Body Parameters:**

- `change_type` (required) - Jenis perubahan: 1=Tidak ada, 2=Perubahan Posisi, 3=Perubahan Gaji, 4=Perubahan Keduanya
- `company_id` (required) - ID perusahaan (char 36)
- `office_id` (required) - ID kantor (char 36)
- `directorate_id` (required) - ID direktorat (char 36)
- `division_id` (optional) - ID divisi (char 36)
- `department_id` (required) - ID departemen (char 36)
- `position_id` (required) - ID posisi (char 36)
- `job_title_id` (required) - ID jabatan (char 36)
- `position_level` (required) - Jenjang jabatan: 1=General, 2=Junior, 3=Middle, 4=Senior
- `basic_salary` (required) - Gaji pokok (numeric)
- `employee_category` (required) - Kategori karyawan: 1=Non-Staff, 2=Staff, 3=Partner

**Response:**

```json
{
    "meta": {
        "status": 200,
        "message": "Success update contract renewal submission"
    },
    "data": {
        "id": "019b2b50-935d-7233-9566-ec2ff1d66ab3",
        "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
        "change_type": 1,
        "change_type_name": "Tidak ada",
        "company_id": "019ae365-412f-701f-983f-b17071f92ba2",
        "company_name": "Dasaria",
        "office_id": "019af2d8-b94d-70ea-85ba-03c0c9be7ef9",
        "office_name": "Head Kantor",
        "directorate_id": "019ae21e-7ff8-7315-80a5-a139bbc01e52",
        "directorate_name": "SDM",
        "division_id": "019ae833-9eee-71a2-929f-918f233f6d4e",
        "division_name": "HR",
        "department_id": "019aed99-53bc-71af-aa7f-07b317ff29d8",
        "department_name": "HR",
        "position_id": "019af20b-fabf-725a-98d8-d19d2022165c",
        "position_name": "HR",
        "job_title_id": "019aee3e-b586-727f-9464-6d819a5e6278",
        "job_title_name": "EntryLevel",
        "grade": "D5",
        "position_level": 4,
        "position_level_name": "Senior",
        "basic_salary": 4500000,
        "employee_category": 2,
        "employee_category_name": "Staff",
        "updated_at": "2025-12-20 14:05:00"
    }
}
```

---

## Approve Contract Renewal (Persetujuan)

**URL:** `{{base_url}}/api/employee-master-data/contract-renewals/{id}/approve`  
**Method:** POST  
**Content-Type:** `application/json`

**Path Parameters:**

- `id` (required) - ID perpanjangan kontrak (contoh: "019b2b50-935d-7233-9566-ec2ff1d66ab3")

**Body (JSON):**

```json
{
    "notes": "Kontrak disetujui untuk diperpanjang"
}
```

**Body Parameters:**

- `notes` (optional) - Catatan persetujuan

**Response:**

```json
{
    "meta": {
        "status": 200,
        "message": "Success approve contract renewal"
    },
    "data": {
        "id": "019b2b50-935d-7233-9566-ec2ff1d66ab3",
        "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
        "status": 2,
        "status_name": "Diperpanjang",
        "notes": "Kontrak disetujui untuk diperpanjang",
        "approved_at": "2025-12-20 14:10:00",
        "updated_at": "2025-12-20 14:10:00"
    }
}
```

---

## Reject Contract Renewal (Penolakan)

**URL:** `{{base_url}}/api/employee-master-data/contract-renewals/{id}/reject`  
**Method:** POST  
**Content-Type:** `application/json`

**Path Parameters:**

- `id` (required) - ID perpanjangan kontrak (contoh: "019b2b50-935d-7233-9566-ec2ff1d66ab3")

**Body (JSON):**

```json
{
    "reason": "Kinerja kurang memuaskan"
}
```

**Body Parameters:**

- `reason` (required) - Alasan penolakan

**Response:**

```json
{
    "meta": {
        "status": 200,
        "message": "Success reject contract renewal"
    },
    "data": {
        "id": "019b2b50-935d-7233-9566-ec2ff1d66ab3",
        "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
        "status": 3,
        "status_name": "Ditolak",
        "rejection_reason": "Kinerja kurang memuaskan",
        "rejected_at": "2025-12-20 14:15:00",
        "updated_at": "2025-12-20 14:15:00"
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
        "renewal_status": [
            "The renewal status field is required."
        ],
        "basic_salary": [
            "The basic salary must be a number."
        ]
    }
}
```

### 404 Not Found

```json
{
    "meta": {
        "status": 404,
        "message": "Contract renewal not found"
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
