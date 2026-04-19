import React from 'react';
import { ChevronLeft } from 'react-feather';
import PayrollCard from '@/features/payroll/components/cards/Cards';
import { useDetailOrganizationHistory } from '@/features/employee/hooks/organization-history/useDetailOrganizationHistory';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import FIleField from '@/components/shared/field/FIleField';
import LinkPreview from '@/components/shared/form/LinkPreview';
import Button from '@/components/ui/button/Button';
import { handleViewFile } from '@/utils/viewFileHandle';
import { useNavigate } from 'react-router-dom';
import { formatDateToIndonesian } from '@/utils/formatDate';
import { NonFixAllowanceItemEntity } from '@/features/employee/types/entity/OrganizationChangeEntity';

const DetailOrganizationHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Custom hook for business logic
  const {
    skFile,
    adendumFile,
    loading,
    organizationChangeDetail,
    atasan,
    setSkFile,
    setAdendumFile,
    handleSubmit,
    title,
    currency,
  } = useDetailOrganizationHistory();

  console.log(organizationChangeDetail,'organizationChangeDetail');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      </div>
      <div className='grid grid-cols-2'>
        <PayrollCard title="Informasi Karyawan" headerColor="slate" border={false}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <InputField label="NIP" required value={organizationChangeDetail?.employee_id || ''} disabled placeholder="NIP" onChange={() => {}} />
            </div>
            <div>
              <InputField label="Pengguna" placeholder="Otomatis" value={organizationChangeDetail?.employee_name || ''} disabled />
            </div>
            <div>
              <InputField label="Kategori Karyawan" placeholder="Otomatis" value={organizationChangeDetail?.previous_position?.employee_category || ''} disabled />
            </div>
            <div>
              <InputField label="Perusahaan" placeholder="Otomatis" value={organizationChangeDetail?.previous_position?.company || ''} disabled />
            </div>
            <div>
              <InputField label="Kantor" placeholder="Otomatis" value={organizationChangeDetail?.previous_position?.office || ''} disabled />
            </div>
            <div>
              <InputField label="Direktorat" placeholder="Otomatis" value={organizationChangeDetail?.previous_position?.directorate || ''} disabled />
            </div>
            <div>
              <InputField label="Divisi" placeholder="Otomatis" value={organizationChangeDetail?.previous_position?.division || ''} disabled />
            </div>
            <div>
              <InputField label="Departemen" placeholder="Otomatis" value={organizationChangeDetail?.previous_position?.department || ''} disabled />
            </div>
            <div>
              <InputField label="Unit" placeholder="Otomatis" value={organizationChangeDetail?.previous_position?.unit || ''} disabled />
            </div>
            <div>
              <InputField label="Posisi" placeholder="Otomatis" value={organizationChangeDetail?.previous_position?.position || ''} disabled />
            </div>
            <div>
              <InputField label="Jabatan Kepangkatan" placeholder="Otomatis" value={organizationChangeDetail?.previous_position?.rank_position || ''} disabled />
            </div>
            <div>
              <InputField label="Jabatan Struktural" placeholder="Otomatis" value={organizationChangeDetail?.previous_position?.structural_position || ''} disabled />
            </div>
            <div>
              <InputField label="Jenjang Jabatan" placeholder="Otomatis" value={organizationChangeDetail?.previous_position?.position_level || ''} disabled />
            </div>
            <div>
              <InputField label="Golongan" placeholder="Otomatis" value={organizationChangeDetail?.previous_position?.grade || ''} disabled />
            </div>
            
            <div>
              <InputField label="Gaji Pokok" placeholder="Otomatis" value={currency(organizationChangeDetail?.previous_position?.base_salary || 0)} disabled />
            </div>
            <div>
              <InputField label="Tunjangan Pernikahan" placeholder="Otomatis" value={currency(organizationChangeDetail?.previous_position?.marriage_allowance || 0)} disabled />
            </div>
            <div>
              <InputField label="Tunjangan Jabatan" placeholder="Otomatis" value={currency(organizationChangeDetail?.previous_position?.position_allowance || 0)} disabled />
            </div>
            <div>
              <InputField label="Tunjangan Lama Kerja" placeholder="Otomatis" value={currency(organizationChangeDetail?.previous_position?.tenure_allowance || 0)} disabled />
            </div>
            <div className="md:col-span-2">
            <div className="space-y-4">
              {organizationChangeDetail?.previous_position?.non_fix_allowance?.map((allowance: NonFixAllowanceItemEntity, index: number) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-6">
                    <InputField
                      label="Jenis Tunjangan Diskresi"
                      value={allowance.allowance_name || ''}
                      disabled
                      placeholder="Tunjangan Tidak Tetap"
                    />
                  </div>
                  <div className="md:col-span-6 flex items-end gap-2">
                    <div className="flex-1">
                      <InputField
                        label="Nominal"
                        value={currency(Number(allowance.amount) || 0)}
                        disabled
                        placeholder="Rp 0"
                      />
                    </div>
                  </div>
                </div>
              )) || <div></div>}
            </div>
          </div>
            <div className="md:col-span-2">
              <InputField label="Gaji Bersih" placeholder="Otomatis" value={currency(organizationChangeDetail?.previous_position?.take_home_pay || 0)} disabled />
            </div>
          </div>
        </PayrollCard>

      <PayrollCard title="Detail Perubahan" headerColor="green" border={false}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <InputField label="Jenis Perubahan" required value={organizationChangeDetail?.change_type_name || ''} disabled placeholder="Jenis Perubahan" onChange={() => {}} />
          </div>
          <div>
            <InputField id="effectiveDateDetail" label="Tanggal Efektif" required value={formatDateToIndonesian(organizationChangeDetail?.new_position?.effective_date || '')} placeholder="— (masih aktif)" onChange={() => {}} disabled />
          </div>
          <div>
            <InputField label="Kategori Karyawan" required value={organizationChangeDetail?.new_position?.employee_category || ''} disabled placeholder="Kategori Karyawan" onChange={() => {}} />
          </div>
          <div>
            <InputField label="Perusahaan" required value={organizationChangeDetail?.new_position?.company || ''} disabled placeholder="Perusahaan" onChange={() => {}} />
          </div>
          <div>
            <InputField label="Kantor" required value={organizationChangeDetail?.new_position?.office || ''} disabled placeholder="Kantor" onChange={() => {}} />
          </div>
          <div>
            <InputField label="Direktorat" required value={organizationChangeDetail?.new_position?.directorate || ''} disabled placeholder="Direktorat" onChange={() => {}} />
          </div>
          <div>
            <InputField label="Divisi" required value={organizationChangeDetail?.new_position?.division || ''} disabled placeholder="Divisi" onChange={() => {}} />
          </div>
          <div>
            <InputField label="Departemen" required value={organizationChangeDetail?.new_position?.department || ''} disabled placeholder="Departemen" onChange={() => {}} />
          </div>
          <div>
            <InputField label="Unit" value={organizationChangeDetail?.new_position?.unit || ''} disabled placeholder="Unit" onChange={() => {}} />
          </div>
          <div>
            <InputField label="Posisi" required value={organizationChangeDetail?.new_position?.position || ''} disabled placeholder="Posisi" onChange={() => {}} />
          </div>
          <div>
            <InputField label="Jabatan Kepangkatan" required value={organizationChangeDetail?.new_position?.rank_position || ''} disabled placeholder="Jabatan Kepangkatan" onChange={() => {}} />
          </div>
          <div>
            <InputField label="Jabatan Struktural" required value={organizationChangeDetail?.new_position?.structural_position || ''} disabled placeholder="Jabatan Struktural" onChange={() => {}} />
          </div>
          <div>
            <InputField label="Jenjang Jabatan" required value={organizationChangeDetail?.new_position?.position_level || ''} disabled placeholder="Jenjang Jabatan" onChange={() => {}} />
          </div>
          <div>
            <InputField
              label="Golongan"
              required
              value={organizationChangeDetail?.new_position?.grade || ''}
              disabled
              placeholder="Otomatis dari Jabatan"
              onChange={() => {}}
            />
          </div>
          <div>
            <InputField label="Gaji Pokok" placeholder="Input" value={currency(organizationChangeDetail?.new_position?.base_salary || 0)} disabled onChange={() => {}} />
          </div>
          <div>
            <InputField label="Tunjangan Pernikahan" placeholder="Input" value={currency(organizationChangeDetail?.new_position?.marriage_allowance || 0)} disabled onChange={() => {}} />
          </div>
          <div>
            <InputField label="Tunjangan Jabatan" placeholder="Input" value={currency(organizationChangeDetail?.new_position?.position_allowance || 0)} disabled onChange={() => {}} />
          </div>
          <div>
            <InputField label="Tunjangan Lama Kerja" placeholder="Input" value={currency(organizationChangeDetail?.new_position?.tenure_allowance || 0)} disabled onChange={() => {}} />
          </div>
          <div className="md:col-span-2">
            <div className="space-y-4">
              {organizationChangeDetail?.new_position?.non_fix_allowance?.map((allowance: NonFixAllowanceItemEntity, index: number) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-6">
                    <InputField
                      label="Jenis Tunjangan Diskresi"
                      value={allowance.allowance_name || ''}
                      disabled
                      placeholder="Tunjangan Tidak Tetap"
                    />
                  </div>
                  <div className="md:col-span-6 flex items-end gap-2">
                    <div className="flex-1">
                      <InputField
                        label="Nominal"
                        value={currency(Number(allowance.amount) || 0)}
                        disabled
                        placeholder="Rp 0"
                      />
                    </div>
                  </div>
                </div>
              )) || <div></div>}
            </div>
          </div>
          <div className="md:col-span-2">
            <InputField
              label="Gaji Bersih"
              placeholder="Otomatis"
              disabled
              value={currency(organizationChangeDetail?.new_position?.take_home_pay || 0)}
              onChange={() => {}}
            />
          </div>
          <div className="col-span-1">
            {organizationChangeDetail?.decree_file ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sk Perubahan</label>
                <LinkPreview 
                  label="Lihat Sk Perubahan" 
                  url={organizationChangeDetail.decree_file} 
                  onClick={() => handleViewFile({ fileUrl: organizationChangeDetail.decree_file })}
                />
              </div>
            ) : (
              <FIleField label="Upload Sk Perubahan" onChange={(e) => setSkFile(e.target.files?.[0] || null)} disabled={atasan === 'true'} />
            )}
          </div>
          <div className="col-span-1">
            {organizationChangeDetail?.adendum_file ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Adendum</label>
                <LinkPreview 
                  label="Lihat Adendum" 
                  url={organizationChangeDetail.adendum_file} 
                  onClick={() => handleViewFile({ fileUrl: organizationChangeDetail.adendum_file })}
                />
              </div>
            ) : (
              <FIleField 
                label="Upload Adendum" 
                onChange={(e) => setAdendumFile(e.target.files?.[0] || null)} 
                disabled={!!organizationChangeDetail?.decree_file || atasan === 'true'}
              />
            )}
          </div>
          <div className="col-span-1 md:col-span-2">
            <TextAreaField
              label="Alasan Perubahan"
              required
              placeholder="Masukkan alasan perubahan"
              value={organizationChangeDetail?.reason_change || ''}
              disabled
              rows={4}
              onChange={() => {}}
            />
          </div>
          {!organizationChangeDetail?.decree_file && atasan !== 'true' && (
            <div className="col-span-1 md:col-span-2 flex justify-end">
              <Button
                variant="custom"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                onClick={handleSubmit}
                disabled={loading || (!skFile && !adendumFile)}
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          )}
        </div>
      </PayrollCard>
      </div>
   
    </div>
  );
};

export default DetailOrganizationHistoryPage;
