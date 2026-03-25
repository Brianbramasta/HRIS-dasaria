// import { useEffect } from "react";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useAuthStore } from "../features/auth/stores/AuthStore";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { getBreadcrumbConfig } from "../utils/breadcrumbConfig";
import PayrollModalTrigger from "./PayrollModalTrigger";
import LoginPayrollModal from "../features/payroll/components/modals/LoginPayrollModal";
import { useLoginPayrollModalStore } from "../features/payroll/store/useLoginPayrollModalStore";
import { SpamModal } from "../features/employee/components/modals/SpamModal";
// import { useSpamModalStore } from "../stores/useSpamModalStore";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();
  const breadcrumbConfig = getBreadcrumbConfig(location.pathname, location.state);

  return (
    <div className="min-h-screen xl:flex">
      {isAuthenticated && (
        <div>
          <AppSidebar />
          <Backdrop />
        </div>
      )}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${isAuthenticated && (isExpanded || isHovered)
            ? "lg:ml-[290px] lg:max-w-[calc(100%-290px)]"
            : isAuthenticated
              ? "lg:ml-[90px] lg:max-w-[calc(100%-90px)]"
              : "lg:ml-0 lg:max-w-full"
          } ${isMobileOpen ? "ml-0" : ""}`}
      >
        {isAuthenticated && <AppHeader />}
        {/* <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 "> */}
        <div className="p-4 mx-auto  md:p-6 ">
          <div className="mx-4">
            {isAuthenticated && breadcrumbConfig && (
              <PageBreadcrumb
                pageTitle={breadcrumbConfig.title}
                breadcrumbs={breadcrumbConfig.breadcrumbs}
              />
            )}
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  const { isOpen: isLoginModalOpen } = useLoginPayrollModalStore();
  // const { setOpen: setSpamModalOpen } = useSpamModalStore();
  // const location = useLocation();
  // const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Handle URL parameter SpamModal=true
  // useEffect(() => {
  //   const searchParams = new URLSearchParams(location.search);
  //   const showSpamModal = searchParams.get("SpamModal") === "true";
  //   if (showSpamModal && isAuthenticated) {
  //     setSpamModalOpen(true);
  //   }
  // }, [location.search, setSpamModalOpen, isAuthenticated]);

  return (
    <SidebarProvider>
      <PayrollModalTrigger />
      <LoginPayrollModal />
      <SpamModal />
      {!isLoginModalOpen && <LayoutContent />}
    </SidebarProvider>
  );
};

export default AppLayout;
