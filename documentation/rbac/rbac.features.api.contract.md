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
  "status": 200,
  "message": "Success",
  "data": ...
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

### 3. Get Feature by ID

Endpoint: `GET /features/{id}`

Path Parameters:
- `id`: string (UUID), required

Response (200 OK):
```json
{
  "status": 200,
  "data": {
    "id": "...",
    "name": "...",
    "modules_id": "..."
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
  "status": 200,
  "data": ...
}
```

### 5. Delete Feature

Endpoint: `DELETE /features/{id}`

Path Parameters:
- `id`: string (UUID), required

Response (200 OK):
```json
{
  "status": 200,
  "message": "Success"
}
```
