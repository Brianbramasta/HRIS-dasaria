<!-- Dokumen kontrak API Divisi berdasarkan HRIS-Dasaria.postman_collection 1.5, komentar ringkas dipindahkan ke atas judul -->
# Divisi

## Create Divisi

URL: `http://127.0.0.1:8000/api/organizational-structure/divisions`
Method: POST
Body (form-data):

- `division_name`
- `id_directorate`
- `division_decree_number`
- `division_description`
- `division_decree_file` (file)

## Get Detail Divisi by ID

URL: `http://127.0.0.1:8000/api/organizational-structure/divisions/{id_division}`
Method: GET

## Update Divisi by ID

URL: `http://127.0.0.1:8000/api/organizational-structure/divisions/{id_division}`
Method: POST (dengan `_method=PATCH`)
Body (form-data):

- `division_name`
- `id_directorate`
- `division_decree_number`
- `division_description`
- `division_decree_file` (file)
- `_method`: `PATCH`

## Delete Divisi

URL: `http://127.0.0.1:8000/api/organizational-structure/divisions/{id_division}`
Method: POST (dengan `_method=DELETE`)
Body (form-data):

- `division_deleted_decree_number`
- `division_deleted_decree_file` (file)
- `_method`: `DELETE`
