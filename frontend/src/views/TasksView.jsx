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
  TrendingDown,
  GitBranch,
  GitPullRequest,
  AlertTriangle,
  Save,
  FileCode,
  ExternalLink
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

      {/* ENHANCED TASK EXECUTION DRAWER WITH GIT VCS & EFFORT TRACKING */}
      {inspectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl h-full bg-[#0D101A] border-l border-[#252A3A] p-6 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              {/* Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#252A3A]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#4F7CFF]/15 text-[#39D9FF] font-bold border border-[#4F7CFF]/30">
                    TASK-{inspectedTask.id}
                  </span>
                  <span className="label-tech text-[#8992A8]">{inspectedTask.project}</span>
                </div>
                <button
                  onClick={() => setInspectedTask(null)}
                  className="p-1 rounded-lg text-[#8992A8] hover:text-[#F4F7FF] hover:bg-[#171A2A] transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-xl font-bold text-[#F4F7FF] leading-snug">{inspectedTask.title}</h2>
                <p className="text-xs text-[#8992A8] mt-2 leading-relaxed bg-[#131522] p-3 rounded-xl border border-[#252A3A]">
                  {inspectedTask.description || 'Enterprise project deliverable executed under sprint governance.'}
                </p>
              </div>

              {/* Status & Priority Row */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[#8992A8] font-semibold mb-1.5 font-mono text-[10px] uppercase">
                    Workflow Status
                  </label>
                  <select
                    value={inspectedTask.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setInspectedTask({ ...inspectedTask, status: newStatus });
                      updateTask(inspectedTask.id, { status: newStatus });
                    }}
                    className="w-full bg-[#131522] border border-[#252A3A] rounded-xl px-3 py-2 text-xs text-[#F4F7FF] focus:outline-none focus:border-[#4F7CFF]"
                  >
                    <option value="Pending">Backlog / Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="In Review">Code Review</option>
                    <option value="Testing">Testing / QA</option>
                    <option value="Completed">Completed / Delivered</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8992A8] font-semibold mb-1.5 font-mono text-[10px] uppercase">
                    Execution Priority
                  </label>
                  <select
                    value={inspectedTask.priority}
                    onChange={(e) => {
                      const newPriority = e.target.value;
                      setInspectedTask({ ...inspectedTask, priority: newPriority });
                      updateTask(inspectedTask.id, { priority: newPriority });
                    }}
                    className="w-full bg-[#131522] border border-[#252A3A] rounded-xl px-3 py-2 text-xs text-[#F4F7FF] focus:outline-none focus:border-[#4F7CFF]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="p-4 rounded-xl bg-[#131522] border border-[#252A3A] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#8992A8] font-semibold">Execution Progress:</span>
                  <span className="font-mono font-bold text-[#39D9FF] text-sm">{inspectedTask.progress}%</span>
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
                  className="w-full accent-[#4F7CFF] h-2 bg-[#0D101A] rounded-lg cursor-pointer"
                />
              </div>

              {/* Effort Hours & Variance */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#131522] border border-[#252A3A]">
                  <div className="text-[10px] text-[#8992A8] uppercase font-mono">ESTIMATED EFFORT</div>
                  <div className="text-sm font-bold font-mono text-[#F4F7FF] mt-1">
                    {inspectedTask.estimatedHours || 32}h planned
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#131522] border border-[#252A3A]">
                  <div className="text-[10px] text-[#8992A8] uppercase font-mono">ACTUAL LOGGED HOURS</div>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={inspectedTask.actualHours ?? 14}
                      onChange={(e) => {
                        const newActual = +e.target.value;
                        setInspectedTask({ ...inspectedTask, actualHours: newActual });
                        updateTask(inspectedTask.id, { actualHours: newActual });
                      }}
                      className="w-20 px-2 py-1 rounded bg-[#0D101A] border border-[#252A3A] text-xs font-mono font-bold text-[#39D9FF]"
                    />
                    <span className="text-[11px] text-[#8992A8] font-mono">
                      ({(inspectedTask.actualHours ?? 14) <= (inspectedTask.estimatedHours || 32) ? '✓ On budget' : '⚠️ Overrun'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Blocker Reporting Section */}
              <div className="p-4 rounded-xl bg-[#131522] border border-[#252A3A] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#F4F7FF] flex items-center gap-1.5">
                    <AlertTriangle size={14} className={inspectedTask.blocked ? 'text-[#FF4D6D]' : 'text-[#8992A8]'} />
                    Active Impediment / Blocker Flag
                  </span>
                  <input
                    type="checkbox"
                    checked={!!inspectedTask.blocked}
                    onChange={() => {
                      toggleTaskBlocker(inspectedTask.id);
                      setInspectedTask({ ...inspectedTask, blocked: !inspectedTask.blocked });
                    }}
                    className="w-4 h-4 rounded accent-[#FF4D6D] cursor-pointer"
                  />
                </div>

                {inspectedTask.blocked && (
                  <div className="space-y-2 pt-1 border-t border-[#252A3A]">
                    <textarea
                      rows={2}
                      value={inspectedTask.blockerReason || ''}
                      onChange={(e) => {
                        const reason = e.target.value;
                        setInspectedTask({ ...inspectedTask, blockerReason: reason });
                        updateTask(inspectedTask.id, { blockerReason: reason });
                      }}
                      placeholder="Describe the impediment blocking this task (e.g. Awaiting campus IT LDAP endpoint credentials)..."
                      className="w-full bg-[#0D101A] border border-[#FF4D6D]/40 rounded-lg p-2.5 text-xs text-[#F4F7FF] focus:outline-none placeholder-[#555E73]"
                    />
                    <span className="text-[10px] text-[#FF859B] block font-mono">
                      ● Escalation active: Notifies Project Manager & increases project risk score.
                    </span>
                  </div>
                )}
              </div>

              {/* Git VCS Activity Section */}
              <div className="p-4 rounded-xl bg-[#131522] border border-[#252A3A] space-y-3">
                <div className="text-xs font-bold text-[#F4F7FF] uppercase tracking-wider flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <GitBranch size={14} className="text-[#39D9FF]" />
                    <span>Git VCS Telemetry Linkage</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#18C997] font-bold">LIVE VCS</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center text-[#8992A8]">
                    <span>Linked Branch:</span>
                    <span className="text-[#39D9FF] bg-[#0D101A] px-2 py-0.5 rounded border border-[#252A3A]">
                      {inspectedTask.branchName || `feature/task-${inspectedTask.id}-impl`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[#8992A8]">
                    <span>Pull Request:</span>
                    <a
                      href={inspectedTask.pullRequestUrl || 'https://github.com/Jeevanrekha2252/INTELIX/pull/18'}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#4F7CFF] hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <GitPullRequest size={12} />
                      <span>PR #18 ({inspectedTask.prStatus || 'OPEN'})</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>

                  <div className="flex justify-between items-center text-[#8992A8]">
                    <span>VCS Commits:</span>
                    <span className="text-[#F4F7FF] font-bold">
                      {inspectedTask.commitsCount || 3} commits linked to PR
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-4 border-t border-[#252A3A] flex items-center gap-3">
              <button
                onClick={() => setInspectedTask(null)}
                className="btn-secondary flex-1 py-2 text-xs font-bold"
              >
                Close Drawer
              </button>
              <button
                onClick={() => {
                  showToast('Task details & Git linkages saved successfully', 'success');
                  setInspectedTask(null);
                }}
                className="btn-primary flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Save size={14} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
