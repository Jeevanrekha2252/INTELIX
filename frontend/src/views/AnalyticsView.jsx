import React, { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  PieChart as PieIcon,
  Layers,
  Activity
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { useProject } from '../context/ProjectContext';

const HEALTH_TREND_DATA = [
  { sprint: 'Sprint 1', health: 86, completion: 25, risks: 1 },
  { sprint: 'Sprint 2', health: 84, completion: 45, risks: 2 },
  { sprint: 'Sprint 3', health: 79, completion: 60, risks: 4 },
  { sprint: 'Sprint 4 (Current)', health: 72, completion: 68, risks: 7 },
  { sprint: 'Sprint 5 (Forecast)', health: 81, completion: 88, risks: 2 }
];

const EVM_METRICS = [
  { label: 'Planned Value (PV)', value: '₹32,40,000', desc: 'Approved baseline budget of scheduled work' },
  { label: 'Earned Value (EV)', value: '₹29,80,000', desc: 'Budgeted cost of work completed to date' },
  { label: 'Actual Cost (AC)', value: '₹28,40,000', desc: 'Total direct and indirect spend incurred' },
  { label: 'Cost Performance Index (CPI)', value: '1.05', desc: 'EV / AC (>1.0 indicates under budget)', status: 'positive' },
  { label: 'Schedule Performance Index (SPI)', value: '0.92', desc: 'EV / PV (<1.0 indicates schedule lag)', status: 'warning' }
];

export default function AnalyticsView() {
  const { projects, tasks, teamWorkload } = useProject();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#252A3A]">
        <div>
          <div className="label-tech text-[#39D9FF]">PREDICTIVE TELEMETRY & EVM METRICS</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
            PORTFOLIO ANALYTICS & EARNED VALUE
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            "Every metric answers a mission-critical project execution question."
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge-info text-xs px-3 py-1 rounded-lg font-mono font-bold">
            SPI: 0.92 · CPI: 1.05
          </span>
        </div>
      </div>

      {/* EVM Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {EVM_METRICS.map((evm, idx) => (
          <div key={idx} className="surface-card rounded-2xl p-4 border border-[#252A3A]">
            <div className="text-[10px] font-mono text-[#8992A8] uppercase tracking-wider">{evm.label}</div>
            <div className={`text-xl font-black font-mono mt-1 ${evm.status === 'positive' ? 'text-[#18C997]' : evm.status === 'warning' ? 'text-[#F5B942]' : 'text-[#F4F7FF]'}`}>
              {evm.value}
            </div>
            <p className="text-[10px] text-[#8992A8] mt-1 leading-snug">{evm.desc}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Project Health & Completion Trajectory */}
        <div className="surface-card rounded-2xl p-5 border border-[#252A3A]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#252A3A]">
            <div className="label-tech text-[#8992A8]">PROJECT HEALTH & COMPLETION TREND</div>
            <span className="text-xs font-mono text-[#39D9FF]">SPRINTS 1–5</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HEALTH_TREND_DATA}>
                <defs>
                  <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F7CFF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4F7CFF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#252A3A" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="sprint" stroke="#555E73" fontSize={11} />
                <YAxis stroke="#555E73" fontSize={11} domain={[40, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#131522', borderColor: '#252A3A', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="health" stroke="#4F7CFF" strokeWidth={2} fillOpacity={1} fill="url(#healthGrad)" name="Health Score" />
                <Line type="monotone" dataKey="completion" stroke="#18C997" strokeWidth={2} name="Completion %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Team Capacity Distribution */}
        <div className="surface-card rounded-2xl p-5 border border-[#252A3A]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#252A3A]">
            <div className="label-tech text-[#8992A8]">TEAM SPRINT CAPACITY ALLOCATION</div>
            <span className="text-xs font-mono text-[#F5B942]">40H CEILING</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamWorkload}>
                <CartesianGrid stroke="#252A3A" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#555E73" fontSize={10} tickFormatter={(n) => n.split(' ')[0]} />
                <YAxis stroke="#555E73" fontSize={11} domain={[0, 140]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#131522', borderColor: '#252A3A', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="load" fill="#4F7CFF" radius={[6, 6, 0, 0]} name="Capacity Load %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
