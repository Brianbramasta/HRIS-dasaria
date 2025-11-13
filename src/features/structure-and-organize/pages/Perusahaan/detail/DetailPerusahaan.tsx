import React from 'react';
import { useParams } from 'react-router-dom';
import { companyService, officeService } from '../../../services/organization.service';
import { apiService } from '../../../../../services/api';
import AddBranchModal from '../../../components/modals/Perusahaan/detail/AddBranchModal';
import DeleteBranchModal from '../../../components/modals/Perusahaan/detail/DeleteBranchModal';
import AddDocumentModal from '../../../components/modals/Perusahaan/detail/AddDocumentModal';
import DeleteDocumentModal from '../../../components/modals/Perusahaan/detail/DeleteDocumentModal';
import EditDetailCompany from '../../../components/modals/Perusahaan/detail/EditDetailCompany';
import Button from '@/components/ui/button/Button';
import { TrashBinIcon, PencilIcon, AngleUpIcon, AngleDownIcon, FileIcon, ArrowRightIcon } from '@/icons/index';
import { addNotification } from '@/stores/notificationStore';

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
  const [isEditOpen, setEditOpen] = React.useState(false);
  const [expandActive, setExpandActive] = React.useState(true);
  const [expandArchive, setExpandArchive] = React.useState(true);

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
        const docsRes = await apiService.get<any>(`/files?ownerType=company&ownerId=${id}`);
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

  
  // const elementCardKiri = () => {
    const alamatValue = company?.address || '—';
    const companySizeValue = (company?.employeeCount || company?.employees || '')
      ? `${company?.employeeCount || company?.employees} Employes`
      : '—';

    const contactInformation = [
      { label: 'Kode Pos', value: company?.postalCode || company?.postal || '—' },
      { label: 'Gmail', value: company?.email || '—' },
      { label: 'Phone', value: company?.phone || '—' },
    ];

    const customInformation = [
      { label: 'Industry', value: company?.industry || company?.businessLineName || '—' },
      { label: 'Founded', value: company?.founded || new Date(company?.createdAt || '').getFullYear() || '—' },
      { label: 'Type', value: company?.type || '—' },
      { label: 'Website', value: company?.website || '—' },
    ];

    
  //   return (
  //     <>
  //       {dataKiri.map((data, idx) => (
  //         <div key={idx}>
  //           <strong>{data.label}:</strong> <div className="text-gray-600">{data.value}</div>
  //         </div>
  //       ))}
  //     </>
  //   );
  // };

  return (
    <div className="p-4 md:p-6">
      {/* <h1 className="text-3xl font-semibold mb-4">{company?.name || 'Detail Perusahaan'}</h1> */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* card kiri */}
        <div className="col-span-12 md:col-span-4 rounded-lg p-4 md:p-6 shadow-sm bg-[#F6F6F6]">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">{/* logo */}
              <span className="text-3xl font-bold"><img src={company?.logo || '/placeholder.svg'} alt='logo' className='w-full h-full object-cover rounded-full'/></span>
            </div>
            <h2 className="text-xl font-bold">{company?.name}</h2>
            <p className="text-sm text-gray-500">{company?.businessLineName}</p>
          </div>

          <div className="mt-6 text-sm">
            {/* Address */}
            <div className='flex gap-2 justify-between mb-6 items-start flex-wrap sm:flex-nowrap'>
              <div className='min-w-[120px] text-gray-600'>Alamat</div> <div>:</div> 
              <div className="w-full max-w-full break-words md:max-w-[200px] md:w-[200px]">{alamatValue}</div>
            </div>

            {/* Company Size */}
            <div className='flex gap-2 justify-between mb-6 items-start flex-wrap sm:flex-nowrap'>
              <div className='min-w-[120px] text-gray-600'>Company Size</div> <div>:</div> 
              <div className="w-full max-w-full break-words md:max-w-[200px] md:w-[200px]">{companySizeValue}</div>
            </div>

            <hr className="my-4 border-gray-200" />
            <div className="text-gray-800 font-semibold mb-2">Contact Information</div>
            {contactInformation.map((data, idx) => (
              <div key={`contact-${idx}`} className='flex gap-2 justify-between mb-6 items-start flex-wrap sm:flex-nowrap'>
                <div className='min-w-[120px] text-gray-600'>{data.label}</div> <div>:</div> 
                <div className="w-full max-w-full break-words md:max-w-[200px] md:w-[200px]">{data.value}</div>
              </div>
            ))}

            <hr className="my-4 border-gray-200" />
            <div className="text-gray-800 font-semibold mb-2">Custom Information</div>
            {customInformation.map((data, idx) => (
              <div key={`custom-${idx}`} className='flex gap-2 justify-between mb-6 items-start flex-wrap sm:flex-nowrap'>
                <div className='min-w-[120px] text-gray-600'>{data.label}</div> <div>:</div> 
                <div className="w-full max-w-full break-words md:max-w-[200px] md:w-[200px]">{data.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button size='sm' onClick={() => setEditOpen(true)} startIcon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor"/><path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg>}>
              Edit
            </Button>
          </div>
        </div>

        {/* card kanan */}
        <div className="col-span-12 md:col-span-8 bg-white rounded-lg p-4 md:p-6 shadow-sm">
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
              <h3 className="text-3xl font-semibold mb-2 text-[#004969]">Profil Perusahaan</h3>
              <p className="text-[#000] mb-4">{company?.description || '—'}</p>

              <div className="flex items-center justify-between mb-3">
                <h4 className="text-3xl font-semibold text-[#004969]">Branch</h4>
                <Button onClick={() => setAddBranchOpen(true)} className="flex items-center justify-center bg-blue-600 text-white  rounded">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="10" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 3"/>
                  <path d="M11.9987 7.33301V16.6663M7.33203 11.9997H16.6654" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>

                  Tambah Branch</Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {branches.map((b) => (
                  <div key={b.id} className="p-3 border rounded flex justify-between items-center gap-3 flex-wrap sm:flex-nowrap">
                    <div>
                      <div className="font-semibold">{b.name}</div>
                      <div className="text-sm text-gray-500">{b.address}</div>
                      <div className="text-sm text-gray-500">{b.employeeCount ? `${b.employeeCount} Employees` : '0 Employees'}</div>
                    </div>
                    <div>
                      <button onClick={() => { setSelectedBranch(b); setDeleteBranchOpen(true); }} className="bg-red-500 text-white rounded px-2 py-1"><TrashBinIcon/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'dokumen' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-3xl  font-semibold text-[#004969]">Dokumen & Arsip</h3>
                <Button onClick={() => setAddDocOpen(true)} className="bg-blue-600 text-white px-3 py-1 rounded"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="10" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 3"/>
                  <path d="M11.9987 7.33301V16.6663M7.33203 11.9997H16.6654" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Dokumen Baru</Button>
              </div>

              {/* Dokumen Berlaku - collapsible */}
              <div className="mb-4 rounded-lg">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                  <h4 className="font-semibold">Dokumen Berlaku</h4>
                  <button
                    type="button"
                    onClick={() => setExpandActive((v) => !v)}
                    className="h-8 w-8 flex items-center justify-center rounded-md border hover:bg-gray-100"
                    aria-label={expandActive ? 'Collapse Dokumen Berlaku' : 'Expand Dokumen Berlaku'}
                  >
                    {expandActive ? <AngleUpIcon className="h-4 w-4"/> : <AngleDownIcon className="h-4 w-4"/>}
                  </button>
                </div>
                {expandActive && (<>
                  {documents?.length ? 
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
                    {documents.filter(d=>d.type === 'active').map(d => (
                      <div key={d.id} className=" p-4">
                        <div className="mb-3 font-medium line-clamp-1">{d.name}</div>
                        <div className="flex items-center justify-between gap-3 rounded border p-2">
                          <div className="flex items-center gap-2">
                            <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                              <FileIcon className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                              <div className="text-sm font-medium line-clamp-2">{d.fileName || '—'}</div>
                              <div className="text-xs text-gray-500">{d.size || ''}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => { setSelectedDoc(d); setDeleteDocOpen(true); }} className="h-9 w-9 flex items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600"><TrashBinIcon className="h-5 w-5"/></button>
                            <button onClick={() => { setSelectedDoc(d); setAddDocOpen(true); }} className="h-9 w-9 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700"><PencilIcon className="h-5 w-5"/></button>
                          </div>
                        </div>
                        <button className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline" onClick={() => {/* TODO: navigate to detail */}}>
                          Detail <ArrowRightIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>:<p className={'text-center w-full'}>Tidak ada dokumen Berlaku</p>}
                </>)}
              </div>

              {/* Riwayat dan Arsip - collapsible */}
              <div className="rounded-lg">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                  <h4 className="font-semibold">Riwayat dan Arsip</h4>
                  <button
                    type="button"
                    onClick={() => setExpandArchive((v) => !v)}
                    className="h-8 w-8 flex items-center justify-center rounded-md border hover:bg-gray-100"
                    aria-label={expandArchive ? 'Collapse Riwayat dan Arsip' : 'Expand Riwayat dan Arsip'}
                  >
                    {expandArchive ? <AngleUpIcon className="h-4 w-4"/> : <AngleDownIcon className="h-4 w-4"/>}
                  </button>
                </div>
                {expandArchive && (
                  <>
                  {documents?.length ? 
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
                    {documents.filter(d=>d.type === 'archive').map(d => (
                      <div key={d.id} className=" p-4">
                        <div className="mb-3 font-medium line-clamp-1">{d.name}</div>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 rounded border p-2">
                            <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                              <FileIcon className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                              <div className="text-sm font-medium line-clamp-2">{d.fileName || '—'}</div>
                              <div className="text-xs text-gray-500">{d.size || ''}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => { setSelectedDoc(d); setDeleteDocOpen(true); }} className="h-9 w-9 flex items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600"><TrashBinIcon className="h-5 w-5"/></button>
                            <button onClick={() => { setSelectedDoc(d); setAddDocOpen(true); }} className="h-9 w-9 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700"><PencilIcon className="h-5 w-5"/></button>
                          </div>
                        </div>
                        <button className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline" onClick={() => {/* TODO: navigate to detail */}}>
                          Detail <ArrowRightIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>:<p className={'text-center w-full'}>Tidak ada dokumen Arsip</p>}
                  </>
                )}
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

      <AddBranchModal isOpen={isAddBranchOpen} onClose={() => setAddBranchOpen(false)} companyId={id || ''} onSuccess={() => {fetch();
        addNotification({
          description: 'Branch berhasil ditambahkan',
          variant: 'success',
          hideDuration: 4000,
          title: 'Branch ditambahkan',
        });
      }} />
      <DeleteBranchModal isOpen={isDeleteBranchOpen} onClose={() => setDeleteBranchOpen(false)} branch={selectedBranch} onSuccess={() => {fetch();
        addNotification({
          description: 'Branch berhasil dihapus',
          variant: 'success',
          hideDuration: 4000,
          title: 'Branch dihapus',
        });
      }} />
      <AddDocumentModal isOpen={isAddDocOpen} onClose={() => setAddDocOpen(false)} companyId={id || ''} onSuccess={() => {fetch();
        addNotification({
          description: 'Dokumen berhasil ditambahkan',
          variant: 'success',
          hideDuration: 4000,
          title: 'Dokumen ditambahkan',
        });
      }} />
      <DeleteDocumentModal isOpen={isDeleteDocOpen} onClose={() => setDeleteDocOpen(false)} document={selectedDoc} onSuccess={() => {fetch();
        addNotification({
          description: 'Dokumen berhasil dihapus',
          variant: 'success',
          hideDuration: 4000,
          title: 'Dokumen dihapus',
        });
      }} />
      <EditDetailCompany isOpen={isEditOpen} onClose={() => setEditOpen(false)} company={company} onSuccess={() => {fetch();
        addNotification({
          description: 'Perusahaan berhasil diupdate',
          variant: 'success',
          hideDuration: 4000,
          title: 'Perusahaan diupdate',
        });
      }} />
    </div>
  );
};

export default DetailPerusahaan;
