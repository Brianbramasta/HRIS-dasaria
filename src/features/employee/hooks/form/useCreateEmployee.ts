// Hook: useCreateEmployee – membangun FormData dan submit ke API employees
import { useCallback } from 'react';
import { useFormulirKaryawanStore } from '../../stores/useFormulirKaryawanStore';
import employeeMasterDataService from '../../services/EmployeeMasterData.service';
import { EducationItem, DocumentItem } from '../../types/FormEmployess';
import { useAuthStore } from '../../../auth/stores/AuthStore';
import {
  mapAgamaToCode,
  mapGenderToCode,
  mapPendidikanToCode,
  mapStatusMenikahToCode,
  mapBpjsTKStatusToCode,
  mapBpjsHealthStatusToCode,
  mapPositionLevelToCode,
  mapPayrollStatusToCode,
  mapEmployeeCategoryToCode,
} from '../../utils/EmployeeMappings';
import { formatIndonesianToISO } from '@/utils/formatDate';

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
    appendIfValue(fd, 'birth_date', formatIndonesianToISO(formData.step1.tanggalLahir));
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

    // Documents (upload)
    (formData.step4.documents || []).forEach((doc: DocumentItem, i: number) => {
      const fileType = doc.tipeFile || '5';
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
      appendIfValue(fd, 'non_formal_education[0][start_date]', formatIndonesianToISO(nonFormal.tanggalPenerbitan || ''));
      appendIfValue(fd, 'non_formal_education[0][end_date]', formatIndonesianToISO(nonFormal.tanggalKedaluwarsa || ''));
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

    // Organization (opsional; set *_id jika tersedia dari UI login)
    if (isAuthenticated) {
      appendIfValue(fd, 'company_id', formData.step3Employee.company);
      appendIfValue(fd, 'office_id', formData.step3Employee.kantor);
      appendIfValue(fd, 'directorate_id', formData.step3Employee.direktorat);
      appendIfValue(fd, 'division_id', formData.step3Employee.divisi);
      appendIfValue(fd, 'department_id', formData.step3Employee.departemen);
      appendIfValue(fd, 'position_id', formData.step3Employee.position);
      appendIfValue(fd, 'job_title_id', formData.step3Employee.jabatan);
      appendIfValue(fd, 'start_date', formatIndonesianToISO(formData.step3Employee.tanggalMasuk));
      appendIfValue(fd, 'end_date', formatIndonesianToISO(formData.step3Employee.tanggalAkhir));
      appendIfValue(fd, 'position_level', mapPositionLevelToCode(formData.step3Employee.jenjangJabatan));
      appendIfValue(fd, 'payroll_status', mapPayrollStatusToCode(formData.step3Employee.statusPayroll));
      appendIfValue(fd, 'employee_category', mapEmployeeCategoryToCode(formData.step3Employee.kategoriKaryawan));
      appendIfValue(fd, 'employment_status', formData.step3Employee.employmentStatus);
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

