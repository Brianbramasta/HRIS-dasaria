# Kontrak API – Access (RBAC)

Dokumen ini merinci kontrak API untuk fitur `Access` pada modul RBAC.

## Konvensi Umum

- Base URL: `https://qz97xl4p-3000.asse.devtunnels.ms` (atau sesuai environment)
- Content-Type: `application/json`
- Response Standard: JSON

---

## Operations

### 1. Create Access

Endpoint: `POST /access/`

Request Body:
```json
{
  "features_id": "c954cacf-4d18-46ce-865b-2ad5af758b6c",
  "items": [
    {
      "name": "Access Xyz",
      "describe": "This is access xyz"
    },
    {
      "name": "Access Abc",
      "describe": "This is access abc"
    }
  ]
}
```

Validation:
- `features_id`: string (UUID), required, min: 36, max: 36
- `items`: array of objects, required

Response (200 OK):
```json
{
  "meta": {
    "status": 201,
    "message": "berhasil membuat access"
  },
  "data": {
    "created": [
      {
        "id": "b258c3a2-4aba-4021-a23b-207a8fbaa66e",
        "name": "Access Xyz",
        "features_id": "c954cacf-4d18-46ce-865b-2ad5af758b6c",
        "code": "09"
      },
      {
        "id": "a712944c-f5ca-4c0c-9fab-481f96c65c86",
        "name": "Access Abc",
        "features_id": "c954cacf-4d18-46ce-865b-2ad5af758b6c",
        "code": "10"
      }
    ]
  }
}
```

### 2. Get Access List

Endpoint: `GET /access/`

Query Parameters:
- `q`: string (Search query)
- `features_id`: string (UUID)
- `page`: string/numeric (default: 0)
- `per_page`: string/numeric (default: 0)

Response (200 OK):
```json
{
  "status": 200,
  "data": [
    ...
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": ...
  }
}
```

### 3. Get Access by ID

Endpoint: `GET /access/{id}`

Path Parameters:
- `id`: string (UUID), required

Response (200 OK):
```json
{
  "status": 200,
  "data": {
    "id": "...",
    "name": "...",
    "describe": "...",
    "features_id": "..."
  }
}
```

### 4. Update Access

Endpoint: `PATCH /access/{id}`

Path Parameters:
- `id`: string (UUID), required

Request Body:
```json
{
  "name": "New Name",
  "describe": "New Description"
}
```

Validation:
- `name`: string, min: 1, max: 100
- `describe`: string, min: 1, max: 100

Response (200 OK):
```json
{
  "status": 200,
  "data": ...
}
```

### 5. Delete Access

Endpoint: `DELETE /access/{id}`

Path Parameters:
- `id`: string (UUID), required

Response (200 OK):
```json
{
  "status": 200,
  "message": "Success"
}
```
