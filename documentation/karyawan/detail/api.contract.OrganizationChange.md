# Kontrak API – Perubahan Organisasi (Detail)

Dokumen ini merinci kontrak API untuk fitur `Perubahan Organisasi` pada halaman Detail Karyawan. Diselaraskan dengan Postman collection yang tersedia.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>` untuk semua endpoint yang memodifikasi data
- Method: Menggunakan `POST` dengan field `_method: PATCH/DELETE` (method spoofing)
- Content-Type: `multipart/form-data` untuk form data dan unggah file
- Response error: `{ errorCode: string, message: string, details?: any }`

---

## Halaman: Perubahan Organisasi

### Daftar Perubahan Organisasi

Endpoint: `GET /api/employee-master-data/employees/organization-changes/`

Query Parameters (opsional):
- `search` (string) – kata kunci pencarian
- `sort` (string) – `asc` | `desc`
- `column` (string) – nama kolom untuk sorting (contoh: `full_name`)
- `per_page` (number) – jumlah item per halaman
- `page` (number) – nomor halaman
- `filter[]` (string, multiple) – filter multi nilai (contoh: email, tipe perubahan, direktorat)

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "berhasil mendapatkan riwayat perubahan organisasi karyawan"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": "3af014cb-0074-427f-abc2-59a5d3c7573a",
                "full_name": "Employee Dummy 2",
                "jenis_perubahan": "Promosi",
                "efektif_date": "2025-12-30",
                "perusahaan_lama": "PT Company Dummy 2",
                "perusahaan_baru": "PT Company Dummy 1",
                "direktorat_lama": "Directorate Dummy 2",
                "direktorat_baru": "Directorate Dummy 2",
                "divisi_lama": "Division Dummy 2",
                "divisi_baru": "Division Dummy 2",
                "departemen_lama": "Department Dummy 2",
                "departemen_baru": "Department Dummy 2",
                "posisi_lama": "Position Dummy 2",
                "posisi_baru": "Position Dummy 2",
                "jabatan_lama": "Job Title Dummy 2",
                "jabatan_baru": "Job Title Dummy 1",
                "jenjang_jabatan_lama": "General",
                "jenjang_jabatan_baru": "Middle",
                "kategori_karyawan_lama": "Non-Staff",
                "kategori_karyawan_baru": "Staff",
                "reason": "Perubahan organisasi dummy seeder",
                "status": "Selesai"
            },
            {
                "id": "424d4d5d-f7a9-4bb4-9d72-ce5c1d7e65dc",
                "full_name": "Employee Dummy 1",
                "jenis_perubahan": "Demosi",
                "efektif_date": "2026-01-22",
                "perusahaan_lama": "PT Company Dummy 1",
                "perusahaan_baru": "PT Company Dummy 1",
                "direktorat_lama": "Directorate Dummy 1",
                "direktorat_baru": "Directorate Dummy 2",
                "divisi_lama": "Division Dummy 1",
                "divisi_baru": "Division Dummy 1",
                "departemen_lama": "Department Dummy 1",
                "departemen_baru": "Department Dummy 1",
                "posisi_lama": "Position Dummy 1",
                "posisi_baru": "Position Dummy 2",
                "jabatan_lama": "Job Title Dummy 1",
                "jabatan_baru": "Job Title Dummy 1",
                "jenjang_jabatan_lama": "General",
                "jenjang_jabatan_baru": "General",
                "kategori_karyawan_lama": "Non-Staff",
                "kategori_karyawan_baru": "Non-Staff",
                "reason": "Perubahan organisasi dummy seeder",
                "status": "Selesai"
            }
        ],
        "per_page": 10,
        "to": 2,
        "total": 2
    }
}
```

Status: `200 OK`

---

## Operasi CRUD – Perubahan Organisasi

### Menyimpan Perubahan Organisasi

Endpoint: `POST /api/employee-master-data/employees/store-organization-change/{employeeId}`

Path Parameters:
- `employeeId` (string, required) – ID/Code karyawan (contoh: `DSR001`)

Request Body (form-data):
- `employee_id` (text, required) – ID karyawan (contoh: `DSR020`)
- `change_type_id` (text, required) – ID tipe perubahan (UUID)
- `efektif_date` (text, required) – tanggal efektif (ISO: `YYYY-MM-DD`)
- `reason` (text, optional) – alasan perubahan
- `company_id` (text, required) – ID perusahaan (UUID)
- `office_id` (text, required) – ID kantor (UUID)
- `directorate_id` (text, required) – ID direktorat (UUID)
- `division_id` (text, required) – ID divisi (UUID)
- `department_id` (text, required) – ID departemen (UUID)
- `job_title_id` (text, required) – ID job title (UUID)
- `position_id` (text, required) – ID posisi (UUID)
- `position_level_id` (text, required) – ID level posisi (UUID)
- `employee_category_id` (text, required) – ID kategori karyawan (UUID)
- `decree_file` (file, optional) – file SK
- `approved_by` (text, optional) – disetujui oleh
- `recommended_by` (text, optional) – direkomendasikan oleh

Response (201 Created):
```json
{
    "meta": {
        "status": 200,
        "message": "berhasil menyimpan perubahan organisasi"
    },
    "data": {
        "id": "019b8345-7a39-718d-b62f-353e1c55535d",
        "employee_id": "DSR020",
        "change_type_id": "5d2ce8a2-3ce4-4f93-b919-d89f08473a16",
        "efektif_date": "2026-02-01",
        "reason": "bagus orang nya",
        "created_at": "2026-01-04T10:00:00.000000Z"
    }
}
```

Status: `201 Created`

---

### Detail Perubahan Organisasi

Endpoint: `GET /api/employee-master-data/employees/organization-changes/{id}/show`

Path Parameters:
- `id` (string, required) – ID perubahan organisasi (UUID)

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "berhasil mendapatkan detail perubahan organisasi"
    },
    "data": {
        "id": "019b8345-7a39-718d-b62f-353e1c55535d",
        "employee_id": "DSR020",
        "change_type_id": "5d2ce8a2-3ce4-4f93-b919-d89f08473a16",
        "efektif_date": "2026-02-01",
        "reason": "bagus orang nya",
        "company_id": "019b493b-dcbb-723e-9b0b-5b513fe5159a",
        "office_id": "019b49db-5deb-70b0-90b0-f809b6b19505",
        "directorate_id": "019b4948-a941-71c3-8ff5-96d7aebef5b6",
        "division_id": "019b495b-df75-7028-90c7-d27d92813b76",
        "department_id": "019b4976-3df7-700b-ae68-c73682551d2e",
        "job_title_id": "019b497c-b843-7334-8806-f3971c92fefc",
        "position_id": "019b4987-cb3b-7349-a13a-e318f738b76b",
        "position_level_id": "b9827833-62fd-4bfd-bf37-9ace9b6498f2",
        "employee_category_id": "56593eb1-625d-45c1-8446-c5bfaf3e79ac",
        "decree_file": "path/to/file.pdf",
        "approved_by": "Manager",
        "recommended_by": "HR"
    }
}
```

Status: `200 OK`

---

### Update Perubahan Organisasi (HR)

Endpoint: `POST /api/employee-master-data/employees/organization-changes/{id}/update`

Method Spoofing: gunakan `_method: PATCH` pada form data

Path Parameters:
- `id` (string, required) – ID perubahan organisasi (UUID)

Request Body (form-data):
- `_method` (text, required) – nilai: `PATCH`
- `decree_file` (file, optional) – update file SK

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "berhasil memperbarui perubahan organisasi"
    },
    "data": {
        "id": "019b840e-6d51-71c1-9586-3f3de0f8a5c5",
        "decree_file": "path/to/new_file.pdf",
        "updated_at": "2026-01-04T10:05:00.000000Z"
    }
}
```

Status: `200 OK`

---

## Contoh Request cURL

### Daftar Perubahan Organisasi
```bash
curl -X GET \
  "http://localhost:3000/api/employee-master-data/employees/organization-changes/?search=tes" \
  -H "Authorization: Bearer <token>"
```

### Menyimpan Perubahan Organisasi
```bash
curl -X POST \
  "http://localhost:3000/api/employee-master-data/employees/store-organization-change/DSR001" \
  -H "Authorization: Bearer <token>" \
  -F "employee_id=DSR020" \
  -F "change_type_id=5d2ce8a2-3ce4-4f93-b919-d89f08473a16" \
  -F "efektif_date=2026-02-01" \
  -F "reason=bagus orang nya" \
  -F "company_id=019b493b-dcbb-723e-9b0b-5b513fe5159a" \
  -F "office_id=019b49db-5deb-70b0-90b0-f809b6b19505" \
  -F "directorate_id=019b4948-a941-71c3-8ff5-96d7aebef5b6" \
  -F "division_id=019b495b-df75-7028-90c7-d27d92813b76" \
  -F "department_id=019b4976-3df7-700b-ae68-c73682551d2e" \
  -F "job_title_id=019b497c-b843-7334-8806-f3971c92fefc" \
  -F "position_id=019b4987-cb3b-7349-a13a-e318f738b76b" \
  -F "position_level_id=b9827833-62fd-4bfd-bf37-9ace9b6498f2" \
  -F "employee_category_id=56593eb1-625d-45c1-8446-c5bfaf3e79ac" \
  -F "decree_file=@/D:/tes1.pdf" \
  -F "approved_by=di approve manual tanpa login"
```

### Detail Perubahan Organisasi
```bash
curl -X GET \
  "http://localhost:3000/api/employee-master-data/employees/organization-changes/019b8345-7a39-718d-b62f-353e1c55535d/show" \
  -H "Authorization: Bearer <token>"
```

### Update Perubahan Organisasi
```bash
curl -X POST \
  "http://localhost:3000/api/employee-master-data/employees/organization-changes/019b840e-6d51-71c1-9586-3f3de0f8a5c5/update" \
  -H "Authorization: Bearer <token>" \
  -F "_method=PATCH" \
  -F "decree_file=@/D:/tes1.pdf"
```

---

## Catatan Implementasi

- Method Spoofing: backend menggunakan `_method` untuk override method HTTP (`PATCH`)
- File Upload: kirim `decree_file` sebagai `multipart/form-data`
- Date Format: gunakan format ISO `YYYY-MM-DD` untuk field `efektif_date`
- Filter: gunakan `filter[]` untuk menerapkan filter pada daftar
