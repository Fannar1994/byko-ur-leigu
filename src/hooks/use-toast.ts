
import { toast as sonnerToast } from "sonner";

// Create a proxy toast function that matches our expected interface
const toast = sonnerToast;

// Export what we need
export { toast };

// Define a minimal useToast hook to match the existing API
export const useToast = () => {
  return {
    toast,
    toasts: []
  };
};
