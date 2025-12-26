import { Routes, Route } from "react-router";
// import Ecommerce from "../pages/Dashboard/Ecommerce";

import AppLayout from "../layout/AppLayout";
import StructureAndOrganize from "../features/structure-and-organize/pages/StructureAndOrganizationPage";
import ExportPage from "../features/structure-and-organize/pages/ExportPage";
import BusinessLinesTab from "../features/structure-and-organize/pages/business-line/BusinessLinesTab";
import CompaniesTab from "../features/structure-and-organize/pages/company/CompaniesTab";
import OfficesTab from "../features/structure-and-organize/pages/office/OfficesTab";
import DirectoratesTab from "../features/structure-and-organize/pages/directorate/DirectoratesTab";
import DivisionsTab from "../features/structure-and-organize/pages/division/DivisionsTab";
import DepartmentsTab from "../features/structure-and-organize/pages/departement/DepartmentsTab";
import PositionsTab from "../features/structure-and-organize/pages/job-tittle/PositionsTab";
import EmployeePositionsTab from "../features/structure-and-organize/pages/employee-positions/EmployeePositionsTab";
import DetailLiniBisnis from "../features/structure-and-organize/pages/business-line/DetailLiniBisnis";
import DetailPerusahaan from "../features/structure-and-organize/pages/company/detail/DetailCompany";
import DataKaryawanIndexPage from "../features/employee/pages/employee-data/IndexPage";
import DetailKaryawanPage from "../features/employee/pages/employee-data/detail/DetailPage";
import FormulirKaryawanPage from "../features/employee/pages/employee-data/EmployeeFormPage";
import PendaftaranKaryawanBaru from "../features/employee/pages/employee-data/NewEmployeeRegistration";
import PengunduranDiri from "../features/employee/pages/resignation/ResignationPage";
import FormResignPage from "../features/employee/pages/resignation/form-resign/FormResignPage";
import DetailPengunduranDiriPage from "../features/employee/pages/resignation/detail/DetailResignationPage";
import PerpanjanganKontrak from "../features/employee/pages/contract-renewal/contract-renewal-hr/ContractRenewalPage";
import PersetujuanPerpanjanganKontrak from "../features/employee/pages/contract-renewal/ContractRenewalApproval";
import PerpanjangKontrakEdit from "../features/employee/pages/contract-renewal/contract-renewal-hr/detail/ContractRenewalEdit";
import DataKaryawanPelanggaran from "../features/employee/components/employee-data/tab/Fraud";
import OrganizationHistoryPage from "../features/employee/pages/organization-history/OrganizationHistoryPage";
import OrganizationHistoryAtasanPage from "../features/employee/pages/organization-history/OrganizationHistoryAtasanPage";
import DashboardPage from "@/features/dashboard/pages/index";
import Dashboard from "@/features/dashboard/pages/tab/Dashboard";
import Notification from "@/features/dashboard/pages/tab/Notification";
// import DaftarPenggajianPage from "@/features/penggajian/pages/daftarPenggajianPage";
import KonfigurasiPenggajianPage from "@/features/payroll/pages/PayrollConfiguration/PayrollConfigurationPage";
// Dokumentasi: Import tab untuk Konfigurasi Penggajian
import KompensasiPage from "@/features/payroll/pages/PayrollConfiguration/tab/CompensationPage";
import BpjsPage from "@/features/payroll/pages/PayrollConfiguration/tab/BPJSPage";
import AcuanPotonganPage from "@/features/payroll/pages/PayrollConfiguration/tab/DeductionReferencePage";
import TunjanganTetapPage from "@/features/payroll/pages/PayrollConfiguration/tab/FixedAllowancePage";
import TunjanganTidakTetapPage from "@/features/payroll/pages/PayrollConfiguration/tab/NonRecurringAllowancePage";
import PotonganTidakTetapPage from "@/features/payroll/pages/PayrollConfiguration/tab/NonRecurringDeductionPage";
import THRPage from "@/features/payroll/pages/PayrollConfiguration/tab/BonusTHRPage";
// Dokumentasi: Halaman dan tab Periode Penggajian
import PeriodePenggajianPage from "@/features/payroll/pages/payroll-period/PayrollPeriodPage";
import NonAETab from "@/features/payroll/pages/shared/tab/NonAEPages";
import AETab from "@/features/payroll/pages/shared/tab/AEPages";
import PKLTab from "@/features/payroll/pages/shared/tab/PKLPages";
import THRTab from "@/features/payroll/pages/shared/tab/THRPages";
// Dokumentasi: Import halaman Detail Gaji untuk navigasi dari tabel Periode Penggajian
// import DetailGajiPage from "@/features/penggajian/pages/periodePenggajian/detail/detailGaji";
// Dokumentasi: Import halaman Detail Gaji AE dan Non-AE terpisah
import DetailGajiAEPage from "@/features/payroll/pages/shared/detail/detailPayrollAEPage";
import DetailGajiNonAEPage from "@/features/payroll/pages/shared/detail/detailPayrollNonAEPage";
import DetailGajiTHRPage from "@/features/payroll/pages/shared/detail/detailPayrollTHRPage";
import DetailGajiPKLPage from "@/features/payroll/pages/shared/detail/detailPayrollPKLPage";
import HakAksesPage from "@/features/role-management-access/pages/RoleManagementPage";
import DetailHakAksesPages from "@/features/role-management-access/pages/detail/DetailHakAksesPages";
import EditRolePage from "@/features/role-management-access/pages/EditRolePage";
// Dokumentasi: Import halaman Kasbon dan tab terkait
import KasbonPage from "@/features/payroll/pages/cash-advance/CashAdvancePage";
import StatusKasbonPage from "@/features/payroll/pages/cash-advance/tab/StatusCashAdvancePage";
import RiwayatPengajuanPage from "@/features/payroll/pages/cash-advance/tab/HistorySubmissionPage";
import CashAdvanceApprovalPage from "@/features/payroll/pages/cash-advance/tab/CashAdvanceApprovalPage";
import DetailSubmissionPage from "@/features/payroll/pages/cash-advance/detail/DetailSubmissionPage";
import DashboardPenggajianPage from "@/features/payroll/pages/dashboard-payroll/DashboardPayrollPage";

import ApprovalPeriodeGajianPage from "@/features/payroll/pages/payroll-period-approval/PayrollPeriodApprovalPage";
import DistribusiGajiPage from "@/features/payroll/pages/distribution-payroll/DistributionPayrollPage";
import JenisPengajuanPage from "@/features/submission-type/pages/SubmissionPage";



// Auth Feature Pages
import { LoginPage, ForgotPasswordPage } from "../features/auth/pages/Index";
import ProtectedOutlet from "./ProtectedOutlet";
import FormKasbonPage from "@/features/payroll/pages/cash-advance/form-cash-advance/FormCashAdvancePage";
import NotFound from "@/pages/OtherPage/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Dashboard Layout */}
      <Route element={<AppLayout />}>
        {/* Public route: pendaftaran karyawan baru */}
        <Route path="/employee-data/pendaftaran" element={<PendaftaranKaryawanBaru />} />
        <Route path="/employee-data/form" element={<FormulirKaryawanPage />} />
        <Route path="/resignation/form" element={<FormResignPage />} />
        {/* Protected routes */}
        <Route element={<ProtectedOutlet />}> 
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route index element={<Dashboard />} />
            <Route path="notification" element={<Notification />} />
          </Route>
          <Route path="/" element={<DashboardPage />}>
            <Route index element={<Dashboard />} />
          </Route>
          {/* <Route index path="/" element={<Dashboard />} /> */}
          <Route path="/structure-and-organize" element={<StructureAndOrganize />}>
            <Route index element={<BusinessLinesTab resetKey="business-lines" />} />
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
          {/* <Route path="/payroll-period" element={<DaftarPenggajianPage />} /> */}
          <Route path="/payroll-configuration" element={<KonfigurasiPenggajianPage />}>
            <Route index element={<KompensasiPage />} />

            <Route path="compensation" element={<KompensasiPage />} />
            <Route path="bpjs" element={<BpjsPage />} />
            <Route path="deduction-reference" element={<AcuanPotonganPage />} />
            <Route path="fixed-allowance" element={<TunjanganTetapPage />} />
            <Route path="non-recurring-allowance" element={<TunjanganTidakTetapPage />} />
            <Route path="non-recurring-deduction" element={<PotonganTidakTetapPage />} />
            <Route path="thr" element={<THRPage />} />
          </Route>
          {/* Dokumentasi: Nested route untuk Periode Penggajian dengan empat tab */}
          <Route path="/payroll-period" element={<PeriodePenggajianPage />}>
            {/* Dokumentasi: index default Non-AE untuk /payroll-period */}
            <Route index element={<NonAETab />} />

            <Route path="non-ae" element={<NonAETab />} />
            <Route path="ae" element={<AETab />} />
            <Route path="internship" element={<PKLTab />} />
            <Route path="holiday-allowance" element={<THRTab />} />
          </Route>
          {/* Dokumentasi: Route Detail Gaji terpisah agar dapat diakses dari tombol Edit */}
          {/* <Route path="/payroll-period/detail/:id" element={<DetailGajiPage />} /> */}
          <Route path="/payroll-period/detail-ae/:id" element={<DetailGajiAEPage />} />
          <Route path="/payroll-period/detail-non-ae/:id" element={<DetailGajiNonAEPage />} />
          <Route path="/payroll-period/detail-thr/:id" element={<DetailGajiTHRPage />} />
          <Route path="/payroll-period/detail-pkl/:id" element={<DetailGajiPKLPage />} />
          {/* Dokumentasi: Nested route untuk Kasbon dengan tiga tab */}
          <Route path="/cash-advance" element={<KasbonPage />}>
            <Route index element={<RiwayatPengajuanPage />} />

            <Route path="submission-history" element={<RiwayatPengajuanPage />} />
            <Route path="cash-advance-status" element={<StatusKasbonPage />} />
            <Route path="approval" element={<CashAdvanceApprovalPage />} />
            <Route path="cash-advance-form" element={<FormKasbonPage />} />
          </Route>
          {/* Dokumentasi: Route untuk Detail Kasbon */}
          <Route path="/cash-advance/detail/:id" element={<DetailSubmissionPage />} />
          <Route path="/payroll-dashboard" element={<DashboardPenggajianPage />} />
          <Route path="/payroll-period-approval" element={<ApprovalPeriodeGajianPage />}>
            {/* Dokumentasi: index default Non-AE untuk /payroll-period-approval */}
            <Route index element={<NonAETab />} />
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
          <Route path="/salary-distribution" element={<DistribusiGajiPage />}>
            {/* Dokumentasi: index default Non-AE untuk /salary-distribution */}
            <Route index element={<NonAETab />} />
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
          
          <Route path="/employee-data" element={<DataKaryawanIndexPage />} />
          <Route path="/employee-data/:id" element={<DetailKaryawanPage />} />
          <Route path="/employee-data/contract-extension" element={<PerpanjanganKontrak />} />
          <Route path="/employee-data/:id/pelanggaran" element={<DataKaryawanPelanggaran />} />
          <Route path="/resignation" element={<PengunduranDiri />} />
          
          <Route path="/resignation/:id" element={<DetailPengunduranDiriPage />} />
          <Route path="/contract-extension" element={<PerpanjanganKontrak />} />
          <Route path="/contract-extension/persetujuan" element={<PersetujuanPerpanjanganKontrak />} />
          <Route path="contract-extension/detail/:id" element={<PerpanjangKontrakEdit />} />
          
          <Route path="/submission-types" element={<JenisPengajuanPage />} />
          <Route path="/organization-history" element={<OrganizationHistoryPage />} />
          <Route path="/organization-history/atasan" element={<OrganizationHistoryAtasanPage />} />
          <Route path="/role-management-access" element={<HakAksesPage />} />
          <Route path="/role-management-access/detail/:roleId" element={<DetailHakAksesPages />} />
          <Route path="/role-management-access/edit/:roleId" element={<EditRolePage />} />

      
          
        </Route>
      </Route>

      {/* Export print view tanpa AppLayout */}
      <Route element={<ProtectedOutlet />}>
        <Route path="/structure-and-organize/export" element={<ExportPage />} />
        <Route path="/export" element={<ExportPage />} />
      </Route>

      {/* Auth Layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
