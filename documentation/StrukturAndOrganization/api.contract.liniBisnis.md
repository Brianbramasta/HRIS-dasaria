# get lini bisnis

http://127.0.0.1:8000/api/lini-bisnis
methode: GET
PARAMS
q: aa
filter%5B%5D: test
filter%5B%5D: cek
\_sort: name
\_order: asc
\_page: 1
\_limit: 10

```
respone:
{
  "success": true,
  "message": "List Lini Bisnis",
  "data": [
    {
      "uuid_lini_bisnis": "019abe86-2217-71cc-8803-4eb968699c93",
      "nama_lini_bisnis": "Financial Technology Division",
      "no_sk_lini_bisnis": "SK/FINTECH/2024/001",
      "deskripsi_lini_bisnis": null,
      "file_url_sk_lini_bisnis": "/storage/lini-bisnis/sk/1037cd8e-407f-4267-908b-f1e8f3cd4250.pdf",
      "no_sk_hapus_lini_bisnis": null,
      "file_url_sk_hapus_lini_bisnis": null,
      "deleted_at": null,
      "created_at": "2025-11-26T04:57:32.000000Z",
      "updated_at": "2025-11-26T04:57:32.000000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 10,
    "total": 1,
    "last_page": 1,
    "from": 1,
    "to": 1
  }
}
```

# get Data by uuid

http://127.0.0.1:8000/api/lini-bisnis/{uuid}
methode: GET

```
respone:
{
  "success": true,
  "message": "Lini Bisnis found",
  "data": {
    "uuid_lini_bisnis": "019abe86-2217-71cc-8803-4eb968699c93",
    "nama_lini_bisnis": "Financial Technology Division",
    "no_sk_lini_bisnis": "SK/FINTECH/2024/001",
    "deskripsi_lini_bisnis": null,
    "file_url_sk_lini_bisnis": "/storage/lini-bisnis/sk/1037cd8e-407f-4267-908b-f1e8f3cd4250.pdf",
    "no_sk_hapus_lini_bisnis": null,
    "file_url_sk_hapus_lini_bisnis": null,
    "deleted_at": null,
    "created_at": "2025-11-26T04:57:32.000000Z",
    "updated_at": "2025-11-26T04:57:32.000000Z"
  }
}
```

# create lini bisnis

http://127.0.0.1:8000/api/lini-bisnis/store
methode: POST
BODY form-data
nama_lini_bisnis: Financial Technology Division
no_sk_lini_bisnis: SK/FINTECH/2024/001
deskripsi_lini_bisnis:
file_url_sk_lini_bisnis: file

```
respone:
{
  "success": true,
  "message": "Lini Bisnis berhasil dibuat",
  "data": {
    "nama_lini_bisnis": "Bisnsi Digital",
    "no_sk_lini_bisnis": "SK/BD/2024/001",
    "deskripsi_lini_bisnis": null,
    "file_url_sk_lini_bisnis": "/storage/Lini-Bisnis/sk/68193621-54d8-4f35-9f16-893ac479be57.pdf",
    "uuid_lini_bisnis": "019abf52-66af-7340-a2e1-01eca2417786",
    "updated_at": "2025-11-26T08:40:39.000000Z",
    "created_at": "2025-11-26T08:40:39.000000Z"
  }
}
```

# update data lini bisnis by uuid

http://127.0.0.1:8000/api/lini-bisnis/{uuid}/update
methode: POST
BODY form-data
nama_lini_bisnis: Digital Business Unit
no_sk_lini_bisnis: SK/DBU/2024/001
deskripsi_lini_bisnis: digital bisnis
file_url_sk_lini_bisnis: file

```
respone:
{
  "success": true,
  "message": "Lini Bisnis berhasil diupdate",
  "data": {
    "uuid_lini_bisnis": "019abe86-2217-71cc-8803-4eb968699c93",
    "nama_lini_bisnis": "Financial Technology Division 2",
    "no_sk_lini_bisnis": "SK/FINTECH/2024/002",
    "deskripsi_lini_bisnis": "fintect",
    "file_url_sk_lini_bisnis": "/storage/Lini-Bisnis/sk/63a86b4d-0f12-4f78-82cb-c55e60b7b42a.pdf",
    "no_sk_hapus_lini_bisnis": null,
    "file_url_sk_hapus_lini_bisnis": null,
    "deleted_at": null,
    "created_at": "2025-11-26T04:57:32.000000Z",
    "updated_at": "2025-11-26T08:36:37.000000Z"
  }
}
```

# delete data lini bisnis by uuid

http://127.0.0.1:8000/api/lini-bisnis/{uuid}/delete
methode: POST
BODY form-data
no_sk_hapus_lini_bisnis: SK-PH/BU/2024/001
file_url_sk_hapus_lini_bisnis: file

```
respone:
{
  "success": true,
  "message": "Lini Bisnis berhasil dihapus",
  "data": null
}
```

# dropdown lini bisnis

http://127.0.0.1:8000/api/dropdown-lini-bisnis
methode: GET

```
respone:
{
  "success": true,
  "message": "Dropdown Lini Bisnis",
  "data": [
    {
      "uuid_lini_bisnis": "019abe86-2217-71cc-8803-4eb968699c93",
      "nama_lini_bisnis": "Financial Technology Division"
    }
  ]
}
```

# Dropdwon Lini-Bisnis

[Dropdwon Lini-Bisnis](http://127.0.0.1:8000/api/dropdown-lini-bisnis)

```
respone:
{
    "success": true,
    "message": "Dropdown Lini Bisnis",
    "data": [
        {
            "uuid_lini_bisnis": "019ac38f-9ac8-715e-bf8e-385335f9b9d2",
            "nama_lini_bisnis": "Financial Technology Division"
        },
        {
            "uuid_lini_bisnis": "019ac433-79e6-7195-b71b-466e14705111",
            "nama_lini_bisnis": "ISP"
        }
    ]
}
```

# Get Detail Lini Bisnis

http://127.0.0.1:8000/api/lini-bisnis/019ac38f-9ac8-715e-bf8e-385335f9b9d2/detail
methode: GET

```
respone:
{
    "success": true,
    "message": "Lini Bisnis detail found",
    "data": {
        "uuid_lini_bisnis": "019ac38f-9ac8-715e-bf8e-385335f9b9d2",
        "nama_lini_bisnis": "Financial Technology Division",
        "no_sk_lini_bisnis": "SK/FINTECH/2024/001",
        "deskripsi_lini_bisnis": "test description",
        "file_url_sk_lini_bisnis": "/storage/Lini-Bisnis/sk/ede0476f-3012-4a18-a5f8-30e398313b86.pdf",
        "no_sk_hapus_lini_bisnis": null,
        "file_url_sk_hapus_lini_bisnis": null,
        "deleted_at": null,
        "created_at": "2025-11-27T04:25:59.000000Z",
        "updated_at": "2025-11-27T07:19:51.000000Z",
        "perusahaan": []
    }
}
```
