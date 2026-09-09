import React from 'react';

export default function Metric({ label, value, delta, icon: Icon, tone = 'blue', onClick }) {
  const toneClasses = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
  };

  return (
    <div
      onClick={onClick}
      className={`surface-card rounded-xl p-5 hover:border-slate-700 transition duration-150 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div className={`w-9 h-9 rounded-lg grid place-items-center border ${toneClasses[tone] || toneClasses.blue}`}>
          {Icon && <Icon size={17} />}
        </div>
        {delta && (
          <span className="text-[11px] font-semibold text-slate-300 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md">
            {delta}
          </span>
        )}
      </div>
      <div className="mt-4 text-2xl font-black text-white tracking-tight">{value}</div>
      <div className="text-xs text-slate-400 mt-1 font-medium">{label}</div>
    </div>
  );
}
