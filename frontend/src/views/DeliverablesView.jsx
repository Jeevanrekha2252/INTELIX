import React from 'react';
import {
  FileCheck2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export default function DeliverablesView() {
  const { deliverables, approveDeliverable, requestChangesDeliverable, activeRole } = useProject();

  const canApprove = activeRole.id === 'manager' || activeRole.id === 'client' || activeRole.id === 'exec';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#252A3A]">
        <div>
          <div className="label-tech text-[#39D9FF]">DELIVERY TRACKING</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
            DELIVERABLES DIRECTORY
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            "Formal milestone artifacts, client review statuses, and sign-offs."
          </p>
        </div>
      </div>

      {/* Deliverables Table */}
      <div className="surface-card rounded-2xl border border-[#252A3A] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0D101A] border-b border-[#252A3A] text-[10px] font-bold uppercase text-[#8992A8] font-mono">
            <tr>
              <th className="p-3.5">Deliverable</th>
              <th className="p-3.5">Project</th>
              <th className="p-3.5">Milestone</th>
              <th className="p-3.5">Owner</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Due Date</th>
              <th className="p-3.5">Review Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#252A3A]">
            {deliverables.map(d => (
              <tr key={d.id} className="hover:bg-[#171A2A] transition">
                <td className="p-3.5 font-bold text-[#F4F7FF] flex items-center gap-2">
                  <FileCheck2 size={14} className="text-[#39D9FF]" />
                  <span>{d.name}</span>
                </td>
                <td className="p-3.5 text-[#8992A8]">{d.project}</td>
                <td className="p-3.5 text-[#F4F7FF] font-medium">{d.milestone}</td>
                <td className="p-3.5 text-[#8992A8]">{d.owner}</td>
                <td className="p-3.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                    d.status === 'Completed'
                      ? 'badge-success'
                      : d.status === 'At Risk'
                      ? 'badge-critical'
                      : 'badge-warning'
                  }`}>
                    {d.status}
                  </span>
                </td>
                <td className="p-3.5 font-mono text-[#8992A8]">{d.dueDate}</td>
                <td className="p-3.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                    d.reviewStatus === 'Approved'
                      ? 'badge-success'
                      : d.reviewStatus === 'Changes Requested'
                      ? 'badge-critical'
                      : 'badge-warning'
                  }`}>
                    {d.reviewStatus}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  {canApprove && d.reviewStatus !== 'Approved' && (
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => approveDeliverable(d.id)}
                        className="px-2.5 py-1 rounded-md bg-[#18C997]/15 text-[#18C997] border border-[#18C997]/30 hover:bg-[#18C997]/25 text-[11px] font-bold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => requestChangesDeliverable(d.id)}
                        className="px-2.5 py-1 rounded-md bg-[#FF4D6D]/15 text-[#FF859B] border border-[#FF4D6D]/30 hover:bg-[#FF4D6D]/25 text-[11px] font-bold"
                      >
                        Changes
                      </button>
                    </div>
                  )}
                  {d.reviewStatus === 'Approved' && (
                    <span className="text-[11px] text-[#18C997] font-semibold">✓ Verified</span>
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
