# Brief: penguduran diri - rule tanggal efektif
Tanggal: 25 april 2026 07:25

---

### Description

di pengunduran diri 
src\features\employee\pages\resignation\detail\DetailResignationPage.tsx (di popup src\features\employee\components\modals\resignation\EffectiveResignationDateModal.tsx)
dan terminasi administrasi src\features\employee\pages\resignation\tab\TerminationAdministrationPage.tsx (di pop up src\features\employee\components\modals\termination\AddUserTermination.tsx)


HR bisa menentukan **effective date berakhir kontrak** **hanya berdasarkan tanggal kontrak berakhir (tidak boleh melebihi)**

tanggal kontrak berakhir di ambil dari tanggal akhir kontrak (belum ada di api, jadi buatkan dummy data untuk sementara nanti tinggal ubah ke api kalau apinya sudah jadi)

Case : 

- tanggal berakhir kontrak 1 mei, tapi tanggal effective bisa di 1 juni ini akan muncul validasi error di hint inputan
- berikan informasi di bawah inputan kapan tanggal berakhir kontraknya