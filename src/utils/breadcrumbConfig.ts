import { matchPath } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface RouteConfig {
  title: string;
  breadcrumbs: (params: any, state?: any) => BreadcrumbItem[];
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
    title: 'Hak Akses',
    breadcrumbs: () => [
      { label: 'Hak Akses' }
    ]
  },
  '/role-management-access/edit/:roleId': {
    title: 'Edit Role',
    breadcrumbs: () => [
      { label: 'Hak Akses', path: '/role-management-access' },
      { label: 'Edit Role' }
    ]
  },
  '/role-management-access/detail/:roleId': {
    title: 'Detail Role',
    breadcrumbs: () => [
      { label: 'Hak Akses', path: '/role-management-access' },
      { label: 'Detail Role' }
    ]
  },
  '/role-management-access/service-detail/:layananId': {
    title: 'Detail Modul',
    breadcrumbs: () => [
      { label: 'Hak Akses', path: '/role-management-access' },
      { label: 'Detail Modul' }
    ]
  },
  '/role-management-access/feature-detail/:modulId': {
    title: 'Detail Fitur',
    breadcrumbs: (_params, state) => [
      { label: 'Hak Akses', path: '/role-management-access' },
      { label: 'Detail Modul', path: state?.layananId ? `/role-management-access/service-detail/${state.layananId}` : undefined },
      { label: 'Detail Fitur' }
    ]
  },
  '/role-management-access/access-detail/:featureId': {
    title: 'Detail Akses',
    breadcrumbs: (_params, state) => [
      { label: 'Hak Akses', path: '/role-management-access' },
      { label: 'Detail Modul', path: state?.layananId ? `/role-management-access/service-detail/${state.layananId}` : undefined },
      { label: 'Detail Fitur', path: state?.modulId ? `/role-management-access/feature-detail/${state.modulId}` : undefined },
      { label: 'Detail Akses' }
    ]
  },

  // Employee Data
  '/employee-data': {
    title: 'Data Master Karyawan',
    breadcrumbs: () => [
      { label: 'Data Karyawan' }
    ]
  },
  '/employee-data/pendaftaran': {
    title: 'Data Master Karyawan',
    breadcrumbs: () => [
      { label: 'Data Karyawan', path: '/employee-data' },
      { label: 'Pendaftaran Baru' }
    ]
  },
  '/employee-data/form': {
    title: 'Data Master Karyawan',
    breadcrumbs: () => [
      { label: 'Data Karyawan', path: '/employee-data' },
      { label: 'Formulir' }
    ]
  },
  '/employee-data/contract-extension': {
     title: 'Data Master Karyawan',
     breadcrumbs: () => [
       { label: 'Data Karyawan', path: '/employee-data' },
       { label: 'Perpanjangan Kontrak' }
     ]
  },
  '/employee-data/:id': {
    title: 'Data Master Karyawan',
    breadcrumbs: () => [
      { label: 'Data Karyawan', path: '/employee-data' },
      { label: 'Detail Karyawan' }
    ]
  },
  '/employee-data/:id/pelanggaran': {
    title: 'Data Master Karyawan',
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
    title: 'Struktur & Organisasi',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Lini Bisnis' }
    ]
  },
  '/structure-and-organize/business-lines/:id': {
    title: 'Struktur & Organisasi',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Lini Bisnis', path: '/structure-and-organize/business-lines' },
      { label: 'Detail' }
    ]
  },
  '/structure-and-organize/companies': {
    title: 'Struktur & Organisasi',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Perusahaan' }
    ]
  },
  '/structure-and-organize/companies/:id': {
    title: 'Struktur & Organisasi',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Perusahaan', path: '/structure-and-organize/companies' },
      { label: 'Detail' }
    ]
  },
  '/structure-and-organize/offices': {
    title: 'Struktur & Organisasi',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Kantor' }
    ]
  },
  '/structure-and-organize/directorates': {
    title: 'Struktur & Organisasi',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Direktorat' }
    ]
  },
  '/structure-and-organize/divisions': {
    title: 'Struktur & Organisasi',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Divisi' }
    ]
  },
  '/structure-and-organize/departments': {
    title: 'Struktur & Organisasi',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Departemen' }
    ]
  },
  '/structure-and-organize/units': {
    title: 'Struktur & Organisasi',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Unit' }
    ]
  },
  '/structure-and-organize/positions': {
    title: 'Struktur & Organisasi',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Jabatan' }
    ]
  },
  '/structure-and-organize/employee-positions': {
    title: 'Struktur & Organisasi',
    breadcrumbs: () => [
      { label: 'Struktur & Organisasi', path: '/structure-and-organize' },
      { label: 'Posisi Karyawan' }
    ]
  },

  // Payroll Configuration
  '/payroll-configuration': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Konfigurasi Penggajian' }
    ]
  },
  '/payroll-configuration/compensation': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Konfigurasi Penggajian', path: '/payroll-configuration' },
      { label: 'Kompensasi' }
    ]
  },
  '/payroll-configuration/bpjs': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Konfigurasi Penggajian', path: '/payroll-configuration' },
      { label: 'BPJS' }
    ]
  },
  '/payroll-configuration/deduction-reference': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Konfigurasi Penggajian', path: '/payroll-configuration' },
      { label: 'Acuan Potongan' }
    ]
  },
  '/payroll-configuration/fixed-allowance': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Konfigurasi Penggajian', path: '/payroll-configuration' },
      { label: 'Tunjangan Tetap' }
    ]
  },
  '/payroll-configuration/non-recurring-allowance': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Konfigurasi Penggajian', path: '/payroll-configuration' },
      { label: 'Tunjangan Tidak Tetap' }
    ]
  },
  '/payroll-configuration/non-recurring-deduction': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Konfigurasi Penggajian', path: '/payroll-configuration' },
      { label: 'Potongan Tidak Tetap' }
    ]
  },
  '/payroll-configuration/thr': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Konfigurasi Penggajian', path: '/payroll-configuration' },
      { label: 'THR' }
    ]
  },

  // Payroll Period
  '/payroll-period': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Periode Penggajian' }
    ]
  },
  '/payroll-period/non-ae': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Periode Penggajian', path: '/payroll-period' },
      { label: 'Non AE' }
    ]
  },
  '/payroll-period/ae': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Periode Penggajian', path: '/payroll-period' },
      { label: 'AE' }
    ]
  },
  '/payroll-period/internship': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Periode Penggajian', path: '/payroll-period' },
      { label: 'PKL' }
    ]
  },
  '/payroll-period/holiday-allowance': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Periode Penggajian', path: '/payroll-period' },
      { label: 'THR' }
    ]
  },
  '/payroll-period/detail-ae/:id': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Periode Penggajian', path: '/payroll-period' },
      { label: 'Detail AE' }
    ]
  },
  '/payroll-period/detail-non-ae/:id': {
    title: 'Penggajian',
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
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Periode Penggajian', path: '/payroll-period' },
      { label: 'Detail PKL' }
    ]
  },

  // Cash Advance
  '/cash-advance': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Kasbon' }
    ]
  },
  '/cash-advance/submission-history': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Kasbon', path: '/cash-advance' },
      { label: 'Riwayat Pengajuan' }
    ]
  },
  '/cash-advance/cash-advance-status': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Kasbon', path: '/cash-advance' },
      { label: 'Status' }
    ]
  },
  '/cash-advance/approval': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Kasbon', path: '/cash-advance' },
      { label: 'Approval' }
    ]
  },
  '/cash-advance/cash-advance-form': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Kasbon', path: '/cash-advance' },
      { label: 'Formulir' }
    ]
  },
  '/cash-advance/detail/:id': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Kasbon', path: '/cash-advance' },
      { label: 'Detail' }
    ]
  },

  // Payroll Dashboard
  '/payroll-dashboard': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Dashboard Penggajian' }
    ]
  },

  // Payroll Period Approval
  '/payroll-period-approval': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Approval Periode Gaji' }
    ]
  },
  '/payroll-period-approval/non-ae': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Approval Periode Gaji', path: '/payroll-period-approval' },
      { label: 'Non AE' }
    ]
  },
  '/payroll-period-approval/ae': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Approval Periode Gaji', path: '/payroll-period-approval' },
      { label: 'AE' }
    ]
  },
  '/payroll-period-approval/pkl': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Approval Periode Gaji', path: '/payroll-period-approval' },
      { label: 'PKL' }
    ]
  },
  '/payroll-period-approval/thr': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Approval Periode Gaji', path: '/payroll-period-approval' },
      { label: 'THR' }
    ]
  },
  '/payroll-period-approval/detail-ae/:id': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Approval Periode Gaji', path: '/payroll-period-approval' },
      { label: 'Detail AE' }
    ]
  },
  '/payroll-period-approval/detail-non-ae/:id': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Approval Periode Gaji', path: '/payroll-period-approval' },
      { label: 'Detail Non AE' }
    ]
  },
  '/payroll-period-approval/detail-thr/:id': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Approval Periode Gaji', path: '/payroll-period-approval' },
      { label: 'Detail THR' }
    ]
  },
  '/payroll-period-approval/detail-pkl/:id': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Approval Periode Gaji', path: '/payroll-period-approval' },
      { label: 'Detail PKL' }
    ]
  },

  // Salary Distribution
  '/salary-distribution': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Distribusi Gaji' }
    ]
  },
  '/salary-distribution/non-ae': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Distribusi Gaji', path: '/salary-distribution' },
      { label: 'Non AE' }
    ]
  },
  '/salary-distribution/ae': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Distribusi Gaji', path: '/salary-distribution' },
      { label: 'AE' }
    ]
  },
  '/salary-distribution/thr': {
    title: 'Penggajian',
    breadcrumbs: () => [
      { label: 'Distribusi Gaji', path: '/salary-distribution' },
      { label: 'THR' }
    ]
  },

  // Resignation
  '/resignation': {
    title: 'Data Master Karyawan',
    breadcrumbs: () => [
      { label: 'Pengunduran Diri' }
    ]
  },
  '/resignation/form': {
    title: 'Data Master Karyawan',
    breadcrumbs: () => [
      { label: 'Pengunduran Diri', path: '/resignation' },
      { label: 'Formulir' }
    ]
  },
  '/resignation/:id': {
    title: 'Data Master Karyawan',
    breadcrumbs: () => [
      { label: 'Pengunduran Diri', path: '/resignation' },
      { label: 'Detail' }
    ]
  },

  'resignation/termination-administration/:id': {
    title: 'Data Master Karyawan',
    breadcrumbs: () => [
      { label: 'Terminasi Administrasi', path: '/resignation/termination-administration' },
      { label: 'Detail Terminasi Administrasi' }
    ]
  },

  // Contract Extension
  '/contract-extension': {
    title: 'Data Master Karyawan',
    breadcrumbs: () => [
      { label: 'Perpanjangan Kontrak' }
    ]
  },
  '/contract-extension/persetujuan': {
    title: 'Data Master Karyawan',
    breadcrumbs: () => [
      { label: 'Perpanjangan Kontrak', path: '/contract-extension' },
      { label: 'Persetujuan' }
    ]
  },
  '/contract-extension/detail/:id': {
    title: 'Data Master Karyawan',
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
    title: 'Data Master Karyawan',
    breadcrumbs: () => [
      { label: 'Perubahan Organisasi' }
    ]
  },
  '/organization-history/atasan': {
    title: 'Data Master Karyawan',
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

export const getBreadcrumbConfig = (pathname: string, state?: any) => {
  // Urutkan keys berdasarkan panjang string (descending) agar yang lebih spesifik match duluan
  const sortedPaths = Object.keys(breadcrumbRoutes).sort((a, b) => b.length - a.length);

  for (const path of sortedPaths) {
    const match = matchPath({ path, end: !path.includes('*') }, pathname);
    
    if (match) {
      const config = breadcrumbRoutes[path];
      return {
        title: config.title,
        breadcrumbs: config.breadcrumbs(match.params, state)
      };
    }
  }
  
  return null;
};
