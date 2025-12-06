<!-- Dibuat sesuai HRIS-Dasaria.postman_collection 1.8; kontrak API untuk Posisi -->
# Posisi

<!-- Endpoint daftar/index Posisi dari collection 1.8 -->
## List Posisi

URL: `http://127.0.0.1:8000/api/organizational-structure/positions`
Method: GET
<!-- Parameter query mengikuti collection 1.8 -->
Query (opsional):
- `search`
- `sort`
- `column`
- `per_page`
- `page`
- `filter[]`

<!-- Endpoint create Posisi dari collection 1.8 -->
## Create Posisi

URL: `http://127.0.0.1:8000/api/organizational-structure/positions`
Method: POST
Body (form-data):

- `position_name`
- `id_job_title`
- `id_directorate`
- `id_division`
- `id_department`
- `position_decree_number`
- `position_description`
- `position_decree_file` (file)

<!-- Endpoint detail Posisi dari collection 1.8 -->
## Get Detail Posisi by ID

URL: `http://127.0.0.1:8000/api/organizational-structure/positions/{id_position}`
Method: GET

<!-- Endpoint update Posisi dari collection 1.8 -->
## Update Posisi by ID

URL: `http://127.0.0.1:8000/api/organizational-structure/positions/{id_position}`
Method: POST (dengan `_method=PATCH`)
Body (form-data):

- `position_name`
- `id_job_title`
- `id_directorate`
- `id_division`
- `id_department`
- `position_decree_number`
- `position_description`
- `position_decree_file` (file)
- `_method`: `PATCH`

<!-- Endpoint delete Posisi dari collection 1.8 -->
## Delete Posisi

URL: `http://127.0.0.1:8000/api/organizational-structure/positions/{id_position}`
Method: POST (dengan `_method=DELETE`)
Body (form-data):

- `position_deleted_decree_number`
- `position_deleted_decree_file` (file)
- `_method`: `DELETE`
