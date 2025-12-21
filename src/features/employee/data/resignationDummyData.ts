import { PengunduranDiri } from '../types/Resignation';
import { ResignationDetailResponse } from '../services/ResignationService';

// Dummy data for pending review resignations
export const dummyPendingResignations: PengunduranDiri[] = [
  {
    id: '1',
    karyawanId: 'KRY001',
    idKaryawan: 'NIP-2024-001',
    name: 'Ahmad Rizki',
    email: 'ahmad.rizki@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad',
    posisi: 'Senior Developer',
    department: 'IT Development',
    departmentId: 'DEPT001',
    tanggalPengajuan: '2024-12-01',
    tanggalEfektif: null,
    alasan: 'Mendapat tawaran pekerjaan baru dengan posisi yang lebih sesuai dengan karir saya.',
    status: 'In Progress',
  },
  {
    id: '2',
    karyawanId: 'KRY002',
    idKaryawan: 'NIP-2024-002',
    name: 'Siti Nurhaliza',
    email: 'siti.nur@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
    posisi: 'Marketing Manager',
    department: 'Marketing',
    departmentId: 'DEPT002',
    tanggalPengajuan: '2024-12-05',
    tanggalEfektif: null,
    alasan: 'Ingin fokus mengurus keluarga dan mengembangkan bisnis pribadi.',
    status: 'In Progress',
  },
  {
    id: '3',
    karyawanId: 'KRY003',
    idKaryawan: 'NIP-2024-003',
    name: 'Budi Santoso',
    email: 'budi.santoso@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
    posisi: 'Finance Analyst',
    department: 'Finance',
    departmentId: 'DEPT003',
    tanggalPengajuan: '2024-12-08',
    tanggalEfektif: null,
    alasan: 'Melanjutkan pendidikan S2 di luar negeri.',
    status: 'Pending',
  },
  {
    id: '4',
    karyawanId: 'KRY004',
    idKaryawan: 'NIP-2024-004',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi',
    posisi: 'HR Specialist',
    department: 'Human Resources',
    departmentId: 'DEPT004',
    tanggalPengajuan: '2024-12-10',
    tanggalEfektif: null,
    alasan: 'Pindah domisili ke kota lain karena alasan keluarga.',
    status: 'In Progress',
  },
  {
    id: '5',
    karyawanId: 'KRY005',
    idKaryawan: 'NIP-2024-005',
    name: 'Eko Prasetyo',
    email: 'eko.prasetyo@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eko',
    posisi: 'UI/UX Designer',
    department: 'Design',
    departmentId: 'DEPT005',
    tanggalPengajuan: '2024-12-12',
    tanggalEfektif: null,
    alasan: 'Mencari pengalaman baru di startup untuk mengembangkan skill design.',
    status: 'Pending',
  },
];

// Dummy data for reviewed/approved resignations
export const dummyApprovedResignations: PengunduranDiri[] = [
  {
    id: '101',
    karyawanId: 'KRY101',
    idKaryawan: 'NIP-2023-101',
    name: 'Fajar Mulyono',
    email: 'fajar.mulyono@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fajar',
    posisi: 'Project Manager',
    department: 'IT Development',
    departmentId: 'DEPT001',
    tanggalPengajuan: '2024-11-01',
    tanggalEfektif: '2024-12-01',
    alasan: 'Mendapat kesempatan untuk memimpin project di perusahaan multinasional.',
    status: 'Approved',
  },
  {
    id: '102',
    karyawanId: 'KRY102',
    idKaryawan: 'NIP-2023-102',
    name: 'Gita Savitri',
    email: 'gita.savitri@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gita',
    posisi: 'Content Specialist',
    department: 'Marketing',
    departmentId: 'DEPT002',
    tanggalPengajuan: '2024-11-05',
    tanggalEfektif: '2024-12-05',
    alasan: 'Memulai karir sebagai freelance content creator.',
    status: 'Approved',
  },
  {
    id: '103',
    karyawanId: 'KRY103',
    idKaryawan: 'NIP-2023-103',
    name: 'Hendra Wijaya',
    email: 'hendra.wijaya@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra',
    posisi: 'Senior Accountant',
    department: 'Finance',
    departmentId: 'DEPT003',
    tanggalPengajuan: '2024-11-10',
    tanggalEfektif: '2024-12-10',
    alasan: 'Pensiun dini untuk menikmati masa tua.',
    status: 'Approved',
  },
  {
    id: '104',
    karyawanId: 'KRY104',
    idKaryawan: 'NIP-2023-104',
    name: 'Intan Permatasari',
    email: 'intan.permata@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Intan',
    posisi: 'Recruitment Manager',
    department: 'Human Resources',
    departmentId: 'DEPT004',
    tanggalPengajuan: '2024-11-15',
    tanggalEfektif: '2024-12-15',
    alasan: 'Mendapat promosi di perusahaan lain dengan benefit lebih baik.',
    status: 'Approved',
  },
  {
    id: '105',
    karyawanId: 'KRY105',
    idKaryawan: 'NIP-2023-105',
    name: 'Joko Widodo',
    email: 'joko.widodo@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joko',
    posisi: 'Graphic Designer',
    department: 'Design',
    departmentId: 'DEPT005',
    tanggalPengajuan: '2024-11-18',
    tanggalEfektif: '2024-12-18',
    alasan: 'Bergabung dengan agency internasional untuk pengalaman global.',
    status: 'Approved',
  },
];

// Dummy detail data
export const dummyResignationDetail: ResignationDetailResponse = {
  resign: {
    id: '1',
    karyawanId: 'KRY001',
    idKaryawanStr: 'NIP-2024-001',
    name: 'Ahmad Rizki',
    departmentName: 'IT Development',
    tanggalPengajuan: '2024-12-01',
    tanggalEfektif: null,
    alasan: 'Mendapat tawaran pekerjaan baru dengan posisi yang lebih sesuai dengan karir saya.',
    status: 'In Progress',
  },
  karyawanSummary: {
    id: 'KRY001',
    idKaryawan: 'NIP-2024-001',
    name: 'Ahmad Rizki',
    email: 'ahmad.rizki@company.com',
    posisi: 'Senior Developer',
  },
};

// Helper function to get dummy data by status
export const getDummyResignationsByStatus = (status: string): PengunduranDiri[] => {
  if (status === 'Approved') {
    return dummyApprovedResignations;
  }
  if (status === 'In Progress' || status === 'Pending') {
    return dummyPendingResignations;
  }
  return [...dummyPendingResignations, ...dummyApprovedResignations];
};

// Helper function to get dummy detail by ID
export const getDummyResignationDetailById = (id: string): ResignationDetailResponse | null => {
  const allResignations = [...dummyPendingResignations, ...dummyApprovedResignations];
  const resignation = allResignations.find((r) => r.id === id);
  
  if (!resignation) return null;

  return {
    resign: {
      id: resignation.id,
      karyawanId: resignation.karyawanId,
      idKaryawanStr: resignation.idKaryawan,
      name: resignation.name,
      departmentName: resignation.department,
      tanggalPengajuan: resignation.tanggalPengajuan,
      tanggalEfektif: resignation.tanggalEfektif || null,
      alasan: resignation.alasan,
      status: resignation.status,
    },
    karyawanSummary: {
      id: resignation.karyawanId,
      idKaryawan: resignation.idKaryawan,
      name: resignation.name,
      email: resignation.email || null,
      posisi: resignation.posisi,
    },
  };
};
