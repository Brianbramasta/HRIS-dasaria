# Brief: perbaikan value di table untuk value yang kosong 
Tanggal: 22 april 2026 15:57

---

## Deskripsi Tugas
Modifikasi komponen `src\components\shared\datatable\DataTable.tsx` agar semua nilai kolom yang kosong secara otomatis ditampilkan dengan tanda hubung ('-'), kecuali kolom 'Aksi'.

## Lokasi File
- **File utama**: `src\components\shared\datatable\DataTable.tsx`
- **Contoh implementasi**: `src\features\employee\pages\contract-renewal\contract-renewal-hr\ContractRenewalPage.tsx`

## Detail Persyaratan
1. **Auto-replace empty values**: Semua kolom dengan nilai kosong (null, undefined, empty string) harus otomatis menampilkan '-'
2. **Exception**: Kolom 'Aksi' tidak terpengaruh oleh perubahan ini
3. **Scope**: Berlaku untuk semua penggunaan DataTable di seluruh aplikasi
4. **Render logic**: Modifikasi bagian render cell data pada baris 415-426

## Implementasi
Pada fungsi render kolom di dalam `displayColumns.map()`, tambahkan validasi:
```typescript
// Saat menampilkan nilai kolom
{column.id === 'no'
  ? (index + 1)
  : column.format
    ? column.format(row[column.id as keyof T], row)
    : (row[column.id as keyof T] as React.ReactNode) || '-'}
```

## Testing
Verifikasi pada halaman ContractRenewalPage bahwa semua kolom kosong menampilkan '-' kecuali kolom Aksi yang tetap menampilkan tombol aksi.

## Catatan
- Pastikan tidak mengganggu fungsi existing seperti sorting, filtering, dan formatting
- Kolom dengan custom format function harus tetap berfungsi normal