# Kontrak API – Perpanjangan Kontrak

Dokumen ini merinci kontrak API untuk fitur `Perpanjangan Kontrak` (Contract Extension). Diselaraskan dengan Postman collection yang tersedia.

## Konvensi Umum

- **Header auth**: `Authorization: Bearer <token>` untuk semua endpoint yang memodifikasi data.
- **Method**: Menggunakan `POST` dengan field `_method: PATCH` untuk update karena backend menggunakan method spoofing.
- **Content-Type**: `multipart/form-data` untuk form data dan file uploads.
- **Response error**: `{ errorCode: string, message: string, details?: any }`.

---

## Halaman: Perpanjangan Kontrak

### Get List Perpanjangan Kontrak

**Endpoint**: `GET /api/employee-master-data/contract-extensions/index`

**Response** (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Contract Extension data retrieved successfully."
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": "019c30fc-81d8-70d4-a4de-89f4eb92f114",
                "nip": "DSR042",
                "avatar": null,
                "employee_name": "kita tes",
                "department_name": "hris",
                "current_contract_start": "2025-01-15",
                "current_contract_end": "2026-04-07",
                "remaining_month": 2,
                "extension_note": null,
                "extension_status_name": "Menunggu diproses"
            },
            {
                "id": "019c2bec-493c-71d5-ad62-d93d5865839b",
                "nip": "DSR041",
                "avatar": null,
                "employee_name": "semoga tidak double",
                "department_name": "hris",
                "current_contract_start": "2025-01-15",
                "current_contract_end": "2026-04-06",
                "remaining_month": 2,
                "extension_note": "kita tes update ke berubah",
                "extension_status_name": "Diperpanjang Berubah"
            }
        ],
        "per_page": 10,
        "to": 2,
        "total": 2
    }
}
```

### Get Detail Perpanjangan Kontrak

**Endpoint**: `GET /api/employee-master-data/contract-extensions/{id}/detail`

**Path Parameters**:
- `id` (string, required) – ID request extension (UUID)

**Response** (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Contract Extension detail retrieved successfully."
    },
    "data": {
        "employee_code": "DSR041",
        "employee_id": "DSR041",
        "employee_name": "semoga tidak double",
        "current_position": "tes dengan jabatan structural",
        "current_department": "hris",
        "start_date": "2025-01-15",
        "end_date": "2026-04-06",
        "remaining_contract": 2,
        "extension_status": "Diperpanjang Berubah",
        "extension_status_id": "96484c2a-a670-4d54-9354-9f930808da9a",
        "contract_type_id": "86b58efc-b8df-43f6-a634-917f08c02efc",
        "contract_type": "PKWT",
        "contract_sequence": 5,
        "new_contract_signed_date": "2026-02-05",
        "new_contract_end_date": "2026-02-06",
        "contract_id": "019c2d70-d2ff-7127-b496-431194e62b37",
        "contract_document": "EmployeeMasterData/DocumentContract/12c401aa-38ca-4b9c-b866-adf36486dd2c.pdf",
        "evaluation_document": "EmployeeMasterData/ContractExtension/522647d1-5669-4c55-9aaa-cb971abed74f.pdf",
        "note": "kita tes update ke berubah",
        "previous_position": {
            "employee_category": "Staff",
            "employee_category_id": "c62158fa-eb4a-4d9b-ba81-345bc8a74ade",
            "company": "Dasaria",
            "company_id": "019b493b-dcbb-723e-9b0b-5b513fe5159a",
            "office": "HO",
            "office_id": "019b4945-bbe0-72ac-880f-3b89fa6e8fd6",
            "directorate": "directorat 1",
            "directorate_id": "019b4948-a941-71c3-8ff5-96d7aebef5b6",
            "division": "test 2",
            "division_id": "019b495b-df75-7028-90c7-d27d92813b76",
            "department": "hris",
            "department_id": "019b4976-3df7-700b-ae68-c73682551d2e",
            "unit": null,
            "unit_id": null,
            "position": "tes dengan jabatan structural",
            "position_id": "019bfa15-cd61-7093-b7f8-a4a323379330",
            "rank_position": "Direktur",
            "rank_position_id": "019bd5de-888e-73ec-9000-90c5fc693b52",
            "structural_position": "tes oke",
            "structural_position_id": "019bd95d-2d17-7032-b512-50ae7e413f2d",
            "position_level": "Senior",
            "position_level_id": "1c2fb0d4-3134-443c-a190-34b67f6342b6",
            "grade": "TAS-001",
            "salary": 6353000
        },
        "new_position": {
            "change_type": "Promosi",
            "change_type_id": "34683d1d-3c9a-4835-ae75-6db0235f2076",
            "employee_category": "Staff",
            "employee_category_id": "c62158fa-eb4a-4d9b-ba81-345bc8a74ade",
            "company": "Dasaria",
            "company_id": "019b493b-dcbb-723e-9b0b-5b513fe5159a",
            "office": "HO",
            "office_id": "019b4945-bbe0-72ac-880f-3b89fa6e8fd6",
            "directorate": "directorat 1",
            "directorate_id": "019b4948-a941-71c3-8ff5-96d7aebef5b6",
            "division": "test 2",
            "division_id": "019b495b-df75-7028-90c7-d27d92813b76",
            "department": "hris",
            "department_id": "019b4976-3df7-700b-ae68-c73682551d2e",
            "unit": null,
            "unit_id": null,
            "position": "tes dengan jabatan structural",
            "position_id": "019bfa15-cd61-7093-b7f8-a4a323379330",
            "rank_position": "Direktur",
            "rank_position_id": "019bd5de-888e-73ec-9000-90c5fc693b52",
            "structural_position": "tes oke",
            "structural_position_id": "019bd95d-2d17-7032-b512-50ae7e413f2d",
            "position_level": "Senior",
            "position_level_id": "1c2fb0d4-3134-443c-a190-34b67f6342b6",
            "grade": "TAS-001",
            "salary": null
        }
    }
}
```

### Get Dropdown Extension Status

**Endpoint**: `GET /api/employee-master-data/contract-extensions/dropdown-extension-status`

**Response** (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Contract Extension statuses retrieved successfully."
    },
    "data": [
        {
            "id": "80e58e1d-29ba-4c1a-90f8-24d07030c512",
            "name": "Ditolak",
            "created_at": "2026-02-04T08:07:00.000000Z",
            "updated_at": "2026-02-04T08:07:00.000000Z"
        },
        {
            "id": "8c131111-cf44-41e9-a80d-6938532d267a",
            "name": "Diperpanjang Tetap",
            "created_at": "2026-02-04T08:07:00.000000Z",
            "updated_at": "2026-02-04T08:07:00.000000Z"
        },
        {
            "id": "96484c2a-a670-4d54-9354-9f930808da9a",
            "name": "Diperpanjang Berubah",
            "created_at": "2026-02-04T08:07:00.000000Z",
            "updated_at": "2026-02-04T08:07:00.000000Z"
        },
        {
            "id": "9e16729a-4f63-41e7-9aa0-daa99dc69cfa",
            "name": "Menunggu diproses",
            "created_at": "2026-02-04T08:07:00.000000Z",
            "updated_at": "2026-02-04T08:07:00.000000Z"
        },
        {
            "id": "ce0a3dda-f314-4e13-b715-4d287dc7b466",
            "name": "Sedang di Proses",
            "created_at": "2026-02-04T08:07:00.000000Z",
            "updated_at": "2026-02-04T08:07:00.000000Z"
        }
    ]
}
```

---

## Operasi CRUD – Perpanjangan Kontrak

### Process Request Decision (Update)

**Endpoint**: `POST /api/employee-master-data/contract-extensions/{id}/process-request-decision`

**Method Spoofing**: Gunakan field `_method: PATCH` dalam form data.

**Path Parameters**:
- `id` (string, required) – ID request extension (UUID)

**Request Body** (form-data):
- `_method` (text, required) – nilai: `PATCH`
- `extension_status_id` (text, required) – ID status perpanjangan (UUID)
- `note` (text, optional) – Catatan
- `document_evaluasi` (file, optional) – File dokumen evaluasi
- `contract_type_id` (text, required) – ID tipe kontrak (UUID)
- `contract_number` (text, optional) – Nomor kontrak
- `sign_date_new_contract` (text, required) – Tanggal tanda tangan kontrak baru (ISO date: `YYYY-MM-DD`)
- `end_date_new_contract` (text, required) – Tanggal berakhir kontrak baru (ISO date: `YYYY-MM-DD`)
- `contract_document` (file, optional) – File dokumen kontrak
- `salary` (text, optional) – Nominal gaji
- `company_id` (text, optional) – ID Perusahaan (UUID)
- `office_id` (text, optional) – ID Kantor (UUID)
- `directorate_id` (text, optional) – ID Direktorat (UUID)
- `department_id` (text, optional) – ID Departemen (UUID)
- `division_id` (text, optional) – ID Divisi (UUID)
- `position_id` (text, optional) – ID Posisi (UUID)
- `job_title_id` (text, optional) – ID Job Title (UUID)
- `structural_job_id` (text, optional) – ID Jabatan Struktural (UUID)
- `unit_id` (text, optional) – ID Unit (UUID)
- `position_level_id` (text, optional) – ID Level Posisi (UUID)
- `change_type_id` (text, optional) – ID Tipe Perubahan (UUID)
- `employee_category_id` (text, optional) – ID Kategori Karyawan (UUID)

**Response** (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Berhasil memproses keputusan perpanjangan kontrak"
    },
    "data": {
        // Struktur data response setelah update
    }
}
```

**Status**: `200 OK`

---

## Contoh Request cURL

### Process Request Decision
```bash
curl -X POST \
  "http://localhost:3000/api/employee-master-data/contract-extensions/019c2bec-493c-71d5-ad62-d93d5865839b/process-request-decision" \
  -H "Authorization: Bearer <token>" \
  -F "_method=PATCH" \
  -F "extension_status_id=96484c2a-a670-4d54-9354-9f930808da9a" \
  -F "note=kita tes update ke berubah" \
  -F "document_evaluasi=@/D:/tes1.pdf" \
  -F "contract_type_id=86b58efc-b8df-43f6-a634-917f08c02efc" \
  -F "contract_number=2" \
  -F "sign_date_new_contract=2026-02-05" \
  -F "end_date_new_contract=2026-02-06" \
  -F "contract_document=@/D:/tes1.pdf" \
  -F "salary=8000000" \
  -F "company_id=019b493b-dcbb-723e-9b0b-5b513fe5159a" \
  -F "office_id=019b4945-bbe0-72ac-880f-3b89fa6e8fd6" \
  -F "directorate_id=019b4948-a941-71c3-8ff5-96d7aebef5b6" \
  -F "department_id=019b4976-3df7-700b-ae68-c73682551d2e" \
  -F "division_id=019b495b-df75-7028-90c7-d27d92813b76" \
  -F "position_id=019bfa15-cd61-7093-b7f8-a4a323379330" \
  -F "job_title_id=019bd5de-888e-73ec-9000-90c5fc693b52" \
  -F "structural_job_id=019bd95d-2d17-7032-b512-50ae7e413f2d" \
  -F "unit_id=" \
  -F "position_level_id=1c2fb0d4-3134-443c-a190-34b67f6342b6" \
  -F "change_type_id=34683d1d-3c9a-4835-ae75-6db0235f2076" \
  -F "employee_category_id=c62158fa-eb4a-4d9b-ba81-345bc8a74ade"
```

## Catatan Implementasi

- **Method Spoofing**: Backend menggunakan `_method` field untuk override HTTP method.
- **File Upload**: Field `document_evaluasi` dan `contract_document` dikirim sebagai file.
- **Date Format**: Gunakan format ISO `YYYY-MM-DD`.
- **Optional Fields**: Kirim field yang perlu diupdate saja atau sesuai kebutuhan validasi backend.
