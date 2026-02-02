import EmployeeMetricCard from "../../components/chart/EmployeeMetricCard";
import StatusKepegawaian from "../../components/chart/EmploymentStatus";
import Demographic from "../../components/chart/Demographic";
import EmployeeEngagement from "../../components/chart/EmployeeEngagement";
import Statistik from "../../components/chart/Statistic";
import EmployeeCount from "../../components/chart/EmployeeCount";
// Dokumentasi: Import tabel ulang tahun bulanan
import TableUlangtahun from "../../components/tables/BirthdayTable";
// Dokumentasi: Import tabel daftar pelanggaran aktif
import ActivePenaltyList from "../../components/tables/ActivePenaltyList";
import { IconPegawaiAktif, IconPegawaiNonaktif, IconMengundurkanDiri, IconPegawaiOrientasi } from "@/icons/components/icons";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Top metrics and status section */}
      <h3>Dashboard</h3>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 md:gap-6 items-center">
        
        {/* Metrics grid */}
        <div className="xl:col-span-8">
          {(() => {
            const metrics = [
              {
                key: "active",
                title: "Pegawai Aktif",
                value: 250,
                icon: <IconPegawaiAktif className="text-[#242425] dark:text-white" />,
              },
              {
                key: "inactive",
                title: "Pegawai Nonaktif",
                value: 250,
                icon: <IconPegawaiNonaktif className="text-[#242425] dark:text-white" />,
              },
              {
                key: "garden",
                title: "Mengundurkan Diri",
                value: 250,
                icon: <IconMengundurkanDiri className="text-[#242425] dark:text-white" />,
              },
              {
                key: "onboarding",
                title: "Pegawai dalam Orientasi",
                value: 250,
                icon: <IconPegawaiOrientasi className="text-[#242425] dark:text-white" />,
              },
            ];
            return (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                {metrics.map((m) => (
                  <EmployeeMetricCard key={m.key} title={m.title} value={m.value} icon={m.icon} />
                ))}
              </div>
            );
          })()}
        </div>

        {/* Status Kepegawaian (donut) */}
        <div className="xl:col-span-4 h-full">
          <StatusKepegawaian />
        </div>
      </div>

      

      {/* Demographic and Engagement */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 md:gap-6">
        <div className="xl:col-span-8">
          <Demographic />
        </div>
        <div className="xl:col-span-4">
          <EmployeeEngagement />
        </div>
      </div>
      <EmployeeCount />

      {/* Statistik */}
      <div>
        <Statistik />
      </div>
      {/* Dokumentasi: Tambahkan tabel daftar pelanggaran aktif menggunakan DataTable */}
      <div className="mt-6">
        <ActivePenaltyList />
      </div>
      {/* Dokumentasi: Tambahkan tabel ulang tahun bulan ini menggunakan DataTable */}
      <div className="mt-6">
        <TableUlangtahun />
      </div>

      
    </div>
  );
}
