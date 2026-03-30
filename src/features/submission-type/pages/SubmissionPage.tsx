// Dokumentasi: Halaman Jenis Pengajuan
// - Menambahkan tabel menggunakan DataTable
// - Menyediakan Select (Pengunduran Diri/Kasbon) di toolbar atas
// - Menampilkan tombol "Tambah Pengajuan" menggunakan Button bawaan DataTable
// - Integrasi: Buka popup Pengajuan Kasbon saat memilih "Kasbon" di Select atau klik tombol Tambah
import { useEffect, useMemo, useState } from "react";
import DataTable from "../../../components/shared/datatable/DataTable";
import Select from "../../../components/form/Select";
// import { FileText } from "react-feather";
import { IconFileDetail as FileText } from "@/icons/components/icons";
// Dokumentasi: Import modal Kasbon & Pengunduran Diri
import GenerateCashAdvance from "@/features/submission-type/components/modals/cash-advance-submission/GenerateCashAddvance";
import GenerateResignation from "@/features/submission-type/components/modals/resignation-submission/GenerateResignation";
import { addNotification } from "@/stores/notificationStore";
import { useApiSubmissionType } from "@/features/submission-type/hooks/api/useApiSubmissionType";
import { PopupStatus } from "@/features/submission-type/types/dto/SubmissionType";
import { formatDateToIndonesian } from "@/utils/formatDate";
import { formatUrlFile } from "@/utils/formatUrlFile";

interface RowPengajuan {
  jenisPengajuan: string;
  tanggalPengajuan: string;
  lampiran: string | null;
  status: string;
  catatan: string;
}

export default function JenisPengajuanPage() {
  const [jenis, setJenis] = useState<string>("");
  // Dokumentasi: State kontrol untuk membuka/menutup modal pengajuan
  const [openKasbonModal, setOpenKasbonModal] = useState(false);
  const [openResignModal, setOpenResignModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { submissions, fetchIndex, fetchPopupDetail } = useApiSubmissionType();

  useEffect(() => {
    fetchIndex();
  }, [fetchIndex]);

  const allData: RowPengajuan[] = useMemo(
    () => [
      // {
      //   jenisPengajuan: "Pengunduran Diri",
      //   tanggalPengajuan: "2025-11-20",
      //   lampiran: null,
      //   status: "Pending",
      //   catatan: "Lorem ipsum dolor sit amet consectetur.",
      // },
      // {
      //   jenisPengajuan: "Kasbon",
      //   tanggalPengajuan: "2025-11-20",
      //   lampiran: null,
      //   status: "Disetujui",
      //   catatan: "Lorem ipsum dolor sit amet consectetur.",
      // },
    ],
    []
  );

  const apiData: RowPengajuan[] = useMemo(
    () =>
      (submissions || []).map((s) => ({
        jenisPengajuan: s.submission_type,
        tanggalPengajuan: s.submission_date,
        lampiran: s.attachment_document,
        status: s.status,
        catatan: s.note ?? "-",
      })),
    [submissions]
  );

  const filteredData = useMemo(() => {
    const source = apiData.length > 0 ? apiData : allData;
    return source;
  }, [allData, apiData]);

  const columns = [
    { id: "no", label: "No.", align: "center" as const, sortable: false },
    { id: "jenisPengajuan", label: "Jenis Pengajuan" },
    { id: "tanggalPengajuan", label: "Tanggal Pengajuan", dateRangeFilter: true, format: (value: RowPengajuan["tanggalPengajuan"]) => formatDateToIndonesian(value) },
    { id: "lampiran", label: "Lampiran", align: "center" as const, isAction: true, format: (value: RowPengajuan["lampiran"]) => (
      value ? <a href={formatUrlFile(value)} target="_blank" rel="noopener noreferrer" className="flex justify-center items-center"><FileText  /></a> : "—"
    ) },
    {
      id: "status",
      label: "Status",
      filterOptions: [
        { label: "Pending", value: "Pending" },
        { label: "Disetujui", value: "Disetujui" },
        { label: "Ditolak", value: "Ditolak" },
      ],
      format: (value: RowPengajuan["status"]) => (
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium status-styling ${
            value === "Pending"
              ? "bg-orange-100 text-orange-700"
              : value === "Disetujui"
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
    {
      id: "catatan",
      label: "Catatan",
      format: (value: RowPengajuan["catatan"]) => {
        if (typeof value !== "string") return value as unknown as string;
        const formatted = formatDateToIndonesian(value);
        return formatted || value;
      },
    },
  ];

  const actions = [
    {
      icon: <FileText />,
      onClick: (_row: RowPengajuan) => {
        //console.log("Preview pengajuan", _row);
      },
      className: "text-gray-600",
      condition: () => false, // Hanya tampilkan jika ada lampiran
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
          fetchPopupDetail(jenis as PopupStatus);
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
      />
      {/* Dokumentasi: Render modal pengajuan */}
      <GenerateCashAdvance
        isOpen={openKasbonModal}
        onClose={() => setOpenKasbonModal(false)}
        onSubmit={async () => {
          setSubmitting(true);
          // Handle form submission logic here
          console.log("Generate Cash Advance form submitted");
          setSubmitting(false);
          setOpenKasbonModal(false);
        }}
        submitting={submitting}
      />
      <GenerateResignation
        isOpen={openResignModal}
        onClose={() => setOpenResignModal(false)}
        onSubmit={async () => {
          setSubmitting(true);
          // Handle form submission logic here
          console.log("Generate Resignation form submitted");
          setSubmitting(false);
          setOpenResignModal(false);
        }}
        submitting={submitting}
      />
    </div>
  );
}
