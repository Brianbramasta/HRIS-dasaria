// Halaman Notifikasi: menampilkan dua jenis card (dengan aksi & tanpa aksi) dan filter tanggal menggunakan DatePicker
// Perubahan: tambahkan state & handler untuk menangkap rentang tanggal (ISO) dari DatePicker dan menerapkannya sebagai defaultDate agar tampil di input
import { useMemo, useState } from "react";
import DatePicker from "../../../../components/form/date-picker";
import { Card, CardTitle, CardDescription } from "../../../../components/ui/card";
import {IconNotifDetail,
IconNotifDiTolak,
IconNotifNegosiasi,
IconNotifDisetujui} from "@/icons/components/icons"

type Action =
  | { key: "detail"; label: string; color: "blue-old" }
  | { key: "reject"; label: string; color: "red" }
  | { key: "negotiate"; label: string; color: "blue" }
  | { key: "approve"; label: string; color: "green" };

type NotificationItem = {
  id: string;
  title: string;
  timeAgo: string;
  lines: string[];
  actions?: Action[];
};

// Data statis sesuai contoh desain
const sampleData: NotificationItem[] = [
  {
    id: "n-1",
    title: "Dimas Ananda · HR telah mengajukan perpanjangan kontrak (PKWT)",
    timeAgo: "5 Menit yang lalu",
    lines: ["UI/UX Designer · HRIS", "Kontrak berakhir: 30 Maret 2025 (50 hari lagi)"],
    actions: [
      { key: "detail", label: "Detail", color: "blue-old" },
      { key: "reject", label: "Ditolak", color: "red" },
      { key: "negotiate", label: "Negosiasi", color: "blue" },
      { key: "approve", label: "Disetujui", color: "green" },
    ],
  },
  {
    id: "n-2",
    title: "Megawati · HR telah menyetujui pengajuan cuti anda",
    timeAgo: "2 Jam yang lalu",
    lines: ["Tanggal cuti: 10–14 Maret 2025 (5 hari)", "Sisa cuti: 7 hari"],
  },
  {
    id: "n-3",
    title: "Akbar · HR telah menyetujui perubahan informasi pribadi anda",
    timeAgo: "5 Jam yang lalu",
    lines: ["Data diperbarui: Alamat & Nomor Telepon", "Status: Data telah diperbarui di sistem"],
  },
];

// Komponen utama halaman Notifikasi
export default function Notification() {
  const notifications = useMemo(() => sampleData, []);
  // State filter tanggal (ISO) agar ditampilkan kembali di input setelah Simpan
  const [rangeStart, setRangeStart] = useState<string>("");
  const [rangeEnd, setRangeEnd] = useState<string>("");
  // Handler onChange dari DatePicker: menerima Date[] dan dateStr (ISO)
  // Perubahan: jika dateStr kosong (reset), bersihkan state agar input kosong
  const handleRangeChange = (_dates: Date[], dateStr?: string) => {
    if (!dateStr) {
      setRangeStart("");
      setRangeEnd("");
      return;
    }
    const parts = dateStr.split(" to ");
    if (parts.length === 2) {
      setRangeStart(parts[0] || "");
      setRangeEnd(parts[1] || "");
    } else {
      // Hanya satu tanggal (start)
      setRangeStart(dateStr);
      setRangeEnd("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start md:items-center justify-between flex-col md:flex-row ">
        <h3 className="text-gray-900 dark:text-white text-theme-xl font-semibold">Notifikasi</h3>
        <div className="w-full md:w-56 relative z-50 mt-4 md:mt-0">
          {/* DatePicker range dengan tombol aksi; defaultDate diisi dari state agar nilai tampil di input */}
          <DatePicker
            id="filter-date"
            mode="range"
            label=""
            placeholder="Pilih rentang tanggal"
            showActions={true}
            defaultDate={{ from: rangeStart || undefined, to: rangeEnd || undefined }}
            onChange={handleRangeChange}
            showEndDateToggle={true}
          />
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((item) => (
          <Card key={item.id}>
            <div className="space-y-1">
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.timeAgo}</CardDescription>
            </div>

            <div className="mt-3 space-y-1">
              {item.lines.map((line, idx) => (
                <p key={idx} className="text-sm text-gray-700 dark:text-white/80">
                  {line}
                </p>
              ))}
            </div>

            {item.actions && (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.actions.map((a) => {
                  const base = "px-4 py-2.5 text-sm rounded-lg font-medium transition-colors flex items-center gap-2";
                  const styles =
                    a.color === "blue"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : a.color === "red"
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : a.color === "green"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-[#003E80] text-white hover:bg-blue-700";
                  const icon =
                    a.key === "detail"
                      ? <IconNotifDetail />
                      : a.key === "reject"
                      ? <IconNotifDiTolak />
                      : a.key === "negotiate"
                      ? <IconNotifNegosiasi />
                      : <IconNotifDisetujui />;
                  return (
                    <button key={a.key} type="button" className={`${base} ${styles}`}>
                      {icon}
                      {a.label}
                    </button>
                  );
                })}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
