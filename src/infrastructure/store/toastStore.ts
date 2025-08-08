import { create } from "zustand";

export interface ToastData {
  id: string;
  type: "success" | "error" | "pending" | "info";
  title: string;
  message: string;
  transactionHash?: string;
  duration?: number;
  viewTransactionText?: string;
}

interface ToastStore {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, "id">) => void;
  removeToast: (id: string) => void;
  showSuccess: (
    title: string,
    message: string,
    transactionHash?: string,
    viewTransactionText?: string
  ) => void;
  showError: (title: string, message: string) => void;
  showPending: (
    title: string,
    message: string,
    transactionHash?: string,
    viewTransactionText?: string
  ) => void;
  showInfo: (title: string, message: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>()((set, get) => ({
  toasts: [],

  addToast: (toast: Omit<ToastData, "id">) => {
    const id = `${toast.type}-${
      toast.transactionHash || Date.now()
    }-${Math.random().toString(36).substring(2, 11)}`;
    const newToast: ToastData = {
      ...toast,
      id,
      duration: toast.duration || 4000, // Default shorter duration
    };

    set((state) => {
      // Check if there's already a toast with the same transaction hash
      const existingToastIndex = state.toasts.findIndex(
        (existingToast) =>
          existingToast.transactionHash === newToast.transactionHash
      );

      if (existingToastIndex !== -1) {
        // Update the existing toast instead of replacing it
        const updatedToasts = [...state.toasts];
        updatedToasts[existingToastIndex] = {
          ...newToast,
          id: state.toasts[existingToastIndex].id, // Keep the same ID to preserve React key
        };
        return { toasts: updatedToasts };
      }

      // Add new toast if no existing toast with same hash
      return { toasts: [...state.toasts, newToast] };
    });

    // Auto-remove toast after duration (always remove, even for pending toasts with duration > 0)
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  showSuccess: (
    title: string,
    message: string,
    transactionHash?: string,
    viewTransactionText?: string
  ) => {
    get().addToast({
      type: "success",
      title,
      message,
      transactionHash,
      viewTransactionText,
      duration: 5000, // Success toasts disappear after 5 seconds
    });
  },

  showError: (title: string, message: string) => {
    get().addToast({
      type: "error",
      title,
      message,
      duration: 6000, // Error toasts disappear after 6 seconds
    });
  },

  showPending: (
    title: string,
    message: string,
    transactionHash?: string,
    viewTransactionText?: string
  ) => {
    get().addToast({
      type: "pending",
      title,
      message,
      transactionHash,
      viewTransactionText,
      duration: 8000, // Pending toasts disappear after 8 seconds
    });
  },

  showInfo: (title: string, message: string) => {
    get().addToast({
      type: "info",
      title,
      message,
      duration: 4000, // Info toasts disappear after 4 seconds
    });
  },

  clearToasts: () => {
    set({ toasts: [] });
  },
}));
