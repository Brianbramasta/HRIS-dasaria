# Direktorat

## Create Direktorat

URL: `http://127.0.0.1:8000/api/organizational-structure/directorates`
Method: POST
Body (form-data):

- `directorate_name`
- `directorate_decree_number`
- `directorate_description`
- `directorate_decree_file` (file)

## Get Detail Direktorat by ID

URL: `http://127.0.0.1:8000/api/organizational-structure/directorates/{id_directorate}`
Method: GET

## Update Direktorat by ID

URL: `http://127.0.0.1:8000/api/organizational-structure/directorates/{id_directorate}`
Method: POST (with `_method=PATCH`)
Body (form-data):

- `directorate_name`
- `directorate_decree_number`
- `directorate_description`
- `directorate_decree_file` (file)
- `_method`: `PATCH`

## Delete Direktorat

URL: `http://127.0.0.1:8000/api/organizational-structure/directorates/{id_directorate}`
Method: POST (with `_method=DELETE`)
Body (form-data):

- `directorate_deleted_decree_number`
- `directorate_deleted_decree_file` (file)
- `_method`: `DELETE`

## List Direktorat

URL: `http://127.0.0.1:8000/api/organizational-structure/directorates`
Method: GET
Query params (optional):

- `search`
- `sort`
- `column`
- `per_page`
- `page`
- `filter[]` (multiple)
