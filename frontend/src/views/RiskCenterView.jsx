import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Zap,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
  Sparkles,
  TrendingDown,
  Activity,
  Layers,
  HelpCircle,
  Clock
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { calculateLocalRiskScore } from '../services/mlEngine';
import IntelixIntelligenceCard from '../components/IntelixIntelligenceCard';

export default function RiskCenterView() {
  const {
    tasks,
    projects,
    recommendations,
    applyRecommendation,
    setEditingTask,
    setIsCreateTaskOpen,
    showToast
  } = useProject();

  // Selected Risk Item for Deep Dive
  const [selectedRiskId, setSelectedRiskId] = useState(1); // 1 = Backend API / Database migration

  // What-If Sandbox State
  const [sandboxProgress, setSandboxProgress] = useState(42);
  const [sandboxExpected, setSandboxExpected] = useState(75);
  const [sandboxDays, setSandboxDays] = useState(2);
  const [sandboxWorkload, setSandboxWorkload] = useState(92);
  const [sandboxDepRisk, setSandboxDepRisk] = useState(80);
  const [sandboxBlocked, setSandboxBlocked] = useState(true);

  const sandboxAnalysis = useMemo(() => {
    return calculateLocalRiskScore({
      progress: sandboxProgress,
      expectedProgress: sandboxExpected,
      daysRemaining: sandboxDays,
      dependencyRisk: sandboxDepRisk,
      workload: sandboxWorkload,
      blocked: sandboxBlocked
    });
  }, [sandboxProgress, sandboxExpected, sandboxDays, sandboxWorkload, sandboxDepRisk, sandboxBlocked]);

  const criticalRisks = useMemo(() => tasks.filter(t => t.risk >= 65 || t.blocked), [tasks]);
  const mediumRisks = useMemo(() => tasks.filter(t => t.risk >= 40 && t.risk < 65 && !t.blocked), [tasks]);
  const lowRisks = useMemo(() => tasks.filter(t => t.risk < 40 && !t.blocked), [tasks]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#252A3A]">
        <div>
          <div className="label-tech text-[#FF4D6D]">RISK CENTER & INTELLIGENCE</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
            RISK CENTER & INTELLIGENCE
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            "Understand emerging delivery risks before they become delays."
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg badge-critical text-xs font-mono font-bold w-fit">
          <span className="w-2 h-2 rounded-full bg-[#FF4D6D] animate-ping" />
          <span>{criticalRisks.length} CRITICAL RISKS DETECTED</span>
        </div>
      </div>

      {/* 3 Signature Risk Level Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* High Risk */}
        <div className="surface-card rounded-2xl p-5 border border-[#FF4D6D]/40 bg-gradient-to-b from-[#131522] to-[#171A2A]">
          <div className="flex items-center justify-between mb-2">
            <span className="label-tech text-[#FF4D6D]">HIGH RISK</span>
            <span className="text-xl font-black font-mono text-[#FF4D6D]">87 / 100</span>
          </div>
          <h3 className="text-sm font-bold text-[#F4F7FF]">Backend API delay</h3>
          <div className="text-xs text-[#8992A8] mt-2 space-y-1">
            <div>Expected impact: <strong className="text-[#FF859B]">+4 days</strong></div>
            <div>Confidence: <strong className="text-[#F4F7FF]">91%</strong></div>
          </div>
          <button
            onClick={() => {
              setSelectedRiskId(1);
              showToast('Deep-dive analysis loaded below', 'info');
            }}
            className="btn-primary w-full mt-4 py-1.5 rounded-xl text-xs font-bold"
          >
            View Analysis
          </button>
        </div>

        {/* Medium Risk */}
        <div className="surface-card rounded-2xl p-5 border border-[#F5B942]/40 bg-[#131522]">
          <div className="flex items-center justify-between mb-2">
            <span className="label-tech text-[#F5B942]">MEDIUM RISK</span>
            <span className="text-xl font-black font-mono text-[#F5B942]">54 / 100</span>
          </div>
          <h3 className="text-sm font-bold text-[#F4F7FF]">QA & Accessibility bottleneck</h3>
          <div className="text-xs text-[#8992A8] mt-2 space-y-1">
            <div>Expected impact: <strong className="text-[#F8CB6E]">+2 days</strong></div>
            <div>Confidence: <strong className="text-[#F4F7FF]">84%</strong></div>
          </div>
          <button
            onClick={() => {
              setSelectedRiskId(2);
              showToast('Loaded QA bottleneck analysis', 'info');
            }}
            className="btn-secondary w-full mt-4 py-1.5 rounded-xl text-xs font-semibold"
          >
            View Analysis
          </button>
        </div>

        {/* Low Risk */}
        <div className="surface-card rounded-2xl p-5 border border-[#18C997]/40 bg-[#131522]">
          <div className="flex items-center justify-between mb-2">
            <span className="label-tech text-[#18C997]">LOW RISK</span>
            <span className="text-xl font-black font-mono text-[#18C997]">22 / 100</span>
          </div>
          <h3 className="text-sm font-bold text-[#F4F7FF]">Mobile Responsive Ingestion</h3>
          <div className="text-xs text-[#8992A8] mt-2 space-y-1">
            <div>Expected impact: <strong className="text-[#18C997]">0 days (On Track)</strong></div>
            <div>No immediate intervention required.</div>
          </div>
          <button
            disabled
            className="btn-ghost w-full mt-4 py-1.5 rounded-xl text-xs font-semibold opacity-50 cursor-not-allowed"
          >
            Healthy Velocity
          </button>
        </div>
      </div>

      {/* SIGNATURE RISK ANALYSIS DEEP DIVE (NEVER SHOW UNEXPLAINED SCORE) */}
      <div className="surface-card rounded-2xl p-6 sm:p-8 border border-[#FF4D6D]/30 bg-[#131522]">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-[#252A3A]">
          <div>
            <div className="label-tech text-[#FF4D6D]">DEEP-DIVE PREDICTIVE DIAGNOSTIC</div>
            <h2 className="text-xl sm:text-2xl font-black text-[#F4F7FF] mt-1">
              87 / 100 · HIGH RISK ANALYSIS
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div>Predicted completion: <strong className="text-[#F4F7FF]">28 Sep 2026</strong></div>
            <div>Expected delay: <strong className="text-[#FF4D6D]">+4 days</strong></div>
            <div>Confidence: <strong className="text-[#39D9FF]">91%</strong></div>
          </div>
        </div>

        {/* Risk Contributors (Progress, Deadline, Dependency, Workload, Blocker) */}
        <div className="mb-8">
          <div className="label-tech text-[#8992A8] mb-3">WHY? (RISK CONTRIBUTORS BREAKDOWN)</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-[#0D101A] border border-[#252A3A]">
              <div className="text-[10px] font-mono text-[#8992A8] uppercase">PROGRESS RISK</div>
              <div className="text-2xl font-black font-mono text-[#FF4D6D] mt-1">30%</div>
              <div className="text-[10px] text-[#8992A8] mt-0.5">33% Progress Gap</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0D101A] border border-[#252A3A]">
              <div className="text-[10px] font-mono text-[#8992A8] uppercase">DEADLINE RISK</div>
              <div className="text-2xl font-black font-mono text-[#F5B942] mt-1">25%</div>
              <div className="text-[10px] text-[#8992A8] mt-0.5">2 Days Remaining</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0D101A] border border-[#252A3A]">
              <div className="text-[10px] font-mono text-[#8992A8] uppercase">DEPENDENCY RISK</div>
              <div className="text-2xl font-black font-mono text-[#FF859B] mt-1">20%</div>
              <div className="text-[10px] text-[#8992A8] mt-0.5">Upstream Latency</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0D101A] border border-[#252A3A]">
              <div className="text-[10px] font-mono text-[#8992A8] uppercase">WORKLOAD RISK</div>
              <div className="text-2xl font-black font-mono text-[#7C5CFF] mt-1">15%</div>
              <div className="text-[10px] text-[#8992A8] mt-0.5">Engineer @ 92%</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0D101A] border border-[#252A3A] col-span-2 sm:col-span-1">
              <div className="text-[10px] font-mono text-[#8992A8] uppercase">BLOCKER RISK</div>
              <div className="text-2xl font-black font-mono text-[#39D9FF] mt-1">10%</div>
              <div className="text-[10px] text-[#8992A8] mt-0.5">Schema Contention</div>
            </div>
          </div>
        </div>

        {/* Root Cause & Dependency Propagation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 rounded-xl bg-[#0D101A] border border-[#252A3A]">
            <div className="label-tech text-[#FF4D6D] mb-1.5">ROOT CAUSE</div>
            <p className="text-sm font-bold text-[#F4F7FF]">
              Database schema migration is 3 days behind expected progress.
            </p>
            <p className="text-xs text-[#8992A8] mt-2 leading-relaxed">
              Partition indexing on the 14M row telemetry event store encountered high write locking, preventing the backend engineering pair from running live database fixtures.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0D101A] border border-[#252A3A]">
            <div className="label-tech text-[#39D9FF] mb-1.5">DEPENDENCY PROPAGATION</div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono pt-1">
              <span className="px-2 py-1 rounded bg-[#FF4D6D]/20 text-[#FF859B] border border-[#FF4D6D]/40 font-bold">
                Database (3d)
              </span>
              <span className="text-[#555E73]">↓</span>
              <span className="px-2 py-1 rounded bg-[#F5B942]/20 text-[#F8CB6E] border border-[#F5B942]/40 font-bold">
                Backend API ⚠
              </span>
              <span className="text-[#555E73]">↓</span>
              <span className="px-2 py-1 rounded bg-[#131522] text-[#8992A8] border border-[#252A3A]">
                Frontend ⚠
              </span>
              <span className="text-[#555E73]">↓</span>
              <span className="px-2 py-1 rounded bg-[#131522] text-[#8992A8] border border-[#252A3A]">
                Testing ⚠
              </span>
              <span className="text-[#555E73]">↓</span>
              <span className="px-2 py-1 rounded bg-[#131522] text-[#8992A8] border border-[#252A3A]">
                Deployment ⚠
              </span>
            </div>
          </div>
        </div>

        {/* Recommended Action */}
        <div className="p-5 rounded-xl bg-[#171A2A] border border-[#7C5CFF]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="label-tech text-[#39D9FF] flex items-center gap-1.5 mb-1">
              <Zap size={15} className="text-[#7C5CFF]" />
              RECOMMENDED ACTION
            </div>
            <h3 className="text-sm font-bold text-[#F4F7FF]">
              Move one backend engineer to database migration task.
            </h3>
            <p className="text-xs text-[#8992A8] mt-0.5">
              Reallocating Sana Khan (65% capacity) clears the index lock in 14 hours and protects the 24 Sep release.
            </p>
          </div>

          <button
            onClick={() => applyRecommendation(1)}
            className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5"
          >
            <span>Apply Recommendation</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* WHAT-IF RISK SANDBOX */}
      <div className="surface-card rounded-2xl p-6 border border-[#252A3A]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#39D9FF]/15 text-[#39D9FF] grid place-items-center">
            <SlidersHorizontal size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F4F7FF]">WHAT-IF SCENARIO SANDBOX</h3>
            <p className="text-xs text-[#8992A8]">Tweak project parameters in real time to calculate resulting ML schedule risk.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-[#8992A8] mb-1">
                <span>Current Progress:</span>
                <span className="font-mono text-[#F4F7FF]">{sandboxProgress}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={sandboxProgress}
                onChange={(e) => setSandboxProgress(+e.target.value)}
                className="w-full accent-[#4F7CFF]"
              />
            </div>

            <div>
              <div className="flex justify-between text-[#8992A8] mb-1">
                <span>Days Remaining:</span>
                <span className="font-mono text-[#F4F7FF]">{sandboxDays} Days</span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                value={sandboxDays}
                onChange={(e) => setSandboxDays(+e.target.value)}
                className="w-full accent-[#4F7CFF]"
              />
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-[#8992A8] mb-1">
                <span>Assignee Workload:</span>
                <span className="font-mono text-[#F4F7FF]">{sandboxWorkload}%</span>
              </div>
              <input
                type="range"
                min={40}
                max={140}
                value={sandboxWorkload}
                onChange={(e) => setSandboxWorkload(+e.target.value)}
                className="w-full accent-[#4F7CFF]"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-2 text-[#8992A8]">
              <input
                type="checkbox"
                checked={sandboxBlocked}
                onChange={(e) => setSandboxBlocked(e.target.checked)}
              />
              <span className="font-semibold text-[#F4F7FF]">Active Blocker Present (+20 Pts)</span>
            </label>
          </div>

          {/* Sandbox Computed Score */}
          <div className="p-4 rounded-xl bg-[#0D101A] border border-[#252A3A] flex flex-col justify-center text-center">
            <div className="text-[10px] text-[#8992A8] uppercase font-mono">CALCULATED RISK SCORE</div>
            <div className={`text-4xl font-black font-mono mt-1 ${sandboxAnalysis.score >= 65 ? 'text-[#FF4D6D]' : sandboxAnalysis.score >= 40 ? 'text-[#F5B942]' : 'text-[#18C997]'}`}>
              {sandboxAnalysis.score} <span className="text-sm text-[#8992A8]">/ 100</span>
            </div>
            <div className="text-xs font-bold text-[#F4F7FF] mt-1">{sandboxAnalysis.level} RISK LEVEL</div>
          </div>
        </div>
      </div>
    </div>
  );
}
