import { useParams } from 'react-router-dom';
import Button from '../../../../../components/ui/button/Button';
import Label from '../../../../../components/form/Label';
import TextArea from '../../../../../components/form/input/TextArea';
import FileInput from '../../../../../components/form/input/FileInput';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../../../../components/ui/table';
import { IconHapus, IconPlus } from '@/icons/components/icons';
import { useDetailResignation } from '../../../hooks/resignation/useDetailResignation';

export default function DetailPengunduranDiriPage() {
  const { id } = useParams();
  const {
    data,
    loading,
    docs,
    docTypes,
    uploadRows,
    handleApprove,
    handleReject,
    handleAddRow,
    handleRemoveRow,
    handleRowTypeChange,
    handleRowFileChange,
    handleUploadRows,
    handleRemoveDocument,
    handlePreviewPDF,
  } = useDetailResignation(id);

  if (loading) {
    return <div>Memuat...</div>;
  }

  if (!data) {
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
            <img
              src={
                data.avatar ||
                'https://images.unsplash.com/photo-1544511852-3dfd9dcbf5a0?q=80&w=540&auto=format&fit=crop'
              }
              alt="Preview"
              className="h-full w-40 rounded object-cover"
            />
            <Button size="sm" variant="primary" onClick={handlePreviewPDF}>
              Preview PDF
            </Button>
          </div>

          {/* Right: Details */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <div className="text-sm text-gray-600">Nama Lengkap</div>
                <div className="font-medium">{data.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">NIP</div>
                <div className="font-medium">{data.idKaryawan}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Tanggal Pengajuan</div>
                <div className="font-medium">{data.tanggalPengajuan}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Sisa Kontrak</div>
                <div className="font-medium">5 Bulan</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Posisi</div>
                <div className="font-medium">{data.posisi || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Jenis Kontrak</div>
                <div className="font-medium">PKWT</div>
              </div>
            </div>
            <div className="mt-6">
              <Label>Alasan Pengunduran Diri</Label>
              <TextArea placeholder="Enter as description ..." value={data.alasan} disabled rows={3} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="font-semibold mb-4">Berkas / Dokumen</div>
        <div className="space-y-3">
          {uploadRows.map((row, index) => (
            <div key={row.id} className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_1fr_auto]">
              <div>
                <Label>Tipe File</Label>
                <select
                  value={row.type}
                  onChange={(e) => handleRowTypeChange(row.id, e.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                >
                  <option value="">Pilih Jenis Dokumen</option>
                  {docTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
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
          <Button type="button" size="sm" variant="primary" onClick={handleUploadRows}>Upload</Button>
        </div>
      </div>

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
              {docs.length === 0 && (
                <TableRow>
                  <TableCell className="px-4 py-3" colSpan={4}>Belum ada dokumen</TableCell>
                </TableRow>
              )}
              {docs.map((d, i) => (
                <TableRow key={`${d.namaFile}-${i}`} className="border-t border-gray-200 dark:border-gray-800">
                  <TableCell className="px-4 py-3">{i + 1}</TableCell>
                  <TableCell className="px-4 py-3">{d.tipeFile}</TableCell>
                  <TableCell className="px-4 py-3">{d.namaFile}</TableCell>
                  <TableCell className="px-4 py-3">
                    <Button variant="custom" size="sm" className="btn-danger" onClick={() => handleRemoveDocument(i)}><IconHapus/></Button>
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
        <div className="flex items-center gap-3">
          <Button variant="custom" className="border border-[#DC3545] text-[#DC3545]" onClick={handleReject}>Ditolak</Button>
          <Button variant="custom" className="bg-green-500 text-white" onClick={handleApprove}>Disetujui</Button>
        </div>
      </div>
    </div>
  );
}
