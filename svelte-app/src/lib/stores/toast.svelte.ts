import { writable } from 'svelte/store';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  variant: "default" | "success" | "destructive" | "warning";
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

let counter = 0;

function createToastStore() {
  const { subscribe, update } = writable<ToastState>({
    toasts: [],
    addToast: () => {},
    dismiss: () => {}
  });

  const store = {
    subscribe,
    
    addToast: (toast: Omit<Toast, "id">) => {
      const id = String(++counter);
      update(s => ({ 
        ...s, 
        toasts: [...s.toasts, { ...toast, id }],
        addToast: store.addToast,
        dismiss: store.dismiss
      }));

      const duration = toast.duration ?? 4000;
      setTimeout(() => {
        store.dismiss(id);
      }, duration);
    },
    
    dismiss: (id: string) => {
      update(s => ({ 
        ...s, 
        toasts: s.toasts.filter((t) => t.id !== id),
        addToast: store.addToast,
        dismiss: store.dismiss
      }));
    }
  };

  return store;
}

export const toastStore = createToastStore();

// Convenience functions for one-line usage across the app
export const toast = {
  success: (title: string, message?: string) =>
    toastStore.addToast({ title, message, variant: "success" }),
  error: (title: string, message?: string) =>
    toastStore.addToast({ title, message, variant: "destructive" }),
  warning: (title: string, message?: string) =>
    toastStore.addToast({ title, message, variant: "warning" }),
  info: (title: string, message?: string) =>
    toastStore.addToast({ title, message, variant: "default" }),
};
