
# Kontrak API – Distribusi Slip Gaji

Dokumen ini merinci kontrak API untuk fitur `Distribusi Slip Gaji` pada modul Payroll. Diselaraskan dengan Postman collection yang tersedia.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>`
- Method: Beberapa endpoint update menggunakan `POST` dengan field `_method: PATCH` (method spoofing)
- Content-Type: `application/x-www-form-urlencoded` atau `multipart/form-data`
- Base path: `/api/payroll/payroll-periode`

---

## Halaman: Distribusi Slip Gaji

### Daftar Payroll untuk Distribusi

Endpoint: `GET /api/payroll/payroll-periode/index-distribution`

Query Parameters:
- `page` (number, opsional)
- `per_page` (number, opsional)
- `search` (string, opsional)
- `status` (string, opsional)
- `column` (string, opsional) – kolom untuk sort
- `sort` (`asc` | `desc`, opsional)
- `filter_column[<column>][in][]` (string[], opsional)
- `filter_column[<column>][range][]` (string[], opsional) – start/end date

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Data payroll periode distribution retrieved successfully"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "payroll_id": "019c75f4-9bb7-710e-b1e1-cc57bdded9ff",
                "employee_id": "DSR035",
                "avatar": null,
                "full_name": "tes direktur",
                "periode": "2026-02-19",
                "email": "mr716604@gmail.com",
                "bank_name": "Bank BCA",
                "bank_account_number": 34534635,
                "net_salary": "10984000",
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Selesai"
            },
            {
                "payroll_id": "019c7a5e-2363-713c-9972-eea47f2abcf3",
                "employee_id": "DSR035",
                "avatar": null,
                "full_name": "tes direktur",
                "periode": "2026-02-20",
                "email": "mr716604@gmail.com",
                "bank_name": "Bank BCA",
                "bank_account_number": 34534635,
                "net_salary": "10984000",
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Selesai"
            },
            {
                "payroll_id": "019c7a5e-23b5-7158-a4a7-c40ac5e222ad",
                "employee_id": "DSR036",
                "avatar": "EmployeeMasterData/Avatar/a8a4bd5b-6caa-4ce2-ad92-4a162ea526cb.jpeg",
                "full_name": "tes direktur",
                "periode": "2026-02-20",
                "email": "211111036@mhs.stiki.ac.id",
                "bank_name": "Bank BCA",
                "bank_account_number": 34534635,
                "net_salary": "11299000",
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Selesai"
            },
            {
                "payroll_id": "019c7a5e-2404-7125-8652-1a7903a7cafc",
                "employee_id": "DSR038",
                "avatar": null,
                "full_name": "tes direktur",
                "periode": "2026-02-20",
                "email": "sincos891@gmail.com",
                "bank_name": "Bank BCA",
                "bank_account_number": 34534635,
                "net_salary": "10302000",
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Selesai"
            },
            {
                "payroll_id": "019c7a5e-2451-7107-8e51-3f73645de761",
                "employee_id": "DSR039",
                "avatar": null,
                "full_name": "tes direktur",
                "periode": "2026-02-20",
                "email": "faradhilaputri10@gmail.com",
                "bank_name": "Bank BCA",
                "bank_account_number": 34534635,
                "net_salary": "12094000",
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Selesai"
            },
            {
                "payroll_id": "019c75f4-9c10-735e-aa56-78e790a2c2ef",
                "employee_id": "DSR036",
                "avatar": "EmployeeMasterData/Avatar/a8a4bd5b-6caa-4ce2-ad92-4a162ea526cb.jpeg",
                "full_name": "tes direktur",
                "periode": "2026-02-19",
                "email": "211111036@mhs.stiki.ac.id",
                "bank_name": "Bank BCA",
                "bank_account_number": 34534635,
                "net_salary": "11299000",
                "employee_category_name": "Staff",
                "company_name": "Dasaria",
                "payroll_status_name": "Proses distribusi"
            }
        ],
        "per_page": 10,
        "to": 6,
        "total": 6
    }
}
```

Status: `200 OK`

---

### Kirim Slip Gaji (Distribusi)

Endpoint: `POST /api/payroll/payroll-periode/send-slip-salary`

Method Spoofing: gunakan `_method: PATCH` pada form data

Request Body (form-data):
- `_method` (text, required) – nilai: `PATCH`
- `payroll_id[0]` (text, opsional) – ID payroll yang akan dikirim slip gaji
- `payroll_id[1]` (text, opsional) – ulangi sesuai jumlah data yang diproses
- `all` (text, opsional) – nilai: `true` (jika ingin proses semua data)
- `payroll_periode_id` (text, opsional) – ID payroll periode (dipakai pada Postman sample)

Catatan:
- Jika `all=true`, `payroll_id[n]` biasanya tidak diperlukan.
- Jika `all` tidak dikirim, kirim minimal 1 item `payroll_id[0]`.

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "Slip salary distribution processed successfully"
  },
  "data": {
    "processed": true
  }
}
```

Status: `200 OK`

---

### Ambil Slip Gaji
ini lebih ke redirect ke halaman slip gaji

Endpoint: `GET /api/payroll/payroll-periode/{payroll_id}/slip-gaji`

Path Parameters:
- `payroll_id` (string, required) – ID payroll (UUID)

<!-- Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "Slip gaji retrieved successfully"
  },
  "data": {}
}
```

Status: `200 OK` -->

---

## Contoh Request cURL

### Daftar Payroll untuk Distribusi
```bash
curl -X GET \
  "http://localhost:3000/api/payroll/payroll-periode/index-distribution" \
  -H "Authorization: Bearer <token>"
```

### Kirim Slip Gaji (Distribusi)
```bash
curl -X POST \
  "http://localhost:3000/api/payroll/payroll-periode/send-slip-salary" \
  -H "Authorization: Bearer <token>" \
  -F "_method=PATCH" \
  -F "payroll_id[0]=019c7a5e-2363-713c-9972-eea47f2abcf3" \
  -F "payroll_id[1]=019c7a5e-23b5-7158-a4a7-c40ac5e222ad" \
  -F "all=true" \
  -F "payroll_periode_id=019c7a5e-22bd-71ab-a5ae-a7238e5104b6"
```

### Ambil Slip Gaji
```bash
curl -X GET \
  "http://localhost:3000/api/payroll/payroll-periode/019c75f4-9bb7-710e-b1e1-cc57bdded9ff/slip-gaji" \
  -H "Authorization: Bearer <token>"
```
