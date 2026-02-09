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
  "status": 200,
  "message": "Success",
  "data": ...
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

### 3. Get App by ID

Endpoint: `GET /apps/{id}`

Path Parameters:
- `id`: string (UUID), required

Response (200 OK):
```json
{
  "status": 200,
  "data": {
    "id": "...",
    "name": "..."
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
  "status": 200,
  "data": ...
}
```

### 5. Delete App

Endpoint: `DELETE /apps/{id}`

Path Parameters:
- `id`: string (UUID), required

Response (200 OK):
```json
{
  "status": 200,
  "message": "Success"
}
```
