1. Kategori Karyawan

NON-STAFF: 

- hanya tampilkan jabatan kepangkatan yang labelnya : PKL, Internship
- ketika user memilih jabatan kepangkatan  : tampilkan pilihan lengkap Departmen sampai position

MITRA: 

- hanya tampilkan jabatan kepangkatan yang labelnya : Kemitraan
- ketika user memilih jabatan kepangkatan  : tampilkan pilihan lengkap Departmen sampai position

STAFF: 

- hanya tampilkan jabatan kepangkatan yang labelnya : Entry Level, Officer, Principal (Kepala Branch, Associate of Departement), Supervisor (Departemen), Manager (Divisi), Direktur (Direktorat)
- ketika user memilih jabatan kepangkatan  :
    - Entry Level, Officer, tampilkan pilihan lengkap  untuk Departmen sampai position
    - principal hanya bisa Pilih jabatan struktural:
        - Jika Kepala Branch hanya bisa Pilih  : Departmen, divisi, direktorat,unit
        - Jika Associate of Departement hanya bisa Pilih : Departmen, divisi, direktorat
    - Supervisor hanya bisa Pilih : Departmen, divisi, direktorat
    - Manager  hanya bisa Pilih : Divisi, Direktorat
    - Direktur hanya bisa  Pilih :  Direktorat

2. batasi pilihan position tampilkan option sesuai dengan : Jabatan Kepangkatan, direktorat,divisi,departemen, unit yang di pilih :
    - Filters are applied on the client side based on selected criteria:
    - job_title_id (required)
    - structural_job_id (optional)
    - directorate_id (optional)
    - division_id (optional)
    - department_id (optional)
    - unit_id (optional)