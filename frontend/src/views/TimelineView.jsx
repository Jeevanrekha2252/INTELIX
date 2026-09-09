import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export default function TimelineView() {
  const { tasks, projects } = useProject();
  const [selectedProject, setSelectedProject] = useState('All');

  const filteredTasks = tasks.filter(t => selectedProject === 'All' || t.project === selectedProject);

  const timelineDays = [
    { day: '14 Sep', label: 'Mon' },
    { day: '16 Sep', label: 'Wed' },
    { day: '18 Sep', label: 'Fri' },
    { day: '20 Sep', label: 'Sun' },
    { day: '22 Sep', label: 'Tue' },
    { day: '24 Sep', label: 'Thu' },
    { day: '26 Sep', label: 'Sat' },
    { day: '28 Sep', label: 'Mon (Forecast)' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#252A3A]">
        <div>
          <div className="label-tech text-[#39D9FF]">GANTT SCHEDULE & MILESTONES</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
            SPRINT TIMELINE & CRITICAL SCHEDULE
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            "Track deliverable horizons, critical path milestones, and projected delay markers."
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-1.5 bg-[#0D101A] border border-[#252A3A] rounded-xl text-xs font-semibold text-[#F4F7FF]"
          >
            <option value="All">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline Gantt Chart */}
      <div className="surface-card rounded-2xl border border-[#252A3A] overflow-hidden">
        {/* Timeline Header Days */}
        <div className="grid grid-cols-12 bg-[#0D101A] border-b border-[#252A3A] text-xs font-mono font-bold text-[#8992A8] p-3.5">
          <div className="col-span-4 uppercase tracking-wider">Deliverable / Task</div>
          <div className="col-span-8 grid grid-cols-8 text-center text-[10px]">
            {timelineDays.map((d, idx) => (
              <div key={idx} className={`${idx === 7 ? 'text-[#FF859B]' : ''}`}>
                <div>{d.label}</div>
                <div className="text-[9px] text-[#555E73]">{d.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Deliverable Rows */}
        <div className="divide-y divide-[#252A3A]">
          {filteredTasks.map(t => {
            const isDelayed = t.risk >= 65 || t.blocked;
            const progress = t.progress;

            return (
              <div key={t.id} className="grid grid-cols-12 p-3.5 hover:bg-[#171A2A] transition items-center text-xs">
                <div className="col-span-4 pr-3">
                  <div className="font-bold text-[#F4F7FF] truncate flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-[#39D9FF]">TASK-{t.id}</span>
                    <span className="truncate">{t.title}</span>
                  </div>
                  <div className="text-[11px] text-[#8992A8] truncate mt-0.5">
                    {t.assignee} · {t.due}
                  </div>
                </div>

                <div className="col-span-8 relative py-2">
                  <div className="w-full h-4 bg-[#0D101A] rounded-md border border-[#252A3A] overflow-hidden relative">
                    <div
                      className={`h-full rounded-md ${
                        isDelayed
                          ? 'bg-gradient-to-r from-[#FF4D6D] to-[#F5B942]'
                          : 'bg-gradient-to-r from-[#4F7CFF] to-[#39D9FF]'
                      }`}
                      style={{ width: `${Math.max(15, progress)}%` }}
                    />
                  </div>

                  {isDelayed && (
                    <div className="text-[9px] font-mono font-bold text-[#FF859B] mt-1 flex items-center gap-1">
                      <AlertTriangle size={10} />
                      <span>Slippage risk: Projected +2 to +4 days downstream delay</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
