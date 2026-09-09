import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Kanban,
  Table as TableIcon,
  Calendar,
  AlertOctagon,
  ShieldAlert,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Zap,
  X,
  Sparkles,
  TrendingDown
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const KANBAN_COLUMNS = [
  { id: 'Pending', label: 'BACKLOG', color: 'border-t-[#555E73]' },
  { id: 'In Progress', label: 'IN PROGRESS', color: 'border-t-[#4F7CFF]' },
  { id: 'In Review', label: 'REVIEW', color: 'border-t-[#7C5CFF]' },
  { id: 'Completed', label: 'COMPLETED', color: 'border-t-[#18C997]' }
];

export default function TasksView() {
  const {
    tasks,
    projects,
    moveTaskStatus,
    toggleTaskBlocker,
    setEditingTask,
    setIsCreateTaskOpen,
    updateTask,
    deleteTask,
    showToast
  } = useProject();

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [inspectedTask, setInspectedTask] = useState(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchProject = selectedProject === 'All' || task.project === selectedProject;
      const matchPriority = selectedPriority === 'All' || task.priority === selectedPriority;
      const matchSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.project.toLowerCase().includes(searchQuery.toLowerCase());
      return matchProject && matchPriority && matchSearch;
    });
  }, [tasks, selectedProject, selectedPriority, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#252A3A]">
        <div>
          <div className="label-tech text-[#39D9FF]">SPRINT EXECUTION & WORK TRACKING</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
            TASKS & SPRINT WORKSPACE
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            "Manage sprint deliverables, track blockers, and monitor delivery velocity."
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTask(null);
            setIsCreateTaskOpen(true);
          }}
          className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 w-fit"
        >
          <Plus size={14} className="stroke-[2.5]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Filter tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#0D101A] border border-[#252A3A] rounded-xl text-xs text-[#F4F7FF]"
            />
            <Search size={14} className="absolute left-3 top-2 text-[#555E73]" />
          </div>

          {/* Project Filter */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-1.5 bg-[#0D101A] border border-[#252A3A] rounded-xl text-xs text-[#F4F7FF]"
          >
            <option value="All">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 bg-[#0D101A] border border-[#252A3A] rounded-xl text-xs text-[#F4F7FF]"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0D101A] border border-[#252A3A] shrink-0">
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'kanban'
                ? 'bg-[#131522] text-[#F4F7FF] border border-[#252A3A] shadow-sm'
                : 'text-[#8992A8] hover:text-[#F4F7FF]'
            }`}
          >
            <Kanban size={13} />
            <span>Kanban</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'list'
                ? 'bg-[#131522] text-[#F4F7FF] border border-[#252A3A] shadow-sm'
                : 'text-[#8992A8] hover:text-[#F4F7FF]'
            }`}
          >
            <TableIcon size={13} />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map(col => {
            const colTasks = filteredTasks.filter(t => {
              if (col.id === 'Pending') return t.status === 'Pending' || t.status === 'Backlog';
              if (col.id === 'In Progress') return t.status === 'In Progress' || t.status === 'Blocked';
              if (col.id === 'In Review') return t.status === 'In Review';
              if (col.id === 'Completed') return t.status === 'Completed';
              return false;
            });

            return (
              <div key={col.id} className={`surface-panel rounded-2xl p-4 border border-[#252A3A] border-t-2 ${col.color}`}>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#252A3A]">
                  <span className="label-tech text-[#F4F7FF]">{col.label}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#131522] text-[#8992A8] border border-[#252A3A]">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[350px]">
                  {colTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => setInspectedTask(task)}
                      className="surface-card rounded-xl p-3.5 border border-[#252A3A] hover:border-[#4F7CFF]/50 transition cursor-pointer space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#39D9FF]">TASK-{task.id}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${task.priority === 'Critical' ? 'badge-critical' : task.priority === 'High' ? 'badge-warning' : 'badge-info'}`}>
                          {task.priority}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-[#F4F7FF] leading-snug group-hover:text-[#39D9FF] transition">
                        {task.title}
                      </h4>

                      {task.blocked && (
                        <div className="text-[10px] px-2 py-0.5 rounded bg-[#FF4D6D]/15 text-[#FF859B] border border-[#FF4D6D]/30 flex items-center gap-1 font-semibold">
                          <AlertOctagon size={11} />
                          <span>Blocked</span>
                        </div>
                      )}

                      {task.dependencyDelayed && (
                        <div className="text-[10px] px-2 py-0.5 rounded bg-[#F5B942]/15 text-[#F8CB6E] border border-[#F5B942]/30 flex items-center gap-1">
                          <span>⚠ Upstream delay</span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-[#252A3A] flex items-center justify-between text-[11px] text-[#8992A8]">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-[#0D101A] border border-[#252A3A] grid place-items-center text-[9px] font-bold font-mono text-[#F4F7FF]">
                            {task.avatar || 'US'}
                          </div>
                          <span className="truncate max-w-[80px]">{task.assignee.split(' ')[0]}</span>
                        </div>
                        <div className="font-mono text-xs font-bold text-[#F4F7FF]">
                          {task.progress}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="surface-card rounded-2xl border border-[#252A3A] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D101A] border-b border-[#252A3A] text-[10px] font-bold uppercase text-[#8992A8] font-mono">
              <tr>
                <th className="p-3.5">Task ID</th>
                <th className="p-3.5">Title</th>
                <th className="p-3.5">Project</th>
                <th className="p-3.5">Assignee</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Progress</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252A3A]">
              {filteredTasks.map(t => (
                <tr
                  key={t.id}
                  onClick={() => setInspectedTask(t)}
                  className="hover:bg-[#171A2A] transition cursor-pointer"
                >
                  <td className="p-3.5 font-mono text-[#39D9FF]">TASK-{t.id}</td>
                  <td className="p-3.5 font-bold text-[#F4F7FF]">{t.title}</td>
                  <td className="p-3.5 text-[#8992A8]">{t.project}</td>
                  <td className="p-3.5 text-[#F4F7FF]">{t.assignee}</td>
                  <td className="p-3.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${t.priority === 'Critical' ? 'badge-critical' : 'badge-info'}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-[#F4F7FF]">{t.progress}%</td>
                  <td className="p-3.5 font-mono text-[#8992A8]">{t.due}</td>
                  <td className="p-3.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#131522] border border-[#252A3A] font-bold">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TASK DETAIL DRAWER (WITH SIGNATURE INTELIX INTELLIGENCE CONTEXT) */}
      {inspectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl h-full bg-[#0D101A] border-l border-[#252A3A] p-6 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#252A3A]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#4F7CFF]/15 text-[#39D9FF] font-bold border border-[#4F7CFF]/30">
                  TASK-{inspectedTask.id}
                </span>
                <span className="label-tech text-[#8992A8]">{inspectedTask.project}</span>
              </div>
              <button onClick={() => setInspectedTask(null)} className="text-[#8992A8] hover:text-[#F4F7FF]">
                <X size={18} />
              </button>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#F4F7FF]">{inspectedTask.title}</h2>
              <p className="text-xs text-[#8992A8] mt-2 leading-relaxed">{inspectedTask.description}</p>
            </div>

            {/* Signature Intelix Intelligence Context */}
            {inspectedTask.risk >= 50 && (
              <div className="p-4 rounded-xl bg-[#131522] border border-[#FF4D6D]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="label-tech text-[#FF4D6D] flex items-center gap-1.5">
                    <Sparkles size={13} />
                    AT RISK: LIKELY TO MISS SPRINT DEADLINE
                  </div>
                  <span className="text-xs font-mono font-bold text-[#FF859B]">Risk: {inspectedTask.risk}/100</span>
                </div>
                <div className="text-xs space-y-1.5">
                  <div><strong className="text-[#F4F7FF]">WHY?</strong> <span className="text-[#8992A8]">Database dependency is 3 days behind expected progress.</span></div>
                  <div><strong className="text-[#F4F7FF]">IMPACT:</strong> <span className="text-[#FF859B]">Downstream frontend integration shifts by approximately 2 days.</span></div>
                  <div><strong className="text-[#39D9FF]">RECOMMENDATION:</strong> <span className="text-[#F4F7FF]">Review dependency link and reallocate backend engineering capacity.</span></div>
                </div>
              </div>
            )}

            {/* Meta Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#131522] border border-[#252A3A]">
                <div className="text-[10px] text-[#8992A8] uppercase font-mono">ASSIGNEE</div>
                <div className="font-bold text-[#F4F7FF] mt-0.5">{inspectedTask.assignee}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#131522] border border-[#252A3A]">
                <div className="text-[10px] text-[#8992A8] uppercase font-mono">DUE DATE</div>
                <div className="font-bold font-mono text-[#F4F7FF] mt-0.5">{inspectedTask.due}</div>
              </div>
            </div>

            {/* Progress Slider */}
            <div className="p-4 rounded-xl bg-[#131522] border border-[#252A3A] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#8992A8]">Current Progress</span>
                <span className="font-mono font-bold text-[#F4F7FF]">{inspectedTask.progress}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={inspectedTask.progress}
                onChange={(e) => {
                  const newProgress = +e.target.value;
                  setInspectedTask({ ...inspectedTask, progress: newProgress });
                  updateTask(inspectedTask.id, { progress: newProgress });
                }}
                className="w-full accent-[#4F7CFF]"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-[#252A3A]">
              <button
                onClick={() => {
                  toggleTaskBlocker(inspectedTask.id);
                  setInspectedTask(null);
                }}
                className="btn-secondary flex-1 py-2 text-xs font-bold"
              >
                {inspectedTask.blocked ? 'Resolve Blocker' : 'Flag Blocker'}
              </button>
              <button
                onClick={() => {
                  moveTaskStatus(inspectedTask.id, inspectedTask.status === 'Completed' ? 'In Progress' : 'Completed');
                  setInspectedTask(null);
                }}
                className="btn-primary flex-1 py-2 text-xs font-bold"
              >
                {inspectedTask.status === 'Completed' ? 'Reopen Task' : 'Complete Deliverable'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
