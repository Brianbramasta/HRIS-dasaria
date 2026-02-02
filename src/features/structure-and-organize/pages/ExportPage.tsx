import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ExportState {
  title: string;
  columns: string[]; // headers
  rows: Record<string, any>[]; // { header: value }
}

export default function ExportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as Partial<ExportState>;

  useEffect(() => {
    // Jika tidak ada data, kembali
    if (!state.columns || !state.rows) {
      navigate(-1);
      return;
    }
    // Auto open print dialog setelah mount
    const id = window.setTimeout(() => {
      window.print();
    }, 300);
    return () => window.clearTimeout(id);
  }, [state.columns, state.rows, navigate]);

  if (!state.columns || !state.rows) {
    return null;
  }

  return (
    <>
    <style>
      {`
        @media print {
          @page {
            size: landscape;
            margin: 5mm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}
    </style>
    <div className="bg-white p-8 border-b border-[#000] mb-6 print:p-2 print:mb-4">
        {/* Header statis */}
        <div className="flex items-center gap-4 justify-center">
        <img src="/images/logo/logo-dasaria.svg" alt="Dasaria" className="h-20 w-20 print:h-12 print:w-12" />
        
        <div>
          <h1 className="text-3xl font-semibold text-center print:text-xl">Dasaria - Struktur Organisasi</h1>
          <p className="text-lg text-gray-600 text-center print:text-xs">Jl. Kwoka G48, Kota Malang, Jawa Timur 65146 Telepon 0821-3006-0073</p>
        </div>
      </div>
    </div>
    <div className="p-8 print:p-0">
      
     

      {/* Judul laporan */}
      <h2 className="mb-4 text-lg font-medium print:text-sm print:mb-2">{state.title}</h2>

      {/* Tabel hasil ekspor */}
      <div className="overflow-x-auto print:overflow-visible">
        <table className="min-w-full border border-gray-200 w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              {state.columns.map((col) => (
                <th key={col} className="border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-700 print:text-[9px] print:px-1 print:py-1 whitespace-normal">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {state.rows.map((row, idx) => (
              <tr key={idx} className="even:bg-gray-50 print:break-inside-avoid">
                {state.columns?.map((col) => (
                  <td key={col} className="border border-gray-200 px-3 py-2 text-sm print:text-[9px] print:px-1 print:py-1 whitespace-normal break-words">
                    {row[col] ?? ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}