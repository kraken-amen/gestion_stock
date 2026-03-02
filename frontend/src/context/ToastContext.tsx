import { createContext, useContext, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import type { Toast } from '../types';
import type { ToastContextType } from '../types';
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast}}>
      {children}
      
      <div className="fixed top-6 right-6 z-[9999] space-y-3 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-4 p-4 rounded-lg backdrop-blur-xl border-2 shadow-lg animate-in slide-in-from-right transition-all duration-300 ${
              t.type === 'success'
                ? 'bg-green-500/20 border-green-400/50 text-green-100'
                : 'bg-red-500/20 border-red-400/50 text-red-100'
            }`}
          >
            <div className={`w-1 h-1 rounded-full mt-1.5 ${t.type === 'success' ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <p className="flex-1 font-medium text-sm leading-tight">{t.message}</p>
            <button onClick={() => removeToast(t.id)} className="text-white/50 hover:text-white">
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};