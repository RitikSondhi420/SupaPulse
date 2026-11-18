import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        let borderClass = 'border-supabase-border';
        let icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;

        if (toast.type === 'success') {
          borderClass = 'border-[#3ecf8e]/50 bg-[#162720]/95 shadow-[0_0_20px_rgba(62,207,142,0.15)]';
          icon = <CheckCircle2 className="w-5 h-5 text-[#3ecf8e] shrink-0" />;
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-500/50 bg-[#291418]/95 shadow-[0_0_20px_rgba(244,63,94,0.15)]';
          icon = <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-500/50 bg-[#292013]/95 shadow-[0_0_20px_rgba(245,158,11,0.15)]';
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
        } else {
          borderClass = 'border-blue-500/50 bg-[#141d2b]/95 shadow-[0_0_20px_rgba(59,130,246,0.15)]';
          icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md transition-all duration-300 animate-slide-up ${borderClass}`}
          >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-neutral-100">{toast.title}</h4>
              <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-neutral-400 hover:text-neutral-200 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
