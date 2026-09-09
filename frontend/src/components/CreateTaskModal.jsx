import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Plus,
  Save,
  Trash2,
  SlidersHorizontal,
  AlertTriangle
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { calculateLocalRiskScore } from '../services/mlEngine';

export default function CreateTaskModal() {
  const {
    isCreateTaskOpen,
    setIsCreateTaskOpen,
    editingTask,
    setEditingTask,
    projects,
    teamWorkload,
    addTask,
    updateTask,
    deleteTask
  } = useProject();

  const isEditing = !!editingTask;

  const [formData, setFormData] = useState({
    title: '',
    projectId: projects[0]?.id || 1,
    project: projects[0]?.name || 'Jal Jeevan Mission — Smart Water IoT Grid',
    assignee: 'Ishaan Mantri',
    priority: 'High',
    status: 'In Progress',
    progress: 50,
    expectedProgress: 75,
    daysRemaining: 4,
    due: 'Sep 15',
    blocked: false,
    blockerReason: '',
    estimatedHours: 32,
    description: ''
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        projectId: editingTask.projectId || projects[0]?.id || 1,
        project: editingTask.project || projects[0]?.name || '',
        assignee: editingTask.assignee || 'Ishaan Mantri',
        priority: editingTask.priority || 'Medium',
        status: editingTask.status || 'In Progress',
        progress: editingTask.progress ?? 50,
        expectedProgress: editingTask.expectedProgress ?? 75,
        daysRemaining: editingTask.daysRemaining ?? 4,
        due: editingTask.due || 'Sep 15',
        blocked: !!editingTask.blocked,
        blockerReason: editingTask.blockerReason || '',
        estimatedHours: editingTask.estimatedHours || 32,
        description: editingTask.description || ''
      });
    } else {
      setFormData({
        title: '',
        projectId: projects[0]?.id || 1,
        project: projects[0]?.name || 'Jal Jeevan Mission — Smart Water IoT Grid',
        assignee: 'Ishaan Mantri',
        priority: 'High',
        status: 'In Progress',
        progress: 50,
        expectedProgress: 75,
        daysRemaining: 4,
        due: 'Sep 15',
        blocked: false,
        blockerReason: '',
        estimatedHours: 32,
        description: ''
      });
    }
  }, [editingTask, isCreateTaskOpen, projects]);

  const liveRiskScore = useMemo(() => {
    return calculateLocalRiskScore({
      progress: formData.progress,
      expectedProgress: formData.expectedProgress,
      daysRemaining: formData.daysRemaining,
      dependencyRisk: formData.blocked ? 30 : 10,
      workload: 80,
      blocked: formData.blocked
    });
  }, [formData.progress, formData.expectedProgress, formData.daysRemaining, formData.blocked]);

  if (!isCreateTaskOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (isEditing) {
      updateTask(editingTask.id, formData);
    } else {
      addTask(formData);
    }

    setIsCreateTaskOpen(false);
    setEditingTask(null);
  };

  const handleDelete = () => {
    if (editingTask) {
      deleteTask(editingTask.id);
      setIsCreateTaskOpen(false);
      setEditingTask(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-100">
      <div className="surface-modal rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white">
              {isEditing ? 'Edit Sprint Deliverable' : 'Create New Sprint Deliverable'}
            </h2>
          </div>

          <button
            onClick={() => {
              setIsCreateTaskOpen(false);
              setEditingTask(null);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={17} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Deliverable Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Implement Webhook Dispatch Ingestion Bridge"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Initiative
              </label>
              <select
                value={formData.projectId}
                onChange={e => {
                  const pId = +e.target.value;
                  const p = projects.find(proj => proj.id === pId);
                  setFormData({
                    ...formData,
                    projectId: pId,
                    project: p ? p.name : formData.project
                  });
                }}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2 outline-none"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Assigned Engineer
              </label>
              <select
                value={formData.assignee}
                onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2 outline-none"
              >
                {teamWorkload.map(m => (
                  <option key={m.name} value={m.name}>
                    {m.name} ({m.role.split(' ')[0]}) — {m.loadStr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-2 outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Blocked">Blocked</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-2 outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Due Date
              </label>
              <input
                type="text"
                value={formData.due}
                onChange={e => setFormData({ ...formData, due: e.target.value })}
                placeholder="Sep 20"
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-2.5 py-2 outline-none"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Completion Progress</span>
                <span className="text-blue-400 font-bold font-mono">{formData.progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={e => setFormData({ ...formData, progress: +e.target.value })}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Days Remaining
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={formData.daysRemaining}
                  onChange={e => setFormData({ ...formData, daysRemaining: +e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-2.5 py-1.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={formData.estimatedHours}
                  onChange={e => setFormData({ ...formData, estimatedHours: +e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-2.5 py-1.5 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Blocker */}
          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-rose-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.blocked}
                onChange={e => setFormData({ ...formData, blocked: e.target.checked })}
                className="w-4 h-4 accent-rose-500 rounded"
              />
              <span>Mark as Blocked by External Dependency</span>
            </label>

            {formData.blocked && (
              <input
                type="text"
                value={formData.blockerReason}
                onChange={e => setFormData({ ...formData, blockerReason: e.target.value })}
                placeholder="Reason for block (e.g. Awaiting vendor API contract)"
                className="w-full bg-slate-950 border border-rose-500/40 text-xs text-rose-200 placeholder:text-rose-400/50 rounded-lg px-2.5 py-1.5 outline-none"
              />
            )}
          </div>

          {/* ML Score Preview */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Calculated Risk Index</span>
              <strong className="text-white">
                {liveRiskScore.level} ({liveRiskScore.score}/100)
              </strong>
            </div>
            <div className="text-right text-xs">
              <span className="text-slate-400 block text-[10px]">Predicted Slip</span>
              <strong className="text-rose-400 font-mono">+{liveRiskScore.predictedDelayDays}d</strong>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between">
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1.5 rounded-lg border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-xs font-bold flex items-center gap-1 transition"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreateTaskOpen(false);
                  setEditingTask(null);
                }}
                className="px-3.5 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm flex items-center gap-1"
              >
                {isEditing ? <Save size={14} /> : <Plus size={14} />}
                <span>{isEditing ? 'Save Deliverable' : 'Create Deliverable'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
