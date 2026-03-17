# Kontrak API – Perubahan Organisasi

Dokumen ini merinci kontrak API untuk fitur `Perubahan Organisasi` pada modul Employee Master Data.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>`
- Method: Menggunakan `POST` untuk create dan update
- Content-Type: `multipart/form-data`

---

## Halaman: Perubahan Organisasi

### Index Perubahan Organisasi

Endpoint: `GET /api/employee-master-data/organization-changes`

Query Parameters:
- `category`: string (optional) – Filter kategori (`hr` atau `recomendation`)
- `filter[employee_name]`: string (optional) – Filter nama karyawan
- `sort`: string (optional) – Sorting (contoh: `-employee_name` untuk descending, `employee_name` untuk ascending)
- `page`: integer (optional) – Nomor halaman (default: 1)
- `per_page`: integer (optional) – Jumlah data per halaman (default: 10)

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
                "id": 1,
                "employee_id": "DSR041",
                "employee_name": "Laila Nur Aisyah",
                "change_type_name": "Demosi",
                "effective_date": "2026-09-06",
                "org_change_status": "Selesai",
                "category": "HR"
            },
            {
                "id": 2,
                "employee_id": "DSR041",
                "employee_name": "Laila Nur Aisyah",
                "change_type_name": "Demosi",
                "effective_date": "2026-09-07",
                "org_change_status": "Selesai",
                "category": "Rekomendasi"
            },
            {
                "id": 3,
                "employee_id": "DSR041",
                "employee_name": "Laila Nur Aisyah",
                "change_type_name": "Demosi",
                "effective_date": "2026-09-09",
                "org_change_status": "Upload Dokumen",
                "category": "Rekomendasi"
            }
        ],
        "per_page": 10,
        "to": 3,
        "total": 3
    }
}
```

Response dengan filter `category=recomendation` (200 OK):
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
                "id": 2,
                "employee_id": "DSR041",
                "employee_name": "Laila Nur Aisyah",
                "change_type_name": "Demosi",
                "effective_date": "2026-09-07",
                "org_change_status": "Selesai",
                "category": "Rekomendasi"
            },
            {
                "id": 3,
                "employee_id": "DSR041",
                "employee_name": "Laila Nur Aisyah",
                "change_type_name": "Demosi",
                "effective_date": "2026-09-09",
                "org_change_status": "Upload Dokumen",
                "category": "Rekomendasi"
            }
        ],
        "per_page": 10,
        "to": 2,
        "total": 2
    }
}
```

### Detail Perubahan Organisasi

Endpoint: `GET /api/employee-master-data/organization-changes/{changeId}/show`

Path Parameters:
- `changeId` (string, required) – ID perubahan organisasi

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "berhasil mendapatkan detail perubahan organisasi karyawan"
    },
    "data": {
        "id": "3",
        "employee_id": "DSR041",
        "employee_name": "Laila Nur Aisyah",
        "marital_status": "Tidak Menikah",
        "dependents": 2,
        "reason_change": "ppp",
        "decree_file": null,
        "adendum_file": null,
        "previous_position": {
            "employee_category": "Staff",
            "employee_category_id": "21edeb66-898c-484a-bff6-3d3e778f64fb",
            "company": "Griyanet",
            "office": "Rumah IT",
            "directorate": "IT&Network",
            "division": "IT",
            "department": "IT",
            "unit": "IT",
            "position": "IT Business Operation",
            "rank_position": "Principal",
            "structural_position": "tes oke",
            "position_level": "Senior",
            "gaji_pokok": 3500000,
            "tunjangan_pernikahan": 150000,
            "tunjangan_jabatan": 350000,
            "tunjangan_lama_kerja": 200000,
            "grade": "D3",
            "tunjangan_dekresi": [
                {
                    "id": "019cfae6-9bb3-72a7-a4f8-3949942a40ae",
                    "amount": 1000000,
                    "allowance_name": "Tunjangan Profesional"
                }
            ],
            "take_home_pay": 3700000
        },
        "new_position": {
            "employee_category": "Staff",
            "employee_category_id": "21edeb66-898c-484a-bff6-3d3e778f64fb",
            "company": "Griyanet",
            "office": "Rumah IT",
            "directorate": "IT&Network",
            "division": "IT",
            "department": "IT",
            "unit": "IT",
            "position": "IT Business Operation",
            "rank_position": "Principal",
            "structural_position": "tes oke",
            "position_level": "Senior",
            "gaji_pokok": 3500000,
            "tunjangan_pernikahan": 150000,
            "tunjangan_jabatan": 350000,
            "tunjangan_lama_kerja": 200000,
            "grade": "D3",
            "tunjangan_dekresi": [
                {
                    "id": "019cfb54-3926-7049-801a-a6577762b1fa",
                    "amount": 1000000,
                    "allowance_name": "Tunjangan Profesional"
                }
            ],
            "take_home_pay": 3700000
        }
    }
}
```

### Get Perubahan Organisasi by Employee

Endpoint: `GET /api/employee-master-data/organization-changes/employee/{employeeId}/show`

Path Parameters:
- `employeeId` (string, required) – ID karyawan

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "berhasil mendapatkan data karyawan"
    },
    "data": {
        "employee_code": "DSR041",
        "employee_id": "DSR041",
        "employee_name": "Laila Nur Aisyah",
        "current_position": "IT Business Operation",
        "current_department": "IT",
        "start_date": "2026-03-09",
        "end_date": "2026-03-31",
        "remaining_contract": "14 hari",
        "marital_status": "Tidak Menikah",
        "dependents": 2,
        "last_contract_id": "019cedd2-2394-7383-b80b-f7672e5626db",
        "contract_type_id": "ac5fd9f8-a375-4237-b680-839a7ab8b26d",
        "contract_type": "PKWTT",
        "extension_status": "Sedang diproses",
        "contract_sequence": 4,
        "note": null,
        "previous_position": {
            "employee_category": "Staff",
            "employee_category_id": "21edeb66-898c-484a-bff6-3d3e778f64fb",
            "company": "Griyanet",
            "office": "Rumah IT",
            "directorate": "IT&Network",
            "division": "IT",
            "department": "IT",
            "unit": "IT",
            "position": "IT Business Operation",
            "rank_position": "Principal",
            "structural_position": "tes oke",
            "position_level": "Senior",
            "gaji_pokok": 3500000,
            "tunjangan_pernikahan": 150000,
            "tunjangan_jabatan": 350000,
            "tunjangan_lama_kerja": 200000,
            "grade": "D3",
            "tunjangan_dekresi": [
                {
                    "id": "019cfb54-3926-7049-801a-a6577762b1fa",
                    "amount": 1000000,
                    "allowance_name": "Tunjangan Profesional"
                }
            ],
            "take_home_pay": 3700000
        }
    }
}
```

### Store Perubahan Organisasi

Endpoint: `POST /api/employee-master-data/organization-changes`

Request Body (form-data):
- `employee_id`: string (required) – ID Karyawan
- `org_change_type`: string (required) – Tipe perubahan organisasi (`recomendation` atau `hr`)
- `change_type_id`: string (required) – ID tipe perubahan
- `change_type_name`: string (required) – Nama tipe perubahan (contoh: Demosi, Promosi, Mutasi)
- `effective_date`: string (required) – Tanggal efektif (format: YYYY-MM-DD)
- `employee_category_id`: string (required) – ID kategori karyawan
- `company_id`: string (required) – ID perusahaan
- `position_level_id`: string (required) – ID level posisi
- `office_id`: string (required) – ID kantor
- `directorate_id`: string (required) – ID direktorat
- `division_id`: string (required) – ID divisi
- `department_id`: string (required) – ID departemen
- `job_title_id`: string (required) – ID jabatan
- `structural_job_id`: string (required) – ID jabatan struktural
- `position_id`: string (required) – ID posisi
- `unit_id`: string (required) – ID unit
- `non_fix_allowance[0][non_fix_allowance_id]`: string – ID tunjangan tidak tetap (opsional, array)
- `non_fix_allowance[0][amount]`: string – Jumlah tunjangan tidak tetap (opsional, array)
- `decree_file`: file – File SK (nullable, opsional untuk recomendation)
- `adendum_file`: file – File adendum (nullable, opsional)
- `recommended_by`: string – Direkomendasikan oleh (nullable, opsional)
- `created_by`: string – Dibuat oleh (nullable, opsional)
- `reason`: string (required) – Alasan perubahan

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Berhasil menyimpan data perubahan organisasi"
    },
    "data": {
        "id": "uuid",
        "employee_id": "DSR041",
        "org_change_type": "recomendation",
        "change_type_id": "cbc71d4c-3327-465b-86e1-e37adc2ba21f",
        "change_type_name": "Demosi",
        "effective_date": "2026-09-09",
        "employee_category_id": "21edeb66-898c-484a-bff6-3d3e778f64fb",
        "company_id": "019ccbaa-1585-73ef-9f99-8c65b9afe813",
        "position_level_id": "1c2fb0d4-3134-443c-a190-34b67f6342b6",
        "office_id": "019cd277-da8a-72b6-b72d-95ded814dd90",
        "directorate_id": "019ccbab-a5c6-73ca-bbb6-08a21add31fd",
        "division_id": "019ccbac-0840-701d-ae51-62cdae7dfb67",
        "department_id": "019cd0e0-8f46-71a7-b808-6a96f5edfb0d",
        "job_title_id": "019ccbb4-a30e-72f1-8934-1b517ae6980c",
        "structural_job_id": "019bd95d-2d17-7032-b512-50ae7e413f2d",
        "position_id": "019cd600-4ee4-71f8-8e51-35364cac55be",
        "unit_id": "019cd5de-b4c3-729f-b893-8c1860f070aa",
        "non_fix_allowance": [
            {
                "non_fix_allowance_id": "019cd68d-6a76-70f7-84e0-379e76da65d1",
                "amount": "1000000"
            }
        ],
        "decree_file": "filename.pdf",
        "adendum_file": "filename.pdf",
        "recommended_by": null,
        "created_by": null,
        "reason": "ppp",
        "created_at": "2026-03-17T10:00:00.000000Z",
        "updated_at": "2026-03-17T10:00:00.000000Z"
    }
}
```

### Upload Dokumen Perubahan Organisasi

Endpoint: `POST /api/employee-master-data/organization-changes/{changeId}/upload-doc`

Path Parameters:
- `changeId` (string, required) – ID perubahan organisasi

Request Body (form-data):
- `decree_file`: file – File SK (opsional)
- `adendum_file`: file – File adendum (opsional)

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Berhasil mengupload dokumen"
    },
    "data": {
        "decree_file": "path/to/decree_file.pdf",
        "adendum_file": "path/to/adendum_file.pdf"
    }
}

---

## Catatan Tambahan

### Validasi
- `org_change_type` harus berupa `recomendation` atau `hr`
- `effective_date` harus dalam format YYYY-MM-DD
- Field dengan tipe file hanya menerima format PDF, DOC, DOCX
- Ukuran maksimal file: 5MB

### Alur Proses
1. **Recomendation**: Perubahan yang diajukan oleh atasan/rekomendator
   - `decree_file` tidak wajib diisi
   - Memerlukan validasi dari HR

2. **HR**: Perubahan yang langsung dilakukan oleh HR
   - `decree_file` wajib diisi
   - Langsung dapat diproses tanpa validasi tambahan

### Non-Fix Allowance
- Support multiple allowance entries dengan format array
- Format: `non_fix_allowance[index][field]`
- Field yang tersedia: `non_fix_allowance_id`, `amount`