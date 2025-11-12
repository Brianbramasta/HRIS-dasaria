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
    <div className="bg-white p-8 border-b border-[#000] mb-6 ">
        {/* Header statis */}
        <div className="flex items-center gap-4 justify-center">
        <img src="/images/logo/logo-dasaria.svg" alt="Dasaria" className="h-20 w-20" />
        
        <div>
          <h1 className="text-3xl font-semibold text-center">Dasaria - Struktur Organisasi</h1>
          <p className="text-lg text-gray-600 text-center">Jl. Kwoka G48, Kota Malang, Jawa Timur 65146 Telepon 0821-3006-0073</p>
        </div>
      </div>
    </div>
    <div className="p-8 print:p-0">
      
     

      {/* Judul laporan */}
      <h2 className="mb-4 text-lg font-medium">{state.title}</h2>

      {/* Tabel hasil ekspor */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              {state.columns.map((col) => (
                <th key={col} className="border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-700">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {state.rows.map((row, idx) => (
              <tr key={idx} className="even:bg-gray-50">
                {state.columns?.map((col) => (
                  <td key={col} className="border border-gray-200 px-3 py-2 text-sm">
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