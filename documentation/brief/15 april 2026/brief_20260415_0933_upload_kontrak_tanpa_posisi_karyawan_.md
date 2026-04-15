# Brief: Upload Kontrak tanpa Posisi Karyawan 
Tanggal: 15 april 2026 09:33

---
Validasi A — Posisi karyawan harus terisi sebelum upload kontrak:
Sistem mengecek apakah field posisi (jabatan & struktural organisasi)
sudah terisi di data karyawan sebelum mengizinkan proses upload kontrak.

Validasi B — Urutan pengecekan (chain validation):

1. Cek apakah data karyawan ada → jika tidak: error 404
2. Cek apakah posisi (jabatan) sudah terisi → jika tidak: error khusus posisi
3. Cek apakah struktural (departemen, bagian, dll) sudah terisi → jika tidak: error khusus struktural
4. Baru izinkan proses upload kontrak

Validasi C — Error tidak boleh generik:
Sistem tidak boleh menampilkan error 500 (Internal Server Error)
untuk kondisi yang seharusnya dapat diantisipasi.
Semua kondisi yang dapat diprediksi harus menghasilkan error yang
informatif dengan HTTP status yang tepat.

### Edge Cases

- Jabatan terisi tapi struktural (departemen/bagian) kosong → error spesifik struktural
- Struktural terisi tapi jabatan kosong → error spesifik jabatan
- File kontrak yang diupload melebihi batas ukuran → error ukuran file
- File kontrak bukan format PDF → error format file
- Koneksi terputus saat upload → error koneksi, bukan 500

###  kondisi ketika submit lalu terdapat error pada api dan pesan yang ditampilkan

- Format file bukan PDF (422): "Format file tidak didukung. Harap unggah dokumen dalam format PDF." 
- Ukuran file melebihi batas (422): "Ukuran file terlalu besar. Maksimal ukuran file yang diizinkan adalah [10] MB."
- Data karyawan tidak ditemukan (404): "Data karyawan tidak ditemukan. Pastikan karyawan sudah terdaftar di sistem."
- Posisi (jabatan) pada data karyawan belum diisi (422): "Belum ada posisi. Lengkapi data jabatan karyawan terlebih dahulu sebelum mengunggah kontrak."
- Gagal upload dokumen (-): "Gagal mengunggah file. Periksa koneksi internet Anda dan coba lagi."
- Error tidak terduga (500): "Terjadi kesalahan pada sistem. Silakan coba beberapa saat lagi atau hubungi tim IT."

###  handling dari front end
- pastikan format file hanya kirim pdf
- pastikan ukuran file tidak lebih dari 10 mb 
- pastikan data karyawan sudah terdaftar di sistem jika belum tampilkan banner error ketika buka modal tambah kontrak "Data karyawan tidak ditemukan. Pastikan karyawan sudah terdaftar di sistem."
- cek di data karyawan src\features\employee\stores\useDetailDataKaryawanPersonalInfo.tsx apakah ada data di bagian Employment_Position_Data? jika tidak ada data di bagian Employment_Position_Data, tampilkan tampilkan banner error ketika buka modal tambah kontrak  "Belum ada posisi. Lengkapi data jabatan karyawan terlebih dahulu sebelum mengunggah kontrak."
- jika tidak ada di bagian directorate_id, division_id, department_id, job_title_id, position_id, tampilkan tampilkan banner error ketika buka modal tambah kontrak  "Belum ada posisi. Lengkapi data jabatan karyawan terlebih dahulu sebelum mengunggah kontrak."


### isi response src\features\employee\stores\useDetailDataKaryawanPersonalInfo.tsx
```json
{
    "meta": {
        "status": 200,
        "message": "Successfully get data"
    },
    "data": {
        "Personal_Data": {
            "avatar": null,
            "id": "DSR035",
            "full_name": "Niko Zoombing",
            "national_id": "42341324124321",
            "email": "Niko@gmail.com",
            "religion_id": "f7f2ceb8-db57-44f5-8823-a16b5c567f1f",
            "religion": "Katholik",
            "blood_type": "A",
            "birth_place": "RUmah Sakit",
            "birth_date": "2004-04-04",
            "last_education_id": "9f9bf1cd-bf55-4c9b-ba85-a7f20b4ba8a8",
            "last_education": "S1\/D4",
            "marital_status": "Tidak Menikah",
            "gender": "Laki-Laki",
            "household_dependents": 0,
            "phone_number": "13212321321312",
            "current_address": "RUmah Sakit",
            "ktp_address": "RUmah Sakit"
        },
        "Education_Data": {
            "employee_id": "DSR035",
            "formal_educations": [
                {
                    "id": "019d8b2f-7dd7-7394-84ff-c464d225a1d1",
                    "education_level_id": "9f9bf1cd-bf55-4c9b-ba85-a7f20b4ba8a8",
                    "education_level": "S1\/D4",
                    "institution_name": "UNJ",
                    "degree": null,
                    "final_grade": 4,
                    "major": null,
                    "graduation_year": 2222,
                    "employee_id": "DSR035"
                }
            ],
            "non_formal_educations": []
        },
        "Social_Media_Data": [
            {
                "id": "019d8b2f-7dd5-732d-90df-fd2e6b3603d4",
                "facebook_name": null,
                "instagram_name": null,
                "linkedin_name": null,
                "twitter_name": null,
                "relative_social_media": "https:\/\/test.com",
                "emergency_contact_number": "245321414124",
                "emergency_contact_name": "adi",
                "emergency_contact_relationship": "ayh",
                "employee_id": "DSR035",
                "deleted_at": null,
                "created_at": "2026-04-14T08:50:38.000000Z",
                "updated_at": "2026-04-14T08:50:38.000000Z"
            }
        ],
        "Employment_Position_Data": {
            "employee_id": "019d8b2f-7dd3-72c3-bbd4-53dd11cd475c",
            "employment_status_id": "c00febcb-19fa-437d-94c9-913439695ee4",
            "employment_status": "Aktif",
            "resignation_status": null,
            "company_id": "019d2906-0810-7118-a06f-a0bafced2975",
            "company_name": "Dasarata",
            "office_id": "019d2909-0eab-7247-a57e-e9c7ceb4f14a",
            "office_name": "Head Office",
            "directorate_id": "019d284a-48ed-7004-af79-0698410a9fff",
            "directorate_name": "Business Development & Governance",
            "division_id": "019d2850-f3ca-72ca-99f5-1d8143d57c26",
            "division_name": "Business Governance & Innovation",
            "department_id": "019d285b-4237-70ee-9211-9cfc57dde2e1",
            "department_name": "Business Quality & Governance",
            "job_title_id": "019d2887-6dc7-7049-ad90-508e3816ca7c",
            "job_title_name": "Non-Staff Internship",
            "grade": "D6",
            "position_id": "019d7b00-134d-739a-b716-9199f7ba92fa",
            "position_name": "Business Intelligence",
            "start_date": null,
            "end_date": null,
            "position_level_id": "5fcbf95e-6eeb-42a1-ad90-a1791c8c39a2",
            "position_level": "General",
            "employee_structural_job_id": "019d2887-6dcd-73bc-9bef-d3b43c9c8d73",
            "employee_structural_job_name": "Internship",
            "unit_id": null,
            "unit_name": null,
            "employee_category_id": "fe8f7b85-8834-41cc-bf3d-8390ad7a5749",
            "employee_category": "Non-Staff",
            "payroll_status": "Aktif",
            "user_access": null
        },
        "Salary_Data": {
            "bank_id": "97ec0f8b-81d2-4282-ad4b-d15951bac7cf",
            "bank_name": "Bank BCA",
            "bank_account_number": "1234567890",
            "bank_account_holder": "niko",
            "npwp": "-",
            "ptkp_id": null,
            "ptkp_code": null,
            "ptkp_category": null
        },
        "BPJS_Data": {
            "employee_id": "DSR035",
            "bpjs_employment_number": null,
            "bpjs_employment_status": "Aktif",
            "bpjs_health_number": null,
            "bpjs_health_status": "Aktif",
            "bpjs_health_type_id": null,
            "bpjs_health_type_name": null
        },
        "Document_Data": [
            {
                "file_type_id": "04ac8044-7a94-4deb-8c75-e330d9249ec5",
                "jenis_file": "Pribadi",
                "file_type": "BPJS Kesehatan",
                "description": "Bukti kepesertaan jaminan kesehatan.",
                "note": null,
                "file": "hris\/employee\/documents\/personal\/BPJS_Kesehatan_DSR035_1776156640.pdf",
                "status": "Sudah Upload"
            },
            {
                "file_type_id": "15bddf6c-5431-4607-a76c-b98ea1df611d",
                "jenis_file": "Pribadi",
                "file_type": "Foto Terbaru",
                "description": "Pas foto terbaru untuk keperluan administrasi.",
                "note": null,
                "file": null,
                "status": "Belum Uplaod"
            },
            {
                "file_type_id": "4c24c7e6-10bf-470b-9a9e-14a6ed713389",
                "jenis_file": "Pribadi",
                "file_type": "Foto KK",
                "description": "Data pendukung identitas dan status keluarga.",
                "note": null,
                "file": null,
                "status": "Belum Uplaod"
            },
            {
                "file_type_id": "5a1f3541-f11e-4810-a23e-db82be47c571",
                "jenis_file": "Pribadi",
                "file_type": "Ijazah Terakhir",
                "description": "Bukti pendidikan terakhir karyawan.",
                "note": null,
                "file": "hris\/employee\/documents\/personal\/Ijazah_Terakhir_DSR035_1776156640.pdf",
                "status": "Sudah Upload"
            },
            {
                "file_type_id": "6a9d9fe1-5793-4193-94b3-dc14f4971cb5",
                "jenis_file": "Pribadi",
                "file_type": "Foto KTP",
                "description": "Identitas resmi karyawan yang masih berlaku.",
                "note": null,
                "file": null,
                "status": "Belum Uplaod"
            },
            {
                "file_type_id": "6d799ef0-1a5b-456b-951c-377a75e4a662",
                "jenis_file": "Pribadi",
                "file_type": "CV \/Surat Keterangan Pengalaman Kerja \/ Paklaring",
                "description": "Riwayat pendidikan dan pengalaman kerja karyawan.",
                "note": null,
                "file": "hris\/employee\/documents\/personal\/CV_Paklaring_DSR035_1776156640.pdf",
                "status": "Sudah Upload"
            },
            {
                "file_type_id": "772c957a-c18b-4898-84f5-708c50987dd3",
                "jenis_file": "Pribadi",
                "file_type": "BPJS Ketenagakerjaan",
                "description": "Bukti kepesertaan jaminan sosial ketenagakerjaan.",
                "note": null,
                "file": "hris\/employee\/documents\/personal\/BPJS_TK_DSR035_1776156640.pdf",
                "status": "Sudah Upload"
            },
            {
                "file_type_id": "98163f68-6e1e-47f2-963e-c09d5f66728b",
                "jenis_file": "Pribadi",
                "file_type": "NPWP",
                "description": "Identitas perpajakan karyawan.",
                "note": null,
                "file": "hris\/employee\/documents\/personal\/NPWP_DSR035_1776156639.pdf",
                "status": "Sudah Upload"
            },
            {
                "file_type_id": "011c135b-6bdc-40e8-aaa9-6eb870113cbc",
                "jenis_file": "Legal",
                "file_type": "Surat Perjanjian Kerja",
                "description": "Surat Perjanjian Kerja antara Perusahaan dan Non Staff yang berisi syarat dan ketentuan kerja.",
                "note": null,
                "file": "hris\/employee\/documents\/personal\/SPK_DSR035_1776156639.pdf",
                "status": "Sudah Upload"
            },
            {
                "file_type_id": "dd2b84b6-c68b-4a81-9345-fc33597cacb3",
                "jenis_file": "Legal",
                "file_type": "Non Disclosure Agreement (Surat Komitmen Kerahasiaan)",
                "description": "Surat Komitmen Kerahasiaan yang berisi perjanjian untuk menjaga kerahasiaan informasi antara Perusahaan dan Non Staff.",
                "note": null,
                "file": "hris\/employee\/documents\/personal\/NDA_DSR035_1776156639.pdf",
                "status": "Sudah Upload"
            }
        ],
        "Latest_Contract": null
    }
}
```
