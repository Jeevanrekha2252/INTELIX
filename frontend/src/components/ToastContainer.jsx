import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export default function ToastContainer() {
  const { toasts } = useProject();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isDanger = toast.type === 'danger';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all animate-in slide-in-from-bottom-3 duration-300 ${
              isSuccess
                ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-100 shadow-emerald-950/50'
                : isDanger
                ? 'bg-rose-950/90 border-rose-500/30 text-rose-100 shadow-rose-950/50'
                : isWarning
                ? 'bg-amber-950/90 border-amber-500/30 text-amber-100 shadow-amber-950/50'
                : 'bg-slate-900/90 border-cyan-500/30 text-cyan-100 shadow-cyan-950/50'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 size={18} className="text-emerald-400" />}
              {isDanger && <AlertOctagon size={18} className="text-rose-400" />}
              {isWarning && <AlertTriangle size={18} className="text-amber-400" />}
              {!isSuccess && !isDanger && !isWarning && <Info size={18} className="text-cyan-400" />}
            </div>
            <div className="text-xs font-medium leading-relaxed flex-1">
              {toast.message}
            </div>
          </div>
        );
      })}
    </div>
  );
}
