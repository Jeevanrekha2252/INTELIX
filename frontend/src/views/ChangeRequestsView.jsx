import React, { useState } from 'react';
import {
  GitPullRequest,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  X
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
  const { changeRequests, advanceChangeRequest, showToast } = useProject();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProject, setNewProject] = useState('Smart Campus 360');

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
            "Formal lifecycle control from citizen/client submission to verified client review."
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 w-fit"
        >
          <Plus size={14} className="stroke-[2.5]" />
          <span>Submit Change Request</span>
        </button>
      </div>

      {/* Change Requests List with Stepper */}
      <div className="space-y-6">
        {changeRequests.map(cr => (
          <div key={cr.id} className="surface-card rounded-2xl p-6 border border-[#252A3A] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#252A3A]">
              <div>
                <span className="text-[10px] font-mono text-[#39D9FF] uppercase tracking-wider block">
                  {cr.id} · Project: {cr.project}
                </span>
                <h3 className="text-base font-bold text-[#F4F7FF] mt-0.5">{cr.title}</h3>
                <div className="text-xs text-[#8992A8] mt-1">
                  Submitted by {cr.submittedBy} on {cr.date} · Impact: <strong className="text-[#F4F7FF]">+{cr.impactHours} hours</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="badge-info text-xs px-2.5 py-1 rounded-lg font-mono font-bold">
                  STAGE {cr.step}/7: {cr.stepLabel}
                </span>
                {cr.step < 7 && (
                  <button
                    onClick={() => advanceChangeRequest(cr.id)}
                    className="btn-primary px-3 py-1 rounded-lg text-xs font-bold"
                  >
                    Advance Stage →
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-[#8992A8] leading-relaxed">
              {cr.description}
            </p>

            {/* 7-Step Polished Visual Stepper */}
            <div>
              <div className="label-tech text-[#555E73] mb-3">WORKFLOW PROGRESSION</div>
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-center text-[10px] font-mono font-bold">
                {WORKFLOW_STEPS.map((stepName, sIdx) => {
                  const stepNumber = sIdx + 1;
                  const isDone = stepNumber < cr.step;
                  const isCurrent = stepNumber === cr.step;

                  return (
                    <div
                      key={sIdx}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                        isCurrent
                          ? 'bg-[#4F7CFF]/20 border-[#4F7CFF] text-[#F4F7FF] shadow-[0_0_10px_rgba(79,124,255,0.2)]'
                          : isDone
                          ? 'bg-[#18C997]/15 border-[#18C997]/40 text-[#18C997]'
                          : 'bg-[#0D101A] border-[#252A3A] text-[#555E73]'
                      }`}
                    >
                      <span>0{stepNumber}</span>
                      <span className="leading-tight">{stepName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="surface-modal rounded-2xl p-6 max-w-lg w-full border border-[#384158] shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#252A3A]">
              <h3 className="text-sm font-bold text-[#F4F7FF]">Submit New Change Request</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8992A8]">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              showToast(`Change request "${newTitle}" submitted for Manager Review`, 'success');
              setIsModalOpen(false);
            }} className="space-y-4 text-xs">
              <div>
                <label className="label-tech text-[#8992A8] block mb-1.5">TITLE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Add multi-lingual Kannada support"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF]"
                />
              </div>
              <div>
                <label className="label-tech text-[#8992A8] block mb-1.5">PROJECT</label>
                <select
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF]"
                >
                  <option value="Smart Campus 360">Smart Campus 360</option>
                  <option value="Citizen Service Portal">Citizen Service Portal</option>
                  <option value="Unified EHR Record Vault">Unified EHR Record Vault</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#252A3A]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost px-4 py-2">
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-4 py-2 rounded-xl font-bold">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
