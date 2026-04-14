# Kontrak API – Upload Document

Dokumen ini merinci kontrak API untuk fitur `Upload Document` pada modul Employee. Diselaraskan dengan Postman collection yang tersedia.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>` untuk semua endpoint yang memodifikasi data
- Method: Beberapa endpoint update menggunakan `POST` dengan field `_method: PATCH` (method spoofing)
- Content-Type: `application/x-www-form-urlencoded` atau `multipart/form-data`
- Response error: `{ errorCode: string, message: string, details?: any }`

---

## Halaman: Upload Document

### Get Temporary URL

Endpoint: `POST /api/temporaries/url`

Request Headers:
- `Accept: application/json`

Request Body (raw JSON):
```json
{
    "path": "hris/employee/documents/personal/Pakta_Integritas_DSR038_12032026_1773311985/25bb4252-6b4e-4dbb-a462-aa328310597d.pdf"
}
```

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "Temporary URL generated successfully"
  },
  "data": {
    "temporary_url": "https://temporary-url-for-document-access",
    "expires_at": "2026-03-12T15:30:00Z"
  }
}
```

Status: `200 OK`

---

### Update Employee Document

Endpoint: `POST /api/employee-master-data/employees/personal-informations/{id}/update-employee-document`

Method Spoofing: gunakan `_method: PATCH` pada form data

Path Parameters:
- `id` (string, required) – ID employee (contoh: DSR038)

Request Body (form-data):
- `_method` (text, required) – nilai: `PATCH`
- `file_type_id` (text, required) – ID tipe dokumen (UUID)
- `document` (file, required) – file dokumen yang akan diupload

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "Employee document updated successfully"
  },
  "data": {
    "employee_id": "DSR038",
    "document_id": "25bb4252-6b4e-4dbb-a462-aa328310597d",
    "file_type_id": "3fdaa77c-b870-4928-b30c-dc9e8d992387",
    "file_name": "network_anomaly_report_060226_1103.pdf",
    "file_path": "hris/employee/documents/personal/Pakta_Integritas_DSR038_12032026_1773311985/25bb4252-6b4e-4dbb-a462-aa328310597d.pdf",
    "uploaded_at": "2026-03-12T14:30:00Z"
  }
}
```

Status: `200 OK`

---

## Contoh Request cURL

### Get Temporary URL
```bash
curl -X POST \
  "http://localhost:3000/api/temporaries/url" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <token>" \
  -d "{
    \"path\": \"hris/employee/documents/personal/Pakta_Integritas_DSR038_12032026_1773311985/25bb4252-6b4e-4dbb-a462-aa328310597d.pdf\"
  }"
```

### Update Employee Document
```bash
curl -X POST \
  "http://localhost:3000/api/employee-master-data/employees/personal-informations/DSR038/update-employee-document" \
  -H "Authorization: Bearer <token>" \
  -F "_method=PATCH" \
  -F "file_type_id=3fdaa77c-b870-4928-b30c-dc9e8d992387" \
  -F "document=@./network_anomaly_report_060226_1103.pdf"
```

---

## Catatan Tambahan

### File Type ID
File type ID mengacu pada master data tipe dokumen yang tersedia di sistem. Contoh ID yang digunakan:
- `3fdaa77c-b870-4928-b30c-dc9e8d992387` – Pakta Integritas

### Path Format
Format path untuk temporary URL mengikuti pattern:
```
hris/employee/documents/{category}/{document_name}_{employee_id}_{date}_{timestamp}/{file_id}.{extension}
```

### Supported File Types
- PDF (.pdf)
- Word (.doc, .docx)
- Excel (.xls, .xlsx)
- Image (.jpg, .jpeg, .png, .gif)
- Max file size: 10MB

### Error Responses
```json
{
  "errorCode": "INVALID_FILE_TYPE",
  "message": "File type not supported",
  "details": {
    "allowed_types": ["pdf", "doc", "docx", "xls", "xlsx", "jpg", "jpeg", "png", "gif"]
  }
}
```

```json
{
  "errorCode": "FILE_TOO_LARGE",
  "message": "File size exceeds maximum limit",
  "details": {
    "max_size": "10MB",
    "actual_size": "15.2MB"
  }
}
```

```json
{
  "errorCode": "EMPLOYEE_NOT_FOUND",
  "message": "Employee with specified ID not found"
}
```