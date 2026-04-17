// Dokumentasi: Halaman Jenis Pengajuan
// - Menambahkan tabel menggunakan DataTable
// - Menyediakan Select (Pengunduran Diri/Kasbon) di toolbar atas
// - Menampilkan tombol "Tambah Pengajuan" menggunakan Button bawaan DataTable
// - Integrasi: Buka popup Pengajuan Kasbon saat memilih "Kasbon" di Select atau klik tombol Tambah
import { useMemo, useState } from "react";
import DataTable from "../../../components/shared/datatable/DataTable";
import Select from "../../../components/form/Select";
// import { FileText } from "react-feather";
import { IconFileDetail as FileText, IconCopy } from "@/icons/components/icons";
// Dokumentasi: Import modal Kasbon & Pengunduran Diri
import GenerateCashAdvance from "@/features/submission-type/components/modals/cash-advance-submission/GenerateCashAddvance";
import GenerateResignation from "@/features/submission-type/components/modals/resignation-submission/GenerateResignation";
import { addNotification } from "@/stores/notificationStore";
import useSubmissionTypeData from "../hooks/useSubmissionTypeData";
// import { PopupStatus } from "@/features/submission-type/types/dto/SubmissionType";
import { formatDateToIndonesian } from "@/utils/formatDate";

interface RowPengajuan {
  nip: string;
  name: string;
  submission_type: string;
  submission_date: string;
  status: string;
  note: string;
  token: string;
  is_filled: number;
}

export default function JenisPengajuanPage() {
  const [jenis, setJenis] = useState<string>("");
  // Dokumentasi: State kontrol untuk membuka/menutup modal pengajuan
  const [openKasbonModal, setOpenKasbonModal] = useState(false);
  const [openResignModal, setOpenResignModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const {
    data,
    loading,
    total,
    page,
    limit,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleColumnFilterChange,
    handleDateRangeFilterChange,
    handleRefresh,
    columnFilters,
    dateRangeFilters,
  } = useSubmissionTypeData({
    initialPage: 1,
    initialLimit: 10,
    autoFetch: true,
  });


  const filteredData = useMemo(() => {
    return data;
  }, [data]);

  const columns = [
    { id: "no", label: "No.", align: "center" as const, sortable: false },
    { id: "nip", label: "NIP", sortable: true },
    { id: "name", label: "Nama", sortable: true },
    { 
      id: "submission_type", 
      label: "Jenis Pengajuan", 
      sortable: true,
      filterOptions: [
        { label: "Kasbon", value: "Kasbon" },
        { label: "Pengunduran Diri", value: "Pengunduran Diri" },
      ],
    },
    { 
      id: "submission_date", 
      label: "Tanggal Pengajuan", 
      sortable: true,
      dateRangeFilter: true, 
      format: (value: RowPengajuan["submission_date"]) => formatDateToIndonesian(value) 
    },
    {
      id: "status",
      label: "Status",
      sortable: true,
      gridColumns: 1,
      filterOptions: [
        { label: "Menunggu Diproses", value: "Menunggu Diproses" },
        { label: "Dalam peninjauan", value: "Dalam peninjauan" },
        { label: "Masa Cicilan", value: "Masa Cicilan" },
        { label: "Disetujui", value: "Disetujui" },
        { label: "Ditolak", value: "Ditolak" },
        { label: "Menunggu Persetujuan FAT", value: "Menunggu Persetujuan FAT" },
        { label: "Menunggu Pengisian Form", value: "Menunggu Pengisian Form" },
        
      ],
      format: (value: RowPengajuan["status"]) => (
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium status-styling ${
            value === "Menunggu Diproses" || value === "Menunggu Persetujuan FAT" || value === "Dalam peninjauan"
              ? "bg-orange-100 text-orange-700"
              : value === "Disetujui" || value === "Masa Cicilan"
              ? "bg-green-100 text-green-700"
              : value === "Ditolak"
              ? "bg-red-100 text-red-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {value}
        </span>
      ),
    },
    // {
    //   id: "catatan",
    //   label: "Catatan",
    //   format: (value: RowPengajuan["catatan"]) => {
    //     if (typeof value !== "string") return value as unknown as string;
    //     const formatted = formatDateToIndonesian(value);
    //     return formatted || value;
    //   },
    // },
  ];

  const actions = [
    // {
    //   icon: <FileText />,
    //   onClick: (_row: RowPengajuan) => {
    //     //console.log("Preview pengajuan", _row);
    //   },
    //   className: "text-gray-600",
    //   condition: () => false, // Hanya tampilkan jika ada lampiran
    // },
    {
      icon: <FileText />,
      condition: (row: RowPengajuan) => row.is_filled!==1,
      onClick: (row: RowPengajuan) => {
        if (row.token) {
          const baseUrl = window.location.origin;
          let url = '';
          
          if (row.submission_type === 'Kasbon') {
            url = `${baseUrl}/submission-types/cash-advance/add?token=${row.token}`;
          } else if (row.submission_type === 'Pengunduran Diri') {
            url = `${baseUrl}/submission-types/resignation/add?token=${row.token}`;
          }
          
          if (url) {
            window.open(url, '_blank');
          }
        }
      },
      className: "text-blue-600",
      // label: "Detail"
    },
    {
      icon: <>
      <IconCopy />
      </>,
      condition: (row: RowPengajuan) => row.is_filled!==1,
      onClick: (row: RowPengajuan) => {
        if (row.token) {
          const baseUrl = window.location.origin;
          let url = '';
          
          if (row.submission_type === 'Kasbon') {
            url = `${baseUrl}/submission-types/cash-advance/add?token=${row.token}`;
          } else if (row.submission_type === 'Pengunduran Diri') {
            url = `${baseUrl}/submission-types/resignation/add?token=${row.token}`;
          }
          
          if (url) {
            navigator.clipboard.writeText(url)
              .then(() => {
                addNotification({
                  variant: 'success',
                  title: 'Link berhasil disalin!',
                  hideDuration: 3000,
                });
              })
              .catch(() => {
                addNotification({
                  variant: 'error',
                  title: 'Gagal menyalin link!',
                  hideDuration: 3000,
                });
              });
          }
        }
      },
      className: "text-green-600",
      // label: "Copy"
    },
  ];

  const jenisOptions = [
    { value: "Pengunduran Diri", label: "Pengunduran Diri" },
    { value: "Kasbon", label: "Kasbon" },
  ];
  return (
    <div className="p-4">
      <DataTable<RowPengajuan>
        title="Pengajuan"
        data={filteredData}
        columns={columns}
        actions={actions}
        searchPlaceholder="Cari berdasarkan kata kunci"
        addButtonLabel="Tambah Pengajuan"
        // Dokumentasi: Klik tombol Tambah membuka modal sesuai jenis pengajuan
        onAdd={() => {
          if (!jenis) {
            addNotification({
              variant: 'error',
              title: 'Pilih Jenis Pengajuan terlebih dahulu',
              hideDuration: 4000,
            });
            return;
          }
          // fetchPopupDetail(jenis as PopupStatus);
          if (jenis === "Kasbon") {
            setOpenKasbonModal(true);
          } else if (jenis === "Pengunduran Diri") {
            setOpenResignModal(true);
          }
        }}
        isNewLine={true}// Jika true, judul akan ditampilkan di baris baru
        toolbarLeftSlotAtas={
          <div className="md:w-full w-72">
            <Select
              options={jenisOptions}
              placeholder="Pilih Jenis Pengajuan"
              defaultValue={jenis}
              onChange={(v) => {
                // Dokumentasi: Saat memilih Kasbon, buka modal pengajuan kasbon
                setJenis(v);
                if (v) {
                  // fetchPopupDetail(v as PopupStatus);
                }
                // if (v === "Kasbon") setOpenKasbonModal(true);
              }}
            />
          </div>
        }
        searchable={true}
        filterable={true}
        loading={loading}
        emptyMessage="Tidak ada data pengajuan"
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onPageChangeExternal={handlePageChange}
        onRowsPerPageChangeExternal={handleRowsPerPageChange}
        useExternalPagination={true}
        externalPage={page}
        externalTotal={total}
        pageSize={limit}
        onColumnFilterChange={handleColumnFilterChange}
        columnFilters={columnFilters}
        onDateRangeFilterChange={handleDateRangeFilterChange}
        dateRangeFilters={dateRangeFilters}
        resetKey="SubmissionPage"
      />
      {/* Dokumentasi: Render modal pengajuan */}
      <GenerateCashAdvance
        isOpen={openKasbonModal}
        onClose={() => setOpenKasbonModal(false)}
        onSuccess={async (token) => {
          setSubmitting(true);
          // Handle form submission logic here
          console.log("Generate Cash Advance form submitted with token:", token);
          await handleRefresh();
          setSubmitting(false);
          setOpenKasbonModal(false);
        }}
        submitting={submitting}
      />
      <GenerateResignation
        isOpen={openResignModal}
        onClose={() => setOpenResignModal(false)}
        onSuccess={async (token) => {
          setSubmitting(true);
          // Handle form submission logic here
          console.log("Generate Resignation form submitted with token:", token);
          await handleRefresh();
          setSubmitting(false);
          setOpenResignModal(false);
        }}
        submitting={submitting}
      />
    </div>
  );
}
