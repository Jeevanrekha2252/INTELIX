import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, FolderKanban, CheckSquare, Users, ShieldAlert, ArrowRight, X } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export default function SearchCommandPalette() {
  const {
    isSearchOpen,
    setIsSearchOpen,
    projects,
    tasks,
    teamWorkload,
    setActiveView,
    setEditingTask,
    setIsCreateTaskOpen,
    setDrilldownProject
  } = useProject();

  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return {
        quickViews: [
          { type: 'view', label: 'Executive Dashboard', target: 'Overview', icon: FolderKanban },
          { type: 'view', label: 'Initiatives Portfolio', target: 'Projects', icon: FolderKanban },
          { type: 'view', label: 'Sprint Tasks & Kanban', target: 'Tasks', icon: CheckSquare },
          { type: 'view', label: 'Risk Center & Alerts', target: 'Risk Center', icon: ShieldAlert },
          { type: 'view', label: 'Team Bandwidth', target: 'Team Workload', icon: Users }
        ],
        tasks: tasks.slice(0, 3),
        projects: projects.slice(0, 2),
        members: []
      };
    }

    const q = query.toLowerCase();

    const matchedProjects = projects.filter(p =>
      p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))
    );

    const matchedTasks = tasks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.project.toLowerCase().includes(q) ||
      t.assignee.toLowerCase().includes(q)
    );

    const matchedMembers = teamWorkload.filter(m =>
      m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)
    );

    return {
      quickViews: [],
      tasks: matchedTasks,
      projects: matchedProjects,
      members: matchedMembers
    };
  }, [query, projects, tasks, teamWorkload]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-100">
      <div className="relative w-full max-w-xl surface-modal rounded-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900">
          <Search size={17} className="text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search deliverables, initiatives, team members, or jump to view..."
            className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-500 hover:text-slate-300"
            >
              <X size={15} />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[55vh] overflow-y-auto p-3 space-y-3">
          {/* Quick Views */}
          {filteredResults.quickViews.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 px-2">
                Navigation Shortcuts
              </div>
              <div className="space-y-0.5">
                {filteredResults.quickViews.map(item => (
                  <button
                    key={item.target}
                    onClick={() => {
                      setActiveView(item.target);
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 text-slate-200 text-xs text-left transition"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon size={15} className="text-blue-400" />
                      <span>{item.label}</span>
                    </div>
                    <ArrowRight size={13} className="text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {filteredResults.projects.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 px-2">
                Initiatives
              </div>
              <div className="space-y-0.5">
                {filteredResults.projects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setDrilldownProject(p);
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 text-slate-200 text-xs text-left transition"
                  >
                    <div>
                      <div className="font-semibold text-white">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.category} · Health: {p.health}%</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-blue-400 font-semibold">
                      Inspect →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {filteredResults.tasks.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 px-2">
                Sprint Deliverables
              </div>
              <div className="space-y-0.5">
                {filteredResults.tasks.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setEditingTask(t);
                      setIsCreateTaskOpen(true);
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 text-slate-200 text-xs text-left transition"
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="font-semibold text-white truncate">{t.title}</div>
                      <div className="text-[10px] text-slate-400">{t.project.split('—')[0]} · {t.assignee}</div>
                    </div>
                    <div className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      t.risk >= 65 ? 'badge-critical' : 'badge-success'
                    }`}>
                      R: {t.risk}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-800 bg-[#080c14] flex items-center justify-between text-[11px] text-slate-400">
          <span>Search command palette</span>
          <span className="text-blue-400 font-semibold">INTELIX PRO</span>
        </div>
      </div>
    </div>
  );
}
