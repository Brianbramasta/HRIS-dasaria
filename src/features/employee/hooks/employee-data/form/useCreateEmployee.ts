// Hook: useCreateEmployee – membangun FormData dan submit ke API employees
import { useCallback } from 'react';
import { useFormulirKaryawanStore } from '../../../stores/useFormulirKaryawanStore';
import employeeMasterDataService from '../../../services/EmployeeMasterData.service';
import { DocumentItem } from '../../../types/FormEmployee';
import { useAuthStore } from '../../../../auth/stores/AuthStore';

const appendIfValue = (fd: FormData, key: string, value: any) => {
  if (value !== undefined && value !== null && `${value}` !== '') {
    fd.append(key, value as any);
  }
};

export function useCreateEmployee() {
  const { formData, setLoading, setError } = useFormulirKaryawanStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // buildFormData: mapping state ke kontrak API employees
  const buildFormData = useCallback(() => {
    const fd = new FormData();

    // Personal Data
    appendIfValue(fd, 'full_name', formData.step1.namaLengkap);
    appendIfValue(fd, 'national_id', formData.step1.nik);
    appendIfValue(fd, 'email', formData.step1.email);
    appendIfValue(fd, 'religion_id', formData.step1.agama);
    appendIfValue(fd, 'blood_type', formData.step1.golDarah);
    appendIfValue(fd, 'birth_place', formData.step1.tempatLahir);
    appendIfValue(fd, 'birth_date', formData.step1.tanggalLahir);
    appendIfValue(fd, 'last_education_id', formData.step1.pendidikanTerakhir);
    appendIfValue(fd, 'marital_status', formData.step1.statusMenikah);
    appendIfValue(fd, 'gender', formData.step1.jenisKelamin);
    appendIfValue(fd, 'household_dependents', formData.step1.jumlahTanggungan);
    appendIfValue(fd, 'phone_number', formData.step1.nomorTelepon);
    appendIfValue(fd, 'current_address', formData.step1.alamatDomisili);
    appendIfValue(fd, 'ktp_address', formData.step1.alamatKtp);

    // Finance & Compliance
    appendIfValue(fd, 'bank_account_number', formData.step3.noRekening);
    appendIfValue(fd, 'bank_id', formData.step3.bank);
    appendIfValue(fd, 'bank_name', formData.step3.bank);
    appendIfValue(fd, 'bank_account_holder', formData.step3.namaAkunBank);
    appendIfValue(fd, 'npwp', formData.step3.npwp);
    appendIfValue(fd, 'ptkp_id', formData.step3.ptkpStatus);

    // BPJS
    appendIfValue(fd, 'bpjs_employment_number', formData.step3.noBpjsKetenagakerjaan);
    appendIfValue(fd, 'bpjs_employment_status', formData.step3.statusBpjsKetenagakerjaan);
    appendIfValue(fd, 'bpjs_health_number', formData.step3.noBpjsKesehatan);
    appendIfValue(fd, 'bpjs_health_status', formData.step3.statusBpjsKesehatan);

    // Documents (upload)
    (formData.step4.documents || []).forEach((doc: DocumentItem, i: number) => {
      const fileType = doc.tipeFile || '5';
      appendIfValue(fd, `documents[${i}][employee_document_id]`, fileType);
      if (doc.file) fd.append(`documents[${i}][file]`, doc.file);
    });

    // Education formal (semua entri formal)
    const formalList = (formData.step2.education || []).filter((e) => (e.jenisPendidikan ?? 'formal') === 'formal');
    formalList.forEach((formal, index) => {
      appendIfValue(fd, `education_formal_detail[${index}][education_level_id]`, formal.jenjang);
      appendIfValue(fd, `education_formal_detail[${index}][institution_name]`, formal.namaLembaga);
      appendIfValue(fd, `education_formal_detail[${index}][degree]`, formal.gelar);
      appendIfValue(fd, `education_formal_detail[${index}][final_grade]`, formal.nilaiPendidikan);
      appendIfValue(fd, `education_formal_detail[${index}][major]`, formal.jurusanKeahlian);
      appendIfValue(fd, `education_formal_detail[${index}][graduation_year]`, formal.tahunLulus);
    });

    // Education non-formal (semua entri non-formal)
    const nonFormalList = (formData.step2.education || []).filter((e) => e.jenisPendidikan === 'non-formal');
    nonFormalList.forEach((nonFormal, index) => {
      appendIfValue(fd, `non_formal_education[${index}][certificate_name]`, nonFormal.namaSertifikat);
      appendIfValue(fd, `non_formal_education[${index}][institution_name]`, nonFormal.organisasiPenerbit);
      appendIfValue(fd, `non_formal_education[${index}][start_date]`, nonFormal.tanggalPenerbitan || '');
      appendIfValue(fd, `non_formal_education[${index}][end_date]`, nonFormal.tanggalKedaluwarsa || '');
      appendIfValue(fd, `non_formal_education[${index}][certificate_id]`, nonFormal.idKredensial);
      if (nonFormal.fileSertifikat) fd.append(`non_formal_education[${index}][certificate_file]`, nonFormal.fileSertifikat);
    });

    // Media Sosial & Kontak Darurat
    appendIfValue(fd, 'facebook_name', formData.step2.facebook);
    appendIfValue(fd, 'instagram_name', formData.step2.instagram);
    appendIfValue(fd, 'linkedin_name', formData.step2.linkedin);
    appendIfValue(fd, 'twitter_name', formData.step2.xCom);
    appendIfValue(fd, 'relative_social_media', formData.step2.akunSosialMediaTerdekat);
    appendIfValue(fd, 'emergency_contact_number', formData.step2.noKontakDarurat);
    appendIfValue(fd, 'emergency_contact_name', formData.step2.namaNoKontakDarurat);
    appendIfValue(fd, 'emergency_contact_relationship', formData.step2.hubunganKontakDarurat);

    // Non Fix Allowance
    (formData.step3.nonFixAllowances || []).forEach((allowance: { id: string; amount: string | number }, index: number) => {
      appendIfValue(fd, `non_fix_allowance[${index}][non_fix_allowance_id]`, allowance.id);
      appendIfValue(fd, `non_fix_allowance[${index}][amount]`, allowance.amount);
    });

    // Avatar
    if (formData.step1.fotoProfil) {
      fd.append('avatar', formData.step1.fotoProfil);
    }

    // Organization (opsional; set *_id jika tersedia dari UI login)
    if (isAuthenticated) {
      appendIfValue(fd, 'company_id', formData.step3Employee.company);
      appendIfValue(fd, 'office_id', formData.step3Employee.kantor);
      appendIfValue(fd, 'directorate_id', formData.step3Employee.direktorat);
      appendIfValue(fd, 'division_id', formData.step3Employee.divisi);
      appendIfValue(fd, 'department_id', formData.step3Employee.departemen);
      appendIfValue(fd, 'unit_id', formData.step3Employee.unit);
      appendIfValue(fd, 'position_id', formData.step3Employee.position);
      appendIfValue(fd, 'job_title_id', formData.step3Employee.jabatan);
      appendIfValue(fd, 'structural_job_id', formData.step3Employee.jabatanStruktural);
      appendIfValue(fd, 'start_date', formData.step3Employee.tanggalMasuk);
      appendIfValue(fd, 'end_date', formData.step3Employee.tanggalAkhir);
      appendIfValue(fd, 'position_level_id', formData.step3Employee.jenjangJabatan);
      appendIfValue(fd, 'payroll_status', formData.step3Employee.statusPayroll);
      appendIfValue(fd, 'employee_category_id', formData.step3Employee.kategoriKaryawan);
      appendIfValue(fd, 'employment_status_id', formData.step3Employee.employmentStatus);
      // appendIfValue(fd, 'resignation_status', formData.step3Employee.resignationStatus);
    }

    return fd;
  }, [formData, isAuthenticated]);

  // submit: panggil service createEmployee dengan FormData hasil mapping
  const submit = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fd = buildFormData();
      const res = isAuthenticated
        ? await employeeMasterDataService.createEmployee(fd)
        : await employeeMasterDataService.createEmployeeWithoutLogin(fd);
      return res.data;
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan data karyawan');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [buildFormData, setLoading, setError, isAuthenticated]);

  return { submit };
}

export default useCreateEmployee;

