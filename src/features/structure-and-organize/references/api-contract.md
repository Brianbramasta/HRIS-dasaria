# API Contract – Struktur & Organisasi

Base URL: `http://localhost:3001/api`

Semua response dibungkus dalam objek: `{ data: ... }`.

Filter dan paginasi untuk endpoint daftar mendukung query params:
- `q` (string) — pencarian full-text
- `_sort` (string) — nama field untuk sorting, contoh: `name`
- `_order` (string) — `asc` atau `desc`
- `_page` (number) — halaman, mulai dari 1
- `_limit` (number) — jumlah item per halaman

Contoh penggunaan query params: `GET /api/business-lines?_page=1&_limit=10&_sort=name&_order=asc&q=tech`

---

## Business Lines

- Endpoint: `/business-lines`

1) List Business Lines
- Method: `GET`
- Parameter: query params opsional (`q`, `_sort`, `_order`, `_page`, `_limit`)
- Response: `{ data: BusinessLine[] }`
- Contoh Request: `GET /api/business-lines?_page=1&_limit=10`
- Contoh Response:
```json
{
  "data": [
    {
      "id": "1",
      "name": "Teknologi Informasi",
      "code": "IT",
      "description": "Divisi yang mengelola teknologi dan sistem informasi perusahaan",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "2",
      "name": "Pemasaran",
      "code": "MKT",
      "description": "Divisi yang mengelola strategi pemasaran dan penjualan",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

2) Get Business Line by ID
- Method: `GET`
- Endpoint: `/business-lines/{id}`
- Parameter: `id` (path)
- Response: `{ data: BusinessLine }`
- Contoh Request: `GET /api/business-lines/1`
- Contoh Response:
```json
{
  "data": {
    "id": "1",
    "name": "Teknologi Informasi",
    "code": "IT",
    "description": "Divisi yang mengelola teknologi dan sistem informasi perusahaan",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

3) Create Business Line
- Method: `POST`
- Endpoint: `/business-lines`
- Body (JSON):
```json
{
  "name": "Keuangan",
  "code": "FIN",
  "description": "Divisi yang mengelola keuangan dan akuntansi perusahaan",
  "isActive": true
}
```
- Response: `{ data: BusinessLine }` (berisi `id`, `createdAt`, `updatedAt` yang dihasilkan)
- Contoh Response:
```json
{
  "data": {
    "id": "4",
    "name": "Keuangan",
    "code": "FIN",
    "description": "Divisi yang mengelola keuangan dan akuntansi perusahaan",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2025-11-08T13:16:50.870Z"
  }
}
```

4) Update Business Line
- Method: `PATCH`
- Endpoint: `/business-lines/{id}`
- Parameter: `id` (path)
- Body (JSON, partial):
```json
{
  "description": "Divisi yang mengelola keuangan, akuntansi, dan pajak perusahaan"
}
```
- Response: `{ data: BusinessLine }`

5) Delete Business Line
- Method: `DELETE`
- Endpoint: `/business-lines/{id}`
- Parameter: `id` (path)
- Response: `{ data: {} }` (JSON Server default)

---

## Companies

- Endpoint: `/companies`

1) List Companies
- Method: `GET`
- Parameter: query params opsional (`q`, `_sort`, `_order`, `_page`, `_limit`)
- Response: `{ data: Company[] }`
- Contoh Request: `GET /api/companies?_page=1&_limit=10&_sort=name&_order=asc`
- Contoh Response:
```json
{
  "data": [
    {
      "id": "1",
      "name": "PT Teknologi Nusantara",
      "code": "PTN",
      "businessLineId": "1",
      "businessLineName": "Teknologi Informasi",
      "address": "Jl. Sudirman No. 123, Jakarta",
      "phone": "+62-21-12345678",
      "email": "info@ptn.co.id",
      "website": "www.ptn.co.id",
      "taxId": "1234567890123",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

2) Get Company by ID
- Method: `GET`
- Endpoint: `/companies/{id}`
- Parameter: `id` (path)
- Response: `{ data: Company }`
- Contoh Request: `GET /api/companies/1`
- Contoh Response:
```json
{
  "data": {
    "id": "1",
    "name": "PT Teknologi Nusantara",
    "code": "PTN",
    "businessLineId": "1",
    "businessLineName": "Teknologi Informasi",
    "address": "Jl. Sudirman No. 123, Jakarta",
    "phone": "+62-21-12345678",
    "email": "info@ptn.co.id",
    "website": "www.ptn.co.id",
    "taxId": "1234567890123",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

3) Create Company
- Method: `POST`
- Endpoint: `/companies`
- Body (JSON):
```json
{
  "name": "PT Jaya Abadi",
  "code": "PJA",
  "businessLineId": "3",
  "businessLineName": "Operasional",
  "address": "Jl. Merdeka No. 1, Bandung",
  "phone": "+62-22-98765432",
  "email": "info@jayaabadi.co.id",
  "website": "www.jayaabadi.co.id",
  "taxId": "1122334455667",
  "isActive": true
}
```
- Response: `{ data: Company }`
- Contoh Response:
```json
{
  "data": {
    "id": "4",
    "name": "PT Jaya Abadi",
    "code": "PJA",
    "businessLineId": "3",
    "businessLineName": "Operasional",
    "address": "Jl. Merdeka No. 1, Bandung",
    "phone": "+62-22-98765432",
    "email": "info@jayaabadi.co.id",
    "website": "www.jayaabadi.co.id",
    "taxId": "1122334455667",
    "isActive": true,
    "createdAt": "2025-11-10T03:00:00.000Z",
    "updatedAt": "2025-11-10T03:00:00.000Z"
  }
}
```

4) Update Company
- Method: `PATCH`
- Endpoint: `/companies/{id}`
- Body (JSON, partial):
```json
{
  "address": "Jl. Sudirman No. 123, Jakarta Selatan",
  "phone": "+62-21-12345670"
}
```
- Response: `{ data: Company }`

5) Delete Company
- Method: `DELETE`
- Endpoint: `/companies/{id}`
- Response: `{ data: {} }`

---

## Offices

- Endpoint: `/offices`

1) List Offices
- Method: `GET`
- Parameter: query params opsional
- Response: `{ data: Office[] }`
- Contoh Response:
```json
{
  "data": [
    {
      "id": "1",
      "name": "Kantor Pusat Jakarta",
      "code": "KPJKT",
      "companyId": "1",
      "companyName": "PT Teknologi Nusantara",
      "address": "Jl. Sudirman No. 123, Jakarta Pusat",
      "city": "Jakarta",
      "province": "DKI Jakarta",
      "country": "Indonesia",
      "postalCode": "10220",
      "phone": "+62-21-12345678",
      "fax": "+62-21-12345679",
      "email": "hq@ptn.co.id",
      "isHeadOffice": true,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

2) Get Office by ID
- Method: `GET`
- Endpoint: `/offices/{id}`
- Response: `{ data: Office }`
- Contoh Response:
```json
{
  "data": {
    "id": "1",
    "name": "Kantor Pusat Jakarta",
    "code": "KPJKT",
    "companyId": "1",
    "companyName": "PT Teknologi Nusantara",
    "address": "Jl. Sudirman No. 123, Jakarta Pusat",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "country": "Indonesia",
    "postalCode": "10220",
    "phone": "+62-21-12345678",
    "fax": "+62-21-12345679",
    "email": "hq@ptn.co.id",
    "isHeadOffice": true,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

3) Create Office
- Method: `POST`
- Endpoint: `/offices`
- Body (JSON):
```json
{
  "name": "Kantor Cabang Yogyakarta",
  "code": "KCYGK",
  "companyId": "1",
  "companyName": "PT Teknologi Nusantara",
  "address": "Jl. Malioboro No. 10, Yogyakarta",
  "city": "Yogyakarta",
  "province": "DI Yogyakarta",
  "country": "Indonesia",
  "postalCode": "55213",
  "phone": "+62-274-555666",
  "isHeadOffice": false,
  "isActive": true
}
```
- Response: `{ data: Office }`

4) Update Office
- Method: `PATCH`
- Endpoint: `/offices/{id}`
- Body (JSON, partial):
```json
{
  "phone": "+62-21-12345677",
  "email": "pusat@ptn.co.id"
}
```
- Response: `{ data: Office }`

5) Delete Office
- Method: `DELETE`
- Endpoint: `/offices/{id}`
- Response: `{ data: {} }`

---

## Directorates

- Endpoint: `/directorates`

1) List Directorates
- Method: `GET`
- Parameter: query params opsional
- Response: `{ data: Directorate[] }`
- Contoh Response:
```json
{
  "data": [
    {
      "id": "1",
      "name": "Direktorat Teknologi",
      "code": "DIR-TECH",
      "description": "Mengelola seluruh aspek teknologi dan inovasi perusahaan",
      "directorId": "EMP001",
      "directorName": "Budi Santoso",
      "directorEmail": "budi.santoso@ptn.co.id",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

2) Get Directorate by ID
- Method: `GET`
- Endpoint: `/directorates/{id}`
- Response: `{ data: Directorate }`
- Contoh Response:
```json
{
  "data": {
    "id": "1",
    "name": "Direktorat Teknologi",
    "code": "DIR-TECH",
    "description": "Mengelola seluruh aspek teknologi dan inovasi perusahaan",
    "directorId": "EMP001",
    "directorName": "Budi Santoso",
    "directorEmail": "budi.santoso@ptn.co.id",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

3) Create Directorate
- Method: `POST`
- Endpoint: `/directorates`
- Body (JSON):
```json
{
  "name": "Direktorat Keuangan",
  "code": "DIR-FIN",
  "description": "Mengelola keuangan perusahaan",
  "directorId": "EMP010",
  "directorName": "Dewi Lestari",
  "directorEmail": "dewi.lestari@ptn.co.id",
  "isActive": true
}
```
- Response: `{ data: Directorate }`

4) Update Directorate
- Method: `PATCH`
- Endpoint: `/directorates/{id}`
- Body (JSON, partial):
```json
{
  "description": "Mengelola seluruh aspek teknologi, inovasi, dan riset perusahaan"
}
```
- Response: `{ data: Directorate }`

5) Delete Directorate
- Method: `DELETE`
- Endpoint: `/directorates/{id}`
- Response: `{ data: {} }`

---

## Divisions

- Endpoint: `/divisions`

1) List Divisions
- Method: `GET`
- Parameter: query params opsional
- Response: `{ data: Division[] }`
- Contoh Response:
```json
{
  "data": [
    {
      "id": "1",
      "name": "Divisi Pengembangan Software",
      "code": "DIV-SW",
      "description": "Mengelola pengembangan perangkat lunak dan aplikasi",
      "directorateId": "1",
      "directorateName": "Direktorat Teknologi",
      "divisionHeadId": "EMP004",
      "divisionHeadName": "Rina Wijaya",
      "divisionHeadEmail": "rina.wijaya@ptn.co.id",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

2) Get Division by ID
- Method: `GET`
- Endpoint: `/divisions/{id}`
- Response: `{ data: Division }`
- Contoh Response:
```json
{
  "data": {
    "id": "1",
    "name": "Divisi Pengembangan Software",
    "code": "DIV-SW",
    "description": "Mengelola pengembangan perangkat lunak dan aplikasi",
    "directorateId": "1",
    "directorateName": "Direktorat Teknologi",
    "divisionHeadId": "EMP004",
    "divisionHeadName": "Rina Wijaya",
    "divisionHeadEmail": "rina.wijaya@ptn.co.id",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

3) Create Division
- Method: `POST`
- Endpoint: `/divisions`
- Body (JSON):
```json
{
  "name": "Divisi Riset & Pengembangan",
  "code": "DIV-R&D",
  "description": "Melakukan riset untuk inovasi produk",
  "directorateId": "1",
  "directorateName": "Direktorat Teknologi",
  "divisionHeadId": "EMP011",
  "divisionHeadName": "Joko Susilo",
  "divisionHeadEmail": "joko.susilo@ptn.co.id",
  "isActive": true
}
```
- Response: `{ data: Division }`

4) Update Division
- Method: `PATCH`
- Endpoint: `/divisions/{id}`
- Body (JSON, partial):
```json
{
  "divisionHeadName": "Rina Wijayanti"
}
```
- Response: `{ data: Division }`

5) Delete Division
- Method: `DELETE`
- Endpoint: `/divisions/{id}`
- Response: `{ data: {} }`

---

## Departments

- Endpoint: `/departments`

1) List Departments
- Method: `GET`
- Parameter: query params opsional
- Response: `{ data: Department[] }`
- Contoh Response:
```json
{
  "data": [
    {
      "id": "1",
      "name": "Departemen Backend Development",
      "code": "DEPT-BE",
      "description": "Mengelola pengembangan backend dan API",
      "divisionId": "1",
      "divisionName": "Divisi Pengembangan Software",
      "departmentHeadId": "EMP007",
      "departmentHeadName": "Eko Prasetyo",
      "departmentHeadEmail": "eko.prasetyo@ptn.co.id",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

2) Get Department by ID
- Method: `GET`
- Endpoint: `/departments/{id}`
- Response: `{ data: Department }`
- Contoh Response:
```json
{
  "data": {
    "id": "1",
    "name": "Departemen Backend Development",
    "code": "DEPT-BE",
    "description": "Mengelola pengembangan backend dan API",
    "divisionId": "1",
    "divisionName": "Divisi Pengembangan Software",
    "departmentHeadId": "EMP007",
    "departmentHeadName": "Eko Prasetyo",
    "departmentHeadEmail": "eko.prasetyo@ptn.co.id",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

3) Create Department
- Method: `POST`
- Endpoint: `/departments`
- Body (JSON):
```json
{
  "name": "Departemen Mobile Development",
  "code": "DEPT-MOB",
  "description": "Mengelola pengembangan aplikasi mobile",
  "divisionId": "1",
  "divisionName": "Divisi Pengembangan Software",
  "departmentHeadId": "EMP012",
  "departmentHeadName": "Putri Ayu",
  "departmentHeadEmail": "putri.ayu@ptn.co.id",
  "isActive": true
}
```
- Response: `{ data: Department }`

4) Update Department
- Method: `PATCH`
- Endpoint: `/departments/{id}`
- Body (JSON, partial):
```json
{
  "description": "Mengelola pengembangan backend, API, dan microservices"
}
```
- Response: `{ data: Department }`

5) Delete Department
- Method: `DELETE`
- Endpoint: `/departments/{id}`
- Response: `{ data: {} }`

---

## Positions (Jabatan)

- Endpoint: `/positions`

1) List Positions
- Method: `GET`
- Parameter: query params opsional
- Response: `{ data: Position[] }`
- Contoh Response:
```json
{
  "data": [
    {
      "id": "1",
      "name": "Software Engineer",
      "code": "SE",
      "description": "Mengembangkan dan memelihara perangkat lunak",
      "level": "Staff",
      "minSalary": 8000000,
      "maxSalary": 15000000,
      "currency": "IDR",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

2) Get Position by ID
- Method: `GET`
- Endpoint: `/positions/{id}`
- Response: `{ data: Position }`
- Contoh Response:
```json
{
  "data": {
    "id": "1",
    "name": "Software Engineer",
    "code": "SE",
    "description": "Mengembangkan dan memelihara perangkat lunak",
    "level": "Staff",
    "minSalary": 8000000,
    "maxSalary": 15000000,
    "currency": "IDR",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

3) Create Position
- Method: `POST`
- Endpoint: `/positions`
- Body (JSON):
```json
{
  "name": "QA Engineer",
  "code": "QE",
  "description": "Memastikan kualitas perangkat lunak",
  "level": "Staff",
  "minSalary": 7500000,
  "maxSalary": 14000000,
  "currency": "IDR",
  "isActive": true
}
```
- Response: `{ data: Position }`

4) Update Position
- Method: `PATCH`
- Endpoint: `/positions/{id}`
- Body (JSON, partial):
```json
{
  "maxSalary": 16000000
}
```
- Response: `{ data: Position }`

5) Delete Position
- Method: `DELETE`
- Endpoint: `/positions/{id}`
- Response: `{ data: {} }`

---

## Employee Positions (Posisi Pegawai)

- Endpoint: `/employee-positions`

1) List Employee Positions
- Method: `GET`
- Parameter: query params opsional
- Response: `{ data: EmployeePosition[] }`
- Contoh Response:
```json
{
  "data": [
    {
      "id": "1",
      "employeeId": "EMP007",
      "employeeName": "Eko Prasetyo",
      "employeeCode": "EMP007",
      "positionId": "1",
      "positionName": "Software Engineer",
      "positionCode": "SE",
      "directorateId": "1",
      "directorateName": "Direktorat Teknologi",
      "divisionId": "1",
      "divisionName": "Divisi Pengembangan Software",
      "departmentId": "1",
      "departmentName": "Departemen Backend Development",
      "startDate": "2023-01-15",
      "endDate": null,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

2) Get Employee Position by ID
- Method: `GET`
- Endpoint: `/employee-positions/{id}`
- Response: `{ data: EmployeePosition }`
- Contoh Response:
```json
{
  "data": {
    "id": "1",
    "employeeId": "EMP007",
    "employeeName": "Eko Prasetyo",
    "employeeCode": "EMP007",
    "positionId": "1",
    "positionName": "Software Engineer",
    "positionCode": "SE",
    "directorateId": "1",
    "directorateName": "Direktorat Teknologi",
    "divisionId": "1",
    "divisionName": "Divisi Pengembangan Software",
    "departmentId": "1",
    "departmentName": "Departemen Backend Development",
    "startDate": "2023-01-15",
    "endDate": null,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

3) Create Employee Position
- Method: `POST`
- Endpoint: `/employee-positions`
- Body (JSON):
```json
{
  "employeeId": "EMP013",
  "employeeName": "Sari Dewi",
  "employeeCode": "EMP013",
  "positionId": "4",
  "positionName": "HR Specialist",
  "positionCode": "HRS",
  "directorateId": "3",
  "directorateName": "Direktorat Operasional",
  "divisionId": null,
  "divisionName": null,
  "departmentId": null,
  "departmentName": null,
  "startDate": "2024-05-01",
  "endDate": null,
  "isActive": true
}
```
- Response: `{ data: EmployeePosition }`

4) Update Employee Position
- Method: `PATCH`
- Endpoint: `/employee-positions/{id}`
- Body (JSON, partial):
```json
{
  "endDate": "2025-12-31",
  "isActive": false
}
```
- Response: `{ data: EmployeePosition }`

5) Delete Employee Position
- Method: `DELETE`
- Endpoint: `/employee-positions/{id}`
- Response: `{ data: {} }`

---

## Catatan
- Tipe data untuk setiap field (misal: `BusinessLine`, `Company`) dapat dilihat di `src/features/structure-and-organize/organization.types.ts`.
- Semua waktu (`createdAt`, `updatedAt`) di-generate otomatis pada saat `POST`/`PATCH` oleh client dalam implementasi saat ini.
- Response service di aplikasi membaca properti `data` dari body server. Jika Anda mengakses langsung via HTTP, perhatikan response dibungkus `{ data: ... }` oleh JSON Server middleware.