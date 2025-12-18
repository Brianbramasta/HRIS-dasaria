# Data Kontrak Karyawan

## Get Data Kontrak Karyawan

**URL:** `{{base_url}}/api/employee-master-data/employees/{id_employee}/data-kontrak`  
**Method:** GET

**Path Parameters:**

- `id_employee` (required) - ID karyawan (contoh: "019b2b20-41d2-7205-8b89-bd5d73f2a7d0")

**Response:**

```json
{
    "meta": {
        "status": 200,
        "message": "Success get employee contract data"
    },
    "data": {
        "summary": {
            "status_kontrak": "aktif",
            "ttd_kontrak_terakhir": "2024-01-15",
            "berakhir_kontrak": "2025-01-15",
            "jenis_kontrak": "PKWT",
            "lama_bekerja": "1 year 11 months before",
            "sisa_kontrak": "Sudah berakhir",
            "kontrak_ke": 3,
            "status_berakhir": "Masih Aktif"
        },
        "contracts": [
            {
                "id": "019b2b50-935d-7233-9566-ec2ff1d66ab3",
                "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
                "contract_number": "1",
                "contract_type": "PKWT",
                "contract_status": "aktif",
                "last_contract_signed_date": "2024-01-15",
                "end_date": "2025-01-15",
                "file_contract": "http://192.168.2.154:8000/storage/contracts/phpE04B.tmp",
                "created_at": "2025-12-17 07:57:39",
                "updated_at": "2025-12-17 07:57:39",
                "deleted_at": null
            },
            {
                "id": "019b2b64-09f0-702c-815a-b56903aa3a8d",
                "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
                "contract_number": "1",
                "contract_type": "PKWT",
                "contract_status": "aktif",
                "last_contract_signed_date": "2024-01-15",
                "end_date": "2025-01-15",
                "file_contract": "http://192.168.2.154:8000/storage/contracts/php56F7.tmp",
                "created_at": "2025-12-17 08:18:55",
                "updated_at": "2025-12-17 08:18:55",
                "deleted_at": null
            },
            {
                "id": "019b2b69-84d0-70c2-96ec-bc5fe7902888",
                "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
                "contract_number": "1",
                "contract_type": "PKWT",
                "contract_status": "aktif",
                "last_contract_signed_date": "2024-01-15",
                "end_date": "2025-01-15",
                "file_contract": "http://192.168.2.154:8000/storage/contracts/f8c5a84d-588d-468b-be52-dcf845bda4fd.pdf",
                "created_at": "2025-12-17 08:24:54",
                "updated_at": "2025-12-17 08:24:54",
                "deleted_at": null
            }
        ]
    }
}
```

---

## Create Kontrak Karyawan

**URL:** `{{base_url}}/api/employee-master-data/employees/{id_employee}/kontrak`  
**Method:** POST  
**Content-Type:** `multipart/form-data`

**Path Parameters:**

- `id_employee` (required) - ID karyawan (contoh: "019b2b20-41d2-7205-8b89-bd5d73f2a7d0")

**Body (form-data):**

- `contract_status` (required) - Status kontrak: 1=Active, 2=Inactive, 3=Probation, 4=Resigned (contoh: "1")
- `last_contract_signed_date` (required) - Tanggal tanda tangan kontrak terakhir, Format: YYYY-MM-DD (contoh: "2024-01-15")
- `end_date` (required) - Tanggal berakhir kontrak, Format: YYYY-MM-DD (contoh: "2025-01-15")
- `contract_type` (required) - Tipe kontrak: 1=PKWT, 2=PKWTT (contoh: "1")
- `contract_number` (required) - Nomor kontrak (contoh: "1")
- `file_contract` (required) (file) - File kontrak dalam format PDF

**Contoh Request:**

```
POST {{base_url}}/api/employee-master-data/employees/019b2b20-41d2-7205-8b89-bd5d73f2a7d0/kontrak
Content-Type: multipart/form-data

contract_status=1
last_contract_signed_date=2024-01-15
end_date=2025-01-15
contract_type=1
contract_number=1
file_contract=@/path/to/contract.pdf
```

**Response:**

```json
{
    "meta": {
        "status": 201,
        "message": "Success create new contract employee"
    },
    "data": {
        "employee_id": "019b2b20-41d2-7205-8b89-bd5d73f2a7d0",
        "contract_status": 1,
        "last_contract_signed_date": "2024-01-15",
        "end_date": "2025-01-15",
        "contract_type": 1,
        "contract_number": "1",
        "file_contract": "EmployeeMasterData/DocumentContract/bc4765e2-351f-405b-a4c3-6a5fa4b6eb67.pdf",
        "id": "019b2f4b-bc11-7376-9814-ac938ca56764",
        "updated_at": "2025-12-18T02:30:51.000000Z",
        "created_at": "2025-12-18T02:30:51.000000Z"
    }
}
```

---