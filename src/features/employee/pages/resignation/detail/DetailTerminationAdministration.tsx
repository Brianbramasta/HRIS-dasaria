import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../../../../components/ui/button/Button';
import Label from '../../../../../components/form/Label';
import TextArea from '../../../../../components/form/input/TextArea';
import FileInput from '../../../../../components/form/input/FileInput';
import SelectField from '../../../../../components/shared/field/SelectField';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../../../../components/ui/table';
import { IconFileDetail, IconHapus, IconPlus } from '@/icons/components/icons';
import DoneOffBoardingModal from '../../../components/modals/termination/DoneOffBoardingModal';
import { formatDateToIndonesian } from '@/utils/formatDate';
import PdfPreviewEmbed from '@/components/shared/modal/PdfPreviewEmbed';
import { useDetailTerminationAdministration } from '../../../hooks/resignation/useDetailTerminationAdministration';

export default function DetailTerminationAdministrationPage() {
  const { id } = useParams();
  const [comment, setComment] = useState('');

  const {
    loading,
    error,
    isDoneOpen,
    uploadRows,
    temporaryFileUrl,
    data,
    documentTypes,
    adminDetail,
    handleAddRow,
    handleRemoveRow,
    handleRowTypeChange,
    handleRowFileChange,
    handleResetUploadRows,
    handlePreviewPDF,
    handleOpenDone,
    handleCloseDone,
    handleConfirmDone,
    fetchAdministrationDetail,
    uploadAdministrationDocuments,
    deleteAdministrationDocument,
    navigate,
    handleViewFileByUrl,
  } = useDetailTerminationAdministration(id);

  if (!data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Terminasi Administrasi</h1>
        {loading ? (
          <div className="text-center py-8">Memuat data...</div>
        ) : (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            <p>{error || 'Data tidak ditemukan.'}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Terminasi Administrasi</h1>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <p>Terjadi kesalahan: {error}</p>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center gap-3">
            <PdfPreviewEmbed
              fileUrl={temporaryFileUrl || undefined}
              className="w-full md:h-full min-h-[300px] md:min-h-max"
            />
            <Button size="sm" variant="primary" onClick={handlePreviewPDF}>
              Pratinjau PDF
            </Button>
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <div className="text-sm text-gray-600">Nama Lengkap</div>
                <div className="font-medium">{data.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">NIP</div>
                <div className="font-medium">{data.idKaryawan}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Posisi</div>
                <div className="font-medium">{data.posisi}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Status Berakhir</div>
                <div className="font-medium">{data.statusBerakhir}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Tanggal Pengajuan</div>
                <div className="font-medium">{formatDateToIndonesian(data.tanggalPengajuan) || data.tanggalPengajuan}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Tanggal Efektif</div>
                <div className="font-medium">{formatDateToIndonesian(data.tanggalEfektif) || data.tanggalEfektif}</div>
              </div>
            </div>
            <div className="mt-6">
              <Label>Catatan</Label>
              <TextArea
                placeholder="Enter as description ..."
                value={comment}
                disabled
                onChange={(value: any) => setComment(typeof value === 'string' ? value : value.target?.value || '')}
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

     {(adminDetail?.resignation_details?.status_terminasi !== 'Selesai' ) && ( <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
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
                      const isUploaded = (adminDetail?.resignation_documents || [])
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
                <div className="grid grid-cols-1 gap-3 items-center">
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
              const ok = await uploadAdministrationDocuments(id, { document_type_ids: typeIds, files });
              if (ok) {
                await fetchAdministrationDetail(id);
                // Clear all upload rows and reset to single empty row
                handleResetUploadRows();
              }
            }}
          >
            Upload
          </Button>
        </div>
      </div>
      )}

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
              {(adminDetail?.resignation_documents?.length || 0) === 0 && (
                <TableRow>
                  <TableCell className="px-4 py-3 text-center" colSpan={4}>Belum ada dokumen</TableCell>
                </TableRow>
              )}
              {(adminDetail?.resignation_documents || []).map((d, i) => (
                <TableRow key={`${d.id}-${i}`} className="border-t border-gray-200 dark:border-gray-800">
                  <TableCell className="px-4 py-3">{i + 1}</TableCell>
                  <TableCell className="px-4 py-3">{(d as any)?.file_type_name}</TableCell>
                  <TableCell className="px-4 py-3">{(d as any)?.document_name}</TableCell>
                  <TableCell className="px-4 py-3">
                    {(adminDetail?.resignation_details?.status_terminasi !== 'Selesai' ) && (
                      <Button
                      variant="custom"
                      size="sm"
                      className="btn-primary"
                      onClick={async () => {
                        if (id && d.id) {
                          const success = await deleteAdministrationDocument(id, d.id);
                          if (success) {
                            await fetchAdministrationDetail(id);
                          }
                        }
                      }}
                    >
                      <IconHapus  />
                    </Button>
                    )}
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
              {(adminDetail?.resignation_details?.status_terminasi !== 'Selesai' ) && (
                <div className="flex items-center justify-end">
                  <div className="flex items-center gap-3">
                    <Button variant="custom" className="border border-gray-300" onClick={() => navigate('/resignation/termination-administration')}>
                      Tutup
                    </Button>
                    <Button
                      variant="custom"
                      className="bg-green-500 text-white disabled:opacity-50"
                      onClick={handleOpenDone}
                      disabled={loading}
                    >
                      Selesai
                    </Button>
                  </div>
                </div>
                )}

      <DoneOffBoardingModal
        isOpen={isDoneOpen}
        onClose={handleCloseDone}
        onConfirm={handleConfirmDone}
        submitting={loading}
        employeeName={data.name}
        effectiveDate={formatDateToIndonesian(data.tanggalEfektif) || data.tanggalEfektif}
      />
    </div>
  );
}
