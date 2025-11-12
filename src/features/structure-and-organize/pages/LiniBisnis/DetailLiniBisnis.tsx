import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../../../components/ui/table';
import { FileText, Eye, Download } from 'react-feather';
import { useParams, Link } from 'react-router';
import ExpandCard from '../../components/card/ExpandCard';
import { businessLineService } from '../../services/organization.service';
import { apiService } from '../../../../services/api';
import type { Company } from '../../types/organization.types';

export default function DetailLiniBisnis() {
  const { id } = useParams();

  const [title, setTitle] = React.useState<string>('Detail Lini Bisnis');
  const [overviewText, setOverviewText] = React.useState<string>('');
  const [personalFiles, setPersonalFiles] = React.useState<Array<{ no: number; namaFile: string; dokumen: string }>>([]);
  const [companies, setCompanies] = React.useState<Array<{ no: number; nama: string; dokumen: string }>>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  // Local type for files owned by business line
  interface OwnedFile {
    id: string;
    ownerType: 'business-line' | 'company' | string;
    ownerId: string;
    name: string;
    docNumber?: string;
    fileName: string;
    type?: string;
    size?: string;
    createdAt?: string;
  }

  React.useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch business line detail
        const bl = await businessLineService.getById(id);
        setTitle(bl?.name ?? 'Detail Lini Bisnis');
        setOverviewText(bl?.description ?? '—');

        // Fetch files for this business line
        const filesResp = await apiService.get<OwnedFile[]>(`/files?ownerType=business-line&ownerId=${id}`);
        const files = (filesResp?.data ?? []) as OwnedFile[];
        setPersonalFiles(files.map((f, idx) => ({ no: idx + 1, namaFile: f.name, dokumen: f.fileName || '—' })));

        // Fetch companies using this business line
        const companiesResp = await apiService.get<Company[]>(`/companies?businessLineId=${id}`);
        const comps = (companiesResp?.data ?? []) as Company[];
        setCompanies(comps.map((c, idx) => ({ no: idx + 1, nama: c.name, dokumen: c.details ? c.details : '—' })));
      } catch (err) {
        console.error('Failed to load business line detail:', err);
        setError(err instanceof Error ? err.message : 'Gagal memuat detail lini bisnis');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);


  return (
    <div className="space-y-6 dark:text-white">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Detail Lini Bisnis {id ? `#${id}` : ''}</p>
        {loading && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">Memuat data…</p>
        )}
        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        )}
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
              {personalFiles?.length ? personalFiles.map((f) => (
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
              )) : (
                <TableRow key="no-files" className="border-b border-gray-100 dark:border-gray-800">
                  <TableCell colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Tidak ada berkas/dokumen pribadi
                  </TableCell>
                </TableRow>
              )}
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
              {companies?.length ? companies.map((c) => (
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
              )) : (
                <TableRow key="no-companies" className="border-b border-gray-100 dark:border-gray-800">
                  <TableCell colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Tidak ada perusahaan
                  </TableCell>
                </TableRow>
              )}
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