import React from 'react';
import { useParams } from 'react-router-dom';
import { companyService, officeService } from '../../../services/organization.service';
import { apiService } from '../../../../../services/api';
import AddBranchModal from '../../../components/modals/Perusahaan/detail/AddBranchModal';
import DeleteBranchModal from '../../../components/modals/Perusahaan/detail/DeleteBranchModal';
import AddDocumentModal from '../../../components/modals/Perusahaan/detail/AddDocumentModal';
import DeleteDocumentModal from '../../../components/modals/Perusahaan/detail/DeleteDocumentModal';

const DetailPerusahaan: React.FC = () => {
  const { id } = useParams();
  const [company, setCompany] = React.useState<any | null>(null);
  const [branches, setBranches] = React.useState<any[]>([]);
  const [documents, setDocuments] = React.useState<any[]>([]);

  const [tab, setTab] = React.useState<'profile'|'dokumen'|'hierarki'|'karyawan'>('profile');

  const [isAddBranchOpen, setAddBranchOpen] = React.useState(false);
  const [isDeleteBranchOpen, setDeleteBranchOpen] = React.useState(false);
  const [selectedBranch, setSelectedBranch] = React.useState<any | null>(null);

  const [isAddDocOpen, setAddDocOpen] = React.useState(false);
  const [isDeleteDocOpen, setDeleteDocOpen] = React.useState(false);
  const [selectedDoc, setSelectedDoc] = React.useState<any | null>(null);

  const fetch = React.useCallback(async () => {
    if (!id) return;
    try {
      const comp = await companyService.getById(id);
      setCompany(comp);

      const offices = await officeService.getByCompanyId(id);
      // If API does not support companyId filter, fallback to filter client-side
      console.log('offices', offices);
      const filtered = (offices || []).filter((o: any) => (o.companyId || String(o.companyId)) === String(id));
      setBranches(filtered);

      // fetch documents from /documents?companyId=...
      try {
        const docsRes = await apiService.get<any>(`/documents?companyId=${id}`);
        setDocuments(docsRes.data || []);
      } catch (e) {
        console.error('Failed to load documents for company', e);
        setDocuments([]);
      }
    } catch (err) {
      console.error('Failed to load company detail', err);
    }
  }, [id]);

  React.useEffect(() => { fetch(); }, [fetch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">{company?.name || 'Detail Perusahaan'}</h1>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">{/* logo */}
              <span className="text-3xl font-bold">{company?.name ? company.name[0] : 'C'}</span>
            </div>
            <h2 className="text-xl font-bold">{company?.name}</h2>
            <p className="text-sm text-gray-500">{company?.businessLineName}</p>
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <div><strong>Alamat:</strong> <div className="text-gray-600">{company?.address || '—'}</div></div>
            <div><strong>Kode Pos:</strong> <div className="text-gray-600">{company?.postalCode || company?.postal || '—'}</div></div>
            <div><strong>Gmail:</strong> <div className="text-gray-600">{company?.email || '—'}</div></div>
            <div><strong>Phone:</strong> <div className="text-gray-600">{company?.phone || '—'}</div></div>
            <div><strong>Industry:</strong> <div className="text-gray-600">{company?.industry || company?.businessLineName || '—'}</div></div>
            <div><strong>Founded:</strong> <div className="text-gray-600">{company?.founded || new Date(company?.createdAt || '').getFullYear() || '—'}</div></div>
            <div><strong>Type:</strong> <div className="text-gray-600">{company?.type || '—'}</div></div>
            <div><strong>Website:</strong> <div className="text-gray-600">{company?.website || '—'}</div></div>
          </div>
        </div>

        <div className="col-span-8 bg-white rounded-lg p-6 shadow-sm">
          <div className="border-b mb-4">
            <nav className="flex gap-4 -mb-px">
              <button onClick={() => setTab('profile')} className={`py-2 px-3 ${tab==='profile'? 'border-b-2 border-blue-600 text-blue-600':'text-gray-600'}`}>Profil Perusahaan</button>
              <button onClick={() => setTab('dokumen')} className={`py-2 px-3 ${tab==='dokumen'? 'border-b-2 border-blue-600 text-blue-600':'text-gray-600'}`}>Dokumen</button>
              <button onClick={() => setTab('hierarki')} className={`py-2 px-3 ${tab==='hierarki'? 'border-b-2 border-blue-600 text-blue-600':'text-gray-600'}`}>Hierarki</button>
              <button onClick={() => setTab('karyawan')} className={`py-2 px-3 ${tab==='karyawan'? 'border-b-2 border-blue-600 text-blue-600':'text-gray-600'}`}>Data Karyawan</button>
            </nav>
          </div>

          {tab === 'profile' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Profil Perusahaan</h3>
              <p className="text-gray-600 mb-4">{company?.description || '—'}</p>

              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Branch</h4>
                <button onClick={() => setAddBranchOpen(true)} className="bg-blue-600 text-white px-3 py-1 rounded">Tambah Branch</button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {branches.map((b) => (
                  <div key={b.id} className="p-3 border rounded flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{b.name}</div>
                      <div className="text-sm text-gray-500">{b.address}</div>
                      <div className="text-sm text-gray-500">{b.employeeCount ? `${b.employeeCount} Employees` : ''}</div>
                    </div>
                    <div>
                      <button onClick={() => { setSelectedBranch(b); setDeleteBranchOpen(true); }} className="bg-red-500 text-white rounded px-2 py-1">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'dokumen' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Dokumen & Arsip</h3>
                <button onClick={() => setAddDocOpen(true)} className="bg-blue-600 text-white px-3 py-1 rounded">Dokumen Baru</button>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold">Dokumen Berlaku</h4>
                <div className="space-y-3 mt-2">
                  {documents.filter(d=>d.type === 'active').map(d => (
                    <div key={d.id} className="p-3 border rounded flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{d.name}</div>
                        <div className="text-sm text-gray-500">{d.docNumber} • {d.fileName} • {d.size || ''}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setSelectedDoc(d); setDeleteDocOpen(true); }} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold">Riwayat dan Arsip</h4>
                <div className="space-y-3 mt-2">
                  {documents.filter(d=>d.type === 'archive').map(d => (
                    <div key={d.id} className="p-3 border rounded flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{d.name}</div>
                        <div className="text-sm text-gray-500">{d.docNumber} • {d.fileName}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setSelectedDoc(d); setDeleteDocOpen(true); }} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'hierarki' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Hierarki</h3>
              <p className="text-gray-600">(Placeholder untuk hierarki organisasi)</p>
            </div>
          )}

          {tab === 'karyawan' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Data Karyawan</h3>
              <p className="text-gray-600">(Placeholder untuk data karyawan perusahaan)</p>
            </div>
          )}
        </div>
      </div>

      <AddBranchModal isOpen={isAddBranchOpen} onClose={() => setAddBranchOpen(false)} companyId={id || ''} onSuccess={() => fetch()} />
      <DeleteBranchModal isOpen={isDeleteBranchOpen} onClose={() => setDeleteBranchOpen(false)} branch={selectedBranch} onSuccess={() => fetch()} />
      <AddDocumentModal isOpen={isAddDocOpen} onClose={() => setAddDocOpen(false)} companyId={id || ''} onSuccess={() => fetch()} />
      <DeleteDocumentModal isOpen={isDeleteDocOpen} onClose={() => setDeleteDocOpen(false)} document={selectedDoc} onSuccess={() => fetch()} />
    </div>
  );
};

export default DetailPerusahaan;
