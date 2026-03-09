# Kontrak API – Modules (RBAC)

Dokumen ini merinci kontrak API untuk fitur `Modules` pada modul RBAC.

## Konvensi Umum

- Base URL: `https://qz97xl4p-3000.asse.devtunnels.ms` (atau sesuai environment)
- Content-Type: `application/json`
- Response Standard: JSON

---

## Operations

### 1. Create Module

Endpoint: `POST /modules/`

Request Body:
```json
{
  "apps_id": "342dbb22-0f84-4996-80a8-750e55c362d2",
  "name": [
    "Module A",
    "Module X"
  ]
}
```

Validation:
- `apps_id`: string (UUID), required, min: 36, max: 36
- `name`: array of strings, required, item min: 1, max: 150

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "berhasil membuat module"
  },
  "data": {}
}
```

### 2. Get Modules List

Endpoint: `GET /modules/`

Query Parameters:
- `q`: string (Search query)
- `apps_id`: string (UUID)
- `page`: string/numeric (default: 0)
- `per_page`: string/numeric (default: 0)

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "berhasil mendapatkan daftar modules"
  },
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": "956f59ed-4d7b-4fab-8ab5-9a34ca064aee",
        "name": "Module Xyz",
        "apps_id": "342dbb22-0f84-4996-80a8-750e55c362d2",
        "apps_code": "App-1",
        "apps_name": "App A",
        "created_at": "2026-02-05T13:59:16.000Z",
        "updated_at": "2026-02-05T07:17:16.000Z"
      },
      {
        "id": "43ed9eea-5ef9-409a-8a80-1612e62b41ec",
        "name": "Module X",
        "apps_id": "342dbb22-0f84-4996-80a8-750e55c362d2",
        "apps_code": "App-1",
        "apps_name": "App A",
        "created_at": "2026-02-05T14:18:23.000Z",
        "updated_at": "2026-02-05T14:18:23.000Z"
      }
    ],
    "per_page": 10,
    "to": 2,
    "total": 2
  }
}
```

### 3. Get Module by ID

Endpoint: `GET /modules/{id}`

Path Parameters:
- `id`: string (UUID), required

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "berhasil mendapatkan detail module"
  },
  "data": {
    "id": "956f59ed-4d7b-4fab-8ab5-9a34ca064aee",
    "name": "Module Xyz",
    "apps_id": "342dbb22-0f84-4996-80a8-750e55c362d2",
    "apps_code": "App-1",
    "apps_name": "App A",
    "created_at": "2026-02-05T13:59:16.000Z",
    "updated_at": "2026-02-05T07:17:16.000Z",
    "features": [
      {
        "id": "c954cacf-4d18-46ce-865b-2ad5af758b6c",
        "name": "Feature Xyz",
        "modules_id": "956f59ed-4d7b-4fab-8ab5-9a34ca064aee",
        "created_at": "2026-02-05T14:26:11.000Z",
        "updated_at": "2026-02-05T14:26:11.000Z"
      }
    ]
  }
}
```

### 4. Update Module

Endpoint: `PATCH /modules/{id}`

Path Parameters:
- `id`: string (UUID), required

Request Body:
```json
{
  "name": "Module Xyz"
}
```

Validation:
- `name`: string, min: 1, max: 150

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "berhasil mengupdate module"
  },
  "data": {}
}
```

### 5. Delete Module

Endpoint: `DELETE /modules/{id}`

Path Parameters:
- `id`: string (UUID), required

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "berhasil menghapus module"
  },
  "data": {}
}
```
