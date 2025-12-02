# Lini Bisnis

## List Lini Bisnis

URL: `http://127.0.0.1:8000/api/organizational-structure/business-lines`
Method: GET

```
response:
{
  "meta": {
    "status": 200,
    "message": "Success get business lines"
  },
  "data": {
    "current_page": 1,
    "data": [
      {
        "id_bl": "019ad2e2-272f-7101-9fd5-511ce44d15d9",
        "bl_name": "Digital Transformation Unit",
        "bl_decree_number": "SK/DTU/2024/001",
        "bl_description": "Unit yang fokus pada transformasi digital perusahaan, implementasi sistem ERP, dan otomatisasi proses bisnis",
        "bl_decree_file_url": "business-lines/decree/6dc4ae0b-f781-4aad-9b31-d0350baa4422.pdf",
        "created_at": "2025-11-30T03:50:27.000000Z",
        "updated_at": "2025-11-30T03:50:27.000000Z"
      }
    ],
    "first_page_url": "http://127.0.0.1:8000/api/organizational-structure/business-lines?page=1",
    "path": "http://127.0.0.1:8000/api/organizational-structure/business-lines",
    "per_page": 10,
    "to": 10,
    "total": 10
  }
}
```

## Get Lini Bisnis by ID

URL: `http://127.0.0.1:8000/api/organizational-structure/business-lines/{id_bl}`
Method: GET

```
response:
{
  "meta": {
    "status": 200,
    "message": "Success get business line detail"
  },
  "data": {
    "id_bl": "019ad2e7-d958-71fe-9e8b-a626e85aec7c",
    "bl_name": "Healthcare Technology",
    "bl_decree_number": "SK/HCT/2024/010",
    "bl_description": "Sistem informasi rumah sakit, telemedicine, electronic medical records, dan health monitoring solutions",
    "bl_decree_file_url": "business-lines/decree/ef6bc0cd-9d4a-438f-ad5a-d544738c1162.pdf",
    "bl_delete_decree_number": null,
    "bl_delete_decree_file_url": null,
    "deleted_at": null,
    "created_at": "2025-11-30T03:56:41.000000Z",
    "updated_at": "2025-11-30T03:56:41.000000Z"
  }
}
```

## Create Lini Bisnis

URL: `http://127.0.0.1:8000/api/organizational-structure/business-lines`
Method: POST
Body (form-data):
- `bl_name`
- `bl_decree_number`
- `bl_description`
- `bl_decree_file` (file)

```
response:
{
  "meta": {
    "status": 201,
    "message": "Business line created successfully"
  },
  "data": {
    "bl_name": "Healthcare Technology",
    "bl_decree_number": "SK/HCT/2024/010",
    "bl_description": "Sistem informasi rumah sakit, telemedicine, electronic medical records, dan health monitoring solutions",
    "bl_decree_file_url": "business-lines/decree/ef6bc0cd-9d4a-438f-ad5a-d544738c1162.pdf",
    "id_bl": "019ad2e7-d958-71fe-9e8b-a626e85aec7c",
    "updated_at": "2025-11-30T03:56:41.000000Z",
    "created_at": "2025-11-30T03:56:41.000000Z"
  }
}
```

## Update Lini Bisnis

URL: `http://127.0.0.1:8000/api/organizational-structure/business-lines/{id_bl}`
Method: POST
Body (form-data):
- `bl_name`
- `bl_decree_number`
- `bl_description`
- `bl_decree_file` (file)
- `_method` (hidden field, set to `PUT`)

```
response:
{
  "meta": {
    "status": 200,
    "message": "Business line updated successfully"
  },
  "data": {
    "id_bl": "019ad3cf-7ae4-7045-8d7b-01ac5da939fb",
    "bl_name": "ini tes lini bisnis baru3",
    "bl_decree_number": "SK/HCT/2024/015",
    "bl_description": "tes deskripsi",
    "bl_decree_file": "business-lines/decree/4a5ad844-794e-4f2e-a0b0-130bc41950e8.pdf",
    "bl_delete_decree_number": null,
    "bl_delete_decree_file": null,
    "deleted_at": null,
    "created_at": "2025-11-30T08:09:41.000000Z",
    "updated_at": "2025-12-01T03:04:30.000000Z"
  }
}
```

## Delete Lini Bisnis

URL: `http://127.0.0.1:8000/api/organizational-structure/business-lines/{id_bl}`
Method: POST
Body (form-data):
- `_method` (hidden field, set to `DELETE`)

```
response:
{
  "meta": {
    "status": 200,
    "message": "Business line deleted successfully"
  }
}
```

## Dropdown Lini Bisnis

URL: `http://127.0.0.1:8000/api/organizational-structure/business-lines-dropdown`
Method: GET

```
response:
{
  "meta": {
    "status": 200,
    "message": "Success get business lines for dropdown"
  },
  "data": [
    { "id_bl": "019ad2e7-1c4f-7056-9b0b-7b0bdf62cf2d", "bl_name": "Artificial Intelligence & Automation" }
  ]
}
```

## Detail Lini Bisnis (dengan Perusahaan terkait)

URL: `http://127.0.0.1:8000/api/organizational-structure/business-lines/{id_bl}/detail`
Method: GET

```
response:
{
  "meta": {
    "status": 200,
    "message": "Success get business line detail"
  },
  "data": {
    "id_bl": "019ad2e7-1c4f-7056-9b0b-7b0bdf62cf2d",
    "bl_name": "Artificial Intelligence & Automation",
    "bl_decree_number": "SK/AIA/2024/008",
    "bl_description": "Pengembangan solusi AI, robotic process automation, chatbot, dan intelligent automation",
    "bl_decree_file": "business-lines/decree/8f0ba547-7079-4a5c-85f3-88ecf77f3ea1.pdf",
    "companies": [
      {
        "id_company": "019ad44c-08a3-72a5-835a-dc467fb7abb3",
        "company_name": "PT. Artificial Intelligence Indonesia",
        "company_description": "Pengembang solusi AI dan robotic process automation untuk meningkatkan efisiensi bisnis perusahaan di Indonesia"
      }
    ]
  }
}
```
