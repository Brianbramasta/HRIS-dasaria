# Kantor

## Create Kantor

URL: `http://127.0.0.1:8000/api/organizational-structure/offices`
Method: POST
Body (form-data):
- `office_name`
- `id_company`
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
    "id_company": "019ad7eb-5df0-7383-b933-c4f1c208db39",
    "id_office": "<generated-id>",
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
