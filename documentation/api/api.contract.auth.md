# Kontrak API – Auth

Base URL: `/api/auth`

Catatan umum:
- Satu halaman satu API, mengikuti halaman di fitur auth: Login, Forgot Password, Reset Password. Tambahan utilitas: Me, Refresh, Logout.
- Response hanya menyertakan field yang dipakai UI: `id`, `email`, `name`, `role`, `avatar`, `isActive`. Field lain bisa tersedia tapi tidak wajib dipakai tampilan.

## Login Page

Endpoint: `POST /api/auth/login`
- Request body:
```json
{
  "email": "string",
  "password": "string",
  "rememberMe": true
}
```
- Response body:
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string",
    "avatar": "string",
    "isActive": true
  }
}
```
- Error examples:
  - `400 { "message": "Email and password are required" }`
  - `401 { "message": "Invalid email or password" }`
  - `403 { "message": "User is not active" }`
  - `404 { "message": "User not found" }`

## Forgot Password Page

Endpoint: `POST /api/auth/forgot-password`
- Request body:
```json
{
  "email": "string"
}
```
- Response body (minimum yang dipakai UI):
```json
{
  "message": "string",
  "resetToken": "string"
}
```

## Reset Password Page

Endpoint: `POST /api/auth/reset-password`
- Request body:
```json
{
  "token": "string",
  "password": "string",
  "confirmPassword": "string"
}
```
- Response body:
```json
{
  "message": "string"
}
```

## Me (Detail User aktif)

Endpoint: `GET /api/auth/me`
- Response body (hanya field yang dipakai tampilan/header & akses):
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string",
    "avatar": "string",
    "isActive": true
  }
}
```
- Auth: Bearer `accessToken`

## Refresh Token

Endpoint: `POST /api/auth/refresh`
- Request body:
```json
{
  "refreshToken": "string"
}
```
- Response body:
```json
{
  "accessToken": "string"
}
```

## Logout

Endpoint: `POST /api/auth/logout`
- Request body: none
- Response body:
```json
{ "message": "Logged out" }
```

## Catatan CRUD
- Fitur auth tidak menyediakan halaman list/detail user dalam UI saat ini, sehingga tidak ada `GET list`/`GET detail` untuk resource users.
- Tidak ada form modal create/update/delete pada fitur auth; operasi `POST`, `PATCH`, `DELETE` CRUD per resource tidak relevan di sini. Operasi yang tersedia mengikuti service existing: `login`, `forgot-password`, `reset-password`, `me`, `refresh`, `logout`.