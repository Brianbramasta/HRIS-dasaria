# FE-HRIS (Frontend) — Project README

## Ringkasan singkat

Ini adalah frontend aplikasi HRIS (Human Resources Information System) berbasis TypeScript + React. Proyek menggunakan Vite sebagai bundler/dev server dan diorganisir dengan pola fitur di dalam folder `src/features`.

Tujuan proyek: menyediakan antarmuka manajemen karyawan, otentikasi, struktur organisasi, dan modul terkait HR lainnya.

## Teknologi utama

- TypeScript
- React
- Vite (dev server & build)
- React Router (routing — lihat `src/routes`)
- Jest (pengujian unit, konfigurasi di `jest.config.mjs`)
- ESLint (linting, konfigurasi di `eslint.config.js`)
- PostCSS (konfigurasi di `postcss.config.js`)
- json-server (mock API / data; terdapat `db.json`, `json-server.json`, dan `server.js`)
- Axios (dipakai untuk panggilan API — lihat `src/services/api.ts`)

Tooling & utilitas:

- Node.js + npm (manajer paket). Periksa `package.json` untuk script yang tersedia.

## Struktur proyek (ringkas)

Struktur utama di root yang relevan:

- `src/` — kode sumber aplikasi React + TypeScript
- `db.json`, `server.js`, `json-server.json`, `routes.json` — konfigurasi mock API
- `vite.config.ts` — konfigurasi Vite
- `jest.config.mjs`, `setupTests.ts` — konfigurasi testing
- `eslint.config.js`, `postcss.config.js` — tooling

## Struktur fitur — `src/features`

Berikut adalah struktur folder `src/features` saat ini dan file penting di dalamnya (berdasarkan lampiran):

- auth/

  - components/
    - `ForgotPasswordForm.tsx`
    - `LoginForm.tsx`
    - `ProtectedOutlet.tsx`
    - `index.ts`
  - config/
    - `rolePermissions.ts`
  - hooks/
    - `useForgotPassword.ts`
    - `useLogin.ts`
    - `__test__/useLogin.test.ts`
    - `index.ts`
  - pages/
    - `AuthPageLayout.tsx`
    - `ForgotPasswordPage.tsx`
    - `LoginPage.tsx`
    - `index.ts`
  - services/
    - `auth.service.ts`
    - `index.ts`
  - stores/
    - `authStore.ts`
  - types/
    - `auth.types.ts`
    - `index.ts`

- dashboard/

  - components/
    - chart/
      - `Demographic.tsx`
      - `EmployeeEngagement.tsx`
      - `EmployeeMetricCard.tsx`
      - `Statistik.tsx`
      - `StatusKepegawaian.tsx`
  - hooks/
  - pages/
    - `Dashboard.tsx`
  - services/
  - types/

- staff/

  - components/
    - `AddKaryawanModal.tsx`
    - `FormProgressBar.tsx`
    - `ResignKaryawanModal.tsx`
    - `SuccessModal.tsx`
    - dataKaryawan/
      - card/
      - modals/
    - FormSteps/
      - `Step1PersonalData.tsx`
      - `Step2EducationalBackground.tsx`
      - `Step3SalaryBpjs.tsx`
      - `Step4UploadDocument.tsx`
  - hooks/
    - `useKaryawan.ts`
    - `usePengunduranDiri.ts`
  - pages/
    - `organizationHistoryPage.tsx`
    - data-karyawan/
      - `FormulirKaryawanPage.tsx`
      - `indexPage.tsx`
      - `PendaftaranKaryawanBaru.tsx`
      - detail/
      - tabs/
    - pengunduran-diri/
      - ... (folder berisi page/komponen terkait)
  - references/
    - `brief.detail.pengundurandiri.md`
    - `brief.formulir.md`
    - `brief.md`
  - services/
    - `karyawanService.ts`
    - `pengunduranDiriService.ts`
  - stores/
    - `useFormulirKaryawanStore.ts`
  - types/
    - `FormulirKaryawan.ts`
    - `Karyawan.ts`
    - `PengunduranDiri.ts`

- structure-and-organize/

  - `index.ts`
  - `README.md` (feature docs)
  - components/
    - `Tabs.tsx`
    - card/
      - `ExpandCard.tsx`
    - datatable/
    - modals/
  - hooks/
    - `useBusinessLines.ts`
    - `useCompanies.ts`
    - `useDepartments.ts`
    - `useDirectorates.ts`
    - `useDivisions.ts`
    - `useEmployeePositions.ts`
    - `useOffices.ts`
    - `useOrganization.ts`
    - `usePositions.ts`
  - pages/
    - `ExportPage.tsx`
    - `List.tsx`
    - `StrukturOrganisasiPage.tsx`
    - Departemen/ Direktorat/ Divisi/ Jabatan/ Kantor/ LiniBisnis/ Perusahaan/ PosisiPegawai/
  - references/
    - `api-contract.md`
    - `brief.md`
  - services/
    - `organization.service.ts`
  - types/
    - `organization.types.ts`
    - `organizationTable.types.ts`

- template/
  - components/
  - hooks/
  - pages/
  - services/
  - types/

> Catatan: beberapa file/folder dinotasikan dengan `...` ketika struktur internalnya panjang atau tidak dilistakan satu-per-satu dalam lampiran.

## Cara menjalankan (singkat)

Perintah berikut bersifat umum untuk proyek Node/Vite. Periksa `package.json` untuk script yang tepat.

1. Pasang dependensi:

```powershell
npm install
```

2. Jalankan aplikasi (dev server):

```powershell
npm run dev
```

3. Jalankan mock API server (project sudah menyertakan `db.json` dan `server.js`):

```powershell
# Jika `server.js` digunakan untuk menjalankan json-server
node server.js
```

4. Jalankan test:

```powershell
npm test
```

Catatan: Jika ada perbedaan script, gunakan nama script yang tersedia di `package.json`.

## Kontrak singkat (inputs / outputs / sukses)

- Input: kode sumber di `src/` + data mock di `db.json`.
- Output: aplikasi web React yang bisa diakses via Vite dev server dan mock API dari `server.js`.
- Sukses: aplikasi berjalan lokal tanpa error build, halaman otentikasi dan modul staff/dashboards dapat dimuat.

## Edge cases & catatan pengembangan

- Pastikan `node` dan `npm` versi modern (node >= 16 direkomendasikan).
- Jika mock server tidak berjalan, jalankan `node server.js` dan periksa file `json-server.json`/`routes.json`.
- Beberapa stores atau hook mungkin bergantung pada library state (periksa imports di `src/stores`).

## Selanjutnya (saran)

## Komposisi struktur folder (penjelasan)

Berikut penjelasan tujuan dan komposisi tiap folder utama di `src/` dan pola yang dipakai di `src/features`.

- `src/features/<feature>/components` — Komponen presentasional dan UI spesifik fitur.

  - Komponen di sini biasanya fokus pada UI (stateless atau menerima props) dan mudah diuji.
  - Jika komponen digunakan lintas fitur, pindahkan ke `src/components` atau `src/common`.

- `src/features/<feature>/pages` — Halaman (route-level) yang merangkai beberapa komponen dan hook.

  - Halaman bertanggung jawab mengatur layout halaman dan memanggil service / store untuk data.

- `src/features/<feature>/hooks` — Custom hooks khusus fitur.

  - Gunakan untuk mengekstrak logika (fetching, form handling, side-effects) yang dapat dipakai ulang dalam fitur yang sama.

- `src/features/<feature>/services` — Abstraksi panggilan API dan fungsi terkait remote data.

  - Semua panggilan HTTP idealnya melalui `src/services/api.ts` (atau wrapper axios) untuk konfigurasi terpusat (baseURL, interceptor, auth token).

- `src/features/<feature>/stores` — State lokal fitur (Zustand, Redux slice, atau store custom).

  - Store menyimpan state persist / cache yang terkait fitur. Hindari menyimpan UI-only state yang lebih cocok di komponen.

- `src/features/<feature>/types` — Definisi TypeScript (interface / type) yang spesifik fitur.

  - Memisahkan tipe memudahkan reuse dan menjaga tipe domain terpusat.

- `src/features/<feature>/references` — Dokumen terkait fitur (brief, kontrak API, catatan bisnis).

- `src/features/<feature>/__test__` atau `*.test.tsx` — Unit / hook tests berdekatan dengan kode yang diuji.

Konvensi dan best-practices yang dianjurkan

- Penamaan: file komponen UI gunakan PascalCase (MyButton.tsx), hook gunakan camelCase diawali use (useFetchUsers.ts), service dan util gunakan camelCase (auth.service.ts).
- Barrel exports: tambahkan `index.ts` pada subfolder untuk mengekspor simbol penting (mis. `components/index.ts`) sehingga import di tempat lain menjadi `import { LoginForm } from 'features/auth/components'`.
- Co-location: letakkan file test, styles, dan sub-komponen dekat dengan komponen utama agar mudah navigasi.
- Pemisahan tanggung jawab: Pages (routing + layout) vs Components (UI) vs Services (API) vs Stores (state).
- Atomic / compositional components: pecah komponen besar menjadi bagian kecil (atom → molecule → organism) bila perlu.
- Forms & steps: untuk alur multi-step (contoh `FormSteps`), gunakan folder `FormSteps` berisi komponen step + hook/formik logic + progress bar terpisah.
- Modals & Overlays: kelompokkan modal di `components/modals` dalam fitur; bisa juga dikelola via store/global modal jika digunakan lintas fitur.

Penempatan resource lintas fitur

- `src/components` atau `src/common` — Komponen yang dapat dipakai ulang di banyak fitur (header, button, card, layout primitives).
- `src/layout` — Komponen layout aplikasi (sidebar, header, app shell).
- `src/context` — Context providers (theme, sidebar) yang digunakan pada level aplikasi.
- `src/services` — Kode utilitas HTTP, konfigurasi axios, dan helper API global.
- `src/stores` — Stores global (loading, notifications, authentication) yang diakses banyak fitur.

Contoh alur kerja pengembangan fitur

1. Buat folder feature baru: `src/features/<feature>`.
2. Tambahkan `pages/`, `components/`, `services/`, `hooks/`, `types/` minimal.
3. Implementasikan service API di `services/` dan hubungkan ke `src/services/api.ts`.
4. Buat pages yang merakit komponen, lalu sambungkan route di `src/routes/AppRoutes.tsx`.
5. Tambahkan unit test untuk hook / service minimal.
6. Update `features/<feature>/README.md` singkat berisi contract / cara test.

Dengan pola ini, setiap fitur menjadi self-contained dan mudah dipindahkan atau di-decompose tanpa memengaruhi fitur lain.

---

Saya sudah menambahkan penjelasan ini ke `README.md`. Langkah berikutnya: saya bisa menjalankan pengecekan cepat (baca file lagi atau menambahkan README per-feature). Mau saya lanjut ke verifikasi atau buat README khusus untuk salah satu fitur (mis. `staff`)?

- Menambahkan skrip `mock` di `package.json` yang menjalankan `node server.js`.
- Membuat file README per-feature (mis. `src/features/staff/README.md`) yang menjelaskan alur dan API.

Sampaikan mana yang mau saya kerjakan selanjutnya.
