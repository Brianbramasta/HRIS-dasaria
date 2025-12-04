import React from 'react';
import { Eye } from 'react-feather';
import { IconFileDetail } from '@/icons/components/icons';
import { useParams, useNavigate } from 'react-router';
import ExpandCard from '../../components/card/ExpandCard';
import { businessLineService } from '../../services/organization.service';
import DocumentsTable from '../../components/table/TableGlobal';
import { formatUrlFile } from '@/utils/formatUrlFile';
export default function DetailLiniBisnis() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = React.useState<string>('Detail Lini Bisnis');
  const [overviewText, setOverviewText] = React.useState<string>('');
  const [personalFiles, setPersonalFiles] = React.useState<Array<{ no: number; namaFile: string; dokumen: string }>>([]);
  const [companies, setCompanies] = React.useState<Array<{ no: number; nama: string; dokumen: string, companyId: string }>>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        // Gunakan endpoint komposit: GET /business-lines/:id/detail
        const detail = await businessLineService.getDetail(id);
        setTitle(detail?.businessLine?.name ?? 'Detail Lini Bisnis');
        setOverviewText(detail?.businessLine?.description ?? '—');
        console.log('detail',detail)
        const files = detail?.personalFiles || [];
        console.log('files',files)
        setPersonalFiles(files.map((f: any, idx: number) => ({ no: idx + 1, namaFile: f.fileName || '—', dokumen: f.fileName || '—', memoNumber:detail?.businessLine?.memoNumber || '—', fileUrl: formatUrlFile(f.fileUrl) || '—' })));

        const comps = detail?.companies || [];
        setCompanies(comps.map((c: any, idx: number) => ({ no: idx + 1, nama: c.name, dokumen: c.details ? c.details : '—', companyId: c.id })));
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
        {/* <p className="text-gray-500 dark:text-gray-400 text-sm">Detail Lini Bisnis {id ? `#${id}` : ''}</p> */}
        {loading && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">Memuat data…</p>
        )}
        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        )}
      </div>

      {/* Overview */}
      <ExpandCard title="Overview"  defaultOpen contentClassName="px-6 pb-6">
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{overviewText}</p>
      </ExpandCard>

      {/* Berkas/Dokumen Pribadi */}
      <ExpandCard title="Berkas/Dokumen Pribadi" withHeaderDivider defaultOpen>
        <DocumentsTable
          items={personalFiles as any}
          columns={[
            { id: 'no', label: 'No.', align: 'center' },
            { id: 'memoNumber', label: 'Surat Keputusan / Memo Internal' },
            { id: 'namaFile', label: 'Nama File' },
          ] as any}
          actions={[
            {
              icon: <IconFileDetail  />,
              onClick: (row: any) => { window.open(row.fileUrl, '_blank'); /* preview */ console.log('preview', row); },
            }
          ]}
        />
      </ExpandCard>

      {/* Daftar Perusahaan */}
      <ExpandCard title="Daftar Perusahaan" withHeaderDivider defaultOpen>
        <DocumentsTable
        title='Perusahaan'
          items={companies as any}
          columns={[
            { id: 'no', label: 'No.', align: 'center' },
            { id: 'nama', label: 'Nama' },
            { id: 'dokumen', label: 'Deskripsi' },
          ] as any}
          actions={[
            {
              icon: <Eye size={16} />,
              className: 'rounded-md border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50',
              onClick: (row: any) => navigate(`/structure-and-organize/companies/${row.companyId}`),
            }
          ]}
        />
      </ExpandCard>


      {/* Back link to list */}
      {/* <div className="flex justify-end">
        <button onClick={() => navigate('/structure-and-organize/business-lines')} className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">Kembali ke daftar Lini Bisnis</button>
      </div> */}
    </div>
  );
}
