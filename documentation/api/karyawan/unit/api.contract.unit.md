# Kontrak API – Unit (Master Data)

Dokumen ini merinci kontrak API untuk fitur `Unit` pada modul Struktur Organisasi. Diselaraskan dengan Postman collection yang tersedia.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>` untuk semua endpoint yang memodifikasi data
- Method: Menggunakan `POST` dengan field `_method: PATCH/DELETE` (method spoofing)
- Content-Type: `multipart/form-data` untuk form data dan unggah file
- Response error: `{ errorCode: string, message: string, details?: any }`

---

## Halaman: Unit

### Daftar Unit

Endpoint: `GET /api/organizational-structure/unit-master-data/units`

Query Parameters (opsional):
- `search` (string)
- `filter[]` (string, multiple)

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "list unit berhasil di dapatkan"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": "019bc0e0-9573-7147-bb75-aee82d8bf9b8",
                "unit_name": "ini unit name 2",
                "department_name": "hris"
            },
            {
                "id": "019bc0e0-6fbc-7129-81e1-5a95961d4c9b",
                "unit_name": "ini unit name",
                "department_name": "hris"
            }
        ],
        "first_page_url": "http://192.168.2.237:8000/api/organizational-structure/unit-master-data/units?page=1",
        "from": 1,
        "last_page": 1,
        "last_page_url": "http://192.168.2.237:8000/api/organizational-structure/unit-master-data/units?page=1",
        "links": [
            {
                "url": null,
                "label": "« Previous",
                "page": null,
                "active": false
            },
            {
                "url": "http://192.168.2.237:8000/api/organizational-structure/unit-master-data/units?page=1",
                "label": "1",
                "page": 1,
                "active": true
            },
            {
                "url": null,
                "label": "Next »",
                "page": null,
                "active": false
            }
        ],
        "next_page_url": null,
        "path": "http://192.168.2.237:8000/api/organizational-structure/unit-master-data/units",
        "per_page": 10,
        "prev_page_url": null,
        "to": 2,
        "total": 2
    }
}
```

Status: `200 OK`

---

## Operasi CRUD – Unit

### Menyimpan Unit

Endpoint: `POST /api/organizational-structure/unit-master-data/units`

Request Body (form-data):
- `unit_name` (text, required)
- `department_id` (text, required) – ID departemen (UUID)
- `unit_decree_number` (text, optional)
- `description` (text, optional)
- `unit_decree_file` (file, optional) – file SK unit

Response (201 Created):
```json
{
    "meta": {
        "status": 200,
        "message": "berhasil menyimpan unit"
    },
    "data": {
        "id": "019bc0e0-9573-7147-bb75-aee82d8bf9b8",
        "unit_name": "ini unit name 2",
        "created_at": "2026-01-15T08:58:22.000000Z"
    }
}
```

Status: `201 Created`

---

### Detail Unit

Endpoint: `GET /api/organizational-structure/unit-master-data/units/{id}/show`

Path Parameters:
- `id` (string, required) – ID unit (UUID)

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "detail unit berhasil di dapatkan"
    },
    "data": {
        "id": "019bc0e0-9573-7147-bb75-aee82d8bf9b8",
        "unit_name": "ini unit name 2",
        "department_id": "019b4976-3df7-700b-ae68-c73682551d2e",
        "unit_decree_number": "ini sk",
        "description": "ini deskripsi",
        "unit_decree_file": "OrganizationalStructure/Unit/Decree/071ce52b-4987-497b-a996-85beccaec995.pdf",
        "unit_delete_decree_number": null,
        "unit_delete_decree_file": null,
        "deleted_at": null,
        "created_at": "2026-01-15T08:58:22.000000Z",
        "updated_at": "2026-01-15T08:58:22.000000Z",
        "department": {
            "id": "019b4976-3df7-700b-ae68-c73682551d2e",
            "department_name": "hris"
        }
    }
}
```

Status: `200 OK`

---

### Update Unit

Endpoint: `POST /api/organizational-structure/unit-master-data/units/{id}/update`

Method Spoofing: gunakan `_method: PATCH` pada form data

Path Parameters:
- `id` (string, required) – ID unit (UUID)

Request Body (form-data):
- `_method` (text, required) – nilai: `PATCH`
- `unit_name` (text, optional)
- `department_id` (text, optional)
- `unit_decree_number` (text, optional)
- `description` (text, optional)
- `unit_decree_file` (file, optional)

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "berhasil memperbarui unit"
    },
    "data": {
        "id": "019bc0a3-3a14-73f5-b440-89af09ce233f",
        "updated_at": "2026-01-15T09:10:00.000000Z"
    }
}
```

Status: `200 OK`

---

### Hapus Unit

Endpoint: `POST /api/organizational-structure/unit-master-data/units/{id}/delete`

Method Spoofing: gunakan `_method: DELETE` pada form data

Path Parameters:
- `id` (string, required) – ID unit (UUID)

Request Body (form-data):
- `_method` (text, required) – nilai: `DELETE`
- `unit_delete_decree_number` (text, required) – nomor SK penghapusan
- `unit_delete_decree_file` (file, optional) – file SK penghapusan

Response (200 OK):
```json
{
    "meta": {
        "status": 200,
        "message": "berhasil menghapus unit"
    },
    "data": {
        "id": "019bc0bb-6b2b-73ad-b442-50a61014d086",
        "deleted_at": "2026-01-15T09:20:00.000000Z"
    }
}
```

Status: `200 OK`

---

## Contoh Request cURL

### Daftar Unit
```bash
curl -X GET \
  "http://localhost:3000/api/organizational-structure/unit-master-data/units?search=ini%20unit%20name%202" \
  -H "Authorization: Bearer <token>"
```

### Menyimpan Unit
```bash
curl -X POST \
  "http://localhost:3000/api/organizational-structure/unit-master-data/units" \
  -H "Authorization: Bearer <token>" \
  -F "unit_name=ini unit name 2" \
  -F "department_id=019b4976-3df7-700b-ae68-c73682551d2e" \
  -F "unit_decree_number=ini sk" \
  -F "description=ini deskripsi" \
  -F "unit_decree_file=@/D:/tes1.pdf"
```

### Detail Unit
```bash
curl -X GET \
  "http://localhost:3000/api/organizational-structure/unit-master-data/units/019bc0e0-9573-7147-bb75-aee82d8bf9b8/show" \
  -H "Authorization: Bearer <token>"
```

### Update Unit
```bash
curl -X POST \
  "http://localhost:3000/api/organizational-structure/unit-master-data/units/019bc0a3-3a14-73f5-b440-89af09ce233f/update" \
  -H "Authorization: Bearer <token>" \
  -F "_method=PATCH" \
  -F "unit_name=ini unit" \
  -F "department_id=019b4976-3df7-700b-ae68-c73682551d2e" \
  -F "unit_decree_number=ini sk bro" \
  -F "description=tes" \
  -F "unit_decree_file=@/D:/tes1.pdf"
```

### Hapus Unit
```bash
curl -X POST \
  "http://localhost:3000/api/organizational-structure/unit-master-data/units/019bc0bb-6b2b-73ad-b442-50a61014d086/delete" \
  -H "Authorization: Bearer <token>" \
  -F "_method=DELETE" \
  -F "unit_delete_decree_number=tes hapus" \
  -F "unit_delete_decree_file=@/D:/tes1.pdf"
```

---

## Catatan Implementasi

- Method Spoofing: backend menggunakan `_method` untuk override method HTTP (`PATCH`/`DELETE`)
- File Upload: kirim `unit_decree_file` dan `unit_delete_decree_file` sebagai `multipart/form-data`
- Filter: gunakan `filter[]` untuk menerapkan filter pada daftar
