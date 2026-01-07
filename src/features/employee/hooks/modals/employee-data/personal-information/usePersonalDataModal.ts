import { useEffect, useMemo, useState } from 'react';
import { getReligionDropdownOptions, getEducationDropdownOptions } from '@/features/employee/hooks/employee-data/form/useFormulirKaryawan';
import { UpdatePersonalDataPayload } from '@/features/employee/types/detail/PersonalInformation';

export type PersonalDataForm = {
  idKaryawan?: string;
  namaLengkap: string;
  email: string;
  nik?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  jenisKelamin?: string;
  golDarah?: string;
  pendidikanTerakhir?: string;
  statusMenikah?: string;
  nomorTelepon?: string;
  jumlahTanggungan?: string;
  alamatDomisili?: string;
  alamatKtp?: string;
  agama?: string;
  fotoProfil?: File | null;
  avatarUrl?: string;
};

type Params = {
  isOpen: boolean;
  initialData?: PersonalDataForm | null;
  onSubmit: (data: PersonalDataForm) => void;
};

const emptyForm: PersonalDataForm = {
  idKaryawan: '',
  namaLengkap: '',
  email: '',
  nik: '',
  tempatLahir: '',
  tanggalLahir: '',
  jenisKelamin: '',
  golDarah: '',
  pendidikanTerakhir: '',
  statusMenikah: '',
  nomorTelepon: '',
  jumlahTanggungan: '0',
  alamatDomisili: '',
  alamatKtp: '',
  agama: '',
  fotoProfil: null,
  avatarUrl: '',
};

export function usePersonalDataModal({ isOpen, initialData, onSubmit }: Params) {
  const [form, setForm] = useState<PersonalDataForm>(emptyForm);
  const [agamaOptions, setAgamaOptions] = useState<any[]>([]);
  const [pendidikanOptions, setPendidikanOptions] = useState<any[]>([]);
  const title = useMemo(() => 'Edit Data Pribadi', []);

  useEffect(() => {
    setForm(initialData ? { ...emptyForm, ...initialData } : emptyForm);
  }, [initialData, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    Promise.all([getReligionDropdownOptions(), getEducationDropdownOptions()])
      .then(([religions, educations]) => {
        if (!mounted) return;
        setAgamaOptions(religions);
        setPendidikanOptions(educations);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [isOpen]);

  const handleInput = (key: keyof PersonalDataForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, fotoProfil: file }));
  };

  const mapFormToPayload = (): UpdatePersonalDataPayload => {
    return {
      full_name: form.namaLengkap,
      email: form.email,
      national_id: form.nik,
      birth_place: form.tempatLahir,
      birth_date: form.tanggalLahir,
      religion_id: form.agama,
      gender: form.jenisKelamin,
      phone_number: form.nomorTelepon,
      blood_type: form.golDarah,
      last_education_id: form.pendidikanTerakhir,
      marital_status: form.statusMenikah,
      household_dependents: form.jumlahTanggungan ? parseInt(form.jumlahTanggungan, 10) : undefined,
      avatar: form.fotoProfil || undefined,
      current_address: form.alamatDomisili,
      ktp_address: form.alamatKtp,
    };
  };

  const handleSubmit = () => {
    const payload = mapFormToPayload();
    onSubmit(payload as any);
  };

  return {
    title,
    form,
    agamaOptions,
    pendidikanOptions,
    handleInput,
    handleFileChange,
    handleSubmit,
  };
}
