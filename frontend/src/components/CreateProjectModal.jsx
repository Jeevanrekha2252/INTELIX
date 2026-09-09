import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export default function CreateProjectModal() {
  const {
    isCreateProjectOpen,
    setIsCreateProjectOpen,
    addProject,
    activeRole
  } = useProject();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner: activeRole.name,
    priority: 'High',
    category: 'Water & Infrastructure',
    ministry: 'Ministry of Jal Shakti',
    budget: 850000,
    startDate: '01 Oct 2026',
    deadline: '15 Nov 2026',
    members: 6,
    tags: 'IoT Sensors, PostgreSQL, Python'
  });

  if (!isCreateProjectOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addProject({
      ...formData,
      budget: +formData.budget || 500000,
      members: +formData.members || 5,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    });

    setIsCreateProjectOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-100">
      <div className="surface-modal rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white">Initialize New Initiative</h2>
          </div>

          <button
            onClick={() => setIsCreateProjectOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={17} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Initiative Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. National Smart Water Grid 2.0"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nodal Ministry / Department
              </label>
              <input
                type="text"
                value={formData.ministry}
                onChange={e => setFormData({ ...formData, ministry: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Budget (INR ₹)
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={e => setFormData({ ...formData, budget: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-2.5 py-2 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Deadline
              </label>
              <input
                type="text"
                value={formData.deadline}
                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-2.5 py-2 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Team Size
              </label>
              <input
                type="number"
                value={formData.members}
                onChange={e => setFormData({ ...formData, members: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-2.5 py-2 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tech Stack & Key Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={e => setFormData({ ...formData, tags: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Scope & Objectives
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Primary deliverables, beneficiary targets, and milestone criteria..."
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg p-2.5 outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateProjectOpen(false)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm flex items-center gap-1"
            >
              <FolderPlus size={14} />
              <span>Launch Initiative</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
