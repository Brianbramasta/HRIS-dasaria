import { matchPath } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface RouteConfig {
  title: string;
  breadcrumbs: (params: any) => BreadcrumbItem[];
}

// Konfigurasi mapping route ke breadcrumb
// Kunci adalah pattern path yang digunakan di React Router
export const breadcrumbRoutes: Record<string, RouteConfig> = {
  // Dashboard
  '/dashboard': {
    title: 'Dashboard',
    breadcrumbs: () => [
      { label: 'Dashboard' }
    ]
  },
  '/dashboard/notification': {
    title: 'Notifikasi',
    breadcrumbs: () => [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Notifikasi' }
    ]
  },

  // Role Management
  '/role-management-access': {
    title: 'Akses Akun',
    breadcrumbs: () => [
      { label: 'Akses Akun' }
    ]
  },
  '/role-management-access/edit/:roleId': {
    title: 'Edit Role',
    breadcrumbs: () => [
      { label: 'Akses Akun', path: '/role-management-access' },
      { label: 'Edit Role' }
    ]
  },
  '/role-management-access/detail/:roleId': {
    title: 'Detail Role',
    breadcrumbs: () => [
      { label: 'Akses Akun', path: '/role-management-access' },
      { label: 'Detail Role' }
    ]
  },
  '/role-management-access/service-detail/:layananId': {
    title: 'Detail Modul',
    breadcrumbs: () => [
      { label: 'Akses Akun', path: '/role-management-access' },
      { label: 'Detail Modul' }
    ]
  },
  '/role-management-access/feature-detail/:modulId': {
    title: 'Detail Fitur',
    breadcrumbs: () => [
      { label: 'Akses Akun', path: '/role-management-access' },
      { label: 'Detail Fitur' }
    ]
  },

  // Employee Data
  '/employee-data': {
    title: 'Data Karyawan',
    breadcrumbs: () => [
      { label: 'Data Karyawan' }
    ]
  },
  '/employee-data/pendaftaran': {
    title: 'Pendaftaran Karyawan Baru',
    breadcrumbs: () => [
      { label: 'Data Karyawan', path: '/employee-data' },
      { label: 'Pendaftaran Baru' }
    ]
  },
  '/employee-data/form': {
    title: 'Formulir Karyawan',
    breadcrumbs: () => [
      { label: 'Data Karyawan', path: '/employee-data' },
      { label: 'Formulir' }
    ]
  },
  '/employee-data/contract-extension': {
     title: 'Perpanjangan Kontrak',
     breadcrumbs: () => [
       { label: 'Data Karyawan', path: '/employee-data' },
       { label: 'Perpanjangan Kontrak' }
     ]
  },
  '/employee-data/:id': {
    title: 'Detail Karyawan',
    breadcrumbs: () => [
      { label: 'Data Karyawan', path: '/employee-data' },
      { label: 'Detail Karyawan' }
    ]
  },
  '/employee-data/:id/pelanggaran': {
    title: 'Pelanggaran Karyawan',
    breadcrumbs: (params) => [
      { label: 'Data Karyawan', path: '/employee-data' },
      { label: 'Detail Karyawan', path: `/employee-data/${params.id}` },
      { label: 'Pelanggaran' }
    ]
  },

  // Structure & Organize
  '/structure-and-organize': {
    title: 'Struktur & Organisasi',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi' }
    ]
  },
  '/structure-and-organize/business-lines': {
    title: 'Lini Bisnis',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Lini Bisnis' }
    ]
  },
  '/structure-and-organize/business-lines/:id': {
    title: 'Detail Lini Bisnis',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Lini Bisnis', path: '/structure-and-organize/business-lines' },
      { label: 'Detail' }
    ]
  },
  '/structure-and-organize/companies': {
    title: 'Perusahaan',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Perusahaan' }
    ]
  },
  '/structure-and-organize/companies/:id': {
    title: 'Detail Perusahaan',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Perusahaan', path: '/structure-and-organize/companies' },
      { label: 'Detail' }
    ]
  },
  '/structure-and-organize/offices': {
    title: 'Kantor',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Kantor' }
    ]
  },
  '/structure-and-organize/directorates': {
    title: 'Direktorat',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Direktorat' }
    ]
  },
  '/structure-and-organize/divisions': {
    title: 'Divisi',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Divisi' }
    ]
  },
  '/structure-and-organize/departments': {
    title: 'Departemen',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Departemen' }
    ]
  },
  '/structure-and-organize/units': {
    title: 'Unit',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Unit' }
    ]
  },
  '/structure-and-organize/positions': {
    title: 'Jabatan',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Jabatan' }
    ]
  },
  '/structure-and-organize/employee-positions': {
    title: 'Posisi Karyawan',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Posisi Karyawan' }
    ]
  },

  // Payroll Configuration
  '/payroll-configuration': {
    title: 'Konfigurasi Penggajian',
    breadcrumbs: () => [
      { label: 'Konfigurasi Penggajian' }
    ]
  },
  '/payroll-configuration/compensation': {
    title: 'Kompensasi',
    breadcrumbs: () => [
      { label: 'Konfigurasi Penggajian', path: '/payroll-configuration' },
      { label: 'Kompensasi' }
    ]
  },
  '/payroll-configuration/bpjs': {
    title: 'BPJS',
    breadcrumbs: () => [
      { label: 'Konfigurasi Penggajian', path: '/payroll-configuration' },
      { label: 'BPJS' }
    ]
  },
  '/payroll-configuration/deduction-reference': {
    title: 'Acuan Potongan',
    breadcrumbs: () => [
      { label: 'Konfigurasi Penggajian', path: '/payroll-configuration' },
      { label: 'Acuan Potongan' }
    ]
  },
  '/payroll-configuration/fixed-allowance': {
    title: 'Tunjangan Tetap',
    breadcrumbs: () => [
      { label: 'Konfigurasi Penggajian', path: '/payroll-configuration' },
      { label: 'Tunjangan Tetap' }
    ]
  },
  '/payroll-configuration/non-recurring-allowance': {
    title: 'Tunjangan Tidak Tetap',
    breadcrumbs: () => [
      { label: 'Konfigurasi Penggajian', path: '/payroll-configuration' },
      { label: 'Tunjangan Tidak Tetap' }
    ]
  },
  '/payroll-configuration/non-recurring-deduction': {
    title: 'Potongan Tidak Tetap',
    breadcrumbs: () => [
      { label: 'Konfigurasi Penggajian', path: '/payroll-configuration' },
      { label: 'Potongan Tidak Tetap' }
    ]
  },
  '/payroll-configuration/thr': {
    title: 'THR',
    breadcrumbs: () => [
      { label: 'Konfigurasi Penggajian', path: '/payroll-configuration' },
      { label: 'THR' }
    ]
  },

  // Payroll Period
  '/payroll-period': {
    title: 'Periode Penggajian',
    breadcrumbs: () => [
      { label: 'Periode Penggajian' }
    ]
  },
  '/payroll-period/non-ae': {
    title: 'Periode Penggajian (Non AE)',
    breadcrumbs: () => [
      { label: 'Periode Penggajian', path: '/payroll-period' },
      { label: 'Non AE' }
    ]
  },
  '/payroll-period/ae': {
    title: 'Periode Penggajian (AE)',
    breadcrumbs: () => [
      { label: 'Periode Penggajian', path: '/payroll-period' },
      { label: 'AE' }
    ]
  },
  '/payroll-period/internship': {
    title: 'Periode Penggajian (PKL)',
    breadcrumbs: () => [
      { label: 'Periode Penggajian', path: '/payroll-period' },
      { label: 'PKL' }
    ]
  },
  '/payroll-period/holiday-allowance': {
    title: 'Periode Penggajian (THR)',
    breadcrumbs: () => [
      { label: 'Periode Penggajian', path: '/payroll-period' },
      { label: 'THR' }
    ]
  },
  '/payroll-period/detail-ae/:id': {
    title: 'Detail Gaji AE',
    breadcrumbs: () => [
      { label: 'Periode Penggajian', path: '/payroll-period' },
      { label: 'Detail AE' }
    ]
  },
  '/payroll-period/detail-non-ae/:id': {
    title: 'Detail Gaji Non AE',
    breadcrumbs: () => [
      { label: 'Periode Penggajian', path: '/payroll-period' },
      { label: 'Detail Non AE' }
    ]
  },
  '/payroll-period/detail-thr/:id': {
    title: 'Detail Gaji THR',
    breadcrumbs: () => [
      { label: 'Periode Penggajian', path: '/payroll-period' },
      { label: 'Detail THR' }
    ]
  },
  '/payroll-period/detail-pkl/:id': {
    title: 'Detail Gaji PKL',
    breadcrumbs: () => [
      { label: 'Periode Penggajian', path: '/payroll-period' },
      { label: 'Detail PKL' }
    ]
  },

  // Cash Advance
  '/cash-advance': {
    title: 'Kasbon',
    breadcrumbs: () => [
      { label: 'Kasbon' }
    ]
  },
  '/cash-advance/submission-history': {
    title: 'Riwayat Pengajuan Kasbon',
    breadcrumbs: () => [
      { label: 'Kasbon', path: '/cash-advance' },
      { label: 'Riwayat Pengajuan' }
    ]
  },
  '/cash-advance/cash-advance-status': {
    title: 'Status Kasbon',
    breadcrumbs: () => [
      { label: 'Kasbon', path: '/cash-advance' },
      { label: 'Status' }
    ]
  },
  '/cash-advance/approval': {
    title: 'Approval Kasbon',
    breadcrumbs: () => [
      { label: 'Kasbon', path: '/cash-advance' },
      { label: 'Approval' }
    ]
  },
  '/cash-advance/cash-advance-form': {
    title: 'Formulir Kasbon',
    breadcrumbs: () => [
      { label: 'Kasbon', path: '/cash-advance' },
      { label: 'Formulir' }
    ]
  },
  '/cash-advance/detail/:id': {
    title: 'Detail Kasbon',
    breadcrumbs: () => [
      { label: 'Kasbon', path: '/cash-advance' },
      { label: 'Detail' }
    ]
  },

  // Payroll Dashboard
  '/payroll-dashboard': {
    title: 'Dashboard Penggajian',
    breadcrumbs: () => [
      { label: 'Dashboard Penggajian' }
    ]
  },

  // Payroll Period Approval
  '/payroll-period-approval': {
    title: 'Approval Periode Gaji',
    breadcrumbs: () => [
      { label: 'Approval Periode Gaji' }
    ]
  },
  '/payroll-period-approval/non-ae': {
    title: 'Approval Gaji Non AE',
    breadcrumbs: () => [
      { label: 'Approval Periode Gaji', path: '/payroll-period-approval' },
      { label: 'Non AE' }
    ]
  },
  '/payroll-period-approval/ae': {
    title: 'Approval Gaji AE',
    breadcrumbs: () => [
      { label: 'Approval Periode Gaji', path: '/payroll-period-approval' },
      { label: 'AE' }
    ]
  },
  '/payroll-period-approval/pkl': {
    title: 'Approval Gaji PKL',
    breadcrumbs: () => [
      { label: 'Approval Periode Gaji', path: '/payroll-period-approval' },
      { label: 'PKL' }
    ]
  },
  '/payroll-period-approval/thr': {
    title: 'Approval Gaji THR',
    breadcrumbs: () => [
      { label: 'Approval Periode Gaji', path: '/payroll-period-approval' },
      { label: 'THR' }
    ]
  },
  '/payroll-period-approval/detail-ae/:id': {
    title: 'Detail Approval AE',
    breadcrumbs: () => [
      { label: 'Approval Periode Gaji', path: '/payroll-period-approval' },
      { label: 'Detail AE' }
    ]
  },
  '/payroll-period-approval/detail-non-ae/:id': {
    title: 'Detail Approval Non AE',
    breadcrumbs: () => [
      { label: 'Approval Periode Gaji', path: '/payroll-period-approval' },
      { label: 'Detail Non AE' }
    ]
  },
  '/payroll-period-approval/detail-thr/:id': {
    title: 'Detail Approval THR',
    breadcrumbs: () => [
      { label: 'Approval Periode Gaji', path: '/payroll-period-approval' },
      { label: 'Detail THR' }
    ]
  },
  '/payroll-period-approval/detail-pkl/:id': {
    title: 'Detail Approval PKL',
    breadcrumbs: () => [
      { label: 'Approval Periode Gaji', path: '/payroll-period-approval' },
      { label: 'Detail PKL' }
    ]
  },

  // Salary Distribution
  '/salary-distribution': {
    title: 'Distribusi Gaji',
    breadcrumbs: () => [
      { label: 'Distribusi Gaji' }
    ]
  },
  '/salary-distribution/non-ae': {
    title: 'Distribusi Gaji Non AE',
    breadcrumbs: () => [
      { label: 'Distribusi Gaji', path: '/salary-distribution' },
      { label: 'Non AE' }
    ]
  },
  '/salary-distribution/ae': {
    title: 'Distribusi Gaji AE',
    breadcrumbs: () => [
      { label: 'Distribusi Gaji', path: '/salary-distribution' },
      { label: 'AE' }
    ]
  },
  '/salary-distribution/thr': {
    title: 'Distribusi Gaji THR',
    breadcrumbs: () => [
      { label: 'Distribusi Gaji', path: '/salary-distribution' },
      { label: 'THR' }
    ]
  },

  // Resignation
  '/resignation': {
    title: 'Pengunduran Diri',
    breadcrumbs: () => [
      { label: 'Pengunduran Diri' }
    ]
  },
  '/resignation/form': {
    title: 'Formulir Pengunduran Diri',
    breadcrumbs: () => [
      { label: 'Pengunduran Diri', path: '/resignation' },
      { label: 'Formulir' }
    ]
  },
  '/resignation/:id': {
    title: 'Detail Pengunduran Diri',
    breadcrumbs: () => [
      { label: 'Pengunduran Diri', path: '/resignation' },
      { label: 'Detail' }
    ]
  },

  // Contract Extension
  '/contract-extension': {
    title: 'Perpanjangan Kontrak',
    breadcrumbs: () => [
      { label: 'Perpanjangan Kontrak' }
    ]
  },
  '/contract-extension/persetujuan': {
    title: 'Persetujuan Perpanjangan Kontrak',
    breadcrumbs: () => [
      { label: 'Perpanjangan Kontrak', path: '/contract-extension' },
      { label: 'Persetujuan' }
    ]
  },
  '/contract-extension/detail/:id': {
    title: 'Detail Perpanjangan Kontrak',
    breadcrumbs: () => [
      { label: 'Perpanjangan Kontrak', path: '/contract-extension' },
      { label: 'Detail' }
    ]
  },

  // Submission Types
  '/submission-types': {
    title: 'Jenis Pengajuan',
    breadcrumbs: () => [
      { label: 'Jenis Pengajuan' }
    ]
  },

  // Organization History
  '/organization-history': {
    title: 'Perubahan Organisasi',
    breadcrumbs: () => [
      { label: 'Perubahan Organisasi' }
    ]
  },
  '/organization-history/atasan': {
    title: 'Perubahan Organisasi Atasan',
    breadcrumbs: () => [
      { label: 'Perubahan Organisasi', path: '/organization-history' },
      { label: 'Atasan' }
    ]
  },

  // Export
  '/structure-and-organize/export': {
    title: 'Export Data',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Export' }
    ]
  },
  '/export': {
    title: 'Export Data',
    breadcrumbs: () => [
      { label: 'Export' }
    ]
  },

  // Fallbacks (Must be last generally if logic depended on order, but our sorting handles it)
  // Structure & Organize Fallback
//   '/structure-and-organize/*': {
//     title: 'Struktur & Organisasi',
//     breadcrumbs: () => [
//       { label: 'Struktur & Organisasi' }
//     ]
//   },
//   // Payroll Configuration Fallback
//   '/payroll-configuration/*': {
//     title: 'Konfigurasi Penggajian',
//     breadcrumbs: () => [
//       { label: 'Konfigurasi Penggajian' }
//     ]   
//   },
//   // Payroll Period Fallback
//   '/payroll-period/*': {
//     title: 'Periode Penggajian',
//     breadcrumbs: () => [
//       { label: 'Periode Penggajian' }
//     ]
//   },
//   // Cash Advance Fallback
//   '/cash-advance/*': {
//     title: 'Kasbon',
//     breadcrumbs: () => [
//       { label: 'Kasbon' }
//     ]
//   },
  
//   // Root Dashboard Fallback/Match
//   '/': {
//     title: 'Dashboard',
//     breadcrumbs: () => [
//       { label: 'Dashboard' }
//     ]
//   },
};

export const getBreadcrumbConfig = (pathname: string) => {
  // Urutkan keys berdasarkan panjang string (descending) agar yang lebih spesifik match duluan
  const sortedPaths = Object.keys(breadcrumbRoutes).sort((a, b) => b.length - a.length);

  for (const path of sortedPaths) {
    const match = matchPath({ path, end: !path.includes('*') }, pathname);
    
    if (match) {
      const config = breadcrumbRoutes[path];
      return {
        title: config.title,
        breadcrumbs: config.breadcrumbs(match.params)
      };
    }
  }
  
  return null;
};
