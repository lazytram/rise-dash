import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreKeys } from "./storeKeys";

export interface Toast {
  id: string;
  type: "success" | "error" | "pending" | "info";
  title: string;
  message: string;
  transactionHash?: string;
  duration?: number;
  viewTransactionText?: string;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
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

export const useToastStore = create<ToastStore>()(
  persist(
    (set, get) => ({
      toasts: [],

      addToast: (toast: Omit<Toast, "id">) => {
        const id = `${toast.type}-${
          toast.transactionHash || Date.now()
        }-${Math.random().toString(36).substr(2, 9)}`;
        const newToast: Toast = {
          ...toast,
          id,
          duration: toast.duration || 5000,
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

        // Auto-remove toast after duration
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
          duration: 8000, // Success toasts stay longer
        });
      },

      showError: (title: string, message: string) => {
        get().addToast({
          type: "error",
          title,
          message,
          duration: 10000, // Error toasts stay longer
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
          duration: 0, // Pending toasts don't auto-remove
        });
      },

      showInfo: (title: string, message: string) => {
        get().addToast({
          type: "info",
          title,
          message,
          duration: 5000,
        });
      },

      clearToasts: () => {
        set({ toasts: [] });
      },
    }),
    {
      name: StoreKeys.ToastStore,
    }
  )
);
