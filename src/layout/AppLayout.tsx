import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useAuthStore } from "../features/auth/stores/authStore";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="min-h-screen xl:flex">
      {isAuthenticated && (
        <div>
          <AppSidebar />
          <Backdrop />
        </div>
      )}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isAuthenticated && (isExpanded || isHovered)
            ? "lg:ml-[290px] lg:max-w-[calc(100%-290px)]"
            : isAuthenticated
            ? "lg:ml-[90px] lg:max-w-[calc(100%-90px)]"
            : "lg:ml-0 lg:max-w-full"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        {isAuthenticated && <AppHeader />}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 bg-white dark:bg-[#1A1A1A]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
