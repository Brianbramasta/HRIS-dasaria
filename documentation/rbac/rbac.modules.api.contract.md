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
  "status": 200,
  "message": "Success",
  "data": ...
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

### 3. Get Module by ID

Endpoint: `GET /modules/{id}`

Path Parameters:
- `id`: string (UUID), required

Response (200 OK):
```json
{
  "status": 200,
  "data": {
    "id": "...",
    "name": "...",
    "apps_id": "..."
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
  "status": 200,
  "data": ...
}
```

### 5. Delete Module

Endpoint: `DELETE /modules/{id}`

Path Parameters:
- `id`: string (UUID), required

Response (200 OK):
```json
{
  "status": 200,
  "message": "Success"
}
```
