# Kontrak API – Informasi Pribadi Karyawan (Detail)

Dokumen ini merinci kontrak API untuk fitur `Informasi Pribadi` dalam halaman Detail Karyawan. Setiap operasi dapat mengelola data personal, pendidikan, media sosial, dan informasi gaji. Diselaraskan dengan Postman collection yang tersedia.

## Konvensi Umum

- **Header auth**: `Authorization: Bearer <token>` untuk semua endpoint yang memodifikasi data.
- **Method**: Menggunakan `POST` dengan field `_method: PATCH` karena backend menggunakan method spoofing.
- **Content-Type**: `multipart/form-data` untuk form data dan file uploads.
- **Response error**: `{ errorCode: string, message: string, details?: any }`.

---

## Halaman: Informasi Pribadi Detail

### Get Data Informasi Pribadi

**Endpoint**: `GET /api/employee-master-data/employees/{employeeId}/data-personal`

**Path Parameters**:
- `employeeId` (string, required) – ID karyawan (contoh: `DSR011`)

**Response** (200 OK):
```json
{
  "data": {
    "personal": {
      "full_name": "string",
      "national_id": "string | null",
      "birth_place": "string | null",
      "birth_date": "string | null (ISO date format)",
      "religion_id": "string | null",
      "email": "string | null",
      "gender": "string | null (M/F)",
      "phone_number": "string | null",
      "blood_type": "string | null",
      "last_education_id": "string | null",
      "marital_status": "string | null",
      "household_dependents": "number | null",
      "avatar": "string | null (file path/URL)",
      "current_address": "string | null",
      "ktp_address": "string | null"
    },
    "education_formal": [
      {
        "id": "string (UUID)",
        "education_level_id": "string",
        "institution_name": "string",
        "degree": "string",
        "final_grade": "string | number",
        "major": "string",
        "graduation_year": "string | number"
      }
    ],
    "education_non_formal": [
      {
        "id": "string (UUID)",
        "certificate_name": "string",
        "institution_name": "string",
        "start_date": "string (ISO date format)",
        "end_date": "string (ISO date format)",
        "certificate_id": "string",
        "certificate_file": "string | null (file path/URL)"
      }
    ],
    "social_media": {
      "facebook_name": "string | null",
      "instagram_name": "string | null",
      "linkedin_name": "string | null",
      "twitter_name": "string | null",
      "relative_social_media": "string | null",
      "emergency_contact_number": "string | null",
      "emergency_contact_name": "string | null",
      "emergency_contact_relationship": "string | null"
    },
    "salary": {
      "bank_account_number": "string | null",
      "bank_account_holder": "string | null",
      "bank_id": "string | null",
      "npwp": "string | null",
      "ptkp_id": "string | null"
    }
  }
}
```

---

## Operasi CRUD – Informasi Pribadi

### Update Data Pribadi

**Endpoint**: `POST /api/employee-master-data/employees/{employeeId}/update-personal-data`

**Method Spoofing**: Gunakan field `_method: PATCH` dalam form data.

**Path Parameters**:
- `employeeId` (string, required) – ID karyawan

**Request Body** (form-data):
- `_method` (text, required) – nilai: `PATCH`
- `full_name` (text, optional) – nama lengkap
- `national_id` (text, optional) – nomor KTP
- `birth_place` (text, optional) – tempat lahir
- `birth_date` (text, optional) – tanggal lahir (format ISO: `YYYY-MM-DD`)
- `religion_id` (text, optional) – ID agama
- `email` (text, optional) – email
- `gender` (text, optional) – jenis kelamin (`M` | `F`)
- `phone_number` (text, optional) – nomor telepon
- `blood_type` (text, optional) – golongan darah
- `last_education_id` (text, optional) – ID pendidikan terakhir
- `marital_status` (text, optional) – status pernikahan
- `household_dependents` (text, optional) – jumlah tanggungan keluarga
- `avatar` (file, optional) – file gambar profil
- `current_address` (text, optional) – alamat domisili saat ini
- `ktp_address` (text, optional) – alamat sesuai KTP

**Response** (200 OK):
```json
{
  "data": {
    "id": "string (UUID)",
    "full_name": "string",
    "email": "string | null",
    "national_id": "string | null",
    "birth_place": "string | null",
    "birth_date": "string | null",
    "gender": "string | null",
    "phone_number": "string | null",
    "blood_type": "string | null",
    "marital_status": "string | null",
    "household_dependents": "number | null",
    "avatar": "string | null"
  }
}
```

**Status**: `200 OK`

---

## Operasi CRUD – Pendidikan Formal dan Non-Formal

### Update Data Pendidikan

**Endpoint**: `POST /api/employee-master-data/employees/{employeeId}/update-education-data`

**Method Spoofing**: Gunakan field `_method: PATCH` dalam form data.

**Path Parameters**:
- `employeeId` (string, required) – ID karyawan

**Request Body** (form-data):

#### Pendidikan Formal (dapat multiple, gunakan index array):
- `_method` (text, required) – nilai: `PATCH`
- `education_formal_detail[{index}][id]` (text, optional) – ID record (untuk update existing)
- `education_formal_detail[{index}][education_level_id]` (text, optional) – ID tingkat pendidikan
- `education_formal_detail[{index}][institution_name]` (text, optional) – nama institusi
- `education_formal_detail[{index}][degree]` (text, optional) – gelar/jurusan
- `education_formal_detail[{index}][final_grade]` (text, optional) – nilai akhir
- `education_formal_detail[{index}][major]` (text, optional) – keahlian/jurusan
- `education_formal_detail[{index}][graduation_year]` (text, optional) – tahun lulus

#### Pendidikan Non-Formal (dapat multiple, gunakan index array):
- `non_formal_education[{index}][id]` (text, optional) – ID record (untuk update existing)
- `non_formal_education[{index}][certificate_name]` (text, optional) – nama sertifikat
- `non_formal_education[{index}][institution_name]` (text, optional) – nama institusi/tempat training
- `non_formal_education[{index}][start_date]` (text, optional) – tanggal mulai (format ISO: `YYYY-MM-DD`)
- `non_formal_education[{index}][end_date]` (text, optional) – tanggal selesai (format ISO: `YYYY-MM-DD`)
- `non_formal_education[{index}][certificate_id]` (text, optional) – nomor/ID sertifikat
- `non_formal_education[{index}][certificate_file]` (file, optional) – file sertifikat

**Response** (200 OK):
```json
{
  "data": {
    "education_formal": [
      {
        "id": "string (UUID)",
        "education_level_id": "string",
        "institution_name": "string",
        "degree": "string",
        "final_grade": "string | number",
        "major": "string",
        "graduation_year": "string | number"
      }
    ],
    "education_non_formal": [
      {
        "id": "string (UUID)",
        "certificate_name": "string",
        "institution_name": "string",
        "start_date": "string (ISO date)",
        "end_date": "string (ISO date)",
        "certificate_id": "string",
        "certificate_file": "string | null"
      }
    ]
  }
}
```

**Status**: `200 OK`

---

## Operasi CRUD – Media Sosial & Kontak Darurat

### Update Data Media Sosial

**Endpoint**: `POST /api/employee-master-data/employees/{employeeId}/update-social-media-data`

**Method Spoofing**: Gunakan field `_method: PATCH` dalam form data.

**Path Parameters**:
- `employeeId` (string, required) – ID karyawan

**Request Body** (form-data):
- `_method` (text, required) – nilai: `PATCH`
- `facebook_name` (text, optional) – nama akun Facebook
- `instagram_name` (text, optional) – nama akun Instagram
- `linkedin_name` (text, optional) – nama akun LinkedIn
- `twitter_name` (text, optional) – nama akun Twitter / X
- `relative_social_media` (text, optional) – media sosial keluarga/kerabat
- `emergency_contact_number` (text, optional) – nomor kontak darurat
- `emergency_contact_name` (text, optional) – nama kontak darurat
- `emergency_contact_relationship` (text, optional) – hubungan kontak darurat

**Response** (200 OK):
```json
{
  "data": {
    "facebook_name": "string | null",
    "instagram_name": "string | null",
    "linkedin_name": "string | null",
    "twitter_name": "string | null",
    "relative_social_media": "string | null",
    "emergency_contact_number": "string | null",
    "emergency_contact_name": "string | null",
    "emergency_contact_relationship": "string | null"
  }
}
```

**Status**: `200 OK`

---

## Operasi CRUD – Informasi Gaji & Perpajakan

### Update Data Gaji

**Endpoint**: `POST /api/employee-master-data/employees/{employeeId}/update-salary-data`

**Method Spoofing**: Gunakan field `_method: PATCH` dalam form data.

**Path Parameters**:
- `employeeId` (string, required) – ID karyawan

**Request Body** (form-data):
- `_method` (text, required) – nilai: `PATCH`
- `bank_account_number` (text, optional) – nomor rekening bank
- `bank_account_holder` (text, optional) – nama pemilik rekening
- `bank_id` (text, optional) – ID bank (UUID)
- `npwp` (text, optional) – nomor NPWP
- `ptkp_id` (text, optional) – ID PTKP status (UUID)

**Response** (200 OK):
```json
{
  "data": {
    "bank_account_number": "string | null",
    "bank_account_holder": "string | null",
    "bank_id": "string | null",
    "npwp": "string | null",
    "ptkp_id": "string | null"
  }
}
```

**Status**: `200 OK`

---

## Contoh Request cURL

### Get Data Informasi Pribadi
```bash
curl -X GET \
  "http://localhost:3000/api/employee-master-data/employees/DSR011/data-personal" \
  -H "Authorization: Bearer <token>"
```

### Update Data Pribadi
```bash
curl -X POST \
  "http://localhost:3000/api/employee-master-data/employees/DSR011/update-personal-data" \
  -H "Authorization: Bearer <token>" \
  -F "_method=PATCH" \
  -F "full_name=John Doe" \
  -F "national_id=1234567890123456" \
  -F "birth_date=1990-05-15" \
  -F "gender=M" \
  -F "phone_number=081234567890" \
  -F "email=john.doe@example.com"
```

### Update Data Pendidikan
```bash
curl -X POST \
  "http://localhost:3000/api/employee-master-data/employees/DSR011/update-education-data" \
  -H "Authorization: Bearer <token>" \
  -F "_method=PATCH" \
  -F "education_formal_detail[0][education_level_id]=06840e2a-cb39-461d-85a6-977b56fcb9c9" \
  -F "education_formal_detail[0][institution_name]=Universitas ABC" \
  -F "education_formal_detail[0][degree]=S1" \
  -F "education_formal_detail[0][major]=Teknologi Informasi" \
  -F "education_formal_detail[0][final_grade]=3.8" \
  -F "education_formal_detail[0][graduation_year]=2020" \
  -F "non_formal_education[0][certificate_name]=Sertifikat AWS" \
  -F "non_formal_education[0][institution_name]=AWS Training Center" \
  -F "non_formal_education[0][start_date]=2023-01-15" \
  -F "non_formal_education[0][end_date]=2023-02-15"
```

### Update Data Media Sosial
```bash
curl -X POST \
  "http://localhost:3000/api/employee-master-data/employees/DSR011/update-social-media-data" \
  -H "Authorization: Bearer <token>" \
  -F "_method=PATCH" \
  -F "facebook_name=john.doe" \
  -F "linkedin_name=johndoe" \
  -F "instagram_name=john_doe" \
  -F "emergency_contact_name=Jane Doe" \
  -F "emergency_contact_number=081234567891" \
  -F "emergency_contact_relationship=Istri"
```

### Update Data Gaji
```bash
curl -X POST \
  "http://localhost:3000/api/employee-master-data/employees/DSR011/update-salary-data" \
  -H "Authorization: Bearer <token>" \
  -F "_method=PATCH" \
  -F "bank_account_number=1234567890" \
  -F "bank_account_holder=John Doe" \
  -F "bank_id=2dadc10c-e891-4b93-b400-4c8ef32aaff7" \
  -F "npwp=12345678901234" \
  -F "ptkp_id=205ff4d2-71a9-4a97-8287-87d5f34b1fa7"
```

---

## Catatan Implementasi

- **Method Spoofing**: Backend menggunakan `_method` field untuk override HTTP method, sehingga gunakan `POST` dengan `_method=PATCH`.
- **Multiple Education Records**: Untuk input multiple pendidikan formal atau non-formal, gunakan array index notation (contoh: `education_formal_detail[0]`, `education_formal_detail[1]`, dst).
- **File Upload**: Field `avatar`, `certificate_file`, dan field file lainnya dikirim sebagai `multipart/form-data`.
- **ID Persistence**: Untuk update existing education record, sertakan field `id` pada masing-masing array element.
- **Date Format**: Gunakan format ISO `YYYY-MM-DD` untuk semua field tanggal.
- **Optional Fields**: Semua field request body bersifat opsional; kirim hanya field yang akan diupdate.
