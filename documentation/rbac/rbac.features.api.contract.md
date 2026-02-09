# Kontrak API – Features (RBAC)

Dokumen ini merinci kontrak API untuk fitur `Features` pada modul RBAC.

## Konvensi Umum

- Base URL: `https://qz97xl4p-3000.asse.devtunnels.ms` (atau sesuai environment)
- Content-Type: `application/json`
- Response Standard: JSON

---

## Operations

### 1. Create Feature

Endpoint: `POST /features/`

Request Body:
```json
{
  "modules_id": "956f59ed-4d7b-4fab-8ab5-9a34ca064aee",
  "name": [
    "Feature Xyz",
    "Feature ABC"
  ]
}
```

Validation:
- `modules_id`: string (UUID), required, min: 36, max: 36
- `name`: array of strings, required, item min: 1, max: 150

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "berhasil membuat features"
  },
  "data": {}
}
```

### 2. Get Features List

Endpoint: `GET /features/`

Query Parameters:
- `q`: string (Search query)
- `modules_id`: string (UUID)
- `page`: string/numeric (default: 0)
- `per_page`: string/numeric (default: 0)

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "berhasil mendapatkan daftar features"
  },
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": "c954cacf-4d18-46ce-865b-2ad5af758b6c",
        "name": "Feature Xyz",
        "modules_id": "956f59ed-4d7b-4fab-8ab5-9a34ca064aee",
        "created_at": "2026-02-05T14:26:11.000Z",
        "updated_at": "2026-02-05T14:26:11.000Z"
      }
    ],
    "per_page": 10,
    "to": 1,
    "total": 1
  }
}
```

### 3. Get Feature by ID

Endpoint: `GET /features/{id}`

Path Parameters:
- `id`: string (UUID), required

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "berhasil mendapatkan detail feature"
  },
  "data": {
    "id": "c954cacf-4d18-46ce-865b-2ad5af758b6c",
    "name": "Feature Xyz",
    "modules_id": "956f59ed-4d7b-4fab-8ab5-9a34ca064aee",
    "created_at": "2026-02-05T14:26:11.000Z",
    "updated_at": "2026-02-05T14:26:11.000Z",
    "access": [
      {
        "id": "164fdc5f-5565-4467-8bda-821ce546795d",
        "name": "Access Xyz",
        "code": "05",
        "describe": "This is access xyz",
        "features_id": "c954cacf-4d18-46ce-865b-2ad5af758b6c",
        "created_at": "2026-02-05T08:01:44.000Z",
        "updated_at": "2026-02-05T08:01:44.000Z"
      },
      {
        "id": "6568ebb9-4343-4c02-a034-ad9a9b26aa27",
        "name": "Hahaha",
        "code": "04",
        "describe": "This is access abc",
        "features_id": "c954cacf-4d18-46ce-865b-2ad5af758b6c",
        "created_at": "2026-02-05T08:00:55.000Z",
        "updated_at": "2026-02-05T08:02:34.000Z"
      },
      {
        "id": "91732cf7-a393-490e-86ad-b4cd8748656a",
        "name": "Access Xyz",
        "code": "07",
        "describe": "This is access xyz",
        "features_id": "c954cacf-4d18-46ce-865b-2ad5af758b6c",
        "created_at": "2026-02-09T06:55:41.000Z",
        "updated_at": "2026-02-09T06:55:41.000Z"
      },
      {
        "id": "a712944c-f5ca-4c0c-9fab-481f96c65c86",
        "name": "Access Abc",
        "code": "10",
        "describe": "This is access abc",
        "features_id": "c954cacf-4d18-46ce-865b-2ad5af758b6c",
        "created_at": "2026-02-09T07:04:57.000Z",
        "updated_at": "2026-02-09T07:04:57.000Z"
      },
      {
        "id": "b258c3a2-4aba-4021-a23b-207a8fbaa66e",
        "name": "Access Xyz",
        "code": "09",
        "describe": "This is access xyz",
        "features_id": "c954cacf-4d18-46ce-865b-2ad5af758b6c",
        "created_at": "2026-02-09T07:04:57.000Z",
        "updated_at": "2026-02-09T07:04:57.000Z"
      },
      {
        "id": "c515bd51-4334-48cc-beb5-4df59d9592d4",
        "name": "Access Xyz",
        "code": "01",
        "describe": "This is access xyz",
        "features_id": "c954cacf-4d18-46ce-865b-2ad5af758b6c",
        "created_at": "2026-02-05T08:00:50.000Z",
        "updated_at": "2026-02-05T08:00:50.000Z"
      },
      {
        "id": "c521201e-7885-4de0-a669-5043ac302e9e",
        "name": "Access Abc",
        "code": "02",
        "describe": "This is access abc",
        "features_id": "c954cacf-4d18-46ce-865b-2ad5af758b6c",
        "created_at": "2026-02-05T08:00:50.000Z",
        "updated_at": "2026-02-05T08:00:50.000Z"
      },
      {
        "id": "f3c1ae04-870b-4051-8992-5cd2d1d04304",
        "name": "Access Abc",
        "code": "08",
        "describe": "This is access abc",
        "features_id": "c954cacf-4d18-46ce-865b-2ad5af758b6c",
        "created_at": "2026-02-09T06:55:41.000Z",
        "updated_at": "2026-02-09T06:55:41.000Z"
      },
      {
        "id": "ff8e32e7-7020-4e45-a894-e7897a6f9b32",
        "name": "Access Abc",
        "code": "06",
        "describe": "This is access abc",
        "features_id": "c954cacf-4d18-46ce-865b-2ad5af758b6c",
        "created_at": "2026-02-05T08:01:44.000Z",
        "updated_at": "2026-02-05T08:01:44.000Z"
      }
    ]
  }
}
```

### 4. Update Feature

Endpoint: `PATCH /features/{id}`

Path Parameters:
- `id`: string (UUID), required

Request Body:
```json
{
  "name": "Feature Xyz"
}
```

Validation:
- `name`: string, min: 1, max: 150

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "berhasil mengupdate feature"
  },
  "data": {}
}
```

### 5. Delete Feature

Endpoint: `DELETE /features/{id}`

Path Parameters:
- `id`: string (UUID), required

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "berhasil menghapus feature"
  },
  "data": {}
}
```
