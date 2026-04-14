<!-- Diperbarui sesuai HRIS-Dasaria.postman_collection 1.7; menyesuaikan parameter query dan menambah endpoint dropdown -->
# Divisi

<!-- Sinkronisasi endpoint daftar/list Divisi dari collection 1.7 -->
## List Divisi

URL: `http://127.0.0.1:8000/api/organizational-structure/divisions`
Method: GET
<!-- Mengubah 'columns' menjadi 'column' dan menambahkan 'page' -->
Query (opsional):
- `search`
- `sort`
- `column`
- `per_page`
- `page`
- `filter[]`
response: 
```
{
    "meta": {
        "status": 200,
        "message": "Divisions retrieved successfully"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id_division": "019ae833-9eee-71a2-929f-918f233f6d4e",
                "id_directorate": "019ae265-320f-73ac-87c2-25b927de4e77",
                "division_name": "ini divis 2",
                "division_decree_number": "ini sk 1 nys",
                "division_description": "ini deskripsi",
                "division_decree_file": "OrganizationalStructure\/division\/decree\/a58de9e7-624f-454f-8a76-2380eb10c16c.pdf",
                "division_deleted_decree_number": null,
                "division_deleted_decree_file": null,
                "deleted_at": null,
                "created_at": "2025-12-04T07:11:28.000000Z",
                "updated_at": "2025-12-04T07:12:13.000000Z",
                "directorate_name": "ini nama direktorat 2"
            },
            {
                "id_division": "019ae778-9bf9-7021-80ab-f7ef64e7e1a2",
                "id_directorate": "019ae273-ff4f-7384-acb7-44b31ab476f7",
                "division_name": "ini divisi 1",
                "division_decree_number": "ini sk update",
                "division_description": "ini deskripsi",
                "division_decree_file": "C:\\Users\\pc\\AppData\\Local\\Temp\\php1A42.tmp",
                "division_deleted_decree_number": "ini sk hapus",
                "division_deleted_decree_file": "OrganizationalStructure\/division\/delete-decree\/93ac3423-27e1-4515-a15b-cf6448f8852c.pdf",
                "deleted_at": null,
                "created_at": "2025-12-04T03:47:12.000000Z",
                "updated_at": "2025-12-04T07:09:44.000000Z",
                "directorate_name": "ini nama direktorat 3 jadi 4"
            }
        ],
        "first_page_url": "http:\/\/192.168.1.33:8000\/api\/organizational-structure\/divisions?sort=name%3Aasc&per_page=10&page=1",
        "from": 1,
        "last_page": 1,
        "last_page_url": "http:\/\/192.168.1.33:8000\/api\/organizational-structure\/divisions?sort=name%3Aasc&per_page=10&page=1",
        "links": [
            {
                "url": null,
                "label": "&laquo; Previous",
                "page": null,
                "active": false
            },
            {
                "url": "http:\/\/192.168.1.33:8000\/api\/organizational-structure\/divisions?sort=name%3Aasc&per_page=10&page=1",
                "label": "1",
                "page": 1,
                "active": true
            },
            {
                "url": null,
                "label": "Next &raquo;",
                "page": null,
                "active": false
            }
        ],
        "next_page_url": null,
        "path": "http:\/\/192.168.1.33:8000\/api\/organizational-structure\/divisions",
        "per_page": 10,
        "prev_page_url": null,
        "to": 2,
        "total": 2
    }
}
```

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

<!-- Menambah endpoint dropdown untuk kebutuhan pilihan Divisi pada form -->
## Dropdown Divisi

URL: `http://127.0.0.1:8000/api/organizational-structure/divisions-dropdown`
Method: GET
