// Hook: useCreateEmployee – membangun FormData dan submit ke API employees
import { useCallback } from 'react';
import { useFormulirKaryawanStore } from '../stores/useFormulirKaryawanStore';
import employeeMasterDataService from '../services/employeeMasterData.service';
import { EducationItem, DocumentItem } from '../types/FormulirKaryawan';
import { useAuthStore } from '../../auth/stores/authStore';

const mapAgamaToCode = (v: string): string => {
  const m: Record<string, string> = {
    islam: '1', kristen: '2', katholik: '3', hindu: '4', buddha: '5', konhucu: '6',
  };
  return m[(v || '').toLowerCase()] || '1';
};

const mapGenderToCode = (v: string): string => {
  const m: Record<string, string> = { 'laki-laki': '1', perempuan: '2' };
  return m[(v || '').toLowerCase()] || '1';
};

const mapPendidikanToCode = (v: string): string => {
  const m: Record<string, string> = { sd: '1', smp: '2', sma: '3', d1: '4', d2: '5', d3: '6', s1: '7', s2: '8', s3: '9' };
  return m[(v || '').toLowerCase()] || '7';
};

const mapStatusMenikahToCode = (v: string): string => {
  const m: Record<string, string> = { belum_menikah: '1', menikah: '2' };
  return m[(v || '').toLowerCase()] || '1';
};

const mapEmploymentStatusToCode = (v: string): string => {
  const s = (v || '').toLowerCase();
  if (s === 'aktif') return '1';
  return '2';
};

const mapBpjsTKStatusToCode = (v: string): string => {
  const s = (v || '').toLowerCase();
  return s === 'aktif' ? '1' : '2';
};

const mapBpjsHealthStatusToCode = (_v: string): string => {
  console.log('mapBpjsHealthStatusToCode', _v);
  // Kontrak hanya mengenal 1/2 (active/inactive); set default aktif
  return '1';
};

const mapPositionLevelToCode = (v: string): string => {
  const m: Record<string, string> = { junior: '2', middle: '3', senior: '4' };
  return m[(v || '').toLowerCase()] || '1';
};

const mapPayrollStatusToCode = (_v: string): string => {
  console.log('mapPayrollStatusToCode', _v);
  // Kontrak: 1=Active, 2=Inactive, 3=Suspended – set default Active
  return '1';
};

const mapEmployeeCategoryToCode = (_v: string): string => {
  console.log('mapEmployeeCategoryToCode', _v);
  // Kontrak: 1=Non-Staff, 2=Staff, 3=Partner – set default Staff
  return '2';
};

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
    appendIfValue(fd, 'religion', mapAgamaToCode(formData.step1.agama));
    appendIfValue(fd, 'blood_type', formData.step1.golDarah);
    appendIfValue(fd, 'birth_place', formData.step1.tempatLahir);
    appendIfValue(fd, 'birth_date', formData.step1.tanggalLahir);
    appendIfValue(fd, 'last_education', mapPendidikanToCode(formData.step1.pendidikanTerakhir));
    appendIfValue(fd, 'marital_status', mapStatusMenikahToCode(formData.step1.statusMenikah));
    appendIfValue(fd, 'gender', mapGenderToCode(formData.step1.jenisKelamin));
    appendIfValue(fd, 'household_dependents', formData.step1.jumlahTanggungan);
    appendIfValue(fd, 'phone_number', formData.step1.nomorTelepon);
    appendIfValue(fd, 'current_address', formData.step1.alamatDomisili);
    appendIfValue(fd, 'ktp_address', formData.step1.alamatKtp);

    // Finance & Compliance
    appendIfValue(fd, 'bank_account_number', formData.step3.noRekening);
    appendIfValue(fd, 'bank_name', formData.step3.bank);
    appendIfValue(fd, 'bank_account_holder', formData.step3.namaAkunBank);
    appendIfValue(fd, 'npwp', formData.step3.npwp);
    appendIfValue(fd, 'ptkp_id', formData.step3.ptkpStatus);

    // BPJS
    appendIfValue(fd, 'bpjs_employment_number', formData.step3.noBpjsKetenagakerjaan);
    appendIfValue(fd, 'bpjs_employment_status', mapBpjsTKStatusToCode(formData.step3.statusBpjsKetenagakerjaan));
    appendIfValue(fd, 'bpjs_health_number', formData.step3.noBpjsKesehatan);
    appendIfValue(fd, 'bpjs_health_status', mapBpjsHealthStatusToCode(formData.step3.statusBpjsKesehatan));
    appendIfValue(fd, 'employment_status', mapEmploymentStatusToCode(isAuthenticated ? formData.step3Employee.statusKaryawan : 'aktif'));

    // Documents (upload)
    (formData.step4.documents || []).forEach((doc: DocumentItem, i: number) => {
      // Map tipeFile ke kategori umum; gunakan 5 (lainnya) jika tidak dikenal
      const fileType = '5';
      appendIfValue(fd, `documents[${i}][file_type]`, fileType);
      if (doc.file) fd.append(`documents[${i}][file]`, doc.file);
    });

    // Education formal (ambil entri formal pertama)
    const formal: EducationItem | undefined = (formData.step2.education || []).find((e) => (e.jenisPendidikan ?? 'formal') === 'formal');
    if (formal) {
      appendIfValue(fd, 'education_formal_detail[0][education_level]', mapPendidikanToCode(formal.jenjang));
      appendIfValue(fd, 'education_formal_detail[0][institution_name]', formal.namaLembaga);
      appendIfValue(fd, 'education_formal_detail[0][degree]', formal.gelar);
      appendIfValue(fd, 'education_formal_detail[0][final_grade]', formal.nilaiPendidikan);
      appendIfValue(fd, 'education_formal_detail[0][major]', formal.jurusanKeahlian);
      appendIfValue(fd, 'education_formal_detail[0][graduation_year]', formal.tahunLulus);
    }

    // Education non-formal (ambil entri non-formal pertama)
    const nonFormal: EducationItem | undefined = (formData.step2.education || []).find((e) => e.jenisPendidikan === 'non-formal');
    if (nonFormal) {
      appendIfValue(fd, 'non_formal_education[0][certificate_name]', nonFormal.namaSertifikat);
      appendIfValue(fd, 'non_formal_education[0][institution_name]', nonFormal.organisasiPenerbit);
      appendIfValue(fd, 'non_formal_education[0][start_date]', nonFormal.tanggalPenerbitan);
      appendIfValue(fd, 'non_formal_education[0][end_date]', nonFormal.tanggalKedaluwarsa);
      appendIfValue(fd, 'non_formal_education[0][certificate_id]', nonFormal.idKredensial);
      if (nonFormal.fileSertifikat) fd.append('non_formal_education[0][certificate_file]', nonFormal.fileSertifikat);
    }

    // Media Sosial & Kontak Darurat
    appendIfValue(fd, 'facebook_name', formData.step2.facebook);
    appendIfValue(fd, 'instagram_name', formData.step2.instagram);
    appendIfValue(fd, 'linkedin_name', formData.step2.linkedin);
    appendIfValue(fd, 'twitter_name', formData.step2.xCom);
    appendIfValue(fd, 'relative_social_media', formData.step2.akunSosialMediaTerdekat);
    appendIfValue(fd, 'emergency_contact_number', formData.step2.noKontakDarurat);
    appendIfValue(fd, 'emergency_contact_name', formData.step2.namaNoKontakDarurat);
    appendIfValue(fd, 'emergency_contact_relationship', formData.step2.hubunganKontakDarurat);

    // Organization (opsional; set id_* jika tersedia dari UI login)
    if (isAuthenticated) {
      appendIfValue(fd, 'id_company', '');
      appendIfValue(fd, 'id_office', '');
      appendIfValue(fd, 'id_directorate', '');
      appendIfValue(fd, 'id_division', '');
      appendIfValue(fd, 'id_department', '');
      appendIfValue(fd, 'id_position', '');
      appendIfValue(fd, 'id_job_title', '');
      appendIfValue(fd, 'start_date', formData.step3Employee.tanggalMasuk);
      appendIfValue(fd, 'end_date', formData.step3Employee.tanggalAkhir);
      appendIfValue(fd, 'position_level', mapPositionLevelToCode(formData.step3Employee.jenjangJabatan));
      appendIfValue(fd, 'payroll_status', mapPayrollStatusToCode(formData.step3Employee.statusPayroll));
      appendIfValue(fd, 'employee_category', mapEmployeeCategoryToCode(formData.step3Employee.kategoriKaryawan));
    }

    return fd;
  }, [formData, isAuthenticated]);

  // submit: panggil service createEmployee dengan FormData hasil mapping
  const submit = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fd = buildFormData();
      const res = await employeeMasterDataService.createEmployee(fd);
      return res.data;
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan data karyawan');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [buildFormData, setLoading, setError]);

  return { submit };
}

export default useCreateEmployee;

