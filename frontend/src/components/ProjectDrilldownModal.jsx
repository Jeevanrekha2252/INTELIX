import React from 'react';
import {
  X,
  Plus,
  Building2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { calculateEVM } from '../services/mlEngine';
import HealthRing from './HealthRing';

export default function ProjectDrilldownModal() {
  const {
    drilldownProject,
    setDrilldownProject,
    tasks,
    setEditingTask,
    setIsCreateTaskOpen
  } = useProject();

  if (!drilldownProject) return null;

  const projectTasks = tasks.filter(t => t.projectId === drilldownProject.id || t.project === drilldownProject.name);
  const evm = calculateEVM(drilldownProject, projectTasks);
  const highRiskTasks = projectTasks.filter(t => t.risk >= 65 || t.blocked);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-100">
      <div className="surface-modal rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold uppercase tracking-wider">
              <span>{drilldownProject.ministry || drilldownProject.category}</span>
              <span>•</span>
              <span className="text-slate-400">Initiative #{drilldownProject.id}</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">{drilldownProject.name}</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              {drilldownProject.description}
            </p>
          </div>

          <button
            onClick={() => setDrilldownProject(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Health & EVM */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 surface-panel rounded-xl p-4 flex items-center gap-4">
              <HealthRing value={drilldownProject.health} />
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Status</span>
                  <span className={`text-xs font-bold ${
                    drilldownProject.health >= 75 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {drilldownProject.status}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Progress</span>
                  <span className="text-white font-bold text-base">{drilldownProject.progress}%</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Target ETA</span>
                  <span className="text-slate-300 font-medium">{drilldownProject.deadline}</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 surface-panel rounded-xl p-4">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  EVM Financial Tracking
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  evm.cpi >= 1 ? 'badge-success' : 'badge-critical'
                }`}>
                  CPI: {evm.cpi} · {evm.costEfficiency}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Planned (PV)</div>
                  <div className="text-xs font-bold text-white mt-0.5 font-mono">₹{(evm.plannedValue).toLocaleString('en-IN')}</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Earned (EV)</div>
                  <div className="text-xs font-bold text-blue-400 mt-0.5 font-mono">₹{(evm.earnedValue).toLocaleString('en-IN')}</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Actual (AC)</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5 font-mono">₹{(evm.actualCost).toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                <span>Cost Variance: <strong className={evm.costVariance >= 0 ? 'text-emerald-400' : 'text-rose-400'}>₹{evm.costVariance.toLocaleString('en-IN')}</strong></span>
                <span>Schedule Index (SPI): <strong className="text-blue-400">{evm.spi}</strong></span>
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Associated Sprint Deliverables ({projectTasks.length})</span>
                {highRiskTasks.length > 0 && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded badge-critical font-bold">
                    {highRiskTasks.length} At Risk
                  </span>
                )}
              </h3>

              <button
                onClick={() => {
                  setEditingTask(null);
                  setIsCreateTaskOpen(true);
                }}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <Plus size={13} /> Add Deliverable
              </button>
            </div>

            <div className="space-y-1.5">
              {projectTasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => {
                    setEditingTask(task);
                    setIsCreateTaskOpen(true);
                  }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-3">
                    <div className="w-7 h-7 rounded bg-slate-800 text-blue-400 grid place-items-center text-xs font-bold shrink-0">
                      {task.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                        {task.title}
                        {task.blocked && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded badge-critical font-bold">
                            BLOCKED
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {task.assignee} · Due {task.due} · {task.priority} Priority
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-20 hidden sm:block">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                        <span>{task.progress}%</span>
                      </div>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      task.risk >= 65 ? 'badge-critical' : 'badge-success'
                    }`}>
                      R:{task.risk}
                    </span>

                    <span className="text-slate-400 text-xs">Edit →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs text-slate-400">
          <span>Project Director: <strong className="text-white">{drilldownProject.owner}</strong></span>
          <button
            onClick={() => setDrilldownProject(null)}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs transition"
          >
            Close Drilldown
          </button>
        </div>
      </div>
    </div>
  );
}
