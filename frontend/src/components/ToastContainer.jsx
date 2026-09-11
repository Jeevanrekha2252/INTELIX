import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X, ArrowRight } from 'lucide-react';
import { useRealtimeNotifications } from '../context/RealtimeNotificationContext';
import { useProject } from '../context/ProjectContext';

export default function ToastContainer() {
  let toasts = [];
  let dismissToast = () => {};

  try {
    const realtime = useRealtimeNotifications();
    toasts = realtime.toasts || [];
    dismissToast = realtime.dismissToast;
  } catch {
    // Graceful fallback if rendered outside RealtimeNotificationProvider
  }

  const { setActiveView } = useProject();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isCritical = toast.severity === 'CRITICAL' || toast.severity === 'HIGH' || toast.type === 'danger';
        const isWarning = toast.severity === 'WARNING' || toast.type === 'warning';
        const isSuccess = toast.severity === 'SUCCESS' || toast.type === 'success';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex flex-col p-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all animate-in slide-in-from-bottom-3 duration-300 ${
              isCritical
                ? 'bg-rose-950/95 border-rose-500/40 text-rose-100 shadow-rose-950/60 ring-1 ring-rose-500/20'
                : isWarning
                ? 'bg-amber-950/95 border-amber-500/40 text-amber-100 shadow-amber-950/60 ring-1 ring-amber-500/20'
                : isSuccess
                ? 'bg-emerald-950/95 border-emerald-500/40 text-emerald-100 shadow-emerald-950/60'
                : 'bg-slate-900/95 border-cyan-500/30 text-cyan-100 shadow-cyan-950/50'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div className="shrink-0 mt-0.5">
                {isCritical && <AlertOctagon size={18} className="text-rose-400 animate-pulse" />}
                {isWarning && <AlertTriangle size={18} className="text-amber-400" />}
                {isSuccess && <CheckCircle2 size={18} className="text-emerald-400" />}
                {!isCritical && !isWarning && !isSuccess && <Info size={18} className="text-cyan-400" />}
              </div>

              <div className="flex-1 min-w-0">
                {toast.title && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white tracking-tight truncate">
                      {toast.title}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase shrink-0 ${
                      isCritical ? 'bg-rose-500/30 text-rose-300' : (isWarning ? 'bg-amber-500/30 text-amber-300' : 'bg-cyan-500/20 text-cyan-300')
                    }`}>
                      {toast.severity || 'ALERT'}
                    </span>
                  </div>
                )}
                <div className="text-xs font-normal leading-relaxed text-slate-200 mt-0.5">
                  {toast.message}
                </div>
              </div>

              <button
                onClick={() => dismissToast(toast.id)}
                className="shrink-0 text-slate-400 hover:text-white p-1 rounded-lg transition"
                title="Dismiss"
              >
                <X size={14} />
              </button>
            </div>

            {/* Action buttons if available */}
            {toast.actionLabel && (
              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    dismissToast(toast.id);
                    if (toast.actionView) {
                      setActiveView(toast.actionView);
                    }
                  }}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                    isCritical
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
                      : isWarning
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                  }`}
                >
                  <span>{toast.actionLabel}</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
