import React from 'react';
import { useParams } from 'react-router-dom';
import { companyService } from '../../../services/OrganizationService';
// Composite detail endpoint digunakan; tidak perlu memanggil office/files manual
import AddBranchModal from '../../../components/modals/company/detail/AddBranchModal';
import DeleteBranchModal from '../../../components/modals/company/detail/DeleteBranchModal';
import AddDocumentModal from '../../../components/modals/company/detail/AddDocumentModal';
import EditDocumentModal from '../../../components/modals/company/detail/EditDocumentModal';
import DeleteDocumentModal from '../../../components/modals/company/detail/DeleteDocumentModal';
import EditDetailCompany from '../../../components/modals/company/detail/EditDetailCompany';
import Button from '@/components/ui/button/Button';
// import { TrashBinIcon } from '@/icons/index';
// DOK: Hapus import ikon tidak terpakai 'TrashBinIcon'
// Alasan: ikon ini tidak digunakan (baris pemakaian sedang dikomentari)
// import { addNotification } from '@/stores/notificationStore';
import { IconPencil, IconHapus, IconPlus, IconFileDetail } from '@/icons/components/icons';
// import { TrashBinIcon as TrashIcon, PencilIcon as EditIcon, EyeIcon } from '@/icons/index';
import DocumentsTable from '../../../components/table/TableGlobal';
import {  formatDateToIndonesian } from '@/utils/formatDate';
import { formatImage } from '@/utils/formatImage';
import { formatUrlFile } from '@/utils/formatUrlFile';
import { useFileStore } from '@/stores/fileStore';
import { mapToCompanyDetail } from '../../../hooks/useCompanies';

const DetailPerusahaan: React.FC = () => {
  const { id } = useParams();
  const [company, setCompany] = React.useState<any | null>(null);
  const [branches, setBranches] = React.useState<any[]>([]);
  const [documents, setDocuments] = React.useState<any[]>([]);

  const [tab, setTab] = React.useState<'profile'|'dokumen'|'hierarki'|'karyawan'>('profile');

  const [isAddBranchOpen, setAddBranchOpen] = React.useState(false);
  const [isDeleteBranchOpen, setDeleteBranchOpen] = React.useState(false);
  // DOK: Hilangkan setter state yang tidak digunakan (setSelectedBranch)
  // Alasan: aksi pilih branch untuk delete sedang tidak aktif, hindari error lint
  const [selectedBranch] = React.useState<any | null>(null);

  const [isAddDocOpen, setAddDocOpen] = React.useState(false);
  const [isDeleteDocOpen, setDeleteDocOpen] = React.useState(false);
  const [isEditDocOpen, setEditDocOpen] = React.useState(false);
  const [selectedDoc, setSelectedDoc] = React.useState<any | null>(null);
  const [isEditOpen, setEditOpen] = React.useState(false);
  const file = useFileStore();
  

  const fetch = React.useCallback(async () => {
    if (!id) return;
    try {
      // Gunakan endpoint komposit: GET /companies/:id/detail
      const detail = await companyService.getDetail(id);
      const mappedDetail = mapToCompanyDetail(detail);
      setCompany(mappedDetail?.company || null);
      setBranches(mappedDetail?.branches || []);
      // Map dokumen agar tetap kompatibel dengan UI yang memfilter berdasarkan 'type'
      const docs = (mappedDetail?.documents || []).map((d: any) => ({
        ...d,
        // Jika API tidak menyediakan 'type', default-kan ke 'active' agar UI tidak kosong
        type: d?.type ?? 'active',
      }));
      console.log('Documents', docs);
      setDocuments(docs);
    } catch (err) {
      console.error('Failed to load company detail', err);
    }
  }, [id]);

  React.useEffect(() => { fetch(); }, [fetch]);

  
  // const elementCardKiri = () => {
  const alamatValue = company?.address || '—';
  const companySizeValue = (company?.employeeCount || company?.employees || '')
    ? `${company?.employeeCount || company?.employees} Employes`
    : '0';

  const contactInformation = [
    { label: 'Kode Pos', value: company?.postalCode || company?.postal || '—' },
    { label: 'Gmail', value: company?.email || '—' },
    { label: 'Phone', value: company?.phone || '—' },
  ];

  const customInformation = [
      { label: 'Industry', value: company?.industry || company?.businessLineName || '—' },
      { label: 'Didirikan', value: formatDateToIndonesian(company?.founded) || '—' },
      { label: 'Type', value: company?.type || '—' },
      { label: 'Website', value: company?.website || '—' },
  ];

  const docColumns = React.useMemo(() => ([
      { id: 'no', label: 'No.', align: 'center', render: (_: any, __: any, idx: number) => idx + 1 },
      { id: 'fileName', label: 'Nama Dokumen' },
      { id: 'number', label: 'Nomor Dokumen' },
      // { id: 'name', label: 'Jenis' },
      // { id: 'size', label: 'Ukuran' },
      { id: 'type', label: 'Status', render: (v: string) => (v === 'active' ? 'Dokumen Aktif' : v === 'archive' ? 'Arsip' : '—') },
  ]), []);

  const docActions = React.useMemo(() => ((row: any) => {
    if (row?.type === 'archive') return [];
    return [
      {
        label: 'Delete',
        icon: <IconHapus />,
        className: 'h-9 w-9 flex items-center justify-center rounded-lg  text-white ',
        onClick: (r: any) => { setSelectedDoc(r); setDeleteDocOpen(true); console.log('Delete Dokumen', r); },
      },
      {
        label: 'Detail',
        icon: <IconFileDetail />,
        className: 'h-9 w-9 flex items-center justify-center rounded-lg  text-white ',
        onClick: (r: any) => { console.log('Detail Dokumen', r);const url = formatUrlFile(r?.fileUrl || r?.url || r?.link); if (url) window.open(url, '_blank'); },
      },
      // {
      //   label: 'Edit',
      //   icon: <IconPencil />,
      //   className: 'h-9 w-9 flex items-center justify-center rounded-lg  text-white ',
      //   onClick: (r: any) => { setSelectedDoc(r); setEditDocOpen(true); },
      // }
    ];
  }), []);

  



  return (
    <div className="p-4 md:p-6">
      {/* <h1 className="text-3xl font-semibold mb-4">{company?.name || 'Detail Perusahaan'}</h1> */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* card kiri */}
        <div className="col-span-12 md:col-span-4 rounded-lg p-4 md:p-6 shadow-sm bg-white dark:border-gray-800 dark:bg-gray-900 dark:text-white">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">{/* logo */}
              <span className="text-3xl font-bold dark:text-black">
                {formatImage(company?.logo, company?.name || '')}
              </span>
            </div>
            <h2 className="text-xl font-bold">{company?.name}</h2>
            <p className="text-md font-medium">{company?.businessLineName || '—'}</p>
          </div>

          <hr className='my-6'/>

          <div className=" text-sm">
            {/* Address */}
            <div className='flex gap-2 justify-between mb-6 items-start '>
              <div className='min-w-[120px] text-gray-600'>Alamat</div> <div>:</div> 
              <div className="w-full max-w-full break-all md:max-w-[200px] md:w-[200px]">{alamatValue}</div>
            </div>

            {/* Company Size */}
            <div className='flex gap-2 justify-between mb-6 items-start '>
              <div className='min-w-[120px] text-gray-600'>Jumlah Karyawan</div> <div>:</div> 
              <div className="w-full max-w-full break-all md:max-w-[200px] md:w-[200px]">{companySizeValue}</div>
            </div>

            
            <div className="text-gray-600 font-semibold mb-2">Contact Information</div>
            {contactInformation.map((data, idx) => (
              <div key={`contact-${idx}`} className='flex gap-2 justify-between mb-6 items-start '>
                <div className='min-w-[120px] text-gray-600'>{data.label}</div> <div>:</div> 
                <div className="w-full max-w-full break-all md:max-w-[200px] md:w-[200px] ">{data.value}</div>
              </div>
            ))}

            
            <div className="text-gray-600 font-semibold mb-2">Custom Information</div>
            {customInformation.map((data, idx) => (
              <div key={`custom-${idx}`} className='flex gap-2 justify-between mb-6 items-start '>
                <div className='min-w-[120px] text-gray-600'>{data.label}</div> <div>:</div> 
                <div className="w-full max-w-full break-all md:max-w-[200px] md:w-[200px]">{data.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end ">
            <Button className="w-full" size='sm' onClick={() => setEditOpen(true)} startIcon={<IconPencil color='white'/>}>
              Edit
            </Button>
          </div>
        </div>

        {/* card kanan */}
        <div className="col-span-12 md:col-span-8 bg-white rounded-lg p-4 md:p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white">
          <div className="border-b mb-4">
            <nav className="flex gap-4 -mb-px overflow-x-auto">
              <button onClick={() => setTab('profile')} className={`py-2 px-3 ${tab==='profile'? 'border-b-2 border-blue-600 text-blue-600':'text-gray-600'}`}>Profil Perusahaan</button>
              <button onClick={() => setTab('dokumen')} className={`py-2 px-3 ${tab==='dokumen'? 'border-b-2 border-blue-600 text-blue-600':'text-gray-600'}`}>Dokumen</button>
              {/* <button onClick={() => setTab('hierarki')} className={`py-2 px-3 ${tab==='hierarki'? 'border-b-2 border-blue-600 text-blue-600':'text-gray-600'}`}>Hierarki</button> */}
              <button onClick={() => setTab('karyawan')} className={`py-2 px-3 ${tab==='karyawan'? 'border-b-2 border-blue-600 text-blue-600':'text-gray-600'}`}>Data Karyawan</button>
            </nav>
          </div>

          {tab === 'profile' && (
            <div>
              <h3 className="text-3xl font-semibold mb-2 text-[#004969]">Profil Perusahaan</h3>
              <p className="text-[#000] dark:text-white mb-4">{company?.description || '—'}</p>

              <div className="flex items-center justify-between mb-3">
                <h4 className="text-3xl font-semibold text-[#004969]">Branch</h4>
                {/* <Button onClick={() => setAddBranchOpen(true)} className="flex items-center justify-center bg-blue-600 text-white  rounded">
                  {iconPlus({size:24})} <span className='hidden md:inline'>Tambah Branch</span>
                </Button> */}
              </div>

              <div className={`grid grid-cols-1  ${branches?.length ?'sm:grid-cols-2':'sm:grid-cols-1'} gap-3`}>
                {
                  branches?.length ? branches.map((b) => (
                  <div key={b.id} className="p-3 border rounded flex justify-between items-center gap-3 flex-wrap sm:flex-nowrap">
                    <div>
                      <div className="font-semibold">{b.name}</div>
                      {/* <div className="text-sm text-gray-500">{b.address}</div> */}
                      <div className="text-sm text-gray-500">{b.employeeCount ? `${b.employeeCount} Employees` : '0 Employees'}</div>
                    </div>
                    {/* comment kata ui/ux di hapus */}
                    {/* <div>
                      <button onClick={() => { setSelectedBranch(b); setDeleteBranchOpen(true); }} className="bg-red-500 text-white rounded p-2"><TrashBinIcon color='white'/></button>
                    </div> */}
                  </div>
                )): <div className="text-center text-gray-500">Belum ada branch</div>}
              </div>
            </div>
          )}

          {tab === 'dokumen' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-3xl  font-semibold text-[#004969]">Dokumen & Arsip</h3>
                <Button onClick={() => setAddDocOpen(true)} className="bg-blue-600 text-white px-3 py-1 rounded">
                  <IconPlus size={24} />
                  <span className='hidden md:inline'>Dokumen Baru</span>
                </Button>
              </div>

              <DocumentsTable
                items={ documents || [] }
                columns={docColumns as any}
                actionsForRow={docActions as any}
                // onDelete={(d) => { setSelectedDoc(d); setDeleteDocOpen(true); }}
                // onEdit={(d) => { setSelectedDoc(d); setEditDocOpen(true); }}
              />
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
        // addNotification({
        //   description: 'Branch berhasil ditambahkan',
        //   variant: 'success',
        //   hideDuration: 4000,
        //   title: 'Branch ditambahkan',
        // });
      }} />

      <DeleteBranchModal isOpen={isDeleteBranchOpen} onClose={() => setDeleteBranchOpen(false)} branch={selectedBranch} onSuccess={() => {fetch();
        // addNotification({
        //   description: 'Branch berhasil dihapus',
        //   variant: 'success',
        //   hideDuration: 4000,
        //   title: 'Branch dihapus',
        // });
      }} />
      <AddDocumentModal isOpen={isAddDocOpen} onClose={() => {setAddDocOpen(false); file.clearSkFile()}} companyId={id || ''} onSuccess={() => {fetch();
        // addNotification({
        //   description: 'Dokumen berhasil ditambahkan',
        //   variant: 'success',
        //   hideDuration: 4000,
        //   title: 'Dokumen ditambahkan',
        // });
      }} />
      <DeleteDocumentModal companyId={id || ''} isOpen={isDeleteDocOpen} onClose={() => {setDeleteDocOpen(false); file.clearSkFile()}} document={selectedDoc} onSuccess={() => {fetch();
        // addNotification({
        //   description: 'Dokumen berhasil dihapus',
        //   variant: 'success',
        //   hideDuration: 4000,
        //   title: 'Dokumen dihapus',
        // });
      }} />
      <EditDocumentModal isOpen={isEditDocOpen} onClose={() => setEditDocOpen(false)} companyId={id || ''} companyName={company?.name || ''} document={selectedDoc} onSuccess={() => {fetch();
        // addNotification({
        //   description: 'Dokumen berhasil diupdate',
        //   variant: 'success',
        //   hideDuration: 4000,
        //   title: 'Dokumen diupdate',
        // });
      }} />
      <EditDetailCompany isOpen={isEditOpen} onClose={() => setEditOpen(false)} company={company} onSuccess={() => {fetch();
        // addNotification({
        //   description: 'Perusahaan berhasil diupdate',
        //   variant: 'success',
        //   hideDuration: 4000,
        //   title: 'Perusahaan diupdate',
        // });
      }} />
    </div>
  );
};

export default DetailPerusahaan;
    
