import React, { useState, useMemo } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  LayoutGrid,
  List,
  Calendar,
  Users,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Building2,
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import HealthRing from '../components/HealthRing';

export default function ProjectsView() {
  const {
    projects,
    tasks,
    setIsCreateProjectOpen,
    setDrilldownProject
  } = useProject();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const categories = useMemo(() => {
    const set = new Set(['All']);
    projects.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.client && p.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchCategory && matchSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#252A3A]">
        <div>
          <div className="label-tech text-[#39D9FF]">PORTFOLIO DIRECTORY</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
            PROJECTS & INITIATIVES
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            "High-level initiative portfolio, health scores, and stakeholder ownership."
          </p>
        </div>

        <button
          onClick={() => setIsCreateProjectOpen(true)}
          className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 w-fit"
        >
          <Plus size={14} className="stroke-[2.5]" />
          <span>New Initiative</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search initiatives, clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#0D101A] border border-[#252A3A] rounded-xl text-xs text-[#F4F7FF]"
            />
            <Search size={14} className="absolute left-3 top-2 text-[#555E73]" />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-[#0D101A] border border-[#252A3A] rounded-xl text-xs text-[#F4F7FF]"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0D101A] border border-[#252A3A]">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'grid'
                ? 'bg-[#131522] text-[#F4F7FF] border border-[#252A3A]'
                : 'text-[#8992A8]'
            }`}
          >
            <LayoutGrid size={13} />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'table'
                ? 'bg-[#131522] text-[#F4F7FF] border border-[#252A3A]'
                : 'text-[#8992A8]'
            }`}
          >
            <List size={13} />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredProjects.map(project => {
            const isAtRisk = project.health < 75;
            return (
              <div
                key={project.id}
                className="surface-card rounded-2xl p-6 border border-[#252A3A] hover:border-[#4F7CFF]/50 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 pb-3 mb-4 border-b border-[#252A3A]">
                    <div>
                      <span className="text-[10px] font-mono text-[#39D9FF] uppercase tracking-wider block">
                        {project.category} · Client: {project.client}
                      </span>
                      <h3 className="text-lg font-bold text-[#F4F7FF] mt-0.5">
                        {project.name}
                      </h3>
                      <div className="text-xs text-[#8992A8] mt-1">
                        Owner: <strong className="text-[#F4F7FF]">{project.owner}</strong>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold ${
                        isAtRisk ? 'badge-critical' : 'badge-success'
                      }`}>
                        {project.health} — {project.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#8992A8] leading-relaxed mb-5">
                    {project.description}
                  </p>

                  <div className="grid grid-cols-3 gap-3 text-center text-xs mb-5">
                    <div className="p-2.5 rounded-xl bg-[#0D101A] border border-[#252A3A]">
                      <div className="text-[10px] text-[#8992A8] uppercase font-mono">PROGRESS</div>
                      <div className="text-base font-bold font-mono text-[#F4F7FF] mt-0.5">{project.progress}%</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0D101A] border border-[#252A3A]">
                      <div className="text-[10px] text-[#8992A8] uppercase font-mono">DEADLINE</div>
                      <div className="text-xs font-bold font-mono text-[#F4F7FF] mt-1">{project.deadline}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0D101A] border border-[#252A3A]">
                      <div className="text-[10px] text-[#8992A8] uppercase font-mono">ACTIVE RISKS</div>
                      <div className={`text-base font-bold font-mono mt-0.5 ${project.risks > 0 ? 'text-[#FF859B]' : 'text-[#18C997]'}`}>
                        {project.risks} Active
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#252A3A] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#8992A8]">
                    <Users size={13} className="text-[#39D9FF]" />
                    <span>{project.members} Team Members</span>
                  </div>

                  <button
                    onClick={() => setDrilldownProject(project)}
                    className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>Inspect Details</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="surface-card rounded-2xl border border-[#252A3A] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D101A] border-b border-[#252A3A] text-[10px] font-bold uppercase text-[#8992A8] font-mono">
              <tr>
                <th className="p-3.5">Project</th>
                <th className="p-3.5">Client</th>
                <th className="p-3.5">Owner</th>
                <th className="p-3.5">Progress</th>
                <th className="p-3.5">Health</th>
                <th className="p-3.5">Deadline</th>
                <th className="p-3.5">Risks</th>
                <th className="p-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252A3A]">
              {filteredProjects.map(p => (
                <tr key={p.id} className="hover:bg-[#171A2A] transition">
                  <td className="p-3.5 font-bold text-[#F4F7FF]">{p.name}</td>
                  <td className="p-3.5 text-[#8992A8]">{p.client}</td>
                  <td className="p-3.5 text-[#F4F7FF]">{p.owner}</td>
                  <td className="p-3.5 font-mono font-bold text-[#F4F7FF]">{p.progress}%</td>
                  <td className="p-3.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${p.health < 75 ? 'badge-critical' : 'badge-success'}`}>
                      {p.health} — {p.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-[#8992A8]">{p.deadline}</td>
                  <td className="p-3.5 font-mono text-[#FF859B]">{p.risks} Risks</td>
                  <td className="p-3.5">
                    <button
                      onClick={() => setDrilldownProject(p)}
                      className="text-xs text-[#4F7CFF] hover:underline font-bold"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
