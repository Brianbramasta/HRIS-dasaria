import { useState, useMemo, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFileStore } from '@/stores/fileStore';
import usePengunduranDiri from '../resignation/usePengunduranDiri';
import { addNotification } from '../../../../stores/notificationStore';
import { useCompanies } from '../../../structure-and-organize/hooks/company/useCompanies';
import { useDirectorates } from '../../../structure-and-organize/hooks/directorate/useDirectorates';
import { useDivisions } from '../../../structure-and-organize/hooks/division/useDivisions';
import { useDepartments } from '../../../structure-and-organize/hooks/departement/useDepartments';
import { usePositions } from '../../../structure-and-organize/hooks/job-tittle/useJobTitle';

interface ResignForm {
  idKaryawan: string;
  name: string;
  tanggalPengajuan: string;
  perusahaanId: string;
  direktoratId: string;
  divisiId: string;
  departmentId: string;
  posisiId: string;
  alasan: string;
  status: string;
}

export const useResignForm = () => {
  const navigate = useNavigate();
  const { createPengunduranDiri, loading } = usePengunduranDiri({ autoFetch: false });
  const { companies } = useCompanies();
  const { directorates } = useDirectorates();
  const { divisions } = useDivisions();
  const { departments } = useDepartments();
  const { positions } = usePositions();
  const skFile = useFileStore((s) => s.skFile);

  const [form, setForm] = useState<ResignForm>({
    idKaryawan: '',
    name: '',
    tanggalPengajuan: '',
    perusahaanId: '',
    direktoratId: '',
    divisiId: '',
    departmentId: '',
    posisiId: '',
    alasan: '',
    status: 'Pending',
  });

  const companyOptions = useMemo(() => 
    (companies || []).map(c => ({ value: (c as any).id ?? '', label: (c as any).name ?? '' })), 
    [companies]
  );

  const directorateOptions = useMemo(() => 
    (directorates || []).map(d => ({ value: (d as any).id ?? '', label: (d as any).name ?? '' })), 
    [directorates]
  );

  const divisionOptions = useMemo(() => 
    (divisions || []).map(d => ({ value: (d as any).id ?? '', label: (d as any).name ?? '' })), 
    [divisions]
  );

  const departmentOptions = useMemo(() => 
    (departments || []).map(d => ({ value: (d as any).id ?? '', label: (d as any).name ?? '' })), 
    [departments]
  );

  const positionOptions = useMemo(() => 
    (positions || []).map(p => ({ value: (p as any).id ?? '', label: (p as any).name ?? '' })), 
    [positions]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = () => {
    // File handling logic can be implemented here if needed
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (
      !form.idKaryawan ||
      !form.name ||
      !form.departmentId ||
      !form.tanggalPengajuan ||
      !form.alasan ||
      !skFile?.name
    ) {
      addNotification({
        title: 'Form belum lengkap',
        description: 'Lengkapi semua field dan unggah dokumen sebelum submit.',
        variant: 'warning',
      });
      return;
    }

    try {
      const selectedDepartment = departmentOptions.find(d => d.value === form.departmentId)?.label || '';
      const selectedPosition = positionOptions.find(p => p.value === form.posisiId)?.label || '';
      
      const payload = {
        idKaryawan: form.idKaryawan,
        name: form.name,
        posisi: selectedPosition || undefined,
        department: selectedDepartment,
        departmentId: form.departmentId,
        tanggalPengajuan: form.tanggalPengajuan,
        alasan: form.alasan,
      } as any;
      
      await createPengunduranDiri(payload);
      
      addNotification({
        title: 'Berhasil',
        description: 'Pengajuan pengunduran diri tersimpan.',
        variant: 'success',
      });
      
      navigate('/pengunduran-diri');
    } catch (err) {
      addNotification({
        title: 'Gagal menyimpan',
        description: 'Terjadi kesalahan saat menyimpan data.',
        variant: 'error',
      });
    }
  };

  return {
    form,
    setForm,
    loading,
    companyOptions,
    directorateOptions,
    divisionOptions,
    departmentOptions,
    positionOptions,
    handleChange,
    handleFileChange,
    handleSubmit,
  };
};
