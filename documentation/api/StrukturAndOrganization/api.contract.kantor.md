# Kantor

## Create Kantor

URL: `http://127.0.0.1:8000/api/organizational-structure/offices`
Method: POST
Body (form-data):
 <!-- Diperbarui: mendukung multi-select perusahaan menggunakan array company[n][id_company] -->
 - `office_name`
 - `company[n][id_company]` (multi-select, contoh: `company[0][id_company]`, `company[1][id_company]`)
 - `office_decree_number`
 - `office_description`
 - `office_decree_file` (file)

```
response:
{
  "meta": {
    "status": 201,
    "message": "Office created successfully"
  },
  "data": {
    "office_name": "ini kantor ai",
    "office_decree_number": "ini sk kantor",
    "office_description": "ini kantor di bidang ai",
    <!-- Diperbarui: contoh tidak lagi menggunakan satu id_company, melainkan array perusahaan -->
    "companies": [
      { "id_company": "019ad7e9-2331-71ed-8ee7-ff7af32a8cd6" },
      { "id_company": "019ae21c-307b-717e-9e7b-86e2eb42e681" }
    ],
    "id_office": "<generated-id>",
    "created_at": "<timestamp>",
    "updated_at": "<timestamp>"
  }
}
```

<!-- Ditambahkan: Dokumentasi Edit/Update Kantor sesuai Postman Collection -->
## Update Kantor

URL: `http://127.0.0.1:8000/api/organizational-structure/offices/{id_office}`
Method: POST (dengan `_method=PATCH`)
Body (form-data):
- `_method`: `PATCH`
- `office_name` (opsional)
- `company[n][id_company]` (opsional, multi-select)
- `office_decree_number` (opsional)
- `office_description` (opsional)
- `office_decree_file` (file, opsional)

```
response:
{
  "meta": {
    "status": 200,
    "message": "Office updated successfully"
  },
  "data": {
    "id_office": "<id_office>",
    "office_name": "Kantor AI",
    "office_decree_number": "SK/AI/2024/001",
    "office_description": "Deskripsi kantor AI",
    "office_decree_file": "offices/decree/<file>.pdf",
    <!-- Diperbarui: hasil update dapat memuat daftar perusahaan yang terhubung -->
    "companies": [
      { "id_company": "019ad7e9-2331-71ed-8ee7-ff7af32a8cd6" }
    ],
    "deleted_at": null,
    "created_at": "<timestamp>",
    "updated_at": "<timestamp>"
  }
}
```

## Get Detail Kantor by ID

URL: `http://127.0.0.1:8000/api/organizational-structure/offices/{id_office}`
Method: GET

```
response:
{
  "meta": {
    "status": 200,
    "message": "Office detail found"
  },
  "data": {
    "id_office": "019adab2-98de-72ed-848f-cc1c3b7639c4",
    "office_name": "Kantor AI",
    "office_decree_number": "SK/AI/2024/001",
    "office_description": "Deskripsi kantor AI",
    "office_decree_file": "offices/decree/<file>.pdf",
    "deleted_at": null,
    "created_at": "<timestamp>",
    "updated_at": "<timestamp>"
  }
}
```

## Delete Kantor

URL: `http://127.0.0.1:8000/api/organizational-structure/offices/{id_office}`
Method: POST (with `_method=DELETE`)
Body (form-data):
- `office_delete_decree_number`
- `office_delete_decree_file` (file)
- `_method`: `DELETE`

```
response:
{
  "meta": {
    "status": 200,
    "message": "Office deleted successfully"
  }
}
```

## List Kantor

URL: `http://127.0.0.1:8000/api/organizational-structure/offices`
Method: GET
Query params (optional):
- `search`
- `sort`
- `column`
- `per_page`
- `page`
- `filter[]` (multiple)
