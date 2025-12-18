// Dokumentasi: Halaman Jenis Pengajuan
// - Menambahkan tabel menggunakan DataTable
// - Menyediakan Select (Pengunduran Diri/Kasbon) di toolbar atas
// - Menampilkan tombol "Tambah Pengajuan" menggunakan Button bawaan DataTable
// - Integrasi: Buka popup Pengajuan Kasbon saat memilih "Kasbon" di Select atau klik tombol Tambah
import { useMemo, useState } from "react";
import DataTable from "../../structure-and-organize/components/datatable/DataTable";
import Select from "../../../components/form/Select";
// import { FileText } from "react-feather";
import { IconFileDetail as FileText } from "@/icons/components/icons";
// Dokumentasi: Import modal Kasbon & Pengunduran Diri
import AddPengajuanKasbonModal from "@/features/jenisPengajuan/components/modals/pengajuanKasbon/addPengajuanKasbonModal";
import AddPengajuanPengunduranDiriModal from "@/features/jenisPengajuan/components/modals/pengajuanPengunduranDIri/addPengajuanPengunduranDiriModal";
import { addNotification } from "@/stores/notificationStore";

interface RowPengajuan {
  jenisPengajuan: string;
  tanggalPengajuan: string;
  lampiran: string;
  status: "Pending" | "Disetujui" | "Ditolak";
  catatan: string;
}

export default function JenisPengajuanPage() {
  const [jenis, setJenis] = useState<string>("");
  // Dokumentasi: State kontrol untuk membuka/menutup modal pengajuan
  const [openKasbonModal, setOpenKasbonModal] = useState(false);
  const [openResignModal, setOpenResignModal] = useState(false);

  const allData: RowPengajuan[] = useMemo(
    () => [
      {
        jenisPengajuan: "Pengunduran Diri",
        tanggalPengajuan: "20/11/2025",
        lampiran: "-",
        status: "Pending",
        catatan: "Lorem ipsum dolor sit amet consectetur.",
      },
      {
        jenisPengajuan: "Kasbon",
        tanggalPengajuan: "20/11/2025",
        lampiran: "-",
        status: "Disetujui",
        catatan: "Lorem ipsum dolor sit amet consectetur.",
      },
    ],
    []
  );

  const filteredData = useMemo(() => {
    if (!jenis) return allData;
    return allData.filter((d) => d.jenisPengajuan === jenis);
  }, [allData, jenis]);

  const columns = [
    { id: "no", label: "No.", align: "center" as const, sortable: false },
    { id: "jenisPengajuan", label: "Jenis Pengajuan" },
    { id: "tanggalPengajuan", label: "Tanggal Pengajuan" },
    { id: "lampiran", label: "Lampiran", align: "center" as const },
    {
      id: "status",
      label: "Status",
      format: (value: RowPengajuan["status"]) => (
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
            value === "Pending"
              ? "bg-orange-100 text-orange-700"
              : value === "Disetujui"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {value}
        </span>
      ),
    },
    { id: "catatan", label: "Catatan" },
  ];

  const actions = [
    {
      icon: <FileText />,
      onClick: (row: RowPengajuan) => {
        console.log("Preview pengajuan", row);
      },
      className: "text-gray-600",
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
                // if (v === "Kasbon") setOpenKasbonModal(true);
              }}
            />
          </div>
        }
      />
      {/* Dokumentasi: Render modal pengajuan */}
      <AddPengajuanKasbonModal
        isOpen={openKasbonModal}
        onClose={() => setOpenKasbonModal(false)}
        onSave={(values) => {
          console.log("Submit Pengajuan Kasbon", values);
        }}
      />
      <AddPengajuanPengunduranDiriModal
        isOpen={openResignModal}
        onClose={() => setOpenResignModal(false)}
        onSave={(values) => {
          console.log("Submit Pengunduran Diri", values);
        }}
      />
    </div>
  );
}
