# Kontrak API – Kasbon (Cash Advance)

Dokumen ini merinci kontrak API untuk fitur `Kasbon` (Cash Advance). Fitur ini mencakup manajemen pengajuan kasbon oleh karyawan, persetujuan oleh HR/Finance, dan riwayat pengajuan.

## Konvensi Umum

- **Header auth**: `Authorization: Bearer <token>` untuk semua endpoint.
- **Content-Type**: `multipart/form-data` untuk form data (terutama pada POST/PATCH).
- **Response error**: `{ errorCode: string, message: string, details?: any }`.
- **Date Format**: Gunakan format ISO `YYYY-MM-DD` untuk semua field tanggal.

---

## Endpoint Utama

### 1. Get List Kasbon
Mengambil daftar pengajuan kasbon.

**Endpoint**: `GET /api/payroll/kasbon`

**Query Parameters** (opsional):
- `search` (string) – pencarian berdasarkan nama atau NIP.
- `status` (string) – filter status (`Menunggu Persetujuan HR`, `Disetujui`, `Ditolak`).
- `start_date` (string) – filter tanggal pengajuan mulai.
- `end_date` (string) – filter tanggal pengajuan selesai.

**Response** (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Loans retrieved successfully"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "employee_id": "DSR040",
                "avatar": null,
                "full_name": "tes bpjs",
                "email": "tes40@gmail.com",
                "national_id": 50641591,
                "loan_id": "969021bf-0102-11f1-95c5-54e1ad857d3e",
                "application_date": "2026-02-03",
                "nominal_loan": 5000000,
                "nominal_installment": 700,
                "loan_period": 4,
                "deduction_start_period": "2026-02-01",
                "disbursed_at": "2026-02-03",
                "rejection_reason": null,
                "loan_type_name": "Darurat",
                "loan_status_name": "Disetujui",
                "position_name": "test",
                "department_name": "hris"
            },
            {
                "employee_id": "DSR039",
                "avatar": null,
                "full_name": "tes direktur",
                "email": "tes39@gmail.com",
                "national_id": 50641590,
                "loan_id": "96900c23-0102-11f1-95c5-54e1ad857d3e",
                "application_date": "2026-02-02",
                "nominal_loan": 5000000,
                "nominal_installment": 500,
                "loan_period": 5,
                "deduction_start_period": null,
                "disbursed_at": null,
                "rejection_reason": "tes",
                "loan_type_name": "Pribadi",
                "loan_status_name": "Ditolak",
                "position_name": "test",
                "department_name": "hris"
            }
        ],
        "per_page": 10,
        "to": 2,
        "total": 2
    }
}
```

---

### 2. Get Detail Kasbon
Mengambil informasi detail dari satu pengajuan kasbon.

**Endpoint**: `GET /api/payroll/kasbon/{id}`

**Path Parameters**:
- `id` (string, required) – ID pengajuan kasbon (UUID).

**Response** (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Loan detail retrieved successfully"
    },
    "data": {
        "loan_id": "969021bf-0102-11f1-95c5-54e1ad857d3e",
        "nip": "DSR040",
        "full_name": "tes bpjs",
        "application_date": "2026-02-03",
        "position_name": "test",
        "department_name": "hris",
        "deduction_start_period": "2026-02-03",
        "loan_type_name": "Darurat",
        "nominal_loan": 5000000,
        "loan_period": 4,
        "nominal_installment": 700,
        "supervisor_approval_file": "anggap ada",
        "supporting_documents": "anggap ada",
        "loan_description": "ini untuk istri saya "
    }
}
```

---

### 3. Get Employee Info for Kasbon
Mengambil informasi dasar karyawan pratinjau sebelum/saat pengajuan kasbon.

**Endpoint**: `GET /api/payroll/kasbon/{employeeId}/employee-info`

**Path Parameters**:
- `employeeId` (string, required) – NIP atau ID karyawan.

**Response** (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Employee info retrieved successfully"
    },
    "data": {
        "nip": "DSR040",
        "full_name": "tes bpjs"
    }
}
```

---

### 4. Get Active and Completed Loans
Mengambil daftar kasbon aktif dan selesai untuk seorang karyawan.

**Endpoint**: `GET /api/payroll/kasbon/active-and-completed-loans`

**Query Parameters** (opsional):
- `employee_id` (string) – filter berdasarkan ID karyawan.

**Response** (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Active and completed loans retrieved successfully"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "employee_id": "DSR038",
                "full_name": "tes direktur",
                "email": "tes38@gmail.com",
                "loan_id": "71c9d0b0-0174-11f1-ade4-54e1ad857d3e",
                "application_date": "2026-02-03",
                "nominal_loan": 5000000,
                "nominal_installment": 1000000,
                "loan_period": 5,
                "deduction_start_period": "2026-02-04",
                "disbursed_at": "2026-02-05",
                "loan_type_name": "Darurat",
                "loan_status_name": "Masa Cicilan",
                "position_name": "test",
                "department_name": "hris"
            }
        ],
        "per_page": 10,
        "to": 1,
        "total": 1
    }
}
```

---

### 5. Approve Kasbon
Menyetujui pengajuan kasbon.

**Endpoint**: `POST /api/payroll/kasbon/{id}/approve`

**Path Parameters**:
- `id` (string, required) – ID pengajuan kasbon.

**Request Body** (form-data):
- `status` (text, required) – nilai: `Disetujui`
- `deduction_start_period` (text, required) – tanggal mulai pemotongan (format: `YYYY-MM-DD`)
- `disbursed_at` (text, required) – tanggal pencairan (format: `YYYY-MM-DD`)

**Response** (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Loan approved successfully"
    },
    "data": {
        "id": "969021bf-0102-11f1-95c5-54e1ad857d3e",
        "employee_id": "DSR040",
        "application_date": "2026-02-03",
        "deduction_start_period": "2026-02-03",
        "disbursed_at": "2026-02-03",
        "loan_type_id": "b69d0bf8-6539-4f6c-88e5-b4e07e929726",
        "nominal_loan": 5000000,
        "nominal_installment": 700,
        "loan_period": 4,
        "loan_status_id": "53b055a8-39b4-472f-a2e5-a38f92c6bcc1",
        "supervisor_approval_file": "anggap ada",
        "supporting_documents": "anggap ada",
        "loan_description": "ini untuk istri saya ",
        "rejection_reason": null,
        "created_at": null,
        "updated_at": "2026-02-03T13:56:10.000000Z"
    }
}
```

---

### 6. Reject Kasbon
Menolak pengajuan kasbon.

**Endpoint**: `POST /api/payroll/kasbon/{id}/reject`

**Path Parameters**:
- `id` (string, required) – ID pengajuan kasbon.

**Request Body** (form-data):
- `status` (text, required) – nilai: `Ditolak`
- `rejection_reason` (text, required) – alasan penolakan.

**Response** (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Loan rejected successfully"
    },
    "data": {
        "id": "96900c23-0102-11f1-95c5-54e1ad857d3e",
        "employee_id": "DSR039",
        "application_date": "2026-02-02",
        "deduction_start_period": null,
        "disbursed_at": null,
        "loan_type_id": "fd854227-c6e1-4359-8c42-e9e6a042fec0",
        "nominal_loan": 5000000,
        "nominal_installment": 500,
        "loan_period": 5,
        "loan_status_id": "4e6a7a39-3b7a-4d30-85ee-abbd04a8a98b",
        "supervisor_approval_file": "anggap ada",
        "supporting_documents": "anggap ada ",
        "loan_description": "ini untuk anak saya ",
        "rejection_reason": null,
        "created_at": null,
        "updated_at": "2026-02-03T14:00:28.000000Z"
    }
}
```

---

## Contoh Request cURL

### Get List Kasbon
```bash
curl -X GET \
  "http://localhost:3000/api/payroll/kasbon" \
  -H "Authorization: Bearer <token>"
```

### Approve Kasbon
```bash
curl -X POST \
  "http://localhost:3000/api/payroll/kasbon/969021bf-0102-11f1-95c5-54e1ad857d3e/approve" \
  -H "Authorization: Bearer <token>" \
  -F "status=Disetujui" \
  -F "deduction_start_period=2026-02-03" \
  -F "disbursed_at=2026-02-03"
```

### Reject Kasbon
```bash
curl -X POST \
  "http://localhost:3000/api/payroll/kasbon/96900c23-0102-11f1-95c5-54e1ad857d3e/reject" \
  -H "Authorization: Bearer <token>" \
  -F "status=Ditolak" \
  -F "rejection_reason=pokok di tolak"
```

---

## Catatan Implementasi

- **ID Persistence**: Pastikan UUID yang diterima dari frontend dipetakan dengan benar ke database.
- **File Handling**: `approval_letter` dan `supporting_document` dikembalikan dalam bentuk URL yang dapat diakses atau path internal yang akan dihandle oleh `LinkPreview`.
- **Status Enum**: Status yang valid adalah `Menunggu Persetujuan HR`, `Disetujui`, dan `Ditolak`.
- **Nominal**: Semua nilai nominal dikirim sebagai `number` untuk memudahkan kalkulasi di frontend.
