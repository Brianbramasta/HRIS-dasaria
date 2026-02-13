# Kontrak API – Pengunduran Diri

Dokumen ini merinci kontrak API untuk fitur Pengunduran Diri berdasarkan koleksi Postman yang dirujuk pada [HRIS-Dasaria.postman_collection.json](file:///c:/Work%20-%20Project/fe-hris/documentation/karyawan/pengunduran-diri/HRIS-Dasaria.postman_collection.json#L7143-L7581). Format dan standar mengikuti referensi [api.contract.jenis-pengauan.md](file:///c:/Work%20-%20Project/fe-hris/documentation/jenis%20pengajuan/api.contract.jenis-pengauan.md).

## Konvensi Umum

- Base URL: sesuai environment (`{{base_url}}` atau `{{ngrok}}`)
- Content-Type:
  - `multipart/form-data` untuk endpoint unggah/penyimpanan
  - `application/json` untuk endpoint lainnya
- Response Standard: JSON

---

## Pengajuan Pengunduran Diri

### 1. Daftar Pengajuan (Index)

Endpoint: `GET /api/employee-master-data/resignation/applications/index`

Content-Type: `application/json`

Response (200 OK):

```json
{
    "meta": {
        "status": 200,
        "message": "berhasil menampilkan daftar pengajuan resign"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "jenis_pengajuan": "Pengunduran Diri",
                "application_id": "019c4a89-b331-7160-843f-4436db502cb4",
                "employee_id": "DSR042",
                "full_name": "kita tes",
                "tanggal_pengajuan": "2026-02-01",
                "efektif_resign_date": null,
                "position_name": "test",
                "note_hr": null,
                "status_name": "Menunggu Diproses"
            },
            {
                "jenis_pengajuan": "Pengunduran Diri",
                "application_id": "019c3734-f43d-73a7-945a-71dd367cd54d",
                "employee_id": "DSR042",
                "full_name": "kita tes",
                "tanggal_pengajuan": "2026-02-07",
                "efektif_resign_date": null,
                "position_name": "test",
                "note_hr": null,
                "status_name": "Dalam peninjauan"
            }
        ],
        "per_page": 10,
        "to": 2,
        "total": 2
    }
}
```

---

### 2. Detail Pengajuan (Show)

Endpoint: `GET /api/employee-master-data/resignation/applications/{id}/show`

Path Parameters:
- `id`: string (UUID), contoh: `019c3734-f43d-73a7-945a-71dd367cd54d`

Content-Type: `application/json`

Response (200 OK):

```json
{
    "meta": {
        "status": 200,
        "message": "berhasil menampilkan detail pengajuan resign"
    },
    "data": {
        "resignation_details": {
            "resignation_id": "019c3734-f441-71ce-b45e-abc577c50a45",
            "full_name": "kita tes",
            "NIP": "DSR042",
            "position_name": "test",
            "tanggal_pengajuan": "2026-02-07",
            "jenis_kontrak": "PKWT",
            "contract_end_date": "2026-02-06",
            "contract_start_date": "2026-02-05",
            "resignation_reason": null,
            "document_lampiran": null,
            "status_name": "Dalam peninjauan",
            "sisa_kontrak_bulan": 0
        },
        "resignation_documents": [
            {
                "id": "019c47db-8cbb-727a-b388-c72a588ababf",
                "resignation_id": "019c3734-f441-71ce-b45e-abc577c50a45",
                "termination_administrative_id": null,
                "document_type_id": "ee650936-eb4a-4673-b31d-e297023bde04",
                "document_name": "tes1.pdf",
                "document_path": "EmployeeMasterData/Resignation/ApplicationDocument/727d57e4-ab68-41eb-921c-f862139c1358.pdf",
                "created_at": "2026-02-10T14:01:36.000000Z",
                "updated_at": "2026-02-10T14:01:36.000000Z",
                "file_type_name": "Berita Acara Serah Terima(BAST)"
            },
            {
                "id": "019c47db-8cc5-7272-90a8-75ae5774f501",
                "resignation_id": "019c3734-f441-71ce-b45e-abc577c50a45",
                "termination_administrative_id": null,
                "document_type_id": "a61ec26d-4649-445d-940b-645d1524aeaa",
                "document_name": "tes1.pdf",
                "document_path": "EmployeeMasterData/Resignation/ApplicationDocument/fc8d99b7-4145-4319-955f-7dbbf3c0621c.pdf",
                "created_at": "2026-02-10T14:01:36.000000Z",
                "updated_at": "2026-02-10T14:01:36.000000Z",
                "file_type_name": "Form Exit Clearance"
            }
        ]
    }
}
```

---

### 3. Unggah Dokumen Pengajuan

Endpoint: `POST /api/employee-master-data/resignation/applications/{id}/upload-document`

Path Parameters:
- `id`: string (UUID), contoh: `019c3734-f441-71ce-b45e-abc577c50a45`

Content-Type: `multipart/form-data`

Form Fields:
- `document_type_id[0]`: string (UUID), contoh: `ee650936-eb4a-4673-b31d-e297023bde04`
- `file[0]`: file
- `document_type_id[1]`: string (UUID), contoh: `a61ec26d-4649-445d-940b-645d1524aeaa`
- `file[1]`: file

Contoh (form-data representasi):

```json
{
  "document_type_id[0]": "ee650936-eb4a-4673-b31d-e297023bde04",
  "file[0]": "(file)",
  "document_type_id[1]": "a61ec26d-4649-445d-940b-645d1524aeaa",
  "file[1]": "(file)"
}
```

Response (200 OK):

```json
{
  "meta": {
    "status": 200,
    "message": "Documents uploaded successfully."
  },
  "data": {}
}
```

---

### 4. Persetujuan Pengajuan

Endpoint: `POST /api/employee-master-data/resignation/applications/{id}/approve`

Path Parameters:
- `id`: string (UUID), contoh: `019c3734-f441-71ce-b45e-abc577c50a45`

Content-Type: `multipart/form-data`

Form Fields:
- `status_name`: string, nilai: `"Disetujui"`

Response (200 OK):

```json
{
  "meta": {
    "status": 200,
    "message": "Application approved successfully."
  },
  "data": {}
}
```

---

### 5. Penolakan Pengajuan

Endpoint: `POST /api/employee-master-data/resignation/applications/{id}/reject`

Path Parameters:
- `id`: string (UUID), contoh: `019c3734-f441-71ce-b45e-abc577c50a45`

Content-Type: `multipart/form-data`

Form Fields:
- `status_name`: string, nilai: `"Ditolak"`

Response (200 OK):

```json
{
  "meta": {
    "status": 200,
    "message": "Application rejected successfully."
  },
  "data": {}
}
```

---

### 6. Simpan Draft Pengajuan

Endpoint: `POST /api/employee-master-data/resignation/applications/{id}/save-draft`

Path Parameters:
- `id`: string (UUID), contoh: `019c3734-f441-71ce-b45e-abc577c50a45`

Content-Type: `multipart/form-data`

Form Fields:
- `status_name`: string, nilai: `"Dalam peninjauan"`

Response (200 OK):

```json
{
  "meta": {
    "status": 200,
    "message": "Application draft saved successfully."
  },
  "data": {}
}
```

---

## Terminasi Administrasi

### 7. Popup Terminasi Administrasi

Endpoint: `GET /api/employee-master-data/resignation/request-administration/{nip}/popup`

Path Parameters:
- `nip`: string, contoh: `DSR042`

Content-Type: `application/json`

Response (200 OK):

```json
{
    "meta": {
        "status": 200,
        "message": "berhasil menampilkan detail pengajuan resign (administration)"
    },
    "data": {
        "employee_id": "DSR042",
        "employee_name": "kita tes",
        "position_name": "test"
    }
}
```

---

### 8. Menyimpan Terminasi Administrasi

Endpoint: `POST /api/employee-master-data/resignation/request-administration/store`

Content-Type: `multipart/form-data`

Form Fields:
- `employee_id`: string, contoh: `"DSR042"`
- `tanggal_pengajuan_terminasi`: string (YYYY-MM-DD), contoh: `"2026-02-10"`
- `tanggal_efektif_terminasi`: string (YYYY-MM-DD), contoh: `"2026-02-15"`
- `description`: string, contoh: `"tes"`
- `document`: file
- `end_status_id`: string (UUID), contoh: `"21127007-8b4a-4106-b08a-e409ea1f5772"`

Contoh (form-data representasi):

```json
{
  "employee_id": "DSR042",
  "tanggal_pengajuan_terminasi": "2026-02-10",
  "tanggal_efektif_terminasi": "2026-02-15",
  "description": "tes",
  "document": "(file)",
  "end_status_id": "21127007-8b4a-4106-b08a-e409ea1f5772"
}
```

Response (200 OK):

```json
{
  "meta": {
    "status": 200,
    "message": "Termination administration stored successfully."
  },
  "data": {}
}
```

---

### 9. Daftar Terminasi Administrasi (Index)

Endpoint: `GET /api/employee-master-data/resignation/request-administration/index`

Content-Type: `application/json`

Response (200 OK):

```json
{
    "meta": {
        "status": 200,
        "message": "berhasil menampilkan daftar pengajuan resign (administration)"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "NIP": "DSR042",
                "employee_name": "kita tes",
                "tanggal_pengajuan_terminasi": "2026-02-10",
                "tanggal_efektif_terminasi": "2026-02-15",
                "position_name": "test",
                "description": "tes",
                "end_status": " PHK",
                "status_terminasi": "Selesai"
            }
        ],
        "per_page": 10,
        "to": 1,
        "total": 1
    }
}
```

---

### 10. Detail Terminasi Administrasi (Show)

Endpoint: `GET /api/employee-master-data/resignation/request-administration/{id}/show`

Path Parameters:
- `id`: string (UUID), contoh: `019c4872-22b6-706c-aa80-e649d6ce394d`

Content-Type: `application/json`

Response (200 OK):

```json
{
    "meta": {
        "status": 200,
        "message": "berhasil menampilkan detail pengajuan resign (administration)"
    },
    "data": {
        "resignation_details": {
            "termination_id": "019c4872-22b6-706c-aa80-e649d6ce394d",
            "full_name": "kita tes",
            "NIP": "DSR042",
            "position_name": "test",
            "status_terminasi": "Selesai",
            "tanggal_pengajuan_terminasi": "2026-02-10",
            "tanggal_efektif_terminasi": "2026-02-15",
            "document": "EmployeeMasterData/Resignation/TerminationDocument/548a586b-d898-47dd-8fd4-9e731d97d5dc.pdf",
            "end_status": " PHK",
            "sisa_kontrak_bulan": 0
        },
        "resignation_documents": [
            {
                "id": "019c4887-fa10-72e8-b6f9-49ef42993637",
                "resignation_id": null,
                "termination_administrative_id": "019c4872-22b6-706c-aa80-e649d6ce394d",
                "document_type_id": "2fef8142-a5ed-4366-8654-9f13d6787ced",
                "document_name": "tes1.pdf",
                "document_path": "EmployeeMasterData/Resignation/TerminationDocument/2fd1dc71-4e06-4a21-bc87-57dd0a092966.pdf",
                "created_at": "2026-02-10T17:09:56.000000Z",
                "updated_at": "2026-02-10T17:09:56.000000Z",
                "file_type_name": "Form Exit Discussion"
            },
            {
                "id": "019c4887-fa17-72d9-b7f8-ac72319926dc",
                "resignation_id": null,
                "termination_administrative_id": "019c4872-22b6-706c-aa80-e649d6ce394d",
                "document_type_id": "6ea50ae0-a856-4b77-bc4c-1a0d8b55ff87",
                "document_name": "tes1.pdf",
                "document_path": "EmployeeMasterData/Resignation/TerminationDocument/e1e3f3a9-65f4-41b8-a50b-86edc0611c11.pdf",
                "created_at": "2026-02-10T17:09:56.000000Z",
                "updated_at": "2026-02-10T17:09:56.000000Z",
                "file_type_name": "Form Exit Questionnaire"
            }
        ]
    }
}
```

---

### 11. Unggah Dokumen Terminasi Administrasi

Endpoint: `POST /api/employee-master-data/resignation/request-administration/{id}/upload-document`

Path Parameters:
- `id`: string (UUID), contoh: `019c4872-22b6-706c-aa80-e649d6ce394d`

Content-Type: `multipart/form-data`

Form Fields:
- `document_type_id[0]`: string (UUID), contoh: `2fef8142-a5ed-4366-8654-9f13d6787ced`
- `file[0]`: file
- `document_type_id[1]`: string (UUID), contoh: `6ea50ae0-a856-4b77-bc4c-1a0d8b55ff87`
- `file[1]`: file

Contoh (form-data representasi):

```json
{
  "document_type_id[0]": "2fef8142-a5ed-4366-8654-9f13d6787ced",
  "file[0]": "(file)",
  "document_type_id[1]": "6ea50ae0-a856-4b77-bc4c-1a0d8b55ff87",
  "file[1]": "(file)"
}
```

Response (200 OK):

```json
{
  "meta": {
    "status": 200,
    "message": "Documents uploaded successfully."
  },
  "data": {}
}
```

---

### 12. Submit Terminasi Administrasi (Approval)

Endpoint: `POST /api/employee-master-data/resignation/request-administration/{id}/submit`

Path Parameters:
- `id`: string (UUID), contoh: `019c4872-22b6-706c-aa80-e649d6ce394d`

Content-Type: `multipart/form-data`

Form Fields:
- `_method`: string, nilai: `"PATCH"`

Response (200 OK):

```json
{
  "meta": {
    "status": 200,
    "message": "Termination administration submitted successfully."
  },
  "data": {}
}
```

---

## Dropdown Tipe Dokumen

### 13. Daftar Tipe Dokumen

Endpoint: `GET /api/employee-master-data/resignation/dropdown-type-file`

Content-Type: `application/json`

Response (200 OK):

```json
[
    {
        "id": "ee650936-eb4a-4673-b31d-e297023bde04",
        "file_type_name": "Berita Acara Serah Terima(BAST)",
        "created_at": null,
        "updated_at": null
    },
    {
        "id": "a61ec26d-4649-445d-940b-645d1524aeaa",
        "file_type_name": "Form Exit Clearance",
        "created_at": null,
        "updated_at": null
    },
    {
        "id": "2fef8142-a5ed-4366-8654-9f13d6787ced",
        "file_type_name": "Form Exit Discussion",
        "created_at": null,
        "updated_at": null
    },
    {
        "id": "6e118c99-bc3f-49e8-a369-df7ceb241f86",
        "file_type_name": "Form Exit Interview",
        "created_at": null,
        "updated_at": null
    },
    {
        "id": "6ea50ae0-a856-4b77-bc4c-1a0d8b55ff87",
        "file_type_name": "Form Exit Questionnaire",
        "created_at": null,
        "updated_at": null
    },
    {
        "id": "ff537e1e-a520-4700-b1c1-8a1496638725",
        "file_type_name": "Informasi Garden Leave",
        "created_at": null,
        "updated_at": null
    },
    {
        "id": "1d49e879-c000-4b71-a201-b158915de959",
        "file_type_name": "Paklaring(Jika ada)",
        "created_at": null,
        "updated_at": null
    },
    {
        "id": "aa2a67be-5d5e-4e33-b753-d61804a29d47",
        "file_type_name": "Surat Balasan pengunduran Diri",
        "created_at": null,
        "updated_at": null
    }
]
```
