import { toast } from "sonner";

export function useToast() {
  return {
    toast,
    dismiss: toast.dismiss,
    success: toast.success,
    error: toast.error,
    info: toast.info,
    warning: toast.warning,
  };
}

export { toast };

