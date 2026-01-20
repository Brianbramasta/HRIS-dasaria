import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { companyService } from '../../services/OrganizationService';
import { mapToCompanyDetail } from '../../hooks/api/useApiCompanies';
import { formatDateToIndonesian } from '@/utils/formatDate';
import { useFileStore } from '@/stores/fileStore';

export const useDetailCompany = () => {
  const { id } = useParams();
  const [company, setCompany] = useState<any | null>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  const [tab, setTab] = useState<'profile'|'dokumen'|'hierarki'|'karyawan'>('profile');

  const [isAddBranchOpen, setAddBranchOpen] = useState(false);
  const [isDeleteBranchOpen, setDeleteBranchOpen] = useState(false);
  // DOK: Hilangkan setter state yang tidak digunakan (setSelectedBranch)
  // Alasan: aksi pilih branch untuk delete sedang tidak aktif, hindari error lint
  const [selectedBranch] = useState<any | null>(null);

  const [isAddDocOpen, setAddDocOpen] = useState(false);
  const [isDeleteDocOpen, setDeleteDocOpen] = useState(false);
  const [isEditDocOpen, setEditDocOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [isEditOpen, setEditOpen] = useState(false);
  const file = useFileStore();

  const fetch = useCallback(async () => {
    if (!id) return;
    try {
      // Gunakan endpoint komposit: GET /companies/:id/detail
      const detail = await companyService.getDetail(id);
      const mappedDetail = mapToCompanyDetail(detail);
      setCompany(mappedDetail?.company || null);
      setBranches(mappedDetail?.branches || []);
      // Map dokumen agar tetap kompatibel dengan UI yang memfilter berdasarkan 'type'
      const docs = (mappedDetail?.documents || []).map((d: any) => ({
        ...d,
        // Jika API tidak menyediakan 'type', default-kan ke 'active' agar UI tidak kosong
        type: d?.type ?? 'active',
      }));
      console.log('Documents', docs);
      setDocuments(docs);
    } catch (err) {
      console.error('Failed to load company detail', err);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  const alamatValue = company?.address || '—';
  const companySizeValue = (company?.employeeCount || company?.employees || '')
    ? `${company?.employeeCount || company?.employees} Employes`
    : '0';

  const contactInformation = [
    { label: 'Kode Pos', value: company?.postalCode || company?.postal || '—' },
    { label: 'Gmail', value: company?.email || '—' },
    { label: 'Phone', value: company?.phone || '—' },
  ];

  const customInformation = [
      { label: 'Industry', value: company?.industry || company?.businessLineName || '—' },
      { label: 'Didirikan', value: formatDateToIndonesian(company?.founded) || '—' },
      { label: 'Type', value: company?.type || '—' },
      { label: 'Website', value: company?.website || '—' },
  ];

  const docColumns = useMemo(() => ([
      { id: 'no', label: 'No.', align: 'center', render: (_: any, __: any, idx: number) => idx + 1 },
      { id: 'fileName', label: 'Nama Dokumen' },
      { id: 'number', label: 'Nomor Dokumen' },
      // { id: 'name', label: 'Jenis' },
      // { id: 'size', label: 'Ukuran' },
      { id: 'type', label: 'Status', render: (v: string) => (v === 'active' ? 'Dokumen Aktif' : v === 'archive' ? 'Arsip' : '—') },
  ]), []);

  return {
    id,
    company,
    branches,
    documents,
    tab,
    setTab,
    isAddBranchOpen,
    setAddBranchOpen,
    isDeleteBranchOpen,
    setDeleteBranchOpen,
    selectedBranch,
    isAddDocOpen,
    setAddDocOpen,
    isDeleteDocOpen,
    setDeleteDocOpen,
    isEditDocOpen,
    setEditDocOpen,
    selectedDoc,
    setSelectedDoc,
    isEditOpen,
    setEditOpen,
    file,
    fetch,
    alamatValue,
    companySizeValue,
    contactInformation,
    customInformation,
    docColumns
  };
};
