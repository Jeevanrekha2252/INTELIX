import React, { useState, useMemo } from 'react';
import {
  GitMerge,
  Plus,
  ArrowRight,
  AlertTriangle,
  Clock,
  Trash2,
  SlidersHorizontal,
  Sparkles,
  Zap,
  TrendingDown,
  ChevronRight,
  User,
  ShieldAlert,
  CheckCircle2,
  X
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { simulateDelayCascade } from '../services/mlEngine';

export default function DependenciesView() {
  const {
    tasks,
    dependencies,
    addDependency,
    deleteDependency,
    showToast
  } = useProject();

  // Selected simulation source task
  const [selectedSimTask, setSelectedSimTask] = useState(1); // Task 1: Database schema
  const [injectedDelay, setInjectedDelay] = useState(3); // 3 days behind
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(tasks.find(t => t.id === 1) || tasks[0]);

  const [newLink, setNewLink] = useState({
    fromId: tasks[0]?.id || 1,
    toId: tasks[1]?.id || 2,
    severity: 'Critical',
    delayHours: 24,
    downstreamDelayDays: 2
  });

  // Calculate cascade simulation using the ML engine
  const cascadeResult = useMemo(() => {
    return simulateDelayCascade(tasks, dependencies, selectedSimTask, injectedDelay);
  }, [tasks, dependencies, selectedSimTask, injectedDelay]);

  const handleCreateLink = (e) => {
    e.preventDefault();
    if (+newLink.fromId === +newLink.toId) {
      showToast('Cannot link a deliverable to itself', 'warning');
      return;
    }

    const fromTask = tasks.find(t => t.id === +newLink.fromId);
    const toTask = tasks.find(t => t.id === +newLink.toId);
    if (!fromTask || !toTask) return;

    addDependency({
      fromId: fromTask.id,
      toId: toTask.id,
      fromTitle: fromTask.title,
      toTitle: toTask.title,
      severity: newLink.severity,
      delayHours: +newLink.delayHours || 24,
      downstreamDelayDays: +newLink.downstreamDelayDays || 2
    });

    setIsAddLinkOpen(false);
  };

  // The signature 5-node critical execution chain
  const criticalNodes = [
    {
      id: 1,
      name: 'DATABASE SCHEMA MIGRATION',
      sub: 'Telemetry range partitioning',
      owner: 'Ishaan Mantri',
      progress: 42,
      deadline: '19 Sep 2026',
      risk: 92,
      delay: injectedDelay > 0 ? `⚠ +${injectedDelay} Days (Origin)` : 'On Schedule',
      isOrigin: true
    },
    {
      id: 118,
      name: 'BACKEND API & REST BRIDGE',
      sub: 'MQTT ingestion pipeline',
      owner: 'Kabir Singh',
      progress: 62,
      deadline: '20 Sep 2026',
      risk: 87,
      delay: injectedDelay > 0 ? `⚠ +2 Days Cascade` : 'On Schedule',
      isDelayed: injectedDelay > 0
    },
    {
      id: 2,
      name: 'FRONTEND INTEGRATION',
      sub: 'Live WebGL chart streams',
      owner: 'Marcus Vance',
      progress: 25,
      deadline: '22 Sep 2026',
      risk: 68,
      delay: injectedDelay > 0 ? `⚠ +2 Days Cascade` : 'On Schedule',
      isDelayed: injectedDelay > 0
    },
    {
      id: 3,
      name: 'TESTING & ACCESSIBILITY (WCAG)',
      sub: 'Cross-browser automated test',
      owner: 'Diya Patel',
      progress: 15,
      deadline: '24 Sep 2026',
      risk: 42,
      delay: injectedDelay > 0 ? `⚠ +2 Days Cascade` : 'On Schedule',
      isDelayed: injectedDelay > 0
    },
    {
      id: 4,
      name: 'PRODUCTION DEPLOYMENT',
      sub: 'Multi-zone canary rollout',
      owner: 'Rahul Verma',
      progress: 5,
      deadline: '26 Sep 2026',
      risk: 35,
      delay: injectedDelay > 0 ? `⚠ +4 Days Final Impact` : 'On Schedule',
      isDelayed: injectedDelay > 0
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#252A3A]">
        <div>
          <div className="label-tech text-[#39D9FF]">CRITICAL PATH & DEPENDENCY GRAPH</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
            DEPENDENCY INTELLIGENCE & DELAY CASCADE
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            "Understand how an upstream delay ripples through the entire delivery chain."
          </p>
        </div>

        <button
          onClick={() => setIsAddLinkOpen(true)}
          className="btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 w-fit"
        >
          <Plus size={14} className="stroke-[2.5]" />
          <span>Add Dependency Link</span>
        </button>
      </div>

      {/* DELAY PROPAGATION SANDBOX CONTROLS */}
      <div className="surface-card rounded-2xl p-5 border border-[#252A3A]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4F7CFF]/15 text-[#39D9FF] grid place-items-center">
              <SlidersHorizontal size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#F4F7FF] uppercase tracking-wider">
                Upstream Slippage Simulation Sandbox
              </h3>
              <p className="text-[11px] text-[#8992A8]">
                Inject simulated slippage on an upstream milestone to test critical path resilience.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8992A8]">Injected Slippage:</span>
            <span className="px-2.5 py-1 rounded-md bg-[#FF4D6D]/15 border border-[#FF4D6D]/30 font-mono font-bold text-[#FF859B] text-xs">
              +{injectedDelay} Days
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-5">
          <div className="flex-1 w-full">
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={injectedDelay}
              onChange={(e) => setInjectedDelay(+e.target.value)}
              className="w-full accent-[#4F7CFF] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#555E73] mt-1">
              <span>0 Days (On Track)</span>
              <span>3 Days (Current Contention)</span>
              <span>10 Days (Catastrophic)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0D101A] border border-[#252A3A] min-w-[200px] text-xs">
            <div className="text-[10px] text-[#8992A8] font-mono uppercase">FINAL DELIVERY IMPACT</div>
            <div className="text-xl font-black font-mono text-[#FF4D6D] mt-0.5">
              +{injectedDelay > 0 ? injectedDelay + 1 : 0} DAYS DELAY
            </div>
          </div>
        </div>
      </div>

      {/* SIGNATURE VISUAL DEPENDENCY CHAIN */}
      <div className="surface-card rounded-2xl p-6 border border-[#252A3A]">
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#252A3A]">
          <div className="label-tech text-[#8992A8]">CRITICAL EXECUTION PATH & RIPPLE EFFECT</div>
          <span className="text-[10px] font-mono text-[#39D9FF]">CLICK ANY NODE FOR METRICS</span>
        </div>

        <div className="space-y-3">
          {criticalNodes.map((node, idx) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <div key={node.id} className="relative">
                <div
                  onClick={() => setSelectedNode(tasks.find(t => t.id === node.id) || node)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-[#4F7CFF] bg-[#171A2A] shadow-[0_0_15px_rgba(79,124,255,0.15)]'
                      : node.isOrigin
                      ? 'bg-[#FF4D6D]/10 border-[#FF4D6D]/40'
                      : node.isDelayed
                      ? 'bg-[#0D101A] border-[#252A3A] hover:border-[#384158]'
                      : 'bg-[#0D101A] border-[#252A3A]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-8 h-8 rounded-lg font-mono font-bold text-xs grid place-items-center ${
                      node.isOrigin
                        ? 'bg-[#FF4D6D] text-white animate-pulse'
                        : node.isDelayed
                        ? 'bg-[#F5B942]/20 text-[#F8CB6E] border border-[#F5B942]/40'
                        : 'bg-[#18C997]/20 text-[#18C997] border border-[#18C997]/40'
                    }`}>
                      0{idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#F4F7FF] tracking-wide flex items-center gap-2">
                        {node.name}
                        {node.isOrigin && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FF4D6D] text-white font-mono font-bold">
                            ROOT BOTTLENECK
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#8992A8]">{node.sub} · Owner: <strong className="text-[#F4F7FF]">{node.owner}</strong></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-[#F4F7FF]">{node.progress}%</div>
                      <div className="text-[10px] text-[#8992A8]">{node.deadline}</div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold ${
                      node.isOrigin
                        ? 'badge-critical'
                        : node.isDelayed
                        ? 'badge-warning'
                        : 'badge-success'
                    }`}>
                      {node.delay}
                    </span>
                  </div>
                </div>

                {/* Downward Connector Arrow */}
                {idx < criticalNodes.length - 1 && (
                  <div className="flex items-center justify-center my-1 text-[#555E73]">
                    <div className="w-0.5 h-3 bg-[#252A3A]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* NODE CONTEXT INSPECTION DRAWER & ALL LINKS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selected Node Details */}
        <div className="lg:col-span-2 surface-card rounded-2xl p-5 border border-[#252A3A]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#252A3A]">
            <div className="label-tech text-[#8992A8]">NODE CONTEXTUAL TELEMETRY</div>
            <span className="text-xs font-mono text-[#39D9FF]">TASK-{selectedNode?.id}</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <h3 className="text-base font-bold text-[#F4F7FF]">{selectedNode?.title || selectedNode?.name}</h3>
              <p className="text-[#8992A8] mt-1">{selectedNode?.description || selectedNode?.sub}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#0D101A] border border-[#252A3A]">
                <div className="text-[10px] text-[#8992A8] uppercase font-mono">OWNER</div>
                <div className="font-bold text-[#F4F7FF] mt-0.5">{selectedNode?.assignee || selectedNode?.owner}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0D101A] border border-[#252A3A]">
                <div className="text-[10px] text-[#8992A8] uppercase font-mono">PROGRESS</div>
                <div className="font-bold font-mono text-[#F4F7FF] mt-0.5">{selectedNode?.progress}%</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0D101A] border border-[#252A3A]">
                <div className="text-[10px] text-[#8992A8] uppercase font-mono">DUE DATE</div>
                <div className="font-bold font-mono text-[#F4F7FF] mt-0.5">{selectedNode?.due || selectedNode?.deadline}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0D101A] border border-[#252A3A]">
                <div className="text-[10px] text-[#8992A8] uppercase font-mono">RISK SCORE</div>
                <div className="font-bold font-mono text-[#FF859B] mt-0.5">{selectedNode?.risk || 87}/100</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#171A2A] border border-[#7C5CFF]/30 space-y-2">
              <div className="label-tech text-[#39D9FF]">DOWNSTREAM IMPACT SUMMARY</div>
              <p className="text-[#8992A8]">
                Delay in <strong className="text-[#F4F7FF]">{selectedNode?.title || selectedNode?.name}</strong> impacts 3 downstream milestones and pushes the project release window by approximately +4 days.
              </p>
            </div>
          </div>
        </div>

        {/* All Dependency Links Table */}
        <div className="surface-card rounded-2xl p-5 border border-[#252A3A]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#252A3A]">
            <div className="label-tech text-[#8992A8]">CONFIGURED LINKS ({dependencies.length})</div>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 text-xs">
            {dependencies.map(dep => (
              <div key={dep.id} className="p-3 rounded-xl bg-[#0D101A] border border-[#252A3A] flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-bold text-[#F4F7FF] truncate">{dep.fromTitle}</div>
                  <div className="text-[10px] text-[#39D9FF] flex items-center gap-1 mt-0.5">
                    <span>→</span>
                    <span className="truncate">{dep.toTitle}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteDependency(dep.id)}
                  className="p-1 text-[#555E73] hover:text-[#FF4D6D] transition"
                  title="Remove link"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Dependency Modal */}
      {isAddLinkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="surface-modal rounded-2xl p-6 max-w-lg w-full border border-[#384158] shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#252A3A]">
              <h3 className="text-sm font-bold text-[#F4F7FF]">Create Dependency Connection</h3>
              <button onClick={() => setIsAddLinkOpen(false)} className="text-[#8992A8] hover:text-[#F4F7FF]">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateLink} className="space-y-4 text-xs">
              <div>
                <label className="label-tech text-[#8992A8] block mb-1.5">PREDECESSOR (UPSTREAM DELIVERABLE)</label>
                <select
                  value={newLink.fromId}
                  onChange={(e) => setNewLink({ ...newLink, fromId: +e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF]"
                >
                  {tasks.map(t => (
                    <option key={t.id} value={t.id}>TASK-{t.id}: {t.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label-tech text-[#8992A8] block mb-1.5">SUCCESSOR (DOWNSTREAM DELIVERABLE)</label>
                <select
                  value={newLink.toId}
                  onChange={(e) => setNewLink({ ...newLink, toId: +e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF]"
                >
                  {tasks.map(t => (
                    <option key={t.id} value={t.id}>TASK-{t.id}: {t.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-tech text-[#8992A8] block mb-1.5">SEVERITY IMPACT</label>
                  <select
                    value={newLink.severity}
                    onChange={(e) => setNewLink({ ...newLink, severity: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF]"
                  >
                    <option value="Critical">Critical (Halts Pipeline)</option>
                    <option value="High">High (Major Variance)</option>
                    <option value="Medium">Medium (Buffer Absorbed)</option>
                  </select>
                </div>
                <div>
                  <label className="label-tech text-[#8992A8] block mb-1.5">CASCADE DAYS</label>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    value={newLink.downstreamDelayDays}
                    onChange={(e) => setNewLink({ ...newLink, downstreamDelayDays: +e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#252A3A]">
                <button
                  type="button"
                  onClick={() => setIsAddLinkOpen(false)}
                  className="btn-ghost px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Create Dependency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
