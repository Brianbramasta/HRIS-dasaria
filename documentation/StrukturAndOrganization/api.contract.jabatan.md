<!-- Dibuat sesuai HRIS-Dasaria.postman_collection 1.7; mencakup CRUD Jabatan (job-title) -->
# Jabatan

<!-- Endpoint daftar/index Jabatan dari collection 1.7 -->
## List Jabatan

URL: `http://127.0.0.1:8000/api/organizational-structure/job-title`
Method: GET
<!-- Parameter query mengikuti collection 1.7 -->
Query (opsional):
- `search`
- `sort`
- `column`
- `per_page`
- `page`
- `filter[]`

## Create Jabatan

URL: `http://127.0.0.1:8000/api/organizational-structure/job-title`
Method: POST
Body (form-data):

- `job_title_name`
- `grade`
- `direct_subordinate`
- `job_title_decree_number`
- `job_title_description`
- `job_title_decree_file` (file)

## Get Detail Jabatan by ID

URL: `http://127.0.0.1:8000/api/organizational-structure/job-title/{id_job_title}`
Method: GET

## Update Jabatan by ID

URL: `http://127.0.0.1:8000/api/organizational-structure/job-title/{id_job_title}`
Method: POST (dengan `_method=PATCH`)
Body (form-data):

- `job_title_name`
- `grade`
- `direct_subordinate`
- `job_title_decree_number`
- `job_title_description`
- `job_title_decree_file` (file)
- `_method`: `PATCH`

## Delete Jabatan

URL: `http://127.0.0.1:8000/api/organizational-structure/job-title/{id_job_title}`
Method: POST (dengan `_method=DELETE`)
Body (form-data):

- `job_title_deleted_decree_number`
- `job_title_deleted_decree_file` (file)
- `_method`: `DELETE`
