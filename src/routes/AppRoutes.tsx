import { Routes, Route } from "react-router";
// import Ecommerce from "../pages/Dashboard/Ecommerce";
import Stocks from "../pages/Dashboard/Stocks";
import Crm from "../pages/Dashboard/Crm";
import Marketing from "../pages/Dashboard/Marketing";
import Analytics from "../pages/Dashboard/Analytics";
import SignIn from "../pages/AuthPages/SignIn";
import SignUp from "../pages/AuthPages/SignUp";
import NotFound from "../pages/OtherPage/NotFound";
import UserProfiles from "../pages/UserProfiles";
import Carousel from "../pages/UiElements/Carousel";
import Maintenance from "../pages/OtherPage/Maintenance";
import FiveZeroZero from "../pages/OtherPage/FiveZeroZero";
import FiveZeroThree from "../pages/OtherPage/FiveZeroThree";
import Videos from "../pages/UiElements/Videos";
import Images from "../pages/UiElements/Images";
import Alerts from "../pages/UiElements/Alerts";
import Badges from "../pages/UiElements/Badges";
import Pagination from "../pages/UiElements/Pagination";
import Avatars from "../pages/UiElements/Avatars";
import Buttons from "../pages/UiElements/Buttons";
import ButtonsGroup from "../pages/UiElements/ButtonsGroup";
import Notifications from "../pages/UiElements/Notifications";
import LineChart from "../pages/Charts/LineChart";
import BarChart from "../pages/Charts/BarChart";
import PieChart from "../pages/Charts/PieChart";
import Invoices from "../pages/Invoices";
import ComingSoon from "../pages/OtherPage/ComingSoon";
import FileManager from "../pages/FileManager";
import Calendar from "../pages/Calendar";
import BasicTables from "../pages/Tables/BasicTables";
import DataTables from "../pages/Tables/DataTables";
import PricingTables from "../pages/PricingTables";
import Faqs from "../pages/Faqs";
import Chats from "../pages/Chat/Chats";
import FormElements from "../pages/Forms/FormElements";
import FormLayout from "../pages/Forms/FormLayout";
import Blank from "../pages/Blank";
import EmailInbox from "../pages/Email/EmailInbox";
import EmailDetails from "../pages/Email/EmailDetails";

import TaskKanban from "../pages/Task/TaskKanban";
import BreadCrumb from "../pages/UiElements/BreadCrumb";
import Cards from "../pages/UiElements/Cards";
import Dropdowns from "../pages/UiElements/Dropdowns";
import Links from "../pages/UiElements/Links";
import Lists from "../pages/UiElements/Lists";
import Popovers from "../pages/UiElements/Popovers";
import Progressbar from "../pages/UiElements/Progressbar";
import Ribbons from "../pages/UiElements/Ribbons";
import Spinners from "../pages/UiElements/Spinners";
import Tabs from "../pages/UiElements/Tabs";
import Tooltips from "../pages/UiElements/Tooltips";
import Modals from "../pages/UiElements/Modals";
import ResetPassword from "../pages/AuthPages/ResetPassword";
import TwoStepVerification from "../pages/AuthPages/TwoStepVerification";
import Success from "../pages/OtherPage/Success";
import AppLayout from "../layout/AppLayout";
import TaskList from "../pages/Task/TaskList";
import Saas from "../pages/Dashboard/Saas";
import StructureAndOrganize from "../features/structure-and-organize/pages/StrukturOrganisasiPage";
import ExportPage from "../features/structure-and-organize/pages/ExportPage";
import BusinessLinesTab from "../features/structure-and-organize/pages/LiniBisnis/BusinessLinesTab";
import CompaniesTab from "../features/structure-and-organize/pages/Perusahaan/CompaniesTab";
import OfficesTab from "../features/structure-and-organize/pages/Kantor/OfficesTab";
import DirectoratesTab from "../features/structure-and-organize/pages/Direktorat/DirectoratesTab";
import DivisionsTab from "../features/structure-and-organize/pages/Divisi/DivisionsTab";
import DepartmentsTab from "../features/structure-and-organize/pages/Departemen/DepartmentsTab";
import PositionsTab from "../features/structure-and-organize/pages/Jabatan/PositionsTab";
import EmployeePositionsTab from "../features/structure-and-organize/pages/PosisiPegawai/EmployeePositionsTab";
import DetailLiniBisnis from "../features/structure-and-organize/pages/LiniBisnis/DetailLiniBisnis";
import DetailPerusahaan from "../features/structure-and-organize/pages/Perusahaan/detail/DetailPerusahaan";
import DataKaryawanIndexPage from "../features/staff/pages/data-karyawan/indexPage";
import DetailKaryawanPage from "../features/staff/pages/data-karyawan/detail/detailPage";
import FormulirKaryawanPage from "../features/staff/pages/data-karyawan/FormulirKaryawanPage";
import PendaftaranKaryawanBaru from "../features/staff/pages/data-karyawan/PendaftaranKaryawanBaru";
import PengunduranDiri from "../features/staff/pages/pengunduran-diri/pengunduranDiriPage";
import FormResignPage from "../features/staff/pages/pengunduran-diri/form-resign/formResignPage";
import DetailPengunduranDiriPage from "../features/staff/pages/pengunduran-diri/detail/DetailPengunduranDiriPage";
import PerpanjanganKontrak from "../features/staff/pages/data-karyawan/tabs/perpanjanganKontrakPage";
import DataKaryawanPelanggaran from "../features/staff/components/dataKaryawan/tab/pelanggaran";
import OrganizationHistoryPage from "../features/staff/pages/organizationHistoryPage";
import Dashboard from "@/features/dashboard/pages/Dashboard";
// import DaftarPenggajianPage from "@/features/penggajian/pages/daftarPenggajianPage";
import KonfigurasiPenggajianPage from "@/features/penggajian/pages/konfigursaiPenggajian/konfigurasiPenggajianPage";
// Dokumentasi: Import tab untuk Konfigurasi Penggajian
import KompensasiPage from "@/features/penggajian/pages/konfigursaiPenggajian/tab/kompensasiPage";
import BpjsPage from "@/features/penggajian/pages/konfigursaiPenggajian/tab/bpjsPage";
import AcuanPotonganPage from "@/features/penggajian/pages/konfigursaiPenggajian/tab/acuanPotonganPage";
import TunjanganTetapPage from "@/features/penggajian/pages/konfigursaiPenggajian/tab/tunjanganTetapPage";
import TunjanganTidakTetapPage from "@/features/penggajian/pages/konfigursaiPenggajian/tab/tunjanganTidakTetapPage";
import PotonganTidakTetapPage from "@/features/penggajian/pages/konfigursaiPenggajian/tab/potonganTidakTetapPage";
import THRPage from "@/features/penggajian/pages/konfigursaiPenggajian/tab/THRPage";
// Dokumentasi: Halaman dan tab Periode Penggajian
import PeriodePenggajianPage from "@/features/penggajian/pages/periodePenggajian/periodePenggajianPage";
import NonAETab from "@/features/penggajian/pages/shared/tab/nonAEPages";
import AETab from "@/features/penggajian/pages/shared/tab/AEPages";
import PKLTab from "@/features/penggajian/pages/shared/tab/PKLPages";
import THRTab from "@/features/penggajian/pages/shared/tab/THRPages";
// Dokumentasi: Import halaman Detail Gaji untuk navigasi dari tabel Periode Penggajian
// import DetailGajiPage from "@/features/penggajian/pages/periodePenggajian/detail/detailGaji";
// Dokumentasi: Import halaman Detail Gaji AE dan Non-AE terpisah
import DetailGajiAEPage from "@/features/penggajian/pages/shared/detail/detailGajiAEPage";
import DetailGajiNonAEPage from "@/features/penggajian/pages/shared/detail/detailGajiNonAEPage";
import DetailGajiTHRPage from "@/features/penggajian/pages/shared/detail/detailGajiTHRPage";
import DetailGajiPKLPage from "@/features/penggajian/pages/shared/detail/detailGajiPKLPage";
import HakAksesPage from "@/features/hakAkses/pages/hakAksesPage";
// Dokumentasi: Import halaman Kasbon dan tab terkait
import KasbonPage from "@/features/penggajian/pages/kasbon/kasbonPage";
import StatusKasbonPage from "@/features/penggajian/pages/kasbon/tab/statusKasbonPage";
import RiwayatPengajuanPage from "@/features/penggajian/pages/kasbon/tab/riwayatPengajuanPage";
import DashboardPenggajianPage from "@/features/penggajian/pages/dashboardPenggajian/dashboardPenggajianPage";

import ApprovalPeriodeGajianPage from "@/features/penggajian/pages/approvalPeriodeGajian/approvalPeriodeGajianPage";
import DistribusiGajiPage from "@/features/penggajian/pages/distribusiGaji/distribusiGajiPage";



// Auth Feature Pages
import { LoginPage, ForgotPasswordPage } from "../features/auth/pages";
import ProtectedOutlet from "../features/auth/components/ProtectedOutlet";
import FormKasbonPage from "@/features/penggajian/pages/kasbon/fromKasbon/formKasbonPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Dashboard Layout */}
      <Route element={<AppLayout />}>
        {/* Public route: pendaftaran karyawan baru */}
        <Route path="/data-karyawan/pendaftaran" element={<PendaftaranKaryawanBaru />} />
        <Route path="/data-karyawan/form" element={<FormulirKaryawanPage />} />
        <Route path="/pengunduran-diri/form" element={<FormResignPage />} />
        {/* Protected routes */}
        <Route element={<ProtectedOutlet />}> 
          <Route index path="/" element={<Dashboard />} />
          <Route path="/structure-and-organize" element={<StructureAndOrganize />}>
            <Route path="business-lines" element={<BusinessLinesTab resetKey="business-lines" />} />
            <Route path="business-lines/:id" element={<DetailLiniBisnis />} />
            <Route path="companies" element={<CompaniesTab resetKey="companies" />} />
            <Route path="companies/:id" element={<DetailPerusahaan />} />
            <Route path="offices" element={<OfficesTab resetKey="offices" />} />
            <Route path="directorates" element={<DirectoratesTab resetKey="directorates" />} />
            <Route path="divisions" element={<DivisionsTab resetKey="divisions" />} />
          <Route path="departments" element={<DepartmentsTab resetKey="departments" />} />
          <Route path="positions" element={<PositionsTab resetKey="positions" />} />
          <Route path="employee-positions" element={<EmployeePositionsTab resetKey="employee-positions" />} />
          </Route>
          {/* Penggajian */}
          {/* <Route path="/periode-gajian" element={<DaftarPenggajianPage />} /> */}
          // Dokumentasi: Nested route untuk Konfigurasi Penggajian dengan tujuh tab
          <Route path="/konfigurasi-penggajian" element={<KonfigurasiPenggajianPage />}>
            <Route index element={<KompensasiPage />} />
            <Route path="kompensasi" element={<KompensasiPage />} />
            <Route path="bpjs" element={<BpjsPage />} />
            <Route path="acuan-potongan" element={<AcuanPotonganPage />} />
            <Route path="tunjangan-tetap" element={<TunjanganTetapPage />} />
            <Route path="tunjangan-tidak-tetap" element={<TunjanganTidakTetapPage />} />
            <Route path="potongan-tidak-tetap" element={<PotonganTidakTetapPage />} />
            <Route path="thr" element={<THRPage />} />
          </Route>
          {/* Dokumentasi: Nested route untuk Periode Penggajian dengan empat tab */}
          <Route path="/periode-gajian" element={<PeriodePenggajianPage />}>
            <Route path="non-ae" element={<NonAETab />} />
            <Route path="ae" element={<AETab />} />
            <Route path="pkl" element={<PKLTab />} />
            <Route path="thr" element={<THRTab />} />
          </Route>
          {/* Dokumentasi: Route Detail Gaji terpisah agar dapat diakses dari tombol Edit */}
          {/* <Route path="/periode-gajian/detail/:id" element={<DetailGajiPage />} /> */}
          <Route path="/periode-gajian/detail-ae/:id" element={<DetailGajiAEPage />} />
          <Route path="/periode-gajian/detail-non-ae/:id" element={<DetailGajiNonAEPage />} />
          <Route path="/periode-gajian/detail-thr/:id" element={<DetailGajiTHRPage />} />
          <Route path="/periode-gajian/detail-pkl/:id" element={<DetailGajiPKLPage />} />
          {/* Dokumentasi: Nested route untuk Kasbon dengan dua tab */}
          <Route path="/kasbon" element={<KasbonPage />}>
            <Route index element={<RiwayatPengajuanPage />} />
            <Route path="riwayat-pengajuan" element={<RiwayatPengajuanPage />} />
            <Route path="status-kasbon" element={<StatusKasbonPage />} />
            <Route path="formulir-kasbon" element={<FormKasbonPage />} />
          </Route>
          <Route path="/dashboard-penggajian" element={<DashboardPenggajianPage />} />
          <Route path="/approval-periode-gajian" element={<ApprovalPeriodeGajianPage />}>
            <Route path="non-ae" element={<NonAETab />} />
            <Route path="ae" element={<AETab />} />
            <Route path="pkl" element={<PKLTab />} />
            <Route path="thr" element={<THRTab />} />
            {/* detail approval */}
            <Route path="detail-ae/:id" element={<DetailGajiAEPage />} />
            <Route path="detail-non-ae/:id" element={<DetailGajiNonAEPage />} />
            <Route path="detail-thr/:id" element={<DetailGajiTHRPage />} />
            <Route path="detail-pkl/:id" element={<DetailGajiPKLPage />} />
          </Route>
          
          {/* // Dokumentasi: Nested route untuk Distribusi Gaji dengan empat tab */}
          <Route path="/distribusi-gaji" element={<DistribusiGajiPage />}>
            <Route path="non-ae" element={<NonAETab />} />
            <Route path="ae" element={<AETab />} />
            <Route path="pkl" element={<PKLTab />} />
            <Route path="thr" element={<THRTab />} />
            {/* detail distribusi */}
            <Route path="detail-ae/:id" element={<DetailGajiAEPage />} />
            <Route path="detail-non-ae/:id" element={<DetailGajiNonAEPage />} />
            <Route path="detail-thr/:id" element={<DetailGajiTHRPage />} />
            <Route path="detail-pkl/:id" element={<DetailGajiPKLPage />} />
          </Route>
          
          <Route path="/data-karyawan" element={<DataKaryawanIndexPage />} />
          <Route path="/data-karyawan/:id" element={<DetailKaryawanPage />} />
          <Route path="/data-karyawan/perpanjangan-kontrak" element={<PerpanjanganKontrak />} />
          <Route path="/data-karyawan/:id/pelanggaran" element={<DataKaryawanPelanggaran />} />
          <Route path="/pengunduran-diri" element={<PengunduranDiri />} />
          
          <Route path="/pengunduran-diri/:id" element={<DetailPengunduranDiriPage />} />
          <Route path="/perpanjangan-kontrak" element={<PerpanjanganKontrak />} />
          
          <Route path="/organization-history" element={<OrganizationHistoryPage />} />
          <Route path="/hak-akses" element={<HakAksesPage />} />

          <Route path="/analytics" element={<Analytics />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/crm" element={<Crm />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/saas" element={<Saas />} />

          {/* Others Page */}
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/invoice" element={<Invoices />} />
          <Route path="/faq" element={<Faqs />} />
          <Route path="/pricing-tables" element={<PricingTables />} />
          <Route path="/blank" element={<Blank />} />

          {/* Forms */}
          <Route path="/form-elements" element={<FormElements />} />
          <Route path="/form-layout" element={<FormLayout />} />

          {/* Applications */}
          <Route path="/chat" element={<Chats />} />

          <Route path="/task-list" element={<TaskList />} />
          <Route path="/task-kanban" element={<TaskKanban />} />
          <Route path="/file-manager" element={<FileManager />} />

          {/* Email */}

          <Route path="/inbox" element={<EmailInbox />} />
          <Route path="/inbox-details" element={<EmailDetails />} />

          {/* Tables */}
          <Route path="/basic-tables" element={<BasicTables />} />
          <Route path="/data-tables" element={<DataTables />} />

          {/* Ui Elements */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/breadcrumb" element={<BreadCrumb />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/buttons-group" element={<ButtonsGroup />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/carousel" element={<Carousel />} />
          <Route path="/dropdowns" element={<Dropdowns />} />
          <Route path="/images" element={<Images />} />
          <Route path="/links" element={<Links />} />
          <Route path="/list" element={<Lists />} />
          <Route path="/modals" element={<Modals />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/pagination" element={<Pagination />} />
          <Route path="/popovers" element={<Popovers />} />
          <Route path="/progress-bar" element={<Progressbar />} />
          <Route path="/ribbons" element={<Ribbons />} />
          <Route path="/spinners" element={<Spinners />} />
          <Route path="/tabs" element={<Tabs />} />
          <Route path="/tooltips" element={<Tooltips />} />
          <Route path="/videos" element={<Videos />} />

          {/* Charts */}
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
          <Route path="/pie-chart" element={<PieChart />} />
        </Route>
      </Route>

      {/* Export print view tanpa AppLayout */}
      <Route element={<ProtectedOutlet />}>
        <Route path="/structure-and-organize/export" element={<ExportPage />} />
        <Route path="/export" element={<ExportPage />} />
      </Route>

      {/* Auth Layout */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/two-step-verification" element={<TwoStepVerification />} />

      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
      <Route path="/maintenance" element={<Maintenance />} />
      <Route path="/success" element={<Success />} />
      <Route path="/five-zero-zero" element={<FiveZeroZero />} />
      <Route path="/five-zero-three" element={<FiveZeroThree />} />
      <Route path="/coming-soon" element={<ComingSoon />} />
    </Routes>
  );
}
