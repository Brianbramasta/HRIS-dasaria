# Kontrak API – Perubahan Organisasi (Detail)

Dokumen ini merinci kontrak API untuk fitur `Perubahan Organisasi` pada halaman Detail Karyawan. Diselaraskan dengan Postman collection yang tersedia.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>` untuk semua endpoint yang memodifikasi data
- Method: Menggunakan `POST` dengan field `_method: PATCH/DELETE` (method spoofing)
- Content-Type: `multipart/form-data` untuk form data dan unggah file
- Response error: `{ errorCode: string, message: string, details?: any }`

---

## Halaman: Perubahan Organisasi

### Riwayat Organisasi

Endpoint: `GET /api/employee-master-data/employees/{employeeId}/organization-changes`

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
                "id": "019b8d86-ff60-72a5-a92e-c4f53a675a66",
                "employee_id": "DSR020",
                "full_name": "Brian Bramasta",
                "jenis_perubahan": "Promosi",
                "efektif_date": "2026-02-01",
                "perusahaan_lama": "Dasaria",
                "perusahaan_baru": "Dasaria",
                "direktorat_lama": "directorat 1",
                "direktorat_baru": "directorat 1",
                "divisi_lama": "test 2",
                "divisi_baru": "test 2",
                "departemen_lama": "hris",
                "departemen_baru": "hris",
                "posisi_lama": "test",
                "posisi_baru": "test",
                "jabatan_lama": "front end",
                "jabatan_baru": "front end",
                "jenjang_jabatan_lama": "Middle",
                "jenjang_jabatan_baru": "Middle",
                "kategori_karyawan_lama": "Non-Staff",
                "kategori_karyawan_baru": "Non-Staff",
                "reason": "bagus orang nya",
                "status": "Rekomendasi",
                "decree_file": null
            },
            {
                "id": "019b8d78-36e9-7316-899b-522cd8f879bb",
                "employee_id": "DSR020",
                "full_name": "Brian Bramasta",
                "jenis_perubahan": "Promosi",
                "efektif_date": "2026-02-01",
                "perusahaan_lama": "Dasaria",
                "perusahaan_baru": "Dasaria",
                "direktorat_lama": "directorat 1",
                "direktorat_baru": "directorat 1",
                "divisi_lama": "test 2",
                "divisi_baru": "test 2",
                "departemen_lama": "hris",
                "departemen_baru": "hris",
                "posisi_lama": "test",
                "posisi_baru": "test",
                "jabatan_lama": "front end",
                "jabatan_baru": "front end",
                "jenjang_jabatan_lama": "Middle",
                "jenjang_jabatan_baru": "Middle",
                "kategori_karyawan_lama": "Non-Staff",
                "kategori_karyawan_baru": "Non-Staff",
                "reason": "bagus orang nya",
                "status": "Selesai",
                "decree_file": "EmployeeMasterData/OrganizationChange/c1b1c929-cab0-4c19-baed-8b5486580349.pdf"
            },
            {
                "id": "019b8d51-b314-728b-8f06-1efdb57ee89d",
                "employee_id": "DSR020",
                "full_name": "Brian Bramasta",
                "jenis_perubahan": "Promosi",
                "efektif_date": "2026-02-01",
                "perusahaan_lama": "Dasaria",
                "perusahaan_baru": "Dasaria",
                "direktorat_lama": "directorat 1",
                "direktorat_baru": "directorat 1",
                "divisi_lama": "test 2",
                "divisi_baru": "test 2",
                "departemen_lama": "hris",
                "departemen_baru": "hris",
                "posisi_lama": "test",
                "posisi_baru": "test",
                "jabatan_lama": "front end",
                "jabatan_baru": "front end",
                "jenjang_jabatan_lama": "Middle",
                "jenjang_jabatan_baru": "Middle",
                "kategori_karyawan_lama": "Non-Staff",
                "kategori_karyawan_baru": "Non-Staff",
                "reason": "bagus orang nya",
                "status": "Rekomendasi",
                "decree_file": null
            },
            {
                "id": "019b8d51-3a94-7102-82e1-308f1d7ffeb4",
                "employee_id": "DSR020",
                "full_name": "Brian Bramasta",
                "jenis_perubahan": "Promosi",
                "efektif_date": "2026-02-01",
                "perusahaan_lama": "Dasaria",
                "perusahaan_baru": "Dasaria",
                "direktorat_lama": "directorat 1",
                "direktorat_baru": "directorat 1",
                "divisi_lama": "test 2",
                "divisi_baru": "test 2",
                "departemen_lama": "hris",
                "departemen_baru": "hris",
                "posisi_lama": "test",
                "posisi_baru": "test",
                "jabatan_lama": "front end",
                "jabatan_baru": "front end",
                "jenjang_jabatan_lama": "Middle",
                "jenjang_jabatan_baru": "Middle",
                "kategori_karyawan_lama": "Non-Staff",
                "kategori_karyawan_baru": "Non-Staff",
                "reason": "bagus orang nya",
                "status": "Selesai",
                "decree_file": "EmployeeMasterData/OrganizationChange/b6c600b7-4e51-4889-b9af-ba86dff1910c.pdf"
            },
            {
                "id": "019b8d4f-da0a-715c-bb4e-bb28353bc4d0",
                "employee_id": "DSR020",
                "full_name": "Brian Bramasta",
                "jenis_perubahan": "Promosi",
                "efektif_date": "2026-02-01",
                "perusahaan_lama": "Dasaria",
                "perusahaan_baru": "Dasaria",
                "direktorat_lama": "directorat 1",
                "direktorat_baru": "directorat 1",
                "divisi_lama": "test 2",
                "divisi_baru": "test 2",
                "departemen_lama": "hris",
                "departemen_baru": "hris",
                "posisi_lama": "test",
                "posisi_baru": "test",
                "jabatan_lama": "front end",
                "jabatan_baru": "front end",
                "jenjang_jabatan_lama": "Middle",
                "jenjang_jabatan_baru": "Middle",
                "kategori_karyawan_lama": "Non-Staff",
                "kategori_karyawan_baru": "Non-Staff",
                "reason": "bagus orang nya",
                "status": "Rekomendasi",
                "decree_file": null
            },
            {
                "id": "019b8d4e-c74e-7345-a833-ce884007106f",
                "employee_id": "DSR020",
                "full_name": "Brian Bramasta",
                "jenis_perubahan": "Promosi",
                "efektif_date": "2026-02-01",
                "perusahaan_lama": "Dasaria",
                "perusahaan_baru": "Dasaria",
                "direktorat_lama": "directorat 1",
                "direktorat_baru": "directorat 1",
                "divisi_lama": "test 2",
                "divisi_baru": "test 2",
                "departemen_lama": "hris",
                "departemen_baru": "hris",
                "posisi_lama": "test",
                "posisi_baru": "test",
                "jabatan_lama": "front end",
                "jabatan_baru": "front end",
                "jenjang_jabatan_lama": "Junior",
                "jenjang_jabatan_baru": "Middle",
                "kategori_karyawan_lama": "Non-Staff",
                "kategori_karyawan_baru": "Non-Staff",
                "reason": "bagus orang nya",
                "status": "Selesai",
                "decree_file": "EmployeeMasterData/OrganizationChange/df542910-ca5b-4fab-9731-185bce2e6ec0.pdf"
            },
            {
                "id": "019b840e-6d51-71c1-9586-3f3de0f8a5c5",
                "employee_id": "DSR020",
                "full_name": "Brian Bramasta",
                "jenis_perubahan": "Promosi",
                "efektif_date": "2026-02-01",
                "perusahaan_lama": "Dasaria",
                "perusahaan_baru": "Dasaria",
                "direktorat_lama": "directorat 1",
                "direktorat_baru": "directorat 1",
                "divisi_lama": "test 2",
                "divisi_baru": "test 2",
                "departemen_lama": "hris",
                "departemen_baru": "hris",
                "posisi_lama": "test",
                "posisi_baru": "test",
                "jabatan_lama": "front end",
                "jabatan_baru": "front end",
                "jenjang_jabatan_lama": "Junior",
                "jenjang_jabatan_baru": "Middle",
                "kategori_karyawan_lama": "Non-Staff",
                "kategori_karyawan_baru": "Non-Staff",
                "reason": "bagus orang nya",
                "status": "Selesai",
                "decree_file": "EmployeeMasterData/OrganizationChange/17f68095-5f31-41eb-868b-2568f10d8886.pdf"
            }
        ],
        "first_page_url": "http://192.168.2.154:8000/api/employee-master-data/employees/DSR020/organization-changes?page=1",
        "from": 1,
        "last_page": 1,
        "last_page_url": "http://192.168.2.154:8000/api/employee-master-data/employees/DSR020/organization-changes?page=1",
        "links": [
            {
                "url": null,
                "label": "&laquo; Previous",
                "page": null,
                "active": false
            },
            {
                "url": "http://192.168.2.154:8000/api/employee-master-data/employees/DSR020/organization-changes?page=1",
                "label": "1",
                "page": 1,
                "active": true
            },
            {
                "url": null,
                "label": "Next &raquo;",
                "page": null,
                "active": false
            }
        ],
        "next_page_url": null,
        "path": "http://192.168.2.154:8000/api/employee-master-data/employees/DSR020/organization-changes",
        "per_page": 10,
        "prev_page_url": null,
        "to": 7,
        "total": 7
    }
}
```

Status: `200 OK`

---

