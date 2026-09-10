import React, { useState } from 'react';
import {
  GitPullRequest,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  X,
  Sparkles,
  Calendar,
  DollarSign,
  FileCode,
  ShieldCheck
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const WORKFLOW_STEPS = [
  'SUBMITTED',
  'MANAGER REVIEW',
  'APPROVED / CLARIFICATION',
  'TASK CREATED',
  'DEVELOPMENT',
  'TESTING',
  'CLIENT REVIEW'
];

export default function ChangeRequestsView() {
  const {
    changeRequests,
    advanceChangeRequest,
    submitChangeRequest,
    convertChangeRequestToTask,
    projects,
    showToast,
    activeRole
  } = useProject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    project: projects[0]?.name || 'Smart Campus 360',
    description: '',
    scheduleImpact: '+3 days',
    budgetImpact: '₹45,000'
  });

  const handleSubmitCr = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      showToast('Please provide a title and rationale for the change request', 'warning');
      return;
    }
    submitChangeRequest({
      title: formData.title,
      project: formData.project,
      description: formData.description,
      scheduleImpact: formData.scheduleImpact,
      budgetImpact: formData.budgetImpact
    });
    setIsModalOpen(false);
    setFormData({
      title: '',
      project: projects[0]?.name || 'Smart Campus 360',
      description: '',
      scheduleImpact: '+3 days',
      budgetImpact: '₹45,000'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#252A3A]">
        <div>
          <div className="label-tech text-[#39D9FF]">CHANGE GOVERNANCE</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
            CHANGE REQUEST WORKFLOW (7-STAGE STEPPER)
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            "Formal lifecycle control from citizen/client submission to 1-click sprint task conversion and verified client review."
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 w-fit"
        >
          <Plus size={14} className="stroke-[2.5]" />
          <span>Initiate Change Request</span>
        </button>
      </div>

      {/* Change Requests List with Stepper */}
      <div className="space-y-6">
        {changeRequests.map(cr => (
          <div key={cr.id} className="surface-card rounded-2xl p-6 border border-[#252A3A] space-y-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#252A3A]">
              <div>
                <span className="text-[10px] font-mono text-[#39D9FF] uppercase tracking-wider block">
                  {cr.id} · Project: {cr.project}
                </span>
                <h3 className="text-base font-bold text-[#F4F7FF] mt-0.5">{cr.title}</h3>
                <div className="text-xs text-[#8992A8] mt-1 flex flex-wrap items-center gap-3">
                  <span>Submitted by <strong className="text-[#F4F7FF]">{cr.submittedBy}</strong> on {cr.date}</span>
                  <span className="text-[#39D9FF] font-mono font-bold">Schedule: {cr.scheduleImpact || '+24h'}</span>
                  <span className="text-[#18C997] font-mono font-bold">Budget: {cr.budgetImpact || '₹30,000'}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="badge-info text-xs px-2.5 py-1 rounded-lg font-mono font-bold">
                  STAGE {cr.step}/7: {cr.stepLabel}
                </span>

                {/* 1-Click Convert to Task Button if Approved/Clarification */}
                {cr.step >= 3 && cr.status !== 'Converted to Task' && (
                  <button
                    onClick={() => convertChangeRequestToTask(cr.id)}
                    className="bg-[#18C997]/15 text-[#18C997] hover:bg-[#18C997]/25 border border-[#18C997]/30 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <FileCode size={13} />
                    <span>Convert to Active Sprint Task</span>
                  </button>
                )}

                {cr.status === 'Converted to Task' && (
                  <span className="badge-success text-xs px-2.5 py-1 rounded-lg font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>Sprint Task Active</span>
                  </span>
                )}

                {cr.step < 7 && (
                  <button
                    onClick={() => advanceChangeRequest(cr.id)}
                    className="btn-primary px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <span>Advance Stage</span>
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-[#8992A8] leading-relaxed bg-[#0D101A] p-3 rounded-xl border border-[#252A3A]">
              {cr.description}
            </p>

            {/* 7-Step Polished Visual Stepper */}
            <div>
              <div className="label-tech text-[#555E73] mb-3">FORMAL WORKFLOW PROGRESSION</div>
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-center text-[10px] font-mono font-bold">
                {WORKFLOW_STEPS.map((stepName, sIdx) => {
                  const stepNumber = sIdx + 1;
                  const isDone = stepNumber < cr.step;
                  const isCurrent = stepNumber === cr.step;

                  return (
                    <div
                      key={sIdx}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                        isCurrent
                          ? 'bg-[#4F7CFF]/20 border-[#4F7CFF] text-[#F4F7FF] shadow-[0_0_12px_rgba(79,124,255,0.25)]'
                          : isDone
                          ? 'bg-[#18C997]/15 border-[#18C997]/40 text-[#18C997]'
                          : 'bg-[#0D101A] border-[#252A3A] text-[#555E73]'
                      }`}
                    >
                      <span className="text-[9px] opacity-75">0{stepNumber}</span>
                      <span className="leading-tight">{stepName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SUBMIT CHANGE REQUEST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="surface-card rounded-2xl p-6 max-w-lg w-full border border-[#252A3A] shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#252A3A]">
              <div className="flex items-center gap-2">
                <GitPullRequest size={18} className="text-[#39D9FF]" />
                <h3 className="text-base font-bold text-[#F4F7FF]">Submit Formal Change Request (CR)</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8992A8] hover:text-[#F4F7FF]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitCr} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8992A8] font-semibold mb-1.5 font-mono text-[10px] uppercase">
                  Change Request Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Biometric Facial Recognition Integration"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF] focus:outline-none focus:border-[#4F7CFF]"
                />
              </div>

              <div>
                <label className="block text-[#8992A8] font-semibold mb-1.5 font-mono text-[10px] uppercase">
                  Target Project Initiative
                </label>
                <select
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF] focus:outline-none focus:border-[#4F7CFF]"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8992A8] font-semibold mb-1.5 font-mono text-[10px] uppercase">
                    Schedule Impact
                  </label>
                  <input
                    type="text"
                    placeholder="+4 days"
                    value={formData.scheduleImpact}
                    onChange={(e) => setFormData({ ...formData, scheduleImpact: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF] focus:outline-none focus:border-[#4F7CFF]"
                  />
                </div>

                <div>
                  <label className="block text-[#8992A8] font-semibold mb-1.5 font-mono text-[10px] uppercase">
                    Budget Impact
                  </label>
                  <input
                    type="text"
                    placeholder="₹55,000"
                    value={formData.budgetImpact}
                    onChange={(e) => setFormData({ ...formData, budgetImpact: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF] focus:outline-none focus:border-[#4F7CFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8992A8] font-semibold mb-1.5 font-mono text-[10px] uppercase">
                  Description & Justification
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain the functional reason for this change, expected user value, and architectural impacts..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF] focus:outline-none focus:border-[#4F7CFF]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#252A3A]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Submit Change Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
