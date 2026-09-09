import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  Users,
  Zap,
  Clock,
  GitMerge,
  Activity,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Building2,
  CheckSquare,
  AlertOctagon,
  TrendingDown,
  TrendingUp,
  FileCheck2,
  GitPullRequest,
  Lock,
  Server,
  Database,
  Cpu,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';
import { useProject } from '../context/ProjectContext';
import IntelixIntelligenceCard from '../components/IntelixIntelligenceCard';
import HealthRing from '../components/HealthRing';

export default function OverviewView() {
  const {
    projects,
    tasks,
    dependencies,
    teamWorkload,
    deliverables,
    changeRequests,
    approvals,
    meetings,
    activity,
    recommendations,
    applyRecommendation,
    moveTaskStatus,
    toggleTaskBlocker,
    updateTask,
    approveDeliverable,
    requestChangesDeliverable,
    activeRole,
    setActiveView,
    setDrilldownProject,
    setIsCopilotOpen,
    setIsCreateTaskOpen,
    setEditingTask,
    showToast
  } = useProject();

  const roleId = activeRole?.id || 'manager';

  // Computed metrics
  const activeTasksCount = tasks.length;
  const completedTasksCount = tasks.filter(t => t.status === 'Completed').length;
  const criticalTasks = useMemo(() => tasks.filter(t => t.risk >= 65 || t.blocked), [tasks]);
  const myTasks = useMemo(() => tasks.filter(t => t.assignee.includes(activeRole.name.split(' ')[0]) || t.assignee === 'Kabir Singh'), [tasks, activeRole]);

  // Selected project for manager / executive
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || 1);
  const currentProject = useMemo(() => {
    return projects.find(p => p.id === selectedProjectId) || projects[0];
  }, [projects, selectedProjectId]);

  // Project health contributor factors
  const healthFactors = [
    { label: 'Progress Gap', score: '68%', status: 'Normal', impact: '-8 pts' },
    { label: 'Deadline Pressure', score: '4 Days Remaining', status: 'Warning', impact: '-12 pts' },
    { label: 'Dependency Latency', score: 'Upstream Delay', status: 'Critical', impact: '-18 pts' },
    { label: 'Workload Overload', score: 'Marcus Vance @ 125%', status: 'Warning', impact: '-6 pts' },
    { label: 'Active Blockers', score: '1 Critical Blocker', status: 'Critical', impact: '-14 pts' }
  ];

  /* -------------------------------------------------------------
     1. MANAGER DASHBOARD: PROJECT CONTROL CENTER
  ------------------------------------------------------------- */
  const renderManagerDashboard = () => (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#252A3A]">
        <div>
          <div className="label-tech text-[#39D9FF]">PROJECT CONTROL CENTER</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
            PROJECT CONTROL CENTER
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            "Everything you need to keep delivery on track."
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(+e.target.value)}
            className="px-3 py-1.5 bg-[#0D101A] border border-[#252A3A] rounded-xl text-xs font-semibold text-[#F4F7FF]"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <Sparkles size={14} />
            <span>Assistant</span>
          </button>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface-card rounded-2xl p-4 border border-[#252A3A]">
          <div className="label-tech text-[#8992A8]">ACTIVE PROJECTS</div>
          <div className="text-3xl font-black font-mono text-[#F4F7FF] mt-1">12</div>
          <div className="text-[10px] text-[#8992A8] mt-1">Across 4 Government Ministries</div>
        </div>

        <div className="surface-card rounded-2xl p-4 border border-[#18C997]/30">
          <div className="label-tech text-[#18C997]">ON TRACK</div>
          <div className="text-3xl font-black font-mono text-[#18C997] mt-1">09</div>
          <div className="text-[10px] text-[#8992A8] mt-1">Steady velocity & schedule</div>
        </div>

        <div className="surface-card rounded-2xl p-4 border border-[#F5B942]/30">
          <div className="label-tech text-[#F5B942]">AT RISK</div>
          <div className="text-3xl font-black font-mono text-[#F5B942] mt-1">02</div>
          <div className="text-[10px] text-[#8992A8] mt-1">Smart Campus · Grievance 2.0</div>
        </div>

        <div className="surface-card rounded-2xl p-4 border border-[#FF4D6D]/30">
          <div className="label-tech text-[#FF4D6D]">DELAYED</div>
          <div className="text-3xl font-black font-mono text-[#FF4D6D] mt-1">01</div>
          <div className="text-[10px] text-[#FF859B] mt-1">Database Schema Migration</div>
        </div>
      </div>

      {/* Row: Project Health & Delivery Outlook */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Health 72/100 */}
        <div className="surface-card rounded-2xl p-5 border border-[#252A3A]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#252A3A]">
            <div>
              <div className="label-tech text-[#8992A8]">PROJECT HEALTH</div>
              <div className="text-sm font-bold text-[#F4F7FF]">{currentProject.name}</div>
            </div>
            <span className="badge-critical px-2 py-0.5 rounded text-[11px] font-bold font-mono">
              AT RISK
            </span>
          </div>

          <div className="flex items-center gap-5 my-3">
            <HealthRing score={currentProject.health || 72} size={84} strokeWidth={9} />
            <div>
              <div className="text-3xl font-black font-mono text-[#F4F7FF]">
                {currentProject.health || 72} <span className="text-sm text-[#8992A8]">/ 100</span>
              </div>
              <p className="text-xs text-[#8992A8] mt-1">
                Calculated by ML Decision Engine across 5 contributing telemetry factors.
              </p>
            </div>
          </div>

          {/* Contributing Factors */}
          <div className="mt-4 pt-3 border-t border-[#252A3A] space-y-2">
            <div className="label-tech text-[#555E73]">CONTRIBUTING FACTORS</div>
            {healthFactors.map((hf, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-0.5">
                <span className="text-[#8992A8]">{hf.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#F4F7FF] font-medium">{hf.score}</span>
                  <span className={`text-[10px] font-mono ${hf.status === 'Critical' ? 'text-[#FF4D6D]' : hf.status === 'Warning' ? 'text-[#F5B942]' : 'text-[#18C997]'}`}>
                    {hf.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signature Intelix Intelligence Card */}
        <div className="lg:col-span-2">
          <IntelixIntelligenceCard
            level="HIGH RISK"
            score={87}
            whatHappened="Backend API may delay release."
            why="Database migration is 3 days behind expected progress."
            whatWillHappen="Frontend integration may shift by approximately 2 days."
            impact="+4 days predicted delay"
            confidence="91%"
            whatShouldIDo="Move one available backend engineer to the migration task."
            onViewAnalysis={() => setActiveView('Risk Center')}
            onTakeAction={() => applyRecommendation(1)}
            actionButtonText="Take Action"
          />
        </div>
      </div>

      {/* Row: Delivery Outlook, Team Bandwidth & Critical Path */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Delivery Outlook */}
        <div className="surface-card rounded-2xl p-5 border border-[#252A3A]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#252A3A]">
            <div className="label-tech text-[#8992A8]">DELIVERY OUTLOOK</div>
            <span className="text-[10px] font-mono text-[#39D9FF]">CONFIDENCE: 91%</span>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8992A8]">Current Planned Target:</span>
              <span className="font-mono font-bold text-[#F4F7FF]">24 Sep 2026</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8992A8]">ML Predicted Completion:</span>
              <span className="font-mono font-bold text-[#FF859B]">28 Sep 2026</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-[#252A3A]">
              <span className="text-[#8992A8]">Expected Cascade Delay:</span>
              <span className="font-mono font-black text-[#FF4D6D] text-base">+4 DAYS</span>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-[#0D101A] border border-[#252A3A] text-xs text-[#8992A8]">
            <span className="text-[#F4F7FF] font-semibold">Critical Slippage Path:</span> Database contention creates a 48h bottleneck on Backend REST endpoints.
          </div>
        </div>

        {/* Team Bandwidth */}
        <div className="surface-card rounded-2xl p-5 border border-[#252A3A]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#252A3A]">
            <div className="label-tech text-[#8992A8]">TEAM BANDWIDTH</div>
            <button onClick={() => setActiveView('Team Workload')} className="text-[10px] text-[#4F7CFF] hover:underline font-bold">
              View Team →
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { name: 'Rahul Verma', load: 92, status: 'warning' },
              { name: 'Priya Sharma', load: 74, status: 'normal' },
              { name: 'Marcus Vance', load: 125, status: 'overloaded', alert: '⚠ OVERLOADED' },
              { name: 'Ananya Sharma', load: 61, status: 'normal' }
            ].map((m, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-[#0D101A] border border-[#252A3A] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#F4F7FF]">{m.name}</div>
                  <div className="text-[10px] text-[#8992A8]">Sprint Capacity Allocations</div>
                </div>
                <div className="text-right">
                  <div className={`font-mono font-bold ${m.load > 100 ? 'text-[#FF4D6D]' : m.load > 85 ? 'text-[#F5B942]' : 'text-[#18C997]'}`}>
                    {m.load}% {m.alert && <span className="text-[9px] block text-[#FF4D6D]">{m.alert}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Path Flow */}
        <div className="surface-card rounded-2xl p-5 border border-[#252A3A]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#252A3A]">
            <div className="label-tech text-[#8992A8]">CRITICAL PATH</div>
            <button onClick={() => setActiveView('Dependencies')} className="text-[10px] text-[#4F7CFF] hover:underline font-bold">
              Simulator →
            </button>
          </div>

          <div className="space-y-2">
            {[
              { name: 'Database Schema Migration', delay: '⚠ +3 Days (Origin)', level: 'danger' },
              { name: 'Backend API Integration', delay: '⚠ +2 Days Cascade', level: 'warning' },
              { name: 'Frontend Live Stream', delay: '⚠ +2 Days Cascade', level: 'warning' },
              { name: 'Testing & Verification (WCAG)', delay: '⚠ +2 Days Cascade', level: 'warning' },
              { name: 'Production Deployment', delay: '+4 Days Final Impact', level: 'danger' }
            ].map((node, idx) => (
              <div key={idx} className="relative">
                <div className={`p-2 rounded-lg border text-xs flex items-center justify-between ${node.level === 'danger' ? 'bg-[#FF4D6D]/10 border-[#FF4D6D]/30 text-[#FF859B]' : 'bg-[#0D101A] border-[#252A3A] text-[#F4F7FF]'}`}>
                  <span className="font-medium truncate mr-2">{node.name}</span>
                  <span className="text-[10px] font-mono shrink-0">{node.delay}</span>
                </div>
                {idx < 4 && (
                  <div className="text-center text-[#555E73] text-[10px] leading-tight my-0.5">↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* -------------------------------------------------------------
     2. DEVELOPER DASHBOARD: DEVELOPER WORKSPACE
  ------------------------------------------------------------- */
  const renderDeveloperDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#252A3A]">
        <div>
          <div className="label-tech text-[#39D9FF]">DEVELOPER WORKSPACE</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
            DEVELOPER WORKSPACE
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            "Your active sprint tasks, blockers, and dependencies."
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTask(null);
            setIsCreateTaskOpen(true);
          }}
          className="btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 w-fit"
        >
          <span>Report Impediment</span>
        </button>
      </div>

      {/* DEVELOPER SIGNATURE INTELLIGENCE CARD */}
      <div className="surface-card rounded-2xl p-5 border border-[#F5B942]/40 bg-gradient-to-r from-[#131522] to-[#171A2A]">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#252A3A]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#F5B942]/15 border border-[#F5B942]/30 grid place-items-center text-[#F5B942]">
              <AlertTriangle size={15} />
            </div>
            <div>
              <span className="label-tech text-[#F5B942]">TASK AT RISK</span>
              <div className="text-xs text-[#8992A8]">Execution Intelligence Alert</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold font-mono badge-warning">
            ACTION REQUIRED
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="text-base font-bold text-[#F4F7FF]">
            Your Backend API task may miss its deadline.
          </div>
          <div className="text-[#8992A8]">
            <strong className="text-[#F4F7FF]">Reason:</strong> Database migration is delayed.
          </div>
          <div className="text-[#39D9FF]">
            <strong className="text-[#F4F7FF]">Action:</strong> Review dependency.
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#252A3A] flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] text-[#555E73]">Upstream origin: TASK-102 (Database Partition Migration)</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('Dependencies')}
              className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <span>Review Dependency Map</span>
              <ArrowRight size={13} />
            </button>
            <button
              onClick={() => {
                toggleTaskBlocker(118);
                showToast('Blocker status reported for Backend API task', 'warning');
              }}
              className="btn-ghost px-3 py-1.5 rounded-lg text-xs font-bold text-[#FF859B]"
            >
              Report Blocker
            </button>
          </div>
        </div>
      </div>

      {/* Hero: MY ACTIVE TASK */}
      <div className="surface-card rounded-2xl p-6 border border-[#4F7CFF]/40 bg-gradient-to-r from-[#131522] to-[#171A2A]">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-[#252A3A]">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#4F7CFF]/20 border border-[#4F7CFF]/40 text-[#39D9FF] font-mono font-bold text-xs">
              TASK-118
            </span>
            <span className="label-tech text-[#8992A8]">MY ACTIVE FOCUS</span>
          </div>
          <span className="px-2.5 py-0.5 rounded bg-[#FF4D6D]/15 border border-[#FF4D6D]/30 text-[11px] font-mono font-bold text-[#FF859B] flex items-center gap-1">
            <AlertTriangle size={12} />
            ⚠ Dependency Delayed: Database migration is 3 days behind
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-xl font-bold text-[#F4F7FF]">
              Implement Backend API & REST Integration
            </h2>
            <p className="text-xs text-[#8992A8] leading-relaxed">
              Construct high-throughput ingestion bridge for IoT flow meter gateways. Upstream schema partition is lagging, but mock payload testing is recommended.
            </p>
            <div className="flex items-center gap-4 text-xs pt-1">
              <span className="text-[#8992A8]">Due Date: <strong className="text-[#F4F7FF]">20 Sep (2 days left)</strong></span>
              <span className="text-[#8992A8]">Priority: <strong className="text-[#FF4D6D]">Critical</strong></span>
              <span className="text-[#8992A8]">Assigned: <strong className="text-[#39D9FF]">Kabir Singh</strong></span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D101A] border border-[#252A3A] min-w-[220px]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[#8992A8]">Progress</span>
              <span className="font-mono font-bold text-[#F4F7FF]">62%</span>
            </div>
            <div className="w-full h-2 bg-[#131522] rounded-full overflow-hidden border border-[#252A3A]">
              <div className="h-full bg-gradient-to-r from-[#4F7CFF] to-[#39D9FF]" style={{ width: '62%' }} />
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  updateTask(118, { progress: Math.min(100, 62 + 10) });
                  showToast('Task progress incremented to 72%', 'success');
                }}
                className="btn-secondary flex-1 py-1 text-[11px] font-bold"
              >
                +10% Progress
              </button>
              <button
                onClick={() => toggleTaskBlocker(118)}
                className="btn-ghost px-2.5 py-1 text-[11px] font-bold text-[#FF859B]"
              >
                Flag Blocker
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row: My Sprint Tasks & Blockers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 surface-card rounded-2xl p-5 border border-[#252A3A]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#252A3A]">
            <div className="label-tech text-[#8992A8]">MY ASSIGNED SPRINT DELIVERABLES</div>
            <span className="text-xs font-mono text-[#39D9FF]">{myTasks.length} Active Items</span>
          </div>

          <div className="space-y-3">
            {myTasks.map(t => (
              <div key={t.id} className="p-3.5 rounded-xl bg-[#0D101A] border border-[#252A3A] hover:border-[#384158] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-[#8992A8]">TASK-{t.id}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${t.priority === 'Critical' ? 'badge-critical' : 'badge-info'}`}>
                      {t.priority}
                    </span>
                    {t.blocked && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FF4D6D]/20 text-[#FF859B] border border-[#FF4D6D]/30 font-bold">
                        BLOCKED
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-bold text-[#F4F7FF] truncate">{t.title}</h3>
                  <div className="text-[11px] text-[#8992A8] mt-0.5">{t.project}</div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="font-mono text-xs font-bold text-[#F4F7FF]">{t.progress}%</div>
                    <div className="text-[10px] text-[#8992A8]">{t.due}</div>
                  </div>
                  <button
                    onClick={() => moveTaskStatus(t.id, t.status === 'Completed' ? 'In Progress' : 'Completed')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${t.status === 'Completed' ? 'bg-[#18C997]/20 text-[#18C997] border border-[#18C997]/40' : 'btn-secondary'}`}
                  >
                    {t.status === 'Completed' ? 'Done ✓' : 'Mark Done'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upstream Blockers & Sprint Velocity */}
        <div className="space-y-6">
          <div className="surface-card rounded-2xl p-5 border border-[#252A3A]">
            <div className="label-tech text-[#FF4D6D] mb-3">BLOCKERS & DEPENDENCIES</div>
            <div className="p-3 rounded-xl bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-xs text-[#FF859B] space-y-1 mb-3">
              <div className="font-bold flex items-center gap-1.5">
                <AlertOctagon size={14} />
                Database Schema Partition
              </div>
              <p className="text-[11px] text-[#8992A8]">
                Awaiting index rebuild on 14M rows. Ishaan Mantri is primary owner.
              </p>
            </div>
            <button
              onClick={() => setActiveView('Dependencies')}
              className="btn-secondary w-full py-2 rounded-xl text-xs font-bold"
            >
              View Dependency Map →
            </button>
          </div>

          <div className="surface-card rounded-2xl p-5 border border-[#252A3A]">
            <div className="label-tech text-[#8992A8] mb-2">SPRINT PROGRESS</div>
            <div className="text-2xl font-black font-mono text-[#F4F7FF]">68% Target</div>
            <div className="text-xs text-[#8992A8] mt-1">Velocity: 24 story points delivered out of 36.</div>
          </div>
        </div>
      </div>
    </div>
  );

  /* -------------------------------------------------------------
     3. CLIENT DASHBOARD: CLIENT PORTAL
  ------------------------------------------------------------- */
  const renderClientDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#252A3A]">
        <div>
          <div className="label-tech text-[#39D9FF]">CLIENT PORTAL</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
            CLIENT PORTAL & DELIVERY REVIEW
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            "Transparent progress, milestone tracking, and pending approvals."
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge-success px-3 py-1 rounded-lg text-xs font-bold font-mono">
            ● MILESTONES ON SCHEDULE
          </span>
        </div>
      </div>

      {/* CLIENT SIGNATURE DELIVERY UPDATE CARD */}
      <div className="surface-card rounded-2xl p-5 border border-[#39D9FF]/40 bg-gradient-to-r from-[#131522] to-[#171A2A]">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#252A3A]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#39D9FF]/15 border border-[#39D9FF]/30 grid place-items-center text-[#39D9FF]">
              <FileCheck2 size={15} />
            </div>
            <div>
              <span className="label-tech text-[#39D9FF]">DELIVERY UPDATE</span>
              <div className="text-xs text-[#8992A8]">Stakeholder Transparency Dispatch</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold font-mono badge-info">
            TRANSLATED INTELLIGENCE
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="text-base font-bold text-[#F4F7FF]">
            The Data Migration milestone may move by approximately 2 days.
          </div>
          <div className="text-[#8992A8] leading-relaxed">
            Target milestone date adjusted to guarantee full schema verification. All downstream deployment milestones remain on schedule within established project buffers.
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#252A3A] flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] text-[#555E73]">Core Deliverable: Smart Campus 360 · National University Council</span>
          <button
            onClick={() => setActiveView('Timeline')}
            className="btn-secondary px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
          >
            <span>View Milestones & Timeline</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Project Overview Card */}
      <div className="surface-card rounded-2xl p-6 border border-[#252A3A] bg-gradient-to-r from-[#131522] to-[#171A2A]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#252A3A]">
          <div>
            <div className="label-tech text-[#8992A8]">PRIMARY INITIATIVE OVERVIEW</div>
            <h2 className="text-2xl font-black text-[#F4F7FF] mt-1">
              Smart Campus 360 — IoT Telemetry Network
            </h2>
            <p className="text-xs text-[#8992A8] mt-1">
              Client: <strong className="text-[#F4F7FF]">National University Council</strong> · Director: Ishaan Mantri
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black font-mono text-[#18C997]">68%</div>
            <div className="text-[11px] text-[#8992A8] font-bold uppercase tracking-wider">COMPLETED</div>
          </div>
        </div>

        {/* Milestones Stepper */}
        <div className="mt-6">
          <div className="label-tech text-[#8992A8] mb-3">KEY PROJECT MILESTONES</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#0D101A] border border-[#18C997]/40">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#F4F7FF]">01 Foundation & Ingestion</span>
                <CheckCircle2 size={15} className="text-[#18C997]" />
              </div>
              <div className="text-[11px] text-[#18C997] font-semibold">Delivered & Verified ✓</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D101A] border border-[#4F7CFF]/40">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#F4F7FF]">02 Data Migration & REST</span>
                <span className="text-[11px] font-mono font-bold text-[#39D9FF]">68%</span>
              </div>
              <div className="text-[11px] text-[#8992A8]">Active Sprint Verification</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D101A] border border-[#252A3A]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#F4F7FF]">03 Rollout & Campus Launch</span>
                <Clock size={15} className="text-[#555E73]" />
              </div>
              <div className="text-[11px] text-[#8992A8]">Upcoming (Oct 2026)</div>
            </div>
          </div>
        </div>
      </div>

      {/* PENDING YOUR REVIEW: Deliverables & Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="surface-card rounded-2xl p-5 border border-[#252A3A]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#252A3A]">
            <div className="label-tech text-[#F5B942]">PENDING YOUR REVIEW</div>
            <span className="text-xs font-mono text-[#8992A8]">Action Required</span>
          </div>

          <div className="space-y-3">
            {approvals.filter(a => a.status === 'Pending Review').map(app => (
              <div key={app.id} className="p-4 rounded-xl bg-[#0D101A] border border-[#252A3A] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F4F7FF]">{app.deliverable}</span>
                  <span className="badge-warning text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                    Awaiting Review
                  </span>
                </div>
                <div className="text-[11px] text-[#8992A8]">
                  Initiative: {app.project} · Submitted by {app.submittedBy}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => approveDeliverable(app.id)}
                    className="btn-primary flex-1 py-1.5 rounded-lg text-xs font-bold"
                  >
                    Approve Deliverable
                  </button>
                  <button
                    onClick={() => requestChangesDeliverable(app.id, 'Client clarification requested')}
                    className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-semibold"
                  >
                    Request Changes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Change Requests & Client Meetings */}
        <div className="space-y-6">
          <div className="surface-card rounded-2xl p-5 border border-[#252A3A]">
            <div className="label-tech text-[#8992A8] mb-3">ACTIVE CHANGE REQUESTS</div>
            {changeRequests.map(cr => (
              <div key={cr.id} className="p-3 rounded-xl bg-[#0D101A] border border-[#252A3A] mb-2 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#F4F7FF]">{cr.id}: {cr.title}</span>
                  <span className="badge-info text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">
                    {cr.stepLabel}
                  </span>
                </div>
                <p className="text-[11px] text-[#8992A8]">{cr.description}</p>
              </div>
            ))}
          </div>

          <div className="surface-card rounded-2xl p-5 border border-[#252A3A]">
            <div className="label-tech text-[#8992A8] mb-3">UPCOMING CLIENT MEETINGS</div>
            {meetings.slice(0, 2).map(m => (
              <div key={m.id} className="p-3 rounded-xl bg-[#0D101A] border border-[#252A3A] mb-2 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#F4F7FF]">{m.title}</div>
                  <div className="text-[10px] text-[#8992A8]">{m.date}</div>
                </div>
                <span className="text-[10px] font-mono text-[#39D9FF]">Calendar Sync</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* -------------------------------------------------------------
     4. EXECUTIVE DASHBOARD: PORTFOLIO COMMAND CENTER
  ------------------------------------------------------------- */
  const renderExecutiveDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#252A3A]">
        <div>
          <div className="label-tech text-[#39D9FF]">PORTFOLIO COMMAND CENTER</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
            PORTFOLIO COMMAND CENTER
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            "Portfolio health, strategic delivery forecast, and intervention summary."
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#8992A8]">PORTFOLIO HEALTH:</span>
          <span className="badge-success text-sm font-bold font-mono px-3 py-1 rounded-xl">
            78 / 100
          </span>
        </div>
      </div>

      {/* EXECUTIVE SIGNATURE STRATEGIC DELIVERY RISK CARD */}
      <div className="surface-card rounded-2xl p-5 border border-[#FF4D6D]/40 bg-gradient-to-r from-[#131522] to-[#171A2A]">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#252A3A]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FF4D6D]/15 border border-[#FF4D6D]/30 grid place-items-center text-[#FF4D6D]">
              <ShieldAlert size={15} />
            </div>
            <div>
              <span className="label-tech text-[#FF4D6D]">STRATEGIC DELIVERY RISK</span>
              <div className="text-xs text-[#8992A8]">Portfolio Executive Oversight</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold font-mono badge-critical">
            INTERVENTION AVAILABLE
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="text-base font-bold text-[#F4F7FF]">
            Cloud Migration forecast shifted by 4 days.
          </div>
          <div className="text-[#8992A8] leading-relaxed">
            Telemetry initiative schedule slippage threatens Q4 Inter-Ministry SLA delivery. EVM budget metrics remain favorable with Cost Performance Index (CPI) at 1.04.
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#252A3A] flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] text-[#555E73]">Recommended Strategic Intervention: Reallocate 1 Senior Engineer</span>
          <button
            onClick={() => {
              applyRecommendation(1);
              showToast('Strategic Intervention approved: Resource reallocated to Cloud Migration', 'success');
            }}
            className="btn-primary px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
          >
            <span>Approve Strategic Intervention</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* 12 Projects Overview KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="surface-card rounded-2xl p-4 border border-[#252A3A]">
          <div className="label-tech text-[#8992A8]">TOTAL INITIATIVES</div>
          <div className="text-3xl font-black font-mono text-[#F4F7FF] mt-1">12</div>
          <div className="text-[10px] text-[#8992A8] mt-0.5">National Strategic Portfolio</div>
        </div>
        <div className="surface-card rounded-2xl p-4 border border-[#18C997]/30">
          <div className="label-tech text-[#18C997]">ON TRACK</div>
          <div className="text-3xl font-black font-mono text-[#18C997] mt-1">09</div>
          <div className="text-[10px] text-[#18C997] mt-0.5">75% Portfolio Coverage</div>
        </div>
        <div className="surface-card rounded-2xl p-4 border border-[#F5B942]/30">
          <div className="label-tech text-[#F5B942]">AT RISK</div>
          <div className="text-3xl font-black font-mono text-[#F5B942] mt-1">02</div>
          <div className="text-[10px] text-[#F5B942] mt-0.5">Telemetry & Redressal</div>
        </div>
        <div className="surface-card rounded-2xl p-4 border border-[#FF4D6D]/30">
          <div className="label-tech text-[#FF4D6D]">DELAYED</div>
          <div className="text-3xl font-black font-mono text-[#FF4D6D] mt-1">01</div>
          <div className="text-[10px] text-[#FF4D6D] mt-0.5">Database Migration Bottleneck</div>
        </div>
      </div>

      {/* Projects Needing Attention & Strategic Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="surface-card rounded-2xl p-5 border border-[#252A3A]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#252A3A]">
            <div className="label-tech text-[#FF4D6D]">PROJECTS NEEDING ATTENTION</div>
            <span className="text-xs font-mono text-[#8992A8]">Interventions Required</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl bg-[#0D101A] border border-[#FF4D6D]/30">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#F4F7FF] text-sm">Smart Campus 360 Telemetry</span>
                <span className="badge-critical text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                  DELAYED (+4 Days)
                </span>
              </div>
              <p className="text-[#8992A8] text-[11px] mb-2">
                Database schema migration is lagging, shifting Backend API release. Immediate recommendation available.
              </p>
              <button
                onClick={() => applyRecommendation(1)}
                className="btn-primary px-3 py-1.5 rounded-lg text-xs font-bold"
              >
                Approve Engineer Reallocation
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#0D101A] border border-[#F5B942]/30">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#F4F7FF] text-sm">Citizen Service & Civic Portal 2.0</span>
                <span className="badge-warning text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                  AT RISK (66 Health)
                </span>
              </div>
              <p className="text-[#8992A8] text-[11px]">
                NLP router accuracy at 91% with Kafka queue consumer bottleneck. Early QA test recommended.
              </p>
            </div>
          </div>
        </div>

        {/* Portfolio Delivery Outlook & EVM Budget */}
        <div className="surface-card rounded-2xl p-5 border border-[#252A3A]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#252A3A]">
            <div className="label-tech text-[#8992A8]">STRATEGIC FORECAST & FINANCIALS</div>
            <span className="text-xs font-mono text-[#18C997]">CPI: 1.04 · SPI: 0.94</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#0D101A] border border-[#252A3A] flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#8992A8] uppercase">TOTAL PORTFOLIO BUDGET</div>
                <div className="text-2xl font-black font-mono text-[#F4F7FF] mt-0.5">₹43,80,000</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#8992A8] uppercase">COST VARIANCE (CV)</div>
                <div className="text-lg font-bold font-mono text-[#18C997]">+₹1,40,000 (Favorable)</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D101A] border border-[#252A3A] flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#8992A8] uppercase">AVERAGE SPRINT VELOCITY</div>
                <div className="text-2xl font-black font-mono text-[#39D9FF] mt-0.5">94.2%</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#8992A8] uppercase">SCHEDULE SLIP</div>
                <div className="text-lg font-bold font-mono text-[#FF859B]">+2.1 Days Avg</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* -------------------------------------------------------------
     5. ADMIN DASHBOARD: SYSTEM CONTROL
  ------------------------------------------------------------- */
  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#252A3A]">
        <div>
          <div className="label-tech text-[#8992A8]">SYSTEM CONTROL</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
            SYSTEM CONTROL & AUDIT DIRECTORY
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            "Manage users, access permissions, audit logs, and platform configurations."
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge-success text-xs px-3 py-1 rounded-lg font-mono font-bold">
            POSTGRESQL + FASTAPI READY
          </span>
        </div>
      </div>

      {/* ADMIN SIGNATURE RISK ENGINE HEALTH CARD */}
      <div className="surface-card rounded-2xl p-5 border border-[#18C997]/40 bg-gradient-to-r from-[#131522] to-[#171A2A]">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#252A3A]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#18C997]/15 border border-[#18C997]/30 grid place-items-center text-[#18C997]">
              <Cpu size={15} />
            </div>
            <div>
              <span className="label-tech text-[#18C997]">RISK ENGINE</span>
              <div className="text-xs text-[#8992A8]">Continuous ML Inference Service</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold font-mono badge-success">
            OPERATIONAL
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs my-2">
          <div className="p-3 rounded-xl bg-[#0D101A] border border-[#252A3A]">
            <div className="text-[10px] text-[#8992A8]">PREDICTION LATENCY</div>
            <div className="text-2xl font-black font-mono text-[#39D9FF] mt-1">124 ms</div>
          </div>
          <div className="p-3 rounded-xl bg-[#0D101A] border border-[#252A3A]">
            <div className="text-[10px] text-[#8992A8]">ENGINE STATUS</div>
            <div className="text-base font-bold font-mono text-[#18C997] mt-2">Operational.</div>
          </div>
          <div className="p-3 rounded-xl bg-[#0D101A] border border-[#252A3A]">
            <div className="text-[10px] text-[#8992A8]">MICROSERVICE</div>
            <div className="text-base font-bold font-mono text-[#F4F7FF] mt-2">FastAPI / XGBoost</div>
          </div>
          <div className="p-3 rounded-xl bg-[#0D101A] border border-[#252A3A]">
            <div className="text-[10px] text-[#8992A8]">INFERENCE RATE</div>
            <div className="text-2xl font-black font-mono text-[#AE9AFF] mt-1">420 / min</div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#252A3A] flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] text-[#555E73]">Microservice Endpoint: http://localhost:8000/predict · Healthcheck OK</span>
          <button
            onClick={() => setActiveView('Settings')}
            className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-bold"
          >
            Configure ML Risk Scoring Weights →
          </button>
        </div>
      </div>

      {/* System Infrastructure Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="surface-card rounded-2xl p-4 border border-[#252A3A]">
          <div className="label-tech text-[#8992A8]">ACTIVE USERS</div>
          <div className="text-2xl font-black font-mono text-[#F4F7FF] mt-1">28</div>
          <div className="text-[10px] text-[#18C997] mt-0.5">● 5 Active Personas</div>
        </div>
        <div className="surface-card rounded-2xl p-4 border border-[#252A3A]">
          <div className="label-tech text-[#8992A8]">DATABASE LATENCY</div>
          <div className="text-2xl font-black font-mono text-[#18C997] mt-1">4.2 ms</div>
          <div className="text-[10px] text-[#8992A8] mt-0.5">PostgreSQL Pool Online</div>
        </div>
        <div className="surface-card rounded-2xl p-4 border border-[#252A3A]">
          <div className="label-tech text-[#8992A8]">ML ENGINE API</div>
          <div className="text-2xl font-black font-mono text-[#39D9FF] mt-1">28 ms</div>
          <div className="text-[10px] text-[#8992A8] mt-0.5">FastAPI Risk Service</div>
        </div>
        <div className="surface-card rounded-2xl p-4 border border-[#252A3A]">
          <div className="label-tech text-[#8992A8]">AUDIT LOGS</div>
          <div className="text-2xl font-black font-mono text-[#F4F7FF] mt-1">{activity.length}</div>
          <div className="text-[10px] text-[#8992A8] mt-0.5">Immutable Ledger Records</div>
        </div>
      </div>

      {/* User Directory & Permissions Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="surface-card rounded-2xl p-5 border border-[#252A3A]">
          <div className="label-tech text-[#8992A8] mb-3">RBAC ROLES & PERMISSIONS</div>
          <div className="space-y-2 text-xs">
            {[
              { role: 'Manager', users: 3, permissions: 'Manage projects, tasks, dependencies, workload, risks' },
              { role: 'Developer', users: 14, permissions: 'Execute tasks, update progress, report blockers' },
              { role: 'Client', users: 4, permissions: 'View progress, review deliverables, approve changes' },
              { role: 'Executive', users: 4, permissions: 'Portfolio health, strategic forecasts, interventions' },
              { role: 'Admin', users: 3, permissions: 'Users, roles, permissions, audit logs, configuration' }
            ].map((r, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#0D101A] border border-[#252A3A] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#F4F7FF]">{r.role}</span>
                  <p className="text-[11px] text-[#8992A8] mt-0.5">{r.permissions}</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#39D9FF]">{r.users} Users</span>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Logs */}
        <div className="surface-card rounded-2xl p-5 border border-[#252A3A]">
          <div className="label-tech text-[#8992A8] mb-3">SYSTEM AUDIT LEDGER</div>
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 text-xs font-mono">
            {activity.map(act => (
              <div key={act.id} className="p-2.5 rounded-lg bg-[#0D101A] border border-[#252A3A] flex items-start justify-between gap-2">
                <div>
                  <div className="text-[#F4F7FF] font-semibold">{act.text}</div>
                  <div className="text-[10px] text-[#555E73]">{act.user} · {act.category}</div>
                </div>
                <span className="text-[10px] text-[#8992A8] shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-full">
      {roleId === 'manager' && renderManagerDashboard()}
      {roleId === 'dev' && renderDeveloperDashboard()}
      {roleId === 'client' && renderClientDashboard()}
      {roleId === 'exec' && renderExecutiveDashboard()}
      {roleId === 'admin' && renderAdminDashboard()}
    </div>
  );
}
