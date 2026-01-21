import { create } from 'zustand';
import type { Toast, ToastType } from '../types/toast';

interface ToastStore {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  showToast: (message: string, type: ToastType = 'info', duration?: number) => {
    const id = Math.random().toString(36).substring(7);
    const toast: Toast = { id, message, type, duration };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  success: (message: string) => {
    useToastStore.getState().showToast(message, 'success');
  },

  error: (message: string) => {
    useToastStore.getState().showToast(message, 'error');
  },

  info: (message: string) => {
    useToastStore.getState().showToast(message, 'info');
  },

  warning: (message: string) => {
    useToastStore.getState().showToast(message, 'warning');
  },
}));