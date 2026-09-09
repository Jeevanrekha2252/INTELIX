import React from 'react';

export default function HealthRing({ value = 84, size = 110 }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  const clampedValue = Math.min(100, Math.max(0, value));
  const offset = c - (clampedValue / 100) * c;

  const isHigh = clampedValue >= 75;
  const isMedium = clampedValue >= 55 && clampedValue < 75;

  const strokeColor = isHigh ? '#10b981' : isMedium ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="56"
          cy="56"
          r={r}
          fill="none"
          stroke="#1e293b"
          strokeWidth="8"
        />
        <circle
          cx="56"
          cy="56"
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-2xl font-black text-white tracking-tight">{clampedValue}</div>
          <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Health Score</div>
        </div>
      </div>
    </div>
  );
}
