# Perusahaan

## Index Perusahaan

URL: `http://127.0.0.1:8000/api/organizational-structure/companies`
Method: GET
Query (opsional):
- `per_page`
- `filter[]`
- `column`
- `sort`
- `search`
- `page`

```
response:
{
  "success": true,
  "message": "List Perusahaan",
  "data": [
    {
      "uuid_perusahaan": "019ac89b-3d5a-7385-937b-28a9d80edc29",
      "nama_perusahaan": "PT. Digital Innovation Indonesia",
      "fk_uuid_lini_bisnis": "019ac88e-ef31-7264-b1f7-bd67a1b80b03",
      "deskripsi_perusahaan": "Perusahaan teknologi yang fokus pada transformasi digital",
      "no_sk_hapus_perusahaan": null,
      "file_url_sk_hapus_perusahaan": null,
      "deleted_at": null,
      "created_at": "2025-11-28T03:56:48.000000Z",
      "updated_at": "2025-11-28T03:56:48.000000Z",
      "lini_bisnis": null
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 10,
    "total": 8,
    "last_page": 1,
    "from": 1,
    "to": 8
  }
}
```

## Create Perusahaan

URL: `http://127.0.0.1:8000/api/organizational-structure/companies`
Method: POST
Body (form-data):
- `company_name`
- `id_bl`
- `company_description`
- `documents[0][cd_name]`
- `documents[0][cd_decree_number]`
- `documents[0][cd_file]` (file)
- `documents[1][cd_name]` (opsional)
- `documents[1][cd_decree_number]` (opsional)
- `documents[1][cd_file]` (file, opsional)

```
response:
{
  "meta": {
    "status": 201,
    "message": "Company created successfully"
  },
  "data": {
    "company": {
      "company_name": "PT. Artificial Intelligence Indonesia",
      "company_description": "Pengembang solusi AI dan robotic process automation untuk meningkatkan efisiensi bisnis perusahaan di Indonesia",
      "id_bl": "019ad2e7-1c4f-7056-9b0b-7b0bdf62cf2d",
      "id_company": "019ad7eb-5df0-7383-b933-c4f1c208db39",
      "updated_at": "2025-12-01T03:18:37.000000Z",
      "created_at": "2025-12-01T03:18:37.000000Z"
    },
    "documents": [
      {
        "cd_name": "dokument 1",
        "cd_decree_number": "ini sk",
        "cd_file": "company/decree/67a22979-66d3-45ca-a361-c2fad0b61094.pdf",
        "id_company": "019ad7eb-5df0-7383-b933-c4f1c208db39",
        "id_cd": "019ad7eb-5e0c-7000-8794-4cf8751c7445",
        "updated_at": "2025-12-01T03:18:37.000000Z",
        "created_at": "2025-12-01T03:18:37.000000Z"
      },
      {
        "cd_name": "document 2",
        "cd_decree_number": "ini sk 2",
        "cd_file": "company/decree/8ce0ac2b-99b9-478d-99fd-b01cde44f8ef.pdf",
        "id_company": "019ad7eb-5df0-7383-b933-c4f1c208db39",
        "id_cd": "019ad7eb-5e11-736d-9d6b-4576682d650e",
        "updated_at": "2025-12-01T03:18:37.000000Z",
        "created_at": "2025-12-01T03:18:37.000000Z"
      }
    ]
  }
}
```

## Delete Perusahaan

URL: `http://127.0.0.1:8000/api/organizational-structure/companies/{id_company}`
Method: POST (with `_method=DELETE`)
Body (form-data):
- `company_delete_decree_number`
- `company_delete_decree_file` (file)
- `_method`: `DELETE`

```
response:
{
  "meta": {
    "status": 200,
    "message": "Company deleted successfully"
  }
}
```

## Get Detail Perusahaan

URL: `http://127.0.0.1:8000/api/organizational-structure/companies/{id_company}/detail`
Method: GET

```
response:
{
  "meta": {
    "status": 200,
    "message": "Company detail found"
  },
  "data": {
    "id_company": "019ad7e9-2331-71ed-8ee7-ff7af32a8cd6",
    "company_name": "PT. Artificial Intelligence Indonesia",
    "company_description": "Pengembang solusi AI dan robotic process automation",
    "id_bl": "019ad2e7-1c4f-7056-9b0b-7b0bdf62cf2d",
    "deleted_at": null,
    "created_at": "<timestamp>",
    "updated_at": "<timestamp>"
  }
}
```

## Dropdown Perusahaan

URL: `http://127.0.0.1:8000/api/organizational-structure/companies-dropdown`
Method: GET

```
response:
{
  "meta": {
    "status": 200,
    "message": "Success get companies for dropdown"
  },
  "data": [
    { "id_company": "019ad7eb-5df0-7383-b933-c4f1c208db39", "company_name": "PT. Artificial Intelligence Indonesia" }
  ]
}
```

<!-- Tambahan: Dokumentasi API untuk menambah dokumen perusahaan berdasarkan Postman HRIS-Dasaria 1.9.2 -->

## Tambah Dokumen Perusahaan

URL: `http://127.0.0.1:8000/api/organizational-structure/companies/{id_company}/documents`
Method: POST
Body (form-data):
- `documents[0][cd_name]`
- `documents[0][cd_decree_number]`
- `documents[0][cd_file]` (file)
- `documents[1][cd_name]` (opsional)
- `documents[1][cd_decree_number]` (opsional)
- `documents[1][cd_file]` (file, opsional)

```
response:
{
  "meta": {
    "status": 201,
    "message": "Company documents added successfully"
  },
  "data": [
    {
      "cd_name": "dokument 1",
      "cd_decree_number": "SK/COMP/2024/001",
      "cd_file": "company/decree/<file-uuid>.pdf",
      "id_company": "{id_company}",
      "id_cd": "<uuid>",
      "created_at": "<timestamp>",
      "updated_at": "<timestamp>"
    }
  ]
}
```

<!-- Tambahan: Dokumentasi API untuk menghapus dokumen perusahaan berdasarkan Postman HRIS-Dasaria 1.9.2 -->

## Hapus Dokumen Perusahaan

URL: `http://127.0.0.1:8000/api/organizational-structure/companies/{id_company}/deletedocuments`
Method: POST
Body (form-data):
- `cd_deleted_decree`
- `cd_deleted_decree_file` (file)

```
response:
{
  "meta": {
    "status": 200,
    "message": "Company documents deleted successfully"
  }
}
```

<!-- Tambahan: Dokumentasi API untuk update data perusahaan berdasarkan Postman HRIS-Dasaria 1.9.2 -->

## Update Data Perusahaan by UUID

URL: `http://127.0.0.1:8000/api/organizational-structure/companies/{id_company}`
Method: POST (with `_method=PATCH`)
Body (form-data):
- `address`
- `postal_code`
- `email`
- `phone`
- `industry`
- `founded_year`
- `company_type`
- `website`
- `logo` (file)
- `_method`: `PATCH`

```
response:
{
  "meta": {
    "status": 200,
    "message": "Company updated successfully"
  },
  "data": {
    "id_company": "{id_company}",
    "address": "kaliurang",
    "postal_code": "68124",
    "email": "tes@gmail.com",
    "phone": "0812",
    "industry": "isp",
    "founded_year": 2017,
    "company_type": "pt",
    "website": "https://github.com/",
    "logo_url": "company/logo/<file-uuid>.png",
    "updated_at": "<timestamp>"
  }
}
```
