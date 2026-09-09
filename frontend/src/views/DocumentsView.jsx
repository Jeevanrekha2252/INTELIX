import React from 'react';
import {
  FileText,
  FileCode,
  FileSpreadsheet,
  Download,
  Lock,
  Plus
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export default function DocumentsView() {
  const { documents, showToast } = useProject();

  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF':
        return <FileText size={16} className="text-[#FF4D6D]" />;
      case 'SCHEMA':
      case 'CODE':
        return <FileCode size={16} className="text-[#39D9FF]" />;
      case 'SHEET':
        return <FileSpreadsheet size={16} className="text-[#18C997]" />;
      default:
        return <FileText size={16} className="text-[#7C5CFF]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#252A3A]">
        <div>
          <div className="label-tech text-[#39D9FF]">ARTIFACT REPOSITORY</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
            PROJECT DOCUMENTS & SPECS
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            "Official technical specifications, compliance manuals, and architecture blueprints."
          </p>
        </div>

        <button
          onClick={() => showToast('Document upload modal placeholder', 'info')}
          className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 w-fit"
        >
          <Plus size={14} className="stroke-[2.5]" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Documents Table */}
      <div className="surface-card rounded-2xl border border-[#252A3A] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0D101A] border-b border-[#252A3A] text-[10px] font-bold uppercase text-[#8992A8] font-mono">
            <tr>
              <th className="p-3.5">Document</th>
              <th className="p-3.5">Type</th>
              <th className="p-3.5">Project</th>
              <th className="p-3.5">Owner</th>
              <th className="p-3.5">Updated</th>
              <th className="p-3.5">Access Rights</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#252A3A]">
            {documents.map(doc => (
              <tr key={doc.id} className="hover:bg-[#171A2A] transition">
                <td className="p-3.5 font-bold text-[#F4F7FF] flex items-center gap-2.5">
                  {getFileIcon(doc.type)}
                  <span>{doc.name}</span>
                </td>
                <td className="p-3.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#131522] border border-[#252A3A] font-mono font-bold text-[#39D9FF]">
                    {doc.type}
                  </span>
                </td>
                <td className="p-3.5 text-[#8992A8]">{doc.project}</td>
                <td className="p-3.5 text-[#F4F7FF]">{doc.owner}</td>
                <td className="p-3.5 font-mono text-[#8992A8]">{doc.updated}</td>
                <td className="p-3.5 text-[#8992A8] flex items-center gap-1.5 pt-4">
                  <Lock size={12} className="text-[#555E73]" />
                  <span>{doc.access}</span>
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => showToast(`Downloading ${doc.name}`, 'success')}
                    className="p-1.5 rounded-lg text-[#8992A8] hover:text-[#F4F7FF] hover:bg-[#0D101A] transition"
                    title="Download artifact"
                  >
                    <Download size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
