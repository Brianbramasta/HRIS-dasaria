import { BrowserRouter as Router } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";
import Notification from "./components/ui/notification/Notfication";
import { useNotificationStore, removeNotification } from "./stores/notificationStore";
import type { AppNotification } from "./stores/notificationStore";

export default function App() {
  const notifications = useNotificationStore((s) => s.notifications);

  return (
    <>
      <Router>
        <ScrollToTop />
        <AppRoutes />
      </Router>

      {/* Global notification container so pages don't need to render it */}
      <div className="fixed right-4 top-24 flex flex-col gap-3 z-[9999] bg-white">
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
    </>
  );
}
