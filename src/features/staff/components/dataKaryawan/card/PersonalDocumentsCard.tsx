import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import Button from '@/components/ui/button/Button';
import { Download, Eye, Edit2 } from 'react-feather';
import React from 'react';

export default function PersonalDocumentsCard() {
  const [personalFiles, setPersonalFiles] = React.useState<Array<{ no: number; namaFile: string; dokumen: string }>>([]);

  React.useEffect(() => {
    setPersonalFiles([
      {
        no: 1,
        namaFile: 'KTP',
        dokumen: 'data.ktp',
      },
      {
        no: 2,
        namaFile: 'KK',
        dokumen: 'data.kk',
      },
    ]);
  }, []);

  return (
    <ExpandCard title="Berkas/Dokumen Pribadi" withHeaderDivider>
      <div className="grid grid-cols-1 gap-4 ">
        <Table className="min-w-[640px] md:min-w-full">
          <TableHeader>
            <TableRow className="bg-brand-900 text-white">
              <TableCell isHeader className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                No.
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Nama File
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Dokumen
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                Action
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {personalFiles?.length ? (
              personalFiles.map((f) => (
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
              ))
            ) : (
              <TableRow key="no-files" className="border-b border-gray-100 dark:border-gray-800">
                <TableCell colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Tidak ada berkas/dokumen pribadi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="outline" size="sm">
          <Edit2 size={16} className="mr-2" /> Edit
        </Button>
      </div>
    </ExpandCard>
  );
}