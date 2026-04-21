import { useParams } from 'react-router-dom';
import Button from '../../../../../components/ui/button/Button';
import Label from '../../../../../components/form/Label';
import TextArea from '../../../../../components/form/input/TextArea';
import FileInput from '../../../../../components/form/input/FileInput';
import SelectField from '../../../../../components/shared/field/SelectField';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../../../../components/ui/table';
import { IconFileDetail, IconHapus, IconPlus } from '@/icons/components/icons';
import { useDetailResignation } from '../../../hooks/resignation/useDetailResignation';
import EffectiveResignationDateModal from '../../../components/modals/resignation/EffectiveResignationDateModal';
import RejectionConfirmtionResignnationModal from '../../../components/modals/resignation/RejectionConfirmtionResignnationModal';
import { useApiResignation } from '../../../hooks/api/useApiResignation';
import { useEffect, useState } from 'react';
import { formatDateToIndonesian } from '@/utils/formatDate';
import {  useNavigate } from 'react-router';
import { handleViewFileByUrl, getTemporaryUrl } from '@/utils/viewFileHandle';
import PdfPreviewEmbed from '@/components/shared/modal/PdfPreviewEmbed';
import LinkPreview from '@/components/shared/form/LinkPreview';


export default function DetailPengunduranDiriPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [temporaryFileUrl, setTemporaryFileUrl] = useState<string>('');
  const {
    data,
    loading,
    uploadRows,
    isModalOpen,
    isRejectModalOpen,
    isSubmitting,
    handleOpenModal,
    handleCloseModal,
    openRejectModal,
    closeRejectModal,
    handleAddRow,
    handleRemoveRow,
    handleRowTypeChange,
    handleRowFileChange,
    handleResetUploadRows,
    handlePreviewPDF,
  } = useDetailResignation(id);
  const {
    approveApplication,
    rejectApplication,
    saveDraftApplication,
    applicationDetail,
    fetchApplicationDetail,
    loading: apiLoading,
    uploadApplicationDocuments,
    documentTypes,
    fetchDocumentTypes,
    deleteDocument,
  } = useApiResignation();

  useEffect(() => {
    if (id) {
      fetchApplicationDetail(id);
    }
  }, [id]);

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  // Fetch temporary URL for contract document
  useEffect(() => {
    const fetchTemporaryUrl = async () => {
      const documentUrl = applicationDetail?.resignationDetails?.file_contract;
      if (documentUrl) {
        try {
          const temporaryUrlData = await getTemporaryUrl(documentUrl);
          if (temporaryUrlData?.temporary_url) {
            setTemporaryFileUrl(temporaryUrlData.temporary_url);
          }
        } catch (error) {
          console.error('Error fetching temporary URL:', error);
        }
      }
    };

    fetchTemporaryUrl();
  }, [applicationDetail?.resignationDetails?.file_contract]);
  if (apiLoading || loading) {
    return <div>Memuat...</div>;
  }

  if (!applicationDetail) {
    return <div>Data tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6">
      
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pengunduran Diri</h1>

      {/* Header card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left: Preview image + button */}
          <div className="flex flex-col items-center gap-3">
            <PdfPreviewEmbed
              fileUrl={temporaryFileUrl || undefined}
              className="w-full md:h-full min-h-[300px] md:min-h-max"
            />
            <Button size="sm" variant="primary" onClick={() => handlePreviewPDF(applicationDetail?.resignationDetails?.file_contract || '')}>
              Preview PDF
            </Button>
          </div>

          {/* Right: Details */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <div className="text-sm text-gray-600">Nama Lengkap</div>
                <div className="font-medium">
                  {applicationDetail?.resignationDetails?.full_name || data?.name}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">NIP</div>
                <div className="font-medium">
                  {applicationDetail?.resignationDetails?.NIP || data?.idKaryawan}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Tanggal Pengajuan</div>
                <div className="font-medium">
                  {(() => {
                    const raw = applicationDetail?.resignationDetails?.tanggal_pengajuan || data?.tanggalPengajuan || '';
                    const f = formatDateToIndonesian(String(raw));
                    return f || raw;
                  })()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Sisa Kontrak</div>
                <div className="font-medium">
                  {applicationDetail?.resignationDetails?.sisa_kontrak_bulan ?? '5 Bulan'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Posisi</div>
                <div className="font-medium">
                  {applicationDetail?.resignationDetails?.position_name || data?.posisi || '-'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Jenis Kontrak</div>
                <div className="font-medium">
                  {applicationDetail?.resignationDetails?.jenis_kontrak || 'PKWT'}
                </div>
              </div>
            </div>
            {applicationDetail?.resignationDetails?.letter_of_commitment && (<div className="mt-6">
              <Label>Surat Komitmen Pelunasan</Label>
              <LinkPreview 
                url={applicationDetail?.resignationDetails?.letter_of_commitment}
                label="Lihat Detail"
                disabled={!applicationDetail?.resignationDetails?.letter_of_commitment}
                onClick={() => applicationDetail?.resignationDetails?.letter_of_commitment && handleViewFileByUrl(applicationDetail.resignationDetails.letter_of_commitment)}
              />
            </div>)}
            <div className="mt-6">
              <Label>Alasan Pengunduran Diri</Label>
              <TextArea
                placeholder="Enter as description ..."
                value={
                  (applicationDetail?.resignationDetails?.resignation_reason as any) ||
                  (data?.alasan as any)
                }
                disabled
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      {!(applicationDetail?.resignationDetails?.status_name && ['Disetujui', 'Ditolak'].includes(applicationDetail?.resignationDetails?.status_name)) && ( <>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="font-semibold mb-4">Berkas / Dokumen</div>
        <div className="space-y-3">
          {uploadRows.map((row, index) => (
            <div key={row.id} className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_1fr_auto]">
              <div>
                <Label>Tipe File</Label>
                <SelectField
                  options={(documentTypes || [])
                    .filter((t: any) => {
                      // Exclude types already uploaded
                      const isUploaded = (applicationDetail?.resignationDocuments || [])
                        .some((d: any) => d?.document_type_id === t?.id);
                      
                      // Exclude types already selected in other rows (excluding current row)
                      const isSelectedInOtherRow = uploadRows
                        .filter((r) => r.id !== row.id)
                        .some((r) => r.type === t?.id);
                      
                      return !isUploaded && !isSelectedInOtherRow;
                    })
                    .map((t: any) => ({
                      value: t.id,
                      label: t.file_type_name || t.name,
                    }))}
                  placeholder="Pilih Jenis Dokumen"
                  defaultValue={row.type || ''}
                  onChange={(val) => handleRowTypeChange(row.id, val)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>
              <div>
                <Label>Upload file</Label>
                <div className="grid grid-cols-1 gap-3  items-center">
                  <FileInput onChange={(e) => handleRowFileChange(row.id, e)} />
                </div>
              </div>
              <div className="self-end md:self-auto">
                {index === 0 ? (
                  <Button type="button" size="sm" variant="custom" className="px-3 py-3 rounded-full bg-green-500 text-white w-full md:w-fit" onClick={handleAddRow}><IconPlus color='white'/></Button>
                ) : (
                  <Button type="button" size="sm" variant="custom" className="px-3 py-3 rounded-full bg-red-500 text-white w-full md:w-fit" onClick={() => handleRemoveRow(row.id)}><IconHapus color="white"/></Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            size="sm"
            variant="primary"
            onClick={async () => {
              if (!id) return;
              const rows = uploadRows.filter((r) => r.type && r.file);
              if (!rows.length) return;
              const typeIds = rows.map((r) => r.type as string);
              const files = rows.map((r) => r.file!) as File[];
              const resignationId = applicationDetail?.resignationDetails?.resignation_id;
              if (!resignationId) return;
              const ok = await uploadApplicationDocuments(resignationId, { document_type_ids: typeIds, files });
              console.log(ok,'ok')
              if (ok) {
                console.log('test jalan')
                await fetchApplicationDetail(id);
                // Clear all upload rows and reset to single empty row
                handleResetUploadRows();
              }
            }}
          >
            Upload
          </Button>
        </div>
      </div>

      </>)}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <Table className='border'>
            <TableHeader>
              <TableRow className='bg-[#004969] text-white'>
                <TableCell isHeader className="px-4 py-2 ">No.</TableCell>
                <TableCell isHeader className="px-4 py-2 text-start ">Tipe File</TableCell>
                <TableCell isHeader className="px-4 py-2 text-start ">Nama File</TableCell>
                <TableCell isHeader className="px-4 py-2 text-start ">Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(applicationDetail?.resignationDocuments?.length || 0) === 0 && (
                <TableRow>
                  <TableCell className="px-4 py-3 text-center" colSpan={4}>Belum ada dokumen</TableCell>
                </TableRow>
              )}
              {(applicationDetail?.resignationDocuments || []).map((d, i) => (
                <TableRow key={`${d.id}-${i}`} className="border-t border-gray-200 dark:border-gray-800">
                  <TableCell className="px-4 py-3">{i + 1}</TableCell>
                  <TableCell className="px-4 py-3">{(d as any)?.file_type_name}</TableCell>
                  <TableCell className="px-4 py-3">{(d as any)?.document_name}</TableCell>
                  <TableCell className="px-4 py-3">
                    {!['Disetujui', 'Ditolak'].includes(applicationDetail?.resignationDetails?.status_name) ? (
                      <Button
                        variant="custom"
                        size="sm"
                        className="btn-primary"
                        onClick={async () => {
                          const resignationId = applicationDetail?.resignationDetails?.resignation_id;
                          if (resignationId && d.id) {
                            const success = await deleteDocument(resignationId, d.id);
                            if (success) {
                              await fetchApplicationDetail(id as string);
                            }
                          }
                        }}
                      >
                        <IconHapus  />
                      </Button>
                    ) : null}
                    <Button
                      variant="custom"
                      size="sm"
                      className="btn-primary"
                      onClick={() => {
                        const documentPath = (d as any)?.document_path;
                        if (documentPath) {
                          handleViewFileByUrl(documentPath);
                        }
                      }}
                    >
                      <IconFileDetail  />
                    </Button>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end">
        {/* <div className="flex items-center gap-3">
          <Label>Tanggal Efektif</Label>
          <Input type="text" placeholder="28 Januari 1999" value={tanggalEfektif} onChange={(e) => setTanggalEfektif(e.target.value)} />
        </div> */}
        {!(applicationDetail?.resignationDetails?.status_name && ['Disetujui', 'Ditolak'].includes(applicationDetail?.resignationDetails?.status_name)) && (
        <div className="flex items-center gap-3">
          <Button
            variant="custom"
            className=" text-[grey]"
            onClick={() => {
              const resignationId = applicationDetail?.resignationDetails?.resignation_id;
              if (resignationId) saveDraftApplication(resignationId);
              navigate(`/resignation`);
            }}
          >
            Save  Draft
          </Button>
          <Button variant="custom" className="border border-[#DC3545] text-[#DC3545]" onClick={openRejectModal}>Ditolak</Button>
          <Button variant="custom" className="bg-green-500 text-white" onClick={handleOpenModal}>Disetujui</Button>
        </div>
        )}
      </div>

      {/* Modal */}
      <EffectiveResignationDateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={(tgl) => {
          const resignationId = applicationDetail?.resignationDetails?.resignation_id;
          if (resignationId) approveApplication(resignationId, tgl);
          navigate(`/resignation`);
        }}
        submitting={isSubmitting}
        nip={applicationDetail?.resignationDetails?.NIP || data?.idKaryawan || ''}
        namaLengkap={applicationDetail?.resignationDetails?.full_name || data?.name || ''}
        posisi={applicationDetail?.resignationDetails?.position_name || data?.posisi || ''}
        tanggalPengajuan={applicationDetail?.resignationDetails?.tanggal_pengajuan || data?.tanggalPengajuan || ''}
      />

      <RejectionConfirmtionResignnationModal
        isOpen={isRejectModalOpen}
        onClose={closeRejectModal}
        onSubmit={async (note) => {
          const resignationId = applicationDetail?.resignationDetails?.resignation_id;
          if (resignationId) {
            await rejectApplication(resignationId, { note_hr: note });
            navigate(`/resignation`);
            closeRejectModal();
          }
        }}
        submitting={isSubmitting}
        nip={applicationDetail?.resignationDetails?.NIP || data?.idKaryawan || ''}
        namaLengkap={applicationDetail?.resignationDetails?.full_name || data?.name || ''}
      />
    </div>
  );
}
