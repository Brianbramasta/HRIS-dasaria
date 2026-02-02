# Kontrak API – Compensation (Payroll Configuration)

Dokumen ini merinci kontrak API untuk fitur `Compensation` pada modul Payroll Configuration. Diselaraskan dengan Postman collection yang tersedia.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>` untuk semua endpoint yang memodifikasi data
- Method: Menggunakan `POST` dengan field `_method: PATCH/DELETE` (method spoofing)
- Content-Type: `multipart/form-data` untuk form data
- Response error: `{ errorCode: string, message: string, details?: any }`

---

## Halaman: Compensation

### Daftar Compensation

Endpoint: `GET /api/payroll/payroll-configuration/compensation/index`

Query Parameters (opsional):
- `search` (string)
- `filter[]` (string, multiple)
- `page` (integer)
- `per_page` (integer)

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Get All Compensation Success"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": "019bd95a-c70c-71d4-9218-ed1004d4c341",
                "job_title_name": "Direktur",
                "mt_structural_job_name": "tes oke",
                "category_compensation": "Gaji Pokok",
                "amount_general": null,
                "amount_junior": 3524238,
                "amount_middle": 3524238,
                "amount_senior": 5000000
            },
            {
                "id": "019bd95a-c70c-71d4-9218-ed1004d4c341",
                "job_title_name": "Direktur",
                "mt_structural_job_name": "tes oke 2",
                "category_compensation": "Gaji Pokok",
                "amount_general": null,
                "amount_junior": 3524238,
                "amount_middle": 3524238,
                "amount_senior": 5000000
            },
            {
                "id": "019bd95a-c70c-71d4-9218-ed1004d4c341",
                "job_title_name": "Direktur",
                "mt_structural_job_name": "tes oke 3",
                "category_compensation": "Gaji Pokok",
                "amount_general": null,
                "amount_junior": 3524238,
                "amount_middle": 3524238,
                "amount_senior": 5000000
            },
            {
                "id": "019bd95e-86fc-7386-9ce0-71a50d1d9dec",
                "job_title_name": "Manager",
                "mt_structural_job_name": "tes oke",
                "category_compensation": "Gaji Pokok",
                "amount_general": null,
                "amount_junior": 4100000,
                "amount_middle": 4100000,
                "amount_senior": 5000000
            },
            {
                "id": "019bd95e-86fc-7386-9ce0-71a50d1d9dec",
                "job_title_name": "Manager",
                "mt_structural_job_name": "tes oke 2",
                "category_compensation": "Gaji Pokok",
                "amount_general": null,
                "amount_junior": 4100000,
                "amount_middle": 4100000,
                "amount_senior": 5000000
            },
            {
                "id": "019bd95e-86fc-7386-9ce0-71a50d1d9dec",
                "job_title_name": "Manager",
                "mt_structural_job_name": "tes oke 3",
                "category_compensation": "Gaji Pokok",
                "amount_general": null,
                "amount_junior": 4100000,
                "amount_middle": 4100000,
                "amount_senior": 5000000
            },
            {
                "id": "019bd95e-870b-706b-9e36-ccf7cd66b7f7",
                "job_title_name": "Supervisor",
                "mt_structural_job_name": "tes oke",
                "category_compensation": "Gaji Pokok",
                "amount_general": null,
                "amount_junior": 3524283,
                "amount_middle": 3524283,
                "amount_senior": 5000000
            },
            {
                "id": "019bd95e-870b-706b-9e36-ccf7cd66b7f7",
                "job_title_name": "Supervisor",
                "mt_structural_job_name": "tes oke 2",
                "category_compensation": "Gaji Pokok",
                "amount_general": null,
                "amount_junior": 3524283,
                "amount_middle": 3524283,
                "amount_senior": 5000000
            },
            {
                "id": "019bd95e-870b-706b-9e36-ccf7cd66b7f7",
                "job_title_name": "Supervisor",
                "mt_structural_job_name": "tes oke 3",
                "category_compensation": "Gaji Pokok",
                "amount_general": null,
                "amount_junior": 3524283,
                "amount_middle": 3524283,
                "amount_senior": 5000000
            },
            {
                "id": "019bd95e-8711-734a-b222-2f032f052191",
                "job_title_name": "Prinsipal Officer",
                "mt_structural_job_name": "tes oke",
                "category_compensation": "Gaji Pokok",
                "amount_general": null,
                "amount_junior": 3524283,
                "amount_middle": 3524283,
                "amount_senior": 5000000
            }
        ],
        "per_page": 10,
        "to": 10,
        "total": 24
    }
}
```

Status: `200 OK`

---

## Operasi CRUD – Compensation

### Detail Compensation

Endpoint: `GET /api/payroll/payroll-configuration/compensation/{id}/show`

Path Parameters:
- `id` (string, required) – ID compensation (UUID)

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Get Compensation By ID Success"
    },
    "data": {
        "id": "019bd95e-8729-7399-ada1-08126508d1df",
        "job_title": {
            "id": "019bd95e-702c-71b1-8eca-335672a7e99f",
            "job_title_name": "Under Staff-Pkl",
            "structural_jobs": [
                {
                    "id": "019bd95e-7030-7108-8c4a-aac8d566467e",
                    "mt_structural_job_name": "tes oke"
                },
                {
                    "id": "019bd95e-7034-70cb-bede-10280d16144f",
                    "mt_structural_job_name": "tes oke 2"
                },
                {
                    "id": "019bd95e-7036-73f6-9fec-20df7f9683f5",
                    "mt_structural_job_name": "tes oke 3"
                }
            ]
        },
        "category_compensation": "Uang Saku",
        "amount_general": 1000000,
        "amount_junior": null,
        "amount_middle": null,
        "amount_senior": null,
        "created_at": "2026-01-20T03:06:49.000000Z",
        "updated_at": "2026-01-21T04:50:30.000000Z"
    }
}
```

Status: `200 OK`

---

### Update Compensation

Endpoint: `POST /api/payroll/payroll-configuration/compensation/{id}/update`

Method Spoofing: gunakan `_method: PATCH` pada form data

Path Parameters:
- `id` (string, required) – ID compensation (UUID)

Request Body (form-data):
- `_method` (text, required) – nilai: `PATCH`
- `category_compensation` (text, required)
- `amount_general` (text, optional)
- `amount_junior` (text, optional)
- `amount_middle` (text, optional)
- `amount_senior` (text, optional)

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Update Compensation Success"
    },
    "data": {
        "id": "019bd95e-8729-7399-ada1-08126508d1df",
        "job_title_id": "019bd95e-702c-71b1-8eca-335672a7e99f",
        "category_compensation": "Uang Saku",
        "amount_general": "1000000",
        "amount_junior": null,
        "amount_middle": null,
        "amount_senior": null,
        "deleted_at": null,
        "created_at": "2026-01-20T03:06:49.000000Z",
        "updated_at": "2026-01-21T04:50:30.000000Z"
    }
}
```

Status: `200 OK`

---

## Contoh Request cURL

### Daftar Compensation
```bash
curl -X GET \
  "http://localhost:8000/api/payroll/payroll-configuration/compensation/index" \
  -H "Authorization: Bearer <token>"
```

### Detail Compensation
```bash
curl -X GET \
  "http://localhost:8000/api/payroll/payroll-configuration/compensation/019bd95e-8729-7399-ada1-08126508d1df/show" \
  -H "Authorization: Bearer <token>"
```

### Update Compensation
```bash
curl -X POST \
  "http://localhost:8000/api/payroll/payroll-configuration/compensation/019bd95e-8729-7399-ada1-08126508d1df/update" \
  -H "Authorization: Bearer <token>" \
  -F "_method=PATCH" \
  -F "category_compensation=Uang Saku" \
  -F "amount_general=1000000" \
  -F "amount_junior=" \
  -F "amount_middle=" \
  -F "amount_senior="
```

---

## Catatan Implementasi

- Method Spoofing: backend menggunakan `_method` untuk override method HTTP (`PATCH`)
- Response Structure: Mengikuti standar wrapper `meta` dan `data`.
