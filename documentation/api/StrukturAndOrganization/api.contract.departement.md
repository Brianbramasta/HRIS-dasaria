<!-- Dibuat sesuai HRIS-Dasaria.postman_collection 1.7; mencakup CRUD Departemen (departments) -->
# Departemen

<!-- Endpoint daftar/index Departemen dari collection 1.7 -->
## List Departemen

URL: `http://127.0.0.1:8000/api/organizational-structure/departments`
Method: GET
<!-- Parameter query mengikuti collection 1.7 -->
Query (opsional):
- `search`
- `sort`
- `column`
- `per_page`
- `page`
- `filter[]`

<!-- Tambahan: Endpoint dropdown Departemen mengikuti pola collection 1.9 (*-dropdown) -->
## Dropdown Departemen

URL: `http://127.0.0.1:8000/api/organizational-structure/departments-dropdown`
Method: GET
Query (opsional):
- `search`

Response (contoh):
```
{
  "meta": { "status": 200, "message": "Success get departments for dropdown" },
  "data": [
    { "id_department": "019a...", "department_name": "Human Resource Development" },
    { "id_department": "019b...", "department_name": "Finance" }
  ]
}
```

## Create Departemen

URL: `http://127.0.0.1:8000/api/organizational-structure/departments`
Method: POST
Body (form-data):

- `department_name`
- `id_division`
- `department_decree_number`
- `department_description`
- `department_decree_file` (file)

## Get Detail Departemen by ID

URL: `http://127.0.0.1:8000/api/organizational-structure/departments/{id_department}`
Method: GET

## Update Departemen by ID

URL: `http://127.0.0.1:8000/api/organizational-structure/departments/{id_department}`
Method: POST (dengan `_method=PATCH`)
Body (form-data):

- `_method`: `PATCH`
- `department_name`
- `id_division`
- `department_decree_number`
- `department_description`
- `department_decree_file` (file)

## Delete Departemen

URL: `http://127.0.0.1:8000/api/organizational-structure/departments/{id_department}`
Method: POST (dengan `_method=DELETE`)
Body (form-data):

- `department_deleted_decree_number`
- `department_deleted_decree_file` (file)
- `_method`: `DELETE`
