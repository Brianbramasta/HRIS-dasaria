<!-- Dibuat sesuai HRIS-Dasaria.postman_collection 4.0; kontrak API untuk Posisi -->
# Posisi

<!-- Endpoint daftar/index Posisi dari collection 4.0 -->
## List Posisi

URL: `http://127.0.0.1:8000/api/organizational-structure/position-master-data/positions`
Method: GET
<!-- Parameter query mengikuti collection 4.0 -->
Query (opsional):
- `search`
- `sort`
- `column`
- `per_page`
- `page`
- `filter[]`

<!-- Endpoint create Posisi dari collection 4.0 -->
## Create Posisi

URL: `http://127.0.0.1:8000/api/organizational-structure/position-master-data/positions`
Method: POST
Body (form-data):

- `position_name`
- `job_title_id`
- `directorate_id`
- `division_id`
- `department_id`
- `unit_id`
- `structural_job_id`
- `position_decree_number`
- `position_description`
- `position_decree_file` (file)

<!-- Endpoint detail Posisi dari collection 4.0 -->
## Get Detail Posisi by ID

URL: `http://127.0.0.1:8000/api/organizational-structure/position-master-data/positions/{id_position}/show`
Method: GET

<!-- Endpoint update Posisi dari collection 4.0 -->
## Update Posisi by ID

URL: `http://127.0.0.1:8000/api/organizational-structure/positions/{id_position}`
Method: POST (dengan `_method=PATCH`)
Body (form-data):

- `position_name`
- `job_title_id`
- `directorate_id`
- `division_id`
- `department_id`
- `unit_id`
- `structural_job_id`
- `position_decree_number`
- `position_description`
- `position_decree_file` (file)
- `_method`: `PATCH`

<!-- Endpoint delete Posisi dari collection 4.0 -->
## Delete Posisi

URL: `http://127.0.0.1:8000/api/organizational-structure/positions/{id_position}`
Method: POST (dengan `_method=Delete`)
Body (form-data):

- `position_deleted_decree_number`
- `position_deleted_decree_file` (file)
- `_method`: `Delete`
