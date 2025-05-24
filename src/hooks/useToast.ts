import { toast } from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'loading' | 'custom';

interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  icon?: string;
}

export function useToast() {
  const showToast = (
    message: string,
    type: ToastType = 'success',
    options: ToastOptions = {}
  ) => {
    const { duration = 3000, position = 'top-right', icon } = options;

    const toastOptions = {
      duration,
      position,
      ...(icon && { icon }),
    };

    switch (type) {
      case 'success':
        return toast.success(message, toastOptions);
      case 'error':
        return toast.error(message, { ...toastOptions, duration: 5000 });
      case 'loading':
        return toast.loading(message, toastOptions);
      case 'custom':
      default:
        return toast(message, toastOptions);
    }
  };

  const dismissToast = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  return { showToast, dismissToast, toast };
}

export default useToast;
