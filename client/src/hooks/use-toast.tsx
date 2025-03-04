import { createContext, useContext, ReactNode } from 'react';

interface ToastContextType {
  toast: (message: { title: string; description: string }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const toast = (message: { title: string; description: string }) => {
    // Implement toast logic here
    console.log(message.title, message.description);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};