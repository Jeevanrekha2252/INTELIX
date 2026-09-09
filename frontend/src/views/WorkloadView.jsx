import React, { useMemo } from 'react';
import {
  Users2,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Briefcase,
  Layers,
  AlertOctagon
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { calculateRebalancePlan } from '../services/mlEngine';

export default function WorkloadView() {
  const {
    teamWorkload,
    tasks,
    applyRebalancePlan,
    showToast
  } = useProject();

  const rebalancePlan = useMemo(() => {
    return calculateRebalancePlan(teamWorkload, tasks);
  }, [teamWorkload, tasks]);

  const overloadedMembers = teamWorkload.filter(m => m.load > 85);
  const availableMembers = teamWorkload.filter(m => m.load < 75);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#252A3A]">
        <div>
          <div className="label-tech text-[#39D9FF]">RESOURCE ALLOCATION & CAPACITY</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
            TEAM BANDWIDTH & CAPACITY BALANCER
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            "Track weekly capacity allocations and rebalance tasks across engineers to avoid delivery burnout."
          </p>
        </div>

        {rebalancePlan.canRebalance && (
          <button
            onClick={() => applyRebalancePlan(rebalancePlan.suggestions)}
            className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 w-fit"
          >
            <Zap size={14} />
            <span>Apply Workload Rebalance</span>
          </button>
        )}
      </div>

      {/* Overload Alert / Rebalance Recommendation Callout */}
      {rebalancePlan.canRebalance && (
        <div className="surface-card rounded-2xl p-5 border border-[#7C5CFF]/40 bg-gradient-to-r from-[#131522] to-[#171A2A]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#7C5CFF]/20 text-[#AE9AFF] grid place-items-center">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#F4F7FF]">
                  AI Workload Rebalance Suggestion Available
                </h3>
                <p className="text-xs text-[#8992A8] mt-0.5">
                  Marcus Vance is currently at <strong className="text-[#FF4D6D]">125% sprint load</strong>. Offloading tasks to Diya Patel balances team bandwidth below 90%.
                </p>
              </div>
            </div>

            <button
              onClick={() => applyRebalancePlan(rebalancePlan.suggestions)}
              className="btn-violet px-4 py-2 rounded-xl text-xs font-bold shrink-0"
            >
              Rebalance Sprint (1-Click)
            </button>
          </div>
        </div>
      )}

      {/* Team Member Capacity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamWorkload.map(member => {
          const isOverloaded = member.load > 90;
          const isWatch = member.load > 75 && !isOverloaded;

          return (
            <div
              key={member.name}
              className={`surface-card rounded-2xl p-5 border transition flex flex-col justify-between ${
                isOverloaded
                  ? 'border-[#FF4D6D]/40 bg-[#171A2A]'
                  : isWatch
                  ? 'border-[#F5B942]/40 bg-[#131522]'
                  : 'border-[#252A3A] bg-[#131522]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 mb-3 border-b border-[#252A3A]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#0D101A] border border-[#252A3A] font-mono font-bold text-xs text-[#F4F7FF] grid place-items-center">
                      {member.avatar || member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#F4F7FF]">{member.name}</div>
                      <div className="text-[10px] text-[#8992A8]">{member.role}</div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                    isOverloaded ? 'badge-critical' : isWatch ? 'badge-warning' : 'badge-success'
                  }`}>
                    {member.load}% {isOverloaded && '⚠'}
                  </span>
                </div>

                {/* Capacity Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8992A8]">Sprint Allocation</span>
                    <span className="font-mono text-[#F4F7FF]">{member.loggedHours || 35}h / 40h</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#0D101A] border border-[#252A3A] overflow-hidden">
                    <div
                      className={`h-full ${
                        isOverloaded
                          ? 'bg-[#FF4D6D]'
                          : isWatch
                          ? 'bg-[#F5B942]'
                          : 'bg-[#18C997]'
                      }`}
                      style={{ width: `${Math.min(100, member.load)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-center">
                  <div className="p-2 rounded-lg bg-[#0D101A] border border-[#252A3A]">
                    <div className="text-[10px] font-mono text-[#8992A8]">ACTIVE TASKS</div>
                    <div className="font-bold text-[#F4F7FF] font-mono mt-0.5">{member.activeTasks}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#0D101A] border border-[#252A3A]">
                    <div className="text-[10px] font-mono text-[#8992A8]">COMPLETED</div>
                    <div className="font-bold text-[#18C997] font-mono mt-0.5">{member.completedTasks}</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-[#252A3A] flex items-center justify-between text-[11px] text-[#8992A8]">
                <span>Status: <strong className="text-[#F4F7FF]">{member.status || 'Optimal'}</strong></span>
                <span className="text-[#39D9FF]">40h Work Week</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
