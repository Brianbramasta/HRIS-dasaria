import { BrowserRouter as Router } from "react-router";
import { useEffect } from "react";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";
import Notification from "./components/ui/notification/Notfication";
import { useNotificationStore, removeNotification } from "./stores/notificationStore";
import type { AppNotification } from "./stores/notificationStore";
import { useAuthStore } from "./features/auth/stores/authStore";
import SpinnerOne from "./components/ui/spinner/SpinnerOne";
import { useLoadingStore } from "./stores/loadingStore";

export default function App() {
  const notifications = useNotificationStore((s) => s.notifications);
  const hydrate = useAuthStore((s) => s.hydrate);
  const isLoading = useLoadingStore((s) => s.isLoading);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <>
      <Router>
        <ScrollToTop />
        <AppRoutes />
      </Router>

      {/* Global notification container so pages don't need to render it */}
      <div className="fixed right-4 top-24 flex flex-col gap-3 z-[999999999] bg-white">
        {notifications.map((n: AppNotification) => (
          <Notification
            key={n.id}
            variant={n.variant}
            title={n.title}
            description={n.description}
            hideDuration={n.hideDuration}
            onClose={() => removeNotification(n.id)}
          />
        ))}
      </div>

      {/* Global loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="rounded-md bg-white/80 p-4">
            <SpinnerOne />
          </div>
        </div>
      )}
    </>
  );
}
