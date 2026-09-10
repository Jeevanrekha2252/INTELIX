import React, { useState } from 'react';
import {
  FileText,
  FileCode,
  FileSpreadsheet,
  Download,
  Lock,
  Plus,
  X,
  UploadCloud,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export default function DocumentsView() {
  const { documents, uploadDocument, projects, showToast, activeRole } = useProject();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'PDF',
    project: projects[0]?.name || 'Smart Campus 360',
    access: 'Internal Stakeholders',
    size: '2.4 MB',
    description: ''
  });

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

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      showToast('Please specify a document name', 'warning');
      return;
    }
    uploadDocument({
      name: formData.name.endsWith('.pdf') || formData.name.includes('.') ? formData.name : `${formData.name}.pdf`,
      type: formData.type,
      project: formData.project,
      access: formData.access,
      size: formData.size || '1.8 MB',
      description: formData.description || 'Verified project artifact.'
    });
    setIsUploadModalOpen(false);
    setFormData({
      name: '',
      type: 'PDF',
      project: projects[0]?.name || 'Smart Campus 360',
      access: 'Internal Stakeholders',
      size: '2.4 MB',
      description: ''
    });
  };

  const handleDownload = (doc) => {
    showToast(`Downloading verified artifact: ${doc.name} (${doc.size || '3.2 MB'})`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#252A3A]">
        <div>
          <div className="label-tech text-[#39D9FF]">ARTIFACT REPOSITORY</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
            PROJECT DOCUMENTS & SPECIFICATIONS
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            "Versioned technical specifications, security compliance manuals, and architecture blueprints with access governance."
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 w-fit"
        >
          <Plus size={14} className="stroke-[2.5]" />
          <span>Upload Technical Document</span>
        </button>
      </div>

      {/* Documents Table */}
      <div className="surface-card rounded-2xl border border-[#252A3A] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D101A] border-b border-[#252A3A] text-[10px] font-bold uppercase text-[#8992A8] font-mono">
              <tr>
                <th className="p-3.5">Document Artifact</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Project Initiative</th>
                <th className="p-3.5">Owner / Author</th>
                <th className="p-3.5">Last Updated</th>
                <th className="p-3.5">Access Rights</th>
                <th className="p-3.5 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252A3A]">
              {documents.map(doc => (
                <tr key={doc.id} className="hover:bg-[#171A2A] transition">
                  <td className="p-3.5 font-bold text-[#F4F7FF]">
                    <div className="flex items-center gap-2.5">
                      {getFileIcon(doc.type)}
                      <div>
                        <span>{doc.name}</span>
                        <div className="text-[10px] text-[#555E73] font-mono">{doc.size || '3.2 MB'} · Versioned</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#131522] border border-[#252A3A] font-mono font-bold text-[#39D9FF]">
                      {doc.type}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#8992A8]">{doc.project}</td>
                  <td className="p-3.5 text-[#F4F7FF]">{doc.owner}</td>
                  <td className="p-3.5 font-mono text-[#8992A8]">{doc.updated}</td>
                  <td className="p-3.5 text-[#8992A8]">
                    <div className="flex items-center gap-1.5">
                      <Lock size={12} className="text-[#555E73]" />
                      <span>{doc.access}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-1.5 rounded-lg text-[#8992A8] hover:text-[#39D9FF] hover:bg-[#0D101A] transition"
                      title="Download artifact"
                    >
                      <Download size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPLOAD DOCUMENT MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="surface-card rounded-2xl p-6 max-w-lg w-full border border-[#252A3A] shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#252A3A]">
              <div className="flex items-center gap-2">
                <UploadCloud size={18} className="text-[#39D9FF]" />
                <h3 className="text-base font-bold text-[#F4F7FF]">Upload Technical Specification</h3>
              </div>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-[#8992A8] hover:text-[#F4F7FF]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8992A8] font-semibold mb-1.5 font-mono text-[10px] uppercase">
                  Document Filename / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SCMS Sensor Network Architecture Spec v2.1.pdf"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF] focus:outline-none focus:border-[#4F7CFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8992A8] font-semibold mb-1.5 font-mono text-[10px] uppercase">
                    Artifact Category
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF] focus:outline-none focus:border-[#4F7CFF]"
                  >
                    <option value="PDF">Technical PDF Report</option>
                    <option value="SCHEMA">Database Schema DDL</option>
                    <option value="SPEC">Architecture Spec</option>
                    <option value="SHEET">Budget & EVM Sheet</option>
                    <option value="CODE">OpenAPI / Swagger Spec</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8992A8] font-semibold mb-1.5 font-mono text-[10px] uppercase">
                    Project Initiative
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
              </div>

              <div>
                <label className="block text-[#8992A8] font-semibold mb-1.5 font-mono text-[10px] uppercase">
                  Access & Security Classification
                </label>
                <select
                  value={formData.access}
                  onChange={(e) => setFormData({ ...formData, access: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF] focus:outline-none focus:border-[#4F7CFF]"
                >
                  <option value="Internal Stakeholders">Internal Stakeholders (Team + Client)</option>
                  <option value="Core Engineering Only">Core Engineering Only</option>
                  <option value="Public Governance">Public Governance Release</option>
                </select>
              </div>

              {/* Upload Drag & Drop Box */}
              <div className="border-2 border-dashed border-[#252A3A] hover:border-[#4F7CFF]/50 rounded-xl p-6 text-center cursor-pointer transition bg-[#0D101A]">
                <UploadCloud size={24} className="mx-auto text-[#39D9FF] mb-2" />
                <span className="font-bold text-[#F4F7FF] block text-xs">
                  Drag and drop technical artifact here, or browse files
                </span>
                <span className="text-[10px] text-[#8992A8] block mt-1 font-mono">
                  Supported formats: PDF, SQL, JSON, YAML, DOCX (up to 25MB)
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#252A3A]">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Upload & Secure Artifact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
