import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  FileCheck,
  UserCheck
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export default function ApprovalsView() {
  const { approvals, approveDeliverable, requestChangesDeliverable, activeRole } = useProject();

  const canApprove = activeRole.id === 'manager' || activeRole.id === 'client' || activeRole.id === 'exec' || activeRole.id === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#252A3A]">
        <div>
          <div className="label-tech text-[#39D9FF]">FORMAL GOVERNANCE</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
            APPROVALS & SIGN-OFF QUEUE
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            "Authorized decision queue for deliverables, specs, and change approvals."
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="badge-warning px-3 py-1 rounded-lg font-bold">
            {approvals.filter(a => a.status === 'Pending Review').length} PENDING DECISIONS
          </span>
        </div>
      </div>

      {/* Approvals Table */}
      <div className="surface-card rounded-2xl border border-[#252A3A] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0D101A] border-b border-[#252A3A] text-[10px] font-bold uppercase text-[#8992A8] font-mono">
            <tr>
              <th className="p-3.5">Deliverable</th>
              <th className="p-3.5">Project</th>
              <th className="p-3.5">Submitted By</th>
              <th className="p-3.5">Submission Date</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Audit Record</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#252A3A]">
            {approvals.map(app => (
              <tr key={app.id} className="hover:bg-[#171A2A] transition">
                <td className="p-3.5 font-bold text-[#F4F7FF] flex items-center gap-2">
                  <FileCheck size={14} className="text-[#39D9FF]" />
                  <span>{app.deliverable}</span>
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
                      <div className="text-[10px] text-[#555E73] font-mono">{app.approvedAt} by {app.reviewer}</div>
                    </div>
                  ) : (
                    <span className="text-[#555E73]">Awaiting action</span>
                  )}
                </td>
                <td className="p-3.5 text-right">
                  {canApprove && app.status !== 'Approved' ? (
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => approveDeliverable(app.id)}
                        className="btn-primary px-3 py-1 rounded-lg text-xs font-bold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => requestChangesDeliverable(app.id)}
                        className="btn-secondary px-2.5 py-1 rounded-lg text-xs font-semibold text-[#FF859B]"
                      >
                        Request Changes
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-[#18C997] font-semibold flex items-center justify-end gap-1">
                      <CheckCircle2 size={13} />
                      <span>Approved</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
