import { Eye } from 'react-feather';
import { IconFileDetail } from '@/icons/components/icons';
import { useParams, useNavigate } from 'react-router';
import ExpandCard from '../../components/card/ExpandCard';
import DocumentsTable from '../../components/table/TableGlobal';
import useDetailBusinessLines from '../../hooks/business-lines/useDetailBusinessLines';
export default function DetailLiniBisnis() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { title, overviewText, personalFiles, companies, loading, error } = useDetailBusinessLines(id as string | undefined);


  return (
    <div className="space-y-6 dark:text-white">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h1>
        {/* <p className="text-gray-500 dark:text-gray-400 text-sm">Detail Lini Bisnis {id ? `#${id}` : ''}</p> */}
          {loading && <p className="text-gray-500 dark:text-gray-400 text-sm">Memuat data…</p>}
          {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
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
