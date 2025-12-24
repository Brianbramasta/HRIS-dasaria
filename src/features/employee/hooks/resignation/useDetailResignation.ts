import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PengunduranDiri } from '../../types/Resignation';
import pengunduranDiriService from '../../services/ResignationService';
import { addNotification } from '../../../../stores/notificationStore';
// import { error } from 'console';
import errorHandle from '@/utils/errorHandle';

interface UploadRow {
  id: number;
  type: string;
  file?: File;
}

interface DocumentItem {
  tipeFile: string;
  namaFile: string;
}

export const useDetailResignation = (id: string | undefined) => {
  const navigate = useNavigate();
  const [data, setData] = useState<PengunduranDiri | null>(null);
  const [loading, setLoading] = useState(false);
  const [tanggalEfektif, setTanggalEfektif] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [docs, setDocs] = useState<DocumentItem[]>([
    { tipeFile: 'Form Exit Discussion', namaFile: 'Form Exit Discussion.pdf' },
    { tipeFile: 'Surat Balasan Resign', namaFile: 'Surat Balasan Resign.pdf' },
    { tipeFile: 'Berita Acara Serah Terima (BAST)', namaFile: 'BAST.pdf' },
    { tipeFile: 'Form Exit Clearance', namaFile: 'Form Exit Clearance.pdf' },
    { tipeFile: 'Form Exit Interview', namaFile: 'Form Exit Interview.pdf' },
    { tipeFile: 'Form Exit Questionnaire', namaFile: 'Form Exit Questionnaire.pdf' },
    { tipeFile: 'Informasi Garden Leave', namaFile: 'Informasi Garden Leave.pdf' },
    { tipeFile: 'Paklaring (jika ada)', namaFile: 'Paklaring.pdf' },
  ]);
  const [uploadRows, setUploadRows] = useState<UploadRow[]>([{ id: 1, type: '' }]);

  const docTypes = [
    'Form Exit Discussion',
    'Surat Balasan Resign',
    'Berita Acara Serah Terima (BAST)',
    'Form Exit Clearance',
    'Form Exit Interview',
    'Form Exit Questionnaire',
    'Informasi Garden Leave',
    'Paklaring (jika ada)',
  ];

  // Fetch resignation data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await pengunduranDiriService.getPengunduranDiriById(id);
        setData(res.data as unknown as PengunduranDiri);
      } catch (err) {
        errorHandle(err);
        // addNotification({
        //   title: 'Gagal memuat data',
        //   description: 'Tidak dapat mengambil detail pengunduran diri.',
        //   variant: 'error',
        // });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Handle open modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTanggalEfektif('');
    setDeskripsi('');
  };

  // Handle approve from modal
  const handleApprove = async (tanggal: string) => {
    if (!id || !tanggal) {
      addNotification({
        title: 'Tanggal efektif kosong',
        description: 'Isi tanggal efektif sebelum approve.',
        variant: 'warning',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await pengunduranDiriService.approvePengunduranDiri(id, tanggal);
      addNotification({
        title: 'Approved',
        description: 'Pengunduran diri disetujui.',
        variant: 'success',
      });
      setIsModalOpen(false);
      navigate('/pengunduran-diri');
    } catch (err) {
      errorHandle(err);
      // addNotification({
      //   title: 'Gagal approve',
      //   description: 'Terjadi kesalahan saat approve.',
      //   variant: 'error',
      // });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle reject
  const handleReject = async () => {
    if (!id) return;
    try {
      await pengunduranDiriService.rejectPengunduranDiri(id);
      addNotification({
        title: 'Rejected',
        description: 'Pengunduran diri ditolak.',
        variant: 'info',
      });
      navigate('/pengunduran-diri');
    } catch (err) {
      errorHandle(err);
      // addNotification({
      //   title: 'Gagal reject',
      //   description: 'Terjadi kesalahan saat reject.',
      //   variant: 'error',
      // });
    }
  };

  // Handle add upload row
  const handleAddRow = () => {
    setUploadRows((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((r) => r.id)) + 1 : 1;
      return [...prev, { id: nextId, type: '' }];
    });
  };

  // Handle remove upload row
  const handleRemoveRow = (rowId: number) => {
    setUploadRows((prev) => prev.filter((r) => r.id !== rowId));
  };

  // Handle row type change
  const handleRowTypeChange = (rowId: number, type: string) => {
    setUploadRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, type } : r)));
  };

  // Handle row file change
  const handleRowFileChange = (rowId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, file } : r)));
  };

  // Handle upload rows
  const handleUploadRows = () => {
    const newItems = uploadRows
      .filter((r) => r.type && r.file)
      .map((r) => ({ tipeFile: r.type, namaFile: r.file!.name }));
    
    if (!newItems.length) {
      addNotification({
        title: 'Tidak ada file',
        description: 'Pilih tipe dan file sebelum upload.',
        variant: 'warning',
      });
      return;
    }
    
    setDocs((prev) => [...newItems, ...prev]);
    addNotification({
      title: 'Berhasil',
      description: 'File ditambahkan ke daftar secara lokal.',
      variant: 'success',
    });
  };

  // Handle remove document
  const handleRemoveDocument = (index: number) => {
    setDocs((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Handle preview PDF
  const handlePreviewPDF = () => {
    addNotification({
      title: 'Preview PDF',
      description: 'Static preview only.',
      variant: 'info',
    });
  };

  return {
    data,
    loading,
    tanggalEfektif,
    setTanggalEfektif,
    deskripsi,
    setDeskripsi,
    isModalOpen,
    isSubmitting,
    docs,
    docTypes,
    uploadRows,
    handleOpenModal,
    handleCloseModal,
    handleApprove,
    handleReject,
    handleAddRow,
    handleRemoveRow,
    handleRowTypeChange,
    handleRowFileChange,
    handleUploadRows,
    handleRemoveDocument,
    handlePreviewPDF,
  };
};
