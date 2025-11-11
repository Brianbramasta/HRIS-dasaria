import create from 'zustand';

export type NotificationVariant = 'success' | 'info' | 'warning' | 'error';

export interface AppNotification {
  id: string;
  variant: NotificationVariant;
  title: string;
  description?: string;
  hideDuration?: number;
}

interface NotificationState {
  notifications: AppNotification[];
  addNotification: (payload: Omit<AppNotification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((
  set: (
    partial: Partial<NotificationState> | ((state: NotificationState) => Partial<NotificationState>)
  ) => void,
  get: () => NotificationState
) => ({
  notifications: [],
  addNotification: (payload: Omit<AppNotification, 'id'>) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const item: AppNotification = { id, ...payload };
    set((s: NotificationState) => ({ notifications: [...s.notifications, item] }));

    const duration = item.hideDuration ?? 5000;
    if (duration > 0) {
      // schedule removal
      window.setTimeout(() => {
        const exists = get().notifications.find((n) => n.id === id);
        if (exists) get().removeNotification(id);
      }, duration);
    }

    return id;
  },
  removeNotification: (id: string) => {
    set((s: NotificationState) => ({ notifications: s.notifications.filter((n) => n.id !== id) }));
  },
  clearNotifications: () => set({ notifications: [] }),
}));

// convenience wrappers
export const addNotification = (payload: Omit<AppNotification, 'id'>) =>
  useNotificationStore.getState().addNotification(payload);

export const removeNotification = (id: string) =>
  useNotificationStore.getState().removeNotification(id);

export default useNotificationStore;
