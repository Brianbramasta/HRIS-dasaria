## Implementasi Server (Code Split per Fitur)

- Endpoint untuk modul `structure-and-organize` dipecah per fitur agar ringkas dan mudah dirawat.
- Setiap fitur memiliki endpoint GET (list/detail bila ada) serta operasi `POST/PATCH/DELETE` yang mematuhi kebijakan `memoNumber` dan `skFileId`.
- Pemetaan modul ke endpoint:
  - BusinessLines: `GET /business-lines`, `GET /business-lines/:id/detail`, `POST /business-lines`, `PATCH /business-lines/:id`, `DELETE /business-lines/:id`.
  - Companies: `GET /companies`, `GET /companies/:id/detail`, `POST /companies`, `PATCH /companies/:id`, `DELETE /companies/:id`.
  - Offices: `GET /offices`, `POST /offices`, `PATCH /offices/:id`, `DELETE /offices/:id`.
  - Directorates: `GET /directorates`, `POST /directorates`, `PATCH /directorates/:id`, `DELETE /directorates/:id`.
  - Divisions: `GET /divisions`, `POST /divisions`, `PATCH /divisions/:id`, `DELETE /divisions/:id`.
  - Departments: `GET /departments`, `POST /departments`, `PATCH /departments/:id`, `DELETE /departments/:id`.
  - Positions: `GET /positions`, `POST /positions`, `PATCH /positions/:id`, `DELETE /positions/:id`.
  - EmployeePositions: `GET /employee-positions`, `POST /employee-positions`, `PATCH /employee-positions/:id`, `DELETE /employee-positions/:id`.
