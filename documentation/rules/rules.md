1. pisahkan code sesuai fungsi nya untuk membuat code mengikuti prinsip clean architecture 
- components: untuk element reusable
- pages: untuk render ui tanpa harus tau gimana logicnya
- hooks: untuk logic yang di gunakan pada halaman terkait (pastikan semua logic termasuk semua kebutuhan variable ada disini)
- types: untuk mendefinisikan type di typescript
- service: untuk request endpoint ke api
- store: untuk menampung state golbal
- utils: untuk menampung fungsi helper
- selalu check folder parent karena project menggunakan struktur folder yang diibagi per fitur jika di dalam folder parent tidak ada folder yang sesuai maka bisa tambahkan/generatekan folder terlebih dahulu:
## struktur folder:
- components
- hooks
- pages
- services
- stores
- types
- utils

2. selalu gunakan bahasa inggris untuk penulisan fungsi,variable, folder, file
- untuk file selalu menggunakan huruf depan Besar contoh: "AddStaffModals.tsx"
- folder gunakan huruf kecil kalau lebih dari satu kata gunakan '-' contoh : 'structure-and-organize'
- penamaan fungsi selalu gunakan huruf besar di awal contoh : "FormatDate()"
- penamaan fungsi selalu gunakan huruf kecil dan kalau lebih dari satu kata gunakan '_' contoh : staff_status