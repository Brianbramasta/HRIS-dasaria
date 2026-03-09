# Kontrak API – Parameter Payroll Periode

Dokumen ini merinci kontrak API untuk fitur `Parameter` pada modul Payroll Periode.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>`
- Method: Menggunakan `GET`
- Content-Type: `application/json`

---

## Halaman: Parameter Payroll Periode

### Get Import Approval Status Parameters

Endpoint: `GET /api/payroll/payroll-periode/import-approval-status`

Query Parameters:
- `type` (string, optional) – Tipe parameter (Staff, Mitra, Thr)
- `periodeSalary` (boolean, optional) – Parameter periode gajian
- `HRGA` (boolean, optional) – Parameter HRGA
- `FAT` (boolean, optional) – Parameter FAT
- `BOD` (boolean, optional) – Parameter BOD
- `distribution` (boolean, optional) – Parameter distribusi

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "Payroll import and approval status retrieved successfully"
    },
    "data": {
        "statusAll": {
            "id": "019c7a5e-22bd-71ab-a5ae-a7238e5104b6",
            "payroll_month": "2026-02-20",
            "allowance_imported_at": "true",
            "approval_hr": "false",
            "approval_direktur_hr": "false",
            "approval_direktur_fat": "false",
            "approval_direktur_bod": "false",
            "distribute": "true",
            "closed": "true",
            "type": "Staff",
            "created_at": "2026-02-20T09:25:15.000000Z",
            "updated_at": "2026-03-02T12:46:01.000000Z",
            "status_payroll": "open"
        },
        "summary": [
            {
                "card": [
                    {
                        "label": "Maker",
                        "remaining": 3,
                        "progress": 0,
                        "total": 3
                    },
                    {
                        "label": "Dasaria",
                        "remaining": 0,
                        "progress": 2,
                        "total": 3
                    }
                ]
            }
        ]
    }
}
```

---

## Contoh Penggunaan

### Mendapatkan semua parameter

Request:
```
GET /api/payroll/payroll-periode/import-approval-status
```

### Mendapatkan parameter berdasarkan tipe

Request:
```
GET /api/payroll/payroll-periode/import-approval-status?type=Staff
```

### Mendapatkan parameter approval levels

Request:
```
GET /api/payroll/payroll-periode/import-approval-status?periodeSalary=true&HRGA=true&FAT=true&BOD=true&distribution=true
```

---

## Error Responses

### Unauthorized (401)
```json
{
    "meta": {
        "status": 401,
        "message": "Unauthorized"
    },
    "errors": []
}
```

### Forbidden (403)
```json
{
    "meta": {
        "status": 403,
        "message": "Forbidden"
    },
    "errors": []
}
```

### Not Found (404)
```json
{
    "meta": {
        "status": 404,
        "message": "Endpoint tidak ditemukan"
    },
    "errors": []
}
```

### Internal Server Error (500)
```json
{
    "meta": {
        "status": 500,
        "message": "Terjadi kesalahan pada server"
    },
    "errors": []
}
```