
import { toast } from "sonner";

export function useStatusNotifications() {
  const notifySuccess = (title: string, description: string) => {
    toast.success(title, {
      description,
    });
  };

  const notifyInfo = (title: string, description: string) => {
    toast.info(title, {
      description,
    });
  };

  const notifyError = (title: string, description: string) => {
    toast.error(title, {
      description,
    });
  };

  return {
    notifySuccess,
    notifyInfo,
    notifyError
  };
}
