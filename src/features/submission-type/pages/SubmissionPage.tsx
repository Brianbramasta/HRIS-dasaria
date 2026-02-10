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
import AddPengajuanKasbonModal from "@/features/submission-type/components/modals/cash-advance-submission/AddCashAdvanceSubmissionModal";
import AddPengajuanPengunduranDiriModal from "@/features//submission-type/components/modals/resignation-submission/AddResignationSubmissionModal";
import { addNotification } from "@/stores/notificationStore";
import { useApiSubmissionType } from "@/features/submission-type/hooks/api/useApiSubmissionType";
import { PopupApplicationDetailResult, PopupStatus } from "@/features/submission-type/types/dto/SubmissionType";

interface RowPengajuan {
  jenisPengajuan: string;
  tanggalPengajuan: string;
  lampiran: string;
  status: string;
  catatan: string;
}

export default function JenisPengajuanPage() {
  const [jenis, setJenis] = useState<string>("");
  // Dokumentasi: State kontrol untuk membuka/menutup modal pengajuan
  const [openKasbonModal, setOpenKasbonModal] = useState(false);
  const [openResignModal, setOpenResignModal] = useState(false);
  const { submissions, fetchIndex, popupDetail, fetchPopupDetail, storeSubmission } = useApiSubmissionType();

  useEffect(() => {
    fetchIndex();
  }, [fetchIndex]);

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

  const apiData: RowPengajuan[] = useMemo(
    () =>
      (submissions || []).map((s) => ({
        jenisPengajuan: s.submission_type,
        tanggalPengajuan: s.submission_date,
        lampiran: s.attachment_document ? "Ada" : "-",
        status: s.status,
        catatan: s.note ?? "-",
      })),
    [submissions]
  );

  const filteredData = useMemo(() => {
    const source = apiData.length > 0 ? apiData : allData;
    if (!jenis) return source;
    return source.filter((d) => d.jenisPengajuan === jenis);
  }, [allData, apiData, jenis]);

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

  const kasbonDefaults = useMemo(() => {
    const detail: PopupApplicationDetailResult | null = popupDetail;
    if (detail && "basic_salary" in detail) {
      return {
        idKaryawan: detail.nip,
        namaLengkap: detail.full_name,
        departemen: detail.department_name,
        posisi: detail.position_name,
        gajiPokok: detail.basic_salary,
      };
    }
    return null;
  }, [popupDetail]);

  const resignDefaults = useMemo(() => {
    const detail: PopupApplicationDetailResult | null = popupDetail;
    if (detail && "company_name" in detail) {
      return {
        idKaryawan: detail.nip,
        namaLengkap: detail.full_name,
        perusahaan: detail.company_name,
        direktorat: detail.directorate_name,
        divisi: detail.division_name,
        departement: detail.department_name,
        posisi: detail.position_name,
      };
    }
    return null;
  }, [popupDetail]);
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
                  fetchPopupDetail(v as PopupStatus);
                }
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
        defaultValues={kasbonDefaults ?? undefined}
        onSave={(values) => {
          (async () => {
            const ok = await storeSubmission({
              submission: "Kasbon",
              tanggal_pengajuan: values.tanggalPengajuan,
              loan_type_id: "fd854227-c6e1-4359-8c42-e9e6a042fec0",
              nominal_loan: values.nominalKasbon,
              loan_period: values.periodeCicilan,
              supervisor_approval_file: values.suratPersetujuanAtasan || null,
              supporting_documents: (values.dokumenPendukung && values.dokumenPendukung.length > 0) ? values.dokumenPendukung[0] : null,
              loan_description: values.keterangan,
              nominal_installment: values.nominalCicilan,
            });
            if (ok) {
              addNotification({
                variant: 'success',
                title: 'Berhasil menyimpan pengajuan kasbon',
                hideDuration: 3000,
              });
              fetchIndex();
            } else {
              addNotification({
                variant: 'error',
                title: 'Gagal menyimpan pengajuan kasbon',
                hideDuration: 4000,
              });
            }
          })();
        }}
      />
      <AddPengajuanPengunduranDiriModal
        isOpen={openResignModal}
        onClose={() => setOpenResignModal(false)}
        defaultValues={resignDefaults ?? undefined}
        onSave={(values) => {
          (async () => {
            const ok = await storeSubmission({
              submission: "Pengunduran Diri",
              tanggal_pengajuan: values.tanggalPengajuan,
              document_lampiran: values.suratPengunduranDiri || null,
              loan_type_id: "",
              nominal_loan: 0,
              loan_period: 0,
              supervisor_approval_file: null,
              supporting_documents: null,
              loan_description: values.alasan,
              nominal_installment: 0,
            });
            if (ok) {
              addNotification({
                variant: 'success',
                title: 'Berhasil menyimpan pengajuan pengunduran diri',
                hideDuration: 3000,
              });
              fetchIndex();
            } else {
              addNotification({
                variant: 'error',
                title: 'Gagal menyimpan pengajuan pengunduran diri',
                hideDuration: 4000,
              });
            }
          })();
        }}
      />
    </div>
  );
}
