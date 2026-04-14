# Kontrak API – Roles Access (RBAC)

Dokumen ini merinci kontrak API untuk fitur `Roles Access` pada modul RBAC.

## Konvensi Umum

- Base URL: `https://qz97xl4p-3000.asse.devtunnels.ms` (atau sesuai environment)
- Content-Type: `application/json`
- Response Standard: JSON

---

## Operations

### 1. Create or Replace Roles Access (Bulk)

Endpoint: `POST /roles-access/`

Request Body:
```json
{
  "items": [
    {
      "id": null,
      "name": "Admin",
      "apps_id": "342dbb22-0f84-4996-80a8-750e55c362d2",
      "accessIds": [
        "164fdc5f-5565-4467-8bda-821ce546795d",
        "6568ebb9-4343-4c02-a034-ad9a9b26aa27"
      ]
    }
  ]
}
```

Validation:
- `items`: array of objects, required
  - `id`: string (UUID) or null
  - `name`: string
  - `apps_id`: string (UUID)
  - `accessIds`: array of strings (UUIDs)

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "berhasil membuat atau mengganti roles access (bulk)"
  },
  "data": [
   ..
  ]
}
```

### 2. Get Roles Access

Endpoint: `GET /roles-access/{id}`

Path Parameters:
- `id`: string (UUID), required

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "berhasil mendapatkan daftar roles dengan struktur hierarchy"
  },
  "data": [
    {
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
                  "access_id": "6568ebb9-4343-4c02-a034-ad9a9b26aa27",
                  "access_name": "Hahaha"
                },
                {
                  "access_id": "164fdc5f-5565-4467-8bda-821ce546795d",
                  "access_name": "Access Xyz"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### 3. List Apps Per Role

Endpoint: `GET /roles-access/app-role`

Response (200 OK):
```json
{
  "meta": {
    "status": 200,
    "message": "berhasil mendapatkan daftar apps per role"
  },
  "data": [
    {
      "role_id": "94b69e17-cbca-44a8-a294-9a7ecd080666",
      "role_name": "SuperAdmin",
      "list_apps": [
        {
          "app_id": "342dbb22-0f84-4996-80a8-750e55c362d2",
          "app_name": "App A"
        }
      ]
    },
    {
      "role_id": "9b3a75d9-8579-4e40-a3d8-9509cda9815a",
      "role_name": "Admin",
      "list_apps": [
        {
          "app_id": "342dbb22-0f84-4996-80a8-750e55c362d2",
          "app_name": "App A"
        }
      ]
    },
    {
      "role_id": "8993b0c9-98f5-4188-8ecf-8d9cac14d496",
      "role_name": "Admin-Dasaria",
      "list_apps": [
        {
          "app_id": "342dbb22-0f84-4996-80a8-750e55c362d2",
          "app_name": "App A"
        }
      ]
    },
    {
      "role_id": "4d965a0f-ed3a-4b6f-a043-26b0032022a9",
      "role_name": "Superman",
      "list_apps": [
        {
          "app_id": "342dbb22-0f84-4996-80a8-750e55c362d2",
          "app_name": "App A"
        }
      ]
    }
  ]
}
```
