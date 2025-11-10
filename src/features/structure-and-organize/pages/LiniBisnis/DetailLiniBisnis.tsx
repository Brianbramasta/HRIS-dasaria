import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../../../components/ui/table';
import { FileText, Eye, Download } from 'react-feather';
import { useParams, Link } from 'react-router';
import ExpandCard from '../../components/card/ExpandCard';

export default function DetailLiniBisnis() {
  const { id } = useParams();

  // Static content for now
  const overviewText = `Lorem ipsum dolor sit amet consectetur. Ut semper sodales elementum in sit donec consequat suspendisse est. Morbi dolor semper urna tincidunt nec habitant sit urna. Turpis ultricies consectetur purus ipsum pellentesque in. Volutpat duis arcu eget pulvinar commodo ornare tincidunt. Aliquam tincidunt nec vitae fermentum amet amet feugiat.`;

  const personalFiles = [
    { no: 1, namaFile: 'Foto Terbaru', dokumen: 'foto.jpg' },
    { no: 2, namaFile: 'Kartu Tanda Penduduk', dokumen: 'ktp.pdf' },
    { no: 3, namaFile: 'Ijazah Terakhir', dokumen: 'ijazah.pdf' },
    { no: 4, namaFile: 'Kartu Keluarga', dokumen: 'kk.pdf' },
    { no: 5, namaFile: 'BPJS Kesehatan', dokumen: 'bpjs.pdf' },
  ];

  const companies = [
    { no: 1, nama: 'Dasarata', dokumen: 'profil.pdf' },
    { no: 2, nama: 'GriyaNet', dokumen: 'profil.pdf' },
  ];

  const employees = [
    { no: 1, idKaryawan: 'EMP001', namaKaryawan: 'Budi Santoso' },
    { no: 2, idKaryawan: 'EMP002', namaKaryawan: 'Siti Nurhaliza' },
    { no: 3, idKaryawan: 'EMP003', namaKaryawan: 'Ahmad Rahman' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Internet Service Providers</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Detail Lini Bisnis {id ? `#${id}` : ''}</p>
      </div>

      {/* Overview */}
      <ExpandCard title="Overview" leftIcon={<FileText size={18} className="text-gray-400" />} defaultOpen contentClassName="px-6 pb-6">
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{overviewText}</p>
      </ExpandCard>

      {/* Berkas/Dokumen Pribadi */}
      <ExpandCard title="Berkas/Dokumen Pribadi" withHeaderDivider defaultOpen>
        <div className="p-0">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-brand-900 text-white">
                <TableCell isHeader className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">No.</TableCell>
                <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nama File</TableCell>
                <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Dokumen</TableCell>
                <TableCell isHeader className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {personalFiles.map((f) => (
                <TableRow key={f.no} className="border-b border-gray-100 dark:border-gray-800">
                  <TableCell className="px-6 py-4 text-center text-sm">{f.no}</TableCell>
                  <TableCell className="px-6 py-4 text-sm">{f.namaFile}</TableCell>
                  <TableCell className="px-6 py-4 text-sm">{f.dokumen}</TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="rounded-md border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50">
                        <Eye size={16} />
                      </button>
                      <button className="rounded-md border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50">
                        <Download size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ExpandCard>

      {/* Daftar Perusahaan */}
      <ExpandCard title="Daftar Perusahaan" withHeaderDivider defaultOpen>
        <div className="p-0">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-brand-900 text-white">
                <TableCell isHeader className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">No.</TableCell>
                <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nama</TableCell>
                <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Dokumen</TableCell>
                <TableCell isHeader className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((c) => (
                <TableRow key={c.no} className="border-b border-gray-100 dark:border-gray-800">
                  <TableCell className="px-6 py-4 text-center text-sm">{c.no}</TableCell>
                  <TableCell className="px-6 py-4 text-sm">{c.nama}</TableCell>
                  <TableCell className="px-6 py-4 text-sm">{c.dokumen}</TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="rounded-md border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50">
                        <Eye size={16} />
                      </button>
                      <button className="rounded-md border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50">
                        <Download size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ExpandCard>

      {/* Daftar Karyawan */}
      <ExpandCard title="Daftar Karyawan" withHeaderDivider defaultOpen>
        <div className="p-0">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-brand-900 text-white">
                <TableCell isHeader className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">No.</TableCell>
                <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID Karyawan</TableCell>
                <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nama Karyawan</TableCell>
                <TableCell isHeader className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((e) => (
                <TableRow key={e.no} className="border-b border-gray-100 dark:border-gray-800">
                  <TableCell className="px-6 py-4 text-center text-sm">{e.no}</TableCell>
                  <TableCell className="px-6 py-4 text-sm">{e.idKaryawan}</TableCell>
                  <TableCell className="px-6 py-4 text-sm">{e.namaKaryawan}</TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="rounded-md border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50">
                        <Eye size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ExpandCard>

      {/* Back link to list */}
      <div className="flex justify-end">
        <Link to="/structure-and-organize/business-lines" className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">Kembali ke daftar Lini Bisnis</Link>
      </div>
    </div>
  );
}