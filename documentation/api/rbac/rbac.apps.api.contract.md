# Kontrak API – Apps (RBAC)

Dokumen ini merinci kontrak API untuk fitur `Apps` pada modul RBAC.

## Konvensi Umum

- Base URL: `https://qz97xl4p-3000.asse.devtunnels.ms` (atau sesuai environment)
- Content-Type: `application/json`
- Response Standard: JSON

---

## Operations

### 1. Create App

Endpoint: `POST /apps/`

Request Body:
```json
{
  "name": [
    "App A",
    "App B"
  ]
}
```

Validation:
- `name`: array of strings, required, min items: 1

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "berhasil membuat apps"
  },
  "data": {}
}
```

### 2. Get Apps List

Endpoint: `GET /apps/`

Query Parameters:
- `q`: string (Search query)
- `page`: string/numeric (default: 0)
- `per_page`: string/numeric (default: 0)

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "berhasil mendapatkan daftar apps"
  },
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": "342dbb22-0f84-4996-80a8-750e55c362d2",
        "code": "App-1",
        "name": "App A",
        "created_at": "2026-02-05T06:05:09.000Z",
        "updated_at": "2026-02-05T06:05:09.000Z"
      },
      {
        "id": "130e0ced-78db-4652-9632-366db3e4f1a2",
        "code": "App-2",
        "name": "App A",
        "created_at": "2026-02-05T06:57:07.000Z",
        "updated_at": "2026-02-05T06:57:07.000Z"
      },
      {
        "id": "be3f8082-2f7d-4f4f-a788-7b5268268587",
        "code": "App-3",
        "name": "App B",
        "created_at": "2026-02-05T06:57:07.000Z",
        "updated_at": "2026-02-05T06:57:07.000Z"
      },
      {
        "id": "3937297a-1cac-457a-9a1b-c7c244c12eaf",
        "code": "App-4",
        "name": "App A",
        "created_at": "2026-02-05T06:57:12.000Z",
        "updated_at": "2026-02-05T06:57:12.000Z"
      },
      {
        "id": "912831e0-3b55-4459-aeba-f1f8b1b2a2d1",
        "code": "App-5",
        "name": "App B",
        "created_at": "2026-02-05T06:57:12.000Z",
        "updated_at": "2026-02-05T06:57:12.000Z"
      }
    ],
    "per_page": 10,
    "to": 5,
    "total": 5
  }
}
```

### 3. Get App by ID

Endpoint: `GET /apps/{id}`

Path Parameters:
- `id`: string (UUID), required

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "berhasil mendapatkan detail app beserta modules, features dan access"
  },
  "data": {
    "app_id": "342dbb22-0f84-4996-80a8-750e55c362d2",
    "app_name": "App A",
    "list_modules": [
      {
        "modules_id": "956f59ed-4d7b-4fab-8ab5-9a34ca064aee",
        "modules_name": "Module Xyz",
        "features": [
          {
            "features_id": "c954cacf-4d18-46ce-865b-2ad5af758b6c",
            "features_name": "Feature Xyz",
            "list_access": [
              {
                "access_id": "164fdc5f-5565-4467-8bda-821ce546795d",
                "access_name": "Access Xyz"
              },
              {
                "access_id": "6568ebb9-4343-4c02-a034-ad9a9b26aa27",
                "access_name": "Hahaha"
              },
              {
                "access_id": "91732cf7-a393-490e-86ad-b4cd8748656a",
                "access_name": "Access Xyz"
              },
              {
                "access_id": "a712944c-f5ca-4c0c-9fab-481f96c65c86",
                "access_name": "Access Abc"
              },
              {
                "access_id": "b258c3a2-4aba-4021-a23b-207a8fbaa66e",
                "access_name": "Access Xyz"
              },
              {
                "access_id": "c515bd51-4334-48cc-beb5-4df59d9592d4",
                "access_name": "Access Xyz"
              },
              {
                "access_id": "c521201e-7885-4de0-a669-5043ac302e9e",
                "access_name": "Access Abc"
              },
              {
                "access_id": "f3c1ae04-870b-4051-8992-5cd2d1d04304",
                "access_name": "Access Abc"
              },
              {
                "access_id": "ff8e32e7-7020-4e45-a894-e7897a6f9b32",
                "access_name": "Access Abc"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### 4. Update App

Endpoint: `PATCH /apps/{id}`

Path Parameters:
- `id`: string (UUID), required

Request Body:
```json
{
  "name": "App B Updated"
}
```

Validation:
- `name`: string, required, min: 1, max: 150

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "berhasil memperbarui apps"
  },
  "data": {}
}
```

### 5. Delete App

Endpoint: `DELETE /apps/{id}`

Path Parameters:
- `id`: string (UUID), required

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "berhasil menghapus apps"
  },
  "data": {}
}
```
