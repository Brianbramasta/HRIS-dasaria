// Hook: Personal Information
import { useState, useCallback } from 'react';
import {
  PersonalInformationData,
  PersonalDataResponse,
  EducationFormalItem,
  EducationNonFormalItem,
  SocialMediaDataResponse,
  SalaryDataResponse,
  BpjsDataResponse,
  UpdatePersonalDataPayload,
  UpdateEducationDataPayload,
  UpdateSocialMediaDataPayload,
  UpdateSalaryDataPayload,
  UpdateBpjsDataPayload,
  UpdateEmploymentPositionPayload,
  UpdateEmployeeDocumentPayload,
} from '@/features/employee/types/detail/PersonalInformation';
import {personalInformationService} from '@/features/employee/services/detail/PersonalInformationService';
import { addNotification } from '@/stores/notificationStore';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';

// ===================== Mapped Types =====================

export interface MappedPersonalData {
  fullName: string;
  nationalId: string | null;
  birthPlace: string | null;
  birthDate: string | null;
  religionId: string | null;
  email: string | null;
  gender: string | null;
  phoneNumber: string | null;
  bloodType: string | null;
  lastEducationId: string | null;
  maritalStatus: string | null;
  householdDependents: number | null;
  avatar: string | null;
  currentAddress: string | null;
  ktpAddress: string | null;
}

export interface MappedEducationFormal {
  id: string;
  educationLevelId: string;
  institutionName: string;
  degree: string;
  finalGrade: string | number;
  major: string;
  graduationYear: string | number;
}

export interface MappedEducationNonFormal {
  id: string;
  certificateName: string;
  institutionName: string;
  startDate: string;
  endDate: string;
  certificateId: string;
  certificateFile: string | null;
}

export interface MappedSocialMedia {
  facebookName: string | null;
  instagramName: string | null;
  linkedinName: string | null;
  twitterName: string | null;
  relativeSocialMedia: string | null;
  emergencyContactNumber: string | null;
  emergencyContactName: string | null;
  emergencyContactRelationship: string | null;
}

export interface MappedSalary {
  bankAccountNumber: string | null;
  bankAccountHolder: string | null;
  bankId: string | null;
  npwp: string | null;
  ptpkId: string | null;
}

export interface MappedBpjs {
  bpjsEmploymentNumber: string | null;
  bpjsEmploymentStatus: string | null;
  bpjsHealthNumber: string | null;
  bpjsHealthStatus: string | null;
}

export interface MappedPersonalInformation {
  personal: MappedPersonalData;
  educationFormal: MappedEducationFormal[];
  educationNonFormal: MappedEducationNonFormal[];
  socialMedia: MappedSocialMedia;
  salary: MappedSalary;
  bpjs: MappedBpjs;
}

// ===================== Hook State Types =====================

export interface UsePersonalInformationState {
  data: MappedPersonalInformation | null;
  loading: boolean;
  error: string | null;
}

export interface UsePersonalInformationActions {
  getPersonalInformation: (employeeId: string) => Promise<void>;
  updatePersonalData: (employeeId: string, payload: UpdatePersonalDataPayload) => Promise<void>;
  updateEducationData: (employeeId: string, payload: UpdateEducationDataPayload) => Promise<void>;
  updateSocialMediaData: (employeeId: string, payload: UpdateSocialMediaDataPayload) => Promise<void>;
  updateSalaryData: (employeeId: string, payload: UpdateSalaryDataPayload) => Promise<void>;
  updateBpjsData: (employeeId: string, payload: UpdateBpjsDataPayload) => Promise<void>;
  updateEmploymentPosition: (employeeId: string, payload: UpdateEmploymentPositionPayload) => Promise<void>;
  updateEmployeeDocument: (employeeId: string, payload: UpdateEmployeeDocumentPayload) => Promise<void>;
  resetError: () => void;
}

// ===================== Mapping Functions =====================

/**
 * Map snake_case API response ke camelCase untuk UI
 */
const mapPersonalData = (data: PersonalDataResponse): MappedPersonalData => {
  return {
    fullName: data.full_name,
    nationalId: data.national_id,
    birthPlace: data.birth_place,
    birthDate: data.birth_date,
    religionId: data.religion_id,
    email: data.email,
    gender: data.gender,
    phoneNumber: data.phone_number,
    bloodType: data.blood_type,
    lastEducationId: data.last_education_id,
    maritalStatus: data.marital_status,
    householdDependents: data.household_dependents,
    avatar: data.avatar,
    currentAddress: data.current_address,
    ktpAddress: data.ktp_address,
  };
};

/**
 * Map education formal item
 */
const mapEducationFormal = (data: EducationFormalItem): MappedEducationFormal => {
  return {
    id: data.id,
    educationLevelId: data.education_level_id,
    institutionName: data.institution_name,
    degree: data.degree,
    finalGrade: data.final_grade,
    major: data.major,
    graduationYear: data.graduation_year,
  };
};

/**
 * Map education non-formal item
 */
const mapEducationNonFormal = (data: EducationNonFormalItem): MappedEducationNonFormal => {
  return {
    id: data.id,
    certificateName: data.certificate_name,
    institutionName: data.institution_name,
    startDate: data.start_date,
    endDate: data.end_date,
    certificateId: data.certificate_id,
    certificateFile: data.certificate_file,
  };
};

/**
 * Map social media data
 */
const mapSocialMedia = (data: SocialMediaDataResponse): MappedSocialMedia => {
  return {
    facebookName: data.facebook_name,
    instagramName: data.instagram_name,
    linkedinName: data.linkedin_name,
    twitterName: data.twitter_name,
    relativeSocialMedia: data.relative_social_media,
    emergencyContactNumber: data.emergency_contact_number,
    emergencyContactName: data.emergency_contact_name,
    emergencyContactRelationship: data.emergency_contact_relationship,
  };
};

/**
 * Map salary data
 */
const mapSalary = (data: SalaryDataResponse): MappedSalary => {
  return {
    bankAccountNumber: data.bank_account_number,
    bankAccountHolder: data.bank_account_holder,
    bankId: data.bank_id,
    npwp: data.npwp,
    ptpkId: data.ptkp_id,
  };
};

/**
 * Map BPJS data
 */
const mapBpjs = (data: BpjsDataResponse): MappedBpjs => {
  return {
    bpjsEmploymentNumber: data.bpjs_employment_number,
    bpjsEmploymentStatus: data.bpjs_employment_status,
    bpjsHealthNumber: data.bpjs_health_number,
    bpjsHealthStatus: data.bpjs_health_status,
  };
};

/**
 * Map full personal information response
 */
const mapPersonalInformation = (data: PersonalInformationData): MappedPersonalInformation => {
  return {
    personal: mapPersonalData(data.personal),
    educationFormal: data.education_formal.map(mapEducationFormal),
    educationNonFormal: data.education_non_formal.map(mapEducationNonFormal),
    socialMedia: mapSocialMedia(data.social_media),
    salary: mapSalary(data.salary),
    bpjs: data.bpjs ? mapBpjs(data.bpjs) : {
      bpjsEmploymentNumber: null,
      bpjsEmploymentStatus: null,
      bpjsHealthNumber: null,
      bpjsHealthStatus: null,
    },
  };
};

/**
 * Map education data from modal form to API payload
 * Sesuai dengan dokumentasi api.contract.personal.information.md
 */
interface EducationModalForm {
  education: Array<{
    id?: string;
    jenisPendidikan?: string;
    // Formal fields
    jenjang?: string;
    namaLembaga?: string;
    gelar?: string;
    nilaiPendidikan?: string | number;
    jurusanKeahlian?: string;
    tahunLulus?: string | number;
    // Non-formal fields
    namaSertifikat?: string;
    organisasiPenerbit?: string;
    tanggalPenerbitan?: string;
    tanggalKedaluwarsa?: string;
    idKredensial?: string;
    fileSertifikat?: File | null;
  }>;
}

interface EducationFormalDetailItem {
  id?: string;
  education_level_id: string;
  institution_name: string;
  degree: string;
  final_grade: string | number;
  major: string;
  graduation_year: string | number;
}

interface EducationNonFormalDetailItem {
  id?: string;
  certificate_name: string;
  institution_name: string;
  start_date: string;
  end_date: string;
  certificate_id: string;
  certificate_file?: File;
}

const mapEducationModalToPayload = (modalData: EducationModalForm): UpdateEducationDataPayload => {
  const formalEducation: EducationFormalDetailItem[] = [];
  const nonFormalEducation: EducationNonFormalDetailItem[] = [];

  modalData.education.forEach((item) => {
    if (item.jenisPendidikan === 'formal') {
      // Formal education - hanya tambahkan field yang ada
      const formalItem: EducationFormalDetailItem = {
        education_level_id: item.jenjang || '',
        institution_name: item.namaLembaga || '',
        degree: item.gelar || '',
        final_grade: item.nilaiPendidikan || '',
        major: item.jurusanKeahlian || '',
        graduation_year: item.tahunLulus || '',
      };
      
      // Tambahkan ID jika ada (untuk update existing)
      if (item.id) {
        formalItem.id = item.id;
      }
      
      formalEducation.push(formalItem);
    } else if (item.jenisPendidikan === 'non-formal') {
      // Non-formal education
      const nonFormalItem: EducationNonFormalDetailItem = {
        certificate_name: item.namaSertifikat || '',
        institution_name: item.organisasiPenerbit || '',
        start_date: item.tanggalPenerbitan || '',
        end_date: item.tanggalKedaluwarsa || '',
        certificate_id: item.idKredensial || '',
      };
      
      // Tambahkan ID jika ada (untuk update existing)
      if (item.id) {
        nonFormalItem.id = item.id;
      }
      
      // Tambahkan file jika ada
      if (item.fileSertifikat) {
        nonFormalItem.certificate_file = item.fileSertifikat;
      }
      
      nonFormalEducation.push(nonFormalItem);
    }
  });

  return {
    education_formal_detail: formalEducation.length > 0 ? formalEducation : undefined,
    non_formal_education: nonFormalEducation.length > 0 ? nonFormalEducation : undefined,
  };
};

/**
 * Map personal data for sending to API (filter undefined values dan ensure snake_case)
 * Sesuai dengan dokumentasi api.contract.personal.information.md
 */
const mapUpdatePersonalPayload = (data: UpdatePersonalDataPayload): UpdatePersonalDataPayload => {
  const mapped: any = {};

  // Full name
  if (data.full_name !== undefined && data.full_name !== null && data.full_name !== '') {
    mapped.full_name = data.full_name;
  }
  
  // National ID
  if (data.national_id !== undefined && data.national_id !== null && data.national_id !== '') {
    mapped.national_id = data.national_id;
  }
  
  // Birth Place
  if (data.birth_place !== undefined && data.birth_place !== null && data.birth_place !== '') {
    mapped.birth_place = data.birth_place;
  }
  
  // Birth Date (ISO format)
  if (data.birth_date !== undefined && data.birth_date !== null && data.birth_date !== '') {
    mapped.birth_date = data.birth_date;
  }
  
  // Religion ID
  if (data.religion_id !== undefined && data.religion_id !== null && data.religion_id !== '') {
    mapped.religion_id = data.religion_id;
  }
  
  // Email
  if (data.email !== undefined && data.email !== null && data.email !== '') {
    mapped.email = data.email;
  }
  
  // Gender (M/F)
  if (data.gender !== undefined && data.gender !== null && data.gender !== '') {
    mapped.gender = data.gender;
  }
  
  // Phone Number
  if (data.phone_number !== undefined && data.phone_number !== null && data.phone_number !== '') {
    mapped.phone_number = data.phone_number;
  }
  
  // Blood Type
  if (data.blood_type !== undefined && data.blood_type !== null && data.blood_type !== '') {
    mapped.blood_type = data.blood_type;
  }
  
  // Last Education ID
  if (data.last_education_id !== undefined && data.last_education_id !== null && data.last_education_id !== '') {
    mapped.last_education_id = data.last_education_id;
  }
  
  // Marital Status
  if (data.marital_status !== undefined && data.marital_status !== null && data.marital_status !== '') {
    mapped.marital_status = data.marital_status;
  }
  
  // Household Dependents
  if (data.household_dependents !== undefined && data.household_dependents !== null && data.household_dependents !== '') {
    mapped.household_dependents = data.household_dependents;
  }
  
  // Avatar (File object)
  if (data.avatar !== undefined && data.avatar !== null) {
    mapped.avatar = data.avatar;
  }
  
  // Current Address
  if (data.current_address !== undefined && data.current_address !== null && data.current_address !== '') {
    mapped.current_address = data.current_address;
  }
  
  // KTP Address
  if (data.ktp_address !== undefined && data.ktp_address !== null && data.ktp_address !== '') {
    mapped.ktp_address = data.ktp_address;
  }

  return mapped;
};

// ===================== Hook Implementation =====================

/**
 * Hook untuk mengelola Personal Information Karyawan
 * @param employeeId - ID karyawan (opsional, bisa diset saat call)
 * @returns Object dengan state dan action functions
 */
export const usePersonalInformation = (employeeId?: string): UsePersonalInformationState & UsePersonalInformationActions => {
  const [data, setData] = useState<MappedPersonalInformation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchDetail } = useDetailDataKaryawanPersonalInfo()

  /**
   * Get Personal Information Data
   */
  const getPersonalInformation = useCallback(
    async (id: string = employeeId!) => {
      if (!id) {
        setError('Employee ID is required');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await personalInformationService.getPersonalInformationData(id);

        if (response.meta.status == 200 && response.data) {
          const mappedData = mapPersonalInformation(response.data);
          setData(mappedData);
        } else {
          setError(response.message || 'Failed to fetch personal information');
        }
      } catch (err: any) {
        const errorMessage = err?.message || 'An error occurred while fetching personal information';
        setError(errorMessage);
        console.error('getPersonalInformation error:', err);
      } finally {
        setLoading(false);
      }
    },
    [employeeId]
  );

  /**
   * Update Personal Data
   */
  const updatePersonalData = useCallback(
    async (id: string = employeeId!, payload: UpdatePersonalDataPayload) => {
      if (!id) {
        setError('Employee ID is required');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const mappedPayload = mapUpdatePersonalPayload(payload);
        const response = await personalInformationService.updatePersonalData(id, mappedPayload);

        if (response.meta.status == 200) {
        //   const updatedPersonal = mapPersonalData(response.data);
        //   setData({
        //     ...data,
        //     personal: updatedPersonal,
        //   });
        } else {
          setError(response.message || 'Failed to update personal data');
        }
      } catch (err: any) {
        const errorMessage = err?.message || 'An error occurred while updating personal data';
        setError(errorMessage);
        console.error('updatePersonalData error:', err);
      } finally {
        setLoading(false);
      }
    },
    [employeeId]
  );

  /**
   * Update Education Data
   */
  const updateEducationData = useCallback(
    async (id: string = employeeId!, payload: UpdateEducationDataPayload | EducationModalForm) => {
      if (!id) {
        setError('Employee ID is required');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Map modal form to API payload jika diperlukan
        const mappedPayload = (payload && 'education' in payload) 
          ? mapEducationModalToPayload(payload as EducationModalForm)
          : payload as UpdateEducationDataPayload;

        const response = await personalInformationService.updateEducationData(id, mappedPayload);
        console.log('updateEducationData response:', response);
        if (response.meta.status === 200  ) {
            addNotification({ 
            variant: 'success',
            title: 'Berhasil',
            description: 'Data pendidikan berhasil diperbarui.',
            hideDuration: 3000 });
            fetchDetail(id);

        //   const educationFormal = (response.data.education_formal || []).map(mapEducationFormal);
        //   const educationNonFormal = (response.data.education_non_formal || []).map(mapEducationNonFormal);
        
        //   setData({
        //     ...data,
        //     educationFormal,
        //     educationNonFormal,
        //   });
        } else {
          setError(response.message || 'Failed to update education data');
        }
      } catch (err: any) {
        const errorMessage = err?.message || 'An error occurred while updating education data';
        setError(errorMessage);
        console.error('updateEducationData error:', err);
      } finally {
        setLoading(false);
      }
    },
    [employeeId, fetchDetail]
  );

/**
 * Map social media data from modal form to API payload
 * Sesuai dengan dokumentasi api.contract.personal.information.md
 */
interface MediaSosialForm {
  facebook?: string;
  linkedin?: string;
  xCom?: string;
  instagram?: string;
  akunSosialMediaTerdekat?: string;
  namaNoKontakDarurat?: string;
  noKontakDarurat?: string;
  hubunganKontakDarurat?: string;
}

const mapSocialMediaModalToPayload = useCallback(
  (modalData: MediaSosialForm): UpdateSocialMediaDataPayload => {
    return {
      facebook_name: modalData.facebook !== undefined && modalData.facebook !== null && modalData.facebook !== '' ? modalData.facebook : undefined,
      linkedin_name: modalData.linkedin !== undefined && modalData.linkedin !== null && modalData.linkedin !== '' ? modalData.linkedin : undefined,
      twitter_name: modalData.xCom !== undefined && modalData.xCom !== null && modalData.xCom !== '' ? modalData.xCom : undefined,
      instagram_name: modalData.instagram !== undefined && modalData.instagram !== null && modalData.instagram !== '' ? modalData.instagram : undefined,
      relative_social_media: modalData.akunSosialMediaTerdekat !== undefined && modalData.akunSosialMediaTerdekat !== null && modalData.akunSosialMediaTerdekat !== '' ? modalData.akunSosialMediaTerdekat : undefined,
      emergency_contact_number: modalData.noKontakDarurat !== undefined && modalData.noKontakDarurat !== null && modalData.noKontakDarurat !== '' ? modalData.noKontakDarurat : undefined,
      emergency_contact_name: modalData.namaNoKontakDarurat !== undefined && modalData.namaNoKontakDarurat !== null && modalData.namaNoKontakDarurat !== '' ? modalData.namaNoKontakDarurat : undefined,
      emergency_contact_relationship: modalData.hubunganKontakDarurat !== undefined && modalData.hubunganKontakDarurat !== null && modalData.hubunganKontakDarurat !== '' ? modalData.hubunganKontakDarurat : undefined,
    };
  },
  []
);

  /**
   * Update Social Media Data
   */
  const updateSocialMediaData = useCallback(
    async (id: string = employeeId!, payload: UpdateSocialMediaDataPayload | MediaSosialForm) => {
      if (!id) {
        setError('Employee ID is required');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Map modal form to API payload jika diperlukan
        const mappedPayload = (payload && 'facebook' in payload) 
          ? mapSocialMediaModalToPayload(payload as MediaSosialForm)
          : payload as UpdateSocialMediaDataPayload;

        const response = await personalInformationService.updateSocialMediaData(id, mappedPayload);

        if (response.meta.status == 200) {
        //   const updatedSocialMedia = mapSocialMedia(response.data);
        //   setData({
        //     ...data,
        //     socialMedia: updatedSocialMedia,
        //   });
        } else {
          setError(response.message || 'Failed to update social media data');
        }
      } catch (err: any) {
        const errorMessage = err?.message || 'An error occurred while updating social media data';
        setError(errorMessage);
        console.error('updateSocialMediaData error:', err);
      } finally {
        setLoading(false);
      }
    },
    [employeeId, mapSocialMediaModalToPayload]
  );

  /**
   * Update Salary Data
   */
  const updateSalaryData = useCallback(
    async (id: string = employeeId!, payload: UpdateSalaryDataPayload) => {
      if (!id) {
        setError('Employee ID is required');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await personalInformationService.updateSalaryData(id, payload);

        if (response.meta.status == 200) {
        //   const updatedSalary = mapSalary(response.data);
        //   setData({
        //     ...data,
        //     salary: updatedSalary,
        //   });
        addNotification({ 
            variant: 'success',
            title: 'Berhasil',
            description: 'Data gaji berhasil diperbarui.',
            hideDuration: 3000 });
            fetchDetail(id);
        } else {
          setError(response.message || 'Failed to update salary data');
        }
      } catch (err: any) {
        const errorMessage = err?.message || 'An error occurred while updating salary data';
        setError(errorMessage);
        console.error('updateSalaryData error:', err);
      } finally {
        setLoading(false);
      }
    },
    [employeeId, fetchDetail]
  );

  /**
   * Update BPJS Data
   */
  const updateBpjsData = useCallback(
    async (id: string = employeeId!, payload: UpdateBpjsDataPayload) => {
      if (!id) {
        setError('Employee ID is required');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await personalInformationService.updateBpjsData(id, payload);

        if (response.meta.status == 200) {
            addNotification({ 
            variant: 'success',
            title: 'Berhasil',
            description: 'Data BPJS berhasil diperbarui.',
            hideDuration: 3000 });
            fetchDetail(id);
        //   const updatedBpjs = mapBpjs(response.data);
        //   setData({
        //     ...data,
        //     bpjs: updatedBpjs,
        //   });
        } else {
          setError(response.message || 'Failed to update BPJS data');
        }
      } catch (err: any) {
        const errorMessage = err?.message || 'An error occurred while updating BPJS data';
        setError(errorMessage);
        console.error('updateBpjsData error:', err);
      } finally {
        setLoading(false);
      }
    },
    [employeeId, fetchDetail]
  );

  /**
   * Dokumentasi: Form modal diselaraskan dengan payload API update-employment-position
   */
  interface EmploymentPositionForm {
    employment_status_id?: string;
    department_id?: string;
    position_id?: string;
    job_title_id?: string;
    company_id?: string;
    office_id?: string;
    directorate_id?: string;
    division_id?: string;
    position_level_id?: string;
    payroll_status?: string;
    employee_category_id?: string;
    start_date?: string;
    end_date?: string;
  }

  const mapEmploymentPositionModalToPayload = useCallback(
    (modalData: EmploymentPositionForm): UpdateEmploymentPositionPayload => {
      const payload: any = {};
      if (modalData.employment_status_id) payload.employment_status_id = modalData.employment_status_id;
      if (modalData.department_id) payload.department_id = modalData.department_id;
      if (modalData.start_date) payload.start_date = modalData.start_date;
      if (modalData.position_id) payload.position_id = modalData.position_id;
      if (modalData.end_date) payload.end_date = modalData.end_date;
      if (modalData.job_title_id) payload.job_title_id = modalData.job_title_id;
      if (modalData.company_id) payload.company_id = modalData.company_id;
      if (modalData.position_level_id) payload.position_level_id = modalData.position_level_id;
      if (modalData.office_id) payload.office_id = modalData.office_id;
      if (modalData.directorate_id) payload.directorate_id = modalData.directorate_id;
      if (modalData.payroll_status) payload.payroll_status = modalData.payroll_status;
      if (modalData.division_id) payload.division_id = modalData.division_id;
      if (modalData.employee_category_id) payload.employee_category_id = modalData.employee_category_id;
      return payload;
    },
    []
  );

  const updateEmploymentPosition = useCallback(
    async (id: string = employeeId!, payload: UpdateEmploymentPositionPayload | EmploymentPositionForm) => {
      if (!id) {
        setError('Employee ID is required');
        return;
      }

      setLoading(true);
      setError(null);
      console.log('test updateEmploymentPosition', id, payload);

      try {
        let mappedPayload: UpdateEmploymentPositionPayload;
        
        // Simple check jika form data (cek properti yang memang ada di form modal)
        const formPayload = payload as EmploymentPositionForm;
        if (
          'employment_status_id' in formPayload || 
          'start_date' in formPayload || 
          'office_id' in formPayload ||
          'position_level_id' in formPayload
        ) {
             mappedPayload = mapEmploymentPositionModalToPayload(formPayload);
        } else {
             mappedPayload = payload as UpdateEmploymentPositionPayload;
        }

        const response = await personalInformationService.updateEmploymentPosition(id, mappedPayload);

        if (response.meta.status == 200) {
           addNotification({
            variant: 'success',
            title: 'Berhasil',
            description: 'Data posisi berhasil diperbarui.',
            hideDuration: 3000 });
            fetchDetail(id);
        } else {
          setError(response.message || 'Failed to update employment position');
        }
      } catch (err: any) {
        const errorMessage = err?.message || 'An error occurred while updating employment position';
        setError(errorMessage);
        console.error('updateEmploymentPosition error:', err);
      } finally {
        setLoading(false);
      }
    },
    [employeeId, fetchDetail, mapEmploymentPositionModalToPayload]
  );

  /**
   * Update Employee Document
   */
  const updateEmployeeDocument = useCallback(
    async (id: string = employeeId!, payload: UpdateEmployeeDocumentPayload) => {
      if (!id) {
        setError('Employee ID is required');
        return;
      }
      console.log('test updateEmployeeDocument', id, payload);

      setLoading(true);
      setError(null);

      try {
        const response = await personalInformationService.updateEmployeeDocument(id, payload);

        if (response.meta.status == 200) {
           addNotification({
            variant: 'success',
            title: 'Berhasil',
            description: 'Dokumen karyawan berhasil diperbarui.',
            hideDuration: 3000 });
            fetchDetail(id);
        } else {
          setError(response.message || 'Failed to update employee document');
        }
      } catch (err: any) {
        const errorMessage = err?.message || 'An error occurred while updating employee document';
        setError(errorMessage);
        console.error('updateEmployeeDocument error:', err);
      } finally {
        setLoading(false);
      }
    },
    [employeeId, fetchDetail]
  );

  return {
    data,
    loading,
    error,
    getPersonalInformation,
    updatePersonalData,
    updateEducationData,
    updateSocialMediaData,
    updateSalaryData,
    updateBpjsData,
    updateEmploymentPosition,
    updateEmployeeDocument,
    resetError: () => setError(null),
  };
};

export default usePersonalInformation;
