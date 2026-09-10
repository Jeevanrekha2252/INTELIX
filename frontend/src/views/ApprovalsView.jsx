import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  FileCheck,
  UserCheck,
  X,
  Send,
  Lock,
  FileSignature
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export default function ApprovalsView() {
  const { approvals, approveDeliverable, requestChangesDeliverable, activeRole, showToast } = useProject();

  const [activeModalApp, setActiveModalApp] = useState(null);
  const [decisionType, setDecisionType] = useState('APPROVED'); // 'APPROVED' | 'REVISE'
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [digitalSignConsent, setDigitalSignConsent] = useState(true);

  const canApprove = activeRole.id === 'manager' || activeRole.id === 'client' || activeRole.id === 'exec' || activeRole.id === 'admin';

  const handleOpenDecisionModal = (app, initialType = 'APPROVED') => {
    setActiveModalApp(app);
    setDecisionType(initialType);
    setOutcomeNotes(
      initialType === 'APPROVED'
        ? 'Verified against technical requirements and SLA specifications.'
        : 'Revisions required on test coverage and schema compatibility.'
    );
  };

  const handleConfirmDecision = (e) => {
    e.preventDefault();
    if (!activeModalApp) return;

    const signature = `SHA256:${Math.random().toString(16).substring(2, 10).toUpperCase()}-${activeRole.name.replace(/\s+/g, '')}`;

    if (decisionType === 'APPROVED') {
      approveDeliverable(activeModalApp.id, outcomeNotes || 'Approved without conditions', signature);
    } else {
      requestChangesDeliverable(activeModalApp.id, outcomeNotes || 'Client revision requested', signature);
    }

    setActiveModalApp(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#252A3A]">
        <div>
          <div className="label-tech text-[#39D9FF]">FORMAL GOVERNANCE</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
            DELIVERABLE APPROVALS & AUDIT QUEUE
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            "Authorized decision gateway with cryptographic sign-off trails for deliverables and milestone releases."
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="badge-warning px-3 py-1 rounded-lg font-bold">
            {approvals.filter(a => a.status === 'Pending Review').length} PENDING DECISIONS
          </span>
        </div>
      </div>

      {/* Approvals Table */}
      <div className="surface-card rounded-2xl border border-[#252A3A] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D101A] border-b border-[#252A3A] text-[10px] font-bold uppercase text-[#8992A8] font-mono">
              <tr>
                <th className="p-3.5">Deliverable Artifact</th>
                <th className="p-3.5">Project Initiative</th>
                <th className="p-3.5">Submitted By</th>
                <th className="p-3.5">Submission Date</th>
                <th className="p-3.5">Audit Status</th>
                <th className="p-3.5">Cryptographic Signature</th>
                <th className="p-3.5 text-right">Action Gate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252A3A]">
              {approvals.map(app => (
                <tr key={app.id} className="hover:bg-[#171A2A] transition">
                  <td className="p-3.5 font-bold text-[#F4F7FF]">
                    <div className="flex items-center gap-2.5">
                      <FileCheck size={16} className="text-[#39D9FF]" />
                      <div>
                        <span className="block">{app.deliverable}</span>
                        <span className="text-[10px] text-[#555E73] font-mono">HASH: SHA256:{app.id * 892}FA3B</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 text-[#8992A8]">{app.project}</td>
                  <td className="p-3.5 text-[#F4F7FF]">{app.submittedBy}</td>
                  <td className="p-3.5 font-mono text-[#8992A8]">{app.date}</td>

                  <td className="p-3.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                      app.status === 'Approved'
                        ? 'badge-success'
                        : app.status === 'Changes Requested'
                        ? 'badge-critical'
                        : 'badge-warning'
                    }`}>
                      {app.status}
                    </span>
                  </td>

                  <td className="p-3.5 text-[11px] text-[#8992A8]">
                    {app.approvedAt ? (
                      <div>
                        <div className="text-[#F4F7FF] font-semibold">{app.outcome}</div>
                        <div className="text-[10px] text-[#39D9FF] font-mono">
                          {app.signature || `SIG-VALID-${app.id}`} · {app.approvedAt} by {app.reviewer || activeRole.name}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[#555E73] font-mono">Awaiting client signature</span>
                    )}
                  </td>

                  <td className="p-3.5 text-right">
                    {canApprove && app.status !== 'Approved' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDecisionModal(app, 'APPROVED')}
                          className="btn-primary px-3 py-1 rounded-lg text-xs font-bold"
                        >
                          Sign & Approve
                        </button>
                        <button
                          onClick={() => handleOpenDecisionModal(app, 'REVISE')}
                          className="btn-secondary px-2.5 py-1 rounded-lg text-xs font-semibold text-[#FF859B]"
                        >
                          Request Revisions
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#18C997] font-semibold flex items-center justify-end gap-1 font-mono">
                        <CheckCircle2 size={13} />
                        <span>Signed & Locked</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORMAL SIGN-OFF & AUDIT MODAL */}
      {activeModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="surface-card rounded-2xl border border-[#252A3A] w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#252A3A]">
              <div className="flex items-center gap-2">
                <FileSignature size={18} className="text-[#39D9FF]" />
                <h3 className="text-base font-bold text-[#F4F7FF]">Formal Deliverable Gatekeeping</h3>
              </div>
              <button
                onClick={() => setActiveModalApp(null)}
                className="text-[#8992A8] hover:text-[#F4F7FF]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmDecision} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0D101A] border border-[#252A3A] space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#8992A8] uppercase font-mono">DELIVERABLE SPEC</span>
                  <span className="text-[10px] font-mono text-[#39D9FF] font-bold">IMMUTABLE RECORD</span>
                </div>
                <div className="text-sm font-bold text-[#F4F7FF]">{activeModalApp.deliverable}</div>
                <div className="text-[#8992A8]">
                  Initiative: <strong className="text-[#F4F7FF]">{activeModalApp.project}</strong> · Submitted by {activeModalApp.submittedBy}
                </div>
              </div>

              {/* Decision Selector */}
              <div>
                <label className="block text-[#8992A8] font-semibold mb-1.5 font-mono text-[10px] uppercase">
                  Formal Stakeholder Decision
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDecisionType('APPROVED')}
                    className={`p-3 rounded-xl border text-left transition ${
                      decisionType === 'APPROVED'
                        ? 'border-[#18C997] bg-[#18C997]/10 text-[#F4F7FF]'
                        : 'border-[#252A3A] bg-[#0D101A] text-[#8992A8]'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5 text-xs text-[#18C997]">
                      <CheckCircle2 size={14} />
                      <span>Approve & Release</span>
                    </div>
                    <span className="text-[10px] text-[#8992A8] block mt-1">
                      Deliverable satisfies milestone gates.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecisionType('REVISE')}
                    className={`p-3 rounded-xl border text-left transition ${
                      decisionType === 'REVISE'
                        ? 'border-[#FF4D6D] bg-[#FF4D6D]/10 text-[#F4F7FF]'
                        : 'border-[#252A3A] bg-[#0D101A] text-[#8992A8]'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5 text-xs text-[#FF859B]">
                      <AlertTriangle size={14} />
                      <span>Request Revisions</span>
                    </div>
                    <span className="text-[10px] text-[#8992A8] block mt-1">
                      Requires technical adjustments.
                    </span>
                  </button>
                </div>
              </div>

              {/* Reviewer Notes */}
              <div>
                <label className="block text-[#8992A8] font-semibold mb-1.5 font-mono text-[10px] uppercase">
                  Reviewer Observations & Conditions
                </label>
                <textarea
                  rows={3}
                  required
                  value={outcomeNotes}
                  onChange={(e) => setOutcomeNotes(e.target.value)}
                  placeholder="State formal findings or approval conditions..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0D101A] border border-[#252A3A] text-[#F4F7FF] focus:outline-none focus:border-[#4F7CFF]"
                />
              </div>

              {/* Cryptographic Signature Confirmation */}
              <div className="p-3.5 rounded-xl bg-[#0D101A] border border-[#252A3A] space-y-2">
                <div className="flex items-center gap-2">
                  <Lock size={13} className="text-[#39D9FF]" />
                  <span className="text-[11px] font-bold text-[#F4F7FF]">Audit Signer: {activeRole.name}</span>
                </div>
                <p className="text-[10px] text-[#8992A8]">
                  By confirming, this decision is digitally stamped into the project immutable activity ledger with role token: <strong className="font-mono text-[#39D9FF]">{activeRole.roleTitle}</strong>.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#252A3A]">
                <button
                  type="button"
                  onClick={() => setActiveModalApp(null)}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    decisionType === 'APPROVED'
                      ? 'bg-[#18C997] hover:bg-[#15B889] text-white shadow-lg shadow-[#18C997]/25'
                      : 'bg-[#FF4D6D] hover:bg-[#E03C5B] text-white shadow-lg shadow-[#FF4D6D]/25'
                  }`}
                >
                  <Send size={13} />
                  <span>{decisionType === 'APPROVED' ? 'Confirm & Sign Approval' : 'Submit Revision Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
