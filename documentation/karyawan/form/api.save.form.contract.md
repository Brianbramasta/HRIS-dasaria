# Kontrak API – Menyimpan Data Karyawan

Dokumen ini merinci kontrak API untuk fitur `Menyimpan Data Karyawan`.

## Konvensi Umum

- Header auth: `Authorization: Bearer <token>`
- Content-Type: `multipart/form-data`

---

## Endpoint: Store Employee

**Method**: `POST`  
**URL**: `{{base_url}}/api/employee-master-data/employees/store`

### Request Body (Form-Data)

#### Data Pribadi
- `full_name` (text, required) - Nama Lengkap
- `national_id` (text, required) - NIK / KTP
- `email` (text, required) - Email
- `religion_id` (text) - ID Agama (1 = islam, 2 = protestant, 3 = catholic, 4 = hindu, 5 = buddhist, 6 = confucianism)
- `blood_type` (text) - Golongan Darah
- `birth_place` (text) - Tempat Lahir
- `birth_date` (text) - Tanggal Lahir (Format: YYYY-MM-DD)
- `last_education_id` (text) - ID Pendidikan Terakhir (1 = sd, 2 = smp, 3 = sma, 4 = d1, 5 = d2, 6 = d3, 7 = s1, 8 = s2, 9 = s3)
- `marital_status` (text) - Status Pernikahan (1 = single, 2 = married)
- `gender` (text) - Jenis Kelamin (1 = male, 2 = female)
- `household_dependents` (text) - Jumlah Tanggungan
- `phone_number` (text) - Nomor Telepon

#### Alamat & Domisili
- `current_address` (text) - Alamat Domisili
- `ktp_address` (text) - Alamat KTP

#### Informasi Bank & Pajak
- `bank_id` (text) - ID Bank
- `bank_account_number` (text) - Nomor Rekening
- `bank_name` (text) - Nama Bank (Legacy field, mungkin digantikan bank_id)
- `bank_account_holder` (text) - Nama Pemilik Rekening
- `npwp` (text) - NPWP
- `ptkp_id` (text) - ID PTKP

#### BPJS & Ketenagakerjaan
- `bpjs_employment_number` (text) - Nomor BPJS Ketenagakerjaan
- `bpjs_employment_status` (text) - Status BPJS TK (1 = active, 2 = inactive)
- `bpjs_health_number` (text) - Nomor BPJS Kesehatan
- `bpjs_health_status` (text) - Status BPJS Kesehatan (1 = active, 2 = inactive)
- `employment_status_id` (text) - ID Status Karyawan (1=active, 2=inactive, 3=probation, 4=resigned)
- `resignation_status` (text, optional) - Status Resign (disabled di postman)

#### Data Pekerjaan & Struktur Organisasi
- `company_id` (text) - ID Perusahaan
- `office_id` (text) - ID Kantor
- `directorate_id` (text) - ID Direktorat
- `division_id` (text) - ID Divisi
- `department_id` (text) - ID Departemen
- `position_id` (text) - ID Posisi
- `job_title_id` (text) - ID Job Title
- `structural_job_id` (text) - ID Jabatan Struktural
- `unit_id` (text, optional) - ID Unit (disabled di postman)
- `start_date` (text) - Tanggal Mulai Bekerja (Format: YYYY-MM-DD)
- `end_date` (text) - Tanggal Selesai Bekerja (Format: YYYY-MM-DD)
- `position_level_id` (text) - Level Posisi (1: General, 2: Junior, 3: Middle, 4: Senior)
- `payroll_status` (text) - Status Payroll (1: Active, 2: Inactive, 3: Suspended)
- `employee_category_id` (text) - Kategori Karyawan (1: Non-Staff, 2: Staff, 3: Partner)

#### Dokumen Karyawan (Array)
- `documents` (array)
    - `documents[x][employee_document_id]` (text) - ID Jenis Dokumen (Lihat deskripsi di postman untuk mapping ID)
    - `documents[x][file]` (file) - File Dokumen

#### Pendidikan Formal (Array)
- `education_formal_detail` (array)
    - `education_formal_detail[x][education_level_id]` (text) - ID Jenjang Pendidikan
    - `education_formal_detail[x][institution_name]` (text) - Nama Institusi
    - `education_formal_detail[x][degree]` (text) - Gelar
    - `education_formal_detail[x][final_grade]` (text) - Nilai Akhir / IPK
    - `education_formal_detail[x][major]` (text) - Jurusan
    - `education_formal_detail[x][graduation_year]` (text) - Tahun Lulus

#### Pendidikan Non-Formal (Array)
- `non_formal_education` (array)
    - `non_formal_education[x][certificate_name]` (text) - Nama Sertifikat
    - `non_formal_education[x][institution_name]` (text) - Nama Institusi
    - `non_formal_education[x][start_date]` (text) - Tanggal Mulai
    - `non_formal_education[x][end_date]` (text) - Tanggal Selesai
    - `non_formal_education[x][certificate_id]` (text) - ID Sertifikat
    - `non_formal_education[x][certificate_file]` (file) - File Sertifikat

#### Media Sosial
- `facebook_name` (text)
- `instagram_name` (text)
- `linkedin_name` (text)
- `twitter_name` (text)
- `relative_social_media` (text) - Keterangan lain

#### Kontak Darurat
- `emergency_contact_name` (text) - Nama Kontak Darurat
- `emergency_contact_number` (text) - Nomor Telepon Darurat
- `emergency_contact_relationship` (text) - Hubungan

#### Tunjangan Tidak Tetap (Array)
- `non_fix_allowance` (array)
    - `non_fix_allowance[x][non_fix_allowance_id]` (text) - ID Tunjangan
    - `non_fix_allowance[x][amount]` (text) - Jumlah Tunjangan

#### Lain-lain
- `avatar` (file) - Foto Profil
