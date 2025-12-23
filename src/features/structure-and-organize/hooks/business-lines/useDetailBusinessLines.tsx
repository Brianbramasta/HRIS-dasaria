import { useState, useEffect, useCallback } from 'react';
import { businessLinesService } from '../../services/request/BusinessLinesService';
import { formatUrlFile } from '@/utils/formatUrlFile';
import { FileSummary } from '../../types/OrganizationApiTypes';

type PersonalFileRow = {
  no: number;
  namaFile: string;
  dokumen: string;
  memoNumber: string;
  fileUrl: string;
};

type CompanyRow = {
  no: number;
  nama: string;
  dokumen: string;
  companyId: string;
};

const toFileSummary = (url: string | null): FileSummary | null => {
  if (!url) return null;
  const parts = url.split('/');
  const fileName = parts[parts.length - 1] || '';
  const ext = fileName.includes('.') ? fileName.split('.').pop() || '' : '';
  return {
    fileName,
    fileUrl: url,
    fileType: ext,
    size: null,
  };
};

const mapToBusinessLineDetail = (item: any): { businessLine: any; personalFiles: FileSummary[]; companies: any[] } => {
  const bl = {
    id: item.id,
    name: item.bl_name,
    description: item.bl_description ?? null,
    memoNumber: item.bl_decree_number ?? null,
    skFile: toFileSummary(item.bl_decree_file_url ?? item.bl_decree_file ?? null),
  };
  const activeSk = toFileSummary(item?.bl_decree_file_url ?? item?.bl_decree_file ?? null);
  const deleteSk = toFileSummary(item?.bl_delete_decree_file_url ?? item?.bl_delete_decree_file ?? null);
  const personalFiles: FileSummary[] = [];
  if (activeSk) personalFiles.push(activeSk);
  if (deleteSk) personalFiles.push(deleteSk);
  const companies = Array.isArray(item?.companies)
    ? item.companies.map((c: any) => ({
        id: c.id || '',
        name: c.company_name || '',
        details: c.company_description ?? null,
      }))
    : [];

  return { businessLine: bl, personalFiles, companies };
};

export default function useDetailBusinessLines(id?: string | undefined) {
  const [title, setTitle] = useState<string>('Detail Lini Bisnis');
  const [overviewText, setOverviewText] = useState<string>('');
  const [personalFiles, setPersonalFiles] = useState<PersonalFileRow[]>([]);
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await businessLinesService.getDetail(id);
      const item = (resp as any)?.data as any;
      if (!item) {
        setError('Data tidak ditemukan');
        return;
      }
      const { businessLine, personalFiles: files, companies: comps } = mapToBusinessLineDetail(item);

      setTitle(businessLine?.name ?? 'Detail Lini Bisnis');
      setOverviewText(businessLine?.description ?? '—');

      setPersonalFiles(
        (files || []).map((f: FileSummary, idx: number) => ({
          no: idx + 1,
          namaFile: f.fileName || '—',
          dokumen: f.fileName || '—',
          memoNumber: businessLine?.memoNumber || '—',
          fileUrl: formatUrlFile(f.fileUrl) || '—',
        }))
      );

      setCompanies(
        (comps || []).map((c: any, idx: number) => ({
          no: idx + 1,
          nama: c.name,
          dokumen: c.details ? c.details : '—',
          companyId: c.id,
        }))
      );
    } catch (err) {
      console.error('Failed to load business line detail:', err);
      setError(err instanceof Error ? err.message : 'Gagal memuat detail lini bisnis');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [id, load]);

  return {
    title,
    overviewText,
    personalFiles,
    companies,
    loading,
    error,
    reload: load,
  };
}
