import React from 'react';
import { ArrowUpRight, AlertOctagon, AlertTriangle } from 'lucide-react';

export default function RiskCard({ task }) {
  if (!task) return null;

  const isCritical = task.risk >= 65 || task.blocked;

  return (
    <div className="p-4 rounded-xl surface-card hover:border-slate-700 transition group">
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-blue-400 font-semibold">{task.project}</span>
            {task.blocked && (
              <span className="text-[9px] px-1.5 py-0.2 rounded badge-critical font-bold">
                BLOCKED
              </span>
            )}
          </div>
          <div className="text-xs font-bold text-white group-hover:text-blue-400 transition truncate">
            {task.title}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
            <span>{task.assignee}</span>
            <span>•</span>
            <span>Due {task.due}</span>
          </div>
        </div>

        <div
          className={`text-xs font-bold px-2 py-0.5 rounded-md shrink-0 font-mono ${
            isCritical ? 'badge-critical' : 'badge-warning'
          }`}
        >
          {task.risk}/100
        </div>
      </div>

      <div className="mt-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isCritical ? 'bg-rose-500' : 'bg-amber-400'
          }`}
          style={{ width: `${Math.min(100, task.risk)}%` }}
        />
      </div>

      <div className="flex justify-between items-center mt-3 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5 truncate pr-2">
          {task.blocked ? (
            <AlertOctagon size={13} className="text-rose-400 shrink-0" />
          ) : (
            <AlertTriangle size={13} className="text-amber-400 shrink-0" />
          )}
          <span className="truncate">{task.blocked ? (task.blockerReason || 'Blocked by external dependency') : 'Schedule pressure'}</span>
        </span>

        <span className="flex items-center gap-1 text-blue-400 font-semibold text-xs shrink-0 group-hover:translate-x-0.5 transition">
          Inspect <ArrowUpRight size={13} />
        </span>
      </div>
    </div>
  );
}
