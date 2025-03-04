import { useToast } from "../../hooks/use-toast"; // Corrected import path
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast"; // Corrected import path

interface ToastType {
  id: string; // Assuming id is a string, adjust if necessary
  title?: string;
  description?: string;
  action?: React.ReactNode; // Adjust type as necessary
}

interface ToastContextType {
  toasts: ToastType[];
  // other properties and methods
}

export function useToastContext(): ToastContextType {
  // Your existing code
  return {
    toasts: [], // Replace with actual toasts array
    // other properties and methods
  };
}

export function Toaster() {
  const { toasts } = useToastContext();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }: ToastType) => {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
